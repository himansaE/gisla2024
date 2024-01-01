import { collection } from "@/lib/mongodb/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const encoder = new TextEncoder();
  let count = 0;
  const readable = new ReadableStream({
    async start(controller) {
      const stream = collection.watch();
      stream.on("change", (n: any) => {
        if (n.fullDocument) {
          controller.enqueue(
            encoder.encode(`data :${n.fullDocument.state} \n\n`)
          );
          count++;
          if (count > 10) {
            controller.close();
          }
        }
        return;
      });
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
