const process = require('process');
const express= require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const errorHandler = require('errorhandler');

var index = require('./server/routes/index.js'),
    album = require('./server/routes/album.js');

var app = express();
var env = 'development';//暂时只提供开发模式

if(env === 'development'){
	var webpack = require('webpack'),
		webpackDevMiddleware = require('webpack-dev-middleware');
	var config = require('./webpack.config.dev.js');
    app.use(errorHandler());
    app.use(webpackDevMiddleware(webpack(config), {
        publicPath: '/build/',
        stats: {
            colors: true
        }
    }));
	app.set('views',__dirname + '/server/views');
}

app.set('view engine', 'jade');

//中间件设置
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  secret : 'node-music-7',
  resave : false,
  saveUninitialized : true
}));
app.use(express.static(__dirname));

//路由,后续单独成配置
app.get('/', index.index);
app.get('/modules',index.modules);
app.post('/init',index.init);
app.get('/albums',album.getAlbums);
app.get('/album',album.getAlbum);
app.get('/favsongs',album.getFavSongs);
app.get('/songsrc',album.getSongSrc);

process.on('uncaughtException', function (err) {
  console.error(err);
});

//启动服务器
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log(`app listening at http://${host}:${port}`);
});
