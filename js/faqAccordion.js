// js/faqAccordion.js

export function initFaqAccordion() {
    // Seleciona todos os botões que controlam as perguntas do FAQ
    document.querySelectorAll('#faq .border-b button').forEach(button => {
        button.addEventListener('click', () => {
            // Obtém o elemento de conteúdo associado a este botão
            const content = document.getElementById(button.getAttribute('aria-controls'));
            // Verifica se a pergunta já está expandida
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            // Obtém o ícone de chevron dentro do botão
            const chevron = button.querySelector('svg');

            // Fecha todas as outras perguntas abertas (garante que apenas uma esteja aberta por vez)
            document.querySelectorAll('#faq .border-b button[aria-expanded="true"]').forEach(openButton => {
                // Se o botão aberto não for o botão clicado atualmente
                if (openButton !== button) {
                    openButton.setAttribute('aria-expanded', 'false'); // Define como não expandido
                    document.getElementById(openButton.getAttribute('aria-controls')).classList.add('hidden'); // Esconde o conteúdo
                    if (openButton.querySelector('svg')) {
                        openButton.querySelector('svg').classList.remove('rotate-180'); // Gira o chevron de volta
                    }
                }
            });

            // Alterna o estado do botão clicado
            button.setAttribute('aria-expanded', String(!isExpanded)); // Inverte o atributo aria-expanded
            content.classList.toggle('hidden'); // Alterna a visibilidade do conteúdo
            if (chevron) {
                chevron.classList.toggle('rotate-180'); // Gira o chevron para indicar o estado
            }
        });
    });
}