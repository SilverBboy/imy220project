<?php
require_once 'db.php';

    session_start();
    $conn = DB::getDbConn();
    

function getSessionUID(){
    return json_encode($_SESSION["id"]);
}

function getUserDetails($userid) {
    $conn = DB::getDbConn();
    $sql_query = "SELECT name, surname, email, dob FROM users WHERE id = $userid";
    $result = mysqli_query($conn, $sql_query);
    $row = mysqli_fetch_array($result);
    return json_encode($row);
}

function getArticles($userid) {
    $conn = DB::getDbConn();
    if ($userid == -1) {
        $sql_query = "SELECT id, userid, title, image, summary, date, hashtags FROM articles";
    } else {
        $sql_query = "SELECT id, userid, title, image, summary, date, hashtags FROM articles WHERE userid = $userid";
    }
    $result = mysqli_query($conn, $sql_query);
    $rows = [];

    while ($row = mysqli_fetch_array($result)) {
        $rows[] = $row;
    }

    return json_encode($rows);
}

function getArticleContent($id, $userid) {
    $conn = DB::getDbConn();
    $query = "
        SELECT articles.content, articles.title, articles.image, articles.summary, articles.date, articles.hashtags, users.name, users.surname
        FROM articles
        JOIN users ON articles.userid = users.id
        WHERE articles.id = $id;
    ";
    $result = mysqli_query($conn, $query);
    $row = mysqli_fetch_array($result, MYSQLI_ASSOC);
    // echo json_encode($row);
    return json_encode($row);
}

function postArticle($userid, $title, $image, $description, $content, $tags){
    $conn = DB::getDbConn();

    $sql_query = "INSERT INTO articles (userid, title, image, summary, content, hashtags) VALUES('$userid', '$title', '$image', '$description', '$content', '$tags')";
    $result = mysqli_query($conn, $sql_query);

    if ($result) {
        // echo "Article inserted successfully!";
    } else {
        // echo "Error: " . mysqli_error($conn);
    }
}

function deleteFromDatabase($id, $dbTable) {
    $conn = DB::getDbConn();

    if ($dbTable == "users") {
        // delete the user, all their articles, and associated reviews
        $query = "DELETE users, articles, reviews FROM users
                  LEFT JOIN articles ON users.id = articles.userid
                  LEFT JOIN reviews ON articles.id = reviews.articleid
                  WHERE users.id = $id";
    } else if ($dbTable == "articles") {
        // delete the article and associated reviews
        $query = "DELETE articles, reviews FROM articles
                  LEFT JOIN reviews ON articles.id = reviews.articleid
                  WHERE articles.id = $id";
    } else {
        // delete the review
        $query = "DELETE FROM $dbTable WHERE article_id = $id";
    }

    $result = mysqli_query($conn, $query);
    if ($result) {
        echo "Records deleted successfully";
    } else {
        echo "Error: " . mysqli_error($conn);
    }
}

function update($id, $dbTable, $data){
    $data = json_decode($data);
    $conn = DB::getDbConn();
    $query = "UPDATE $dbTable SET ";
    $params = array();
    foreach ($data as $key => $value) {
        $key = mysqli_real_escape_string($conn, $key);
        $value = mysqli_real_escape_string($conn, $value);
        $query .= "$key = ?, ";
        $params[] = $value;
    }
    $query = substr($query, 0, -2);
    $query .= " WHERE id = ?";
    $params[] = $id;
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, str_repeat("s", count($params)), ...$params);
    $result = mysqli_stmt_execute($stmt);
    if ($result) {
        echo "Records updated successfully";
    } else {
        echo "Error: " . mysqli_error($conn);
    }
}

if($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET["getID"])){
    echo getSessionUID();
}

if ($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET["userId"]) && isset($_GET["getUserDetails"])) {
    $userId = $_GET["userId"];
    $userDetails = getUserDetails($userId);
    echo $userDetails;
}

if($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET["userId"]) && isset($_GET["getArticles"])){
    $userid = $_GET["userId"];
    $articles = getArticles($userid);
    echo $articles;
}

if($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["upload"])){
    $mediaDir = "./media/gallery/";
    $filename = basename($_FILES["article-image"]["tmp_name"]);
    $uploadFile = $mediaDir . $filename;
    if(move_uploaded_file($_FILES["article-image"]["tmp_name"], $uploadFile)){

        $userid = mysqli_real_escape_string($conn, $_SESSION["id"]);
        $title = mysqli_real_escape_string($conn, $_POST["title"]);
        $description = mysqli_real_escape_string($conn, $_POST["description"]);
        $content = mysqli_real_escape_string($conn, $_POST["content"]);
        $tags = mysqli_real_escape_string($conn, $_POST["tags"]);
        postArticle($userid, $title, $filename, $description, $content, $tags);

    } else {
        echo "Error moving uploaded file to destination.";
    }
}

if ($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET["userId"]) && isset($_GET["articleId"]) && isset($_GET["getArticleContent"])) {
    $articleid = $_GET["articleId"];
    $userid = $_GET["userId"];
    $articleContent = getArticleContent($articleid, $userid);
    echo $articleContent;
}

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["id"]) && isset($_POST["dbTable"]) && isset($_POST["delete"])) {
    $id = $_POST["id"];
    $dbTable = $_POST["dbTable"];
    deleteFromDatabase($id, $dbTable);
}

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["id"]) && isset($_POST["dbTable"]) && isset($_POST["update"])) {
    $id = $_POST["id"];
    $dbTable = $_POST["dbTable"];
    $data = $_POST["data"];
    update($id, $dbTable, $data);
}
    

?>