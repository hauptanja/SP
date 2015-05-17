<?php
$u=$_POST['Username'];
$password=$_POST['Password'];
$ph=md5($password);
$e=$_POST['Email'];
$n=$_POST['Name'];
$l=$_POST['Lastname'];
$s=$_POST['Sex'];
echo $u.$ph.$e.$n.$l.$s;
include_once 'connectionDatabase.php';
$sql="INSERT INTO Uporabnik (Username, Password, Email, Ime, Priimek, Spol) VALUES ('".$u."','".$ph."','".$e."','".$n."','".$l."','".$s."') ";
$result = $conn->query($sql);
$conn->close();
?>
