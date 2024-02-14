$(function () {     

    const getAll = async (msg) => {
        try {
            $("#employeeList").text("Finding Employee Information...");
            let response = await fetch(`api/Employee`);
            if (response.ok) {
                let payload = await response.json(); 
                buildEmployeeList(payload);
                msg === "" ? 
                    $("#status").text("Employees Loaded") : $("#status").text(`${msg} - Employees Loaded`);
            } else if (response.status !== 404) {
                let problemJson = await response.json();
                errorRtn(problemJson, response.status);
            } else {    //else 404 not found
                $("#status").text("no such path on server");
            } //else

            //get departments data
            response = await fetch(`api/department`);
            if (response.ok) {
                let deps = await response.json();   
                sessionStorage.setItem("alldepartments", JSON.stringify(deps));
            } else if (response.status !== 404) {
                let problemJson = await response.json();
                errorRtn(problemJson, response.status);
            } else {    //else 404 not found
                $("#status").text("no such path on server");
            } //else
        } catch (error) {
            $("#status").text(error.message);
        }
    }; //getAll
    
    const loadDepartmentDDL = (empdep) => {
        html = '';
        $('#ddlDepartments').empty();
        let alldepartments = JSON.parse(sessionStorage.getItem('alldepartments')); //parse it into a JSON array
        alldepartments.map(emp => html += `<option value="${emp.id}">${emp.name}</option>`); 
        $('#ddlDepartments').append(html);
        $('#ddlDepartments').val(empdep);
    }; //loadDepartmentDDL

    //Lab12 addition
    document.addEventListener("keyup", e => {
        $("#modalstatus").removeClass(); //remove any existing css on div
        if ($("#EmployeeModalForm").valid()) {
            $("#modalstatus").attr("class", "badge badge-success"); //green
            $("#modalstatus").text("data entered is valid");
            $("#actionbutton").prop('disabled', false);
        }
        else {
            $("#modalstatus").attr("class", "badge badge-danger");  //red
            $("#modalstatus").text("fix errors");
            $("#actionbutton").prop('disabled', true);
        }
    });

    const setupForUpdate = (id, data) => {
        $("#actionbutton").val("update");
        $("#modaltitle").html("<h4>Employee Info.</h4>");
        
        clearModalFields();
        data.map(employee => {
            if (employee.id === parseInt(id)) {
                $("#TextBoxTitle").val(employee.title);
                $("#TextBoxFirstname").val(employee.firstname);
                $("#TextBoxLastname").val(employee.lastname);
                $("#TextBoxPhone").val(employee.phoneno);
                $("#TextBoxEmail").val(employee.email);
                $("#ImageHolder").html(`<img height="120" width="110" src="data:img/png;base64,${employee.staffPicture64}"/>`); //Lab14 addition
                $("#modalstatus").text("update data");        //Lab14 addition
                sessionStorage.setItem("id", employee.id);
                sessionStorage.setItem("departmentId", employee.departmentId);
                sessionStorage.setItem("timer", employee.timer);
                sessionStorage.setItem("picture", employee.staffPicture64);  //Lab14 addition
                loadDepartmentDDL(employee.departmentId.toString());
                $("#theModal").modal("toggle");
            } //if
        });//data.map
        $("#deletebutton").show();
    }; //setupForupdate

    const setupForAdd = () => {
        $("#actionbutton").val("add");
        $("#modaltitle").html("<h4>add employee</h4>");
        $("#theModal").modal("toggle");
        $("#deletebutton").hide();
        clearModalFields();
    }; //setupForAdd
    
    $("#employeeList").click((e) => {
        if (!e) e = window.event;
        let id = e.target.parentNode.id;
        if (id === "employeeList" || id === "") {
            id = e.target.id;
        } //clicked on row somewhere else
        if (id !== "status" && id !== "heading") {
            let data = JSON.parse(sessionStorage.getItem("allemployees"));
            id === "0" ? setupForAdd() : setupForUpdate(id, data);
        } else {
            return false;   //ignore if they clicked on heading status
        }
    }); //employeeListClick
    
    //Lab12 addition
    $("#EmployeeModalForm").validate({
        rules: {
            TextBoxTitle: { maxlength: 4, required: true, validTitle: true },
            TextBoxFirstname: { maxlength: 25, required: true },
            TextBoxLastname: { maxlength: 25, required: true },
            TextBoxEmail: { maxlength: 40, required: true, email: true },
            TextBoxPhone: { maxlength: 15, required: true }
        },
        errorElement: "div",
        messages: {
            TextBoxTitle: {
                required: "required 1-4 chars.", maxlength: "required 1-4 chars.", validTitle: "Mr. Ms. Mrs. or Dr."
            },
            TextBoxFirstname: {
                required: "required 1-25 chars.", maxlength: "required 1-25 chars."
            },
            TextBoxLastname: {
                required: "required 1-25 chars.", maxlength: "required 1-25 chars."
            },
            TextBoxPhone: {
                required: "required 1-15 chars.", maxlength: "required 1-15 chars."
            },
            TextBoxEmail: {
                required: "required 1-40 chars.", maxlength: "required 1-40 chars.", email: "invalid email format"
            }
        }
    }); //StudentModalForm.validate

    $.validator.addMethod("validTitle", (value) => {    //custome rule
        return (value === "Mr." || value === "Ms." || value === "Mrs." || value === "Dr.");
    }, ""); //.validator.addMethod

    const clearModalFields = () => {
        loadDepartmentDDL(-1); //resetsmthe dropdown
        $("#TextBoxTitle").val("");
        $("#TextBoxFirstname").val("");
        $("#TextBoxLastname").val("");
        $("#TextBoxPhone").val("");
        $("#TextBoxEmail").val("");
        sessionStorage.removeItem("id");
        sessionStorage.removeItem("departmentId");
        sessionStorage.removeItem("timer");
        sessionStorage.removeItem("picture");
        $("#EmployeeModalForm").validate().resetForm();//Lab12
    }; //clearModalFields

    const add = async () => {
        try {
            emp = new Object();
            emp.title = $("#TextBoxTitle").val();
            emp.firstname = $("#TextBoxFirstname").val();
            emp.lastname = $("#TextBoxLastname").val();
            emp.phoneno = $("#TextBoxPhone").val();
            emp.email = $("#TextBoxEmail").val();
            emp.departmentId = parseInt($("#ddlDepartments").val()); //instead of hardcoded, now departmentID is loaded from select control value
            emp.id = -1;
            emp.timer = null;
            emp.staffPicture64 = null;
            //send the employee info to the server asynchronously using POST
            let response = await fetch("api/Employee", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify(emp)
            });
            if (response.ok) //or check for response status
            {
                let data = await response.json();
                getAll(data.msg);
            } else if (response.status !== 404) { //propably some other client side error
                let problemJson = await response.json();
                errorRtn(problemJson, response.status);
            } else { //else 404 not found
                $("#status").text("no such path on server");
            } //else
        } catch (error) {
            $("#status").text(error.message);
        } //try/catch
        $("#theModal").modal("toggle");

    };    //add

    const update = async () => {
        try {
            //set up a new client side instance of Employee
            emp = new Object();
            //populate the properties
            emp.title = $("#TextBoxTitle").val();
            emp.firstname = $("#TextBoxFirstname").val();
            emp.lastname = $("#TextBoxLastname").val();
            emp.phoneno = $("#TextBoxPhone").val();
            emp.email = $("#TextBoxEmail").val();
            emp.departmentId = parseInt($("#ddlDepartments").val()); //instead of hardcoded, now departmentID is loaded from select control value
            //we stored these 3 earlier
            emp.id = parseInt(sessionStorage.getItem("id"));
            emp.departmentId = parseInt(sessionStorage.getItem("departmentId"));
            emp.timer = sessionStorage.getItem("timer");
            sessionStorage.getItem("picture")
                ? emp.staffPicture64 = sessionStorage.getItem("picture")
                : emp.staffPicture64 = null;

            //send the updated back to the server asynchronously using PUT
            let response = await fetch("api/Employee", {
                method: "PUT",
                headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify(emp)
            });
            if (response.ok) //or check for response.status
            {
                let data = await response.json();
                getAll(data.msg);
            } else if (response.status !== 404) { //propably some other client side error
                let problemJson = await response.json();
                errorRtn(problemJson, response.status);
            } else { //else 404 not found
                $("#status").text("no such path on server");
            } //else
        } catch (error) {
            $("#status").text(error.message);
        } //try/catch
        $("#theModal").modal("toggle");
    }//update

    const _delete = async () => {
        try {
            let response = await fetch(`api/Employee/${sessionStorage.getItem('id')}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json;charset=utf-8' }
            });

            if (response.ok)    //or check for response.status
            {
                let data = await response.json();   //message from the server
                getAll(data.msg);
            } else if (response.status !== 404) {   //probably some other client side error
                let problemJson = await response.json();
                errorRtn(problemJson, response.status);
            } else { //else 404 not found
                $("#status").text("no such path on server");
            } //else
        } catch (error) {
            $("#status").text(error.message);
        } //try/catch
        $("#theModal").modal("toggle");
    };    //delete

    //modalbutton
    $("#actionbutton").click(() => {
        $("#actionbutton").val() === "update" ? update() : add();
    });

    $('[data-toggle=confirmation]').confirmation({
        rootSelector: '[data-toggle=confirmation]', //passes JSON object to the click event
    }); //confirmation

    $("#srch").keyup(() => {
        let alldata = JSON.parse(sessionStorage.getItem("allemployees"));
        let filterdata = alldata.filter((emp) => emp.lastname.match(new RegExp($("#srch").val(), 'i')));
        buildEmployeeList(filterdata, false);
    }); //srch keyup

    $('#deletebutton').click(() => {
        _delete(); //if yes was chosen this line is executed
    });   //deletebuttonclick
    
    const buildEmployeeList = (data, usealldata = true) => {
        $("#employeeList").empty();
        div = $(`<div class="list-group-item text-white bg-danger bg-secondary row d-flex" id="status" >Employee Info</div>
                    <div class="list-group-item row d-flex text-center" id="heading">
                    <div class="col-4 h4">Title</div>
                    <div class="col-4 h4">First</div>
                     <div class="col-4 h4">Last</div>
                 </div>`);
        div.appendTo($("#employeeList"));
        usealldata ? sessionStorage.setItem("allemployees", JSON.stringify(data)) : null;
        btn = $(`<button class="list-group-item row d-flex" id="0"><div class="col-12 text-left">...click to add employee</div></button>`);
        btn.appendTo($("#employeeList"));
        data.map(emp => {
            btn = $(`<button class="list-group-item row d-flex" id="${emp.id}">`);
            btn.html(`<div class="col-4" id="employeetitle${emp.id}">${emp.title}</div>
                      <div class="col-4" id="employeefname${emp.id}">${emp.firstname}</div>
                      <div class="col-4" id="employeelastnam${emp.id}">${emp.lastname}</div>`
            );
            btn.appendTo($("#employeeList"));
        }); // end map
    }; //buildEmployeeList

    getAll(""); //first grab the data from the server

    //Lab14 addition
    //do we have a picture?
    $("input:file").change(() => {
        const reader = new FileReader();
        const file = $("#uploader")[0].files[0];

        file ? reader.readAsBinaryString(file) : null;

        reader.onload = (readerEvt) => {
            //get binary data then convert to encoded string
            const binaryString = reader.result;
            const encodedString = btoa(binaryString);
            sessionStorage.setItem('picture', encodedString);
        };
    });  //input file change

});  //jQuery ready method

// server was reached but server had a problem with the call
const errorRtn = (problemJson, status) => {
    if (status > 499) {
        $("#status").text("Problem server side, see debug console");
    } else {
        let keys = Object.keys(problemJson.errors)
        problem = {
            status: status,
            statusText: problemJson.errors[keys[0]][0], // first error
        };
        $("#status").text("Problem client side, see browser console");
        console.log(problem);
    } 
}
