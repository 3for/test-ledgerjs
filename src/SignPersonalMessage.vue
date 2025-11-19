<script setup>
import Trx from '@ledgerhq/hw-app-trx';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import TronWeb from 'tronweb';
import { TronLinkAdapter } from '@tronweb3/tronwallet-adapter-tronlink';
window.TronWeb = TronWeb;
window.Trx = Trx;
window.TransportWebHID = TransportWebHID;
const tronWeb = new TronWeb({
  fullHost: "https://api.trongrid.io",
  privateKey: "c85ef7d79691fe79573b1a7064c19c1a9819ebdbd1faaab1a8ec92344438aaf4"
});
async function makeApp() {
  const transport = await TransportWebHID.create();
  const app = new Trx(transport);
  const path = `44'/195'/${0}'/0/0`;
  const address = await app.getAddress(path);
  return { transport, path, app, address };
}

async function handleSignPersonalMessage() {
  const message1 = document.getElementById('message1').value;
  console.log('Sign Personal Message:', message1);
  const msgBytes = tronWeb.utils.code.hexStr2byteArray(message1.replace(/^0x/, ""));
  console.log("msgBytes:", msgBytes);
  const str = Buffer.from(msgBytes).toString("hex");
  console.log('str:', str);

  const { app, path } = await makeApp();
  const result = await app.signPersonalMessage(
    path,
    str
  );
  console.log('Sign PersonalMessage Result : ', result);
}

function isHexString(str) {
  if (typeof str !== 'string') return false;

  // remove 0x
  if (str.startsWith('0x')) {
    str = str.slice(2);
  }

  // must be even
  if (str.length === 0 || str.length % 2 !== 0) return false;

  // regex matching
  return /^[0-9a-fA-F]+$/.test(str);
}

async function handleSignPersonalMessageFullDisplay() {
  const message2 = document.getElementById('message2').value;
  console.log('Sign Personal Message Full Display');
  let msgToSign = "";
  if (isHexString(message2)) {
    msgToSign = message2.replace(/^0x/, "")
  } else {
      msgToSign = Buffer.from(message2).toString("hex").replace(/^0x/, "")
  }
  console.log('msgToSign:', msgToSign);
  const { app, path } = await makeApp();
  const result = await app.signPersonalMessageFullDisplay(
    path,
    msgToSign
  );
  console.log('Sign PersonalMessage Full Display Result : ', result);
}

async function handleSignWithTronLink() {
  const message3 = document.getElementById('message3').value;
  console.log('Sign Personal Message Full Display');
  //const messageToSign = Buffer.from(message3).toString();
  const message= '0xdf14a3e94fadbe8ef56634b8b5ff64a3ea5ebd1127935a061664492a5a19c2e9';
  console.log(message.length);
  const bytes = tronWeb.utils.code.hexStr2byteArray(message.replace(/^0x/, ""));
  console.log('bytes             ', bytes)
  console.log(bytes.length);
  const signedBytes = tronWeb.utils.message.hashMessage(bytes);
  console.log('signedBytes        ', signedBytes);
  const signedHash = tronWeb.utils.message.hashMessage(message);
  console.log('signedHash        ', signedHash);
  const messageToSign = bytes;
  console.log('messageToSign     ', messageToSign);

  const sig =  await tronWeb.trx.signMessageV2(bytes);
  console.log('sig               ', sig);
  
  const adapter = new TronLinkAdapter({ checkTimeout: 1000 });
  await adapter.connect();
  const signature = await window.tronWeb.trx.signMessageV2(messageToSign);
  console.log('Signed signature: ', signature);
  const result = TronWeb.Trx.verifyMessageV2(messageToSign, signature);
  console.log('verify result: ', result);
}


</script>

<template>
  <div style="width:540px; display: flex; flex-wrap: wrap;">
    <div style="margin-bottom:10px">
      <input id="message1" type="text" style="height: 32px; width: 200px; margin-right: 20px" />
      <button @click="handleSignPersonalMessage">Sign Personal Message</button>
    </div>
    <div style="margin-bottom:10px">
      <input id="message2" type="text" style="height: 32px; width: 200px; margin-right: 20px" />
      <button @click="handleSignPersonalMessageFullDisplay">Sign Personal Message Full Display</button>
    </div>
    <div style="margin-bottom:10px">
      <input id="message3" type="text" style="height: 32px; width: 200px; margin-right: 20px" />
      <button @click="handleSignWithTronLink">Sign Personal Message with TronLink</button>
    </div>
  </div>
</template>

<style scoped></style>
