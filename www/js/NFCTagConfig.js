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
  nfc.addTagDiscoveredListener(nfcTagDetected); // add NFC listener

}
function nfcTagDetected(reading){ 
  
  alert(reading.tag.id); // alert the id of the NFC reading
  //getLocationDetails(reading.tag.id);
  //txtBeatOfficer.val($("#hidusrid").val());
 var TagId=reading.tag.id; 
 $("#txttag").val(TagId);
} 


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
    $("#selLocation").prop('disabled', true);
    qs();
    
	getUserName($("#hidusrid").val());
	
    $("#home").click(function () {
        $("#loading").show();
        $.ajax({
            type: "GET",
            url: "http://apps.kpcl.com/KPCTSDS/api/Account/GetUserScreens/" + $("#hidusrid").val(),
            data: '{}',
            contentType: "application/json",
            success: function(result) {
                window.location.href = result + '?user=' + btoa($("#hidusrid").val());
            }
        });
    });

    $("#imgSearch").click(function () {
        $("#loading").show();
        $("#txttag").val("");
       
        $("#loading").hide();
    });

    
    
    $("#imgScan").click(function () {
        $("#loading").show();
        $("#imgtruck").hide();
        $("#txtparty").val("");
        $("#txtloc").val("");
      
        oldvalue = "";
 
        scan();
        //GetUserStages($("#hidusrid").val());
        $("#loading").hide();
    });



    $("#btnClear").click(function (){
        $("#loading").show();
        window.location.href = 'SecBeat.html?user=' + btoa($("#hidusrid").val());
    });


});




function getUserName(userid)
{
	var usrid = userid == "" ? "" : userid;
	$.ajax({
		
		url: 'http://apps.kpcl.com/KPCTSDS/api/Account/GetUserById/'+ usrid,
		 type: 'GET',
            data: '{}',
            dataType: 'json',
            async: false,
            success: function (result) {
                if (result.length > 0) {
						$("#txtBeatOfficer").val(result[0].EmployeeName);
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



function scan()
{
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if (!result.cancelled) {
                 $("#txttruckno").val("");
                 $("#txttag").val(result.text);

				 //getLocationDetails(result.text);
                 //GetTag_TruckDetails(result.text);//Added for fetching truck details on QR-Code Scan
            }
        },
        function (error) {
            alert("Scanning failed: " + error);
        }
    );

}