// ICON ELEMENTS
const icons = {
    delete_i: $("<i>").addClass("lni lni-remove-file"),
    edit_i: $("<i>").addClass("lni lni-pencil"),
    backArrow_i: $("<i>").addClass("lni lni-chevron-left"),
    close_i: $("<i>").addClass("lni lni-close"),
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
        // location.reload();
    });
}

const goBack = (variable) => {
    if (typeof variable == "function" && typeof variable != "undefined") {
        variable();
    } else {
        window.history.back();
    }
}

const editData = (id, dbTable) => {

}

const showProgress = () => {
    let articleContainerHeight = articleContainer[0].clientHeight;
    const articleContainerTopPadding = parseInt(articleContainer.css('padding-top'));
    let currentProgress = 0;
    let progress = 0;
    
    
    articleContainer.on("scroll", () => {
        let articleHeight = $("[author-id]").height();
        let progressBar = articleHeight - articleContainerHeight + articleContainerTopPadding;
        currentProgress = articleContainer.scrollTop();
        
        progress = Math.abs(currentProgress / progressBar * 100);
        console.log(progress);
        $(".progress-marker").css("width", `${progress}%`);
    });
}
