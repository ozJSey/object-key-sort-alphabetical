# Changelog

## [2.4.0]

### Fixed
- **Vue/HTML template corruption** — Files with `<script>` tags (Vue, HTML, etc.) were being parsed as raw TypeScript, causing the TS parser to misinterpret template syntax like `{{ option.label }}` and corrupt it during sorting.

### Changed
- For files containing `<script>` tags, the extension now extracts and sorts only the script block content, leaving the rest of the file untouched.
- Files without `<script>` tags continue to be sorted as before — no behavior change for plain JS/TS/JSON files.

## [2.3.0]

### Added
- Internal test suite covering objects, interfaces, types, imports, nested objects, priority keys, edge cases, and more.

## [2.2.0]

### Fixed
- Delimiter not existing in the final object item.

## [2.1.0]

### Changed
- Switched back to TypeScript compiler for AST parsing.

## [2.0.0]

### Changed
- Complete rewrite using AST-based parsing instead of regex.

### Fixed
- Unintended `.md` file sorting.
- Class bodies no longer sorted.

### Added
- Save without sorting command.
