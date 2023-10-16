const fs = require('fs');
const path = require('path');
const pkg = require('../../../../package.json');
let pathNameFolder = pkg['name'];

const appdataPath = path.join(process.env.APPDATA, `${pathNameFolder}`);

if (!fs.existsSync(appdataPath)) {
  fs.mkdirSync(appdataPath);
}

function getData(filename, callback) {
  const filePath = path.join(appdataPath, `${filename}.json`);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return callback(null, null);
      }
      return callback(err);
    }

    try {
      const jsonData = JSON.parse(data);
      callback(null, jsonData);
    } catch (parseError) {
      callback(parseError);
    }
  });
}

function updateData(filename, newData, callback) {
    const filePath = path.join(appdataPath, `${filename}.json`);
    const jsonData = JSON.stringify(newData);
  
    fs.writeFile(filePath, jsonData, (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null);
      }
    });
  }
function addData(filename, data, callback) {
    const filePath = path.join(appdataPath, `${filename}.json`);
  
    fs.readFile(filePath, 'utf8', (err, fileData) => {
      if (err) {
        const jsonData = JSON.stringify(data);
        fs.writeFile(filePath, jsonData, (writeErr) => {
          if (writeErr) {
            callback(writeErr);
          } else {
            callback(null);
          }
        });
      } else {
        try {
          const existingData = JSON.parse(fileData);
  
          if (existingData && !existingData.hasOwnProperty(data.username)) {
            existingData[data.username] = data.isEnabled;
            const jsonData = JSON.stringify(existingData);
            fs.writeFile(filePath, jsonData, (writeErr) => {
              if (writeErr) {
                callback(writeErr);
              } else {
                callback(null);
              }
            });
          } else {
            callback(null);
          }
        } catch (parseErr) {
          callback(parseErr);
        }
      }
    });
  }
module.exports = {
    getData,
    addData,
    updateData,
  };