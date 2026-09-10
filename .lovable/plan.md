# Tower-Centered Portfolio

## Goal
Make the communications tower the entire portfolio experience. Replace the long page of section links and stacked content with portfolio information cards that appear around the rotating tower.

## Experience
- Keep the 3D tower full-screen as the main interface on desktop and mobile.
- Place About, Skills, Projects, Education, Certifications, CV, and Contact as compact cards orbiting around the tower at different heights.
- Rotate the tower and its card ring slowly by default; pause or soften movement when a card is selected.
- Let visitors select a card to bring it forward and reveal its full information without leaving the tower view.
- Provide clear previous/next controls and keyboard access instead of the existing whole-page section navigation.
- Preserve CV download/open actions and contact links inside their relevant expanded cards.

## Mobile and Accessibility
- Use one focused card at a time beneath or over the tower on small screens, with swipe-friendly previous/next controls.
- Respect reduced-motion preferences by disabling automatic rotation and using instant or subtle transitions.
- Keep readable contrast, visible focus states, semantic headings, and accessible labels.
- Retain the static tower fallback when 3D is unavailable.

## Technical Details
- Recompose the home route into one viewport-height tower portfolio rather than vertically stacked sections.
- Extend the Three.js tower scene with an orbiting card selector synchronized to React state.
- Reuse the existing centralized profile, skills, projects, education, certification, CV, and contact data.
- Keep the existing restrained charcoal, steel, and burnt-orange visual language.
- Verify desktop and mobile framing, selection behavior, CV access, reduced motion, and a clean browser console.
