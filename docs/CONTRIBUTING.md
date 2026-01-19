# 🤝 Contributing to Ledgerly

Thank you for your interest in contributing to Ledgerly! This guide will help you get started.

## Code of Conduct

Be respectful, inclusive, and professional in all interactions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a branch** for your feature: `git checkout -b feature/amazing-feature`
4. **Make your changes** following our guidelines below
5. **Test your changes** thoroughly
6. **Commit your changes**: `git commit -m 'feat: add amazing feature'`
7. **Push to your fork**: `git push origin feature/amazing-feature`
8. **Open a Pull Request** on the main repository

## Development Workflow

### 1. Setup

Follow the [How to Run](HOW_TO_RUN.md) guide to set up your local environment.

### 2. Branch Naming

Use descriptive branch names with prefixes:

- `feat/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

Examples:
- `feat/add-budget-categories`
- `fix/login-validation-error`
- `docs/update-readme`

### 3. Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, missing semi colons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

Examples:
```
feat(auth): add Google OAuth provider
fix(finance): correct budget calculation
docs: update installation instructions
```

### 4. Code Style

We use **Biome** for code formatting and linting.

Before committing:

```bash
# Check code
pnpm lint

# Auto-fix issues
pnpm lint:fix
```

**Guidelines:**
- Use TypeScript for type safety
- Prefer functional components
- Use Server Components when possible
- Keep components small and focused
- Write self-documenting code with clear names
- Add comments for complex logic

### 5. Testing

(To be implemented)

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Check coverage
pnpm test:coverage
```

## Pull Request Process

### Before Submitting

- [ ] Code follows the project's style guidelines
- [ ] Lint checks pass (`pnpm lint`)
- [ ] All tests pass (when implemented)
- [ ] Commits follow conventional commit format
- [ ] Documentation is updated if needed
- [ ] No unnecessary console.logs or debug code

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Steps to test your changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Closes #123
```

### Review Process

1. Maintainer will review your PR
2. Address any feedback or requested changes
3. Once approved, your PR will be merged
4. Delete your branch after merge

## Areas for Contribution

### High Priority

- [ ] Add comprehensive test coverage
- [ ] Improve accessibility (a11y)
- [ ] Add internationalization (i18n)
- [ ] Optimize performance
- [ ] Improve error handling

### Feature Ideas

- [ ] Export data (CSV, PDF)
- [ ] Dark mode improvements
- [ ] Mobile responsive design
- [ ] Recurring transactions
- [ ] Budget alerts
- [ ] Data visualization enhancements

### Documentation

- [ ] Add JSDoc comments to functions
- [ ] Create video tutorials
- [ ] Write blog posts about features
- [ ] Improve API documentation

## Questions?

- Open an issue for bugs or feature requests
- Start a discussion for questions or ideas
- Check existing issues before creating new ones

## Recognition

Contributors will be recognized in:
- README contributors section
- Release notes
- Project documentation

Thank you for contributing! 🎉
