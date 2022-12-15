/*--------document Load--------------- */
$(document).ready(function () {
    DisplayData("");
    display();
});
/*--------Click Search--------------- */
$("#btnsearch").click(function () {
    var search = $("#search").val();
    DisplayData(search);
});
/*--------DisplayData--------------- */
function DisplayData(search) {
    $.ajax({
        url: '/Sales/GetProducts',
        type: 'GET',
        data: 'search=' + search,
        dataType: 'json',
        success: function (data) {
            var str = "";
            for (var i in data) {
                str += '<div class="gallery">';
                str += '<a target="_blank" href="' + data[i].Picture + '">'
                str += '<img src="../Images/' + data[i].Picture + '">';
                str += '</a>';
                str += '<div class="desc">PName:' + data[i].PName + '<br>Price:' + data[i].Price;
                str += '<br><input type="button" class="btn btn-primary" value="Buy Now" onclick="buyNow(' +
                    data[i].PCode + ',\'' + data[i].PName + '\',' + data[i].Price + ');" /></div>';
                str += '</div>';
            }
            $('#display').html(str);
        },
        error: function (e) {
            console.log(e.responseText);
        }
    });
}
/*-- Create Array --*/
var arr = [];
/*-- display Function --*/
function display() {
    var total = 0;
    var amount = 0;
    var str = "<table class='table'>";
    str += "<tr><th></th><th>PCode</th><th>PName</th><th>SalePrice</th><th>SaleQTY</th><th>Amount</th></tr>";
    for (var index in arr) {
        amount = arr[index].SaleQTY * arr[index].SalePrice;
        total += amount;
        str += "<tr>";
        str += "<td><input type='button' class='btn btn-danger' value='Delete' onClick='myDelete(" + index +
            ")'></td>";
        str += "<td>" + arr[index].PCode + "</td>";
        str += "<td>" + arr[index].PName + "</td>";
        str += "<td>" + arr[index].SalePrice.toFixed(2) + "</td>";
        str += "<td><input type='button' class='btn btn-danger' value='-' onClick='mySub(" + index + ")'> "
        str += arr[index].SaleQTY
        str += " <input type='button' class='btn btn-info' value='+' onClick='mySum(" + index + ")'></td>";
        str += "<td>" + amount.toFixed(2) + "</td>";
        str += "</tr>";
    }
    str += "<tr><td colspan='5'> Total Amount:</td><td>" + total.toFixed(2) + "</td></tr>";
    str += "</table>";
    str += "<input type='button' class='btn btn-info' value='Save All' onClick='SaleProduct()'>";
    $('#sale_table').html(str);
}
/*-- buyNow Function --*/
function buyNow(code, name, price) {
    arr.push({ PCode: code, PName: name, SaleQTY: 1, SalePrice: price });
    display();
}
/*-- mySum Function --*/
function mySum(index) {
    arr[index].SaleQTY += 1;
    display();
}
/*-- mySub Function --*/
function mySub(index) {
    if (arr[index].SaleQTY > 1) {
        arr[index].SaleQTY -= 1;
        display();
    }
}
/*-- myDelete Function --*/
function myDelete(index) {
    if (confirm("Do you want to delete")) {
        arr.splice(index, 1);
        display();
    }
}
/*-- SaleProduct Function --*/
function SaleProduct(index) {
    if (confirm("Do you want to Save All?")) {
        //sent to Server(C#)
        $.ajax({
            type: "Post",
            url: "/Sales/SaveAll",
            data: JSON.stringify(arr),
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (data) {
                noty({
                    text: data, type: 'success', dismissQueue: true, layout: 'topCenter', theme: 'relax', timeout:
                        1000
                });
                arr = [];
                display();
                setTimeout(function () { $('#myModal').modal('hide'); }, 1000);
            },
            error: function (e) {
                console.log(e.responseText);
            }
        });

    }
}