var params = new URLSearchParams(window.location.search);
var eventName = params.get("event");

document.getElementById("eventTitle").innerText =
    eventName+"Attendance Sheet";

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
