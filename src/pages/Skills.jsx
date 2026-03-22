import { useState, useEffect } from 'react';
import { getSkills } from '../data/store';
import useScrollReveal from '../hooks/useScrollReveal';
import './Skills.css';

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const ref = useScrollReveal([skills]);

  useEffect(() => { setSkills(getSkills()); }, []);

  return (
    <div className="page page-alt" ref={ref}>
      <div className="container">
        <h2 className="section-title animate-in">
          <span className="section-number">02.</span> Skills & Tools
        </h2>
        <div className="skills-grid">
          {skills.map((cat) => (
            <div className="skill-category glass-card animate-in" key={cat.id}>
              <div className="skill-category-header">
                <div className="skill-icon"><i className={cat.icon}></i></div>
                <h3>{cat.title}</h3>
              </div>
              <div className="skill-tags">
                {cat.tags.map((t, i) => (
                  <span className="skill-tag" key={i}>
                    <i className={t.icon}></i> {t.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
