// To restore pricing: import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react"
import { FormEvent, ReactNode, useMemo, useState } from "react"

type FormData = {
  age: string
  location: string
  company: string
  sessionDuration: string
  reasonablePrice: string
  expectsGroupDiscount: string
  smash: string[]
  length: string
  likelihood: string
  comments: string
}

const initialForm: FormData = {
  age: "",
  location: "",
  company: "",
  sessionDuration: "",
  reasonablePrice: "",
  expectsGroupDiscount: "",
  smash: [],
  length: "",
  likelihood: "",
  comments: "",
}

const track = (event: string, detail?: Record<string, unknown>) => {
  window.dispatchEvent(
    new CustomEvent("rage-room-event", { detail: { event, ...detail } }),
  )
}

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID as string | undefined

async function sendToFormspree(payload: Record<string, unknown>) {
  if (!FORMSPREE_ID) throw new Error("Missing VITE_FORMSPREE_ID")
  const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error(`Formspree responded ${response.status}`)
}

function Arrow({ direction = "right" }: { direction?: "right" | "down" }) {
  return (
    <svg
      className={direction === "down" ? "rotate-90" : ""}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.75 9h10.5M10 4.75 14.25 9 10 13.25"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  )
}

function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string
  title: string
  text?: string
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {text && <p className="section-copy">{text}</p>}
    </div>
  )
}

function Button({
  children,
  variant = "primary",
  type = "button",
  onClick,
  disabled,
  className = "",
}: {
  children: ReactNode
  variant?: "primary" | "secondary" | "quiet"
  type?: "button" | "submit"
  onClick?: () => void
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`button button-${variant} ${className}`}
    >
      <span>{children}</span>
      {variant !== "quiet" && <Arrow />}
    </button>
  )
}

function ChoiceGroup({
  label,
  options,
  value,
  onChange,
  multi = false,
  error,
}: {
  label: string
  options: string[]
  value: string | string[]
  onChange: (value: string) => void
  multi?: boolean
  error?: string
}) {
  const selected = (option: string) =>
    Array.isArray(value) ? value.includes(option) : value === option

  return (
    <fieldset className="question">
      <legend>{label}</legend>
      <div className="choice-grid">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={selected(option)}
            onClick={() => onChange(option)}
            className={`choice ${selected(option) ? "selected" : ""}`}
          >
            <span className={multi ? "checkbox-dot" : "radio-dot"} />
            {option}
          </button>
        ))}
      </div>
      {error && <p className="field-error">{error}</p>}
    </fieldset>
  )
}

function Icon({ type }: { type: "approved" | "safe" | "people" }) {
  if (type === "approved") {
    return (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="m10 5 3 8-7 3 8 2-2 9 6-7 7 4-4-8 6-4-9 1-2-8-2 7-4-7Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (type === "safe") {
    return (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="M16 3.5 26 8v7c0 6.5-4.2 11-10 13.5C10.2 26 6 21.5 6 15V8l10-4.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="m11.5 16 3 3 6-7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="22" cy="13" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4.5 26c.8-5 3.3-7.5 7.5-7.5S18.7 21 19.5 26M19 19.5c4.8-.8 7.6 1.4 8.5 6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function App() {
  const [form, setForm] = useState<FormData>(initialForm)
  const [step, setStep] = useState(0)
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [earlyChoice, setEarlyChoice] = useState<"yes" | "no" | null>(null)
  const [reservation, setReservation] = useState({
    name: "",
    phone: "",
    email: "",
  })
  const [reservationError, setReservationError] = useState("")
  const [paid, setPaid] = useState(false)
  const [sending, setSending] = useState(false)
  const [feedbackId, setFeedbackId] = useState("")

  // Removed with the pricing section; restore alongside it (needs useEffect, useRef imports):
  // const packagesRef = useRef<HTMLElement>(null)
  // useEffect(() => {
  //   const node = packagesRef.current
  //   if (!node) return
  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       if (entry.isIntersecting) {
  //         track("package_viewed")
  //         observer.disconnect()
  //       }
  //     },
  //     { threshold: 0.45 },
  //   )
  //   observer.observe(node)
  //   return () => observer.disconnect()
  // }, [])

  const progress = useMemo(() => ((step + 1) / 3) * 100, [step])

  const scrollTo = (id: string, event?: string) => {
    if (event) track(event)
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const setField = (key: keyof FormData, value: string) => {
    setError("")
    setForm((current) => ({ ...current, [key]: value }))
  }

  const toggleSmash = (value: string) => {
    setError("")
    setForm((current) => ({
      ...current,
      smash: current.smash.includes(value)
        ? current.smash.filter((item) => item !== value)
        : [...current.smash, value],
    }))
  }

  const nextStep = () => {
    const valid =
      step === 0
        ? form.age && form.location.trim() && form.company
        : step === 1
          ? form.sessionDuration && form.reasonablePrice && form.smash.length > 0
          : form.likelihood
    if (!valid) {
      setError("Choose an answer for each question to continue.")
      return
    }
    if (step < 2) {
      setStep((current) => current + 1)
      track("feedback_step_completed", { step: step + 1 })
      document
        .getElementById("feedback-card")
        ?.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  const submitFeedback = async (event: FormEvent) => {
    event.preventDefault()
    if (sending) return
    if (!form.likelihood) {
      setError("Choose an answer for each question to continue.")
      return
    }
    const id = `fb-${Date.now().toString(36)}`
    setSending(true)
    try {
      await sendToFormspree({
        type: "feedback",
        feedback_id: id,
        ...form,
        smash: form.smash.join(", "),
      })
    } catch (err) {
      console.error("Feedback submission failed:", err)
      setError("Couldn't send your feedback. Please try again.")
      setSending(false)
      return
    }
    setSending(false)
    setFeedbackId(id)
    setSubmitted(true)
    track("feedback_submitted", { form })
    requestAnimationFrame(() =>
      document
        .getElementById("early-access")
        ?.scrollIntoView({ behavior: "smooth", block: "center" }),
    )
  }

  const reserve = async (event: FormEvent) => {
    event.preventDefault()
    if (sending) return
    if (
      !reservation.name.trim() ||
      !/^\+?[0-9\s-]{8,15}$/.test(reservation.phone)
    ) {
      setReservationError("Enter your first name and a valid WhatsApp number.")
      return
    }
    setReservationError("")
    setSending(true)
    try {
      await sendToFormspree({
        type: "early_access",
        feedback_id: feedbackId,
        name: reservation.name.trim(),
        phone: reservation.phone.trim(),
        email: reservation.email.trim(),
        amount_intent: 99,
      })
    } catch (err) {
      console.error("Reservation submission failed:", err)
      setReservationError("Couldn't send your details. Please try again.")
      setSending(false)
      return
    }
    setSending(false)
    setPaid(true)
    track("reservation_interest_confirmed", { amount_intent: 99 })
  }

  return (
    <main>
      <section className="hero" id="top">
        <header className="topbar page-shell">
          <a href="#top" className="logo" aria-label="Rage Room Siliguri home">
            <BrandMark />
            <span>RRS</span>
          </a>
          <button
            className="top-link"
            onClick={() => scrollTo("feedback", "feedback_started")}
          >
            Share your thoughts <Arrow />
          </button>
        </header>

        <div className="hero-grid page-shell">
          <div className="hero-copy">
            <div className="status-pill">
              <span /> Siliguri · Concept stage
            </div>
            <p className="hero-kicker">An idea for Siliguri</p>
            <h1>
              Would you try a
              <br />
              <em>rage room?</em>
            </h1>
            <p className="hero-text">
              We’re exploring bringing a completely different entertainment
              experience to Siliguri.
              <br />
              Before we build it, we want to hear from you.
            </p>
            <div className="hero-actions">
              <Button
                onClick={() => scrollTo("experience", "experience_cta_clicked")}
              >
                Explore the idea
              </Button>
              <button
                className="top-link"
                onClick={() => scrollTo("feedback", "feedback_started")}
              >
                Share your thoughts <Arrow />
              </button>
            </div>
          </div>
          <div
            className="hero-visual"
            aria-label="Abstract orange light cutting through a dark space"
          >
            <img
              src="https://images.unsplash.com/photo-1670270837735-41e5c2a9ca4a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=82&w=1400"
              alt=""
            />
            <div className="visual-label">
              <span>Proposed experience</span>
              <strong>Controlled. Safe. Unforgettable.</strong>
            </div>
            <div className="visual-number">01</div>
          </div>
        </div>
        <div className="hero-ticker" aria-hidden="true">
          <span>SMASH</span>
          <i>✦</i>
          <span>RESET</span>
          <i>✦</i>
          <span>REPEAT</span>
          <i>✦</i>
          <span>SILIGURI</span>
        </div>
      </section>

      <section className="light-section section-pad" id="experience">
        <div className="page-shell">
          <SectionHeading
            eyebrow="The concept"
            title="What is a Rage Room?"
            text="A controlled entertainment experience where you gear up, grab a provided tool, and smash approved breakable items in a purpose-built space."
          />
          <p className="concept-line">
            Think less “anger management.”
            <br />
            Think more “a completely different day out.”
          </p>
          <div className="concept-grid">
            {[
              {
                icon: "approved" as const,
                number: "01",
                title: "Smash",
                text: "Approved breakable items",
              },
              {
                icon: "safe" as const,
                number: "02",
                title: "Safe",
                text: "Protective equipment provided",
              },
              {
                icon: "people" as const,
                number: "03",
                title: "Experience",
                text: "Come solo or with your people",
              },
            ].map((item) => (
              <article className="concept-card" key={item.title}>
                <span className="concept-number">{item.number}</span>
                <div className="concept-icon">
                  <Icon type={item.icon} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="process-section section-pad">
        <div className="page-shell">
          <SectionHeading
            eyebrow="The proposed experience"
            title="How would it work?"
          />
          <div className="process-list">
            {[
              ["Gear up", "Safety equipment provided"],
              ["Choose your tool", "Provided for you"],
              ["Smash", "Approved breakable items"],
              ["Capture the moment", "Keep the memory"],
            ].map(([item, note], index) => (
              <div className="process-item" key={item}>
                <span>0{index + 1}</span>
                <strong>
                  {item}
                  <small>{note}</small>
                </strong>
                {/* <i>
                  <Arrow direction="down" />
                </i> */}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="audience-section">
        <div className="page-shell audience-inner">
          <div>
            <p className="eyebrow">Made for your crew</p>
            <h2>A different kind of plan for your next day out.</h2>
          </div>
          <div
            className="audience-chips"
            aria-label="Who the experience is for"
          >
            {["Friends", "Couples", "Solo", "Birthdays", "Groups"].map(
              (item, index) => (
                <span key={item}>
                  <b>0{index + 1}</b>
                  {item}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Removed for demand validation. Restore for future reference:
      <section
        className="pricing-section section-pad"
        id="packages"
        ref={packagesRef}
      >
        <div className="page-shell">
          <SectionHeading
            eyebrow="Initial pricing"
            title="More people. Better value."
          />
          <div className="pricing-notice">
            <strong>Starting at ₹499 solo</strong>
            <p>
              These are test prices, not final prices and your feedback will
              help us get them right.
            </p>
          </div>
          <div className="pricing-grid">
            {[
              ["Solo", "1 person", "499", "₹499 / person"],
              ["Duo", "2 people", "899", "₹450 / person"],
              ["Trio", "3 people", "1,249", "₹416 / person"],
              ["Squad", "4 people", "1,599", "₹400 / person"],
            ].map(([name, people, price, perPerson], index) => (
              <article
                className={`price-card tier-${index + 1} ${
                  index === 3 ? "featured" : ""
                }`}
                key={name}
              >
                <div className="price-top">
                  <span>0{index + 1}</span>
                  <div
                    className="people-visual"
                    aria-label={`${index + 1} ${
                      index === 0 ? "person" : "people"
                    }`}
                  >
                    {Array.from({ length: index + 1 }).map((_, personIndex) => (
                      <i key={personIndex} />
                    ))}
                  </div>
                  {index === 3 && <b>Best value</b>}
                </div>
                <div className="tier-name">
                  <h3>{name}</h3>
                  <p className="people-count">{people}</p>
                </div>
                <div className="price">
                  <sup>₹</sup>
                  {price}
                </div>
                <p className="total-label">Total</p>
                <div className="per-person">
                  <span>Per person</span>
                  <strong>{perPerson.replace(" / person", "")}</strong>
                </div>
              </article>
            ))}
          </div>
          <div className="pricing-callout">
            <div>
              <span>Your feedback changes this</span>
              <strong>What feels fair to you?</strong>
              <p>
                Tell us what you’d actually pay. We’ll use Siliguri’s answers to
                shape the final packages and pricing.
              </p>
            </div>
            <Button
              onClick={() => scrollTo("feedback", "pricing_feedback_clicked")}
            >
              Set your price
            </Button>
          </div>
        </div>
      </section>
      */}

      <section className="pricing-section section-pad">
        <div className="page-shell">
          <SectionHeading
            eyebrow="Still in the works"
            title="Help us shape the experience"
          />
          <p className="section-copy">
            We’re still figuring out the details.
            <br />
            <br />
            Who would you come with?
            <br />
            What would you want to smash?
            <br />
            How long should the experience be?
            <br />
            And what would feel worth paying for?
          </p>
          <Button
            onClick={() => scrollTo("feedback", "pricing_feedback_clicked")}
          >
            Share your thoughts
          </Button>
        </div>
      </section>

      <section className="feedback-intro section-pad">
        <div className="page-shell intro-grid">
          <p className="eyebrow">Your city. Your call.</p>
          <div>
            <h2>
              Help us build
              <br />
              this <em>right.</em>
            </h2>
            <p>
              We’re exploring bringing this experience to Siliguri. Before we
              build it, we want to know what you’d actually want.
            </p>
            <Button onClick={() => scrollTo("feedback", "feedback_started")}>
              Share your thoughts
            </Button>
          </div>
        </div>
      </section>

      <section className="form-section section-pad" id="feedback">
        <div className="form-shell">
          {!submitted ? (
            <>
              <div className="form-header">
                <div>
                  <p className="eyebrow">
                    Your input shapes the experience · 2 minutes
                  </p>
                  <h2>Shape the experience</h2>
                </div>
                <span>{step + 1} / 3</span>
              </div>
              <div className="progress" aria-label={`Step ${step + 1} of 3`}>
                <i style={{ width: `${progress}%` }} />
              </div>
              <form id="feedback-card" onSubmit={submitFeedback}>
                {step === 0 && (
                  <div className="form-step">
                    <ChoiceGroup
                      label="01 — What is your age range?"
                      options={["18–21", "22–25", "26–30", "31–35", "35+"]}
                      value={form.age}
                      onChange={(value) => setField("age", value)}
                    />
                    <label className="question">
                      <span>02 — Preferred location in Siliguri?</span>
                      <input
                        value={form.location}
                        onChange={(e) => setField("location", e.target.value)}
                        placeholder="Area or locality"
                        autoComplete="address-level2"
                      />
                    </label>
                    <ChoiceGroup
                      label="03 — Who would you most likely come with?"
                      options={[
                        "Solo",
                        "Partner",
                        "2–3 Friends",
                        "4+ Friends",
                        "Birthday / Group",
                      ]}
                      value={form.company}
                      onChange={(value) => setField("company", value)}
                    />
                  </div>
                )}
                {step === 1 && (
                  <div className="form-step">
                    {/* Removed package question (restore with `package` in FormData/initialForm/nextStep):
                    <ChoiceGroup
                      label="04 — Which package sounds most interesting?"
                      options={[
                        "₹499 Solo",
                        "₹899 Duo",
                        "₹1,249 Trio",
                        "₹1,599 Squad",
                      ]}
                      value={form.package}
                      onChange={(value) => setField("package", value)}
                    />
                    Previous price question:
                    <ChoiceGroup
                      label="05 — What price feels reasonable?"
                      options={[
                        "Below ₹600",
                        "₹600–₹900",
                        "₹900–₹1,200",
                        "₹1,200+",
                      ]}
                      value={form.price}
                      onChange={(value) => setField("price", value)}
                    />
                    */}
                    <ChoiceGroup
                      label="04 — How long would you want the actual smashing session to last?"
                      options={[
                        "5-10 minutes",
                        "10-15 minutes",
                        "15-20 minutes",
                        "20-30 minutes",
                        "Not sure",
                      ]}
                      value={form.sessionDuration}
                      onChange={(value) => setField("sessionDuration", value)}
                    />
                    <ChoiceGroup
                      label="05 — What would you consider a reasonable price per person for the experience?"
                      options={[
                        "Under ₹300",
                        "₹300-₹499",
                        "₹500-₹699",
                        "₹700-₹899",
                        "₹900+",
                      ]}
                      value={form.reasonablePrice}
                      onChange={(value) => setField("reasonablePrice", value)}
                    />
                    {/* Removed (restore with expectsGroupDiscount in validation):
                    <ChoiceGroup
                      label="06 — Would you expect the price per person to be lower when coming as a group?"
                      options={["Yes", "No", "Doesn't matter to me"]}
                      value={form.expectsGroupDiscount}
                      onChange={(value) =>
                        setField("expectsGroupDiscount", value)
                      }
                    />
                    */}
                    <ChoiceGroup
                      label="06 — What would you most like to smash?"
                      options={[
                        "Bottles / Ceramics",
                        "Keyboard / Mouse",
                        "Printer",
                        "Old Electronics",
                        "Furniture",
                        "Other",
                      ]}
                      value={form.smash}
                      onChange={toggleSmash}
                      multi
                    />
                  </div>
                )}
                {step === 2 && (
                  <div className="form-step">
                    {/* Removed (restore with form.length in validation):
                    <ChoiceGroup
                      label="08 — Preferred session length?"
                      options={["10 minutes", "20 minutes", "30 minutes"]}
                      value={form.length}
                      onChange={(value) => setField("length", value)}
                    />
                    */}
                    <ChoiceGroup
                      label="07 — If this opened in Siliguri, would you try it?"
                      options={[
                        "Definitely",
                        "Probably",
                        "Maybe",
                        "Probably not",
                      ]}
                      value={form.likelihood}
                      onChange={(value) => setField("likelihood", value)}
                    />
                    <label className="question">
                      <span>
                        08 — Anything else we should know?{" "}
                        <small>Optional</small>
                      </span>
                      <textarea
                        rows={3}
                        value={form.comments}
                        onChange={(e) => setField("comments", e.target.value)}
                        placeholder="Ideas, concerns or suggestions"
                      />
                    </label>
                  </div>
                )}
                {error && (
                  <p className="form-error" role="alert">
                    {error}
                  </p>
                )}
                <div className="form-actions">
                  {step > 0 && (
                    <Button
                      variant="quiet"
                      onClick={() => {
                        setStep(step - 1)
                        setError("")
                      }}
                    >
                      Back
                    </Button>
                  )}
                  {step < 2 ? (
                    <Button onClick={nextStep}>Continue</Button>
                  ) : (
                    <Button type="submit">
                      {sending ? "Sending…" : "Submit feedback"}
                    </Button>
                  )}
                </div>
              </form>
            </>
          ) : paid ? (
            <div className="success-state" id="early-access">
              <div className="success-icon">
                <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
                  <path
                    d="m14 25 7 7 14-16"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="eyebrow">Interest confirmed</p>
              <h2>You’re on the list.</h2>
              <p>
                No payment was taken. The ₹99 question helps us understand how
                many people are genuinely interested.
              </p>
              <p className="success-followup">
                If we move forward, we’ll contact you before public bookings
                open.
              </p>
              <Button onClick={() => scrollTo("top")}>
                Back to the main page
              </Button>
            </div>
          ) : (
            <div className="early-access" id="early-access">
              <div className="submitted-label">
                <span>✓</span> Feedback submitted
              </div>
              {!earlyChoice && (
                <>
                  <SectionHeading
                    eyebrow="One last thing"
                    title="Want Early Access?"
                    text="If Rage Room Siliguri launches, would you like priority access to the first booking slots?"
                  />
                  <div className="early-choices">
                    <Button
                      onClick={() => {
                        setEarlyChoice("yes")
                        track("early_access_yes")
                      }}
                    >
                      Yes, I’m interested
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setEarlyChoice("no")
                        track("early_access_no")
                      }}
                    >
                      No, just my feedback
                    </Button>
                  </div>
                  <p className="no-pressure">
                    No pressure. Both answers are equally helpful.
                  </p>
                </>
              )}
              {earlyChoice === "no" && (
                <div className="thanks-state">
                  <p className="eyebrow">That’s all</p>
                  <h2>Thanks for helping us shape the experience.</h2>
                  <p>No further action required.</p>
                </div>
              )}
              {earlyChoice === "yes" && (
                <div className="reserve-layout">
                  <div className="reserve-copy">
                    <p className="eyebrow">Founding access</p>
                    <h2>Reserve Early Access</h2>
                    <div className="reserve-price">
                      <sup>₹</sup>99
                    </div>
                    <p>
                      Tell us if you’d genuinely reserve priority access at this
                      price.
                    </p>
                    <ul>
                      <li>
                        ₹99 would be adjusted against your first booking if we
                        launch
                      </li>
                    </ul>
                  </div>
                  <form className="reserve-form" onSubmit={reserve}>
                    <label>
                      First name
                      <input
                        value={reservation.name}
                        onChange={(e) =>
                          setReservation({
                            ...reservation,
                            name: e.target.value,
                          })
                        }
                        placeholder="Your first name"
                        autoComplete="given-name"
                      />
                    </label>
                    <label>
                      WhatsApp number
                      <input
                        value={reservation.phone}
                        onChange={(e) =>
                          setReservation({
                            ...reservation,
                            phone: e.target.value,
                          })
                        }
                        placeholder="+91 98765 43210"
                        inputMode="tel"
                        autoComplete="tel"
                      />
                    </label>
                    <label>
                      Email <small>Optional</small>
                      <input
                        type="email"
                        value={reservation.email}
                        onChange={(e) =>
                          setReservation({
                            ...reservation,
                            email: e.target.value,
                          })
                        }
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                    </label>
                    {reservationError && (
                      <p className="form-error" role="alert">
                        {reservationError}
                      </p>
                    )}
                    <Button type="submit">
                      {sending ? "Sending…" : "Confirm ₹99 interest"}
                    </Button>
                    <p className="secure-note">
                      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <rect
                          x="4"
                          y="8"
                          width="12"
                          height="9"
                          rx="2"
                          stroke="currentColor"
                        />
                        <path
                          d="M7 8V6a3 3 0 0 1 6 0v2"
                          stroke="currentColor"
                        />
                      </svg>
                      Secure confirmation · No charge today
                    </p>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {!submitted && (
        <aside className="feedback-dock" aria-label="Feedback invitation">
          <div>
            <span>Pricing is flexible</span>
            <strong>You help decide what’s fair.</strong>
          </div>
          <button
            onClick={() => scrollTo("feedback", "sticky_feedback_started")}
          >
            Give feedback <Arrow />
          </button>
        </aside>
      )}

      <footer>
        <div className="page-shell footer-grid">
          <div>
            <a href="#top" className="logo">
              <BrandMark />
              <span>Rage Room Siliguri</span>
            </a>
            <p>Coming soon.</p>
          </div>
          <div className="footer-links">
            <a
              href="https://www.instagram.com/nolimits.exp/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
              Instagram
            </a>
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#early-terms">Early Access Terms</a>
          </div>
          <p className="disclaimer">
            Concept currently under validation. Final experience, location and
            details may change.
          </p>
        </div>
      </footer>
    </main>
  )
}

export default App
