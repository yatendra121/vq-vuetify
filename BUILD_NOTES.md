# Build Notes

## 2026-04-16

### VqTextField improvements
- Enabled validation listeners (`onBlur`, `onChange`, `onInput`) for lazy/aggressive validation strategy
- Removed unused imports
- Fixed type export pattern

### Type safety improvements (removed `any` across codebase)
- Replaced `any` with proper types in all components and composables
- `catch (e: any)` → `catch (e: unknown)` with `instanceof Error` guard
- `Record<string, any>` → `Record<string, unknown>` in types, store, and composables
- `collectFormObjValues` and `transformObjValues` in VqForm fully typed
- `collectValidationListeners` in config.ts typed with vee-validate types
- Removed `@ts-ignore` comments where proper typing was possible
