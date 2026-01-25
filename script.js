// --- FUNÇÃO DO STATUS ABERTO/FECHADO ---
function verificarStatus() {
    const agora = new Date();
    const dia = agora.getDay(); 
    const hora = agora.getHours();
    const minutos = agora.getMinutes();
    const horaAtualEmMinutos = (hora * 60) + minutos;

    let estaAberto = false;

    if (dia >= 1 && dia <= 5) { // Seg a Sex
        if (horaAtualEmMinutos >= 870 && horaAtualEmMinutos < 1440) estaAberto = true;
    } 
    else if (dia === 6) { // Sábado
        if (horaAtualEmMinutos >= 630 || horaAtualEmMinutos < 60) estaAberto = true;
    }
    else if (dia === 0) { // Domingo
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

    msgArea.innerHTML += `<p class="msg-user"><b>Você:</b> ${pergunta}</p>`;
    input.value = '';
    msgArea.scrollTop = msgArea.scrollHeight;

    // Use sua chave de 39 caracteres aqui
    const API_KEY = "AIzaSyATUUC_9BUkztjGqENapdb5OM5A4eGaZO4"; 
    
    // Testando com o modelo Flash Latest na v1beta (o mais compatível)
    // Verifique se a sua URL está exatamente assim (usando v1 e o modelo flash)
// Mude para v1beta e adicione -latest no final do modelo
    // A URL precisa ser exatamente assim para o modelo Flash na v1beta
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

        if (data.error) {
            console.error("Erro detalhado:", data.error);
            msgArea.innerHTML += `<p class="msg-ia"><b>Garçom:</b> O Google disse: ${data.error.message}</p>`;
            return;
        }

        if (data.candidates && data.candidates[0].content) {
            const respostaIA = data.candidates[0].content.parts[0].text;
            msgArea.innerHTML += `<p class="msg-ia"><b>Garçom:</b> ${respostaIA}</p>`;
        } else {
            msgArea.innerHTML += `<p class="msg-ia"><b>Garçom:</b> Fiquei sem palavras! Tenta perguntar de outro jeito?</p>`;
        }
        
        msgArea.scrollTop = msgArea.scrollHeight;

    } catch (e) {
        msgArea.innerHTML += `<p class="msg-ia"><b>Garçom:</b> Deu um curto-circuito aqui! Tenta de novo?</p>`;
    }

}

console.log("GARCOM ACORDANDO!!!");





