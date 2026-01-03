"use client";

import { useState, useRef, type FormEvent } from "react";
import Link from "next/link";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { StaticStarField } from "@/components/StaticStarField";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

interface FormData {
  firstName: string;
  lastName: string;
  isTechnical: string;
  technicalThoughts: string;
  timelinePreference: string;
  overallImpressions: string;
  sydneyDescription: string;
  gayathriDescription: string;
  recommendationScore: string;
  audienceThoughts: string;
  autographName: string;
  shippingAddress: string;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  isTechnical: "",
  technicalThoughts: "",
  timelinePreference: "",
  overallImpressions: "",
  sydneyDescription: "",
  gayathriDescription: "",
  recommendationScore: "",
  audienceThoughts: "",
  autographName: "",
  shippingAddress: "",
};

const inputStyles = {
  backgroundColor: "rgba(30, 30, 30, 0.9)",
  borderColor: "rgba(255, 255, 255, 0.2)",
  color: "#9CDCFE",
};

const labelStyles = {
  color: "#6A9955",
};

const requiredIndicator = (
  <span style={{ color: "#f14c4c" }} aria-hidden="true">
    *
  </span>
);

export default function BetaPage(): React.ReactElement {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);

  const isFormValid =
    formData.firstName.trim() !== "" &&
    formData.lastName.trim() !== "" &&
    formData.isTechnical !== "" &&
    formData.timelinePreference !== "" &&
    formData.overallImpressions.trim() !== "" &&
    formData.sydneyDescription.trim() !== "" &&
    formData.gayathriDescription.trim() !== "" &&
    formData.recommendationScore !== "" &&
    captchaToken !== null;

  const handleInputChange = (
    field: keyof FormData,
    value: string
  ): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!isFormValid || status === "submitting") {
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/beta-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          captchaToken,
        }),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setStatus("success");
      setFormData(initialFormData);
      setCaptchaToken(null);
      captchaRef.current?.resetCaptcha();
    } catch {
      setStatus("error");
      setCaptchaToken(null);
      captchaRef.current?.resetCaptcha();
    }
  };

  return (
    <main className="relative min-h-screen">
      <StaticStarField />

      <div className="relative z-10 flex flex-col items-center px-6 py-12 md:py-16">
        <div className="w-full max-w-2xl">
          <header className="text-center mb-12">
            <h1
              className="text-2xl md:text-3xl mb-4"
              style={{ color: "#DCDCAA" }}
            >
              Beta Readers
            </h1>
            <p
              className="text-base md:text-lg mb-4 leading-relaxed"
              style={{ color: "#D4D4D4" }}
            >
              Thank you for reading Midnight Coder&apos;s Children and agreeing
              to provide feedback. Please fill out the form below.
            </p>
            <p
              className="text-sm md:text-base leading-relaxed"
              style={{ color: "#6A9955" }}
            >
              To become a Beta reader,{" "}
              <Link
                href="/"
                className="underline hover:text-white/60 transition-colors"
              >
                fill out the form on the homepage
              </Link>{" "}
              and be sure to check that you&apos;re interested in becoming a
              beta reader.
            </p>
          </header>

          {status === "success" ? (
            <div
              className="py-6 px-8 rounded-lg text-center"
              style={{ backgroundColor: "rgba(39, 201, 63, 0.1)" }}
            >
              <p className="text-lg mb-2" style={{ color: "#4EC9B0" }}>
                {"// Success: Thank you for your feedback!"}
              </p>
              <p style={{ color: "#6A9955" }}>
                Your response has been submitted successfully.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-10">
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label
                    className="block text-sm mb-2"
                    style={labelStyles}
                  >
                    First Name {requiredIndicator}
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    required
                    disabled={status === "submitting"}
                    className="w-full px-4 py-3 text-base rounded-lg border-2 transition-all duration-300 focus:outline-none focus:border-[#569CD6] disabled:opacity-50"
                    style={inputStyles}
                  />
                </div>
                <div className="w-1/2">
                  <label
                    className="block text-sm mb-2"
                    style={labelStyles}
                  >
                    Last Name {requiredIndicator}
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    required
                    disabled={status === "submitting"}
                    className="w-full px-4 py-3 text-base rounded-lg border-2 transition-all duration-300 focus:outline-none focus:border-[#569CD6] disabled:opacity-50"
                    style={inputStyles}
                  />
                </div>
              </div>

              <fieldset>
                <legend className="text-sm mb-3" style={labelStyles}>
                  Are you a software developer or have a similar technical
                  background? {requiredIndicator}
                </legend>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="isTechnical"
                      value="yes"
                      checked={formData.isTechnical === "yes"}
                      onChange={(e) => handleInputChange("isTechnical", e.target.value)}
                      disabled={status === "submitting"}
                      className="w-4 h-4"
                      style={{ accentColor: "#4EC9B0" }}
                    />
                    <span style={{ color: "#D4D4D4" }}>Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="isTechnical"
                      value="no"
                      checked={formData.isTechnical === "no"}
                      onChange={(e) => handleInputChange("isTechnical", e.target.value)}
                      disabled={status === "submitting"}
                      className="w-4 h-4"
                      style={{ accentColor: "#4EC9B0" }}
                    />
                    <span style={{ color: "#D4D4D4" }}>No</span>
                  </label>
                </div>
              </fieldset>

              <div>
                <label className="block text-sm mb-2" style={labelStyles}>
                  If you are technical, do you have thoughts about the technical
                  aspects of the book?
                </label>
                <p
                  className="text-xs mb-2"
                  style={{ color: "rgba(255, 255, 255, 0.5)" }}
                >
                  There is some element of artistic license involved, but
                  overall, what is your impression of the technical accuracy?
                </p>
                <textarea
                  value={formData.technicalThoughts}
                  onChange={(e) => handleInputChange("technicalThoughts", e.target.value)}
                  disabled={status === "submitting"}
                  rows={4}
                  className="w-full px-4 py-3 text-base rounded-lg border-2 transition-all duration-300 focus:outline-none focus:border-[#569CD6] disabled:opacity-50 resize-vertical"
                  style={inputStyles}
                />
              </div>

              <fieldset>
                <legend className="text-sm mb-3" style={labelStyles}>
                  Which timeline resonated most with you as a reader?{" "}
                  {requiredIndicator}
                </legend>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="timelinePreference"
                      value="sydney"
                      checked={formData.timelinePreference === "sydney"}
                      onChange={(e) => handleInputChange("timelinePreference", e.target.value)}
                      disabled={status === "submitting"}
                      className="w-4 h-4"
                      style={{ accentColor: "#4EC9B0" }}
                    />
                    <span style={{ color: "#D4D4D4" }}>
                      The present day timeline, with Sydney as the main
                      character
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="timelinePreference"
                      value="gayathri"
                      checked={formData.timelinePreference === "gayathri"}
                      onChange={(e) => handleInputChange("timelinePreference", e.target.value)}
                      disabled={status === "submitting"}
                      className="w-4 h-4"
                      style={{ accentColor: "#4EC9B0" }}
                    />
                    <span style={{ color: "#D4D4D4" }}>
                      The past tense timeline, with Gayathri as the main
                      character
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="timelinePreference"
                      value="both"
                      checked={formData.timelinePreference === "both"}
                      onChange={(e) => handleInputChange("timelinePreference", e.target.value)}
                      disabled={status === "submitting"}
                      className="w-4 h-4"
                      style={{ accentColor: "#4EC9B0" }}
                    />
                    <span style={{ color: "#D4D4D4" }}>
                      They both resonated with me equally
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="timelinePreference"
                      value="neither"
                      checked={formData.timelinePreference === "neither"}
                      onChange={(e) => handleInputChange("timelinePreference", e.target.value)}
                      disabled={status === "submitting"}
                      className="w-4 h-4"
                      style={{ accentColor: "#4EC9B0" }}
                    />
                    <span style={{ color: "#D4D4D4" }}>Neither</span>
                  </label>
                </div>
              </fieldset>

              <div>
                <label className="block text-sm mb-2" style={labelStyles}>
                  What were your impressions of the book overall?{" "}
                  {requiredIndicator}
                </label>
                <p
                  className="text-xs mb-2"
                  style={{ color: "rgba(255, 255, 255, 0.5)" }}
                >
                  (This question is intentionally vague. Please provide whatever
                  comes to mind, BOTH positive and negative.)
                </p>
                <textarea
                  value={formData.overallImpressions}
                  onChange={(e) => handleInputChange("overallImpressions", e.target.value)}
                  required
                  disabled={status === "submitting"}
                  rows={5}
                  className="w-full px-4 py-3 text-base rounded-lg border-2 transition-all duration-300 focus:outline-none focus:border-[#569CD6] disabled:opacity-50 resize-vertical"
                  style={inputStyles}
                />
              </div>

              <div>
                <label className="block text-sm mb-2" style={labelStyles}>
                  How would you describe Sydney? {requiredIndicator}
                </label>
                <p
                  className="text-xs mb-2"
                  style={{ color: "rgba(255, 255, 255, 0.5)" }}
                >
                  (This question is intentionally vague. Please provide whatever
                  comes to mind.)
                </p>
                <textarea
                  value={formData.sydneyDescription}
                  onChange={(e) => handleInputChange("sydneyDescription", e.target.value)}
                  required
                  disabled={status === "submitting"}
                  rows={4}
                  className="w-full px-4 py-3 text-base rounded-lg border-2 transition-all duration-300 focus:outline-none focus:border-[#569CD6] disabled:opacity-50 resize-vertical"
                  style={inputStyles}
                />
              </div>

              <div>
                <label className="block text-sm mb-2" style={labelStyles}>
                  How would you describe Gayathri? {requiredIndicator}
                </label>
                <p
                  className="text-xs mb-2"
                  style={{ color: "rgba(255, 255, 255, 0.5)" }}
                >
                  (This question is intentionally vague. Please provide whatever
                  comes to mind.)
                </p>
                <textarea
                  value={formData.gayathriDescription}
                  onChange={(e) => handleInputChange("gayathriDescription", e.target.value)}
                  required
                  disabled={status === "submitting"}
                  rows={4}
                  className="w-full px-4 py-3 text-base rounded-lg border-2 transition-all duration-300 focus:outline-none focus:border-[#569CD6] disabled:opacity-50 resize-vertical"
                  style={inputStyles}
                />
              </div>

              <fieldset>
                <legend className="text-sm mb-3" style={labelStyles}>
                  Would you recommend this book to a friend? {requiredIndicator}
                </legend>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between text-xs" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                    <span>Would not recommend</span>
                    <span>Would definitely recommend</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={formData.recommendationScore || "5"}
                      onChange={(e) => handleInputChange("recommendationScore", e.target.value)}
                      disabled={status === "submitting"}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer disabled:opacity-50 recommendation-slider"
                      style={{
                        background: `linear-gradient(to right, #4EC9B0 0%, #4EC9B0 ${((parseInt(formData.recommendationScore || "5") - 1) / 9) * 100}%, rgba(255, 255, 255, 0.2) ${((parseInt(formData.recommendationScore || "5") - 1) / 9) * 100}%, rgba(255, 255, 255, 0.2) 100%)`,
                      }}
                    />
                    <div className="flex justify-between mt-1 px-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <span
                          key={num}
                          className="text-xs"
                          style={{
                            color: formData.recommendationScore === num.toString() ? "#4EC9B0" : "#D4D4D4",
                            fontWeight: formData.recommendationScore === num.toString() ? "bold" : "normal",
                          }}
                        >
                          {num}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-lg" style={{ color: "#4EC9B0" }}>
                      {formData.recommendationScore || "-"}/10
                    </span>
                  </div>
                </div>
              </fieldset>

              <div>
                <label className="block text-sm mb-2" style={labelStyles}>
                  Who is the ideal audience for this book? How would you reach
                  them and raise awareness of this book if you were me?
                </label>
                <textarea
                  value={formData.audienceThoughts}
                  onChange={(e) => handleInputChange("audienceThoughts", e.target.value)}
                  disabled={status === "submitting"}
                  rows={4}
                  className="w-full px-4 py-3 text-base rounded-lg border-2 transition-all duration-300 focus:outline-none focus:border-[#569CD6] disabled:opacity-50 resize-vertical"
                  style={inputStyles}
                />
              </div>

              <div
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: "rgba(30, 30, 30, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <p className="text-sm mb-4" style={labelStyles}>
                  Thank you for reading. If you&apos;d like an autographed copy
                  when the book is published in September 2026, please leave
                  your name and shipping address below.
                </p>
                <div className="flex flex-col gap-4">
                  <div>
                    <label
                      className="block text-sm mb-2"
                      style={{ color: "#D4D4D4" }}
                    >
                      Name for autograph
                    </label>
                    <input
                      type="text"
                      value={formData.autographName}
                      onChange={(e) => handleInputChange("autographName", e.target.value)}
                      disabled={status === "submitting"}
                      className="w-full px-4 py-3 text-base rounded-lg border-2 transition-all duration-300 focus:outline-none focus:border-[#569CD6] disabled:opacity-50"
                      style={inputStyles}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm mb-2"
                      style={{ color: "#D4D4D4" }}
                    >
                      Shipping address
                    </label>
                    <textarea
                      value={formData.shippingAddress}
                      onChange={(e) => handleInputChange("shippingAddress", e.target.value)}
                      disabled={status === "submitting"}
                      rows={3}
                      className="w-full px-4 py-3 text-base rounded-lg border-2 transition-all duration-300 focus:outline-none focus:border-[#569CD6] disabled:opacity-50 resize-vertical"
                      style={inputStyles}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
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
                className="px-8 py-4 text-base md:text-lg font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:translate-y-[-2px]"
                style={{
                  backgroundColor: isFormValid
                    ? "#0e639c"
                    : "rgba(14, 99, 156, 0.4)",
                  color: "#ffffff",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                {status === "submitting" ? "submitting()" : "submitFeedback()"}
              </button>

              {status === "error" && (
                <p
                  className="text-sm text-center"
                  style={{ color: "#f14c4c" }}
                  role="alert"
                >
                  {"// Error: Submission failed. Please try again."}
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
            <Link
              href="/"
              className="underline hover:text-white/60 transition-colors"
            >
              Return to homepage
            </Link>
          </footer>
        </div>
      </div>
    </main>
  );
}
