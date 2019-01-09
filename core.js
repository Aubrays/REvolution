///////////////////
// Global variables
///////////////////

let HISTORY = 0;
let TIMER = 0;
let FIRSTNAME = "";
let ACTUALPASSAGE = "000";
let LOCALHISTORY = 0;
let PERSO = {};
let PNJS = [];

//////////////////
// Classes
//////////////////

class App {
    constructor(name, shortName, icon, status, content) {
        this.name = name;
        this.shortName = shortName;
        this.icon = icon; // url
        this.status = status || "uninstalled";
        this.content = content;
    }
}

class Passage {
    constructor(id, content) {
        this.id = id;
        this.content = content;
    }
}

class Perso {
    constructor(archetype, description, charism, intimidation, intelligence, genre) {
        this.archetype = archetype;
        this.description = description;
        this.charism = charism;
        this.intimidation = intimidation;
        this.intelligence = intelligence;
        this.genre = genre;
    }
}

class Pnj {
    constructor(name, limitation, passages, repauto, description){
        this.name = name;
        this.description = description;
        this.limitation = limitation || "";
        this.passages = passages || "";
        this.repauto = repauto;
    }
}

/////////////////
// Instances
/////////////////

// Instances of App
let appsData = document.getElementsByTagName("al-app");
let apps = [];
for(let appData of appsData){
    // get data
    let appName = appData.getAttribute("data-app-name");
    let appShortName = appData.getAttribute("data-app-shortName");
    let appStatus = appData.getAttribute("data-app-status");
    let appIcon = appData.getAttribute("data-app-icon");
    let appContent = appData.innerHTML;
    // create object
    let app = new App(appName, appShortName, appIcon, appStatus, appContent)
    apps.push(app);
}

// Instances of Passage
let passagesData = document.getElementsByTagName("al-passage");
let passages = [];
for(let passageData of passagesData){
    // get data
    let passageId = passageData.getAttribute("data-passage-id");
    let passageContent = passageData.innerHTML;
    //create object
    let passage = new Passage(passageId, passageContent);
    passages.push(passage);
}

// Instances of Perso
let persosData = document.getElementsByTagName("al-perso");
let persos = [];
for(let persoData of persosData){
    // get data
    let archetype = persoData.getAttribute("data-perso-archetype");
    let description = persoData.innerHTML;
    let charism = persoData.getAttribute("data-perso-charism");
    let intimidation = persoData.getAttribute("data-perso-intimidation");
    let intelligence = persoData.getAttribute("data-perso-intelligence");
    let genre = persoData.getAttribute("data-perso-genre");
    // create object
    let perso = new Perso(archetype, description, charism, intimidation, intelligence, genre);
    persos.push(perso);
}

// Instances of Pnj
function instancePnjs(){
    let pnjsData = document.getElementsByTagName("al-pnj");

    for(let pnjData of pnjsData){
        // get data
        let name = pnjData.getAttribute("data-pnj-name");
        let limitation = pnjData.getAttribute("data-pnj-limitation");
        let passages = pnjData.getAttribute("data-pnj-passages");
        let repauto = pnjData.innerHTML;
        let description = pnjData.getAttribute("data-pnj-description");
        
        // create object
        let pnj = new Pnj(name, limitation, passages, repauto, description);
        PNJS.push(pnj);
    }
}
///////////////////////
// Interface Elements
//////////////////////

// Phone

let homeScreen = document.getElementById("homeScreen");
let appScreen = document.getElementById("appScreen");
let backBtn = document.getElementById("backBtn");
let btnApp = document.getElementsByClassName("btn-app");
let phone = document.getElementById("phone");

// Game

let passageScreen = document.getElementById("passage");


/////////////////
// The Phone
/////////////////

// Home screen

for (const app of apps){
    if (app.status === "visible"){
        let btnApp = `<button class="btn btn-app" data-app-name="${app.shortName}" title="${app.name}"><i class="${app.icon}"></i></button>`;
        homeScreen.innerHTML += btnApp;
    }
}

for (let btn=0; btn < btnApp.length; btn++) {
    btnApp[btn].addEventListener("click", openApp);
}

// Functions

function openApp(appName){
    if (appName.type === "click"){
        appName = this.getAttribute("data-app-name");
    }
    for (let app of apps){
        if (app.shortName === appName){
            appScreen.innerHTML = `<div id="${app.shortName}">${app.content}</div>`;
        }
        if (appName == "telephone"){
            addEventContacts();
        }
    }
    backBtn.addEventListener("click", closeApp);
    homeScreen.hidden = true;
    backBtn.hidden = false;
    backBtn.style.visibility = "visible";
    appScreen.hidden = false;
}

function closeApp(){
    backBtn.hidden = true;
    appScreen.hidden = true;
    homeScreen.hidden = false;
}

function reloadApp(name){
    let appObject = apps.find(o => o.shortName === name);

    for(let appData of appsData){
        if(appData.dataset.appShortname === name){
            appObject.content = appData.innerHTML;
        }
    }
    appScreen.innerHTML = `<div id="${appObject.shortName}">${appObject.content}</div>`;
}


// Phone App
function loadPhoneApp(){
    instancePnjs();
    let contactsList = document.getElementById("contactsList");
    for(let pnj of PNJS){
        if(pnj.limitation === PERSO.archetype || pnj.limitation === ""){
            contactsList.innerHTML += `<div class="pnj-phone" data-pnj-name="${pnj.name}"><p>${pnj.name}</p><p>${pnj.description}</p></div>`;
        }
    }
    reloadApp("telephone");    
};
function addEventContacts(){
    let btnContact = appScreen.querySelectorAll(".pnj-phone");
    btnContact.forEach(btn => btn.addEventListener("click", callContact));
}

function callContact(){
    let pnjName = this.getAttribute("data-pnj-name");
    let callName = document.getElementById("callName");
    callName.innerHTML = pnjName;
    reloadApp("appel");
    openApp("appel");

    let pnjObject = PNJS.find(o => o.name === pnjName);

    let repauto = passageScreen.querySelector(".repauto");

    if(pnjObject.passages === ACTUALPASSAGE){
        nextStep();
        backBtn.style.visibility = "hidden"; // temp -> need button "terminate"
    }
    else {
        repauto.innerHTML += pnjObject.repauto;
    }
}

// function endCallContact(){
//     openApp(telephone);
// }


///////////////
// The Game
/////////////////

// Start

if (HISTORY === 0){
    passageScreen.innerHTML = passages[0].content;
    addEventNextPassage();
}

// Functions

function addEventNextPassage(){
    let btnPassage = passageScreen.querySelectorAll(".btn-passage");
    btnPassage.forEach(btn => btn.addEventListener("click", changePassage));
}
function addEventNextStep(){
    let btnStep = passageScreen.querySelectorAll(".btn-step");
    btnStep.forEach(btn => btn.addEventListener("click", nextStep));
}

function changePassage(){
    LOCALHISTORY = 0;
    HISTORY++;
    let passageId = this.getAttribute("data-passage-id");
    for (let passage of passages){
        if (passage.id === passageId){
            passageScreen.innerHTML = `<div data-passage-id="${passage.id}">${passage.content}</div>`;
        }
    }
    ACTUALPASSAGE = passageId;
    addEventNextPassage();
}

function reloadPassage(passageId){
    // Display a passageObject content after an update and add the Event "next passage"

    updatePassages();

    let passageObject = passages.find(o => o.id === passageId);
    passageScreen.innerHTML = `<div data-passage-id="${passageObject.id}">${passageObject.content}</div>`;
    addEventNextPassage();
}

function updatePassages(){
    // Update all passagesObject (JS) from rewrited passagesData (HTML).

    for(let passageData of passagesData){
        let passageObject = passages.find(obj => obj.id === passageData.dataset.passageId );
        passageObject.content = passageData.innerHTML;
    }
}

function nextStep(){
    LOCALHISTORY++;
    let steps = document.getElementsByClassName("step");
    for(let step of steps){
        if(step.parentElement.dataset.passageId === ACTUALPASSAGE){
            if(Number(step.dataset.stepPosition) === LOCALHISTORY){
                step.style.display = "block";
            }
        }
    }
}



//////////////////////
// Specific functions
// Generally used one time
/////////////////////

function setFirstname(){
    let firstnameArea = document.getElementById("firstnameArea");
    firstnameValue = passageScreen.querySelector("#firstname").value;

    if(firstnameValue){
        FIRSTNAME = firstnameValue;
        firstnameArea.innerHTML = FIRSTNAME;
        firstnameArea.classList.add("emphasis");

        let firstnameOccurences = document.getElementsByClassName("firstname");
        for(let firstnameOccurence of firstnameOccurences){
            firstnameOccurence.innerHTML = FIRSTNAME;
        }
        reloadPassage("002");
        nextStep();
    }
}

function setPerso(){
    let persoValue = passageScreen.querySelector('input[name="pj"]:checked').value;

    for(let perso of persos){
        if(perso.archetype === persoValue){
            PERSO = perso;
        }
    }

    // Update the passage display.
    let pjArea = document.getElementById("pjArea");
    pjArea.innerHTML = PERSO.description;

    testCaracteristics();
    reloadPassage("002");
    nextStep();
    loadPhoneApp();
    
}

function testCaracteristics(){
    let tests = document.getElementsByClassName("carac-test");

    for(let test of tests){
        let tCharism = test.getAttribute("data-charism");
        let tIntelligence = test.getAttribute("data-intelligence");
        let tIntimidation = test.getAttribute("data-intimidation");
        if(tCharism){
            if (tCharism > PERSO.charism){
                displayResult("default", test);
            }
            else {
                displayResult("success", test);
            }
        }

        if(tIntelligence){
            if (tIntelligence > PERSO.intelligence){
                displayResult("default", test);
            }
            else {
                displayResult("success", test);
            }
        }

        if(tIntimidation){
            if (tIntimidation > PERSO.intimidation){
                displayResult("default", test);
            }
            else {
                displayResult("success", test);
            }
        }
    }

    function displayResult(result, arr){
        for(let child of arr.children){
            if(child.dataset.testResult === result){
                child.style.display = "block";
            }
        }
    }

}

function displayPhone(){
    phone.hidden = false;
}