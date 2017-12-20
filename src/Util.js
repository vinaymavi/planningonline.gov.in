/**
 * All utitliy functions
 */
class Util {
    constructor() {
    }

    static async getSelectElmOptions(page, selector) {
        console.log("**************-SelectOptions-**************");
        console.log(`Selector =${selector}`);
        return page.$eval(selector, (el) => {
            let options = [];
            el.querySelectorAll('option').forEach((e) => {
                if (typeof e.value === "string" && e.value.trim() !== "Select" && e.value.trim().length) {
                    options.push({ "text": e.innerText, "value": e.value });
                }
            });
            return options;
        });
    }
    static async changeSelectElmValue(page, selector, value) {
        console.log("**************-ChangeOptions-**************");
        console.log(`Selector =${selector}`);
        console.log(`Value = ${value}`);
        return page.$eval(selector, (el, value) => {
            el.value = value;
            el.onchange();
        }, value);
    }

    static async changeState(page, state, selector) {
        await Util.changeSelectElmValue(page, selector, state.value);
        return new Promise((resolve, reject) => {
            this.statePromiseResolve = resolve;
            this.statePromiseReject = reject;
            this.timeoutId = setTimeout(() => {
                reject(new Error("Request timeout."));
            }, 3 * 1000);
        });
    }
    static async changePlanUnit(page, planUnit, selector) {
        await Util.changeSelectElmValue(page, selector, planUnit.value);
        return new Promise((resolve, reject) => {
            this.statePromiseResolve = resolve;
            this.statePromiseReject = reject;
            this.timeoutId = setTimeout(() => {
                reject(new Error("Request timeout."));
            }, 10 * 1000);
        });
    }
    static  wait(){
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve("OK");
            },2000);
        })
    }
}

exports.Util = Util;