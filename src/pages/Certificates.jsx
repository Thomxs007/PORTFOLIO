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
          <span className="section-number">04.</span> Certifications
        </h2>
        <div className="certificates-grid">
          {certs.map((c) => (
            <div className="certificate-card animate-in" key={c.id}>
              <div className="cert-icon"><i className="fas fa-certificate"></i></div>
              <h3>{c.title}</h3>
              <p className="cert-issuer"><i className={c.icon}></i> {c.issuer}</p>
              <p className="cert-date"><i className="far fa-calendar-alt"></i> {c.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
