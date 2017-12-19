
/**
 * PlanUnit of State
 */
const { Base } = require("./Base");
const { State } = require("./State");
const { Util } = require("./Util");
class PlanUnit extends Base {
    constructor(json, page) {
        super(json, page);
        this.listeners = {};
        this.subscribe();
        this.statePromiseResolve = null;
        this.statePromiseReject = null;
        this.timeoutId = null;
    }
    /**
     * 
     * @param {String} finYear      
     */
    async fetchAndSet(finYear) {
        await this.goto();
        const states = this.json[finYear]['states'];
        const stateNames = Object.keys(states);
        for (let i = 0; i < stateNames.length; i++) {
            try {
                const statePlanUnit = await this.changeState(this.page, states[stateNames[i]]);
                states[stateNames[i]]['planUnit']['gramPanchayat'] = statePlanUnit;
                console.log(statePlanUnit);
            } catch (error) {
                console.log(error);
            }
        }
        return true;
    }
    async changeState(page, state) {
        await State.changeState(page, state);
        return new Promise((resolve, reject) => {
            this.statePromiseResolve = resolve;
            this.statePromiseReject = reject;
            this.timeoutId = setTimeout(() => {
                reject(new Error("Planunit request timeout."));
            }, PlanUnit.REQUEST_TIMEOUT);
        });
    }

    updateJsonDocument(finYearStr, stateStr, planUnit) {
        this.json[finYearStr]['states'][stateStr]['planUnit'] = planUnit;
    }
    async onResponse(reqUrl) {
        console.log("**************PageUnit****************");
        let planUnits = await Util.getSelectElmOptions(this.page, PlanUnit.SELECTOR);
        console.log(planUnits);
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

    printUrl(url) {
        console.log(url);
    }

    subscribe() {
        this.listeners['onResponse'] = [this.onResponse];
    }
}
PlanUnit.SELECTOR = 'select[id="forwardedToType"]';
// TODO this should be part of config.
PlanUnit.REQUEST_TIMEOUT = 5 * 1000;
exports.PlanUnit = PlanUnit;