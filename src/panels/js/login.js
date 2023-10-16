const { ipcRenderer } = require("electron");
const vuxiLogger = require('../js/util/logger');
const { Mojang } = require('minecraft-java-core');
const dataManager = require('../js/util/vuxiDB');
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

class Login{
    async main(){
        this.login();
        this.bdInit();
    }

    async bdInit(){
        const newDataProfile = {
            access_token :'',
            client_token :'',
            uuid: '',
            name: '',
            refresh_token: '', 
            user_properties:'',
            meta:''
        };

        dataManager.addData('vuxilaunch_profile', newDataProfile, (err) => {
          if (err) {
            console.error('Error al agregar datos:', err);
          } else {
            console.log('Datos agregados con exito.');
          }
        });
    }

    async login(){
        const input = document.getElementById('nameInput');
        vuxiLogger.initLogWindow('Login');
        input.addEventListener('input', (event) => {
            let inputValue = event.target.value;
    
            inputValue = inputValue.replace(/[^\w\s-]/g, '');
            
            const maxLength = 16;
            if (inputValue.length > maxLength) {
                inputValue = inputValue.substring(0, maxLength);
            }
            
            input.value = inputValue;
            
            if (inputValue.length < 3 || inputValue.length > maxLength) {
                input.style.border = "2px solid red";
            } else {
                input.style.border = "1px solid #070707";
            }
        });
        
        document.getElementById('login').addEventListener('click', async () => {
            const inputValue = input.value;
            const sanitizedValue = inputValue.replace(/\s/g, '');

            if (sanitizedValue.length >= 3 && sanitizedValue.length <= 16) {
                ipcRenderer.send('re-open');
                ipcRenderer.send('change-status-discord', 'Esperando en el Menu');

                let account_connect = await Mojang.login(inputValue , '')

                
                const updateDataProfile = {
                    access_token: account_connect.access_token,
                    client_token: account_connect.client_token,
                    uuid: account_connect.uuid,
                    name: account_connect.name,
                    refresh_token: account_connect.refresh_token,
                    user_properties: account_connect.user_properties,
                    meta: account_connect.meta
                };

                dataManager.updateData('vuxilaunch_profile', updateDataProfile, (err) => {
                if (err) {
                    console.error('Error al actualizar el archivo JSON:', err);
                } else {
                    console.log('Archivo JSON actualizado con éxito.');
                }}); 

                const updateData = {
                    isLogged : true
                };

                dataManager.updateData('vuxilaunch_data', updateData, (err) => {
                    if (err) {
                        console.error('Error al actualizar el archivo JSON:', err);
                    } else {
                        console.log('Archivo JSON actualizado con éxito.');
                }}); 
                           
                } else {
                input.value = '';
                input.disabled = true;
                errorMessage.style.display = "block";
                errorMessage.innerText = "El nombre de usuario debe tener entre 3 y 16 caracteres.";
                setTimeout(() => {
                    input.disabled = false;
                    errorMessage.style.display = "none";
                }, 2000);    
            }
        });

        document.getElementById('microsoft').addEventListener('click' , () => {
            ipcRenderer.invoke('Microsoft-window').then(account_connect => {
                const updateDataProfile = {
                    access_token: account_connect.access_token,
                    client_token: account_connect.client_token,
                    uuid: account_connect.uuid,
                    name: account_connect.name,
                    refresh_token: account_connect.refresh_token,
                    user_properties: account_connect.user_properties,
                    meta: {
                        type: account_connect.meta.type,
                        online: account_connect.meta.online
                    }
                };
                dataManager.updateData('vuxilaunch_profile', updateDataProfile, (err) => {
                    if (err) {
                        console.error('Error al actualizar el archivo JSON:', err);
                    } else {
                        console.log('Archivo JSON actualizado con éxito.');
                }}); 

                const updateData = {
                    isLogged : true
                };

                
                dataManager.updateData('vuxilaunch_data', updateData, (err) => {
                    if (err) {
                        console.error('Error al actualizar el archivo JSON:', err);
                    } else {
                        console.log('Archivo JSON actualizado con éxito.');
                }}); 

                ipcRenderer.send('re-open');
                ipcRenderer.send('change-status-discord', 'Esperando en el Menu');
            })
        })
        
    }
}

const loginMain = new Login();
loginMain.main();