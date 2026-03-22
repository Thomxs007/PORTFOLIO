import { useState, useEffect, useRef } from 'react';
import { getSkills } from '../data/store';
import useScrollReveal from '../hooks/useScrollReveal';
import './Skills.css';

const CATEGORY_COLORS = [
  { main: '#6c63ff', glow: 'rgba(108, 99, 255, 0.3)', gradient: 'linear-gradient(135deg, #6c63ff, #48c6ef)' },
  { main: '#f093fb', glow: 'rgba(240, 147, 251, 0.3)', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' },
  { main: '#43e97b', glow: 'rgba(67, 233, 123, 0.3)', gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
  { main: '#fa709a', glow: 'rgba(250, 112, 154, 0.3)', gradient: 'linear-gradient(135deg, #fa709a, #fee140)' },
  { main: '#a18cd1', glow: 'rgba(161, 140, 209, 0.3)', gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)' },
  { main: '#4facfe', glow: 'rgba(79, 172, 254, 0.3)', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
];

function SkillOrb({ tag, color, delay }) {
  return (
    <div className="skill-orb" style={{ animationDelay: `${delay}ms` }}>
      <div className="skill-orb-inner" style={{ '--orb-color': color.main, '--orb-glow': color.glow }}>
        <div className="skill-orb-icon">
          <i className={tag.icon}></i>
        </div>
        <span className="skill-orb-label">{tag.label}</span>
      </div>
      <div className="skill-orb-ring" style={{ borderColor: color.main }}></div>
      <div className="skill-orb-pulse" style={{ background: color.glow }}></div>
    </div>
  );
}

function SkillCategory({ cat, index }) {
  const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
  const cardRef = useRef(null);

  function handleMouseMove(e) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  }

  return (
    <div
      className="skill-card animate-in"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      style={{ '--card-color': color.main, '--card-glow': color.glow, '--card-gradient': color.gradient }}
    >
      <div className="skill-card-spotlight"></div>
      <div className="skill-card-border"></div>
      <div className="skill-card-content">
        <div className="skill-card-header">
          <div className="skill-card-icon" style={{ background: color.gradient }}>
            <i className={cat.icon}></i>
          </div>
          <div className="skill-card-title">
            <h3>{cat.title}</h3>
            <span className="skill-card-count">{cat.tags.length} skills</span>
          </div>
          <div className="skill-card-number" style={{ color: color.main }}>
            {String(index + 1).padStart(2, '0')}
          </div>
        </div>
        <div className="skill-card-divider" style={{ background: color.gradient }}></div>
        <div className="skill-orbs-grid">
          {cat.tags.map((tag, i) => (
            <SkillOrb key={i} tag={tag} color={color} delay={i * 100} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const ref = useScrollReveal([skills]);

  useEffect(() => {
    getSkills().then(setSkills);
  }, []);

  const totalSkills = skills.reduce((sum, cat) => sum + cat.tags.length, 0);

  return (
    <div className="page page-alt" ref={ref}>
      <div className="container">
        <h2 className="section-title animate-in">
          <span className="section-number">02.</span> Skills & Arsenal
        </h2>
        <p className="skills-subtitle animate-in">
          Technologies and tools I wield to build powerful solutions
        </p>
        <div className="skills-stats animate-in">
          <div className="skills-stat">
            <span className="skills-stat-value">{skills.length}</span>
            <span className="skills-stat-label">Categories</span>
          </div>
          <div className="skills-stat-divider"></div>
          <div className="skills-stat">
            <span className="skills-stat-value">{totalSkills}</span>
            <span className="skills-stat-label">Total Skills</span>
          </div>
        </div>
        <div className="skills-masonry">
          {skills.map((cat, i) => (
            <SkillCategory key={cat.id} cat={cat} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
