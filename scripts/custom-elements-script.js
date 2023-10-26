const toolbar = () => {
    const toolbar = $("<div>").addClass("toolbar");
    toolbar.append(button("Add Article", "add-article"));
    return toolbar;
}

const button = (text, id, type={}, name={}) => {
    console.log("Added button")
    const btn = $("<div>").addClass("custom-button").attr("id", id);
    btn.append(
        $("<div>").addClass("triangle-left"),
        $("<button>").attr({ type: type }).attr({ name: name }).html(text),
        $("<div>").addClass("triangle-right"),
    )
    return btn;

}