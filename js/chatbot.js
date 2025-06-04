// js/chatbot.js

const NOME_DA_ASSISTENTE = "K.A.S.I.";
const ARQUIVO_INSTRUCOES = './md/instrucao-kasi.md'; // Caminho atualizado para a pasta md
const AVATAR_ASSISTENTE = './img/kah/kasi.png'; // Caminho para o avatar da K.A.S.I.
const AVATAR_USUARIO = 'https://placehold.co/32x32/D1C8BF/513F32?text=VC'; // Avatar placeholder para o usuário

let systemInstructionContent = '';

const chatMessagesDiv = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

let clientChatHistory = [];

const saudacaoInicialKASI = `Olá! 😊 Sou K.A.S.I., assistente virtual da Kah Siqueira. Qual é a sua dúvida?`;

// Função para adicionar mensagens à interface do chat
function addMessageToChat(sender, message, isUser, avatarSrc) {
    if (!chatMessagesDiv) return;

    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message');
    messageContainer.classList.add(isUser ? 'user-message' : 'bot-message');

    // Adiciona uma classe para balões de destaque em mensagens específicas da K.A.S.I.
    if (sender === "K.A.S.I." && message.includes("posso te ajudar a transformar ideias em resultados concretos")) {
        messageContainer.classList.add('bot-message-primary');
    }

    const avatarImg = document.createElement('img');
    avatarImg.classList.add('message-avatar');
    avatarImg.src = avatarSrc || (isUser ? AVATAR_USUARIO : AVATAR_ASSISTENTE);
    avatarImg.alt = sender + ' Avatar';

    const textBubble = document.createElement('div');
    textBubble.classList.add('text-bubble');

    // --- INÍCIO DA LÓGICA PARA LINKS CLICÁVEIS E FORMATAÇÃO ---
    let formattedMessage = message;

    // 1. Detectar e transformar URLs em links clicáveis
    // Regex para detectar URLs (http, https, www. e domínios.com)
    // Garante que o texto dentro do link seja a URL original.
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+(?:\.[^\s]+)*)/g;
    formattedMessage = formattedMessage.replace(urlRegex, (url) => {
        let fullUrl = url;
        // Adiciona http:// se a URL não começar com um protocolo conhecido
        if (!url.match(/^[a-zA-Z]+:\/\//)) {
            fullUrl = 'http://' + url;
        }
        // Abre o link em uma nova aba (_blank) e adiciona rel="noopener noreferrer" para segurança
        return `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });

    // 2. Formatar negrito (Manter esta regra após a de URL para evitar negrito dentro do href)
    formattedMessage = formattedMessage.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // 3. Formatar quebras de linha (Manter esta regra por último)
    formattedMessage = formattedMessage.replace(/\n/g, '<br>');
    // --- FIM DA LÓGICA PARA LINKS CLICÁVEIS E FORMATAÇÃO ---


    textBubble.innerHTML = formattedMessage; // Usa innerHTML para renderizar HTML (br, strong, a)

    // A ordem de adição do avatar e do balão depende de quem envia a mensagem
    if (isUser) {
        messageContainer.appendChild(textBubble);
        messageContainer.appendChild(avatarImg);
    } else {
        messageContainer.appendChild(avatarImg);
        messageContainer.appendChild(textBubble);
    }

    chatMessagesDiv.appendChild(messageContainer);
    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight; // Auto-scroll para a última mensagem
}

// Funções para mostrar/ocultar indicador de carregamento
function showLoadingIndicator() {
    if (!chatMessagesDiv) return;
    const existingLoadingDiv = document.getElementById('loading-indicator');
    if (existingLoadingDiv) existingLoadingDiv.remove();

    const loadingContainer = document.createElement('div');
    loadingContainer.classList.add('message', 'typing-indicator');
    loadingContainer.id = 'loading-indicator'; // ID para fácil remoção

    const avatarImg = document.createElement('img');
    avatarImg.classList.add('message-avatar');
    avatarImg.src = AVATAR_ASSISTENTE;
    avatarImg.alt = `${NOME_DA_ASSISTENTE} Avatar`;

    const textBubble = document.createElement('div');
    textBubble.classList.add('text-bubble');
    textBubble.innerHTML = '<div class="dot-flashing"></div>'; // Adiciona a animação de bolinhas

    loadingContainer.appendChild(avatarImg);
    loadingContainer.appendChild(textBubble);

    chatMessagesDiv.appendChild(loadingContainer);
    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
}

function hideLoadingIndicator() {
    const loadingDiv = document.getElementById('loading-indicator');
    if (loadingDiv) loadingDiv.remove();
}

// Função para carregar as instruções do arquivo .md
async function carregarInstrucoes() {
    try {
        const response = await fetch(ARQUIVO_INSTRUCOES);
        if (!response.ok) {
            throw new Error(`Erro ao carregar o arquivo de instruções: ${response.statusText} (status: ${response.status})`);
        }
        systemInstructionContent = await response.text();
        if (!systemInstructionContent || systemInstructionContent.trim() === '') {
            throw new Error("O arquivo de instruções está vazio ou contém apenas espaços em branco.");
        }
        console.log("Instruções da IA carregadas com sucesso.");
        console.log("Instruções da IA carregadas com sucesso.");

        // Adiciona a saudação inicial APÓS carregar as instruções (garante que tudo está pronto)
        if (chatMessagesDiv) {
            addMessageToChat(NOME_DA_ASSISTENTE, saudacaoInicialKASI, false, AVATAR_ASSISTENTE);
            clientChatHistory.push({ role: "model", parts: [{ text: saudacaoInicialKASI }] });
        }
        if (sendButton) sendButton.disabled = false; // Habilita o botão de enviar após carregar
        if (userInput) userInput.disabled = false; // Habilita o input
        if (userInput) userInput.focus();


    } catch (error) {
        console.error("Falha ao carregar instruções da IA:", error);
        addMessageToChat(NOME_DA_ASSISTENTE, "Desculpe, não consegui carregar minhas configurações iniciais. Por favor, tente recarregar a página.", false, AVATAR_ASSISTENTE);
        if (sendButton) sendButton.disabled = true; // Mantém desabilitado se falhar
        if (userInput) userInput.disabled = true;
    }
}

// Função principal para enviar mensagem para a IA (API Gateway)
async function sendMessageToAI() {
    if (!userInput || !sendButton || !systemInstructionContent) {
        if (!systemInstructionContent) {
            addMessageToChat(NOME_DA_ASSISTENTE, "Ainda estou inicializando, por favor aguarde um momento.", false, AVATAR_ASSISTENTE);
        }
        return;
    }
    const messageText = userInput.value.trim();
    if (messageText === "") return;

    addMessageToChat("Você", messageText, true, AVATAR_USUARIO);
    clientChatHistory.push({ role: "user", parts: [{ text: messageText }] });

    userInput.value = "";
    sendButton.disabled = true;
    showLoadingIndicator();

    try {
        // #####################################################################
        // ## ⬇️⬇️⬇️ SUBSTITUA PELO SEU INVOKE URL DO API GATEWAY AQUI ⬇️⬇️⬇️ ##
        // #####################################################################
        const API_GATEWAY_INVOKE_URL = 'https://apis.katriciasiqueira.workers.dev/'; // MANTENHA OU ATUALIZE SEU URL AQUI
        // #####################################################################

        const response = await fetch(API_GATEWAY_INVOKE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: messageText,
                history: clientChatHistory.slice(0, -1), // Envia o histórico, exceto a última mensagem do usuário (que é o prompt atual)
                systemInstruction: systemInstructionContent // Envia o conteúdo carregado do arquivo .md
            })
        });

        // Tenta ler como texto primeiro para depuração em caso de não ser JSON
        const responseBodyText = await response.text();
        let data;
        try {
            data = JSON.parse(responseBodyText);
        } catch (e) {
            console.error("Resposta do servidor não é JSON válido:", responseBodyText);
            addMessageToChat(NOME_DA_ASSISTENTE, "Desculpe, recebi uma resposta inesperada do servidor.", false, AVATAR_ASSISTENTE);
            hideLoadingIndicator();
            sendButton.disabled = false;
            if (userInput) userInput.focus();
            return;
        }

        if (!response.ok || data.error) {
            console.error("Erro retornado pelo backend:", data.error || `Status: ${response.status}`);
            let displayError = data.error || `Erro ${response.status} ao contatar o servidor. Tente novamente.`;
            addMessageToChat(NOME_DA_ASSISTENTE, displayError, false, AVATAR_ASSISTENTE);
            // Não adiciona a mensagem de erro ao histórico da IA para não confundir conversas futuras
            hideLoadingIndicator();
            sendButton.disabled = false;
            if (userInput) userInput.focus();
            return;
        }

        const aiText = data.aiResponse;

        hideLoadingIndicator();
        addMessageToChat(NOME_DA_ASSISTENTE, aiText, false, AVATAR_ASSISTENTE);
        clientChatHistory.push({ role: "model", parts: [{ text: aiText }] });

    } catch (error) {
        hideLoadingIndicator();
        console.error("Erro de rede ou ao chamar a API do Chatbot:", error);
        addMessageToChat(NOME_DA_ASSISTENTE, `Desculpe, tive um problema de comunicação. Por favor, verifique sua conexão e tente novamente. (${error.message})`, false, AVATAR_ASSISTENTE);
    } finally {
        // Reabilita o botão apenas se as instruções foram carregadas
        if (systemInstructionContent) {
            sendButton.disabled = false;
            if (userInput) userInput.focus();
        }
    }
}

// Event Listeners
if (sendButton) sendButton.addEventListener('click', sendMessageToAI);
if (userInput) {
    userInput.addEventListener('keypress', function(event) {
        // Só envia com Enter se o botão estiver habilitado e a tecla Enter for pressionada
        if (event.key === 'Enter' && !sendButton.disabled) {
            sendMessageToAI();
        }
    });
}

// Inicialização: Desabilita input/botão e carrega as instruções
document.addEventListener('DOMContentLoaded', () => {
    if (sendButton) sendButton.disabled = true;
    if (userInput) userInput.disabled = true;
    carregarInstrucoes();
});