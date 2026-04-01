var params = new URLSearchParams(window.location.search);
var eventName = params.get("event");

document.getElementById("eventTitle").innerText = eventName + " Attendance Sheet";

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
    checkBox.dataset.index = i;
    checkCell.appendChild(checkBox);

    // Certificate button cell
    var certCell = row.insertCell(4);
    var certBtn = document.createElement("button");
    certBtn.innerText = "🎓 Generate";
    certBtn.className = "cert-btn";
    certBtn.disabled = !students[i].present;
    certBtn.dataset.index = i;

    certBtn.onclick = (function(idx) {
        return function() {
            openCertificate(students[idx].name, students[idx].reg);
        };
    })(i);

    certCell.appendChild(certBtn);

    // Enable/disable cert button as checkbox changes
    checkBox.addEventListener("change", (function(btn) {
        return function() {
            btn.disabled = !this.checked;
        };
    })(certBtn));
}

// ── Save Attendance ──────────────────────────────────────────
document.getElementById("saveAttendance").onclick = function () {
    var checkBoxes = document.querySelectorAll("input[type='checkbox']");
    checkBoxes.forEach(function(cb) {
        students[cb.dataset.index].present = cb.checked;
    });
    localStorage.setItem(eventName, JSON.stringify(students));
    alert("Attendance saved successfully!");
};

// ── Export CSV ───────────────────────────────────────────────
document.getElementById("saveCSV").onclick = function() {
    var csv = "RegNo,Name,Phone,Present\n";
    for (var i = 0; i < students.length; i++) {
        var status = students[i].present === true ? "Present" : "Absent";
        csv += students[i].reg + "," + students[i].name + "," + students[i].phone + "," + status + "\n";
    }
    var blob = new Blob([csv], { type: "text/csv" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = eventName + "_attendance.csv";
    a.click();
    URL.revokeObjectURL(url);
};

// ── Back Button ──────────────────────────────────────────────
document.getElementById("backBtn").onclick = function() {
    window.history.back();
};

// ── Certificate Generator ────────────────────────────────────
var certModal  = document.getElementById("certModal");
var certCanvas = document.getElementById("certCanvas");
var ctx        = certCanvas.getContext("2d");
var currentStudentName = "";
var currentRegNo = "";

function openCertificate(name, reg) {
    currentStudentName = name;
    currentRegNo = reg;
    drawCertificate(name, reg);
    certModal.classList.add("open");
}

function drawCertificate(name, reg) {
    var W = certCanvas.width;   // 720
    var H = certCanvas.height;  // 480

    ctx.clearRect(0, 0, W, H);

    // ── Background ───────────────────────────────────────────
    var bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0,   "#0d0d14");
    bgGrad.addColorStop(0.5, "#13131f");
    bgGrad.addColorStop(1,   "#0d0d1f");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // ── Radial glow accents ──────────────────────────────────
    var glow1 = ctx.createRadialGradient(160, 160, 0, 160, 160, 280);
    glow1.addColorStop(0, "rgba(124,109,250,0.18)");
    glow1.addColorStop(1, "transparent");
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, W, H);

    var glow2 = ctx.createRadialGradient(580, 340, 0, 580, 340, 240);
    glow2.addColorStop(0, "rgba(0,229,195,0.14)");
    glow2.addColorStop(1, "transparent");
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, W, H);

    // ── Outer border ─────────────────────────────────────────
    ctx.strokeStyle = "rgba(120,100,255,0.45)";
    ctx.lineWidth = 2;
    roundRect(ctx, 18, 18, W - 36, H - 36, 18);
    ctx.stroke();

    // ── Inner border (thinner) ───────────────────────────────
    ctx.strokeStyle = "rgba(0,229,195,0.2)";
    ctx.lineWidth = 1;
    roundRect(ctx, 30, 30, W - 60, H - 60, 12);
    ctx.stroke();

    // ── Top accent line gradient ─────────────────────────────
    var lineGrad = ctx.createLinearGradient(60, 0, W - 60, 0);
    lineGrad.addColorStop(0,   "transparent");
    lineGrad.addColorStop(0.3, "#7c6dfa");
    lineGrad.addColorStop(0.7, "#00e5c3");
    lineGrad.addColorStop(1,   "transparent");
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(60, 56);
    ctx.lineTo(W - 60, 56);
    ctx.stroke();

    // ── Corner decorations ───────────────────────────────────
    drawCornerDeco(ctx, 50,      50,      0);
    drawCornerDeco(ctx, W - 50,  50,      Math.PI / 2);
    drawCornerDeco(ctx, W - 50,  H - 50, Math.PI);
    drawCornerDeco(ctx, 50,      H - 50, -Math.PI / 2);

    // ── "ATTENDIFY" watermark ────────────────────────────────
    ctx.save();
    ctx.globalAlpha = 0.045;
    ctx.font = "bold 110px 'Space Mono', monospace";
    ctx.fillStyle = "#a396ff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("ATTENDIFY", W / 2, H / 2);
    ctx.restore();

    // ── Badge circle ─────────────────────────────────────────
    var badgeGrad = ctx.createRadialGradient(W / 2, 110, 0, W / 2, 110, 36);
    badgeGrad.addColorStop(0,   "rgba(124,109,250,0.8)");
    badgeGrad.addColorStop(1,   "rgba(0,229,195,0.5)");
    ctx.beginPath();
    ctx.arc(W / 2, 110, 34, 0, Math.PI * 2);
    ctx.fillStyle = badgeGrad;
    ctx.fill();
    ctx.strokeStyle = "rgba(163,150,255,0.7)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // star/medal emoji in badge
    ctx.font = "28px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff";
    ctx.fillText("🎓", W / 2, 112);

    // ── "CERTIFICATE OF PARTICIPATION" ──────────────────────
    ctx.font = "bold 11px 'Space Mono', monospace";
    ctx.letterSpacing = "3px";
    ctx.fillStyle = "rgba(163,150,255,0.6)";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("CERTIFICATE  OF  PARTICIPATION", W / 2, 168);

    // ── "This certifies that" ─────────────────────────────────
    ctx.font = "400 15px 'Outfit', sans-serif";
    ctx.fillStyle = "rgba(144,144,176,0.85)";
    ctx.fillText("This certifies that", W / 2, 210);

    // ── Student Name ─────────────────────────────────────────
    ctx.save();
    ctx.shadowColor = "rgba(124,109,250,0.6)";
    ctx.shadowBlur = 18;
    var nameGrad = ctx.createLinearGradient(W/2 - 200, 0, W/2 + 200, 0);
    nameGrad.addColorStop(0, "#ffffff");
    nameGrad.addColorStop(0.5, "#a396ff");
    nameGrad.addColorStop(1, "#00e5c3");
    ctx.fillStyle = nameGrad;
    ctx.font = "700 38px 'Space Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(name.toUpperCase(), W / 2, 264);
    ctx.restore();

    // ── Name underline ───────────────────────────────────────
    var nameW = Math.min(ctx.measureText(name.toUpperCase()).width + 40, W - 120);
    var ulGrad = ctx.createLinearGradient(W/2 - nameW/2, 0, W/2 + nameW/2, 0);
    ulGrad.addColorStop(0,   "transparent");
    ulGrad.addColorStop(0.5, "rgba(124,109,250,0.6)");
    ulGrad.addColorStop(1,   "transparent");
    ctx.strokeStyle = ulGrad;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(W/2 - nameW/2, 272);
    ctx.lineTo(W/2 + nameW/2, 272);
    ctx.stroke();

    // ── "has successfully participated in" ───────────────────
    ctx.font = "400 15px 'Outfit', sans-serif";
    ctx.fillStyle = "rgba(144,144,176,0.85)";
    ctx.textAlign = "center";
    ctx.fillText("has successfully participated in", W / 2, 308);

    // ── Event name ───────────────────────────────────────────
    ctx.font = "600 22px 'Outfit', sans-serif";
    ctx.fillStyle = "#00e5c3";
    ctx.textAlign = "center";
    ctx.fillText(eventName, W / 2, 344);

    // ── Reg No & Date row ────────────────────────────────────
    ctx.font = "400 12px 'Space Mono', monospace";
    ctx.fillStyle = "rgba(144,144,176,0.55)";
    ctx.textAlign = "left";
    ctx.fillText("REG: " + reg, 70, 400);

    var today = new Date();
    var dateStr = today.toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });
    ctx.textAlign = "right";
    ctx.fillText("DATE: " + dateStr, W - 70, 400);

    // ── Bottom accent line ───────────────────────────────────
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 416);
    ctx.lineTo(W - 60, 416);
    ctx.stroke();

    // ── Footer ───────────────────────────────────────────────
    ctx.font = "400 11px 'Space Mono', monospace";
    ctx.fillStyle = "rgba(120,100,255,0.4)";
    ctx.textAlign = "center";
    ctx.fillText("POWERED BY ATTENDIFY", W / 2, 440);
}

// ── Helper: rounded rect path ────────────────────────────────
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

// ── Helper: corner L-bracket decoration ─────────────────────
function drawCornerDeco(ctx, cx, cy, angle) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.strokeStyle = "rgba(120,100,255,0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -16);
    ctx.lineTo(0, 0);
    ctx.lineTo(16, 0);
    ctx.stroke();
    ctx.restore();
}

// ── Download button ──────────────────────────────────────────
document.getElementById("downloadCert").onclick = function() {
    var link = document.createElement("a");
    link.download = currentStudentName.replace(/\s+/g,"_") + "_" + eventName + "_certificate.png";
    link.href = certCanvas.toDataURL("image/png");
    link.click();
};

// ── Close modal ──────────────────────────────────────────────
document.getElementById("closeCert").onclick = function() {
    certModal.classList.remove("open");
};

certModal.addEventListener("click", function(e) {
    if (e.target === certModal) certModal.classList.remove("open");
});