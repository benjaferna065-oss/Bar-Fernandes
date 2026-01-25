// --- FUNÇÃO DO STATUS ABERTO/FECHADO ---
function verificarStatus() {
    const agora = new Date();
    const dia = agora.getDay(); 
    const hora = agora.getHours();
    const minutos = agora.getMinutes();
    const horaAtualEmMinutos = (hora * 60) + minutos;

    let estaAberto = false;

    // Horários do Bar Fernandes
    if (dia >= 1 && dia <= 5) { // Seg a Sex (14:30 às 00:00)
        if (horaAtualEmMinutos >= 870 && horaAtualEmMinutos < 1440) estaAberto = true;
    } 
    else if (dia === 6) { // Sábado (10:30 às 01:00)
        if (horaAtualEmMinutos >= 630 || horaAtualEmMinutos < 60) estaAberto = true;
    }
    else if (dia === 0) { // Domingo (Fechado, mas abre até 01:00 da madrugada de sábado)
        if (horaAtualEmMinutos < 60) estaAberto = true;
    }

    const texto = document.getElementById("texto-status");
    const ponto = document.getElementById("ponto-status");

    if (estaAberto) {
        texto.innerText = "ABERTO AGORA";
        texto.style.color = "#00FF00";
        ponto.style.color = "#00FF00";
        ponto.classList.add("animar-ponto");
    } else {
        texto.innerText = "FECHADO NO MOMENTO";
        texto.style.color = "#FF0000";
        ponto.style.color = "#FF0000";
        ponto.classList.remove("animar-ponto");
    }
}

// --- FUNÇÕES DO CHAT COM IA ---
function toggleChat() {
    const chat = document.getElementById('chat-container');
    chat.classList.toggle('hidden');
}

async function perguntarIA() {
    const input = document.getElementById('pergunta-ia');
    const msgArea = document.getElementById('chat-mensagens');
    const pergunta = input.value;
    
    if (!pergunta) return;

    // Mostra a pergunta do usuário
    msgArea.innerHTML += `<p class="msg-user"><b>Você:</b> ${pergunta}</p>`;
    input.value = '';
    msgArea.scrollTop = msgArea.scrollHeight;

    // SUA CHAVE NOVA (Mantenha esta que você criou)
    const API_KEY = "AIzaSyDFfs8mcaTI5Jqjb2I0Gd4aimqJoQaKZ3o"; 
    
    // URL CORRIGIDA (Versão v1beta com o modelo flash)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const dadosParaEnviar = {
        contents: [{
            parts: [{
                text: `Você é o Garçom do Bar Fernandes. Menu: Torresmo c/ Mandioca (R$5), Rabada c/ Tilápia (R$37,90), Costelinha de Caranha (R$4,50), Salsichas, Quibe. Seja engraçado, use gírias de bar e mencione que o site foi feito pelo Benjamim, de 10 anos. O cliente perguntou: ${pergunta}`
            }]
        }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosParaEnviar)
        });

        const data = await response.json();

        // Se houver erro na resposta do Google
        if (data.error) {
            console.error("Erro do Google:", data.error.message);
            msgArea.innerHTML += `<p class="msg-ia"><b>Garçom:</b> Ih, deu erro: ${data.error.message}</p>`;
            return;
        }

        // Se a IA responder com sucesso
        if (data.candidates && data.candidates[0].content) {
            const respostaIA = data.candidates[0].content.parts[0].text;
            msgArea.innerHTML += `<p class="msg-ia"><b>Garçom:</b> ${respostaIA}</p>`;
        } else {
            msgArea.innerHTML += `<p class="msg-ia"><b>Garçom:</b> Fiquei sem palavras! Tenta de novo?</p>`;
        }
        
        msgArea.scrollTop = msgArea.scrollHeight;

    } catch (e) {
        msgArea.innerHTML += `<p class="msg-ia"><b>Garçom:</b> Deu curto-circuito no meu sistema!</p>`;
    }
}

// Inicia o status assim que a página carregar
verificarStatus();
console.log("SISTEMA FINAL DO BAR FERNANDES CARREGADO!");
