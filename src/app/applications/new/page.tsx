import Link from "next/link";
import ApplicationForm from "@/components/ApplicationForm";

export default function NewApplicationPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 space-y-10">
      <div>
        <Link
          href="/applications"
          className="inline-flex items-center gap-1.5 text-[13px] text-ink-mute hover:text-ink mb-6 transition-colors"
        >
          ← Back to applications
        </Link>
        <p className="eyebrow mb-3">New entry</p>
        <h1 className="display-2 text-ink">Add an application</h1>
        <p className="text-[15px] text-ink-mute mt-3 max-w-lg">
          Track a new role you've applied to. You can edit any of these details later.
        </p>
      </div>
      <ApplicationForm mode="create" />
    </div>
  );
}
