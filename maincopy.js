const Modal = {
    open(){
        document
        .querySelector('.modal-overlay')
        .classList
        .add('active');
    },
    close(){
        document
        .querySelector('.modal-overlay')
        .classList
        .remove('active');
    }
}
const Storage = {
    get(){ 
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) ||
        []
    },
    set(transactions){
        localStorage.setItem("dev.finances:transactions", JSON.stringify
        (transactions))
    }
}

const Transaction = {

    all: Storage.get(),

    incomes(){
        //somar as entradas
        let income = 0
        Transaction.all.forEach((transaction)=>{
            if(transaction.amount>0){
               income+= transaction.amount
            }
        })

        return income  
    },
    expenses(){
        //somar as saídas
        let expense = 0
        Transaction.all.forEach((transaction)=>{
            if(transaction.amount<0){
               expense+= transaction.amount
            }
        })

        return expense 
    },
    total(){
        //entradas - saídas
        return this.incomes() + this.expenses()   
    },
    add(transaction){
       Transaction.all.push(transaction)
       Modal.close()  
       App.reload()  
      
    },
    remove(indexTransaction){
        Transaction.all.splice(indexTransaction,1)
        App.reload()  
    }
}
const DOM = {
    balanceLoad(){
        document.getElementById('valor_entrada').innerHTML = Utils.formatCurrency(Transaction.incomes()) 
        document.getElementById('valor_saida').innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.getElementById('valor_total').innerHTML = Utils.formatCurrency(Transaction.total())
    },
    TransactionsLoad (){
        document.querySelector('.transactions').innerHTML = '';
    
        Transaction.all.forEach((value, index) =>{  
            const amount = Utils.formatCurrency(value.amount)
            const CSSclass = value.amount > 0 ? "income" : "expense"
    
            document
            .querySelector('.transactions')
            .innerHTML +=
            
            `<tr>
                    <td>${value.description}</td>
                    <td class="${CSSclass}">${amount}</td>
                    <td>${value.date}</td>
                    <td><img onclick='Transaction.remove(${index})' src='./assets/minus.svg' alt=''></td>
             </tr>`    
        })
    }
}
const Utils ={
    formatCurrency(value){
        const signal = Number(value) < 0 ? '-' : ''

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })
        return signal + value
    },
    formatAmount(value){
        value = Number(value) * 100
        return value
    },
    formatDate(date){
        const splittedDate = date.split("-")
       
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    }
}
const Form = {
    description: document.querySelector('#description'),
    amount: document.querySelector('#amount'),
    date: document.querySelector('#date'),

    getValues(){
        return{ 
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    formatValues(){
        let {description, amount, date} = Form.getValues()

        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date}


    },
    validadeFields(){
        const {description, amount, date} = Form.getValues()
        
        if( description.trim() === "" || 
            amount.trim() === "" || 
            date.trim() === ""){
                throw new Error("Por favor, preencha todos os campos")
            }
    },
    clearFields(){
        Form.description.value =  ''
        Form.amount.value =  ''
        Form.date.value =  ''
    },
    submit(event){
        event.preventDefault()
        
        try {
         Form.validadeFields()
         const transaction = Form.formatValues()
         Transaction.add(transaction)
         Form.clearFields()
            
        } catch (error) {
            alert(error.message)
        }
    }
}

const App = {
    init(){
        DOM.TransactionsLoad();
        DOM.balanceLoad();

        Storage.set(Transaction.all)
    },
    reload( ){
        App.init()
    }
}



App.init();












