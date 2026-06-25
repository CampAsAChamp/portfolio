---
name: add-portfolio-section
description: Add a new page section to the portfolio SPA — component, styles, data, navbar link, App wiring, and tests. Use when adding a new section, portfolio area, content block, or navbar item.
---

# Add Portfolio Section

Follow existing sections (`AboutMe`, `Experience`, `SkillsAndTechnologies`, `SwProjects`, `ArtProjects`) as reference.

## Checklist

Copy and track progress:

```
- [ ] 1. Types (if section has structured data)
- [ ] 2. Data file in src/data/
- [ ] 3. Component in src/components/
- [ ] 4. CSS in src/styles/
- [ ] 5. Navbar link in src/data/navigation.ts
- [ ] 6. Wire into src/App.tsx
- [ ] 7. Unit test in tests/unit/
- [ ] 8. E2E test in tests/e2e/desktop/
- [ ] 9. Mobile E2E (if layout differs at ≤1100px)
- [ ] 10. yarn lint && yarn test && yarn test:e2e
```

## Step-by-step

### 1. Types (`src/types/`)

Add interfaces in `*.types.ts` when the section has structured content (cards, lists, media). Skip for purely static markup.

### 2. Data (`src/data/`)

Export a named constant array/object. Components import data — never hardcode content in JSX.

### 3. Component (`src/components/SectionName/`)

```tsx
import ScrollAnimation from 'react-animate-on-scroll'

import { items } from 'data/sectionItems'

import 'styles/SectionName/SectionName.css'

export function SectionName(): React.ReactElement {
  return (
    <section id="section-name-container" className="page-container">
      <div id="section-name-header" className="section-header">
        <ScrollAnimation animateIn="animate__fadeIn" animateOnce>
          <h2>Section Title</h2>
        </ScrollAnimation>
      </div>
      {/* content */}
    </section>
  )
}
```

**Required IDs** (used by navbar scroll and E2E):
- Container: `{name}-container`
- Header anchor: `{name}-header` (navbar `href` target)

Use `ScrollAnimation` with `animateOnce`. Wrap images with `loading="lazy"`.

### 4. CSS (`src/styles/SectionName/SectionName.css`)

Plain CSS, mobile-first. Use variables from `src/styles/Common/Globals.css`. Match naming of sibling sections.

### 5. Navigation (`src/data/navigation.ts`)

Add entry to `navigationLinks`:

```ts
{
  id: 'section-id',       // kebab-case, used in NavLink
  label: 'Display Name',
  href: '#section-name-header',  // must match an element id
}
```

Navbar scroll logic resolves `href` to `document.getElementById`. The target id must exist.

### 6. App (`src/App.tsx`)

- **Above fold** (like `AboutMe`): direct import + render
- **Below fold**: lazy import inside existing `<Suspense>` block

```tsx
const SectionName = lazy(() =>
  import('components/SectionName/SectionName').then((m) => ({ default: m.SectionName })),
)
```

Place in scroll order among sibling sections.

### 7. Unit test (`tests/unit/components/SectionName/`)

Minimal smoke test mirroring existing tests:

```tsx
import { render } from '@testing-library/react'
import { describe, it } from 'vitest'
import { SectionName } from 'components/SectionName/SectionName'

describe('SectionName', () => {
  it('renders without crashing', () => {
    render(<SectionName />)
  })
})
```

### 8. E2E desktop (`tests/e2e/desktop/section-name.spec.ts`)

Follow `experience.spec.ts` pattern:

```tsx
import { test, expect } from '@playwright/test'
import { SectionPage } from '../fixtures/SectionPage'
import { takeStableScreenshot } from '../helpers/screenshot-helpers'

test.describe('SectionName - Desktop', () => {
  test.beforeEach(async ({ page }) => {
    const sectionPage = new SectionPage(page)
    await sectionPage.goto('/')
    await sectionPage.scrollToSection('section-name-header')
  })

  test('should display section', async ({ page }) => {
    await expect(page.locator('#section-name-container')).toBeVisible()
    await expect(page.locator('#section-name-header h2')).toHaveText('Section Title')
  })

  test('should match visual snapshot', async ({ page }) => {
    await takeStableScreenshot(page, 'section-name-section')
  })
})
```

Use helpers from `tests/e2e/helpers/` — avoid `waitForTimeout` except where existing tests do (prefer `expect` waits).

### 9. Mobile E2E (optional)

Add `tests/e2e/mobile/section-name-mobile.spec.ts` if the section has distinct mobile layout or hamburger-menu interactions.

### 10. Verify

```bash
nvm use
yarn lint:fix
yarn test
yarn test:e2e
```

Update E2E baselines only for intentional visual changes:

```bash
npx playwright test section-name.spec.ts --update-snapshots
```

## Common mistakes

- Navbar `href` points to a non-existent id → scroll does nothing
- Forgot lazy import for below-fold section → hurts initial load
- Hardcoded content in component instead of `src/data/`
- Missing `page-container` class on `<section>`
- Skipping E2E after adding visible UI

## Reference files

| Concern | Example |
|---------|---------|
| Simple section | `src/components/Experience/Experience.tsx` |
| Data-driven cards | `src/data/experiences.ts` + `ExperienceCard.tsx` |
| Navbar wiring | `src/data/navigation.ts` |
| Lazy loading | `src/App.tsx` |
| E2E pattern | `tests/e2e/desktop/experience.spec.ts` |
| Page object | `tests/e2e/fixtures/SectionPage.ts` |
