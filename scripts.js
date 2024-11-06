const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

const expenseList = document.querySelector("ul");
const expensesTotal = document.querySelector("aside header h2");
const expensesQuantity = document.querySelector("aside header p span");

amount.oninput = () => {
  let value = amount.value.replace(/\D/g, "");

  value = Number(value) / 100;

  amount.value = formatCurrencyBRL(value);
};

function formatCurrencyBRL(value) {
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return value;
}

form.onsubmit = (e) => {
  e.preventDefault();

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  };
  expenseAdd(newExpense);
};

//Adiciona um novo itemna lista
function expenseAdd(newExpense) {
  try {
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);

    // Info da despesa.
    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    // Nome da despesa.
    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;

    //Categoria da despesa.
    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    //Add nome e categoria na div das infos. da despesa.
    expenseInfo.append(expenseName, expenseCategory);

    // Cria o valor da despesa.
    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`;

    //Cria ícone de remover
    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");
    removeIcon.setAttribute("src", "img/remove.svg");
    removeIcon.setAttribute("alt", "remover");

    //Add infos no item.
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount);

    //Add o item na lista.
    expenseList.append(expenseItem);

    // Limpa o formulário para add novo item
    formClear();

    //Atualiza os totais.
    updateTotals();
  } catch (error) {
    alert("Não foi possível atualizar a lista de despesas.");
  }
}

//Atualiza os totais
function updateTotals() {
  try {
    // Recupera todos os itens (li) da lista
    const items = expenseList.children;

    //Atualiza a quantidade de items na lista.
    expensesQuantity.textContent = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    }`;

    //Variável para incrementar o total.
    let total = 0;
    //Percorre cada item (li) da lista.
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount");

      //Remover caracteres não numéricos e substitui a vírgula pelo ponto.
      let value = itemAmount.textContent
        .replace(/[^\d,]/g, "")
        .replace(",", ".");

      //Converte para float
      value = parseFloat(value);

      //Verificar se é um número válido.
      if (isNaN(value)) {
        return alert(
          "Não foi possível calcular o total. Ovalor não parece ser um número."
        );
      }

      //Incrementar o valor total.
      total += Number(value);
    }

    //Cria span para adicionar R$ formatado.
    const symbolBRL = document.createElement("small");
    symbolBRL.textContent = "R$";

    // Formata o valor e remove o R$ QUE SERÁ EXIBIDO PELO SMALL COM UM ESITLO
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "");

    // Limpa o conteúdo do elemento
    expensesTotal.innerHTML = "";

    // Adiciona o símbolo da moeda e o valor total formatado
    expensesTotal.append(symbolBRL, total);
  } catch (error) {
    alert("Não foi possível atualizar os totais.");
  }
}

// Evento que captura o clique no items da lista.
expenseList.addEventListener("click", function (event) {
  //Verifica se o elemento clicado é o ícone de remover.
  if (event.target.classList.contains("remove-icon")) {
    //Obtém a li pai do elemento clicado.
    const item = event.target.closest(".expense");
    //Remove o item da lista.
    item.remove();
  }
  //atualiza os totais
  updateTotals();
});

function formClear() {
  expense.value = "";
  category.value = "";
  amount.value = "";

  expense.focus();
}
