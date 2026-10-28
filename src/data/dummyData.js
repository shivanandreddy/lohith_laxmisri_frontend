export const dashboardStats = [
  { title: "Total Projects", value: 24, change: "+12%", color: "blue" },
  { title: "Active Tasks", value: 48, change: "+8%", color: "violet" },
  { title: "Completed", value: 156, change: "+18%", color: "green" },
  { title: "Overdue", value: 7, change: "-4%", color: "red" },
];

export const projects = [
  {
    id: 1,
    name: "EZOHR Jobs Portal",
    owner: "Shiva",
    status: "In Progress",
    progress: 68,
    dueDate: "2026-11-15",
  },
  {
    id: 2,
    name: "IT Service Management",
    owner: "Rahul",
    status: "Active",
    progress: 45,
    dueDate: "2026-11-20",
  },
  {
    id: 3,
    name: "Infrastructure Monitor",
    owner: "Priya",
    status: "Completed",
    progress: 100,
    dueDate: "2026-10-25",
  },
  {
    id: 4,
    name: "Employee Portal",
    owner: "Arun",
    status: "Planning",
    progress: 20,
    dueDate: "2026-12-01",
  },
];

export const tasks = [
  {
    id: "TSK-101",
    title: "Configure Tailwind CSS",
    project: "EZOHR Jobs Portal",
    assignee: "Shiva",
    priority: "High",
    status: "In Progress",
  },
  {
    id: "TSK-102",
    title: "Create authentication APIs",
    project: "EZOHR Jobs Portal",
    assignee: "Rahul",
    priority: "High",
    status: "Open",
  },
  {
    id: "TSK-103",
    title: "Design dashboard layout",
    project: "Employee Portal",
    assignee: "Priya",
    priority: "Medium",
    status: "Completed",
  },
  {
    id: "TSK-104",
    title: "Test REST APIs",
    project: "IT Service Management",
    assignee: "Arun",
    priority: "Low",
    status: "Open",
  },
];