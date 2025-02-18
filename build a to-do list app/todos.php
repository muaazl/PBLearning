<?php
// File to store the JSON data
$dataFile = 'data.json';

// Fetch existing tasks
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    header('Content-Type: application/json');
    echo file_get_contents($dataFile);
    exit();
}

// Save updated tasks
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true); // Decode to ensure it's valid JSON
    if (json_last_error() === JSON_ERROR_NONE) { 
        file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT)); // Save with formatting
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
    }
    exit();
}
?>
