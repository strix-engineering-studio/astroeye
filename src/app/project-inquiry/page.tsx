import { PageShell } from "@/components/shared/page-shell"
import { ProjectInquiryForm } from "@/components/contact/project-inquiry-form"

export default function ProjectInquiryPage() {
  return (
    <PageShell
      eyebrow="Project inquiry"
      title="Tell us what you’re building"
      description="Use this form if you want to share more detail about scope, platforms, features, or implementation constraints."
    >
      <ProjectInquiryForm />
    </PageShell>
  )
}