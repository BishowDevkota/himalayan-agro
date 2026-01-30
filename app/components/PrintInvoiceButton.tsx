"use client";

import React from "react";

export default function PrintInvoiceButton() {
  return (
    <button
      type="button"
      className="w-full rounded-lg border border-gray-100 px-4 py-3 text-sm"
      onClick={() => window.print()}
      aria-label="Download invoice"
    >
      Download invoice
    </button>
  );
}
