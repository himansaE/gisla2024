import { withAuthProtection } from "@/lib/auth/guards";
export default async function Page() {
  const user = await withAuthProtection();

  return <button>ihefewif</button>;
}
