import CopyPlugin from 'copy-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import merge from 'webpack-merge';

import baseConfig from './webpack.config.base';

const config = merge(baseConfig, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin({})]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          context: path.resolve(__dirname, '../public'),
          from: '**/*',
          to: path.resolve(__dirname, '../dist')
        }
      ]
    })
  ]
});

export default config;
