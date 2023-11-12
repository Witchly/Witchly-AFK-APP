const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: './out/index.js', 
    output: {
        path: path.resolve(__dirname, 'out'), 
        filename: 'bundle.js', 

    },
    target: 'electron-main', // Build for Electron's main process
    externals: {
        'electron': 'require("electron")',
        // Ignore WS trying to use modules that don't exist for different environments
        'bufferutil': 'require("bufferutil")',
        'utf-8-validate': 'require("utf-8-validate")',
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
            }),
        ],
    }
};