/**
 * Developer Error Notification System
 *
 * Sends detailed error notifications to developers when critical errors occur
 * during the booking process. Includes full context for debugging.
 */

import { sendMail } from "./modules/booking/nodemailer/utils";
import type { BookingProblemDetails } from "./problem-details";

const DEVELOPER_EMAIL = "facundopellicer4@gmail.com";

/**
 * Severity levels for error notifications
 */
export type ErrorSeverity = "critical" | "degraded" | "warning";

/**
 * Determines the severity level based on the booking step that failed
 */
function getSeverityForStep(
  step: BookingProblemDetails["bookingStep"],
): ErrorSeverity {
  switch (step) {
    case "captcha_verification":
    case "booking_creation":
      return "critical"; // These failures mean no booking was created
    case "calendar_event":
    case "email_delivery":
      return "degraded"; // These failures mean booking succeeded but ancillary services failed
    default:
      return "warning";
  }
}

/**
 * Formats the error details as an HTML email for the developer
 */
function formatErrorEmail(
  problem: BookingProblemDetails,
  originalError: Error | unknown,
  severity: ErrorSeverity,
): string {
  const severityColors = {
    critical: "#dc2626",
    degraded: "#f59e0b",
    warning: "#3b82f6",
  };

  const severityEmoji = {
    critical: "🚨",
    degraded: "⚠️",
    warning: "ℹ️",
  };

  const stackTrace =
    originalError instanceof Error
      ? originalError.stack?.replace(/\n/g, "<br/>") || "No stack trace"
      : "Not an Error object";

  const sanitizedContext = problem.context
    ? Object.entries(problem.context)
        .filter(([key]) => !["customerEmail", "customerPhone"].includes(key))
        .reduce(
          (acc, [key, value]) => {
            acc[key] = value;
            return acc;
          },
          {} as Record<string, unknown>,
        )
    : {};

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: ${severityColors[severity]};
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            background: #f9fafb;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-top: none;
            border-radius: 0 0 8px 8px;
          }
          .section {
            background: white;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 6px;
            border-left: 4px solid ${severityColors[severity]};
          }
          .section h2 {
            margin-top: 0;
            font-size: 18px;
            color: #111827;
          }
          .label {
            font-weight: 600;
            color: #6b7280;
            font-size: 14px;
          }
          .value {
            color: #111827;
            margin-bottom: 10px;
          }
          .code {
            background: #1f2937;
            color: #f3f4f6;
            padding: 15px;
            border-radius: 4px;
            overflow-x: auto;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.4;
          }
          .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${severityEmoji[severity]} Booking Error: ${problem.title}</h1>
        </div>
        
        <div class="content">
          <div class="section">
            <h2>Error Overview</h2>
            <div class="label">Severity</div>
            <div class="value">${severity.toUpperCase()}</div>
            
            <div class="label">Booking Step</div>
            <div class="value">${problem.bookingStep}</div>
            
            <div class="label">Correlation ID</div>
            <div class="value"><code>${problem.correlationId}</code></div>
            
            <div class="label">Timestamp</div>
            <div class="value">${problem.timestamp}</div>
            
            ${
              problem.bookingId
                ? `
              <div class="label">Booking ID</div>
              <div class="value">${problem.bookingId}</div>
            `
                : ""
            }
            
            ${
              problem.customerEmail
                ? `
              <div class="label">Customer Email</div>
              <div class="value">${problem.customerEmail}</div>
            `
                : ""
            }
          </div>
          
          <div class="section">
            <h2>Error Details</h2>
            <div class="label">Problem Type</div>
            <div class="value">${problem.type}</div>
            
            <div class="label">Status Code</div>
            <div class="value">${problem.status}</div>
            
            <div class="label">Description</div>
            <div class="value">${problem.detail}</div>
          </div>
          
          ${
            Object.keys(sanitizedContext).length > 0
              ? `
            <div class="section">
              <h2>Request Context</h2>
              <div class="code">${JSON.stringify(sanitizedContext, null, 2)}</div>
            </div>
          `
              : ""
          }
          
          <div class="section">
            <h2>Stack Trace</h2>
            <div class="code">${stackTrace}</div>
          </div>
          
          ${
            problem.validationErrors
              ? `
            <div class="section">
              <h2>Validation Errors</h2>
              <div class="code">${JSON.stringify(problem.validationErrors, null, 2)}</div>
            </div>
          `
              : ""
          }
        </div>
        
        <div class="footer">
          <p><strong>Action Required:</strong></p>
          ${
            severity === "critical"
              ? `
            <p>⚠️ This is a <strong>critical error</strong>. The booking was NOT created. 
            Investigate immediately.</p>
          `
              : severity === "degraded"
                ? `
            <p>⚠️ This is a <strong>degraded service</strong> error. The booking was created successfully, 
            but ${problem.bookingStep === "calendar_event" ? "the calendar event" : "the confirmation email"} failed. 
            You may need to manually ${problem.bookingStep === "calendar_event" ? "create the calendar event" : "send the confirmation email"}.</p>
          `
                : `
            <p>ℹ️ This is a <strong>warning</strong>. Review when convenient.</p>
          `
          }
          <p>
            <strong>Debugging Tips:</strong><br/>
            • Search logs for correlation ID: <code>${problem.correlationId}</code><br/>
            • Check Vercel logs: <a href="https://vercel.com">Vercel Dashboard</a><br/>
            ${problem.bookingId ? `• Database booking ID: <code>${problem.bookingId}</code><br/>` : ""}
          </p>
        </div>
      </body>
    </html>
  `;
}

/**
 * Sends an error notification email to the developer
 *
 * @param problem - RFC 9457 Problem Details object
 * @param originalError - The original error that was caught
 * @returns Promise that resolves when email is sent (or fails silently)
 */
export async function notifyDeveloper(
  problem: BookingProblemDetails,
  originalError: Error | unknown,
): Promise<void> {
  const severity = getSeverityForStep(problem.bookingStep);

  // Log the error regardless of email success
  console.error(
    `[${severity.toUpperCase()}] ${problem.title} [${problem.correlationId}]`,
  );
  console.error("Problem Details:", JSON.stringify(problem, null, 2));
  console.error("Original Error:", originalError);

  try {
    const html = formatErrorEmail(problem, originalError, severity);

    const subjectPrefix = {
      critical: "🚨 CRITICAL",
      degraded: "⚠️ DEGRADED",
      warning: "ℹ️ WARNING",
    }[severity];

    await sendMail({
      to: DEVELOPER_EMAIL,
      subject: `${subjectPrefix}: ${problem.title} [${problem.correlationId}]`,
      html,
    });

    console.log(
      `Developer notification sent successfully [${problem.correlationId}]`,
    );
  } catch (emailError) {
    // Don't throw - we don't want email failures to cascade
    // The error is already logged above
    console.error("Failed to send developer notification email:", emailError);
    console.error(
      "Original problem details were already logged above - check logs with correlation ID:",
      problem.correlationId,
    );
  }
}

/**
 * Wrapper for notifyDeveloper that doesn't throw on failure
 * Use this when you want to ensure the notification attempt doesn't break your flow
 */
export async function notifyDeveloperSafe(
  problem: BookingProblemDetails,
  originalError: Error | unknown,
): Promise<void> {
  try {
    await notifyDeveloper(problem, originalError);
  } catch (error) {
    // Absolutely never throw from safe notification
    console.error("Safe notification wrapper caught error:", error);
  }
}
