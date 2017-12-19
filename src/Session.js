/**
 * Session specific file.
 * Read and write all session in following format.
 * {
 * "<session-name>":{}
 * }
 */
const {Util} = require("./Util");
const {Base} = require("./Base");
class Session extends Base{
    constructor(json,page) {
        super(json,page);        
    }

    updateJsonDocument(financialYears) {
        if (financialYears instanceof Array) {
            financialYears.forEach((year, index) => {
                this.json[year.text] = {'value':year.value,"states":{}};                
            });
        } else {
            throw new Error("Not a valid Array");
        }
    }

    static async  changeSession(page , session) {
        await Util.changeSelectElmValue(page, Session.SELECTOR, session);
    }
    async getSessions() {
        await this.goto();
        let sessions = await Util.getSelectElmOptions(this.page, Session.SELECTOR);        
        return sessions;
    }
}

Session.SELECTOR = 'select[id="planYearId"]';
    
exports.Session = Session;