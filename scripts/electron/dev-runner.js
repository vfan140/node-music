'use strict'

const path = require('path')
const { spawn } = require('child_process')
const chalk = require('chalk')
const electron = require('electron')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const webpackHotMiddleware = require('webpack-hot-middleware')

const mainConfig = require('./webpack.main.config')
const rendererConfig = require('./webpack.renderer.config')

function resolve (dir) {
  return path.join(__dirname, '../../', dir)
}

//设置webpack模式
mainConfig.mode = 'development'
rendererConfig.mode = 'development'

//设置devtools调试
mainConfig.entry.main = [resolve('src/platforms/electron/main/index.dev.js')].concat(mainConfig.entry.main)

let hotMiddleware
let electronProcess = null

/**
 * 渲染进程相关初始化
 */
function startRenderer(){
	return new Promise((resolve,reject) => {
		const compiler = webpack(rendererConfig)
		compiler.hooks.done.tap('rendererLoging',(stats) => {
			console.log('renderer done...')
			console.log(stats.toString())
		})
		hotMiddleware = webpackHotMiddleware(compiler, { 
      		log: false, 
      		heartbeat: 2500 
    	})
		const server = new WebpackDevServer(compiler,{
			quiet: true,
			before(app, context){
				app.use(hotMiddleware)
				context.middleware.waitUntilValid(() => {
				  resolve()
				})
			}
		})
		server.listen(9080)
	})
}

/**
 * 主进程初始化
 */
function startMain(){
	return new Promise((resolve, reject) => {
		const compiler = webpack(mainConfig)
		compiler.watch({}, (err, stats) => {
		  if (err) {
		    console.log(err)
		    return
		  }
		  console.log('main done...')
		  console.log(stats.toString())
		  resolve()
		})
	})
}

/**
 * 启动Electron
 */
function startElectron(){
	electronProcess = spawn('electron', ['--inspect=5858', '.'])

	electronProcess.stdout.on('data', (data) => {
	  console.log(`stdout: ${data}`)
	})

	electronProcess.stderr.on('data', (data) => {
	  console.log(`stderr: ${data}`)
	})

	electronProcess.on('close',() => {
		process.exit()
	})
}

/**
 * 开发模式下应用初始化
 */
function init() {
	Promise.all([startRenderer(),startMain()])
		.then(() => {
			startElectron()
		})
		.catch(err => {
			console.error(err)
		})
}

init()