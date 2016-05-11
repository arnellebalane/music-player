import fs from 'fs';
import path from 'path';
import electron from 'electron';
import id3 from 'id3js';
import 'babel-polyfill';


const app = electron.app;
const BrowserWindow = electron.BrowserWindow;


electron.crashReporter.start({
    projectName: 'Music Player',
    companyName: 'Arnelle Balane',
    submitURL: 'https://arnellebalane.com/crashreport'
});


let mainWindow = null;


app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 600,
        resizable: false,
        titleBarStyle: 'hidden'
    });
    mainWindow.loadURL(`file://${__dirname}/index.html`);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});


app.on('windows-all-closed', () => {
    app.quit();
});



/** Setup custom application menu. **/

const Menu = electron.Menu;

let menuTemplate = [
    {
        label: 'Settings',
        submenu: [
            {
                label: 'Change Root Audio Directory',
                accelerator: 'CmdOrCtrl+Shift+D',
                click: (item, focusedWindow) => {
                    console.log(item, focusedWindow);
                }
            },
            {
                label: 'Change Player Color',
                accelerator: 'CmdOrCtrl+Shift+C',
                click: (item, focusedWindow) => {
                    console.log(item, focusedWindow);
                }
            }
        ]
    }
];

if (process.platform === 'darwin') {
    let appName = electron.app.getName();
    menuTemplate.unshift({
        label: appName,
        submenu: [
            {
                label: `About ${appName}`,
                role: 'about'
            },
            {
                label: 'Quit',
                accelerator: 'Command+Q',
                click: () => app.quit()
            }
        ]
    });
}

app.on('ready', () => {
    let menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
});



/** Section that handles interaction with the renderer process. **/

const ipcMain = electron.ipcMain;

let audioFiles = [];
let playingIndex = 0;

ipcMain.on('search-audio-files', (e, searchDirectories) => {
    audioFiles = new Set();
    Promise.all(searchDirectories.map((searchDirectory) => {
        return new Promise((resolve, reject) => {
            fs.readdir(searchDirectory, (error, files) => {
                files.filter((file) => /\.mp3$/.test(file))
                    .forEach((file) =>
                        audioFiles.add(path.join(searchDirectory, file)));
                resolve(searchDirectory);
            });
        });
    })).then(function() {
        audioFiles = Array.from(audioFiles);
        e.sender.send('search-audio-files');
    });
});

ipcMain.on('play', (e, index) => {
    if (audioFiles.length) {
        playingIndex = index;
        getAudioFileMetadata(audioFiles[playingIndex])
            .then((data) => e.sender.send('play', data));
    } else {
        e.sender.send('error', 'No audio files loaded yet.');
    }
});

ipcMain.on('previous', (e) => {
    if (audioFiles.length) {
        playingIndex = playingIndex === 0
            ? audioFiles.length - 1 : playingIndex - 1;
        getAudioFileMetadata(audioFiles[playingIndex])
            .then((data) => e.sender.send('play', data));
    } else {
        e.sender.send('error', 'No audio files loaded yet.');
    }
});

ipcMain.on('next', (e) => {
    if (audioFiles.length) {
        playingIndex = playingIndex === audioFiles.length - 1
            ? 0 : playingIndex + 1;
        getAudioFileMetadata(audioFiles[playingIndex])
            .then((data) => e.sender.send('play', data));
    } else {
        e.sender.send('error', 'No audio files loaded yet.');
    }
});



function getAudioFileMetadata(audioFile) {
    return new Promise((resolve, reject) => {
        id3({ file: audioFile, type: id3.OPEN_LOCAL }, (error, data) => {
            let audioFileData = {
                title: data.title || audioFile.split(path.sep).pop(),
                artist: data.artist || 'Unknown Artist',
                path: audioFile
            };
            resolve(audioFileData);
        });
    });
}
