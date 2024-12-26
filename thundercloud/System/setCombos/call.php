<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 26/02/2024
ruta: thundersc/thundercloud/system/setCombos/call.php
===============================================================================*/

require_once('./setCombos.php');
$key = $_POST['variablekey'];

if ($key == "setComboCedis") {
    echo cedis();
} else if ($key == "setComboEquipo") {
    echo equipo();
} else if ($key == "setComboGrupo") {
    echo grupo();
} else if ($key == "setComboZona") {
    echo zona();
} else if ($key == "setComboArea") {
    echo area();
} else if ($key == "setComboUbicacion") {
    echo ubicacion();
} else if ($key == "setComboClasif") {
    echo clasif();
} else if ($key == "setComboComponente") {
    echo componente();
} else if ($key == "setComboEquipoMaq") {
    echo equipomaq();
} else if ($key == "setComboSubEquipoMaq") {
    echo subequipomaq();
} else if ($key == "setComboEquiposTrabajo") {
    echo equipostrabajo();
} else if ($key == "setComboAsignatario") {
    echo asignatario();
} else if ($key == "setComboMarca") {
    echo marca();
} else if ($key == "setComboAlmacen") {
    echo almacen();
} else if ($key == "setComboAlmacenScorpion") {
    echo almacenScorpion();
}
