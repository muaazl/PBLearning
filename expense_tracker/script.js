document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const totalAmount = document.getElementById("total-amount");
    const filterCategory = document.getElementById("filter-category");

    let expenses = [];

    // Fetch expenses from the server (PHP)
    async function fetchExpenses() {
        try {
            const response = await fetch("expenses.php");
            expenses = await response.json();
            expenses.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date
            displayExpenses(expenses);
            updateTotalAmount();
        } catch (error) {
            console.error("Error fetching expenses:", error);
        }
    }

    // Save expenses to the server (PHP)
    async function saveExpenses() {
        try {
            expenses.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort before saving
            await fetch("expenses.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(expenses, null, 2), // Format JSON
            });
        } catch (error) {
            console.error("Error saving expenses:", error);
        }
    }

    // Add or update an expense
    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault();
    
        const name = document.getElementById("expense-name").value;
        const amount = parseFloat(document.getElementById("expense-amount").value);
        const category = document.getElementById("expense-category").value;
        const date = document.getElementById("expense-date").value;
    
        const expenseId = document.getElementById("expense-id").value;
    
        if (expenseId) {
            // Update existing expense
            const expenseIndex = expenses.findIndex((expense) => expense.id === parseInt(expenseId));
            if (expenseIndex !== -1) {
                expenses[expenseIndex] = { id: parseInt(expenseId), name, amount, category, date };
            }
            document.getElementById("expense-id").value = "";  // Clear hidden input after editing
        } else {
            // Add new expense
            const expense = {
                id: Date.now(),
                name,
                amount,
                category,
                date,
            };
            expenses.push(expense);
        }
    
        displayExpenses(expenses);
        updateTotalAmount();
        saveExpenses(); // Save to server
        expenseForm.reset();  // Clear the form
    });
    

    // Handle click events (delete or edit)
    expenseList.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);

        if (e.target.classList.contains("delete-btn")) {
            expenses = expenses.filter((expense) => expense.id !== id);
        } else if (e.target.classList.contains("edit-btn")) {
            const expense = expenses.find((expense) => expense.id === id);
            document.getElementById("expense-name").value = expense.name;
            document.getElementById("expense-amount").value = expense.amount;
            document.getElementById("expense-category").value = expense.category;
            document.getElementById("expense-date").value = expense.date;
            document.getElementById("expense-id").value = expense.id;
        }

        displayExpenses(expenses);
        updateTotalAmount();
        saveExpenses(); // Save to server
    });

    // Display expenses
    function displayExpenses(expenses) {
        expenseList.innerHTML = "";
        expenses.forEach((expense) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${expense.name}</td>
                <td>Rs.${expense.amount.toFixed(2)}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td>
                    <button class="edit-btn" data-id="${expense.id}">Edit</button>
                    <button class="delete-btn" data-id="${expense.id}">Delete</button>
                </td>
            `;

            expenseList.appendChild(row);
        });
    }

    // Update total amount
    function updateTotalAmount() {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalAmount.textContent = total.toFixed(2);
    }

    // Fetch expenses on load
    fetchExpenses();
});
