# @qnx/vuetify

`@qnx/vuetify` is a Vue.js library designed to simplify Vuetify form, streamlining code and handling various processes internally, including validation, data set management, and server data submission. This approach aims to reduce code complexity and promote clean and manageable code.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install @qnx/vuetify.

```bash
npm install @qnx/vuetify
```

You can also use [yarn](https://yarnpkg.com/), [pnpm](https://pnpm.io/), or [bun](https://bun.sh/)

```bash
yarn add @qnx/vuetify
```

```bash
pnpm install @qnx/vuetify
```

```bash
bun install @qnx/vuetify
```

#### Peer-Dependencies

@qnx/vuetify resolves problems internally and depends on some other libraries.

```bash
npm install vuetify@latest @qnx/composables @vee-validate yup axios
```

## Usage

```bash
<script setup>
import { VqForm, VqTextField } from '@qnx/vuetify'
import { object, string } from 'yup';

let validationSchema= object({
  name: string().required(),
  email: string().required().email(),
});

const initialValues = { name:'Test User', email:'test@gmail.com' }

const onSuccess = (res) => { console.log(res) }

</script>
<template>
 <VqForm
    action="user/create"
    method="POST"
    :validation-schema="validationSchema"
    :initial-values="initialValues"
    @submited-success="onSuccess"
  >
    <vq-text-field
      name="name"
      label="Name"
      placeholder="Name"
    />
    <vq-text-field
      name="email"
      label="Email"
      placeholder="Email"
    />
    <button type="submit">Submit</button>
 <VqForm />
</template>
```

## Components

Here's a list of components provided by @qnx/vuetify:

### Vuetify Form Components:

-   VqTextField
-   VqTextarea
-   VqAutocomplete
-   VqFileInput
-   VqForm
-   VqCheckbox
-   VqDatePicker
-   VqTimePicker
-   VqColorPicker
-   VqOtpInput
-   VqSubmitBtn

### Other Components:

-   VqDataTable
-   VqSerialNo
-   VqList
-   VqTableFilter
-   VqListLoadMoreBtn

### Integration Components:

-   VqTextEditor

## Composables

-   useVqForm
-   collectVqHeaders
-   useVqList

Additionally, @qnx/vuetify extends existing components that are specifically useful in the context of forms. The library also includes additional components designed for displaying data. Overall, it appears to be a comprehensive solution for simplifying the implementation of forms and managing data presentation within Vuetify-based applications.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT License](https://github.com/yatendra121/vq-vuetify/blob/main/LICENSE.md) © 2023-PRESENT [Yatendra Kushwaha](https://github.com/yatendra121)
