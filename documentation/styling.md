# Styling

## Core layout & structure

- Use component library's styling system
- Avoid overriding MUI's colour palette or spacing scale unless absolutely necessary; light customisation (e.g., fonts or typography variants) is allowed.
- Avoid custom CSS/SCSS files unless necessary
- Use appropriate layout components:
  - Flex containers for flexible layouts
  - Responsive containers for adaptive layouts
  - Width-constrained containers for page boundaries
- Never add visible containers or wrappers to content
- Never use decorative containers with visual properties (borders, backgrounds, shadows, rounded corners) when grouping or presenting static content
  - Exceptions: form controls (including outlined inputs and selects), alerts, and checkable items.
- Never use interactive components (Cards, Papers) for static content

## Visual hierarchy & typography

- Create visual hierarchy using only:
  - Typography (font sizes and weights)
  - Spacing (margins and padding)
- Maintain consistent text styles across the application
- Use default text color for all text
- Never use colored text for any purpose
- Use whitespace to create clear visual sections
- Maintain consistent spacing between related elements
- Content should flow naturally without artificial containers
- Use bold and left-aligned styling for all headings
- Use sentence case (first word capitalized only) for all headings and titles

## Color & visual elements

- Use color only for interactive elements (buttons, links)

## Icon usage

- Use icons sparingly and only in interactive controls
- Never use icons for decorative purposes or to replace text labels
- All icons must be accompanied by clear text labels
- Maintain a clean, typographic-first approach to UI design
- Only use icons when explicitly specified in the design

## Components

### Key-value pairs

- Display key-value pairs with the label on the left and the value on the right.
- Do not use a colon (:) between the label and the value.
- Ensure there is a clear visual gap between the label and the value.
- Values should be right-aligned.

### Form controls

- Display related options horizontally on desktop
- Allow natural wrapping when space is constrained
- Use appropriate layout components for horizontal arrangement
- Ensure proper spacing between options for touch targets

### Buttons

- Use prominent, filled buttons for primary actions (e.g., Next, Submit)
- Use outlined or secondary buttons for secondary actions (e.g., Back, Edit)
- Ensure buttons are clearly labeled and have sufficient touch/click targets
- Avoid full-width buttons to maintain proper visual hierarchy
- Disable elevation on contained buttons
- Use sentence case (first word capitalized only) for button labels

### Interactive cards

- Use card components only for clickable/interactive elements
- Include proper interactive areas for clickable cards
- Avoid decorative borders
- Use standard interaction patterns and hover states
- Do not customize or override default interaction behaviors
- Use typography to create clear hierarchy within cards

### Alerts & feedback

- Use alert components for important information
- Display validation errors inline, near the relevant input fields
- Use appropriate severity levels (error, warning, info, success)
- Keep alert messages concise and actionable
- Position alerts at the top of the content area
- Use consistent alert styling across the application

# Accessibility considerations

- Follow WAI-ARIA guidelines for all interactive elements.
- Ensure full keyboard navigation support (Tab, Shift+Tab, Enter/Space activation).
- Provide descriptive `aria-label`s or `aria-labelledby` for icons and unlabeled controls.
- Maintain a logical heading hierarchy (do not skip heading levels).

## MUI-specific implementation notes

- Use MUI v5.x.x components and features
- Use MUI Icons if icons are needed in the interface
- Use MUI's `Stack` for flex layouts
- Use MUI's `Box` for responsive layouts
- Use MUI's `Container` for page width constraints
- Use MUI's `FormGroup` with `row` prop for horizontal form layouts
- Use MUI's `CardActionArea` for clickable cards
- Use MUI's Alert component for all alert messages
- Use MUI's `sx` prop for custom styles
