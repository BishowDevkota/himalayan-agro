"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

type VerifyResponse = {
  paymentStatus?: string;
  orderStatus?: string;
  message?: string;
};

function EsewaReturnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<VerifyResponse>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const pid = searchParams.get("pid") || searchParams.get("transaction_uuid");
    const refId = searchParams.get("refId") || searchParams.get("ref_id");
    const amt = searchParams.get("amt") || searchParams.get("total_amount");
    const scd = searchParams.get("scd") || searchParams.get("product_code");
    // eSewa may return a base64-encoded JSON in either `response` or `data`.
    // Some gateways (or misconfigured redirects) may use a second `?` before `data=`
    // which makes `URLSearchParams` miss it. Try `response`, then `data`, then
    // fall back to extracting `?data=` from the full href.
    let response = searchParams.get("response") || searchParams.get("data");
    if (!response && typeof window !== "undefined") {
      const href = window.location.href || "";
      const marker = "?data=";
      const idx = href.indexOf(marker);
      if (idx !== -1) {
        response = href.substring(idx + marker.length);
      }
    }

    if (response) {
      try {
        const decoded = JSON.parse(atob(response));
        const paymentStatus = decoded.status || decoded.paymentStatus || "unknown";
        const orderStatus = decoded.status === "COMPLETE" ? "processing" : decoded.status === "FULL_REFUND" ? "cancelled" : decoded.status || "unknown";
        setResult({ paymentStatus, orderStatus, message: `eSewa response received: ${decoded.status}` });

        // If we received a payload from eSewa, attempt to verify/update the order server-side.
        (async () => {
          try {
            setLoading(true);
            const pidFromData = decoded.transaction_uuid || decoded.pid || decoded.orderId || decoded.transactionId;
            const refIdFromData = decoded.transaction_code || decoded.rid || decoded.refId || decoded.ref || decoded.reference;
            const amtFromData = decoded.total_amount || decoded.amt || decoded.amount;
            const scdFromData = decoded.product_code || decoded.scd;

            if (pidFromData && refIdFromData && amtFromData) {
              const res = await fetch("/api/esewa/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  pid: pidFromData,
                  refId: refIdFromData,
                  amt: String(amtFromData),
                  scd: scdFromData,
                  responseData: decoded,
                }),
              });
              const data = await res.json().catch(() => ({}));
              if (res.ok) {
                setResult(data);
                toast.success("eSewa payment verified.");
              } else {
                // keep the decoded info visible but show server message
                setResult((r) => ({ ...r, message: data.message || data?.message || "Verification failed" }));
                toast.error(data.message || "Verification failed");
              }
            }
          } catch (e: unknown) {
            const m = e instanceof Error ? e.message : "Verification failed";
            toast.error(m);
          } finally {
            setLoading(false);
          }
        })();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unable to decode eSewa response");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!pid || !refId || !amt || !scd) {
      setError("Missing eSewa response parameters.");
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/esewa/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pid, refId, amt, scd }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Unable to verify payment");
        setResult(data);
        toast.success("eSewa payment verified.");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unable to verify payment";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">eSewa Payment Result</h1>
        {loading && <p className="mt-3 text-sm text-gray-600">Verifying your payment with eSewa...</p>}
        {!loading && error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
        )}
        {!loading && !error && (
          <div className="mt-4 space-y-3 text-sm text-gray-700">
            <p>Payment status: <strong>{result.paymentStatus || "unknown"}</strong></p>
            <p>Order status: <strong>{result.orderStatus || "unknown"}</strong></p>
            {result.message && <p>{result.message}</p>}
          </div>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className="rounded-2xl bg-[#0891b2] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0b78be] transition"
            onClick={() => router.push("/my-orders")}
          >
            View my orders
          </button>
          <button
            className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            onClick={() => router.push("/")}
          >
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EsewaReturnPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto p-8 space-y-6">Loading eSewa payment result...</div>}>
      <EsewaReturnContent />
    </Suspense>
  );
}
