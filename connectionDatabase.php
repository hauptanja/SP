<?php
$servername = "164.8.252.141";
$username = "ursy";
$password = "dcba1023";
$dbname = "FERImdb";
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
