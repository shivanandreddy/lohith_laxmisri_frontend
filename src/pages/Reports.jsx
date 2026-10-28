import { dashboardStats, projects, tasks } from "../data/dummyData";

export default function Reports() {
  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="mt-1 text-sm text-slate-500">
          Summary of workspace activity using sample data.
        </p>
      </div>

      <div className="overflow-x-auto border border-slate-200 bg-white
        dark:border-slate-800 dark:bg-slate-950">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900">
            <tr>
              <th className="px-5 py-4">Metric</th>
              <th className="px-5 py-4">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {dashboardStats.map((stat) => (
              <tr key={stat.title}>
                <td className="px-5 py-4">{stat.title}</td>
                <td className="px-5 py-4 font-semibold">{stat.value}</td>
              </tr>
            ))}
            <tr>
              <td className="px-5 py-4">Completed Projects (sample)</td>
              <td className="px-5 py-4 font-semibold">{completedProjects}</td>
            </tr>
            <tr>
              <td className="px-5 py-4">Completed Tasks (sample)</td>
              <td className="px-5 py-4 font-semibold">{completedTasks}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}