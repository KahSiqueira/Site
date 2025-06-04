// Site/js/formHandler.js

export function initFormHandler() {
    const contactForm = document.getElementById('contactForm');
    const confirmationModal = document.getElementById('confirmationModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    // Elementos do modal para mensagens dinâmicas (opcional, mas recomendado)
    const modalTitle = confirmationModal ? confirmationModal.querySelector('h3') : null;
    const modalMessage = confirmationModal ? confirmationModal.querySelector('p') : null;

    // URL do seu novo Cloudflare Worker para o formulário
    const formWorkerUrl = 'https://form-contact-handler.katricia-siqueira.workers.dev'; // ⚠️ SUBSTITUA PELA URL CORRETA DO SEU WORKER

    if (contactForm && confirmationModal && closeModalBtn && modalTitle && modalMessage) {
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Mantemos para controlar o fluxo e feedback

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';

            // Coletar dados do formulário
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message'),
            };

            try {
                const response = await fetch(formWorkerUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (result.success) {
                    modalTitle.textContent = 'Obrigada pelo seu contato!';
                    modalMessage.textContent = result.message || 'Sua mensagem foi enviada com sucesso. Em breve retornarei.';
                    contactForm.reset(); // Reseta o formulário
                } else {
                    modalTitle.textContent = 'Erro ao Enviar';
                    modalMessage.textContent = result.error || 'Houve um problema ao enviar sua mensagem. Tente novamente mais tarde.';
                }
            } catch (error) {
                console.error('Erro ao submeter formulário:', error);
                modalTitle.textContent = 'Erro de Conexão';
                modalMessage.textContent = 'Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.';
            } finally {
                // Exibe o modal de confirmação/erro
                confirmationModal.classList.remove('hidden');
                setTimeout(() => { confirmationModal.classList.add('show'); }, 10);
                
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });

        closeModalBtn.addEventListener('click', function() {
            confirmationModal.classList.remove('show');
            setTimeout(() => { confirmationModal.classList.add('hidden'); }, 300);
        });

        confirmationModal.addEventListener('click', function(event) {
            if (event.target === confirmationModal) {
                closeModalBtn.click();
            }
        });
    } else {
        console.warn("Elementos do formulário de contato ou modal de confirmação não encontrados no DOM. Verifique os IDs e a estrutura do modal para título/mensagem.");
    }
}