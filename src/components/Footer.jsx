import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer-text">
          Designed & Built by <span className="gradient-text">Thomas Prinil</span>
        </p>
        <div className="footer-socials">
          <a href="https://www.linkedin.com/in/thomas-prinil" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a href="https://github.com/Thomxs007" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <i className="fab fa-github"></i>
          </a>
          <a href="mailto:thomasprinil10@gmail.com" aria-label="Email">
            <i className="fas fa-envelope"></i>
          </a>
        </div>
        <p className="footer-copy">&copy; 2025 Thomas Prinil. All rights reserved.</p>
      </div>
    </footer>
  );
}
