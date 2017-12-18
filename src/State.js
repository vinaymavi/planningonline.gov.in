/**
 * State realted functions.
 */
const { Util } = require("./Util");
const {Base} = require("./Base");
class State extends Base{
    constructor(page, json, finYears, stateName) {
        super(json,page)        
        this.finYears = finYears;
        this.stateName = stateName;
        this.SELECTOR = 'select[id="stateCode"]';
    }
    updateJsonDocument(states) {
        const finYears = Object.keys(this.json);
        finYears.forEach((finYear)=>{
                this.updateFinYearStates(finYear,states);
        });
    }
    async  getStates() {
        await this.goto();
        let states = await Util.getSelectElmOptions(this.page, this.SELECTOR);
        console.log(states);
        return states;
    }
    async  changeState(state) {
        await Util.changeSelectElmValue(this.page, this.SELECTOR, state.value);
    }

    updateFinYearStates(finYear,states){
        states.forEach((state)=>{
            this.json[finYear].states[state.text] = {value:state.value,planUnit:{}};    
        });  
    }
}

exports.State = State;