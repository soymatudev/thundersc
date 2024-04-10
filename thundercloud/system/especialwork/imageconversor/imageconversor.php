<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 09/10/2024
ruta: thundersc/thundercloud/system/especialwork/imageconversor/imageconversor.
===============================================================================*/
function imageconversor($fileTmpName, $newWidth, $newHeight, $quality, $type) {
  $dir = '../../../src/user_images/';

  switch ($type) {
      case 'jpeg_to_webp':
          // Convertir JPEG a WebP
          $source = imagecreatefromjpeg($fileTmpName);
          $destination = imagecreatetruecolor($newWidth, $newHeight);
          imagecopyresampled($destination, $source, 0, 0, 0, 0, $newWidth, $newHeight, imagesx($source), imagesy($source));
          $filename = uniqid() . '.webp';
          $target = $dir . $filename;
          imagewebp($destination, $target, $quality);
          imagedestroy($source);
          imagedestroy($destination);
          return $filename;
          break;
      case 'jpeg_to_png':
          // Convertir JPEG a PNG
          $source = imagecreatefromjpeg($fileTmpName);
          $destination = imagecreatetruecolor($newWidth, $newHeight);
          imagecopyresampled($destination, $source, 0, 0, 0, 0, $newWidth, $newHeight, imagesx($source), imagesy($source));
          $filename = uniqid() . '.png';
          $target = $dir . $filename;
          imagepng($destination, $target, $quality);
          imagedestroy($source);
          imagedestroy($destination);
          return $filename;
          break;
      default:
          file_put_contents('process.log', 'Formato de conversión no soportado', FILE_APPEND);
          return null;
          break;
  }
}
