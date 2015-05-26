<?php
// The file test.xml contains an XML document with a root element
// and at least an element /[root]/title.

if (file_exists('tfidftabela.xml')) {
    $file = simplexml_load_file('tfidftabela.xml');

    //print_r($xml);
} else {
    exit('Failed to open tf-idf.xml.');
}

$mysqli = mysqli_connect("164.8.252.141", "ursy", "dcba1023", "FERImdb");
if (!$mysqli) {
    die("Connection failed: " . mysqli_connect_error());
}
echo "Connected successfully";


foreach ($file->children() as $xml)
{
    $q = "INSERT INTO TFIDF (ID_filma, beseda, tf, idf) VALUES ('$xml->id_filma', '$xml->beseda', '$xml->tf', '$xml->idf')";

        if (mysqli_query($mysqli, $q)) {
            echo $xml->tf;
            //echo "New record created successfully";
        } else {
            echo "Error: " . mysqli_error($mysqli);
        }
}

mysqli_close($mysqli);

?>
