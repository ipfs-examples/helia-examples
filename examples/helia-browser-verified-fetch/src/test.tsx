// import { createVerifiedFetch, verifiedFetch } from '@helia/verified-fetch'
import { verifiedFetch } from '@helia/verified-fetch'
import debug from 'debug'
import React, { useEffect } from 'react'
debug.enable('*,*:trace')

// const verifiedFetch = await createVerifiedFetch({
//   gateways: ['https://trustless-gateway.link', 'https://dag.w3s.link'],
//   routers: ['https://delegated-ipfs.dev']
// })

export default function Test (): JSX.Element {
  const [data, setData] = React.useState<any | null>(null)
  useEffect(() => {
    void (async () => {
      const resp = await verifiedFetch('ipfs://baguqeeradnk3742vd3jxhurh22rgmlpcbzxvsy3vc5bzakwiktdeplwer6pa', { session: true })
      const obj = await resp.json()
      setData(obj)
    })()
  }, [])

  if (data == null) {
    return <div>Loading...</div>
  }

  // output.innerHTML = JSON.stringify(obj, null, '\t')
  return <pre>{JSON.stringify(data, null, '\t')}</pre>
}
