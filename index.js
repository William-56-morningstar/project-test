const express = require("express");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const { exec } = require("child_process");
const { v4: uuidv4 } = require("uuid");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Video to MP3 API is running!");
});

app.get("/api/convert/videotomp3", async (req, res) => {
    const { url } = req.query;

    if (!url) return res.status(400).json({ status: false, message: "No video URL provided." });

    const videoFile = `/tmp/${uuidv4()}.mp4`;
    const audioFile = `/tmp/${uuidv4()}.mp3`;

    try {
        const response = await axios.get(url, { responseType: "arraybuffer" });
        fs.writeFileSync(videoFile, Buffer.from(response.data));

        await new Promise((resolve, reject) => {
            exec(`ffmpeg -i ${videoFile} -vn -ab 128k -ar 44100 -y ${audioFile}`, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        const form = new FormData();
        form.append("file", fs.createReadStream(audioFile), "audio.mp3");

        const uploadRes = await axios.post("https://apis.apis-nothing.xyz/upload", form, {
            headers: form.getHeaders()
        });

        fs.unlinkSync(videoFile);
        fs.unlinkSync(audioFile);

        const data = uploadRes.data;

        return res.json({
            status: true,
            creator: "Nothing-Ben",
            result: [
                {
                    type: "audio",
                    quality: "128kbps",
                    download_url: data.download
                }
            ]
        });

    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Error converting video to mp3.",
            error: err.message
        });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));