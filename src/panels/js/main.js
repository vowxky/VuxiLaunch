const { ipcRenderer } = require("electron");
const vuxiLogger = require('../js/util/logger');
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

let username

class index {
    async main() {
        this.init();
        this.requestData();
        this.requestAxios();
    }

    async requestData(){
        ipcRenderer.send('obtener-datos');
        ipcRenderer.on('datos-obtenidos', (event, data) => {
            username = data.username;
            vuxiLogger.info(`Se hizo exitosamente el transporte de datos: ${username}`);
        });
    }

    async requestAxios(){

    }

    async init() {
        vuxiLogger.initLogWindow('Main');

        document.getElementById('close').addEventListener('click', () => {
            ipcRenderer.send('close-window');
        });

        document.getElementById('minimize').addEventListener('click', () => {
            ipcRenderer.send('minimize-window')
        });
    }



}

const mainIndex = new index();
mainIndex.main();
