<?php

$mysqli = mysqli_connect("164.8.252.141", "ursy", "dcba1023", "FERImdb");
    
if (!$mysqli) 
{
    die("Connection failed: " . mysqli_connect_error());
}

//echo "Connected successfully";

if ($_POST['method'] == "getKanal")
{
		$film = $_POST['film'];
		
		$q = "SELECT DISTINCT Ime_kanala
			  FROM Spored_TV
			  INNER JOIN Kanal_TV
			  ON kanal_ID=ID_Kanal
			  WHERE Naslov_slo = '$film'";
        
		$result = mysqli_query($mysqli, $q);
		
		if (mysqli_num_rows($result) == 1) 
		{
			$q1 = "SELECT Naslov_slo, Cas, Ime_kanala, Datum
				   FROM Spored_TV
				   INNER JOIN Kanal_TV
				   ON kanal_ID=ID_Kanal
				   INNER JOIN Datum_TV
				   ON datum_ID=ID_Datum
				   WHERE Naslov_slo = '$film'";
        
			$result1 = mysqli_query($mysqli, $q1);
			
			echo "<tr>";
			echo "<th><strong>Naslov</strong></th><th><strong>Cas</strong></th><th><strong>Kanal</strong></th><th><strong>Datum</strong></th>";
			echo "</tr>";
			
			while ($row = mysqli_fetch_assoc($result1))
			{
				echo "<tr>";
				
				foreach ($row as $film)
				{
					echo "<td class='film'>" .$film. "</td>";
					$i = json_encode($film);
					//echo $i;
				}
				
				echo "</tr>";
            }
		}

		else if (mysqli_num_rows($result) > 0) 
		{
			while ($row = mysqli_fetch_assoc($result))
			{
				foreach ($row as $film)
				{
					echo "<button class='btn'>" .$film. "</button>";
					$i = json_encode($film);
					//echo $i;
				}
            }
        }
		
		else
		{
			echo "<div style='font-size:18px;'><strong>Film se ne predvaja na televiziji!</strong></div>";
		}
}

if ($_POST['method'] == "getSpored")
{
		$film = $_POST['film'];
		$kanal = $_POST['spored'];
		
		$q = "	SELECT Naslov_slo, Cas, Ime_kanala, Datum
				FROM Spored_TV
				INNER JOIN Kanal_TV
				ON kanal_ID=ID_Kanal
				INNER JOIN Datum_TV
				ON datum_ID=ID_Datum
				WHERE Ime_kanala = '$kanal' AND Naslov_slo = '$film'";
        
		$result = mysqli_query($mysqli, $q);
		
		if (mysqli_num_rows($result) > 0) 
		{
			echo "<tr></tr>";
			echo "<tr>";
			echo "<th><strong>Naslov</strong></th><th><strong>Cas</strong></th><th><strong>Kanal</strong></th><th><strong>Datum</strong></th>";
			echo "</tr>";
			
			while ($row = mysqli_fetch_assoc($result))
			{
				echo "<tr>";
				
				foreach ($row as $film)
				{
					echo "<td class='film'>" .$film. "</td>";
					$i = json_encode($film);
					//echo $i;
				}
				
				echo "</tr>";
            }
        }
}

if ($_POST['method'] == "getMovies")
{
		$kategorija = $_POST['genre_name'];
		
		$q = "SELECT ID, slo_naslov FROM Film WHERE genre LIKE '%$kategorija%'";
        
		$result = mysqli_query($mysqli, $q);
		
		if (mysqli_num_rows($result) > 0) 
		{
			$prikaz = "<tr>";
			
			while ($row = mysqli_fetch_assoc($result))
			{
				$prikaz .= "<tr><td class='filmi' data-movie-ID='" . $row["ID"] . "' style='font-size: 20px;'>" . $row["slo_naslov"] . "</td></tr>";
            }
			
			$prikaz .= "</tr>";
			$p[0] = $prikaz;
        }
		
		$p = json_encode($p);
        echo $p;
}

/*if ($_POST['method'] == "getFilm")
{
        $naslov = $_POST['movie_name'];
        
        $q = "SELECT * FROM Film WHERE slo_naslov = '$naslov'";
        $result = mysqli_query($mysqli, $q);
        
		if (mysqli_num_rows($result) > 0) 
		{
        
            $row = mysqli_fetch_assoc($result);
            $i[0] = $row["slo_naslov"];
            $i[1] = $row["ang_naslov"];
            
            $j = "Predlogi za film: <h2>$i[0]</h2>";
            $j .= "<h3>$i[1]</h3>";
            
			$prikaz[0] = $j;
        } 
		
		else 
		{
            $prikaz[0] = "Film ni v bazi.";
        }
        
        $q = "SELECT * FROM Film";
        $result = mysqli_query($mysqli, $q);
        
        if (mysqli_num_rows($result) > 0) 
		{    
			$x = 0;
            $j = "<tr>";
            
			while(($row = mysqli_fetch_assoc($result)) && $x < 5) 
			{
                $x++;
                $j .= "<td class='filmi' data-movie-ID='" . $row["ID"] . "'>" . $row["slo_naslov"] . "</td>";
            }
            
			$j .= "</tr>";
            
			$prikaz[1] = $j;
        }
        
		else 
		{
            $prikaz[1] = "Ni priporocil.";
        }
        
        $prikaz = json_encode($prikaz);
        echo $prikaz;
}*/

mysqli_close($mysqli);

?>
