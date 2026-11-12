import { get } from "@vercel/blob";
import { NextResponse } from "next/server";

function resumePathname() {
  const pathname = process.env.RESUME_BLOB_PATHNAME?.trim();
  if (!pathname) {
    throw new Error(
      "RESUME_BLOB_PATHNAME is not set. Set it to the blob pathname of the PDF to serve.",
    );
  }
  return pathname;
}

function downloadFilename(pathname: string) {
  const base = pathname.split("/").pop()?.trim() || "resume.pdf";
  return base.replace(/[\r\n"]/g, "");
}

export async function resumeResponse(disposition: "inline" | "attachment") {
  const pathname = resumePathname();
  const file = await get(pathname, {
    access: "private",
    useCache: false,
  });

  if (!file || file.statusCode !== 200) {
    return new NextResponse("Not found", { status: 404 });
  }

  const filename = downloadFilename(pathname);

  return new NextResponse(file.stream, {
    headers: {
      "Content-Type": file.blob.contentType || "application/pdf",
      "Content-Disposition": `${disposition}; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
