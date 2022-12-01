const refs = {
    buttonStart: document.querySelector("#start"),
    buttonNew: document.querySelector("#new"),
    mainDiv: document.querySelector(".game"),
    points: document.querySelector(".points"),
    timeLeft: document.querySelector(".time-left"),
    score: document.querySelector(".score"),
    form: document.querySelector(".form"),
    label: document.querySelector(".label"),
    input: document.querySelector(".input"),
    buttonSubmit: document.querySelector(".button"),
    modal: document.querySelector(".backdrop"),
    body: document.querySelector("body"),
    result: document.querySelector(".results"),
    buttonClear: document.querySelector(".button-clear")

}
let points = 0;
let intervalId = null;
const KEY = 'localKey';
function getRandomHexColor() {
    return `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, 0)}`;
}

function CreateCubics() {
    let boxSizes = 55;
    let boxes = [];

    for (let i = 0; i < 14; i++) {
        const listDiv = document.createElement("div");
        listDiv.style.width = `${boxSizes}px`;
        listDiv.style.height = `${boxSizes}px`;
        listDiv.style.backgroundColor = getRandomHexColor()
        listDiv.classList.add("game__item");
        listDiv.addEventListener("click", (e) => {
            const { nodeName } = e.target;
            if (nodeName !== "DIV") return;
            listDiv.classList.add("hidden")
            points++;
            refs.points.textContent = `Points:${points}`
            if (points % 14 === 0) {
                CreateCubics();
            }
        })
        boxes.push(listDiv);
    }
    refs.mainDiv.innerHTML = "";
    refs.mainDiv.prepend(...boxes);
}
function addLeadingZero(value) {
    return String(value).padStart(2, '0');
}
function interval() {
    let m = 1;
    intervalId = setInterval(() => {
        if (refs.timeLeft.textContent === "Time-left:00:00") {
            refs.mainDiv.innerHTML = "";
            clearInterval(intervalId);
            points > 0 ? refs.modal.classList.remove("hidden") :
                refs.mainDiv.innerHTML = "<h1>No Scores</h1>";
            return refs.score.textContent = `Your Score :  ${points}`;
        }
        return refs.timeLeft.textContent = `Time-left:00:${addLeadingZero(m--)}`;
    }, 1000);
}
function getLocalStorage() {
    return JSON.parse(localStorage.getItem(KEY)) || [];
}

function onClickStart(e) {
    points = 0;
    const { nodeName } = e.target;
    if (nodeName !== "BUTTON") return;
    refs.modal.classList.add("hidden");
    refs.mainDiv.innerHTML = "";
    refs.buttonStart.disabled = true;
    CreateCubics();
    interval();
    return refs.timeLeft.textContent = "Time-left:01:00";
}
function OnNewGame(e) {
    points = 0;
    refs.modal.classList.add("hidden");
    refs.mainDiv.innerHTML = "";
    refs.buttonStart.disabled = true;
    CreateCubics();
    refs.timeLeft.textContent = "Time-left:01:00";
    clearInterval(intervalId);
    return interval();
}

function onSubmit(e) {
    e.preventDefault();
    let localStorageObj = getLocalStorage();
    if (refs.input.value.length > 0) {
        refs.buttonStart.disabled = false;
        refs.modal.classList.add("hidden");
        localStorageObj.push(`Player=${refs.input.value.toUpperCase()}|| points = ${points}`);
        const stringifiedData = JSON.stringify(localStorageObj);
        localStorage.setItem(KEY, stringifiedData);
        SaveToStorage();
    }

    e.currentTarget.reset();
}
function SaveToStorage() {
    let localStorageObj = getLocalStorage();
    if (localStorageObj.length > 0) {
        refs.result.innerHTML = "";
        refs.buttonClear.classList.remove("hidden");
        return refs.result.insertAdjacentHTML("beforeend", localStorageObj.map((el) => `<li>${el}</li>`).join(""))
    }
}
function onClickClear(e) {
    const { nodeName } = e.target;
    if (nodeName !== "BUTTON") return;
    localStorage.removeItem(KEY);
    refs.result.innerHTML = "";
    refs.buttonClear.classList.add("hidden");
}
SaveToStorage();
refs.buttonStart.addEventListener("click", onClickStart);
refs.buttonNew.addEventListener("click", OnNewGame);
refs.form.addEventListener("submit", onSubmit);
refs.buttonClear.addEventListener("click", onClickClear);
