import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'employeehub_react_employees';
const blankEmployee = { name: '', email: '', phone: '', department: '', designation: '', salary: '' };
const departments = ['Engineering', 'Design', 'Human Resources', 'Finance', 'Marketing', 'Operations', 'Sales'];
const readEmployees = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } };
const money = value => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Number(value) || 0);
const initials = name => name.split(/\s+/).slice(0, 2).map(word => word[0]).join('').toUpperCase();

export default function App() {
  const [employees, setEmployees] = useState(readEmployees);
  const [form, setForm] = useState(blankEmployee);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [errors, setErrors] = useState({});
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(employees)), [employees]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 2800); return () => clearTimeout(timer); }, [toast]);
  const filtered = useMemo(() => { const term = search.toLowerCase().trim(); return employees.filter(employee => Object.values(employee).some(value => String(value).toLowerCase().includes(term))); }, [employees, search]);
  const departmentCount = new Set(employees.map(employee => employee.department)).size;
  const averageSalary = employees.length ? employees.reduce((sum, employee) => sum + Number(employee.salary), 0) / employees.length : 0;
  const change = event => { const { name, value } = event.target; setForm(current => ({ ...current, [name]: value })); setErrors(current => ({ ...current, [name]: '' })); };
  const validate = () => { const next = {}; if (form.name.trim().length < 2) next.name = 'Enter a full name.'; if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email.'; if (form.phone.trim().length < 7) next.phone = 'Enter a valid phone number.'; if (!form.department) next.department = 'Choose a department.'; if (form.designation.trim().length < 2) next.designation = 'Enter a designation.'; if (!Number(form.salary) || Number(form.salary) < 1) next.salary = 'Enter a valid salary.'; setErrors(next); return !Object.keys(next).length; };
  const submit = event => { event.preventDefault(); if (!validate()) return; if (editingId) { setEmployees(current => current.map(employee => employee.id === editingId ? { ...form, id: editingId, salary: Number(form.salary) } : employee)); setToast(`${form.name} was updated.`); } else { setEmployees(current => [{ ...form, id: crypto.randomUUID(), salary: Number(form.salary) }, ...current]); setToast(`${form.name} was added.`); } resetForm(); };
  const resetForm = () => { setForm(blankEmployee); setEditingId(null); setErrors({}); };
  const edit = employee => { setForm({ ...employee, salary: String(employee.salary) }); setEditingId(employee.id); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const confirmDelete = () => { setEmployees(current => current.filter(employee => employee.id !== deleting.id)); setToast(`${deleting.name} was deleted.`); setDeleting(null); };
  return <main className="app-shell">
    <header className="topbar"><a className="brand" href="#"><span className="brand-mark">E</span><span>EmployeeHub</span></a><div className="header-copy"><span className="eyebrow">WORKSPACE</span><strong>Employee Management</strong></div></header>
    <section className="hero"><div><p className="eyebrow">TEAM DIRECTORY</p><h1>Manage your team,<br />all in one place.</h1><p className="hero-text">Create, update, find, and manage every employee from one simple dashboard.</p></div><div className="hero-orb" aria-hidden="true">👥</div></section>
    <section className="stats"><Stat icon="👤" className="purple" label="Total employees" value={employees.length}/><Stat icon="▦" className="teal" label="Departments" value={departmentCount}/><Stat icon="₹" className="orange" label="Average salary" value={`₹${money(averageSalary)}`}/></section>
    <section className="content-grid">
      <section className="card form-card"><div className="card-heading"><div><p className="eyebrow">{editingId ? 'EDIT MODE' : 'NEW RECORD'}</p><h2>{editingId ? 'Edit employee' : 'Add an employee'}</h2></div>{editingId && <button className="icon-button" onClick={resetForm} aria-label="Cancel editing">×</button>}</div>
        <form onSubmit={submit} noValidate><div className="form-row"><Field label="Full name" name="name" placeholder="e.g. Priya Sharma" form={form} error={errors.name} change={change}/><Field label="Work email" name="email" type="email" placeholder="priya@company.com" form={form} error={errors.email} change={change}/></div><div className="form-row"><Field label="Phone number" name="phone" placeholder="98765 43210" form={form} error={errors.phone} change={change}/><label>Department<select name="department" value={form.department} onChange={change} className={errors.department ? 'invalid' : ''}><option value="">Select department</option>{departments.map(department => <option key={department}>{department}</option>)}</select>{errors.department && <small>{errors.department}</small>}</label></div><div className="form-row"><Field label="Designation" name="designation" placeholder="e.g. Product Designer" form={form} error={errors.designation} change={change}/><Field label="Monthly salary (₹)" name="salary" type="number" placeholder="e.g. 50000" form={form} error={errors.salary} change={change}/></div><button className="primary-button" type="submit">{editingId ? 'Save changes' : <><span>＋</span> Add employee</>}</button></form>
      </section>
      <section className="card list-card"><div className="list-top"><div><p className="eyebrow">DIRECTORY</p><h2>All employees <span>{employees.length}</span></h2></div><label className="search"><span>⌕</span><input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search employees..." aria-label="Search employees"/></label></div><div className="table-wrap">{filtered.length ? <table><thead><tr><th>EMPLOYEE</th><th>DEPARTMENT</th><th>DESIGNATION</th><th>SALARY</th><th>ACTIONS</th></tr></thead><tbody>{filtered.map(employee => <tr key={employee.id}><td><div className="employee-name"><span className="avatar">{initials(employee.name)}</span><span>{employee.name}<small className="employee-email">{employee.email}</small></span></div></td><td><span className="badge">{employee.department}</span></td><td>{employee.designation}</td><td>₹{money(employee.salary)}</td><td><button className="action-button" onClick={() => edit(employee)}>Edit</button><button className="action-button delete" onClick={() => setDeleting(employee)}>Delete</button></td></tr>)}</tbody></table> : <div className="empty-state"><span>👥</span><h3>No employees found</h3><p>{search ? 'Try a different search.' : 'Add your first employee using the form.'}</p></div>}</div></section>
    </section>
    {deleting && <div className="modal-backdrop" onMouseDown={event => event.target === event.currentTarget && setDeleting(null)}><section className="modal" role="dialog" aria-modal="true"><span className="delete-icon">!</span><h2>Delete employee?</h2><p>Delete {deleting.name}? This action cannot be undone.</p><div className="modal-actions"><button className="secondary-button" onClick={() => setDeleting(null)}>Cancel</button><button className="danger-button" onClick={confirmDelete}>Delete employee</button></div></section></div>}
    <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
  </main>;
}
function Stat({ icon, className, label, value }) { return <article><span className={`stat-icon ${className}`}>{icon}</span><div><span className="stat-label">{label}</span><strong>{value}</strong></div></article>; }
function Field({ label, name, type = 'text', placeholder, form, error, change }) { return <label>{label}<input type={type} name={name} value={form[name]} onChange={change} placeholder={placeholder} className={error ? 'invalid' : ''}/>{error && <small>{error}</small>}</label>; }
