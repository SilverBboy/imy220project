const setCookie = (key, value) => {
    let cookieExpires = new Date();
    cookieExpires.setMonth(cookieExpires.getMonth() + 1); // Expires in 1 month
    document.cookie = `${key}=${value}; path=/`;
    document.cookie = `expires=${cookieExpires.toUTCString()}; path=/`;
}

export default setCookie;