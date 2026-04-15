import { CID } from 'multiformats/cid'

export default {
  json: {
    cid: CID.parse('bagaaierasords4njcts6vs7qvdjfcvgnume4hqohf65zsfguprqphs3icwea'),
    data: Uint8Array.from([123, 34, 104, 101, 108, 108, 111, 34, 58, 34, 119, 111, 114, 108, 100, 34, 125])
  },
  dagJson: {
    cid: CID.parse('baguqeerasords4njcts6vs7qvdjfcvgnume4hqohf65zsfguprqphs3icwea'),
    data: Uint8Array.from([123, 34, 104, 101, 108, 108, 111, 34, 58, 34, 119, 111, 114, 108, 100, 34, 125])
  },
  dagCbor: {
    cid: CID.parse('bafyreidykglsfhoixmivffc5uwhcgshx4j465xwqntbmu43nb2dzqwfvae'),
    data: Uint8Array.from([161, 101, 104, 101, 108, 108, 111, 101, 119, 111, 114, 108, 100])
  }
}
