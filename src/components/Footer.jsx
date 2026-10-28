export default function Footer() {
  return (
    <footer className="flex flex-col gap-2 border-t border-slate-200
      px-4 py-4 text-xs text-slate-500 sm:flex-row sm:items-center
      sm:justify-between sm:px-6 dark:border-slate-800">
      <p>© 2026 WorkSpace. All rights reserved.</p>

      <div className="flex gap-4">
        <a href="#help" className="hover:text-blue-600">Help</a>
        <a href="#privacy" className="hover:text-blue-600">Privacy</a>
        <a href="#terms" className="hover:text-blue-600">Terms</a>
      </div>
    </footer>
  );
}