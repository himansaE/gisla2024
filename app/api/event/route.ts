export const runtime = "edge";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
let i = 0;

export async function GET() {
  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode("<html><body>"));
      controller.enqueue(encoder.encode("<p><p>"));
      await delay(500);
      let i = 0;
      while (i < 100) {
        controller.enqueue(encoder.encode(`${i}<br>`));
        await delay(500);
        i++;
      }
      controller.enqueue(encoder.encode("</body></html>"));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
