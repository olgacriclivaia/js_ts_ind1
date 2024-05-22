// Предполагается, что transactions.json уже загружен и содержит данные о транзакциях
const transactions = require('./transactions.json');

class TransactionAnalyzer {
    constructor(transactions) {
        this.transactions = transactions;
    }

    addTransaction(transaction) {
        this.transactions.push(transaction);
    }

    getAllTransactions() {
        return this.transactions;
    }

    getUniqueTransactionTypes() {
        const types = new Set();
        this.transactions.forEach(transaction => types.add(transaction.transaction_type));
        return Array.from(types);
    }

    calculateTotalAmount() {
        return this.transactions.reduce((total, transaction) => total + parseFloat(transaction.transaction_amount), 0);
    }

    calculateTotalAmountByDate(year, month, day) {
        return this.transactions.reduce((total, transaction) => {
            const transactionDate = new Date(transaction.transaction_date);
            if ((!year || transactionDate.getFullYear() === year) &&
                (!month || transactionDate.getMonth() + 1 === month) &&
                (!day || transactionDate.getDate() === day)) {
                return total + parseFloat(transaction.transaction_amount);
            } else {
                return total;
            }
        }, 0);
    }

    getTransactionsByType(type) {
        return this.transactions.filter(transaction => transaction.transaction_type === type);
    }

    getTransactionsInDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return this.transactions.filter(transaction => {
            const transactionDate = new Date(transaction.transaction_date);
            return transactionDate >= start && transactionDate <= end;
        });
    }

    getTransactionsByMerchant(merchantName) {
        return this.transactions.filter(transaction => transaction.merchant_name === merchantName);
    }

    calculateAverageTransactionAmount() {
        const totalAmount = this.calculateTotalAmount();
        return totalAmount / this.transactions.length;
    }

    getTransactionsByAmountRange(minAmount, maxAmount) {
        return this.transactions.filter(transaction => {
            const amount = parseFloat(transaction.transaction_amount);
            return amount >= minAmount && amount <= maxAmount;
        });
    }

    calculateTotalDebitAmount() {
        const debitTransactions = this.getTransactionsByType('debit');
        return this.calculateTotalAmountForTransactions(debitTransactions);
    }

    calculateTotalAmountForTransactions(transactions) {
        return transactions.reduce((total, transaction) => total + parseFloat(transaction.transaction_amount), 0);
    }

    findMostTransactionsMonth() {
        const months = {};
        this.transactions.forEach(transaction => {
            const month = new Date(transaction.transaction_date).getMonth() + 1;
            months[month] = (months[month] || 0) + 1;
        });
        return Object.keys(months).reduce((a, b) => months[a] > months[b] ? a : b);
    }

    findMostDebitTransactionMonth() {
        const debitTransactions = this.getTransactionsByType('debit');
        const months = {};
        debitTransactions.forEach(transaction => {
            const month = new Date(transaction.transaction_date).getMonth() + 1;
            months[month] = (months[month] || 0) + 1;
        });
        return Object.keys(months).reduce((a, b) => months[a] > months[b] ? a : b);
    }

    mostTransactionTypes() {
        const debitTransactions = this.getTransactionsByType('debit');
        const creditTransactions = this.getTransactionsByType('credit');
        if (debitTransactions.length > creditTransactions.length) {
            return 'debit';
        } else if (creditTransactions.length > debitTransactions.length) {
            return 'credit';
        } else {
            return 'equal';
        }
    }

    getTransactionsBeforeDate(date) {
        const targetDate = new Date(date);
        return this.transactions.filter(transaction => new Date(transaction.transaction_date) < targetDate);
    }

    findTransactionById(id) {
        return this.transactions.find(transaction => transaction.transaction_id === id);
    }

    mapTransactionDescriptions() {
        return this.transactions.map(transaction => transaction.transaction_description);
    }
}

// Создание экземпляра класса и пример использования
const analyzer = new TransactionAnalyzer(transactions);

console.log("Уникальные типы транзакций:", analyzer.getUniqueTransactionTypes());
console.log("Общая сумма всех транзакций:", analyzer.calculateTotalAmount());
console.log("Общая сумма транзакций за указанную дату:", analyzer.calculateTotalAmountByDate(2019, 1, 1));
console.log("Транзакции типа 'debit':", analyzer.getTransactionsByType('debit'));
console.log("Транзакции в диапазоне дат:", analyzer.getTransactionsInDateRange('2019-01-01', '2019-01-10'));
console.log("Транзакции для определенного мерчанта:", analyzer.getTransactionsByMerchant('SuperMart'));
console.log("Средняя сумма транзакций:", analyzer.calculateAverageTransactionAmount());
console.log("Транзакции в диапазоне сумм:", analyzer.getTransactionsByAmountRange(50, 150));
console.log("Общая сумма дебетовых транзакций:", analyzer.calculateTotalDebitAmount());
console.log("Месяц с наибольшим количеством транзакций:", analyzer.findMostTransactionsMonth());
console.log("Месяц с наибольшим количеством дебетовых транзакций:", analyzer.findMostDebitTransactionMonth());
console.log("Тип транзакций с наибольшим количеством:", analyzer.mostTransactionTypes());
console.log("Транзакции до определенной даты:", analyzer.getTransactionsBeforeDate('2019-01-02'));
console.log("Транзакция с определенным ID:", analyzer.findTransactionById('1'));
console.log("Описания транзакций:", analyzer.mapTransactionDescriptions());