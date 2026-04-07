import React from 'react';
import '../styles/credits.css';

export default function CreditsPage() {
  const creators = [
    {
      name: 'Hugo Boubault',
      role: 'Développeur Full Stack'
    },
    {
      name: 'François Adeline',
      role: 'Développeur / Designer'
    },
    {
      name: 'Michaël Millet',
      role: 'Développeur Backend'
    },
    {
      name: 'Antoine MERY',
      role: 'Développeur Frontend'
    }
  ];

  return (
    <div className="credits-container">
      <div className="credits-header">
        <h1>🎬 Crédits</h1>
        <p className="subtitle">LaDisquerie - Gestionnaire de Collection de Disques</p>
      </div>

      <div className="credits-content">
        <section className="credits-section">
          <h2>👥 Créateurs du Projet</h2>
          <div className="creators-grid">
            {creators.map((creator, idx) => (
              <div key={idx} className="creator-card">
                <div className="creator-name">{creator.name}</div>
                <div className="creator-role">{creator.role}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="credits-section">
          <h2>🏢 Propriétaire du Dépôt</h2>
          <div className="owner-card">
            <div className="owner-name">Trapsgogo</div>
            <p className="owner-info">Propriétaire principal du dépôt GitHub</p>
          </div>
        </section>

        <section className="credits-section">
          <h2>🔗 Collaborateurs</h2>
          <div className="collaborators-info">
            <p>Ce projet est en collaboration avec <strong>Trapsgogo</strong> en tant que propriétaire principal du dépôt.</p>
          </div>
        </section>

        <section className="credits-section">
          <h2>📚 Technologie</h2>
          <div className="tech-stack">
            <div className="tech-category">
              <h3>Backend</h3>
              <ul>
                <li>Node.js</li>
                <li>Express.js</li>
                <li>MongoDB</li>
                <li>Mongoose</li>
                <li>JWT Authentication</li>
              </ul>
            </div>
            <div className="tech-category">
              <h3>Frontend</h3>
              <ul>
                <li>React 18</li>
                <li>React Router</li>
                <li>Vite</li>
                <li>Axios</li>
                <li>CSS Modern</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="credits-section">
          <h2>🎯 Fonctionnalités Principales</h2>
          <ul className="features-list">
            <li>✓ Authentification sécurisée par JWT</li>
            <li>✓ Gestion complète de collection de disques</li>
            <li>✓ Système d'emprunts avec rappels</li>
            <li>✓ Intégration OMDB pour les recherches</li>
            <li>✓ Page de découverte de nouvelles sorties</li>
            <li>✓ Système de favoris et liste d'achat</li>
            <li>✓ Historique des prompts avec timestamps</li>
          </ul>
        </section>

        <section className="credits-section">
          <h2>📝 Licence</h2>
          <p className="license-text">
            Projet LaDisquerie © 2024 - Développé par Hugo Boubault, François Adeline, Michaël Millet, et Antoine MERY
          </p>
        </section>
      </div>

      <footer className="credits-footer">
        <p>Merci d'utiliser LaDisquerie! 🎵</p>
      </footer>
    </div>
  );
}
