import "./Loader.css";

export default function Loader({ label = "Loading…" }) {
  return (
    <div className="loader-wrap" role="status" aria-live="polite">
      <div className="loader-spinner" />
      <span className="loader-label">{label}</span>
    </div>
  );
}
