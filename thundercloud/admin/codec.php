<?php
 /*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 10/04/2023
ruta: thundersc/thundercloud/log/codec.php
nota: Si me la rife con este codigo, no me acuerdo que hace
===============================================================================*/
class Codec {

  private $permisson;

  public function __construct() {
    $this->permisson = [
      "a" => [
        "a" => "dashboard-ms",
        "b" => "molino-ms",
        "c" => "silo-ms",
        "d" => "panel-tecnico-ms",
      ],
      "b" => [
        "a" => "usuariosygrupos-man",
        "b" => "nuevasot-man",
        "c" => "calendario-man",
      ],
      "c" => [
        "a" => "maquinas-ca",
        "b" => "ubicaciones-ca",
      ],
      "d" => [
        "a" => "agregar-inv-sis",
        "b" => "historial-inv-sis",
      ],
      "e" => [
        "a" => "panel-sync-scorpion",
        "b" => "syncventas-sync-scorpion",
      ],
      "f" => "",
      "g" => "",
      "h" => "",
      "i" => "",
      "j" => "",
      "k" => "",
      "l" => "",
      "m" => "",
      "n" => "",
      "o" => "",
      "p" => "",
      "q" => "",
      "r" => "",
      "s" => "",
      "t" => "",
      "u" => "",
      "v" => "",
      "w" => "",
      "x" => "",
      "y" => "",
      "z" => "",
      "A" => "",
      "B" => "",
      "C" => "",
      "D" => "",
      "E" => "",
      "F" => "",
      "G" => "",
      "H" => "",
      "I" => "",
      "J" => "",
      "K" => "",
      "L" => "",
      "M" => "",
      "N" => "",
      "O" => "",
      "P" => "",
      "Q" => "",
      "R" => "",
      "S" => "",
      "T" => "",
      "U" => "",
      "V" => "",
      "W" => "",
      "X" => "",
      "Y" => "",
      "Z" => "",
      "0" => "",
      "1" => "",
      "2" => "",
      "3" => "",
      "4" => "",
      "5" => "",
      "6" => "",
      "7" => "",
      "8" => "",
      "9" => "",
    ];
  }
    
  public function encode ($permNeeded) {
    $encoded = [];
    foreach ($permNeeded as $perm) {
      foreach ($this->permisson as $keyModule => $ModuleArray) {
        if (array_search($perm, $ModuleArray)) {
          $encoded[$keyModule][] = array_search($perm, $ModuleArray);
          break;
        }
      }
    }
    $json = json_encode($encoded);
    return $json;
  }

  public function decode ($codec) {
    $codec = json_decode($codec, true);
    $decoded = [];
    foreach ($codec as $keyModule => $ModuleArray) {
      foreach ($ModuleArray as $perm) {
        $decoded[] = $this->permisson[$keyModule][$perm];
      }
    }
    return $decoded;
  }
}