/* eslint-disable no-console */

import { createLibp2p } from "libp2p";
import { createHelia } from "helia";
import { noise } from "@chainsafe/libp2p-noise";
import { webSockets } from "@libp2p/websockets";
import { webTransport } from "@libp2p/webtransport";
import { bootstrap } from "@libp2p/bootstrap";
import { mplex } from "@libp2p/mplex";
import { MemoryDatastore } from "datastore-core";
import { MemoryBlockstore } from "blockstore-core";
import { unixfs } from "@helia/unixfs";
import { kadDHT } from "@libp2p/kad-dht";
import { ipniContentRouting } from "@libp2p/ipni-content-routing";
import { ipns, ipnsValidator, ipnsSelector } from "@helia/ipns";
import { dht } from "@helia/ipns/routing";

// This returns a Helia client that can be used to interact with the Helia network
// Depending on use case, you can implement this via a context provider which loads the client on app load
// or you can implement it via a hook which loads the client on component load
// loading on app load allows the client to start content routing and dht discovery immediately
// loading on component load allows the client to start content routing and dht discovery when the component is loaded
export const createHeliaClient = async () => {
    const blockstore = new MemoryBlockstore();
    const datastore = new MemoryDatastore();

    // Create our libp2p node
    const libp2p = await createLibp2p({
        datastore,

        // Filter out the private network addresses
        connectionGater: {
            filterMultiaddrForPeer: async (peer, multiaddr) => {
                const multiaddrString = multiaddr.toString();
                if (
                    multiaddrString.includes("/ip4/127.0.0.1") ||
                    multiaddrString.includes("/ip6/")
                ) {
                    return false;
                }
                return true;
            },
        },
        contentRouters: [ipniContentRouting("https://cid.contact")],
        dht: kadDHT({
            validators: {
                ipns: ipnsValidator,
            },
            selectors: {
                ipns: ipnsSelector,
            },
        }),
        transports: [webSockets(), webTransport()],
        connectionEncryption: [noise()],
        streamMuxers: [mplex()],
        peerDiscovery: [
            bootstrap({
                list: [
                    "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
                    "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
                    "/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp",
                    "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
                    "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
                ],
            }),
        ],
    });
    // Listen for new peers
    libp2p.addEventListener("peer:discovery", (evt) => {
        const peer = evt.detail;
        // dial them when we discover them
        libp2p.dial(peer.id).catch((err) => {
            console.log(`Could not dial ${peer.id}`, err);
        });
    });
    // Listen for new connections to peers
    libp2p.addEventListener("peer:connect", (evt) => {
        const connection = evt.detail;
        console.log(`Connected to ${connection.remotePeer.toString()}`);
    });
    // Listen for peers disconnecting
    libp2p.addEventListener("peer:disconnect", (evt) => {
        const connection = evt.detail;
        console.log(`Disconnected from ${connection.remotePeer.toString()}`);
    });
    const heliaNode = await createHelia({
        datastore,
        blockstore,
        libp2p,
    });
    const heliaIPNS = ipns(heliaNode, [dht(heliaNode)]);
    const heliaUnixFX = unixfs(heliaNode);
    return { heliaUnixFX, heliaIPNS };
};