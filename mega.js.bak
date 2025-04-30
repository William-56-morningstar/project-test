const mega = require("megajs");

const auth = {
    email: 'kentmurley8@gmail.com',   //use your real vaild mega account email
    password: 'Stagerate@002',  ////use your real vaild mega account password
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
};

const upload = (data, name) => {
    return new Promise((resolve, reject) => {
        try {
            if (!auth.email || !auth.password || !auth.userAgent) {
                throw new Error("Missing required authentication fields");
            }

            console.log("Using auth:", auth); // Debugging line

            const storage = new mega.Storage(auth, () => {
                data.pipe(storage.upload({ name: name, allowUploadBuffering: true }));
                storage.on("add", (file) => {
                    file.link((err, url) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        storage.close();
                        resolve(url);
                    });
                });
            });
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = { upload };
