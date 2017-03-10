
var webpack =require('webpack');
var path = require('path');

module.exports ={
	entry:{
		todo:path.resolve(__dirname, 'todo/app.js'),
	},
	output:{
		path:path.resolve(__dirname, 'web'),
		publicPath:'../scripts/',
		filename:'scripts/[name].js'
	},
	resolve:{
		modules: [
			"node_modules",
			path.resolve(__dirname, 'common'),
		],
		alias:{
		}
	},
	plugins: [
	],
	externals:{
	},
	module:{
		loaders:[
			{test: /\.js$/, exclude: /(node_modules|bower_components)/, loader: 'babel-loader',query: {
				presets: ['es2017', 'es2016'],
				//plugins: ['transform-runtime']
			}},
			{ test: /\.html$/, loader: 'raw-loader'},
			{ test: /\.less$/, loader: 'css-loader!less-loader' }, // 用!去链式调用loader
		]
	},
	devServer: {
		contentBase: path.join(__dirname, "web"),
		compress: true,
		port: 8080,
		publicPath: '/',
	}
};