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
  const outputFormat = document.querySelector("#outputFormat");
  const outputQuality = document.querySelector("#outputQuality");
  const sidebar = document.querySelector("#sidebar");
  const overlay = document.querySelector("#overlay");
  const menuButton = document.querySelector("#menuButton");
  const navButtons = document.querySelectorAll("[data-view]");
  const viewPanels = document.querySelectorAll("[data-view-panel]");
  const compressFileInput = document.querySelector("#compressFileInput");
  const compressDropzone = document.querySelector("#compressDropzone");
  const compressFileList = document.querySelector("#compressFileList");
  const compressTemplate = document.querySelector("#compressRowTemplate");
  const compressButton = document.querySelector("#compressButton");
  const compressZipButton = document.querySelector("#compressZipButton");
  const compressClearButton = document.querySelector("#compressClearButton");
  const compressFileCount = document.querySelector("#compressFileCount");
  const compressDoneCount = document.querySelector("#compressDoneCount");
  const compressProgressBar = document.querySelector("#compressProgressBar");
  const modeInputs = document.querySelectorAll("input[name='compressMode']");
  const targetSizeKb = document.querySelector("#targetSizeKb");
  const targetFormat = document.querySelector("#targetFormat");
  const targetWidth = document.querySelector("#targetWidth");
  const targetHeight = document.querySelector("#targetHeight");
  const resizeFormat = document.querySelector("#resizeFormat");
  const resizeQuality = document.querySelector("#resizeQuality");
  const unitCategory = document.querySelector("#unitCategory");
  const unitInput = document.querySelector("#unitInput");
  const unitFrom = document.querySelector("#unitFrom");
  const unitTo = document.querySelector("#unitTo");
  const unitResult = document.querySelector("#unitResult");
  const unitMessage = document.querySelector("#unitMessage");
  const unitFormula = document.querySelector("#unitFormula");
  const swapUnitsButton = document.querySelector("#swapUnitsButton");
  const copyUnitButton = document.querySelector("#copyUnitButton");
  const clearUnitButton = document.querySelector("#clearUnitButton");
  const unitCloseButton = document.querySelector("#unitCloseButton");

  const state = {
    items: [],
    isConverting: false
  };

  const compressState = {
    items: [],
    isConverting: false
  };

  const unitCategories = {
    length: {
      label: "Длина",
      units: [
        { id: "mm", label: "миллиметр", symbol: "мм", factor: 0.001 },
        { id: "cm", label: "сантиметр", symbol: "см", factor: 0.01 },
        { id: "m", label: "метр", symbol: "м", factor: 1 },
        { id: "km", label: "километр", symbol: "км", factor: 1000 },
        { id: "in", label: "дюйм", symbol: "дюйм", factor: 0.0254 },
        { id: "ft", label: "фут", symbol: "фт", factor: 0.3048 },
        { id: "yd", label: "ярд", symbol: "ярд", factor: 0.9144 },
        { id: "mi", label: "миля", symbol: "миля", factor: 1609.344 }
      ]
    },
    mass: {
      label: "Масса",
      units: [
        { id: "mg", label: "миллиграмм", symbol: "мг", factor: 0.000001 },
        { id: "g", label: "грамм", symbol: "г", factor: 0.001 },
        { id: "kg", label: "килограмм", symbol: "кг", factor: 1 },
        { id: "t", label: "тонна", symbol: "т", factor: 1000 },
        { id: "oz", label: "унция", symbol: "унц.", factor: 0.028349523125 },
        { id: "lb", label: "фунт", symbol: "фунт", factor: 0.45359237 }
      ]
    },
    temperature: {
      label: "Температура",
      temperature: true,
      units: [
        { id: "c", label: "Цельсий", symbol: "°C", toBase: (value) => value, fromBase: (value) => value },
        { id: "f", label: "Фаренгейт", symbol: "°F", toBase: (value) => (value - 32) * 5 / 9, fromBase: (value) => value * 9 / 5 + 32 },
        { id: "k", label: "Кельвин", symbol: "K", toBase: (value) => value - 273.15, fromBase: (value) => value + 273.15 }
      ]
    },
    area: {
      label: "Площадь",
      units: [
        { id: "mm2", label: "квадратный миллиметр", symbol: "мм²", factor: 0.000001 },
        { id: "cm2", label: "квадратный сантиметр", symbol: "см²", factor: 0.0001 },
        { id: "m2", label: "квадратный метр", symbol: "м²", factor: 1 },
        { id: "km2", label: "квадратный километр", symbol: "км²", factor: 1000000 },
        { id: "ha", label: "гектар", symbol: "га", factor: 10000 },
        { id: "acre", label: "акр", symbol: "акр", factor: 4046.8564224 },
        { id: "ft2", label: "квадратный фут", symbol: "фт²", factor: 0.09290304 },
        { id: "mi2", label: "квадратная миля", symbol: "миля²", factor: 2589988.110336 }
      ]
    },
    volume: {
      label: "Объём",
      units: [
        { id: "ml", label: "миллилитр", symbol: "мл", factor: 0.000001 },
        { id: "l", label: "литр", symbol: "л", factor: 0.001 },
        { id: "m3", label: "кубический метр", symbol: "м³", factor: 1 },
        { id: "cm3", label: "кубический сантиметр", symbol: "см³", factor: 0.000001 },
        { id: "gal-us", label: "галлон США", symbol: "gal US", factor: 0.003785411784 },
        { id: "pt-us", label: "пинта США", symbol: "pt US", factor: 0.000473176473 },
        { id: "floz-us", label: "жидкая унция США", symbol: "fl oz US", factor: 0.0000295735295625 }
      ]
    },
    speed: {
      label: "Скорость",
      units: [
        { id: "mps", label: "метр в секунду", symbol: "м/с", factor: 1 },
        { id: "kmh", label: "километр в час", symbol: "км/ч", factor: 1 / 3.6 },
        { id: "mph", label: "миля в час", symbol: "mph", factor: 0.44704 },
        { id: "fps", label: "фут в секунду", symbol: "фт/с", factor: 0.3048 },
        { id: "kn", label: "узел", symbol: "уз", factor: 0.514444444444 }
      ]
    },
    time: {
      label: "Время",
      units: [
        { id: "ms", label: "миллисекунда", symbol: "мс", factor: 0.001 },
        { id: "s", label: "секунда", symbol: "с", factor: 1 },
        { id: "min", label: "минута", symbol: "мин", factor: 60 },
        { id: "h", label: "час", symbol: "ч", factor: 3600 },
        { id: "d", label: "день", symbol: "день", factor: 86400 },
        { id: "wk", label: "неделя", symbol: "нед.", factor: 604800 },
        { id: "mo", label: "месяц", symbol: "мес.", factor: 2592000 },
        { id: "yr", label: "год", symbol: "год", factor: 31536000 }
      ]
    },
    digital: {
      label: "Цифровые данные",
      units: [
        { id: "bit", label: "бит", symbol: "bit", factor: 0.125 },
        { id: "b", label: "байт", symbol: "B", factor: 1 },
        { id: "kb", label: "килобайт", symbol: "KB", factor: 1000 },
        { id: "mb", label: "мегабайт", symbol: "MB", factor: 1000 ** 2 },
        { id: "gb", label: "гигабайт", symbol: "GB", factor: 1000 ** 3 },
        { id: "tb", label: "терабайт", symbol: "TB", factor: 1000 ** 4 },
        { id: "kib", label: "кибибайт", symbol: "KiB", factor: 1024 },
        { id: "mib", label: "мебибайт", symbol: "MiB", factor: 1024 ** 2 },
        { id: "gib", label: "гибибайт", symbol: "GiB", factor: 1024 ** 3 },
        { id: "tib", label: "тебибайт", symbol: "TiB", factor: 1024 ** 4 }
      ]
    },
    energy: {
      label: "Энергия",
      units: [
        { id: "j", label: "джоуль", symbol: "Дж", factor: 1 },
        { id: "kj", label: "килоджоуль", symbol: "кДж", factor: 1000 },
        { id: "cal", label: "калория", symbol: "кал", factor: 4.184 },
        { id: "kcal", label: "килокалория", symbol: "ккал", factor: 4184 },
        { id: "wh", label: "ватт-час", symbol: "Вт·ч", factor: 3600 },
        { id: "kwh", label: "киловатт-час", symbol: "кВт·ч", factor: 3600000 }
      ]
    },
    pressure: {
      label: "Давление",
      units: [
        { id: "pa", label: "паскаль", symbol: "Па", factor: 1 },
        { id: "kpa", label: "килопаскаль", symbol: "кПа", factor: 1000 },
        { id: "bar", label: "бар", symbol: "бар", factor: 100000 },
        { id: "mbar", label: "миллибар", symbol: "мбар", factor: 100 },
        { id: "atm", label: "атмосфера", symbol: "атм", factor: 101325 },
        { id: "mmhg", label: "мм рт. ст.", symbol: "мм рт. ст.", factor: 133.3223684211 },
        { id: "psi", label: "PSI", symbol: "PSI", factor: 6894.757293168 }
      ]
    }
  };

  function formatBytes(bytes) {
    if (!bytes) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const power = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${(bytes / 1024 ** power).toFixed(power ? 1 : 0)} ${units[power]}`;
  }

  // Keeps up to 10 significant digits while removing visual noise from trailing zeroes.
  function formatUnitNumber(value) {
    if (!Number.isFinite(value)) return "";
    if (value === 0) return "0";
    const absolute = Math.abs(value);
    const raw = absolute >= 1e10 || absolute < 1e-6
      ? value.toExponential(9)
      : value.toPrecision(10);
    return raw
      .replace(/(\.\d*?[1-9])0+(e.*)?$/i, "$1$2")
      .replace(/\.0+(e.*)?$/i, "$1")
      .replace(/\.0+$/, "");
  }

  function parseUnitValue(value) {
    const normalized = value.trim().replace(",", ".");
    if (!normalized) return null;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : Number.NaN;
  }

  function fillUnitSelect(select, units) {
    select.textContent = "";
    for (const unit of units) {
      const option = document.createElement("option");
      option.value = unit.id;
      option.textContent = unit.label;
      select.append(option);
    }
  }

  function currentUnitCategory() {
    return unitCategories[unitCategory.value];
  }

  function findUnit(category, id) {
    return category.units.find((unit) => unit.id === id);
  }

  function updateUnitOptions() {
    const category = currentUnitCategory();
    fillUnitSelect(unitFrom, category.units);
    fillUnitSelect(unitTo, category.units);
    unitTo.selectedIndex = category.units.length > 1 ? 1 : 0;
    updateUnitFormula();
    convertUnits();
  }

  function convertUnits() {
    const parsed = parseUnitValue(unitInput.value);
    unitMessage.textContent = "";

    if (parsed === null) {
      unitResult.value = "";
      updateUnitFormula();
      return;
    }
    if (Number.isNaN(parsed)) {
      unitResult.value = "";
      unitMessage.textContent = "Введите корректное число";
      updateUnitFormula();
      return;
    }

    const category = currentUnitCategory();
    const from = findUnit(category, unitFrom.value);
    const to = findUnit(category, unitTo.value);
    if (!from || !to) return;

    // Temperature needs functions because offsets make simple coefficients incorrect.
    const baseValue = category.temperature ? from.toBase(parsed) : parsed * from.factor;
    const result = category.temperature ? to.fromBase(baseValue) : baseValue / to.factor;

    unitResult.value = Number.isFinite(result) ? formatUnitNumber(result) : "";
    updateUnitFormula();
  }

  function updateUnitFormula() {
    const category = currentUnitCategory();
    if (!category) return;
    const from = findUnit(category, unitFrom.value);
    const to = findUnit(category, unitTo.value);
    if (!from || !to) {
      unitFormula.textContent = "";
      return;
    }

    if (category.temperature) {
      const formulas = {
        "c-f": "°F = °C × 9/5 + 32",
        "f-c": "°C = (°F − 32) × 5/9",
        "c-k": "K = °C + 273.15",
        "k-c": "°C = K − 273.15",
        "f-k": "K = (°F − 32) × 5/9 + 273.15",
        "k-f": "°F = (K − 273.15) × 9/5 + 32"
      };
      unitFormula.textContent = formulas[`${from.id}-${to.id}`] || `1 ${from.symbol} = 1 ${to.symbol}`;
      return;
    }

    // Digital units mix decimal KB/MB/GB/TB and binary KiB/MiB/GiB/TiB factors.
    unitFormula.textContent = `1 ${from.symbol} = ${formatUnitNumber(from.factor / to.factor)} ${to.symbol}`;
  }

  function initializeUnitConverter() {
    unitCategory.textContent = "";
    for (const [id, category] of Object.entries(unitCategories)) {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = category.label;
      unitCategory.append(option);
    }
    updateUnitOptions();
  }

  function swapUnits() {
    const previousFrom = unitFrom.value;
    unitFrom.value = unitTo.value;
    unitTo.value = previousFrom;
    convertUnits();
  }

  async function copyUnitResult() {
    if (!unitResult.value) return;
    try {
      await navigator.clipboard.writeText(unitResult.value);
      unitMessage.textContent = "Результат скопирован";
    } catch (error) {
      unitMessage.textContent = "Не удалось скопировать результат";
    }
  }

  function clearUnitConverter() {
    unitInput.value = "";
    unitResult.value = "";
    unitMessage.textContent = "";
    updateUnitFormula();
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

  function convertedName(name, type) {
    return name.replace(/\.[^.]+$/, "") + extensionForType(type);
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

  function extensionForType(type) {
    if (type === "image/webp") return ".webp";
    if (type === "image/png") return ".png";
    return ".jpg";
  }

  function outputName(name, type, usedNames) {
    const clean = name.replace(/\.[^.]+$/, "");
    const baseName = clean + extensionForType(type);
    if (!usedNames.has(baseName)) {
      usedNames.add(baseName);
      return baseName;
    }

    let index = 2;
    let candidate = `${clean}-${index}${extensionForType(type)}`;
    while (usedNames.has(candidate)) {
      index += 1;
      candidate = `${clean}-${index}${extensionForType(type)}`;
    }
    usedNames.add(candidate);
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
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));
    const usedNames = new Set(state.items.map((item) => item.outputName));

    for (const file of imageFiles) {
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
        outputName: outputName(file.name, outputFormat.value, usedNames)
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
    const type = outputFormat.value;
    const fillWhite = type === "image/jpeg";
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext("2d");
    if (fillWhite) {
      context.fillStyle = "#fff";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.drawImage(bitmap, 0, 0);
    const width = bitmap.width;
    const height = bitmap.height;
    bitmap.close();

    const quality = Math.max(0.4, Math.min(0.95, Number(outputQuality.value) / 100));
    item.blob = await canvasToBlob(canvas, type, quality);
    item.outputName = outputName(item.file.name, type, new Set(state.items.filter((current) => current !== item).map((current) => current.outputName)));

    item.downloadButton.disabled = false;
    item.downloadButton.textContent = extensionForType(type).slice(1).toUpperCase();
    setRowStatus(item, `${width}×${height} · ${item.downloadButton.textContent} ${formatBytes(item.blob.size)}`, false);
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

  function activeCompressMode() {
    return document.querySelector("input[name='compressMode']:checked").value;
  }

  function updateCompressMode() {
    const isSizeMode = activeCompressMode() === "size";
    document.querySelectorAll(".field-size").forEach((field) => {
      field.hidden = !isSizeMode;
    });
    document.querySelectorAll(".field-resolution").forEach((field) => {
      field.hidden = isSizeMode;
    });
  }

  function updateCompressStats() {
    const ready = compressState.items.filter((item) => item.blob).length;
    compressFileCount.textContent = compressState.items.length;
    compressDoneCount.textContent = ready;
    compressButton.disabled = !compressState.items.length || compressState.isConverting;
    compressZipButton.disabled = !ready || compressState.isConverting;
    compressProgressBar.style.width = compressState.items.length ? `${Math.round((ready / compressState.items.length) * 100)}%` : "0";
  }

  function setCompressRowStatus(item, status, isError) {
    item.status.textContent = status;
    item.row.classList.toggle("is-error", Boolean(isError));
  }

  function addCompressFiles(files) {
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));
    const usedNames = new Set(compressState.items.map((item) => item.outputName));

    for (const file of imageFiles) {
      const row = compressTemplate.content.firstElementChild.cloneNode(true);
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
        outputName: outputName(file.name, targetFormat.value, usedNames)
      };

      downloadButton.addEventListener("click", () => {
        if (item.blob) downloadBlob(item.blob, item.outputName);
      });

      compressState.items.push(item);
      compressFileList.append(row);
    }

    updateCompressStats();
  }

  function resetCompressAll() {
    for (const item of compressState.items) {
      URL.revokeObjectURL(item.objectUrl);
    }
    compressState.items = [];
    compressFileList.textContent = "";
    compressFileInput.value = "";
    updateCompressStats();
  }

  function canvasToBlob(canvas, type, quality) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas не смог создать изображение"));
      }, type, quality);
    });
  }

  function drawToCanvas(bitmap, width, height, fillWhite) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (fillWhite) {
      context.fillStyle = "#fff";
      context.fillRect(0, 0, width, height);
    }
    context.drawImage(bitmap, 0, 0, width, height);
    return canvas;
  }

  function resolveResizeDimensions(sourceWidth, sourceHeight) {
    const widthValue = Number(targetWidth.value);
    const heightValue = Number(targetHeight.value);

    if (widthValue > 0 && heightValue > 0) {
      return { width: Math.round(widthValue), height: Math.round(heightValue) };
    }
    if (widthValue > 0) {
      return { width: Math.round(widthValue), height: Math.max(1, Math.round(sourceHeight * (widthValue / sourceWidth))) };
    }
    if (heightValue > 0) {
      return { width: Math.max(1, Math.round(sourceWidth * (heightValue / sourceHeight))), height: Math.round(heightValue) };
    }
    return { width: sourceWidth, height: sourceHeight };
  }

  async function compressToTargetSize(canvas, type, targetBytes) {
    if (type === "image/png") {
      return canvasToBlob(canvas, type);
    }

    let low = 0.12;
    let high = 0.95;
    let best = await canvasToBlob(canvas, type, low);

    for (let attempt = 0; attempt < 8; attempt += 1) {
      const quality = (low + high) / 2;
      const blob = await canvasToBlob(canvas, type, quality);
      if (blob.size <= targetBytes) {
        best = blob;
        low = quality;
      } else {
        high = quality;
      }
    }

    return best;
  }

  async function compressItem(item) {
    setCompressRowStatus(item, "обработка...", false);
    const bitmap = await createImageBitmap(item.file);
    const mode = activeCompressMode();
    const type = mode === "size" ? targetFormat.value : resizeFormat.value;
    const fillWhite = type === "image/jpeg";
    const dimensions = mode === "size"
      ? { width: bitmap.width, height: bitmap.height }
      : resolveResizeDimensions(bitmap.width, bitmap.height);
    const canvas = drawToCanvas(bitmap, dimensions.width, dimensions.height, fillWhite);
    bitmap.close();

    if (mode === "size") {
      const targetBytes = Math.max(1, Number(targetSizeKb.value) || 500) * 1024;
      item.blob = await compressToTargetSize(canvas, type, targetBytes);
      if (item.blob.size > targetBytes) {
        setCompressRowStatus(item, `${dimensions.width}×${dimensions.height} · ${formatBytes(item.blob.size)} · минимум качества`, false);
      } else {
        setCompressRowStatus(item, `${dimensions.width}×${dimensions.height} · ${formatBytes(item.blob.size)}`, false);
      }
    } else {
      const quality = Math.max(0.4, Math.min(0.95, Number(resizeQuality.value) / 100));
      item.blob = await canvasToBlob(canvas, type, quality);
      setCompressRowStatus(item, `${dimensions.width}×${dimensions.height} · ${formatBytes(item.blob.size)}`, false);
    }

    item.outputName = outputName(item.file.name, type, new Set(compressState.items.filter((current) => current !== item).map((current) => current.outputName)));
    item.downloadButton.disabled = false;
    item.downloadButton.textContent = extensionForType(type).slice(1).toUpperCase();
  }

  async function compressAll() {
    compressState.isConverting = true;
    updateCompressStats();

    for (const item of compressState.items) {
      try {
        await compressItem(item);
      } catch (error) {
        setCompressRowStatus(item, "не удалось обработать фото", true);
        console.error(error);
      }
      updateCompressStats();
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    compressState.isConverting = false;
    updateCompressStats();
  }

  async function downloadCompressZip() {
    const files = compressState.items
      .filter((item) => item.blob)
      .map((item) => ({ name: item.outputName, blob: item.blob }));

    if (!files.length) return;
    compressZipButton.disabled = true;
    compressZipButton.textContent = "Упаковка...";

    try {
      const zipBlob = await createZip(files);
      downloadBlob(zipBlob, "compressed-photos.zip");
    } finally {
      compressZipButton.textContent = "Скачать ZIP";
      updateCompressStats();
    }
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
      downloadBlob(zipBlob, "converted-images.zip");
    } finally {
      zipButton.textContent = "Скачать ZIP";
      updateStats();
    }
  }

  function crc32(bytes) {
    let crc = -1;
    for (let index = 0; index < bytes.length; index += 1) {
      crc = (crc >>> 8) ^ (crcTable[(crc ^ bytes[index]) & 0xff]);
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
  clearButton.addEventListener("click", () => {
    resetAll();
    showView("home");
  });
  compressFileInput.addEventListener("change", () => addCompressFiles(compressFileInput.files));
  compressButton.addEventListener("click", compressAll);
  compressZipButton.addEventListener("click", downloadCompressZip);
  compressClearButton.addEventListener("click", () => {
    resetCompressAll();
    showView("home");
  });
  unitCategory.addEventListener("change", updateUnitOptions);
  unitInput.addEventListener("input", convertUnits);
  unitFrom.addEventListener("change", convertUnits);
  unitTo.addEventListener("change", convertUnits);
  swapUnitsButton.addEventListener("click", swapUnits);
  copyUnitButton.addEventListener("click", copyUnitResult);
  clearUnitButton.addEventListener("click", clearUnitConverter);
  unitCloseButton.addEventListener("click", () => showView("home"));
  modeInputs.forEach((input) => input.addEventListener("change", updateCompressMode));
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

  for (const eventName of ["dragenter", "dragover"]) {
    compressDropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      compressDropzone.classList.add("is-dragging");
    });
  }

  for (const eventName of ["dragleave", "drop"]) {
    compressDropzone.addEventListener(eventName, () => {
      compressDropzone.classList.remove("is-dragging");
    });
  }

  compressDropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    addCompressFiles(event.dataTransfer.files);
  });

  updateCompressMode();
  initializeUnitConverter();
  updateStats();
  updateCompressStats();
})();
