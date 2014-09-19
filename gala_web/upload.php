<?php 

$image = $_POST[image];
$file = $_POST[file];

// remove 'data:image/png;base64,'
$uri =  substr($image,strpos($image,',') + 1);

// save to file
$imageFilePath = 'img/' . $file;

$result = file_put_contents($imageFilePath, base64_decode($uri));

echo $result;

?>
