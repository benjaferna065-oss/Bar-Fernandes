// --- FUNÇÃO DO STATUS ABERTO/FECHADO ---
function verificarStatus() {
    const agora = new Date();
    const dia = agora.getDay(); 
    const hora = agora.getHours();
    const minutos = agora.getMinutes();
    const horaAtualEmMinutos = (hora * 60) + minutos;

    let estaAberto = false;

    if (dia >= 1 && dia <= 5) {
        if (horaAtualEmMinutos >= 870 && horaAtualEmMinutos < 1440) estaAberto = true;
    } 
    else if (dia === 6) {
        if (horaAtualEmMinutos >= 630 || horaAtualEmMinutos < 60) estaAberto = true;
    }
    else if (dia === 0) {
        if (horaAtualEmMinutos < 60) estaAberto = true;
    }

    const texto = document.getElementById("texto-status");
    const ponto = document.getElementById("ponto-status");

    if (!texto || !ponto) return;

    if (estaAberto) {
        texto.innerText = "ABERTO AGORA";
        texto.style.color = "#00FF00";
        ponto.style.color = "#00FF00";
    } else {
        texto.innerText = "FECHADO NO MOMENTO";
        texto.style.color = "#FF0000";
        ponto.style.color = "#FF0000";
    }
}

// --- CHAT ---
function toggleChat() {
    document.getElementById('chat-container').classList.toggle('hidden');
}

async function perguntarIA() {
    const input = document.getElementById('pergunta-ia');
    const msgArea = document.getElementById('chat-mensagens');
    const pergunta = input.value.trim();

    if (!pergunta) return;

    msgArea.innerHTML += `<p class="msg-user"><b>Você:</b> ${pergunta}</p>`;
    input.value = '';
    msgArea.scrollTop = msgArea.scrollHeight;

    msgArea.innerHTML += `<p class="msg-ia"><b>Garçom:</b> Pensando aqui no balcão... 🍺</p>`;

    try {
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pergunta })
        });

        const data = await res.json();
        msgArea.lastChild.remove();

        msgArea.innerHTML += `<p class="msg-ia"><b>Garçom:</b> ${data.resposta}</p>`;
        msgArea.scrollTop = msgArea.scrollHeight;

    } catch {
        msgArea.innerHTML += `<p class="msg-ia"><b>Garçom:</b> Deu ruim aqui 😅 tenta de novo!</p>`;
    }
}

window.onload = () => {
    verificarStatus();
    setInterval(verificarStatus, 60000);
};

console.log("Site do Bar Fernandes carregado com sucess");

