const web3 = new (require('web3'))("https://data-seed-prebsc-1-s1.binance.org:8545");
const fs = require('fs').promises;

const self = {
    contract: null,

    async loadContract() {
        const contractData = await fs.readFile(process.env.CONTRACT_PATH, 'utf8')
        self.contract = new web3.eth.Contract(JSON.parse(contractData), process.env.CONTRACT_ADDRESS);
        // console.log(await self.contract.methods.balanceOf("0xa9332938Ea0Bc445256962801d1343c88576B3Cd").call());
        console.log("Connected to contract");
    },

    async getBalance(publicAddr) {
        return web3.utils.fromWei(await self.contract.methods.balanceOf(publicAddr).call(),"kwei");
    },

    async transfer(fromPrivateAddr, toPublicAddr, amount) {
        const from = web3.eth.accounts.privateKeyToAccount(fromPrivateAddr);

        console.log('Initial sender balance: ' + web3.utils.fromWei(await self.contract.methods.balanceOf(from.address).call(),"kwei"));
        console.log('Initial receiver balance: ' + web3.utils.fromWei(await self.contract.methods.balanceOf(toPublicAddr).call(),"kwei"));

        const data = self.contract.methods.transfer(toPublicAddr, web3.utils.toWei(amount.toString(), "kwei")).encodeABI();

        const transaction = await from.signTransaction(
            {
                nonce: await web3.eth.getTransactionCount(from.address),
                to: self.contract._address,
                gas: 300000,
                gasPrice: web3.eth.getGasPrice(),
                data: data
            },
        );

        console.log(transaction);

        const createReceipt = await web3.eth.sendSignedTransaction(transaction.rawTransaction);

        console.log("Transaction successful with hash: " + createReceipt.transactionHash);
        console.log('New sender balance: ' + web3.utils.fromWei(await self.contract.methods.balanceOf(from.address).call(),"kwei"));
        console.log('New receiver balance: ' + web3.utils.fromWei(await self.contract.methods.balanceOf(toPublicAddr).call(),"kwei"));

        return createReceipt.transactionHash;
    },

    async fund(receiverPublicAddr, amount) {
        return await self.transfer(process.env.SERVER_TOKEN_PRIVATE_KEY, receiverPublicAddr, amount);
    }
};

module.exports = self;
