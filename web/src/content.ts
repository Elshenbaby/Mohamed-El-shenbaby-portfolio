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

export const content = {
  name: "Mohamed El-Shenbaby",
  location: "Cairo, Egypt",
  role: "Software engineer · CRM & Django",
  headline: "I build custom CRMs and ship them to production.",
  summary:
    "Freelance software engineer. I help teams replace messy spreadsheets and outdated tools with clean Django systems they can actually run.",
  photo: `${import.meta.env.BASE_URL}profile.jpg`,
  intro:
    "I'm Mohamed, an AI Engineering student who builds real software for real teams. I focus on custom CRMs, migrations from tools like Podio, and getting products live, not just demos.",
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
        "Move off Podio or legacy tools. Import your data, clean duplicates, and go live on a modern stack.",
    },
    {
      id: "dashboards",
      title: "Dashboards & automation",
      blurb:
        "Live KPI boards, n8n workflows, and Apps Script / Sheets hooks so reporting stops living in chat threads.",
    },
  ] satisfies Service[],
  caseStudies: [
    {
      id: "soluo",
      name: "Soluo",
      tagline: "Custom CRM platform",
      blurb:
        "Replaced an aging Podio setup with a full Django CRM for companies, deals, membership, and live sync. Now running in production.",
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
        "Live event site with agenda, gallery, Culture Quest, and ticket registration wired to Google Sheets and Drive.",
      image: `${import.meta.env.BASE_URL}projects/global-village-live.png`,
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
      blurb:
        "Performance dashboard so leadership can see pipeline health in one place. Auto-refreshed, not hand-built sheets.",
      image: `${import.meta.env.BASE_URL}projects/iris.png`,
      stack: ["Django", "PostgreSQL", "Redis"],
      links: [{ label: "Live site", href: "https://iris.aiesec.org.eg/" }],
    },
    {
      id: "omar-web",
      name: "Omar's Journey",
      tagline: "Interactive portfolio site",
      blurb:
        "Arcade-styled portfolio for a client internship story: playable levels, mini-games, and a photo finale instead of a slide deck.",
      image: `${import.meta.env.BASE_URL}projects/omar-web.png`,
      stack: ["React", "TypeScript", "Vite"],
      links: [
        { label: "Live site", href: "https://elshenbaby.github.io/Omar-Web/" },
        { label: "Repo", href: "https://github.com/Elshenbaby/Omar-Web" },
      ],
    },
  ] satisfies CaseStudy[],
  automations: [
    {
      id: "n8n-new-company",
      title: "New company intake",
      blurb:
        "When a new company is created in the CRM, an n8n workflow picks it up and routes the data into the next ops step automatically.",
      stack: ["n8n", "Webhooks", "CRM"],
      links: [{ label: "n8n", href: "https://n8n.aiesec.org.eg" }],
    },
    {
      id: "n8n-deals-sync",
      title: "Deal pipeline sync",
      blurb:
        "Create, update, and delete events on deals fire an n8n workflow that keeps the deal index and downstream tools in sync.",
      stack: ["n8n", "Webhooks", "CRM"],
      links: [{ label: "n8n", href: "https://n8n.aiesec.org.eg" }],
    },
    {
      id: "crm-approvals",
      title: "CRM approval engine",
      blurb:
        "Apps Script automation for CRM validation, approvals, and duplicate checks across branches. The workflow layer before the full Django CRM rebuild.",
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
      title: "Head of Public Relations (Y2B)",
      org: "AIESEC in Egypt",
      date: "2025",
      note: "PR for a large national event, influencers and media partners.",
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
