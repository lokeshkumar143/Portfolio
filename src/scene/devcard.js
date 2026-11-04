// Interactive Developer Profile & Contact Modal
// Features high-definition video of Lokesh Kumar S (developer_nod.mp4)

export function initDevCard() {
  const dialog = document.getElementById('devModal');
  const openBtns = document.querySelectorAll('#devBadgeBtn, .js-open-devcard');
  const closeBtn = document.getElementById('devModalClose');
  const copyBtn = document.getElementById('devCopyEmail');
  const copyFeedback = document.getElementById('devCopyFeedback');
  const video = dialog ? dialog.querySelector('.dev-modal__video') : null;

  if (!dialog) return;

  function open() {
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    document.body.classList.add('modal-open');
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }

  function close() {
    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
    document.body.classList.remove('modal-open');
    if (video) video.pause();
    if (copyFeedback) copyFeedback.classList.remove('is-active');
  }

  openBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      open();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', close);
  }

  dialog.addEventListener('click', (e) => {
    // clicking on the backdrop closes the modal
    if (e.target === dialog) close();
  });

  dialog.addEventListener('cancel', () => {
    document.body.classList.remove('modal-open');
    if (video) video.pause();
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = 'lokeshkumar142005@gmail.com';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          const input = document.createElement('input');
          input.value = email;
          document.body.appendChild(input);
          input.select();
          document.execCommand('copy');
          document.body.removeChild(input);
        }
        if (copyFeedback) {
          copyFeedback.textContent = 'Email copied!';
          copyFeedback.classList.add('is-active');
          setTimeout(() => {
            if (copyFeedback) copyFeedback.classList.remove('is-active');
          }, 2400);
        }
      } catch (err) {
        console.warn('Copy failed:', err);
      }
    });
  }

  // Working Contact Form with validation & user feedback
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const msgInput = document.getElementById('contactMessage');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const msgError = document.getElementById('msgError');
    const statusText = document.getElementById('contactStatus');

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const name = nameInput?.value.trim() || '';
      const email = emailInput?.value.trim() || '';
      const msg = msgInput?.value.trim() || '';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name) {
        nameError?.classList.add('is-visible');
        nameInput?.classList.add('is-invalid');
        valid = false;
      } else {
        nameError?.classList.remove('is-visible');
        nameInput?.classList.remove('is-invalid');
      }

      if (!email || !emailRegex.test(email)) {
        emailError?.classList.add('is-visible');
        emailInput?.classList.add('is-invalid');
        valid = false;
      } else {
        emailError?.classList.remove('is-visible');
        emailInput?.classList.remove('is-invalid');
      }

      if (!msg) {
        msgError?.classList.add('is-visible');
        msgInput?.classList.add('is-invalid');
        valid = false;
      } else {
        msgError?.classList.remove('is-visible');
        msgInput?.classList.remove('is-invalid');
      }

      if (!valid) return;

      if (statusText) {
        statusText.textContent = 'Message verified! Opening mail composer...';
        statusText.className = 'contact-status is-success';
      }

      const mailtoUrl = `mailto:lokeshkumar142005@gmail.com?subject=${encodeURIComponent(`Project Opportunity from ${name}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`)}`;
      window.location.href = mailtoUrl;

      setTimeout(() => {
        contactForm.reset();
        if (statusText) {
          statusText.textContent = 'Mail draft created successfully!';
        }
      }, 1000);
    });
  }
}

