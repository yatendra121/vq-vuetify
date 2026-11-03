## Unreleased

Bug Fixes

- `VqDataTable` / `VqList`: `reload()` and `reset()` now work. The table ignored them entirely, and both were silently dropped when no `VqTableFilter` was mounted, so `VqDatatableItemAction` never refreshed its table
- `VqTableFilter`: pressing Enter no longer natively submits the form and reloads the page
- `deleteItemValue` / `updateItemValue`: an unknown id no longer deletes the last row or throws
- `VqForm`: `submitedClientError` is now emitted; it was documented but never fired
- `VqForm`: 500s and network failures no longer end in an unhandled rejection with no event; they emit the new `submitedRequestError`
- `VqForm`: pressing Enter during a request no longer submits twice
- `VqForm`: an error thrown by `successResponseHandler` is no longer reported as a failed request
- `VqForm`: `valuesSchema` no longer sets a field to the schema object when a path is missing, reverses wildcard arrays, or throws on a missing array
- `useVqForm`: `initialValues` are now applied, plain objects and omitted values no longer trigger a Vue warning, the form renders its `id`, and `submited*` events are declared
- `VqDatePicker`: date-only values no longer show the previous day west of Greenwich, `multiple` now reaches the picker, invalid values show as empty, and formatting no longer depends on the browser locale
- `VqOtpInput`: validation messages are now displayed, and values from `initialValues` are no longer wiped
- `VqAutocomplete`: later changes to `items` and `action` now apply
- `VqSubmitBtn`: shows loading for the form named by the `form` prop, forwards named slots, and no longer warns outside a form
- `VqDataTable`: later changes to `page`, `itemsPerPage`, `sortBy`, and `action` now apply
- `VqList` / `VqDataTable`: filter values of `0` and `false` are no longer sent blank
- `VqList`: the documented `load-more` slot now renders, other `VList` slots are forwarded, and `VList` can render `items` when no slot is given
- `VqList`: `loadMore` no longer aborts an in-flight page or requests past the end; `pageSize` and `action` changes now apply
- `VqTextEditor`: `label` and `placeholder` now work, `baseUrl` no longer needs a trailing slash, attrs reach the editor, and no empty error paragraph is rendered
- `VqColorPicker`: object values no longer show as `[object Object]`
- `VqFileInput`: errors reported on `name` or `name.file`, including Laravel-style `name.file` server errors, are now displayed instead of blocking submit with no message
- `VqDatatableItemAction`: double-clicking confirm no longer repeats the request, and empty success messages are not shown
- Pickers: the `type` prop now applies after mount, and Space or ArrowDown now opens them; they could only be opened by mouse before
- `VqListLoadMoreBtn`: no longer logs a Vue warning when given attrs on a finished list

Features

- Export `VqDatatableItemAction` (named export only, so the plugin can't replace an app's own global component), `VqMessageQueue`, and `useMessageInstance`
- `VqDatePicker`: add `dateOnly` to store `YYYY-MM-DD` strings; the default stays a `Date`
- `VqFileInput`: add `rawName` to store the value at `name`, so a schema on `name` can pass; the default key stays `name[file]`
- `VqDataTable` / `VqList`: add `filterDebounce`
- `VqList`: add `method`
- `VqAutocomplete`: emit `error` when fetching options fails
- `VqDatePicker` / `VqTimePicker` / `VqColorPicker`: add `fieldProps` for the text field
- `VqDatePicker`: close after picking a single date
- `VqDatatableItemAction`: add `tooltip`, an accessible label, numeric `itemId`, and attrs forwarding
- `VqTextEditor`: add `init` for extra TinyMCE options
- `useVqForm`: also return `values`, `errors`, `meta`, `setFieldValue`, `setValues`, `setErrors`, and `validate`
- Fields: re-validate on change once they show an error, so the message clears when corrected
- Locale: add `selectTime`, `close`, and `next`
- Types: slot types for `useVqList` now include `loadMore`, `finished`, and `loading`; the never-emitted `changed` event is removed

Chores

- Fix `pnpm lint` with an ESLint flat config (the old `.eslintrc.cjs` is ignored by ESLint 10)
- Fix `pnpm build` on pnpm 11 by allowing the `@parcel/watcher` build script
- `build:types` no longer depends on the checkout folder being named `vq-vuetify`
- Move `vue` from `dependencies` to `devDependencies` (it stays a peer) so consumers can't end up with two copies
- Drop `@mdi/js` (peer and dev) and `@rushstack/eslint-patch`, which nothing uses any more
- Share the duplicated field, form-submit, and list-filter logic; remove dead code (`VqTest`, `collectValidationListeners`, `useFormRepository`, unused type and style files)
- Fix the `.gitignore` entry that ran `temp-types` and `pnpm-lock.yaml` together
- Add regression tests for all of the above

## 0.8.6 (2026-11-03)

Bug Fixes

- Make the `VqList`/`VqDataTable` dataset and snackbar message state SSR-safe by moving them from module scope into Pinia
- `VqList`/`VqDataTable`: stop swallowing fetch failures; real errors are logged and emitted through a new `error` event, while aborted requests stay silent
- `VqForm`: set the busy state synchronously so a stale timer can't re-enable the submit button mid-request and allow a double submit

Chores

- Bump `vite` to `^8.0.16` to patch a security advisory
- Refresh locked dependencies within their existing ranges to clear high-severity audit findings; tested against `vuetify` 4.3.1

## 0.8.5 (2026-06-07)

Bug Fixes

- `VqDataTable`: bind `itemsPerPage` and `sortBy` to `VDataTableServer` so the documented props actually control the table
- `VqFileUpload`: import `VFileUpload` from `vuetify/components` (promoted out of labs in Vuetify 4.1) instead of `vuetify/labs/VFileUpload`

Tests

- Add Vitest coverage across all components, composables and stores (21 spec files, 92 tests), including a jsdom polyfill setup for Vuetify overlay/loading components

Chores

- Bump `vuetify` dev and peer dependency to `^4.1.0` (required for the stable `VFileUpload`)
- Stop re-exporting `VqDatatableItemAction` from the components barrel

## 0.8.1 (2026-05-27)

Bug Fixes

- Fix `resetRequired` watch calling wrong store action (`setReloadValue` → `setResetValue`), causing the flag to never clear
- Fix duplicate `useFormFilterStore()` call in `VqList`
- Fix `VqTableFilterHandler` storing a stale snapshot of form values; now watches and syncs live changes to store
- Fix `VqDatatableItemAction` and `VqAutocomplete` not cancelling in-flight requests on unmount
- Fix false error message shown in `VqDatatableItemAction` when request is cancelled on unmount
- Fix `totalItems` becoming `NaN` after item deletion in list composable
- Fix `setReloadValue`/`setResetValue` crashing when called before `addForm`
- Replace `toRefs(store)` with `storeToRefs` in `MessageQueue`
- Add `updateValues` action to `formFiler` store for live form value sync
- Abort in-flight requests in `VqDataTable` and `VqList` on unmount

Chores

- Update dependencies (`@qnx/composables`, `@types/node`, `sass`, `vite`, `vite-plugin-dts`, `vitest`, `vue-tsc`)
- Add `@qnx/client` dev dependency to satisfy `@qnx/composables` 0.8.0 type declarations
- Improve tsconfig: broaden include to all source files, add `noFallthroughCasesInSwitch`, remove unused `allowJs`/`experimentalDecorators`/`emitDecoratorMetadata`

## 0.8.0 (2026-04-10)

Features

- Add `@qnx/composable` for axios functionality

Bug Fixes

- Correct engines field to exclude unstable Node versions
- Add `yup` and `@tinymce/tinymce-vue` as optional peer dependency
- Update deps

Documentation

- Updated documentation

## 0.7.20 (2026-04-04)

- fix: update vuetify labs component
- fix: update vite 8

## 0.7.12 (2026-01-13)

- fix: update deps

## 0.7.10 (2025-06-25)

- fix: update Pinia 3.x changes
- fix: update deps

## 0.7.8 (2025-04-24)

Bug Fixes

- fix: update deps

## 0.7.7 (2024-01-22)

Bug Fixes

- fix: bundle size issue

## 0.7.5 (2024-01-22)

Features

- VqFileUpload: new component added

## 0.7.2 (2024-01-19)

Bug Fixes

- Feat: updated deps

## 0.7.0 (2024-12-05)

Bug Fixes

- Fix: build issue with vue 3.5
- Feat: updated deps

## 0.6.32 (2024-11-02)

Bug Fixes

- Docs: added docs url

## 0.6.30 (2024-10-26)

Bug Fixes

- workspace: handled external deps and deps version

## 0.6.26 (2024-10-16)

Bug Fixes

- workspace: update dependencies

## 0.6.20 (2024-10-01)

Bug Fixes

- workspace: fix dependencies conflict
- workspace: update dependencies

## 0.6.14 (2024-04-12)

Features

- Docs: added examples url

## 0.6.12 (2024-04-09)

Features

- VqColorPicker: integrated with textfield
- VqDatePicker: integrated with textfield

Bug Fixes

- VqOtpInput: fix highlighted color

## 0.6.10 (2024-04-08)

Features

- VqTimePicker: added component

Bug Fixes

- Reduced codes duplication

## 0.6.6 (2024-03-10)

Features

- docs: added more details of components

## 0.6.5 (2024-02-20)

Features

- VqColorPicker: added component

Bug Fixes

- VqDatePicker: model value issue
- VqOtpInput validate model value

## 0.6.3 (2024-02-08)

Bug Fixes

- Updated dependencies
- Improved typescript support

## 0.6.2 (2023-12-17)

Bug Fixes

- VqForm: Fixed reactive initial value
- VqForm: Removed external submit button functionalilty

## 0.6.0 (2023-11-15)

Bug Fixes

- Support Vuetify 3.4.0 Changes: Libs components path

## 0.5.97 (2023-11-13)

Bug Fixes

- VqSubmitButton: Fixed form submit button issue if it defined from outside of form component
