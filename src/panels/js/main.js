const { ipcRenderer } = require("electron");
const vuxiLogger = require('../js/util/logger');
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

let username


class index {
    async main() {
        this.init();
        this.profileSkin();
    }
    async profileSkin(){
        ipcRenderer.send('obtener-datos');
        ipcRenderer.on('datos-obtenidos', (event, data) => {
        username = data.username;

        const usernameElement = document.getElementById('username');

        usernameElement.innerHTML = username;
        
        let skinViewer = new skinview3d.SkinViewer({
            canvas: document.getElementById("skinContainer"),
            width: 300,
            height: 400,
            skin: "https://minotar.net/skin/" + username,
            zoom: 0.8,
        });
        
        skinViewer.loadCape(null);    
        
        skinViewer.zoom = 1;
                
        skinViewer.animation = new skinview3d.WalkingAnimation();
        
        skinViewer.animation.speed = 1;    
        });
    }

    async init() {
        const homeContent = document.getElementById('home-content');
        const profileContent = document.getElementById('profile-content');

        vuxiLogger.initLogWindow('Main');

        document.getElementById('close').addEventListener('click', () => {
            ipcRenderer.send('close-window');
        });

        document.getElementById('minimize').addEventListener('click', () => {
            ipcRenderer.send('minimize-window')
        });

        document.getElementById('profile').addEventListener('click', () => {
            homeContent.style.display = "none";
            profileContent.style.display = "flex";
        });

        document.getElementById('close-profile').addEventListener('click', () => {
            profileContent.style.display = "none";
            homeContent.style.display = "block";
        })

        document.getElementById('log-profile').addEventListener('click', () => {
            ipcRenderer.send('re-open-login');
        })
    }

}

const mainIndex = new index();
mainIndex.main();
