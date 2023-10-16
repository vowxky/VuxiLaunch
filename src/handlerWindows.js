const {app, BrowserWindow} = require('electron');
const pkg = require('../package.json');
const path = require('path');
const fs = require('fs');
const { ipcMain } = require('electron')
const DiscordRPC = require('discord-rpc');
const clientId = '1161452615943589929';
let appdataPath = '';
const RPC = new DiscordRPC.Client({ transport: 'ipc'});
let discordTime = Date.now();
DiscordRPC.register(clientId);

let secondaryWindow = null;
let mainWindow = null;

let pathFolderName = pkg['path'];


let sharedData = {
  username: '',
};

function createFolder() {
  if (!fs.existsSync(appdataPath)) {
    fs.mkdirSync(appdataPath);
  }
}

async function setActivity() {
    if (!RPC) return;
    RPC.setActivity({
        details: `Esperando en el Login`,
        startTimestamp: discordTime,
        largeImageKey: 'vuxilaunch',
        largeImageText: `vuxilaunch`,
        instance: false,
        buttons: [
            {
                label: `Discord`,
                url: `https://discord.gg/XjPVtkGu`,
            },
            {
                label: `Source Code`,
                url: `https://github.com/vowxky/VuxiLaunch`,
            }
        ]
    });
 };

RPC.on('ready', async () => {
    setActivity();
 
    setInterval(() => {
        setActivity();
    }, 86400 * 1000);
 });
 RPC.login({ clientId }).catch(err => console.error(err));
 

 function createWindow(options) {
  const windowauth = {
    titleBarStyle: 'hidden',
    icon : "./src/assets/icon/icon.png",
    resizable: false,
    maximizable: false,
    width: 450,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    ...options,
  };

  if (options.secondary) {
      secondaryWindow = new BrowserWindow(windowauth);
      secondaryWindow.loadFile(options.url);

      secondaryWindow.on('closed', () => {
        secondaryWindow = null;
      });
  } else {
      mainWindow = new BrowserWindow(windowauth);
      mainWindow.loadFile(options.url);

      mainWindow.on('closed', () => {
        mainWindow = null;
      });
  }
}
app.whenReady().then(() => {

    appdataPath = path.join(process.env.APPDATA, `.${pathFolderName}`);

    createFolder(appdataPath);
    
    createWindow({ url: './src/panels/html/login.html' });
  
    app.on('activate', () => {
      if (mainWindow === null) {
        createWindow({ url: './src/panels/html/login.html' });
      }
    });
  });
  
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  ipcMain.on('guardar-datos', (event, data) => {
    sharedData = data;
  });

  ipcMain.on('obtener-datos', (event) => {
    event.sender.send('datos-obtenidos', sharedData);
  });
  
  ipcMain.on('set-progress-bar', (event, percentage) => {
    secondaryWindow.setProgressBar(percentage)
  });

  ipcMain.on('set-progress-bar-reset', (evt, arg) => {
    secondaryWindow.setProgressBar(0);
  });

  ipcMain.on('re-open', (evt, arg) => {
    mainWindow.close();
    createWindow({
      url: './src/panels/html/main.html', 
      secondary: true,
      width: 1200, 
      height: 700, 
    });
  });

  ipcMain.on('re-open-login', (evt, arg) => {
    secondaryWindow.close();
    createWindow({
      url: './src/panels/html/login.html', 
      secondary: false,
      width: 450, 
      height: 600, 
    });
  });

  ipcMain.on('hide-window', (evt, arg) => {
    secondaryWindow.hide();
  });

  ipcMain.on('show-window', (evt, arg) => {
    secondaryWindow.show();
  });

  ipcMain.on('close-window', (evt, arg) => {
    secondaryWindow.close();
  });

  ipcMain.on('minimize-window', (evt, arg) => {
    secondaryWindow.minimize();
  });

  

  ipcMain.on('change-status-discord', (event, DiscordStatus)=> {
    RPC.setActivity({
    details: `${DiscordStatus}`,
    startTimestamp: discordTime,
    largeImageKey: 'vuxilaunch',
    largeImageText: `vuxilaunch`,
    instance: false,
    buttons: [
        {
            label: `Discord`,
            url: `https://discord.gg/XjPVtkGu`,
        },
        {
            label: `Source Code`,
            url: `https://github.com/vowxky/VuxiLaunch`,
        }
      ]
    });
  })