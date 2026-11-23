import nodemailer from "nodemailer";
import { env } from "./env.js";

const hasMailCredentials = Boolean(env.MAIL_USER && env.MAIL_PASS);

export const mailer = nodemailer.createTransport({
  host: env.MAIL_HOST || "smtp.gmail.com",
  port: env.MAIL_PORT || 587,
  secure: env.MAIL_PORT === 465,
  ...(hasMailCredentials
    ? {
        auth: {
          user: env.MAIL_USER,
          pass: env.MAIL_PASS
        }
      }
    : {})
});

export async function sendActivationEmail(to: string, activationUrl: string) {
  if (!hasMailCredentials) {
    console.warn("Skipping sendActivationEmail: MAIL_USER or MAIL_PASS not configured in backend .env");
    return;
  }

  try {
    await mailer.verify();
    await mailer.sendMail({
      from: env.MAIL_FROM || "noreply@investpro.com",
      to,
      subject: "Activate your Invest Pro account",
      html: `<p>Your account has been approved. Click below to set your password:</p><p><a href="${activationUrl}">Activate account</a></p>`
    });
  } catch (error) {
    console.error("Activation email send failed:", error);
  }
}

export async function sendAccountApprovedEmail(to: string) {
  if (!hasMailCredentials) {
    console.warn("Skipping sendAccountApprovedEmail: MAIL_USER or MAIL_PASS not configured in backend .env");
    return;
  }

  try {
    await mailer.verify();
    await mailer.sendMail({
      from: env.MAIL_FROM || "noreply@investpro.com",
      to,
      subject: "Your Invest Pro account is active",
      html: `<p>Your account has been approved and activated.</p><p>You can now log in and start investing from your dashboard.</p><p><a href="${env.APP_BASE_URL}/login">Login to Invest Pro</a></p>`
    });
  } catch (error) {
    console.error("Account approval email send failed:", error);
    throw error;
  }
}
