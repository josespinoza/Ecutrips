var app = {
        
    POIS        : null,
    indexPOI    : 0,
    currentPOI  : 0,
    currentTOUR : null,
    currentEvent : null,
    subcategorias: null,
    imagesPOI   : new Array(),
    audioPOI    : '',
    tourPoint   : null,
    eventPoint   : null,
    
    
    // INIT APPLICATION
    /*********************************************************************/
    initialize: function() {        
        //Conect to Parse Server
        Parse.initialize("u4daJ3ZqB1O8T7wnIw0tzN7w4mJ2zVoPLAbplhXg", "unKKVJjm7mSqJow8z9XEIjzgowDuHngSVA2loUmg");

        $( '#createTourPOI').click(app.newPOI       );
        $( '#createTOUR'   ).click(app.newTOUR      );
        $( '#getPOIS'      ).click(app.getNearPOI   );
        $( '#getTOURS'     ).click(app.getNearTOUR  );
        $( '#finishTour'   ).click(app.finishTour   );
        $( '#newTour form' ).submit(app.saveTOUR    );


        $( '#createEventPOI').click(app.newPOI       );
        $( '#createEvent'   ).click(app.newEvent      );
        $( '#getPOIS'       ).click(app.getNearPOI   );
        $( '#getEvents'     ).click(app.getNearEvent  );
        $( '#finishEvent'   ).click(app.finishEvent   );
        $( '#newEvent form' ).submit(app.saveEvent    );


        $( '#createPOI'    ).click(app.newPOI       );
        $( '#POIinfo form' ).submit(app.savePOI     );
        $( '#borrarPOI'    ).click(app.deletePOI    );
        $( '#centerMap'    ).click(app.centerMap    );


        $( '#eventosBtn'   ).click(function(){ app.clearMap(); $('#container').removeClass('showTours  showPois showMapOpt' ).toggleClass('showEvents'); } );
        $( '#toursBtn'     ).click(function(){ app.clearMap(); $('#container').removeClass('showEvents showPois showMapOpt' ).toggleClass('showTours' ); } );
        $( '#poisBtn'      ).click(function(){ app.clearMap(); $('#container').removeClass('showEvents showTours showMapOpt').toggleClass('showPois'  ); } );
        $( '#mapaBtn'      ).click(function(){ app.clearMap(); $('#container').removeClass('showEvents showTours showPois'  ).toggleClass('showMapOpt'); } );


        $('#grabarCategoria').click(function(){ app.grabarCategoria() });
        $('#borrarCategoria').click(function(){ app.borrarCategoria() });
        $('#categoria').on('change', function(){ var cat = parseInt($(this).val()); app.selectCategoria(cat)});

        $( '#filterList nav a').click(function(){
                                        var  actualFilter = $(this).attr('rel');
                                        app.filterPOIS(actualFilter);
                                    });

        $('#lat').bind('change', function(){map.setCenter($('#lat').val(), $('#lng').val());});
        $('#lng').bind('change', function(){map.setCenter($('#lat').val(), $('#lng').val());});

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
        $('#promo_upload').uploadify({
            'swf'      : 'res/uploadify.swf',
            'uploader' : 'promoUpload.php',
            'onUploadSuccess' : function(file, data, response) {
                                    alert('La promocion fue actualizada exitosamente');
                                } 
        });
        app.initMap();
        app.getCategories();
    },
    

    clearMap: function()
    {
        app.currentTOUR = null;
        app.currentEvent = null;
        map.newTour();
    },

    getCategories: function()
    {
        var CAT   = Parse.Object.extend("categoria");
        var query = new Parse.Query(CAT);
        query.find({
            success: function(results)
            {
                app.subcategorias = results;
                app.escribirSubcategorias();
            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    },


    escribirSubcategorias: function()
    {
        var lista = '';
        for( var i in app.subcategorias )
        {
            lista += '<option value="'+app.subcategorias[i].id+'">'+app.subcategorias[i].get('nombre');+'</option>';
        }
        $('#subcategoriaList').html(lista);
    },

    grabarCategoria: function()
    {
        //test object
        var CAT = Parse.Object.extend("categoria");
        var cat = new CAT();
        var ind = parseInt(app.subcategorias[ app.subcategorias.length - 1 ].get('indice'))+1;

        var datos = {
            nombre      : $("#nombreCategoria").val(),
            parent      : parseInt($('#categoriaPadre').val()),
            indice      : ind
        }

        console.log(datos);
        cat.save(datos, { success: app.onSaveCategoria });
        return false;
    },

    borrarCategoria: function()
    {
        var ind     = $('#subcategoriaList').val();
        var CAT     = Parse.Object.extend("categoria");
        var query   = new Parse.Query(CAT);

        app.deletePOIS(null, null, ind);

        query.get( ind, {
          success: function( obj )
                    {
                        obj.destroy({
                            success: function(myObject) { alert('La Subcategoria fue eliminada'); },
                            error: function(myObject, error) {}
                        });
                    },
          error  : function(object, error) { alert('No se pudo obtener la informacion del objeto'); }
        });
        return false;
    },

    onSaveCategoria: function( cat )
    {
        alert('la subcategoria fue grabada '+cat.id);
        $("#nombreCategoria").val('');

        var CATE = Parse.Object.extend("categoria");
        var query = new Parse.Query(CATE);
        query.get(cat.id, {
          success: function(categoria) {
            app.subcategorias.push(categoria);
            app.escribirSubcategorias();
          },
          error: function(object, error) {
            alert('hubo un problema en la conexion con el servidor de la base de datos, por favor recargue la pagina para evitar problemas en el funcionamiento de la pagina');
          }
        });
    },

    selectCategoria: function( parent )
    {
        var opciones = '';
        for( i in app.subcategorias )
        {
            if( app.subcategorias[i].get('parent') == parent )
            {
                opciones += '<option value="'+app.subcategorias[i].get('indice')+'">'+app.subcategorias[i].get('nombre')+'</option>';
                //console.log(app.subcategorias[i].get('parent')+': '+app.subcategorias[i].get('nombre')+': '+app.subcategorias[i].get('indice'));
            }
        }
        $('#subcategoria').html(opciones);

    },


    // MAPS
    /*********************************************************************/
    initMap: function()
    {
        function onSucess( position )
        {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            map.setCenter( lat, lng  );
        }
        
        function onError2( error )
        {
            console.log(error.message);
        }

        var lat = -2.2033013966843797;
        var lng = -79.85762756054686;
        map.create( 'mapCanvas', lat, lng  );

        if (navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition( onSucess, onError2 );
            console.log('pido la geolocalizacion');
        }
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

        var radioanswer = 0;
        if ($('input[name=calificacion]:checked').val() != null) {           
            radioanswer = parseInt($('input[name=calificacion]:checked').val());
        }

        var datos = {
            certificado : $("#certificado").is(':checked'),
            categoria   : parseInt($('#categoria').val()),
            subcategoria: parseInt($('#subcategoria').val()),
            calificacion: radioanswer,
            descripcion : $('#descripcion'   ).val(),
            direccion   : $('#direccion'     ).val(),
            telefonos   : $('#telefonos'     ).val(),
            correos     : $('#mails'         ).val(),
            web         : $('#web'           ).val(),
            nombre      : $('#nombre'        ).val(),
            tour        : app.currentTOUR,
            evento      : app.currentEvent,
            imagenes    : app.imagesPOI,
            audio       : {'name': app.audioPOI, '__type':'File'},
            promociones : $('promociones').val(),
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
            telefonos   : poi.get('telefonos'),
            correos     : poi.get('correos'),
            web         : poi.get('web'),
            tour        : poi.get('tour'),
            localizacion: poi.get('localizacion'),
            indice      : poi.id,
            id          : app.indexPOI
        }


        map.updatePOIData( app.currentPOI, datos );
        $.fancybox.close();


        if(app.currentTOUR != null)
        {
            datos.categoria = 45;
            if( app.tourPoint == null )
            {
                app.tourPoint = datos.localizacion;
            }
        }
        if(app.currentEvent != null)
        {
            datos.categoria = 45;
            if( app.eventPoint == null )
            {
                app.eventPoint = datos.localizacion;
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
        query.equalTo("evento", app.currentEvent);
        query.limit(10);
        query.find({
            success: function(results)
            {
                app.POIS = results;

                for( i in results )
                {
                    var poi = results[i];
                    map.newPOI({
                        lat         : poi.get('localizacion').latitude, 
                        lng         : poi.get('localizacion').longitude, 
                        categoria   : poi.get('categoria'), 
                        nombre      : poi.get('nombre'),  
                        direccion   : poi.get('direccion'),  
                        telefonos   : poi.get('telefonos'),  
                        web         : poi.get('web'),  
                        correos     : poi.get('correos'),  
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

    deletePOIS: function( tour, evento, subcategoria)
    {
        var POI   = Parse.Object.extend("POI");
        var query = new Parse.Query(POI);

        if( tour         != null ) query.equalTo("tour",         tour);
        if( evento       != null ) query.equalTo("evento",       evento);
        if( subcategoria != null ) query.equalTo("subcategoria", subcategoria);

        query.find({
            success: function(results)
            {
                for( i in results )
                {
                    results[i].destroy({
                        success: function(myObject) {},
                        error  : function(myObject, error) {}
                    });
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


    /* TOURS
    /***************************************************************************************************************************************/
    /***************************************************************************************************************************************/

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
                        $('#nearTours nav').append('<div><a rel="'+tour.id+'" href="#" class="show">'+tour.get('nombre')+'</a><a rel="'+tour.id+'" href="#" class="delete">X</a></div>');
                    }
                    $('#nearTours nav a.show'   ).click(app.loadTour  );
                    $('#nearTours nav a.delete' ).click(app.deleteTour);
                },
                error: function(error){
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

        deleteTour: function()
        {
            //test object
            var TOUR = Parse.Object.extend("TOUR");
            var tour = null;
            var query = new Parse.Query(TOUR);

            app.deletePOIS($(this).attr('rel'), null, null);

            query.get( $(this).attr('rel'), {
              success: function( obj )
                        {
                            obj.destroy({
                                success: function(myObject) { alert('el objeto fue eliminado'); app.getNearTOUR(); },
                                error: function(myObject, error) {}
                            });
                        },
              error  : function(object, error) { alert('No se pudo obtener la informacion del objeto'); }
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




    /* EVENTOS
    /***************************************************************************************************************************************/
    /***************************************************************************************************************************************/

        newEvent: function()
        {
            $('#container').removeClass('showEvents');
            $.fancybox.open({
                href : '#newEvent',
                type : 'inline',
                padding : 5
            });
        },

        getNearEvent: function()
        {
            map.clearOverlays();
            app.indexPOI = 0;
            
            $('#nearEvents nav').html('');

            var Event   = Parse.Object.extend("EVENT");
            var query = new Parse.Query(Event);
            var coord = map.getCenter();
            var point = new Parse.GeoPoint({latitude : coord.lat, longitude: coord.lon});

            query.withinKilometers("localizacion", point, 20);
            query.limit(10);
            query.find({
                success: function(results)
                {
                    for( i in results )
                    {
                        var Event = results[i];
                        $('#nearEvents nav').append('<div><a rel="'+Event.id+'" href="#" class="show">'+Event.get('nombre')+'</a><a rel="'+Event.id+'" href="#" class="delete">X</a></div>');
                    }
                    $('#nearEvents nav a.show'   ).click(app.loadEvent  );
                    $('#nearEvents nav a.delete' ).click(app.deleteEvent);
                },
                error: function(error){
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        },

        loadEvent: function()
        {
            var Event = Parse.Object.extend("EVENT");
            var query = new Parse.Query(Event);
            query.get($(this).attr('rel'), {
              success: function(Event) {
                map.newTour();
                app.currentEvent = Event;
                app.getNearPOI();
              },
              error: function(object, error) {
                alert('no se pudo obtener la informacion del Event');
              }
            });
        },

        deleteEvent: function()
        {
            //test object
            var Event = Parse.Object.extend("EVENT");
            var Event = null;
            var query = new Parse.Query(Event);

            app.deletePOIS(null, $(this).attr('rel'), null);

            query.get( $(this).attr('rel'), {
              success: function( obj )
                        {
                            obj.destroy({
                                success: function(myObject) { alert('el objeto fue eliminado'); app.getNearEvent(); },
                                error: function(myObject, error) {}
                            });
                        },
              error  : function(object, error) { alert('No se pudo obtener la informacion del objeto'); }
            });
        },

        saveEvent: function()
        {
            
            //test object
            var Event     = Parse.Object.extend("EVENT");
            app.currentEvent = new Event();
            var datos   = {
                calificacion: parseInt($('#calificacionEvent'  ).val()),
                descripcion : $('#descripcionEvent'   ).val(),
                direccion   : $('#direccionEvent'     ).val(),
                nombre      : $('#nombreEvent'        ).val(),
                telefonos   : $('#telefonosEvent'     ).val(),
                correos     : $('#mailsEvent'         ).val(),
                web         : $('#webEvent'           ).val(),
                promocion   : $('#promocionEvent'     ).val(),
            }

            app.currentEvent.save(datos, {
              success: function(object) {
                $.fancybox.close();
                $('#eventList').addClass('poilist');
                $('#container').removeClass('showPois').toggleClass('showEvents');
              }
            });

            map.clearOverlays();
            app.indexPOI = 0;

            return false;
        },


        finishEvent: function()
        {
            $('#eventList').removeClass('poilist');
            app.currentEvent.save({ localizacion: app.eventPoint });
            app.currentEvent = null;
        },





    /***************************************************************************************************************************************/


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


        app.imagesPOI = POI.imagenes;
        
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
        for ( i in app.POIS )
        {
            var val = ( app.POIS[i].get('categoria') != filter ) ? 'none' : 'block';
            map.updatePOI(i, { display: val } );
        }
        map.redrawLayer(1);
    },

    centerMap: function()
    {
        var lat = $('#latmap').val();
        var lon = $('#lonmap').val();
        map.setCenter(lat, lon);
    }

};