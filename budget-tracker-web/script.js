const transactionForm = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const transactionList = document.getElementById('transaction-list');
const budgetChartCanvas = document.getElementById('budget-chart').getContext('2d');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let budgetChart;

function addTransaction(e) {
    e.preventDefault();

    if (descriptionInput.value.trim() === '' || amountInput.value.trim() === '') {
        alert('Please add a description and amount');
        return;
    }

    const transaction = {
        id: generateID(),
        description: descriptionInput.value,
        amount: +amountInput.value,
        type: typeInput.value,
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateLocalStorage();
    updateChart();

    descriptionInput.value = '';
    amountInput.value = '';
}

function generateID() {
    return crypto.randomUUID();
}

function addTransactionDOM(transaction) {
    const item = document.createElement('li');

    item.classList.add(
        'flex',
        'justify-between',
        'p-2',
        'border-b',
        transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
    );

    const descriptionSpan = document.createElement('span');
    descriptionSpan.textContent = transaction.description;

    const amountSpan = document.createElement('span');
    amountSpan.textContent = `${transaction.type === 'income' ? '+' : '-'}$${Math.abs(
        transaction.amount
    )}`;

    item.appendChild(descriptionSpan);
    item.appendChild(amountSpan);

    transactionList.appendChild(item);
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function updateChart() {
    const income = transactions
        .filter((transaction) => transaction.type === 'income')
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    const expenses = transactions
        .filter((transaction) => transaction.type === 'expense')
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    if (budgetChart) {
        budgetChart.destroy();
    }

    budgetChart = new Chart(budgetChartCanvas, {
        type: 'pie',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [
                {
                    data: [income, expenses],
                    backgroundColor: ['#4CAF50', '#F44336'],
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        },
    });
}

function init() {
    transactionList.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateChart();
}

init();

transactionForm.addEventListener('submit', addTransaction);
