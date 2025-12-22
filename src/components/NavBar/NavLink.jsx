export function NavLink({ href, label, onClick }) {
  return (
    <li>
      <a href={href} onClick={onClick}>
        {label}
      </a>
    </li>
  )
}
