import { useState } from "react";

export default function Settings() {
  const [name, setName] = useState("Shiva Reddy");
  const [email, setEmail] = useState("shiva@example.com");
  const [notifications, setNotifications] = useState(true);
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("Demo settings saved in the current page state.");
  }

  return (
    <section className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your profile and preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit}
        className="space-y-5 border border-slate-200 bg-white p-5
          dark:border-slate-800 dark:bg-slate-950">

        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Full name
          </label>
          <input id="name" value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-transparent
              px-3 py-2 text-sm outline-none focus:border-blue-500
              dark:border-slate-700" />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email address
          </label>
          <input id="email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-transparent
              px-3 py-2 text-sm outline-none focus:border-blue-500
              dark:border-slate-700" />
        </div>

        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className="h-4 w-4 accent-blue-600" />
          Enable notifications
        </label>

        <button type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm
            font-medium text-white hover:bg-blue-700">
          Save settings
        </button>

        {message && (
          <p role="status" className="text-sm text-emerald-600">{message}</p>
        )}
      </form>
    </section>
  );
}