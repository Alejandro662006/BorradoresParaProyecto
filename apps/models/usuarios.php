<?php

require_once __DIR__ ."../database/conexion.php";

function registrarUsuario($pdo, $nombre, $apellido, $email, $contrasena, $rol) {
    // Encriptar la contraseña
    $passHash = password_hash($contrasena, PASSWORD_BCRYPT);
    $fechaActual = date('Y-m-d');

    //valores que se van a la tabla que se elija 
    $sql = "INSERT INTO usuario (nombre, apellido, email, contrasena, rol, fecha_registro) 
            VALUES (:nombre, :apellido, :email, :contrasena, :rol, :fecha_registro)";

    $stmt = $pdo->prepare($sql);

    return $stmt->execute([
        ':nombre'         => $nombre,
        ':apellido'       => $apellido,
        ':email'          => $email,
        ':contrasena'     => $passHash,
        ':rol'            => $rol,
        ':fecha_registro' => $fechaActual
    ]);
}

// Obtiene todos los usuarios con email para verificar duplicados e iniciar sesión
function obtenerUsuarioPorEmail($pdo, $email) {
    $stmt = $pdo->prepare("SELECT id, nombre, apellido, email, contrasena, rol FROM usuario WHERE email = :email");
    $stmt->execute(['email' => $email]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

?>