// js/calculator.js

import { calculableServicesData } from '../data/servicesData.js'; // Importa os dados dos serviços

export function initCalculator() {
    const calculableServicesContainer = document.getElementById('calculableServices');
    const totalPriceDisplay = document.getElementById('totalPriceDisplay');
    const contactCalculatorButton = document.querySelector('#calculator a[href="#contact"]'); // Seleciona o botão de solicitar orçamento

    function renderCalculableServices() {
        if (!calculableServicesContainer) return;
        calculableServicesContainer.innerHTML = ''; // Limpa o conteúdo existente

        calculableServicesData.forEach(service => {
            const serviceDiv = document.createElement('div');
            serviceDiv.className = 'p-4 border border-gray-200 rounded-lg transition-colors hover:bg-brand-bg-light/50 flex flex-col md:flex-row md:justify-between md:items-center';
            serviceDiv.innerHTML = `
                <div class="mb-3 md:mb-0 md:flex-1 md:pr-4 text-center md:text-left">
                    <span class="font-medium text-brand-text text-lg">${service.name}</span>
                    <p class="text-xs text-brand-light-text mt-1">${service.description}</p>
                    <p class="text-sm font-semibold text-brand-primary mt-1">R$ ${service.price.toFixed(2)} <span class="text-xs text-brand-light-text">/unidade ou hora</span></p>
                </div>
                <div class="flex items-center justify-center md:justify-end space-x-2 w-full md:w-auto">
                    <button type="button" class="bg-gray-200 text-brand-text hover:bg-gray-300 p-1 rounded-md focus:outline-none h-10 w-10 flex items-center justify-center text-lg font-semibold transition-colors" aria-label="Diminuir quantidade de ${service.name}" data-action="decrement" data-service-id="${service.id}">-</button>
                    <input type="number" class="w-16 text-center border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent service-quantity-input" aria-label="Quantidade de ${service.name}" min="0" value="0" data-price="${service.price}" data-service-id="${service.id}">
                    <button type="button" class="bg-gray-200 text-brand-text hover:bg-gray-300 p-1 rounded-md focus:outline-none h-10 w-10 flex items-center justify-center text-lg font-semibold transition-colors" aria-label="Aumentar quantidade de ${service.name}" data-action="increment" data-service-id="${service.id}">+</button>
                </div>
            `;
            calculableServicesContainer.appendChild(serviceDiv);
        });
        addCalculatorEventListeners(); // Adiciona os listeners após a renderização
        updateCalculatorTotalPrice(); // Atualiza o total inicial
    }

    function addCalculatorEventListeners() {
        // Listeners para os inputs de quantidade
        document.querySelectorAll('.service-quantity-input').forEach(input => {
            input.addEventListener('change', updateCalculatorTotalPrice);
            input.addEventListener('input', updateCalculatorTotalPrice); // Para atualizar em tempo real
        });

        // Listeners para os botões de incremento/decremento
        document.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', (event) => {
                const serviceId = event.target.dataset.serviceId;
                const input = document.querySelector(`.service-quantity-input[data-service-id="${serviceId}"]`);
                if (!input) return;

                let currentValue = parseInt(input.value) || 0; // Garante que seja um número

                if (event.target.dataset.action === 'increment') {
                    input.value = currentValue + 1;
                } else if (event.target.dataset.action === 'decrement') {
                    input.value = Math.max(0, currentValue - 1); // Garante que não seja negativo
                }
                // Dispara manualmente o evento 'input' para que updateCalculatorTotalPrice seja chamado
                input.dispatchEvent(new Event('input', { bubbles: true }));
            });
        });
    }

    function updateCalculatorTotalPrice() {
        if (!totalPriceDisplay) return;
        let total = 0;
        document.querySelectorAll('.service-quantity-input').forEach(input => {
            const quantity = parseInt(input.value) || 0;
            const price = parseFloat(input.dataset.price); // Obtém o preço do data-attribute

            if (!isNaN(quantity) && !isNaN(price)) {
                total += quantity * price;
            }
        });
        totalPriceDisplay.textContent = `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        // Opcional: desabilitar o botão de solicitar orçamento se o total for 0
        if (contactCalculatorButton) {
            contactCalculatorButton.disabled = total === 0;
        }
    }

    // Inicializa a calculadora ao carregar o módulo
    if (calculableServicesContainer && totalPriceDisplay) {
        renderCalculableServices();
    } else {
        console.warn("Elementos da calculadora de orçamento não encontrados no DOM. Verifique os IDs.");
    }
}