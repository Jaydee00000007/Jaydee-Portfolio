import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env["GMAIL_USER"],
    pass: process.env["GMAIL_APP_PASSWORD"]
  }
});

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

function formatHtmlEmail({ name, email, message }: { name: string; email: string; message: string; }) {
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

export async function POST(request: Request) {
  const data = await request.json();
  const error = validateContact(data);

  if (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }

  const recipients = (process.env["MAIL_TO"] || "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);

  if (recipients.length === 0) {
    return NextResponse.json(
      { success: false, error: "Recipient list is not configured." }, 
      { status: 500 }
    );
  }

  try {
    await transporter.sendMail({
      from: process.env["GMAIL_USER"],
      to: recipients,
      subject: `My Portfolio Page: New message from ${data.name}`,
      replyTo: data.email,
      html: formatHtmlEmail(data)
    });

    return NextResponse.json({
      success: true,
      message: "Contact message sent successfully."
    });
  } catch (sendError) {
    console.error("Email send error:", sendError);
    return NextResponse.json(
      { success: false, error: "Unable to send email. Please try again later." }, 
      { status: 500 }
    );
  }
}
