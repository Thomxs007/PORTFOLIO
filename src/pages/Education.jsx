import { useState, useEffect } from 'react';
import { getEducation } from '../data/store';
import useScrollReveal from '../hooks/useScrollReveal';
import './Education.css';

export default function Education() {
  const [education, setEducation] = useState([]);
  const ref = useScrollReveal([education]);

  useEffect(() => { setEducation(getEducation()); }, []);

  return (
    <div className="page page-alt" ref={ref}>
      <div className="container">
        <h2 className="section-title animate-in">
          <span className="section-number">06.</span> Education
        </h2>
        <div className="education-grid">
          {education.map((e) => (
            <div className="education-card animate-in" key={e.id}>
              <div className="edu-icon"><i className={e.icon}></i></div>
              <div className="edu-content">
                <h3>{e.degree}</h3>
                {e.specialization && <p className="edu-specialization">{e.specialization}</p>}
                <p className="edu-school"><i className={e.schoolIcon}></i> {e.school}</p>
                <p className="edu-date"><i className="far fa-calendar-alt"></i> {e.date}</p>
                <div className="edu-score"><span className="edu-badge">{e.score}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
