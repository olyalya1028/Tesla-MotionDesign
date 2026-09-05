"use client";

import { useId, useState } from "react";
import { buttonClasses } from "./Button";
import { useMagneticButton } from "@/hooks/useMagneticButton";

type FieldName = "name" | "email" | "phone";
type Values = Record<FieldName, string>;
type Errors = Partial<Record<FieldName, string>>;
type Status = "idle" | "submitting" | "sent";

const EMPTY_VALUES: Values = { name: "", email: "", phone: "" };

interface FieldSpec {
  name: FieldName;
  label: string;
  type: "text" | "email" | "tel";
  autoComplete: string;
  placeholder: string;
  inputMode?: "email" | "tel";
  hint?: string;
}

const fields: FieldSpec[] = [
  {
    name: "name",
    label: "Full name",
    type: "text",
    autoComplete: "name",
    placeholder: "Bat-Erdene Ganbold",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    autoComplete: "email",
    inputMode: "email",
    placeholder: "name@example.com",
  },
  {
    name: "phone",
    label: "Phone number",
    type: "tel",
    autoComplete: "tel",
    inputMode: "tel",
    placeholder: "+976 8800 1234",
    hint: "Add the country code if you are outside Mongolia.",
  },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values: Values): Errors {
  const errors: Errors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Please enter your name.";
  }

  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Please enter a valid email address, e.g. name@example.com.";
  }

  // Accepts the shapes people actually type — "+976 8800 1234", "8800-1234",
  // "(976) 8800 1234" — and only counts the digits.
  const digits = values.phone.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) {
    errors.phone = "Please enter a phone number with at least 8 digits.";
  }

  return errors;
}

/**
 * Contact block at the foot of the page: name, email and phone, so a visitor
 * who is not ready for the Cal.com booking modal can still leave their
 * details. Everything visual comes from the existing tokens (tailwind.config.ts)
 * and the shared button styling exported by components/Button.tsx.
 */
export function ContactForm() {
  const fieldId = useId();
  const [values, setValues] = useState<Values>(EMPTY_VALUES);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  // Errors only appear after the first submit attempt, then update live while
  // the visitor fixes them — no scolding halfway through typing an email.
  const [validateLive, setValidateLive] = useState(false);
  const { elRef, labelRef } = useMagneticButton<HTMLButtonElement>();

  const inputId = (name: FieldName) => `${fieldId}-${name}`;
  const errorId = (name: FieldName) => `${fieldId}-${name}-error`;
  const hintId = (name: FieldName) => `${fieldId}-${name}-hint`;

  function update(name: FieldName, value: string) {
    const next = { ...values, [name]: value };
    setValues(next);
    if (validateLive) setErrors(validate(next));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const nextErrors = validate(values);
    setErrors(nextErrors);
    setValidateLive(true);

    const firstInvalid = fields.find((field) => nextErrors[field.name]);
    if (firstInvalid) {
      document.getElementById(inputId(firstInvalid.name))?.focus();
      return;
    }

    setStatus("submitting");
    // TODO: POST to the real contact endpoint once one exists — until then the
    // details never leave component state.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setStatus("sent");
  }

  function reset() {
    setValues(EMPTY_VALUES);
    setErrors({});
    setValidateLive(false);
    setStatus("idle");
  }

  return (
    <section
      className="relative bg-scheme3-bg py-section-lg"
      id="contact"
      data-section="contact"
    >
      <div className="w-full px-page">
        <div className="mx-auto w-full max-w-container">
          <article className="flex items-stretch overflow-hidden rounded-card bg-scheme1-bg max-900:flex-col">
            <div className="flex min-w-0 flex-[1_1_45%] flex-col justify-center gap-8 p-12 max-900:flex-[0_0_auto] max-900:p-8">
              <div className="flex flex-col gap-6 text-scheme1-text">
                <h2 className="text-heading-3 font-medium leading-tight2 tracking-heading">
                  <span className="inline-block">Let&rsquo;s Connect</span>
                </h2>
                <p className="text-medium leading-body">
                  Leave your details and a Tesla advisor will get back to you about a
                  test drive, pricing or home charging.
                </p>
              </div>
              <ul className="flex flex-col gap-2 text-regular leading-body text-scheme1-text">
                <li>Answer within one business day</li>
                <li>No obligation, no pushy follow-ups</li>
              </ul>
            </div>

            <div className="flex min-w-0 flex-[1_1_55%] flex-col justify-center border-l border-scheme1-border p-12 max-900:border-l-0 max-900:border-t max-900:p-8">
              {status === "sent" ? (
                <div className="flex flex-col items-start gap-6" role="status">
                  <div className="flex flex-col gap-2 text-scheme1-text">
                    <p className="text-heading-6 font-medium leading-relaxed2 tracking-heading">
                      Thank you, {values.name.trim().split(" ")[0]}.
                    </p>
                    <p className="text-regular leading-body">
                      We have your details and will reach out at{" "}
                      <span className="font-medium">{values.email.trim()}</span> shortly.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={reset}
                    className={buttonClasses({
                      variant: "light",
                      className: "border-scheme1-border",
                    })}
                  >
                    <span lang="mn">Дахин илгээх</span>
                  </button>
                </div>
              ) : (
                <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
                  <div className="flex flex-col gap-5">
                    {fields.map((field) => {
                      const error = validateLive ? errors[field.name] : undefined;
                      const describedBy =
                        [
                          error ? errorId(field.name) : null,
                          field.hint && !error ? hintId(field.name) : null,
                        ]
                          .filter(Boolean)
                          .join(" ") || undefined;

                      return (
                        <div key={field.name} className="flex flex-col gap-2">
                          <label
                            htmlFor={inputId(field.name)}
                            className="text-regular font-medium leading-body text-scheme1-text"
                          >
                            {field.label}
                          </label>
                          <input
                            id={inputId(field.name)}
                            name={field.name}
                            type={field.type}
                            inputMode={field.inputMode}
                            autoComplete={field.autoComplete}
                            placeholder={field.placeholder}
                            value={values[field.name]}
                            onChange={(event) => update(field.name, event.target.value)}
                            aria-invalid={error ? true : undefined}
                            aria-describedby={describedBy}
                            className={[
                              "w-full rounded-btn border bg-scheme1-bg px-4 py-3 text-regular leading-body text-scheme1-text",
                              "placeholder:text-scheme1-text/40",
                              error ? "border-form-error" : "border-scheme1-border",
                            ].join(" ")}
                          />
                          {field.hint && !error && (
                            <p
                              id={hintId(field.name)}
                              className="text-small leading-body text-scheme1-text/60"
                            >
                              {field.hint}
                            </p>
                          )}
                          {error && (
                            <p
                              id={errorId(field.name)}
                              className="text-small leading-body text-form-error"
                            >
                              {error}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      ref={elRef}
                      type="submit"
                      disabled={status === "submitting"}
                      className={buttonClasses({
                        variant: "primary",
                        className: "self-start disabled:opacity-60 max-480:self-stretch",
                      })}
                    >
                      <span ref={labelRef} lang="mn">
                        {status === "submitting" ? "Илгээж байна…" : "Хүсэлт илгээх"}
                      </span>
                    </button>
                    <p className="text-small leading-body text-scheme1-text/60">
                      We only use your details to reply to this request.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
