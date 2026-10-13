import { useAuth } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const isAdmin = user.role === 'admin';

  return (
    <div className="app-shell">
      <header className="topbar">
        <span className="wordmark">taskflow</span>
        <div className="topbar-user">
          <span className="topbar-name">{user.name}</span>
          <span className="role-tag">{isAdmin ? 'Admin' : 'Team member'}</span>
          <button className="btn btn-ghost" onClick={logout}>Log out</button>
        </div>
      </header>

      <main className="main">
        {isAdmin ? <AdminDashboard /> : <UserDashboard />}
      </main>
    </div>
  );
};

export default Dashboard;