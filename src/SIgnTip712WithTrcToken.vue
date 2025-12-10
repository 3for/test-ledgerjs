<script setup>
import Trx from '@ledgerhq/hw-app-trx';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import TronWeb from 'tronweb';
import { TronLinkAdapter } from '@tronweb3/tronwallet-adapter-tronlink';
window.TronWeb = TronWeb;
window.Trx = Trx;
window.TransportWebHID = TransportWebHID;
import { tronweb } from './tronweb';

// construct you typedData
// you can change the data to test other cases
const domain = {
            name: 'TrcToken Test',
            version: '1',
            chainId: '0xd698d4192c56cb6be724a558448e2684802de4d6cd8690dc',
            verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        };

// The named list of all type definitions
const types = {
            FromPerson: [
                { name: 'name', type: 'string' },
                { name: 'wallet', type: 'address' },
                { name: 'trcTokenId', type: 'trcToken' },
            ],
            ToPerson: [
                { name: 'name', type: 'string' },
                { name: 'wallet', type: 'address' },
                { name: 'trcTokenArr', type: 'trcToken[]' },
            ],
            Mail: [
                { name: 'from', type: 'FromPerson' },
                { name: 'to', type: 'ToPerson' },
                { name: 'contents', type: 'string' },
                { name: 'tAddr', type: 'address[]' },
                { name: 'trcTokenId', type: 'trcToken' },
                { name: 'trcTokenArr', type: 'trcToken[]' },
            ],
        };

// The data to sign
const value = {
            from: {
                name: 'Cow',
                wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
                trcTokenId: '1002000',
            },
            to: {
                name: 'Bob',
                wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
                trcTokenArr: ['1002000', '1002000'],
            },
            contents: 'Hello, Bob!',
            tAddr: ['0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB', '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'],
            trcTokenId: '1002000',
            trcTokenArr: ['1002000', '1002000'],
        };

const dominSeperator = TronWeb.utils._TypedDataEncoder.hashDomain(domain);
console.log('dominSeperator: ', dominSeperator);
const hashedMessage = TronWeb.utils._TypedDataEncoder.from(types).hash(value);
console.log('hashedMessage: ', hashedMessage);
const hashToSign = TronWeb.utils._TypedDataEncoder.hash(domain, types, value);
console.log('hashToSign: ', hashToSign);

async function handleSign() {
  const transport = await TransportWebHID.create();
  const app = new Trx(transport);
  // change your path
  const path = `44'/195'/${0}'/0/0`;
  // get address
  const address = await app.getAddress(path);
  console.log('Your address is: ', address);

  // request Ledger to sign TIP712HashedMessage
  const signature = await app.signTIP712HashedMessage(path, dominSeperator.slice(2), hashedMessage.slice(2));
  console.log('Signed signature: ', signature);
  await transport?.close();

  // verify signature
  const result = TronWeb.Trx.verifyTypedData(domain, types, value, signature, address.address);
  console.log('verify result: ', result);
}

async function handleSign712FullDisplay() {
  const transport = await TransportWebHID.create();
  const app = new Trx(transport);
  // change your path
  const path = `44'/195'/${0}'/0/0`;
  // get address
  const address = await app.getAddress(path);
  console.log('Your address is: ', address);

  const typedData = {
    "domain": {
        "name": "TrcToken Test",
        "version": "1",
        "chainId": "0xd698d4192c56cb6be724a558448e2684802de4d6cd8690dc",
        "verifyingContract": "0xCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC"
    },
    "message": {
        "from": {
            "name": "Cow",
            "wallet": "0xCD2A3D9F938E13CD947EC05ABC7FE734DF8DD826",
            "trcTokenId": "1002000"
        },
        "to": {
            "name": "Bob",
            "wallet": "0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
            "trcTokenArr": ["1002000", "1002000"]
        },
        "contents": "Hello, Bob!",
        "tAddr": ["0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB", "0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB"],
        "trcTokenId": "1002000",
        "trcTokenArr": ["1002000", "1002000"]
    },
    "primaryType": "Mail",
    "types": {
        "EIP712Domain": [
            { "name": "name", "type": "string" },
            { "name": "version", "type": "string" },
            { "name": "chainId", "type": "uint256" },
            { "name": "verifyingContract", "type": "address" }
        ],
        "FromPerson": [
            { "name": "name", "type": "string" },
            { "name": "wallet", "type": "address" },
            { "name": "trcTokenId", "type": "trcToken" }
        ],
        "ToPerson": [
            { "name": "name", "type": "string" },
            { "name": "wallet", "type": "address" },
            { "name": "trcTokenArr", "type": "trcToken[]" }
        ],
        "Mail": [
            { "name": "from", "type": "FromPerson" },
            { "name": "to", "type": "ToPerson" },
            { "name": "contents", "type": "string" },
            { "name": "tAddr", "type": "address[]" },
            { "name": "trcTokenId", "type": "trcToken" },
            { "name": "trcTokenArr", "type": "trcToken[]" }
        ]
    }
  };
  // request Ledger to sign TIP712HashedMessage
  const signature = await app.signTIP712Message(path, typedData);
  console.log('Signed signature: ', signature);
  await transport?.close();

  // verify signature
  const result = TronWeb.Trx.verifyTypedData(domain, types, value, signature, address.address);
  console.log('verify result: ', result);
}

async function handleSignWithTronLink() {
  const adapter = new TronLinkAdapter({ checkTimeout: 1000 });
  await adapter.connect();
  const signature = await window.tronWeb.trx._signTypedData(domain, types, value);
  console.log('Signed signature: ', signature);
  const result = TronWeb.Trx.verifyTypedData(domain, types, value, signature, adapter.address);
  console.log('verify result: ', result);
}

async function verifySignature() {
  const cleanValue = [
    ['Cow', '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826', '1002000'],
    ['Bob', '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB', ['1002000', '1002000']],
    'Hello, Bob!',
    ['0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB', '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'],
    '1002000',
    ['1002000', '1002000']
  ]

  const contractAddress = 'TRHsc32MH4CLJf9VMhMjW6M9VgyvN85ku3';
  const abi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "FROMPERSON_TYPE",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MAIN_TYPE",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "TOPERSON_TYPE",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "_CACHED_CHAIN_ID",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "_CACHED_DOMAIN_SEPARATOR",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "_CACHED_THIS",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "_HASHED_NAME",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "_HASHED_VERSION",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "_TYPE_HASH",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "domainSeparatorV4",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "hash",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "address",
                  "name": "wallet",
                  "type": "address"
                },
                {
                  "internalType": "trcToken",
                  "name": "trcTokenId",
                  "type": "trcToken"
                }
              ],
              "internalType": "struct TIP712.FromPerson",
              "name": "from",
              "type": "tuple"
            },
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "address",
                  "name": "wallet",
                  "type": "address"
                },
                {
                  "internalType": "trcToken[]",
                  "name": "trcTokenArr",
                  "type": "trcToken[]"
                }
              ],
              "internalType": "struct TIP712.ToPerson",
              "name": "to",
              "type": "tuple"
            },
            {
              "internalType": "string",
              "name": "contents",
              "type": "string"
            },
            {
              "internalType": "address[]",
              "name": "tAddr",
              "type": "address[]"
            },
            {
              "internalType": "trcToken",
              "name": "trcTokenId",
              "type": "trcToken"
            },
            {
              "internalType": "trcToken[]",
              "name": "trcTokenArr",
              "type": "trcToken[]"
            }
          ],
          "internalType": "struct TIP712.Mail",
          "name": "mail",
          "type": "tuple"
        },
        {
          "internalType": "uint8",
          "name": "v",
          "type": "uint8"
        },
        {
          "internalType": "bytes32",
          "name": "r",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "s",
          "type": "bytes32"
        }
      ],
      "name": "verifyMail",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const contract = await tronweb.contract(abi, contractAddress);

  const signer = "0x19580B8D292F590D254AB037320975AB36789194";
  // signature: r, s, v
  const v = 27;
  const r = "0x20c3321a17f8ffd0468675c648266fd0aaed1067708d19dd37ec77c90a4bf788";
  const s = "0x2cc8e0e799b5b337abc97e7c09906d39ec9fa7e3f93b4d4122c71b577c02cd6c";
  const tx = contract.verifyMail(signer,cleanValue,v,r,s);
  const result = await tx.call().catch((e) => console.log(e));

  console.log('Transaction result:', result);
}
</script>

<template>
  <div>
    <button @click="handleSign">sign and verify</button>
    <button @click="handleSign712FullDisplay">sign 712 full display and verify</button>
    <button @click="verifySignature">verify signature</button>
    <button @click="handleSignWithTronLink">sign and verify With TronLink Ledger Account</button>
  </div>
</template>

<style scoped></style>
