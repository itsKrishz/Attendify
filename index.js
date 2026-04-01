var clubInput = document.getElementById("clubId")
var passInput = document.getElementById("password")

var loginBtn = document.getElementById("loginBtn")
var signupBtn = document.getElementById("signupBtn")

var clubs = JSON.parse(localStorage.getItem("clubs")) || [];

signupBtn.onclick = function(){
    var clubId = clubInput.value.toLowerCase();
    var password = passInput.value;

    if(clubId === "" || password === ""){
        alert("Please enter all the details")
        return;
    }

    for(var i =0;i<clubs.length;i++){
        if(clubs[i].clubId === clubId){
            alert("Club already exists")
            return
        }
    }

    var club = {
        clubId: clubId,
        password: password
    }

    clubs.push(club);
    localStorage.setItem("clubs",JSON.stringify(clubs));
    alert("Sign up successful!");


};

loginBtn.onclick = function(){
    var clubId = clubInput.value.toLowerCase();
    var password = passInput.value;

    var found = false;

    for(var i=0;i<clubs.length;i++){
        if(clubs[i].clubId===clubId &&
            clubs[i].password=== password){
                found = true;
                break;
        }
    }

    if(found){
        localStorage.setItem("loggedInClub",clubId);
        window.location.href="events.html";
    }
    else{
        alert("Invalid credentials")
    }
};


var togglePassword = document.getElementById("togglePassword");
var eyeOpen = document.getElementById("eyeOpen");
var eyeClosed = document.getElementById("eyeClosed");

togglePassword.onclick = function () {
    if (passInput.type === "password") {
        passInput.type = "text";
        eyeOpen.style.display = "none";
        eyeClosed.style.display = "block";
    } else {
        passInput.type = "password";
        eyeOpen.style.display = "block";
        eyeClosed.style.display = "none";
    }
};
