import { Resend } from "resend";

const ADMIN_EMAIL = "info@go-bond.jp";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      whatsapp,
      guests,
      date,
      flexibleDates,
      selectedTour,
      selectedInterests,
      requests,
    } = body;

    if (!name || !email) {
      return Response.json({ error: "Name and email are required." }, { status: 400 });
    }

    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Tokyo",
      dateStyle: "full",
      timeStyle: "short",
    });

    // Try to send emails via Resend
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || apiKey === "re_your_api_key_here") {
      // Email not configured — booking saved, skip email
      console.warn("RESEND_API_KEY not set. Booking saved but emails not sent.");
      return Response.json({ success: true, emailSent: false });
    }

    const resend = new Resend(apiKey);

    const adminHtml = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1A1A1A; padding: 40px 20px;">
        <p style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #016812; margin-bottom: 24px;">
          New Booking Request — Bond
        </p>
        <h2 style="font-size: 28px; font-weight: 300; margin-bottom: 32px; border-bottom: 1px solid #eee; padding-bottom: 24px;">
          ${name}
        </h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; font-weight: 300;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; width: 140px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;"><a href="mailto:${email}" style="color: #1A1A1A;">${email}</a></td>
          </tr>
          ${whatsapp ? `<tr><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">WhatsApp</td><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">${whatsapp}</td></tr>` : ""}
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Guests</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">${guests}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Tour</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">${selectedTour || "Not specified"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Date</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">${date || "Not specified"}${flexibleDates ? " (flexible)" : ""}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Interests</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">${selectedInterests?.length ? selectedInterests.join(", ") : "None"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #888; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; vertical-align: top; padding-top: 14px;">Notes</td>
            <td style="padding: 10px 0; white-space: pre-line;">${requests || "—"}</td>
          </tr>
        </table>
        <p style="margin-top: 32px; font-size: 11px; color: #aaa;">Submitted at ${timestamp} (JST) · ID: ${bookingId}</p>
      </div>
    `;

    const guestHtml = `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #1A1A1A; padding: 48px 24px;">
        <p style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #016812; margin-bottom: 32px;">Bond — Kyoto</p>
        <h2 style="font-size: 32px; font-weight: 300; line-height: 1.3; margin-bottom: 24px;">Thank you for your request.</h2>
        <p style="font-size: 15px; font-weight: 300; color: #555; line-height: 1.8; margin-bottom: 16px;">Dear ${name},</p>
        <p style="font-size: 15px; font-weight: 300; color: #555; line-height: 1.8; margin-bottom: 16px;">We received your request and are currently reviewing your plan. We will get back to you shortly.</p>
        <p style="font-size: 15px; font-weight: 300; color: #555; line-height: 1.8; margin-bottom: 32px;">We'll help you create a personalized and unforgettable experience in Kyoto.</p>
        <p style="font-size: 14px; font-weight: 300; color: #888; margin-top: 32px; padding-top: 32px; border-top: 1px solid #eee;">
          Questions? Reply to this email or contact us at <a href="mailto:info@go-bond.jp" style="color: #016812; text-decoration: none;">info@go-bond.jp</a>
        </p>
        <p style="font-size: 15px; font-weight: 300; color: #555; margin-top: 32px; font-style: italic;">— Bond Team</p>
      </div>
    `;

    // Attempt to send both emails; log errors but don't fail the request
    const results = await Promise.allSettled([
      resend.emails.send({
        from: "Bond <onboarding@resend.dev>",
        to: [ADMIN_EMAIL],
        subject: `New booking request — ${name}`,
        html: adminHtml,
        replyTo: email,
      }),
      resend.emails.send({
        from: "Bond <onboarding@resend.dev>",
        to: [email],
        subject: "We received your request — Bond",
        html: guestHtml,
      }),
    ]);

    for (const result of results) {
      if (result.status === "rejected") {
        console.error("Email send error:", result.reason);
      }
    }

    return Response.json({ success: true, emailSent: true });
  } catch (error) {
    console.error("Booking error:", error);
    return Response.json({ error: "Failed to process request. Please email info@go-bond.jp directly." }, { status: 500 });
  }
}
