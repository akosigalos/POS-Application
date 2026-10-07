const order = [];
const HISTORY_STORAGE_KEY = "quickbite-pos-history";
let transactionHistory = loadTransactionHistory();
let transactionCounter = getLatestTransactionNumber(transactionHistory);
let completedTransaction = null;
const VAT_RATE = 0.12;
const discountOptions = {
  0: "No Discount",
  0.1: "Student Discount",
  0.2: "Senior Citizen / PWD Discount",
};
const productGrid = document.querySelector("#product-grid");
const productCards = document.querySelectorAll(".product-card");
const categoryFilters = document.querySelector(".category-filters");
const productSearch = document.querySelector("#product-search");
const productEmpty = document.querySelector("#product-empty");
const itemCount = document.querySelector("#item-count");
const orderSummary = document.querySelector("#order-summary");
const orderTotal = document.querySelector("#order-total");
const discountSelect = document.querySelector("#discount-select");
const cartCalculation = document.querySelector("#cart-calculation");
const cartItems = document.querySelector("#cart-items");
const continueSummaryButton = document.querySelector("#continue-summary-button");
const selectionScreen = document.querySelector("#selection-screen");
const summaryScreen = document.querySelector("#summary-screen");
const summaryItems = document.querySelector("#summary-items");
const summaryTotal = document.querySelector("#summary-total");
const summaryCalculation = document.querySelector("#summary-calculation");
const backButton = document.querySelector("#back-button");
const orderBar = document.querySelector(".order-bar");
const paymentButton = document.querySelector("#payment-button");
const paymentScreen = document.querySelector("#payment-screen");
const paymentBackButton = document.querySelector("#payment-back-button");
const paymentOptions = document.querySelector("#payment-options");
const paymentTotal = document.querySelector("#payment-total");
const paymentPanels = document.querySelectorAll(".payment-detail");
const cashTotal = document.querySelector("#cash-total");
const qrTotal = document.querySelector("#qr-total");
const cardTotal = document.querySelector("#card-total");
const paymentBreakdowns = document.querySelectorAll(".payment-breakdown");
const amountPaid = document.querySelector("#amount-paid");
const cashMessage = document.querySelector("#cash-message");
const cashPayButton = document.querySelector("#cash-pay-button");
const qrConfirmButton = document.querySelector("#qr-confirm-button");
const cardProcessButton = document.querySelector("#card-process-button");
const paymentSuccess = document.querySelector("#payment-success");
const confirmationTotal = document.querySelector("#confirmation-total");
const confirmationPaid = document.querySelector("#confirmation-paid");
const confirmationMethod = document.querySelector("#confirmation-method");
const confirmationNumber = document.querySelector("#confirmation-number");
const confirmationBreakdown = document.querySelector("#confirmation-breakdown");
const viewReceiptButton = document.querySelector("#view-receipt-button");
const receiptScreen = document.querySelector("#receipt-screen");
const receiptDate = document.querySelector("#receipt-date");
const receiptNumber = document.querySelector("#receipt-number");
const receiptItems = document.querySelector("#receipt-items");
const receiptTotal = document.querySelector("#receipt-total");
const receiptMethod = document.querySelector("#receipt-method");
const receiptPaid = document.querySelector("#receipt-paid");
const receiptChange = document.querySelector("#receipt-change");
const receiptCalculation = document.querySelector("#receipt-calculation");
const newTransactionButton = document.querySelector("#new-transaction-button");
const openHistoryButton = document.querySelector("#open-history-button");
const historyScreen = document.querySelector("#history-screen");
const historyBackButton = document.querySelector("#history-back-button");
const historyList = document.querySelector("#history-list");
const reportCount = document.querySelector("#report-count");
const reportSales = document.querySelector("#report-sales");
const reportCash = document.querySelector("#report-cash");
const reportQr = document.querySelector("#report-qr");
const reportCard = document.querySelector("#report-card");
const clearHistoryButton = document.querySelector("#clear-history-button");
const historyConfirmation = document.querySelector("#history-confirmation");
const cancelClearButton = document.querySelector("#cancel-clear-button");
const confirmClearButton = document.querySelector("#confirm-clear-button");

const formatPrice = (price) => `₱${price.toFixed(2)}`;
let selectedDiscountRate = 0;
let selectedCategory = "all";

productGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".product-card");

  if (!card) return;

  const existingItem = order.find((item) => item.name === card.dataset.product);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    order.push({
      name: card.dataset.product,
      price: Number(card.dataset.price),
      quantity: 1,
    });
  }

  renderOrder();
});

categoryFilters.addEventListener("click", (event) => {
  const categoryButton = event.target.closest("[data-category]");
  if (!categoryButton) return;

  selectedCategory = categoryButton.dataset.category;
  categoryFilters.querySelectorAll(".category-button").forEach((button) => {
    const isSelected = button === categoryButton;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
  updateProductVisibility();
});

productSearch.addEventListener("input", updateProductVisibility);

cartItems.addEventListener("click", (event) => {
  const actionButton = event.target.closest("button[data-action]");

  if (!actionButton) return;

  const item = order.find((orderItem) => orderItem.name === actionButton.dataset.product);
  if (!item) return;

  if (actionButton.dataset.action === "increase") item.quantity += 1;
  if (actionButton.dataset.action === "decrease") item.quantity -= 1;
  if (actionButton.dataset.action === "remove" || item.quantity <= 0) {
    order.splice(order.indexOf(item), 1);
  }

  renderOrder();
});

discountSelect.addEventListener("change", () => {
  selectedDiscountRate = Number(discountSelect.value);
  renderOrder();
});

function getOrderCalculation() {
  const subtotal = order.reduce((total, item) => total + item.price * item.quantity, 0);
  const discountAmount = subtotal * selectedDiscountRate;
  const discountedSubtotal = subtotal - discountAmount;
  const vatAmount = discountedSubtotal * VAT_RATE;

  return {
    subtotal,
    discountRate: selectedDiscountRate,
    discountAmount,
    vatAmount,
    finalTotal: discountedSubtotal + vatAmount,
  };
}

function updateProductVisibility() {
  const searchTerm = productSearch.value.trim().toLowerCase();
  let visibleProducts = 0;

  productCards.forEach((card) => {
    const matchesCategory = selectedCategory === "all" || card.dataset.category === selectedCategory;
    const matchesSearch = card.dataset.product.toLowerCase().includes(searchTerm);
    const isVisible = matchesCategory && matchesSearch;
    card.hidden = !isVisible;
    if (isVisible) visibleProducts += 1;
  });

  productEmpty.classList.toggle("is-hidden", visibleProducts !== 0);
}

function renderOrder() {
  const count = order.reduce((total, item) => total + item.quantity, 0);
  const calculation = getOrderCalculation();
  itemCount.textContent = count;
  orderSummary.textContent = count ? `${count} item${count === 1 ? "" : "s"} selected` : "No items selected";
  orderTotal.textContent = formatPrice(calculation.finalTotal);
  cartCalculation.innerHTML = renderCalculationLines(calculation);
  continueSummaryButton.disabled = count === 0;

  cartItems.innerHTML = order.length
    ? order.map((item) => `
      <article class="cart-item">
        <div class="cart-item-info">
          <strong>${item.name}</strong>
          <span>${formatPrice(item.price)} each · Subtotal ${formatPrice(item.price * item.quantity)}</span>
        </div>
        <div class="quantity-controls" aria-label="${item.name} quantity controls">
          <button type="button" data-action="decrease" data-product="${item.name}" aria-label="Decrease ${item.name} quantity">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-action="increase" data-product="${item.name}" aria-label="Increase ${item.name} quantity">+</button>
          <button class="remove-button" type="button" data-action="remove" data-product="${item.name}">Remove</button>
        </div>
      </article>`).join("")
    : '<p class="empty-cart">Your selected items will appear here.</p>';
}

continueSummaryButton.addEventListener("click", () => {
  renderSummary();
  selectionScreen.classList.add("is-hidden");
  summaryScreen.classList.remove("is-hidden");
  orderBar.classList.add("is-hidden");
  window.scrollTo(0, 0);
});

backButton.addEventListener("click", () => {
  summaryScreen.classList.add("is-hidden");
  selectionScreen.classList.remove("is-hidden");
  orderBar.classList.remove("is-hidden");
  window.scrollTo(0, 0);
});

paymentButton.addEventListener("click", () => {
  renderPaymentTotals();
  summaryScreen.classList.add("is-hidden");
  paymentScreen.classList.remove("is-hidden");
  window.scrollTo(0, 0);
});

paymentBackButton.addEventListener("click", () => {
  paymentScreen.classList.add("is-hidden");
  summaryScreen.classList.remove("is-hidden");
  window.scrollTo(0, 0);
});

paymentOptions.addEventListener("click", (event) => {
  const option = event.target.closest("[data-method]");
  if (!option) return;

  paymentPanels.forEach((panel) => panel.classList.add("is-hidden"));
  paymentSuccess.classList.add("is-hidden");
  cashMessage.textContent = "";
  amountPaid.value = "";
  document.querySelector(`#${option.dataset.method}-panel`).classList.remove("is-hidden");
});

cashPayButton.addEventListener("click", () => {
  const paid = Number(amountPaid.value);
  const total = getOrderCalculation().finalTotal;

  if (amountPaid.validity.badInput) {
    cashMessage.textContent = "Enter a valid numeric payment amount.";
    return;
  }
  if (amountPaid.value.trim() === "") {
    cashMessage.textContent = "Enter the amount received to continue.";
    return;
  }
  if (!Number.isFinite(paid) || paid < 0) {
    cashMessage.textContent = "Enter a valid payment amount of zero or more.";
    return;
  }
  if (paid < total) {
    cashMessage.textContent = `Insufficient payment. Please provide at least ${formatPrice(total)}.`;
    return;
  }

  showPaymentSuccess("Cash", paid - total, paid);
});

qrConfirmButton.addEventListener("click", () => showPaymentSuccess("QR payment", 0));

cardProcessButton.addEventListener("click", () => {
  cardProcessButton.textContent = "Processing…";
  cardProcessButton.disabled = true;
  window.setTimeout(() => {
    cardProcessButton.textContent = "Process Payment";
    cardProcessButton.disabled = false;
    showPaymentSuccess("Card payment", 0);
  }, 700);
});

openHistoryButton.addEventListener("click", () => {
  selectionScreen.classList.add("is-hidden");
  summaryScreen.classList.add("is-hidden");
  paymentScreen.classList.add("is-hidden");
  receiptScreen.classList.add("is-hidden");
  orderBar.classList.add("is-hidden");
  historyScreen.classList.remove("is-hidden");
  historyConfirmation.classList.add("is-hidden");
  renderHistory();
  window.scrollTo(0, 0);
});

historyBackButton.addEventListener("click", () => {
  historyScreen.classList.add("is-hidden");
  selectionScreen.classList.remove("is-hidden");
  orderBar.classList.remove("is-hidden");
  window.scrollTo(0, 0);
});

clearHistoryButton.addEventListener("click", () => {
  historyConfirmation.classList.remove("is-hidden");
});

cancelClearButton.addEventListener("click", () => {
  historyConfirmation.classList.add("is-hidden");
});

confirmClearButton.addEventListener("click", () => {
  transactionHistory = [];
  localStorage.removeItem(HISTORY_STORAGE_KEY);
  historyConfirmation.classList.add("is-hidden");
  renderHistory();
});

viewReceiptButton.addEventListener("click", () => {
  renderReceipt();
  paymentScreen.classList.add("is-hidden");
  receiptScreen.classList.remove("is-hidden");
  window.scrollTo(0, 0);
});

newTransactionButton.addEventListener("click", () => {
  order.splice(0, order.length);
  completedTransaction = null;
  selectedDiscountRate = 0;
  discountSelect.value = "0";
  renderOrder();
  resetPaymentAndReceipt();
  receiptScreen.classList.add("is-hidden");
  selectionScreen.classList.remove("is-hidden");
  orderBar.classList.remove("is-hidden");
  window.scrollTo(0, 0);
});

function renderSummary() {
  summaryItems.innerHTML = order.map((item) => `
    <div class="summary-row">
      <strong>${item.name}</strong>
      <span>${item.quantity}</span>
      <span>${formatPrice(item.price)}</span>
      <strong>${formatPrice(item.price * item.quantity)}</strong>
    </div>`).join("");
  const calculation = getOrderCalculation();
  summaryCalculation.innerHTML = renderCalculationLines(calculation);
  summaryTotal.textContent = formatPrice(calculation.finalTotal);
}

function renderPaymentTotals() {
  const calculation = getOrderCalculation();
  const total = formatPrice(calculation.finalTotal);
  paymentTotal.textContent = total;
  cashTotal.textContent = total;
  qrTotal.textContent = total;
  cardTotal.textContent = total;
  paymentBreakdowns.forEach((breakdown) => {
    breakdown.innerHTML = renderCalculationLines(calculation);
  });
}

function showPaymentSuccess(method, change, paid = getOrderCalculation().finalTotal) {
  transactionCounter += 1;
  const calculation = getOrderCalculation();
  completedTransaction = {
    number: `TXN-${String(transactionCounter).padStart(3, "0")}`,
    date: new Date().toISOString(),
    items: order.map((item) => ({ ...item })),
    calculation,
    total: calculation.finalTotal,
    method,
    paid,
    change,
  };
  transactionHistory.unshift(completedTransaction);
  saveTransactionHistory();
  paymentPanels.forEach((panel) => panel.classList.add("is-hidden"));
  paymentSuccess.classList.remove("is-hidden");
  confirmationBreakdown.innerHTML = renderCalculationLines(calculation);
  confirmationTotal.textContent = formatPrice(completedTransaction.total);
  confirmationPaid.textContent = formatPrice(paid);
  confirmationMethod.textContent = method;
  confirmationNumber.textContent = completedTransaction.number;
}

function renderReceipt() {
  if (!completedTransaction) return;

  receiptDate.textContent = new Date(completedTransaction.date).toLocaleString();
  receiptNumber.textContent = completedTransaction.number;
  receiptItems.innerHTML = completedTransaction.items.map((item) => `
    <div class="receipt-item">
      <div><strong>${item.name}</strong><span>Qty ${item.quantity} × ${formatPrice(item.price)}</span></div>
      <strong>${formatPrice(item.price * item.quantity)}</strong>
    </div>`).join("");
  receiptCalculation.innerHTML = renderCalculationLines(completedTransaction.calculation);
  receiptTotal.textContent = formatPrice(completedTransaction.total);
  receiptMethod.textContent = completedTransaction.method;
  receiptPaid.textContent = formatPrice(completedTransaction.paid);
  receiptChange.textContent = formatPrice(completedTransaction.change);
}

function renderCalculationLines(calculation) {
  const percentage = Math.round(calculation.discountRate * 100);

  return `
    <p><span>Subtotal</span><strong>${formatPrice(calculation.subtotal)}</strong></p>
    <p><span>${discountOptions[calculation.discountRate]} (${percentage}%)</span><strong>−${formatPrice(calculation.discountAmount)}</strong></p>
    <p><span>VAT (12%)</span><strong>${formatPrice(calculation.vatAmount)}</strong></p>`;
}

function resetPaymentAndReceipt() {
  amountPaid.value = "";
  cashMessage.textContent = "";
  cardProcessButton.textContent = "Process Payment";
  cardProcessButton.disabled = false;
  paymentSuccess.classList.add("is-hidden");
  paymentPanels.forEach((panel) => panel.classList.add("is-hidden"));
  confirmationTotal.textContent = formatPrice(0);
  confirmationPaid.textContent = formatPrice(0);
  confirmationMethod.textContent = "—";
  confirmationNumber.textContent = "—";
  confirmationBreakdown.innerHTML = renderCalculationLines(getOrderCalculation());
  receiptDate.textContent = "";
  receiptNumber.textContent = "";
  receiptItems.innerHTML = "";
  receiptCalculation.innerHTML = renderCalculationLines(getOrderCalculation());
  receiptTotal.textContent = formatPrice(0);
  receiptMethod.textContent = "—";
  receiptPaid.textContent = formatPrice(0);
  receiptChange.textContent = formatPrice(0);
}

function loadTransactionHistory() {
  try {
    const savedHistory = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY));
    return Array.isArray(savedHistory) ? savedHistory : [];
  } catch {
    return [];
  }
}

function saveTransactionHistory() {
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(transactionHistory));
}

function getLatestTransactionNumber(history) {
  return history.reduce((latest, transaction) => {
    const value = Number(transaction.number?.replace("TXN-", ""));
    return Number.isFinite(value) ? Math.max(latest, value) : latest;
  }, 0);
}

function renderHistory() {
  const salesByMethod = transactionHistory.reduce((sales, transaction) => {
    const total = Number(transaction.total) || 0;
    sales.total += total;
    if (transaction.method === "Cash") sales.cash += total;
    if (transaction.method === "QR payment") sales.qr += total;
    if (transaction.method === "Card payment") sales.card += total;
    return sales;
  }, { total: 0, cash: 0, qr: 0, card: 0 });

  reportCount.textContent = transactionHistory.length;
  reportSales.textContent = formatPrice(salesByMethod.total);
  reportCash.textContent = formatPrice(salesByMethod.cash);
  reportQr.textContent = formatPrice(salesByMethod.qr);
  reportCard.textContent = formatPrice(salesByMethod.card);

  historyList.innerHTML = transactionHistory.length
    ? transactionHistory.map((transaction) => `
      <article class="history-item">
        <div class="history-item-header">
          <div><p class="eyebrow">${transaction.number}</p><h3>${formatPrice(transaction.total)}</h3></div>
          <time datetime="${transaction.date}">${new Date(transaction.date).toLocaleString()}</time>
        </div>
        <p class="history-items">${transaction.items.map((item) => `${item.quantity} × ${item.name}`).join(", ")}</p>
        <p class="history-method">${transaction.method}</p>
      </article>`).join("")
    : '<p class="empty-history">No completed transactions yet.</p>';
}

renderOrder();
