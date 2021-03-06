let {default: Neon, api, nep5, rpc, sc, wallet} = require('@cityofzion/neon-js');

let config = require('./config.js');
let account = Neon.create.account('KxDgvEKzgSBPPfuVfw67oPQBSjidEiqTHURKSDL1R7yGaGYAeYnr');
let realAddress = sc.ContractParam.byteArray(account.address, 'address');

function callSmartContract(operation, args) {
    let hash = config.scriptHash;
    let networkUrl = 'http://192.168.99.100:30333';
    let neoscanUrl = 'http://192.168.99.100:4000/api/main_net';

    let script = Neon.create.script(
        {
            scriptHash: hash,
            operation: operation,
            args: args
        }
    );

    let request = {
        net: neoscanUrl,
        url: networkUrl,
        script,
        account: account,
        address: account.address,
        privateKey: account.privateKey,
        publicKey: account.publicKey,
        gas: 0,
        balance: null
    };

    /*   rpc.Query.invokeScript(script)
     .execute(networkUrl)
     .then(res => {
     util.inspect(res.result.stack) // You should get a result with state: "HALT, BREAK"
     })*/

    return api.neoscan.getBalance(neoscanUrl, account.address).then(data => {
        request.balance = data;
        console.log('Invocation of: ' + operation);
        console.log('Args: ', args);
        return Neon.doInvoke(request);
    });
}

// let otherAddress = sc.ContractParam.byteArray('ASP3X76d9JunQosUds3npubiDsSpm3RMXF', 'address')
// callSmartContract('mintToken',
//     [Neon.u.str2hexstring('properties'),
//         "11111111111111",
//         otherAddress.value
//     ]);


module.exports = {
    sc,
    invoke: (...args) => {
        if(config.hardcoded) {
            return Promise.resolve({response: {txid: config.txSample}});
        }
        return callSmartContract.apply(null, args);
    }
};
