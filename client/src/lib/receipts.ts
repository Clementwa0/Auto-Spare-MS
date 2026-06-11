import { jsPDF } from "jspdf";
import type { Part } from "@/types/type";

export interface ReceiptItem {
  part: Part;
  quantity: number;
}

export interface ReceiptData {
  items: ReceiptItem[];
  subtotal: number;
  vat: number;
  total: number;
  cashier?: string;
  terminal?: string;
  saleId?: string;
  date?: Date;
}

const WIDTH_MM = 80; 
const MARGIN = 5;

const fmtKES = (n: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(n);

function divider(doc: jsPDF, y: number, dashed = false) {
  if (dashed) {
    doc.setLineDashPattern([0.6, 0.6], 0);
  } else {
    doc.setLineDashPattern([], 0);
  }
  doc.setDrawColor(120);
  doc.line(MARGIN, y, WIDTH_MM - MARGIN, y);
  doc.setLineDashPattern([], 0);
}

export function buildReceiptPDF(data: ReceiptData): jsPDF {
  const {
    items,
    subtotal,
    vat,
    total,
    cashier = "—",
    terminal = "POS-001",
    saleId = `S-${Date.now().toString().slice(-8)}`,
    date = new Date(),
  } = data;

  // estimate height — grow as needed
  const estHeight = 70 + items.length * 10 + 50;
  const doc = new jsPDF({
    unit: "mm",
    format: [WIDTH_MM, estHeight],
  });

  let y = 8;

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("AUTOPARTS POS", WIDTH_MM / 2, y, { align: "center" });
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Sales Receipt", WIDTH_MM / 2, y, { align: "center" });
  y += 3.5;
  doc.text("123 Industrial Road · Nairobi", WIDTH_MM / 2, y, { align: "center" });
  y += 3.5;
  doc.text("Tel: +254 700 000 000", WIDTH_MM / 2, y, { align: "center" });
  y += 4;

  divider(doc, y);
  y += 4;

  // Meta
  doc.setFontSize(8);
  const dateStr = date.toLocaleString("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const metaRow = (label: string, value: string) => {
    doc.setFont("helvetica", "normal");
    doc.text(label, MARGIN, y);
    doc.setFont("helvetica", "bold");
    doc.text(value, WIDTH_MM - MARGIN, y, { align: "right" });
    y += 3.8;
  };
  metaRow("Receipt #", saleId);
  metaRow("Date", dateStr);
  metaRow("Cashier", cashier);
  metaRow("Terminal", terminal);

  y += 1;
  divider(doc, y, true);
  y += 4;

  // Column headers
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("Item", MARGIN, y);
  doc.text("Qty", MARGIN + 42, y, { align: "right" });
  doc.text("Total", WIDTH_MM - MARGIN, y, { align: "right" });
  y += 2;
  divider(doc, y);
  y += 4;

  // Items
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  for (const it of items) {
    const desc = it.part.description;
    const lines = doc.splitTextToSize(desc, 40);
    const lineTotal = it.quantity * it.part.selling_price;

    doc.text(lines, MARGIN, y);
    doc.text(String(it.quantity), MARGIN + 42, y, { align: "right" });
    doc.text(fmtKES(lineTotal), WIDTH_MM - MARGIN, y, { align: "right" });

    y += lines.length * 3.2;

    doc.setTextColor(120);
    doc.setFontSize(7);
    doc.text(
      `${it.part.part_no} · ${fmtKES(it.part.selling_price)} ea`,
      MARGIN,
      y,
    );
    doc.setTextColor(0);
    doc.setFontSize(8);
    y += 4;
  }

  divider(doc, y, true);
  y += 4;

  // Totals
  const totalRow = (label: string, value: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(bold ? 10 : 8);
    doc.text(label, MARGIN, y);
    doc.text(value, WIDTH_MM - MARGIN, y, { align: "right" });
    y += bold ? 5.5 : 4;
  };
  totalRow(
    `Subtotal (${items.reduce((s, i) => s + i.quantity, 0)} items)`,
    fmtKES(subtotal),
  );
  totalRow("VAT (16%)", fmtKES(vat));
  y += 0.5;
  divider(doc, y);
  y += 4.5;
  totalRow("TOTAL", fmtKES(total), true);

  y += 2;
  divider(doc, y);
  y += 5;

  // Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Thank you for your business!", WIDTH_MM / 2, y, { align: "center" });
  y += 4;
  doc.setFontSize(7);
  doc.setTextColor(110);
  doc.text("Goods sold are not returnable.", WIDTH_MM / 2, y, { align: "center" });
  y += 3.5;
  doc.text("Keep this receipt for your records.", WIDTH_MM / 2, y, { align: "center" });

  return doc;
}

/** Open browser print dialog with the receipt PDF. */
export function printReceipt(data: ReceiptData) {
  const doc = buildReceiptPDF(data);
  const blobUrl = doc.output("bloburl");
  const win = window.open(blobUrl as unknown as string, "_blank");
  if (win) {
    win.focus();
    // Some browsers need a tick before print() is callable.
    win.addEventListener("load", () => {
      try {
        win.print();
      } catch {
        /* user can still print manually */
      }
    });
  }
}

/** Trigger a direct download of the receipt PDF. */
export function downloadReceipt(data: ReceiptData) {
  const doc = buildReceiptPDF(data);
  doc.save(`receipt-${data.saleId ?? Date.now()}.pdf`);
}
