import { resumeResponse } from "@/lib/resume";

export async function GET() {
  return resumeResponse("attachment");
}
