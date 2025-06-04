// Site/js/chatbot.js

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

    let messageContent = message; // Variável para processar a mensagem

    // Container para os botões
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('chat-buttons-container');
    let hasButtons = false;

    // Regex para encontrar {{button:Label|URL}}
    // Captura: 1=Label, 2=URL
    const buttonRegex = /\{\{button:([^|]+?)\|([^}]+?)\}\}/g;
    
    messageContent = message.replace(buttonRegex, (match, label, url) => {
        hasButtons = true;
        const buttonLink = document.createElement('a');
        buttonLink.href = url;
        buttonLink.target = '_blank'; // Abrir links em nova aba
        buttonLink.rel = 'noopener noreferrer';
        buttonLink.classList.add('chat-action-button');

        let iconSvg = '';
        const lowerLabel = label.toLowerCase();

        if (lowerLabel.includes('whatsapp')) {
            buttonLink.classList.add('whatsapp-button');
            iconSvg = `<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style="vertical-align: middle;"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.1-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>`;
        } else if (lowerLabel.includes('e-mail') || lowerLabel.includes('email')) {
            buttonLink.classList.add('email-button');
            iconSvg = `<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style="vertical-align: middle;"><path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zm3.436-.586L16 11.803V4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586z"/></svg>`;
        } else if (lowerLabel.includes('instagram')) {
            buttonLink.classList.add('instagram-button');
            iconSvg = `<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style="vertical-align: middle;"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.703.01 5.556 0 5.829 0 8s.01 2.444.048 3.297c.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.556 15.99 5.829 16 8 16s2.444-.01 3.297-.048c.852-.04 1.433-.174 1.942-.372.526-.205.972-.478 1.417-.923.445-.444.718-.891.923-1.417.198-.51.333-1.09.372-1.942C15.99 10.444 16 10.171 16 8s-.01-2.444-.048-3.297c-.04-.852-.174-1.433-.372-1.942a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.09-.333-1.942-.372C10.444.01 10.171 0 8 0zm0 1.442c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.232s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.92c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.389-.008-3.232-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598c-.28-.28-.453-.546-.598-.92-.11-.28-.24-.705-.276-1.486C1.442 10.444 1.434 10.17 1.434 8s.007-2.389.046-3.232c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.28-.11.705-.24 1.485-.276C5.611 1.449 5.829 1.434 8 1.434zm0 5.168a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8zM8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z"/></svg>`;
        }

        buttonLink.innerHTML = iconSvg + `<span>${label}</span>`;
        buttonsContainer.appendChild(buttonLink);
        return ''; // Remove o marcador do texto principal
    });
    
    messageContent = messageContent.replace(/\s\s+/g, ' ').trim(); // Limpa espaços extras

    // --- INÍCIO DA LÓGICA PARA LINKS CLICÁVEIS E FORMATAÇÃO NO TEXTO RESTANTE ---
    let formattedText = messageContent;

    // 1. Detectar e transformar URLs em links clicáveis (que não são os botões já processados)
    const urlRegex = /(https?:\/\/[^\s<>"]+[^\s<>",.!'?:;)\]])|www\.[^\s<>"]+(?:\.[^\s<>"]+)*[^\s<>",.!'?:;)\]]/g;
    formattedText = formattedText.replace(urlRegex, (url) => {
        let fullUrl = url;
        if (!url.match(/^[a-zA-Z]+:\/\//)) {
            fullUrl = 'http://' + url;
        }
        return `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });

    // 2. Formatar negrito
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // 3. Formatar quebras de linha
    formattedText = formattedText.replace(/\n/g, '<br>');
    // --- FIM DA LÓGICA PARA LINKS CLICÁVEIS E FORMATAÇÃO ---
    
    textBubble.innerHTML = formattedText; // Define o texto processado

    if (hasButtons) {
        textBubble.appendChild(buttonsContainer); // Adiciona os botões ao final do balão de texto
    }

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
        const API_GATEWAY_INVOKE_URL = 'https://apis.katricia-siqueira.workers.dev/'; // MANTENHA OU ATUALIZE SEU URL AQUI
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
            // Se a mensagem de erro do backend já for amigável, use-a, senão use a padrão.
             if (data.error && typeof data.error === 'string' && data.error.startsWith("Erro da API de IA")) {
                displayError = data.error; // Usa o erro detalhado da API de IA se disponível
            } else if (data.error && typeof data.error === 'string' && data.error.startsWith("Chave de API da IA não configurada")) {
                displayError = "Problema de configuração no servidor da assistente. Tente mais tarde.";
            }
            addMessageToChat(NOME_DA_ASSISTENTE, displayError, false, AVATAR_ASSISTENTE);
            hideLoadingIndicator();
            sendButton.disabled = false;
            if (userInput) userInput.focus();
            return;
        }

        // A resposta do worker agora pode ter 'aiResponse' e 'buttons'
        const aiText = data.aiResponse; 
        // Se o worker for modificado para enviar 'buttons', você os pegaria aqui:
        // const aiButtons = data.buttons; 
        // E passaria para addMessageToChat, ou addMessageToChat interpretaria
        // os marcadores {{button:...}} diretamente de aiText como já implementado.

        hideLoadingIndicator();
        addMessageToChat(NOME_DA_ASSISTENTE, aiText, false, AVATAR_ASSISTENTE); // aiText já pode conter os marcadores de botão
        clientChatHistory.push({ role: "model", parts: [{ text: aiText }] }); // Salva a resposta original da IA no histórico

    } catch (error) {
        hideLoadingIndicator();
        console.error("Erro de rede ou ao chamar a API do Chatbot:", error);
        addMessageToChat(NOME_DA_ASSISTENTE, `Desculpe, tive um problema de comunicação. Por favor, verifique sua conexão e tente novamente. (${error.message})`, false, AVATAR_ASSISTENTE);
    } finally {
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