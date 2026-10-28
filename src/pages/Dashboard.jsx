import { Link } from "react-router-dom";
import {
  FolderKanban,
  CheckSquare,
  CircleCheck,
  Clock3,
  ArrowUpRight,
} from "lucide-react";
import { dashboardStats, tasks, projects } from "../data/dummyData";

const icons = {
  "Total Projects": FolderKanban,
  "Active Tasks": CheckSquare,
  Completed: CircleCheck,
  Overdue: Clock3,
};

const colors = {
  "Total Projects": "text-blue-600 bg-blue-50 dark:bg-blue-950",
  "Active Tasks": "text-violet-600 bg-violet-50 dark:bg-violet-950",
  Completed: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950",
  Overdue: "text-red-600 bg-red-50 dark:bg-red-950",
};

function StatusBadge({ status }) {
  const styles = {
    "In Progress": "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    Active: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    Open: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    Completed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    Planning: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  };

  return (
    <span className={`inline-flex whitespace-nowrap rounded-full px-2.5
      py-1 text-xs font-medium ${styles[status] || styles.Planning}`}>
      {status}
    </span>
  );
}

export { StatusBadge };

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row
        sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Welcome back! Here's what's happening in your workspace.
          </p>
        </div>

        <Link
          to="/projects"
          className="inline-flex items-center justify-center gap-2
            rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium
            text-white hover:bg-blue-700"
        >
          View Projects <ArrowUpRight size={17} />
        </Link>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => {
          const Icon = icons[stat.title];

          return (
            <div key={stat.title} className="border border-slate-200
              bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {stat.title}
                </p>
                <span className={`rounded-md p-2 ${colors[stat.title]}`}>
                  <Icon size={19} />
                </span>
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold">{stat.value}</span>
                <span className="text-xs text-emerald-600">
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="min-w-0 border border-slate-200 bg-white
          dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between border-b
            border-slate-200 px-5 py-4 dark:border-slate-800">
            <h2 className="font-semibold">Recent Projects</h2>
            <Link to="/projects" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {projects.slice(0, 4).map((project) => (
              <div key={project.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {project.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Owner: {project.owner}
                    </p>
                  </div>
                  <StatusBadge status={project.status} />
                </div>

                <div className="mt-3 h-1.5 overflow-hidden bg-slate-100
                  dark:bg-slate-800">
                  <div
                    className="h-full bg-blue-600"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <p className="mt-1 text-right text-xs text-slate-500">
                  {project.progress}% complete
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-0 border border-slate-200 bg-white
          dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between border-b
            border-slate-200 px-5 py-4 dark:border-slate-800">
            <h2 className="font-semibold">Recent Tasks</h2>
            <Link to="/tasks" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500
                dark:bg-slate-900">
                <tr>
                  <th className="px-5 py-3 font-medium">Task</th>
                  <th className="px-5 py-3 font-medium">Priority</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {tasks.slice(0, 4).map((task) => (
                  <tr key={task.id}>
                    <td className="px-5 py-4">
                      <p className="font-medium">{task.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{task.id}</p>
                    </td>
                    <td className="px-5 py-4">{task.priority}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={task.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}