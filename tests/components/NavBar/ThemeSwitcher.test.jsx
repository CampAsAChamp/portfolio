import { describe, it } from 'vitest'

import { ThemeSwitcher } from '../../../src/components/NavBar/ThemeSwitcher'
import { render } from '../../test-utils'

describe('ThemeSwitcher', () => {
  it('renders without crashing', () => {
    render(<ThemeSwitcher />)
  })
})
