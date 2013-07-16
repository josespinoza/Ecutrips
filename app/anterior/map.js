
var map = {
    canvas:null,
    markers:null,
    
    create: function( canvas_id, lat, lng )
    {
        //Generate the map
        var mapOptions = {
            center: new google.maps.LatLng(lat, lng),
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        canvas = new google.maps.Map(document.getElementById(canvas_id), mapOptions);
        markers=[];
    },
    
    newPOI: function( poi, callback )
    {
        var image    ='images/icon_'+poi.category+'.png';
        var myLatLng = new google.maps.LatLng(poi.lat, poi.lng);
        var draggable= ( poi.draggable != null ) ? poi.draggable : true;
        var marker   = new google.maps.Marker({
            position    : myLatLng,
            map         : canvas,
            draggable   : draggable,
            animation   : google.maps.Animation.DROP
            //icon: image
        });
        
        markers.push(marker);
        
        google.maps.event.addListener(marker, 'click', function(event) {
            callback(poi);
        });
    },
    
    updatePOI: function( idx, options )
    {
        if( markers[idx] != null )
        {
            if( options.draggable != null )
                markers[idx].setDraggable( options.draggable );

            if( options.image != null )
                markers[idx].setIcon( options.image );

            if( options.visible != null )
                markers[idx].setVisible( options.visible );
        }
    },

    getPOIPosition: function( idx )
    {
        if( markers[idx] != null )
        {
            return markers[idx].getPosition();            
        }
        return null;
    },


    getCenter: function()
    {
        return canvas.getCenter();
    },

    clearOverlays: function()
    {
        for ( i in markers ) {
            markers[i].setMap(null);
        }
        markers = [];
    }

    
};
