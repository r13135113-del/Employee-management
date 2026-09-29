export default function DeleteEmployeeDialog({ employee, onCancel, onConfirm }) {
  if (!employee) return null;
  return <div className="modal-backdrop" onMouseDown={event => event.target === event.currentTarget && onCancel()}><section className="modal" role="dialog" aria-modal="true"><span className="delete-icon">!</span><h2>Delete employee?</h2><p>Delete {employee.name}? This action cannot be undone.</p><div className="modal-actions"><button className="secondary-button" onClick={onCancel}>Cancel</button><button className="danger-button" onClick={onConfirm}>Delete employee</button></div></section></div>;
}
