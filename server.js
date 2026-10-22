const express = require("express");
const cors = require("cors");
const path = require("path");
const { TranslationServiceClient } = require("@google-cloud/translate").v3;

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Serve all your HTML, CSS and JS files
app.use(express.static(__dirname));

// Google Cloud Translation client
const translationClient = new TranslationServiceClient();

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
const PORT = process.env.PORT || 3000;

// --------------------------------------------------
// TRANSLATE TEXT / HTML
// --------------------------------------------------

app.post("/api/translate", async (req, res) => {
    try {
        const {
            text,
            targetLanguage = "hi",
            sourceLanguage = "en"
        } = req.body;

        if (!text) {
            return res.status(400).json({
                success: false,
                error: "Text is required."
            });
        }

        if (!PROJECT_ID) {
            return res.status(500).json({
                success: false,
                error: "GOOGLE_CLOUD_PROJECT_ID is not configured."
            });
        }

        if (sourceLanguage === targetLanguage) {
            return res.json({
                success: true,
                translatedText: text
            });
        }

        const request = {
            parent: `projects/${PROJECT_ID}/locations/global`,

            contents: [text],

            mimeType: "text/html",

            sourceLanguageCode: sourceLanguage,

            targetLanguageCode: targetLanguage
        };

        const [response] =
            await translationClient.translateText(request);

        const translatedText =
            response.translations?.[0]?.translatedText || text;

        res.json({
            success: true,
            translatedText: translatedText
        });

    } catch (error) {

        console.error("Translation error:", error);

        res.status(500).json({
            success: false,
            error: error.message || "Translation failed."
        });
    }
});

// --------------------------------------------------
// TEST ROUTE
// --------------------------------------------------

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Legal Navigation System server is running."
    });
});

// --------------------------------------------------
// START SERVER
// --------------------------------------------------

app.listen(PORT, () => {
    console.log("----------------------------------------");
    console.log("Legal Navigation System");
    console.log("----------------------------------------");
    console.log(`Server running at http://localhost:${PORT}`);
    console.log("----------------------------------------");
});