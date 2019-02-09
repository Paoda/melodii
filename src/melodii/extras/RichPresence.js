const settings = window.require('electron-settings');

class RichPresence {
    constructor(clientID, secret) {
        this.clientID = "";
        this.secret = "";

        if (settings.has("richPresence.clientID")) {
            this.clientID = settings.get("richPresence.clientID");
            this.secret = settings.get("richPresence.secret");
        } else if (clientID && secret) {
            settings.set("richPresence", {
                clientID: clientID,
                secret: secret
            });

            this.clientID = clientID;
            this.secret = secret;
        }
    }
}