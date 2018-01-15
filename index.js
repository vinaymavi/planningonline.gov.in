const puppeteer = require("puppeteer");
const { Session } = require("./src/Session");
const { State } = require("./src/State");
const { Util } = require("./src/Util");
const { PlanUnit } = require("./src/PlanUnit");
const { District } = require("./src/District");
const { BlockPanchayat } = require("./src/BlockPanchayat")
const { VillagePanchayat } = require('./src/VillagePanchayat');
const haryana  = require('./src/output/HARYANA.json');
console.log(haryana);
const chalk = require('chalk')
let jsonDocument = {};
const timeStart = new Date();
console.log(timeStart);
// TODO need to modify.
(async () => {    
    const browser = await puppeteer.launch();
    let page = await browser.newPage();
    const session = new Session(jsonDocument, page);
    let finYears = await session.getSessions();
    session.updateJsonDocument(finYears);
    const state = new State(page, jsonDocument, "");
    let states = await state.getStates();
    state.updateJsonDocument(states);
    await state.writeFile("states.json");
    await page.close();
    page = await browser.newPage();
    const planUnit = new PlanUnit(jsonDocument, page);
    await planUnit.fetchAndSet();
    await planUnit.writeFile('planunit.json');
    await page.close();
    page = await browser.newPage();
    const district = new District(jsonDocument, page);
    await district.fetchAndSet();
    district.writeFile("district.json");
    let blockPanchayat;
    const stateNames = Object.keys(jsonDocument['states']);    
    for (let i = 0; i < stateNames.length; i++) {
        await page.close();
        page = await browser.newPage();
        console.log(chalk.green("################ Start - " + stateNames[i] + " Start - ################        "));
        blockPanchayat = new BlockPanchayat(jsonDocument, page);
        await blockPanchayat.fetchAndSet(stateNames[i], page);
        await blockPanchayat.writeState(stateNames[i]);
        console.log(chalk.green("################ End - " + stateNames[i] + "- End - ################        "))
    }
    for (let i = 0; i < stateNames.length; i++) {
        await page.close();
        page = await browser.newPage();
        console.log(chalk.green("################ Start - " + stateNames[i] + " Start - ################        "));
        villagePanchayat = new VillagePanchayat(jsonDocument);
        await villagePanchayat.fetchAndSet(stateNames[i], page);
        await villagePanchayat.writeState(stateNames[i]);        
        console.log(chalk.green("################ End - " + stateNames[i] + "- End - ################        "))
    }

    console.log("File Write Starting");
    await villagePanchayat.writeFile();
    console.log("File Write Successfully.");
    const timeEnd = Date();
    console.log("Start Time" + timeStart);
    console.log(timeEnd);
    await browser.close();
    process.exit();
})();