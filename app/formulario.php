<html>
<head>
	<title>ECUTRIPS login</title>
	<style type="text/css">
		body, html{ 
			background: #EEE;
			display: table;
			height: 100%;
			width: 100%;
			margin: 0;
			padding: 0;
			font: 12px/18px "Lucida Grande","Lucida Sans Unicode",Helvetica,Arial,Verdana,sans-serif;
			color: #333;
		}

		div{
			display: table-cell; 
			vertical-align: middle; 
			text-align: center;
			width: 100%;
			margin: 0;
			padding: 0;
		}
		form{
			background: #fff;
			display: block;
			width: 400px;
			padding: 30px 10px;
			margin: 0 auto;
			border: #333;
			box-shadow: 0 0 4px #aaa;
		}
		label
		{
			display: inline-block;
			width: 20%;
			text-align: right;
		}
		input
		{
			margin: 10px 0;
			width: 50%;
			padding: 5px 10px;
		}

		.button
		{
			background: #1b52e2;
			color: #DDD;
			border: 1px solid #0c2465;
			border-radius: 4px;
			width: auto;
			padding: 4px 15px;
			box-shadow: 0 2px 3px #666, 0 11px 4px #2b81ea inset, 0 -1px 1px #2b81ea inset;
			text-shadow: -1px -1px 1px #333;
			text-decoration: none;
			margin: 10px;
			transition: 0.2s all;
			-webkit-transition: 0.2s all;
			-o-transition: 0.2s all;
		}

		.button:hover
		{
			color: #FFF;
			background: #2266e5;
			box-shadow: 0 2px 5px #666, 0 11px 4px #2694ee inset, 0 -1px 1px #589cef inset;
		}

		.button:active
		{
			color: #aaa;
			background: #2266e5;
			box-shadow: 0 -1px 1px #aaa, 0 11px 4px #236ee6 inset, 0 -1px 4px #1a4fd9 inset;
		}

	</style>
</head>
<body>
	<div>
		<form action="" method="POST">
			<h1>ECUTRIPS</h1>
			<label>Usuario:</label>
			<input type="text" name="usuario" />
			<br />
			<label>Clave:</label>
			<input type="password" name="clave" />
			<br />
			<input type="submit" value="ingresar" class="button" />
		</form>
	</div>
</body>
</html>