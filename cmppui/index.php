<?php
session_start();
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
define('APP_DIR', realpath('./'));
define("APP_PATH",dirname(__FILE__));
require(APP_DIR.'/protected/lib/speed.php');