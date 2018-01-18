const { State } = require("../src/State")
const puppeteer = require('puppeteer')
const timeout = 5000
let page
let browser;
beforeAll(async () => {    
    browser = await puppeteer.launch({})
    page = await browser.newPage()
}, timeout)

afterAll(async () => {
    await page.close()
})

test("Test update jsonDocument", () => {

    const jsonDocumentBefore = {
        "states":{}    
    };
    const states = [{
        "text": "UP", value: 1
    },
    {
        "text": "UK", value: 2
    }]
    const jsonDocumentAfter = {"states": {"UK": {"planUnit": {}, "value": 2}, "UP": {"planUnit": {}, "value": 1}}}
    const state = new State(page, jsonDocumentBefore, "", "");
    state.updateJsonDocument(states);
    expect(state.json).toEqual(jsonDocumentAfter);
})