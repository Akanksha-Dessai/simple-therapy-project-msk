import AdminPanel from "@/components/admin-panel";

export default function Admin() {
  return (
    <div className="min-h-screen bg-neutral-light dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminPanel />
      </div>
    </div>
  );
}
