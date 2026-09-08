export type Link = {
  label: string;
  href: string;
};

export type Service = {
  id: string;
  title: string;
  blurb: string;
};

export type CaseStudy = {
  id: string;
  name: string;
  tagline: string;
  blurb: string;
  image: string;
  photos?: string[];
  stack: string[];
  featured?: boolean;
  links?: Link[];
};

export type OtherWork = {
  title: string;
  org: string;
  date: string;
  note: string;
};

export const content = {
  name: "Mohamed El-Shenbaby",
  location: "Cairo, Egypt",
  role: "Software engineer · CRM & Django",
  headline: "I build custom CRMs and ship them to production.",
  summary:
    "Freelance software engineer. I help teams replace messy spreadsheets and outdated tools with clean Django systems they can actually run.",
  photo: `${import.meta.env.BASE_URL}profile.jpg`,
  intro:
    "I’m Mohamed — an AI Engineering student who builds real software for real teams. I focus on custom CRMs, migrations from tools like Podio, and getting products live — not just demos.",
  links: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/mohamed-el-shenbaby-433a06244/",
    },
    { label: "GitHub", href: "https://github.com/Elshenbaby" },
  ] satisfies Link[],
  contact: {
    email: "mohamedelshenbaby101@gmail.com",
    phone: "+20 122 592 8917",
    whatsapp: "https://wa.me/201225928917",
  },
  services: [
    {
      id: "crm-builds",
      title: "Custom CRM builds",
      blurb:
        "Django systems for companies, deals, members, and approvals — built for how your team actually works.",
    },
    {
      id: "migration-deploy",
      title: "Migration & deploy",
      blurb:
        "Move off Podio or legacy tools. Import your data, clean duplicates, and go live on a modern stack.",
    },
    {
      id: "dashboards",
      title: "Dashboards & automation",
      blurb:
        "Live KPI boards, sync jobs, and workflow hooks so reporting stops living in chat threads.",
    },
  ] satisfies Service[],
  caseStudies: [
    {
      id: "soluo",
      name: "Soluo",
      tagline: "National CRM for AIESEC Egypt",
      blurb:
        "Replaced an aging Podio setup with a full Django CRM — companies, deals, membership, and live sync — now running in production.",
      image: `${import.meta.env.BASE_URL}projects/soluo.png`,
      stack: ["Django", "PostgreSQL", "Docker"],
      featured: true,
      links: [
        { label: "Live site", href: "https://soluo.aiesec.org.eg" },
      ],
    },
    {
      id: "global-village-26",
      name: "Global Village 26",
      tagline: "Event website & registration",
      blurb:
        "Live event site for AIESEC Egypt’s Global Village 2026 — agenda, gallery, Culture Quest, and ticket registration.",
      image: `${import.meta.env.BASE_URL}projects/global-village.png`,
      photos: [
        `${import.meta.env.BASE_URL}projects/gv/gallery-1.jpg`,
        `${import.meta.env.BASE_URL}projects/gv/about-1.webp`,
        `${import.meta.env.BASE_URL}projects/gv/about-2.webp`,
        `${import.meta.env.BASE_URL}projects/gv/gallery-2.jpg`,
        `${import.meta.env.BASE_URL}projects/gv/about-3.webp`,
      ],
      stack: ["React", "TypeScript", "Vite"],
      links: [
        { label: "Live site", href: "https://globalvillage.aiesec.org.eg/" },
        {
          label: "Repo",
          href: "https://github.com/AIESEC-Egypt/Global-village-26",
        },
      ],
    },
    {
      id: "iris",
      name: "IRIS",
      tagline: "Analytics dashboard",
      blurb:
        "National performance dashboard so leadership can see pipeline health across Egypt in one place — auto-refreshed, not hand-built sheets.",
      image: `${import.meta.env.BASE_URL}projects/iris.png`,
      stack: ["Django", "PostgreSQL", "Redis"],
      links: [{ label: "Live site", href: "https://iris.aiesec.org.eg/" }],
    },
    {
      id: "datawallet",
      name: "DataWallet",
      tagline: "Finance tracking platform",
      blurb:
        "Full-stack app that turns spending data into clear dashboards with Power BI embedded in the product.",
      image: `${import.meta.env.BASE_URL}projects/datawallet.png`,
      stack: ["Django", "Power BI", "PostgreSQL"],
    },
    {
      id: "tanta-podio",
      name: "Booking & CRM automation",
      tagline: "Portal + workflow tools",
      blurb:
        "Calendar booking experience plus earlier Podio automation — approvals, validation, and duplicate checks that led into Soluo.",
      image: `${import.meta.env.BASE_URL}projects/automation.png`,
      stack: ["React", "Apps Script", "Podio API"],
    },
  ] satisfies CaseStudy[],
  otherWork: [
    {
      title: "Head of Public Relations (Y2B)",
      org: "AIESEC in Egypt",
      date: "2025",
      note: "PR for a large national event — influencers and media partners.",
    },
    {
      title: "Marketing & sales leadership",
      org: "AIESEC in Egypt",
      date: "2025",
      note: "Campaigns and team leadership across growth initiatives.",
    },
    {
      title: "Brand Experience Director",
      org: "AIESEC in Egypt",
      date: "2025 – Present",
      note: "National brand and customer experience strategy.",
    },
    {
      title: "GAME ON",
      org: "Sarmady Events",
      date: "2024",
      note: "Co-founded Tanta’s first board-games event.",
    },
    {
      title: "Brand representative",
      org: "Goodsmart",
      date: "2023 – 2025",
      note: "Events and promotions.",
    },
  ] satisfies OtherWork[],
};
