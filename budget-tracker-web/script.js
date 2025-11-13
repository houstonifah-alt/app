document.addEventListener('DOMContentLoaded', () => {
    const transactionForm = document.getElementById('transaction-form');
    const transactionList = document.getElementById('transaction-list');
    const totalIncomeEl = document.getElementById('total-income');
    const totalExpensesEl = document.getElementById('total-expenses');
    const balanceEl = document.getElementById('balance');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const clearAllButton = document.getElementById('clear-all');
    const expenseChartCanvas = document.getElementById('expense-chart').getContext('2d');

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let expenseChart;

    // Dark Mode Functionality
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.documentElement.classList.add('dark');
        darkModeToggle.checked = true;
    }

    darkModeToggle.addEventListener('change', () => {
        if (darkModeToggle.checked) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    // Clear All Data
    clearAllButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete all transactions? This action cannot be undone.')) {
            transactions = [];
            localStorage.removeItem('transactions');
            updateUI();
        }
    });

    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const description = document.getElementById('description').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;
        const type = document.querySelector('input[name="type"]:checked').value;

        if (description.trim() === '' || isNaN(amount) || amount <= 0) {
            alert('Please enter a valid description and amount.');
            return;
        }

        const transaction = {
            id: generateID(),
            description,
            amount,
            category: type === 'income' ? 'Income' : category,
            type,
        };

        transactions.push(transaction);
        saveTransactions();
        updateUI();

        transactionForm.reset();
    });

    function generateID() {
        return Math.floor(Math.random() * 1000000000);
    }

    function saveTransactions() {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    function updateUI() {
        transactionList.innerHTML = '';
        transactions.forEach(addTransactionToDOM);
        updateSummary();
        updateChart();
    }

    function addTransactionToDOM(transaction) {
        const item = document.createElement('li');
        const sign = transaction.type === 'income' ? '+' : '-';
        const color = transaction.type === 'income' ? 'text-green-500' : 'text-red-500';

        item.innerHTML = `
            <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                    <span class="font-bold">${transaction.description}</span>
                    <span class="block text-sm text-gray-500 dark:text-gray-400">${transaction.category}</span>
                </div>
                <div class="text-right">
                    <span class="${color} font-semibold">${sign}$${Math.abs(transaction.amount).toFixed(2)}</span>
                    <button onclick="removeTransaction(${transaction.id})" class="ml-4 text-red-500 hover:text-red-700">&times;</button>
                </div>
            </div>
        `;
        transactionList.appendChild(item);
    }

    window.removeTransaction = function(id) {
        transactions = transactions.filter(transaction => transaction.id !== id);
        saveTransactions();
        updateUI();
    }

    function updateSummary() {
        const amounts = transactions.map(t => t.amount);

        const income = amounts
            .filter((_, i) => transactions[i].type === 'income')
            .reduce((acc, item) => (acc += item), 0)
            .toFixed(2);

        const expenses = amounts
            .filter((_, i) => transactions[i].type === 'expense')
            .reduce((acc, item) => (acc += item), 0)
            .toFixed(2);

        const balance = (income - expenses).toFixed(2);

        totalIncomeEl.textContent = `$${income}`;
        totalExpensesEl.textContent = `$${expenses}`;
        balanceEl.textContent = `$${balance}`;

        if (balance < 0) {
            balanceEl.classList.remove('text-green-500');
            balanceEl.classList.add('text-red-500');
        } else {
            balanceEl.classList.remove('text-red-500');
            balanceEl.classList.add('text-green-500');
        }
    }

    function updateChart() {
        const expenseCategories = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, transaction) => {
                acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
                return acc;
            }, {});

        const data = {
            labels: Object.keys(expenseCategories),
            datasets: [{
                data: Object.values(expenseCategories),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ],
            }]
        };

        if (expenseChart) {
            expenseChart.destroy();
        }

        expenseChart = new Chart(expenseChartCanvas, {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }

    updateUI();
});
