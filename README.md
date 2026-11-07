<div align="center">

# @qnx/vuetify

**Declarative Vuetify form, table, and list components that talk to your API for you.**

[![npm version](https://img.shields.io/npm/v/@qnx/vuetify.svg?color=42b883)](https://www.npmjs.com/package/@qnx/vuetify)
[![npm downloads](https://img.shields.io/npm/dm/@qnx/vuetify.svg)](https://www.npmjs.com/package/@qnx/vuetify)
[![license](https://img.shields.io/npm/l/@qnx/vuetify.svg)](https://github.com/yatendra121/vq-vuetify/blob/main/LICENSE.md)
[![Vue 3](https://img.shields.io/badge/Vue-3-42b883.svg)](https://vuejs.org/)
[![Vuetify 4](https://img.shields.io/badge/Vuetify-4-1867c0.svg)](https://vuetifyjs.com/)

📖 [Documentation](https://qnx-vuetify-docs.vercel.app/) · 🤖 MCP Server: `npx @qnx/vuetify-mcp`
<!-- · 🎮 [Live Examples](https://qnx-vuetify-sample.vercel.app/) -->

</div>

---

## 🚀 Overview

`@qnx/vuetify` is a Vue 3 component library built on top of [Vuetify](https://vuetifyjs.com/) that removes the repetitive plumbing behind data-driven UIs. Forms, server-side tables, and infinite lists handle their own **validation**, **HTTP requests**, **error display**, **pagination**, and **request cancellation** — so your templates stay declarative.

**Built for** Vue 3 teams using Vuetify who are tired of rewriting the same `axios` + loading-state + error-mapping boilerplate on every page.

**Use it for:**

- 📝 Forms with schema validation and automatic server-error mapping
- 📊 Server-side data tables with paging, sorting, and filtering
- 📜 Infinite-scroll lists wired to a paginated endpoint
- 🔗 Filter forms linked to a table or list by a shared `id`

## ✨ Features

- **Zero fetch boilerplate** — set an `action`, the request lifecycle is managed for you
- **Automatic error mapping** — server validation errors map straight to form fields
- **Race-condition safe** — in-flight requests are cancelled on change and unmount
- **Server-side tables & lists** — paging, sorting, and filtering built in
- **TypeScript-first** — generics flow your item types into slots
- **Localizable** — override every built-in UI string with one call
- **Tree-shakeable** — `sideEffects: false`, import only what you use

## 🧱 Tech Stack

| Layer            | Technology                                  |
| ---------------- | ------------------------------------------- |
| Framework        | [Vue 3](https://vuejs.org/)                 |
| UI               | [Vuetify 4](https://vuetifyjs.com/)         |
| Validation       | [vee-validate 4](https://vee-validate.logaretm.com/) + [Yup](https://github.com/jquense/yup) *(optional)* |
| State            | [Pinia 3](https://pinia.vuejs.org/)         |
| HTTP             | [axios](https://axios-http.com/) via [`@qnx/composables`](https://www.npmjs.com/package/@qnx/composables) |
| Language         | [TypeScript](https://www.typescriptlang.org/) |
| Rich text *(opt)*| [TinyMCE](https://www.tiny.cloud/)          |

## ⚡ Quick Start

> Get a validated, API-connected form on screen in under 5 minutes.

### Prerequisites

| Requirement | Version                          |
| ----------- | -------------------------------- |
| Node.js     | `^18.13` · `^20.11` · `>=22`     |
| Vue         | `^3.5`                           |
| Vuetify     | `^4.1`                           |

### 1. Install

```bash
# npm
npm install @qnx/vuetify

# pnpm
pnpm add @qnx/vuetify

# yarn / bun
yarn add @qnx/vuetify
bun add @qnx/vuetify
```

Install the peer dependencies:

```bash
npm install vuetify@^4.1.0 pinia vee-validate axios @qnx/composables
```

### 2. Register

```ts
// main.ts
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import { createPinia } from 'pinia'
import VqVuetify from '@qnx/vuetify'
import App from './App.vue'

createApp(App)
  .use(createVuetify())
  .use(createPinia())
  .use(VqVuetify)        // globally registers all Vq* components
  .mount('#app')
```

> Prefer explicit imports? Skip `.use(VqVuetify)` and import components directly:
> `import { VqForm, VqTextField } from '@qnx/vuetify'`.

### 3. Use

```vue
<script setup>
import { object, string } from 'yup'

const schema = object({
  email: string().required().email(),
  password: string().required()
})
</script>

<template>
  <VqForm id="login" action="auth/login" :validation-schema="schema">
    <VqTextField name="email" label="Email" />
    <VqTextField name="password" label="Password" type="password" />
    <VqSubmitBtn />
  </VqForm>
</template>
```

That's it — validation, submission, loading state, and server-error display are handled. Next, point requests at your API in [Configuration](#-configuration).

## 📂 Project Structure

```text
src/
├─ components/
│  ├─ Vuetify/      # VqForm, VqDataTable, VqList, field inputs…
│  ├─ Basic/        # VqSubmitBtn, snackbar message queue
│  └─ Tinymce/      # VqTextEditor (optional integration)
├─ composables/     # useVqForm, useVqDataTable, useVqList
├─ config/          # locale / i18n strings
├─ store/           # Pinia stores (form state, messages)
├─ types/           # shared TypeScript types
├─ integrations.ts  # opt-in entry for optional components
└─ index.ts         # public entry + Vue plugin
```

## 🔧 Configuration

### Point requests at your API

Components send requests through the shared `axios` instance from `@qnx/composables`. Configure its base URL once at startup:

```ts
import axios from 'axios'
import { setAxiosInstance } from '@qnx/composables/axios'

setAxiosInstance(
  axios.create({
    baseURL: import.meta.env.VITE_API_URL, // e.g. https://api.example.com
    headers: { Accept: 'application/json' }
  })
)
```

Now a component `action="users"` resolves to `GET {baseURL}/users`.

### Required plugins

`@qnx/vuetify` relies on **Vuetify** and **Pinia** being installed on the app (see [Quick Start](#2-register)). Pinia backs internal form and message state.

### Rich text editor *(optional)*

`VqTextEditor` ships from the optional `/integrations` entry and requires `@tinymce/tinymce-vue`. Set the asset base URL once (the editor loads `{baseUrl}/{filesPath}`, with `filesPath` defaulting to `static/tinymce/tinymce.min.js`):

```ts
import { setConfig } from '@qnx/vuetify/integrations'
import { VqTextEditor } from '@qnx/vuetify/integrations'

setConfig({ baseUrl: '/tinymce' })
```

## 📸 Demo

| Resource          | Link                                                |
| ----------------- | --------------------------------------------------- |
| 📖 Documentation  | https://qnx-vuetify-docs.vercel.app/                |
| 🎮 Live Examples  | https://qnx-vuetify-sample.vercel.app/ *(soon)*     |

## 🧪 Usage Examples

### Form with validation

```vue
<script setup>
import { object, string } from 'yup'

const schema = object({
  name: string().required(),
  email: string().required().email()
})
const onSuccess = (res) => console.log(res)
</script>

<template>
  <VqForm
    id="create-user"
    action="user/create"
    method="POST"
    :validation-schema="schema"
    @submitted-success="onSuccess"
  >
    <VqTextField name="name" label="Name" />
    <VqTextField name="email" label="Email" />
    <VqSubmitBtn />
  </VqForm>
</template>
```

### Server-side data table

Pagination, sorting, filtering, request cancellation, and loading state — all internal:

```vue
<script setup lang="ts">
import { useVqDataTable, collectVqHeaders } from '@qnx/vuetify'

interface User { id: number; name: string; email: string }

const UsersTable = useVqDataTable<User>()
const headers = collectVqHeaders([
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' }
])
</script>

<template>
  <UsersTable id="users" action="users" :headers="headers">
    <template #item="{ item, index }">
      <tr>
        <VqSerialNo :index="index + 1" />
        <td>{{ item.name }}</td>
        <td>{{ item.email }}</td>
      </tr>
    </template>
  </UsersTable>
</template>
```

### Infinite-scroll list

```vue
<template>
  <VqList id="posts" action="posts" :page-size="10">
    <template #default="{ items, loading, finished, loadMore }">
      <div v-for="post in items" :key="post.id">{{ post.title }}</div>
    </template>
    <template #load-more>
      <VqListLoadMoreBtn />
    </template>
  </VqList>
</template>
```

### Filter + table pattern

A `VqTableFilter` and `VqDataTable` (or `VqList`) share an `id`; changing a filter reloads the data automatically. Each change sends a request and cancels the previous one — set `filter-debounce` (ms) on the table or list to wait for typing to pause:

```vue
<template>
  <VqTableFilter id="users">
    <VqTextField name="search" label="Search" />
  </VqTableFilter>

  <VqDataTable id="users" action="users" :headers="headers" :filter-debounce="300" />
</template>
```

### Reloading after a change

`useVqListControls` refreshes a table or list from anywhere, with or without a `VqTableFilter`. It takes the table's or list's `id`. `reload()` keeps a table on its current page; `reset()` returns to the first page. Lists restart from the first page for both.

```ts
import { useVqListControls } from '@qnx/vuetify'

const { reload, reset } = useVqListControls('users')
```

`useFormFilterRepository('users_filter')` does the same with the `id` plus `_filter`.

To change a loaded row without refetching, use `updateItemKeyValue`, `updateItemValue` or `deleteItemValue`. Pass the row type to have keys suggested and values checked:

```ts
import { updateItemKeyValue } from '@qnx/vuetify'

updateItemKeyValue<User>('users', user.id, 'status', 'active')
```

### Snackbar messages

Mount `VqMessageQueue` once near your app root to show messages from `useMessageInstance()` and from `VqDatatableItemAction`:

```vue
<script setup>
import { useMessageInstance } from '@qnx/vuetify'

const message = useMessageInstance()
message.success('Saved')
</script>

<template>
  <VqMessageQueue />
</template>
```

## 📘 API Reference

### Form Components

Use inside a `VqForm` / `useVqForm` wrapper — they bind to form state and display validation automatically.

| Component        | Description                                         |
| ---------------- | --------------------------------------------------- |
| `VqForm`         | Form wrapper — submission, validation, server calls |
| `VqTextField`    | Text input bound to form state                      |
| `VqTextarea`     | Textarea bound to form state                        |
| `VqAutocomplete` | Autocomplete/select, supports remote items          |
| `VqCheckbox`     | Checkbox bound to form state                        |
| `VqDatePicker`   | Date picker bound to form state                     |
| `VqTimePicker`   | Time picker bound to form state                     |
| `VqColorPicker`  | Color picker bound to form state                    |
| `VqOtpInput`     | OTP input bound to form state                       |
| `VqFileInput`    | File input bound to form state                      |
| `VqFileUpload`   | File upload with upload handling                    |
| `VqSubmitBtn`    | Submit button reflecting form busy state            |

Fields validate on submit. Once a field shows an error, it re-validates as its value changes, so the message clears when corrected.

`VqDatePicker`, `VqTimePicker`, and `VqColorPicker` render a read-only text field that opens the picker. `id` and `placeholder` go to the text field, and other attributes go to the picker; use `field-props` for anything else on the text field, e.g. `:field-props="{ variant: 'outlined' }"`. Set `type` to open the picker in a dialog instead of a menu. Space or ArrowDown opens the picker from the keyboard; Enter still submits the form.

> **`VqDatePicker` values.** Picking a date stores a `Date` at local midnight, which JSON serializes to the previous day anywhere east of Greenwich. Add `date-only` to store a `YYYY-MM-DD` string instead.

> **`VqFileInput` validation.** By default the value is stored under the literal key `name[file]`, so a schema must use that exact key: `object({ 'avatar[file]': mixed().required() })`. A schema on `avatar` or `avatar.file` never sees the value, so the form can't submit. For a schema on `avatar`, add `raw-name`, which stores the value at `avatar` and changes the submitted key from `avatar[file]` to `avatar`.

> **Event names.** Listen for `submitted-*`. The original misspelled `submited-*` names are still emitted with the same payloads, so existing listeners keep working; they are deprecated.

<details>
<summary><b><code>VqForm</code> props &amp; events</b></summary>

**Props**

| Prop                     | Type       | Default     | Description                                      |
| ------------------------ | ---------- | ----------- | ------------------------------------------------ |
| `id`                     | `string`   | —           | Unique form identifier *(required)*              |
| `action`                 | `string`   | —           | API endpoint for submission *(required)*         |
| `method`                 | `string`   | `"POST"`    | HTTP method                                      |
| `initialValues`          | `object`   | `undefined` | Initial values — form resets when this changes   |
| `validationSchema`       | `object`   | `undefined` | Yup validation schema. It can be swapped later, but vee-validate ignores one first set after the form is created; change the form's `key` to recreate it |
| `valuesSchema`           | `object`   | `undefined` | Maps nested response fields to flat form fields  |
| `formData`               | `boolean`  | `false`     | Submit as `multipart/form-data`                  |
| `successResponseHandler` | `function` | —           | Custom success handler                           |
| `errorResponseHandler`   | `function` | —           | Custom error handler                             |

**Events**

| Event                    | Payload       | Emitted when                       |
| ------------------------ | ------------- | ---------------------------------- |
| `submitted-success`       | `ApiResponse` | Server responds successfully       |
| `submitted-error`         | `ApiResponse` | Server returns a validation error  |
| `submitted-client-error`  | vee-validate invalid-submit context | Client-side validation fails |
| `submitted-request-error` | `AxiosError`  | Request fails with any other error (500s, network failures) |

</details>

### Data Table Components

| Component               | Description                                              |
| ----------------------- | -------------------------------------------------------- |
| `VqDataTable`           | Server-side table on Vuetify's `VDataTableServer`        |
| `VqSerialNo`            | `<td>` with the row's serial number                      |
| `VqDatatableItemAction` | Row action button with a confirmation dialog             |

<details>
<summary><b><code>VqDataTable</code> &amp; <code>VqDatatableItemAction</code> props</b></summary>

`VqDatatableItemAction` is a named export and is not registered by the plugin, so an app's own global component of that name keeps working: `import { VqDatatableItemAction } from '@qnx/vuetify'`.

**`VqDataTable`**

| Prop           | Type            | Default                           | Description                       |
| -------------- | --------------- | --------------------------------- | --------------------------------- |
| `id`           | `string`        | —                                 | Identifier *(required)*           |
| `action`       | `string`        | —                                 | Fetch endpoint *(required)*       |
| `method`       | `string`        | `"GET"`                           | HTTP method                       |
| `page`         | `number`        | `1`                               | Initial page                      |
| `itemsPerPage` | `number`        | `10`                              | Rows per page                     |
| `sortBy`       | `SortByValue[]` | `[{ key: "name", order: "asc" }]` | Default sort. The default is sent even if there's no `name` column; pass `[]` to send no sort |
| `filterDebounce` | `number`      | `0`                               | Delay (ms) before a filter change refetches |

Changing `page`, `itemsPerPage`, `sortBy`, or `action` after mount refetches. Emits `error` when a fetch fails.

Requests send `page`, `itemsPerPage`, and `sortBy`. `VqList` sends `page` and `page_size` instead, so a shared endpoint has to accept both.

**`VqDatatableItemAction`**

| Prop          | Type     | Default                           | Description                               |
| ------------- | -------- | --------------------------------- | ----------------------------------------- |
| `id`          | `string` | —                                 | Table ID — reloads after action *(req.)*  |
| `itemId`      | `string \| number` | `"0"`                  | Row ID, appended to `action` as a path    |
| `action`      | `string` | `"user/change-status"`            | API endpoint                              |
| `method`      | `string` | `"PUT"`                           | HTTP method                               |
| `title`       | `string` | `locale.confirmTitle`             | Dialog title                              |
| `description` | `string` | `locale.confirmDeleteDescription` | Dialog message                            |
| `icon`        | `string` | Delete icon                       | Icon name or SVG path                     |
| `tooltip`     | `string` | `locale.changeStatusTooltip`      | Tooltip and accessible label              |

</details>

### List Components

| Component           | Description                                              |
| ------------------- | -------------------------------------------------------- |
| `VqList`            | Infinite-scroll list integrating with `VqTableFilter`    |
| `VqListLoadMoreBtn` | Loads the next page — used inside `VqList`               |
| `VqTableFilter`     | Filter form linked to a table/list by `id`               |

<details>
<summary><b><code>VqList</code> &amp; <code>VqTableFilter</code> props</b></summary>

**`VqList`**

| Prop       | Type     | Default | Description                          |
| ---------- | -------- | ------- | ------------------------------------ |
| `id`       | `string` | —       | Identifier *(required)*              |
| `action`   | `string` | —       | Fetch endpoint *(required)*          |
| `method`   | `string` | `"GET"` | HTTP method                          |
| `pageSize` | `number` | `10`    | Items per page                       |
| `filterDebounce` | `number` | `0` | Delay (ms) before a filter change refetches |

**Slots:** `default` and `load-more` both receive `{ items, loading, finished, loadMore }`; other `VList` slots are forwarded. Without a `default` or `load-more` slot, `VList` renders `items` itself. Emits `error` when a fetch fails.

**`VqTableFilter`**

| Prop | Type     | Default | Description                                    |
| ---- | -------- | ------- | ---------------------------------------------- |
| `id` | `string` | —       | Must match the paired table/list *(required)*  |

</details>

### Composables

| Composable             | Returns                                                            |
| ---------------------- | ----------------------------------------------------------------- |
| `useVqForm(options)`   | A form `wrapper` plus `resetForm`, `values`, `errors`, `meta`, `setFieldValue`, `setValues`, `setErrors`, `validate` |
| `useVqDataTable<T>()`  | A typed `VqDataTable` with inference for item slots               |
| `useVqList<T>()`       | A typed `VqList` with inference for the default slot's `items`    |
| `collectVqHeaders(h)`  | Prepends a `#` serial-number column to a headers array            |
| `useVqListControls(id)` | `reload()` / `reset()` for the table or list with that `id` |
| `useFormFilterRepository(key)` | The same, keyed by `<id>_filter` |
| `useMessageInstance()` | `success()` / `warning()` / `error()` snackbar helpers            |

```ts
import { useVqForm } from '@qnx/vuetify'
import { object, string } from 'yup'

const { wrapper: EditUser, resetForm } = useVqForm({
  formId: 'edit-user',
  validationSchema: object({ name: string().required() }),
  initialValues: { name: '' }
})
```

### Localization

Override any built-in string (`"Submit"`, `"Load More"`, dialog labels…) with `setVqLocale`. It accepts a partial — omitted keys keep the English default. `resetVqLocale()` restores defaults.

```ts
import { setVqLocale } from '@qnx/vuetify'

setVqLocale({
  submit: 'Enviar',
  loadMore: 'Cargar más',
  confirmTitle: 'Confirmación',
  confirmDeleteDescription: '¿Eliminar este registro?',
  confirm: 'Confirmar',
  cancel: 'Cancelar',
  selectTime: 'Seleccionar hora',
  close: 'Cerrar',
  next: 'Siguiente'
})
```

## 🤖 MCP Server

AI assistants can query this library's docs through the `@qnx/vuetify-mcp` server.

| Tool                     | Description                                            |
| ------------------------ | ----------------------------------------------------- |
| `get_component_list`     | List all components grouped by category               |
| `get_component_docs`     | Full docs for a component: props, events, examples    |
| `get_composable_list`    | List all composables with descriptions                |
| `get_composable_docs`    | Full docs for a composable                            |
| `get_installation_guide` | Installation steps and peer dependencies              |
| `get_usage_guide`        | Practical usage examples                              |

**Supported clients:** Claude Desktop · Claude Code · Cursor · Windsurf · Cline · Continue.dev · Codex CLI · ChatGPT Desktop

```json
{
  "mcpServers": {
    "qnx-vuetify": {
      "command": "npx",
      "args": ["-y", "@qnx/vuetify-mcp"]
    }
  }
}
```

## 🤝 Contributing

Contributions are welcome! For major changes, open an issue first to discuss the direction.

```bash
git clone https://github.com/yatendra121/vq-vuetify.git
cd vq-vuetify
pnpm install
pnpm test:unit     # run the test suite
pnpm lint          # lint & autofix
pnpm build         # build the library
```

Please keep changes focused and update tests as appropriate.

## 📄 License

[MIT](https://github.com/yatendra121/vq-vuetify/blob/main/LICENSE.md) © 2023–PRESENT [Yatendra Kushwaha](https://github.com/yatendra121)
