<?php

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = $_POST['fullName'];
    $description = $_POST['imageDescription'];

    if (!isset($_FILES['image'])) {
        echo json_encode(['invalid: no image uploaded']);
        exit;
    }

    $image = $_FILES['image'];

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
}

echo json_encode(['success' => 'Submission recieved']);
echo json_encode(['success' => $_POST]);
