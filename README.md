# @qnx/vuetify

`@qnx/vuetify` is a Vue 3 component library built on top of Vuetify that simplifies forms, data tables, and lists. It handles validation, server communication, error display, and data management internally — reducing boilerplate and keeping your templates clean.

## Links

- [Live Examples](https://qnx-vuetify-sample.vercel.app/)
- [Full Documentation](https://qnx-vuetify-docs.vercel.app/)
- [GitHub Repository](https://github.com/yatendra121/vq-vuetify)
- [Report an Issue](https://github.com/yatendra121/vq-vuetify/issues)

## Installation

```bash
npm install @qnx/vuetify
# or
yarn add @qnx/vuetify
# or
pnpm add @qnx/vuetify
# or
bun add @qnx/vuetify
```

### Peer Dependencies

Install the required peer dependencies alongside the library:

```bash
npm install vuetify@^4.0.0 pinia vee-validate axios @qnx/composables
```

| Dependency | Version | Notes |
|---|---|---|
| `vuetify` | `^4.0.0` | Required |
| `pinia` | `3.x` | Required |
| `vee-validate` | `*` | Required |
| `axios` | `*` | Required for HTTP requests |
| `@qnx/composables` | `*` | Required |
| `@tinymce/tinymce-vue` | `*` | Optional — only for `VqTextEditor` |
| `yup` | `*` | Optional — for schema-based validation with `vee-validate` |
| `@mdi/js` | `*` | Optional — only for `VqDatatableItemAction` (default delete icon) |

## Basic Usage

```vue
<script setup>
import { VqForm, VqTextField } from '@qnx/vuetify'
import { object, string } from 'yup'

const validationSchema = object({
  name: string().required(),
  email: string().required().email(),
})

const initialValues = { name: 'Test User', email: 'test@gmail.com' }

const onSuccess = (res) => console.log(res)
</script>

<template>
  <VqForm
    id="create-user"
    action="user/create"
    method="POST"
    :validation-schema="validationSchema"
    :initial-values="initialValues"
    @submited-success="onSuccess"
  >
    <VqTextField name="name" label="Name" placeholder="Name" />
    <VqTextField name="email" label="Email" placeholder="Email" />
    <button type="submit">Submit</button>
  </VqForm>
</template>
```

## Components

### Form Components

These components must be used inside a `VqForm` or `useVqForm` wrapper. They automatically connect to form state, handle validation display, and bind field values.

| Component | Description |
|---|---|
| `VqForm` | Form wrapper. Handles submission, validation, and server communication via axios. |
| `VqTextField` | Text input bound to vee-validate form state. |
| `VqTextarea` | Textarea input bound to form state. |
| `VqAutocomplete` | Autocomplete/select input bound to form state. |
| `VqCheckbox` | Checkbox input bound to form state. |
| `VqDatePicker` | Date picker input bound to form state. |
| `VqTimePicker` | Time picker input bound to form state. |
| `VqColorPicker` | Color picker input bound to form state. |
| `VqOtpInput` | OTP (one-time password) input bound to form state. |
| `VqFileInput` | File input bound to form state. |
| `VqFileUpload` | File upload input with upload handling. |
| `VqSubmitBtn` | Submit button that reflects form busy/loading state. Pass a custom label via the `text` prop or the default slot. |

#### `VqForm` Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | `string` | Yes | — | Unique identifier for the form. Used internally to coordinate with submit buttons and filters. |
| `action` | `string` | Yes | — | API endpoint URL for form submission. |
| `method` | `string` | No | `"POST"` | HTTP method (`POST`, `PUT`, `PATCH`, etc.). |
| `initialValues` | `object` | No | `undefined` | Initial field values. Resets the form when this value changes. |
| `validationSchema` | `object` | No | `undefined` | Yup validation schema. |
| `valuesSchema` | `object` | No | `undefined` | Maps nested response fields to flat form fields. |
| `formData` | `boolean` | No | `false` | When `true`, submits as `multipart/form-data` instead of JSON. |
| `successResponseHandler` | `function` | No | — | Custom handler for successful responses. Overrides the default emit. |
| `errorResponseHandler` | `function` | No | — | Custom handler for error responses. Overrides the default error display. |

#### `VqForm` Events

| Event | Payload | Description |
|---|---|---|
| `submited-success` | `ApiResponse` | Emitted on successful server response. |
| `submited-error` | `ApiResponse` | Emitted when the server returns a validation error. |
| `submited-client-error` | — | Emitted on client-side validation failure. |

### Data Table Components

| Component | Description |
|---|---|
| `VqDataTable` | Server-side data table built on Vuetify's `VDataTableServer`. Handles pagination, sorting, and filter integration. |
| `VqSerialNo` | Renders a `<td>` with the row's serial number. Use inside `VqDataTable` item slots. |
| `VqDatatableItemAction` | Action button (delete/change-status) for a table row. Opens a confirmation dialog before making the API call. |

#### `VqDataTable` Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | `string` | Yes | — | Unique identifier. Must match the `id` used in the paired `VqTableFilter`. |
| `action` | `string` | Yes | — | API endpoint for fetching table data. |
| `method` | `string` | No | `"GET"` | HTTP method for data fetching. |
| `page` | `number` | No | `1` | Initial page number. |
| `itemsPerPage` | `number` | No | `10` | Number of rows per page. |
| `sortBy` | `SortByValue[]` | No | `[{ key: "name", order: "asc" }]` | Default sort configuration. |

#### `VqDatatableItemAction` Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | `string` | Yes | — | Table ID. Used to trigger a reload after the action completes. |
| `itemId` | `string` | No | `"0"` | The ID of the row item to act on. |
| `action` | `string` | No | `"user/change-status"` | API endpoint. The `itemId` is appended as a path segment: `action/itemId`. |
| `method` | `string` | No | `"PUT"` | HTTP method for the action request. |
| `title` | `string` | No | `locale.confirmTitle` | Confirmation dialog title. |
| `description` | `string` | No | `locale.confirmDeleteDescription` | Confirmation dialog message. |
| `icon` | `string` | No | `mdiDelete` | MDI icon path for the action button. |

### List Components

| Component | Description |
|---|---|
| `VqList` | Infinite-scroll list built on Vuetify's `VList`. Fetches paginated data from an API and integrates with `VqTableFilter`. |
| `VqListLoadMoreBtn` | Button that loads the next page of items. Must be used inside a `VqList`. |
| `VqTableFilter` | Filter form that connects to a paired `VqDataTable` or `VqList` by ID. Triggers a data reload on change. |

#### `VqList` Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | `string` | Yes | — | Unique identifier. Must match the `id` used in a paired `VqTableFilter`. |
| `action` | `string` | Yes | — | API endpoint for fetching list data. |
| `pageSize` | `number` | No | `10` | Number of items loaded per page. |

#### `VqTableFilter` Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | `string` | Yes | — | Must match the `id` of the `VqDataTable` or `VqList` it filters. |

### Integration Components

| Component | Description |
|---|---|
| `VqTextEditor` | Rich text editor using TinyMCE. Requires `@tinymce/tinymce-vue` as an additional peer dependency. |

## Composables

### `useVqForm(options)`

An alternative to `<VqForm>` for cases where you need programmatic access to form state (errors, values, `resetForm`, etc.) from outside the form component.

```vue
<script setup>
import { useVqForm } from '@qnx/vuetify'
import { object, string } from 'yup'

const { wrapper: MyForm, resetForm } = useVqForm({
  formId: 'edit-user',
  validationSchema: object({ name: string().required() }),
  initialValues: { name: '' }
})
</script>

<template>
  <MyForm action="user/update" method="PUT">
    <VqTextField name="name" label="Name" />
    <VqSubmitBtn />
  </MyForm>
</template>
```

### `useVqDataTable<TValue>()`

Returns a strongly-typed wrapper around `VqDataTable`. Use this when you need TypeScript inference for item slot props.

```ts
import { useVqDataTable } from '@qnx/vuetify'

interface User { id: number; name: string; email: string }

const UserTable = useVqDataTable<User>()
```

### `useVqList<TValue>()`

Returns a strongly-typed wrapper around `VqList`. Use this when you need TypeScript inference for the default slot's `items` prop.

```ts
import { useVqList } from '@qnx/vuetify'

interface Post { id: number; title: string }

const PostList = useVqList<Post>()
```

### `collectVqHeaders(headers)`

Prepends a `#` (serial number) column to a headers array for use with `VqDataTable`.

```ts
import { collectVqHeaders } from '@qnx/vuetify'

const headers = collectVqHeaders([
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
])
// → [{ title: '#', sortable: false }, { title: 'Name', key: 'name' }, ...]
```

### `collectVqHeaders` + `VqSerialNo` Example

```vue
<template>
  <VqDataTable id="users" action="users" :headers="headers">
    <template #item="{ item, index }">
      <tr>
        <VqSerialNo :index="index + 1" />
        <td>{{ item.name }}</td>
        <td>{{ item.email }}</td>
        <td>
          <VqDatatableItemAction
            id="users"
            :item-id="String(item.id)"
            action="users/delete"
            method="DELETE"
          />
        </td>
      </tr>
    </template>
  </VqDataTable>
</template>
```

## Filter + Table Pattern

`VqTableFilter` and `VqDataTable` (or `VqList`) are linked by a shared `id`. When filter values change, the table automatically reloads.

```vue
<template>
  <VqTableFilter id="users">
    <VqTextField name="search" label="Search" />
  </VqTableFilter>

  <VqDataTable id="users" action="users" :headers="headers" />
</template>
```

## Localization

Built-in UI strings (`"Submit"`, `"Load More"`, the confirm dialog labels, etc.) can be overridden at app startup with `setVqLocale`:

```ts
import { setVqLocale } from '@qnx/vuetify'

setVqLocale({
  submit: 'Enviar',
  loadMore: 'Cargar más',
  confirmTitle: 'Confirmación',
  confirmDeleteDescription: '¿Eliminar este registro?',
  confirm: 'Confirmar',
  cancel: 'Cancelar',
  changeStatusTooltip: 'Cambiar estado',
  submitErrorMessage: 'Revisa los campos.'
})
```

`setVqLocale` accepts a partial — keys you omit stay on the English defaults. The locale store is reactive, so labels update live if you call it again. `resetVqLocale()` restores the bundled English. The `VqLocale` type is exported for typed locale configs.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT License](https://github.com/yatendra121/vq-vuetify/blob/main/LICENSE.md) © 2023-PRESENT [Yatendra Kushwaha](https://github.com/yatendra121)
