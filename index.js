var clubInput = document.getElementById("clubId");
var passInput = document.getElementById("password");
var signupClubInput = document.getElementById("signupClubId");
var signupPassInput = document.getElementById("signupPassword");

var loginBtn = document.getElementById("loginBtn");
var signupBtn = document.getElementById("signupBtn");

var loginBtnHeader = document.getElementById("loginBtnHeader");
var signupBtnHeader = document.getElementById("signupBtnHeader");

var loginModal = document.getElementById("loginModal");
var signupModal = document.getElementById("signupModal");

var closeButtons = document.querySelectorAll(".close");

var clubs = JSON.parse(localStorage.getItem("clubs")) || [];

// Show modals
loginBtnHeader.onclick = function() {
    loginModal.style.display = "block";
}

signupBtnHeader.onclick = function() {
    signupModal.style.display = "block";
}

// Hide modals
closeButtons.forEach(function(btn) {
    btn.onclick = function() {
        loginModal.style.display = "none";
        signupModal.style.display = "none";
    }
});

window.onclick = function(event) {
    if (event.target == loginModal || event.target == signupModal) {
        loginModal.style.display = "none";
        signupModal.style.display = "none";
    }
}


signupBtn.onclick = function(){
    var clubId = signupClubInput.value.toLowerCase();
    var password = signupPassInput.value;

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
    signupModal.style.display = "none";
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
