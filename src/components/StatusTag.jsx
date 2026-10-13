const LABELS = {
  todo: 'To do',
  'in-progress': 'In progress',
  done: 'Done',
};

const CLASS = {
  todo: 'status-todo-tag',
  'in-progress': 'status-progress-tag',
  done: 'status-done-tag',
};

const StatusTag = ({ status }) => (
  <span className={`status-tag ${CLASS[status] || 'status-todo-tag'}`}>
    {LABELS[status] || status}
  </span>
);

export default StatusTag;