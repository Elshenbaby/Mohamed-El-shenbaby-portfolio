import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { content } from './content';

gsap.registerPlugin(ScrollTrigger);

export function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize animations
    animateHeroText();
    animateScrollElements();
    animateSkillCards();
    animateExperienceTimeline();
    animateProjectCards();
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const animateHeroText = () => {
    if (!heroRef.current) return;
    
    const name = heroRef.current.querySelector('.hero-name');
    const headline = heroRef.current.querySelector('.hero-headline');
    const summary = heroRef.current.querySelector('.hero-summary');
    const buttons = heroRef.current.querySelectorAll('.hero-btn');

    const tl = gsap.timeline();
    
    tl.fromTo(name, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
    );

    tl.fromTo(headline, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );
    
    tl.fromTo(summary,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.4'
    );
    
    tl.fromTo(buttons,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' },
      '-=0.4'
    );
  };

  const animateScrollElements = () => {
    const elements = document.querySelectorAll('.scroll-fade-in');
    
    elements.forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  };

  const animateSkillCards = () => {
    const cards = document.querySelectorAll('.skill-card');
    cards.forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          delay: i * 0.1,
          ease: 'back.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  };

  const animateExperienceTimeline = () => {
    const items = document.querySelectorAll('.timeline-item');
    items.forEach((item, i) => {
      gsap.fromTo(item,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          delay: i * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  };

  const animateProjectCards = () => {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card) => {
      const img = card.querySelector('.project-image');
      if (img) {
        card.addEventListener('mouseenter', () => {
          gsap.to(img, { scale: 1.08, duration: 0.4, ease: 'power2.out' });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(img, { scale: 1, duration: 0.4, ease: 'power2.out' });
        });
      }
    });
  };

  return (
    <div className={`transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      {/* Navigation */}
      <header className={`sticky top-0 z-50 border-b transition-colors ${isDarkMode ? 'border-gray-800 bg-gray-950 bg-opacity-95' : 'border-gray-200 bg-white bg-opacity-95'} backdrop-blur`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">{content.name}</h1>
            <nav className="hidden md:flex gap-8">
              {['About', 'Skills', 'Experience', 'Projects', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`text-sm font-medium transition hover:opacity-100 ${
                    isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item}
                </a>
              ))}
            </nav>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
                isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-900'
              }`}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className={`relative overflow-hidden px-4 sm:px-6 lg:px-8 py-24 sm:py-28 lg:py-32 ${isDarkMode ? 'bg-[#0b0b0b] text-white' : 'bg-[#f6f5f2] text-slate-950'}`}
      >
        <div className="container mx-auto relative z-10">
          <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="max-w-3xl text-center lg:text-left">
              <p className="hero-name mb-5 whitespace-nowrap text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight">
                {content.name}
              </p>

              <p className={`mb-4 text-sm uppercase tracking-[0.32em] ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>
                Product thinker / Data builder / AI engineering student
              </p>

              <h2 className="hero-headline text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight tracking-tight">
                I build thoughtful digital experiences with strategy, data, and clean design.
              </h2>

              <p className={`hero-summary mt-6 text-base sm:text-lg leading-8 max-w-2xl ${isDarkMode ? 'text-white/68' : 'text-slate-600'}`}>
                {content.summary}
              </p>

              <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3">
                {content.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`hero-btn inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium transition ${
                      link.label === 'LinkedIn'
                        ? 'bg-slate-950 text-white hover:bg-slate-800'
                        : isDarkMode
                          ? 'border border-white/15 bg-white/5 text-white hover:bg-white/10'
                          : 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className={`relative w-full max-w-[420px] overflow-hidden rounded-[2.25rem] border shadow-[0_20px_60px_rgba(0,0,0,0.14)] ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-white'}`}>
                <img
                  src="/my-photo-v2.jpeg"
                  alt={content.name}
                  className="h-[560px] w-full object-cover object-center"
                />
                <div className={`absolute inset-x-0 bottom-0 p-6 ${isDarkMode ? 'bg-gradient-to-t from-black/65 to-transparent' : 'bg-gradient-to-t from-white/90 to-transparent'}`}>
                  <p className={`text-sm uppercase tracking-[0.24em] ${isDarkMode ? 'text-white/70' : 'text-slate-500'}`}>
                    {content.location}
                  </p>
                  <p className={`mt-2 text-lg font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    AI Engineering • Growth • Design
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#c9dce9]">
        <div className="container mx-auto">
          <h3 className="scroll-fade-in text-4xl font-bold mb-16 text-center text-[#2c3e50]">Key Achievements</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.highlights.map((highlight, idx) => (
              <div key={idx} className="scroll-fade-in group p-8 rounded-2xl border-2 transition hover:shadow-xl hover:border-purple-500"
                style={{ borderColor: isDarkMode ? '#444' : '#e5e7eb' }}>
                <p className="text-5xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {typeof highlight === 'string' ? '✨' : (highlight as any).number}
                </p>
                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {typeof highlight === 'string' ? highlight : (highlight as any).description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className={`py-20 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="container mx-auto max-w-3xl">
          <h3 className="scroll-fade-in text-4xl font-bold mb-8">About Me</h3>
          <p className="scroll-fade-in text-lg leading-relaxed opacity-80 mb-6">
            {content.summary}
          </p>
          <p className={`scroll-fade-in text-lg leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Based in <span className="font-semibold">{content.location}</span>, I specialize in digital marketing, strategic brand development, and creating meaningful connections between brands and audiences while studying Artificial Intelligence Engineering.
          </p>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#4a6fa5]">
        <div className="container mx-auto">
          <h3 className="scroll-fade-in text-4xl font-bold mb-16 text-center text-white">Skills & Expertise</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(content.skills).map(([category, skills]) => (
              <div key={category} className="scroll-fade-in skill-card">
                <h4 className="font-bold text-lg mb-6 text-white">
                  {category}
                </h4>
                <ul className="space-y-3">
                  {skills.map((skill) => (
                    <li key={skill} className="flex items-center gap-2 text-white/90">
                      <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className={`py-20 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-900' : 'bg-[#a8c5dd]'}`}>
        <div className="container mx-auto max-w-4xl">
          <h3 className={`scroll-fade-in text-4xl font-bold mb-16 ${isDarkMode ? '' : 'text-[#2c3e50]'}`}>Professional Journey</h3>
          <div className="space-y-12">
            {content.experience.map((exp, idx) => (
              <div key={idx} className="scroll-fade-in timeline-item relative pl-8 border-l-2 border-purple-600">
                <div className="absolute -left-3 top-0 w-4 h-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                <p className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                  {(exp as any).duration || (exp as any).date}
                </p>
                <h4 className="text-2xl font-bold mb-2">{(exp as any).role || (exp as any).title}</h4>
                <p className={`font-semibold mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {(exp as any).company || (exp as any).org}
                </p>
                <ul className="space-y-2">
                  {((exp as any).highlights || (exp as any).bullets || []).map((highlight: string) => (
                    <li key={highlight} className={`flex items-start gap-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex-shrink-0"></span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <h3 className="scroll-fade-in text-4xl font-bold mb-16 text-center text-[#2c3e50]">Featured Projects</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {content.projects.map((project) => (
              <div key={(project as any).name} className="scroll-fade-in project-card group">
                <div className={`mb-6 rounded-2xl overflow-hidden h-64 bg-gradient-to-br ${isDarkMode ? 'from-gray-800 to-gray-900' : 'from-gray-200 to-gray-300'} transition group-hover:shadow-xl`}>
                  <div className="project-image w-full h-full flex items-center justify-center">
                    <div className="text-center opacity-50">
                      <div className="text-4xl mb-2">🎨</div>
                      <p className="text-sm font-semibold">{(project as any).name}</p>
                    </div>
                  </div>
                </div>
                <h4 className="text-xl font-bold mb-3">{(project as any).name}</h4>
                <p className={`mb-4 leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {(project as any).description || (project as any).subtitle}
                </p>
                <div className="flex flex-wrap gap-2">
                  {((project as any).technologies || (project as any).tech || []).map((tech: string) => (
                    <span key={tech} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                      isDarkMode 
                        ? 'bg-gray-800 text-blue-400' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section id="education" className={`py-20 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-900' : 'bg-[#3d5a80]'}`}>
        <div className="container mx-auto max-w-3xl">
          <h3 className="scroll-fade-in text-4xl font-bold mb-12 text-white">Education</h3>
          <div className="space-y-6">
            {content.education.map((edu, idx) => (
              <div key={idx} className="scroll-fade-in p-6 rounded-xl border-2" style={{ borderColor: isDarkMode ? '#444' : 'rgba(255,255,255,0.3)' }}>
                <h4 className={`text-lg font-bold mb-2 ${isDarkMode ? '' : 'text-white'}`}>{(edu as any).school || (edu as any).org || (edu as any).title}</h4>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-white/80'}`}>
                  {(edu as any).degree || (edu as any).program} • {(edu as any).year || (edu as any).date}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className={`py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${isDarkMode ? 'bg-gray-950' : 'bg-black'}`}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl bg-purple-500"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl bg-blue-500"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <h3 className="scroll-fade-in text-5xl font-bold mb-8 text-white">Let's Connect</h3>
          <p className="scroll-fade-in text-xl opacity-80 mb-12 text-white max-w-2xl mx-auto">
            I'm always open to new opportunities and collaborations. Feel free to reach out!
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="scroll-fade-in p-8 rounded-2xl backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <p className="text-sm opacity-75 mb-2 text-white">Email</p>
              <a href={`mailto:${(content as any).contactInfo?.email || (content as any).contact?.email}`} className="text-2xl font-bold text-white hover:opacity-80 transition">
                {(content as any).contactInfo?.email || (content as any).contact?.email}
              </a>
            </div>
            <div className="scroll-fade-in p-8 rounded-2xl backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <p className="text-sm opacity-75 mb-2 text-white">Phone</p>
              <a href={`tel:${((content as any).contactInfo?.phone || (content as any).contact?.phone || '').replace(/\s/g, '')}`} className="text-2xl font-bold text-white hover:opacity-80 transition">
                {(content as any).contactInfo?.phone || (content as any).contact?.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 px-4 sm:px-6 lg:px-8 text-center ${isDarkMode ? 'bg-gray-950 text-gray-500' : 'bg-black text-gray-400'}`}>
        <p>&copy; 2024 {content.name}. Crafted with creativity & precision.</p>
      </footer>
    </div>
  );
}

export default App;
