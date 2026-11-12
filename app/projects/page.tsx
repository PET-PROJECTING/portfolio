import Projects from "@/app/components/Projects";

type ProjectsPageProps = {
  searchParams: Promise<{
    project?: string | string[];
    open?: string | string[];
    from?: string | string[];
  }>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
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
