import nodemailer from "nodemailer";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
};

const json = (statusCode: number, body: Record<string, unknown>) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  },
  body: JSON.stringify(body),
});

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const validateContact = (body: ContactPayload | null) => {
  if (!body || typeof body !== "object") return "Request body must be JSON.";

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name) return "Name is required.";
  if (!email) return "Email is required.";
  if (!message) return "Message is required.";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Email is invalid.";
  }

  if (name.length > 100) return "Name is too long.";
  if (email.length > 254) return "Email is too long.";
  if (message.length > 5000) return "Message is too long.";

  return null;
};

export const handler = async (event: {
  httpMethod?: string;
  body?: string | null;
}) => {
  if (event.httpMethod === "OPTIONS") {
    return json(204, {});
  }

  if (event.httpMethod !== "POST") {
    return json(405, {
      success: false,
      error: "Method not allowed.",
    });
  }

  let body: ContactPayload;

  try {
    body = JSON.parse(event.body || "{}") as ContactPayload;
  } catch {
    return json(400, {
      success: false,
      error: "Request body must be valid JSON.",
    });
  }

  const validationError = validateContact(body);
  if (validationError) {
    return json(400, {
      success: false,
      error: validationError,
    });
  }

  const name = String(body.name).trim();
  const email = String(body.email).trim();
  const message = String(body.message).trim();

  const gmailUser = process.env.GMAIL_USER?.trim();
  const gmailPassword = process.env.GMAIL_APP_PASSWORD?.trim();
  const recipients = (process.env.MAIL_TO || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (!gmailUser || !gmailPassword || recipients.length === 0) {
    console.error("Contact form email environment variables are not configured.");
    return json(500, {
      success: false,
      error: "Email service is not configured yet.",
    });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPassword,
    },
  });

  try {
    await transporter.sendMail({
      from: gmailUser,
      to: recipients,
      subject: `Portfolio contact from ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family:Arial,sans-serif;color:#111;line-height:1.6">
          <h2>New Portfolio Contact</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Message:</strong></p>
          <div style="padding:16px;border:1px solid #ddd;border-radius:8px;background:#fafafa;white-space:pre-wrap">
            ${escapeHtml(message)}
          </div>
        </div>
      `,
    });

    return json(200, {
      success: true,
      message: "Contact message sent successfully.",
    });
  } catch (error) {
    console.error("Portfolio contact email error:", error);
    return json(500, {
      success: false,
      error: "Unable to send the email. Please try again later.",
    });
  }
};
