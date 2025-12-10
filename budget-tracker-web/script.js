const transactionForm = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const transactionList = document.getElementById('transaction-list');
const budgetChartCanvas = document.getElementById('budget-chart').getContext('2d');
const darkModeToggle = document.getElementById('dark-mode-toggle');

let transactions = [];
let budgetChart;

function toggleDarkMode() {
    document.body.classList.toggle('dark');
    const isDarkMode = document.body.classList.contains('dark');
    if (isDarkMode) {
        darkModeToggle.innerHTML = '☀️ Light Mode';
    } else {
        darkModeToggle.innerHTML = '🌙 Dark Mode';
    }
    updateChart();
}

async function addTransaction(e) {
    e.preventDefault();

    if (descriptionInput.value.trim() === '' || amountInput.value.trim() === '') {
        alert('Please add a description and amount');
        return;
    }

    const transaction = {
        description: descriptionInput.value,
        amount: +amountInput.value,
        type: typeInput.value,
    };

    try {
        const response = await fetch('http://localhost:3000/api/transactions/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transaction),
        });
        if (response.ok) {
            init();
        } else {
            alert('Error adding transaction');
        }
    } catch (error) {
        console.error('Error:', error);
    }


    descriptionInput.value = '';
    amountInput.value = '';
}

function addTransactionDOM(transaction) {
    const item = document.createElement('li');
    item.setAttribute('data-id', transaction.id);

    item.classList.add(
        'flex',
        'justify-between',
        'p-2',
        'border-b',
        'dark:border-gray-600',
        transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
    );

    const descriptionSpan = document.createElement('span');
    descriptionSpan.textContent = transaction.description;

    const amountSpan = document.createElement('span');
    amountSpan.textContent = `${transaction.type === 'income' ? '+' : '-'}$${Math.abs(
        transaction.amount
    )}`;

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '&#128465;';
    deleteButton.setAttribute('aria-label', `Delete transaction: ${transaction.description}`);
    deleteButton.classList.add('ml-4', 'text-red-500');
    deleteButton.addEventListener('click', () => deleteTransaction(transaction.id));

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('flex-grow');
    contentDiv.appendChild(descriptionSpan);

    const rightDiv = document.createElement('div');
    rightDiv.appendChild(amountSpan);
    rightDiv.appendChild(deleteButton);

    item.appendChild(contentDiv);
    item.appendChild(rightDiv);

    transactionList.appendChild(item);
}

async function deleteTransaction(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/transactions/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            init();
        } else {
            alert('Error deleting transaction');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function updateChart() {
    const isDarkMode = document.body.classList.contains('dark');
    const chartTextColor = isDarkMode ? 'white' : 'black';

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
            plugins: {
                legend: {
                    labels: {
                        color: chartTextColor,
                    }
                }
            }
        },
    });
}

async function init() {
    await new Promise(resolve => setTimeout(resolve, 500));
    transactionList.innerHTML = '';
    try {
        const response = await fetch('http://localhost:3000/api/transactions');
        const result = await response.json();
        if (response.ok) {
            transactions = result.data;
            transactions.forEach(addTransactionDOM);
            updateChart();
        }
    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
}

init();

transactionForm.addEventListener('submit', addTransaction);
