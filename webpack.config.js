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
    },
};