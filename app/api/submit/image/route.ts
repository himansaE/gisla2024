import { ResponseDone } from "@/lib/request";

export async function POST(req: Request) {
  console.log();
  req.formData();
  return new Response(JSON.stringify(ResponseDone({ error: "" })));
}
