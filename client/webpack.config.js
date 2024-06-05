import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { fileURLToPath } from "url";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import webpack from "webpack";
import dotenv from 'dotenv';

dotenv.config({ path: '../server/.env' }); 
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default (_env, argv) => {
  const devMode = argv.mode !== "production";

  return {
    entry: "./src/index.js",

    output: {
      path: path.join(__dirname, "/../server", "/dist"),
      filename: "bundle.js",
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
      }),
      new webpack.EnvironmentPlugin({
        ENV: process.env.ENV, 
        PORT: process.env.PORT
      })
    ].concat(devMode ? [] : [new MiniCssExtractPlugin()]),

    module: {
      rules: [
        {
          test: /.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        },
        {
          test: /\.(sa|sc|c|post)ss$/,
          use: [
            devMode ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
          type: "asset",
        },
      ],
    },

    devServer: {
      port: 3000,
      hot: true,
      open: true,
      historyApiFallback: true,
      proxy: [
        {
          context: ["/api"],
          target: "http://localhost:8080",
        },
      ],
    },
  };
};
