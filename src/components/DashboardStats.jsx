import { money } from '../employeeData.js';

function Stat({ icon, color, label, value }) { return <article><span className={`stat-icon ${color}`}>{icon}</span><div><span className="stat-label">{label}</span><strong>{value}</strong></div></article>; }
export default function DashboardStats({ employees }) {
  const departments = new Set(employees.map(employee => employee.department)).size;
  const average = employees.length ? employees.reduce((sum, employee) => sum + Number(employee.salary), 0) / employees.length : 0;
  return <section className="stats"><Stat icon="👤" color="purple" label="Total employees" value={employees.length}/><Stat icon="▦" color="teal" label="Departments" value={departments}/><Stat icon="₹" color="orange" label="Average salary" value={`₹${money(average)}`}/></section>;
}
