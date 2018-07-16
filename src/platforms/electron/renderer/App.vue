<template>
  <div id="app" class="app">
	<header class="header">
		<span class="header__logo"></span>
	</header>
	<div class="content">
		<div class="aside">
			
		</div>
		<div class="body">
			<router-view></router-view>
		</div>
	</div>	
	<footer class="footer"></footer>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style lang="less">
@import "~@root/static/css/common.less";
html{
	font-size: 62.5%;
}
html,body{
	height: 100%;
}
.app{
	display: flex;
	flex-direction : column;
	height: 100%;
	.header,.footer{
		flex : 0 0 60px;
	}
	.content{
		flex : 1 0 auto;
	}
}
.header{
	background-color: @blue;
	border-bottom: 1px solid @deepgray;
}
.aside,.footer{
	background-color: @gray;
}
.aside{
	border-right: 1px solid @deepgray;
}
.footer{
	border-top : 1px solid @deepgray;
}
.content{
	display: flex;
	.aside{
		flex : 0 0 190px
	}
	.body{
		flex : 1 1 auto;
	}
}
</style>