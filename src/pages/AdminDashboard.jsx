import { useState, useEffect } from 'react';
import { getBoards, createBoard } from '../api/boards';
import { getCards, createCard, getProgress } from '../api/cards';
import { getUsers } from '../api/users';
import StatusTag from '../components/StatusTag';

const AdminDashboard = () => {
  const [boards, setBoards] = useState([]);
  const [cards, setCards] = useState([]);
  const [progress, setProgress] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const [boardTitle, setBoardTitle] = useState('');
  const [boardDescription, setBoardDescription] = useState('');

  const [cardTitle, setCardTitle] = useState('');
  const [cardBoard, setCardBoard] = useState('');
  const [cardAssignedTo, setCardAssignedTo] = useState('');

  const loadAll = async () => {
    try {
      const [boardsData, cardsData, progressData, usersData] = await Promise.all([
        getBoards(),
        getCards(),
        getProgress(),
        getUsers(),
      ]);
      setBoards(boardsData);
      setCards(cardsData);
      setProgress(progressData);
      setUsers(usersData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createBoard(boardTitle, boardDescription);
      setBoardTitle('');
      setBoardDescription('');
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create board');
    }
  };

  const handleCreateCard = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createCard({ title: cardTitle, board: cardBoard, assignedTo: cardAssignedTo });
      setCardTitle('');
      setCardBoard('');
      setCardAssignedTo('');
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create card');
    }
  };

  return (
    <>
      {error && <p className="alert">{error}</p>}

      <div className="panel-row">
        <section className="panel">
          <h3 className="panel-title">Create a board</h3>
          <form onSubmit={handleCreateBoard}>
            <div>
              <label className="field-label" htmlFor="board-title">Title</label>
              <input
                id="board-title"
                className="input"
                value={boardTitle}
                onChange={(e) => setBoardTitle(e.target.value)}
                placeholder="e.g. Website Redesign"
                required
              />
            </div>
            <div>
              <label className="field-label" htmlFor="board-desc">Description</label>
              <input
                id="board-desc"
                className="input"
                value={boardDescription}
                onChange={(e) => setBoardDescription(e.target.value)}
                placeholder="Optional"
              />
            </div>
            <button className="btn btn-primary" type="submit">Create board</button>
          </form>
        </section>

        <section className="panel">
          <h3 className="panel-title">Assign a task</h3>
          <form onSubmit={handleCreateCard}>
            <div>
              <label className="field-label" htmlFor="card-title">Title</label>
              <input
                id="card-title"
                className="input"
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
                placeholder="e.g. Design homepage mockup"
                required
              />
            </div>
            <div className="field-row">
              <div>
                <label className="field-label" htmlFor="card-board">Board</label>
                <select
                  id="card-board"
                  className="input"
                  value={cardBoard}
                  onChange={(e) => setCardBoard(e.target.value)}
                  required
                >
                  <option value="">Select a board</option>
                  {boards.map((b) => (
                    <option key={b._id} value={b._id}>{b.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label" htmlFor="card-user">Assign to</label>
                <select
                  id="card-user"
                  className="input"
                  value={cardAssignedTo}
                  onChange={(e) => setCardAssignedTo(e.target.value)}
                  required
                >
                  <option value="">Select a person</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
            </div>
            <button className="btn btn-primary" type="submit">Assign task</button>
          </form>
          {users.length === 0 && (
            <p className="cell-muted" style={{ marginTop: 'var(--space-3)' }}>
              No team members registered yet, nothing to assign to.
            </p>
          )}
        </section>
      </div>

      <section>
        <div className="section-head">
          <h3>All tasks</h3>
          <span className="section-count">{cards.length} total</span>
        </div>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Title</th>
                <th>Board</th>
                <th>Assigned to</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {cards.length === 0 && (
                <tr className="empty-row">
                  <td colSpan={4}>No tasks yet, create one above.</td>
                </tr>
              )}
              {cards.map((c) => (
                <tr key={c._id}>
                  <td>{c.title}</td>
                  <td className="cell-muted">{c.board?.title}</td>
                  <td>
                    {c.assignedTo?.name}
                    <span className="cell-muted"> ({c.assignedTo?.email})</span>
                  </td>
                  <td><StatusTag status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="section-head">
          <h3>Team progress</h3>
        </div>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Person</th>
                <th>Breakdown</th>
                <th>To do</th>
                <th>In progress</th>
                <th>Done</th>
              </tr>
            </thead>
            <tbody>
              {progress.length === 0 && (
                <tr className="empty-row">
                  <td colSpan={5}>No team members registered yet.</td>
                </tr>
              )}
              {progress.map((p) => {
                const total = p.progress.todo + p.progress['in-progress'] + p.progress.done;
                const pct = (n) => (total === 0 ? 0 : (n / total) * 100);
                return (
                  <tr key={p.userId}>
                    <td>
                      {p.name}
                      <span className="cell-muted"> ({p.email})</span>
                    </td>
                    <td style={{ minWidth: 140 }}>
                      <div className="progress-bar">
                        <span className="progress-seg-todo" style={{ width: `${pct(p.progress.todo)}%` }} />
                        <span className="progress-seg-progress" style={{ width: `${pct(p.progress['in-progress'])}%` }} />
                        <span className="progress-seg-done" style={{ width: `${pct(p.progress.done)}%` }} />
                      </div>
                    </td>
                    <td>{p.progress.todo}</td>
                    <td>{p.progress['in-progress']}</td>
                    <td>{p.progress.done}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
