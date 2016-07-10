<ul class= 'music-modules'>
	<li class= 'music-module' v-for="vModule in modules">
		<template v-if='vModule.inited == true'>
			<i class = 'fa fa-lg fa-circle'></i>
			<span class='music-module-name loaded'>${vModule.name}</span>
		</template>
		<template v-if='vModule.inited == false'>
			<i class = 'fa fa-lg fa-circle-o'></i>
			<span class='music-module-name unload' @click='openLoginModal(vModule.key);'>${vModule.name}</span>
		</template>
	</li>
</ul>
<modal :show.sync="showModal" title="test" effect="fade" width="800" class="music-login-modal">
	<div slot="modal-header" class="modal-header">
    	<h4 class="modal-title">账号登陆</h4>
  	</div>
  	<div slot="modal-body" class="modal-body">
  		<form>
			<div class="form-group">
    			<label for="account">账号</label>
    			<input id="account" v-model="u" type="text" class="form-control"/>
  			</div>
			<div class="form-group">
    			<label for="password">密码</label>
    			<input id="password" v-model="p" type="password" class="form-control"/>
  			</div>
  		</form>
  	</div>
  	<div slot="modal-footer" class="modal-footer">
    	<button type="button" class="btn btn-default" @click='showModal = false'>取消</button>
    	<button type="button" class="btn btn-success" @click='doLogin();'>确定</button>
  	</div>
</modal>