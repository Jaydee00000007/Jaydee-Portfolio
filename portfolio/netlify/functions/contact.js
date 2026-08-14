import nodemailer from "nodemailer";

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const MAIL_TO = process.env.MAIL_TO;

function validateEnv() {
  if (!GMAIL_USER) return "Missing GMAIL_USER environment variable.";
  if (!GMAIL_APP_PASSWORD) return "Missing GMAIL_APP_PASSWORD environment variable.";
  if (!MAIL_TO) return "Missing MAIL_TO environment variable.";
  return null;
}

function validateContact(body) {
  if (!body || typeof body !== "object") return "Request body must be JSON.";

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

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { Allow: "POST" },
      body: JSON.stringify({ success: false, error: "Method not allowed." }),
    };
  }

  const envError = validateEnv();
  if (envError) {
    console.error("Contact API env error:", envError);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: envError }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: "Invalid JSON body." }),
    };
  }

  const validationError = validateContact(body);
  if (validationError) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: validationError }),
    };
  }

  const recipients = MAIL_TO.split(",").map((value) => value.trim()).filter(Boolean);
  if (recipients.length === 0) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "Recipient address is not configured." }),
    };
  }

  try {
    await transporter.sendMail({
      from: GMAIL_USER,
      to: recipients,
      subject: `Portfolio contact from ${body.name}`,
      replyTo: body.email,
      html: formatHtmlEmail(body),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (sendError) {
    console.error("Email send error:", sendError);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "Unable to send the email. Please try again later.", details: sendError?.message }),
    };
  }
};

