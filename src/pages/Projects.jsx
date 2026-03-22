import { useState, useEffect } from 'react';
import { getProjects } from '../data/store';
import useScrollReveal from '../hooks/useScrollReveal';
import ProjectCard from '../components/ProjectCard';
import './Projects.css';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const ref = useScrollReveal([projects]);

  useEffect(() => { setProjects(getProjects()); }, []);

  return (
    <div className="page" ref={ref}>
      <div className="container">
        <h2 className="section-title animate-in">
          <span className="section-number">03.</span> Featured Projects
        </h2>
        {projects.length === 0 ? (
          <p className="no-projects animate-in">No projects yet. Check back soon!</p>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
