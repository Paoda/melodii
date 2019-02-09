const electron = window.require('electron');

export default class Buttons {
    
    /**
     * Quits Melodii
     * @static
     */
    static quit() {
        electron.remote.app.quit();
    }

    /**
     * Minimized Melodii
     * @static
     */
    static minimize() {
        electron.remote.BrowserWindow.getFocusedWindow().minimize();
    }
}