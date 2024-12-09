const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

export default {
    resolve: {
        fallback: {
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify'),
            http: require.resolve('stream-http'),
            https: require.resolve('https-browserify'),
            process: require.resolve('process/browser'),
            buffer: require.resolve('buffer'),
        },
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
        new ReactRefreshWebpackPlugin(),
        new NodePolyfillPlugin(),
    ],
};
