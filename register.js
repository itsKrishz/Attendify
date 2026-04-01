var params = new URLSearchParams(window.location.search);
var eventName = params.get("event");

document.getElementById("eventTitle").innerText =
    eventName+" Register Students";

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

document.getElementById("uploadCSV").onclick = function () {

    var fileInput = document.getElementById("csvFile");

    if (!fileInput.files.length) {
        alert("Please select a CSV file");
        return;
    }

    var file = fileInput.files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
        var text = e.target.result;

        // Split into lines
        var lines = text.split("\n");

        for (var i = 1; i < lines.length; i++) { // skip header row

            var cols = lines[i].split(",");

            if (cols.length < 3) continue;

            var name = cols[0].trim();
            var reg = cols[1].trim();
            var phone = cols[2].trim();

            // Skip empty rows
            if (name === "" || reg === "" || phone === "") continue;

            // Check duplicate reg number
            var exists = students.some(function (s) {
                return s.reg.toLowerCase() === reg.toLowerCase();
            });

            if (exists) continue;

            var student = {
                name: name,
                reg: reg,
                phone: phone
            };

            students.push(student);
            addRow(student);
        }

        localStorage.setItem(eventName, JSON.stringify(students));

        alert("CSV uploaded successfully!");
    };

    reader.readAsText(file);
};