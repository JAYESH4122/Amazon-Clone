document.addEventListener("DOMContentLoaded", function() {
    const app = document.getElementById("app");
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
        loadMobileVersion();
    } else {
        loadDesktopVersion();
    }

    window.addEventListener("resize", function() {
        const currentIsMobile = window.matchMedia("(max-width: 768px)").matches;
        
        if (currentIsMobile !== isMobile) {
            location.reload();
        }
    });
});

function loadMobileVersion() {
    fetch("mobile/mobile.html")
        .then(response => response.text())
        .then(html => {
            document.getElementById("app").innerHTML = html;
            
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "mobile/mobile.css";
            document.head.appendChild(link);
        });
}


function loadDesktopVersion() {
    fetch("desktop-new/desku.html")
        .then(response => response.text())
        .then(html => {
            document.getElementById("app").innerHTML = html;
            
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "desktop/desktop.css";
            document.head.appendChild(link);
        });
}

