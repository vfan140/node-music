<h4>常用分类</h4>
<ul class = 'music-menu'>
	<li class= 'music-albums-item music-munu-history' 
		:class="{'active' : album == 'history'}"
		@click='activeChange("history")'>
		<i class="fa fa-lg fa-history" aria-hidden="true"></i>播放历史
	</li>
	<li class= 'music-albums-item music-munu-love' 
		:class="{'active' : album == 'love'}"
		@click='activeChange("love")'>
		<i class="fa fa-lg fa-heart-o" aria-hidden="true"></i>我喜欢
	</li>
</ul>
<h4>我的歌单</h4>
<ul class= 'music-albums'>
	<li v-for="_album in albums"
		class= 'music-albums-item music-album'
		:class = "{'active' : album == _album.id }"
		@click='activeChange(_album.id)'>
		<i class="fa fa-lg fa-music" aria-hidden="true"></i>
		<div class="music-album-module-text">${_album.name}</div>
		<span class='music-album-module'>${_album.from}</span>
	</li>
</ul>