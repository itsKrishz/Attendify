var params = new URLSearchParams(window.location.search);
var eventName = params.get("event");
var loggedInClub = localStorage.getItem("loggedInClub");

document.getElementById("eventTitle").innerText =
    eventName+" Attendance Sheet";

var students = JSON.parse(localStorage.getItem(eventName)) || [];

var table = document.getElementById("attendanceTable");

for (var i = 0; i < students.length; i++) {

    var row = table.insertRow();
    row.insertCell(0).innerText = students[i].name;
    row.insertCell(1).innerText = students[i].reg;
    row.insertCell(2).innerText = students[i].phone;

    var checkCell = row.insertCell(3);
    var checkBox = document.createElement("input");
    checkBox.type = "checkbox";

    checkBox.checked = students[i].present === true;
    checkBox.dataset.index=i;
    checkCell.appendChild(checkBox);
}
saveAttendance.onclick = function () {
    var checkBoxes = document.querySelectorAll("input[type='checkbox']");

    checkBoxes.forEach(function(cb){
        var i = cb.dataset.index;
        students[i].present = cb.checked;
    });

    localStorage.setItem(eventName,JSON.stringify(students));
    alert("Attendance Save successfully!!");
}
saveCSV.onclick = function() {
    var csv = "RegNo, Name, Phone, Present\n";

    for(var i =0;i<students.length;i++){
        if(students[i].present===true){
            var present = "Present"
        }
        else{
            var present = "Absent"
        }

        csv += students[i].reg+','+students[i].name+','+students[i].phone+','+present+"\n";
    }
    var blob = new Blob([csv],{type: "text/csv"});
    var url = URL.createObjectURL(blob);

    var a = document.createElement("a");
    a.href=url;
    a.download=eventName+"_attendance.csv"
    a.click();
    URL.revokeObjectURL(url);
}

backBtn.onclick=function(){
    window.history.back();
}


// ─── Certificate Generator ────────────────────────────────────
document.getElementById("exportCertificates").onclick = function () {
    var present = students.filter(function (s) { return s.present === true; });

    if (present.length === 0) {
        alert("No present students to generate certificates for.");
        return;
    }

    var canvas = document.getElementById("certCanvas");
    var ctx = canvas.getContext("2d");

    var W = canvas.width;   // 900
    var H = canvas.height;  // 560

    present.forEach(function (student) {
        // Clear
ctx.clearRect(0, 0, W, H);

// ─── BACKGROUND (DARK GRADIENT) ───
var bg = ctx.createLinearGradient(0, 0, W, H);
bg.addColorStop(0, "#0d0d14");
bg.addColorStop(1, "#1a1a2e");
ctx.fillStyle = bg;
ctx.fillRect(0, 0, W, H);

// ─── GLOW BORDER ───
ctx.strokeStyle = "#7c6dfa";
ctx.lineWidth = 2;
ctx.shadowColor = "#7c6dfa";
ctx.shadowBlur = 20;
ctx.strokeRect(30, 30, W - 60, H - 60);
ctx.shadowBlur = 0;

// ─── TITLE ───
ctx.fillStyle = "#a396ff";
ctx.font = "600 14px Outfit";
ctx.textAlign = "center";
ctx.fillText("CERTIFICATE OF PARTICIPATION", W / 2, 90);

// ─── MAIN TITLE ───
ctx.fillStyle = "#ffffff";
ctx.font = "bold 40px Georgia";
ctx.fillText(student.name, W / 2, 180);

// underline glow
var nameWidth = ctx.measureText(student.name).width;
var startX = W/2 - nameWidth/2;
ctx.strokeStyle = "#7c6dfa";
ctx.lineWidth = 1.5;
ctx.beginPath();
ctx.moveTo(startX, 195);
ctx.lineTo(startX + nameWidth, 195);
ctx.stroke();

// ─── SUBTEXT ───
ctx.fillStyle = "#9090b0";
ctx.font = "400 16px Outfit";
ctx.fillText("has successfully participated in", W / 2, 240);

// ─── EVENT NAME ───
ctx.fillStyle = "#00e5c3";
ctx.font = "600 24px Outfit";
ctx.fillText(eventName, W / 2, 280);

// ─── CLUB NAME ───
ctx.fillStyle = "#888";
ctx.font = "400 14px Outfit";
ctx.fillText("Organised by " + loggedInClub.toUpperCase(), W / 2, 315);

// ─── DIVIDER ───
ctx.strokeStyle = "#2a2a40";
ctx.beginPath();
ctx.moveTo(100, 380);
ctx.lineTo(W - 100, 380);
ctx.stroke();

// ─── FOOTER ───
var today = new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" });

ctx.fillStyle = "#aaa";
ctx.font = "400 12px Outfit";

ctx.textAlign = "left";
ctx.fillText(today, 80, 420);

ctx.textAlign = "center";
ctx.fillText("Reg No: " + student.reg, W / 2, 420);

ctx.textAlign = "right";
ctx.fillText("Attendify", W - 80, 420);

// ─── ACCENT DOTS (UI STYLE MATCH) ───
ctx.fillStyle = "#7c6dfa";
ctx.beginPath();
ctx.arc(60, 60, 4, 0, Math.PI * 2);
ctx.fill();

ctx.fillStyle = "#00e5c3";
ctx.beginPath();
ctx.arc(W - 60, H - 60, 4, 0, Math.PI * 2);
ctx.fill();

        // Download as PNG
        var link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = student.name.replace(/\s+/g, "_") + "_certificate.png";
        link.click();
    });
};