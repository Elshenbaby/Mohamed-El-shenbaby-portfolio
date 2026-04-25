const data = {
  achievements: [
    {
      title: '800+ attendee event',
      description: 'Led PR for a large-scale event and secured 30+ influencers plus 10+ media partners.',
    },
    {
      title: '3000+ leads',
      description: 'Drove partnerships and lead generation through marketing, PR, and sales work.',
    },
    {
      title: '1000+ interviews',
      description: 'Used user insights to improve campaigns, experience, and decision-making.',
    },
    {
      title: '30-person teams',
      description: 'Managed and developed teams across online and offline campaigns.',
    },
  ],
  skills: {
    'Data & Analytics': ['SQL', 'Data Modeling', 'Power BI', 'Tableau', 'Funnel Analysis', 'KPI Tracking'],
    'Backend & Automation': ['Python', 'Django', 'PostgreSQL', 'Redis', 'Celery', 'Docker', 'REST APIs'],
    'Product & Growth': ['Product Thinking', 'Growth Strategy', 'Market Research', 'User Research', 'Campaign Strategy'],
    Design: ['Graphic Design', 'Video Editing'],
  },
  experience: [
    {
      title: 'Brand Experience Director (Marketing & B2C)',
      org: 'AIESEC in Egypt',
      date: 'Jul 2025 – Present',
      bullets: [
        'Lead national B2C strategy and drive user acquisition and engagement.',
        'Design user journeys and execute data-driven marketing campaigns.',
        'Build KPI tracking systems and dashboards for cross-functional alignment.',
      ],
    },
    {
      title: 'Marketing & Sales Leadership (Volunteer)',
      org: 'AIESEC in Egypt',
      date: 'Feb 2025 – May 2025',
      bullets: [
        'Contributed to 3000+ leads and partnerships with 10+ organizations.',
        'Managed teams of up to 30 members executing online/offline campaigns.',
      ],
    },
    {
      title: 'Head of Public Relations',
      org: 'Y2B v2',
      date: 'Feb 2025 – Jul 2025',
      bullets: ['Led PR for an 800+ attendee event.', 'Secured 30+ influencers and 10+ media partners.'],
    },
    {
      title: 'Co-Founder',
      org: 'Sarmady Events',
      date: 'Jul 2024 – Oct 2024',
      bullets: ['Founded and managed an event agency across operations, marketing, and partnerships.'],
    },
    {
      title: 'Brand Representative',
      org: 'Goodsmart',
      date: 'Feb 2023 – Feb 2025',
      bullets: ['Represented the brand at events and supported marketing and business development.'],
    },
  ],
  projects: [
    {
      name: 'DataWallet – Financial Analytics Platform',
      subtitle: 'Full-stack tracking and analytics for financial behavior.',
      tech: ['Django', 'PostgreSQL', 'Celery', 'Redis', 'Docker'],
    },
    {
      name: 'IRIS – Analytics & KPI Dashboard Platform',
      subtitle: 'Multi-location KPI monitoring with drill-down insights.',
      tech: ['Django', 'SQLite', 'Power BI', 'Python'],
    },
    {
      name: 'B2C CRM Automation',
      subtitle: 'API-based CRM workflows, validation, and approval logic.',
      tech: ['Google Apps Script', 'REST APIs'],
    },
    {
      name: 'Tanta Club Portal',
      subtitle: 'Responsive booking system with calendar-based reservations.',
      tech: ['React', 'TypeScript', 'Tailwind CSS'],
    },
  ],
  education: [
    {
      title: 'B.Sc. in Artificial Intelligence Engineering',
      org: 'Tanta University',
      date: '2022 – 2027 • Currently studying',
    },
    {
      title: 'Digital Egypt Pioneers Initiative (DEPI)',
      org: 'MCIT',
      date: 'Data Analytics Track • Certification',
    },
  ],
};

const $ = (sel) => document.querySelector(sel);

function card(html, className = '') {
  const div = document.createElement('article');
  div.className = `card ${className}`.trim();
  div.innerHTML = html;
  return div;
}

function renderAchievements() {
  const root = $('#achievements');
  data.achievements.forEach((item) => {
    root.appendChild(card(`<strong>${item.title}</strong><p>${item.description}</p>`));
  });
}

function renderSkills() {
  const root = $('#skillsGrid');
  Object.entries(data.skills).forEach(([category, skills]) => {
    root.appendChild(
      card(
        `<strong>${category}</strong><ul class="pills">${skills.map((skill) => `<li class="pill">${skill}</li>`).join('')}</ul>`,
      ),
    );
  });
}

function renderExperience() {
  const root = $('#timeline');
  data.experience.forEach((exp) => {
    const item = document.createElement('article');
    item.className = 'timeline-item';
    item.innerHTML = `
      <p class="kicker">${exp.date}</p>
      <h4>${exp.title}</h4>
      <p>${exp.org}</p>
      <ul>${exp.bullets.map((bullet) => `<li>${bullet}</li>`).join('')}</ul>
    `;
    root.appendChild(item);
  });
}

function renderProjects() {
  const root = $('#projectsGrid');
  data.projects.forEach((project) => {
    root.appendChild(
      card(
        `<div class="thumb">🎨</div><strong>${project.name}</strong><p class="meta">${project.subtitle}</p><ul class="pills">${project.tech.map((tech) => `<li class="pill">${tech}</li>`).join('')}</ul>`,
        'project',
      ),
    );
  });
}

function renderEducation() {
  const root = $('#educationGrid');
  data.education.forEach((edu) => {
    root.appendChild(card(`<strong>${edu.title}</strong><p>${edu.org}</p><p>${edu.date}</p>`));
  });
}

function setupTheme() {
  const button = $('#themeToggle');
  const body = document.body;
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    body.classList.add('theme-dark');
    button.textContent = '☀';
  }

  button.addEventListener('click', () => {
    body.classList.toggle('theme-dark');
    const dark = body.classList.contains('theme-dark');
    button.textContent = dark ? '☀' : '☾';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  });
}

function setupReveal() {
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 },
  );

  items.forEach((item) => observer.observe(item));
}

renderAchievements();
renderSkills();
renderExperience();
renderProjects();
renderEducation();
setupTheme();
setupReveal();
