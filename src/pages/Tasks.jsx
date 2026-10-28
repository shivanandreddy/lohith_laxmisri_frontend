import { tasks } from "../data/dummyData";
import { StatusBadge } from "./Dashboard";

export default function Tasks() {
  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Tasks</h1>
        <p className="mt-1 text-sm text-slate-500">
          Track work items, priorities, and assignments.
        </p>
      </div>

      <div className="overflow-x-auto border border-slate-200 bg-white
        dark:border-slate-800 dark:bg-slate-950">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500
            dark:bg-slate-900">
            <tr>
              <th className="px-5 py-4">Task ID</th>
              <th className="px-5 py-4">Title</th>
              <th className="px-5 py-4">Project</th>
              <th className="px-5 py-4">Assignee</th>
              <th className="px-5 py-4">Priority</th>
              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                <td className="px-5 py-4 text-blue-600">{task.id}</td>
                <td className="px-5 py-4 font-medium">{task.title}</td>
                <td className="px-5 py-4">{task.project}</td>
                <td className="px-5 py-4">{task.assignee}</td>
                <td className="px-5 py-4">{task.priority}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={task.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}