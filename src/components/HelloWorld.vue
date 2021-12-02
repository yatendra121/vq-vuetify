<template>
  <v-container>
    <v-form>
      <v-container fluid>
        <v-alert outlined prominent type="success" dense text>
          I'm a dense alert with the <strong>text</strong> prop and a
          <strong>type</strong> of success
        </v-alert>
        <v-textarea
          name="input-7-1"
          label="Default style"
          value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
          hint="Hint text"
        ></v-textarea>
        <v-card>
          <v-responsive :aspect-ratio="16 / 9">
            <v-card-text>
              This card will always be 16:9 (unless you put more stuff in it)
            </v-card-text>
          </v-responsive>
        </v-card>
        <v-progress-linear color="pink" value="15" reverse></v-progress-linear>

        <br />

        <v-progress-linear
          color="lime"
          indeterminate
          reverse
        ></v-progress-linear>

        <br />
        <v-row justify="space-around">
          <v-icon large color="green darken-2"> mdi-domain </v-icon>

          <v-icon large color="blue darken-2"> mdi-message-text </v-icon>

          <v-icon large color="purple darken-2"> mdi-dialpad </v-icon>

          <v-icon large color="teal darken-2"> mdi-email </v-icon>

          <v-icon large color="blue-grey darken-2"> mdi-call-split </v-icon>

          <v-icon large color="orange darken-2">
            mdi-arrow-up-bold-box-outline
          </v-icon>
        </v-row>
        <v-img
          lazy-src="https://picsum.photos/id/11/10/6"
          max-height="150"
          max-width="250"
          src="https://picsum.photos/id/11/500/300"
        ></v-img>
        <v-checkbox label="Custom progress bar"></v-checkbox>
        <v-text-field
          color="cyan darken"
          label="Text field"
          placeholder="Start typing..."
          loading
        >
          <template v-slot:progress>
            <v-progress-linear absolute height="7"></v-progress-linear>
          </template>
        </v-text-field>
      </v-container>
    </v-form>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img :src="logo" class="my-3" contain height="200" />
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          <div>Welcome to the Vuetify 3 Alpha</div>
        </h1>

        <small>Vite Preview</small>

        <p class="subheading font-weight-regular">
          For help and collaboration with other Vuetify developers,
          <br />please join our online
          <a href="https://community.vuetifyjs.com" target="_blank"
            >Discord Community</a
          >
        </p>
      </v-col>

      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-5">What's next?</h2>

        <v-row justify="center">
          <a
            v-for="(next, i) in whatsNext"
            :key="i"
            :href="next.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ next.text }}
          </a>
        </v-row>
      </v-col>

      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-5">Important Links</h2>

        <v-row justify="center">
          <a
            v-for="(link, i) in importantLinks"
            :key="i"
            :href="link.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ link.text }}
          </a>
        </v-row>
      </v-col>

      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-5">Ecosystem</h2>

        <v-row justify="center">
          <a
            v-for="(eco, i) in ecosystem"
            :key="i"
            :href="eco.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ eco.text }}
          </a>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import logo from "../assets/logo.svg";

export default {
  name: "HelloWorld",

  data: () => ({
    ecosystem: [
      {
        text: "vuetify-loader",
        href: "https://github.com/vuetifyjs/vuetify-loader",
      },
      {
        text: "github",
        href: "https://github.com/vuetifyjs/vuetify",
      },
      {
        text: "awesome-vuetify",
        href: "https://github.com/vuetifyjs/awesome-vuetify",
      },
    ],
    importantLinks: [
      {
        text: "Chat",
        href: "https://community.vuetifyjs.com",
      },
      {
        text: "Made with Vuetify",
        href: "https://madewithvuejs.com/vuetify",
      },
      {
        text: "Twitter",
        href: "https://twitter.com/vuetifyjs",
      },
      {
        text: "Articles",
        href: "https://medium.com/vuetify",
      },
    ],
    logo,
    whatsNext: [
      {
        text: "Explore components",
        href: "https://vuetifyjs.com",
      },
      {
        text: "Roadmap",
        href: "https://vuetifyjs.com/introduction/roadmap/",
      },
      {
        text: "Frequently Asked Questions",
        href: "https://vuetifyjs.com/getting-started/frequently-asked-questions",
      },
    ],
  }),
};
</script>
