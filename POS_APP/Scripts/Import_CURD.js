/*---document loaded---*/
$(document).ready(function () {
    showData();
    // getAutoComplete();
});
/*---function FormatDate---*/
function FormatDate(s) {
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var dt = new Date(parseFloat(/Date\(([^)]+)\)/.exec(s)[1]));
    return dt.getDate() + "-" + monthNames[dt.getMonth()] + "-" + dt.getFullYear();
}
/*---Function showData---*/
function showData() {
    $.ajax({
        type: "Get",
        url: "/Imports/GetAllData",
        dataType: 'json',
        success: function (alldata) {
            console.log(alldata);
            var columns = [
                { title: "Id" },
                { title: "Import Date" },
                { title: "Product" },
                { title: "Category" },
                { title: "Supplier" },
                { title: "Quantity" },
                { title: "Actions" }
            ];
            var data = [];
            for (var i in alldata) {
                data.push([
                    alldata[i].ImportID,
                    FormatDate(alldata[i].ImportDate),
                    alldata[i].PName,
                    alldata[i].CatName,
                    alldata[i].SupName,
                    alldata[i].ImportQTY,

                    "<button type='button' class='btn btn-primary' data-toggle='modal' data-target='#myModal' OnClick = 'editData(" + alldata[i].ImportID + ")' > Edit</button > | <button type='button' class='btn btn-danger' OnClick='deleteData(" + alldata[i].ImportID + ")'>Delete</button>"
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
function addNew() {
    $('#PCode').selectpicker('val', "");
    $('#CatId').selectpicker('val', "");
    $('#SupId').selectpicker('val', "");
    var today = new Date();
    var importDate = today.getFullYear() + "-" + ((today.getMonth() < 9) ? "0" : "") +
        String(today.getMonth() + 1) + "-" + ((today.getDate() < 10) ? "0" : "") +
        String(today.getDate());
    $('#ImportDate').val(importDate);
    today.setDate(today.getDate() + 7);

    $("#ImportQTY").val("");
    $("#btnsave").val("Insert");
}
/*---Save Button---*/
function saveData() {
    if ($("#btnsave").val() == "Insert") {
        insertData();
    } else {
        updateData();
    }
}
/*---function insertData---*/
function insertData() {
    //create json data
    var borrow = {
        PCode: $('#PCode').val(),
        CatId: $('#CatId').val(),
        SupId: $('#SupId').val(),
        ImportDate: $('#ImportDate').val(),
        ImportQTY: $('#ImportQTY').val(),
    };
    //sent to Server(C#)
    $.ajax({
        type: "Post",
        url: "/Imports/Create",
        data: borrow,
        dataType: 'json',
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
/*--Format Date SetData for Edit ---*/
function FormatDateEdit(s) {
    var dt = new Date(parseFloat(/Date\(([^)]+)\)/.exec(s)[1]));
    month = ((dt.getMonth() + 1) <= 9 ? "0" + (dt.getMonth() + 1) : (dt.getMonth() + 1));
    day = (dt.getDate() <= 9 ? ("0" + dt.getDate()) : dt.getDate());
    return dt.getFullYear() + "-" + month + "-" + day; //yyyy-MM-dd
}
/*---function editData---*/
var borrowid;
function editData(bid) {
    $("#btnsave").val("Update");
    borrowid = bid;
    $.ajax({
        type: "Get",
        url: "/Imports/GetDataID/",
        data: { id: bid },
        dataType: 'json',
        success: function (data) {
            $('#PCode').selectpicker('val', data[0].PCode);
            $('#CatId').selectpicker('val', data[0].CatId);
            $('#SupId').selectpicker('val', data[0].SupId);
            $("#ImportDate").val(FormatDateEdit(data[0].importDate));
            $("#ImportQTY").val(data.ImportQTY);
        },
        error: function (e) {
            console.log(e.responseText);
        }
    });
}
/*---Function updateData---*/
function updateData() {
    //create json data
    var borrow = {
        ImportID: borrowid,
        PCode: $('#PCode').val(),
        CatId: $('#CatId').val(),
        SupId: $('#SupId').val(),
        ImportDate: $('#ImportDate').val(),
        ImportQTY: $('#ImportQTY').val()
    };
    //sent to Server(C#)
    $.ajax({
        type: "Post",
        url: "/Imports/Edit",
        data: borrow,
        dataType: 'json',
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
/*---deleteData---*/
function deleteData(borrowid) {
    var n = noty({
        text: 'Do you want to remove?', type: 'alert',
        dismissQueue: true, layout: 'center', theme: 'relax', modal: true,
        buttons: [{
            addClass: 'btn btn-info', text: 'Ok', onClick: function ($noty) {
                $.ajax({
                    type: "Post",
                    url: "/Imports/Delete/",
                    data: { id: borrowid },
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

