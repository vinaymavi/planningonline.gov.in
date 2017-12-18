const { Session } = require('./Session');

test("Session created", () => {
    const session = new Session({});
    expect(session).toBeInstanceOf(Session);
});

test("JSON values assigned correctly", () => {
    const session = new Session({});
    expect(session.json).toEqual({});
});

test("Set Session Array", () => {
    const session = new Session({});
    const jsonDocumentBefore = [
        { "text": "2016-2017", "value": "2016-2017" },
        { "text": "2017-2018", "value": "2017-2018" }];
    const jsonDocumentAfter = {        
        '2016-2017': { value: '2016-2017', states: {} },
        '2017-2018': { value: '2017-2018', states: {} }
    };
    session.updateJsonDocument(jsonDocumentBefore);
    expect(session.json).toEqual(jsonDocumentAfter);
});

test("Not a valid session array", () => {
    const session = new Session({});
    expect(session.updateJsonDocument).toThrowError(Error);
});