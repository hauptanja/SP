<?php
$servername = "164.8.252.141";
$username = "ursy";
$password = "dcba1023";
$dbname = "FERImdb";
$xml = simplexml_load_file("rotteninfo.xml") or die('Cannot load xml file!');

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);
// Check connection
if (!$conn)
{
    die("Connection failed: " . mysqli_connect_error());
}

foreach($xml->children() as $movies)
{
    $tomato = $movies->tomatometer;
    $audience = $movies->audiencescore;
    $image = $movies->image_link;
    $ID = $movies->ID;
    $sql = "UPDATE Film SET tomatometer='$tomato', audience='$audience', poster_src='$image' WHERE ID='$ID'";

    if (mysqli_query($conn, $sql))
    {
        echo "Record updated successfully";
    }
    else
    {
        echo "Error updating record: " . mysqli_error($conn);
    }
}
mysqli_close($conn);
?>

