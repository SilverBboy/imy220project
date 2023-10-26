//MUST USE COOKIE TO STORE USER ID, ARTICLE ID
import setCookie from './setCookie.js';

let articles = [];
let userid = 0;
let articleId = 0;

const toggleArticleForm = () => {
    const articleForm = $("#article-form-container");
    console.log("display changed")
    if (articleForm) {
        articleForm.toggle("fast", "linear", () => {
            return articleForm.css('display') === 'none' ? 'flex' : 'none';
        });

    }
}

const normaliseDate = (date) => {
    let pubDate = new Date(date)
    return pubDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).replace(/\//g, '-');;
}

const getUID = () => {
    return $.ajax({
        url: "api.php?getID",
        method: "GET",
    }).then((id) => {
        userid = JSON.parse(id);
        return userid;
    })
}

const getArticles = (id) => {
    return $.ajax({
        url: `api.php?id=${id}`,
        type: 'GET',
    }).then((result) => {
        articles = JSON.parse(result);
        return JSON.parse(result);
    })
}

const showImagePreview = (input) => {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            $("#image-preview").html(`<img src="${e.target.result}" alt="Image Preview" class="img-thumbnail">`);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

const createArticleCards = (articles, id) => {
    $("#articles-container").empty();
    $("#articles-container").append(toolbar());

    const articlesContainer = $("<div>").addClass("container-fluid")

    $("#articles-container").append(articlesContainer);

    const row = $("<div>").addClass("row");

    articlesContainer.append(row)

    articles.forEach(article => {
        let articleImage = "./media/gallery/" + article.image
        let pubDate = "On " + normaliseDate(article.date);

        const card = $("<div>").attr("article-id", article.id).addClass("col-xl-4 col-lg-6 mb-3")
        card.append(
            $("<div>").addClass("card article-card").append(
                $("<div>").addClass("card-header").append(
                    $("<div>").addClass("h5").html(article.title),
                    $("<div>").addClass("font-weight-bold small").html((pubDate))
                ),
                $("<div>").addClass("card-body d-flex flex-column").append(
                    $("<img>").addClass("card-img-top").attr("src", articleImage).attr("alt", "Article Image"),
                    $("<p>").addClass("card-text").html(article.summary)
                )
            )
        );

        row.append(card);
        card.on("click", () => {
            readArticle(article.id, id);
        })
    });

}

const displayArticles = (userId) => {
    getArticles(userId).then((data) => {
        createArticleCards(data, userId);
    })
}

const readArticle = (articleId, id) => {
    $("#articles-container").empty();
    $("#articles-container").append(toolbar());

    const articleContainer = $("<div>").addClass("container-fluid")
    $("#articles-container").append(articleContainer);
    console.log(articleId)
    let fullArticle = getArticleContent(articleId);
    // getArticleContent(articleId).then((articleContent) => {
    //     console.log(articleContent)
    // })  

    fullArticle.then((articleContent) => {
        const row = $("<div>").addClass("row");
        articleContainer.append(row);

        const card = $("<div>").addClass("col-12 mb-8").append(
            $("<h1>").addClass("mb-4").html(articleContent.title),
            $("<p>").addClass("text-muted").html(`On ${normaliseDate(articleContent.date)}`),
            $("<img>").addClass("card-img-top").attr("src", "./media/gallery/" + articleContent.image).attr("alt", "Article Image"),
            $("<div>").addClass("article-content").append(
                $("<p>").html(articleContent.content)
            )
        );

        row.append(card);
    })
    console.log
    manageState("reading", articleId, id, false);

}

const getArticleContent = (articleId, id) => {
    let articleContent = []
    return $.ajax({
        url: `api.php?userId=${id}&articleId=${articleId}`,
        type: 'GET',
    }).then((result) => {
        articleContent = JSON.parse(result);
        return articleContent;
    })
}

const getCookie = (key) => {
    let cookie = document.cookie.split("; ").find(row => row.startsWith(key));
    if (cookie) {
        return cookie.split("=")[1];
    } else {
        return null;
    }
}


const manageState = (setTo, articleId = -1, userId, onload = true) => {
    console.log("State changed:", setTo, articleId, userId);
    switch (setTo) {
        case "reading":
            setCookie("articleId", articleId);
            setCookie("userId", userId);
            window.history.pushState({ screen: "reading", page: articleId, userid: userId }, "Reading", `?article=${articleId}`);
            if (onload) readArticle(articleId, userId);
            break;
        case "home":
            setCookie("articleId", -1);
            setCookie("userId", userId);
            window.history.pushState({ screen: "home", page: -1, userid: userId }, "Home", `?home`);
            if (onload) displayArticles(userId);
            break;
        default:
            break;
    }
}

$(() => {
    articleId = getCookie("articleId");
    userid = getCookie("userId");

    console.log("Article ID:", articleId);
    console.log("User ID:", userid);

    if ((!document.referrer === window.location.href) || window.location.href.includes('fromRedirect=true')) {
        console.log("Case 1")
        getUID().then((id) => {
            console.log("No referrer")
            manageState("home", -1, id);
        });
    } else if (articleId != -1) {
        console.log("Case 2")
        getUID().then((id) => {
            manageState("reading", articleId, id);
        });
    } else {
        console.log("Case 3")
        getUID().then((id) => {
            manageState("home", -1, id);
        });
    }

    $("#article-content").on("input", function () {
        console.log(this.style.height)
        if (this.style.height < "400px") {
            this.style.height = "auto";
            this.style.height = this.scrollHeight + 10 + "px";
        }
    });

    $(document).on("click", "#add-article", () => {
        toggleArticleForm();
    })

    $("#close-form").on("click", () => {
        toggleArticleForm();
    })

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


    window.onpopstate = (event) => {
        let state = event.state;
        console.log("State changed:", event.state);
        if (state == null) {
            window.history.back();
        } else if (getCookie("articleId") == -1) {
            window.history.back();
        } else {
            manageState("home", state.page, state.userid);
        }
    };
});