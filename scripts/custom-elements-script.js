// ICON ELEMENTS
const icons = {
    delete_i: $("<i>").addClass("lni lni-remove-file"),
    edit_i: $("<i>").addClass("lni lni-pencil"),
    backArrow_i: $("<i>").addClass("lni lni-chevron-left"),
    close_i: $("<i>").addClass("lni lni-close"),
    filter_i: $("<i>").addClass("lni lni-funnel"),
}



let articleContainer = $("#articles-container");


const toolbar = (buttons, progress = false) => {
    const toolbar = $("<div>").addClass("toolbar");
    const wrapper = $("<div>").addClass("buttons-wrapper");

    if (Array.isArray(buttons)) {
        buttons.forEach((btnArray, index) => {
            const flexDiv = $("<div>").addClass("toolbar-flex");
            if (index === 0) {
                flexDiv.addClass("j-start");
            } else if (index === buttons.length - 1) {
                flexDiv.addClass("j-end");
            } else {
                flexDiv.addClass("j-center");
            }
            btnArray.forEach(btn => {
                flexDiv.append(btn);
            });
            wrapper.append(flexDiv);
        });
    } else {
        wrapper.append(buttons);
    }
    toolbar.append(wrapper);
    if (progress) {
        toolbar.append(progressMarker())
    }
    return toolbar;
}

const progressMarker = () => {
    const markerContainer = $("<div>").addClass("progress-container");
    const marker = $("<div>").addClass("progress-marker");
    markerContainer.append(marker).append($("<div>").addClass("marker-tip"));

    return markerContainer;
}

const button = (text, id, type = {}, name = {}) => {
    const btn = $("<div>").addClass("custom-button").attr("id", id);
    if (icons.hasOwnProperty(text)) {
        btn.append(icons[text]).attr({ type: type }).attr({ name: name }).addClass("icon-button");
    } else {
        btn.append(
            $("<div>").addClass("triangle-left"),
            $("<button>").attr({ type: type }).attr({ name: name }).html(text),
            $("<div>").addClass("triangle-right"),
        )
    }
    return btn;

}

const input = (text, id, type = {}, name = {}, value = "", edit) => {
    const capitalizedText = text.charAt(0).toUpperCase() + text.slice(1);
    const input = $("<div>").addClass("custom-input").attr("id", id);
    input.append(
        $("<label>").attr("for", id).addClass("text-muted").html((capitalizedText)),
        (() => {
            if (type !== "textarea") {
                return(
                $("<div>").addClass("input-container").append(
                    $("<i>").addClass("lni lni-chevron-left custom-input-i"),
                    $(`<${type}>`).attr({ type: type }).attr({ id: id }).attr({ name: name }).attr({edit: edit}).prop("value", value),
                    $("<i>").addClass("lni lni-chevron-right custom-input-i"),
                ))
            } else {
                return(
                $("<div>").addClass("text-area-container").append(
                    $("<div>").addClass("angles-container").append(
                        $("<i>").addClass("lni lni-chevron-left custom-input-i"),
                        $("<i>").addClass("lni lni-chevron-up custom-input-i"),
                    ),
                    $(`<${type}>`).attr({ type: type }).attr({ id: id }).attr({ name: name }).attr({ edit: edit }).prop("value", value),
                    $("<div>").addClass("angles-container").append(
                        $("<i>").addClass("lni lni-chevron-down custom-input-i"),
                        $("<i>").addClass("lni lni-chevron-right custom-input-i"),
                    ),
                ))
            }
        })(),
    )
    return input;
}

const deleteData = (id, dbTable) => {

    $.ajax({
        url: "api.php",
        method: "POST",
        data: {
            id: id,
            dbTable: dbTable,
            delete: true
        }
    }).then((result) => {
        console.log(result);
        goBack();
        location.reload();
    });
}

const goBack = (variable) => {
    if (typeof variable == "function" && typeof variable != "undefined") {
        variable();
    } else {
        window.history.back();
    }
}


const editData = () => {
    let articleId = $("[article-id]").attr("article-id");
    let editableElements = $("[editable][name]");
    let parent = $(editableElements.parent()[0]);
    editableElements.each((index, element) => {
        let elementContent = $(element).html();
        let elementName = $(element).attr("name").split(":")[0];
        let elementTag = $(element).attr("name").split(":")[1];
        $(element).replaceWith(
            input(elementName, elementName, elementTag, elementName, elementContent, true)
        )
    })
    const inputsArray = [...$("input")];

    $(document).on("click", "input", function () {
        console.log("click");

        let inputEl = $(this)[0];
        if (inputsArray.includes(inputEl)) {
            $(inputEl).siblings().addClass("focus-custom-input");
            $(inputEl).on("blur", function () {
                $(inputEl).siblings().removeClass("focus-custom-input");
            });
        }
        else {
            $(inputEl).parent().removeClass("focus-custom-input");
        }
    });
    let buttonWrapper = $("<div>").addClass("d-flex justify-content-center").append(
        button("Save", "save-button", "submit", "save").on("click", () => {
            let inputs = $("[edit][type], [edit][textarea]");
            let data = {};
            inputs.each((index, element) => {
                data[$(element).attr("name")] = $(element).val();
                console.log(element);
            })
            console.log(data);
            $.ajax({
                url: "api.php",
                method: "POST",
                data: {
                    id: articleId,
                    dbTable: "articles",
                    data: JSON.stringify(data),
                    update: true
                }
            }).then((result) => {
                console.log(result);
                goBack();
                location.reload();
            });
        }),
    )
    parent.append(buttonWrapper );
}

const showProgress = () => {
    let articleContainerHeight = articleContainer[0].clientHeight;
    const articleContainerTopPadding = parseInt(articleContainer.css('padding-top'));
    let currentProgress = 0;
    let progress = 0;
    let completed = false;

    articleContainer.on("scroll", () => {
        let articleHeight = $("[author-id]").height();
        let progressBar = articleHeight - articleContainerHeight + articleContainerTopPadding;
        currentProgress = articleContainer.scrollTop();

        progress = Math.abs(currentProgress / progressBar * 100);
        $(".progress-marker").css("width", `${progress}%`);

        if (progress >= 90 && !completed) {
            completed = true;
            // getUID().then((userId) => {
            //     manageState("completed", articleId, userId, false);
            // });
            // call function to add read articles to user's profile
        }
    });
}