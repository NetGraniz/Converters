(function () {
  const fileInput = document.querySelector("#fileInput");
  const dropzone = document.querySelector("#dropzone");
  const fileList = document.querySelector("#fileList");
  const template = document.querySelector("#fileRowTemplate");
  const convertButton = document.querySelector("#convertButton");
  const zipButton = document.querySelector("#zipButton");
  const clearButton = document.querySelector("#clearButton");
  const fileCount = document.querySelector("#fileCount");
  const doneCount = document.querySelector("#doneCount");
  const progressBar = document.querySelector("#progressBar");
  const sidebar = document.querySelector("#sidebar");
  const overlay = document.querySelector("#overlay");
  const menuButton = document.querySelector("#menuButton");
  const navButtons = document.querySelectorAll("[data-view]");
  const viewPanels = document.querySelectorAll("[data-view-panel]");

  const state = {
    items: [],
    isConverting: false
  };

  function formatBytes(bytes) {
    if (!bytes) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const power = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${(bytes / 1024 ** power).toFixed(power ? 1 : 0)} ${units[power]}`;
  }

  function openSidebar() {
    sidebar.classList.add("is-open");
    document.body.classList.add("sidebar-open");
    overlay.hidden = false;
  }

  function closeSidebar() {
    sidebar.classList.remove("is-open");
    document.body.classList.remove("sidebar-open");
    overlay.hidden = true;
  }

  function showView(viewName) {
    viewPanels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.viewPanel === viewName);
    });

    document.querySelectorAll(".converter-nav .nav-item").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.view === viewName);
    });

    closeSidebar();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function pngName(name) {
    return name.replace(/\.webp$/i, "") + ".png";
  }

  function uniqueName(baseName) {
    const used = new Set(state.items.map((item) => item.outputName));
    if (!used.has(baseName)) return baseName;

    const dot = baseName.lastIndexOf(".");
    const stem = dot === -1 ? baseName : baseName.slice(0, dot);
    const ext = dot === -1 ? "" : baseName.slice(dot);
    let index = 2;
    let candidate = `${stem}-${index}${ext}`;

    while (used.has(candidate)) {
      index += 1;
      candidate = `${stem}-${index}${ext}`;
    }

    return candidate;
  }

  function updateStats() {
    const ready = state.items.filter((item) => item.blob).length;
    fileCount.textContent = state.items.length;
    doneCount.textContent = ready;
    convertButton.disabled = !state.items.length || state.isConverting;
    zipButton.disabled = !ready || state.isConverting;
    progressBar.style.width = state.items.length ? `${Math.round((ready / state.items.length) * 100)}%` : "0";
  }

  function setRowStatus(item, status, isError) {
    item.status.textContent = status;
    item.row.classList.toggle("is-error", Boolean(isError));
  }

  function addFiles(files) {
    const webpFiles = Array.from(files).filter((file) => {
      return file.type === "image/webp" || /\.webp$/i.test(file.name);
    });

    for (const file of webpFiles) {
      const row = template.content.firstElementChild.cloneNode(true);
      const thumb = row.querySelector(".thumb");
      const name = row.querySelector(".file-name");
      const status = row.querySelector(".file-status");
      const downloadButton = row.querySelector(".download-one");
      const objectUrl = URL.createObjectURL(file);

      thumb.style.backgroundImage = `url("${objectUrl}")`;
      name.textContent = file.name;
      status.textContent = `${formatBytes(file.size)} · ожидает`;

      const item = {
        file,
        row,
        status,
        downloadButton,
        objectUrl,
        blob: null,
        outputName: uniqueName(pngName(file.name))
      };

      downloadButton.addEventListener("click", () => {
        if (item.blob) downloadBlob(item.blob, item.outputName);
      });

      state.items.push(item);
      fileList.append(row);
    }

    updateStats();
  }

  function resetAll() {
    for (const item of state.items) {
      URL.revokeObjectURL(item.objectUrl);
    }
    state.items = [];
    fileList.textContent = "";
    fileInput.value = "";
    updateStats();
  }

  async function convertItem(item) {
    setRowStatus(item, "конвертация...", false);
    const bitmap = await createImageBitmap(item.file);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext("2d");
    context.drawImage(bitmap, 0, 0);
    const width = bitmap.width;
    const height = bitmap.height;
    bitmap.close();

    item.blob = await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas не смог создать PNG"));
      }, "image/png");
    });

    item.downloadButton.disabled = false;
    setRowStatus(item, `${width}×${height} · PNG ${formatBytes(item.blob.size)}`, false);
  }

  async function convertAll() {
    state.isConverting = true;
    updateStats();

    for (const item of state.items) {
      if (item.blob) continue;
      try {
        await convertItem(item);
      } catch (error) {
        setRowStatus(item, "не удалось прочитать WebP", true);
        console.error(error);
      }
      updateStats();
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    state.isConverting = false;
    updateStats();
  }

  function downloadBlob(blob, name) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function downloadZip() {
    const files = state.items
      .filter((item) => item.blob)
      .map((item) => ({ name: item.outputName, blob: item.blob }));

    if (!files.length) return;
    zipButton.disabled = true;
    zipButton.textContent = "Упаковка...";

    try {
      const zipBlob = await createZip(files);
      downloadBlob(zipBlob, "webp-to-png.zip");
    } finally {
      zipButton.textContent = "Скачать ZIP";
      updateStats();
    }
  }

  function crc32(bytes) {
    let crc = -1;
    for (let index = 0; index < bytes.length; index += 1) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[index]) & 0xff];
    }
    return (crc ^ -1) >>> 0;
  }

  function writeUint16(bytes, value) {
    bytes.push(value & 0xff, (value >>> 8) & 0xff);
  }

  function writeUint32(bytes, value) {
    bytes.push(value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff);
  }

  function bytesPart(bytes) {
    return new Uint8Array(bytes);
  }

  function dosTime(date) {
    return (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  }

  function dosDate(date) {
    return ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  }

  async function createZip(files) {
    const parts = [];
    const centralParts = [];
    const encoder = new TextEncoder();
    const now = new Date();
    const fileTime = dosTime(now);
    const fileDate = dosDate(now);
    let offset = 0;

    for (const file of files) {
      const data = new Uint8Array(await file.blob.arrayBuffer());
      const nameBytes = encoder.encode(file.name);
      const crc = crc32(data);

      const local = [];
      writeUint32(local, 0x04034b50);
      writeUint16(local, 20);
      writeUint16(local, 0x0800);
      writeUint16(local, 0);
      writeUint16(local, fileTime);
      writeUint16(local, fileDate);
      writeUint32(local, crc);
      writeUint32(local, data.length);
      writeUint32(local, data.length);
      writeUint16(local, nameBytes.length);
      writeUint16(local, 0);
      local.push(...nameBytes);

      const header = [];
      writeUint32(header, 0x02014b50);
      writeUint16(header, 20);
      writeUint16(header, 20);
      writeUint16(header, 0x0800);
      writeUint16(header, 0);
      writeUint16(header, fileTime);
      writeUint16(header, fileDate);
      writeUint32(header, crc);
      writeUint32(header, data.length);
      writeUint32(header, data.length);
      writeUint16(header, nameBytes.length);
      writeUint16(header, 0);
      writeUint16(header, 0);
      writeUint16(header, 0);
      writeUint16(header, 0);
      writeUint32(header, 0);
      writeUint32(header, offset);
      header.push(...nameBytes);

      const localPart = bytesPart(local);
      parts.push(localPart, data);
      centralParts.push(bytesPart(header));
      offset += localPart.length + data.length;
    }

    const centralOffset = offset;
    let centralSize = 0;
    for (const part of centralParts) {
      parts.push(part);
      centralSize += part.length;
    }

    const end = [];
    writeUint32(end, 0x06054b50);
    writeUint16(end, 0);
    writeUint16(end, 0);
    writeUint16(end, files.length);
    writeUint16(end, files.length);
    writeUint32(end, centralSize);
    writeUint32(end, centralOffset);
    writeUint16(end, 0);
    parts.push(bytesPart(end));

    return new Blob(parts, { type: "application/zip" });
  }

  const crcTable = Array.from({ length: 256 }, (_, index) => {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    return value >>> 0;
  });

  fileInput.addEventListener("change", () => addFiles(fileInput.files));
  convertButton.addEventListener("click", convertAll);
  zipButton.addEventListener("click", downloadZip);
  clearButton.addEventListener("click", resetAll);
  menuButton.addEventListener("click", openSidebar);
  overlay.addEventListener("click", closeSidebar);

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!button.disabled && button.dataset.view) {
        showView(button.dataset.view);
      }
    });
  });

  for (const eventName of ["dragenter", "dragover"]) {
    dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropzone.classList.add("is-dragging");
    });
  }

  for (const eventName of ["dragleave", "drop"]) {
    dropzone.addEventListener(eventName, () => {
      dropzone.classList.remove("is-dragging");
    });
  }

  dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    addFiles(event.dataTransfer.files);
  });

  updateStats();
})();
