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
    }
    updateJsonDocument(states) {
        const finYears = Object.keys(this.json);
        finYears.forEach((finYear)=>{
                this.updateFinYearStates(finYear,states);
        });
    }
    async  getStates() {
        await this.goto();
        let states = await Util.getSelectElmOptions(this.page, State.SELECTOR);        
        return states;
    }
    /**
     * 
     * @param {Object} state 
     * @description state = {"text":"<text>","value":<value>}
     */
    static async  changeState(page,state) {
        await Util.changeSelectElmValue(page, State.SELECTOR, state.value);
    }

    updateFinYearStates(finYear,states){
        states.forEach((state)=>{
            this.json[finYear].states[state.text] = {value:state.value,planUnit:{}};    
        });  
    }
}
State.SELECTOR = 'select[id="stateCode"]';

exports.State = State;