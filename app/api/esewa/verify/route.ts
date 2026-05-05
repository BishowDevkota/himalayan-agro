import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb";
import Order from "../../../../models/Order";
import { getSessionUser, requireUser } from "../../../../lib/server-utils";
import { getEsewaStatusUrl } from "../../../../lib/esewa";

export async function POST(req: Request) {
  const user = await getSessionUser();
  requireUser(user);

  const body = await req.json().catch(() => ({}));
  const pid = typeof body.pid === "string" ? body.pid : undefined;
  const refId = typeof body.refId === "string" ? body.refId : undefined;
  const amt = typeof body.amt === "string" ? body.amt : undefined;
  const productCode = typeof body.scd === "string" ? body.scd : process.env.ESEWA_MERCHANT_CODE || process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE || "";
  const responseData = body.responseData && typeof body.responseData === "object" ? body.responseData : null;

  if (!pid) {
    return NextResponse.json({ message: "Missing pid" }, { status: 400 });
  }
  if (!refId) {
    return NextResponse.json({ message: "Missing refId" }, { status: 400 });
  }
  if (!amt) {
    return NextResponse.json({ message: "Missing amt" }, { status: 400 });
  }
  if (!productCode) {
    return NextResponse.json({ message: "Missing eSewa product code" }, { status: 500 });
  }

  await connectToDatabase();
  const order = await Order.findById(pid).lean();
  if (!order) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  if (String(order.user) !== String(user.id)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  if (order.paymentMethod !== "esewa") {
    return NextResponse.json({ message: "Order is not an eSewa payment" }, { status: 400 });
  }

  const verificationParams = new URLSearchParams({
    product_code: productCode,
    total_amount: amt,
    transaction_uuid: pid,
  });

  let text = "";
  let success = false;
  let verificationUnavailable = false;
  let apiResponseData: any = null;
  try {
    const verifyUrl = getEsewaStatusUrl();
    const sep = verifyUrl.includes("?") ? "&" : "?";
    const getUrl = verifyUrl + sep + verificationParams.toString();
    const verifyRes = await fetch(getUrl, { method: "GET" });
    text = await verifyRes.text();

    console.log(`[eSewa verify] GET ${getUrl} -> status=${verifyRes.status} pid=${pid} refId=${refId}`);
    console.log(`[eSewa verify] raw response: ${text}`);

    apiResponseData = (() => {
      try {
        return JSON.parse(text);
      } catch {
        return null;
      }
    })();

    success = Boolean(apiResponseData && (apiResponseData.status === "COMPLETE" || String(apiResponseData.message || "").toLowerCase().includes("success")));

    if (!success && verifyRes.status >= 500) {
      verificationUnavailable = true;
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    verificationUnavailable = true;
    text = message;
  }

  const responseComplete = responseData && responseData.status === "COMPLETE";
  const responseProductCode = responseData && (responseData.product_code || responseData.productCode);
  const responseAmount = responseData && String(responseData.total_amount ?? responseData.amount ?? "");
  const fallbackSuccess = Boolean(
    responseComplete &&
      String(responseProductCode || productCode) === String(productCode) &&
      String(responseAmount || amt) === String(amt)
  );

  if (verificationUnavailable && !fallbackSuccess) {
    return NextResponse.json(
      {
        paymentStatus: "pending",
        orderStatus: order.orderStatus,
        message: `eSewa verification service is currently unavailable. ${text}`,
        response: apiResponseData,
      },
      { status: 202 }
    );
  }

  if (!success && fallbackSuccess) {
    success = true;
  }

  const updates: any = {};
  if (success) {
    updates.paymentStatus = "paid";
    if (order.orderStatus === "pending") {
      updates.orderStatus = "processing";
    }
  } else {
    updates.paymentStatus = "pending";
    updates.orderStatus = order.orderStatus;
  }

  const updated = await Order.findByIdAndUpdate(pid, { $set: updates }, { new: true, runValidators: true }).lean();
  if (!updated) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({
    paymentStatus: updated.paymentStatus,
    orderStatus: updated.orderStatus,
    message: success ? "eSewa payment verified successfully." : `eSewa verification pending: ${text}`,
    response: apiResponseData || responseData,
  });
}
