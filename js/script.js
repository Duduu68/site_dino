const tarefas = ["banho", "dentes", "estudar", "comer", "roupa"];

// Tela inicial
function iniciarAventura() {
    document.getElementById("start-screen").style.display = "none";
}

// Pop-up estilizado
function mostrarPopup(mensagem) {
    const popup = document.getElementById("popupMensagem");
    popup.innerText = mensagem;
    popup.style.display = "block";
    setTimeout(() => {
        popup.style.display = "none";
    }, 3500);
}

// Alternar tarefa feita/desfeita
function alternarTarefa(event, tarefa) {
    event.stopPropagation();
    const card = event.target.closest('.task');
    const jaFeito = localStorage.getItem(tarefa) === "feito";
    const dinoSound = document.getElementById("dino-sound");


    if (jaFeito) {
        localStorage.removeItem(tarefa);
        card.classList.remove("completed");
        mostrarPopup(`Você desmarcou: ${card.querySelector("p").innerText}`);
    } else {
        localStorage.setItem(tarefa, "feito");
        card.classList.add("completed");
        mostrarPopup(`Parabéns Arthur! Você concluiu: ${card.querySelector("p").innerText} 🦕🦖🎉`);
        dinoSound.currentTime = 0; // Reinicia o som, caso esteja tocando
        dinoSound.play();
    }

    atualizarContador();
}

// Atualiza contador e recompensas
function atualizarContador() {
    const feitas = tarefas.filter(tarefa => localStorage.getItem(tarefa) === "feito").length;
    document.getElementById("contador").innerText = feitas;

    // Mostrar mensagem de parabéns se todas feitas
    if (feitas === tarefas.length) {
        document.getElementById("congrats").style.display = "block";
    } else {
        document.getElementById("congrats").style.display = "none";
    }

    atualizarRecompensas();
}

// Atualiza as estrelas e medalha
function atualizarRecompensas() {
    const feitas = tarefas.filter(tarefa => localStorage.getItem(tarefa) === "feito").length;
    const estrelasEl = document.getElementById("estrelas");
    const medalhaEl = document.getElementById("medalha");

    estrelasEl.innerHTML = "⭐".repeat(feitas);

    if (feitas === tarefas.length) {
        medalhaEl.style.display = "block";
    } else {
        medalhaEl.style.display = "none";
    }
}

// Carrega progresso salvo no localStorage
function carregarProgresso() {
    tarefas.forEach(tarefa => {
        if (localStorage.getItem(tarefa) === "feito") {
            const card = document.querySelector(`[data-task="${tarefa}"]`);
            card.classList.add("completed");
        }
    });
    atualizarContador();
}
    //mostrar o popup de reset manual
function mostrarPopup(mensagem) {
    const popup = document.getElementById("popupMensagem");
    popup.innerText = mensagem;
    popup.style.display = "block";
    setTimeout(() => {
        popup.style.display = "none";
    }, 4000); // Duração do popup
}


// Reset manual
function resetarTarefas() {
  tarefas.forEach(tarefa => localStorage.removeItem(tarefa));
  document.querySelectorAll('.task').forEach(card => card.classList.remove("completed"));
  atualizarContador();
  mostrarPopup("Todas as tarefas foram reiniciadas com sucesso, Arthur! 🦖");
}

// Reset automático diário à meia-noite
function resetarTarefasSeNovoDia() {
    const hoje = new Date().toDateString();
    const ultimoDia = localStorage.getItem("ultimoDia");

    if (hoje !== ultimoDia) {
        tarefas.forEach(tarefa => localStorage.removeItem(tarefa));
        localStorage.setItem("ultimoDia", hoje);
        document.querySelectorAll('.task').forEach(card => card.classList.remove('completed'));
        atualizarContador();
        mostrarPopup("Bom dia Arthur! As tarefas foram reiniciadas para um novo dia.");
    }
}

// Configurar timer para resetar às 00:00 automaticamente sem precisar recarregar
function agendarResetMeiaNoite() {
    const agora = new Date();
    const amanhaMeiaNoite = new Date();
    amanhaMeiaNoite.setHours(24, 0, 0, 0);
    const msAteMeiaNoite = amanhaMeiaNoite - agora;

    setTimeout(() => {
        resetarTarefasSeNovoDia();
        agendarResetMeiaNoite(); // agenda novamente para o próximo dia
    }, msAteMeiaNoite);
}

// Início da aplicação
window.onload = () => {
    resetarTarefasSeNovoDia();
    carregarProgresso();
    agendarResetMeiaNoite();
};