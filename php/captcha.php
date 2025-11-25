<?php
session_start();
$code = rand(1000, 9999);
$_SESSION['cap'] = $code;

header("Content-Type: image/png");

$img = imagecreate(80, 30);
$bg  = imagecolorallocate($img, 255, 255, 255);
$txt = imagecolorallocate($img, 0, 0, 0);

imagestring($img, 5, 10, 8, $code, $txt);
imagepng($img);
imagedestroy($img);
?>
