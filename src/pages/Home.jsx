import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfile } from '../data/store';
import useScrollReveal from '../hooks/useScrollReveal';
import './Home.css';

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [text, setText] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getProfile().then(setProfile);
  }, []);

  // Pass profile as dep so scroll reveal re-fires after data loads
  const ref = useScrollReveal([profile]);

  const words = profile?.roles || ['Software Developer'];

  useEffect(() => {
    if (!profile) return;
    const word = words[wordIdx];
    let timeout;

    if (!deleting && charIdx === word.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && charIdx === 0) {
      timeout = setTimeout(() => {
        setDeleting(false);
        setWordIdx((prev) => (prev + 1) % words.length);
      }, 400);
    } else {
      timeout = setTimeout(
        () => setCharIdx((prev) => prev + (deleting ? -1 : 1)),
        deleting ? 40 : 80
      );
    }

    setText(word.substring(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, profile]);

  if (!profile) return null;

  return (
    <div className="hero" ref={ref}>
      <div className="hero-content container">
        <div className="hero-text">
          <p className="hero-greeting animate-in">{profile.greeting}</p>
          <h1 className="hero-name animate-in">
            {profile.name.split(' ')[0]}{' '}
            <span className="gradient-text">{profile.name.split(' ').slice(1).join(' ')}</span>
          </h1>
          <div className="hero-tagline animate-in">
            <span className="tagline-static">I am a </span>
            <span className="typewriter">{text}</span>
            <span className="cursor">|</span>
          </div>
          <p className="hero-description animate-in">{profile.bio}</p>
          <div className="hero-buttons animate-in">
            <Link to="/projects" className="btn btn-primary">
              <i className="fas fa-rocket"></i> View My Work
            </Link>
            <Link to="/contact" className="btn btn-outline">
              <i className="fas fa-paper-plane"></i> Get In Touch
            </Link>
          </div>
          <div className="hero-socials animate-in">
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
            )}
            {profile.github && (
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="social-icon"><i className="fab fa-github"></i></a>
            )}
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="social-icon"><i className="fas fa-envelope"></i></a>
            )}
          </div>
        </div>
        <div className="hero-image animate-in">
          <div className="hero-image-wrapper">
            <div className="hero-image-glow"></div>
            <img src={`${import.meta.env.BASE_URL}profile.jpg`} alt={profile.name} className="profile-img" />
            <div className="hero-image-ring"></div>
          </div>
        </div>
      </div>
      <div className="scroll-indicator">
        <div className="scroll-mouse"><div className="scroll-wheel"></div></div>
        <span>Scroll Down</span>
      </div>
    </div>
  );
}
