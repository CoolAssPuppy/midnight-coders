"use client";

import { useState, useEffect, useCallback, memo, type FormEvent } from "react";

interface EmailSignupProps {
  scrollProgress: number;
}

type SubmitStatus = "idle" | "submitting" | "success" | "error";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const RELEASE_DATE = new Date("2026-09-22T00:00:00");

function useCountdown(targetDate: Date): TimeRemaining | null {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(
    null
  );

  useEffect(() => {
    const updateTime = (): void => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeRemaining({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    const interval = setInterval(updateTime, 1000);
    updateTime();

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeRemaining;
}

function CountdownTimer(): React.ReactElement {
  const timeRemaining = useCountdown(RELEASE_DATE);

  if (timeRemaining === null) {
    return <div style={{ height: "80px" }} aria-hidden="true" />;
  }

  const padNumber = (num: number): string => num.toString().padStart(2, "0");

  return (
    <div
      className="flex items-baseline justify-center gap-1 mb-8"
      style={{ fontFamily: '"Courier New", Courier, monospace' }}
      aria-label={`${timeRemaining.days} days, ${timeRemaining.hours} hours, ${timeRemaining.minutes} minutes, ${timeRemaining.seconds} seconds until release`}
    >
      <span className="text-3xl md:text-4xl" style={{ color: "#fcde09" }}>
        {timeRemaining.days}
      </span>
      <span className="text-sm md:text-base text-white/60 mr-2">d</span>

      <span className="text-3xl md:text-4xl" style={{ color: "#fcde09" }}>
        {padNumber(timeRemaining.hours)}
      </span>
      <span className="text-sm md:text-base text-white/60 mr-2">h</span>

      <span className="text-3xl md:text-4xl" style={{ color: "#fcde09" }}>
        {padNumber(timeRemaining.minutes)}
      </span>
      <span className="text-sm md:text-base text-white/60 mr-2">m</span>

      <span className="text-xl md:text-2xl text-white">
        {padNumber(timeRemaining.seconds)}
      </span>
      <span className="text-xs md:text-sm text-white/60">s</span>
    </div>
  );
}

function PrivacyPolicy(): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="underline hover:text-white/60 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Privacy Policy
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-4 rounded-lg z-50"
            style={{
              backgroundColor: "rgba(30, 30, 30, 0.95)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
            }}
            role="tooltip"
          >
            <p
              className="text-xs leading-relaxed text-white/80"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              Emails will only be used to inform you about release date and
              other marketing leading up to the book. Emails will never be sold
              or given to third parties. Only supply your email address if
              you&apos;re interested in learning about The Midnight Coder&apos;s Children.
              </p>
            </div>
          </>
        )}
      </span>
    );
  }

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  agreedToContact: boolean;
}

function EmailSignupComponent({
  scrollProgress,
}: EmailSignupProps): React.ReactElement | null {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    agreedToContact: false,
  });
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [emailTouched, setEmailTouched] = useState(false);

  const isFormValid =
    formData.firstName.trim() !== "" &&
    formData.lastName.trim() !== "" &&
    isValidEmail(formData.email) &&
    formData.agreedToContact;

  const showEmailError =
    emailTouched && formData.email.trim() !== "" && !isValidEmail(formData.email);

  // Email form fades in from 52-60%, stays visible after
  const fadeInStart = 0.52;
  const fadeInEnd = 0.60;

  let opacity = 0;

  if (scrollProgress < fadeInStart) {
    opacity = 0;
  } else if (scrollProgress < fadeInEnd) {
    opacity = (scrollProgress - fadeInStart) / (fadeInEnd - fadeInStart);
  } else {
    opacity = 1;
  }

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();

      if (!isFormValid || status === "submitting") {
        return;
      }

      setStatus("submitting");

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setStatus("success");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          agreedToContact: false,
        });
        setEmailTouched(false);
      } catch {
        setStatus("error");
      }
    },
    [isFormValid, status]
  );

  if (opacity <= 0) {
    return null;
  }

  const translateY = (1 - opacity) * 30;

  return (
    <div
      className="flex flex-col items-center px-6 md:px-8"
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        transition: "opacity 0.15s ease-out",
      }}
      aria-label="Email signup"
    >
      <div className="w-full max-w-md">
        <CountdownTimer />

        <p
          className="text-lg md:text-xl mb-8 leading-relaxed text-left"
          style={{
            fontFamily: '"Times New Roman", Times, serif',
            color: "rgba(255, 255, 255, 0.85)",
          }}
        >
          Be the first to know when this new worldwide phenomenon releases
        </p>

        {status === "success" ? (
          <div
            className="py-4 px-6 rounded-lg"
            style={{ backgroundColor: "rgba(252, 222, 9, 0.1)" }}
          >
            <p
              className="text-lg"
              style={{
                color: "#fcde09",
                fontFamily: '"Times New Roman", Times, serif',
              }}
            >
              Thank you for subscribing.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex gap-4">
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                }
                placeholder="First name"
                required
                disabled={status === "submitting"}
                className="w-1/2 px-5 py-4 text-base md:text-lg rounded-lg border-2 transition-all duration-300 focus:outline-none disabled:opacity-50"
                style={{
                  fontFamily: '"Times New Roman", Times, serif',
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#fcde09";
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                }}
                aria-label="First name"
              />
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                }
                placeholder="Last name"
                required
                disabled={status === "submitting"}
                className="w-1/2 px-5 py-4 text-base md:text-lg rounded-lg border-2 transition-all duration-300 focus:outline-none disabled:opacity-50"
                style={{
                  fontFamily: '"Times New Roman", Times, serif',
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#fcde09";
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                }}
                aria-label="Last name"
              />
            </div>

            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                onBlur={(e) => {
                  setEmailTouched(true);
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                }}
                placeholder="Email address"
                required
                disabled={status === "submitting"}
                className="w-full px-5 py-4 text-base md:text-lg rounded-lg border-2 transition-all duration-300 focus:outline-none disabled:opacity-50"
                style={{
                  fontFamily: '"Times New Roman", Times, serif',
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderColor: showEmailError
                    ? "#ff6b6b"
                    : "rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = showEmailError
                    ? "#ff6b6b"
                    : "#fcde09";
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
                }}
                aria-label="Email address"
                aria-invalid={showEmailError}
              />
              {showEmailError && (
                <p
                  className="text-sm mt-1"
                  style={{ color: "#ff6b6b" }}
                  role="alert"
                >
                  Please enter a valid email address
                </p>
              )}
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreedToContact}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    agreedToContact: e.target.checked,
                  }))
                }
                disabled={status === "submitting"}
                className="mt-1 w-4 h-4 rounded border-2 cursor-pointer accent-yellow-400"
                style={{
                  accentColor: "#fcde09",
                }}
                aria-label="Agree to be contacted about Bodhi Press publications"
              />
              <span
                className="text-sm leading-relaxed"
                style={{
                  fontFamily: '"Times New Roman", Times, serif',
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                I agree to be contacted about Bodhi Press publications
              </span>
            </label>

            <button
              type="submit"
              disabled={status === "submitting" || !isFormValid}
              className="px-8 py-4 text-base md:text-lg font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                fontFamily: '"Times New Roman", Times, serif',
                backgroundColor: isFormValid ? "#fcde09" : "rgba(252, 222, 9, 0.4)",
                color: "#121212",
              }}
              onMouseEnter={(e) => {
                if (status !== "submitting" && isFormValid) {
                  e.currentTarget.style.backgroundColor = "#ffe433";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isFormValid
                  ? "#fcde09"
                  : "rgba(252, 222, 9, 0.4)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {status === "submitting" ? "Subscribing..." : "Notify Me"}
            </button>

            {status === "error" && (
              <p className="text-sm" style={{ color: "#ff6b6b" }} role="alert">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        )}

        <footer
          className="mt-12 text-center"
          style={{
            fontFamily: '"Times New Roman", Times, serif',
            fontSize: "11px",
            color: "rgba(255, 255, 255, 0.4)",
          }}
        >
          <p className="mb-1">&copy; 2026 Bodhi Press</p>
          <PrivacyPolicy />
        </footer>
      </div>
    </div>
  );
}

export const EmailSignup = memo(EmailSignupComponent);
