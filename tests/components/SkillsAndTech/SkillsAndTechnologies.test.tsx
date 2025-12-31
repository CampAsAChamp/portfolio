import { render } from 'tests/utils'
import { describe, it } from 'vitest'

import { SkillsAndTechnologies } from 'components/SkillsAndTech/SkillsAndTechnologies'

describe('SkillsAndTechnologies', () => {
  it('renders without crashing', () => {
    render(<SkillsAndTechnologies />)
  })
})
