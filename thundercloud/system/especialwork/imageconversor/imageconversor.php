<?php
function imageconversor($fileTmpName, $newWidth, $newHeight, $quality, $type) {
  $dir = __DIR__ . '../../../src/user_images/';
  
  switch ($type) {
      case 'jpeg':
          // Implementa la conversión a JPEG aquí
          break;
      case 'png':
          // Implementa la conversión a PNG aquí
          break;
      case 'gif':
          // Implementa la conversión a GIF aquí
          break;
      case 'webp':
          return imageWEBP($fileTmpName, $newWidth, $newHeight, $quality, $dir);
          break;
  }
}

function imageWEBP($fileTmpName, $newWidth, $newHeight, $quality, $dir) {
  $check = getimagesize($fileTmpName);
  if ($check !== false) {
    // cargar la imagen
    $imageU = imagecreatefromwebp($fileTmpName);

    //Obtener nuevas dimensiones
    $width_orig = imagesx($imageU);
    $height_orig = imagesy($imageU);

    $newImage = imagecreatetruecolor($newWidth, $newHeight);

    // Redimensionar la imagen
    imagecopyresampled($newImage, $imageU, 0, 0, 0, 0, $newWidth, $newHeight, $width_orig, $height_orig);

    // Generar un nombre de archivo único
    $filename = uniqid() . '.webp';
    $target = $dir . $filename;
    
    // Guardar la imagen redimensionada
    imagewebp($newImage, $target, $quality);

    // Liberar memoria
    imagedestroy($imageU);
    imagedestroy($newImage);

    // Devolver la ruta del archivo guardado
    return $filename;
  } else {
    file_put_contents('process.log', 'El archivo no es una imagen o error al cargar', FILE_APPEND);
    echo json_encode(["Execute" => "Incorrect"]);
    return null;
  }
}
