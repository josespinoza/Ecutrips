
var map = {
    canvas          : null,
    markers         : null,
    fromGeographic  : new OpenLayers.Projection("EPSG:4326"), 
    toMercator      : new OpenLayers.Projection("EPSG:900913"),
    linePoints      : new Array(),
    lineLayer       : null,
    categorias      : [ 'Artesan&iacute;as',
                        'Bancos',
                        'Bares',
                        'Boutiques',
                        'Cafeter&iacute;as',
                        'Centros Comerciales',
                        'Cines',
                        'Circos',
                        'Conciertos',
                        'Discotecas',
                        'Estadios',
                        'Gasolineras',
                        'Hospitales/Centros de Salud',
                        'Hoteles',
                        'Iglesias',
                        'Librerias',
                        'Museos',
                        'Parques',
                        'Puntos Tur&iacute;sticos',
                        'Restaurantes',
                        'Spas',
                        'Teatros',
                        'Tiendas',
                        'Zool&oacute;gicos'],
    
    create: function( canvas_id, lat, lng )
    {
        this.canvas     = new OpenLayers.Map(canvas_id);
        this.markers    = new Array();
        this.lineLayer  = new OpenLayers.Layer.Vector("Line Layer"); 
        window.Layers   = new Array();
        var layerOSM    = new OpenLayers.Layer.OSM();
        var lonLat      = new OpenLayers.LonLat(lng, lat).transform( this.fromGeographic, this.toMercator);

        this.canvas.addLayer (layerOSM);
        this.canvas.setCenter(lonLat, 14);
        this.canvas.addControl(new OpenLayers.Control.LayerSwitcher());


        this.lineLayer  = new OpenLayers.Layer.Vector("Line Layer");
        this.canvas.addLayer(this.lineLayer);                    
        this.canvas.addControl(new OpenLayers.Control.DrawFeature(this.lineLayer, OpenLayers.Handler.Path));
    },

    getLayer: function( idx )
    {
        //If the layer exist return the layer object
        if(window.Layers[idx] != null)
        {
            var clickFeature = new OpenLayers.Control.SelectFeature(window.Layers[idx]);
            this.canvas.addControl(clickFeature);
            clickFeature.activate();
            return window.Layers[idx];
        }

        //If layer doesn't exist, we create it 
        window.Layers[idx] = new OpenLayers.Layer.Vector( this.categorias[idx] );
        this.canvas.addLayer(window.Layers[idx]);

        //if the layer is 0(for new POIS), then we add drag'n drop feature
        if( idx == 0 )
        {
            var dragFeature = new OpenLayers.Control.DragFeature(window.Layers[idx]);
            this.canvas.addControls([dragFeature]);
            dragFeature.activate();
        }

        /***************** CLICK *****************/
        var clickFeature = new OpenLayers.Control.SelectFeature(window.Layers[idx]);
        this.canvas.addControl(clickFeature);
        clickFeature.activate();


        window.Layers[idx].events.register('featureselected', window.Layers[idx], 
        function(evt,k)
        {
            if( evt.feature.poi.categoria == 0 )
            {
                var coords = evt.feature.geometry.getBounds().getCenterLonLat();
                coords.transform( map.toMercator, map.fromGeographic );
                evt.feature.poi.lat = coords.lat;
                evt.feature.poi.lng = coords.lon;   
            }
            evt.feature.callback(evt.feature.poi);
        });

        //return the layer object
        return window.Layers[idx];
    },
    
    newPOI: function( poi, callback )
    {
        var point  = new OpenLayers.Geometry.Point(poi.lng, poi.lat).transform( this.fromGeographic, this.toMercator);
        var marker = new OpenLayers.Feature.Vector(point);
        var imagen = ( poi.certificado ) ? "img/certificados/" : "img/normales/";
        var size   = ( poi.certificado ) ? 50 : 30;
        imagen += "marker"+poi.categoria+".png";

        marker.id ="POI"+this.markers.length;
        marker.style ={
            externalGraphic: imagen,
            graphicOpacity: 1.0,
            graphicWith: size,
            graphicHeight: size,
            graphicYOffset: -(size/2)
        };
        marker.callback = callback;
        marker.poi = poi;

        var currentLayer = this.getLayer( poi.categoria );
        currentLayer.addFeatures(marker);
        this.markers.push(marker);

        if( poi.tour != null )
        {
            this.linePoints.push(point);
            this.drawLine(this.linePoints);
        }
    },
    
    updatePOI: function( idx, options )
    {
        this.markers.poi = options;
    },

    getPOIPosition: function( idx )
    {
        if( this.markers[idx] != null )
        {
            return { lat: this.markers[idx].poi.lat, lng: this.markers[idx].poi.lng };
        }
        return null;
    },


    getCenter: function()
    {
        return this.canvas.getCenter().transform( this.toMercator, this.fromGeographic );
    },

    clearOverlays: function()
    {
        for ( i in window.Layers )
        {
            window.Layers[i].destroyFeatures();
        }
        this.markers = new Array();
    },


    drawLine: function( points )
    {
        this.lineLayer.destroyFeatures();
        var line = new OpenLayers.Geometry.LineString(points);

        var style = { 
          strokeColor: '#0000ff', 
          strokeOpacity: 0.5,
          strokeWidth: 5
        };

        var lineFeature = new OpenLayers.Feature.Vector(line, null, style);
        this.lineLayer.addFeatures([lineFeature]);
    },

    switchNewPOI: function( mostrar )
    {
        for ( i in window.Layers )
        {
            window.Layers[i].display(!mostrar);

            var clickFeature = new OpenLayers.Control.SelectFeature(window.Layers[i]);
            map.canvas.addControl(clickFeature);
            clickFeature.activate();

            var panFeature = new OpenLayers.Control.DragPan(window.Layers[i]);
            map.canvas.addControl(panFeature);
            panFeature.activate();
        }

        if( window.Layers[0] != null )
        {
            window.Layers[0].display(mostrar);
            window.Layers[0].destroyFeatures();
        }
    },

    newTour: function()
    {
        this.linePoints = new Array();
        this.lineLayer.destroyFeatures();
    }


    
};
