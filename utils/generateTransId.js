function generateTransId () {
    let transaction_id;
    const timestamp = new Date().getTime().toString()
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    transaction_id =  timestamp + randomNumber
    transaction_id = randomChars(transaction_id)
    return transaction_id
}

module.exports = generateTransId