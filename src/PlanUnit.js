
/**
 * PlanUnit of State
 */
const { Base } = require("./Base");
const { State } = require("./State");
const { Util } = require("./Util");
const puppeteer = require("puppeteer");
class PlanUnit extends Base {
    constructor(json, page) {
        super(json, page);
        this.listeners = {};
        // this.subscribe();
        this.statePromiseResolve = null;
        this.statePromiseReject = null;
        this.timeoutId = null;
    }
    /**
     * 
     * @param {String} finYear      
     */
    async fetchAndSet() {
        const states = this.json['states'];
        const stateNames = Object.keys(states);
        let promises = [];
        const browser =  await puppeteer.launch();
        for (let i = 0; i < stateNames.length; i++) {
            let page = await browser.newPage();
            promises.push(this.changeStateAndGetUnit(page, states[stateNames[i]], State.SELECTOR));
        }
        await Promise.all(promises);
        return true;
    }

    async changeStateAndGetUnit(page, state, selector) {
        await this.gotoPage(page);
        try {
            await Util.changeState.call(this, page, state, selector);
            await Util.wait();
            const statePlanUnit = await this.getPlanUnit(page);
            state['planUnit']['gramPanchayat'] = statePlanUnit;
            console.log(statePlanUnit);
            await page.console();
        } catch (error) {
            console.log(error);
        }
    }

    updateJsonDocument(stateStr, planUnit) {
        this.json['states'][stateStr]['planUnit'] = planUnit;
    }
    async onResponse(reqUrl) {
        console.log("**************PageUnit****************");
        if (reqUrl.indexOf("PlanUnit") > -1) {
            let planUnits = await Util.getSelectElmOptions(this.page, PlanUnit.SELECTOR);
            let planUnitObj = { "districts": {} };
            planUnits.forEach((planUnit) => {
                if (planUnit.value.indexOf("G-3") > -1) {
                    planUnitObj['name'] = planUnit.text;
                    planUnitObj['value'] = planUnit.value;
                    this.statePromiseResolve(planUnitObj);
                    clearTimeout(this.timeoutId);
                }
            });
        }
    }

    async getPlanUnit(page) {
        page = page ? page : this.page;
        let planUnits = await Util.getSelectElmOptions(page, PlanUnit.SELECTOR);
        let planUnitObj = { "districts": {} };
        planUnits.forEach((planUnit) => {
            if (planUnit.value.indexOf("G-3") > -1) {
                planUnitObj['name'] = planUnit.text;
                planUnitObj['value'] = planUnit.value;
            }
        });
        return planUnitObj;
    }

    subscribe() {
        this.listeners['onResponse'] = [this.onResponse];
    }
}
PlanUnit.SELECTOR = 'select[id="forwardedToType"]';
// TODO this should be part of config.
exports.PlanUnit = PlanUnit;