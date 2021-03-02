//*** Criando uma aplicação em js puro, para controle de despesas armazenando dados no localstorage ***//

//obtendo a referencia das UL a ser preenchida
const transactionsUL = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')


//criando local storage
//transformando em array com JSON
const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))
let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : []

//remover a transação clicando no X
// cria um novo array com todos os itens da lista, exceto o que foi clicado no X(remover)
const removeTransaction = ID => {
    transactions = transactions.filter(transaction =>
        transaction.id !== ID)
    updateLocalStorage()
    init()
}


//adicionar elas no DOM, para que a lista de transações (ul vazia por enquanto) seja preenchida criando uma função para adiciona-las
//criando uma função gerando uma <li> com os dados da transação para ser adicionada ao DOM
const addTransactionIntoDOM = transaction => {
    //identificar se é um valor negativo ou positivo
    const operator = transaction.amount < 0 ? '-' : '+'
    const CSSClass = transaction.amount < 0 ? 'minus' : 'plus'
    const amountWithoutOperator = Math.abs(transaction.amount) // para simplificar a interpolação na li 
    const li = document.createElement('li') // afirmando que o que será criado sera uma <li>

    //usando a CSSClass para identificar o operator, com metodo add
    li.classList.add(CSSClass)
    //innerHTML para substituir quando a função for usada
    li.innerHTML = `
        ${transaction.name} 
        <span>${operator} R$ ${amountWithoutOperator}</span>
        <button class="delete-btn" onClick="removeTransaction(${transaction.id})">
        x
        </button>
    `
    transactionsUL.append(li)
}

const updateBalanceValues = () => {
    //map para buscar apenas o transaction.amount
    const transactionsAmount = transactions.map(transaction => transaction.amount)
    //usando reduce para transformar o array em um unico número
    //accumulator recebe o parametro amount e calcula com o valor transaction, em loop até nao haver mais accumulator atribuindo para total
    // toFixed() para acrescentar o valor decimal, no caso dois
    const total = transactionsAmount
        .reduce((accumulator, transaction) => accumulator + transaction, 0)
        .toFixed(2)
    //filter para criar um array com valores positivos e soma-los
    const income = transactionsAmount
        .filter(value => value > 0)
        .reduce((accumulator, value) => accumulator + value, 0)
        .toFixed(2)
    // receber um array só com as despesas das transaçoes
    const expense = Math.abs(transactionsAmount
        .filter(value => value < 0)
        .reduce((accumulator, value) => accumulator + value, 0))
        .toFixed(2)

    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`
}

//criando um loop que vai iterar por cada transação
const init = () => {
    //limpando a UL para evitar que envie informaçoes duplicadas
    transactionsUL.innerHTML = ''
    transactions.forEach(addTransactionIntoDOM)
    updateBalanceValues()
}
init()

//adicionando as infos no localstorage
const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

//adicionando ID aleatórios
const generateID = () => Math.round(Math.random() * 1000)

//inserir um listener de eventos no form
form.addEventListener('submit', event => {
    event.preventDefault() // para não enviar o listener

    //guardando os dados inseridos
    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()

    if (transactionName === '' || transactionAmount === '') {
        alert('Por favor, preencha TODOS os campos corretamente')
        return
    }

    const transaction = {
        id: generateID(),
        name: transactionName,
        amount: Number(transactionAmount) //para transformar a string gerada em numero, para que o toFixed() funcionar corretamente
    }
    //inserindo o objeto em dummy transactions
    transactions.push(transaction)
    init()
    updateLocalStorage()

    //limpando dados
    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
})