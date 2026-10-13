import { useState, useEffect } from 'react';
import { getCards, updateCardStatus } from '../api/cards';

const STATUSES = [
  { value: 'todo', label: 'To do' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
];

const UserDashboard = () => {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState('');

  const loadCards = async () => {
    try {
      const data = await getCards();
      setCards(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your tasks');
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  const handleStatusChange = async (id, status) => {
    setError('');
    try {
      await updateCardStatus(id, status);
      loadCards();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  return (
    <section>
      <div className="section-head">
        <h3>My tasks</h3>
        <span className="section-count">{cards.length} assigned</span>
      </div>

      {error && <p className="alert" style={{ marginBottom: 'var(--space-4)' }}>{error}</p>}

      {cards.length === 0 ? (
        <div className="panel">
          <p className="cell-muted">No tasks assigned yet, check back once an admin assigns you one.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Title</th>
                <th>Board</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {cards.map((c) => (
                <tr key={c._id}>
                  <td>{c.title}</td>
                  <td className="cell-muted">{c.board?.title}</td>
                  <td>
                    <div className="segmented">
                      {STATUSES.map((s) => (
                        <button
                          key={s.value}
                          type="button"
                          className={c.status === s.value ? 'active' : ''}
                          onClick={() => handleStatusChange(c._id, s.value)}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default UserDashboard;