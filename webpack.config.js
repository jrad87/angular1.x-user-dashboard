const webpack = require('webpack');
const path = require('path');

const APP_DIR = path.join(__dirname, 'src/client/app');
const BUILD_DIR = path.join(__dirname, 'src/client/public');

module.exports = {
    entry: `${APP_DIR}/app.js`,
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: APP_DIR,
                loader: 'babel-loader'
            }, {
                test: /\.html$/,
                loader: 'html',
                include: `${BUILD_DIR}/partials`
            }, {
                test: /\.css$/,
                loader: 'css',
                include: `${BUILD_DIR}/stylesheets`
            }
        ]
    }
}
