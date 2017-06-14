#!/usr/bin/python

# pip install ecdsa
from ecdsa import SigningKey, SECP256k1

priv = SigningKey.generate(curve=SECP256k1)
pub = priv.get_verifying_key()

print("Private key:", ''.join(x.encode('hex') for x in priv.to_string()))
print("Public key: ", ''.join(x.encode('hex') for x in pub.to_string()))
