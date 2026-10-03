/**
 * A.G ESTÉTICA E PINTURA AUTOMOTIVA
 * Modern Interactive Client Logic
 * Features:
 * - Realtime Business Hours Status & Today Highlight
 * - Dynamic WhatsApp Automation & Message Builder
 * - Scroll-Driven Animations & Progress Tracker
 * - One-Click Address Copy with Toast
 * - Mobile Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  initScheduleStatus();
  initWhatsAppAutomation();
  initScrollAnimations();
  initAddressCopy();
  initMobileMenu();
});

/* ==========================================================================
   1. REALTIME SCHEDULE CHECKER (Quadro de Horários)
   Guaranteed accurate data from Google Maps Listing
   Seg a Sex: 09:00 - 17:00 | Sábado: 09:00 - 17:00 | Domingo: Fechado
   ========================================================================== */
function initScheduleStatus() {
  const scheduleRows = document.querySelectorAll('.schedule-row');
  const liveStatusCard = document.getElementById('realtime-status-card');
  const liveStatusLabel = document.getElementById('live-status-label');
  const liveStatusSub = document.getElementById('live-status-sub');
  const headerStatusDot = document.getElementById('header-status-dot');
  const headerStatusText = document.getElementById('header-status-text');

  function updateStatus() {
    const now = new Date();
    const day = now.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTime = hour + minute / 60;

    // Remove previous active classes
    scheduleRows.forEach(row => {
      row.classList.remove('active-today');
      const tag = row.querySelector('.today-indicator-tag');
      if (tag) tag.style.display = 'none';
    });

    // Mark current day in schedule table (dataset day: 0=dom, 1=seg, ..., 6=sab)
    const todayRow = document.querySelector(`.schedule-row[data-day="${day}"]`);
    if (todayRow) {
      todayRow.classList.add('active-today');
      const tag = todayRow.querySelector('.today-indicator-tag');
      if (tag) tag.style.display = 'inline-block';
    }

    let isOpen = false;
    let mainMsg = '';
    let subMsg = '';

    if (day === 0) {
      // Domingo: Fechado
      isOpen = false;
      mainMsg = 'Fechado Hoje (Domingo)';
      subMsg = 'Reabrimos segunda-feira às 09:00';
    } else {
      // Segunda a Sábado: 09:00 às 17:00
      if (currentTime >= 9 && currentTime < 17) {
        isOpen = true;
        mainMsg = 'Aberto Agora';
        subMsg = 'Atendimento técnico presencial até as 17:00';
      } else if (currentTime < 9) {
        isOpen = false;
        mainMsg = 'Fechado no Momento';
        subMsg = `Abrimos hoje às 09:00`;
      } else {
        // Depois das 17:00
        isOpen = false;
        if (day === 6) {
          mainMsg = 'Fechado';
          subMsg = 'Reabrimos segunda-feira às 09:00';
        } else {
          mainMsg = 'Fechado por Hoje';
          subMsg = 'Reabrimos amanhã às 09:00';
        }
      }
    }

    // Update Banner in Schedule Section
    if (liveStatusCard && liveStatusLabel && liveStatusSub) {
      if (isOpen) {
        liveStatusCard.classList.remove('is-closed');
        liveStatusLabel.textContent = mainMsg;
        liveStatusLabel.style.color = '#10b981';
        liveStatusSub.textContent = subMsg;
      } else {
        liveStatusCard.classList.add('is-closed');
        liveStatusLabel.textContent = mainMsg;
        liveStatusLabel.style.color = '#ef4444';
        liveStatusSub.textContent = subMsg;
      }
    }

    // Update Header Pill
    if (headerStatusDot && headerStatusText) {
      if (isOpen) {
        headerStatusDot.className = 'status-dot open';
        headerStatusText.textContent = 'Aberto Agora • até 17h';
      } else {
        headerStatusDot.className = 'status-dot closed';
        headerStatusText.textContent = 'Fechado no momento';
      }
    }
  }

  updateStatus();
  // Refresh status every 60 seconds
  setInterval(updateStatus, 60000);
}

/* ==========================================================================
   2. WHATSAPP AUTOMATION (Automação de Orçamento)
   Direct 1-click dispatch to (49) 99935-9754
   ========================================================================== */
function initWhatsAppAutomation() {
  const serviceChips = document.querySelectorAll('.option-chip[data-service]');
  const vehicleChips = document.querySelectorAll('.option-chip[data-vehicle]');
  const vehicleModelInput = document.getElementById('wa-vehicle-model');
  const clientNameInput = document.getElementById('wa-client-name');
  const periodSelect = document.getElementById('wa-period');
  const hasPhotosCheck = document.getElementById('wa-has-photos');
  const previewBubble = document.getElementById('wa-preview-message');
  const sendButton = document.getElementById('wa-send-btn');

  let selectedService = 'Pintura Automotiva / Retoques';
  let selectedVehicle = 'Carro de Passeio (Hatch / Sedan)';

  // Select service
  serviceChips.forEach(chip => {
    chip.addEventListener('click', () => {
      serviceChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      selectedService = chip.getAttribute('data-service');
      generateWhatsAppText();
    });
  });

  // Select vehicle type
  vehicleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      vehicleChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      selectedVehicle = chip.getAttribute('data-vehicle');
      generateWhatsAppText();
    });
  });

  // Inputs change
  if (vehicleModelInput) vehicleModelInput.addEventListener('input', generateWhatsAppText);
  if (clientNameInput) clientNameInput.addEventListener('input', generateWhatsAppText);
  if (periodSelect) periodSelect.addEventListener('change', generateWhatsAppText);
  if (hasPhotosCheck) hasPhotosCheck.addEventListener('change', generateWhatsAppText);

  function generateWhatsAppText() {
    const model = vehicleModelInput && vehicleModelInput.value.trim() ? vehicleModelInput.value.trim() : 'Não informado';
    const name = clientNameInput && clientNameInput.value.trim() ? clientNameInput.value.trim() : 'Cliente';
    const period = periodSelect ? periodSelect.value : 'Horário comercial';
    const hasPhotos = hasPhotosCheck && hasPhotosCheck.checked ? 'Sim, posso enviar fotos pelo WhatsApp' : 'Prefiro levar na oficina para avaliação técnica';

    const greeting = name !== 'Cliente' ? `Olá, sou ${name}!` : `Olá, equipe da A.G estética e pintura automotiva!`;

    const message = 
`${greeting} 👋
Gostaria de solicitar um orçamento para meu veículo:

🚗 *Veículo:* ${selectedVehicle}
📌 *Modelo/Ano:* ${model}
🛠️ *Serviço de Interesse:* ${selectedService}
📅 *Preferência:* ${period}
📸 *Avaliação:* ${hasPhotos}

Poderiam me orientar sobre a disponibilidade e avaliação presencial na oficina em Videira? Obrigado!`;

    if (previewBubble) {
      previewBubble.textContent = message;
    }

    return message;
  }

  // Handle WhatsApp button click
  if (sendButton) {
    sendButton.addEventListener('click', (e) => {
      e.preventDefault();
      const message = generateWhatsAppText();
      const phoneNumber = '5549999359754';
      const encodedUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(encodedUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // Initial call
  generateWhatsAppText();
}

/* ==========================================================================
   3. SCROLL-DRIVEN ANIMATIONS & BEHAVIORS
   - Scroll Progress bar
   - Sticky header state
   - IntersectionObserver reveals
   - Smooth jump down buttons
   ========================================================================== */
function initScrollAnimations() {
  const progressBar = document.getElementById('scroll-progress');
  const header = document.querySelector('.site-header');
  const scrollDownBtns = document.querySelectorAll('.scroll-down-btn, .scroll-next-trigger');

  // Scroll Progress & Header Class
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${scrollPercent}%`;
    }

    if (header) {
      if (scrollTop > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // Scroll Down Button handler
  scrollDownBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target') || '#servicos';
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = 75;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // IntersectionObserver for elements with .fade-up-element
  const animatedElements = document.querySelectorAll('.fade-up-element');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    animatedElements.forEach(el => el.classList.add('in-view'));
  }
}

/* ==========================================================================
   4. COPY ADDRESS TO CLIPBOARD
   ========================================================================== */
function initAddressCopy() {
  const copyButtons = document.querySelectorAll('.copy-address-btn');
  const toast = document.getElementById('toast-notification');
  const addressText = 'Rua Antônio Marcon - Farroupilha, Videira - SC, 89560-544';

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(addressText).then(() => {
        showToast('📍 Endereço copiado para a área de transferência!');
      }).catch(() => {
        // Fallback
        const tempInput = document.createElement('input');
        tempInput.value = addressText;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast('📍 Endereço copiado!');
      });
    });
  });

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
}

/* ==========================================================================
   5. MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-drawer');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('active');
      menuBtn.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}
