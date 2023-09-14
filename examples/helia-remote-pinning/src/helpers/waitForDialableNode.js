import { isPublicAndDialable } from './isPublicAndDialable.js'

export async function waitForDialableNode (helia) {
  return new Promise((resolve, reject) => {
    const id = setInterval(() => {
      const publicMultiaddrs = helia.libp2p.getMultiaddrs().filter(isPublicAndDialable)
      if (publicMultiaddrs.length > 0) {
        clearInterval(id)
        resolve()
      }
    }, 1000)
  })
}
