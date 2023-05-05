const mix = require("laravel-mix");

mix.ts("resources/js/main.ts", "public/js").vue({ version: 3 });
mix.postCss("resources/js/assets/app.css", "public/css", [
  require("tailwindcss"),
]);

mix.webpackConfig({
  output: {
    chunkFilename: "js/chunks/[name].[chunkhash].js", // replace with your path
  },
});
