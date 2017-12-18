/**
 * Base class that have comman features.
 */

class Base {
    constructor(json, page) {
        this.json = json;
        this.page = page;
        this.URL = "http://planningonline.gov.in/ReportData.do?ReportMethod=getAnnualPlanReport";
    }
    goto(){
        return this.page.goto(this.URL, {waitUntil: "networkidle0"});
    }
}

exports.Base = Base;