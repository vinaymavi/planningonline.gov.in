const puppeteer = require("puppeteer");
const {Session } = require("./src/Session");
const {State } = require("./src/State");
const {Util } = require("./src/Util");
let jsonDocument = {};
(async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();    
    const session = new Session(jsonDocument,page);    
    let finYears = await session.getSessions();    
    session.updateJsonDocument(finYears);    
    const state = new State(page,jsonDocument,"","");
    let states = await state.getStates();    
    state.updateJsonDocument(states);
    console.log(jsonDocument);        
})();