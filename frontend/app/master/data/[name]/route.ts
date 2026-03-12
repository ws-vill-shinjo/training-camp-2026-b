import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const filePath = path.join(process.cwd(), "master/data", name);
  const text = await fs.readFile(filePath, "utf-8");
  return new NextResponse(text, {
    headers: {
      "Content-Type": "text/csv",
      "Cache-Control": "no-store",
    },
  });
}
