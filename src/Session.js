/**
 * Session specific file.
 * Read and write all session in following format.
 * {
 * "<session-name>":{}
 * }
 */
const {Util} = require("./Util");
class Session {
    constructor(json) {
        this.json = json;
        this.SELECTOR = 'select[id="planYearId"]';
    }

    setSession(sessionArr) {
        if (sessionArr instanceof Array) {
            sessionArr.forEach((value, index) => {
                this.json[value] = {};
            });
        } else {
            throw new Error("Not a valid Array");
        }
    }
    async  changeSession(page, session) {
        await Util.changeSelectElmValue(page, this.SELECTOR, session);
    }
    async getSessions(page) {
        let sessions = await Util.getSelectElmOptions(page, this.SELECTOR);
        console.log(sessions);
        return sessions;
    }
}
    
exports.Session = Session;