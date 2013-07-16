var app = {
        
    POIS        : null,
    indexPOI    : 0,
    currentPOI  : 0,
    currentTOUR : null,
    imagesPOI   : '',
    audioPOI    : '',
    
    
    // INIT APPLICATION
    /*********************************************************************/
    initialize: function() {        
        //Conect to Parse Server
        Parse.initialize("u4daJ3ZqB1O8T7wnIw0tzN7w4mJ2zVoPLAbplhXg", "unKKVJjm7mSqJow8z9XEIjzgowDuHngSVA2loUmg");

        $( '#createPOI'    ).click(app.newPOI       );
        $( '#createTourPOI').click(app.newPOI       );
        $( '#createTOUR'   ).click(app.newTOUR      );

        $( '#getPOIS'      ).click(app.getNearPOI   );
        $( '#getTOURS'     ).click(app.getNearTOUR  );

        $( '#newPOI  form' ).submit(app.savePOI     );
        $( '#newTour form' ).submit(app.saveTOUR    );

        $( '#finishTour'   ).click(app.finishTour   );


        $( '#toursBtn'     ).click(function(){ $('#container').removeClass('showPois').toggleClass('showTours'); } );
        $( '#poisBtn'      ).click(function(){ $('#container').removeClass('showTours').toggleClass('showPois'); } );

        $( '#filterList nav a').click(function(){
                                        var  actualFilter = $(this).attr('rel');
                                        app.filterPOIS(actualFilter);
                                    });


        $('#image_upload').uploadify({
            'swf'      : 'res/uploadify.swf',
            'uploader' : 'parse_fileUpload.php',
            'onUploadSuccess' : function(file, data, response) {
                                    var img = JSON.parse(data);
                                    alert(data+', '+response);
                                    alert(img+'-'+img.name+'-');
                                    app.imagesPOI += img.name;
                                    alert(app.imagesPOI);
                                } 
        });
        $('#audio_upload').uploadify({
            'swf'      : 'res/uploadify.swf',
            'uploader' : 'parse_fileUpload.php',
            'onUploadSuccess' : function(file, data, response) {
                                    alert('The file ' + file.name + ' was successfully uploaded with a response of ' + response + ':' + data);
                                } 
        });
    },
    

    // MAPS
    /*********************************************************************/
    initMap: function()
    {
        function onSucess( position )
        {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            map.create( 'mapCanvas', lat, lng  );
        }
        
        function onError( error )
        {
            alert(error.message);
        }
        navigator.geolocation.getCurrentPosition( onSucess, onError );
    },
    

    newPOI: function()
    {
        var coord = map.getCenter();
        map.newPOI( {lat:coord.lat(), lng:coord.lng(), category:0, id: app.indexPOI }, app.openForm );
        app.indexPOI++;
    },


    savePOI: function()
    {
        //test object
        var POI     = Parse.Object.extend("POI");
        var poi     = new POI();
        var datos   = {
            certificado : ($('#certificado').val()=='1')? true: false,
            categoria   : parseInt($('#categoria'     ).val()),
            calificacion: parseInt($('#calificacion'  ).val()),
            descripcion : $('#descripcion'   ).val(),
            direccion   : $('#direccion'     ).val(),
            nombre      : $('#nombre'        ).val(),
            tour        : app.currentTOUR,
            imagen1     : {'name': app.imagesPOI, '__type':'File'},
            //promociones : $('categoria').val(),
            localizacion: new Parse.GeoPoint({
                                    latitude : parseFloat($('#lat').val()), 
                                    longitude: parseFloat($('#lng').val())
                                }),
        }

        
        poi.save(datos, {
          success: function(object) {
            map.updatePOI( app.currentPOI, {draggable:false} );
            $.fancybox.close();
          }
        });

        return false;
    },
    
    openForm: function( POI )
    {
        $.fancybox.open({
                    href : '#newPOI',
                    type : 'inline',
                    padding : 5
                });

        var position = map.getPOIPosition( POI.id );

        document.getElementById('lat').value = position.lat();
        document.getElementById('lng').value = position.lng();

        app.currentPOI = POI.id;
    },

    getNearPOI: function()
    {
        map.clearOverlays();
        app.indexPOI = 0;


        var POI   = Parse.Object.extend("POI");
        var query = new Parse.Query(POI);
        var coord = map.getCenter();
        var point = new Parse.GeoPoint({latitude : coord.lat(), longitude: coord.lng()});


        query.withinKilometers("localizacion", point, 10);
        query.limit(10);
        query.find({
            success: function(results)
            {
                POIS = results;

                for( i in results )
                {
                    var poi = results[i];
                    map.newPOI({
                        lat         : poi.get('localizacion').latitude, 
                        lng         : poi.get('localizacion').longitude, 
                        category    : poi.get('categoria'), 
                        nombre      : poi.get('nombre'),  
                        direccion   : poi.get('direccion'),  
                        certificado : poi.get('certificado'),  
                        calificacion: poi.get('calificacion'),  
                        imagenes    : poi.get('imagenes'),  
                        descripcion : poi.get('descripcion'), 
                        id          : app.indexPOI, 
                        draggable   : false 
                    }, app.openPOI );

                    app.indexPOI++;
                }
            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    },




    newTOUR: function()
    {
        $('#container').removeClass('showTours');
        $('#newTour').addClass( 'show' );
    },

    getNearTOUR: function()
    {
        map.clearOverlays();
        app.indexPOI = 0;


        var POI   = Parse.Object.extend("POI");
        var query = new Parse.Query(POI);
        var coord = map.getCenter();
        var point = new Parse.GeoPoint({latitude : coord.lat(), longitude: coord.lng()});


        query.withinKilometers("localizacion", point, 10);
        query.limit(10);
        query.find({
            success: function(results)
            {
                POIS = results;

                for( i in results )
                {
                    var poi = results[i];
                    map.newPOI({
                        lat         : poi.get('localizacion').latitude, 
                        lng         : poi.get('localizacion').longitude, 
                        category    : poi.get('categoria'), 
                        nombre      : poi.get('nombre'),  
                        direccion   : poi.get('direccion'),  
                        certificado : poi.get('certificado'),  
                        calificacion: poi.get('calificacion'),  
                        imagenes    : poi.get('imagenes'),  
                        descripcion : poi.get('descripcion'), 
                        id          : app.indexPOI, 
                        draggable   : false 
                    }, app.openPOI );

                    app.indexPOI++;
                }
            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    },

    saveTOUR: function()
    {
        
        //test object
        var TOUR     = Parse.Object.extend("TOUR");
        app.currentTOUR = new TOUR();
        var datos   = {
            calificacion: parseInt($('#calificacionTour'  ).val()),
            descripcion : $('#descripcionTour'   ).val(),
            direccion   : $('#direccionTour'     ).val(),
            nombre      : $('#nombreTour'        ).val(),
            promocion   : $('#promocionTour'     ).val(),
        }

        app.currentTOUR.save(datos, {
          success: function(object) {
            $.fancybox.close();
            $('#tourList').addClass('poilist');
            $('#container').removeClass('showPois').toggleClass('showTours');
          }
        });

        return false;
    },


    finishTour: function()
    {
        $('#tourList').removeClass('poilist');
        app.currentTOUR = null;
    },



    openPOI: function( POI )
    {
        $('#showPOI').html('<h2>'+POI.nombre+'</h2><p>'+POI.descripcion+'</p>');
        $.fancybox.open({
                    href : '#showPOI',
                    type : 'inline',
                    padding : 5
                });
    },

    filterPOIS: function( filter )
    {
        for( i in POIS )
        {
            var poi = POIS[i];
            if( filter == poi.get('categoria') || filter == 0 )
            {
                console.log(poi.get('nombre'));
                map.updatePOI( i, { visible: true });
            }
            else
            {
                console.log(' borrando '+i+': '+poi.get('nombre'));
                map.updatePOI( i, { visible: false });
            }
        }
    }

};