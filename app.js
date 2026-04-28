// 1. Récupération des éléments de l'interface
const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const convertBtn = document.getElementById("convert-btn");
const resultSpan = document.getElementById("result");

const API_URL = "https://api.exchangerate-api.com/v4/latest/";

async function convertCurrency() {
  const amount = amountInput.value;
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (amount === "" || isNaN(amount)) {
    alert("Veuillez entrer un montant valide.");
    return;
  }

  try {
    convertBtn.textContent = "Calcul en cours...";
    convertBtn.disabled = true;

    const response = await fetch(`${API_URL}${from}`);
    const data = await response.json();

    const rate = data.rates[to];
    const convertedAmount = (amount * rate).toFixed(2);

    resultSpan.textContent = convertedAmount;
  } catch (error) {
    console.error("Erreur lors de la récupération des taux:", error);
    resultSpan.textContent = "Erreur réseau";
  } finally {
    convertBtn.textContent = "Convertir";
    convertBtn.disabled = false;
  }
}

convertBtn.addEventListener("click", convertCurrency);

// --- Enregistrement du Service Worker ---
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log(
          "Service Worker enregistré avec succès :",
          registration.scope,
        );
      })
      .catch((error) => {
        console.log("Échec de l'enregistrement du Service Worker :", error);
      });
  });
}
