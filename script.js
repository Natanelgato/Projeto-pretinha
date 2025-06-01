// Carregar dados do localStorage ou iniciar do zero
let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [
  { nome: "Acordar antes das 10h", valor: 1.00, vezes: 0 },
  { nome: "Me dar bom dia", valor: 0.20, vezes: 0 },
  { nome: "Dormir antes das 1h", valor: 1.75, vezes: 0 },
  { nome: "Me dar boa noite", valor: 0.25, vezes: 0 },
  { nome: "Almoçar", valor: 1.25, vezes: 0 },
  { nome: "Jantar", valor: 1.50, vezes: 0 },
  { nome: "Tomar banho", valor: 0.50, vezes: 0 },
  { nome: "Fazer um desenho", valor: 4.50, vezes: 0 },
  { nome: "Cantar uma música", valor: 2.00, vezes: 0 },
  { nome: "Me mandar foto ou vídeo dela", valor: 1.50, vezes: 0 },
  { nome: "Me mandar foto ou vídeo dela, mas arrumadinha", valor: 5.00, vezes: 0 },
  { nome: "Me mandar foto do corpo", valor: 0, vezes: 0, incalculavel: true },
  { nome: "Mexer na aparência", valor: 5.00, vezes: 0 },
  { nome: "Fazer um piercing", valor: 20.00, vezes: 0 }
];

let saldo = parseFloat(localStorage.getItem("saldo")) || 0;

function salvarDados() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
  localStorage.setItem("saldo", saldo.toString());
}

function atualizarInterface() {
  const container = document.querySelector(".task-grid");
  container.innerHTML = "";

  tarefas.forEach((tarefa, index) => {
    const card = document.createElement("div");
    card.className = "task-card";

    card.innerHTML = `
      <button class="edit" onclick="editarTarefa(${index})">✏️</button>
      <button class="delete" onclick="excluirTarefa(${index})">❌</button>
      <h3>${tarefa.nome}</h3>
      <p>Valor: ${tarefa.incalculavel ? "Incalculável 💖" : `R$ ${tarefa.valor.toFixed(2)}`}</p>
      <p>Fez hoje: ${tarefa.vezes}x</p>
      <button onclick="fazerTarefa(${index})">Fazer</button>
    `;

    container.appendChild(card);
  });

  document.getElementById("valorAcumulado").innerText = `R$ ${saldo.toFixed(2)}`;
  salvarDados(); // Salva sempre que a interface for atualizada
}

function fazerTarefa(index) {
  tarefas[index].vezes++;
  if (!tarefas[index].incalculavel) {
    saldo += tarefas[index].valor;
  }
  atualizarInterface();
}

function resetarSaldo() {
  saldo = 0;
  atualizarInterface();
}

function resetarDia() {
  tarefas.forEach(t => t.vezes = 0);
  atualizarInterface();
}

function adicionarTarefa() {
  const nome = prompt("Nome da nova tarefa:");
  const valor = prompt("Valor em R$ (use ponto, ex: 3.50):");

  if (nome && valor !== null && !isNaN(parseFloat(valor))) {
    tarefas.push({
      nome: nome,
      valor: parseFloat(valor),
      vezes: 0
    });
    atualizarInterface();
  }
}

function editarTarefa(index) {
  const novoNome = prompt("Novo nome da tarefa:", tarefas[index].nome);
  const novoValor = prompt("Novo valor (use ponto):", tarefas[index].valor);

  if (novoNome !== null && novoValor !== null && !isNaN(parseFloat(novoValor))) {
    tarefas[index].nome = novoNome;
    tarefas[index].valor = parseFloat(novoValor);
    atualizarInterface();
  }
}

function excluirTarefa(index) {
  if (confirm("Tem certeza que deseja excluir essa tarefa?")) {
    tarefas.splice(index, 1);
    atualizarInterface();
  }
}

function exportarProgresso() {
  let texto = `💖 Relatório da Pretinha 💖\n\n`;
  texto += `Valor acumulado: R$ ${saldo.toFixed(2)}\n\n`;
  texto += `Tarefas realizadas:\n`;

  tarefas.forEach(t => {
    texto += `- ${t.nome}: ${t.vezes}x (${t.incalculavel ? "Incalculável" : `R$ ${t.valor.toFixed(2)}`})\n`;
  });

  const blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "progresso-da-pretinha.txt";
  a.click();

  URL.revokeObjectURL(url);
}

// Inicializa a interface ao carregar a página
window.onload = atualizarInterface;
