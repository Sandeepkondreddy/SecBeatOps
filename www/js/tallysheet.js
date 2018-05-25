var qsParm = new Array();
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    document.addEventListener("backbutton", onBackKeyDown, false);
}
function onBackKeyDown() {
}
$(document).ready(function (){
    $("#loading").hide();
    $("#btnSubmit").hide();
    $("#home").click(function () {
        $.ajax({
            type: "GET",
		url: "http://apps.kpcl.com/KPCTSDS/api/Account/GetUserScreens/" + $("#hidusrid").val(),
            //url: "http://202.83.27.199/KPCTSDS/api/Account/GetUserScreens/" + $("#hidusrid").val(),
	    //url: "http://182.72.244.25/KPCTSDS/api/Account/GetUserScreens/" + $("#hidusrid").val(),
            data: '{}',
            contentType: "application/json",
            success: function(result) {
                window.location.href = result + '?user=' + btoa($("#hidusrid").val());
            }
        });
    });
    qs();
    GetCargoCondition();
    GetWeatherCondition();
    GetHandledCompany();
    GetLocations();
    qs2();

    $("#add").click(function(){
        var headrowCount = $("#tbldata thead tr").length;
        var rowCount = $("#tbldata tbody tr").length;
        var footrowCount = $("#tbldata tfoot tr").length;
        if(headrowCount == 0)
            $("#tbldata").append("<thead><tr><th class='text-center'>Slno</th><th class='text-center'>Width</th><th class='text-center'>x</th><th class='text-center'>Height</th><th class='text-center'>=</th><th class='text-center'>Total</th><th></th></tr></thead>");
        if(footrowCount == 0)
            $('#tbldata').append("<tfoot><tr><td></td><td colspan='4'></td><td><input type='text' class='gridinputtext-readonly text-right lt' readonly></td><td></td></tr></tfoot>");
        rowCount = $("#tbldata tbody tr").length;
        /*if(rowCount <= 9)*/
        {
            /*if(rowCount == 9)
                $("#add").find("i.fa").css('color', '#E4E4E4');
            else $("#add").find("i.fa").css('color', '#5cb85c');*/
            $("#tbldata").append("<tbody><tr><td>"+ (rowCount + 1) +"</td><td><input type='number' class='gridinputtext text-right wd' maxlength='3'></td><td>x</td>" +
                 "<td><input type='number' class='gridinputtext text-right ht' maxlength='3'></td><td>=</td>" +
                 "<td><input type='number' class='gridinputtext-readonly text-right tt' readonly></td>" +
                 "<td><span class='remCF'><i class='fa fa-remove fa-lg' style='color: #d9534f;' aria-hidden='true'></i></span></td></tr></tbody>");
            $("#tbldata tbody tr:eq(" + rowCount + ") td:eq(1)").find("input").focus();
        }
        $("#btnSubmit").show();
    });
    $("#tbldata").on('click', '.remCF', function(){
        $(this).parent().parent().remove();
        var rowCount = $("#tbldata tbody tr").length;
        $("#tbldata tbody tr").each(function (i) {
            $(this).closest('tr').find('td:eq(0)').text(i + 1);
        });

        if(rowCount == 0)
        {
            $("#tbldata").empty();
            $("#btnSubmit").hide();
        }
        /*else if(rowCount < 10)
            $("#add").find("i.fa").css('color', '#5cb85c');
        else
            $("#add").find("i.fa").css('color', '#E4E4E4');*/
        $("#tbldata tbody tr:eq(" + rowCount + ") td:eq(1)").find("input").val();
        TotalQty();
    });
    $("#tbldata").on('keyup', '.wd', function () {
        var wd = $(this).val();
        var ht = $(this).closest('tr').find('td:eq(3)').find("input").val();
        if($.isNumeric(wd) == true)
        {
            var tt = Math.abs(wd) * Math.abs(ht);
            $(this).closest('tr').find('td:eq(5)').find("input").val(tt);
        }
        else
            $(this).closest('tr').find('td:eq(5)').find("input").val(0);

        TotalQty();
    });
    $("#tbldata").on('keypress', '.wd', function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });
    $("#tbldata").on('keyup', '.ht', function (e) {
        var wd = $(this).closest('tr').find('td:eq(1)').find("input").val();
        var ht = $(this).val();
        if($.isNumeric(ht) == true)
        {
            var tt = Math.abs(wd) * Math.abs(ht);
            $(this).closest('tr').find('td:eq(5)').find("input").val(tt);
        }
        else
            $(this).closest('tr').find('td:eq(5)').find("input").val(0);

        TotalQty();
    });
    $("#tbldata").on('keypress', '.ht', function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });
    
    $("#imgAddSign").click(function(){
        var loc = "", cargo = "", weather = "", hndledcomp = "", hndledtype = "", total = 0, operation = "";

        $("#selloc option:selected").each(function () {
            loc += $(this).val();
        });
        $("#selcargo option:selected").each(function () {
            cargo += $(this).val();
        });

        $("#selweather option:selected").each(function () {
            weather += $(this).val();
        });

        $("#selhndcomp option:selected").each(function () {
            hndledcomp += $(this).val();
        });

        $("#selhndtype option:selected").each(function () {
            hndledtype += $(this).text().trim();//hndledtype += $(this).text().trim();
        });
        total = $('#tbldata tfoot tr td:eq(2)').find("input").val();
        operation = $("input[type='radio']:checked").val();

        window.location.href = 'Capture.html?user=' + btoa($("#hidusrid").val()) + '&trkid=' + btoa($("#hidtrkid").val()) + '&trkno=' + btoa($("#txttruckno").val().trim()) + '&loctype=' + btoa($("#hidloctype").val()) + '&loc=' + loc + '&cargo=' + cargo + '&weather=' + weather  + '&hndledcomp=' + hndledcomp + '&hndledtype=' + hndledtype + '&container=' + btoa($("#txtcontainerno").val()) + '&operation=' + operation;
    });

    $("#btnSubmit").click(function (){
        //debugger;
        var $btn = $("#btnSubmit");
        if(Validations())
        {
            var loc = "", cargo = "", weather = "", hndledcomp = "", hndledtype = "", total = 0, operation = "";
            $btn.find("i.fa").attr('class', 'fa fa-spinner fa-spin fa-lg');
            $btn.find("span").text("data is submitting please wait...");
            $btn.attr('disabled', true);
            $btn.attr('class', 'btn btn-custom-icon');
            $("#selloc option:selected").each(function () {
                loc += $(this).val();
            });
            $("#selcargo option:selected").each(function () {
                cargo += $(this).val();
            });

            $("#selweather option:selected").each(function () {
                weather += $(this).val();
            });

            $("#selhndcomp option:selected").each(function () {
                hndledcomp += $(this).val();
            });

            $("#selhndtype option:selected").each(function () {
                hndledtype += $(this).text().trim();
            });

            total = $('#tbldata tfoot tr td:eq(2)').find("input").val();
            operation = $("input[type='radio']:checked").val();
            if(operation=="0")operation="Carting";
            else if(operation=="1")operation="Stuffing";
            var Adddata = [];
            $("#tbldata tbody tr").each(function () {
                var t = $(this).find('td:eq(5)').find("input").val();
                if($.isNumeric(t) && Math.abs(t) > 0)
                {
                    var obj = {
                        TruckId : $("#hidtrkid").val(),
                        Width : $(this).find('td:eq(1)').find("input").val(),
                        Height : $(this).find('td:eq(3)').find("input").val(),
                        CargoCondition : cargo,
                        WeatherCondition : weather,
                        HandlingType : hndledtype,
                        HandledCompany : hndledcomp,
                        Qty : total,
                        Location : loc,
                        LocationType : $("#hidloctype").val(),
                        User : $("#hidusrid").val(),
                        Container_No : $("#txtcontainerno").val(),
                        Operation : operation
                    };
                    Adddata.push(obj);
                }
            });

            $.ajax({
                type: 'POST',
		    url: 'http://apps.kpcl.com/KPCTSDS/api/TallySheet/AddData',
                //url: 'http://202.83.27.199/KPCTSDS/api/TallySheet/AddData',
		//url: 'http://182.72.244.25/KPCTSDS/api/TallySheet/AddData',
                //url: 'http://localhost:51594/Api/TallySheet/AddData',
                dataType: "json",
                contentType : "application/json",
                data: JSON.stringify(Adddata),
                success: function (result) {
                    alert('Data Saved Successfully.');
                    window.location.href = 'SDS.html?user=' + btoa($("#hidusrid").val());
                    //window.location.href = 'SDS.html?user=' + btoa($("#hidusrid").val()) + '&trkno=' + btoa($("#txttruckno").val()) + '&qty=' + btoa(total) + '&loc=' + btoa(loc) + '';
                },
                error: function () {
                    alert('Error occurred while submitting data.');
                }
            });
        }
    });
});

function qs() {
    var query = window.location.search.substring(1);
    var parms = query.split('&');
    for (var i = 0; i < parms.length; i++) {
        var pos = parms[i].indexOf('=');
        if (pos > 0) {
            var key = parms[i].substring(0, pos);
            var val = parms[i].substring(pos + 1);
            qsParm[key] = val;
        }
    }
    
    if (parms.length > 0 && query != "") {
        $("#hidusrid").val(atob(qsParm["user"]));
        $("#hidtrkid").val(atob(qsParm["trkid"]));
        $("#txttruckno").val(atob(qsParm["trkno"]));
        $("#hidloctype").val(atob(qsParm["loctype"]));
        return true;
    }
    else {
        window.location.href = 'Login.html';
        return false;
    }
}

function qs2() {
    var query = window.location.search.substring(1);
    var parms = query.split('&');
    for (var i = 0; i < parms.length; i++) {
        var pos = parms[i].indexOf('=');
        if (pos > 0) {
            var key = parms[i].substring(0, pos);
            var val = parms[i].substring(pos + 1);
            qsParm[key] = val;
        }
    }

    if(qsParm.hasOwnProperty("sign"))
    {
        
        if (parms.length > 0 && query != "") {
            $("#hidusrid").val(atob(qsParm["user"]));
            $("#hidtrkid").val(atob(qsParm["trkid"]));
            $("#txttruckno").val(atob(qsParm["trkno"]));
            $("#hidloctype").val(atob(qsParm["loctype"]));
            $("#loadImg").attr('src', atob(qsParm["sign"]));
            $("#selloc option[value=" + qsParm["loc"] + "]").attr('selected', 'selected');
            $("#selcargo option[value=" + qsParm["cargo"] + "]").attr('selected', 'selected');
            $("#selweather option[value=" + qsParm["weather"] + "]").attr('selected', 'selected');
            $("#selhndcomp option[value=" + qsParm["hndledcomp"] + "]").attr('selected', 'selected');
           // $("#selhndtype option[text=" + qsParm["hndledtype"] + "]").attr('selected', 'selected');
            $("#selhndtype option:contains(" + qsParm["hndledtype"] + ")").attr('selected', 'selected');
            if(atob(qsParm["container"]) != "UNDEFINED")
                $("#txtcontainerno").val(atob(qsParm["container"]));
            else $("#txtcontainerno").val();
            $("input:radio[name='operation'][value='" + qsParm["operation"] + "']").attr("checked", true);
            return true;
        }
        else {
            window.location.href = 'Login.html';
            return false;
        }
    }
}

function TotalQty()
{
    var rowCount = $("#tbldata tr").length;
    var total = 0;
    $("#tbldata tr").each(function(){
        var t = $(this).find('td:eq(5)').find("input").val();
        if($.isNumeric(t) == true)
            total = Math.abs(total) + Math.abs(t);
    });
    $('#tbldata tfoot tr td:eq(2)').find("input").val(total);
}

function GetLocations()
{
    $("#selloc").empty();
    $("#selloc").append($("<option></option>").val(0).html("Select"));
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
	    url: 'http://apps.kpcl.com/KPCTSDS/api/Location/GetLocation/' + $("#hidloctype").val(),
        //url: 'http://202.83.27.199/KPCTSDS/api/Location/GetLocation/' + $("#hidloctype").val(),
	//url: 'http://182.72.244.25/KPCTSDS/api/Location/GetLocation/' + $("#hidloctype").val(),
        dataType: "json",
        data: '{}',
        async: false,
        success: function (result) {
            $.each(result, function (key, value) {
                $("#selloc").append($("<option></option>").val(value.Id).html(value.Code));
            });
        },
        error: function () {
            alert('Error occurred while loading Locations');
        }
    });
}

function GetCargoCondition()
{
    $("#selcargo").empty();
    $("#selcargo").append($("<option></option>").val(0).html("Select"));
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
	    url: 'http://apps.kpcl.com/KPCTSDS/api/Masters/GetCargoCondition',
	//url: 'http://202.83.27.199/KPCTSDS/api/Masters/GetCargoCondition',
        //url: 'http://182.72.244.25/KPCTSDS/api/Masters/GetCargoCondition',
        dataType: "json",
        data: '{}',
        async: false,
        success: function (result) {
            $.each(result, function (key, value) {
                $("#selcargo").append($("<option></option>").val(value.Id).html(value.Name));
            });
        },
        error: function () {
            alert('Error occurred while loading Cargo Conditions');
        }
    });
}
function GetWeatherCondition()
{
    $("#selweather").empty();
    $("#selweather").append($("<option></option>").val(0).html("Select"));
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
	    url: 'http://apps.kpcl.com/KPCTSDS/api/Masters/GetWeatherCondition',
        //url: 'http://202.83.27.199/KPCTSDS/api/Masters/GetWeatherCondition',
	//url: 'http://182.72.244.25/KPCTSDS/api/Masters/GetWeatherCondition',
        dataType: "json",
        data: '{}',
        async: false,
        success: function (result) {
            $.each(result, function (key, value) {
                $("#selweather").append($("<option></option>").val(value.Id).html(value.Name));
            });
        },
        error: function () {
            alert('Error occurred while loading Weather Conditions');
        }
    });
}
function GetHandledCompany()
{
    $("#selhndcomp").empty();
    $("#selhndcomp").append($("<option></option>").val(0).html("Select"));
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
	    url: 'http://apps.kpcl.com/KPCTSDS/api/Masters/GetHandledCompany',
        //url: 'http://202.83.27.199/KPCTSDS/api/Masters/GetHandledCompany',
	//url: 'http://182.72.244.25/KPCTSDS/api/Masters/GetHandledCompany',
        dataType: "json",
        data: '{}',
        async: false,
        success: function (result) {
            $.each(result, function (key, value) {
                $("#selhndcomp").append($("<option></option>").val(value.Id).html(value.Name));
            });
        },
        error: function () {
            alert('Error occurred while loading Handling Company');
        }
    });
}
function Validations()
{
    var loc = "", cargo = "", weather = "", hndledcomp = "", hndledtype = "", total = 0, operation = 0;
    $("#selloc option:selected").each(function () {
        loc += $(this).val();
    });

    $("#selcargo option:selected").each(function () {
        cargo += $(this).val();
    });

    $("#selweather option:selected").each(function () {
        weather += $(this).val();
    });

    $("#selhndcomp option:selected").each(function () {
        hndledcomp += $(this).val();
    });

    $("#selhndtype option:selected").each(function () {
        hndledtype += $(this).val();
    });

    total = $('#tbldata tfoot tr td:eq(2)').find("input").val();
    operation = $("input[type='radio']:checked").val();

    if(loc == 0)
    {
        alert('Please Select Location');
        $("#selloc").focus();
        return false;
    }
    else if(cargo == 0)
    {
        alert('Please Select Cargo Condition');
        $("#selcargo").focus();
        return false;
    }
    else if(weather == 0)
    {
        alert('Please Select Weather Condition');
        $("#selweather").focus();
        return false;
    }
    else if(hndledcomp == 0)
    {
        alert('Please Select Handled Company');
        $("#selhndcomp").focus();
        return false;
    }
    else if(hndledtype == 0)
    {
        alert('Please Select Handled Type');
        $("#selhndtype").focus();
        return false;
    }
    else if(total == 0)
    {
        alert('Please Enter Width and Height.');
        if($("#tbldata tbody tr:eq(0) td:eq(1)").find("input").val() == "")
            $("#tbldata tbody tr:eq(0) td:eq(1)").find("input").focus();
        else if($("#tbldata tbody tr:eq(0) td:eq(3)").find("input").val() == "")
            $("#tbldata tbody tr:eq(0) td:eq(3)").find("input").focus();
        return false;
    }
    else if(operation == 1)
    {
        if($("#txtcontainerno").val() == "")
        {
            alert('Please Enter Container No.');
            $("#txtcontainerno").focus();
            return false;
        }
    }
    return true;
}
