/** global Helia, Libp2P, ChainsafeLibp2PYamux, Libp2PWebsockets, Libp2PBootstrap, BlockstoreCore, DatastoreCore */

// not imported from skypack nor unpkg because of issues.
import { noise } from 'https://esm.sh/v111/@chainsafe/libp2p-noise@11.0.1/es2022/libp2p-noise.js'
// console.log(`noise: `, noise);

let libp2pInstance = null
// const createLibp2p = async ({ datastore }) => {

//   if (libp2pInstance != null) {
//     return libp2pInstance
//   }
//   // console.log(window.Libp2P)
//   // libp2p is the networking layer that underpins Helia


//   return libp2pInstance
// }

let heliaInstance = null
const createHelia = async () => {

  // application-specific data lives in the datastore
  const datastore = new DatastoreCore.MemoryDatastore()
  const blockstore = new BlockstoreCore.MemoryBlockstore()

  if (heliaInstance != null) {
    return heliaInstance
  }

  if (libp2pInstance == null) {
    libp2pInstance = await Libp2P.createLibp2p({
      datastore,
      transports: [
        Libp2PWebsockets.webSockets()
      ],
      connectionEncryption: [
        noise()
      ],
      streamMuxers: [
        ChainsafeLibp2PYamux.yamux()
      ],
      peerDiscovery: [
        Libp2PBootstrap.bootstrap({
          list: [
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt"
          ],
          timeout: 60000
        })
      ]
    })
  }

  heliaInstance = await Helia.createHelia({
    datastore,
    blockstore,
    libp2p: libp2pInstance
  })

  return heliaInstance
}

const testFn = async () => {
  console.log('testFn triggered')
  await new Promise((resolve, reject) => {
    console.log('testFn promise triggered')
    setTimeout(() => {
      console.log('timeout callback triggered')
      resolve()
    }, 5000)
  })
  console.log('testFn promise resolved')
}
document.addEventListener('DOMContentLoaded', async () => {
  console.log(`DOMContentLoaded: `);
  await testFn()
  console.log(`Helia: `, Helia);
  console.log(`Libp2P: `, Libp2P);
  console.log(`ChainsafeLibp2PYamux: `, ChainsafeLibp2PYamux);
  console.log(`Libp2PWebsockets: `, Libp2PWebsockets);
  console.log(`Libp2PBootstrap: `, Libp2PBootstrap);
  console.log(`DatastoreCore: `, DatastoreCore);
  console.log(`BlockstoreCore: `, BlockstoreCore);
  console.log('after await testFn')
  await createHelia()
  console.log('heliaInstance', heliaInstance)
  heliaInstance.libp2p.connectionManager.onConnect((event) => {
    console.log('event', event)
  })
  // heliaInstance.libp2p.connectionManager.onDisconnect((event) => {
  //   console.log('event', event)
  // })
  // console.log()
  // const insertAfter = (referenceNode, newNode) => {
  //   referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  // }

  // const node = await Ipfs.create({ repo: 'ipfs-' + Math.random() })
  // window.node = node

  // const status = node.isOnline() ? 'online' : 'offline'
  // const id = await node.id()

  // console.log(`Node status: ${status}`)

  // const statusDOM = document.getElementById('status')
  // statusDOM.innerHTML = `Node status: ${status}`

  // const newDiv = document.createElement("div");
  // newDiv.id = "node"
  // const newContent = document.createTextNode(`ID: ${id.id}`);
  // newDiv.appendChild(newContent);

  // insertAfter(statusDOM, newDiv);

  // You can write more code here to use it. Use methods like
  // node.add, node.get. See the API docs here:
  // https://github.com/ipfs/js-ipfs/tree/master/packages/interface-ipfs-core
})
