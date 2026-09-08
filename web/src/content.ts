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
  problem: string;
  blurb: string;
  image: string;
  photos?: string[];
  highlights?: string[];
  stack: string[];
  featured?: boolean;
  links?: Link[];
};

export type MaintainedProject = {
  id: string;
  name: string;
  tagline: string;
  blurb: string;
  image?: string;
  role: string;
  links: Link[];
};

export type Automation = {
  id: string;
  title: string;
  blurb: string;
  stack: string[];
  links?: Link[];
};

export type OtherWork = {
  title: string;
  org: string;
  date: string;
  note: string;
};

export type SkillGroup = {
  id: string;
  title: string;
  items: string[];
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
    "I'm Mohamed, an AI Engineering student who builds real software for real teams. I focus on custom CRMs, data migrations, live dashboards, and getting products into production, not just demos.",
  links: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/mohamed-el-shenbaby-433a06244/",
    },
    { label: "GitHub", href: "https://github.com/Elshenbaby" },
    {
      label: "Behance",
      href: "https://www.behance.net/mohamedayman120",
    },
  ] satisfies Link[],
  contact: {
    email: "mohamedelshenbaby101@gmail.com",
    phone: "+20 122 592 8917",
    whatsapp: "https://wa.me/201225928917",
    cv: `${import.meta.env.BASE_URL}Mohamed%20Elshenbaby%20CV.pdf`,
  },
  platforms: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/mohamed-el-shenbaby-433a06244/",
    },
    { label: "GitHub", href: "https://github.com/Elshenbaby" },
    {
      label: "Behance",
      href: "https://www.behance.net/mohamedayman120",
    },
    {
      label: "WhatsApp",
      href: "https://wa.me/201225928917",
    },
    {
      label: "Email",
      href: "mailto:mohamedelshenbaby101@gmail.com",
    },
    {
      label: "Call",
      href: "tel:+201225928917",
    },
    {
      label: "Download CV",
      href: `${import.meta.env.BASE_URL}Mohamed%20Elshenbaby%20CV.pdf`,
    },
  ] satisfies Link[],
  services: [
    {
      id: "crm-builds",
      title: "Custom CRM builds",
      blurb:
        "Django systems for companies, deals, members, and approvals, built for how your team actually works.",
    },
    {
      id: "migration-deploy",
      title: "Migration & deploy",
      blurb:
        "Move off spreadsheets or legacy tools. Import your data, clean duplicates, and go live on a modern stack.",
    },
    {
      id: "dashboards",
      title: "Dashboards & automation",
      blurb:
        "Live KPI boards, n8n workflows, and Sheets hooks so reporting stops living in chat threads.",
    },
  ] satisfies Service[],
  skillGroups: [
    {
      id: "engineering",
      title: "Engineering",
      items: [
        "Django & PostgreSQL",
        "Custom CRM architecture",
        "REST APIs",
        "Docker deploy",
        "React & TypeScript",
        "Redis & background jobs",
      ],
    },
    {
      id: "automation",
      title: "Automation",
      items: [
        "n8n workflows",
        "Webhooks & sync",
        "Google Apps Script",
        "Sheets / Drive pipelines",
        "Approval & validation flows",
        "Duplicate detection",
      ],
    },
    {
      id: "product",
      title: "Product delivery",
      items: [
        "Data migration",
        "Live dashboards",
        "Event & registration sites",
        "Interactive web experiences",
        "Production handoff",
        "Client-ready demos",
      ],
    },
    {
      id: "extras",
      title: "Extras I can support",
      items: [
        "Brand storytelling",
        "Public relations",
        "Campaign planning",
        "Event experience design",
        "Partner & media outreach",
        "Portfolio / pitch sites",
      ],
    },
  ] satisfies SkillGroup[],
  caseStudies: [
    {
      id: "soluo",
      name: "Soluo",
      tagline: "Custom CRM platform",
      problem:
        "Every Local Committee ran accounts, deals, and membership through Podio. No shared flow across committees, no single source of truth, and every report meant someone manually pulling numbers together.",
      blurb:
        "Rebuilt a legacy CRM into a full Django system for companies, deals, membership, and live sync. Now running in production.",
      image: `${import.meta.env.BASE_URL}projects/soluo.png`,
      highlights: [
        "Company & deal pipeline",
        "Membership records",
        "Approval workflows",
        "Live data sync",
      ],
      stack: ["Django", "PostgreSQL", "Docker"],
      featured: true,
      links: [{ label: "Live site", href: "https://soluo.aiesec.org.eg" }],
    },
    {
      id: "global-village-26",
      name: "Global Village 26",
      tagline: "Event website & registration",
      problem:
        "Event info and sign-ups were spread across social posts and a plain form, with no central site and no clean way to get registrations into the sheets the ops team already ran on.",
      blurb:
        "Live event site with agenda, gallery, Culture Quest, and ticket registration wired to Google Sheets and Drive.",
      image: `${import.meta.env.BASE_URL}projects/global-village-live.png`,
      highlights: ["Agenda", "Photo gallery", "Culture Quest", "Ticket registration"],
      photos: [
        `${import.meta.env.BASE_URL}projects/gv/gallery-1.jpg`,
        `${import.meta.env.BASE_URL}projects/gv/gallery-3.jpg`,
        `${import.meta.env.BASE_URL}projects/gv/about-1.webp`,
        `${import.meta.env.BASE_URL}projects/gv/about-2.webp`,
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
      problem:
        "Tracking performance across countries, regions, and local teams meant rebuilding the same spreadsheets and slide decks every week, so leadership only ever saw outdated snapshots.",
      blurb:
        "Performance dashboard so leadership can see pipeline health in one place. Auto-refreshed, not hand-built sheets.",
      image: `${import.meta.env.BASE_URL}projects/iris.png`,
      highlights: ["Rankings by branch", "Local committee deep dives", "Term comparisons", "Achiever tracking"],
      stack: ["Django", "PostgreSQL", "Redis"],
      links: [{ label: "Live site", href: "https://iris.aiesec.org.eg/" }],
    },
    {
      id: "omar-web",
      name: "Omar's Journey",
      tagline: "Interactive portfolio site",
      problem:
        "A final internship report is usually a slide deck nobody remembers past the presentation. The client wanted his Boehringer Ingelheim internship to actually stick with whoever reviewed it.",
      blurb:
        "Arcade-styled portfolio for a client internship story: playable levels, mini-games, and a photo finale instead of a slide deck.",
      highlights: ["Start screen", "Office level", "Site visits", "Pharmacy floor", "Photo finale"],
      image: `${import.meta.env.BASE_URL}projects/omar-web.png`,
      photos: [
        `${import.meta.env.BASE_URL}projects/omar/level-map.png`,
        `${import.meta.env.BASE_URL}projects/omar/level-finale.png`,
      ],
      stack: ["React", "TypeScript", "Vite"],
      links: [
        { label: "Live site", href: "https://elshenbaby.github.io/Omar-Web/" },
        { label: "Repo", href: "https://github.com/Elshenbaby/Omar-Web" },
      ],
    },
  ] satisfies CaseStudy[],
  maintained: [
    {
      id: "core",
      name: "CORE",
      tagline: "National analytics dashboard",
      blurb:
        "Large-scale performance analytics across countries, regions, and local terms. KPI boards, rankings, and term views so leadership can track results in one place.",
      image: `${import.meta.env.BASE_URL}projects/maintained-core.png`,
      role: "Contributed & maintained",
      links: [{ label: "Live site", href: "https://core.aiesec.org.eg/" }],
    },
    {
      id: "where-it-all-begins",
      name: "Where it all begins",
      tagline: "Experience Egypt story site",
      blurb:
        "Public story site that sells the Egypt experience and guides visitors into volunteer, talent, and teacher program pathways.",
      image: `${import.meta.env.BASE_URL}projects/maintained-where.png`,
      role: "Contributed & maintained",
      links: [{ label: "Live site", href: "https://whereitallbegins.aiesec.org.eg/" }],
    },
    {
      id: "impact",
      name: "IMPACT",
      tagline: "Internal knowledge hub",
      blurb:
        "Member hub for learning resources, function academies, contracts, conferences, ranking, and certificate flows. One place to learn and operate.",
      image: `${import.meta.env.BASE_URL}projects/maintained-impact.png`,
      role: "Contributed & maintained",
      links: [{ label: "Live site", href: "https://impact.aiesec.org.eg/" }],
    },
    {
      id: "raised",
      name: "RAISED",
      tagline: "Commission ranking board",
      blurb:
        "Live B2B commission ranking across branches. Visual standings by product line so teams see who is leading and act faster.",
      image: `${import.meta.env.BASE_URL}projects/maintained-raised.png`,
      role: "Contributed & maintained",
      links: [{ label: "Live site", href: "https://raised.aiesec.org.eg/" }],
    },
  ] satisfies MaintainedProject[],
  automations: [
    {
      id: "n8n-new-company",
      title: "New company intake",
      blurb:
        "When a new company is created in the CRM, a workflow picks it up and routes the data into the next ops step automatically.",
      stack: ["n8n", "Webhooks", "CRM"],
    },
    {
      id: "n8n-deals-sync",
      title: "Deal pipeline sync",
      blurb:
        "Create, update, and delete events on deals fire a workflow that keeps the deal index and downstream tools in sync.",
      stack: ["n8n", "Webhooks", "CRM"],
    },
    {
      id: "crm-approvals",
      title: "CRM approval engine",
      blurb:
        "Automation for CRM validation, approvals, and duplicate checks across branches. The workflow layer before a full Django CRM rebuild.",
      stack: ["Apps Script", "Sheets", "REST APIs"],
      links: [
        {
          label: "Repo",
          href: "https://github.com/Elshenbaby/podio-b2c-automation-approval-engine",
        },
      ],
    },
  ] satisfies Automation[],
  otherWork: [
    {
      title: "Head of Public Relations",
      org: "National youth event",
      date: "2025",
      note: "PR for a large national event, influencers and media partners.",
    },
    {
      title: "Marketing & sales leadership",
      org: "National youth network",
      date: "2025",
      note: "Campaigns and team leadership across growth initiatives.",
    },
    {
      title: "Brand Experience Director",
      org: "National youth network",
      date: "2025 - Present",
      note: "National brand and customer experience strategy.",
    },
    {
      title: "GAME ON",
      org: "Sarmady Events",
      date: "2024",
      note: "Co-founded Tanta's first board-games event.",
    },
    {
      title: "Brand representative",
      org: "Goodsmart",
      date: "2023 - 2025",
      note: "Events and promotions.",
    },
  ] satisfies OtherWork[],
};
