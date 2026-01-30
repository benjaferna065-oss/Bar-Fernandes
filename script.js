// --- FUNÇÃO DO STATUS ABERTO/FECHADO ---
function verificarStatus() {
    const agora = new Date();
    const dia = agora.getDay(); 
    const hora = agora.getHours();
    const minutos = agora.getMinutes();
    const horaAtualEmMinutos = (hora * 60) + minutos;

    let estaAberto = false;

    // Horários do Bar Fernandes (Configurados conforme suas capturas de tela)
    if (dia >= 1 && dia <= 5) { // Segunda a Sexta (14:30 às 00:00)
        if (horaAtualEmMinutos >= 870 && horaAtualEmMinutos < 1440) estaAberto = true;
    } 
    else if (dia === 6) { // Sábado (10:30 às 01:00)
        if (horaAtualEmMinutos >= 630 || horaAtualEmMinutos < 60) estaAberto = true;
    }
    else if (dia === 0) { // Domingo (Abre apenas na madrugada de Sábado para Domingo)
        if (horaAtualEmMinutos < 60) estaAberto = true;
    }

    const texto = document.getElementById("texto-status");
    const ponto = document.getElementById("ponto-status");

    if (texto && ponto) {
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
}

// --- FUNÇÃO PARA ABRIR E FECHAR A JANELA ---
function toggleChat() {
    const chat = document.getElementById('chat-container');
    if (chat) {
        chat.classList.toggle('hidden');
    }
}

// Inicia a verificação assim que a página carrega
window.onload = function() {
    verificarStatus();
    // Atualiza o status a cada 1 minuto automaticamente
    setInterval(verificarStatus, 60000);
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { pergunta } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
Você é o Garçom do Bar Fernandes.
Fale de forma divertida, com gírias leves de bar.
Menu:
- Torresmo c/ Mandioca (R$5)
- Rabada c/ Tilápia (R$37,90)
- Costelinha de Caranha (R$4,50)
- Salsicha
- Quibe

Sempre seja educado.
`
          },
          {
            role: "user",
            content: pergunta
          }
        ]
      })
    });

    const data = await response.json();

    return res.status(200).json({
      resposta: data.choices[0].message.content
    });

  } catch (err) {
    return res.status(500).json({
      resposta: "Ixi… deu problema aqui na cozinha 😅 tenta de novo!"
    });
  }
}


console.log("Site do Bar Fernandes carregado com sucesso!");

