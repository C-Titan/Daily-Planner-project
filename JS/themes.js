
const theme_toggle = document.getElementById("theme-toggle");
const theme_color_switcher = document.getElementById("theme-color-switcher");

const back_to_top = document.getElementById("back-to-top");

const top_banner = document.getElementById("top-banner");
const close_top_banner = document.getElementById("close-top-banner");

const hover_menu = document.getElementById("show-hover-menu-toggle");
const navigation = document.getElementById("navigation");


const header_layout        = document.getElementById("header-layout");
const footer_layout        = document.getElementById("footer-layout");
const header_layout_mobile = document.getElementById("header-layout-mobile");
const footer_layout_mobile = document.getElementById("footer-layout-mobile");
let mobile_layout = false;


let theme_idx = 0;
let theme_mode = "-dark";
const theme_hue_presets = {
    "red"    : 0,
    "blue"   : 220,
    "pink"   : 255,
    "brown"  : 25,
    "green"  : 120, 
    "purple" : 250
};

let show_menu = false;


//#region THEME FUNCTIONS
function set_Theme(_theme) {
    const themes = Object.keys(theme_hue_presets);
    
    if (!themes.length) {
        console.error("No themes available in theme_hue_presets.");
        return;
    }
    if (theme_idx < 0 || theme_idx >= themes.length) {
        console.error("Invalid theme index:", theme_idx);
        return;
    }

    localStorage.setItem( "page_theme", JSON.stringify({ 
        "_theme_idx" : theme_idx, 
        "_theme_mode" : _theme }) );
    
    document.documentElement.setAttribute("data-theme", themes[theme_idx] + _theme);
    
    // console.log(themes[theme_idx] + _theme);
}

function inject_Themes() {
    let css = "";

    let hues = Object.keys(theme_hue_presets);
    for (let i = 0; i < hues.length; i++) {
        css += generate_Theme_CSS(hues[i], theme_hue_presets[hues[i]])
    }
    
    const style_tag = document.getElementById("theme-css-sheet");
    style_tag.textContent = css
}

function generate_Theme_CSS(color, hue) {
    return `
        [data-theme="${color}-dark"] {
            /* Header/Footer Backgrounds */
                --color-bg       : hsl(${hue}, 40%, 20%);
                --color-bg-accent: hsla(${hue}, 25%, 40%, 0.4);
                --color-header-bg: hsl(${hue}, 15%, 10%);
                --color-footer-bg: hsl(60, 5%, 10%);
                
            /* Buttons */
                --color-button-bg    : hsl(${hue}, 80%, 50%);
                --color-button-accent: hsl(${hue + 15}, 90%, 60%);
                --color-button-focus : hsl(${hue - 15}, 40%, 40%);
                
            /* Text */
                --color-heading-text: hsl(0, 0.00%, 100.00%);

                --color-normal-text     : hsl(0, 0%, 100%);
                --color-normal-text-dark: hsl(0, 0%, 100%);

                --color-button-text: hsl(0, 0%, 100%);

                --color-links     : hsl(298, 70%, 80%);
                --color-links-grey: hsla(0, 0%, 85%, 1);

            /* Menus */
                --color-dropdown-bg: hsl(${hue}, 20%, 20%);
        }

        [data-theme="${color}-light"] {
            /* Header/Footer Backgrounds */
                --color-bg       : hsl(${hue}, 100%, 80%);
                --color-bg-accent: hsla(${hue}, 25%, 55%, 0.4);
                --color-header-bg: hsl(${hue}, 50%, 95%);
                --color-footer-bg: hsl(60, 5%, 10%);
                
            /* Buttons */
                --color-button-bg    : hsl(${hue}, 80%, 50%);
                --color-button-accent: hsl(${hue + 15}, 90%, 60%);
                --color-button-focus : hsl(${hue - 15}, 40%, 40%);
                
            /* Text */
                --color-heading-text: hsl(0, 0%, 0%);
                
                --color-normal-text     : hsl(0, 0%, 0%);
                --color-normal-text-dark: hsl(0, 0%, 100%);
                
                --color-button-text       : hsl(0, 0%, 100%);
                --color-button-text-accent: hsl(0, 0%, 100%);
                
                --color-links     : hsl(300, 70%, 80%);
                --color-links-grey: hsla(0, 0%, 85%, 1);

            /* Menus */
                --color-dropdown-bg: hsl(${hue}, 100%, 95%);
        }
    `;
}

function set_Theme_Icon() {
    const theme_icon = document.getElementById("theme-slider");
    if (theme_toggle?.checked) {
        theme_icon?.classList.replace("fa-sun", "fa-moon");
    } else {
        theme_icon?.classList.replace("fa-moon", "fa-sun");
    }
}
//#endregion


//#region INITIALIZATION
// function init_Layout() {
//     // Switch to Desktop
//     if (!mobile_layout) {
//         header_layout.disabled        = false;
//         footer_layout.disabled        = false;
//         header_layout_mobile.disabled = true;
//         footer_layout_mobile.disabled = true;
//     }
//     // Switch to Mobile
//     if (mobile_layout) {
//         header_layout.disabled        = true;
//         footer_layout.disabled        = true;
//         header_layout_mobile.disabled = false;
//         footer_layout_mobile.disabled = false;
//     }
// }

function init_Themes() {
    inject_Themes();

    const stored_theme = JSON.parse(localStorage.getItem("page_theme"));

    if (stored_theme) {
        if (stored_theme._theme_idx !== undefined) {
            theme_idx = stored_theme._theme_idx;
        }
        if (stored_theme._theme_mode !== undefined) {
            theme_mode = stored_theme._theme_mode;
        }
    }

    if (theme_toggle) {
        theme_toggle.checked = (theme_mode === "-dark");
    }

    set_Theme_Icon();
    set_Theme(theme_mode);
}

function initialize() {
    let _show_banner = !JSON.parse(localStorage.getItem("show_top_banner"));
    if (_show_banner) {
        top_banner?.remove(); 
    }

    init_Themes();
    // init_Layout();
}
//#endregion


hover_menu?.addEventListener("change", () => {
    show_menu = !show_menu;
    if (show_menu) {
        // navigation.classList.add("hidden");
        // navigation.disabled = true;
    } else {
        // navigation.classList.remove("hidden");
        // navigation.disabled = false;
    }
});

theme_toggle?.addEventListener("change", () => {
    theme_mode = theme_toggle.checked ? "-dark" : "-light";
    set_Theme_Icon()
    set_Theme(theme_mode);
});

theme_color_switcher?.addEventListener("click", () => {
    theme_idx ++;
    theme_idx %= Object.keys(theme_hue_presets).length;
    set_Theme(theme_mode);
});

back_to_top?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

close_top_banner?.addEventListener("click", () => {
    localStorage.setItem("show_top_banner", JSON.stringify(false) );
    
    top_banner.remove(); 
});



window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
        back_to_top.classList.add("visible");
    } else {
        back_to_top.classList.remove("visible");
    }
});



document.addEventListener("DOMContentLoaded", initialize());

