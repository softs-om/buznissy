function Card({ children, className = "" }) {
  return <section className={`app-card ${className}`}>{children}</section>;
}

export default Card;