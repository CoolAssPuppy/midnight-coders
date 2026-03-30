interface HCaptchaVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
}

export async function verifyCaptcha(token: string): Promise<boolean> {
  const secret = process.env.HCAPTCHA_SECRET_KEY;

  if (!secret) {
    console.error("HCAPTCHA_SECRET_KEY environment variable is not set");
    return false;
  }

  try {
    const response = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret,
        response: token,
      }),
    });

    const data: HCaptchaVerifyResponse = await response.json();
    return data.success;
  } catch (error) {
    console.error("hCaptcha verification error:", error);
    return false;
  }
}
