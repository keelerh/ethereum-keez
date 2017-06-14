# Ethereum keys


## Ethereum native key format

### [Web3 Secret Storage Definition](https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition)

Web3 Secret Storage is the defined keystore format for Ethereum (that is utilized by Geth and Parity).

This format makes a password mandatory, but doesn't put a restriction on the password length. It can be zero. Or could be something really long.

PBKDF2-SHA-256

Test vector using AES-128-CTR and PBKDF2-SHA-256:

File contents of `~/.web3/keystore/3198bc9c-6672-5ab3-d9954942343ae5b6.json`:

```json
{
    "crypto" : {
        "cipher" : "aes-128-ctr",
        "cipherparams" : {
            "iv" : "6087dab2f9fdbbfaddc31a909735c1e6"
        },
        "ciphertext" : "5318b4d5bcd28de64ee5559e671353e16f075ecae9f99c7a79a38af5f869aa46",
        "kdf" : "pbkdf2",
        "kdfparams" : {
            "c" : 262144,
            "dklen" : 32,
            "prf" : "hmac-sha256",
            "salt" : "ae3cd4e7013836a3df6bd7241b12db061dbe2c6785853cce422d148a624ce0bd"
        },
        "mac" : "517ead924a9d0dc3124507e3393d175ce3ff7c1e96529c6c555ce9e51205e9b2"
    },
    "id" : "3198bc9c-6672-5ab3-d995-4942343ae5b6",
    "version" : 3
}
```

Notes: differences between keythereum key object output

- Keythereum includes address (whereas Web3 Secret Storage specs says unnecessary and compromises privacy)

### PBKDF2 (in general):

Password-Based Key Derivation Function 2 (PBKDF2) are key derivation functions.

`DK = PBKDF2(PRF, Password, Salt, c, dkLen)`

- `PRF` is a pseudorandom function of two parameters with output length `hLen` (e.g. a keyed HMAC)
- `Password` is the master password from which a derived key is generated
- `Salt` is a sequence of bits, known as a cryptographic salt
- `c` is the number of iterations desired
- `dkLen` is the desired length of the derived key
- `DK` is the generated derived key


### PBKDF2 (in Web3 Secret Storage)

`PBKDF2` must be supported by all minimally-compliant implementations, denoted though:

`kdf`: `pbkdf2`

For `PBKDF2`, the kdfparams include:

`prf`: Must be `hmac-sha256` (may be extended in the future);
`c`: number of iterations;
`salt`: salt passed to `PBKDF`;
`dklen`: length for the derived key. Must be >= 32.



## secp256k1

secp256k1 refers to the parameters of the ECDSA curve used in Bitcoin.




## [JWK](https://tools.ietf.org/html/rfc7517) format

A generated EC P-256 key pair in JWK format:

```json
{
  "kty" : "EC",
  "crv" : "P-256",
  "kid" : "758cfdbd-0137-4b6f-8bad-0bbd8b0da8a8",
  "x"   : "SVqB4JcUD6lsfvqMr-OKUNUphdNn64Eay60978ZlL74",
  "y"   : "lf0u0pMj4lGAzZix5u4Cm5CMQIgMNpkwy163wtKYVKI",
  "d"   : "0g5vAEKzugrXaRbgKG0Tj2qJ5lMP4Bezds1_sTybkfk"
}
```

## [keythereum](https://github.com/ethereumjs/keythereum)

Keythereum uses the same key derivation functions (PBKDF2-SHA256 or scrypt), symmetric ciphers (AES-128-CTR or AES-128-CBC), and message authentication codes as geth. You can export your generated key to file, copy it to your data directory's keystore, and immediately start using it in your local Ethereum client.

Keythereum key object (implements Web3 Secret Storage):

```json
{ address: '0118bfffb9034bcd1ad54b4cb420e053a7c49a23',
  crypto:
   { cipher: 'aes-128-ctr',
     ciphertext: 'ef332e76ef32a102576b357284e848eb2c943b8088efe8a10f78492d618c5157',
     cipherparams: { iv: 'e8773f01bd63d1ed3381ed12a88abbe2' },
     mac: '8148f5220e9570266f2f0ebc2a6f245b172411d0b290470c901b01fa8c16d7f8',
     kdf: 'pbkdf2',
     kdfparams:
      { c: 262144,
        dklen: 32,
        prf: 'hmac-sha256',
        salt: 'ccf152e2e10954d44a521cc9eab84273376e106cb086f38d2fd0cc77eb70a4d8' } },
  id: 'a355e9b8-7d49-405f-989e-523bb6e34065',
  version: 3 }
```


All minimally-compliant implementations must support the `AES-128-CTR `algorithm, denoted through:

- `cipher`: aes-128-ctr 
    
This cipher takes the following parameters, given as keys to the cipherparams key:

- `iv`: 128-bit initialisation vector for the cipher.

The key for the cipher is the leftmost 16 bytes of the derived key, i.e. DK[0..15]


### Ether wallets

- MyEtherWallet - a web based wallet written in Javascript.
- Ethereum Wallet - the wallet software created by the Ethereum foundation.
- Parity Wallet - a web based wallet interface coupled with the Parity Ethereum client.
- MetaMask.io - a wallet served as a Chrome extension.

Behind the scenes each of these wallets is working with a key file.

- In Parity (on macOS) these are stored in ~/.parity/keys.
- Ethereum Wallet interfaces with your running Geth node which (on macOS) stores keys in /Library/Ethereum/keystore.

### Ethereum Private Key --> Public Key --> Address

1. Create a random private key (64 (hex) characters / 256 bits / 32 bytes)
2. Derive the public key from this private key (128 (hex) characters / 512 bits / 64 bytes)
3. Derive the address from this public key. (40 (hex) characters / 160 bits / 20 bytes)
    - take the keccak-256 hash of the hexadecimal form of a public key, then keep only the last 20 bytes (aka get rid of the first 12 bytes).

Ethereum address is made of 20 bytes (40 hex characters long), it is commonly represented by adding the 0x prefix.


### * [CREATE FULL ETHEREUM WALLET, KEYPAIR AND ADDRESS](https://kobl.one/blog/create-full-ethereum-keypair-and-address/) *

How to generate an ECDSA private key and derive its Ethereum address. Using OpenSSL and keccak-256sum from a terminal.

```bash
# Generate the private and public keys
# Ethereum standard is to use the secp256k1 curve (same curve as Bitcoin)
> openssl ecparam -name secp256k1 -genkey -noout | 
  openssl ec -text -noout > Key

# Extract the public key and remove the EC prefix 0x04
> cat Key | grep pub -A 5 | tail -n +2 |
            tr -d '\n[:space:]:' | sed 's/^04//' > pub

# Extract the private key and remove the leading zero byte
> cat Key | grep priv -A 3 | tail -n +2 | 
            tr -d '\n[:space:]:' | sed 's/^00//' > priv

# Generate the hash and take the address part
> cat pub | keccak-256sum -x -l | tr -d ' -' | tail -c 41 > address

# (Optional) import the private key to geth
> geth account import priv
```
