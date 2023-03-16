const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  const navigationPromise = page.waitForNavigation()

  await page.goto('http://cas.hnu.edu.cn/cas/login?service=https%3A%2F%2Fpt.hnu.edu.cn%2Fpersonal-center')

  await page.setViewport({ width: 1536, height: 731 })

  await page.waitForSelector('#username')
  await page.click('#username')
  await page.waitFor(3000)

  await page.type('#username', '201826010319')
  await page.waitFor(3000)

  await navigationPromise

  await page.waitForSelector('#password')
  await page.click('#password')
  await page.waitFor(3000)

  await page.type('#password', 'magic123CAROL')
  await page.waitFor(3000)

  await page.waitForSelector('#dl')
  await page.click('#dl')
  await page.waitFor(3000)

  await navigationPromise

  await page.waitForSelector('#CardInfo > .card-info-area > .bd > ul > li:nth-child(4) > a > p')
  await page.click('#CardInfo > .card-info-area > .bd > ul > li:nth-child(4) > a > p')
  await page.waitFor(3000)

  await navigationPromise

  await navigationPromise

  await browser.close()
})()