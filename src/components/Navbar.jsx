import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProfile } from '../data/store';
import './Navbar.css';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/skills', label: 'Skills' },
  { to: '/projects', label: 'Projects' },
  { to: '/certificates', label: 'Certificates' },
  { to: '/achievements', label: 'Achievements' },
  { to: '/education', label: 'Education' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  if (location.pathname === '/admin' || location.pathname === '/login') {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <NavLink to="/" className="nav-logo" onClick={() => setOpen(false)}>
          &lt;TP /&gt;
        </NavLink>
        <ul className={`nav-links${open ? ' active' : ''}`}>
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  `nav-link${isActive ? ' active' : ''}${l.to === '/contact' ? ' nav-cta' : ''}`
                }
                onClick={() => setOpen(false)}
                end={l.to === '/'}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
          <li>
            <a 
              href={profile?.resumeUrl || `${import.meta.env.BASE_URL}Thomas_Prinil_Resume.pdf`} 
              download="Thomas_Prinil_Resume.pdf" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="nav-link nav-cta"
              style={{ marginLeft: '10px' }}
            >
              <i className="fas fa-download"></i> Resume
            </a>
          </li>
        </ul>
        <button
          className={`nav-toggle${open ? ' active' : ''}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  );
}
