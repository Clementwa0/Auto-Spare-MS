import { jsPDF } from "jspdf";
import type { Part } from "@/types/type";

export interface ReceiptItem {
  part: Part;
  quantity: number;
}

export interface ReceiptBranch {
  _id?: string;
  name: string;
  address?: string;
  location?: string;
  phone?: string;
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

  branch?: ReceiptBranch;
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
    branch,
  } = data;

  const estHeight = 100 + items.length * 12 + 60;

  const doc = new jsPDF({
    unit: "mm",
    format: [WIDTH_MM, estHeight],
  });

  let y = 8;

  // =========================
  // STORE HEADER
  // =========================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);

  doc.text(
    branch?.name || "AUTOPARTS POS",
    WIDTH_MM / 2,
    y,
    { align: "center" }
  );

  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  doc.text("SALES RECEIPT", WIDTH_MM / 2, y, {
    align: "center",
  });

  y += 4;

  if (branch?.address) {
    const lines = doc.splitTextToSize(
      branch.address,
      WIDTH_MM - MARGIN * 2
    );

    doc.text(lines, WIDTH_MM / 2, y, {
      align: "center",
    });

    y += lines.length * 3.5;
  }

  if (branch?.location) {
    doc.text(branch.location, WIDTH_MM / 2, y, {
      align: "center",
    });

    y += 3.5;
  }

  if (branch?.phone) {
    doc.text(`Tel: ${branch.phone}`, WIDTH_MM / 2, y, {
      align: "center",
    });

    y += 3.5;
  }

  y += 1;

  divider(doc, y);

  y += 4;

  // =========================
  // RECEIPT META
  // =========================

  doc.setFontSize(8);

  const dateStr = date.toLocaleString("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const metaRow = (label: string, value: string) => {
    doc.setFont("helvetica", "normal");
    doc.text(label, MARGIN, y);

    doc.setFont("helvetica", "bold");
    doc.text(value, WIDTH_MM - MARGIN, y, {
      align: "right",
    });

    y += 4;
  };

  metaRow("Receipt #", saleId);
  metaRow("Date", dateStr);
  metaRow("Cashier", cashier);

  if (branch?.name) {
    metaRow("Branch", branch.name);
  }

  metaRow("Terminal", terminal);

  y += 1;

  divider(doc, y, true);

  y += 4;

  // =========================
  // ITEM HEADER
  // =========================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);

  doc.text("Item", MARGIN, y);

  doc.text("Qty", MARGIN + 42, y, {
    align: "right",
  });

  doc.text("Total", WIDTH_MM - MARGIN, y, {
    align: "right",
  });

  y += 2;

  divider(doc, y);

  y += 4;

  // =========================
  // ITEMS
  // =========================

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  for (const item of items) {
    const description =
      item.part.description ||
      item.part.part_no ||
      "Unknown Item";

    const lines = doc.splitTextToSize(description, 40);

    const lineTotal =
      item.quantity * item.part.selling_price;

    doc.text(lines, MARGIN, y);

    doc.text(
      String(item.quantity),
      MARGIN + 42,
      y,
      {
        align: "right",
      }
    );

    doc.text(
      fmtKES(lineTotal),
      WIDTH_MM - MARGIN,
      y,
      {
        align: "right",
      }
    );

    y += lines.length * 3.2;

    doc.setTextColor(120);
    doc.setFontSize(7);

    doc.text(
      `${item.part.part_no} · ${fmtKES(
        item.part.selling_price
      )} ea`,
      MARGIN,
      y
    );

    doc.setTextColor(0);
    doc.setFontSize(8);

    y += 4;
  }

  divider(doc, y, true);

  y += 4;

  // =========================
  // TOTALS
  // =========================

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalRow = (
    label: string,
    value: string,
    bold = false
  ) => {
    doc.setFont(
      "helvetica",
      bold ? "bold" : "normal"
    );

    doc.setFontSize(bold ? 10 : 8);

    doc.text(label, MARGIN, y);

    doc.text(value, WIDTH_MM - MARGIN, y, {
      align: "right",
    });

    y += bold ? 5.5 : 4;
  };

  totalRow(
    `Subtotal (${totalItems} items)`,
    fmtKES(subtotal)
  );

  totalRow("VAT", fmtKES(vat));

  y += 1;

  divider(doc, y);

  y += 5;

  totalRow("TOTAL", fmtKES(total), true);

  y += 2;

  divider(doc, y);

  y += 5;

  // =========================
  // FOOTER
  // =========================

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  doc.text(
    "Thank you for your business!",
    WIDTH_MM / 2,
    y,
    {
      align: "center",
    }
  );

  y += 4;

  doc.setFontSize(7);
  doc.setTextColor(110);

  doc.text(
    "Goods sold are not returnable.",
    WIDTH_MM / 2,
    y,
    {
      align: "center",
    }
  );

  y += 3.5;

  doc.text(
    "Keep this receipt for your records.",
    WIDTH_MM / 2,
    y,
    {
      align: "center",
    }
  );

  return doc;
}

/**
 * Open print dialog
 */
export function printReceipt(data: ReceiptData) {
  const doc = buildReceiptPDF(data);

  const blobUrl = doc.output("bloburl");

  const win = window.open(
    blobUrl as unknown as string,
    "_blank"
  );

  if (win) {
    win.focus();

    setTimeout(() => {
      try {
        win.print();
      } catch (err) {
        console.error("Print failed", err);
      }
    }, 1000);
  }
}


export function downloadReceipt(data: ReceiptData) {
  const doc = buildReceiptPDF(data);

  doc.save(
    `receipt-${data.saleId ?? Date.now()}.pdf`
  );
}