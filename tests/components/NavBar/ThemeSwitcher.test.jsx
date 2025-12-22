import { render } from 'tests/utils'
import { describe, it } from 'vitest'

import { ThemeSwitcher } from 'components/NavBar/ThemeSwitcher'

describe('ThemeSwitcher', () => {
  it('renders without crashing', () => {
    render(<ThemeSwitcher />)
  })
})
