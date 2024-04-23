import { Circuit, IP, DNS } from '@multiformats/multiaddr-matcher'
import isPrivate from 'private-ip'

/**
 *
 * @param {import('@multiformats/multiaddr').Multiaddr} ma
 *
 * @returns {boolean}
 */
export function isPublicAndDialable (ma) {
  // circuit addresses are probably public
  if (Circuit.matches(ma)) {
    return true
  }

  // dns addresses are probably public?
  if (DNS.matches(ma)) {
    return true
  }

  // ensure we have only IPv4/IPv6 addresses
  if (!IP.matches(ma)) {
    return false
  }

  const options = ma.toOptions()

  return isPrivate(options.host) === false
}
