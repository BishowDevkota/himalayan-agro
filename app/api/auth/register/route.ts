import { NextResponse } from "next/server";

export async function POST(req: Request) {
  return NextResponse.json(
    {
      message:
        "Customer self-registration is closed. If you are a customer, please visit your nearest outlet. For online purchase, apply as a distributor.",
      registerDistributorUrl: "/register/distributor",
    },
    { status: 403 }
  );
}