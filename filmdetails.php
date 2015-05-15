<?php
    $mysqli = mysqli_connect("localhost", "root", "dcba1023", "FERImdb");
    if (!$mysqli) {
        die("Connection failed: " . mysqli_connect_error());
    }
    
    if ($_POST['method'] == "getData")
    {
        $naslov = $_POST['movie_name'];
        $q = "SELECT * FROM Film WHERE 'slo_naslov' = '$naslov'";
        $result = mysqli_query($mysqli, $q);

        if (mysqli_num_rows($result) > 0) {
        // output data of each row
            $row = mysqli_fetch_assoc($result);
            $output[0] = $row["slo_naslov"];
            $output[1] = $row["ang_naslov"];
            $output[2] = $row["genre"];
            $output[3] = $row["duration"];
            if ($row["year"] != null)
                $output[4] = $row["year"];
            if ($row["country"] != null)
                $output[5] = $row["country"];
            if ($row["summary"] != null)
                $output[6] = $row["summary"];

            $o = json_encode($output);
            echo $o;

        } else {
            echo "0 results";
        }
    }
    else if ($_POST['method'] == "getList")
    {
        $q = "SELECT * FROM Film";
        $result = mysqli_query($mysqli, $q);

        if (mysqli_num_rows($result) > 0) {
            $val = 0;
            while(($row = mysqli_fetch_assoc($result)) && $val < 10) {
                $val++;
                echo "<tr class='filmi'><td>$val</td><td class='naslovFilma'>" . $row["slo_naslov"] . "</td><td>" . $row["tomatometer"] . "/10</td><td>" . $row["audience"] . "/5</td></tr>";
            }
        }
    }
?>
