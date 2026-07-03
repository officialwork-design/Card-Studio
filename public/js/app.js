const PROJECT_KEY = "card-studio-project-v1";
const CARD_WIDTH = 1075;
const CARD_HEIGHT = 650;
const EXPORT_SCALE = 2;

let currentSide = "front";
let projectState = {
  front: null,
  back: null
};
let isLoadingSide = false;

const canvas = new fabric.Canvas("cardCanvas", {
  width: CARD_WIDTH,
  height: CARD_HEIGHT,
  backgroundColor: "#ffffff",
  preserveObjectStacking: true,
  selection: true
});

const elements = {
  alertArea: document.getElementById("alertArea"),
  saveLocalBtn: document.getElementById("saveLocalBtn"),
  exportJsonBtn: document.getElementById("exportJsonBtn"),
  importJsonInput: document.getElementById("importJsonInput"),
  previewBtn: document.getElementById("previewBtn"),
  downloadPngBtn: document.getElementById("downloadPngBtn"),
  downloadSvgBtn: document.getElementById("downloadSvgBtn"),
  downloadPdfBtn: document.getElementById("downloadPdfBtn"),
  blankTemplateBtn: document.getElementById("blankTemplateBtn"),
  simpleTemplateBtn: document.getElementById("simpleTemplateBtn"),
  addTextBtn: document.getElementById("addTextBtn"),
  imageInput: document.getElementById("imageInput"),
  addImageBtn: document.getElementById("addImageBtn"),
  addRectBtn: document.getElementById("addRectBtn"),
  addCircleBtn: document.getElementById("addCircleBtn"),
  qrTextInput: document.getElementById("qrTextInput"),
  addQrBtn: document.getElementById("addQrBtn"),
  backgroundColorInput: document.getElementById("backgroundColorInput"),
  applyBackgroundBtn: document.getElementById("applyBackgroundBtn"),
  frontSideBtn: document.getElementById("frontSideBtn"),
  backSideBtn: document.getElementById("backSideBtn"),
  gridToggle: document.getElementById("gridToggle"),
  canvasWrapper: document.getElementById("canvasWrapper"),
  noSelectionText: document.getElementById("noSelectionText"),
  propertyPanel: document.getElementById("propertyPanel"),
  fontFamilyInput: document.getElementById("fontFamilyInput"),
  fontSizeInput: document.getElementById("fontSizeInput"),
  fillColorInput: document.getElementById("fillColorInput"),
  opacityInput: document.getElementById("opacityInput"),
  boldBtn: document.getElementById("boldBtn"),
  italicBtn: document.getElementById("italicBtn"),
  underlineBtn: document.getElementById("underlineBtn"),
  bringForwardBtn: document.getElementById("bringForwardBtn"),
  sendBackwardBtn: document.getElementById("sendBackwardBtn"),
  duplicateBtn: document.getElementById("duplicateBtn"),
  deleteBtn: document.getElementById("deleteBtn"),
  frontPreviewImage: document.getElementById("frontPreviewImage"),
  backPreviewImage: document.getElementById("backPreviewImage")
};

function showAlert(type, message) {
  const alert = document.createElement("div");
  alert.className = `alert alert-${type} alert-dismissible fade show shadow-sm`;
  alert.role = "alert";
  alert.innerHTML = `
    <div>${escapeHtml(message)}</div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="閉じる"></button>
  `;
  elements.alertArea.appendChild(alert);
  setTimeout(() => bootstrap.Alert.getOrCreateInstance(alert).close(), 4500);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function captureCurrentSide() {
  if (isLoadingSide) return;
  projectState[currentSide] = canvas.toJSON(["name"]);
}

function getDefaultSide() {
  return {
    version: "5.3.1",
    objects: [],
    background: "#ffffff"
  };
}

function setSideButtons(side) {
  elements.frontSideBtn.classList.toggle("btn-dark", side === "front");
  elements.frontSideBtn.classList.toggle("btn-outline-dark", side !== "front");
  elements.frontSideBtn.classList.toggle("active", side === "front");
  elements.backSideBtn.classList.toggle("btn-dark", side === "back");
  elements.backSideBtn.classList.toggle("btn-outline-dark", side !== "back");
  elements.backSideBtn.classList.toggle("active", side === "back");
}

function loadSide(side) {
  if (side === currentSide && projectState[side]) return Promise.resolve();
  captureCurrentSide();
  currentSide = side;
  setSideButtons(side);
  isLoadingSide = true;
  canvas.discardActiveObject();
  canvas.clear();

  const json = projectState[side] || getDefaultSide();

  return new Promise((resolve) => {
    canvas.loadFromJSON(json, () => {
      canvas.backgroundColor = json.background || "#ffffff";
      canvas.renderAll();
      isLoadingSide = false;
      updatePropertyPanel();
      resolve();
    });
  });
}

function createBlankTemplate() {
  canvas.clear();
  canvas.backgroundColor = "#ffffff";
  canvas.renderAll();
  captureCurrentSide();
  showAlert("success", "白紙テンプレートを適用しました。");
}

function createSimpleTemplate() {
  canvas.clear();
  canvas.backgroundColor = "#ffffff";

  const accent = new fabric.Rect({
    left: 0,
    top: 0,
    width: 34,
    height: CARD_HEIGHT,
    fill: "#2563eb"
  });

  const nameText = new fabric.IText("山田 太郎", {
    left: 90,
    top: 110,
    fontSize: 68,
    fontFamily: "Yu Gothic",
    fill: "#111111",
    fontWeight: "bold"
  });

  const titleText = new fabric.IText("Creative Director", {
    left: 95,
    top: 205,
    fontSize: 30,
    fontFamily: "Arial",
    fill: "#555555"
  });

  const companyText = new fabric.IText("Card Studio Inc.", {
    left: 95,
    top: 420,
    fontSize: 34,
    fontFamily: "Arial",
    fill: "#111111"
  });

  const contactText = new fabric.IText("mail@example.com  |  03-0000-0000", {
    left: 95,
    top: 477,
    fontSize: 24,
    fontFamily: "Arial",
    fill: "#333333"
  });

  canvas.add(accent, nameText, titleText, companyText, contactText);
  canvas.renderAll();
  captureCurrentSide();
  showAlert("success", "シンプルテンプレートを適用しました。");
}

function addText() {
  const text = new fabric.IText("テキストを入力", {
    left: 120,
    top: 120,
    fontSize: 44,
    fontFamily: "Yu Gothic",
    fill: "#111111"
  });
  canvas.add(text);
  canvas.setActiveObject(text);
  canvas.renderAll();
  captureCurrentSide();
  updatePropertyPanel();
}

function addRect() {
  const rect = new fabric.Rect({
    left: 150,
    top: 160,
    width: 190,
    height: 100,
    fill: "#2563eb",
    rx: 10,
    ry: 10
  });
  canvas.add(rect);
  canvas.setActiveObject(rect);
  canvas.renderAll();
  captureCurrentSide();
  updatePropertyPanel();
}

function addCircle() {
  const circle = new fabric.Circle({
    left: 160,
    top: 160,
    radius: 62,
    fill: "#22c55e"
  });
  canvas.add(circle);
  canvas.setActiveObject(circle);
  canvas.renderAll();
  captureCurrentSide();
  updatePropertyPanel();
}

function addImageFromFile() {
  const file = elements.imageInput.files[0];
  if (!file) {
    showAlert("warning", "画像ファイルを選択してください。");
    return;
  }

  const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
  if (!allowedTypes.includes(file.type)) {
    showAlert("danger", "PNG / JPG / WEBP / SVGのみ追加できます。");
    return;
  }

  if (file.size > 8 * 1024 * 1024) {
    showAlert("danger", "画像サイズは8MB以下にしてください。");
    return;
  }

  const reader = new FileReader();
  reader.onerror = () => showAlert("danger", "画像の読み込みに失敗しました。");
  reader.onload = () => {
    fabric.Image.fromURL(reader.result, (img) => {
      const maxWidth = 360;
      const scale = img.width > maxWidth ? maxWidth / img.width : 1;
      img.set({ left: 180, top: 150, scaleX: scale, scaleY: scale });
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
      captureCurrentSide();
      updatePropertyPanel();
      showAlert("success", "画像を追加しました。サーバーには保存していません。");
    });
  };
  reader.readAsDataURL(file);
}

function addQrCode() {
  const value = elements.qrTextInput.value.trim();
  if (!value) {
    showAlert("warning", "QRコード化するURLまたは文字列を入力してください。");
    return;
  }

  try {
    const qr = qrcode(0, "M");
    qr.addData(value);
    qr.make();
    const dataUrl = qr.createDataURL(8, 0);

    fabric.Image.fromURL(dataUrl, (img) => {
      img.set({ left: 770, top: 345, scaleX: 1, scaleY: 1 });
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
      captureCurrentSide();
      updatePropertyPanel();
    });
  } catch (error) {
    showAlert("danger", `QRコード生成に失敗しました。${error.message}`);
  }
}

function applyBackgroundColor() {
  canvas.backgroundColor = elements.backgroundColorInput.value;
  canvas.renderAll();
  captureCurrentSide();
}

function getActiveObject() {
  return canvas.getActiveObject();
}

function normalizeColor(color) {
  if (!color) return "#111111";
  if (String(color).startsWith("#")) return color;
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.fillStyle = color;
  return ctx.fillStyle;
}

function updatePropertyPanel() {
  const activeObject = getActiveObject();
  if (!activeObject) {
    elements.noSelectionText.classList.remove("d-none");
    elements.propertyPanel.classList.add("d-none");
    return;
  }

  elements.noSelectionText.classList.add("d-none");
  elements.propertyPanel.classList.remove("d-none");
  elements.opacityInput.value = activeObject.opacity ?? 1;

  if (activeObject.fill && typeof activeObject.fill === "string") {
    elements.fillColorInput.value = normalizeColor(activeObject.fill);
  }

  if (isTextObject(activeObject)) {
    elements.fontFamilyInput.disabled = false;
    elements.fontSizeInput.disabled = false;
    elements.boldBtn.disabled = false;
    elements.italicBtn.disabled = false;
    elements.underlineBtn.disabled = false;
    elements.fontFamilyInput.value = activeObject.fontFamily || "Arial";
    elements.fontSizeInput.value = activeObject.fontSize || 42;
  } else {
    elements.fontFamilyInput.disabled = true;
    elements.fontSizeInput.disabled = true;
    elements.boldBtn.disabled = true;
    elements.italicBtn.disabled = true;
    elements.underlineBtn.disabled = true;
  }
}

function isTextObject(object) {
  return ["i-text", "textbox", "text"].includes(object.type);
}

function setActiveProperty(property, value) {
  const activeObject = getActiveObject();
  if (!activeObject) return;
  activeObject.set(property, value);
  canvas.renderAll();
  captureCurrentSide();
}

function toggleTextProperty(property, activeValue, inactiveValue) {
  const activeObject = getActiveObject();
  if (!activeObject || !isTextObject(activeObject)) return;
  activeObject.set(property, activeObject[property] === activeValue ? inactiveValue : activeValue);
  canvas.renderAll();
  captureCurrentSide();
}

function duplicateActiveObject() {
  const activeObject = getActiveObject();
  if (!activeObject) {
    showAlert("warning", "複製する要素を選択してください。");
    return;
  }

  activeObject.clone((cloned) => {
    cloned.set({ left: activeObject.left + 30, top: activeObject.top + 30 });
    canvas.add(cloned);
    canvas.setActiveObject(cloned);
    canvas.renderAll();
    captureCurrentSide();
    updatePropertyPanel();
  });
}

function deleteActiveObject() {
  const activeObject = getActiveObject();
  if (!activeObject) {
    showAlert("warning", "削除する要素を選択してください。");
    return;
  }
  canvas.remove(activeObject);
  canvas.discardActiveObject();
  canvas.renderAll();
  captureCurrentSide();
  updatePropertyPanel();
}

function saveToLocalStorage() {
  captureCurrentSide();
  try {
    localStorage.setItem(PROJECT_KEY, JSON.stringify({
      app: "Card Studio",
      version: "0.1.0",
      updatedAt: new Date().toISOString(),
      project: projectState
    }));
    showAlert("success", "ブラウザに保存しました。サーバーには保存していません。");
  } catch (error) {
    showAlert("danger", `ブラウザ保存に失敗しました。${error.message}`);
  }
}

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(PROJECT_KEY);
    if (!raw) {
      createSimpleTemplate();
      projectState.back = getDefaultSide();
      return;
    }

    const parsed = JSON.parse(raw);
    if (!parsed.project || !parsed.project.front || !parsed.project.back) {
      throw new Error("保存データの形式が不正です。");
    }

    projectState = parsed.project;
    currentSide = "front";
    loadSide("front");
  } catch (error) {
    showAlert("warning", `保存データを読み込めませんでした。${error.message}`);
    createSimpleTemplate();
    projectState.back = getDefaultSide();
  }
}

function exportJson() {
  captureCurrentSide();
  const payload = {
    app: "Card Studio",
    version: "0.1.0",
    exportedAt: new Date().toISOString(),
    project: projectState
  };
  downloadBlob(JSON.stringify(payload, null, 2), `card-studio-${Date.now()}.json`, "application/json");
}

function importJson(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (!file.name.endsWith(".json") && file.type !== "application/json") {
    showAlert("danger", "JSONファイルを選択してください。");
    return;
  }

  const reader = new FileReader();
  reader.onerror = () => showAlert("danger", "JSON読み込みに失敗しました。");
  reader.onload = async () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (!parsed.project || !parsed.project.front || !parsed.project.back) {
        throw new Error("Card StudioのJSON形式ではありません。");
      }
      projectState = parsed.project;
      currentSide = "front";
      await loadSide("front");
      saveToLocalStorage();
      showAlert("success", "JSONを読み込みました。");
    } catch (error) {
      showAlert("danger", `JSON読み込みに失敗しました。${error.message}`);
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsText(file);
}

function getCanvasPngDataUrl() {
  return canvas.toDataURL({ format: "png", multiplier: EXPORT_SCALE });
}

function getCanvasSvg() {
  return canvas.toSVG();
}

async function getSidePng(side) {
  const originalSide = currentSide;
  await loadSide(side);
  const dataUrl = getCanvasPngDataUrl();
  await loadSide(originalSide);
  return dataUrl;
}

async function previewProject() {
  captureCurrentSide();
  const originalSide = currentSide;
  await loadSide("front");
  elements.frontPreviewImage.src = getCanvasPngDataUrl();
  await loadSide("back");
  elements.backPreviewImage.src = getCanvasPngDataUrl();
  await loadSide(originalSide);
  bootstrap.Modal.getOrCreateInstance(document.getElementById("previewModal")).show();
}

function downloadPng() {
  const dataUrl = getCanvasPngDataUrl();
  const blob = dataUrlToBlob(dataUrl);
  downloadBlob(blob, `card-studio-${currentSide}-${Date.now()}.png`, "image/png");
}

function downloadSvg() {
  const svg = getCanvasSvg();
  downloadBlob(svg, `card-studio-${currentSide}-${Date.now()}.svg`, "image/svg+xml;charset=utf-8");
}

async function downloadPdf() {
  captureCurrentSide();
  const originalSide = currentSide;
  try {
    await loadSide("front");
    const frontPng = getCanvasPngDataUrl();
    await loadSide("back");
    const backPng = getCanvasPngDataUrl();
    await loadSide(originalSide);

    const response = await fetch("/api/export/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ frontPng, backPng })
    });

    if (!response.ok) {
      let message = "PDF出力に失敗しました。";
      try {
        const result = await response.json();
        message = result.message || message;
      } catch (error) {
        message = `${message} サーバー応答を確認できませんでした。`;
      }
      showAlert("danger", message);
      return;
    }

    const blob = await response.blob();
    downloadBlob(blob, `card-studio-${Date.now()}.pdf`, "application/pdf");
  } catch (error) {
    await loadSide(originalSide);
    showAlert("danger", `PDF出力に失敗しました。${error.message}`);
  }
}

function dataUrlToBlob(dataUrl) {
  const parts = dataUrl.split(",");
  const mime = parts[0].match(/:(.*?);/)[1];
  const binary = atob(parts[1]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

function downloadBlob(content, fileName, type) {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function bindEvents() {
  elements.blankTemplateBtn.addEventListener("click", createBlankTemplate);
  elements.simpleTemplateBtn.addEventListener("click", createSimpleTemplate);
  elements.addTextBtn.addEventListener("click", addText);
  elements.addImageBtn.addEventListener("click", addImageFromFile);
  elements.addRectBtn.addEventListener("click", addRect);
  elements.addCircleBtn.addEventListener("click", addCircle);
  elements.addQrBtn.addEventListener("click", addQrCode);
  elements.applyBackgroundBtn.addEventListener("click", applyBackgroundColor);
  elements.frontSideBtn.addEventListener("click", () => loadSide("front"));
  elements.backSideBtn.addEventListener("click", () => loadSide("back"));
  elements.gridToggle.addEventListener("change", () => {
    elements.canvasWrapper.classList.toggle("grid-enabled", elements.gridToggle.checked);
  });

  elements.fontFamilyInput.addEventListener("change", () => setActiveProperty("fontFamily", elements.fontFamilyInput.value));
  elements.fontSizeInput.addEventListener("input", () => setActiveProperty("fontSize", Number(elements.fontSizeInput.value)));
  elements.fillColorInput.addEventListener("input", () => setActiveProperty("fill", elements.fillColorInput.value));
  elements.opacityInput.addEventListener("input", () => setActiveProperty("opacity", Number(elements.opacityInput.value)));
  elements.boldBtn.addEventListener("click", () => toggleTextProperty("fontWeight", "bold", "normal"));
  elements.italicBtn.addEventListener("click", () => toggleTextProperty("fontStyle", "italic", "normal"));
  elements.underlineBtn.addEventListener("click", () => {
    const activeObject = getActiveObject();
    if (!activeObject || !isTextObject(activeObject)) return;
    activeObject.set("underline", !activeObject.underline);
    canvas.renderAll();
    captureCurrentSide();
  });

  elements.bringForwardBtn.addEventListener("click", () => {
    const activeObject = getActiveObject();
    if (!activeObject) return;
    canvas.bringForward(activeObject);
    canvas.renderAll();
    captureCurrentSide();
  });

  elements.sendBackwardBtn.addEventListener("click", () => {
    const activeObject = getActiveObject();
    if (!activeObject) return;
    canvas.sendBackwards(activeObject);
    canvas.renderAll();
    captureCurrentSide();
  });

  elements.duplicateBtn.addEventListener("click", duplicateActiveObject);
  elements.deleteBtn.addEventListener("click", deleteActiveObject);
  elements.saveLocalBtn.addEventListener("click", saveToLocalStorage);
  elements.exportJsonBtn.addEventListener("click", exportJson);
  elements.importJsonInput.addEventListener("change", importJson);
  elements.previewBtn.addEventListener("click", previewProject);
  elements.downloadPngBtn.addEventListener("click", downloadPng);
  elements.downloadSvgBtn.addEventListener("click", downloadSvg);
  elements.downloadPdfBtn.addEventListener("click", downloadPdf);

  canvas.on("selection:created", updatePropertyPanel);
  canvas.on("selection:updated", updatePropertyPanel);
  canvas.on("selection:cleared", updatePropertyPanel);
  canvas.on("object:modified", captureCurrentSide);
  canvas.on("text:changed", captureCurrentSide);
}

bindEvents();
loadFromLocalStorage();
