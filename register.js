var params = new URLSearchParams(window.location.search);
var eventName = params.get("event");

document.getElementById("eventTitle").innerText =
    eventName+"Register Students";

var students = JSON.parse(localStorage.getItem(eventName)) || [];
for (var i = 0; i < students.length; i++) {
    addRow(students[i]);
}



document.getElementById("addStudent").onclick = function () {

    var sname = document.getElementById("sname").value;
    var regno = document.getElementById("regno").value;
    var phone = document.getElementById("phone").value;

    if (sname === "" || regno === "" || phone === "") {
        alert("Please fill all fields");
        return;
    }

    for(var i =0;i<students.length;i++){
        if(students[i].reg.toLowerCase() === regno.toLowerCase() ){
            alert("The register Number already exists!");
            return;
        }
    }
    
    var student = { 
        name: sname, 
        reg: regno, 
        phone: phone };

    students.push(student);

    localStorage.setItem(eventName, JSON.stringify(students));
    addRow(student);

    document.getElementById("sname").value = "";
    document.getElementById("regno").value = "";
    document.getElementById("phone").value = "";
};



function addRow(student) {
    var row = document.getElementById("studentTable").insertRow();
    row.insertCell(0).innerText = student.name;
    row.insertCell(1).innerText = student.reg;
    row.insertCell(2).innerText = student.phone;


    var deleteCell = row.insertCell(3);
    var deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";


    deleteButton.onclick = function(){
        row.remove();
        students = students.filter(s=>s.reg!=student.reg);
        localStorage.setItem(eventName, JSON.stringify(students));
    }
    deleteCell.appendChild(deleteButton);
}

backBtn.onclick = function(){
    window.history.back();
}