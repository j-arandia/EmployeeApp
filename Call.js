
$(function () { 
    const getAll = async (msg) => {
        try {
            $("#callList").text("Finding Call Information...");
            let response = await fetch(`api/call`);
            if (response.ok) {
                let payload = await response.json();
                buildCallList(payload);
                msg === "" ?
                    $("#status").text("Calls Loaded") : $("#status").text(`${msg} - Calls Loaded`);
            } else if (response.status !== 404) {
                let problemJson = await response.json();
                errorRtn(problemJson, response.status);
            } else {    //else 404 not found
                $("#status").text("no such path on server");
            } //else

            //problem data
            response = await fetch(`api/problem`);
            if (response.ok) {
                let probs = await response.json();
                sessionStorage.setItem("allproblems", JSON.stringify(probs));
            } else if (response.status !== 404) {
                let problemJson = await response.json();
                errorRtn(problemJson, response.status);
            } else {    //else 404 not found
                $("#status").text("no such path on server");
            } //else

            //get last name in the employee
            response = await fetch(`api/employee`);
            if (response.ok) {
                let emps = await response.json();
                sessionStorage.setItem("allemployees", JSON.stringify(emps));
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

    const setupForUpdate = (id, data) => {
        $("#actionbutton").val("update");
        $("#modaltitle").html("<h4>Update Call</h4>");

        clearModalFields();
        data.map(call => {
            if (call.id === parseInt(id)) {
                loadEmployeeDDL(call.employeeName);
                loadProblemDDL(call.problemDescription);
                loadTechDDL(call.techName);
                $("#labelDateOpened").text(formatDate(call.dateOpened));
                $("#labelDateClosed").text(formatDate(call.dateClosed));
                $("#TextBoxNotes").text(call.notes);
                //call.openStatus = $("#checkBoxClose").prop("checked");

                if (!call.openStatus) {
                    $("#ddlEmp").prop('disabled', true);
                    $("#ddlTech").prop('disabled', true);
                    $("#ddlProb").prop('disabled', true);
                    $("#checkBoxClose").prop('disabled', true);
                    $("#TextBoxNotes").prop('readonly', true);
                    $("#actionbutton").prop('disabled', true);
                    $("#labelDateClosed").html(formatDate(call.dateClosed));
                    
                } else {
                    $("#ddlEmp").prop('disabled', false);
                    $("#ddlTech").prop('disabled', false);
                    $("#ddlProb").prop('disabled', false);
                    $("#checkBoxClose").prop('disabled', false);
                    $("#TextBoxNotes").prop('readonly', false);
                    $("#actionbutton").prop('disabled', false);
                    $("#labelDateClosed").html("");
                }
            } //if
        });//data.map
        $("#deletebutton").show();
    }; //setupForupdate

    const setupForAdd = () => {
        clearModalFields();
        $("#deletebutton").hide();
        $("#labelDateClosed").hide()
        $("#modalstatus").text("");
        $("#actionbutton").val("add");
        $("#labelDateOpened").html(formatDate());
        $("#modaltitle").html("<h4>add call</h4>");

        $("#ddlEmp").prop('disabled', false);
        $("#ddlTech").prop('disabled', false);
        $("#ddlProb").prop('disabled', false);
        $("#checkBoxClose").prop('disabled', false);
        $("#TextBoxNotes").prop('readonly', false);
        $("#actionbutton").prop('disabled', false);
        $("#theModal").modal("toggle");
        $("#modalstatus").text("add new call");
    }; //setupForAdd

    const buildCallList = (data) => {
        $("#callList").empty();
        div = $(`<div class="list-group-item text-white bg-danger bg-secondary row d-flex" id="status" >Update Call</div>
                    <div class="list-group-item row d-flex text-center" id="heading">
                    <div class="col-4 h4">Date</div>
                    <div class="col-4 h4">For</div>
                     <div class="col-4 h4">Problem</div>
                 </div>`);
        div.appendTo($("#callList"));
        sessionStorage.setItem("allcalls", JSON.stringify(data));
        btn = $(`<button class="list-group-item row d-flex" id="0"><div class="col-12 text-left">...click to add call</div></button>`);
        btn.appendTo($("#callList"));
        data.map(call => {
            btn = $(`<button class="list-group-item row d-flex" id="${call.id}">`);
            btn.html(`<div class="col-4" id="callDate${call.id}">${call.dateOpened}</div>
                      <div class="col-4" id="callFor${call.id}">${call.employeeName}</div>
                      <div class="col-4" id="callProb${call.id}">${call.problemDescription}</div>`
            );
            btn.appendTo($("#callList"));
        }); // end map
    }; //buildCallList

    const loadProblemDDL = (prblm) => {
        html = '';
        $('#ddlProb').empty();
        let allproblems = JSON.parse(sessionStorage.getItem('allproblems')); //parse it into a JSON array
        allproblems.map(p => html += `<option value="${p.problemId}">${p.problemDescription}</option>`);
        $('#ddlProb').append(html);
        $('#ddlProb').val(prblm);
    }; //probDDL

    const loadEmployeeDDL = (emp) => {
        html = '';
        $('#ddlEmp').empty();
        let allemp = JSON.parse(sessionStorage.getItem('allemp')); //parse it into a JSON array
        allemp.map(e => {
            if (e.isTech === false) {
                html += `<option value="${e.id}">${e.lastname}</option>`
            }
        });
        $('#ddlEmp').append(html);
        $('#ddlEmp').val(emp);
    }; //probDDL

    const loadTechDDL = (tech) => {
        html = '';
        $('#ddlTech').empty();
        let alltechs = JSON.parse(sessionStorage.getItem('alltechs')); //parse it into a JSON array
        alltechs.map(t => {
            if (t.isTech) {
                html += `<option value="${t.id}">${t.lastname}</option>`
            }
        });
        $('#ddlTech').append(html);
        $('#ddlTech').val(tech);
    }; //techDDL

    const update = async () => {
        try {
            call = new Object();
            //populate the properties
            call.id = parseInt(sessionStorage.getItem("id"));
            call.timer = sessionStorage.getItem("timer");
            call.techId = parseInt($("#ddlTechs").val());
            call.problemId = parseInt($("#ddlProblems")).val();
            call.employeeId = parseInt($("#ddlEmployees")).val();
            call.openStatus = !$("#checkBoxClose").prop("checked");
            call.notes = $("TextBoxNotes").val();
            sessionStorage.getItem("dateClosed")
                ? call.dateClosed = sessionStorage.getItem("dateClosed")
                : call.dateClosed = null;

            //send the updated back to the server asynchronously using PUT
            let response = await fetch(`api/call`, {
                method: "PUT",
                headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify(call)
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

    const add = async () => {
        try {
            call = new Object();
            call.techId = parseInt($("#ddlTech").val());
            call.problemId = parseInt($("#ddlProb").val());
            call.employeeId = parseInt($("#ddlEmp").val());
            call.notes = $("#TextBoxNotes").val();
            call.dateOpened = formatDate();
            call.openStatus = true;
            call.id = -1
            //send the employee info to the server asynchronously using POST
            let response = await fetch(`api/call`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify(call)
            });
            if (response.ok) // or check for response.status
            {
                let data = await response.json();
                getAll(data.msg);
            } else if (response.status !== 404) { // probably some other client side error
                let problemJson = await response.json();
                errorRtn(problemJson, response.status);
            } else { // else 404 not found
                $("#status").text("no such path on server");
            } // else
        } catch (error) {
            $("#status").text(error.message);
        } // try/catch
        $("#theModal").modal("toggle");
    }; // add

    const clearModalFields = () => {
        loadProblemDDL(-1); //resets the dropdown
        loadEmployeeDDL(-1);
        loadTechDDL(-1);
        $("#TextBoxNotes").val("");
        $("#labelDateOpened").html(formatDate());
        $("#labelDateClosed").hide()
        sessionStorage.removeItem("id");
        sessionStorage.removeItem("timer");
        //$("#EmployeeModalForm").validate().resetForm();//Lab12
    }; //clearModalFields

    const formatDate = (date) => {
        let d;
        (date === undefined) ? d = new Date() : d = new Date(Date.parse(date));
        let _day = d.getDate();
        if (_day < 10) { _day = "0" + _day; }
        let _month = d.getMonth() + 1;
        if (_month < 10) { _month = "0" + _month; }
        let _year = d.getFullYear();
        let _hour = d.getHours();
        if (_hour < 10) { _hour = "0" + _hour; }
        let _min = d.getMinutes();
        if (_min < 10) { _min = "0" + _min; }
        return _year + "-" + _month + "-" + _day + "T" + _hour + ":" + _min;
    }//formatDate

    const _delete = async () => {
        try {
            let response = await fetch(`api/call/${sessionStorage.getItem('id')}`, {
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

    $("#callList").click((e) => {
        if (!e) e = window.event;
        let id = e.target.parentNode.id;
        if (id === "callList" || id === "") {
            id = e.target.id;
        } //clicked on row somewhere else
        if (id !== "status" && id !== "heading") {
            let data = JSON.parse(sessionStorage.getItem("allcalls"));
            id === "0" ? setupForAdd() : setupForUpdate(id, data);
        } else {
            return false;   //ignore if they clicked on heading status
        }
    }); //callList

    $("#checkBoxClose").click(() => {
        if ($("#checkBoxClose").is(":checked")) {
            $("#labelDateClosed").text(formatDate().replace("T", ""));
            sessionStorage.setItem("dateClosed", formatDate());
        } else {
            $("labelDateClosed").text("");
            sessionStorage.setItem("dateClosed", "");
        }
    });	//checkBoxClose

    $("#actionbutton").click(() => {
        $("#actionbutton").val() === "update" ? update() : add();
    });

    $('#deletebutton').click(() => {
        _delete();
    });

    $("#srch").keyup(() => {
        let alldata = JSON.parse(sessionStorage.getItem("allcalls"));
        let filterdata = alldata.filter((emp) => emp.lastname.match(new RegExp($("#srch").val(), 'i')));
        buildCallList(filterdata);
    }); //srch keyup

    getAll("");

}); //jQuery ready method

const errorRtn = (problemJson, status) => {
	if (status > 499) {
		$("#status").text("problem server side, see debug console");
	} else {
		let keys = Object.keys(problemJson.errors)
		problem = {
			status: status,
			statusText: problemJson.errors[keys[0]][0], // firs error
		};
		$("#status").text("Problem client side, see browser console");
		console.log(problem);
	} // else
}






