import { initHelia } from "../components/helia";

describe('initialize Helia', () => {
  it('checks if HeliaNode has started', async () => {

    const { heliaNode } = await initHelia();

    expect(heliaNode.libp2p.status).toEqual('started');
  })

  it('checks if there is a nodeId', async () => {

    const { nodeId } = await initHelia();

    expect(nodeId).toEqual('mock-peer-id');
  })

  it('checks if nodeId is online', async () => {

    const { nodeIsOnline } = await initHelia();

    expect(nodeIsOnline).toBe(true);
  })
})