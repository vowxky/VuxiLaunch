const { ipcRenderer } = require("electron");
const vuxiLogger = require('../js/util/logger');
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

class Login{
    async main(){
        this.login();
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
        

        document.getElementById('login').addEventListener('click', () => {
            const inputValue = input.value;
            const sanitizedValue = inputValue.replace(/\s/g, '');

            if (sanitizedValue.length >= 3 && sanitizedValue.length <= 16) {
                ipcRenderer.send('re-open');
                ipcRenderer.send('change-status-discord', 'Esperando en el Menu');
                ipcRenderer.send('guardar-datos', {
                    username: inputValue
                });            
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
    }
}

const loginMain = new Login();
loginMain.main();