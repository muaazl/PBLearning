<?php
$filename = 'expenses.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Save data (format JSON for readability)
    $data = json_decode(file_get_contents("php://input"), true);
    usort($data, function($a, $b) {
        return strtotime($a['date']) - strtotime($b['date']);
    });
    file_put_contents($filename, json_encode($data, JSON_PRETTY_PRINT));
    echo json_encode(["status" => "success"]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch data
    if (file_exists($filename)) {
        $data = file_get_contents($filename);
        echo $data;
    } else {
        echo json_encode([]);
    }
}
?>
