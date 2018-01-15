const { BlockPanchayat } = require('./BlockPanchayat');
const { Base } = require("./Base");
const { Util } = require("./Util");
const { State } = require("./State");
const { PlanUnit } = require("./PlanUnit");
const { District } = require('./District');
const chalk = require('chalk')
class VillagePanchayat extends Base {
    constructor(json, page) {
        super(json);
    }

    async fetchAndSet(stateName, page) {
        this.page = page ? page : this.page;
        try {
            await this.goto();
            // TODO code looks complex need to improve.
            const state = this.json['states'][stateName];
            await Util.changeState.call(this, this.page, state, State.SELECTOR);
            await Util.wait();
            await Util.changePlanUnit.call(this, this.page, state['planUnit']['gramPanchayat'], PlanUnit.SELECTOR);
            await Util.wait();
            if (typeof state['planUnit']['gramPanchayat'] != 'undefined') {
                const districts = state['planUnit']['gramPanchayat']['districts'];
                const districtNames = Object.keys(districts);
                for (let j = 0; j < districtNames.length; j++) {
                    let district = districts[districtNames[j]];
                    await Util.changeDistrict.call(this, this.page, district, District.SELECTOR);
                    await Util.wait();
                    const blockPanchayat = district.blockPanchayat;
                    if (blockPanchayat.length) {
                        for (let k = 0; k < blockPanchayat.length; k++) {
                            await Util.changeSelectElmValue.call(this, this.page, BlockPanchayat.SELECTOR,blockPanchayat[k].value);
                            await Util.wait();
                            const villages = await Util.getSelectElmOptions(this.page,VillagePanchayat.SELECTOR);
                            blockPanchayat[k].villages = villages;   
                        }
                    }
                }
            }
        } catch (e) {
            console.error(chalk.red(e));
        }
    }
}

VillagePanchayat.SELECTOR = 'select[id="village"]'
exports.VillagePanchayat = VillagePanchayat;