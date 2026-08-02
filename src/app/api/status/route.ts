import { getProjectInventory } from "@/lib/inventory";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  return Response.json(await getProjectInventory(), {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
