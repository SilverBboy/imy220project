<?php
require_once 'db.php';

    session_start();
    $conn = DB::getDbConn();
    

function getSessionUID(){
    return json_encode($_SESSION["id"]);
}

function getArticles($userid) {
    $conn = DB::getDbConn();
    $sql_query = "SELECT * FROM articles WHERE userid = $userid";
    $result = mysqli_query($conn, $sql_query);
    $rows = [];

    while ($row = mysqli_fetch_array($result)) {
        $rows[] = $row;
    }

    return json_encode($rows);
}


function postArticle($userid, $title, $description, $content, $tags){
    $conn = DB::getDbConn();

    $sql_query = "INSERT INTO articles (userid, title, image, summary, hashtags) VALUES('$userid', '$title', '', '$description', '$tags')";
    $result = mysqli_query($conn, $sql_query);

    if ($result) {
        echo "Article inserted successfully!";
    } else {
        echo "Error: " . mysqli_error($conn);
    }
}

if($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET["getID"])){
    echo getSessionUID();
}

if($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET["id"])){
    $userid = $_GET["id"];
    $articles = getArticles($userid);
    echo $articles;
}

if($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["upload"])){

    $mediaDir = "media/gallery/";
    echo $_FILES["article-image"]["name"];
    $uploadFile = mediaDir . basename($_FILES["article-image"]["name"]);

    // echo ($_POST["title"] . $_POST["description"] . $_POST["content"] . $_POST["tags"]);
    $userid = mysqli_real_escape_string($conn, $_SESSION["id"]);
    $title = mysqli_real_escape_string($conn, $_POST["title"]);
    $description = mysqli_real_escape_string($conn, $_POST["description"]);
    $content = mysqli_real_escape_string($conn, $_POST["content"]);
    $tags = mysqli_real_escape_string($conn, $_POST["tags"]);
    postArticle($userid, $title, $description, $content, $tags);
}


?>