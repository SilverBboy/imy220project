<?php
    require_once 'db.php';

    ini_set('display_errors', 1);
    error_reporting(E_ALL); 

    
    $conn = DB::getDbConn();


    if(isset($_POST['login'])){
        $email = $_POST['email'];
        $password = $_POST['password'];


        $sql_query = "SELECT * FROM users WHERE email = '$email' AND password = '$password'";
        $result = mysqli_query($conn, $sql_query);
        $row = mysqli_fetch_array($result);

        session_start();
        
        $_SESSION["email"] = $row["email"];
        $_SESSION["password"] = $row["password"];
        $_SESSION["id"] = $row["id"];


        echo $row['email'];
        if($row['email'] == $email && $row['password'] == $password){
            echo "Login successful";
            header("location: home.php?fromRedirect=true");
            exit();
        } else {
            echo "Login failed";
        }
    }
    
    if(isset($_POST['register'])){


        $email = $_POST['email'];
        $password = $_POST['password'];
        $name = $_POST['name'];
        $surname = $_POST['surname'];
        $dob = $_POST['dob'];

        $sql_query = "INSERT INTO users (name, surname, email, dob, password) VALUES ('$name', '$surname', '$email', '$dob', '$password')";

        if(mysqli_query($conn, $sql_query)){
            session_start();
            echo "New record created successfully";
            $_SESSION["email"] = $email;
            $_SESSION["password"] = $password;
            $_SESSION["id"] = $name;
            header("location: home.php?fromRedirect=true");
            exit();
        } else {
            echo "Error: " . $sql_query . "<br>" . mysqli_error($conn);
            echo "Error: could not create new record";
        }
    }
        
?>

<!DOCTYPE html>
<html>
    <head>
        <title>Process</title>
    </head>
    <body>
        <script src="scripts/setCookie.js"></script>
    </body>
</html>