/**
 * State realted functions.
 */
const { Util } = require("./Util");
const { Base } = require("./Base");
class State extends Base {
    constructor(page, json, stateName) {
        super(json, page)        
        this.stateName = stateName;
    }
    updateJsonDocument(states) {
        states.forEach((state) => {            
                this.json.states[state.text] = { value: state.value, planUnit: {} };            
        });
    }
    async  getStates() {
        await this.goto();
        let states = await Util.getSelectElmOptions(this.page, State.SELECTOR);
        return states;
    }    
    
}
// All selector should be at config level and should access directly in util.
State.SELECTOR = 'select[id="stateCode"]';

exports.State = State;