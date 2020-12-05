const BigNumber = require('bignumber.js');
const SonicxWeb = require('sonicxweb');

const gPrivateKey = 'D8B708BFFFA424473D83349CF4C6A2395E4436E065B60F0BF31E582281256D1C';

const sonicxWeb = new SonicxWeb({
    fullNode: 'https://fullnode.sonicxhub.com',
    solidityNode: 'https://solnode.sonicxhub.com',
    eventServer: 'https://event.sonicxhub.com/',
    privateKey: gPrivateKey,
  }
)

// testnet
// const sonicxWeb = new SonicxWeb({
//     fullNode: 'https://fullnode-testnet.sonicxhub.com',
//     solidityNode: 'https://solnode-testnet.sonicxhub.com',
//     eventServer: 'https://event-testnet.sonicxhub.com/',
//     // fullNode: 'http://159.65.72.162:8290/',
//     // solidityNode: 'http://159.65.72.162:8291/',
//     // eventServer: 'http://159.65.72.162:8080/',
//     privateKey: gPrivateKey,
//   }
// )

var contractData = require('./build/contracts/Multicall.json');

getContract = (contractAddress) => {
    const contractHexAddress = sonicxWeb.address.toHex(contractAddress);
    return sonicxWeb.contract(contractData.abi, contractHexAddress);
}

aggregate = async (contract, targets, callData) => {
    try {
        const res = await contract.aggregate(targets, callData).send({
            shouldPollResponse: true,
            keepTxID: true,
            callValue: 0
        });
        return res;
    } catch (err) {
        console.log(err);
        return null;
    }
}

getSoxBalance = async (contract, address) => {
    try {
        const res = await contract.getSoxBalance(address).call();
        const balance = new BigNumber(res.balance);
        return balance.shiftedBy(-6);
    } catch (err) {
        console.log(err);
        return 0;
    }
}

getBlockHash = async (contract, blockNum) => {
    try {
        const res = await contract.getBlockHash(blockNum).call();
        return res.blockHash;
    } catch (err) {
        console.log(err);
        return 0;
    }
}

getLastBlockHash = async (contract) => {
    try {
        const res = await contract.getLastBlockHash().call();
        return res.blockHash;
    } catch (err) {
        console.log(err);
        return 0;
    }
}

getCurrentBlockTimestamp = async (contract) => {
    try {
        const res = await contract.getCurrentBlockTimestamp().call();
        return res.timestamp;
    } catch (err) {
        console.log(err);
        return 0;
    }
}

startEventListener = async () => {
    const contractAddress = "SUDbs2u6XcHCMbmpecpr9J3kgRYJ6sEST2";
    const contract = getContract(contractAddress)
    
    const method = contract.methodInstances['getSoxBalance'];
    const callData = '0x' + method.signature + '000000000000000000000000d74f25ff2a1933bd2b7640f254ce6d49a383beeb';
    const res = await aggregate(contract, [contractAddress], [callData])
    console.log('aggregate=', res);

    const address = 'SSvBmw49kzdsj5JJA3sQwPxXcGJyfed7Vr';
    const soxBalance = await getSoxBalance(contract, address)
    console.log('soxBalance=', soxBalance.toNumber());

    const blockNum = 5730376;
    const blockHash = await getBlockHash(contract, blockNum)
    console.log('blockHash=', blockHash);

    const lastBlockHash = await getLastBlockHash(contract)
    console.log('lastBlockHash=', lastBlockHash);

    const currentBlockTimestamp = await getCurrentBlockTimestamp(contract)
    console.log('currentBlockTimestamp=', currentBlockTimestamp.toNumber());
}
startEventListener();
