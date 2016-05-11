import electron from 'electron';


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
