const puppeteer = require('puppeteer')
const Store = require('electron-store')

const store = new Store();
const storedSettings = store.get('settings')

const tangerinoService = {
  getPunchedHours: async () => {

    if (!storedSettings) return

    const { employerCode, pin } = storedSettings

    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto("https://app.tangerino.com.br/Tangerino/pages/LoginPage")

    await page.waitForSelector(".abaLogin li:nth-child(2) a")
    await page.click('.abaLogin li:nth-child(2) a')

    await page.waitForSelector("input[name=codigoEmpregador]")
    await page.$eval('input[name=codigoEmpregador]', (el, employerCode) => el.value = employerCode, employerCode)

    await page.$eval('input[name=pin]', (el, pin) => el.value = pin, pin)

    await page.click('input[name=btnLogin]')

    await page.waitForSelector('.ic-nav-horas')
    await page.click('.ic-nav-horas')

    await page.waitForSelector('table > tbody > tr')

    let clockPunchTimes = await page.evaluate(() => {
      const trEls = document.querySelectorAll("table > tbody > tr")

      let clockPunchTimes = []

      let i = trEls.length - 4
      let inputTrEls = []

      while (trEls[i].className !== "folhaponto-header") {
        inputTrEls.push(trEls[i])

        i--
      }

      inputTrEls.reverse().forEach(el => {
        const inputs = Array.from(el.querySelectorAll("input"))

        inputs.forEach(input => {
          const { value } = input
          if (value === '') return

          clockPunchTimes.push(value)
        })
      })

      return clockPunchTimes
    })

    await browser.close()

    return clockPunchTimes
  },

  clockIsPunched: async () => {
    const currentHour = new Date().getHours()
    const punchedHours = await tangerinoService.getPunchedHours()
    const parsedPunchedHours = punchedHours.map(hour => parseInt(hour.split(':')[0]))

    const { officeIn, lunchOut, lunchIn, officeOut } = storedSettings
    const punchHours = [officeIn, lunchOut, lunchIn, officeOut]

    let punchedIndex = 0

    while (currentHour >= parsedPunchedHours[punchedIndex]) {
      punchedIndex++
    }

    let punchIndex = 0

    while (currentHour >= punchHours[punchIndex]) {
      punchIndex++
    }

    return punchedIndex === punchIndex
  }
}

module.exports = tangerinoService