const AuthLayout = ({ tagline, title, subtitle, children, footer }) => {
  return (
    <div className="auth-split">
      <div className="auth-brand">
        <span className="wordmark">taskflow</span>
        <p className="auth-tagline">{tagline}</p>
        <p className="auth-brand-foot">Built for teams who track work, not status meetings.</p>
      </div>
      <div className="auth-form-side">
        <div className="auth-form-wrap">
          <h2>{title}</h2>
          <p className="auth-form-sub">{subtitle}</p>
          {children}
          {footer && <div className="auth-form-foot">{footer}</div>}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
