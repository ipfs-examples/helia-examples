export const createHelia = jest.fn().mockResolvedValue({
    libp2p: {
      peerId: { toString: () => 'mock-peer-id' },
      status: 'started'
    }
  });