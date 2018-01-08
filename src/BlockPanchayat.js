
const { Base } = require("./Base");
const { Util } = require("./Util");
const { State } = require("./State");
const { PlanUnit } = require("./PlanUnit");
const { District } = require('./District');
const chalk = require('chalk')
class BlockPanchayat extends Base {
    constructor(json, page) {
        super(json, page);
        // TODO next five line should be Base class.
        this.listeners = {};
        // this.subscribe();
        this.statePromiseResolve = null;
        this.statePromiseReject = null;
        this.timeoutId = null;
    }

    async fetchAndSet(stateName, page) {
        this.page = page ? page : this.page;
        await this.goto();
        try {
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
                    const blockPanchayats = await this.getBlockPanchayats();
                        district['blockPanchayat'] = blockPanchayats;
                    console.log(blockPanchayats);
                }
            }
        } catch (e) {
            console.error(chalk.red(e));
        }
    }
    async onResponse(reqUrl) {
        console.log(chalk.yellow("**************BlockPanchayats-On-Response ****************"));
        console.log(reqUrl);
        let blockObj = {};
        if (reqUrl.indexOf("PlanUnit") > -1 || reqUrl.indexOf("DistrictPanchayat") > -1) {
            this.statePromiseResolve(blockObj);
            clearTimeout(this.timeoutId);
        }
        else if (reqUrl.indexOf("BlockPanchayats") > -1) {
            console.log(chalk.yellow("**************BlockPanchayats****************"));
            let blockPanchayats = await Util.getSelectElmOptions(this.page, BlockPanchayat.SELECTOR);
            blockPanchayats.forEach((block) => {
                blockObj[block.text] = {
                    value: block.value,
                    villages: {}
                }
            });
            this.statePromiseResolve(blockObj);
            clearTimeout(this.timeoutId);
        }
    }
    async getBlockPanchayats() {
        let blockObj = {};
        let blockPanchayats = await Util.getSelectElmOptions(this.page, BlockPanchayat.SELECTOR);
        blockPanchayats.forEach((block) => {
            blockObj[block.text] = {
                value: block.value,
                villages: {}
            }
        });
        return blockPanchayats;
    }
    subscribe() {
        this.listeners['onResponse'] = [this.onResponse];
    }
}

BlockPanchayat.SELECTOR = 'select[id="block"]';
exports.BlockPanchayat = BlockPanchayat;