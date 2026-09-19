"use client";

import { useState } from "react";
import { CheckCircle2, FileUp, Mail, Phone, Send } from "lucide-react";

const projectTypes = [
  "Discovery and fixed scope",
  "Engineering partnership",
  "Platform build",
  "Product modernization",
  "AI-enabled systems",
  "Other",
];

const currentStages = [
  "Discovery",
  "Architecture",
  "Implementation",
  "Launch",
  "Support",
];
const designReadinessOptions = [
  "Architecture docs",
  "Reference material",
  "Existing product",
  "No design yet",
];
const platformOptions = [
  "Web",
  "Mobile",
  "Backend APIs",
  "Admin tooling",
  "Infrastructure",
];
const featureOptions = [
  "Authentication",
  "AI workflows",
  "Realtime updates",
  "Notifications",
  "Analytics",
  "File Uploads",
  "Integrations",
  "Role-based access",
  "Automation workflows",
];
const budgetOptions = [
  "Under ₹25k",
  "₹25k–₹75k",
  "₹75k–₹2L",
  "₹2L–₹5L",
  "₹5L+",
];
const timelineOptions = ["ASAP", "Within 1 Month", "1–3 Months", "Flexible"];
const decisionMakerOptions = ["Yes", "No", "Partially"];

type AttachmentSummary = { name: string; type: string; size: number };

export function ProjectInquiryForm() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const formData = new FormData(event.currentTarget);
    const selectedPlatforms = formData.getAll("platformsRequired").map(String);
    if (selectedPlatforms.length === 0) {
      setStatus("error");
      return;
    }
    const attachments = Array.from(formData.getAll("attachments"))
      .filter((item): item is File => item instanceof File && item.size > 0)
      .map<AttachmentSummary>((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
      }));

    const payload = {
      fullName: String(formData.get("fullName") || ""),
      emailAddress: String(formData.get("emailAddress") || ""),
      whatsappNumber: String(formData.get("whatsappNumber") || ""),
      companyName: String(formData.get("companyName") || ""),
      websiteProductLink: String(formData.get("websiteProductLink") || ""),
      projectOverview: String(formData.get("projectOverview") || ""),
      projectType: String(formData.get("projectType") || ""),
      currentStage: String(formData.get("currentStage") || ""),
      designReadiness: String(formData.get("designReadiness") || ""),
      referenceLinks: String(formData.get("referenceLinks") || ""),
      platformsRequired: selectedPlatforms,
      featuresRequired: formData.getAll("featuresRequired").map(String),
      importantRequirements: String(
        formData.get("importantRequirements") || "",
      ),
      estimatedBudget: String(formData.get("estimatedBudget") || ""),
      expectedTimeline: String(formData.get("expectedTimeline") || ""),
      decisionMaker: String(formData.get("decisionMaker") || ""),
      attachments,
      anythingElse: String(formData.get("anythingElse") || ""),
    };

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setStatus(response.ok ? "success" : "error");
    if (response.ok) event.currentTarget.reset();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-8 rounded-xl border border-white/10 bg-white/4 p-5 sm:p-6 lg:p-7"
    >
      <Section title="Contact">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Full Name"
            name="fullName"
            placeholder="Your full name"
            required
          />
          <TextField
            label="Email Address"
            name="emailAddress"
            placeholder="you@company.com"
            type="email"
            required
            icon={<Mail className="size-4 text-white/40" />}
          />
          <TextField
            label="WhatsApp Number"
            name="whatsappNumber"
            placeholder="+91 98765 43210"
            type="tel"
            required
            icon={<Phone className="size-4 text-white/40" />}
          />
          <TextField
            label="Company / Team Name"
            name="companyName"
            placeholder="Organization or team"
          />
          <TextField
            label="Website / Product Link"
            name="websiteProductLink"
            placeholder="https://..."
          />
        </div>
      </Section>

      <Section title="Project Overview">
        <div className="space-y-4">
          <TextareaField
            label="What are you looking to build?"
            name="projectOverview"
            required
            placeholder="Describe your system, product, workflow, infrastructure need, or idea."
          />
          <div className="grid gap-4 lg:grid-cols-2">
            <RadioField
              label="Project Type"
              name="projectType"
              options={projectTypes}
              required
            />
            <RadioField
              label="Current Stage"
              name="currentStage"
              options={currentStages}
              required
            />
            <RadioField
              label="Do you already have designs or references?"
              name="designReadiness"
              options={designReadinessOptions}
            />
            <TextField
              label="Reference Links (optional)"
              name="referenceLinks"
              placeholder="Competitors, Dribbble, Loom, existing app"
            />
          </div>
        </div>
      </Section>

      <Section title="Requirements">
        <div className="space-y-5">
          <CheckboxField
            label="Platforms Required"
            name="platformsRequired"
            options={platformOptions}
            required
          />
          <CheckboxField
            label="Features Required"
            name="featuresRequired"
            options={featureOptions}
          />
          <TextareaField
            label="Important Requirements"
            name="importantRequirements"
            placeholder="Discovery notes, architecture constraints, integrations, offline mode, scaling requirements, etc."
          />
        </div>
      </Section>

      <Section title="Budget & Timeline">
        <div className="grid gap-4 lg:grid-cols-3">
          <RadioField
            label="Estimated Budget"
            name="estimatedBudget"
            options={budgetOptions}
            required
          />
          <RadioField
            label="Expected Timeline"
            name="expectedTimeline"
            options={timelineOptions}
            required
          />
          <RadioField
            label="Are you the decision maker?"
            name="decisionMaker"
            options={decisionMakerOptions}
          />
        </div>
      </Section>

      <Section title="Final">
        <div className="space-y-4">
          <label className="space-y-2 text-sm text-white/70">
            <span>Upload Files / Designs (optional)</span>
            <div className="flex items-center gap-3 rounded border border-white/10 bg-black/20 px-4 py-3">
              <FileUp className="size-4 text-white/40" />
              <input
                type="file"
                name="attachments"
                multiple
                accept=".pdf,.png,.jpg,.jpeg,.docx"
                className="w-full text-sm text-muted-foreground file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground hover:file:bg-white/15"
              />
            </div>
          </label>

          <TextareaField
            label="Anything else you'd like to share?"
            name="anythingElse"
            rows={5}
            placeholder="Anything useful for scoping or fit."
          />
        </div>
      </Section>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={status === "sending"}
        >
          <Send className="size-4" />
          {status === "sending" ? "Sending..." : "Submit project inquiry"}
        </button>

        <p className="max-w-xl text-sm leading-6 text-white/52">
          I review structured inquiries personally. If the project is a fit,
          I’ll respond with next steps, questions, or a discovery call.
        </p>
      </div>

      {status === "success" ? (
        <p className="flex items-center gap-2 text-sm text-foreground">
          <CheckCircle2 className="size-4" />
          Thanks for submitting your project inquiry. I’ll review the details
          and reach out if the project aligns well.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-red-300">
          Something went wrong. Please try again or email directly.
        </p>
      ) : null}
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <p className="text-sm uppercase tracking-[0.28em] text-emerald-300/75">
        {title}
      </p>
      {children}
    </section>
  );
}

function TextField({
  label,
  icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <label className="space-y-2 text-sm text-muted-foreground">
      <span>{label}</span>
      <div className="flex items-center gap-3 rounded border border-white/10 bg-black/20 px-4 py-3">
        {icon}
        <input
          {...props}
          className="w-full bg-transparent text-foreground outline-none placeholder:text-white/35"
        />
      </div>
    </label>
  );
}

function TextareaField({
  label,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="space-y-2 text-sm text-muted-foreground">
      <span>{label}</span>
      <textarea
        {...props}
        className="w-full rounded border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-foreground outline-none placeholder:text-white/35"
      />
    </label>
  );
}

function RadioField({
  label,
  name,
  options,
  required,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm text-muted-foreground">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option}
            className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/72 transition hover:bg-white/10 has-checked:border-white/20 has-checked:bg-white/10 has-checked:text-foreground"
          >
            <input
              type="radio"
              name={name}
              value={option}
              required={required}
              className="sr-only"
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function CheckboxField({
  label,
  name,
  options,
  required,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm text-muted-foreground">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option}
            className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/72 transition hover:bg-white/10 has-checked:border-white/20 has-checked:bg-white/10 has-checked:text-foreground"
          >
            <input
              type="checkbox"
              name={name}
              value={option}
              className="sr-only"
              aria-required={required || undefined}
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
