import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests. Please wait and try again later."
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

function validateContact(body) {
  if (!body || typeof body !== "object") {
    return "Request body must be JSON.";
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const message = String(body.message || "").trim();

  if (!name) return "Name is required.";
  if (!email) return "Email is required.";
  if (!message) return "Message is required.";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Email is invalid.";

  return null;
}

function formatHtmlEmail({ name, email, message }) {
  return `
    <div style="font-family: Arial, sans-serif; color: #111;">
      <h2>New Contact Request from My Portfolio Page</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <div style="padding: 16px; border: 1px solid #ddd; border-radius: 8px; background: #fafafa;">
        ${message.replace(/\n/g, "<br>")}
      </div>
      <hr />
      <p style="font-size: 0.9rem; color: #555;">
        Sent from the portfolio contact form.
      </p>
    </div>
  `;
}

app.post("/api/contact", limiter, async (req, res) => {
  const error = validateContact(req.body);
  if (error) {
    return res.status(400).json({ success: false, error });
  }

  const { name, email, message } = req.body;
  const recipients = (process.env.MAIL_TO || "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);

  if (recipients.length === 0) {
    return res.status(500).json({
      success: false,
      error: "Recipient list is not configured."
    });
  }

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: recipients,
      subject: `My Portfolio Page: New message from ${name}`,
      replyTo: email,
      html: formatHtmlEmail({ name, email, message })
    });

    return res.status(200).json({
      success: true,
      message: "Contact message sent successfully."
    });
  } catch (sendError) {
    console.error("Email send error:", sendError);
    return res.status(500).json({
      success: false,
      error: "Unable to send email. Please try again later."
    });
  }
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: "Endpoint not found." });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Express email backend listening on http://localhost:${port}`);
});
