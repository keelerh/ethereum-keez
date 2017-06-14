/**
 * Dependencies
 */
const { spawnSync } = require('child_process')
const Tx = require('ethereumjs-tx')

let bashScript = "openssl ecparam -name secp256k1 -genkey -noout | openssl ec -text -noout"
let output = spawnSync('sh', ['-c', bashScript]).stdout
let keypair = output.toString().replace(/\s/g,'')

let a = keypair.split('priv:')[1]
let b = a.split('pub:')[0]
let c = b.replace(/^0+/, '')
let privateKey = c.replace(/:/g, '') 

console.log('Private key:\n', privateKey)

//let output = spawnSync('openssl', ['ecparam','-name','secp256k1','-genkey','-noout']).stdout
//let keypair = spawnSync('openssl', ['ex', '-text', '-noout']).stdout 

//let privateKey = spawnSync('openssl', ['ecparam','-name', 'secp256k1','-genkey','-noout']).stdout

//let k = privateKey.toString('ascii').trim()
//let publicKey = spawnSync('openssl', ['ec', '-pubout'], { input: privateKey }).stdout
//keypair.privateKey = privateKey.toString('ascii').trim()
//keypair.publicKey = publicKey.toString('ascii').trim()

let rawTx = {
  nonce: '0x00',
  gasPrice: '0x09184e72a000', 
  gasLimit: '0x2710',
  to: '0x0000000000000000000000000000000000000000', 
  value: '0x00', 
  data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057'
}

let tx = new Tx(rawTx)
tx.sign(new Buffer(privateKey, 'hex'))

let serializedTx = tx.serialize()

console.log('Serialized Ethereum tx:')
console.log(serializedTx.toString('hex'))
