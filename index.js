const puppeteer = require("puppeteer");
const { Session } = require("./src/Session");
const { State } = require("./src/State");
const { Util } = require("./src/Util");
const { PlanUnit } = require("./src/PlanUnit");
const { District } = require("./src/District");
const { BlockPanchayat } = require("./src/BlockPanchayat")
const chalk = require('chalk')
let jsonDocument = {};
(async () => {
    const browser = await puppeteer.launch();
    let page = await browser.newPage();
    const session = new Session(jsonDocument, page);
    let finYears = await session.getSessions();
    session.updateJsonDocument(finYears);
    const state = new State(page, jsonDocument, "");
    let states = await state.getStates();
    state.updateJsonDocument(states);
    await state.writeFile("states.json");
    await page.close();
    page = await browser.newPage();
    const planUnit = new PlanUnit(jsonDocument, page);
    await planUnit.fetchAndSet();
    await planUnit.writeFile('planunit.json');
    await page.close();
    page = await browser.newPage();
    const district = new District(jsonDocument, page);
    await district.fetchAndSet();
    district.writeFile("district.json");
    const tempDoc = {
        "states": {
            "ANDAMAN AND NICOBAR ISLANDS": {
                "value": "35",
                "planUnit": {
                    "gramPanchayat": {
                        "districts": {
                            "NICOBARS": {
                                "value": "553",
                                "blockPanchayat": {}
                            },
                            "NORTH AND MIDDLE ANDAMAN": {
                                "value": "576",
                                "blockPanchayat": {}
                            },
                            "SOUTH ANDAMANS": {
                                "value": "552",
                                "blockPanchayat": {}
                            }
                        },
                        "name": "Gram Panchayat",
                        "value": "G-3-2-0-0"
                    }
                }
            },
            "ANDHRA PRADESH": {
                "value": "28",
                "planUnit": {
                    "gramPanchayat": {
                        "districts": {
                            "ANANTAPUR": {
                                "value": "458",
                                "blockPanchayat": {}
                            },
                            "CHITTOOR": {
                                "value": "459",
                                "blockPanchayat": {}
                            },
                            "EAST GODAVARI": {
                                "value": "461",
                                "blockPanchayat": {}
                            },
                            "GUNTUR": {
                                "value": "462",
                                "blockPanchayat": {}
                            },
                            "KRISHNA": {
                                "value": "465",
                                "blockPanchayat": {}
                            },
                            "KURNOOL": {
                                "value": "466",
                                "blockPanchayat": {}
                            },
                            "PRAKASAM": {
                                "value": "472",
                                "blockPanchayat": {}
                            },
                            "SPSR NELLORE": {
                                "value": "470",
                                "blockPanchayat": {}
                            },
                            "SRIKAKULAM": {
                                "value": "474",
                                "blockPanchayat": {}
                            },
                            "VISAKHAPATANAM": {
                                "value": "475",
                                "blockPanchayat": {}
                            },
                            "VIZIANAGARAM": {
                                "value": "476",
                                "blockPanchayat": {}
                            },
                            "WEST GODAVARI": {
                                "value": "478",
                                "blockPanchayat": {}
                            },
                            "Y.S.R.": {
                                "value": "460",
                                "blockPanchayat": {}
                            }
                        },
                        "name": "Grama Panchayat",
                        "value": "G-3-2-0-0"
                    }
                }
            },
            "ARUNACHAL PRADESH": {
                "value": "12",
                "planUnit": {
                    "gramPanchayat": {
                        "districts": {
                            "ANJAW": {
                                "value": "572",
                                "blockPanchayat": {}
                            },
                            "CHANGLANG": {
                                "value": "220",
                                "blockPanchayat": {}
                            },
                            "DIBANG VALLEY": {
                                "value": "221",
                                "blockPanchayat": {}
                            },
                            "EAST KAMENG": {
                                "value": "222",
                                "blockPanchayat": {}
                            },
                            "EAST SIANG": {
                                "value": "223",
                                "blockPanchayat": {}
                            },
                            "KRA DAADI": {
                                "value": "274254",
                                "blockPanchayat": {}
                            },
                            "KURUNG KUMEY": {
                                "value": "224",
                                "blockPanchayat": {}
                            },
                            "LOHIT": {
                                "value": "225",
                                "blockPanchayat": {}
                            },
                            "LONGDING": {
                                "value": "262016",
                                "blockPanchayat": {}
                            },
                            "LOWER DIBANG VALLEY": {
                                "value": "226",
                                "blockPanchayat": {}
                            },
                            "LOWER SUBANSIRI": {
                                "value": "227",
                                "blockPanchayat": {}
                            },
                            "NAMSAI": {
                                "value": "274256",
                                "blockPanchayat": {}
                            },
                            "PAPUM PARE": {
                                "value": "228",
                                "blockPanchayat": {}
                            },
                            "SIANG": {
                                "value": "274255",
                                "blockPanchayat": {}
                            },
                            "TAWANG": {
                                "value": "229",
                                "blockPanchayat": {}
                            },
                            "TIRAP": {
                                "value": "230",
                                "blockPanchayat": {}
                            },
                            "UPPER SIANG": {
                                "value": "231",
                                "blockPanchayat": {}
                            },
                            "UPPER SUBANSIRI": {
                                "value": "232",
                                "blockPanchayat": {}
                            },
                            "WEST KAMENG": {
                                "value": "233",
                                "blockPanchayat": {}
                            },
                            "WEST SIANG": {
                                "value": "234",
                                "blockPanchayat": {}
                            }
                        },
                        "name": "Gram Panchayat",
                        "value": "G-3-2-0-0"
                    }
                }
            }
        }
    }

    let blockPanchayat;
    const stateNames = Object.keys(jsonDocument['states']);
    for (let i = 0; i < stateNames.length; i++) {
        await page.close();
        page = await browser.newPage();
        console.log(chalk.green("################ Start - "+stateNames[i]+" Start - ################        "));
        blockPanchayat = new BlockPanchayat(jsonDocument, page);
        await blockPanchayat.fetchAndSet(stateNames[i], page);
        await blockPanchayat.writeState(stateNames[i]);
        console.log(chalk.green("################ End - "+stateNames[i]+"- End - ################        "))
    }

    console.log("File Write Starting");
    await blockPanchayat.writeFile();
    console.log("File Write Successfully.");
    process.exit();
})();