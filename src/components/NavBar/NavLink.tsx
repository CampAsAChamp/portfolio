interface NavLinkProps {
  href: string
  label: string
  onClick?: () => void
}

export function NavLink({ href, label, onClick }: NavLinkProps): React.ReactElement {
  return (
    <li>
      <a href={href} onClick={onClick}>
        {label}
      </a>
    </li>
  )
}
