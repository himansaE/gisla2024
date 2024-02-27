import { withAPIAuthProtection } from "@/lib/auth/guards";
import { NewResponse, ResponseDone, ResponseError } from "@/lib/request";

export async function POST(req: Request) {
  const user = await withAPIAuthProtection();
  if (user == false)
    return NewResponse(ResponseError("Error: 401. Can't access."), 401);
  return NewResponse(ResponseDone());
}
