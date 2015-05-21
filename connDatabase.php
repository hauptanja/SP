<?php

$mysqli = mysqli_connect("164.8.252.141", "root", "dcba1023", "FERImdb");
    
if (!$mysqli) 
{
    die("Connection failed: " . mysqli_connect_error());
}

//echo "Connected successfully";

//session_start();

if ($_POST['method'] == "getMovies")
{
		$kategorija = $_POST['genre_name'];
		$q = "SELECT slo_naslov FROM film WHERE genre LIKE '%$kategorija%'";
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
		$naslovFilma = $_POST['movie_name'];
		$q = "SELECT * FROM film WHERE slo_naslov = '$naslovFilma'";
		$result = mysqli_query($mysqli, $q);
			
		if (mysqli_num_rows($result) > 0) 
		{
			while($row = mysqli_fetch_assoc($result))
			{
				$i[0] = $row["slo_naslov"];
				$i[1] = $row["ang_naslov"];
				$i[2] = $row["genre"];
				
				$j = "<h2>$i[0]</h2>";
				$j .= "<h3>$i[1]</h3>";
				$j .= "<h4 class='z'>$i[2] (klik za prikaz podobnih filmov)</h4>";
				$prikaz[0] = $j;
			}
		} 
		
		else 
		{
				$prikaz[0] = "Ni podatkov!";
		}
			
		$prikaz = json_encode($prikaz);
		echo $prikaz;
}

if ($_POST['method'] == "getZanrFilm")
{
        $zanrFilma = $_POST['genre_movie'];
		$q = "SELECT slo_naslov FROM film WHERE genre LIKE '%$zanrFilma%'";
        $result = mysqli_query($mysqli, $q);
        
        if (mysqli_num_rows($result) > 0) 
		{
            $stevec = 0;
			
            $j = "<tr>";
            while(($row = mysqli_fetch_assoc($result)) && $stevec < 5) 
			{
                $stevec++;
                $j .= "<td class='f'>" .$row["slo_naslov"]. "</td>";
            }
            $j .= "</tr>";
            
			$prikaz[0] = $j;
        }
		
        else 
		{
            $prikaz[0] = "Ni podatkov!";
        }
        
        $prikaz = json_encode($prikaz);
        echo $prikaz;
}
	
if ($_POST['method'] == "getData")
{
        $naslovFilma = $_POST['movie_name'];
        $q = "SELECT * FROM film WHERE slo_naslov = '$naslovFilma'";
        $result = mysqli_query($mysqli, $q);
        
		if (mysqli_num_rows($result) > 0) 
		{
            $row = mysqli_fetch_assoc($result);
            
			$i[0] = $row["slo_naslov"];
            $i[1] = $row["ang_naslov"];
            $i[2] = $row["genre"];
            
			if ($row["year"] != "")
                $i[3] = $row["duration"];
            
			else 
                $i[3] = "/";
            
			if ($row["year"] != 0)
                $i[4] = $row["year"];
            
			else
                $i[4] = "/";
            
			if ($row["country"] != "")
                $i[5] = $row["country"];
            
			else
                $i[5] = "/";
            
			if ($row["summary"] != null)
                $i[6] = $row["summary"];
            
			else 
                $i[6] = "";
            
			//$i[7] = $row["tomatometer"];
            //$i[8] = $row["audience"];
			//$i[9] = $row["ID"];
            
			$prikaz = json_encode($i);
            echo $prikaz;
        } 
		
		else 
		{
            echo "Ni podatkov!";
        }
}
?>
