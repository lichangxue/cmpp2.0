<?php if(!class_exists("View", false)) exit("no direct access allowed");?><!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>CMPP 2.0</title>
<link href="/i/css/bootstrap.min.css" rel="stylesheet">
<script src="/i/js/jquery.min.js"></script>
<script src="/i/js/bootstrap.min.js"></script>
</head>
<body>
<div class="container-fluid">
<?php include $_view_obj->compile($__template_file); ?>
</div>
</body>
</html>