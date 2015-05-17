<?php
    $mysqli = mysqli_connect("localhost", "root", "dcba1023", "FERImdb");
    if (!$mysqli) {
        die("Connection failed: " . mysqli_connect_error());
    }
    
    if ($_POST['method'] == "getData")
    {
        $naslov = $_POST['movie_name'];
        $q = "SELECT * FROM Film WHERE slo_naslov = '$naslov'";
        $result = mysqli_query($mysqli, $q);

        if (mysqli_num_rows($result) > 0) {
        // output data of each row
            $row = mysqli_fetch_assoc($result);
            $output[0] = $row["slo_naslov"];
            $output[1] = $row["ang_naslov"];
            $output[2] = $row["genre"];
            if ($row["year"] != "")
                $output[3] = $row["duration"];
            else 
                $output[3] = "/";
            if ($row["year"] != 0)
                $output[4] = $row["year"];
            else
                $output[4] = "/";
            if ($row["country"] != "")
                $output[5] = $row["country"];
            else
                $output[5] = "/";
            if ($row["summary"] != null)
                $output[6] = $row["summary"];
            $output[7] = $row["tomatometer"];
            $output[8] = $row["audience"];

            $o = json_encode($output);
            echo $o;

        } else {
            echo "0 results";
        }
    }
    else if ($_POST['method'] == "getList")
    {
        $naslov = $_POST['movie_name'];
        
        $q = "SELECT * FROM Film WHERE slo_naslov = '$naslov'";
        $result = mysqli_query($mysqli, $q);

        if (mysqli_num_rows($result) > 0) {
        // output data of each row
            $row = mysqli_fetch_assoc($result);
            $o1[0] = $row["slo_naslov"];
            $o1[1] = $row["ang_naslov"];
            
            $output1 = "Predlogi za film: <h2>$o1[0]</h2>";
            $output1 .= "<h3>$o1[1]</h3>";
            $o[0] = $output1;
        } else {
            $o[0] = "Film ni v bazi.";
        }
        
        $q = "SELECT * FROM Film";
        $result = mysqli_query($mysqli, $q);
        
        if (mysqli_num_rows($result) > 0) {
            $val = 0;
            $output = "";
            while(($row = mysqli_fetch_assoc($result)) && $val < 10) {
                $val++;
                $output2 .= "<tr class='filmi'><td>$val</td><td class='naslovFilma'>" . $row["slo_naslov"] . "</td><td>" . $row["tomatometer"] . "/10</td><td>" . $row["audience"] . "/5</td></tr>";
            }
            $o[1] = $output2;
        }
        else {
            $o[1] = "Ni priporočil.";
        }
        
        $o = json_encode($o);
        echo $o;
    }
?>