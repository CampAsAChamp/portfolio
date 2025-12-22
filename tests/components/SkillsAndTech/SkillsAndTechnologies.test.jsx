import { describe, it } from 'vitest'

import { SkillsAndTechnologies } from '../../../src/components/SkillsAndTech/SkillsAndTechnologies'
import { render } from '../../test-utils'

describe('SkillsAndTechnologies', () => {
  it('renders without crashing', () => {
    render(<SkillsAndTechnologies />)
  })
})
