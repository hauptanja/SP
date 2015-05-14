<?php
    $mysqli = mysqli_connect("localhost", "root", "dcba1023", "FERImdb");
    if (!$mysqli) {
        die("Connection failed: " . mysqli_connect_error());
    }
    echo "Connected successfully";
    
    $q = "SELECT * FROM Film";
    $result = mysqli_query($mysqli, $q);

    if (mysqli_num_rows($result) > 0) {
    // output data of each row
        $row = mysqli_fetch_assoc($result);
        $output[] = $row["slo_naslov"];
        $output[] = $row["ang_naslov"];
        $output[] = $row["genre"];
        $output[] = $row["duration"];
        if ($row["year"] != null)
            $output[] = $row["year"];
        if ($row["country"] != null)
            $output[] = $row["country"];
        if ($row["summary"] != null)
            $output[] = $row["summary"];
        echo "id: " . $row["id"]. " - Name: " . $row["firstname"]. " " . $row["lastname"]. "<br>";
    
} else {
    echo "0 results";
}
?>