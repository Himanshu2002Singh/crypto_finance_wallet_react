import nodemailer from "nodemailer";
import { env } from "./env.js";

export const mailer = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  secure: env.MAIL_PORT === 465,
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS
  }
});

export async function sendActivationEmail(to: string, activationUrl: string) {
  try {
    await mailer.verify();
  } catch (error) {
    console.error("Mailer verification failed", error);
    throw error;
  }

  try {
    await mailer.sendMail({
      from: env.MAIL_FROM,
      to,
      subject: "Activate your Invest Pro account",
      html: `<p>Your account has been approved. Click below to set your password:</p><p><a href="${activationUrl}">Activate account</a></p>`
    });
  } catch (error) {
    console.error("Activation email send failed", error);
    throw error;
  }
}

export async function sendAccountApprovedEmail(to: string) {
  try {
    await mailer.verify();
  } catch (error) {
    console.error("Mailer verification failed", error);
    throw error;
  }

  try {
    await mailer.sendMail({
      from: env.MAIL_FROM,
      to,
      subject: "Your Invest Pro account is active",
      html: `<p>Your account has been approved and activated.</p><p>You can now log in and start investing from your dashboard.</p><p><a href="${env.APP_BASE_URL}/login">Login to Invest Pro</a></p>`
    });
  } catch (error) {
    console.error("Account approval email send failed", error);
    throw error;
  }
}
