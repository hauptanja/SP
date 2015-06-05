<?php
    $mysqli = mysqli_connect("164.8.252.141", "ursy", "dcba1023", "FERImdb");
    if (!$mysqli) {
        die("Connection failed: " . mysqli_connect_error());
    }
    
    session_start();
    
    if ($_POST['method'] == "getData")
    {
        $naslov = $_POST['movie_name'];
        $id =  $_POST['movie_id'];
        
        if ($id != "-")
            $q = "SELECT * FROM Film WHERE ID = '$id'";
        else 
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
            $output[7] = round( $row["tomatometer"], 1, PHP_ROUND_HALF_UP);
            $output[8] = round( $row["audience"], 1, PHP_ROUND_HALF_UP);
            $output[9] = $row["ID"];
            if ($row["poster_src"] != "")
            	$output[10] = $row["poster_src"];
            else 
            	$output[10] = "-";
            $i=11;
            $q2 = "SELECT * FROM Spored_kino WHERE Naslov_slo='".$row['slo_naslov']."'";
            $result2 = mysqli_query($mysqli, $q2);
            while($row2 = mysqli_fetch_assoc($result2)){
                $i++;
                $output[$i]=$row2['Cas'];
                $i++;
                $output[$i]=$row2['Dvorana'];
                $qDatum = "SELECT * FROM Datum_TV WHERE ID_Datum='".$row2['DatumID']."'";
                $resultDatum = mysqli_query($mysqli, $qDatum);
                while($rowD = mysqli_fetch_assoc($resultDatum)){
                    $i++;
                    $output[$i] = $rowD['Datum'];
                }
                $qL = "SELECT * FROM Lokacija WHERE ID_lokacije='".$row2['LokacijaID']."'";
                $resultL = mysqli_query($mysqli, $qL);
                while($rowL = mysqli_fetch_assoc($resultL)){
                    $i++;
                    $output[$i] = $rowL['Kraj'];
                }
            }
            $output[11]=$i;

        } else {
            echo "0 results";
        }

        $o = json_encode($output);
        echo $o;
    }
    else if ($_POST['method'] == "getSearchResults")
    {
	    $naslov = $_POST['movie_name'];
	    $q = "SELECT * FROM Film WHERE slo_naslov LIKE '%$naslov%'";
	    
	    $result = mysqli_query($mysqli, $q);

        if (mysqli_num_rows($result) > 0) {
        // output data of each row
        	while ($row = mysqli_fetch_assoc($result))
			{
				$output[] = "<li id='". $row["ID"] ."'>" . $row["slo_naslov"] . "</li>";
			}
			$output = json_encode($output);
			echo $output;
        } else {
            echo "Film ni v bazi.";
        }

    }
    else if ($_POST['method'] == "getList")
    {
        $naslov = $_POST['movie_name'];
        $id = $_POST['movie_id'];
        
        if ($id != "-")
            $q = "SELECT * FROM Film WHERE ID = '$id'";
        else 
            $q = "SELECT * FROM Film WHERE slo_naslov LIKE '$naslov%'";
        $result = mysqli_query($mysqli, $q);

        if (mysqli_num_rows($result) > 0) {
        // output data of each row
            $row = mysqli_fetch_assoc($result);
            $o1[0] = $row["slo_naslov"];
            $o1[1] = $row["ang_naslov"];
            
            $output1 = "Predlogi za film: <h2>$o1[0]</h2>";
            $output1 .= "<h3>$o1[1]</h3>";
            $o[0] = $output1;
            $o[2] = $row["ID"];
        } else {
            $o[0] = "Film ni v bazi.";
        }
        
        $q = "SELECT ID, slo_naslov, poster_src FROM Film";
        $result = mysqli_query($mysqli, $q);
        
        if (mysqli_num_rows($result) > 0) {
            $val = 0;
            $output2 = "<tr>";
            while(($row = mysqli_fetch_assoc($result)) && $val < 5) {
                $output2 .= "<td class='filmi' data-movie-ID='" . $row["ID"] . "'><img src='". $row['poster_src'] . "' class='poster_thumbnail'/><br>" . $row["slo_naslov"] . "<br>";
                $q2 = "SELECT * FROM Spored_kino WHERE Naslov_slo='".$row['slo_naslov']."'";
                $result2=mysqli_query($mysqli, $q2);
                if (mysqli_num_rows($result2) > 0) {
                    $output2 .= "<div class='smallTxt'><img class='thumbs' src='camera.png'/> Film je na sporedu</div></td>";
                }else {
                    $output2 .= "<div class='smallTxt'><img class='thumbs' src='no-camera.png'/> Filma ni na sporedu</div></td>";
                }
                $val++;
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
                $id = $row['ID_Filma'];
                $avg[$id] = $row['sum'] / $row['vsota'];
            }
            arsort($avg);
            
            $count = 0;
            
            foreach($avg as $id => $val) {
                if ($count == 5)
                    break;
                
                $q2 = "SELECT ID, slo_naslov, poster_src FROM Film WHERE ID = '$id'";
                $result2 = mysqli_query($mysqli, $q2);
                //echo $id;
                if (mysqli_num_rows($result2) > 0) {
                    $row2 = mysqli_fetch_assoc($result2);
                
					if ($val > 3)
						$txt = "<img class='thumbs' src='thumbs-up.png'/>";
					else if ($val <= 3)
						$txt = "<img class='thumbs' src='thumbs-down.png'/>";
					else 
						$txt = "<img class='thumbs' src='thumbs-neutral.png'/>";
						
					$oc = round( $val, 1, PHP_ROUND_HALF_UP);
                    $output .= "<tr><td class='filmi' data-movie-ID='" . $row2["ID"] . "'><img src='". $row2['poster_src'] . "' class='poster_thumbnail'/><br>" . $row2["slo_naslov"] . "<br>$txt $oc/5</td></tr>";
                    $count++;
                }
                else 
                    echo "shiz";
                
            }
            echo $output;
        } else {
            echo "Ni podatka";
        }
        
    }
    else if ($_POST['method'] == "getMostWatched")
    {
        $q = "SELECT ID_Filma, SUM(Ocena) AS sum, COUNT(Ocena) AS vsota FROM Gledani_Filmi GROUP BY ID_Filma";
        $result = mysqli_query($mysqli, $q);
        
        if (mysqli_num_rows($result) > 0) {
            
        // output data of each row
            while ($row = mysqli_fetch_assoc($result))
            {
                $id = $row['ID_Filma'];
                $avg[$id] = $row['vsota'];
                $ocena[$id] = $row['sum'] / $row['vsota'];
            }
            arsort($avg);
            
            $count = 0;
            
            foreach($avg as $id => $val) {
                if ($count == 5)
                    break;
                
                $q2 = "SELECT ID, slo_naslov, poster_src FROM Film WHERE ID = '$id'";
                $result2 = mysqli_query($mysqli, $q2);
                //echo $id;
                if (mysqli_num_rows($result2) > 0) {
                    $row2 = mysqli_fetch_assoc($result2);
                    
					if ($val > 3)
						$txt = "<img class='thumbs' src='thumbs-up.png'/>";
					else if ($val < 3)
						$txt = "<img class='thumbs' src='thumbs-down.png'/>";
					else 
						$txt = "<img class='thumbs' src='thumbs-neutral.png'/>";
					
					$oc = round( $ocena[$id], 1, PHP_ROUND_HALF_UP);
                    $output .= "<tr><td class='filmi' data-movie-ID='" . $row2["ID"] . "'><img src='". $row2['poster_src'] . "' class='poster_thumbnail'/><br>" . $row2["slo_naslov"] . "<br>$txt $oc/5</td></tr>";
                    $count++;
                }
                else 
                    echo "shiz";
                
            }
            echo $output;
        } else {
            echo "Ni podatka";
        }
        
    }
    else if ($_POST['method'] == "beseda->naslov")
    {
		
		$text = $_POST['beseda'];
		$besede[] = explode(" ", $text);
	}
    
    mysqli_close($mysqli);
?>
