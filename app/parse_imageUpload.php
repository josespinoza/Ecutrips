<?php

// ELEVO LA IMAGEN
/************************************************************************/

//obtengo el archivo y configuro la conexion con el api de parse
$headers = array(
   'X-Parse-Application-Id: u4daJ3ZqB1O8T7wnIw0tzN7w4mJ2zVoPLAbplhXg',
   'X-Parse-REST-API-Key: CMy1qZrlQOr12O4NaUJkzYVsl9tWGaUTN6wGoYf1',
   'Content-type: image/jpeg'
);
$post = file_get_contents($_FILES['Filedata']['tmp_name']);
$ch   = curl_init();

//configuro la peticion CURL
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_BINARYTRANSFER, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $post );
curl_setopt($ch, CURLOPT_URL, 'https://api.parse.com/1/files/'.$_FILES['Filedata']['name']);

//ejecuto la llamada al api
$result=curl_exec ($ch);
curl_close ($ch);

?>