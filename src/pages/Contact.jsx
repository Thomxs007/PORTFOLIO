import { useState, useEffect } from 'react';
import { getContacts, getProfile, getResume } from '../data/store';
import useScrollReveal from '../hooks/useScrollReveal';
import './Contact.css';

export default function Contact() {
  const [contacts, setContacts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const ref = useScrollReveal([contacts]);

  useEffect(() => {
    getContacts().then(setContacts);
    getProfile().then(setProfile);
    getResume().then(setResumeUrl);
  }, []);

  // Find email contact by label (case-insensitive) or by mailto: href
  const emailContact = contacts.find(
    (c) => c.label?.toLowerCase() === 'email' || c.href?.startsWith('mailto:')
  );

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
            {contacts.map((c) => {
              const isEmail = c.href?.startsWith('mailto:');
              const finalHref = isEmail 
                ? `https://mail.google.com/mail/?view=cm&fs=1&to=${c.href.replace('mailto:', '')}`
                : c.href;
              
              return (
                <a
                  href={finalHref}
                  className="contact-card"
                  key={c.id}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="contact-card-icon"><i className={c.icon}></i></div>
                  <h3>{c.label}</h3>
                  <p>{c.value}</p>
                </a>
              );
            })}
          </div>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=thomasprinil10@gmail.com"
            className="btn btn-primary btn-large"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fas fa-paper-plane"></i> Say Hello
          </a>
        </div>
      </div>
    </div>
  );
}

