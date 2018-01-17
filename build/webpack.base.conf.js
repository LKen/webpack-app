var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

function resolve(dir) {
	return path.join(__dirname, '..', dir) // 包括返回上一层
}
// 配置文件的内容需要通过module.exports暴露
module.exports = {
	// 配置需要打包的入口文件，值可以是字符串、数组、对象。
	// 1. 字符串： entry： './entry'
	// 2. 字符串： entry：[ './entry1','entry2'] (多入口)
	// 3. 对象：   entry： {alert/index': path.resolve(pagesDir, `./alert/index/page`)}
	// 多入口书写的形式应为object，因为object,的key在webpack里相当于此入口的name,
	entry: {
		app: './src/main.js'
	},
	output: {
		// 输出文件配置，output 输出有自己的一套规则，常用的参数基本就是这三个
		// path: 表示生成文件的根目录 需要一个**绝对路径** path仅仅告诉Webpack结果存储在哪里
		path: config.build.assetsRoot,
		// filename 属性表示的是如何命名出来的入口文件，规则是一下三种： 
		// [name] 指代入口文件的name，也就是上面提到的entry参数的key，因此，我们可以在name里利用/，即可达到控制文件目录结构的效果。
		// [hash]，指代本次编译的一个hash版本，值得注意的是，只要是在同一次编译过程中生成的文件，这个[hash].js 
		//的值就是一样的；在缓存的层面来说，相当于一次全量的替换。
		filename: '[name].js',
		// publicPath 参数表示的是一个URL 路径（指向生成文件的跟目录），用于生成css/js/图片/字体文件
		// 等资源的路径以确保网页能正确地加载到这些资源.
		// “publicPath”项则被许多Webpack的插件用于在生产模式下更新内嵌到css、html文件里的url值.
		// 例如，在localhost（即本地开发模式）里的css文件中边你可能用“./test.png”这样的url来加载图片，
		// 但是在生产模式下“test.png”文件可能会定位到CDN上并且你的Node.js服务器可能是运行在HeroKu上边的。
		// 这就意味着在生产环境你必须手动更新所有文件里的url为CDN的路径。
		//开发环境：Server和图片都是在localhost（域名）下
		//.image { 
		// background-image: url('./test.png');
		//}
		// 生产环境：Server部署下HeroKu但是图片在CDN上
		//.image { 
		//  background-image: url('https://someCDN/test.png');
		//}
		publicPath: process.env.NODE_ENV === 'production' ?
			config.build.assetsPublicPath : config.dev.assetsPublicPath // 去到当前的运行环境
	},
	// 用来配置依赖文件的匹配，如依赖文件的别名配置、模块的查找目录、默认查找的
	// 文件后缀名
	// resolve.root 该选型用来制定模块查找的根路径，必须为**绝对路径**，值可以
	// 是路径字符串或者路径数组若是数组，则会依次查找
	resolve: {
		extensions: ['.js', '.vue', '.json'],
		// 用来配置依赖文件的别名，值是一个对，该对象的键是别名，值是实际路径
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
			'@': resolve('src'),
		}
	},
	// 用来进行模块加载相关的配置
	module: {
		// webpack拥有一个类似于插件的机制，名为Loader，通过Loader，webpack能够针对每一种特定的资源做出相应的处理
		// 1.test参数用来指示当前配置项针对哪些资源，该值应是一个条件值(condition)。
		// 2.exclude参数用来剔除掉需要忽略的资源，该值应是一个条件值(condition)。
		// 3.include参数用来表示本loader配置仅针对哪些目录/文件，该值应是一个条件值(condition)。
		// 而include参数则用来指示目录；注意同时使用这两者的时候，实际上是and的关系。
		// 4.loader/loaders参数，用来指示用哪个或哪些loader来处理目标资源，这俩货
		// 表达的其实是一个意思，只是写法不一样，我个人推荐用loader写成一行，多个
		// loader间使用!分割，这种形式类似于管道的概念，又或者说是函数式编程。形
		// 如loader: 'css?!postcss!less'，可以很明显地看出，目标资源先经less-loader
		// 处理过后将结果交给postcss-loader作进一步处理，然后最后再交给css-loader。
		// options  [ **********待补充************* ]
		rules: [{
				test: /\.(js|vue)$/,
				loader: 'eslint-loader',
				enforce: 'pre',
				include: [resolve('src'), resolve('test')],
				options: {
					formatter: require('eslint-friendly-formatter')
				}
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: vueLoaderConfig
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [resolve('src'), resolve('test')]
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('img/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('media/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
				}
			}
		]
	}
}