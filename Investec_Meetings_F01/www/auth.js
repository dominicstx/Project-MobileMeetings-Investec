// Creating the application namespace
var app = {
    appTitle: 'IAM Meetings',
    backgroundedOnline: false,
    models: {},
    views: {},
    utils: {}
    //weird but...
    ,cache: {}
    ,cacheForOriginals: {}
    ,cacheMeetings: {}
    ,cacheForOriginalMeetings: {}
    
};

jQuery(document).ready(function() {
    //Add event listeners and so forth here
    console.log("onLoad: jquery ready");
    new FastClick(document.body);
	document.addEventListener("deviceready", onDeviceReady,false);
	document.addEventListener("resume", onResume,false);
	document.addEventListener("pause", onPause,false);
    
    //set an ajax timeout
    //prevents the eternal spinner on a terrible network
    //ideal would be a hook to abort all requests (call on resume)
    //and monitoring how many requests timeout and then
    $.ajaxSetup({
        timeout: 120000 //2 minutes, long enough.... why is it not timing out?
    });
    
     //set up overlay spinner. jQuery mobile inbuilt loading spinner isnt modal
    app.spinner = new Spinner();
    jQuery('<div id="overlay"><div id="overinner" ></div><div id="alpha_message"></div></div>').appendTo(document.body);

    
    //overlay spinner start
    jQuery( document ).ajaxStart(function() {
        console.log( "Triggered ajaxStart handler." );
        
        app.spinner.spin();
        try {
            jQuery("#alpha_message").html('');
            
        } catch (e) {}
        jQuery("#overlay").show();
        
        document.getElementById('overinner').appendChild(app.spinner.el);
    });
    
    //overlay spinner stop
    jQuery( document ).ajaxStop(function() {
        console.log( "Triggered ajaxStop handler." );
        jQuery("#overlay").hide();
        app.spinner.stop();
    });
    
    
});

// When this function is called, cordova has been initialized and is ready to roll 
function onDeviceReady() {
    console.log("onDeviceReady: cordova ready in auth.js");
	//Call getAuthCredentials to get the initial session credentials
    cordova.require("salesforce/plugin/oauth").getAuthCredentials(
        function(creds) {
            appStart( _.extend(creds, {userAgent: navigator.userAgent}) );
        }, 
        function(error) { 
            console.log("Auth failed: " + error); 
        });

}



// called when the app is backgrounded
function onPause() {
    //console.log("onPause: cordova ready in auth.js");
//console.log("0 app.backgroundedOnline , navigator.onLine: " = app.backgroundedOnline = "," + navigator.onLine);
// can'r do anything interactive after pause event, eg console.log
    try {
//console.log("1 app.backgroundedOnline , navigator.onLine: " = app.backgroundedOnline = "," + navigator.onLine);
        //if we were offline when backgrounded need to check sync on load
        app.backgroundedOnline = navigator.onLine;
//console.log("2 app.backgroundedOnline , navigator.onLine: " = app.backgroundedOnline = "," + navigator.onLine);
        
    } catch(e) {
    console.log(e);
    }
}

// called when the app is foregrounded after backgrounding
function onResume() {
    console.log("onResume: cordova ready in auth.js");
    // check if we have any old unsynced records to sync?
    // I would LOVE LOVE to make syncpage count records correctly
    // can we try/catch the app?
    try {
        //if we were offline when backgrounded need to check sync on load
        //cant seem to save state on pause so always do it if coming back online
        
        //so this counts locally-modified records if we're online
        //and pushes to the sync page if there are any
        app.router.checkForSync();


    } catch(e) {} //no issue. much can fail. what about timing for back online?

}


/******
function meetingDescribe(describeResult)
{
//console.log('meetingDescribe - ' + describeResult.fields);
    try
    {
        //get the picklist values...
        //var f;
        for (var i = 0; i < describeResult.fields.length; i++)
        {
        
    
            if (describeResult.fields[i].name == 'Meeting_Type__c')
            {
                for (var j = 0; j < describeResult.fields[i].picklistValues.length; j++)
                {
                    console.log('ONE TYPE --> ' + describeResult.fields[i].picklistValues[j].value);
                }
            }

        }
        
    }
    catch (e) {}

}
*****/


function appStart(creds)
{

console.log(JSON.stringify(creds));

    // Force init
    Force.init(creds, null, null, cordova.require("salesforce/plugin/oauth").forcetkRefresh);

    //somethign should do this, but I can't find anything doing it:
    //so im going to do it
    Force.creds = creds;

    
    //console.log(Force.forcetkClient.describe("Meeting__c", meetingDescribe, meetingDescribe));

console.log('appstart... 8');
    
    // router
    app.router = new app.Router();

console.log('appstarted... 8');
    // Go!
    Backbone.history.start();
console.log('backboned... 8');

    

}


