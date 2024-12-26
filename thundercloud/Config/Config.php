<?php

if (!function_exists('nextToUtf8')){
    function thunderToUtf8($cadena){
        $cadena=mb_convert_encoding($cadena,"UTF-8",mb_detect_encoding($cadena,array("UTF-8","ISO-8859-1"),true));       
        return $cadena;
    }
}