<?php

// Definir el volumen en pulgadas cúbicas
$V_inches = 1000;

// Convertir volumen a cm cúbicos
$V_cm = $V_inches * pow(2.54, 3);

// Calcular el radio que minimiza el área superficial en cm
$r_cm = pow($V_cm / (2 * M_PI), 1/3);

// Calcular el área mínima de la superficie en cm^2
$A_min_cm = (2 + 2 * M_PI) / pow(2 * M_PI, 1/3) * pow($V_cm, 2/3);

// Convertir radio y área mínima a pulgadas
$r_inches = $r_cm / 2.54;
$A_min_inches = $A_min_cm / pow(2.54, 2);

echo "El radio que minimiza el área superficial es: $r_cm cm\n";
echo "El área mínima de la superficie es: $A_min_cm cm^2\n";
echo "El radio en pulgadas es: $r_inches pulgadas\n";
echo "El área mínima en pulgadas es: $A_min_inches pulgadas cuadradas\n";

?>
