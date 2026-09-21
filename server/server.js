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

        if (!message || !message.trim()) {
            return res.status(400).json({
                error: "Message is required.",
            });
        }

        if (!DIFY_API_KEY) {
            return res.status(500).json({
                error: "DIFY_API_KEY is not configured.",
            });
        }

        const response = await fetch(
            `${DIFY_API_URL}/chat-messages`,
            {
                method: "POST",

                headers: {
                    "Authorization": `Bearer ${DIFY_API_KEY}`,
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    inputs: {},

                    query: message,

                    user: user || "guest-user",

                    conversation_id:
                        conversation_id || "",

                    response_mode: "blocking",
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Dify error:", data);

            return res.status(response.status).json({
                error:
                    data.message ||
                    data.error ||
                    "Dify API request failed.",
            });
        }

        res.json({
            answer: data.answer,
            conversation_id: data.conversation_id,
        });
    } catch (error) {
        console.error("Server error:", error);

        res.status(500).json({
            error: "Unable to connect to Dify.",
        });
    }
});

app.listen(PORT, () => {
    console.log(
        `H&A Cozy Pad chatbot server running on http://localhost:${PORT}`
    );
});