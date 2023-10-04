<?php

	ini_set('display_errors', 1);
	error_reporting(E_ALL); 
	require_once 'db.php';
	require_once 'api.php';

	$conn = DB::getDbConn();

	$email = $_SESSION["email"];
	$password = $_SESSION["password"];

	$sql_query = "SELECT * FROM users WHERE email = '$email' AND password = '$password'";
	$result = mysqli_query($conn, $sql_query);
	$row = mysqli_fetch_array($result);

<<<<<<< HEAD
	// if(isset($_POST["upload"])){
	// 	echo ($_POST["title"] . $_POST["description"] . $_POST["content"] . $_POST["tags"]);
	// 	$userid = mysqli_real_escape_string($conn, $_SESSION["id"]);
	// 	$title = mysqli_real_escape_string($conn, $_POST["title"]);
	// 	$description = mysqli_real_escape_string($conn, $_POST["description"]);
	// 	$content = mysqli_real_escape_string($conn, $_POST["content"]);
	// 	$tags = mysqli_real_escape_string($conn, $_POST["tags"]);
	// 	postArticle($userid, $title, $description, $content, $tags);
	// }
=======
	if(isset($_POST["upload"])){
		echo ($_POST["title"] . $_POST["description"] . $_POST["content"] . $_POST["tags"]);
		$userid = mysqli_real_escape_string($conn, $_SESSION["id"]);
		$title = mysqli_real_escape_string($conn, $_POST["title"]);
		$description = mysqli_real_escape_string($conn, $_POST["description"]);
		$content = mysqli_real_escape_string($conn, $_POST["content"]);
		$tags = mysqli_real_escape_string($conn, $_POST["tags"]);
		postArticle($userid, $title, $description, $content, $tags);
	}
>>>>>>> 4fcc975cb76eaf39348cff3321ce87cf4180d222

?>


<!DOCTYPE html>
<html>
<head>
	<title>IMY 220 - Assignment 2</title>
	<meta charset="utf-8" />	
	<link href="css/style.css" rel="stylesheet"/>
	<link href="css/style-home.css" rel="stylesheet"/>
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.2/css/bootstrap.min.css" integrity="sha384-Smlep5jCw/wG7hdkwQ/Z5nLIefveQRIY9nfy6xoR1uRYBtpZgI6339F5dgvm/e9B" crossorigin="anonymous">	
	<link href="https://fonts.googleapis.com/css2?family=Jost:wght@200&family=Montserrat:wght@300&family=Poppins:wght@100&display=swap"
		rel="stylesheet">
	<link
		href="https://fonts.googleapis.com/css2?family=Jost:wght@300&family=Montserrat:wght@300&family=Poppins:wght@100&display=swap"
		rel="stylesheet">
	<link href="https://cdn.lineicons.com/4.0/lineicons.css" rel="stylesheet">
</head>
<body>
	<div class="container-fluid profile-bg">
		<div class="row">
			<div class="col-2 no-pad">
				<div class="logo shadow-to-left">
					<img src="media/images/square_logo.png">
				</div>
			</div>
			<div class="col-8 no-shadow abc" id="articles-container">
				<div class="add-btn-container">
					<button id="add-article">Add Article</button>
				</div>

<!-- 				
				<div class="container-fluid">
					<div class="row">

						<div class="col-4 mb-3">
							<div class="card">
								<div class="card-header d-flex">
									<div class="h5">Article Title</div>
								</div>
								<div class="card-body">
									<div class="card-text">Article Summary</div>
								</div>	
							</div>
						</div>
						<div class="col-4 mb-3">
							<div class="card">
								<div class="card-header d-flex">
									<div class="h5">Article Title</div>
								</div>
								<div class="card-body">
									<div class="card-text">Article Summary</div>
								</div>	
							</div>
						</div>
						<div class="col-4 mb-3">
							<div class="card">
								<div class="card-header d-flex">
									<div class="h5">Article Title</div>
								</div>
								<div class="card-body">
									<div class="card-text">Article Summary</div>
								</div>	
							</div>
						</div>

					</div>
				</div> -->

				
			</div>
			<div class="col-2 no-pad shadow-to-right">
				<div class="profile">
					<div>
						<img src="media/images/Default_pfp.svg">
					</div>
				</div>
				<div class="profile-details">
					<h1><?php echo $row['name'] . " " . $row['surname']; ?></h1>
					<p><?php echo $row['email']; ?></p>
					<p><?php echo $row['dob']; ?></p>
				</div>
			</div>
		</div>
	</div>
	<div id="article-form-container">
		<div id="article-form-content">
			<div class="col-sm-6 col-12 mt-sm-0">
				<div class="card">
					<div class="card-header d-flex justify-content-between">
						<div class="h5">New Article</div>
						<div class="h5" id="close-form"><i class="lni lni-close"></i></div>
					</div>
					<div class="card-body">
<<<<<<< HEAD
						<form id="article-form" method="POST" action="home.php" enctype="multipart/form-data">
=======
						<form id="article-form" method="POST" action="home.php">
>>>>>>> 4fcc975cb76eaf39348cff3321ce87cf4180d222
							<div class="row">
								<div class="col-12">
									<div class="form-group mb-3">
										<label class="form-label text-muted" for="article-title">Title</label>
										<input class="col-12" type="text" id="article-title" name="title">
									</div>
								</div>
								<div class="col-12">
									<div class="form-group mb-3">
										<label class="form-label text-muted" for="article-description">Description</label>
										<input class="col-12" type="text" id="article-description" name="description">
									</div>
								</div>
								<div class="col-12">
									<div class="form-group mb-3">
<<<<<<< HEAD
										<label class="form-label text-muted" for="article-image">Upload Image</label>
										<div class="custom-file">
											<input type="file" class="custom-file-input" id="article-image" name="article-image" accept="image/*">
											<label class="custom-file-label" for="article-image" data-browse="Upload">Choose file</label>
										</div>
										<small class="form-text text-muted">Supported formats: JPG, JPEG, PNG, GIF</small>
										<div id="image-preview"></div> 
									</div>
								</div>
								<div class="col-12">
									<div class="form-group mb-3">
=======
>>>>>>> 4fcc975cb76eaf39348cff3321ce87cf4180d222
										<label class="form-label text-muted" for="article-content">Article</label>
										<textarea class="col-12" id="article-content" name="content" rows="3"></textarea>
									</div>
								</div>
								<div class="col-12">
									<div class="form-group mb-3">
										<label class="form-label text-muted" for="article-tags">Tags</label>
										<input class="col-12" type="text" id="article-tags" name="tags">
									</div>
								</div>
							</div>
							<button type="submit" name="upload">Submit</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
	<script src="scripts/home-script.js"></script>
</body>
</html>