// js/chatbotModal.js

export function initChatbotModal() {
    const openChatbotBtn = document.getElementById('openChatbotBtn');
    const chatbotModal = document.getElementById('chatbotModal');
    const closeChatbotModalBtn = document.getElementById('closeChatbotModalBtn');
    const chatbotFrame = document.getElementById('chatbotFrame');
    const chatbotHtmlFile = './chatbot.html';
    const chatbotNotificationBadge = document.getElementById('chatbotNotificationBadge'); // Novo elemento

    if (openChatbotBtn && chatbotModal && closeChatbotModalBtn && chatbotFrame) {
        openChatbotBtn.addEventListener('click', () => {
            // Esconde o badge de notificação ao abrir o chat
            if (chatbotNotificationBadge) {
                chatbotNotificationBadge.style.display = 'none';
            }

            if (!chatbotFrame.getAttribute('src') || chatbotFrame.getAttribute('src') === 'about:blank' || chatbotFrame.getAttribute('src') === '') {
                chatbotFrame.setAttribute('src', chatbotHtmlFile);
            }
            chatbotModal.classList.remove('hidden');
            setTimeout(() => { chatbotModal.classList.add('show'); }, 10);
        });

        closeChatbotModalBtn.addEventListener('click', () => {
            chatbotModal.classList.remove('show');
            setTimeout(() => {
                chatbotModal.classList.add('hidden');
                // Opcional: Mostrar o badge novamente quando o chat é fechado,
                // ou apenas se houver novas mensagens. Por enquanto, não vamos reexibir automaticamente.
                // if (chatbotNotificationBadge) {
                //     chatbotNotificationBadge.style.display = 'block'; // Ou 'inline-block' dependendo do seu estilo
                // }
            }, 300);
        });

        chatbotModal.addEventListener('click', function(event) {
            if (event.target === chatbotModal) {
                closeChatbotModalBtn.click();
            }
        });
    } else {
        console.warn("Elementos do chatbot modal não foram encontrados no DOM. Verifique os IDs.");
    }
}