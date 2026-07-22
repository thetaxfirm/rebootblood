import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { ENV } from "./env";

/**
 * Transactional email helper using Google Workspace SMTP.
 *
 * Sends from care@rebootblood.clinic to itself (or any recipient) via
 * smtp.gmail.com with a Google App Password. Fully automated — no
 * interactive confirmation required.
 *
 * HIPAA note: only non-PHI contact + intent data should be included in
 * email bodies (name, email, phone, interest, tier). Health-screening
 * answers stay in the encrypted DB and are NOT emailed.
 */

const SMTP_HOST = "smtp.gmail.com";
const SMTP_PORT = 465; // SSL
const DEFAULT_FROM = `"rEBOOtBlood Notifications" <${ENV.smtpUser || "care@rebootblood.clinic"}>`;
const DEFAULT_TO = ENV.smtpUser || "care@rebootblood.clinic";

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (!ENV.smtpUser || !ENV.smtpAppPassword) {
    console.warn("[Email] SMTP credentials not configured — email delivery disabled.");
    return null;
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: true, // SSL
      auth: {
        user: ENV.smtpUser,
        pass: ENV.smtpAppPassword,
      },
    });
  }
  return transporter;
}

export interface EmailOptions {
  to?: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Send an email. Returns true on success, false on failure (logs error).
 * Silently skips if SMTP credentials are not configured.
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const t = getTransporter();
  if (!t) return false;

  try {
    await t.sendMail({
      from: DEFAULT_FROM,
      to: options.to || DEFAULT_TO,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    return true;
  } catch (err) {
    console.error("[Email] Failed to send:", err);
    return false;
  }
}

/**
 * Verify SMTP credentials by attempting a connection + auth handshake.
 * Returns true if credentials are valid, false otherwise.
 */
export async function verifySmtpCredentials(): Promise<boolean> {
  const t = getTransporter();
  if (!t) return false;
  try {
    await t.verify();
    return true;
  } catch (err) {
    console.error("[Email] SMTP verification failed:", err);
    return false;
  }
}

// ─── Notification email formatters ───────────────────────────────────────────

export function formatLeadEmail(lead: {
  name: string;
  email: string;
  phone?: string;
  interest?: string;
  source?: string;
  selectedTier?: string;
  message?: string;
}): EmailOptions {
  const lines = [
    `New lead submission received.`,
    ``,
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    lead.phone ? `Phone: ${lead.phone}` : null,
    lead.interest ? `Interest: ${lead.interest}` : null,
    lead.selectedTier ? `Selected tier: ${lead.selectedTier}` : null,
    lead.source ? `Source: ${lead.source}` : null,
    lead.message ? `\nMessage:\n${lead.message}` : null,
    ``,
    `---`,
    `View full details in the admin dashboard.`,
  ].filter(Boolean);

  return {
    subject: `[rEBOOtBlood] New Lead: ${lead.name} — ${lead.interest || "General inquiry"}`,
    text: lines.join("\n"),
  };
}

export function formatQuestionnaireEmail(submission: {
  name: string;
  email: string;
  phone?: string;
  preferredContact?: string;
  interest?: string;
  volume?: string;
  selectedTier?: string;
  location?: string;
  goals?: string;
}): EmailOptions {
  const lines = [
    `New eligibility questionnaire submitted.`,
    ``,
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    submission.phone ? `Phone: ${submission.phone}` : null,
    submission.preferredContact ? `Preferred contact: ${submission.preferredContact}` : null,
    submission.interest ? `Interest: ${submission.interest}` : null,
    submission.volume ? `EBO3 volume: ${submission.volume}` : null,
    submission.selectedTier ? `Selected tier: ${submission.selectedTier}` : null,
    submission.location ? `Location: ${submission.location}` : null,
    submission.goals ? `Goals: ${submission.goals}` : null,
    ``,
    `NOTE: Health-screening answers are stored securely in the admin dashboard (encrypted at rest). They are NOT included in this email for HIPAA compliance.`,
    ``,
    `---`,
    `View full submission in the admin dashboard.`,
  ].filter(Boolean);

  return {
    subject: `[rEBOOtBlood] New Questionnaire: ${submission.name} — ${submission.interest || "Eligibility"}`,
    text: lines.join("\n"),
  };
}
