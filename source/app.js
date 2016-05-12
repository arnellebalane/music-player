import electron from 'electron';
import id3 from 'id3js';
import shell from 'shelljs';
import userHome from 'user-home';
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
                    promptAudioRootDirectory((directory) => {
                        mainWindow.webContents
                            .send('audio-root-directory', directory);
                    });
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

ipcMain.on('prompt-audio-root-directory', (e) => {
    promptAudioRootDirectory((directory) =>
        e.sender.send('audio-root-directory', directory));
});

ipcMain.on('search-audio-files', (e, audioRootDirectory) => {
    let command = `find ${audioRootDirectory} -type f -name '*.mp3'`;
    shell.exec(command, { silent: true }, (error, stdout) => {
        audioFiles = stdout.trim().split(/\r?\n/g);
        e.sender.send('audio-files-found');
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
                title: data.title || audioFile.split('/').pop(),
                artist: data.artist || 'Unknown Artist',
                path: audioFile
            };
            resolve(audioFileData);
        });
    });
}


function promptAudioRootDirectory(callback) {
    electron.dialog.showOpenDialog(mainWindow, {
        title: 'Select Audio Root Directory',
        defaultPath: userHome,
        properties: ['openDirectory']
    }, callback);
}
