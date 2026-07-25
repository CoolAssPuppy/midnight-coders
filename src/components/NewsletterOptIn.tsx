"use client";

/**
 * Newsletter opt-in shown beside the checkout button.
 *
 * This replaces Stripe's own `consent_collection.promotions` checkbox, which
 * cannot be pre-checked, cannot be reworded, and only renders for US customers
 * on US accounts. Everyone outside the US never saw it and could not opt in at
 * all. Owning the control means the wording, the default, and who sees it are
 * all ours.
 *
 * Checked by default. The choice rides to Stripe in session metadata and the
 * purchase webhook subscribes only when it is true.
 */
export function NewsletterOptIn({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}): React.ReactElement {
  return (
    <label className="checkout__optin">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}
