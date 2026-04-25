export type Link = {
  label: string;
  href: string;
};

export type Experience = {
  title: string;
  org: string;
  location?: string;
  date: string;
  bullets: string[];
};

export type Project = {
  name: string;
  subtitle: string;
  bullets: string[];
  tech: string[];
  links?: Link[];
};

export const content = {
  name: "Mohamed Elshenaby",
  location: "Cairo, Egypt",
  headline:
    "Product & Data Analyst • Growth/Marketing • AI Engineering Student • Designer",
  summary:
    "Product-oriented data analyst with hands-on experience building analytics systems, KPI dashboards, and automation used in real operational environments. I connect user behavior, business strategy, and data engineering to turn raw data into decision-making systems.",
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
  },
  highlights: [
    "Led PR for an 800+ attendee event; secured 30+ influencers and 10+ media partners.",
    "Drove 3000+ leads and partnerships with 10+ organizations through marketing, PR, and sales roles.",
    "Conducted 1000+ user interviews; used insights + analysis to optimize campaigns and customer experience.",
    "Managed and developed teams up to 30 members across online/offline campaigns.",
  ],
  skills: {
    "Data & Analytics": [
      "SQL",
      "Data Modeling",
      "Power BI",
      "Tableau",
      "Funnel Analysis",
      "KPI Design & Tracking",
      "Machine Learning Fundamentals",
    ],
    "Backend & Automation": [
      "Python",
      "Django",
      "PostgreSQL",
      "Redis",
      "Celery",
      "Docker",
      "Google Apps Script",
      "REST APIs",
    ],
    "Product & Growth": [
      "Product Thinking",
      "Growth Strategy",
      "Market Research",
      "User Research",
      "Campaign Strategy",
    ],
    "Design": ["Graphic Design", "Video Editing"],
  } as Record<string, string[]>,
  experience: [
    {
      title: "Brand Experience Director (Marketing & B2C)",
      org: "AIESEC in Egypt",
      date: "Jul 2025 – Present",
      bullets: [
        "Lead national B2C strategy; drive user acquisition and engagement across Egypt.",
        "Design end-to-end user journeys and execute data-driven marketing campaigns.",
        "Build KPI tracking systems and dashboards; align cross-functional teams using market insights.",
      ],
    },
    {
      title: "Marketing & Sales Leadership (Volunteer)",
      org: "AIESEC in Egypt",
      date: "Feb 2025 – May 2025",
      bullets: [
        "Led marketing, PR, and sales initiatives; contributed to 3000+ leads and partnerships with 10+ organizations.",
        "Managed and developed teams (up to 30 members) executing online/offline campaigns.",
      ],
    },
    {
      title: "Head of Public Relations (Y2B v2)",
      org: "AIESEC in Egypt",
      date: "Feb 2025 – Jul 2025",
      bullets: [
        "Led PR for an 800+ attendee event.",
        "Secured 30+ influencers and 10+ media partners.",
      ],
    },
    {
      title: "Co-Founder",
      org: "Sarmady Events",
      date: "Jul 2024 – Oct 2024",
      bullets: [
        "Founded and managed an event agency across operations, marketing, and partnerships.",
        "Launched events exceeding attendance and engagement targets.",
      ],
    },
    {
      title: "Brand Representative",
      org: "Goodsmart",
      date: "Feb 2023 – Feb 2025",
      bullets: [
        "Represented the brand at events and promotions; supported marketing and business development.",
      ],
    },
  ] satisfies Experience[],
  projects: [
    {
      name: "DataWallet – Financial Analytics Platform",
      subtitle: "Full-stack tracking + analytics for financial behavior",
      bullets: [
        "Built a full-stack system for tracking and analyzing financial behavior.",
        "Designed a SQL data model and interactive dashboards for decision-making.",
        "Integrated Power BI into a web-based platform.",
      ],
      tech: ["Django", "PostgreSQL", "Celery", "Redis", "Docker"],
    },
    {
      name: "IRIS – Analytics & KPI Dashboard Platform",
      subtitle: "Multi-location KPI monitoring with drill-down insights",
      bullets: [
        "Built an analytics platform to monitor multi-location performance.",
        "Developed KPI dashboards, funnel tracking, and drill-down insights.",
        "Applied data-quality rules and automated data refresh.",
      ],
      tech: ["Django", "SQLite", "Power BI", "Python"],
    },
    {
      name: "B2C CRM Automation (Podio Integration)",
      subtitle: "API-based CRM workflows + validation",
      bullets: [
        "Built an automation system for CRM data processing.",
        "Developed pipelines, validation logic, and approval workflows.",
        "Implemented duplicate detection using fuzzy matching.",
      ],
      tech: ["Google Apps Script", "REST APIs"],
    },
    {
      name: "Tanta Club Portal – Booking System",
      subtitle: "Responsive booking with calendar-based reservations",
      bullets: [
        "Developed a booking platform with calendar-based reservations.",
        "Built a scalable frontend using React and TypeScript.",
      ],
      tech: ["React", "TypeScript", "Tailwind CSS"],
    },
  ] satisfies Project[],
  education: [
    {
      title: "B.Sc. in Artificial Intelligence Engineering",
      org: "Tanta University",
      date: "2022 – 2027 • Currently studying",
    },
    {
      title: "Digital Egypt Pioneers Initiative (DEPI) – Data Analytics Track",
      org: "MCIT",
      date: "Certification",
    },
  ] as { title: string; org: string; date: string }[],
  languages: ["Arabic (Native)", "English (Advanced)"],
};
