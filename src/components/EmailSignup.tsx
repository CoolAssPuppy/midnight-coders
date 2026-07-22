"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  memo,
  type FormEvent,
} from "react";
import Image from "next/image";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { trackNewsletterSignup } from "@/lib/analytics";
import "./email-signup.css";

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

const RELEASE_DATE = new Date("2026-09-15T00:00:00");

export const SIGNUP_HEADLINE =
  "Deleted scenes, writing background, and the world behind the book.";

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
    return <div style={{ height: "104px" }} aria-hidden="true" />;
  }

  const pad = (n: number): string => n.toString().padStart(2, "0");

  const units: { value: string; label: string }[] = [
    { value: String(timeRemaining.days), label: "days" },
    { value: pad(timeRemaining.hours), label: "hrs" },
    { value: pad(timeRemaining.minutes), label: "min" },
    { value: pad(timeRemaining.seconds), label: "sec" },
  ];

  return (
    <>
      <div
        className="signup__countdown"
        aria-label={`${timeRemaining.days} days until release`}
      >
        {units.map((unit) => (
          <div className="signup__unit" key={unit.label}>
            <span className="signup__value">{unit.value}</span>
            <span className="signup__unit-label">{unit.label}</span>
          </div>
        ))}
      </div>
      <p className="signup__countdown-caption">Until release</p>
    </>
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
              className="text-xs leading-relaxed"
              style={{ color: "#6A9955" }}
            >
              {/* Emails will only be used to inform you about release date and
              other marketing leading up to the book. Emails will never be sold
              or given to third parties. */}
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
  interestedInBeta: boolean;
}

function getReferrerFromUrl(): string {
  if (typeof window === "undefined") return "";

  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source");
  const utmMedium = params.get("utm_medium");
  const utmCampaign = params.get("utm_campaign");
  const ref = params.get("ref");

  const parts = [utmSource, utmMedium, utmCampaign, ref].filter(Boolean);
  return parts.join(" | ");
}

function EmailSignupComponent({
  scrollProgress,
}: EmailSignupProps): React.ReactElement | null {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    agreedToContact: false,
    interestedInBeta: false,
  });
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [emailTouched, setEmailTouched] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);

  const isFormValid =
    formData.firstName.trim() !== "" &&
    formData.lastName.trim() !== "" &&
    isValidEmail(formData.email) &&
    formData.agreedToContact &&
    captchaToken !== null;

  const showEmailError =
    emailTouched && formData.email.trim() !== "" && !isValidEmail(formData.email);

  // Email form fades in from 80-88%, stays visible after (gap after blurb ends at 70%)
  const fadeInStart = 0.80;
  const fadeInEnd = 0.88;

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
        const response = await fetch("/api/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            referrer: getReferrerFromUrl(),
            interestedInBeta: formData.interestedInBeta,
            captchaToken,
          }),
        });

        if (!response.ok) {
          throw new Error("Subscription failed");
        }

        setStatus("success");

        // Reaches GTM, PostHog, OpenAI, and Meta through the destination
        // registry. This previously pushed to dataLayer directly, so every
        // destination except GTM was blind to signups.
        trackNewsletterSignup();

        // Legacy dataLayer push, kept because existing GTM triggers may listen
        // for "email_signup" rather than the registry's "newsletter_signup".
        // Safe to delete once GTM is updated.
        if (typeof window !== "undefined" && window.dataLayer) {
          window.dataLayer.push({ event: "email_signup", page: window.location.pathname });
        }
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          agreedToContact: false,
          interestedInBeta: false,
        });
        setEmailTouched(false);
        setCaptchaToken(null);
        captchaRef.current?.resetCaptcha();
      } catch {
        setStatus("error");
        setCaptchaToken(null);
        captchaRef.current?.resetCaptcha();
      }
    },
    [isFormValid, status, formData.firstName, formData.lastName, formData.email, formData.interestedInBeta, captchaToken]
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
      <div className="w-full max-w-md signup">

        <CountdownTimer />

        <p className="signup__heading">{SIGNUP_HEADLINE}</p>

        {status === "success" ? (
          <div className="signup__success">
            <p className="signup__success-title">You&rsquo;re on the list.</p>
            <p className="signup__success-body">
              Check your email and confirm your address. If it is not there,
              look in spam.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="signup__form">
            <div className="signup__row">
              <div className="signup__field">
                <label className="signup__label" htmlFor="signup-first-name">
                  First name
                </label>
                <input
                  id="signup-first-name"
                  type="text"
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                  }
                  required
                  disabled={status === "submitting"}
                  className="signup__input"
                />
              </div>

              <div className="signup__field">
                <label className="signup__label" htmlFor="signup-last-name">
                  Last name
                </label>
                <input
                  id="signup-last-name"
                  type="text"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                  }
                  required
                  disabled={status === "submitting"}
                  className="signup__input"
                />
              </div>
            </div>

            <div className="signup__field">
              <label className="signup__label" htmlFor="signup-email">
                Email address
              </label>
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                onBlur={() => setEmailTouched(true)}
                required
                disabled={status === "submitting"}
                className="signup__input"
                aria-invalid={showEmailError}
                aria-describedby={showEmailError ? "signup-email-error" : undefined}
              />
              {showEmailError && (
                <p className="signup__error" id="signup-email-error" role="alert">
                  That does not look like an email address.
                </p>
              )}
            </div>

            <label className="signup__check">
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
              />
              <span>I agree to be contacted about Bodhi Press publications</span>
            </label>

            <label className="signup__check">
              <input
                type="checkbox"
                checked={formData.interestedInBeta}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    interestedInBeta: e.target.checked,
                  }))
                }
                disabled={status === "submitting"}
              />
              <span>I am requesting an Advanced Reader Copy (ARC)</span>
            </label>

            <div className="signup__captcha">
              <HCaptcha
                ref={captchaRef}
                sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || ""}
                onVerify={(token) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken(null)}
                onError={() => setCaptchaToken(null)}
                theme="dark"
              />
            </div>

            <button
              type="submit"
              disabled={status === "submitting" || !isFormValid}
              className="signup__submit"
            >
              {status === "submitting" ? "Signing up" : "Sign up"}
            </button>

            {status === "error" && (
              <p className="signup__error" role="alert">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        )}

        <footer
          className="mt-12 text-center text-xs"
          style={{
            color: "#6A9955",
          }}
        >
          <p className="mb-1">&copy; 2026 Bodhi Press</p>
          <div className="flex items-center justify-center gap-2">
            <PrivacyPolicy />
          </div>
          <div className="mt-8 flex items-center justify-center gap-6">
            <Image
              src="/images/midnight-coders-logotype.svg"
              alt="The Midnight Coder's Children"
              width={75}
              height={75}
              className="h-[75px] w-auto"
            />
            <Image
              src="/images/bodhi-press.svg"
              alt="Bodhi Press"
              width={75}
              height={75}
              className="h-[75px] w-auto"
            />
          </div>
        </footer>
      </div>
    </div>
  );
}

export const EmailSignup = memo(EmailSignupComponent);
