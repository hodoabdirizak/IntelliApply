import ApplicationForm from "@/components/ApplicationForm";

export default function NewApplicationPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">New Application</h1>
        <p className="text-gray-400 mt-1">
          Track a new job application in your pipeline
        </p>
      </div>
      <ApplicationForm mode="create" />
    </div>
  );
}
