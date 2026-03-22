import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ParticleCanvas from './components/ParticleCanvas';
import Home from './pages/Home';
import About from './pages/About';
import Skills from './pages/Skills';
import Projects from './pages/Projects';
import Certificates from './pages/Certificates';
import Achievements from './pages/Achievements';
import Education from './pages/Education';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Login from './pages/Login';

const basename = import.meta.env.BASE_URL;

// Simple route protection
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('portfolio_admin_auth') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <ParticleCanvas />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/certificates" element={<Certificates />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/education" element={<Education />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
