<?php
    $mysqli = mysqli_connect("164.8.252.141", "ursy", "dcba1023", "FERImdb");
    if (!$mysqli) {
        die("Connection failed: " . mysqli_connect_error());
    }
    
    session_start();
    
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
            else 
                $output[6] = "";
            $output[7] = $row["tomatometer"];
            $output[8] = $row["audience"];
            $output[9] = $row["ID"];
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
            $output2 = "<tr>";
            while(($row = mysqli_fetch_assoc($result)) && $val < 5) {
                $val++;
                $output2 .= "<td class='filmi'>" . $row["slo_naslov"] . "</td>";
            }
            $output2 .= "</tr>";
            $o[1] = $output2;
        }
        else {
            $o[1] = "Ni priporočil.";
        }
        
        $o = json_encode($o);
        echo $o;
    }
    else if ($_POST['method'] == "oceni")
    {
        $id_filma = $_POST['id'];
        $ocena = $_POST['ocena'];
        $uporabnik = $_SESSION['username'];
        
        $q = "SELECT * FROM Uporabnik WHERE Username = '$uporabnik'";
        $result = mysqli_query($mysqli, $q);
        $id_uporabnika = -1;
        
        if (mysqli_num_rows($result) > 0) {
        // output data of each row
            $row = mysqli_fetch_assoc($result);
            $id_uporabnika = $row["ID_uporabnika"]; 
        }
        
        $q = "SELECT * FROM Gledani_Filmi WHERE ID_Uporabnika = '$id_uporabnika' AND ID_Filma = '$id_filma'";
        $result = mysqli_query($mysqli, $q);
        
        if (mysqli_num_rows($result) > 0) {
            $q1 = "UPDATE Gledani_Filmi SET Ocena = '$ocena' WHERE ID_Uporabnika = '$id_uporabnika' AND ID_Filma = '$id_filma'";
            if (mysqli_query($mysqli, $q1)) {
                echo "update OK";
            } else {
                echo "update Error";
            }
        }
        else 
        {
            $q1 = "INSERT INTO Gledani_Filmi (ID_Uporabnika, ID_Filma, Ocena) VALUES ('$id_uporabnika', '$id_filma', '$ocena')";
            if (mysqli_query($mysqli, $q1)) {
                echo "insert OK";
            } else {
                echo "insert Error";
            }
        }
    }
    else if ($_POST['method'] == "getBest")
    {
        $q = "SELECT ID_Filma, SUM(Ocena) AS sum, COUNT(Ocena) AS vsota FROM Gledani_Filmi GROUP BY ID_Filma";
        $result = mysqli_query($mysqli, $q);
        
        if (mysqli_num_rows($result) > 0) {
            
        // output data of each row
            while ($row = mysqli_fetch_assoc($result))
            {
                $avg[$row['ID_Filma']] = $row['sum'] / $row['vsota'];
            }
            rsort($avg);
            
            $count = 0;
            $output = "<tr>";
            
            foreach($avg as $id => $val) {
                if ($count == 5)
                    break;
                
                $q2 = "SELECT slo_naslov, poster_src FROM Film WHERE ID = '$id'";
                $result2 = mysqli_query($mysqli, $q2);
                echo $id;
                if (mysqli_num_rows($result2) > 0) {
                    $row2 = mysqli_fetch_assoc($result2);
                
                    $output .= "<td class='filmi'><img src='". $row2['poster_src'] . "' class='poster_thumbnail'/><br>" . $row2["slo_naslov"] . "<br>$val</td>";
                    $count++;
                }
                else 
                    echo "shiz";
                
            }
            $output .= "</tr>";
            echo $output;
        } else {
            echo "Ni podatka";
        }
        
    }
    
    mysqli_close($mysqli);
?>