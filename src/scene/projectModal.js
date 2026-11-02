// Cinematic Project Dossier & Modal
import { sound } from '../lib/sound.js';

export const PROJECT_DETAILS = {
  p01_timeless: {
    tag: 'iOS Engineering · Healthcare',
    title: 'Personal Fitness Patient Recovery',
    subtitle: 'End-to-End iOS Application for Clinical Recovery & Patient Monitoring',
    desc: 'Architected and shipped a healthcare iOS platform using Swift and SwiftUI designed to guide recovering patients through tailored rehabilitation routines, doctor-patient consultations, and real-time appointment bookings.',
    tech: ['Swift', 'SwiftUI', 'Xcode', 'REST APIs', 'PHP', 'MySQL', 'AI Chatbot'],
    metrics: [
      { label: 'Platform', val: 'iOS 17+' },
      { label: 'Role', val: 'Lead iOS Engineer' },
      { label: 'Architecture', val: 'MVVM + Clean' },
    ],
    features: [
      'Interactive appointment booking and real-time consultation scheduling',
      'AI chatbot integration for preliminary patient assistance and triage',
      'Secure PHP/MySQL backend synchronization via authenticated RESTful endpoints',
      'Fluid, accessible SwiftUI interface built according to Apple Human Interface Guidelines'
    ]
  },
  p02_game: {
    tag: 'Computer Vision · Deep Learning · iOS',
    title: 'Smart Ulcer Predictor (CoreML AI)',
    subtitle: 'Diagnostic Skin Ulcer Classification via Deep Learning Vision Models',
    desc: 'An AI-powered clinical decision-support tool enabling patients and practitioners to capture skin ulcer imagery and receive instantaneous prediction classes: Healing, Not Healing, or Normal Skin.',
    tech: ['SwiftUI', 'CoreML', 'Vision Framework', 'Deep Learning', 'Image Processing'],
    metrics: [
      { label: 'Model', val: 'CNN Classifier' },
      { label: 'Inference', val: 'On-Device CoreML' },
      { label: 'Latency', val: '< 80ms' },
    ],
    features: [
      'Real-time camera capture with Vision framework alignment guidance',
      'On-device CoreML inference ensuring complete medical patient data privacy',
      'Instant tri-state diagnostic classification with confidence scoring',
      'Clear medical disclaimer workflows aligned with healthcare compliance'
    ]
  },
  p03_build: {
    tag: 'Education · Mobile Ecosystem',
    title: 'SIMATS Student Mobile Ecosystem',
    subtitle: 'Cross-Disciplinary Engineering & Mentorship Mobile Platform',
    desc: 'Led iOS mobile initiatives and student development workflows across SIMATS Engineering, reviewing student pull requests, driving code standards, and coaching 50+ aspiring engineers toward App Store releases.',
    tech: ['Swift', 'UIKit', 'SwiftUI', 'Git Workflow', 'CI/CD Pipelines'],
    metrics: [
      { label: 'Engineers Trained', val: '50+' },
      { label: 'Promotion', val: 'Intern to Full-Time in 2 Mos' },
      { label: 'Review Velocity', val: 'Daily PRs' },
    ],
    features: [
      'Hands-on technical mentorship in Swift, UIKit, memory management, and Instruments',
      'Strict code review standards prioritizing performance, accessibility, and clean architecture',
      'Direct guidance through TestFlight distribution and App Store review protocols'
    ]
  },
  p04_driven: {
    tag: 'Architecture & Design Systems',
    title: 'SwiftUI Architecture & Clean Code',
    subtitle: 'Modular, Testable, and Scalable iOS Component Frameworks',
    desc: 'A showcase of reactive iOS architecture patterns utilizing Combine, dependency injection, and state-driven SwiftUI components for smooth 120Hz ProMotion animation loops.',
    tech: ['SwiftUI', 'Combine', 'Async/Await', 'XCTest', 'ViewModifiers'],
    metrics: [
      { label: 'Framerate', val: '120 FPS' },
      { label: 'Test Coverage', val: 'High Unit/UI' },
      { label: 'Reusability', val: 'Componentized' },
    ],
    features: [
      'Decoupled domain layers with unidirectional data flow (UDF)',
      'Custom animated ViewModifiers and interactive gestural transitions',
      'Robust unit tests for business logic and snapshot testing for visual fidelity'
    ]
  },
  p05_ideas: {
    tag: 'Location Services · CoreLocation',
    title: 'MapKit & CoreLocation Geo Engine',
    subtitle: 'High-Precision Geographic Tracking & Real-Time Proximity Triggering',
    desc: 'Integrated location-aware capabilities featuring custom map annotations, geofencing, heading calculations, and battery-optimized GPS polling.',
    tech: ['MapKit', 'CoreLocation', 'Swift', 'Geofencing'],
    metrics: [
      { label: 'Accuracy', val: 'Sub-10m' },
      { label: 'Battery Impact', val: 'Minimal' },
      { label: 'Clustering', val: 'Dynamic' },
    ],
    features: [
      'Custom MKAnnotation views with animated pin transitions',
      'Polygon region geofencing with background entry/exit triggers',
      'Energy-efficient location throttling based on device movement state'
    ]
  },
  p06_sound: {
    tag: 'Cloud Integration · Realtime DB',
    title: 'Firebase Realtime DB & Auth',
    subtitle: 'Synchronized State, Cloud Messaging & Identity Management',
    desc: 'Scalable backend integration with Firebase, leveraging real-time listeners for live chat/updates, phone/email authentication, and push notifications via APNs.',
    tech: ['Firebase Auth', 'Firestore', 'Cloud Messaging (FCM)', 'APNs'],
    metrics: [
      { label: 'Auth Sync', val: 'Instant' },
      { label: 'Push Support', val: 'APNs Integrated' },
      { label: 'Security', val: 'Rule Enforced' },
    ],
    features: [
      'Secure token-based authentication and session refresh',
      'Realtime WebSocket data streams with offline disk persistence',
      'Rich push notifications with custom sound and interactive action payloads'
    ]
  },
  p07_food: {
    tag: 'Database · Enterprise AI',
    title: 'Oracle AI Database & SQL Architecture',
    subtitle: 'Certified Database Design & AI SQL Query Optimization',
    desc: 'Official Oracle AI Database SQL Certified Associate proficiency, structuring relational schemas, relational integrity, stored procedures, and complex data queries.',
    tech: ['Oracle SQL', 'Database Normalization', 'Indexing', 'Query Optimization'],
    metrics: [
      { label: 'Certification', val: 'Oracle Certified Associate' },
      { label: 'Integrity', val: 'ACID Compliant' },
      { label: 'Scale', val: 'Enterprise' },
    ],
    features: [
      'Optimized indexed queries for low-latency relational reads',
      'Database normalization, foreign-key constraint enforcement, and triggers',
      'AI database query assistance and automated analytical aggregation'
    ]
  },
  p08_travel: {
    tag: 'Quality Engineering · Test Automation',
    title: 'Selenium Automated Web QA',
    subtitle: 'Automated Functional and Regression Test Frameworks',
    desc: 'Built and executed structured automated test suites using Selenium WebDriver, validating end-to-end user workflows, API contracts, and cross-browser reliability.',
    tech: ['Selenium', 'Python', 'Java', 'Regression Testing', 'CI Integration'],
    metrics: [
      { label: 'Disciplines', val: '4 QA Pillars' },
      { label: 'Coverage', val: 'End-to-End' },
      { label: 'Automation', val: 'Headless CI' },
    ],
    features: [
      'Page Object Model (POM) pattern for maintainable automated testing',
      'Cross-browser matrix execution across Chrome, Safari, and Firefox',
      'Automated defect reporting with full visual failure traces'
    ]
  },
  p09_space: {
    tag: 'Mobile QA · Cross-Platform',
    title: 'Appium iOS & Android Mobile QA',
    subtitle: 'Device Automation for Real Hardware & Simulators',
    desc: 'End-to-end mobile test automation with Appium, driving native iOS (XCUITest) and Android (UiAutomator2) touch events, lifecycle tests, and edge-case validation.',
    tech: ['Appium', 'XCUITest', 'Mobile Testing', 'Device Cloud'],
    metrics: [
      { label: 'Platforms', val: 'iOS & Android' },
      { label: 'Gestures', val: 'Multi-Touch & Swipes' },
      { label: 'Regression', val: 'Automated' },
    ],
    features: [
      'Native element inspection and robust accessibility identifier locators',
      'Automated gesture simulation including pinches, scrolls, and drag-and-drop',
      'Device orientation and memory constraint resilience testing'
    ]
  },
  p10_play: {
    tag: 'Security & Penetration Testing',
    title: 'Backend Vulnerability Security Shield',
    subtitle: 'Proactive Threat Modeling & API Penetration Assessment',
    desc: 'Conducted rigorous security and penetration audits against backend endpoints to proactively eliminate SQL injection, broken authentication, and unauthorized privilege escalation.',
    tech: ['Postman', 'Burp Suite', 'OWASP Top 10', 'API Hardening'],
    metrics: [
      { label: 'Audit Scope', val: 'OWASP Top 10' },
      { label: 'Vulnerabilities', val: 'Zero Critical' },
      { label: 'Access Control', val: 'RBAC Validated' },
    ],
    features: [
      'Systematic fuzzing and parameter validation to prevent injection exploits',
      'CORS, CSRF, and JWT authorization header audit and enforcement',
      'Comprehensive vulnerability assessment documentation and remediation'
    ]
  },
  p11_cleaner: {
    tag: 'Performance Engineering · SRE',
    title: 'High-Traffic Server Load Testing',
    subtitle: 'Traffic Emulation, Concurrency Benchmarking & Bottleneck Analysis',
    desc: 'Executed high-concurrency load and stress benchmarks on backend services, determining server breaking points, latency degradation curves, and memory leaks.',
    tech: ['Load Testing', 'Concurrency', 'Benchmarking', 'Server Metrics'],
    metrics: [
      { label: 'Concurrency', val: '1,000+ VUs' },
      { label: 'Benchmarking', val: 'p95 & p99 Latency' },
      { label: 'Stability', val: 'Verified Under Load' },
    ],
    features: [
      'Ramp-up, spike, and endurance load testing scenario design',
      'Monitoring CPU, RAM, and database connection pool saturation',
      'Delivery of actionable infrastructure scaling recommendations'
    ]
  },
  p12_steps: {
    tag: 'Release Engineering · App Store',
    title: 'Production App Store Deployment',
    subtitle: 'Certificate Provisioning, TestFlight Distribution & App Store Review',
    desc: 'End-to-end mastery of Apple Developer accounts, distribution certificates, provisioning profiles, privacy manifest declarations, and App Store review guidelines.',
    tech: ['App Store Connect', 'TestFlight', 'Code Signing', 'Privacy Manifests'],
    metrics: [
      { label: 'Store Readiness', val: '100% Compliant' },
      { label: 'Review Success', val: 'Zero Rejections' },
      { label: 'Signing', val: 'Hardened Runtime' },
    ],
    features: [
      'Strict adherence to Apple Human Interface Guidelines and Review Guidelines',
      'Privacy manifests (NSPrivacyAccessedAPITypes) compliance for modern iOS',
      'Multi-stage TestFlight external beta distribution and crash analysis'
    ]
  }
};

export function initProjectModal() {
  const dialog = document.getElementById('projModal');
  const closeBtn = document.getElementById('projModalClose');
  const deck = document.getElementById('galleryDeck');
  if (!dialog || !deck) return;

  function open(id) {
    const data = PROJECT_DETAILS[id] || PROJECT_DETAILS.p01_timeless;

    // Fill content
    document.getElementById('projModalTag').textContent = data.tag;
    document.getElementById('projModalTitle').textContent = data.title;
    document.getElementById('projModalSubtitle').textContent = data.subtitle;
    document.getElementById('projModalDesc').textContent = data.desc;

    // Pills
    const pillsWrap = document.getElementById('projModalPills');
    if (pillsWrap) {
      pillsWrap.innerHTML = data.tech
        .map((t) => `<span class="proj-modal__pill">${t}</span>`)
        .join('');
    }

    // Metrics
    const metricsWrap = document.getElementById('projModalMetrics');
    if (metricsWrap) {
      metricsWrap.innerHTML = data.metrics
        .map(
          (m) =>
            `<div class="proj-modal__metric"><b>${m.val}</b><small>${m.label}</small></div>`
        )
        .join('');
    }

    // Features
    const featsWrap = document.getElementById('projModalFeatures');
    if (featsWrap) {
      featsWrap.innerHTML = data.features
        .map((f) => `<li><i></i><span>${f}</span></li>`)
        .join('');
    }

    // Artwork preview
    const imgPreview = document.getElementById('projModalImg');
    if (imgPreview) {
      imgPreview.src = `public/projects/${id}.png`;
      imgPreview.alt = data.title;
    }

    sound.playClick(true);
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    document.body.classList.add('modal-open');
  }

  function close() {
    sound.playClick(false);
    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
    document.body.classList.remove('modal-open');
  }

  // Click on cards
  deck.addEventListener('click', (e) => {
    const card = e.target.closest('.g-card');
    if (!card) return;
    const cardId = card.querySelector('img')?.getAttribute('src')?.split('/')?.pop()?.replace('.png', '');
    if (cardId) open(cardId);
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close();
  });
  dialog.addEventListener('cancel', () => {
    document.body.classList.remove('modal-open');
  });
}

