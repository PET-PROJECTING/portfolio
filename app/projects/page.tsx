import { Suspense } from "react";
import Projects from "@/app/components/Projects";

type ProjectsSearchParams = {
  project?: string | string[];
  open?: string | string[];
  from?: string | string[];
};

type ProjectsPageProps = {
  searchParams: Promise<ProjectsSearchParams>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function ProjectsFromSearchParams({
  searchParams,
}: {
  searchParams: Promise<ProjectsSearchParams>;
}) {
  const params = await searchParams;
  const initialProjectSlug = firstParam(params.project);
  const openDrawer = firstParam(params.open) === "1";
  const fromTeaser = firstParam(params.from) === "teaser";
  const entryKey = `${initialProjectSlug ?? ""}:${openDrawer ? "1" : "0"}:${fromTeaser ? "teaser" : ""}`;

  return (
    <Projects
      key={entryKey}
      initialProjectSlug={initialProjectSlug}
      openDrawer={openDrawer}
      fromTeaser={fromTeaser}
    />
  );
}

export default function ProjectsPage({ searchParams }: ProjectsPageProps) {
  return (
    <Suspense fallback={null}>
      <ProjectsFromSearchParams searchParams={searchParams} />
    </Suspense>
  );
}
