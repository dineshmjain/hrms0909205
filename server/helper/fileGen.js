import { aggregate } from '../helper/mongo.js'
import ExcelJS from "exceljs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import PDFDocument from 'pdfkit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const generateExcel = async (pipeline, collectionName) => {
  const { data } = await aggregate(pipeline, collectionName);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Holidays");

  if (!data || data.length === 0) {
    worksheet.addRow(["No data available"]);
  } else {
    const allowedKeys = [
        "name",
        "date",
        "description",
        "holidayType",
        "duration",
        "isActive"
    ];

const columns = allowedKeys
  .filter(key => data.some(item => key in item))
  .map(key => ({
    header: key.charAt(0).toUpperCase() + key.slice(1),
    key,
    width: 20,
  }));


    worksheet.columns = columns;

    data.forEach((holiday) => {
      const row = {};
      columns.forEach((col) => {
        let value = holiday[col.key];

        if (col.key.toLowerCase().includes("date") && value) {
          value = new Date(value).toISOString().split("T")[0];
        } else if (typeof value === "boolean") {
          value = value ? "Yes" : "No";
        }

        row[col.key] = value ?? "";
      });

      worksheet.addRow(row);
    });
  }

  const fileName = `holidays_${Date.now()}.xlsx`;
  const fileDir = path.join(__dirname, "../public/exports");
  const filePath = path.join(fileDir, fileName);

  fs.mkdirSync(fileDir, { recursive: true });
  await workbook.xlsx.writeFile(filePath);

  return `/${fileName}`;
};

export const generatePDF = async (pipeline, collectionName) => {
  const { data } = await aggregate(pipeline, collectionName);

  const fileName = `holidays_${Date.now()}.pdf`;
  const fileDir = path.join(__dirname, "../public/exports");
  const filePath = path.join(fileDir, fileName);

  fs.mkdirSync(fileDir, { recursive: true });

  const doc = new PDFDocument({ margin: 40, size: "A4" });
  doc.pipe(fs.createWriteStream(filePath));

  const rowHeight = 25;
  const startX = 50;
  const pageWidth = 500;

  const allowedKeys = [
        "name",
        "date",
        "description",
        "holidayType",
        "duration",
        "isActive"
    ];
 const keys = allowedKeys.filter(key => data.some(item => key in item));

  const colWidth = Math.floor(pageWidth / keys.length);

  const columns = keys.map((key) => ({
    key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
    width: colWidth,
  }));

  doc.fontSize(20).font("Helvetica-Bold").text("Holiday Report", { align: "center" });
  doc.moveDown(1.5);

  let y = doc.y;
  doc.rect(startX, y, pageWidth, rowHeight).fill("#f0f0f0").stroke();
  doc.fillColor("#000").fontSize(12).font("Helvetica-Bold");

  let x = startX;
  columns.forEach(col => {
    doc.text(col.label, x + 5, y + 8, { width: col.width, align: "left" });
    x += col.width;
  });

  y += rowHeight;
  doc.font("Helvetica").fontSize(11);

  data.forEach((row, index) => {
    if (y > 750) {
      doc.addPage();
      y = 50;
    }

    if (index % 2 === 1) {
      doc.rect(startX, y, pageWidth, rowHeight).fill("#f9f9f9");
      doc.fillColor("#000");
    }

    x = startX;
    columns.forEach(col => {
      let value = row[col.key];

      if (col.key.toLowerCase().includes("date") && value) {
        value = new Date(value).toISOString().split("T")[0];
      } else if (typeof value === "boolean") {
        value = value ? "Yes" : "No";
      } else if (value === undefined || value === null) {
        value = "";
      }

      doc.fillColor("#000").text(String(value), x + 5, y + 8, {
        width: col.width,
        align: "left",
      });

      x += col.width;
    });

    y += rowHeight;
  });

  doc.end();

  return `/${fileName}`;
};