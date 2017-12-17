/**
 * Session specific file.
 * Read and write all session in following format.
 * {
 * "<session-name>":{}
 * }
 */
class Session {
    constructor(json) {
        this.json = json;
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
}

exports.Session = Session;