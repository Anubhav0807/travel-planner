export default function Header({ title, subtitle }) {
  return (
    <header className="header">
      <div>
        <h1 className="header-title">{title}</h1>
        {subtitle && <p className="header-subtitle">{subtitle}</p>}
      </div>
    </header>
  );
}
