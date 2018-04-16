// import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
// import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
// import commonjs from 'rollup-plugin-commonjs';

const env = process.env.NODE_ENV;
const config = {
  input: 'src/index.js',
  plugins: [
    babel({
      exclude: 'node_modules/**',
      plugins: ['transform-object-rest-spread', 'external-helpers', 'idx', 'transform-regenerator']
    })
  ],
  output: {
    format: env === 'development' || env === 'production' ? 'umd' : env,
    name: 'ReduxNakshatra'
  },
  external: ['axios', 'redux-saga/effects', 'babel-polyfill']
};

if (env === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  );
}

export default config;
