import nodemailer from "nodemailer";

function buildParticipationConfirmationHtml(name: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const headerImageUrl = `${baseUrl}/email-header.jpg`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Participation Confirmation – 2nd CMCMMC</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f2f5;font-family:'Trebuchet MS',Helvetica,Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f0f2f5;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;background-color:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header image -->
          <tr>
            <td>
              <img src="${headerImageUrl}" alt="Cebu Metropolitan Catholic Mass Media Congress – October 3-4, 2026, Cebu City" width="600" style="display:block;width:100%;max-width:600px;border:0;">
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 48px 8px;">

              <p style="margin:0 0 24px;font-size:16px;color:#1a1a1a;line-height:1.7;">Dear ${name},</p>

              <p style="margin:0 0 20px;font-size:16px;color:#1a1a1a;line-height:1.7;">
                Thank you for registering! We are delighted to confirm your participation in the
                <strong style="color:#1a3a8a;">2nd Cebu Metropolitan Catholic Mass Media Congress</strong>!
              </p>

              <p style="margin:0 0 20px;font-size:16px;color:#1a1a1a;line-height:1.7;">
                See you at the Recoletos Coliseum of the University of San Jose-Recoletos (Basak
                Campus) on <strong>October 3-4, 2026</strong>, for a meaningful encounter with
                fellow Church communicators.
              </p>

              <p style="margin:0 0 20px;font-size:16px;color:#1a1a1a;line-height:1.7;">
                Together, let us reflect on how we can responsibly harness emerging technologies
                in the service of evangelization and authentic human connection.
              </p>

              <p style="margin:0 0 20px;font-size:16px;color:#1a1a1a;line-height:1.7;">
                Attached is a copy of the acknowledgement receipt of your payment.
              </p>

              <p style="margin:0 0 32px;font-size:16px;color:#1a1a1a;line-height:1.7;">
                Like, follow, and subscribe to the Archdiocese's official social media accounts
                and website to stay posted on the Congress.
              </p>

            </td>
          </tr>

          <!-- Social media icons -->
          <tr>
            <td align="center" style="padding:0 48px 20px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:0 5px;">
                    <a href="https://www.facebook.com/sugboanongsimbahan" style="display:inline-block;text-decoration:none;line-height:0;">
                      <img src="${baseUrl}/facebook.png" alt="Facebook" width="32" height="32" style="display:block;border:0;">
                    </a>
                  </td>
                  <td style="padding:0 5px;">
                    <a href="https://www.instagram.com/sugboanongsimbahan/" style="display:inline-block;text-decoration:none;line-height:0;">
                      <img src="${baseUrl}/instagram.png" alt="Instagram" width="32" height="32" style="display:block;border:0;">
                    </a>
                  </td>
                  <td style="padding:0 5px;">
                    <a href="https://www.youtube.com/@sugboanongsimbahan" style="display:inline-block;text-decoration:none;line-height:0;">
                      <img src="${baseUrl}/youtube.png" alt="YouTube" width="32" height="32" style="display:block;border:0;">
                    </a>
                  </td>
                  <td style="padding:0 5px;">
                    <a href="https://twitter.com/sugbosimbahan" style="display:inline-block;text-decoration:none;line-height:0;">
                      <img src="${baseUrl}/twitter.png" alt="X (Twitter)" width="32" height="32" style="display:block;border:0;">
                    </a>
                  </td>
                  <td style="padding:0 5px;">
                    <a href="https://www.tiktok.com/@sugboanongsimbahan" style="display:inline-block;text-decoration:none;line-height:0;">
                      <img src="${baseUrl}/tiktok.png" alt="TikTok" width="32" height="32" style="display:block;border:0;">
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Social handle links -->
          <tr>
            <td align="center" style="padding:0 48px 8px;">
              <a href="https://www.facebook.com/sugboanongsimbahan" style="display:block;font-family:'Trebuchet MS',Helvetica,Arial,sans-serif;font-size:14px;color:#1a78c2;text-decoration:none;margin-bottom:4px;">@sugboanongsimbahan</a>
              <a href="https://thearchdioceseofcebu.com" style="display:block;font-family:'Trebuchet MS',Helvetica,Arial,sans-serif;font-size:14px;color:#1a78c2;text-decoration:none;">thearchdioceseofcebu.com</a>
            </td>
          </tr>

          <!-- Closing -->
          <tr>
            <td style="padding:32px 48px 48px;">
              <p style="margin:0 0 4px;font-size:16px;color:#1a1a1a;line-height:1.7;">Yours in Christ,</p>
              <p style="margin:0;font-size:16px;color:#1a1a1a;line-height:1.7;">Cebu Archdiocesan Digital Communications Ministry (CADComM)</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendParticipationConfirmationEmail({
  name,
  email,
  invoiceBuffer,
  invoiceFileName,
}: {
  name: string;
  email: string;
  invoiceBuffer?: Buffer;
  invoiceFileName?: string;
}) {
  const recipientName = typeof name === "string" ? name.trim() : "";
  const recipientEmail = typeof email === "string" ? email.trim() : "";

  if (!recipientName || !recipientEmail) {
    return {
      success: false,
      message: "Please provide both the recipient name and email.",
    };
  }

  const username = process.env.GMAIL_USERNAME;
  const password = process.env.GMAIL_PASSWORD;

  if (!username || !password) {
    console.error("Missing Gmail credentials.");
    return {
      success: false,
      message: "Email service is not configured.",
    };
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: username,
      pass: password,
    },
  });

  const textBody = `Dear ${recipientName},\n\nThank you for registering! We are delighted to confirm your participation in the 2nd Cebu Metropolitan Catholic Mass Media Congress!\n\nSee you at the Recoletos Coliseum of the University of San Jose-Recoletos (Basak Campus) on October 3-4, 2026, for a meaningful encounter with fellow Church communicators.\n\nTogether, let us reflect on how we can responsibly harness emerging technologies in the service of evangelization and authentic human connection.\n\nAttached is a copy of the acknowledgement receipt of your payment.\n\nLike, follow, and subscribe to the Archdiocese's official social media accounts and website to stay posted on the Congress.\n\n@sugboanongsimbahan | thearchdioceseofcebu.com\n\nYours in Christ,\nCebu Archdiocesan Digital Communications Ministry (CADComM)`;

  try {
    await transporter.verify();

    await transporter.sendMail({
      from: `no-reply <${username}>`,
      to: recipientEmail,
      subject: `[CMCMMC] Participation Confirmation`,
      text: textBody,
      html: buildParticipationConfirmationHtml(recipientName),
      replyTo: username,
      envelope: { from: username, to: recipientEmail },
      headers: {
        "List-Unsubscribe": `<mailto:${username}?subject=unsubscribe>`,
        "X-Priority": "3",
      },
      attachments: invoiceBuffer
        ? [
            {
              filename: invoiceFileName ?? "invoice.pdf",
              content: invoiceBuffer,
              contentType: "application/pdf",
            },
          ]
        : [],
    });

    return {
      success: true,
      message:
        "Participation confirmation email sent successfully! If you don't receive it within the next hour, please check your spam folder.",
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to send email." };
  }
}

export async function sendRegistrationConfirmationEmail({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const recepientName = typeof name === "string" ? name.trim() : "";
  const recepientEmail = typeof email === "string" ? email.trim() : "";

  if (!recepientName || !recepientEmail) {
    return {
      success: false,
      message: "Please provide both your name and email.",
    };
  }

  const username = process.env.GMAIL_USERNAME;
  const password = process.env.GMAIL_PASSWORD;

  if (!username || !password) {
    console.error("Missing Gmail credentials.");
    return {
      success: false,
      message: "Email service is not configured.",
    };
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: username,
      pass: password,
    },
  });

  try {
    // verify connection configuration to catch auth/network issues early
    await transporter.verify();

    const textBody = `Dear ${recepientName},\n\nThank you for signing up for the 2nd Cebu Metropolitan Catholic Mass Media Congress.\n\nOur team is currently reviewing the information you provided in the registration form. We will send you an update on the status of your registration within the next two (2) weeks.\n\nFor clarifications in the future, you can send an email to cm.catholicmassmediacongress@gmail.com.\n\nDon't forget to like, follow, and subscribe to the official social media accounts of the Archdiocese of Cebu, @sugboanongsimbahan, on Facebook, Instagram, X, YouTube, and Tiktok. Visit the Archdiocese's official website: thearchdioceseofcebu.com.\n\nThank you and God bless!`;

    await transporter.sendMail({
      from: `no-reply <${username}>`,
      to: recepientEmail,
      subject: `[CMCMMC] Initial Registration Confirmation`,
      text: textBody,
      html: `Dear ${recepientName},<br><br>

Thank you for signing up for the 2nd Cebu Metropolitan Catholic Mass Media Congress.<br><br>

Our team is currently reviewing the information you provided in the registration form. We will send you an update on the status of your registration within the next two (2) weeks.<br><br>

For clarifications in the future, you can send an email to cm.catholicmassmediacongress@gmail.com.<br><br>

Don't forget to like, follow, and subscribe to the official social media accounts of the Archdiocese of Cebu, @sugboanongsimbahan, on Facebook, Instagram, X, YouTube, and Tiktok. Visit the Archdiocese's official website: thearchdioceseofcebu.com.<br><br>

Thank you and God bless!`,
      replyTo: username,
      envelope: { from: username, to: recepientEmail },
      headers: {
        "List-Unsubscribe": `<mailto:${username}?subject=unsubscribe>`,
        "X-Priority": "3",
      },
    });
    return {
      success: true,
      message:
        "Email sent successfully! If you don't receive it within the next hour, please check your spam folder.",
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to send email." };
  }
}

export async function sendContactUsEmail(formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  const senderName = typeof name === "string" ? name.trim() : "";
  const senderEmail = typeof email === "string" ? email.trim() : "";
  const senderMessage = typeof message === "string" ? message.trim() : "";

  if (!senderName || !senderEmail || !senderMessage) {
    return {
      success: false,
      message: "Please complete all contact form fields.",
    };
  }

  const username = process.env.GMAIL_USERNAME;
  const password = process.env.GMAIL_PASSWORD;

  if (!username || !password) {
    console.error("Missing Gmail credentials.");
    return {
      success: false,
      message: "Email service is not configured.",
    };
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: username,
      pass: password,
    },
  });

  try {
    await transporter.verify();

    const contactText = `Name: ${senderName}\nEmail: ${senderEmail}\n\n${senderMessage}`;

    await transporter.sendMail({
      from: `no-reply <${username}>`,
      to: username,
      subject: `New message from ${senderName}`,
      text: contactText,
      html: contactText.replace(/\n/g, "<br>"),
      replyTo: senderEmail,
      envelope: { from: username, to: username },
    });
    return { success: true, message: "Email sent successfully!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to send email." };
  }
}
