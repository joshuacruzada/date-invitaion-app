# Date Invitation Web App — Codex Implementation Plan

## 1. Project goal

Build a small, polished romantic web app that lets one person invite their girlfriend to a date.

The experience should feel personal, playful, warm, and intentionally simple — like opening a handwritten invitation.

### Core flow

1. **Envelope landing page**
   - Show a closed envelope centered on the page.
   - The envelope has a heart seal.
   - User clicks/taps the envelope to open it.
   - A paper card pops upward from the envelope.

2. **Question page / opened envelope**
   - Show a customizable question.
   - Initial placeholder:
     - `template for question`
   - Show `Yes` and `No` buttons.
   - `Yes` continues to date planning.
   - `No` playfully moves to a random safe location when hovered/tapped.
   - The No button must never become inaccessible or cover important UI.
   - The interaction is playful, not aggressive: there should be no blocking, trapping, or deceptive behavior beyond the button's harmless movement.

3. **Date category selection**
   - Title:
     - `What shall we do?`
   - Categories:
     - Ramen
     - Arcade
     - Cinema
     - Painting
     - Something new?
   - The final card acts as a custom category placeholder.
   - Categories should be easy to extend from a data array.

4. **Schedule modal**
   - Clicking a category opens a modal.
   - Fields:
     - Title
     - Date
     - Time
   - Display the selected category.
   - Primary CTA:
     - `Create Invitation ♥`
   - Validate required fields.
   - Keep the modal keyboard accessible and closeable with Escape.

5. **Email preview / mail action**
   - Generate a friendly email/message using the selected category, title, date, and time.
   - Show a preview before opening the email client.
   - Primary action uses a `mailto:` URL.
   - Do not require a backend for the first version.

---

## 2. Visual direction

Use the previously established visual direction:

- Romantic
- Cute
- Minimal
- Warm stationery / paper aesthetic
- Soft pink and cream
- Rounded cards
- Subtle shadows
- Small heart/sparkle decorations
- Handwritten-feeling display typography paired with a clean sans-serif body font
- Avoid excessive gradients, glassmorphism, or overly complex animations

### Suggested palette

Use CSS variables so the theme can be changed easily:

```css
:root {
  --background: #fff8f5;
  --paper: #fffdf9;
  --paper-muted: #f8eee9;
  --primary: #d95d73;
  --primary-dark: #b9475d;
  --secondary: #f4c8cf;
  --accent: #e9a7b3;
  --text: #3f3033;
  --muted: #8a7378;
  --border: #ead9d5;
  --success: #6f9b7b;
}
```

These are starting values, not hard requirements. Preserve the overall warm pink/cream mood.

### Typography

Prefer a display font with a handwritten/romantic feel and a highly readable sans-serif body.

If external fonts are not desired, use a system fallback stack.

Recommended:

```css
font-family: "DM Sans", ui-sans-serif, system-ui, sans-serif;
```

For headings, if a font package is added:

```css
font-family: "Caveat", "Segoe Print", cursive;
```

Do not make body text handwritten.

---

## 3. Technical stack

Use a straightforward frontend-only architecture.

### Required

- Vite
- React
- TypeScript
- Tailwind CSS
- lucide-react
- React Router only if routing is actually useful; otherwise a small state machine is preferred

### Do not add unnecessarily

- Backend
- Database
- Authentication
- Redux
- Large animation libraries
- Component libraries that duplicate simple UI primitives

### Icons

Use **Lucide / lucide-react** for interface icons.

Examples:

```tsx
import {
  Heart,
  Mail,
  CalendarDays,
  Clock3,
  Sparkles,
  Utensils,
  Gamepad2,
  Film,
  Paintbrush,
  Plus,
  X,
  ArrowRight,
} from "lucide-react";
```

Prefer Lucide icons over manually drawing interface icons.

The SVG files in `public/assets` are decorative/resource assets only. For React UI controls, use `lucide-react` directly.

---

## 4. Recommended project structure

```text
date-invitation/
├─ public/
│  └─ assets/
│     ├─ envelope.svg
│     ├─ heart.svg
│     ├─ sparkle.svg
│     ├─ ramen.svg
│     ├─ arcade.svg
│     ├─ cinema.svg
│     ├─ painting.svg
│     ├─ calendar.svg
│     └─ mail.svg
├─ src/
│  ├─ components/
│  │  ├─ Envelope.tsx
│  │  ├─ QuestionCard.tsx
│  │  ├─ CategoryCard.tsx
│  │  ├─ CategoryGrid.tsx
│  │  ├─ ScheduleModal.tsx
│  │  ├─ EmailPreview.tsx
│  │  └─ DecorativeHearts.tsx
│  ├─ data/
│  │  └─ dateCategories.ts
│  ├─ hooks/
│  │  └─ useNoButtonEscape.ts
│  ├─ pages/
│  │  └─ DateInvitation.tsx
│  ├─ types/
│  │  └─ invitation.ts
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ index.css
├─ public/
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
└─ README.md
```

If the project already exists, adapt to its existing structure rather than moving files unnecessarily.

---

## 5. Data model

Keep date categories data-driven.

Example:

```ts
export type DateCategory = {
  id: string;
  name: string;
  description?: string;
  icon: "ramen" | "arcade" | "cinema" | "painting" | "custom";
};
```

Initial data:

```ts
export const dateCategories: DateCategory[] = [
  {
    id: "ramen",
    name: "Ramen",
    description: "A warm bowl and good conversation.",
    icon: "ramen",
  },
  {
    id: "arcade",
    name: "Arcade",
    description: "Games, laughs, and friendly competition.",
    icon: "arcade",
  },
  {
    id: "cinema",
    name: "Cinema",
    description: "A movie date with snacks.",
    icon: "cinema",
  },
  {
    id: "painting",
    name: "Painting",
    description: "Let's make something together.",
    icon: "painting",
  },
  {
    id: "custom",
    name: "Something new?",
    description: "Add your own date idea.",
    icon: "custom",
  },
];
```

The custom card should be easy to replace/add to later.

---

## 6. Application state

A simple top-level state is enough.

Suggested state:

```ts
type Step =
  | "envelope"
  | "question"
  | "categories"
  | "schedule"
  | "preview";

type InvitationData = {
  question: string;
  categoryId: string;
  categoryName: string;
  title: string;
  date: string;
  time: string;
};
```

State transitions:

```text
envelope
   ↓ open
question
   ↓ Yes
categories
   ↓ select category
schedule
   ↓ create invitation
preview
   ↓ open email app
mailto:
```

Do not introduce a global store unless the existing project already requires one.

---

## 7. Envelope interaction

### Closed state

The envelope should visually resemble a small paper envelope.

Requirements:

- centered
- responsive
- heart seal
- soft shadow
- subtle floating animation
- CTA text such as `Click to open ♥`

### Open state

On click:

1. Envelope flap rotates upward.
2. Paper invitation slides upward.
3. Content becomes visible.
4. Background decorations animate slightly.

Keep the animation around 400–700ms.

Respect reduced-motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Question screen

Default placeholder:

```text
template for question
```

Buttons:

```text
Yes ♥
No
```

### No-button behavior

The No button should move when the pointer gets close or the user attempts to interact.

Implementation guidance:

- Use `position: absolute` inside a bounded interaction area.
- Generate random `x/y` positions within the container.
- Account for button width/height.
- Keep at least 16–24px from the container edge.
- Avoid overlapping the Yes button.
- Avoid moving more than necessary on mobile.
- On touch devices, move on pointer-down rather than relying only on hover.
- Keep the Yes button always stable.

Do not make the No button impossible to reach through keyboard navigation. Keyboard users should still be able to focus it and activate the playful movement.

---

## 9. Category screen

Layout:

- Desktop: 2–3 columns depending on viewport.
- Mobile: 1–2 columns.
- Cards should feel like small date idea cards.

Each card:

- Lucide icon
- category name
- optional description
- hover lift
- subtle border/shadow
- click/tap feedback

Suggested icon mapping:

```tsx
const iconMap = {
  ramen: Utensils,
  arcade: Gamepad2,
  cinema: Film,
  painting: Paintbrush,
  custom: Sparkles,
};
```

---

## 10. Schedule modal

Modal contents:

```text
Plan the Date

[ Selected category ]

Title
[ input ]

Date
[ date input ]

Time
[ time input ]

[ Cancel ] [ Create Invitation ♥ ]
```

Requirements:

- Accessible dialog semantics.
- Focus should move into the modal when opened.
- Escape closes it.
- Clicking the backdrop closes it unless the form is being submitted.
- Prevent body scrolling while open.
- Restore focus to the triggering category card after closing.
- Validate title/date/time.
- Show concise validation messages.

Do not add a calendar library for this simple form.

Use native:

```html
<input type="date" />
<input type="time" />
```

---

## 11. Email generation

Create a helper:

```ts
export function buildInvitationEmail(data: InvitationData) {
  // returns subject and body
}
```

Suggested subject:

```text
A little date invitation for you ♥
```

Suggested body structure:

```text
Hi love ♥

I have a little date invitation for you.

Date idea: {categoryName}
Plan: {title}
Date: {formattedDate}
Time: {formattedTime}

Would you like to go on this little adventure with me? ♥

Love,
[Your Name]
```

Do not hard-code a real name. Make sender name configurable.

Use:

```ts
const mailto = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
```

For the first version, recipient email can be an optional configuration constant or a form field.

Do not send email from the browser directly. `mailto:` only opens the user's configured email client.

---

## 12. Email preview

The preview should visually look like a small email card.

Show:

- recipient
- subject
- date idea
- plan title
- date
- time
- generated message

CTA:

```text
Open in Email App
```

Secondary action:

```text
Back
```

If no recipient email is configured, let the user enter one before opening the mail client.

---

## 13. SVG resources

The supplied SVG resources are lightweight decorative assets.

Important:

- Keep them as external assets under `public/assets`.
- Do not use them as replacements for Lucide React icons in buttons/forms.
- Use `lucide-react` for interactive/interface icons.
- SVGs should remain easy to recolor with CSS where practical.
- Avoid embedded raster images.
- Avoid base64 image data.

Available assets:

```text
public/assets/
├─ envelope.svg
├─ heart.svg
├─ sparkle.svg
├─ ramen.svg
├─ arcade.svg
├─ cinema.svg
├─ painting.svg
├─ calendar.svg
└─ mail.svg
```

---

## 14. Responsive requirements

The app must work well at:

- 360px mobile
- 390px mobile
- 768px tablet
- 1024px laptop
- 1440px desktop

Mobile priorities:

- no horizontal scrolling
- large tap targets
- modal fits viewport
- envelope remains visually centered
- category cards remain readable
- email preview remains usable

Use a mobile-first approach.

---

## 15. Accessibility

Minimum requirements:

- semantic buttons for actions
- labels for every form field
- visible keyboard focus
- sufficient text contrast
- `aria-label` where an icon-only button exists
- modal uses dialog semantics
- Escape closes modal
- reduced-motion support
- no action depends solely on color
- interactive elements should have sensible focus order

The playful No button must not prevent keyboard users from navigating the page.

---

## 16. Animation rules

Use CSS transitions/keyframes or small React animations.

Keep animations subtle:

- envelope flap: 500–700ms
- paper pop: 450–600ms
- card hover: 150–250ms
- button hover: 150–200ms
- decorative floating hearts: slow, low-amplitude

Avoid constant large movements that distract from the question.

---

## 17. Implementation order

Codex should implement in this order:

### Phase 1 — Scaffold

- Confirm Vite + React + TypeScript.
- Install Tailwind CSS if not already installed.
- Install `lucide-react`.
- Ensure the project runs.

### Phase 2 — Theme

- Add CSS variables.
- Add global typography.
- Add page background.
- Add responsive container.

### Phase 3 — Envelope

- Build `Envelope`.
- Add open animation.
- Add heart seal.
- Connect click to step transition.

### Phase 4 — Question

- Build `QuestionCard`.
- Add Yes transition.
- Add No-button movement.
- Test desktop and mobile.

### Phase 5 — Categories

- Add data-driven category cards.
- Use Lucide icons.
- Add custom category placeholder.
- Open schedule modal.

### Phase 6 — Schedule

- Build accessible modal.
- Add title/date/time inputs.
- Add validation.
- Save invitation data.

### Phase 7 — Email preview

- Generate email subject/body.
- Render preview.
- Add `mailto:` action.

### Phase 8 — Polish

- Responsive testing.
- Keyboard testing.
- Reduced-motion testing.
- Empty/invalid form testing.
- Fix overflow.
- Tune animation timing.
- Remove unnecessary dependencies.

---

## 18. Definition of done

The project is complete when:

- [ ] The envelope opens smoothly.
- [ ] The question is shown on the paper card.
- [ ] Yes advances to category selection.
- [ ] No moves playfully without breaking layout.
- [ ] Category cards are data-driven.
- [ ] Ramen, Arcade, Cinema, Painting, and custom cards exist.
- [ ] Clicking a category opens the schedule modal.
- [ ] Title/date/time can be entered.
- [ ] Invalid required fields are handled.
- [ ] Invitation preview is generated correctly.
- [ ] Email action opens a `mailto:` link.
- [ ] The app works on mobile and desktop.
- [ ] Lucide icons are used for UI icons.
- [ ] SVG assets are stored in `public/assets`.
- [ ] No backend is required.
- [ ] No horizontal scrolling exists at 360px width.
- [ ] Keyboard navigation works.
- [ ] Reduced-motion users receive a usable experience.
- [ ] Console has no avoidable runtime errors.

---

## 19. Codex working rules

When implementing:

1. Inspect the existing repository before changing files.
2. Preserve existing working configuration unless a change is necessary.
3. Prefer small reusable React components.
4. Keep data separate from presentation.
5. Use TypeScript types for invitation data and category data.
6. Use `lucide-react` instead of creating duplicate UI icons.
7. Do not add dependencies without a concrete reason.
8. Do not introduce a backend.
9. Keep the design consistent with the romantic stationery direction.
10. Test after each major phase.
11. Fix TypeScript/lint/build errors before moving on.
12. Do not replace working project configuration wholesale.
13. Keep user-editable copy in obvious constants/data files.
14. Keep email generation in a separate utility.
15. Keep the No-button movement isolated in its own hook/component.
16. Prefer native browser form controls for date/time.
17. Make the experience feel playful, not complicated.

---

## 20. Future enhancements — do not implement initially

Potential later features:

- Custom question editor
- Add/remove date categories from UI
- Recipient name configuration
- Sender name configuration
- Custom email template editor
- Confetti after Yes
- Multiple invitation themes
- Save invitation as a shareable URL
- Backend/email service
- Calendar integration
- RSVP response tracking

These are intentionally outside the first implementation.
