const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");

require("dotenv").config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

router.post("/therapy", async (req, res) => {
    if (!process.env.GROQ_API_KEY) {
        return res.status(500).json({
            success: false,
            error: "GROQ_API_KEY not set in .env file",
        });
    }

    console.log("requested from groq");
    try {
        const { prompt } = req.body;
        const response = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a mental therapist bot, you are supposed to help people feel better and help them with their psychological issues. ",
                },
                { role: "user", content: `${prompt}` },
                {
                    role: "assistant",
                    content:
                        "Provide insights based on the given prompt to help them positively channel their emotions.",
                },
            ],
            max_tokens: 300,
            temperature: 0,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
            stop: ["\n"],
        });

        return res.status(200).json({
            success: true,
            data: response.choices[0].message.content,
        });
    } catch (error) {
        console.error("Groq API error:", error);
        return res.status(400).json({
            success: false,
            error: error.message ? error.message : "There was an issue on the server",
        });
    }
});

module.exports = router;
