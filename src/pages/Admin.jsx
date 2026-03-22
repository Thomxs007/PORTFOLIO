import { useState, useEffect } from 'react';
import {
  getProjects, addProject, updateProject, deleteProject,
  getSkills, addSkill, updateSkill, deleteSkill,
  getCertificates, addCertificate, updateCertificate, deleteCertificate,
  getAchievements, addAchievement, updateAchievement, deleteAchievement,
  getEducation, addEducation, updateEducation, deleteEducation,
  getContacts, addContact, updateContact, deleteContact,
  getProfile, saveProfile,
} from '../data/store';
import './Admin.css';

const TABS = [
  { key: 'profile', label: 'Profile', icon: 'fas fa-user' },
  { key: 'projects', label: 'Projects', icon: 'fas fa-rocket' },
  { key: 'skills', label: 'Skills', icon: 'fas fa-code' },
  { key: 'certificates', label: 'Certificates', icon: 'fas fa-certificate' },
  { key: 'achievements', label: 'Achievements', icon: 'fas fa-trophy' },
  { key: 'education', label: 'Education', icon: 'fas fa-graduation-cap' },
  { key: 'contact', label: 'Contact', icon: 'fas fa-address-book' },
];

function Toast({ message }) {
  if (!message) return null;
  return <div className="admin-toast">{message}</div>;
}

// ━━━━ Profile Tab ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ProfileTab({ showToast }) {
  const [form, setForm] = useState(getProfile());

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSave(e) {
    e.preventDefault();
    const updated = {
      ...form,
      roles: form.roles?.split ? form.roles.split(',').map((r) => r.trim()).filter(Boolean) : form.roles,
      aboutParagraphs: form.aboutParagraphs?.split ? form.aboutParagraphs.split('\n\n').filter(Boolean) : form.aboutParagraphs,
      stats: form.stats,
    };
    saveProfile(updated);
    showToast('Profile updated!');
  }

  const rolesVal = Array.isArray(form.roles) ? form.roles.join(', ') : form.roles || '';
  const aboutVal = Array.isArray(form.aboutParagraphs) ? form.aboutParagraphs.join('\n\n') : form.aboutParagraphs || '';

  return (
    <form className="admin-form glass-card" onSubmit={handleSave}>
      <div className="form-row">
        <div className="form-group">
          <label>Full Name</label>
          <input name="name" value={form.name || ''} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Greeting Text</label>
          <input name="greeting" value={form.greeting || ''} onChange={handleChange} />
        </div>
      </div>
      <div className="form-group">
        <label>Resume (PDF URL or File Upload)</label>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input name="resumeUrl" value={form.resumeUrl || ''} onChange={handleChange} placeholder="https://..." style={{ flex: 1 }} />
          <input type="file" accept=".pdf" onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (ev) => setForm({ ...form, resumeUrl: ev.target.result });
              reader.readAsDataURL(file);
            }
          }} style={{ padding: '8px' }} />
        </div>
      </div>
      <div className="form-group">
        <label>Typewriter Roles (comma-separated)</label>
        <input name="roles" value={rolesVal} onChange={handleChange} placeholder="Software Developer, ML Enthusiast" />
      </div>
      <div className="form-group">
        <label>Short Bio (hero section)</label>
        <textarea name="bio" value={form.bio || ''} onChange={handleChange} rows="3" />
      </div>
      <div className="form-group">
        <label>About Paragraphs (separate with blank line)</label>
        <textarea name="aboutParagraphs" value={aboutVal} onChange={handleChange} rows="6" />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>LinkedIn URL</label>
          <input name="linkedin" value={form.linkedin || ''} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>GitHub URL</label>
          <input name="github" value={form.github || ''} onChange={handleChange} />
        </div>
      </div>
      <div className="form-group">
        <label>Email</label>
        <input name="email" type="email" value={form.email || ''} onChange={handleChange} />
      </div>
      <h4 className="admin-section-label"><i className="fas fa-chart-bar"></i> Stats</h4>
      {(form.stats || []).map((s, i) => (
        <div className="form-row stat-row" key={i}>
          <input
            placeholder="Value" type="number" value={s.value}
            onChange={(e) => {
              const stats = [...form.stats];
              stats[i] = { ...stats[i], value: parseInt(e.target.value) || 0 };
              setForm({ ...form, stats });
            }}
          />
          <input
            placeholder="Suffix (+, .5, etc)" value={s.suffix}
            onChange={(e) => {
              const stats = [...form.stats];
              stats[i] = { ...stats[i], suffix: e.target.value };
              setForm({ ...form, stats });
            }}
          />
          <input
            placeholder="Label" value={s.label}
            onChange={(e) => {
              const stats = [...form.stats];
              stats[i] = { ...stats[i], label: e.target.value };
              setForm({ ...form, stats });
            }}
          />
          <button type="button" className="btn btn-danger btn-sm" onClick={() => {
            const stats = form.stats.filter((_, idx) => idx !== i);
            setForm({ ...form, stats });
          }}><i className="fas fa-times"></i></button>
        </div>
      ))}
      <button type="button" className="btn btn-outline btn-sm" style={{ marginBottom: 20 }}
        onClick={() => setForm({ ...form, stats: [...(form.stats || []), { value: 0, suffix: '', label: '' }] })}
      ><i className="fas fa-plus"></i> Add Stat</button>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary"><i className="fas fa-save"></i> Save Profile</button>
      </div>
    </form>
  );
}

// ━━━━ Generic CRUD Tab ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function CrudTab({ config, showToast }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [editId, setEditId] = useState(null);

  useEffect(() => { setItems(config.getAll()); }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const data = config.serialize(form);
    if (editId) {
      setItems(config.update(editId, data));
      setEditId(null);
      showToast(`${config.label} updated!`);
    } else {
      config.add(data);
      setItems(config.getAll());
      showToast(`${config.label} added!`);
    }
    setForm({});
  }

  function handleEdit(item) {
    setEditId(item.id);
    setForm(config.deserialize(item));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleDelete(id) {
    if (window.confirm(`Delete this ${config.label.toLowerCase()}?`)) {
      setItems(config.delete(id));
      showToast(`${config.label} deleted.`);
    }
  }

  return (
    <>
      <form className="admin-form glass-card" onSubmit={handleSubmit}>
        {config.fields.map((f) => (
          <div className={f.half ? 'form-group form-half' : 'form-group'} key={f.name}>
            <label>{f.label}{f.required ? ' *' : ''}</label>
            {f.type === 'textarea' ? (
              <textarea
                name={f.name} value={form[f.name] || ''} onChange={handleChange}
                rows={f.rows || 4} required={f.required} placeholder={f.placeholder || ''}
              />
            ) : (
              <input
                name={f.name} type={f.inputType || 'text'} value={form[f.name] || ''} onChange={handleChange}
                required={f.required} placeholder={f.placeholder || ''}
              />
            )}
            {f.hint && <span className="form-hint">{f.hint}</span>}
          </div>
        ))}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            <i className={editId ? 'fas fa-save' : 'fas fa-plus'}></i>
            {editId ? ` Update ${config.label}` : ` Add ${config.label}`}
          </button>
          {editId && (
            <button type="button" className="btn btn-outline" onClick={() => { setEditId(null); setForm({}); }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3 className="admin-subtitle">
        <i className="fas fa-folder-open"></i> Current ({items.length})
      </h3>
      <div className="admin-project-list">
        {items.map((item) => (
          <div className="admin-project-item glass-card" key={item.id}>
            <div className="admin-project-info">
              <h4><i className={config.itemIcon(item)}></i> {config.itemTitle(item)}</h4>
              <p className="admin-project-meta">{config.itemMeta(item)}</p>
            </div>
            <div className="admin-project-actions">
              <button className="btn btn-outline btn-sm" onClick={() => handleEdit(item)}>
                <i className="fas fa-pen"></i> Edit
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>
                <i className="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="empty-state">No items yet. Add one above!</p>}
      </div>
    </>
  );
}

// ━━━━ Tab Configs ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const projectConfig = {
  label: 'Project',
  getAll: getProjects, add: addProject, update: updateProject, delete: deleteProject,
  fields: [
    { name: 'title', label: 'Title', required: true, half: true },
    { name: 'date', label: 'Date', required: true, half: true, placeholder: 'e.g. July 2025' },
    { name: 'icon', label: 'Icon Class', half: true, placeholder: 'fas fa-code' },
    { name: 'github', label: 'GitHub URL', half: true, inputType: 'url' },
    { name: 'description', label: 'Description (one bullet per line)', type: 'textarea', required: true, rows: 5 },
    { name: 'tech', label: 'Tech Stack (comma-separated)', required: true, placeholder: 'Python, FastAPI, React' },
  ],
  serialize: (f) => ({
    ...f,
    description: (f.description || '').split('\n').filter((l) => l.trim()),
    tech: (f.tech || '').split(',').map((t) => t.trim()).filter(Boolean),
    icon: f.icon || 'fas fa-code',
  }),
  deserialize: (p) => ({
    title: p.title, date: p.date, icon: p.icon || 'fas fa-code',
    github: p.github || '', description: p.description.join('\n'), tech: p.tech.join(', '),
  }),
  itemIcon: (p) => p.icon || 'fas fa-code',
  itemTitle: (p) => p.title,
  itemMeta: (p) => `${p.date} · ${p.tech.join(', ')}`,
};

const skillConfig = {
  label: 'Skill Category',
  getAll: getSkills, add: addSkill, update: updateSkill, delete: deleteSkill,
  fields: [
    { name: 'title', label: 'Category Name', required: true, half: true, placeholder: 'e.g. Languages' },
    { name: 'icon', label: 'Category Icon', half: true, placeholder: 'fas fa-code' },
    { name: 'tags', label: 'Tags (format: icon|label per line)', type: 'textarea', required: true, rows: 4,
      placeholder: 'fab fa-python|Python\nfab fa-java|Java', hint: 'One per line: icon-class|Label' },
  ],
  serialize: (f) => ({
    title: f.title, icon: f.icon || 'fas fa-code',
    tags: (f.tags || '').split('\n').filter((l) => l.trim()).map((l) => {
      const [icon, label] = l.split('|').map((s) => s.trim());
      return { icon: icon || 'fas fa-tag', label: label || icon };
    }),
  }),
  deserialize: (s) => ({
    title: s.title, icon: s.icon || 'fas fa-code',
    tags: s.tags.map((t) => `${t.icon}|${t.label}`).join('\n'),
  }),
  itemIcon: (s) => s.icon || 'fas fa-code',
  itemTitle: (s) => s.title,
  itemMeta: (s) => s.tags.map((t) => t.label).join(', '),
};

const certConfig = {
  label: 'Certificate',
  getAll: getCertificates, add: addCertificate, update: updateCertificate, delete: deleteCertificate,
  fields: [
    { name: 'title', label: 'Certificate Title', required: true },
    { name: 'link', label: 'Verify Link URL', half: true, placeholder: 'https://...' },
    { name: 'issuer', label: 'Issuer', required: true, half: true },
    { name: 'date', label: 'Date', required: true, half: true },
    { name: 'icon', label: 'Icon Class', half: true, placeholder: 'fas fa-university' },
  ],
  serialize: (f) => ({ title: f.title, issuer: f.issuer, date: f.date, icon: f.icon || 'fas fa-university', link: f.link }),
  deserialize: (c) => ({ title: c.title, issuer: c.issuer, date: c.date, icon: c.icon || 'fas fa-university', link: c.link }),
  itemIcon: (c) => 'fas fa-certificate',
  itemTitle: (c) => c.title,
  itemMeta: (c) => `${c.issuer} · ${c.date}`,
};

const achievementConfig = {
  label: 'Achievement',
  getAll: getAchievements, add: addAchievement, update: updateAchievement, delete: deleteAchievement,
  fields: [
    { name: 'title', label: 'Title', required: true },
    { name: 'date', label: 'Date', required: true, half: true },
    { name: 'icon', label: 'Title Icon', half: true, placeholder: 'fas fa-medal' },
    { name: 'dotIcon', label: 'Timeline Dot Icon', half: true, placeholder: 'fas fa-star' },
    { name: 'text', label: 'Description', type: 'textarea', required: true, rows: 3 },
  ],
  serialize: (f) => ({ title: f.title, date: f.date, icon: f.icon || 'fas fa-medal', dotIcon: f.dotIcon || 'fas fa-star', text: f.text }),
  deserialize: (a) => ({ title: a.title, date: a.date, icon: a.icon, dotIcon: a.dotIcon, text: a.text }),
  itemIcon: (a) => a.icon || 'fas fa-medal',
  itemTitle: (a) => a.title,
  itemMeta: (a) => a.date,
};

const eduConfig = {
  label: 'Education',
  getAll: getEducation, add: addEducation, update: updateEducation, delete: deleteEducation,
  fields: [
    { name: 'degree', label: 'Degree / Level', required: true, half: true, placeholder: 'e.g. Bachelor of Technology' },
    { name: 'specialization', label: 'Specialization', half: true },
    { name: 'school', label: 'Institution', required: true },
    { name: 'date', label: 'Duration', required: true, half: true, placeholder: 'Aug 2023 – Present' },
    { name: 'score', label: 'Score / Grade', required: true, half: true, placeholder: 'CGPA: 7.50' },
    { name: 'icon', label: 'Card Icon', half: true, placeholder: 'fas fa-graduation-cap' },
    { name: 'schoolIcon', label: 'Location Icon', half: true, placeholder: 'fas fa-university' },
  ],
  serialize: (f) => ({
    degree: f.degree, specialization: f.specialization || '', school: f.school, date: f.date,
    score: f.score, icon: f.icon || 'fas fa-graduation-cap', schoolIcon: f.schoolIcon || 'fas fa-university',
  }),
  deserialize: (e) => ({
    degree: e.degree, specialization: e.specialization || '', school: e.school, date: e.date,
    score: e.score, icon: e.icon, schoolIcon: e.schoolIcon,
  }),
  itemIcon: (e) => e.icon || 'fas fa-graduation-cap',
  itemTitle: (e) => `${e.degree}${e.specialization ? ' — ' + e.specialization : ''}`,
  itemMeta: (e) => `${e.school} · ${e.date}`,
};

const contactConfig = {
  label: 'Contact',
  getAll: getContacts, add: addContact, update: updateContact, delete: deleteContact,
  fields: [
    { name: 'label', label: 'Label', required: true, half: true, placeholder: 'e.g. Email' },
    { name: 'value', label: 'Display Value', required: true, half: true, placeholder: 'e.g. me@email.com' },
    { name: 'href', label: 'Link URL', required: true, placeholder: 'mailto:me@email.com or https://...' },
    { name: 'icon', label: 'Icon Class', half: true, placeholder: 'fas fa-envelope' },
    { name: 'external', label: 'Opens New Tab? (yes/no)', half: true, placeholder: 'yes or no' },
  ],
  serialize: (f) => ({
    label: f.label, value: f.value, href: f.href, icon: f.icon || 'fas fa-link',
    external: (f.external || '').toLowerCase() === 'yes',
  }),
  deserialize: (c) => ({
    label: c.label, value: c.value, href: c.href, icon: c.icon, external: c.external ? 'yes' : 'no',
  }),
  itemIcon: (c) => c.icon || 'fas fa-link',
  itemTitle: (c) => c.label,
  itemMeta: (c) => c.value,
};

const TAB_CONFIGS = {
  projects: projectConfig,
  skills: skillConfig,
  certificates: certConfig,
  achievements: achievementConfig,
  education: eduConfig,
  contact: contactConfig,
};

// ━━━━ Main Admin Component ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function Admin() {
  const [activeTab, setActiveTab] = useState('profile');
  const [toast, setToast] = useState('');

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  return (
    <div className="page admin-page">
      <div className="container">
        <h2 className="section-title">
          <span className="section-number"><i className="fas fa-cog"></i></span>
          Admin Panel
        </h2>

        <Toast message={toast} />

        <div className="admin-tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`admin-tab${activeTab === t.key ? ' active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              <i className={t.icon}></i> <span>{t.label}</span>
            </button>
          ))}
        </div>

        <div className="admin-tab-content">
          {activeTab === 'profile' && <ProfileTab showToast={showToast} />}
          {activeTab !== 'profile' && TAB_CONFIGS[activeTab] && (
            <CrudTab key={activeTab} config={TAB_CONFIGS[activeTab]} showToast={showToast} />
          )}
        </div>
      </div>
    </div>
  );
}
