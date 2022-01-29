import { MiniReactRefreshWebpackPlugin } from '@njzy/mini-react-refresh-webpack-plugin';
import merge from 'webpack-merge';

import baseConfig from './webpack.config.base';

const config = merge(baseConfig, {
  mode: 'development',
  devServer: {
    port: process.env.RENDERER_DEV_PORT,
    hot: true,
    compress: true,
    historyApiFallback: true
  },
  plugins: [new MiniReactRefreshWebpackPlugin()]
});

export default config;
