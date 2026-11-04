// Universal Magical Progressive Reveal Engine
// Transforms static layouts into an enchanting one-by-one sequential materialization.
// Elements emerge with golden/crimson radiant ignition, pentatonic chimes, and spring physics.

import { sound } from '../lib/sound.js';

export function initMagicalReveal() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  initUniverseMagicalSequence(reduced);
  initAboutMagicalSequence(reduced);
  initSkillsMagicalSequence(reduced);
  initDevicesMagicalSequence(reduced);
  initProjectsMagicalSequence(reduced);
  initGitHubMagicalSequence(reduced);
  initHeroMagicalSequence(reduced);
}

/**
 * 1. Scene 02 — The Developer Universe (Constellation Nodes)
 * Sequentially ignites the 10 skill constellation nodes one-by-one in an alternating cosmic cascade.
 */
function initUniverseMagicalSequence(reduced) {
  const section = document.getElementById('universe');
  const constellation = document.getElementById('uniConstellation');
  if (!section || !constellation) return;

  const leftNodes = Array.from(constellation.querySelectorAll('.uni-cluster--left .uni-node'));
  const rightNodes = Array.from(constellation.querySelectorAll('.uni-cluster--right .uni-node'));

  // Interleave left and right nodes: Top-L, Top-R, Second-L, Second-R...
  // [Swift, AI/ML, SwiftUI, Python, iOS & UIKit, PHP, React Native, MySQL, GitHub, FastAPI]
  const sequence = [];
  const maxLen = Math.max(leftNodes.length, rightNodes.length);
  for (let i = 0; i < maxLen; i++) {
    if (leftNodes[i]) sequence.push(leftNodes[i]);
    if (rightNodes[i]) sequence.push(rightNodes[i]);
  }

  let hasRevealed = false;

  const runSequence = () => {
    if (hasRevealed) return;
    hasRevealed = true;

    if (reduced) {
      sequence.forEach((node) => {
        node.classList.add('is-revealed');
      });
      return;
    }

    // Initial cosmic breath pause before stars ignite
    setTimeout(() => {
      sequence.forEach((node, idx) => {
        setTimeout(() => {
          // 1. Ignite with brilliant radiant flash & spring expansion
          node.classList.remove('is-revealed');
          node.classList.add('is-igniting');

          // 2. Play ascending pentatonic chime for each node
          sound.playChime(idx);

          // 3. Settle into resting state with ambient float
          setTimeout(() => {
            node.classList.remove('is-igniting');
            node.classList.add('is-revealed');
          }, 320);

          // If final node, play soft resonant completion chord
          if (idx === sequence.length - 1) {
            setTimeout(() => {
              sound.playChime(0);
              setTimeout(() => sound.playChime(4), 80);
              setTimeout(() => sound.playChime(7), 160);
            }, 300);
          }
        }, idx * 170); // 170ms interval between nodes
      });
    }, 420);
  };

  const observer = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        runSequence();
      }
    }
  }, { threshold: 0.25 });

  observer.observe(section);
}

/**
 * 2. Scene 02 — About / Professional Narrative Section
 * Progressively reveals the 4 engineering narrative items one-by-one.
 */
function initAboutMagicalSequence(reduced) {
  const section = document.getElementById('about');
  if (!section) return;

  const items = section.querySelectorAll('.about-item');
  const card = section.querySelector('.about-narrative__card');
  if (!items.length) return;

  let hasRevealed = false;

  const observer = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting && !hasRevealed) {
        hasRevealed = true;

        if (card) {
          card.classList.add('magical-revealed');
        }

        if (reduced) {
          items.forEach((item) => item.classList.add('magical-revealed'));
          return;
        }

        items.forEach((item, idx) => {
          setTimeout(() => {
            item.classList.add('magical-igniting');
            sound.playChime(idx + 1);

            setTimeout(() => {
              item.classList.remove('magical-igniting');
              item.classList.add('magical-revealed');
            }, 300);
          }, 250 + idx * 160);
        });
      }
    }
  }, { threshold: 0.20 });

  observer.observe(section);
}

/**
 * 3. Scene 03 — Technical Skills Section
 * Staggers the 5 technical monolith cards and cascades skill chips within each.
 */
function initSkillsMagicalSequence(reduced) {
  const section = document.getElementById('skills');
  if (!section) return;

  const cards = section.querySelectorAll('.sk-card');
  if (!cards.length) return;

  let hasRevealed = false;

  const observer = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting && !hasRevealed) {
        hasRevealed = true;

        if (reduced) {
          cards.forEach((card) => card.classList.add('magical-revealed'));
          return;
        }

        cards.forEach((card, idx) => {
          setTimeout(() => {
            card.classList.add('magical-igniting');
            sound.playChime(idx + 2);

            setTimeout(() => {
              card.classList.remove('magical-igniting');
              card.classList.add('magical-revealed');

              // Cascade skill chips inside this card
              const chips = card.querySelectorAll('.sk-chip');
              chips.forEach((chip, cIdx) => {
                setTimeout(() => {
                  chip.classList.add('magical-chip-revealed');
                }, cIdx * 45);
              });
            }, 300);
          }, 200 + idx * 180);
        });
      }
    }
  }, { threshold: 0.15 });

  observer.observe(section);
}

/**
 * 4. Scene 05 — Devices Showcase Section
 * Rises the iPhone frame, pulses Dynamic Island, and cascades project tabs one-by-one.
 */
function initDevicesMagicalSequence(reduced) {
  const section = document.getElementById('devices');
  if (!section) return;

  const phone = section.querySelector('.dev-phone');
  const tabs = section.querySelectorAll('.dev-tab');
  const details = section.querySelector('.dev-details');
  if (!phone) return;

  let hasRevealed = false;

  const observer = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting && !hasRevealed) {
        hasRevealed = true;

        if (reduced) {
          phone.classList.add('magical-revealed');
          tabs.forEach((t) => t.classList.add('magical-revealed'));
          if (details) details.classList.add('magical-revealed');
          return;
        }

        // 1. Phone ascends
        phone.classList.add('magical-revealed');
        sound.playChime(0);

        // 2. Dynamic Island flash pulse
        const island = phone.querySelector('.dev-phone__island');
        if (island) {
          setTimeout(() => {
            island.classList.add('is-pulsing');
            setTimeout(() => island.classList.remove('is-pulsing'), 600);
          }, 350);
        }

        // 3. Project tabs light up one by one
        tabs.forEach((tab, idx) => {
          setTimeout(() => {
            tab.classList.add('magical-igniting');
            sound.playChime((idx % 5) + 3);

            setTimeout(() => {
              tab.classList.remove('magical-igniting');
              tab.classList.add('magical-revealed');
            }, 260);
          }, 450 + idx * 130);
        });

        // 4. Details panel materializes
        if (details) {
          setTimeout(() => {
            details.classList.add('magical-revealed');
          }, 450 + tabs.length * 130 + 100);
        }
      }
    }
  }, { threshold: 0.20 });

  observer.observe(section);
}

/**
 * 5. Scene 04 — Featured Projects Section
 * Staggers each project card as the user scrolls into the gallery.
 */
function initProjectsMagicalSequence(reduced) {
  const section = document.getElementById('gallery');
  if (!section) return;

  const cards = section.querySelectorAll('.proj-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        const card = e.target;
        if (!card.classList.contains('magical-revealed')) {
          if (reduced) {
            card.classList.add('magical-revealed');
          } else {
            card.classList.add('magical-igniting');
            sound.playChime(3);
            setTimeout(() => {
              card.classList.remove('magical-igniting');
              card.classList.add('magical-revealed');
            }, 320);
          }
        }
      }
    }
  }, { threshold: 0.18 });

  cards.forEach((card) => observer.observe(card));
}

/**
 * 6. Scene 07 — GitHub & Codebase Section
 * Staggers repo cards sequentially when populated.
 */
function initGitHubMagicalSequence(reduced) {
  const section = document.getElementById('github');
  if (!section) return;

  let hasRevealed = false;

  const revealCards = () => {
    const cards = section.querySelectorAll('.gh-card');
    if (!cards.length || hasRevealed) return;
    hasRevealed = true;

    if (reduced) {
      cards.forEach((c) => c.classList.add('magical-revealed'));
      return;
    }

    cards.forEach((card, idx) => {
      setTimeout(() => {
        card.classList.add('magical-igniting');
        sound.playChime((idx % 6) + 2);
        setTimeout(() => {
          card.classList.remove('magical-igniting');
          card.classList.add('magical-revealed');
        }, 280);
      }, idx * 140);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        revealCards();
      }
    }
  }, { threshold: 0.15 });

  observer.observe(section);

  // In case cards are loaded asynchronously via GitHub API
  const mutObserver = new MutationObserver(() => {
    const cards = section.querySelectorAll('.gh-card');
    if (cards.length > 0 && !hasRevealed) {
      // If section is already in view, reveal
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        revealCards();
      }
    }
  });

  const grid = section.querySelector('.gh-grid');
  if (grid) mutObserver.observe(grid, { childList: true });
}

/**
 * 7. Scene 01 — Hero Introduction Actions
 * Cascades the kicker, tagline, tech pills, and hero CTA buttons sequentially.
 */
function initHeroMagicalSequence(reduced) {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const kicker = document.querySelector('.welcome__kicker');
  const tagline = document.querySelector('.welcome__tagline');
  const pills = document.querySelectorAll('.welcome__tech .tech-pill');
  const btns = document.querySelectorAll('.hero-btns .hero-btn');

  // Called when hero entrance reaches its steady mark
  const startHeroCascade = () => {
    if (reduced) {
      if (kicker) kicker.classList.add('magical-revealed');
      if (tagline) tagline.classList.add('magical-revealed');
      pills.forEach((p) => p.classList.add('magical-revealed'));
      btns.forEach((b) => b.classList.add('magical-revealed'));
      return;
    }

    setTimeout(() => {
      if (kicker) kicker.classList.add('magical-revealed');
    }, 600);

    setTimeout(() => {
      if (tagline) tagline.classList.add('magical-revealed');
    }, 850);

    pills.forEach((pill, idx) => {
      setTimeout(() => {
        pill.classList.add('magical-revealed');
      }, 1100 + idx * 80);
    });

    btns.forEach((btn, idx) => {
      setTimeout(() => {
        btn.classList.add('magical-revealed');
      }, 1500 + idx * 100);
    });
  };

  // Trigger once window has booted or hero is active
  if (document.body.classList.contains('is-booted')) {
    startHeroCascade();
  } else {
    window.addEventListener('load', () => {
      setTimeout(startHeroCascade, 1200);
    }, { once: true });
  }
}

