import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { tag: string } }
) {
  const secret = request.nextUrl.searchParams.get("secret");
  const expectedSecret = process.env.REVALIDATE_SECRET;

  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const tag = params.tag;
  revalidateTag(tag);

  return NextResponse.json({ revalidated: tag });
}
