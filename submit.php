<?php

header('Content-Type: application/json');

// iniatializing and connecting pdo to mysql
$env = parse_ini_file('.env');

$dsn = "mysql:host={$env['DB_HOST']};port={$env['DB_PORT']};dbname={$env['DB_NAME']};charset=utf8mb4";

$pdo = new PDO($dsn, $env['DB_USER'], $env['DB_PASS']);

$sql = "INSERT INTO student_info_images_table (	full_name, 	Image_description, 	Image_url) VALUES (:nameValue, :photoDescription, :photo)";

$statement = $pdo->prepare($sql);


if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = $_POST['fullName'];
    $description = $_POST['imageDescription'];

    if (!isset($_FILES['photo'])) {
        echo json_encode(['invalid: no image uploaded']);
        exit;
    }

    $image = $_FILES['photo'];
    if ($image['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['error' => 'File upload failed with error code ' . $image['error']]);
        exit;
    }

    if ($image['size'] > 5 * 1024 * 1024) {
        echo json_encode(['error' => 'Image too large']);
        exit;
    }

    $mime = mime_content_type($image['tmp_name']);
    $allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    if (!in_array($mime, $allowed)) {
        echo json_encode(['error' => 'Invalid image type']);
        exit;
    }

    if (strlen($name) < 3 || strlen($name) > 50) {
        echo json_encode(['invalid fullname']);
        exit;
    }

    if (strlen($description) < 5 || strlen($description) > 300) {
        echo json_encode(['invalid description']);
        exit;
    }

    // integrating coudinary for image storage
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, "https://api.cloudinary.com/v1_1/{$env['CLOUDINARY_CLOUD_NAME']}/image/upload");
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, [
        'file' => new CURLFile($image['tmp_name']),
        'upload_preset' => 'siwes_showcase'
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    curl_close($ch);

    $cloudinary_image_data = json_decode($response, true);

    if (!isset($cloudinary_image_data['secure_url'])) {
        echo json_encode(['error' => 'no image url']);
        exit;
    }

    // sending data to database
    $statement->execute([
        ':nameValue' => $name,
        ':photoDescription' => $description,
        ':photo' => $cloudinary_image_data['secure_url']
    ]);

    echo json_encode(['status' => 'success', 'message' => 'Uploaded succesfully']);
} else {
    echo json_encode(['Request is not post']);
    exit;
}
