const { app, BrowserWindow, shell, protocol, net } = require('electron');
const { default: installExtension, REACT_DEVELOPER_TOOLS, /*REDUX_DEVTOOLS*/ } = require("electron-devtools-installer")
const path = require('path');
// require('@electron/remote/main').initialize();
const isDev = process.env.NODE_ENV === 'development';
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Photo Editor",
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
      webSecurity: false
    },
    icon: `${__dirname}/icon.png`
  });
  win.setIcon(`${__dirname}/icon.png`)
  if (isDev) win.loadURL('http://localhost:3000');
  else win.loadFile(path.join(__dirname, 'build', 'index.html'), { hash: '' });
  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url); // Opens URL in the default browser.
    return { action: 'deny' }; // Prevents the URL from opening in the Electron app.
  });
  protocol.handle('audio', async (request) => {
    const path = decodeURIComponent(request.url.slice('audio://'.length));
    return net.fetch(`file://${path}`);
  });
  // require('@electron/remote/main').enable(win.webContents);
}

app.whenReady().then(() => {
  if (isDev) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((ext) => console.log(`Added Extension: ${ext.name}`))
      .catch((err) => console.log('An error occurred: ', err));
    // installExtension(REDUX_DEVTOOLS)
    //   .then((ext) => console.log(`Added Extension: ${ext.name}`))
    //   .catch((err) => console.log('An error occurred: ', err));
  }
  createWindow();
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });