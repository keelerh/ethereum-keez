/**
 * Dependencies
 */
const { JWD } = require('@trust/jose')
const keyto = require('@trust/keyto')
const crypto = require('@trust/webcrypto')
const TestRPC = require('ethereumjs-testrpc')
const Tx = require('ethereumjs-tx')
const Web3 = require('web3');
const CryptoJS = require('crypto-js');

let publicKey
let privateKey
let secretKey
let web3

let payload = { source: 'pragma solidity ^0.4.13;\r\n\r\ncontract SingleDataProviderEscrowContract {\r\n\r\n    address public questioner;\r\n    string public algorithmURI;\r\n    address public target;\r\n    uint public amount;\r\n    string public algorithmResultHash;\r\n\r\n    enum State { Created, Completed, Inactive }\r\n    State public state = State.Created;\r\n\r\n    function SingleDataProviderEscrowContract(string _algorithmURI, address _target, uint _amount)\r\n      payable\r\n    {\r\n        questioner = msg.sender;\r\n        algorithmURI = _algorithmURI;\r\n        target = _target;\r\n        amount = _amount;\r\n    }\r\n\r\n    modifier onlyQuestioner() {\r\n        require(msg.sender == questioner);\r\n        _;\r\n    }\r\n\r\n    modifier onlyTarget() {\r\n        require(msg.sender == target);\r\n        _;\r\n    }\r\n\r\n    modifier inState(State _state) {\r\n        require(state == _state);\r\n        _;\r\n    }\r\n\r\n    event AlgorithmExecuted(address target, address questioner, string hash);\r\n    event PaymentDelivered(address from, address to, uint amount);\r\n\r\n    function confirmAlgorithmExecuted(string _hash)\r\n        onlyTarget()\r\n        inState(State.Created)\r\n        public\r\n        returns(bool success)\r\n    {\r\n        algorithmResultHash = _hash;\r\n        AlgorithmExecuted(msg.sender, questioner, algorithmResultHash);\r\n        state = State.Completed;\r\n        return true;\r\n    }\r\n\r\n    function withdraw()\r\n       onlyTarget()\r\n       inState(State.Completed)\r\n       public\r\n       returns(bool success)\r\n    {\r\n       uint payment = amount;\r\n       amount = 0;\r\n       if (msg.sender.send(payment)) {\r\n          PaymentDelivered(questioner, msg.sender, amount);\r\n          state = State.Inactive;\r\n          return true;\r\n       } else {\r\n          amount = payment;\r\n          return false;\r\n       }\r\n    }\r\n}', bytecode:
'60606040526000600560006101000a81548160ff0219169083600281111561002357fe5b0217905550604051610b82380380610b82833981016040528080518201919060200180519060200190919080519060200190919050505b336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555082600190805190602001906100b0929190610102565b5081600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550806003819055505b5050506101a7565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061014357805160ff1916838001178555610171565b82800160010185558215610171579182015b82811115610170578251825591602001919060010190610155565b5b50905061017e9190610182565b5090565b6101a491905b808211156101a0576000816000905550600101610188565b5090565b90565b6109cc806101b66000396000f3006060604052361561008c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063018c02771461009157806311039396146100e65780633ccfd60b1461015b578063aa8c217c14610188578063c19d93fb146101b1578063d4b83992146101e8578063de85b1e81461023d578063e4dd6774146102cc575b600080fd5b341561009c57600080fd5b6100a461035b565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156100f157600080fd5b610141600480803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050610380565b604051808215151515815260200191505060405180910390f35b341561016657600080fd5b61016e61059e565b604051808215151515815260200191505060405180910390f35b341561019357600080fd5b61019b610780565b6040518082815260200191505060405180910390f35b34156101bc57600080fd5b6101c4610786565b604051808260028111156101d457fe5b60ff16815260200191505060405180910390f35b34156101f357600080fd5b6101fb610799565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561024857600080fd5b6102506107bf565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156102915780820151818401525b602081019050610275565b50505050905090810190601f1680156102be5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156102d757600080fd5b6102df61085d565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156103205780820151818401525b602081019050610304565b50505050905090810190601f16801561034d5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156103de57600080fd5b60008060028111156103ec57fe5b600560009054906101000a900460ff16600281111561040757fe5b14151561041357600080fd5b82600490805190602001906104299291906108fb565b507fe1e8be94979cf7b2b66d8648c5f797873b1caee06f5ecdd5c498deb0f91c97b3336000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff166004604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018060200182810382528381815460018160011615610100020316600290048152602001915080546001816001161561010002031660029004801561055d5780601f106105325761010080835404028352916020019161055d565b820191906000526020600020905b81548152906001019060200180831161054057829003601f168201915b505094505050505060405180910390a16001600560006101000a81548160ff0219169083600281111561058c57fe5b0217905550600191505b5b505b919050565b600080600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156105fd57600080fd5b600180600281111561060b57fe5b600560009054906101000a900460ff16600281111561062657fe5b14151561063257600080fd5b600354915060006003819055503373ffffffffffffffffffffffffffffffffffffffff166108fc839081150290604051600060405180830381858888f1935050505015610768577fb9f75f70bd240f89dfaed1709ad2180175d9e7584cf9e58d1f0d88ca32f992cd6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1633600354604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001828152602001935050505060405180910390a16002600560006101000a81548160ff0219169083600281111561075a57fe5b021790555060019250610779565b8160038190555060009250610779565b5b5b505b5090565b60035481565b600560009054906101000a900460ff1681565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108555780601f1061082a57610100808354040283529160200191610855565b820191906000526020600020905b81548152906001019060200180831161083857829003601f168201915b505050505081565b60048054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108f35780601f106108c8576101008083540402835291602001916108f3565b820191906000526020600020905b8154815290600101906020018083116108d657829003601f168201915b505050505081565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061093c57805160ff191683800117855561096a565b8280016001018555821561096a579182015b8281111561096957825182559160200191906001019061094e565b5b509050610977919061097b565b5090565b61099d91905b80821115610999576000816000905550600101610981565b5090565b905600a165627a7a72305820f4a5bc0d798e9a162079c847aecbb1e28b80f83dbbcc8b55bd0304ab0dfd0f560029', exp: 987654321, iat: 123456789 }
let header = { typ: 'JWS', alg: 'KS256' }

let rawTx = {
  nonce: '0x00',
  gasPrice: '0x09184e72a000',
  gasLimit: '0x47B760',
  to: '0x0000000000000000000000000000000000000000',
  value: '0x00',
  data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057'
}

crypto.subtle

  .generateKey(

    // use WebCrypto to generate new ECDSA secp256k1 keypair

    {
      name: 'ECDSA',
      namedCurve: 'K-256',
      hash: { name: 'SHA-256' }
    },
    true,
    ['sign', 'verify']
  )

  .then(keypair => {

    console.log(keypair)

    // sign JWD

    publicKey = keypair.publicKey
    privateKey = keypair.privateKey
    return JWD.encode({ signatures: [{ protected: header, cryptoKey: privateKey }], payload }, { serialization: 'document' })
  })

  .then(token => {

    // just to print keys in PEM
    let pemPriv = keyto.from(privateKey.handle, 'pem')
    console.log(pemPriv.toString('pem', 'private_pkcs8'))
    let blk = pemPriv.toString('blk', 'private')
    let k = keyto.from(blk, 'blk').toString('pem', 'public_pkcs8')
    console.log(k)

    // verify JWD
    return JWD.verify({ cryptoKey: publicKey, serialized: token, result: 'instance' })
  })

  .then(jwd => {

    console.log(jwd.toDocumentGeneral())

    // convert PEM private key to hex string

    let signingKey = privateKey.handle
    let Key = keyto.from(signingKey, 'pem')
    secretKey = Key.toString('blk', 'private')
    console.log(secretKey)

    return secretKey
  })

  .then(secretKey => {

    // start testrpc Ethereum client

    web3 = new Web3()
    web3.setProvider(TestRPC.provider({
      accounts: [{
          secretKey: '0x' + secretKey,
          balance: '0x100000000000000000'  // fund newly generated account
        }]
    }))

    return web3
   })

  .then(web3 => {

    // sign Ethereum tx

    let tx = new Tx(rawTx)
    tx.sign(new Buffer(secretKey, 'hex'))
    let serializedTx = tx.serialize()

    // deploy Ethereum tx to the network

    return new Promise((resolve, reject) => {
        web3.eth.sendRawTransaction(serializedTx.toString('hex'), (err, txHash) => {
          if (err) {
            console.error(err)
            reject(err)
          } else {
            resolve(txHash)
          }
        })
    })
  })

  .then(txHash => {
    let blockFilter = web3.eth.filter('latest');
    return new Promise((resolve, reject) => {
      blockFilter.watch( () => {
        web3.eth.getTransactionReceipt(txHash, (err, receipt) => {
          if (err) {
            reject(err);
          }
          if (receipt) {
            blockFilter.stopWatching();
            resolve(receipt);
          }
        });
      });
    });
  })

  .then(receipt => {
      console.log(receipt)
  })

  .catch(console.log)
