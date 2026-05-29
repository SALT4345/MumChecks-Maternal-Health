<?php
header('Content-Type: application/json');
require_once '../config.php';

$token = checkAuth();
$userId = verifyToken($pdo, $token);

if (!$userId) {
    echo json_encode(['success' => false, 'message' => 'Invalid token']);
    exit;
}

$stmt = $pdo->prepare('SELECT pregnancy_week FROM users WHERE id = ?');
$stmt->execute([$userId]);
$user = $stmt->fetch();
$week = $user['pregnancy_week'];

$stmt = $pdo->prepare('
    SELECT id, title, content, week_range FROM health_tips WHERE id > 0 LIMIT 6
');
$stmt->execute();
$tips = $stmt->fetchAll();

echo json_encode(['success' => true, 'tips' => $tips]);
?>