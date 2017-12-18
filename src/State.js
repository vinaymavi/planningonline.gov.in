/**
 * State realted functions.
 */
const {Util} = require("./Util");

class State{
    
    constructor(page,json,session,stateName){
         this.page = page;
         this.json = json;
         this.session = session;
         this.stateName = stateName;
         this.SELECTOR = 'select[id="stateCode"]';
    }
    async  getStates() {
        let states = await Util.getSelectElmOptions(this.page, this.SELECTOR);
        console.log(states);
        return states;
    }
    async  changeState(state) {  
        await Util.changeSelectElmValue(this.page, this.SELECTOR, state.value);
    }
}

exports.State = State;