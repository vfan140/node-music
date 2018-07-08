process.env.NODE_ENV = 'production'

const del = require('del')
const webpack = require('webpack')

const mainConfig = require('./webpack.main.config')
const rendererConfig = require('./webpack.renderer.config')

function build(){
	del.sync(['dist/electron/*', '!.gitkeep'])
	Promise.all([
		pack(mainConfig,'main'),
		pack(rendererConfig,'renderer')
	]).then(() => {
		process.exit()
	})
}

function pack(config, packType){
	config.mode = 'production'
	return new Promise((resolve, reject) => {
		webpack(config, (err) => {
			if (err){
				reject(err.stack || err)
				return
			}
			console.log(`${packType} pack success`)
			resolve()
		})
	})
}

build()
