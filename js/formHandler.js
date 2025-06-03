// js/formHandler.js

export function initFormHandler() {
    const contactForm = document.getElementById('contactForm');
    const confirmationModal = document.getElementById('confirmationModal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    if (contactForm && confirmationModal && closeModalBtn) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Impede o envio real do formulário

            // Exibe o modal de confirmação
            confirmationModal.classList.remove('hidden');
            setTimeout(() => { confirmationModal.classList.add('show'); }, 10);

            // Reseta o formulário
            contactForm.reset();
        });

        closeModalBtn.addEventListener('click', function() {
            // Esconde o modal de confirmação
            confirmationModal.classList.remove('show');
            setTimeout(() => { confirmationModal.classList.add('hidden'); }, 300);
        });

        // Opcional: Fechar o modal clicando fora dele
        confirmationModal.addEventListener('click', function(event) {
            if (event.target === confirmationModal) {
                closeModalBtn.click();
            }
        });
    } else {
        console.warn("Elementos do formulário de contato ou modal de confirmação não encontrados no DOM. Verifique os IDs.");
    }
}