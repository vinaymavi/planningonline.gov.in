/**
 * All utitliy functions
 */
class Util{
    constructor(){
    }

    static async getSelectElmOptions(page, selector) {
        console.log("**************-SelectOptions-**************");
        console.log(`Selector =${selector}`);
        return page.$eval(selector, (el)=> {
            let options = [];
            el.querySelectorAll('option').forEach((e)=> {
                if (typeof e.value === "string" && e.value.trim() !== "Select" && e.value.trim().length) {
                    options.push({"text": e.innerText, "value": e.value});
                }
            });
            return options;
        });
    }
    static async changeSelectElmValue(page, selector, value) {
        console.log("**************-ChangeOptions-**************");
        console.log(`Selector =${selector}`);
        console.log(`Value = ${value}`);
        return page.$eval(selector, (el, value)=> {
            el.value = value;
            el.onchange();
        }, value);
    }
}

exports.Util = Util;