This example shows how you can use mdns to connect two nodes. Either server/client node can be run first.

Both scripts (src/server.js & src/client.js) will create a helia node, and subscribe to a known pubsub topic, and shut each other down (for ease of testing).

Note: No WAN functionality is enabled, so only nodes on your local network can help with peer-discovery, and only nodes on your local network can be discovered as the code currently stands.. If you want to enable connecting to nodes outside of your WAN, you will need to connect to a bootstrap node.

### General flow

When you run these two scripts, the general flow works like this:

1. Each node subscribes to the known pubsub topic.
1. When the client node detects a subscription change on the pubsub topic, it will send a `wut-CID` message to the server node.
1. The server node will respond to the `wut-CID` message with the string representation of a CID the server node is providing.
1. The client node will request the content for that CID via `heliaDagCbor.get(CID.parse(msg))`
1. Once the content is received, the client will publish a `done` message to the pubsub topic.
1. The server node will detect the `done` message, and respond with a `done-ACK` message.
1. The client node will detect the `done-ACK` message, respond with a `done-ACK` message of it's own, and shutdown after a timeout (to allow for the message to be sent)
1. The server node will detect the `done-ACK` message, and shutdown immediately.

### Testing

Both scripts should be able to be run in any order, and the flow should work as expected. You can run `npm run test` to check this. The test will fail if the test runs for more than 10 seconds, or errors, but this failure mode is dependent upon the `timeout` command currently.


### Further exploration of this example

Some things to try:

1. See if you can get ping/pong messages working without the nodes shutting down
1. Run the server node from one computer on your local network, and the client node from another computer on your local network
1. Try removing the shutdown code from the scripts, and see if you can get multiple clients to connect
1. See if you can get the server to respond with a list of CIDs in it's blockstore, and have the client choose which one to request
1. See if you can connect to bootstrap nodes with one of your nodes, and use the other node as a LAN only node.
