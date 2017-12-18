const { State } = require("./State");
test("Test update jsonDocument", () => {
    const jsonDocumentBefore = {
        '2015-2016': { value: '2015-2016', states: {} },
        '2016-2017': { value: '2016-2017', states: {} },
        '2017-2018': { value: '2017-2018', states: {} }
    };
    const states = [{
        "text":"UP",value:1
    },
    {
        "text":"UK",value:2
    }]
    const jsonDocumentAfter = {
        '2015-2016': { value: '2015-2016', states: {
            "UP":{
                "value":1,
                planUnit:{}
            },
            "UK":{
                "value":2,
                planUnit:{}
            }
        } },
        '2016-2017': { value: '2016-2017', states: {
            "UP":{
                "value":1,
                planUnit:{}
            },
            "UK":{
                "value":2,
                planUnit:{}
            }
        } },
        '2017-2018': { value: '2017-2018', states: {
            "UP":{
                "value":1,
                planUnit:{}
            },
            "UK":{
                "value":2,
                planUnit:{}
            }
        } }
    };
    const state = new State("", jsonDocumentBefore, "", "");
    state.updateJsonDocument(states);
    expect(state.json).toEqual(jsonDocumentAfter);
})