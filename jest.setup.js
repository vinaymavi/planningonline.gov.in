const chalk = require('chalk')
const puppeteer = require('puppeteer')

module.exports = async function() {
  console.log(chalk.green('Setup Puppeteer'))
  const browser = await puppeteer.launch({})
  global.__BROWSER__ = browser
}