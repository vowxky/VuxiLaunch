const { ipcRenderer } = require("electron");
const vuxiLogger = require('../js/util/logger');
const dataManager = require('../js/util/vuxiDB');

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

class index {
    async main() {
        this.init();
        this.profileSkin();
    }
    async profileSkin() {
        dataManager.getData('vuxilaunch_data', (err, data) => {
          if (err) {
            console.error('Error al obtener los datos:', err);
          } else {
            if (data && data.username !== undefined) {
              const savedUsername = data.username;
      
              const usernameElement = document.getElementById('username');
      
              usernameElement.innerHTML = savedUsername;
      
              let skinViewer = new skinview3d.SkinViewer({
                canvas: document.getElementById('skinContainer'),
                width: 300,
                height: 400,
                skin: 'https://minotar.net/skin/' + savedUsername,
                zoom: 0.8,
              });
      
              skinViewer.loadCape(null);
      
              skinViewer.zoom = 1;
      
              skinViewer.animation = new skinview3d.WalkingAnimation();
      
              skinViewer.animation.speed = 1;
            } else {
              console.log('El valor de "username" no se encuentra en los datos.');
            }
          }
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
            ipcRenderer.send('change-status-discord', 'Esperando en el Login');
            const newData = { username: '' ,isLogged: false};
            dataManager.updateData('vuxilaunch_data', newData, (err) => {
                if (err) {
                    console.error('Error al actualizar el archivo JSON:', err);
                } else {
                    console.log('Archivo JSON actualizado con éxito.');
                }
            });  
        })
    }

}

const mainIndex = new index();
mainIndex.main();
