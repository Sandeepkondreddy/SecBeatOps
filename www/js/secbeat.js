var qsParm = new Array(), oldvalue = "";
document.addEventListener("deviceready", onDeviceReady, false);

/* function onDeviceReady() {
    document.addEventListener("backbutton", onBackKeyDown, false);
    $("#hiduuid").val(device.uuid);
    window.plugins.imeiplugin.getImei(callback);
    nfc.enabled(function(){        
        lblerr.innerHTML = "Tap nfc tag to read";
        nfc.addNdefListener(
            function (nfcEvent){
				
				var tag = nfcEvent.tag,
                ndefMessage = tag.ndefMessage;
				
				// dump the raw json of the message
				alert(JSON.stringify(ndefMessage));
				
				// assuming the first record in the message has
                // a payload that can be converted to a string.
				alert(nfc.bytesToString(ndefMessage[0].payload).substring(3));
				
				
                $("#loading").show();
                var tagdata = nfcEvent.tag.ndefMessage[0]["payload"];
				alert(tagdata);
                var label = document.createTextNode(nfc.bytesToString(tagdata));
                txttag.value=label.data.substring(3);
				alert(nfcEvent);
                lblerr.innerHTML = "";
                txtloc.value = "";
                txtstatus.innerHTML = "";
                hidloc.value = "";
                hidloctype.value = "";
                //GetTruckDetails(label.data.substring(3));//Added for fetching truck details on NFC read
				getLocationDetails(label.data.substring(3));
                oldvalue = "";
                //GetDeviceStatus();
                //GetTag_TruckDetails(label.data.substring(3));//Added for fetching truck details on NFC read
				txtBeatOfficer.val($("#hidusrid").val());
                $("#loading").hide();
            },
            function(){
                lblerr.innerHTML = "";
            },
            function(){
                lblerr.innerHTML = "Error in reading tag.";
        });
    },
    function(){
        lblerr.innerHTML = "";
    });
} */



function onDeviceReady() {
	document.addEventListener("backbutton", onBackKeyDown, false);
    $("#hiduuid").val(device.uuid);
    window.plugins.imeiplugin.getImei(callback);
  window.plugins.imeiplugin.getImei(callback);
  nfc.addTagDiscoveredListener(nfcTagDetected); // add NFC listener

}
function nfcTagDetected(reading){ 
  
  //alert(reading.tag.id); // alert the id of the NFC reading
   var TagId=reading.tag.id; 
 $("#txttag").val(TagId);
  getLocationDetails(reading.tag.id);
  
  txtBeatOfficer.val($("#hidusrid").val());

} 

/* onDeviceReady: function() {
    app.receivedEvent('deviceready');
$("#loading").hide();
    // Read NDEF formatted NFC Tags
    nfc.addNdefListener (
        function (nfcEvent) {
            var tag = nfcEvent.tag,
                ndefMessage = tag.ndefMessage;

            // dump the raw json of the message
            // note: real code will need to decode
            // the payload from each record
            alert(JSON.stringify(ndefMessage));

            // assuming the first record in the message has
            // a payload that can be converted to a string.
            alert(nfc.bytesToString(ndefMessage[0].payload).substring(3));
        },
        function () { // success callback
            alert("Waiting for NDEF tag");
        },
        function (error) { // error callback
            alert("Error adding NDEF listener " + JSON.stringify(error));
        }
    );
},
 */
function onBackKeyDown() {
}
function callback(imei) {
    $("#hidimei").val(imei);
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

    if (parms.length == 1 && query != "") {
        $("#hidusrid").val(atob(qsParm["user"]));
        return true;
    }
    else if(parms.length > 1) {
        $("#hidusrid").val(atob(qsParm["user"]));
        $("#txttruckno").val(atob(qsParm["trkno"]));
        $("#txtqty").val(atob(qsParm["qty"]));
        $("#hidloc").val(atob(qsParm["loc"]));
        $("#btnSubmit").html("<i class='fa fa-check'></i> Submit");
        $("#btnSubmit").attr('disabled', false);
        $("#btnSubmit").attr('class', 'btn btn-custom');
        return true;
    }
    else {
        window.location.href = 'Login.html';
        return false;
    }
}
$(document).ready(function () {
    $("#imgtruck").hide();
    $("#loading").hide();
    //$("#btnSubmit").hide();
    //$("#btnClear").hide();
    $("#txttruckno").focus();
    $("#selLocation").prop('disabled', true);
    qs();
    GetDeviceStatus();
	//txtBeatOfficer.val($("#user").val());
    //GetTruckDetails($("#txttruckno").val().trim());
    //Reason();
	getUserName($("#hidusrid").val());
	//getLocationDetails(10001);txttag.value="10001"; hidLocId.value="1"; 
    $("#home").click(function () {
        $("#loading").show();
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

    $("#imgSearch").click(function () {
        $("#loading").show();
        $("#imgtruck").hide();
        $("#txtparty").val("");
        $("#txtloc").val("");
        $("#txtcargo").val("");
        $("#txtqty").val("");
        $("#hidTruckId").val("");
        $("#hidStatusId").val("");
        $("#txtstatus").text("");
        oldvalue = "";
        GetDeviceStatus();
        GetTruckDetails($("#txttruckno").val().trim());
        Reason();
        GetUserStages($("#hidusrid").val());
        $("#loading").hide();
    });

    
    
    $("#imgScan").click(function () {
        $("#loading").show();
        $("#imgtruck").hide();
        $("#txtparty").val("");
        $("#txtloc").val("");
      
        oldvalue = "";
        GetDeviceStatus();
        scan();
        //GetUserStages($("#hidusrid").val());
        $("#loading").hide();
    });



    $("#btnClear").click(function (){
        $("#loading").show();
        window.location.href = 'SecBeat.html?user=' + btoa($("#hidusrid").val());
    });

    $("#btnSubmit").click(function (){
        var $btn = $("#btnSubmit");
        //GetTruckDetails($("#txttruckno").val());
        
        if($("#txttag").val() == "")
        {
            alert('Please Scan Tag.');
			//window.location.href = 'TallySheet.html?user=' + btoa($("#hidusrid").val()) + '&trkid=' + btoa($("#hidTruckId").val()) + '&trkno=' + btoa($("#txttruckno").val().trim()) + '&loctype=' + btoa($("#hidloctype").val()) + '';
        }
		else if($("#txtloc").val() == "")
		{
			 alert('Location details not found.');
		}
        else
        {
            $btn.html("<i class='fa fa-spinner fa-spin'></i>data is submitting please wait...");
            $btn.attr('disabled', true);
            $btn.attr('class', 'btn btn-custom-icon');
            var reason = "";
            $("#selReason option:selected").each(function () {
                reason += $(this).val().trim();
            });
            //alert($("#hidimei").val());
            var Adddata = {};
            Adddata.TagNo = $("#txttag").val();
            Adddata.LocationId = $("#hidLocId").val();            
            Adddata.BeatOfficer = $("#txtBeatOfficer").val();
			Adddata.IMEI=$("#hidimei").val();            
            Adddata.Remarks = $("#txtremarks").val();
            Adddata.User = $("#hidusrid").val();
            $.ajax({
                type: 'POST',
                url: 'http://apps.kpcl.com/SecBeatAPI/api/SecBeatDetails/AddData',
				//url: 'http://localhost:51594/api/SecBeatDetails/AddData',
                dataType: "json",
                data: Adddata,
                success: function (result) {
                    alert('Data Saved Successfully.');
                    window.location.href = 'SecBeat.html?user=' + btoa($("#hidusrid").val());
                },
                error: function (xhr, status, error) {
                    alert('Error occurred while saving the data.\n\r' + xhr.responseText);
                    $btn.html("<i class='fa fa-check'></i> " + $("#hidNewStatus").val());
                    $btn.attr('disabled', false);
                    $btn.attr('class', 'btn btn-custom');
                }
            });
        }
    });
});

function GetUserStages(userid)
{
   
}

function GetTruckDetails(truckno)
{
    var trkno = truckno == "" ? "" : truckno;
    if(trkno != "")
    {
        $.ajax({
		url: 'http://apps.kpcl.com/KPCTSDS/api/TruckDetails/GetTruckDetails/' + trkno,
            //url: 'http://202.83.27.199/KPCTSDS/api/TruckDetails/GetTruckDetails/' + trkno,
	    //url: 'http://182.72.244.25/KPCTSDS/api/TruckDetails/GetTruckDetails/' + trkno,
            type: 'GET',
            data: '{}',
            dataType: 'json',
            async: false,
            success: function (result) {
                if (result.length > 0) {
                    $("#txttag").val(result[0].TagNo);
                    $("#txtparty").val(result[0].Party);
                    $("#txtloc").val(result[0].Loc);
                    $("#txtactloc").val(result[0].ActualLocation);
                    $("#txtcargo").val(result[0].Cargo);
                    $("#txtqty").val(result[0].Qty);
                    $("#txtstatus").text(result[0].Status);
                    $("#hidNewStatus").val(result[0].NextStatus);
                    $("#hidTruckId").val(result[0].TruckId);
                    $("#hidStatusId").val(result[0].StatusId);
                    $("#hidfrstflag").val(result[0].FirstTransit_Flag);
                    $("#hidprkngflag").val(result[0].DBParking_Flag);
                    $("#hidscndflag").val(result[0].SecondTransit_Flag);
                    $("#hidactlogflag").val(result[0].ActivityLoc_Flag);
                    $("#hidsdsoutflag").val(result[0].SDSOut_Flag);
                    $("#hidkpctoutflag").val(result[0].KPCTOut_Flag);
                    $("#hidfnlflag").val(result[0].FinalTransit_Flag);
                    $("#txtstatus").attr('class', 'text-success');
                    $("#btnSubmit").show();
                    $("#btnClear").show();
                    $("#hidtrkstatus").val(result[0].NextStatus);
                    if(oldvalue == "")
                        oldvalue = result[0].NextStatus;
                    $("#btnSubmit").attr('disabled', false);
                    $("#btnSubmit").attr('class', 'btn btn-custom');
                    $("#btnSubmit").html("<i class='fa fa-check'></i>");
                    if($("#hidStatusId").val() == 5 && $("#hidloctype").val() == 1 && $("#hidNewStatus").val() == "ACTIVITY END")
                        $("#btnSubmit").html("<i class='fa fa-check'></i> Tally Sheet");
                    else if($("#hidStatusId").val() == 5 && $("#hidloctype").val() == 2 && $("#hidNewStatus").val() == "ACTIVITY END")
                        $("#btnSubmit").html("<i class='fa fa-check'></i> Tally Sheet");
                    else if(result[0].NextStatus == "" || $("#hidloctype").val() == "" || $("#hidloctype").val() == "--" || $("#hidStatusId").val() == "")
                        $("#btnSubmit").attr('disabled', true);
                    if($("#hidNewStatus").val() == "ACTIVITY END")
                        $("#btnSubmit").html("<i class='fa fa-check'></i> Tally Sheet");
                    else
                        $("#btnSubmit").html("<i class='fa fa-check'></i> " + result[0].NextStatus);
                    DisableButton(result[0].NextStatus, result[0].LocType, $("#hidloctype").val());
                }
                else {
                    $("#txtstatus").text("No Data Found");
                    $("#txtstatus").attr('class', 'text-danger');
                }
            },
            error: function () {
                alert('Error occurred while loading Truck details.');
                $("#imgtruck").hide();
                $("#loading").hide();
            }
        });
    }
}

function GetTag_TruckDetails(tagno)
{
    var TagNo = tagno == "" ? "" : tagno;
    if(TagNo != "")
    {
        $.ajax({
		url: 'http://apps.kpcl.com/KPCTSDS/api/TruckDetails/GetTagTruckDetails/' + TagNo,
            //url: 'http://202.83.27.199/KPCTSDS/api/TruckDetails/GetTagTruckDetails/' + TagNo,
	    //url: 'http://182.72.244.25/KPCTSDS/api/TruckDetails/GetTagTruckDetails/' + TagNo,
            type: 'GET',
            data: '{}',
            dataType: 'json',
            async: false,
            success: function (result) {
                if (result.length > 0) {
                    $("#txttruckno").val(result[0].TruckNo);
                    $("#txtparty").val(result[0].Party);
                    $("#txtloc").val(result[0].Loc);
                    $("#txtactloc").val(result[0].ActualLocation);
                    $("#txtcargo").val(result[0].Cargo);
                    $("#txtqty").val(result[0].Qty);
                    $("#txtstatus").text(result[0].Status);
                    $("#hidNewStatus").val(result[0].NextStatus);
                    $("#hidTruckId").val(result[0].TruckId);
                    $("#hidStatusId").val(result[0].StatusId);
                    $("#hidfrstflag").val(result[0].FirstTransit_Flag);
                    $("#hidprkngflag").val(result[0].DBParking_Flag);
                    $("#hidscndflag").val(result[0].SecondTransit_Flag);
                    $("#hidactlogflag").val(result[0].ActivityLoc_Flag);
                    $("#hidsdsoutflag").val(result[0].SDSOut_Flag);
                    $("#hidkpctoutflag").val(result[0].KPCTOut_Flag);
                    $("#hidfnlflag").val(result[0].FinalTransit_Flag);
                    $("#txtstatus").attr('class', 'text-success');
                    $("#btnSubmit").show();
                    $("#btnClear").show();
                    $("#hidtrkstatus").val(result[0].NextStatus);
                    if(oldvalue == "")
                        oldvalue = result[0].NextStatus;
                    $("#btnSubmit").attr('disabled', false);
                    $("#btnSubmit").attr('class', 'btn btn-custom');
                    $("#btnSubmit").html("<i class='fa fa-check'></i>");
                    if($("#hidStatusId").val() == 5 && $("#hidloctype").val() == 1 && $("#hidNewStatus").val() == "ACTIVITY END")
                        $("#btnSubmit").html("<i class='fa fa-check'></i> Tally Sheet");
                    else if($("#hidStatusId").val() == 5 && $("#hidloctype").val() == 2 && $("#hidNewStatus").val() == "ACTIVITY END")
                        $("#btnSubmit").html("<i class='fa fa-check'></i> Tally Sheet");
                    else if(result[0].NextStatus == "" || $("#hidloctype").val() == "" || $("#hidloctype").val() == "--" || $("#hidStatusId").val() == "")
                        $("#btnSubmit").attr('disabled', true);
                    if($("#hidNewStatus").val() == "ACTIVITY END")
                        $("#btnSubmit").html("<i class='fa fa-check'></i> Tally Sheet");
                    else
                        $("#btnSubmit").html("<i class='fa fa-check'></i> " + result[0].NextStatus);
                    DisableButton(result[0].NextStatus, result[0].LocType, $("#hidloctype").val());
                }
                else {
                    $("#txtstatus").text("No Data Found");
                    $("#txttag").val("");//clearing the Tag details in case of no data found for tag
                    $("#txtstatus").attr('class', 'text-danger');
                }
            },
            error: function () {
                alert('Error occurred while loading Truck details.');
                $("#imgtruck").hide();
                $("#loading").hide();
            }
        });
    }
}



function GetDeviceStatus()
{
    var Adddata = {};
    Adddata.IMEI = $("#hidimei").val();
    Adddata.UUID = $("#hiduuid").val();
    $.ajax({
        type: "POST",
	    url: 'http://apps.kpcl.com/KPCTSDS/api/Account/GetDeviceStatus',
        //url: 'http://202.83.27.199/KPCTSDS/api/Account/GetDeviceStatus',
	    //url: 'http://182.72.244.25/KPCTSDS/api/Account/GetDeviceStatus',
        dataType: "json",
        data: Adddata,
        async: false,
        success: function (result) {
            $("#hidloctype").val(result);
            if(result == '1')
            {
                $("#txtloctype").val("WH");
            }
            else if(result == '2')
            {
                $("#txtloctype").val("YARD");
            }
        },
        error: function () {
            alert("Error occurred while getting device details.");
        }
    });
}

function ShowObjects()
{
    /*if($("#hidStatusId").val() == 5)
    {
        $("#divType").show();
        $("#divLoc").show();
    }*/
}




function scanTruck()
{
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if (!result.cancelled) {
                $("#txttruckno").val(result.text);
                $("#txttag").val("");
                //oldvalue = "";
                GetDeviceStatus();
                //GetTruckDetails(result.text);//Added for fetching truck details on QR-Code Scan
            }
        },
        function (error) {
            alert("Scanning failed: " + error);
        }
    );
   // Reason();
   // GetUserStages($("#hidusrid").val());
   //  $("#loading").hide();
}

function getUserName(userid)
{
	var usrid = userid == "" ? "" : userid;
	$.ajax({
		//url: 'http://localhost:51594/api/Account/GetUserNameById/' + usrid,
		url: 'http://apps.kpcl.com/KPCTSDS/api/Account/GetUserById/'+ usrid,
		 type: 'GET',
            data: '{}',
            dataType: 'json',
            async: false,
            success: function (result) {
                if (result.length > 0) {
						$("#txtBeatOfficer").val(result[0].EmployeeName);
						if($("#txtBeatOfficer").val() == "")
							$("#txtBeatOfficer").val(result[0].LoginId);
					}
                else {
                    $("#txtstatus").text("No Data Found");
                    $("#txtstatus").attr('class', 'text-danger');
                }
            },
            error: function () {
                alert('Error occurred while loading Truck details.');
                $("#imgtruck").hide();
                $("#loading").hide();
            }
        });
    
}

function getLocationDetails(tagno)
{
	$("#loading").show();
	var TagNo = tagno == "" ? "" : tagno;
	$("#txttag").val(TagNo);
	$.ajax({
		//url: 'http://localhost:51594/api/Account/GetUserNameById/' + usrid,
		url: 'http://apps.kpcl.com/SecBeatAPI/api/Account/GetLocationByTagNo/'+ TagNo,
		 type: 'GET',
            data: '{}',
            dataType: 'json',
            async: false,
            success: function (result) {
                if (result.length > 0) {
						$("#txtloc").val(result[0].LocationName);
						$("#hidLocId").val(result[0].LocationId);
					}
                else {
                    //$("#txtstatus").text("No Data Found");
					alert("No Data Found.");
                    $("#txtstatus").attr('class', 'text-danger');
                }
            },
            error: function () {
                alert('Error occurred while loading Truck details.');
                $("#imgtruck").hide();
                $("#loading").hide();
            }
        });
    $("#loading").hide();
}


function scan()
{
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if (!result.cancelled) {
                 $("#txttruckno").val("");
                 $("#txttag").val(result.text);
                 //oldvalue = "";
                 //GetDeviceStatus();
				 getLocationDetails(result.text);
                 //GetTag_TruckDetails(result.text);//Added for fetching truck details on QR-Code Scan
            }
        },
        function (error) {
            alert("Scanning failed: " + error);
        }
    );
   // Reason();
   // GetUserStages($("#hidusrid").val());
   //  $("#loading").hide();
}