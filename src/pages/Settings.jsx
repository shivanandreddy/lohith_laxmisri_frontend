import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Palette, Check, Save } from "lucide-react";

export default function Settings() {
  const { currentTheme, setTheme, themes } = useTheme();
  const [name, setName] = useState("Shiva Reddy");
  const [email, setEmail] = useState("shiva@example.com");
  const [notifications, setNotifications] = useState(true);
  const [selectedThemeId, setSelectedThemeId] = useState(currentTheme.id);
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setTheme(selectedThemeId);
    setMessage("Settings and theme preferences saved successfully!");
  }

  return (
    <section className="max-w-3xl space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your profile, preferences, and application appearance.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
      

        {/* Theme Customization Card */}
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-2 border-b pb-3 dark:border-slate-800">
            <Palette size={18} className="text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-semibold">Appearance & Theme Palette</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select an accent theme for your dashboard and storefront interfaces.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {themes.map((t) => {
              const isSelected = selectedThemeId === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => {
                    setSelectedThemeId(t.id);
                    setTheme(t.id); // Instant live preview
                  }}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/30 ring-1 ring-blue-600"
                      : "border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-6 w-6 rounded-full shadow-inner border border-black/10 shrink-0"
                      style={{ backgroundColor: t.accent }}
                    />
                    <div>
                      <p className="text-xs font-semibold">{t.name}</p>
                    </div>
                  </div>
                  {isSelected && <Check size={16} className="text-blue-600 dark:text-blue-400" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 shadow"
          >
            <Save size={16} />
            Save preferences
          </button>

          {message && (
            <p role="status" className="text-sm font-medium text-emerald-600 dark:text-emerald-400 animate-[fadeIn_0.2s_ease-out]">
              {message}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}