<?php

$mysqli = mysqli_connect("164.8.252.141", "ursy", "dcba1023", "FERImdb");
    
if (!$mysqli) 
{
    die("Connection failed: " . mysqli_connect_error());
}

//echo "Connected successfully";

//session_start();

if ($_POST['method'] == "getMovies")
{
		$kategorija = $_POST['genre_name'];
		$q = "SELECT slo_naslov FROM Film WHERE genre LIKE '%$kategorija%'";
        $result = mysqli_query($mysqli, $q);

		if (mysqli_num_rows($result) > 0) 
		{
			while ($row = mysqli_fetch_assoc($result))
			{
				foreach ($row as $film)
				{
					echo "<tr><td class='film' align='justify' style='font-size: 20px;'>" .$film. "</td></tr>";
				}
				
				$i = json_encode($film);
				echo $i;
            }
        }
}

if ($_POST['method'] == "getFilm")
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
            $j1 = "<tr>";
            
			while(($row = mysqli_fetch_assoc($result)) && $x < 5) 
			{
                $x++;
                $j1 .= "<td class='f'>" . $row["slo_naslov"] . "</td>";
            }
            
			$j1 .= "</tr>";
            $prikaz[1] = $j1;
        }
        
		else 
		{
            $prikaz[1] = "Ni priporocil.";
        }
        
        $prikaz = json_encode($prikaz);
        echo $prikaz;
}

?>
