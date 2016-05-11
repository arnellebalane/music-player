import fs from 'fs';
import path from 'path';
import electron from 'electron';
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
        resizable: false
    });
    mainWindow.loadURL(`file://${__dirname}/index.html`);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});


app.on('windows-all-closed', () => {
    app.quit();
});





var audioFiles = [];
var playingIndex = 0;

electron.ipcMain.on('search-audio-files', (e, searchDirectories) => {
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

electron.ipcMain.on('play', (e, index) => {
    if (audioFiles.length) {
        playingIndex = index;
        e.sender.send('play', audioFiles[playingIndex]);
    } else {
        e.sender.send('error', 'No audio files loaded yet.');
    }
});

electron.ipcMain.on('previous', (e) => {
    if (audioFiles.length) {
        playingIndex = playingIndex === 0
            ? audioFiles.length - 1 : playingIndex - 1;
        e.sender.send('play', audioFiles[playingIndex]);
    } else {
        e.sender.send('error', 'No audio files loaded yet.');
    }
});

electron.ipcMain.on('next', (e) => {
    if (audioFiles.length) {
        playingIndex = playingIndex === audioFiles.length - 1
            ? 0 : playingIndex + 1;
        e.sender.send('play', audioFiles[playingIndex]);
    } else {
        e.sender.send('error', 'No audio files loaded yet.');
    }
});
