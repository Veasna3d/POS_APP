//document loaded
$(document).ready(function () {
    showData();
});
//Function showData
function showData() {
    $.ajax({
        type: "Get",
        url: "/Users/GetAllData",
        dataType: 'json',
        success: function (alldata) {
            console.log(alldata);
            var columns = [
                { title: "Id" },
                { title: "Username" },
                { title: "Password" },
                { title: "Image" },
                { title: "Actions" }
            ];
            var data = [];
            for (var i in alldata) {
                data.push([
                    alldata[i].Id,
                    alldata[i].Username,
                    alldata[i].Password,
                    "<img src='../Images/" + alldata[i].Image + "' width='60' height='60''>",
                    "<button type='button' class='btn btn-primary' data-toggle='modal' data-target='#myModal' OnClick='editData(" +
                    alldata[i].Id + ")'>Edit</button> | <button type='button' class='btn btn-danger' OnClick='deleteData(" + alldata[i].Id +
                    ")'>Delete</button>"
                ]);
            }
            $('#table_data').DataTable({
                destroy: true,
                data: data,
                columns: columns
            });
        },
        error: function (e) {
            console.log(e.responseText);
        }
    });
}
//AddNew Button
function addNew() {
    $("#Username").val("");
    $("#Password").val("");
    $("#Image").val("");
    $('#mypicture').attr("src", "#");
    $("#btnsave").val("Insert");
}
//Save Button
function saveData() {
    if ($("#btnsave").val() == "Insert") {
        insertData();
    } else {
        updateData();
    }
}
//function insertData
function insertData() {
    var fileUpload = $("#Image").get(0);
    var files = fileUpload.files;
    var data = new FormData();
    for (var i = 0; i < files.length; i++) {
        data.append("File", files[i]);
    } 
    data.append("Username", $("#Username").val());
    data.append("Password", $("#Password").val());
    data.append("Image", $("#Image").val());
    //sent to Server(C#)
    $.ajax({
        type: "Post",
        url: "/Users/Create",
        data: data,
        contentType: false,
        processData: false,
        success: function (data) {
            noty({ text: data, type: 'success', dismissQueue: true, layout: 'topCenter', theme: 'relax', timeout: 1000 });
            showData()
            setTimeout(function () { $('#myModal').modal('hide'); }, 1000);
        },
        error: function (e) {
            console.log(e.responseText);
        }
    });
}
//function editData
var userid;
function editData(bid) {
    $("#btnsave").val("Update");
    userid = bid;
    $.ajax({
        type: "Get",
        url: "/Users/GetDataID/",
        data: { id: bid },
        dataType: 'json',
        success: function (data) {
            $("#Username").val(data.Username);
            $("#Password").val(data.Password);
           
            //$("#Photo").val(data.Photo);
            $('#mypicture').attr("src", "../Images/" + data.Image);
        },
        error: function (e) {
            console.log(e.responseText);
        }
    });
}
//Function updateData
function updateData() {
    var fileUpload = $("#Image").get(0);
    var data = new FormData();
    var files = fileUpload.files;
    for (var i = 0; i < files.length; i++) {
        data.append("File", files[i]);
    }
    data.append("Id", userid);
    data.append("Username", $("#Username").val());
    data.append("Password", $("#Password").val());
    data.append("Image", $("#Image").val());
    //sent to Server(C#)
    $.ajax({
        type: "Post",
        url: "/Users/Edit",
        data: data,
        contentType: false,
        processData: false,
        success: function (data) {
            noty({ text: data, type: 'success', dismissQueue: true, layout: 'topCenter', theme: 'relax', timeout: 1000 });
            showData();
            setTimeout(function () { $('#myModal').modal('hide'); }, 1000);
        },
        error: function (e) {
            console.log(e.responseText);
        }
    });
}
//deleteData
function deleteData(userid) {
    var n = noty({
        text: 'Do you want to remove?', type: 'alert', 
        dismissQueue: true, layout: 'center', theme: 'relax', modal: true,
        buttons: [{
            addClass: 'btn btn-info', text: 'Ok', onClick: function ($noty) {
                $.ajax({
                    type: "Post",
                    url: "/Users/Delete/",
                    data: { id: userid },
                    dataType: 'json',
                    success: function (data) {
                        showData();
                        noty({
                            text: data, type: 'success', dismissQueue: true,
                            layout: 'topCenter', theme: 'relax', timeout: 1000
                        });
                    },
                    error: function (e) {
                        console.log(e.responseText);
                    }
                });
                $noty.close();
            }
        },
        {
            addClass: 'btn btn-default', text: 'Cancel', onClick: function ($noty) {
                $noty.close();
            }
        }
        ]
    });
}
