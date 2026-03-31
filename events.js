var loggedInClub = localStorage.getItem("loggedInClub")

if(!loggedInClub){
    alert("please login")
    window.location.href="login.html"
}

var clubs = JSON.parse(localStorage.getItem("clubs")) || []

var currentClub = null;

for(var i =0;i<clubs.length;i++){
    if(clubs[i].clubId === loggedInClub){
        currentClub = clubs[i];
        break;
    }
}

if (!currentClub) {
    alert("Club not found. Please login again.");
    window.location.href = "login.html";
}

    if (!currentClub.events) {
        currentClub.events = [];
    }

var eventButton = document.getElementById("EventButton");
var eventInput = document.getElementById("eventName");
var container = document.getElementById("eventContainer");

var events = currentClub.events;

eventButton.onclick = function () {
    var eventName = eventInput.value;

    if (eventName === ""){
        alert("Please enter an event name");
        return;
    } 
        

    if (events.includes(eventName)) {
        alert("Event already exists");
        return;
    }

    events.push(eventName);
    currentClub.events = events;
    localStorage.setItem("clubs", JSON.stringify(clubs));

    createEventCard(eventName);

    eventInput.value = "";
};

function createEventCard(eventName) {

    var card = document.createElement("div");
    card.className = "card";

    var title = document.createElement("h3");
    title.innerText = eventName;

    var registerButton = document.createElement("button");
    registerButton.innerText = "Register Students";
    registerButton.onclick = function () {
        window.location.href =
            "register.html?event=" + (eventName);
    };

    var attendanceButton = document.createElement("button");
    attendanceButton.innerText = "Take Attendance";
    attendanceButton.onclick = function () {
        window.location.href =
            "attendance.html?event=" + (eventName);
    };

    var deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.onclick = function () {
        card.remove();
        events = events.filter(e => e !== eventName);
        currentClub.events = events;
        localStorage.setItem("clubs", JSON.stringify(clubs));
        localStorage.removeItem(eventName);
    };

    card.appendChild(title);
    card.appendChild(registerButton);
    card.appendChild(attendanceButton);
    card.appendChild(deleteButton);

    container.appendChild(card);
}

for (var i = 0; i < events.length; i++) {
    createEventCard(events[i]);
}

var logoutBtn = document.getElementById("logoutBtn");

logoutBtn.onclick = function () {
    localStorage.removeItem("loggedInClub");
    window.location.href = "login.html";
};
