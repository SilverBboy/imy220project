const bg_2 = document.getElementById("body_bg_side");
const welcome_text = document.getElementById("welcome_text");
const logo = document.getElementById("website_name").getElementsByTagName("h1")[0];
const scrollPos = document.getElementsByClassName("scroll_snap");
const switcher = document.getElementsByClassName("switcher")[0];
const inputsArray = [... document.getElementsByTagName("input")];

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


    let inputEl = document.activeElement;
    if (inputsArray.includes(document.activeElement)){
        inputEl.parentElement.classList.add("focused");
        inputEl.addEventListener("blur", () => {
            inputEl.parentElement.classList.remove("focused");
        })
            
    }
    $(document.activeElement).parent().addClass(" focused");

    
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

