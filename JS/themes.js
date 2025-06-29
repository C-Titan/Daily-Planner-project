
const theme_toggle = document.getElementById("theme-toggle");
const theme_color_switcher = document.getElementById("theme-color-switcher");

const back_to_top = document.getElementById("back-to-top");

const top_banner = document.getElementById("top-banner");
const close_top_banner = document.getElementById("close-top-banner");



let theme_mode = "-light";
let theme_idx = 0;
const theme_hue_presets = {
    "red"    : 0,
    "green"  : 120, 
    "pink": 255,
    "blue"   : 220,
    "purple" : 250,
    "brown"  : 25,
};



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
    
    console.log(themes[theme_idx] + _theme);
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
        [data-theme="${color}-light"] {
            /* Header/Footer Backgrounds */
                --color-bg       : hsl(${hue}, 100%, 80%);
                --color-bg-accent: hsla(${hue}, 25%, 55%, 0.4);
                --color-header-bg: hsl(${hue}, 100%, 100%);
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

        [data-theme="${color}-dark"] {
            /* Header/Footer Backgrounds */
                --color-bg       : hsl(${hue}, 20%, 20%);
                --color-bg-accent: hsla(${hue}, 25%, 40%, 0.4);
                --color-header-bg: hsl(${hue}, 15%, 10%);
                --color-footer-bg: hsl(60, 5%, 10%);
                
            /* Buttons */
                --color-button-bg    : hsl(${hue}, 80%, 50%);
                --color-button-accent: hsl(${hue + 15}, 90%, 60%);
                --color-button-focus : hsl(${hue - 15}, 40%, 40%);
                
            /* Text */
                --color-heading-text: hsl(0, 0%, 100%);

                --color-normal-text     : hsl(0, 0%, 100%);
                --color-normal-text-dark: hsl(0, 0%, 100%);

                --color-button-text: hsl(0, 0%, 100%);

                --color-links     : hsl(298, 70%, 80%);
                --color-links-grey: hsla(0, 0%, 85%, 1);

            /* Menus */
                --color-dropdown-bg: hsl(${hue}, 20%, 20%);
        }

    `;
}

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

    set_Theme_Icon()

    theme_toggle.checked = (theme_mode === "-dark");
}

function set_Theme_Icon() {
    const theme_icon = document.getElementById("theme-slider");
    if (theme_toggle.checked) {
        theme_icon.classList.replace("fa-sun", "fa-moon");
    } else {
        theme_icon.classList.replace("fa-moon", "fa-sun");
    }
}


function initialize() {
    if ( !JSON.parse(localStorage.getItem("show_top_banner")) ) {
        top_banner.remove(); 
    }

    init_Themes();
    set_Theme(theme_mode);
}



theme_toggle.addEventListener("change", () => {
    theme_mode = theme_toggle.checked ? "-dark" : "-light";
    set_Theme_Icon()

    set_Theme(theme_mode);
});

theme_color_switcher.addEventListener("click", () => {
    theme_idx ++;
    theme_idx %= Object.keys(theme_hue_presets).length;
    set_Theme(theme_mode);
});

back_to_top.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

close_top_banner.addEventListener("click", () => {
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

