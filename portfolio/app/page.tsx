"use client";

import { FormEvent, useState } from "react";

export default function HomePage() {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim()
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok) {
        setStatus(result.error || "Failed to send message.");
      } else {
        setStatus("Message sent successfully!");
        event.currentTarget.reset();
      }
    } catch (error) {
      setStatus("Network error. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>Contact</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 560, display: "grid", gap: 16 }}>
        <label>
          Name
          <input name="name" type="text" required style={{ width: "100%", padding: 10 }} />
        </label>
        <label>
          Email
          <input name="email" type="email" required style={{ width: "100%", padding: 10 }} />
        </label>
        <label>
          Message
          <textarea name="message" rows={6} required style={{ width: "100%", padding: 10 }} />
        </label>
        <button type="submit" disabled={loading} style={{ padding: "10px 16px" }}>
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
      {status && <p style={{ marginTop: 16 }}>{status}</p>}
    </main>
  );
}
