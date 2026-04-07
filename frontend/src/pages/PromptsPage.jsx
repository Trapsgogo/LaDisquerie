import React, { useState, useEffect } from 'react';
import { promptService } from '../services/services';
import '../styles/prompts.css';

export default function PromptsPage() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    try {
      setLoading(true);
      const response = await promptService.getAllPrompts();
      setPrompts(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="prompts-container">
      <h1>📝 Historique des Prompts</h1>
      
      {loading ? (
        <p className="loading">Chargement des prompts...</p>
      ) : prompts.length === 0 ? (
        <p className="no-prompts">Aucun prompt enregistré pour le moment.</p>
      ) : (
        <div className="prompts-timeline">
          {prompts.map((prompt, index) => (
            <div key={prompt._id || index} className="prompt-item">
              <div className="prompt-marker"></div>
              <div className="prompt-content-box">
                <div className="prompt-header">
                  <span className="prompt-number">#{prompts.length - index}</span>
                  <span className="prompt-time">{formatDate(prompt.timestamp)}</span>
                </div>
                <div className="prompt-text">
                  {prompt.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
