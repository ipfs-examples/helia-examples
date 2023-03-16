import { test, expect } from '@playwright/test';
import { playwright } from 'test-util-ipfs-example';

// Setup
const play = test.extend({
  ...playwright.servers(),
});

play.describe('using script tag:', () => {
  // DOM
  const status = "#statusValue"
  const node = "#nodeId"
  const startHelia = ".e2e-startHelia"
  const stopHelia = ".e2e-stopHelia"

  play.beforeEach(async ({servers, page}) => {
    await page.goto(`http://localhost:${servers[0].port}/`);
  })

  play('should properly initialized a IPFS node and print the status', async ({ page }) => {
    await page.waitForSelector(status)
    expect(await page.textContent(status)).toContain("Not Started");
    expect(await page.textContent(node)).toContain("unknown");

    await new Promise((resolve) => setTimeout(resolve, 2000))

    expect(await page.textContent(status)).toContain("Online");
    expect(await page.textContent(node)).not.toContain("unknown");

    await page.click(stopHelia)
    await new Promise((resolve) => setTimeout(resolve, 600))
    expect(await page.textContent(status)).toContain("Offline");

  });
});
