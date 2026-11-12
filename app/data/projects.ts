export type ProjectLinkType =
  | "demo"
  | "github"
  | "npm"
  | "openvsx"
  | "site";

export type ProjectLink = {
  type: ProjectLinkType;
  label: string;
  href: string;
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  overview: string;
  stack: string;
  image: string;
  links: ProjectLink[];
};

export function projectGalleryHref(
  slug: string,
  options?: { open?: boolean; from?: "teaser" },
) {
  const params = new URLSearchParams();
  params.set("project", slug);
  if (options?.open) params.set("open", "1");
  if (options?.from) params.set("from", options.from);
  return `/projects?${params.toString()}`;
}

export function findProjectIndexBySlug(slug: string | undefined | null) {
  if (!slug) return null;
  const index = projects.findIndex((project) => project.slug === slug);
  return index >= 0 ? index : null;
}

export const projects: Project[] = [
  {
    slug: "essential-skills",
    title: "Essential Skills",
    category: "Agent skills CLI",
    overview:
      "Interactive CLI that installs a curated agent-skills pack into Cursor, Claude Code, Codex, Copilot, and friends — Quick or Full presets, global or project scope — with a Next.js site for the catalog.",
    stack: "Node.js / Clack / Next.js / React / TypeScript / Tailwind CSS",
    image: "/projects/essential-skills.jpg",
    links: [
      {
        type: "demo",
        label: "Demo",
        href: "https://essential-skills.vercel.app/",
      },
      {
        type: "github",
        label: "GitHub",
        href: "https://github.com/PET-PROJECTING/essential-skills",
      },
      {
        type: "npm",
        label: "npm",
        href: "https://www.npmjs.com/package/essential-skills",
      },
      {
        type: "github",
        label: "Site repo",
        href: "https://github.com/PET-PROJECTING/essential-skills-site",
      },
    ],
  },
  {
    slug: "sticky-card-stack",
    title: "Sticky Card Stack",
    category: "React library",
    overview:
      "React sticky card stack powered by GSAP ScrollTrigger and Lenis — cards pin, scale, and layer as you scroll, published as an installable package.",
    stack: "React / TypeScript / GSAP / Lenis / Vite",
    image: "/projects/sticky-card-stack.jpg",
    links: [
      {
        type: "npm",
        label: "npm",
        href: "https://www.npmjs.com/package/sticky-card-stack",
      },
      {
        type: "github",
        label: "GitHub",
        href: "https://github.com/PET-PROJECTING/sticky-card-stack",
      },
    ],
  },
  {
    slug: "convo-kit",
    title: "Convo Kit",
    category: "Real-time chat",
    overview:
      "Real-time chat widget with a client launcher and an admin dashboard for conversations, stats, and availability — Socket.IO end to end.",
    stack:
      "React / TypeScript / Vite / Tailwind CSS / Socket.IO / Express / Prisma",
    image: "/projects/convo-kit.jpg",
    links: [
      {
        type: "github",
        label: "GitHub",
        href: "https://github.com/PET-PROJECTING/convo_kit",
      },
    ],
  },
  {
    slug: "online-paint",
    title: "Online Paint",
    category: "Collaborative drawing",
    overview:
      "Collaborative canvas — create a room, share the link, draw in sync with brush, shapes, grid, and undo, persisted over WebSocket.",
    stack: "React / Vite / MobX / Tailwind CSS / Express / WebSocket",
    image: "/projects/online-paint.jpg",
    links: [
      {
        type: "github",
        label: "GitHub",
        href: "https://github.com/PET-PROJECTING/online_paint",
      },
    ],
  },
  {
    slug: "light-spinel",
    title: "Light Spinel",
    category: "Editor theme",
    overview:
      "A light, refined color theme for Cursor and VS Code, published on OpenVSX.",
    stack: "VS Code Theme / JSON",
    image: "/projects/light-spinel.jpg",
    links: [
      {
        type: "openvsx",
        label: "OpenVSX",
        href: "https://open-vsx.org/extension/beforeblackout/light-spinel",
      },
      {
        type: "github",
        label: "GitHub",
        href: "https://github.com/PET-PROJECTING/light-spinel-vscode-theme",
      },
    ],
  },
  {
    slug: "neovim-ui",
    title: "Neovim UI",
    category: "VS Code / Neovim extension",
    overview:
      "VS Code companion for vscode-neovim — cursor and status bar colors follow Neovim mode, with per-mode customization.",
    stack: "JavaScript / VS Code API",
    image: "/projects/nvim-ui.jpg",
    links: [
      {
        type: "openvsx",
        label: "OpenVSX",
        href: "https://open-vsx.org/extension/beforeblackout/nvim-dynamic-ui-modesq",
      },
      {
        type: "github",
        label: "GitHub",
        href: "https://github.com/PET-PROJECTING/nvim-ui",
      },
    ],
  },
];
