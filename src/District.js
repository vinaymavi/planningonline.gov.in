const { Base } = require("./Base")
const { State } = require("./State")
const { Util } = require("./Util")
const { PlanUnit } = require("./PlanUnit")
class District extends Base {
    constructor(json, page) {
        super(json, page)
        this.listeners = {};
        // this.subscribe();
        this.statePromiseResolve = null;
        this.statePromiseReject = null;
        this.timeoutId = null;
    }

    async fetchAndSet() {
        await this.goto();
        const states = this.json['states'];
        const stateNames = Object.keys(states);
        await Util.wait();
        for (let i = 0; i < stateNames.length; i++) {
            try {
                const state = states[stateNames[i]];
                console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
                await Util.changeState.call(this, this.page, state, State.SELECTOR);
                await Util.wait();
                if (typeof state['planUnit']['gramPanchayat'] !== "undefined") {
                    await Util.changePlanUnit.call(this, this.page, state['planUnit']['gramPanchayat'], PlanUnit.SELECTOR);
                    await Util.wait();
                    const districts =  await this.getDistricts();
                    state['planUnit']['gramPanchayat']['districts'] = districts;
                    console.log(districts);
                } else {
                    console.log("No Plan Unit");
                }
                console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            } catch (error) {
                console.log(error);
            }
        }
        return true;
    }

    async onResponse(reqUrl) {
        console.log("**************District-On-Response ****************");
        let districtObj = {};
        if (reqUrl.indexOf("PlanUnit") > -1) {
            this.statePromiseResolve(districtObj);
        }
        else if (reqUrl.indexOf("DistrictPanchayat") > -1) {
            console.log("**************District****************");
            let districtPanchayats = await Util.getSelectElmOptions(this.page, District.SELECTOR);
            console.log(districtPanchayats);
            districtPanchayats.forEach((district) => {
                districtObj[district.text] = {
                    value: district.value,
                    blockPanchayat: {}
                }
            });
            this.statePromiseResolve(districtObj);
        }
        clearTimeout(this.timeoutId);
    }

    async getDistricts() {
        let districtObj = {};
        let districtPanchayats = await Util.getSelectElmOptions(this.page, District.SELECTOR);
        console.log(districtPanchayats);
        districtPanchayats.forEach((district) => {
            districtObj[district.text] = {
                value: district.value,
                blockPanchayat: {}
            }
        });
        return districtObj;
    }

    subscribe() {
        this.listeners['onResponse'] = [this.onResponse];
    }
}
District.SELECTOR = 'select[id="district"]';
exports.District = District;