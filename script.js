// Seleciona elementos do DOM que serão manipulados pelo JavaScript
const balance = document.getElementById('balance');
const moneyPlus = document.getElementById('money-plus');
const moneyMinus = document.getElementById('money-minus');
const transactionsList = document.getElementById('transactions');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const form = document.getElementById('form');

// Inicializa um array vazio para armazenar as transações
let transactions = [];

// Função para exibir as transações no DOM
function displayTransactions() {
  // Limpa o conteúdo da lista de transações
  transactionsList.innerHTML = '';

  // Itera sobre as transações e adiciona cada uma à lista
  transactions.forEach((transaction, index) => {
    const transactionItem = document.createElement('li');
    const sign = transaction.amount < 0 ? '-' : '+';

    transactionItem.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
    transactionItem.innerHTML = `
      ${transaction.text} <span>${sign} R$${Math.abs(
      transaction.amount
    ).toFixed(2)}</span><button class="delete-btn" data-index="${index}">x</button>
    `;

    transactionsList.appendChild(transactionItem);
  });

  // Atualiza o saldo, receitas e despesas
  updateBalance();
}

// Função para atualizar o saldo, receitas e despesas
function updateBalance() {
  const amounts = transactions.map((transaction) => transaction.amount);

  // Calcula o saldo total
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  // Calcula o total de receitas
  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  // Calcula o total de despesas
  const expense = amounts
    .filter((item) => item < 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  // Atualiza os valores no DOM
  balance.innerText = `R$${total}`;
  moneyPlus.innerText = `+ R$${income}`;
  moneyMinus.innerText = `- R$${Math.abs(expense)}`;
}

// Função para adicionar uma nova transação
function addTransaction(e) {
  e.preventDefault();

  const text = textInput.value.trim();
  const amount = parseFloat(amountInput.value);

  // Verifica se o texto e o valor são válidos
  if (text === '' || isNaN(amount)) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  // Cria um objeto de transação
  const transaction = {
    text,
    amount,
  };

  // Adiciona a transação ao array de transações
  transactions.push(transaction);

  // Limpa os campos de entrada
  textInput.value = '';
  amountInput.value = '';

  // Atualiza a exibição das transações
  displayTransactions();

  // Salva as transações no localStorage
  saveTransactionsToLocalStorage();
}

// Função para remover uma transação
function deleteTransaction(index) {
  // Remove a transação do array de transações
  transactions.splice(index, 1);

  // Atualiza a exibição das transações
  displayTransactions();

  // Salva as transações atualizadas no localStorage
  saveTransactionsToLocalStorage();
}

// Função para salvar as transações no localStorage
function saveTransactionsToLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Função para carregar as transações do localStorage
function loadTransactionsFromLocalStorage() {
  const storedTransactions = localStorage.getItem('transactions');
  if (storedTransactions) {
    transactions = JSON.parse(storedTransactions);
    displayTransactions();
  }
}

// Event listener para o formulário de adicionar transação
form.addEventListener('submit', addTransaction);

// Event delegation para excluir transações
transactionsList.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const index = e.target.getAttribute('data-index');
    deleteTransaction(index);
  }
});

// Carrega as transações do localStorage quando a página é carregada
loadTransactionsFromLocalStorage();
