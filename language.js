// Language Switcher for AnyMoThings PMR App
// Supports Traditional Chinese (zh-HK) and English (en)

// Get current language from localStorage or default to Chinese
let currentLang = localStorage.getItem('appLanguage') || 'zh';

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
    initLanguage();
    updateLanguageDisplay();
});

// Initialize language system
function initLanguage() {
    // Set HTML lang attribute
    document.documentElement.lang = currentLang === 'zh' ? 'zh-HK' : 'en';
    
    // Apply language class to body
    document.body.classList.add(`lang-${currentLang}`);
}

// Switch language
function switchLanguage(lang) {
    // Remove old language class
    document.body.classList.remove(`lang-${currentLang}`);
    
    // Update current language
    currentLang = lang;
    
    // Save to localStorage
    localStorage.setItem('appLanguage', lang);
    
    // Add new language class
    document.body.classList.add(`lang-${currentLang}`);
    
    // Update HTML lang attribute
    document.documentElement.lang = lang === 'zh' ? 'zh-HK' : 'en';
    
    // Update display
    updateLanguageDisplay();
    
    // Show success message
    const message = lang === 'zh' ? '已切換至繁體中文' : 'Switched to English';
    showLanguageMessage(message);
}

// Update language display
function updateLanguageDisplay() {
    // Update all bilingual elements
    const bilingualElements = document.querySelectorAll('[data-lang]');
    bilingualElements.forEach(element => {
        const elementLang = element.getAttribute('data-lang');
        if (elementLang === currentLang) {
            element.style.display = '';
        } else {
            element.style.display = 'none';
        }
    });
    
    // Update language toggle buttons
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        const btnLang = btn.getAttribute('data-lang-btn');
        if (btnLang === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Show language switch message
function showLanguageMessage(message) {
    // Remove existing message if any
    const existing = document.querySelector('.lang-message');
    if (existing) {
        existing.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = 'lang-message';
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    // Fade in
    setTimeout(() => {
        messageDiv.classList.add('show');
    }, 10);
    
    // Remove after 2 seconds
    setTimeout(() => {
        messageDiv.classList.remove('show');
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 2000);
}

// Get current language
function getCurrentLanguage() {
    return currentLang;
}

// Check if current language is Chinese
function isChineseLanguage() {
    return currentLang === 'zh';
}

// Check if current language is English
function isEnglishLanguage() {
    return currentLang === 'en';
}
