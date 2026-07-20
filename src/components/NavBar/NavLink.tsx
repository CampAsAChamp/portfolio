interface NavLinkProps {
  href: string
  label: string
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void
  className?: string
}

export function NavLink({ href, label, onClick, className }: NavLinkProps): React.ReactElement {
  return (
    <li className={className}>
      <a href={href} onClick={onClick}>
        {label}
      </a>
    </li>
  )
}
