import { useEffect, useMemo, useState } from 'react';
import { employeeApi } from './employeeApi.js';
import { blankEmployee } from './employeeData.js';
import DashboardStats from './components/DashboardStats.jsx';
import DeleteEmployeeDialog from './components/DeleteEmployeeDialog.jsx';
import EmployeeForm from './components/EmployeeForm.jsx';
import EmployeeTable from './components/EmployeeTable.jsx';

function validate(form) {
  const errors = {};
  if (form.name.trim().length < 2) errors.name = 'Enter a full name.';
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email.';
  if (form.phone.trim().length < 7) errors.phone = 'Enter a valid phone number.';
  if (!form.department) errors.department = 'Choose a department.';
  if (form.designation.trim().length < 2) errors.designation = 'Enter a designation.';
  if (!Number(form.salary) || Number(form.salary) < 1) errors.salary = 'Enter a valid salary.';
  return errors;
}

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(blankEmployee);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [errors, setErrors] = useState({});
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  const loadEmployees = async () => {
    setLoading(true);
    try { setEmployees(await employeeApi.list()); setApiError(''); }
    catch { setApiError('Could not connect to the employee server. Start the JSON Server backend and retry.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadEmployees(); }, []);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 2800); return () => clearTimeout(timer); }, [toast]);
  const filtered = useMemo(() => { const term = search.toLowerCase().trim(); return employees.filter(employee => Object.values(employee).some(value => String(value).toLowerCase().includes(term))); }, [employees, search]);
  const resetForm = () => { setForm(blankEmployee); setEditingId(null); setErrors({}); };
  const change = event => { const { name, value } = event.target; setForm(current => ({ ...current, [name]: value })); setErrors(current => ({ ...current, [name]: '' })); };
  const submit = async event => {
    event.preventDefault(); const nextErrors = validate(form); setErrors(nextErrors); if (Object.keys(nextErrors).length) return;
    const data = { ...form, salary: Number(form.salary) };
    try {
      const saved = editingId ? await employeeApi.update(editingId, data) : await employeeApi.create(data);
      setEmployees(current => editingId ? current.map(employee => employee.id === editingId ? saved : employee) : [saved, ...current]);
      setToast(`${form.name} was ${editingId ? 'updated' : 'added'}.`); setApiError(''); resetForm();
    } catch { setApiError('The employee could not be saved. Check that JSON Server is running and try again.'); }
  };
  const edit = employee => { setForm({ ...employee, salary: String(employee.salary) }); setEditingId(employee.id); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const confirmDelete = async () => {
    try { await employeeApi.remove(deleting.id); setEmployees(current => current.filter(employee => employee.id !== deleting.id)); setToast(`${deleting.name} was deleted.`); setApiError(''); }
    catch { setApiError('The employee could not be deleted. Check that JSON Server is running and try again.'); }
    finally { setDeleting(null); }
  };

  return <main className="app-shell">
    <header className="topbar"><a className="brand" href="#"><span className="brand-mark">E</span><span>EmployeeHub</span></a><div className="header-copy"><span className="eyebrow">WORKSPACE</span><strong>Employee Management</strong></div></header>
    <section className="hero"><div><p className="eyebrow">TEAM DIRECTORY</p><h1>Manage your team,<br/>all in one place.</h1><p className="hero-text">Create, update, find, and manage every employee from one simple dashboard.</p></div><div className="hero-orb" aria-hidden="true">👥</div></section>
    {apiError && <div className="api-error" role="alert"><span>{apiError}</span><button onClick={loadEmployees}>Retry</button></div>}
    <DashboardStats employees={employees}/>
    <section className="content-grid"><EmployeeForm form={form} editing={Boolean(editingId)} errors={errors} onChange={change} onSubmit={submit} onCancel={resetForm}/><EmployeeTable employees={filtered} search={search} onSearch={setSearch} onEdit={edit} onDelete={setDeleting} loading={loading}/></section>
    <DeleteEmployeeDialog employee={deleting} onCancel={() => setDeleting(null)} onConfirm={confirmDelete}/>
    <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
  </main>;
}
