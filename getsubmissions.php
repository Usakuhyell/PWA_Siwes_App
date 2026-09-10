<?php

header('Content-Type: application/json');

$env = parse_ini_file('.env');

$dsn = "mysql:host={$env['DB_HOST']};port={$env['DB_PORT']};dbname={$env['DB_NAME']};charset=utf8mb4";

$pdo = new PDO($dsn, $env['DB_USER'], $env['DB_PASS']);

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $sql = "SELECT * FROM student_info_images_table";

    $query = $pdo->prepare($sql);
    $query->execute();

    $userData = $query->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($userData);
}
