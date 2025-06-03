// js/main.js

import { initNavbar } from './navbar.js';
import { initFormHandler } from './formHandler.js';
import { initFaqAccordion } from './faqAccordion.js';
import { initCalculator } from './calculator.js';
import { initChatbotModal } from './chatbotModal.js'; // Importa a função initChatbotModal

document.addEventListener('DOMContentLoaded', () => {
    // Atualiza o ano atual no rodapé
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // Inicialização dos módulos
    initNavbar();
    initFormHandler();
    initFaqAccordion();
    initCalculator();
    initChatbotModal(); // Chama a função para inicializar o modal do chatbot
});