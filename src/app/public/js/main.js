var app = {
        
    POIS        : null,
    indexPOI    : 0,
    currentPOI  : 0,
    currentTOUR : null,
    imagesPOI   : new Array(),
    audioPOI    : '',
    tourPoint   : null,
    
    
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
        $( '#finishTour'   ).click(app.finishTour   );
        $( '#POIinfo form' ).submit(app.savePOI     );
        $( '#newTour form' ).submit(app.saveTOUR    );
        $( '#borrarPOI'    ).click(app.deletePOI);


        $( '#toursBtn'     ).click(function(){ app.currentTOUR = null; map.newTour(); $('#container').removeClass('showPois').toggleClass('showTours'); } );
        $( '#poisBtn'      ).click(function(){ app.currentTOUR = null; map.newTour(); $('#container').removeClass('showTours').toggleClass('showPois'); } );

        $( '#filterList nav a').click(function(){
                                        var  actualFilter = $(this).attr('rel');
                                        app.filterPOIS(actualFilter);
                                    });


        $('#image_upload').uploadify({
            'swf'      : 'res/uploadify.swf',
            'uploader' : 'parse_imageUpload.php',
            'onUploadSuccess' : function(file, data, response) {
                                    var img = JSON.parse(data);
                                    app.imagesPOI.push(img.url);
                                } 
        });
        $('#audio_upload').uploadify({
            'swf'      : 'res/uploadify.swf',
            'uploader' : 'parse_audioUpload.php',
            'onUploadSuccess' : function(file, data, response) {
                                    var audio = JSON.parse(data);
                                    app.audioPOI = audio.name;
                                } 
        });
        app.initMap();
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
            var lat = -2.2033013966843797;
            var lng = -79.85762756054686;
            map.create( 'mapCanvas', lat, lng  );
        }
        navigator.geolocation.getCurrentPosition( onSucess, onError );
    },
    

    newPOI: function()
    {
        map.switchNewPOI(true);

        var coord = map.getCenter();
        var line  = ( app.currentTOUR == null ) ? false : true;

        map.newPOI( {lat:coord.lat, lng:coord.lon, categoria:0, line: line, id: app.indexPOI }, app.openForm );
        app.indexPOI++;

    },


    savePOI: function()
    {
        //test object
        var POI = Parse.Object.extend("POI");
        var poi = null;

        

        var datos = {
            certificado : ($('#certificado').val()=='1')? true: false,
            categoria   : parseInt($('#categoria'     ).val()),
            calificacion: parseInt($('#calificacion'  ).val()),
            descripcion : $('#descripcion'   ).val(),
            direccion   : $('#direccion'     ).val(),
            telefonos   : $('#telefonos'     ).val(),
            correos     : $('#mails'         ).val(),
            web         : $('#web'           ).val(),
            nombre      : $('#nombre'        ).val(),
            tour        : app.currentTOUR,
            imagenes    : app.imagesPOI,
            audio       : {'name': app.audioPOI, '__type':'File'},
            //promociones : $('categoria').val(),
            localizacion: new Parse.GeoPoint({
                                    latitude : parseFloat($('#lat').val()), 
                                    longitude: parseFloat($('#lng').val())
                                }),
        }


        //Grabo un nuevo POI
        if( $('#indice').val() == '0' )
        {
            poi = new POI();
            poi.save(datos, { success: app.onSavePOI });
        }
        //Edito el POI existente
        else
        {
            var query = new Parse.Query(POI);
            query.get( $('#indice').val(), {
              success: function( poi ) { poi.save(datos, { success: app.onSavePOI }); },
              error  : function(object, error) { alert('No se pudo obtener la informacion del objeto'); }
            });
        }

        return false;
    },

    onSavePOI: function( poi )
    {
        app.imagesPOI = new Array();
        app.audioPOI = '';

        var datos = {
            lat         : poi.get('localizacion').latitude, 
            lng         : poi.get('localizacion').longitude, 
            categoria   : poi.get('categoria'), 
            nombre      : poi.get('nombre'),  
            direccion   : poi.get('direccion'),  
            certificado : poi.get('certificado'),  
            calificacion: poi.get('calificacion'),  
            imagenes    : poi.get('imagenes'),  
            descripcion : poi.get('descripcion'),
            tour        : poi.get('tour'),
            indice      : poi.id,
            id          : app.indexPOI
        }


        map.updatePOI( app.currentPOI, datos );
        $.fancybox.close();


        if(app.currentTOUR != null)
        {
            datos.categoria = 45;
            if( app.tourPoint == null )
            {
                app.tourPoint = datos.localizacion;
            }
        }


        if( $('#indice').val() == '0' )
        {
            app.indexPOI++;
            datos.id = app.indexPOI;
            datos.lat = parseFloat($('#lat').val());
            datos.lng = parseFloat($('#lng').val());
            map.newPOI(datos, app.openPOI );
        }
    },
    
    openForm: function( POI )
    {
        $('#certificado'   ).val('0');
        $('#categoria'     ).val('');
        $('#calificacion'  ).val('');
        $('#descripcion'   ).val('');
        $('#direccion'     ).val('');
        $('#telefonos'     ).val('');
        $('#mails'         ).val('');
        $('#web'           ).val('');
        $('#nombre'        ).val('');
        $('#indice'        ).val('0');

        var position = map.getPOIPosition( POI.id );

        document.getElementById('lat').value = position.lat;
        document.getElementById('lng').value = position.lng;

        $.fancybox.open({
            href        : '#POIinfo',
            type        : 'inline',
            padding     : 5,
            afterClose  : function(){ map.switchNewPOI(false); }
        });

        app.currentPOI = POI.id;
    },

    getNearPOI: function()
    {
        map.switchNewPOI(false);
        map.clearOverlays();
        app.indexPOI = 0;


        var POI   = Parse.Object.extend("POI");
        var query = new Parse.Query(POI);
        var coord = map.getCenter();
        var point = new Parse.GeoPoint({latitude : coord.lat, longitude: coord.lon});


        query.withinKilometers("localizacion", point, 10);
        query.equalTo("tour", app.currentTOUR);
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
                        categoria   : poi.get('categoria'), 
                        nombre      : poi.get('nombre'),  
                        direccion   : poi.get('direccion'),  
                        certificado : poi.get('certificado'),  
                        calificacion: poi.get('calificacion'),  
                        imagenes    : poi.get('imagenes'),  
                        descripcion : poi.get('descripcion'),
                        tour        : poi.get('tour'),
                        indice      : poi.id,
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


    deletePOI: function()
    {
        //test object
        var POI = Parse.Object.extend("POI");
        var poi = null;
        var query = new Parse.Query(POI);
        query.get( $('#indice').val(), {
          success: function( obj )
                    {
                        obj.destroy({
                            success: function(myObject) { alert('el objeto fue eliminado'); $.fancybox.close(); app.getNearPOI(); },
                            error: function(myObject, error) {}
                        });
                    },
          error  : function(object, error) { alert('No se pudo obtener la informacion del objeto'); }
        });
    },

    newTOUR: function()
    {
        $('#container').removeClass('showTours');
        $.fancybox.open({
            href : '#newTour',
            type : 'inline',
            padding : 5
        });
    },

    getNearTOUR: function()
    {
        map.clearOverlays();
        app.indexPOI = 0;
        
        $('#nearTours nav').html('');

        var TOUR   = Parse.Object.extend("TOUR");
        var query = new Parse.Query(TOUR);
        var coord = map.getCenter();
        var point = new Parse.GeoPoint({latitude : coord.lat, longitude: coord.lon});

        query.withinKilometers("localizacion", point, 10);
        query.limit(10);
        query.find({
            success: function(results)
            {
                for( i in results )
                {
                    var tour = results[i];
                    $('#nearTours nav').append('<a rel="'+tour.id+'" href="#">'+tour.get('nombre')+'</a>');
                }
                $('#nearTours nav a').click(app.loadTour);
            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    },

    loadTour: function()
    {
        var TOUR = Parse.Object.extend("TOUR");
        var query = new Parse.Query(TOUR);
        query.get($(this).attr('rel'), {
          success: function(tour) {
            map.newTour();
            app.currentTOUR = tour;
            app.getNearPOI();
          },
          error: function(object, error) {
            alert('no se pudo obtener la informacion del tour');
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
            telefonos   : $('#telefonosTour'     ).val(),
            correos     : $('#mailsTour'         ).val(),
            web         : $('#webTour'           ).val(),
            promocion   : $('#promocionTour'     ).val(),
        }

        app.currentTOUR.save(datos, {
          success: function(object) {
            $.fancybox.close();
            $('#tourList').addClass('poilist');
            $('#container').removeClass('showPois').toggleClass('showTours');
          }
        });

        map.clearOverlays();
        app.indexPOI = 0;

        return false;
    },


    finishTour: function()
    {
        $('#tourList').removeClass('poilist');
        app.currentTOUR.save({ localizacion: app.tourPoint });
        app.currentTOUR = null;
    },



    openPOI: function( POI )
    {
        var certificado = ( POI.certificado )? '1' : '0';
        $('#certificado'   ).val(certificado);
        $('#categoria'     ).val(POI.categoria);
        $('#calificacion'  ).val(POI.calificacion);
        $('#descripcion'   ).val(POI.descripcion);
        $('#direccion'     ).val(POI.direccion);
        $('#telefonos'     ).val(POI.telefonos);
        $('#mails'         ).val(POI.correos);
        $('#web'           ).val(POI.web);
        $('#nombre'        ).val(POI.nombre);
        $('#indice'        ).val(POI.indice);
        $('#lat'           ).val(POI.lat );
        $('#lng'           ).val(POI.lng );

        $.fancybox.open({
            href : '#POIinfo',
            type : 'inline',
            padding : 5
        });

        app.currentPOI = POI.id;
    },

    filterPOIS: function( filter )
    {
        var mostrar = ( filter == 0 )? false : true;
        for ( i in window.Layers )
        {
           window.Layers[i].display(!mostrar);
        }
        if( window.Layers[filter] != null )
            window.Layers[filter].display(mostrar);
    }

};