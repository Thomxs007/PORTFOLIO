import { useState, useEffect } from 'react';
import { getCertificates } from '../data/store';
import useScrollReveal from '../hooks/useScrollReveal';
import './Certificates.css';

export default function Certificates() {
  const [certs, setCerts] = useState([]);
  const ref = useScrollReveal([certs]);

  useEffect(() => { setCerts(getCertificates()); }, []);

  return (
    <div className="page page-alt" ref={ref}>
      <div className="container">
        <h2 className="section-title animate-in">
          <span className="section-number">04.</span> Certifications & Credentials
        </h2>
        <div className="certs-showcase animate-in">
          {certs.map((c, i) => (
            <div 
              className="cert-badge-card" 
              key={c.id} 
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="cert-badge-glow"></div>
              
              <div className="cert-badge-content">
                <div className="cert-badge-header">
                  <div className="cert-badge-icon">
                    <i className="fas fa-award"></i>
                  </div>
                  <div className="cert-badge-ribbon">
                    <i className="far fa-calendar-alt"></i> {c.date}
                  </div>
                </div>
                
                <h3 className="cert-badge-title">{c.title}</h3>
                
                <div className="cert-badge-footer">
                  <div className="cert-issuer-tag">
                    <i className={c.icon}></i> {c.issuer}
                  </div>
                  <a href={c.link || '#'} className="cert-verify-btn" target="_blank" rel="noopener noreferrer">
                    Verify <i className="fas fa-external-link-alt"></i>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
