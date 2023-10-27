const bg_2 = document.getElementById("body_bg_side");
const welcome_text = document.getElementById("welcome_text");
const logo = document.getElementById("website_name").getElementsByTagName("h1")[0];
const scrollPos = document.getElementsByClassName("scroll_snap");
const switcher = document.getElementsByClassName("switcher")[0];

const scrollElementsControl = () => {
    let scroll = window.scrollY;
    let winHeight = window.innerHeight;
    let winWidth = window.innerWidth;

    if (scroll > winHeight){
        bg_2.style.left =  "0%";
    } else {
        bg_2.style.left =  `${scroll / winHeight * 100 - 100}%`;
    }

    if (scroll < winHeight){
        welcome_text.style.opacity = "0%";
    } else {
        setTimeout(() => {
            welcome_text.style.opacity = "100%";
        }, 500);
    }

    logo.style.left = `${scroll / winHeight * 17 * ((1920 / winWidth))}%`;
    logo.style.top = `${47 - scroll / winHeight * 47}%`;
}   

window.addEventListener("scroll", () => {
    scrollElementsControl();
})  

scrollElementsControl();


window.addEventListener("click", () => {

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
})

switcher.addEventListener("click", () => {
    let forms = document.getElementsByClassName("forms-container")[0].children;
    if (forms[0].style.display == "none"){
        forms[0].style.display = "flex";
        forms[1].style.display = "none";
        switcher.children[0].children[1].innerHTML = "Login";
    } else {
        forms[0].style.display = "none";
        forms[1].style.display = "flex";
        switcher.children[0].children[1].innerHTML = "Register";
    }
});

$(() => {
    $("#login-form").append(button("Login", "login-button", "submit", "login"));
    $("#register-form").append(button("Register", "register-button", "submit", "register"));
})