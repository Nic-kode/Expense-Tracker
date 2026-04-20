//Querys
const form = document.getElementById("transaction-form");
const transactionList = document.getElementById("transaction-list");
const list = document.querySelector(".transactions-container ul");
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
renderTransactions();
updateSummary();

transactionList.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-btn")) {
    removeElement(e);
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const description = document.getElementById("description").value;
  const amount = document.getElementById("amount").value;

  const amountValue = parseFloat(amount.replace(/,/g, ""));

  transactions.push({
    description,
    amount: amountValue,
    id: Date.now(),
  });

  saveToLocalStorage(); // 👈 GUARDAR
  renderTransactions(); // 👈 ACTUALIZAR UI
  updateSummary(); // 👈 ACTUALIZAR TOTALES

  form.reset();
});

function renderTransactions() {
  transactionList.innerHTML = "";

  transactions.forEach((t, id) => {
    const transaction = document.createElement("div");
    transaction.classList.add("transaction");

    if (t.amount < 0) {
      transaction.classList.add("exp");
    } else {
      transaction.classList.add("paycheck");
    }

    transaction.innerHTML = `
        <div class="transaction-info">
            <p>${t.description}</p>
            <h3>
            ${
              t.amount < 0
                ? "-$" + Math.abs(t.amount).toLocaleString()
                : "$" + t.amount.toLocaleString()
            }
            </h3>
        </div>

        <i class="fa-solid fa-x delete-btn" data-index="${id}"></i>
    `;

    transactionList.prepend(transaction);
  });
}

//Actualizar datos
function updateSummary() {
  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income + expenses;

  document.getElementById("income").textContent = "$" + income.toLocaleString();

  document.getElementById("expenses").textContent =
    "$" + expenses.toLocaleString();

  document.getElementById("balance").textContent =
    "$" + balance.toLocaleString();
}

// Guardar datos
function saveToLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Eliminar un elemento
function removeElement(e) {
  const index = e.target.dataset.index;

  transactions.splice(index, 1);

  saveToLocalStorage();
  renderTransactions();
  updateSummary();
}
