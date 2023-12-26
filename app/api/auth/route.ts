import { getServerSession } from "@/lib/firebase/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: Response) {
  const data = await getServerSession();
  return Response.json({ data: data ?? "23" });
}
