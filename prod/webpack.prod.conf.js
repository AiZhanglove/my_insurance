var webpack = require('webpack');
var path = require('path');
var config = require('../webpack.config');
var HtmlWebpackPlugin = require('html-webpack-plugin');
config.output.path = path.resolve(__dirname, '../dist/build');
config.output.filename = '[name].[chunkhash].js';

config.plugins = (config.plugins || []).concat([
    new webpack.optimize.CommonsChunkPlugin('common.[chunkhash].js', [
        'insurance_build',
        'asset_build',
        'car_build'
    ]),
    new HtmlWebpackPlugin({
        filename: '../index.html',
        template: 'prod/index.template.html',
        chunks: ['index_build']
    }),
    new HtmlWebpackPlugin({
        filename: '../insurance.html',
        template: 'prod/insurance.template.html',
        excludeChunks: [
            'index_build',
            'asset_build',
            'casher_build',
            'channel_build',
            'uav_build',
            'frame_build',
            'category_build',
            'new_build',
            'car_build'
        ]
    }),
    new HtmlWebpackPlugin({
        filename: '../insurance_asset.html',
        template: 'prod/insurance_asset.template.html',
        excludeChunks: [
            'index_build',
            'insurance_build',
            'casher_build',
            'channel_build',
            'uav_build',
            'frame_build',
            'category_build',
            'new_build',
            'car_build'
        ]
    }),
    new HtmlWebpackPlugin({
        filename: '../casher.html',
        template: 'prod/casher.template.html',
        chunks: ['casher_build']
    }),
    new HtmlWebpackPlugin({
        filename: '../channel.html',
        template: 'prod/channel.template.html',
        chunks: ['channel_build']
    }),
    new HtmlWebpackPlugin({
        filename: '../uav.html',
        template: 'prod/uav.template.html',
        chunks: ['uav_build']
    }),
    new HtmlWebpackPlugin({
        filename: '../frame.html',
        template: 'prod/frame.template.html',
        chunks: ['frame_build']
    }),
    new HtmlWebpackPlugin({
        filename: '../category.html',
        template: 'prod/category.template.html',
        chunks: ['category_build']
    }),
    new HtmlWebpackPlugin({
        filename: '../free.html',
        template: 'prod/free.template.html',
        chunks: ['free_build']
    }),
    new HtmlWebpackPlugin({
        filename: '../car.html',
        template: 'prod/car.template.html',
        excludeChunks: [
            'index_build',
            'asset_build',
            'casher_build',
            'channel_build',
            'uav_build',
            'frame_build',
            'category_build',
            'new_build',
            'insurance_build'
        ]
    })
]);

module.exports = config;
