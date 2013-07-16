<?php

// ASOCIO LA IMAGEN A UN ELEMENTO
/************************************************************************/

//configuro la conexion al api y los valores del objeto que voy a crear
$headers = array(
   'X-Parse-Application-Id: u4daJ3ZqB1O8T7wnIw0tzN7w4mJ2zVoPLAbplhXg',
   'X-Parse-REST-API-Key: CMy1qZrlQOr12O4NaUJkzYVsl9tWGaUTN6wGoYf1',
   'Content-type: image/jpeg'
);

$data = array(
    'direccion' => "cooldude6",
    'descripcion' => "222222",
    'imagen1' => array('name' => $_GET['name'],'__type'=> 'File')
);


//configuro la peticion CURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_URL, 'https://api.parse.com/1/classes/POI');


//ejecuto la llamada al api
$result=curl_exec ($ch);
curl_close ($ch);

?>