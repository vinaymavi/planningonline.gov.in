
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
        await this.goto();
        const states = this.json['states'];
        const stateNames = Object.keys(states);
        for (let i = 0; i < stateNames.length; i++) {
            try {
                await Util.changeState.call(this, this.page, states[stateNames[i]], State.SELECTOR);
                await Util.wait();
                const statePlanUnit = await this.getPlanUnit();
                states[stateNames[i]]['planUnit']['gramPanchayat'] = statePlanUnit;
                console.log(statePlanUnit);
            } catch (error) {
                console.log(error);
            }
        }
        return true;
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

    async getPlanUnit() {
        let planUnits = await Util.getSelectElmOptions(this.page, PlanUnit.SELECTOR);
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