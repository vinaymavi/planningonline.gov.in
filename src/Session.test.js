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
    const sessionArr = ["2016-2017", "2017-2018"];
    const afterJson = {
        "2016-2017": {},
        "2017-2018": {}
    }
    session.setSession(sessionArr);
    expect(session.json).toEqual(afterJson);
});

test("Not a valid session array",()=>{
    const session = new Session({});    
    expect(session.setSession).toThrowError(Error);
});