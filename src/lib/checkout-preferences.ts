export interface CheckoutPreferences {
  newsletterOptIn: boolean;
  betaReader: boolean;
}

export const DEFAULT_CHECKOUT_PREFERENCES: CheckoutPreferences = {
  newsletterOptIn: true,
  betaReader: false,
};
