
var app = {
		
	POIs: null,
		
		
	// DEVICE READY EVENT
    /*********************************************************************/
	// Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },
    /*********************************************************************/
    
    
    // INIT APPLICATION
    /*********************************************************************/
    receivedEvent: function(id) {
        /*var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');*/
        
        //Conect to Parse Server
        Parse.initialize("u4daJ3ZqB1O8T7wnIw0tzN7w4mJ2zVoPLAbplhXg", "unKKVJjm7mSqJow8z9XEIjzgowDuHngSVA2loUmg");
        
        //test object
        /*var TestObject = Parse.Object.extend("TestObject");
        var testObject = new TestObject();
        testObject.save({foo: "bar"}, {
          success: function(object) {
        	
        	  
            alert("yay! it worked");
          }
        });*/
    },
    

    // MAPS
    /*********************************************************************/
    initMap: function()
    {
    	function onSucess( position )
    	{
        	var lat = position.coords.latitude;
        	var lng = position.coords.longitude;
        	map.create( lat, lng );
    	}
    	
    	function onError( error )
    	{
    		alert(error.message);
    		map.create( 'mapCanvas', -34.397, 150.644  );
    		
    		map.newPOI( {lat:-34.397, lng:150.644, category:2, id:1 }, app.showPOI );
    		map.newPOI( {lat:-34.317, lng:150.674, category:2, id:3 }, app.showPOI );
    		map.newPOI( {lat:-34.297, lng:150.694, category:2, id:15}, app.showPOI );
    	}
        navigator.geolocation.getCurrentPosition( onSucess, onError );
    },
    
    
    showPOI: function( POI )
    {
    	alert('this is the POI number: '+POI.id);
    	map.clearOverlays();
    },
    
    
    filterLayer: function( filter )
    {
    	
    }
    
    
    
    //Windows navigation
    /*********************************************************************/
    slideWindow: function()
    {
    	
    }
    
    
};
