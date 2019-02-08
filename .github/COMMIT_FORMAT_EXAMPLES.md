Commit Message Examples
=======================

## Chores

A `chore` type is a task not directly tied to a feature, fix, or test. It is
often work that requires no change to production code.

```
chore(scripts/): Moved extraneous scripts into scripts/ directory
```

## Documentation

A `docs` type is a task that directly affects documentation that is
constructed manually, programmatically, or through a third-party. This
can include typos, additions, deletions, and examples.

```
docs(resolve.js): Describe new resolve API
```

## Features

A `feat` type is a task that introduces a new feature. The new feature
may introduce a breaking change to production code.

```
feat(create.js): Introduce new identity creation
```

## Fixes/bugs

A `fix` type is a task that addresses a bug in production code, build
scripts, compilation steps, or anything that directly or indiretly breaks or
impacts production.

```
fix(buffer.js): Fix the freeing of buffer resources
```

## Refactoring

A `refactor` type is a task that changes existing code. A refactor
should be an improvement to the existing production code.

```
refactor(platform.js): Simplify platform logic
```

## Code style

A `style` type is a task that addresses code formatting such as missing
semicolons, converting tabs to spaces, or removing extra newlines. There
should not be any code changes.

```
style(drive.js): Convert tabs to spaces
```

## Tests

A `test` type is a task that addresses the testing of production code.
This may include adding a new or missing test, refactoring existing
tests, or removing useless tests. There should not be any code changes.

```
test(buffer.js): Fix broken buffer alloc logic
```
