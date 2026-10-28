import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center
      justify-center text-center">
      <p className="text-6xl font-bold text-slate-300">404</p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-sm text-slate-500">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-md
          bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
        <ArrowLeft size={16} /> Back to dashboard
      </Link>
    </div>
  );
}