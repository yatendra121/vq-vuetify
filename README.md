# @qnx/vuetify

@qnx/vuetify is providing components to simplify your codes.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install @qnx/vuetify.

```bash
npm install @qnx/vuetify
```

You can also use [yarn](https://yarnpkg.com/) & [pnpm](https://pnpm.io/)

```bash
yarn add @qnx/vuetify
```

```bash
pnpm install @qnx/vuetify
```

#### Peer-Dependencies

@qnx/vuetify is resolving problems internally so it depends on some other libraries.

```bash
npm install vuetify@next @qnx/composables @vee-validate yup axios
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

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT License](https://github.com/yatendra121/vq-vuetify/blob/main/LICENSE.md) © 2023-PRESENT [Yatendra Kushwaha](https://github.com/yatendra121)
