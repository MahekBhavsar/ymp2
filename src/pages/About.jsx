import { useState, useEffect } from 'react';
import { getWebsiteSettings } from '../lib/services';
import { DEFAULT_SETTINGS } from '../lib/demoData';
import './About.css';

export default function About() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  useEffect(() => { getWebsiteSettings().then(setSettings).catch(() => {}); }, []);
  const { about } = settings;

  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="container text-center">
          <h1>{about.title}</h1>
        </div>
      </div>

      <section className="page-section">
        <div className="container">
          <div className="about-story-grid">
            <div className="about-story-image">
              <img src={about.image || '/assets/images/story_sisters.jpg'} alt="Four Sisters" />
            </div>
            <div className="about-story-content">
              <h2>Our Story</h2>
              {about.story.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </div>
      </section>

      <section className="page-section bg-alternate">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Meet the Sisters</h2>
            <p className="section-subtitle">The hearts and hands behind every creation</p>
          </div>
          <div className="grid grid-cols-4 sisters-grid">
            {about.sisters.map((s, i) => (
              <div key={i} className="sister-card text-center">
                <div className="sister-image">
                  {s.image ? <img src={s.image} alt={s.name} /> : <div className="sister-placeholder">{s.name[0]}</div>}
                </div>
                <h3>{s.name}</h3>
                <p className="sister-role">{s.role}</p>
                <p className="sister-desc">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container text-center" style={{ maxWidth: '700px' }}>
          <h2 className="section-title">Our Mission</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>{about.mission}</p>
        </div>
      </section>

      <section className="page-section bg-alternate">
        <div className="container text-center" style={{ maxWidth: '700px' }}>
          <h2 className="section-title">Our Philosophy</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>{about.philosophy}</p>
        </div>
      </section>
    </div>
  );
}
