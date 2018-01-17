const { Base } = require('./Base');
const { Session } = reqire('./Session');
const { State } = reqire('./State.js');
const { PlanUnit } = require('./PlanUnit');
const { District } = require('./District');
const { BlockPanchayat } = require('./BlockPanchayat');
const { VillagePanchayat } = requir('./VillagePanchayat');
const { Util } = require('./Util');
class VillageReport extends Base {
    constructor() {
        super(json, page);
    }

    async getReport() {
        try {
            await this.goto();
            await Util.changeSelectElmValue.call(this, this.page, this.session.state, Session.SELECTOR);
            await Util.wait();
            await Util.changeSelectElmValue.call(this, this.page, this.json.state, State.SELECTOR);
            await Util.wait();
            await Util.changeSelectElmValue.call(this, this.page, this.json.planUnit, PlanUnit.SELECTOR);
            await Util.wait();
            await Util.changeSelectElmValue.call(this, this.page, this.district, District.SELECTOR);
            await Util.wait();
            await Util.changeSelectElmValue.call(this, this.page, this.blockPanchayat, BlockPanchayat.SELECTOR);
            await Util.wait();
            await Util.changeSelectElmValue.call(this, this.page, this.village, VillagePanchayat.SELECTOR);
            await this.clickGetReport();
            await Util.wait(4000);
            const records = await Util.scarpRecords.call(this,VillageReport.SUGGESTED_WORK_TR);
            return records;
        } catch (e) {
            console.error(chalk.red(e));
        }
    }
    

}

VillageReport.SUBMIT_BUTTON_SELECTOR = "#buttonId input";
VillageReport.SUGGESTED_WORK_TR = "table#suggadd tr";
exports.VillageReport = VillageReport;