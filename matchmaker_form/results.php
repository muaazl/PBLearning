<?php
// Start the session
session_start();

// Check if the session variables are set, if not redirect to form
if (!isset($_SESSION['user_name']) || !isset($_SESSION['visit_count']) || !isset($_SESSION['percentage']) || !isset($_SESSION['age1']) || !isset($_SESSION['age2'])) {
    header("Location: Form.html"); // Redirect if session data is not set
    exit; // Terminate script
}
// Get the values stored in the session
$user_name = $_SESSION['user_name'];
$partner_name = $_SESSION['partner_name'];
$visit_count = $_SESSION['visit_count'];
$percentage = $_SESSION['percentage'];
$age1 = $_SESSION['age1'];
$age2 = $_SESSION['age2'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Matchmaker Results</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Match Results</h1>
        <p>User Name: <?php echo htmlspecialchars($user_name); ?></p>
        <p>User Age: <?php echo htmlspecialchars($age1); ?></p>
        <p>Partner Name: <?php echo htmlspecialchars($partner_name); ?></p>
        <p>Partner Age: <?php echo htmlspecialchars($age2); ?></p>
        <p>Visit Count: <?php echo htmlspecialchars($visit_count); ?></p>
        <p>Matching Percentage: <?php echo htmlspecialchars(round($percentage, 2)); ?>%</p>

        <form action="" method="post">
            <input type="submit" name="delete_sessions" value="Delete Sessions">
        </form>
    </div>

<?php
// Check if the delete sessions button was pressed
if(isset($_POST['delete_sessions'])){
    // Unset the sessions.
    session_unset();
    // Destroy the sessions.
    session_destroy();
    // Redirect to the Form.html page.
    header("Location: Form.html");
    exit();
}
?>
</body>
</html>