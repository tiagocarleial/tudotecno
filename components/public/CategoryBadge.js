export default function CategoryBadge({ name, color, className = '' }) {
  return (
    <span
      className={`category-badge ${className}`}
      style={{ backgroundColor: color || '#2859f1' }}
    >
      {name}
    </span>
  );
}
