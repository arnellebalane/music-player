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





let audioFiles = [];
let playingIndex = 0;

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
        getAudioFileMetadata(audioFiles[playingIndex])
            .then((data) => e.sender.send('play', data));
    } else {
        e.sender.send('error', 'No audio files loaded yet.');
    }
});

electron.ipcMain.on('previous', (e) => {
    if (audioFiles.length) {
        playingIndex = playingIndex === 0
            ? audioFiles.length - 1 : playingIndex - 1;
        getAudioFileMetadata(audioFiles[playingIndex])
            .then((data) => e.sender.send('play', data));
    } else {
        e.sender.send('error', 'No audio files loaded yet.');
    }
});

electron.ipcMain.on('next', (e) => {
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
                title: data.title,
                artist: data.artist,
                path: audioFile
            };
            resolve(audioFileData);
        });
    });
}
