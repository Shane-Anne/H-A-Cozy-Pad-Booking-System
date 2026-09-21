const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;
const DIFY_API_URL =
    process.env.DIFY_API_URL || "https://api.dify.ai/v1";
const DIFY_API_KEY = process.env.DIFY_API_KEY;

// Middleware
app.use(
    cors({
        origin: "http://localhost:5173",
    })
);

app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "H&A Cozy Pad chatbot server is running.",
    });
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
    try {
        const {
            message,
            user,
            conversation_id,
        } = req.body;

        // Validate message
        if (!message || !message.trim()) {
            return res.status(400).json({
                error: "Message is required.",
            });
        }

        // Check API key
        if (!DIFY_API_KEY) {
            console.error("DIFY_API_KEY is missing from .env");

            return res.status(500).json({
                error: "Dify API key is not configured on the server.",
            });
        }

        const difyResponse = await fetch(
            `${DIFY_API_URL}/chat-messages`,
            {
                method: "POST",

                headers: {
                    "Authorization": `Bearer ${DIFY_API_KEY}`,
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    inputs: {},
                    query: message.trim(),
                    response_mode: "blocking",
                    user: user || "guest-user",
                    conversation_id: conversation_id || "",
                }),
            }
        );

        const data = await difyResponse.json();

        console.log("Dify status:", difyResponse.status);
        console.log("Dify response:", data);

        if (!difyResponse.ok) {
            return res.status(difyResponse.status).json({
                error:
                    data.message ||
                    data.code ||
                    "Dify API request failed.",
            });
        }

        return res.json({
            answer: data.answer || "Dify returned an empty response.",
            conversation_id: data.conversation_id || "",
            message_id: data.message_id || "",
        });
    } catch (error) {
        console.error("Chatbot server error:", error);

        return res.status(500).json({
            error: "Unable to connect to Dify.",
            details: error.message,
        });
    }
});

app.listen(PORT, () => {
    console.log(
        `H&A Cozy Pad chatbot server running on http://localhost:${PORT}`
    );
});