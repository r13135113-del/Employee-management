const API_URL = import.meta.env.VITE_EMPLOYEES_API_URL || (import.meta.env.DEV ? '/api/employees' : 'http://localhost:3001/employees');

async function request(url, options) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Employee API request failed (${response.status}).`);
  }
  return response.status === 204 ? null : response.json();
}

export const employeeApi = {
  list: () => request(API_URL),
  create: employee => request(API_URL, { method: 'POST', body: JSON.stringify(employee) }),
  update: (id, employee) => request(`${API_URL}/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(employee) }),
  remove: id => request(`${API_URL}/${encodeURIComponent(id)}`, { method: 'DELETE' }),
};
