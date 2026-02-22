// PromptCord - Логіка додатку з інтеграцією text.js

document.addEventListener('DOMContentLoaded', function() {
  // 1. Спочатку завантажуємо тексти з файлу texts.js
  renderTexts();
  
  // 2. Потім ініціалізуємо навігацію і форму
  initNavigation();
  initForm();
  initSlider();
  initModal();
  initSystemPromptCopy();
});

// ===== РЕНДЕРИНГ ТЕКСТІВ (Заповнює сайт даними з texts.js) =====
function renderTexts() {
  // Перевірка чи завантажився файл текстів
  if (typeof TEXTS === 'undefined') {
    console.error('Помилка: файл texts.js не знайдено або в ньому помилка.');
    return;
  }

  // --- Загальне ---
  if (TEXTS.siteName) {
    const pageTitle = document.getElementById('text-page-title');
    if (pageTitle) pageTitle.textContent = TEXTS.siteName + " — Якісні запити до ШІ";
    
    const logo = document.getElementById('text-logo');
    if (logo) logo.textContent = TEXTS.siteName;
  }

  // --- Навігація ---
  if (TEXTS.menu) {
    document.getElementById('nav-home').textContent = TEXTS.menu.home;
    document.getElementById('nav-agent').textContent = TEXTS.menu.createAgent;
    document.getElementById('nav-contacts').textContent = TEXTS.menu.contacts;
  }

  // --- Вступ ---
  if (TEXTS.intro) {
    document.getElementById('text-intro-greeting').textContent = TEXTS.intro.greeting;
    
    // Обробка опису (розбиваємо на абзаци, якщо є переноси рядків)
    const descContainer = document.getElementById('text-intro-description-container');
    if (TEXTS.intro.description) {
      // Розбиваємо текст на частини по подвійному переносу (абзаци)
      const paragraphs = TEXTS.intro.description.split('\n\n');
      let htmlContent = '';
      paragraphs.forEach(p => {
        if (p.trim()) {
           htmlContent += `<p class="intro-description">${p.trim()}</p>`;
        }
      });
      descContainer.innerHTML = htmlContent;
    }

    // Примітка (дозволяємо HTML теги, наприклад 💡 або <strong>)
    document.getElementById('text-intro-note').innerHTML = TEXTS.intro.exampleNote;
  }

  // --- Питання (Цикл по 9 картках) ---
  const questionCards = document.querySelectorAll('.question-card');
  
  questionCards.forEach(card => {
    const index = parseInt(card.getAttribute('data-index'));
    const textData = TEXTS.questions[index]; // Беремо дані з texts.js за індексом

    if (textData) {
      // Заголовок
      card.querySelector('.question-title').textContent = textData.title;
      // Підзаголовок
      card.querySelector('.question-subtitle').textContent = textData.subtitle;
      // Пояснення
      card.querySelector('.question-explanation').textContent = textData.explanation;
      
      // Приклад
      const exampleElem = card.querySelector('.question-example');
      if (textData.example && textData.example.trim() !== "") {
        exampleElem.textContent = textData.example;
        exampleElem.style.display = 'block';
      } else {
        // Якщо прикладу немає в texts.js, ховаємо блок
        exampleElem.style.display = 'none';
      }
      
      // Плейсхолдер для textarea (використовуємо універсальний)
      const input = card.querySelector('.question-input');
      input.placeholder = `Ваша відповідь тут...`;
    }
  });

  // --- Параметри ---
  if (TEXTS.parameters) {
    document.getElementById('label-creativity').textContent = TEXTS.parameters.creativityLabel;
    document.getElementById('label-questions').textContent = TEXTS.parameters.questionsLabel;
    
    // Опції селекта
    const select = document.getElementById('questionsSelect');
    if (TEXTS.parameters.questionsOptions && select.options.length > 0) {
       // Оновлюємо текст опцій, зберігаючи значення
       Array.from(select.options).forEach((opt, idx) => {
         const val = TEXTS.parameters.questionsOptions[idx];
         if (val) opt.textContent = `${val} питань`;
       });
    }
  }

  // --- Режими (слайдер) ---
  if (TEXTS.modes) {
    document.getElementById('label-mode-machine').textContent = "🔧 " + TEXTS.modes.machine.label;
    document.getElementById('label-mode-balance').textContent = "⚖️ " + TEXTS.modes.balance.label;
    document.getElementById('label-mode-fantasy').textContent = "🎨 " + TEXTS.modes.fantasy.label;
  }

  // --- Кнопки ---
  if (TEXTS.buttons) {
    document.getElementById('submitBtn').innerHTML = "✨ " + TEXTS.buttons.getResult;
    document.getElementById('clearBtn').innerHTML = "🗑️ " + TEXTS.buttons.clearAll;
    document.getElementById('copyResultBtn').innerHTML = "📋 " + TEXTS.buttons.copy;
    
    const copySysBtn = document.getElementById('copySystemPromptBtn');
    if(copySysBtn) copySysBtn.innerHTML = "📋 " + TEXTS.buttons.copySystemPrompt;
  }

  // --- Секція Агента ---
  if (TEXTS.agent) {
    document.getElementById('text-agent-title').textContent = "🤖 " + TEXTS.agent.title;
    
    // Інструкція агента (використовуємо textContent, CSS обробить переноси рядків)
    document.getElementById('text-agent-instruction').textContent = TEXTS.agent.instruction;
    
    document.getElementById('text-system-prompt-label').textContent = TEXTS.agent.systemPromptLabel;
    document.getElementById('systemPromptText').textContent = TEXTS.systemPrompt;
  }

// --- Контакти ---
  if (TEXTS.contacts) {
    document.getElementById('text-contacts-title').textContent = "📬 " + TEXTS.contacts.title;
    document.getElementById('text-contacts-desc').textContent = TEXTS.contacts.text;
    
    const emailBtn = document.getElementById('contactEmailBtn');
    if (emailBtn) {
        // Встановлюємо текст (сам емейл)
        emailBtn.textContent = TEXTS.contacts.email;
        
        // Видаляємо старі слухачі (на всяк випадок) і додаємо новий
        const newBtn = emailBtn.cloneNode(true);
        emailBtn.parentNode.replaceChild(newBtn, emailBtn);
        
        newBtn.addEventListener('click', function() {
          // Використовуємо існуючу функцію копіювання
          copyToClipboard(TEXTS.contacts.email, this);
        });
    }
  }
  // --- Footer ---
  if (TEXTS.footer) {
    document.getElementById('text-footer').textContent = TEXTS.footer.text;
  }
  
  // --- Модальне вікно ---
  if (TEXTS.modal) {
      document.getElementById('text-modal-title').textContent = "✨ " + TEXTS.modal.title;
  }
}


// ===== НАВІГАЦІЯ =====
function initNavigation() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      this.classList.toggle('active');
    });
    
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });
  }
}

// ===== ФОРМА =====
function initForm() {
  const form = document.getElementById('promptForm');
  const inputs = form.querySelectorAll('.question-input');
  const submitBtn = document.getElementById('submitBtn');
  const clearBtn = document.getElementById('clearBtn');
  
  function checkFormValidity() {
    let allFilled = true;
    inputs.forEach(input => {
      if (input.value.trim().length === 0) {
        allFilled = false;
      }
    });
    submitBtn.disabled = !allFilled;
  }
  
  inputs.forEach(input => {
    input.addEventListener('input', checkFormValidity);
  });
  
  submitBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (!this.disabled) {
      generateResult();
      openModal();
    }
  });
  
  clearBtn.addEventListener('click', function() {
    inputs.forEach(input => {
      input.value = '';
    });
    setSliderPosition(1); // баланс
    document.getElementById('questionsSelect').value = '5';
    checkFormValidity();
  });
  
  checkFormValidity();
}

// ===== ПОВЗУНОК КРЕАТИВНОСТІ =====
let currentSliderPosition = 1; // 0 = машина, 1 = баланс, 2 = фантазія

function initSlider() {
  const sliderTrack = document.querySelector('.slider-track');
  const sliderThumb = document.querySelector('.slider-thumb');
  const sliderFill = document.querySelector('.slider-fill');
  const sliderLabels = document.querySelectorAll('.slider-label');
  
  if (!sliderTrack) return;
  
  function updateSlider(position) {
    currentSliderPosition = position;
    const percentage = position * 50;
    
    sliderThumb.style.left = `${percentage}%`;
    sliderFill.style.width = `${percentage}%`;
    
    sliderLabels.forEach((label, index) => {
      label.classList.toggle('active', index === position);
    });
  }
  
  sliderLabels.forEach((label, index) => {
    label.addEventListener('click', () => {
      updateSlider(index);
    });
  });
  
  let isDragging = false;
  
  function handleDrag(e) {
    if (!isDragging) return;
    const rect = sliderTrack.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    let position;
    if (percentage < 25) position = 0;
    else if (percentage < 75) position = 1;
    else position = 2;
    updateSlider(position);
  }
  
  sliderThumb.addEventListener('mousedown', () => isDragging = true);
  sliderThumb.addEventListener('touchstart', () => isDragging = true);
  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('touchmove', handleDrag);
  document.addEventListener('mouseup', () => isDragging = false);
  document.addEventListener('touchend', () => isDragging = false);
  
  sliderTrack.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    let position;
    if (percentage < 33) position = 0;
    else if (percentage < 66) position = 1;
    else position = 2;
    updateSlider(position);
  });
  
  updateSlider(1);
}

function setSliderPosition(position) {
  currentSliderPosition = position;
  const sliderThumb = document.querySelector('.slider-thumb');
  const sliderFill = document.querySelector('.slider-fill');
  const sliderLabels = document.querySelectorAll('.slider-label');
  
  if (!sliderThumb) return;
  const percentage = position * 50;
  sliderThumb.style.left = `${percentage}%`;
  sliderFill.style.width = `${percentage}%`;
  
  sliderLabels.forEach((label, index) => {
    label.classList.toggle('active', index === position);
  });
}

// ===== ГЕНЕРАЦІЯ РЕЗУЛЬТАТУ =====
function generateResult() {
  const inputs = document.querySelectorAll('.question-input');
  const questionsCount = document.getElementById('questionsSelect').value;
  
  // Визначення режиму з text.js
  const modes = ['machine', 'balance', 'fantasy'];
  const modeKey = modes[currentSliderPosition];
  const mode = TEXTS.modes[modeKey];
  
  let result = TEXTS.modal.resultTitle + '\n\n';
  
  TEXTS.questions.forEach((question, index) => {
    result += `## ${question.number}. ${question.title}\n`;
    result += inputs[index].value.trim() + '\n\n';
  });
  
  result += '---\n';
  result += 'ІНСТРУКЦІЯ ДЛЯ ШІ:\n\n';
  result += `Режим роботи: ${mode.name}\n`;
  result += mode.description + '\n\n';
  result += `1. Постав мені ${questionsCount} уточнюючих питань щоб краще зрозуміти задачу\n`;
  result += '2. Після моїх відповідей — зроби коротке саммарі як ти розумієш задачу, я підтверджу або скоригую';
  
  document.getElementById('resultText').textContent = result;
  return result;
}

// ===== МОДАЛЬНЕ ВІКНО =====
function initModal() {
  const modal = document.getElementById('resultModal');
  const closeBtn = modal.querySelector('.modal-close');
  const copyBtn = document.getElementById('copyResultBtn');
  
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
  
  copyBtn.addEventListener('click', function() {
    const resultText = document.getElementById('resultText').textContent;
    copyToClipboard(resultText, this);
  });
}

function openModal() {
  const modal = document.getElementById('resultModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('resultModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// ===== КОПІЮВАННЯ СИСТЕМНОГО ПРОМПТУ =====
function initSystemPromptCopy() {
  const copyBtn = document.getElementById('copySystemPromptBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function() {
      // Беремо текст прямо з об'єкта TEXTS, щоб було актуально
      copyToClipboard(TEXTS.systemPrompt, this);
    });
  }
}

// ===== УТИЛІТА: КОПІЮВАННЯ В БУФЕР =====
function copyToClipboard(text, button) {
  navigator.clipboard.writeText(text).then(() => {
    const originalText = button.textContent;
    button.textContent = TEXTS.buttons.copied;
    button.classList.add('btn-success');
    
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('btn-success');
    }, 2000);
  }).catch(err => {
    console.error('Помилка копіювання:', err);
    fallbackCopyToClipboard(text);
  });
}

function fallbackCopyToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Fallback копіювання не вдалося:', err);
  }
  document.body.removeChild(textArea);
}