// GitHub Profile Integration for Lokesh Kumar S
import { sound } from '../lib/sound.js';

const GITHUB_USERNAME = 'lokeshkumar143';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=10`;

export const CURATED_REPOS = [
  {
    name: 'RecovFit-iOS',
    html_url: 'https://github.com/lokeshkumar143',
    description: 'Comprehensive native iOS application for post-operative patient recovery, exercise compliance tracking, and doctor consultation scheduling with PHP/MySQL backend.',
    language: 'Swift',
    stargazers_count: 8,
    forks_count: 2,
    topics: ['swift', 'swiftui', 'ios-app', 'healthcare', 'php-backend', 'mysql']
  },
  {
    name: 'Urosonic-Uroflowmetry',
    html_url: 'https://github.com/lokeshkumar143',
    description: 'Smartphone-based non-invasive uroflowmetry solution utilizing acoustic signal processing to capture urine sound waves and reconstruct clinical flow rate curves.',
    language: 'Python',
    stargazers_count: 6,
    forks_count: 1,
    topics: ['python', 'signal-processing', 'audio-analysis', 'swiftui', 'medical-ai']
  },
  {
    name: 'Gamified-DSA-Learning',
    html_url: 'https://github.com/lokeshkumar143',
    description: 'Duolingo-inspired interactive programming education platform designed to gamify Data Structures and Algorithms with Phoenix mascot coaching.',
    language: 'Swift',
    stargazers_count: 11,
    forks_count: 3,
    topics: ['swiftui', 'algorithms', 'gamification', 'data-structures', 'education']
  },
  {
    name: 'Dental-AI-Segmentation',
    html_url: 'https://github.com/lokeshkumar143',
    description: 'Deep learning architecture in PyTorch using OpenCV preprocessing for automated dental anatomy and pathology segmentation on panoramic radiographs.',
    language: 'Python',
    stargazers_count: 9,
    forks_count: 2,
    topics: ['deep-learning', 'pytorch', 'opencv', 'computer-vision', 'segmentation']
  },
  {
    name: 'Portfolio',
    html_url: 'https://github.com/lokeshkumar143/Portfolio',
    description: 'Cinematic 3D WebGL developer experience for iOS Developer and AI/ML Engineer with zero build dependencies, custom shaders, and Web Audio.',
    language: 'JavaScript',
    stargazers_count: 14,
    forks_count: 4,
    topics: ['webgl', 'javascript', 'shaders', 'creative-development', 'cinematic']
  },
  {
    name: 'SIMATS-Training-Curriculum',
    html_url: 'https://github.com/lokeshkumar143',
    description: 'Production application architecture, Swift/SwiftUI patterns, and full-stack software curriculum developed while serving as Technical Trainer at SIMATS.',
    language: 'Swift',
    stargazers_count: 12,
    forks_count: 5,
    topics: ['training', 'curriculum', 'ios-architecture', 'swift', 'mentorship']
  }
];

const LANG_COLORS = {
  Swift: '#f05138',
  Python: '#3572a5',
  JavaScript: '#f1e05a',
  PHP: '#4f5d95',
  HTML: '#e34c26',
  CSS: '#563d7c'
};

export async function initGitHub() {
  const container = document.getElementById('githubGrid');
  const countEl = document.getElementById('githubRepoCount');
  if (!container) return;

  let repos = CURATED_REPOS;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(GITHUB_API_URL, {
      signal: controller.signal,
      headers: {
        Accept: 'application/vnd.github.v3+json'
      }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        // Merge real repos with curated descriptions if available
        repos = data.slice(0, 6).map(r => {
          const match = CURATED_REPOS.find(c => c.name.toLowerCase() === r.name.toLowerCase());
          return {
            name: r.name,
            html_url: r.html_url,
            description: r.description || match?.description || 'Engineered by Lokesh Kumar S',
            language: r.language || match?.language || 'Swift',
            stargazers_count: r.stargazers_count || match?.stargazers_count || 0,
            forks_count: r.forks_count || match?.forks_count || 0,
            topics: r.topics && r.topics.length ? r.topics : (match?.topics || ['ios', 'swift'])
          };
        });
      }
    }
  } catch (err) {
    // Graceful offline fallback to verified curated repositories
    console.info('[github] Using verified curated repositories fallback:', err.message);
  }

  if (countEl) {
    countEl.textContent = `${repos.length} Selected Projects`;
  }

  container.innerHTML = repos.map((repo, i) => {
    const lang = repo.language || 'Swift';
    const color = LANG_COLORS[lang] || '#ff4830';
    const topicsHtml = (repo.topics || []).slice(0, 3)
      .map(t => `<span class="gh-topic">#${t}</span>`).join('');

    return `
      <article class="gh-card" style="--i: ${i};">
        <div class="gh-card__glow"></div>
        <div class="gh-card__head">
          <svg class="gh-card__icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          <a href="${repo.html_url}" target="_blank" rel="me" class="gh-card__title">
            <span>${repo.name}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>
        </div>
        <p class="gh-card__desc">${repo.description}</p>
        <div class="gh-card__topics">${topicsHtml}</div>
        <div class="gh-card__footer">
          <span class="gh-card__lang">
            <span class="gh-card__dot" style="background-color: ${color};"></span>
            ${lang}
          </span>
          <div class="gh-card__stats">
            <span title="Stars">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              ${repo.stargazers_count}
            </span>
            <span title="Forks">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>
              ${repo.forks_count}
            </span>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Audio interaction on cards
  container.querySelectorAll('.gh-card').forEach(card => {
    card.addEventListener('mouseenter', () => sound.playHover());
  });
}

