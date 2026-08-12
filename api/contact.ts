import nodemailer from "nodemailer";

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const MAIL_TO = process.env.MAIL_TO;

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

function validateContact(body: any) {
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

function validateEnv() {
  if (!GMAIL_USER) return "Missing GMAIL_USER environment variable.";
  if (!GMAIL_APP_PASSWORD) return "Missing GMAIL_APP_PASSWORD environment variable.";
  if (!MAIL_TO) return "Missing MAIL_TO environment variable.";
  return null;
}

function formatHtmlEmail({ name, email, message }: { name: string; email: string; message: string; }) {
  return `
    <div style="font-family: Arial, sans-serif; color: #111;">
      <h2>New contact request from My Portfolio</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <div style="padding: 16px; border: 1px solid #ddd; border-radius: 8px; background: #fafafa;">
        ${message.replace(/\n/g, "<br>")}
      </div>
    </div>
  `;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: "Method not allowed." });
  }

  const envError = validateEnv();
  if (envError) {
    console.error("Contact API env error:", envError);
    return res.status(500).json({ success: false, error: envError });
  }

  const error = validateContact(req.body);
  if (error) {
    return res.status(400).json({ success: false, error });
  }

  const recipients = MAIL_TO.split(",").map((value) => value.trim()).filter(Boolean);
  if (recipients.length === 0) {
    return res.status(500).json({
      success: false,
      error: "Recipient address is not configured.",
    });
  }

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: GMAIL_USER,
      to: recipients,
      subject: `Portfolio contact from ${req.body.name}`,
      replyTo: req.body.email,
      html: formatHtmlEmail(req.body),
    });

    return res.status(200).json({ success: true });
  } catch (sendError: any) {
    console.error("Email send error:", sendError);
    return res.status(500).json({
      success: false,
      error: "Unable to send the email. Please try again later.",
      details: sendError?.message,
    });
  }
}
