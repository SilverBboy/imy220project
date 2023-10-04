
let articles = [];
let userid = 0;

const toggleArticleForm = () => {
    const articleForm = $("#article-form-container");
    console.log("display changed")
        if(articleForm){
            articleForm.toggle("fast", "linear",() => {
                return articleForm.css('display') === 'none' ? 'flex' : 'none';
            });

        }
}


const getUID = () => {
    return $.ajax({
        url:"api.php?getID",
        method:"GET",
    }).then((id) => {
        userid = id;
        return id;
    })
}

const getArticles = (id) => {
    return $.ajax({
        url: `api.php?id=${id}`,
        type: 'GET',
    }).then((result) => {
<<<<<<< HEAD
=======
        // console.log(JSON.parse(result))
>>>>>>> 4fcc975cb76eaf39348cff3321ce87cf4180d222
        articles = JSON.parse(result);
        return JSON.parse(result);
    })
}

<<<<<<< HEAD
const showImagePreview = (input) => {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            $("#image-preview").html(`<img src="${e.target.result}" alt="Image Preview" class="img-thumbnail">`);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

const displayArticles = (articles) => {
=======
const displayArticles = (articles) => {
    // console.log()
>>>>>>> 4fcc975cb76eaf39348cff3321ce87cf4180d222
    const articlesContainer = $("<div>").addClass("container-fluid")
    
    $("#articles-container").append(articlesContainer);
    
    const row = $("<div>").addClass("row");
    
    articlesContainer.append(row)
    
    articles.forEach(article => {
        // console.log(article);
        let pubDate = new Date(article.date)
        pubDate = pubDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/\//g, '-');;
        console.log(pubDate)

        const card = $("<div>").addClass("col-xl-4 col-lg-6 mb-3")
        card.append(
            $("<div>").addClass("card").append(
                $("<div>").addClass("card-header d-flex justify-content-between").append(
                    $("<div>").addClass("h5").html(article.title),
                    $("<div>").addClass("").html((pubDate))
                ),
                $("<div>").addClass("card-body d-flex flex-column").append(
<<<<<<< HEAD
                    $("<img>").addClass("card-img-top").attr("src", article.imageUrl).attr("alt", "Article Image"),
=======
                    //add image here. Must be able to upload on click
>>>>>>> 4fcc975cb76eaf39348cff3321ce87cf4180d222
                    $("<p>").addClass("card-text").html(article.summary)
                    //add a divider line here
                    //add hashtags here
                )
            )
        );

        row.append(card);
    });

    // $("#articles-container").append(
    //     articlesContainer
    // )
}

<<<<<<< HEAD

=======
>>>>>>> 4fcc975cb76eaf39348cff3321ce87cf4180d222
$(() => {

    $("#article-content").on("input", function () {
        console.log(this.style.height)
        if (this.style.height < "400px"){
            this.style.height = "auto";
            this.style.height = this.scrollHeight + 10 + "px";
        }
    });

    
    $("#add-article").on("click", () => {
        toggleArticleForm();
    })
    
    $("#close-form").on("click", () => {
        toggleArticleForm();
    })
    getUID().then((id) => {
        getArticles(id).then((data) => {
            displayArticles(data);
        })
    })
<<<<<<< HEAD


    $("#article-image").change(function () {
        const fullPath = $(this).val();
        const fileName = fullPath ? fullPath.replace(/^.*[\\\/]/, '') : "Choose file";
        $(".custom-file-label").html(fileName);

        showImagePreview(this);
    });


    $("#article-form").on("dragover", (e) => {
        e.preventDefault();
        e.stopPropagation();
        $(this).addClass("dragover");
    });

    $("#article-form").on("dragleave", (e) => {
        e.preventDefault();
        e.stopPropagation();
        $(this).removeClass("dragover");
    });

    $("#article-form").on("drop", (e) => {
        e.preventDefault();
        e.stopPropagation();
        $(this).removeClass("dragover");

        const files = e.originalEvent.dataTransfer.files;
        $("#article-image")[0].files = files;

        showImagePreview($("#article-image")[0]);
    });

=======
>>>>>>> 4fcc975cb76eaf39348cff3321ce87cf4180d222
});