
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
        // console.log(JSON.parse(result))
        articles = JSON.parse(result);
        return JSON.parse(result);
    })
}

const displayArticles = (articles) => {
    // console.log()
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
                    //add image here. Must be able to upload on click
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
});