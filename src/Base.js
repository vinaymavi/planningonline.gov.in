/**
 * Base class that have comman features.
 */
const jsonfile = require('jsonfile');
const { Util } = require("./Util");
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
            //   TODO this should be part of configuration.
            if (req.url.search(/\.js$|\.css$|\.png$|\.gif$/) < 0) {
                console.log("#############-Request-#############");
                console.log(`Method = ${req.method} , URL = ${req.url}`);
            }

        });
        this.page.on('response', async (res) => {
            if (res.url.search(/\.js$|\.css$|\.png$|\.gif$/) < 0) {
                console.log("#############-Response-#############");
                console.log(`Method = ${res.method},URL = ${res.url},Status=${res.status}`);
                // const text = await res.text();
                await Util.wait();
                // console.log(text);
                if (typeof this.listeners !== "undefined" && this.listeners["onResponse"] instanceof Array) {
                    this.listeners["onResponse"].forEach((listener) => {
                        // TODO: why we need to pass this specifically.
                        listener.call(this, res.url);
                    })
                }
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
        return new Promise((resolve,reject)=>{
            jsonfile.writeFile(file, this.json, function (err) {
                if (err) {
                    console.error(err)
                    reject();
                }else{
                    resolve();
                }
            });
        });        
    }
}

exports.Base = Base;