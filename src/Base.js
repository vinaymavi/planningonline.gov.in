const jsonfile = require('jsonfile');
const { Util } = require("./Util");
const chalk = require('chalk')
class Base {
    // TODO: Need to be abstract class.
    constructor(json, page) {
        this.json = json;
        this.page = page;
        this.URL = "http://planningonline.gov.in/ReportData.do?ReportMethod=getAnnualPlanReport";
        if (typeof page !== 'undefined') {
            this.registerListeners();
        }
    }
    goto() {
        return this.page.goto(this.URL, { waitUntil: "networkidle0" });
    }
    gotoPage(page) {
        return page.goto(this.URL, { waitUntil: "networkidle0" });
    }
    registerListeners() {
        /*Listeners*/
        this.page.on('request', (req) => {
            //   TODO this should be part of configuration.
            if (req.url.search(/\.js$|\.css$|\.png$|\.gif$|System|StateDAO/) < 0) {
                console.log("#############-Request-#############");
                console.log(`Method = ${req.method} , URL = ${req.url}`);
            }

        });
        this.page.on('response', async (res) => {
            if (res.url.search(/\.js$|\.css$|\.png$|\.gif$|System|StateDAO/) < 0) {
                console.log("#############-Response-#############");
                console.log(`Method = ${res.method},URL = ${res.url},Status=${res.status}`);
            }

        });
        this.page.on("error", (error) => {
            console.log(chalk.red("#############-Error-#############"));
            console.log(chalk.red(error.message));
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
    writeFile(name) {
        // TODO: create file in output dir not in src.
        const file = __dirname + '/output/' + (name ? name + '.json' : '/jsonDocument.json');
        console.log(file);
        return new Promise((resolve, reject) => {
            jsonfile.writeFile(file, this.json, function (err) {
                if (err) {
                    console.error(err)
                    reject();
                } else {
                    resolve();
                }
            });
        });
    }
    writeState(name) {
        // TODO: create file in output dir not in src.
        const file = __dirname + '/output/' + (name ? name + '.json' : '/jsonDocument.json');
        let json = { "states": {} };
        json.states[name] = this.json['states'][name];
        return new Promise((resolve, reject) => {
            jsonfile.writeFile(file, json, function (err) {
                if (err) {
                    console.error(err)
                    reject();
                } else {
                    resolve();
                }
            });
        });
    }
    clickGetReport() {
        return  this.SUBMIT_BUTTON_SELECTOR && Util.triggerClick.call(this, page, this.SUBMIT_BUTTON_SELECTOR);
    }
}

exports.Base = Base;