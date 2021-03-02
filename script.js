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
const addTransactionIntoDOM = ({ amount, name, id})=> {
    //identificar se é um valor negativo ou positivo
    const operator = amount < 0 ? '-' : '+'
    const CSSClass = amount < 0 ? 'minus' : 'plus'
    const amountWithoutOperator = Math.abs(amount) // para simplificar a interpolação na li 
    const li = document.createElement('li') // afirmando que o que será criado sera uma <li>

    //usando a CSSClass para identificar o operator, com metodo add
    li.classList.add(CSSClass)
    //innerHTML para substituir quando a função for usada
    li.innerHTML = `
        ${name} 
        <span>${operator} R$ ${amountWithoutOperator}</span>
        <button class="delete-btn" onClick="removeTransaction(${id})">x</button>
    `
    transactionsUL.append(li)
}

// receber um array só com as despesas das transaçoes
const getExpenses = transactionsAmount => Math.abs(transactionsAmount
    .filter(value => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0))
    .toFixed(2)

//filter para criar um array com valores positivos e soma-los
const getIncome = transactionsAmount => transactionsAmount
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2)

//usando reduce para transformar o array em um unico número
//accumulator recebe o parametro amount e calcula com o valor transaction, em loop até nao haver mais accumulator atribuindo para total
// toFixed() para acrescentar o valor decimal, no caso dois
const getTotal = transactionsAmount => transactionsAmount
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2)

const updateBalanceValues = () => {
    //map para buscar apenas o transaction.amount
    //feito destructing
    const transactionsAmount = transactions.map(({ amount }) => amount)
    const total = getTotal(transactionsAmount)
    const income = getIncome(transactionsAmount)
    const expense = getExpenses(transactionsAmount)

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

//montando o array a ser preenchido
const addToTransactionsArray = (transactionName, transactionAmount) => {
    transactions.push({
        id: generateID(),
        name: transactionName,
        amount: Number(transactionAmount) //para transformar a string gerada em numero, para que o toFixed() funcionar corretamente
    })
}

//limpando dados
const cleanInputs = () => {
    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
}

const handleFormSubmit = event => {
    event.preventDefault() // para não enviar o listener

    //guardando os dados inseridos
    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()
    const isSomeInputEmpty = transactionName === '' || transactionAmount === ''

    if (isSomeInputEmpty) {
        alert('Por favor, preencha TODOS os campos corretamente')
        return
    }

    addToTransactionsArray(transactionName, transactionAmount)
    init()
    updateLocalStorage()
    cleanInputs() 
}

//inserir um listener de eventos no form
form.addEventListener('submit', handleFormSubmit)