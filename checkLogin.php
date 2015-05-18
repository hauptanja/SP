<?php
    $u=$_POST['U'];
    $g=$_POST['Geslo'];
    $hash=md5($g);
    include_once 'connectionDatabase.php';
    $sql="SELECT * FROM Uporabnik WHERE Username='".$u."' AND Password='".$hash."'";
    $result=$conn->query($sql);
    if ($result->num_rows > 0) {
        session_start();
        $_SESSION['username']=$u;
        $row=$result->fetch_assoc();
        $_SESSION["id_u"]=$row['ID_uporabnika'];
        echo true;
    }else {
        echo false;
    }
    $conn->close();
?>
