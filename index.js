const puppeteer = require("puppeteer");
const URL = "http://planningonline.gov.in/ReportData.do?ReportMethod=getAnnualPlanReport";
let jsonDocument = {};
(async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
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
    let sessions = await getSessions(page);

    let states = await getStates(page);
    changeState(page, states[0]);
})();

async function changeSession(page, session) {
    const SELECTOR = 'select[id="planYearId"]';
    await changeSelectElmValue(page, SELECTOR, session);
}

async function changeState(page, state) {
    const SELECTOR = 'select[id="stateCode"]';
    await changeSelectElmValue(page, SELECTOR, state.value);
}

async function getStates(page) {
    const SELECTOR = 'select[id="stateCode"]';
    let states = await getSelectElmOptions(page, SELECTOR);
    console.log(states);
    return states;
}

async function getSessions(page) {
    const SELECTOR = 'select[id="planYearId"]';
    let sessions = await getSelectElmOptions(page, SELECTOR);
    console.log(sessions);
    return sessions;
}

async function changeSelectElmValue(page, selector, value) {
    console.log("**************-ChangeOptions-**************");
    console.log(`Selector =${selector}`);
    console.log(`Value = ${value}`);
    return page.$eval(selector, (el, value)=> {
        el.value = value;
        el.onchange();
    }, value);
}

function getSelectElmOptions(page, selector) {
    console.log("**************-SelectOptions-**************");
    console.log(`Selector =${selector}`);
    return page.$eval(selector, (el)=> {
        let options = [];
        el.querySelectorAll('option').forEach((e)=> {
            if (typeof e.value === "string" && e.value.trim() !== "Select" && e.value.trim().length) {
                options.push({"text": e.innerText, "value": e.value});
            }
        });
        return options;
    });
}