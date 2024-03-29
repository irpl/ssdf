import pkg from "./package";

export default {
  server: {
    port: 3030,
    host: "0.0.0.0",
  },

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no",
      },
      { hid: "description", name: "description", content: pkg.description },
    ],
    script: [
      {
        src: "https://code.jquery.com/jquery-3.3.1.slim.min.js",
        integrity:
          "sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo",
        crossorigin: "anonymous",
      },
      {
        src: "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js",
        integrity:
          "sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1",
        crossorigin: "anonymous",
      },
      {
        src: "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js",
        integrity:
          "sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM",
        crossorigin: "anonymous",
      },
      {
        type: "text/javascript",
        src: "https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js",
      },
      {
        type: "text/javascript",
        src: "https://cdn.datatables.net/1.10.19/js/dataTables.bootstrap4.min.js",
      },
      {
        type: "text/javascript",
        src: "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/js/bootstrap-datepicker.min.js",
      },
      {
        src: "https://kit.fontawesome.com/f0f1d79673.js",
        crossorigin: "anonymous",
      },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "favicon.ico" },
      {
        rel: "stylesheet",
        href: "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css",
        integrity:
          "sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T",
        crossorigin: "anonymous",
      },
      {
        href: "https://fonts.googleapis.com/css?family=Abril+Fatface|Karla:400,700&display=swap",
        rel: "stylesheet",
      },
      {
        rel: "stylesheet",
        type: "text/css",
        href: "https://cdn.datatables.net/1.10.19/css/dataTables.bootstrap4.min.css",
      },
      {
        rel: "stylesheet",
        type: "text/css",
        href: "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/css/bootstrap-datepicker.min.css",
      },
    ],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },

  /*
   ** Global CSS
   */
  css: [],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],

  /*
   ** Nuxt.js modules
   */
  modules: [],
  serverMiddleware: [{ path: "/api", handler: "~/api/index.js" }],

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
};
