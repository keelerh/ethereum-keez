/**
 * Dependencies
 */
const { JWD } = require('@trust/jose')
const keyto = require('@trust/keyto')
const crypto = require('@trust/webcrypto')
const TestRPC = require('ethereumjs-testrpc')
const Tx = require('ethereumjs-tx')
const Web3 = require('web3');


//web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'))

let publicKey
let privateKey

let payload = { iss: 'https://example.com', exp: 123456789, iat: 123456789 }
let header = { typ: 'JWS', alg: 'KS256' }

let dummyRawTx = {
  nonce: '0x00',
  gasPrice: '0x09184e72a000', 
  gasLimit: '0x2710',
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
    publicKey = keypair.publicKey
    privateKey = keypair.privateKey
    return JWD.encode({ signatures: [{ protected: header, cryptoKey: privateKey }], payload }, { serialization: 'document' })
  })

  .then(token => {
    console.log(JSON.stringify(token, null, 2))
    return JWD.verify({ cryptoKey: publicKey, serialized: token, result: 'instance' })
  })

  .then( => {

    // convert PEM private key to hex string
      
    let signingKey = privateKey.handle
    let Key = keyto.from(signingKey, 'pem')
    return Key.toString('blk', 'private')
  })
  
  .then(secretKey => {
      
    // start testrpc Ethereum client
      
    let web3 = new Web3()
    web3.setProvider(TestRPC.provider(
        {
          accounts: {
                      secretKey: secretKey,
                      balance: 1000  // fund newly generated account
                    }
        }
    ))

    // sign Ethereum tx

    let tx = new Tx(dummyRawTx)
    tx.sign(new Buffer(privateKey, 'hex'))
    let serializedTx = tx.serialize()

    // deploy Ethereum tx to the network
      
    web3.eth.sendRawTransaction(serializedTx.toString('hex'))
  })

  .catch(console.log)
