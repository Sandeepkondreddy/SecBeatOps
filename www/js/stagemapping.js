var width = document.documentElement.clientWidth;
var qsParm = new Array();
var usrStages = [];
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    document.addEventListener("backbutton", onBackKeyDown, false);
}
function onBackKeyDown() {
}
$(document).ready(function (){
    $("#loading").hide();
    qs();
    GetUsers();
    GetStages();
    CheckBoxEvents();

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

    $('#seluser').dropdown();

    $('#seluser').change(function(){
        GetUserStages($(this).val().trim());
        GetStages();
        CheckBoxEvents();
    });

    $("#btnSubmit").click(function() {
        var users = "", stages = "";
        var len = $('.list .child.checkbox').length;
        $("#seluser option:selected").each(function () {
            users += $(this).val().trim() + ',';
        });

        /*$("#selstage option:selected").each(function () {
            stages += $(this).val().trim() + ',';
        });*/

        for(var i = 0; i < len; i++)
        {
            if($('.list .child.checkbox')[i].firstChild.checked)
                stages += $('.list .child.checkbox')[i].firstChild.name + ',';
        }

        if(users == "" || stages == "")
        {
            alert('Please select atleast one User and one Stage.');
            return false;
        }
        else
        {
            $("#btnSubmit").find("i.fa").attr('class', 'fa fa-spinner fa-spin fa-lg');
            $("#btnSubmit").find("span").text("data is submitting please wait...");
            $("#btnSubmit").attr('disabled', true);
            $("#btnSubmit").attr('class', 'btn btn-custom-icon');
            var Adddata = [];
            var user = users.slice(0, -1).split(',');
            for(var i = 0; i < user.length; i++)
            {
                if(user[i] != "")
                {
                    var stage = stages.slice(0, -1).split(',');
                    for (var j = 0; j < stage.length; j++)
                    {
                        if(stage[0] != "")
                        {
                            var obj = {
                                UserSlno: user[i],
                                StatusId: stage[j],
                                CreatedBy: $("#hidusrid").val()
                            };
                            Adddata.push(obj);
                        }
                    }
                }
            }
            $.ajax({
                type: 'POST',
		    url: 'http://apps.kpcl.com/KPCTSDS/api/Account/AddUserStages',
                //url: 'http://202.83.27.199/KPCTSDS/api/Account/AddUserStages',
		//url: 'http://182.72.244.25/KPCTSDS/api/Account/AddUserStages',
                dataType: "json",
                contentType : "application/json",
                data: JSON.stringify(Adddata),
                success: function (result) {
                    alert('Stages Mapped Successfully.');
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
                },
                error: function (xhr, status, error) {
                    alert('Error occurred while submitting data.\n\r' + xhr.responseText);
                    $("#btnSubmit").find("i.fa").attr('class', 'fa fa-check');
                    $("#btnSubmit").find("span").text("Submit");
                    $("#btnSubmit").attr('disabled', false);
                    $("#btnSubmit").attr('class', 'btn btn-custom');
                }
            });
        }
    });
});

function CheckBoxEvents()
{
    $('.list .master.checkbox').checkbox({
        // check all children
        onChecked: function() {
            var $childCheckbox  = $(this).closest('.checkbox').siblings('.list').find('.checkbox');
            $childCheckbox.checkbox('check');
        },
        // uncheck all children
        onUnchecked: function() {
            var $childCheckbox  = $(this).closest('.checkbox').siblings('.list').find('.checkbox');
            $childCheckbox.checkbox('uncheck');
        }
    });
    $('.list .child.checkbox').checkbox({
        // Fire on load to set parent value
        fireOnInit : true,
        // Change parent state on each child checkbox change
        onChange   : function() {
            var $listGroup      = $(this).closest('.list'),
                $parentCheckbox = $listGroup.closest('.item').children('.checkbox'),
                $checkbox       = $listGroup.find('.checkbox'),
                allChecked      = true,
                allUnchecked    = true;

            // check to see if all other siblings are checked or unchecked
            $checkbox.each(function() {
                if($(this).checkbox('is checked')) {
                    allUnchecked = false;
                }
                else {
                    allChecked = false;
                }
            });
            // set parent checkbox state, but dont trigger its onChange callback
            if(allChecked) {
                $parentCheckbox.checkbox('set checked');
            }
            else if(allUnchecked) {
                $parentCheckbox.checkbox('set unchecked');
            }
            else {
                $parentCheckbox.checkbox('set indeterminate');
            }
        }
    });
}

function GetUsers()
{
    $("#seluser").empty();
    $("#seluser").append("<option value=''>Select User</option>");
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
	    url: 'http://apps.kpcl.com/KPCTSDS/api/Account/GetUsers',
        //url: 'http://202.83.27.199/KPCTSDS/api/Account/GetUsers',
	//url: 'http://182.72.244.25/KPCTSDS/api/Account/GetUsers',
        dataType: "json",
        data: '{}',
        async: false,
        success: function (result) {
            $.each(result, function (key, value) {
                $("#seluser").append($("<option></option>").val(value.UserId).html(value.LoginId + '---' + value.EmployeeId));
            });
        },
        error: function () {
            alert("Error occurred while loading Users.");
        }
    });
}

function GetStages()
{
    $("#listStage").empty();
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
	    url: 'http://apps.kpcl.com/KPCTSDS/api/Masters/GetStatus',
        //url: 'http://202.83.27.199/KPCTSDS/api/Masters/GetStatus',
	//url: 'http://182.72.244.25/KPCTSDS/api/Masters/GetStatus',
        dataType: "json",
        data: '{}',
        async: false,
        success: function (result) {
            for(var i = 0; i < result.length; i++)
            {
                var checked = false;
                for(var j = 0; j < usrStages.length; j++)
                {
                    if(usrStages[j] == result[i].Id)
                        checked = true;
                }
                if(checked)
                    $("#listStage").append($("<div class='item'><div class='ui fluid child checkbox'><input type='checkbox' name=" + result[i].Id + " checked><label>" + result[i].Name + "</label></div></div>"));
                else
                    $("#listStage").append($("<div class='item'><div class='ui fluid child checkbox'><input type='checkbox' name=" + result[i].Id + "><label>" + result[i].Name + "</label></div></div>"));
            }
        },
        error: function () {
            alert("Error occurred while loading Stages.");
        }
    });
}

function GetUserStages(userid)
{
    usrStages = [];
    $.ajax({
	    url: 'http://apps.kpcl.com/KPCTSDS/api/Account/GetUserStages/' + userid,
        //url: 'http://202.83.27.199/KPCTSDS/api/Account/GetUserStages/' + userid,
	//url: 'http://182.72.244.25/KPCTSDS/api/Account/GetUserStages/' + userid,
        type: 'GET',
        data: '{}',
        dataType: 'json',
        async: false,
        success: function (data){
            if(data.length > 0)
            {
                $("#listStage").empty();
                for(var i = 0; i < data.length; i++)
                    usrStages.push(data[i]);
            }
        }
    });
}

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
        return true;
    }
    else {
        window.location.href = 'Login.html';
        return false;
    }
}
