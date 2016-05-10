import electron from 'electron';


const app = electron.app;
const BrowserWindow = electron.BrowserWindow;


electron.crashReporter.start();


var mainWindow = null;


app.on('ready', () => {
    mainWindow = new BrowserWindow({ width: 800, height: 600 });
    mainWindow.loadURL(`file://${__dirname}/index.html`);

    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});


app.on('windows-all-closed', () => {
    app.quit();
});
