<?php
	session_start();
	if( !isset($_SESSION['usuario']) )
	{
		if( isset($_POST['usuario']) )
		{
			$_SESSION['usuario'] = $_POST['usuario'];
		}
		else
		{
			?>
			<html>
			<head>
				<title></title>
			</head>
			<body>
				<form action="" method="POST">
					<label>Usuario:</label>
					<input type="text" name="usuario" />
					<label>Clave:</label>
					<input type="password" name="clave" />
					<input type="submit" value="ingresar" />
				</form>
			</body>
			</html>
			<?php
			die();
		}
	}

?>

<!DOCTYPE html>
<html>
<head>
	<title>ECUTRIP</title>

	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />

	<script src="http://openlayers.org/api/OpenLayers.js"></script>
	<script src="js/parse.js">					</script>
	<script src="js/map.js">					</script>
	<script src="js/jquery.js">					</script>
	<script src="js/jquery.uploadify.js">		</script>
	<script src="js/jquery.fancybox.js?v=2.1.3"></script>
	<script src="js/main.js" >					</script>

	<script>$(document).ready(function(){ app.initialize(); });</script>

	<link rel="stylesheet" type="text/css" href="css/estilo.css">
	<link rel="stylesheet" type="text/css" href="css/uploadify.css">
	<link rel="stylesheet" type="text/css" href="css/fancybox.css?v=2.1.2"/>
</head>
<body>
	<header>
		<h1>Ecutrips</h1>
		<nav>
			<a href="#" id="toursBtn" class="button">TOURS</a>
			<a href="#" id="poisBtn"  class="button">POIS</a>
		</nav>
	</header>

	<section id="container">
		<div id="mapCanvas">&nbsp;</div>



		<!--********************* S I D E B A R S ***************************-->
		<div id="filterList" class="sidebar">
			<div class="acciones">
				<a href="#" id="getPOIS"   class="button dark">Actualizar POIS </a>
				<a href="#" id="createPOI" class="button dark">Nuevo POI 	   </a>
			</div>
			<hr/>
			<nav>
				<a href="#" rel="1" >Artesan&iacute;as 						</a>
				<a href="#" rel="2" >Bancos 								</a>
				<a href="#" rel="3" >Bares 									</a>
				<a href="#" rel="4" >Boutiques 								</a>
				<a href="#" rel="5" >Cafeter&iacute;as 						</a>
				<a href="#" rel="6" >Centros Comerciales 					</a>
				<a href="#" rel="7" >Cines  								</a>
				<a href="#" rel="8" >Circos 								</a>
				<a href="#" rel="9" >Conciertos 							</a>
				<a href="#" rel="10">Discotecas 							</a>
				<a href="#" rel="11">Estadios 								</a>
				<a href="#" rel="12">Estaciones de Servicio (gasolineras)	</a>
				<a href="#" rel="13" >Hospitales/Centros de Salud			</a>
				<a href="#" rel="14">Hoteles 								</a>
				<a href="#" rel="15">Iglesias 								</a>
				<a href="#" rel="16">Librerias 								</a>
				<a href="#" rel="17">Museos									</a>
				<a href="#" rel="18">Parques 								</a>
				<a href="#" rel="19">Puntos Tur&iacute;sticos 				</a>
				<a href="#" rel="20">Restaurantes 							</a>
				<a href="#" rel="21">Spas 									</a>
				<a href="#" rel="22">Teatros 								</a>
				<a href="#" rel="23">Tiendas	 							</a>
				<a href="#" rel="24">Zool&oacute;gicos 						</a>
			</nav>
		</div>


		<div id="tourList" class="sidebar">
			<div id="nearTours">
				<div class="acciones">
					<a href="#" id="getTOURS"   class="button dark">Actualizar TOURS</a>
					<a href="#" id="createTOUR" class="button dark">Nuevo TOUR  	</a>
				</div>
				<hr/>
				<nav>
				</nav>
			</div>
			<div id="tourPoiList">
				<div class="acciones">
					<a href="#" id="finishTour"   class="button dark">Terminar Tour</a>
					<a href="#" id="createTourPOI" class="button dark">Nuevo POI 	   </a>
				</div>
				<hr/>
				<ul>
				</ul>
			</div>
		</div>




		<!--************************* M O D A L S ******************************-->
		<div id="POIinfo">
			<form>
				<fieldset>
					<legend>Nuevo POI</legend>
					<label>Nombre</label>
					<input type="text" name="nombre" id="nombre" />
					<br/>
					<label>Categoria:</label>
					<select name="categoria" id="categoria">
						<option value="1" >Artesan&iacute;as 					</option>
						<option value="2" >Bancos 								</option>
						<option value="3" >Bares 								</option>
						<option value="4" >Boutiques 								</option>
						<option value="5" >Cafeter&iacute;as 					</option>
						<option value="6" >Centros Comerciales 					</option>
						<option value="7" >Cines  								</option>
						<option value="8" >Circos 								</option>
						<option value="9" >Conciertos 							</option>
						<option value="10">Discotecas 							</option>
						<option value="11">Estadios 							</option>
						<option value="12">Estaciones de Servicio (gasolineras)	</option>
						<option value="13" >Hospitales/Centros de Salud			</option>
						<option value="14">Hoteles 								</option>
						<option value="15">Iglesias 							</option>
						<option value="16">Librerias 							</option>
						<option value="17">Museos								</option>
						<option value="18">Parques 								</option>
						<option value="19">Puntos Tur&iacute;sticos 			</option>
						<option value="20">Restaurantes 						</option>
						<option value="21">Spas 								</option>
						<option value="22">Teatros 								</option>
						<option value="23">Tiendas	 							</option>
						<option value="24">Zool&oacute;gicos 					</option>
					</select>
					<br/>
					<label>Calificacion:</label>
					<input type="radio" name="calificacion" id="calificacion" value="1" class="pequeno" />
					<input type="radio" name="calificacion" id="calificacion" value="2" class="pequeno" />
					<input type="radio" name="calificacion" id="calificacion" value="3" class="pequeno" />
					<input type="radio" name="calificacion" id="calificacion" value="4" class="pequeno" />
					<input type="radio" name="calificacion" id="calificacion" value="5" class="pequeno" />
					</select>
					<br/>
					<label>Descripcion</label>
					<input type="text" name="descripcion" id="descripcion" />
					<br/>
					<label>Direccion</label>
					<input type="text" name="direccion" id="direccion" />
					<br/>
					<label>Telefonos</label>
					<input type="text" name="telefonos" id="telefonos" />
					<br/>
					<label>Mails</label>
					<input type="text" name="mails" id="mails" />
					<br/>
					<label>Web</label>
					<input type="text" name="web" id="web" />
					<br/>
					<label>Imagenes</label>
					<div id="queue_image"></div>
					<input id="image_upload" name="image_upload" type="file" multiple="true"/>
					<br/>
					<label>Audio</label>
					<div id="queue_audio"></div>
					<input id="audio_upload" name="audio_upload" type="file" multiple="false" />
					<br/>
					<label>Localizacion</label>
					<input type="text" name="lat" id="lat" class="mediano" />
					<input type="text" name="lng" id="lng" class="mediano" />
					<br/>
					<label>Promociones</label>
					<input type="text" name="promociones" id="promociones" />
					<br/>
					<label>Certificado:</label>
					<input type="checkbox" name="certificado" id="certificado" value="1" class="pequeno" />
					<input type="hidden" name="indice" id="indice" value="0" />
				</fieldset>

					<input type="button" value="Borrar" id="borrarPOI" class="button">

					<input type="submit" value="grabar" class="button">
			</form>
		</div>

		<div id="newTour">
			<form>
				<fieldset>
					<legend>Nuevo TOUR</legend>
					<label>Nombre</label>
					<input type="text" name="nombreTour" id="nombreTour">
					<br/>
					<label>Calificacion:</label>
					<input type="radio" name="calificacionTour" id="calificacionTour" value="1" class="pequeno">
					<input type="radio" name="calificacionTour" id="calificacionTour" value="2" class="pequeno">
					<input type="radio" name="calificacionTour" id="calificacionTour" value="3" class="pequeno">
					<input type="radio" name="calificacionTour" id="calificacionTour" value="4" class="pequeno">
					<input type="radio" name="calificacionTour" id="calificacionTour" value="5" class="pequeno">
					</select>
					<br/>
					<label>Descripcion</label>
					<input type="text" name="descripcionTour" id="descripcionTour">
					<br/>
					<label>Direccion</label>
					<input type="text" name="direccionTour" id="direccionTour">
					<br/>
					<label>Telefonos</label>
					<input type="text" name="telefonosTour" id="telefonosTour">
					<br/>
					<label>Mails</label>
					<input type="text" name="mailsTour" id="mailsTour">
					<br/>
					<label>Web</label>
					<input type="text" name="webTour" id="webTour">
					<br/>
					<label>Promociones</label>
					<input type="text" name="promocionTour" id="promocionTour">
					<br/>
				</fieldset>

					<input type="submit" value="grabar" class="button">
			</form>
		</div>

	</section>

	<!--<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAkQn7xaNDvejYT7o3c1qJHHYuyUoar1eU&sensor=true&callback=app.initMap"></script>-->
</body>
</html>
