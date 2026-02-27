import GrowthContent from "./growth-content";
import { auth } from "@/auth";

export default async function GrowthPage(props: { params: Promise<{ category: string }> }) {
  const params = await props.params;
  const searchParams = new URLSearchParams();
  searchParams.set("category", params.category);

  const session = await auth();
  const apiBase = process.env.API_BASE_URL || "http://localhost:5000";

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (session?.user?.apiToken) {
    headers["Authorization"] = `Bearer ${session.user.apiToken}`;
  }

  const res = await fetch(`${apiBase}/api/v1/resources?${searchParams.toString()}`, {
    cache: "no-store",
    headers,
  });

  if (!res.ok) {
    throw new Error("Failed to load resources for growth category");
  }

  const data = await res.json();
  const resources = data.items;

  return <GrowthContent category={params.category} resources={resources} />;
}
