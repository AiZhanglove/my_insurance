var webpack= require('webpack');
module.exports = {
	entry:{
		index_build:'./src/index.js',
		category_build: './src/category.js',
		frame_build: './src/frame.js'
	},
	output:{
		path:'./build',
		publicPath:'build/',
		filename:'[name].js'
	},
	module:{
		loaders:[
			{
				test: /\.less$/,
				loader: 'style-loader!css-loader!less-loader'
			},
			{
				test:/\.css$/,
				loader:'style-loader!css-loader'
			},
			{
				test:/\.(js|jsx)$/,
				exclude: /node_modules/,
				loader:'react-hot!babel-loader'
			},
			{
				test:/\.(png|jpg|jpeg|gif|woff)$/,
				loader:'url?limit=4192&name=[path][name].[ext]'
			}
		]
	},
	resolve:{
		//自动补全后缀
		extenstions:['','.js','.jsx','less','scss','css']
	},
	babel: {
        presets: ['es2015', 'stage-2', 'react'],
        plugins: ['transform-runtime', 'add-module-exports']
    },
	devServer: {
        proxy: {
            '/v1/*': {
                target: 'http://staging.mifi.pt.xiaomi.com/',
                secure: false,
                changeOrigin: true,
                onProxyReq: function(proxyReq, req, res) {
                    //此处设置cookie
                    proxyReq.setHeader(
                        'Cookie',
                        'uLocale=zh_CN; userName=undefined; serviceToken=oI0vHJBryqcok9hcebRpune7RQFhlQcIpbZlVINPPRJKdIxyuXwh+olnExCyHZJQYhDDLPzbua/O8cJNh2nxGq0Zxns2Xa/eQVzRpgPuRDFJ3f1f3DDbJkGR8PHMnYWG2r1zxDo7l7yZpNeIy4S0m/4bvJYRWp4XyuRTkVZe7JmSEpUJ6riBxMFSVMCmGoNLm+/YHp68YloOjgcxZ5cSsLVuUCmxTokUqFZCT1Ry/7A=; userId=4166015; mifiapi_slh=mulWj0GiFiPbNyRw+A3Or9xTLT0=; mifiapi_ph=TykN7d+7uCSLPf4q2U63eA=='
                    );
                },
                bypass: function(req, res, proxyOptions) {}
            }
        }
    }
}

//
if (process.env.NODE_ENV === 'production') {
    module.exports.plugins = [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin()
    ];
} else {
    module.exports.devtool = 'cheap-module-eval-source-map';
}