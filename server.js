const express = require("express");
const { PDFDocument } = require("pdf-lib");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "Card Studio", storage: "none" });
});

app.post("/api/export/pdf", async (req, res) => {
  try {
    const { frontPng, backPng } = req.body;

    if (!isPngDataUrl(frontPng)) {
      return res.status(400).json({
        ok: false,
        message: "PDF出力用の表面PNGデータが不正です。"
      });
    }

    const pdfDoc = await PDFDocument.create();

    // Standard Japanese business card: 91mm x 55mm.
    // 1mm = 2.834645669pt.
    const pageWidth = 91 * 2.834645669;
    const pageHeight = 55 * 2.834645669;

    await addPngPage(pdfDoc, frontPng, pageWidth, pageHeight);

    if (isPngDataUrl(backPng)) {
      await addPngPage(pdfDoc, backPng, pageWidth, pageHeight);
    }

    const pdfBytes = await pdfDoc.save();
    const fileName = `card-studio-${Date.now()}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Cache-Control", "no-store");
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "PDF出力に失敗しました。",
      detail: error.message
    });
  }
});

function isPngDataUrl(value) {
  return typeof value === "string" && value.startsWith("data:image/png;base64,");
}

async function addPngPage(pdfDoc, dataUrl, pageWidth, pageHeight) {
  const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
  const pngBytes = Buffer.from(base64, "base64");
  const pngImage = await pdfDoc.embedPng(pngBytes);
  const page = pdfDoc.addPage([pageWidth, pageHeight]);

  page.drawImage(pngImage, {
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight
  });
}

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Not Found" });
});

app.listen(PORT, () => {
  console.log(`Card Studio running at http://localhost:${PORT}`);
});
