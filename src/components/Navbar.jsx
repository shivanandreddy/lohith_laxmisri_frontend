import { Menu } from "lucide-react";

export default function Navbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between
      border-b border-slate-200 bg-white px-4
      dark:border-slate-800 dark:bg-slate-950">

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
          className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu size={22} />
        </button>

        {/* Logo inserted from public folder */}
        <div className="flex items-center gap-2">
          <img 
            src="/logo.png" 
            alt="Laxmi Sri Art Jewellers Logo" 
            className="h-10 w-auto object-contain"
          />
        </div>
      </div>

    </header>
  );
}