import { useState, useEffect } from 'react';
import { getContacts } from '../data/store';
import useScrollReveal from '../hooks/useScrollReveal';
import './Contact.css';

export default function Contact() {
  const [contacts, setContacts] = useState([]);
  const ref = useScrollReveal([contacts]);

  useEffect(() => { setContacts(getContacts()); }, []);

  const emailContact = contacts.find((c) => c.icon === 'fas fa-envelope');

  return (
    <div className="page" ref={ref}>
      <div className="container">
        <h2 className="section-title animate-in">
          <span className="section-number">07.</span> Get In Touch
        </h2>
        <div className="contact-wrapper animate-in">
          <p className="contact-text">
            I'm currently looking for opportunities and my inbox is always open.
            Whether you have a question, want to collaborate, or just want to say hi —
            feel free to reach out!
          </p>
          <div className="contact-cards">
            {contacts.map((c) => (
              <a
                href={c.href}
                className="contact-card"
                key={c.id}
                {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <div className="contact-card-icon"><i className={c.icon}></i></div>
                <h3>{c.label}</h3>
                <p>{c.value}</p>
              </a>
            ))}
          </div>
          {emailContact && (
            <a href={emailContact.href} className="btn btn-primary btn-large">
              <i className="fas fa-paper-plane"></i> Say Hello
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
