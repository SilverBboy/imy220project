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

const getUserDetails = (userId) => {
    return $.ajax({
        url: `api.php?userId=${userId}&getUserDetails`,
        method: "GET",
    }).then((details) => {
        return JSON.parse(details);
    })
}

const getArticles = (userId) => {
    return $.ajax({
        url: `api.php?userId=${userId}&getArticles`,
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

const progressMarker = (progress) => {
    return marker;
}

const createArticleCards = (articles) => {
    $("#articles-container").empty();
    $("#articles-container").append(toolbar(button("Add Article", "add-article")));

    const articlesContainer = $("<div>").addClass("container-fluid")

    $("#articles-container").append(articlesContainer);

    const row = $("<div>").addClass("row");

    articlesContainer.append(row)

    articles.forEach(article => {
        let articleImage = "./media/gallery/" + article.image
        const card = $("<div>").attr("article-id", article.id).addClass("col-xl-4 col-lg-6 mb-3")
        getUserDetails(article.userid).then((userDetails) => {
            let uDets = `${userDetails.name[0]}. ${userDetails.surname}`;
            let pubDate = normaliseDate(article.date);

            card.append(
                $("<div>").addClass("card article-card").append(
                    $("<div>").addClass("card-header").append(
                        $("<div>").addClass("h5").html(article.title),
                        $("<div>").addClass("font-weight-bold small").html((uDets)),
                        $("<div>").addClass("font-weight-bold small").html((pubDate))
                    ),
                    $("<div>").addClass("card-body d-flex flex-column").append(
                        $("<img>").addClass("card-img-top").attr("src", articleImage).attr("alt", "Article Image"),
                        $("<p>").addClass("card-text").html(article.summary)
                    )
                )
            );
        })

        row.append(card);
        card.on("click", () => {
            readArticle(article.id, article.userid);
        })
    });

}

const displayArticles = (userId) => {
    getArticles(userId).then((data) => {
        createArticleCards(data);
    })
}

const readArticle = (articleId, userId) => {
    $("#articles-container").empty();
    let buttons = [
        
        [
            button("backArrow_i", "back", "button", "back").on("click", () => {
                manageState("home", -1, userId, true);
            })
        ],
        [
            button("Add Article", "add-article")
        ],
        [
            button("edit_i", "edit", "button", "edit"),
            () =>{
                if (getCookie("userId") == userId) {
                    return button("delete_i", "delete", "button", "delete").on("click", () => {
                        deleteData(articleId, "articles");
                    })
                }
            }
        ]
    ];
    $("#articles-container").append(toolbar(buttons, true));
    
    
    const articleContainer = $("<div>").attr("author-id", userId).addClass("container-fluid");
    $("#articles-container").append(articleContainer);
    let author = articleContainer.attr("author-id");
    let fullArticle = getArticleContent(articleId, userId);
    getUserDetails(author).then((userDetails) => {
        
        fullArticle.then((articleContent) => {
            const row = $("<div>").addClass("row");
            articleContainer.append(row);

            const card = $("<div>").addClass("col-12 mb-8").append(
                $("<h1>").addClass("mb-4").html(articleContent.title),
                $("<div>").html(articleContent.summary),
                $("<div>").addClass("d-flex justify-between").append(
                    $("<p>").addClass("text-muted").html(`By ${userDetails.name} ${userDetails.surname}`),
                    $("<p>").addClass("text-muted").html(`On ${normaliseDate(articleContent.date)}`),
                ),
                $("<div>").addClass("reading-article-image").append(
                    $("<img>").addClass("card-img-top").attr("src", "./media/gallery/" + articleContent.image).attr("alt", "Article Image"),
                ),
                $("<div>").addClass("article-content").append(
                    $("<p>").html(articleContent.content)
                )
            );

            row.append(card);
        })
    })

    getUID().then((userId) => {
        manageState("reading", articleId, userId, false);
    });

    showProgress(10);
        

}

const getArticleContent = (articleId, userId) => {
    let articleContent = []
    return $.ajax({
        url: `api.php?userId=${userId}&articleId=${articleId}&getArticleContent`,
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
            if (onload) displayArticles(-1);
            break;
        default:
            break;
    }
}

const createArticleForm = () => {

    let form  = $("#article-form");
    let submitBtn = button("Submit", "submit-article-btn", "submit", "upload");
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

    $("#form-header").append(
        button("close_i", "close-form", "button", "close").on("click", () => {
            toggleArticleForm();
        })
    )


    $("#article-image").on("change", function() {
        const fullPath = $(this).val();
        const fileName = fullPath ? fullPath.replace(/^.*[\\\/]/, '') : "Choose file";
        $(".custom-file-label").html(fileName);

        showImagePreview(this);
    });


    $("#article-form").on("dragover", function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).addClass("dragover");
    });

    $("#article-form").on("dragleave", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).removeClass("dragover");
    });

    $("#article-form").on("drop", function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).removeClass("dragover");

        const files = e.originalEvent.dataTransfer.files;
        $("#article-image")[0].files = files;

        showImagePreview($("#article-image")[0]);
    });

    form.append(
        submitBtn.on("click", () => {
            form.submit();
        }
    ));
}

$(() => {
    articleId = getCookie("articleId");
    userid = getCookie("userId") || getUID();

    console.log("Article ID:", articleId);
    console.log("User ID:", userid);

    if ((!document.referrer === window.location.href) || window.location.href.includes('fromRedirect=true')) {
        getUID().then((userId) => {
            console.log("No referrer")
            manageState("home", -1, userId, true);
        });
    } else if (articleId != -1) {
        getUID().then((userId) => {
            manageState("reading", articleId, userId, true);
        });
    } else {
        getUID().then((userId) => {
            manageState("home", -1, userId, true);
        });
    }

    createArticleForm();

    window.onpopstate = (event) => {
        let state = event.state;
        console.log("State changed:", event.state);
        if (state == null) {
            window.history.back();
        } else if (getCookie("articleId") == -1) {
            window.history.back();
        } else {
            manageState("home", state.page, state.userid, true);
        }
    };
});