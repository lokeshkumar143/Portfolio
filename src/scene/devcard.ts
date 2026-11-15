/**
 * Interactive Developer Profile & Contact Modal
 * Features high-definition video of Lokesh Kumar S (developer_nod.mp4)
 */

export function initDevCard(): void {
  const dialog = document.getElementById('devModal') as HTMLDialogElement | null;
  const openBtns = document.querySelectorAll('#devBadgeBtn, .js-open-devcard');
  const closeBtn = document.getElementById('devModalClose') as HTMLButtonElement | null;
  const copyBtn = document.getElementById('devCopyEmail') as HTMLButtonElement | null;
  const copyFeedback = document.getElementById('devCopyFeedback') as HTMLElement | null;
  const video = dialog ? dialog.querySelector('.dev-modal__video') as HTMLVideoElement | null : null;

  if (!dialog) return;
  const dlg = dialog; // TypeScript narrows this to HTMLDialogElement

  function open(): void {
    if (typeof dlg.showModal === 'function') {
      dlg.showModal();
    } else {
      dlg.setAttribute('open', '');
    }
    document.body.classList.add('modal-open');
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }

  function close(): void {
    if (typeof dlg.close === 'function') {
      dlg.close();
    } else {
      dlg.removeAttribute('open');
    }
    document.body.classList.remove('modal-open');
    if (video) video.pause();
    if (copyFeedback) copyFeedback.classList.remove('is-active');
  }

  openBtns.forEach((btn) => {
    (btn as HTMLElement).addEventListener('click', (e: MouseEvent) => {
      e.preventDefault();
      open();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', close);
  }

  dlg.addEventListener('click', (e: MouseEvent) => {
    // clicking on the backdrop closes the modal
    if (e.target === dlg) close();
  });

  dlg.addEventListener('cancel', () => {
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
  const contactForm = document.getElementById('contactForm') as HTMLFormElement | null;
  if (contactForm) {
    const nameInput = document.getElementById('contactName') as HTMLInputElement | null;
    const emailInput = document.getElementById('contactEmail') as HTMLInputElement | null;
    const msgInput = document.getElementById('contactMessage') as HTMLTextAreaElement | null;
    const nameError = document.getElementById('nameError') as HTMLElement | null;
    const emailError = document.getElementById('emailError') as HTMLElement | null;
    const msgError = document.getElementById('msgError') as HTMLElement | null;
    const statusText = document.getElementById('contactStatus') as HTMLElement | null;

    contactForm.addEventListener('submit', (e: SubmitEvent) => {
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
        statusText.textContent = 'Encrypting & dispatching message...';
        statusText.className = 'contact-status is-sending';
      }

      const payload = {
        name,
        email,
        message: msg,
        _subject: `iOS Engineering Opportunity from ${name}`,
      };

      const mailtoUrl = `mailto:lokeshkumar142005@gmail.com?subject=${encodeURIComponent(`Project Opportunity from ${name}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`)}`;

      // Attempt Formspree transmission with honest fallback to native mailto
      fetch('https://formspree.io/f/mqapgvzy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          if (res.ok) {
            if (statusText) {
              statusText.textContent = 'Message sent directly to Lokesh! Thank you.';
              statusText.className = 'contact-status is-success';
            }
            contactForm.reset();
          } else {
            throw new Error('API dispatch unavailable');
          }
        })
        .catch(() => {
          // Transparent fallback to system mail composer
          if (statusText) {
            statusText.textContent = 'Launching email composer to send directly...';
            statusText.className = 'contact-status is-info';
          }
          window.location.href = mailtoUrl;
          setTimeout(() => {
            contactForm.reset();
            if (statusText) {
              statusText.textContent = 'Email composer launched with pre-filled message.';
            }
          }, 1200);
        });
    });
  }
}