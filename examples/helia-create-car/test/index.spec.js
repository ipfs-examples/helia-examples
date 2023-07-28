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

    // make sure the output CID matchs
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

    const reader = await CarReader.fromIterable(await download.createReadStream())
    // ensure the CID root matches
    const roots = await reader.getRoots()
    expect(roots.toString()).toContain(expectedCarCID)

    // get all the CIDs in the car file
    const carFileCids = []
    for await (const cid of await reader.cids()) {
      carFileCids.push(cid.toString())
    }

    // ensure the file CIDs are included in the car file
    expectedCIDs.forEach((cid) => {
      expect(carFileCids).toContain(cid)
    })
  })
})
