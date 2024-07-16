myApp.service('TransactionService', function() {
    var transactionData = {};

    function setTransactionData(data) {
        transactionData = data;
    }

    function getTransactionData() {
        return transactionData;
    }

    return {
        setTransactionData: setTransactionData,
        getTransactionData: getTransactionData
    };
});
