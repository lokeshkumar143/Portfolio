// Cinematic Project Dossier & Modal
import { sound } from '../lib/sound.js';

export const PROJECT_DETAILS = {
  p01_timeless: {
    tag: 'iOS Engineering · Healthcare',
    title: 'RecovFit — Patient Recovery & Fitness',
    subtitle: 'End-to-End iOS Application with Patient & Doctor Portals',
    desc: 'A comprehensive healthcare and rehabilitation platform connecting recovering patients with healthcare professionals. Built natively with SwiftUI and powered by an authenticated PHP/MySQL backend.',
    tech: ['Swift', 'SwiftUI', 'Xcode', 'PHP', 'MySQL', 'REST APIs', 'Patient & Doctor Portals'],
    metrics: [
      { label: 'Platform', val: 'iOS Native' },
      { label: 'Backend', val: 'PHP & MySQL' },
      { label: 'Architecture', val: 'Dual Portals' },
    ],
    problem: 'Post-operative recovery and rehabilitation often suffer from low patient adherence, fragmented communication between doctors and patients, and lack of real-time visibility into daily exercise progress. RecovFit bridges this gap by providing an intuitive dual-portal mobile ecosystem with scheduled video consultations and interactive recovery dashboards.',
    features: [
      'Patient experience: intuitive recovery tracking and tailored daily rehab exercises',
      'Doctor dashboard: clinical progress monitoring, patient oversight, and review portals',
      'Appointment booking: seamless consultation scheduling with healthcare providers',
      'Exercise management: structured rehabilitation routines with real-time feedback',
      'Backend integration: secure PHP & MySQL endpoints with authenticated patient sync'
    ],
    contrib: 'Led native iOS development in Swift & SwiftUI, engineered custom exercise tracking workflows, integrated doctor appointment booking flows, and developed secure RESTful endpoints in PHP connecting to a normalized MySQL database schema.',
    github: 'https://github.com/lokeshkumar143'
  },
  p02_game: {
    tag: 'Acoustic AI · Healthcare Diagnostics',
    title: 'Urosonic / UroFlow — Smartphone Uroflowmetry',
    subtitle: 'Audio-Based Urine Stream Analysis & Clinical Uroflow Curve Generation',
    desc: 'An innovative non-invasive clinical uroflowmetry system transforming smartphone microphones into diagnostic medical sensors through acoustic signal processing.',
    tech: ['Signal Processing', 'Audio Analysis', 'SwiftUI', 'Python', 'Acoustic Modeling', 'Doctor & Patient Portals'],
    metrics: [
      { label: 'Modality', val: 'Audio-Based' },
      { label: 'Output', val: 'Clinical Curves' },
      { label: 'Metric', val: 'Qmax & Volume' },
    ],
    problem: 'Traditional clinical uroflowmetry requires expensive, stationary hospital flowmeters that cause psychological discomfort and fail to capture natural day-to-day urinary dynamics. Urosonic utilizes acoustic signal acquisition through standard smartphone microphones, filtering background noise and computing continuous volume flow curves non-invasively.',
    features: [
      'Audio-based urine stream analysis via smartphone acoustic acquisition',
      'Advanced signal processing algorithms with background environmental noise filtering',
      'Clinical uroflow curve generation with continuous volumetric flow rate modeling',
      'Qmax calculation and voided volume metrics benchmarked to clinical diagnostics',
      'Patient and doctor portals for non-invasive self-monitoring and physician review'
    ],
    contrib: 'Designed the mobile user experience in SwiftUI, researched audio signal processing pipelines for acoustic flow signature extraction, benchmarked voided volume algorithms against clinical curve templates, and engineered patient review interfaces.',
    github: 'https://github.com/lokeshkumar143'
  },
  p03_build: {
    tag: 'EdTech · Gamification · Algorithms',
    title: 'Gamified DSA Learning Platform',
    subtitle: 'Duolingo-Inspired Programming Education with Phoenix Mascot',
    desc: 'A gamified computer science education application designed to make Data Structures and Algorithms intuitive, rewarding, and deeply visual for aspiring software engineers.',
    tech: ['Swift', 'SwiftUI', 'Gamification Engine', 'Algorithms', 'Interactive Canvas', 'Animation'],
    metrics: [
      { label: 'Pedagogy', val: 'Bite-Sized DSA' },
      { label: 'Mascot', val: 'Phoenix Guide' },
      { label: 'Format', val: 'Gamified Streaks' },
    ],
    problem: 'Computer science students often struggle with abstract algorithmic concepts and dry textbook theory. This platform turns Data Structures and Algorithms into an engaging, gamified adventure with interactive visual memory layouts and an encouraging Phoenix mascot.',
    features: [
      'Phoenix mascot providing motivational coaching, dynamic hints, and celebration loops',
      'Gamified learning mechanics with Duolingo-style streaks, XP progression, and level unlocks',
      'Data structure visualization: real-time interactive animations for trees, heaps, and graphs',
      'Interactive learning levels: bite-sized challenges breaking complex algorithms down',
      'Programming concepts: hands-on coding playground with visual edge-case validation'
    ],
    contrib: 'Architected the gamification engine, created animated Canvas visualizers for linked lists, binary search trees, and Dijkstra graphs, implemented XP/streak reward mechanics, and crafted the responsive SwiftUI interface.',
    github: 'https://github.com/lokeshkumar143'
  },
  p04_driven: {
    tag: 'Computer Vision · Deep Learning · Healthcare',
    title: 'Dental AI — Radiographic Image Segmentation',
    subtitle: 'Deep Learning Architecture for Automated Dental Structure Delineation',
    desc: 'An advanced biomedical computer vision project employing deep learning neural networks and OpenCV image preprocessing for automated dental anatomy and pathology segmentation.',
    tech: ['Python', 'PyTorch', 'OpenCV', 'Deep Learning', 'Image Segmentation', 'Model Evaluation'],
    metrics: [
      { label: 'Architecture', val: 'U-Net / Deep CNN' },
      { label: 'Preprocessing', val: 'OpenCV Pipeline' },
      { label: 'Domain', val: 'Biomedical AI' },
    ],
    problem: 'Manual identification of dental structures, bone levels, and lesions in panoramic radiographs is labor-intensive and susceptible to diagnostic variance. Dental AI provides automated, pixel-accurate segmentation to assist dentists in identifying early-stage dental pathologies.',
    features: [
      'Dental image processing: adaptive contrast and morphological filtering with OpenCV',
      'Segmentation pipeline: automated pixel-level tooth and pathology delineation',
      'Deep learning architecture: custom deep neural networks optimized for dental radiographs',
      'Model training and evaluation: rigorous cross-validation benchmarking with IoU and Dice metrics',
      'Clinical decision support: exportable diagnostic reports assisting dental practitioners'
    ],
    contrib: 'Developed OpenCV image enhancement pipelines (CLAHE, morphological operations), trained and fine-tuned deep segmentation architectures in PyTorch, evaluated cross-validation performance with Dice and IoU metrics, and constructed exported visual diagnostic overlays.',
    github: 'https://github.com/lokeshkumar143'
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

export function openProjectModal(id) {
  const dialog = document.getElementById('projModal');
  if (!dialog) return;
  const data = PROJECT_DETAILS[id] || PROJECT_DETAILS.p01_timeless;

  // Fill content
  const tagEl = document.getElementById('projModalTag');
  if (tagEl) tagEl.textContent = data.tag;
  const titleEl = document.getElementById('projModalTitle');
  if (titleEl) titleEl.textContent = data.title;
  const subEl = document.getElementById('projModalSubtitle');
  if (subEl) subEl.textContent = data.subtitle;
  const descEl = document.getElementById('projModalDesc');
  if (descEl) descEl.textContent = data.desc;

  // Pills
  const pillsWrap = document.getElementById('projModalPills');
  if (pillsWrap && data.tech) {
    pillsWrap.innerHTML = data.tech
      .map((t) => `<span class="proj-modal__pill">${t}</span>`)
      .join('');
  }

  // Metrics
  const metricsWrap = document.getElementById('projModalMetrics');
  if (metricsWrap && data.metrics) {
    metricsWrap.innerHTML = data.metrics
      .map(
        (m) =>
          `<div class="proj-modal__metric"><b>${m.val}</b><small>${m.label}</small></div>`
      )
      .join('');
  }

  // Features
  const featsWrap = document.getElementById('projModalFeatures');
  if (featsWrap && data.features) {
    featsWrap.innerHTML = data.features
      .map((f) => `<li><i></i><span>${f}</span></li>`)
      .join('');
  }

  // Problem & Solution
  const probEl = document.getElementById('projModalProblem');
  const probBlock = document.getElementById('projModalProblemBlock');
  if (probEl && probBlock) {
    if (data.problem) {
      probEl.textContent = data.problem;
      probBlock.style.display = '';
    } else {
      probBlock.style.display = 'none';
    }
  }

  // My Contribution
  const contribEl = document.getElementById('projModalContrib');
  const contribBlock = document.getElementById('projModalContribBlock');
  if (contribEl && contribBlock) {
    if (data.contrib) {
      contribEl.textContent = data.contrib;
      contribBlock.style.display = '';
    } else {
      contribBlock.style.display = 'none';
    }
  }

  // GitHub repository link
  const ghBtn = document.getElementById('projModalGithub');
  if (ghBtn) {
    ghBtn.href = data.github || 'https://github.com/lokeshkumar143';
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

export function initProjectModal() {
  const dialog = document.getElementById('projModal');
  const closeBtn = document.getElementById('projModalClose');
  const deck = document.getElementById('galleryDeck');
  if (!dialog || !deck) return;

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
    if (cardId) openProjectModal(cardId);
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close();
  });
  dialog.addEventListener('cancel', () => {
    document.body.classList.remove('modal-open');
  });
}

