import { useState, useEffect, useRef } from 'react';
import { getProfile } from '../data/store';
import useScrollReveal from '../hooks/useScrollReveal';
import './About.css';

function Counter({ target, suffix = '' }) {
  const numRef = useRef(null);
  const counted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          let current = 0;
          const increment = target / 120;
          const update = () => {
            current += increment;
            if (current >= target) { numRef.current.textContent = target; return; }
            numRef.current.textContent = Math.floor(current);
            requestAnimationFrame(update);
          };
          update();
        }
      },
      { threshold: 0.5 }
    );
    if (numRef.current) observer.observe(numRef.current);
    return () => observer.disconnect();
  }, [target]);

  return <span><span ref={numRef}>0</span>{suffix}</span>;
}

export default function About() {
  const [profile, setProfile] = useState(null);

  useEffect(() => { setProfile(getProfile()); }, []);

  // Pass profile as dep so scroll reveal re-fires after data loads
  const ref = useScrollReveal([profile]);

  if (!profile) return null;

  return (
    <div className="page" ref={ref}>
      <div className="container">
        <h2 className="section-title animate-in">
          <span className="section-number">01.</span> About Me
        </h2>
        <div className="about-grid">
          <div className="about-text animate-in">
            {profile.aboutParagraphs.map((p, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            ))}
          </div>
          <div className="about-stats animate-in">
            {profile.stats.map((s, i) => (
              <div className="stat-card" key={i}>
                <div className="stat-value"><Counter target={s.value} suffix={s.suffix} /></div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
