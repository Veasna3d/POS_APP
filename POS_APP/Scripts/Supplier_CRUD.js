//document loaded
$(document).ready(function () {
    showData();
});
//Function showData
function showData() {
    $.ajax({
        type: "Get",
        url: "/Suppliers/GetAllData",
        dataType: 'json',
        success: function (alldata) {
            console.log(alldata);
            var columns = [
                { title: "ID" },
                { title: "Supplier Name" },
                { title: "Phone Number" },
                { title: "Address" },
                { title: "Actions" }
            ];
            var data = [];
            for (var i in alldata) {
                data.push([
                    alldata[i].SupId,
                    alldata[i].SupName,
                    alldata[i].Phone,
                    alldata[i].Address,
                    "<button type='button' class='btn btn-primary' data-toggle='modal' data-target='#myModal'OnClick = 'editData(" + alldata[i].SupId + ")' > Edit</button > | <button type='button' class='btn btn-danger'OnClick='deleteData(" + alldata[i].SupId + ")'>Delete</button>"
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
    $("#SupName").val("");
    $("#Phone").val("");
    $("#Address").val("");
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
    //create json data
    var supplier = {
        SupName: $('#SupName').val(),
        Phone: $('#Phone').val(),
        Address: $('#Address').val()
    };
    //sent to Server(C#)
    $.ajax({
        type: "Post",
        url: "/Suppliers/Create",
        data: supplier,
        dataType: 'json',
        success: function (data) {
            noty({
                text: data, type: 'success', dismissQueue: true, layout: 'topCenter', theme: 'relax',
                timeout: 1000
            });
            showData()
            setTimeout(function () { $('#myModal').modal('hide'); }, 1000);
        },
        error: function (e) {
            console.log(e.responseText);
        }
    });
}
//function editData
var suppilerid;
function editData(sid) {
    $("#btnsave").val("Update");
    suppilerid = sid;
    $.ajax({
        type: "Get",
        url: "/Suppliers/GetDataID/",
        data: { id: sid },
        dataType: 'json',
        success: function (data) {
            $("#CatName").val(data.CatName);
        },
        error: function (e) {
            console.log(e.responseText);
        }
    });
}
//Function updateData
function updateData() {
    //create json data
    var supplier = {
        SupId: suppilerid,
        SupName: $('#SupName').val(),
        Phone: $('#Phone').val(),
        Address: $('#Address').val()
    };
    //sent to Server(C#)
    $.ajax({
        type: "Post",
        url: "/Suppliers/Edit",
        data: supplier,
        dataType: 'json',
        success: function (data) {
            noty({
                text: data, type: 'success', dismissQueue: true, layout: 'topCenter', theme: 'relax',
                timeout: 1000
            });
            showData();
            setTimeout(function () { $('#myModal').modal('hide'); }, 1000);
        },
        error: function (e) {
            console.log(e.responseText);
        }
    });
}
//deleteData
function deleteData(supplierid) {
    var n = noty({
        text: 'Do you want to remove?', type: 'alert',
        dismissQueue: true, layout: 'center', theme: 'relax', modal: true,
        buttons: [{
            addClass: 'btn btn-info', text: 'Ok', onClick: function ($noty) {
                $.ajax({
                    type: "Post",
                    url: "/Suppliers/Delete/",
                    data: { id: supplierid },
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
