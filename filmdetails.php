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
            if ($row["duration"] != "")
                $output[3] = $row["duration"];
            else 
                $output[3] = "/";
            if ($row["country"] != "")
                $output[1] .= " - " . $row["country"] . " ";
            
            if ($row["year"] != 0)
                $output[1] .= "(" . $row["year"] . ")";
            
            
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
            //$output[11]=-1; //uporabnik še ni gledal filma...
            if(isset($_SESSION["username"])){
                $output[12]=1;
                $qU = "SELECT * FROM Uporabnik WHERE Username='".$_SESSION['username']."'";
                $resultU = mysqli_query($mysqli, $qU);
                while($rowU = mysqli_fetch_assoc($resultU)){
                    $sql2 = "SELECT * FROM Gledani_Filmi WHERE ID_Uporabnika='".$rowU['ID_uporabnika']."' AND ID_Filma='".$id."'";
                    $resultO = mysqli_query($mysqli, $sql2);
                    if(mysqli_num_rows($resultO) > 0) {
                        $rowO = mysqli_fetch_assoc($resultO);
                        $output[11] = $rowO['Ocena'];
                    }
                    else
                      $output[11] = -1;
                }
            }
            else
                $output[12]=0;
            $i=13;

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
            $output[13]=$i;

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
				$output[] = "<tr class='vrsta1'><td><img width='90' height='130' src='". $row['poster_src'] . "'/></td><td id=". $row["ID"] ."><span class='ime_filma' style='font-size:20px;'>" . $row["slo_naslov"] ." (".$row["ang_naslov"].")</span><br>
				<span class='ocena_zanr' style='font-size:14px;'>".$row["tomatometer"]."</span><br><br>
				<span class='vsebina_zanr1'>".$row["summary"]."</span><br><br>
				<span class='zanr' style='font-size:14px;'>".$row["genre"]."</span><span class='duration_zanr1' style='font-size:14px;'>".$row["duration"]."</span>
				</td></tr>";
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
            $row = mysqli_fetch_assoc($result);
            $id = $row["ID"];
            if(isset($_SESSION["username"])){
                $o[3]=1;
                $qU = "SELECT * FROM Uporabnik WHERE Username='".$_SESSION['username']."'";
                $resultU = mysqli_query($mysqli, $qU);
                while($rowU = mysqli_fetch_assoc($resultU)){
                    $sql2 = "SELECT * FROM Gledani_Filmi WHERE ID_Uporabnika='".$rowU['ID_uporabnika']."' AND ID_Filma='".$id."'";
                    $resultO = mysqli_query($mysqli, $sql2);
                    if(mysqli_num_rows($resultO) > 0) {
                        $rowO = mysqli_fetch_assoc($resultO);
                        $o[4] = $rowO['Ocena'];
                    }
                    else
                      $o[4] = -1;
                }
            }
            else
                $o[3]=0;
            $output1 = "<div id='inner_data'>Predlogi za film ... " . $row["slo_naslov"] . " (" . $row["ang_naslov"] . ")</div>";
            $o[0] = $output1;
            $o[2] = $row["ID"];
        } else {
            $o[0] = "Film ni v bazi.";
        }
        
        /* TF-IDF */
		
		$q = "call isci($id)";
		$result = mysqli_query($mysqli, $q);
		
        if (mysqli_num_rows($result) > 0) {
            $val = 0;
            $output2 = "<tr class = 'stran1'>";
            while(($row = mysqli_fetch_assoc($result)) && $val < 12) {
	            if ($val < 6)
	            	$st = "stran1";
	            else
	            	$st = "stran2";
	            if ($val % 3 == 0 && $val > 1)
	            	$output2 .= "</tr><tr class='$st'>";
	            
	            if ($row["ID"] != $id){
                	$output2 .= "<td class='filmi' data-movie-ID='" . $row["ID"] . "'><img src='". $row['poster_src'] . "' class='poster_thumbnail_small'/></td>";
                
					$val++;
                }
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
    else if ($_POST['method'] == "getMiniData")
    {
	    $id = $_POST['movie_id'];
        
        $q = "SELECT * FROM Film WHERE ID = '$id'";
        
        $result = mysqli_query($mysqli, $q);

        if (mysqli_num_rows($result) > 0) {
        // output data of each row
            $row = mysqli_fetch_assoc($result);
            $o1[0] = $row["slo_naslov"];
            $o1[1] = $row["ang_naslov"];
	        $o1[2] = $row["genre"];
	        if ($row["tomatometer"] != 0)
	        	$o1[3] = substr($row["tomatometer"], 0, strpos($row["tomatometer"], '/'));
	        else 
	        	$o1[3] = "NULL";
	        
	        if ($row["audience"] != 0)
	        	$o1[4] = substr($row["audience"], 0, strpos($row["audience"], '/'));
	        else 
	        	$o1[4] = "NULL";
	        $q2 = "SELECT * FROM Spored_kino WHERE Naslov_slo='".$row['slo_naslov']."'";
            $result2=mysqli_query($mysqli, $q2);
            if (mysqli_num_rows($result2) > 0) {
                $o1[5] .= "<div class='smallTxt'><img class='thumbs' src='camera.png'/> Film je na sporedu</div></td>";
            }else {
                $o1[5] .= "<div class='smallTxt'><img class='thumbs' src='no-camera.png'/> Filma ni na sporedu</div></td>";
            }
            
            
        } else {
            $o1[0] = "no";
        }
        $output = json_encode($o1);
        echo $output;

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
            $output1 = "";
            $output2 = "";
            foreach($avg as $id => $val) {
                if ($count == 6)
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
						
					$oc = round( $val, 1, PHP_ROUND_HALF_UP);
					
					if ($count < 3)
                    	$o[1] .= "<tr><td class='filmi' data-movie-ID='" . $row2["ID"] . "'><img src='". $row2['poster_src'] . "' class='poster_thumbnail'/></td></tr>";
                    else
                    	$o[2] .= "<tr><td class='filmi' data-movie-ID='" . $row2["ID"] . "'><img src='". $row2['poster_src'] . "' class='poster_thumbnail'/></td></tr>";
                    $count++;
                }
                else 
                    echo "shiz";
                
            }
            $output = json_encode($o);
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
            $output = "";
            foreach($avg as $id => $val) {
                if ($count == 5)
                    break;
                
                $q2 = "SELECT ID, slo_naslov, poster_src FROM Film WHERE ID = '$id'";
                $result2 = mysqli_query($mysqli, $q2);
                //echo $id;
                if (mysqli_num_rows($result2) > 0) {
                    $row2 = mysqli_fetch_assoc($result2);
                    
                    $oc = round( $ocena[$id], 1, PHP_ROUND_HALF_UP);
					if ($oc > 3)
						$txt = "<img class='thumbs' src='thumbs-up.png'/>";
					else if ($oc < 3)
						$txt = "<img class='thumbs' src='thumbs-down.png'/>";
					else 
						$txt = "<img class='thumbs' src='thumbs-neutral.png'/>";
					
					/*
                    $output .= "<tr><td class='filmi' data-movie-ID='" . $row2["ID"] . "'><img src='". $row2['poster_src'] . "' class='poster_thumbnail'/><br>" . $row2["slo_naslov"] . "<br>$txt $oc/5</td></tr>";
                    */
                    $output .= "<tr><td class='filmi' data-movie-ID='" . $row2["ID"] . "'><img src='". $row2['poster_src'] . "' class='poster_thumbnail'/></td></tr>";
                    
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
		$q = "call isci2('$text')";
		$result = mysqli_query($mysqli, $q);
		
        if (mysqli_num_rows($result) > 0) {
            $val = 0;
            while(($row = mysqli_fetch_assoc($result)) && $val < 12) {
	            if ($val < 6)
	            	$st = "stran1";
	            else
	            	$st = "stran2";
	            
                	$output2 .= "<li class='priporoceni_filmi' data-movie-ID='" . $row["ID"] . "'><img src='". $row['poster_src'] . "' class='poster_thumbnail_small'/>" . $row["slo_naslov"] . "</li>";
                
					$val++;
                
            }
		}
		else {
            $output2 = "Ni priporočil.";
        }
        
        echo $output2;		
	}
	else if ($_POST['method'] == "getUser")
    {
		$username = $_SESSION["username"];
		$q = "Select * from Uporabnik where Username = '$username'";
		$result = mysqli_query($mysqli, $q);
		
        if (mysqli_num_rows($result) > 0) {
           	$row = mysqli_fetch_assoc($result);
           	if($row["Spol"] == "male")
           		$txt = "Pozdravljen, ";
           	else 
           		$txt = "Pozdravljena, ";
           	$o[1] = $txt . $row["Ime"];
           	$o[2] = $row["Username"];
           	$output2 = json_encode($o);
		}
		else {
            $output2 = "Ni priporočil.";
        }
        echo $output2;		
	}
	else if ($_POST['method'] == "getUserDetails")
    {
		$username = $_SESSION["username"];
		$q = "Select * from Uporabnik where Username = '$username'";
		$result = mysqli_query($mysqli, $q);
		
        if (mysqli_num_rows($result) > 0) {
           	$row = mysqli_fetch_assoc($result);
           	$o[1] = $row["Ime"];
           	$o[2] = $row["Priimek"];
           	$o[3] = $row["Email"];
           	$o[4] = $row["Spol"];
           	$output2 = json_encode($o);
		}
		else {
            $output2 = "Ni priporočil.";
        }
        echo $output2;		
	}
	else if ($_POST['method'] == "sprUser")
    {
		$username = $_SESSION["username"];
		$ime = $_POST['ime'];
		$priimek = $_POST['priimek'];
		$email = $_POST['email'];
		$spol = $_POST['spol'];
		
		$q = "Update Uporabnik set Ime = '$ime', Priimek = '$priimek', Email = '$email', Spol = '$spol' where Username = '$username'";
	
		if (mysqli_query($mysqli, $q)) {
            echo "update OK";
        } else {
            echo "update Error";
        }	
	}
	else if ($_POST['method'] == "getWatched")
    {
		$idUp = $_SESSION["id_u"];
		$q = "call getGledani($idUp)";
		$result = mysqli_query($mysqli, $q);
		$output2 = "";
		
        if (mysqli_num_rows($result) > 0) {
           	while ($row = mysqli_fetch_assoc($result)){
	           	$output2 .= "<tr class='seznam_gledani' data-movie-ID='".$row['ID']."'><td><img class = 'poster_thumbnail_mini' src='" . $row["poster_src"]."'/></td><td style='font-weight:bold;'>" . $row["slo_naslov"] . " <br><span style='font-style:italic; font-weight:normal; font-size:16px;'>(". $row["ang_naslov"].")</span></td><td>" . $row["Ocena"]."/5</td></tr>";
           	}
		}
		else {
            $output2 = "Ni gledanih";
        }
        echo $output2;		
	}
	else if ($_POST['method'] == "getRandom")
    {
	    $idUp = $_SESSION["id_u"];
	    $q = "call getRandom($idUp)";
	    $result = mysqli_query($mysqli, $q);
		$output2 = "<tr>";
		
        if (mysqli_num_rows($result) > 0) {
           	while ($row = mysqli_fetch_assoc($result)){
	           	$output2 .= "<td class='filmi' data-movie-ID='" . $row['ID'] . "'><img class = 'poster_thumbnail_smaller' src='" . $row["poster_src"]."'/></td>";
           	}
           	$output2 .="</tr>";
		}
		else {
            $output2 = "Ni gledanih";
        }
        echo $output2;
	}
	
    
    mysqli_close($mysqli);
?>
