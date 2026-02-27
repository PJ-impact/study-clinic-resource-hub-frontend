import DepartmentContent from "./department-content";
import { auth } from "@/auth";

interface DepartmentPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DepartmentPage(props: DepartmentPageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
  const session = await auth();

  const deptRes = await fetch(`${apiBase}/api/v1/departments/${params.slug}`, {
    cache: "no-store",
  });

  if (!deptRes.ok) {
    throw new Error("Failed to load department");
  }

  const department = await deptRes.json();

  const initialLevelParam =
    typeof searchParams?.level === "string" && searchParams.level.length > 0
      ? searchParams.level
      : undefined;

  const resourceSearchParams = new URLSearchParams();
  resourceSearchParams.set("department", department.name);
  if (initialLevelParam) {
    resourceSearchParams.set("level", initialLevelParam);
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (session?.user?.apiToken) {
    headers["Authorization"] = `Bearer ${session.user.apiToken}`;
  }

  const res = await fetch(`${apiBase}/api/v1/resources?${resourceSearchParams.toString()}`, {
    cache: "no-store",
    headers,
  });

  if (!res.ok) {
    throw new Error("Failed to load resources for department");
  }

  const data = await res.json();
  const resources = data.items;

  return (
    <DepartmentContent
      slug={params.slug}
      departmentName={department.name}
      initialLevel={initialLevelParam}
      resources={resources}
    />
  );
}
