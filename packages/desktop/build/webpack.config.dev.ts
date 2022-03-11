import merge from 'webpack-merge';

import baseConfig from './webpack.config.base';

const config = merge(baseConfig, {
  mode: 'development',
  devtool: 'source-map',
  watchOptions: {
    aggregateTimeout: 600
  }
});

export default config;
