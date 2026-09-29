export const departments = ['Engineering', 'Design', 'Human Resources', 'Finance', 'Marketing', 'Operations', 'Sales'];
export const blankEmployee = { name: '', email: '', phone: '', department: '', designation: '', salary: '' };
export const money = value => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Number(value) || 0);
export const initials = name => name.split(/\s+/).slice(0, 2).map(word => word[0]).join('').toUpperCase();
