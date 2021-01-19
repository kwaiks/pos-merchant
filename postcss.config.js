module.exports = {
    parser: "postcss-scss",
    plugins: [
      require('postcss-preset-env')({ stage: 0 }),
      require("tailwindcss"),
      require("autoprefixer")
    ],
  };