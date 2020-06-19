const path = require('path');

module.exports = {
    entry: {
        index: ['./src/lib/index.js']
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget: 'commonjs2'
    },

    optimization: {
        minimize: false
    }
};
