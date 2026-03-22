import './ProjectCard.css';

export default function ProjectCard({ project }) {
  return (
    <div className="project-card animate-in">
      <div className="project-card-header">
        <div className="project-icon">
          <i className={project.icon || 'fas fa-code'}></i>
        </div>
        <div className="project-links">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <i className="fab fa-github"></i>
            </a>
          )}
        </div>
      </div>
      <h3 className="project-title">{project.title}</h3>
      <p className="project-date">
        <i className="far fa-calendar-alt"></i> {project.date}
      </p>
      <ul className="project-description">
        {project.description.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <div className="project-tech">
        {project.tech.map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>
    </div>
  );
}
