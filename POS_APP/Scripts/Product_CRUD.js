//document loaded
$(document).ready(function () {
    showData();
});
//Function showData
function showData() {
    $.ajax({
        type: "Get",
        url: "/Products/GetAllData",
        dataType: 'json',
        success: function (alldata) {
            console.log(alldata);
            var columns = [
                { title: "Id" },
                { title: "Product Name" },
                { title: "Price" },
                { title: "Image" },
                { title: "Actions" }
            ];
            var data = [];
            for (var i in alldata) {
                data.push([
                    alldata[i].PCode,
                    alldata[i].PName,
                    alldata[i].Price,
                    "<img src='../Images/" + alldata[i].Picture + "' width='60' height='80''>",
                    "<button type='button' class='btn btn-primary' data-toggle='modal' data-target='#myModal' OnClick = 'editData(" + alldata[i].PCode + ")' > Edit</button > | <button type='button' class='btn btn-danger' OnClick='deleteData(" + alldata[i].PCode + ")'>Delete</button>"
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
    $("#PName").val("");
    $("#Price").val("");
    $("#Picture").val("");
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
    var fileUpload = $("#Picture").get(0);
    var files = fileUpload.files;
    var data = new FormData();
    for (var i = 0; i < files.length; i++) {
        data.append("File", files[i]);
    }
    data.append("PName", $("#PName").val());
    data.append("Price", $("#Price").val());
    data.append("Picture", $("#Picture").val());
    //sent to Server(C#)
    $.ajax({
        type: "Post",
        url: "/Products/Create",
        data: data,
        contentType: false,
        processData: false,
        success: function (data) {
            noty({
                text: data, type: 'success', dismissQueue: true, layout: 'topCenter', theme: 'relax', timeout:
                    1000
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
var productid;
function editData(bid) {
    $("#btnsave").val("Update");
    productid = bid;
    $.ajax({
        type: "Get",
        url: "/Products/GetDataID/",
        data: { id: bid },
        dataType: 'json',
        success: function (data) {
            $("#PName").val(data.PName);
            $("#Price").val(data.Price);
            //$("#Picture").val(data.Picture);
            $('#mypicture').attr("src", "../Images/" + data.Picture);
        },
        error: function (e) {
            console.log(e.responseText);
        }
    });
}
//Function updateData
function updateData() {
    var fileUpload = $("#Picture").get(0);
    var data = new FormData();
    var files = fileUpload.files;
    for (var i = 0; i < files.length; i++) {
        data.append("File", files[i]);
    }
    data.append("PCode", productid);
    data.append("PName", $("#PName").val());
    data.append("Price", $("#Price").val());
    data.append("Picture", $("#Picture").val());
    //sent to Server(C#)
    $.ajax({
        type: "Post",
        url: "/Products/Edit",
        data: data,
        contentType: false,
        processData: false,
        success: function (data) {
            noty({
                text: data, type: 'success', dismissQueue: true, layout: 'topCenter', theme: 'relax', timeout:
                    1000
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
function deleteData(productid) {
    var n = noty({
        text: 'Do you want to remove?', type: 'alert',
        dismissQueue: true, layout: 'center', theme: 'relax', modal: true,
        buttons: [{
            addClass: 'btn btn-info', text: 'Ok', onClick: function ($noty) {
                $.ajax({
                    type: "Post",
                    url: "/Products/Delete/",
                    data: { id: productid },
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