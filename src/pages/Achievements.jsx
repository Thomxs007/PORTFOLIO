import { useState, useEffect } from 'react';
import { getAchievements } from '../data/store';
import useScrollReveal from '../hooks/useScrollReveal';
import './Achievements.css';

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const ref = useScrollReveal([achievements]);

  useEffect(() => {
    getAchievements().then(setAchievements);
  }, []);

  return (
    <div className="page" ref={ref}>
      <div className="container">
        <h2 className="section-title animate-in">
          <span className="section-number">05.</span> Achievements
        </h2>
        <div className="timeline">
          {achievements.map((a) => (
            <div className="timeline-item animate-in" key={a.id}>
              <div className="timeline-dot"><i className={a.dotIcon}></i></div>
              <div className="timeline-content">
                <h3><i className={a.icon}></i> {a.title}</h3>
                <p className="timeline-date">{a.date}</p>
                <p>{a.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
