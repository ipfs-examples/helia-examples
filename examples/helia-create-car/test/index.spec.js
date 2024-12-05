import { createReadStream } from 'node:fs'
import { unixfs } from '@helia/unixfs'
import { CarReader } from '@ipld/car'
import { createHelia } from 'helia'
import { setup, expect } from 'test-ipfs-example/browser'

// Setup
const test = setup()

const filesToUpload = [
  './public/helia-create-car-demo.gif',
  './public/vite.svg'
]

const expectedCarCID = 'bafybeifsknwjwoby7gmnqlzj236rcq47q5pskkum7svsevsod5a74caxry'

test.describe('Use Helia With react and vite', () => {
  // DOM
  const heliaStatus = '#heliaStatus'
  const fileInput = '#FileUploaderInput'
  const downloadCarFileButton = '#downloadCarFile'
  const cidOutput = '#carFileCID'

  // async dependent variables
  let expectedCIDs
  let helia
  let heliaFs

  test.beforeEach(async ({ servers, page }) => {
    await page.goto(servers[0].url)

    helia = await createHelia({
      start: false
    })
    heliaFs = unixfs(helia)

    expectedCIDs = await Promise.all(filesToUpload.map(async (file) => {
      const cid = await heliaFs.addByteStream(createReadStream(file))
      return cid.toString()
    }))
  })

  test('files can be converted to a valid car file', async ({ page }) => {
    // wait for helia node to be online
    const status = await page.locator(heliaStatus)
    await expect(status).toHaveCSS(
      'border-color',
      'rgb(0, 128, 0)', // green
      { timeout: 7000 }
    )

    // select the files to upload
    await page.setInputFiles(fileInput, filesToUpload)

    // make sure the output car CID matches the expected CID
    await page.waitForSelector(cidOutput)
    const cidOutputContent = await page.textContent(cidOutput)

    expect(cidOutputContent).toContain(expectedCarCID)

    // download the car file
    const [download] = await Promise.all([
      page.waitForEvent('download'), // wait for download to start
      page.click(downloadCarFileButton)
    ])

    // car available for debugging
    await download.saveAs('./test-results/helia-create-car-demo.car')
    const reader = await CarReader.fromIterable(createReadStream('./test-results/helia-create-car-demo.car'))

    // expect the root of the car file we downloaded and then created from the saved file, to match the
    // car file CID listed on the page.
    const roots = await reader.getRoots()
    expect(roots[0].toString()).toStrictEqual(cidOutputContent)

    // get all the CIDs in the car file
    const carFileCids = []
    for await (const cid of reader.cids()) {
      carFileCids.push(cid.toString())
    }
    expect(carFileCids).toStrictEqual([
      'bafybeifsknwjwoby7gmnqlzj236rcq47q5pskkum7svsevsod5a74caxry', // root CID
      expectedCIDs[0], // CID for filesToUpload[0]
      expectedCIDs[1], // CID for filesToUpload[1]
      'bafkreida4xmb4fq4zgkm42xrox4oshesowi35e66kfiqsyv6xerymi3coq',
      'bafkreicz7xeu5jx77kng5tbieuh2bp7ffzjzwn77wpwiy7d3oy6mrbbd4e'
    ])
  })
})
