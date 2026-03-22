import { db } from './firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

/**
 * Unified data store for the entire portfolio.
 * Data is persisted in Firebase Firestore (if configured) or localStorage as a fallback.
 */

// ─── Storage Keys ───────────────────────────────────────────
const KEYS = {
  projects: 'portfolio_projects',
  skills: 'portfolio_skills',
  certificates: 'portfolio_certificates',
  achievements: 'portfolio_achievements',
  education: 'portfolio_education',
  contact: 'portfolio_contact',
  profile: 'portfolio_profile',
  resume: 'portfolio_resume',
};

// ─── Seed Data ──────────────────────────────────────────────

const SEED_PROJECTS = [
  {
    id: '1',
    title: 'Phishing Website Detection System',
    date: 'July 2025',
    icon: 'fas fa-shield-alt',
    github: 'https://github.com/Thomxs007/Phishing-Url-Detection',
    description: [
      'Built supervised ML system to detect phishing websites using the UCI Phishing Dataset with 30+ real-time URL features.',
      'Trained Random Forest & XGBoost models achieving 97% test accuracy after GridSearchCV tuning.',
      'Developed FastAPI-powered web service for real-time URL analysis with full feature breakdown.',
      'Designed modular pipeline: preprocessing → feature extraction → training → evaluation → deployment.',
    ],
    tech: ['LangChain', 'FastAPI', 'Python', 'NLP', 'Scikit-learn'],
  },
  {
    id: '2',
    title: 'Time-Decaying Memory PSO for Multi-Robot Coordination',
    date: 'March 2025',
    icon: 'fas fa-robot',
    github: 'https://github.com/Thomxs007/tdmps-optimization',
    description: [
      'Developed enhanced Particle Swarm Optimization algorithm with time-decaying memory for multi-robot path planning.',
      'Designed and simulated the system in Python to improve convergence speed and cooperative behavior.',
      'Utilized key concepts: PSO, optimization algorithms, multi-robot systems, and simulation techniques.',
    ],
    tech: ['Python', 'PSO', 'Optimization', 'Simulation'],
  },
];

const SEED_SKILLS = [
  {
    id: '1',
    icon: 'fas fa-code',
    title: 'Languages',
    tags: [
      { icon: 'fab fa-cuttlefish', label: 'C++' },
      { icon: 'fab fa-java', label: 'Java' },
      { icon: 'fas fa-copyright', label: 'C' },
      { icon: 'fab fa-python', label: 'Python' },
    ],
  },
  {
    id: '2',
    icon: 'fas fa-layer-group',
    title: 'Frameworks',
    tags: [
      { icon: 'fas fa-bolt', label: 'FastAPI' },
      { icon: 'fas fa-brain', label: 'Scikit-learn' },
      { icon: 'fab fa-python', label: 'Django' },
    ],
  },
  {
    id: '3',
    icon: 'fas fa-tools',
    title: 'Tools & Platforms',
    tags: [
      { icon: 'fas fa-code', label: 'LeetCode' },
      { icon: 'fas fa-laptop-code', label: 'VSCode' },
      { icon: 'fas fa-terminal', label: 'GeeksforGeeks' },
      { icon: 'fab fa-hackerrank', label: 'HackerRank' },
    ],
  },
  {
    id: '4',
    icon: 'fas fa-users',
    title: 'Soft Skills',
    tags: [
      { icon: 'fas fa-comments', label: 'Communication' },
      { icon: 'fas fa-people-carry', label: 'Team Player' },
      { icon: 'fas fa-clock', label: 'Time Management' },
    ],
  },
];

const SEED_CERTIFICATES = [
  { id: '1', title: 'Data Structures and Algorithms Using C++', issuer: 'Lovely Professional University', date: 'July 2025', icon: 'fas fa-university' },
  { id: '2', title: 'Computational Theory: Language Principle & Finite Automata', issuer: 'Online Certification', date: 'August 2025', icon: 'fas fa-university' },
  { id: '3', title: 'ChatGPT-4 Prompt Engineering: Generative AI & LLM', issuer: 'Online Certification', date: 'June 2025', icon: 'fas fa-brain' },
  { id: '4', title: 'Build Generative AI Apps & Solutions with No-Code Tools', issuer: 'Online Certification', date: 'August 2025', icon: 'fas fa-robot' },
];

const SEED_ACHIEVEMENTS = [
  {
    id: '1',
    dotIcon: 'fab fa-hackerrank',
    icon: 'fas fa-medal',
    title: 'Python Bronze Badge — HackerRank',
    date: 'September 2024',
    text: 'Secured a Python Bronze Badge after dedicating 25+ hours to mastering data structures and algorithms, showcasing commitment to continuous learning and skill enhancement.',
  },
  {
    id: '2',
    dotIcon: 'fas fa-bullseye',
    icon: 'fas fa-trophy',
    title: '15+ Tests on Hit Bullseye',
    date: 'Ongoing',
    text: 'Completed 15+ aptitude and verbal tests on the Hit Bullseye platform, sharpening analytical and communication abilities.',
  },
  {
    id: '3',
    dotIcon: 'fas fa-code',
    icon: 'fas fa-fire',
    title: '75+ Problems on LeetCode',
    date: 'Ongoing',
    text: 'Strengthened DSA fundamentals and algorithmic problem-solving through consistent practice on LeetCode.',
  },
];

const SEED_EDUCATION = [
  {
    id: '1',
    icon: 'fas fa-graduation-cap',
    degree: 'Bachelor of Technology',
    specialization: 'Computer Science and Engineering',
    school: 'Lovely Professional University, Phagwara, Punjab',
    schoolIcon: 'fas fa-university',
    date: 'Aug 2023 – Present',
    score: 'CGPA: 7.50',
  },
  {
    id: '2',
    icon: 'fas fa-school',
    degree: 'Intermediate (12th)',
    specialization: '',
    school: 'Christ Nagar Central School, Thiruvananthapuram, Kerala',
    schoolIcon: 'fas fa-map-marker-alt',
    date: 'Jun 2020 – Mar 2022',
    score: '73%',
  },
  {
    id: '3',
    icon: 'fas fa-school',
    degree: 'Matriculation (10th)',
    specialization: '',
    school: 'Christ Nagar Central School, Thiruvananthapuram, Kerala',
    schoolIcon: 'fas fa-map-marker-alt',
    date: 'Jun 2019 – Mar 2020',
    score: '83%',
  },
];

const SEED_CONTACT = [
  { id: '1', href: 'mailto:thomasprinil10@gmail.com', icon: 'fas fa-envelope', label: 'Email', value: 'thomasprinil10@gmail.com', external: false },
  { id: '2', href: 'tel:+918075705571', icon: 'fas fa-phone-alt', label: 'Phone', value: '+91-8075705571', external: false },
  { id: '3', href: 'https://www.linkedin.com/in/thomasprinil', icon: 'fab fa-linkedin-in', label: 'LinkedIn', value: 'thomas-prinil', external: true },
  { id: '4', href: 'https://github.com/Thomxs007', icon: 'fab fa-github', label: 'GitHub', value: 'Thomxs007', external: true },
];

const SEED_PROFILE = {
  name: 'Thomas Prinil',
  greeting: "Hello, I'm",
  roles: ['Software Developer', 'ML Enthusiast', 'Problem Solver', 'CSE Student', 'Full-Stack Developer'],
  bio: 'CSE student passionate about Machine Learning, web development, and building intelligent systems that solve real-world problems.',
  aboutParagraphs: [
    "I'm a Computer Science & Engineering student at Lovely Professional University with a strong foundation in programming, data structures, and machine learning.",
    "I enjoy building intelligent systems that bridge the gap between theory and real-world applications. From phishing detection systems to multi-robot coordination algorithms, I love tackling complex problems with elegant code.",
    "When I'm not coding, you'll find me solving challenges on LeetCode, learning new technologies, or exploring the latest in generative AI.",
  ],
  stats: [
    { value: 75, suffix: '+', label: 'LeetCode Problems' },
    { value: 2, suffix: '', label: 'Major Projects' },
    { value: 4, suffix: '+', label: 'Certifications' },
    { value: 7, suffix: '.5', label: 'CGPA' },
  ],
  linkedin: 'https://www.linkedin.com/in/thomas-prinil',
  github: 'https://github.com/Thomxs007',
  email: 'thomasprinil10@gmail.com',
};

// ─── Generic CRUD Helpers ───────────────────────────────────

async function getCollection(key, seed) {
  if (db) {
    try {
      const snap = await getDocs(collection(db, key));
      if (!snap.empty) {
        return snap.docs.map(d => d.data());
      }
      for (const item of seed) {
        await setDoc(doc(db, key, item.id), item);
      }
      return seed;
    } catch (e) { console.warn("Firestore error:", e); }
  }
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(stored);
}

async function saveCollection(key, data) {
  if (db) {
    for (const item of data) await setDoc(doc(db, key, item.id), item);
  } else {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

async function addItem(key, seed, item) {
  const newItem = { ...item, id: Date.now().toString() };
  if (db) {
    await setDoc(doc(db, key, newItem.id), newItem);
  } else {
    const items = await getCollection(key, seed);
    items.push(newItem);
    localStorage.setItem(key, JSON.stringify(items));
  }
  return getCollection(key, seed);
}

async function updateItem(key, seed, id, updates) {
  if (db) {
    await setDoc(doc(db, key, id), updates, { merge: true });
  } else {
    const items = await getCollection(key, seed);
    const idx = items.findIndex((i) => i.id === id);
    if (idx !== -1) items[idx] = { ...items[idx], ...updates };
    localStorage.setItem(key, JSON.stringify(items));
  }
  return getCollection(key, seed);
}

async function deleteItem(key, seed, id) {
  if (db) {
    await deleteDoc(doc(db, key, id));
  } else {
    const items = await getCollection(key, seed);
    localStorage.setItem(key, JSON.stringify(items.filter(i => i.id !== id)));
  }
  return getCollection(key, seed);
}

// ─── Public API ─────────────────────────────────────────────

export const getProjects = () => getCollection(KEYS.projects, SEED_PROJECTS);
export const saveProjects = (d) => saveCollection(KEYS.projects, d);
export const addProject = (item) => addItem(KEYS.projects, SEED_PROJECTS, item);
export const updateProject = (id, u) => updateItem(KEYS.projects, SEED_PROJECTS, id, u);
export const deleteProject = (id) => deleteItem(KEYS.projects, SEED_PROJECTS, id);

export const getSkills = () => getCollection(KEYS.skills, SEED_SKILLS);
export const saveSkills = (d) => saveCollection(KEYS.skills, d);
export const addSkill = (item) => addItem(KEYS.skills, SEED_SKILLS, item);
export const updateSkill = (id, u) => updateItem(KEYS.skills, SEED_SKILLS, id, u);
export const deleteSkill = (id) => deleteItem(KEYS.skills, SEED_SKILLS, id);

export const getCertificates = () => getCollection(KEYS.certificates, SEED_CERTIFICATES);
export const saveCertificates = (d) => saveCollection(KEYS.certificates, d);
export const addCertificate = (item) => addItem(KEYS.certificates, SEED_CERTIFICATES, item);
export const updateCertificate = (id, u) => updateItem(KEYS.certificates, SEED_CERTIFICATES, id, u);
export const deleteCertificate = (id) => deleteItem(KEYS.certificates, SEED_CERTIFICATES, id);

export const getAchievements = () => getCollection(KEYS.achievements, SEED_ACHIEVEMENTS);
export const saveAchievements = (d) => saveCollection(KEYS.achievements, d);
export const addAchievement = (item) => addItem(KEYS.achievements, SEED_ACHIEVEMENTS, item);
export const updateAchievement = (id, u) => updateItem(KEYS.achievements, SEED_ACHIEVEMENTS, id, u);
export const deleteAchievement = (id) => deleteItem(KEYS.achievements, SEED_ACHIEVEMENTS, id);

export const getEducation = () => getCollection(KEYS.education, SEED_EDUCATION);
export const saveEducation = (d) => saveCollection(KEYS.education, d);
export const addEducation = (item) => addItem(KEYS.education, SEED_EDUCATION, item);
export const updateEducation = (id, u) => updateItem(KEYS.education, SEED_EDUCATION, id, u);
export const deleteEducation = (id) => deleteItem(KEYS.education, SEED_EDUCATION, id);

export const getContacts = () => getCollection(KEYS.contact, SEED_CONTACT);
export const saveContacts = (d) => saveCollection(KEYS.contact, d);
export const addContact = (item) => addItem(KEYS.contact, SEED_CONTACT, item);
export const updateContact = (id, u) => updateItem(KEYS.contact, SEED_CONTACT, id, u);
export const deleteContact = (id) => deleteItem(KEYS.contact, SEED_CONTACT, id);

export async function getProfile() {
  if (db) {
    try {
      const snap = await getDoc(doc(db, 'system', KEYS.profile));
      if (snap.exists()) return snap.data();
      await setDoc(doc(db, 'system', KEYS.profile), SEED_PROFILE);
      return SEED_PROFILE;
    } catch (e) { console.warn(e); }
  }
  const stored = localStorage.getItem(KEYS.profile);
  if (!stored) {
    localStorage.setItem(KEYS.profile, JSON.stringify(SEED_PROFILE));
    return SEED_PROFILE;
  }
  return JSON.parse(stored);
}

export async function saveProfile(profile) {
  if (db) {
    await setDoc(doc(db, 'system', KEYS.profile), profile);
  } else {
    localStorage.setItem(KEYS.profile, JSON.stringify(profile));
  }
}

export async function getResume() {
  if (db) {
    try {
      const snap = await getDoc(doc(db, 'system', KEYS.resume));
      if (snap.exists()) return snap.data().url || '';
      return '';
    } catch (e) { console.warn(e); }
  }
  return localStorage.getItem(KEYS.resume) || '';
}

export async function saveResume(url) {
  if (db) {
    await setDoc(doc(db, 'system', KEYS.resume), { url });
  } else {
    localStorage.setItem(KEYS.resume, url);
  }
}


