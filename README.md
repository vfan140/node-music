# node-music
> 基于Node合并几个主流音乐APP的歌单....

### 目录结构

```
├── package.json
├── client                  # 前端目录
	├───components			# vue组件
	├───resource			# css/font
	├───main.js				# 前端入口文件
├── server               	# 后端目录
	├───routes				# 路由
	├───service				# 业务层(目前支持QQ音乐、虾米音乐和网易云)
	├───utils				# 工具集
	├───views				# 视图
├── app.js                 	# 后端启动文件
└── webpack.config.dev.js  	# webpack配置文件（开发用）

```
  
## TODO

- 补充一些基础设置
- 搜索（源还是APP本身,手动滑稽）
- 异常处理