/**
 * Base class that have comman features.
 */
const jsonfile = require('jsonfile');

class Base {
    // TODO: Need to be abstract class.
    constructor(json, page) {
        this.json = json;
        this.page = page;
        this.URL = "http://planningonline.gov.in/ReportData.do?ReportMethod=getAnnualPlanReport";
        this.registerListeners();
    }
    goto() {
        return this.page.goto(this.URL, { waitUntil: "networkidle0" });
    }
    registerListeners() {
        /*Listeners*/
        this.page.on('request', (req) => {
            console.log("#############-Request-#############");
            console.log(`Method = ${req.method} , URL = ${req.url}`);
        });
        this.page.on('response', (res) => {
            console.log("#############-Response-#############");
            console.log(`Method = ${res.method},URL = ${res.url},Status=${res.status}`);             
            if (typeof this.listeners !== "undefined" && this.listeners["onResponse"] instanceof Array) {
                this.listeners["onResponse"].forEach((listener) => {
                    // TODO: why we need to pass this specifically.
                    listener.call(this, res.url);
                })
            }
        });
        this.page.on("error", (error) => {
            console.log("#############-Error-#############");
            console.log(error.message);
        });
        this.page.on("dialog", (dialog) => {
            console.log("#############-Dialog-#############");
            console.log(dialog);
        });
        this.page.on("console", (_console) => {
            console.log("#############-Console-#############");
            console.log(_console);
        });
    }
    writeFile() {
        // TODO: create file in output dir not in src.
        var file = __dirname + '/jsonDocument.json'
        jsonfile.writeFile(file, this.json, function (err) {
            if (err) {
                console.error(err)
            }
        });
    }
}

exports.Base = Base;