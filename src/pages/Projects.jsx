import { projects } from "../data/dummyData";
import { StatusBadge } from "./Dashboard";

export default function Projects() {
  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Projects</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your workspace projects.
        </p>
      </div>

      <div className="overflow-x-auto border border-slate-200 bg-white
        dark:border-slate-800 dark:bg-slate-950">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500
            dark:bg-slate-900">
            <tr>
              <th className="px-5 py-4">Project</th>
              <th className="px-5 py-4">Owner</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Progress</th>
              <th className="px-5 py-4">Due date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                <td className="px-5 py-4 font-medium">{project.name}</td>
                <td className="px-5 py-4">{project.owner}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={project.status} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 bg-slate-100 dark:bg-slate-800">
                      <div className="h-full bg-blue-600"
                        style={{ width: `${project.progress}%` }} />
                    </div>
                    <span>{project.progress}%</span>
                  </div>
                </td>
                <td className="px-5 py-4">{project.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}