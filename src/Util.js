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
            console.log("Changed Value = " + el.value);
            el.onchange();
        }, value);
    }
    // TODO: this change function should be part of Base class when a class need can overide it.
    static async changeState(page, state, selector) {
        return Util.changeSelectElmValue(page, selector, state.value);
    }
    static async changePlanUnit(page, planUnit, selector) {
        return Util.changeSelectElmValue(page, selector, planUnit.value);
    }
    static async changeDistrict(page, distrit, selector) {
        return Util.changeSelectElmValue(page, selector, distrit.value);
    }

    static async triggerClick(page, selector) {
        return page.$eval(selector, (el) => {
            el.click();
        });
    }
    static async scarpRecords(selector) {
        return page.$eval(selector, (el) => {
            let records = {
                rows: [],
                total: 0,
                status: "OK",
                msg: ""
            };
            const tableRows = document.querySelectorAll(selector);
            if (tableRows && tableRows.length) {
                for (let i = 0; i < tableRows.length; i++) {
                    let tableRow = tableRows[i];
                    let row ;
                    let tableTd = tableRow.querySelectorAll('td');
                    if (tableTd.length) {                        
                        tableTd.forEach((td, index) => {
                            row = {};
                            switch (index) {
                                case 0:
                                    row.activity = td.textContent;
                                    break;
                                case 1:
                                    row.approved = td.textContent && td.textContent.toLowerCase() === 'yes' ? true : false;
                                    break;
                                case 2:
                                    row.location = td.textContent;
                                    break;
                                case 3:
                                    row.cost = td.textContent;
                                    records.total += row.cost;
                                    break;
                                case 4:
                                    row.source = td.textContent;
                                    break;
                                case 5:
                                    row.agency = td.textContent;
                                    break;
                                default:
                            }
                        });
                        row && records.rows.push(row);
                    }
                }
            } else {
                records.status = "ERROR";
                records.msg = "No Record found";
            }
            return records;
        });
    }

    static wait(waitForSec) {
        waitForSec = waitForSec ? waitForSec : 2000;
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve("OK");
            }, 2000);
        });
    }
}

exports.Util = Util;