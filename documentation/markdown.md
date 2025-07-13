# Markdown formatting standards

This document outlines the standards for writing and formatting all Markdown files within this project. Adhering to these guidelines ensures consistency and readability across all documentation.

## Headings

- All headings must use sentence case, where only the first word and proper nouns are capitalized.
- Headings must follow a logical, sequential order and never skip a level (e.g., do not use an `###` directly after an `#`).

  - Correct: `#` -> `##` -> `###`
  - Incorrect: `#` -> `###`

- Always include a single blank line **before and after** every heading, unless that heading is immediately followed or preceded by a fenced code block (the spacing rule does not apply *inside* code fences).
- Do **not** use inline-code back-ticks in headings. If you must reference a file or symbol name, place it on the line directly beneath the heading or omit the back-ticks.

## Lists

- Use a hyphen (`-`) for all unordered list items.
- List items must be simple statements. Do not use bolding or other formatting at the start of a list item.

## Code blocks

- When including code snippets, always specify the language identifier to enable proper syntax highlighting.

  ```typescript
  // Your code here
```typescript

## Links

- Use descriptive link text that clearly explains where the link will take the user.
- Avoid using "this link" or other generic phrases.

## Horizontal rules

- Use exactly three hyphens (`---`) on a line by itself to create a horizontal rule.
- Leave **one** blank line both before and after a horizontal rule.
- Use horizontal rules sparingly to mark a major thematic break; do not overuse them between every subsection.
