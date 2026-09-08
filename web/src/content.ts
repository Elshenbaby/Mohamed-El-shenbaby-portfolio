export type Link = {
  label: string;
  href: string;
};

export type Service = {
  id: string;
  label: string;
  title: string;
  blurb: string;
};

export type CaseStudy = {
  id: string;
  quest: string;
  name: string;
  role: string;
  summary: string;
  problem: string;
  build: string[];
  outcomes: string[];
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

export type ProcessStep = {
  step: string;
  title: string;
  blurb: string;
};

export const content = {
  name: "Mohamed El-Shenbaby",
  location: "Cairo, Egypt",
  role: "Django CRM engineer",
  headline: "I design, build, and deploy custom CRMs and operational platforms.",
  summary:
    "Freelance Django software engineer focused on CRM / AMS builds, legacy migrations, and production ops tooling. Best proof: Soluo — a national Django CRM that replaced Podio for AIESEC Egypt.",
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
      label: "Loadout 01",
      title: "Custom CRM / AMS builds",
      blurb:
        "Django + HTMX + Postgres systems for pipelines, membership, approvals, and day-to-day ops — built to ship, not sit in a slide deck.",
    },
    {
      id: "migration-deploy",
      label: "Loadout 02",
      title: "CRM migration & production deploy",
      blurb:
        "Podio / legacy → Docker / Coolify. Import, dedupe, sync rules, and a clean cutover so teams keep working while the stack upgrades.",
    },
    {
      id: "ops-automation",
      label: "Loadout 03",
      title: "Ops dashboards & workflow automation",
      blurb:
        "KPI boards, API sync, notifications, and n8n / webhook bridges that turn scattered ops into one reliable loop.",
    },
  ] satisfies Service[],
  caseStudies: [
    {
      id: "soluo",
      quest: "Main quest",
      name: "Soluo — AIESEC Egypt EMS",
      role: "Django CRM · Podio migration · production deploy",
      summary:
        "National membership & company CRM that replaced Podio AMS. Live at soluo.aiesec.org.eg.",
      problem:
        "AIESEC Egypt ran core B2C / company ops on Podio AMS — brittle at national scale, hard to extend, and expensive to keep as the system of record.",
      build: [
        "Designed and shipped a Django 5 + HTMX + Postgres CRM for companies, deals, claim/stale rules, and membership roster.",
        "Built Podio import plus create-only API sync, fuzzy dedupe, notifications, analytics, and n8n webhook hooks.",
        "Packaged with Gunicorn + Docker and deployed on Coolify for a production cutover.",
      ],
      outcomes: [
        "Production CRM live for national ops at soluo.aiesec.org.eg",
        "Podio AMS replaced as the primary membership / company system",
        "Import + sync path for large historical company datasets without inventing vanity metrics",
      ],
      stack: [
        "Django 5",
        "HTMX",
        "PostgreSQL",
        "Gunicorn",
        "Docker",
        "Coolify",
        "n8n",
      ],
      featured: true,
      links: [
        { label: "Live", href: "https://soluo.aiesec.org.eg" },
        {
          label: "Repo",
          href: "https://github.com/AIESEC-Egypt/New-Podio",
        },
      ],
    },
    {
      id: "global-village-26",
      quest: "Quest 02",
      name: "Global Village 26",
      role: "Event web platform · lead front-end · AIESEC Egypt",
      summary:
        "Interactive Vite + React landing for AIESEC Egypt’s Global Village 2026 — hero countdown, agenda, Culture Quest, gallery, and registration into Sheets / Drive.",
      problem:
        "The national cultural-exchange event needed a public site that could carry venue, agenda, and gallery storytelling and accept real registrations — not a static brochure that fakes thank-you states.",
      build: [
        "Shipped Vite + React + TypeScript + Tailwind v4 with Framer Motion: hero (video / countdown / CTA), about with parallax, scroll agenda, Culture Quest game, gallery lightbox, and Nile University map section.",
        "Built a multi-step Register flow with client-side image compression and submit to a Google Apps Script backend (Sheets row + Drive uploads + backup email) so confirmation only fires after a real write.",
        "Configured CI to build and SSH-deploy dist to the event host; credited as developer in the project config.",
      ],
      outcomes: [
        "Public event funnel for Global Village 2026 under AIESEC Egypt",
        "Registration path wired to Sheets / Drive / email ops intake",
        "Interactive Culture Quest + gallery beyond a one-page brochure",
      ],
      stack: [
        "React",
        "TypeScript",
        "Vite",
        "Tailwind CSS v4",
        "Framer Motion",
        "Google Apps Script",
      ],
      links: [
        {
          label: "Repo",
          href: "https://github.com/AIESEC-Egypt/Global-village-26",
        },
      ],
    },
    {
      id: "iris",
      quest: "Quest 03",
      name: "IRIS — OGX Analytics Dashboard",
      role: "Django KPI / ops dashboard",
      summary:
        "National OGX analytics platform tracking pipeline performance across AIESEC Egypt’s local committees.",
      problem:
        "Leadership needed real-time visibility into OGX pipeline health across 19 LCs — product mix, rankings, YoY, and channel attribution — without spreadsheet sprawl.",
      build: [
        "Built Django dashboards for national KPIs, product breakdowns, LC rankings, and deep-dive views.",
        "Automated GraphQL sync from EXPA & Alpha via Celery Beat; Redis for cache/queue.",
        "Deployed with Docker + Gunicorn + WhiteNoise.",
      ],
      outcomes: [
        "Single source of truth for national OGX KPIs",
        "Automated refresh instead of manual report pulls",
        "Live at iris.aiesec.org.eg",
      ],
      stack: [
        "Django 5.2",
        "PostgreSQL",
        "Redis",
        "Celery",
        "GraphQL",
        "Chart.js",
        "Docker",
      ],
      links: [{ label: "Live", href: "https://iris.aiesec.org.eg/" }],
    },
    {
      id: "datawallet",
      quest: "Quest 04",
      name: "DataWallet",
      role: "Full-stack Django + BI",
      summary:
        "DEPI graduation platform that turns spending data into a BI-backed financial insight system.",
      problem:
        "Personal and cohort financial data lived in scattered sheets — no modeled store, no YoY view, no embedded analytics in one product.",
      build: [
        "Designed a SQL data model and Django web app for tracking and analysis.",
        "Embedded Power BI dashboards and YoY financial views on top of the backend.",
        "Shipped full frontend and backend as a cohesive BI platform.",
      ],
      outcomes: [
        "End-to-end Django + Power BI financial analytics product",
        "Reusable pattern for embedding BI inside an ops web app",
      ],
      stack: ["Django", "PostgreSQL / SQLite", "Power BI", "Celery", "Redis", "Docker"],
    },
    {
      id: "tanta-podio",
      quest: "Quest 05",
      name: "Tanta Club Portal & Podio CRM automation",
      role: "Supporting engineering proof",
      summary:
        "Booking portal work plus earlier Apps Script / Podio pipelines that informed the Soluo migration path.",
      problem:
        "Ops teams needed calendar booking UX and CRM validation / approval flows before a full Django CRM existed.",
      build: [
        "Built a responsive booking experience with calendar-based reservations (React + TypeScript).",
        "Earlier: Google Apps Script automation for Podio — pipelines, validation, approvals, fuzzy duplicate detection across branches.",
      ],
      outcomes: [
        "Hands-on CRM workflow automation before the Soluo rebuild",
        "Frontend booking proof alongside backend ops tooling",
      ],
      stack: [
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Google Apps Script",
        "Podio API",
      ],
      links: [
        {
          label: "Podio automation",
          href: "https://github.com/Elshenbaby/podio-b2c-automation-approval-engine",
        },
      ],
    },
  ] satisfies CaseStudy[],
  stack: {
    Core: ["Python", "Django", "HTMX", "PostgreSQL", "REST APIs"],
    "Ship & run": ["Docker", "Gunicorn", "Coolify", "Redis", "Celery"],
    "Ops glue": ["n8n", "Google Apps Script", "GraphQL", "Power BI"],
    Frontend: ["React", "TypeScript", "Tailwind CSS"],
  } as Record<string, string[]>,
  process: [
    {
      step: "01",
      title: "Map the ops",
      blurb:
        "Pipelines, roles, and failure points — what the CRM must protect before a single model ships.",
    },
    {
      step: "02",
      title: "Build the core loop",
      blurb:
        "Django models, HTMX flows, and the daily path users actually click — not a feature cemetery.",
    },
    {
      step: "03",
      title: "Migrate & harden",
      blurb:
        "Import, dedupe, sync rules, and staging cutovers so legacy data survives the move.",
    },
    {
      step: "04",
      title: "Deploy & hand off",
      blurb:
        "Docker / Coolify production, monitoring hooks, and docs your team can run without me in the room.",
    },
  ] satisfies ProcessStep[],
  otherWork: [
    {
      title: "Head of Public Relations (Y2B v2)",
      org: "AIESEC in Egypt",
      date: "Feb 2025 – Jul 2025",
      note: "PR for 800+ attendee national event; 30+ influencers and 10+ media partners.",
    },
    {
      title: "Marketing & Sales Leadership",
      org: "AIESEC in Egypt",
      date: "Feb 2025 – May 2025",
      note: "Campaigns and team leadership contributing to 3000+ leads and multi-org partnerships.",
    },
    {
      title: "Brand Experience Director (Marketing & B2C)",
      org: "AIESEC in Egypt",
      date: "Jul 2025 – Present",
      note: "National B2C strategy, journeys, and KPI systems across Egypt.",
    },
    {
      title: "GAME ON — Sarmady Events",
      org: "Sarmady Events (Co-Founder)",
      date: "2024",
      note: "Tanta’s first board-games event; partners, sponsors, and profitable ticket sell-through.",
    },
    {
      title: "Brand Representative",
      org: "Goodsmart",
      date: "2023 – 2025",
      note: "Event and promo representation supporting marketing and BD.",
    },
    {
      title: "Graphic design",
      org: "Independent",
      date: "Ongoing",
      note: "Visual work for campaigns and products — secondary to software delivery.",
    },
  ] satisfies OtherWork[],
  about:
    "AI Engineering student at Tanta University who ships production Django systems for real orgs. I care about CRMs that ops teams actually use — migration paths, deploy discipline, and interfaces that don’t fight the workflow.",
  education: [
    {
      title: "B.Sc. in Artificial Intelligence Engineering",
      org: "Tanta University",
      date: "2022 – 2027",
    },
    {
      title: "DEPI — Data Analytics Track",
      org: "MCIT",
      date: "Certification",
    },
  ] as { title: string; org: string; date: string }[],
  languages: ["Arabic (Native)", "English (Advanced)"],
};
