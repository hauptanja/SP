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

?>
