import { NextResponse } from "next/server";

export function get() {
  return NextResponse.json({ message: "Hello from the API!" });
}