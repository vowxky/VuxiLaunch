const { ipcRenderer } = require("electron");
const { Mojang, Launch } = require('minecraft-java-core');
const launch = new Launch();
const vuxiLogger = require('../js/util/logger');
const dataManager = require('../js/util/vuxiDB');

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

class index {
    async main() {
        this.init();
        this.profileSkin();
        this.launch();
    }
    async profileSkin() {
        dataManager.getData('vuxilaunch_profile', (err, data) => {
          if (err) {
            console.error('Error al obtener los datos:', err);
          } else {
            if (data && data.name !== undefined) {
              const savedUsername = data.name;
      
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
        const body = document.body;
        const profileContent = document.getElementById('profile-content');

        vuxiLogger.initLogWindow('Main');

        document.getElementById('close').addEventListener('click', () => {
            ipcRenderer.send('close-window');
        });

        document.getElementById('minimize').addEventListener('click', () => {
            ipcRenderer.send('minimize-window')
        });

        document.getElementById('profile').addEventListener('click', () => {
            body.style.backdropFilter = "blur(5px)";
            homeContent.style.display = "none";
            profileContent.style.display = "flex";
        });

        document.getElementById('close-profile').addEventListener('click', () => {
            profileContent.style.display = "none";
            homeContent.style.display = "block";
            body.style.backdropFilter = "blur(0px)";
        })

        document.getElementById('log-profile').addEventListener('click', () => {
            ipcRenderer.send('re-open-login');
            ipcRenderer.send('change-status-discord', 'Esperando en el Login');
            const updateDataProfile = {
              access_token :'',
              client_token :'',
              uuid: '',
              name: '',
              refresh_token: '', 
              user_properties:'',
              meta:''
            };
            dataManager.updateData('vuxilaunch_profile', updateDataProfile, (err) => {
                if (err) {
                    console.error('Error al actualizar el archivo JSON:', err);
                } else {
                    console.log('Archivo JSON actualizado con éxito.');
                }
            });  

          const updateData = {
              isLogged : false
          };

          
          dataManager.updateData('vuxilaunch_data', updateData, (err) => {
              if (err) {
                  vuxiLogger.error('Error al actualizar el archivo JSON:', err);
              } else {
                  vuxiLogger.info('Archivo JSON actualizado con éxito.');
          }}); 

        })
    }

    async launch(){
    document.getElementById('launch').addEventListener('click' , async () => {
      let opt = {
        authenticator: await Mojang.login('Luuxis'),
        timeout: 10000,
        path: './.Minecraft test',
        version: '1.19.3',
        detached: false,
        downloadFileMultiple: 100,

        loader: {
            type: 'forge',
            build: 'latest',
            enable: true
        },

        verify: true,
        ignored: ['loader', 'options.txt'],
        args: [],

        javaPath: null,
        java: true,

        screen: {
            width: null,
            height: null,
            fullscreen: null,
        },

        memory: {
            min: '2G',
            max: '4G'
        }
    }

    await launch.Launch(opt);

    launch.on('extract', extract => {
      vuxiLogger.info(extract);
    });

    launch.on('progress', (progress, size, element) => {
      vuxiLogger.info(`Downloading ${element} ${Math.round((progress / size) * 100)}%`);
    });

    launch.on('check', (progress, size, element) => {
      vuxiLogger.info(`Checking ${element} ${Math.round((progress / size) * 100)}%`);
    });

    launch.on('estimated', (time) => {
        let hours = Math.floor(time / 3600);
        let minutes = Math.floor((time - hours * 3600) / 60);
        let seconds = Math.floor(time - hours * 3600 - minutes * 60);
        vuxiLogger.info(`${hours}h ${minutes}m ${seconds}s`);
    })

    launch.on('speed', (speed) => {
      vuxiLogger.info(`${(speed / 1067008).toFixed(2)} Mb/s`)
    })

    launch.on('patch', patch => {
      vuxiLogger.info(patch);
    });

    launch.on('data', (e) => {
      vuxiLogger.info(e);
    })

    launch.on('close', code => {
      vuxiLogger.info(code);
    });

    launch.on('error', err => {
      vuxiLogger.error(err);
    });
    })
    }
}

const mainIndex = new index();
mainIndex.main();
