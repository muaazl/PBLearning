<?php
// Start the session to use session variables
session_start();

// Function to calculate the compatibility percentage
function calculatePercentage($name1, $name2, $age1, $age2) {
     // 1. Name Length Score (as before, with float division)
    $len1 = strlen($name1);
    $len2 = strlen($name2);
    if ($len1 == $len2) {
       $lengthScore = 100;
    } else {
        $diff = abs($len1 - $len2);
        $sum = $len1 + $len2;
        $lengthScore = 100 - (($diff / (float)$sum) * 100);
    }

    // 2. First Letter Matching Score
    $firstLetter1 = strtoupper($name1[0]); // First letter of name1, make uppercase
    $firstLetter2 = strtoupper($name2[0]); // First letter of name2, make uppercase
     // Convert letters to numbers (A=1, B=2, etc.)
    $letterValue1 = ord($firstLetter1) - ord('A') + 1;
    $letterValue2 = ord($firstLetter2) - ord('A') + 1;
    $letterDiff = abs($letterValue1 - $letterValue2);
    $letterScore = max(0,100-($letterDiff*5)); // 100 points for perfect match, 5 points penalty.
    
    // 3. Age Difference Score
    $ageDiff = abs($age1 - $age2);
    if($ageDiff == 0){
        $ageScore = 100;
    }else{
       $ageScore = max(0, 100 - ($ageDiff*3)); // 100 points for same age, 3 points for each year difference.
    }
   
    // 4. Vowel Count Score
   $vowels = ['A', 'E', 'I', 'O', 'U'];
    $vowelCount1 = 0;
    $vowelCount2 = 0;
    //count vowels in first name
     for ($i = 0; $i < $len1; $i++) {
        $char = strtoupper($name1[$i]);
        if (in_array($char, $vowels)) {
            $vowelCount1++;
        }
    }
    //count vowels in second name
    for ($i = 0; $i < $len2; $i++) {
        $char = strtoupper($name2[$i]);
        if (in_array($char, $vowels)) {
            $vowelCount2++;
        }
    }
    //compare number of vowels and add score, or penalty
    if($vowelCount1 == 0 && $vowelCount2 == 0){
        $vowelScore = 100; //No vowels in either name get a 100
    }else if($vowelCount1 == 0 || $vowelCount2 == 0){
        $vowelScore = 0; //only vowels in 1 name get a zero.
    }else {
        $vowelScore = min(100, ($vowelCount1 + $vowelCount2)*10); // Max 100, 10 points for each vowel
    }


    // 5. Random Factor
    $randomFactor = mt_rand(-15, 15); // Random number between -15 and 15

    // Combine the scores
    $totalScore =  ($lengthScore * 0.40) + //40%
                  ($letterScore * 0.20) +  //20%
                  ($ageScore * 0.20) +  //20%
                  ($vowelScore * 0.20) + //20%
                  $randomFactor; // Add Random Factor

    // Ensure the total score is within 0-100
    return max(0, min(100, round($totalScore, 2)));
}

// Check if the cookie tracking the number of visits is set
if (isset($_COOKIE['visit_count'])) {
    // If cookie exists, increment the count
    $visit_count = $_COOKIE['visit_count'] + 1;
} else {
    // If cookie does not exist, set the initial count to 1
    $visit_count = 1;
}

// Set the cookie to last for 1 hour (3600 seconds)
setcookie('visit_count', $visit_count, time() + 3600, "/");

// Check if the form data has been submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve the user and partner names from the form data
    $user_name = $_POST["user_name"];
    $partner_name = $_POST["partner_name"];
    $age1 = $_POST["age1"];
    $age2 = $_POST["age2"];

    // Calculate the match percentage using the function
    $percentage = calculatePercentage($user_name, $partner_name, $age1, $age2);

    // Store the user's name, partner's name, percentage, and visit count in the session
    $_SESSION['user_name'] = $user_name;
    $_SESSION['partner_name'] = $partner_name;
    $_SESSION['percentage'] = $percentage;
    $_SESSION['visit_count'] = $visit_count;
    $_SESSION['age1'] = $age1;
    $_SESSION['age2'] = $age2;

    // Database configuration
    $servername = "localhost";
    $username = "root";
    $password = ""; // Your default password or password.  If you have no password, it is an empty string.
    $dbname = "matchmaker_db";

    // Create a new MySQLi connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check if the connection was successful
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
     // Prepare the SQL statement to insert a record into the new table
    $sql = "INSERT INTO tblMatchData (user_name, user_age, partner_name, partner_age, percentage) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);

    // Bind the parameters with their types
    $stmt->bind_param("sssid", $user_name, $age1, $partner_name, $age2, $percentage);


    // Execute the query
    if ($stmt->execute()) {
         // If insertion was successful, redirect to the results page
        header("Location: results.php");
        exit(); // Terminate script after redirect
    } else {
          // If insertion fails, display an error
         echo "Error inserting data: " . $stmt->error;
    }

    // Close the prepared statement and connection
    $stmt->close();
    $conn->close();
}
?>