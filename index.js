const puppeteer = require("puppeteer");
const {Session } = require("./src/Session");
const {State } = require("./src/State");
const {Util } = require("./src/Util");

const URL = "http://planningonline.gov.in/ReportData.do?ReportMethod=getAnnualPlanReport";
let jsonDocument = {};
(async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let json = {};
    const session = new Session(json);
    const state = new State(page,json,"","");
    /*Listeners*/
    page.on('request', (req)=> {
        console.log("#############-Request-#############");
        console.log(`Method = ${req.method}`);
        console.log(`URL = ${req.url}`);
    });
    page.on('response', (res)=> {
        console.log("#############-Response-#############");
        console.log(`Method = ${res.method}`);
        console.log(`URL = ${res.url}`);
        console.log(`Status = ${res.status}`);
    });
    page.on("error", (error)=> {
        console.log("#############-Error-#############");
        console.log(error.message);
    });
    page.on("dialog", (dialog)=> {
        console.log("#############-Dialog-#############");
        console.log(dialog);
    });
    page.on("console", (_console)=> {
        console.log("#############-Console-#############");
        console.log(_console);
    });
    await page.goto(URL, {waitUntil: "networkidle0"});
    let financialYears = session.getSessions(page);
    let states = state.getStates(page);    
})();