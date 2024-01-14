import { withAuthProtection } from "@/lib/auth/guards";

export default async function Page() {
  const user = withAuthProtection();

  return (
    <div className="px-3 py-7">
      <h1 className="text-3xl font-semibold">Your submitted Artworks.</h1>
    </div>
  );
}
