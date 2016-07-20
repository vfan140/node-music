<div id = 'app'>
	<header>
		<modules-component :modules='modules'></modules-component>
	</header>
	<div id = 'content' class = 'music-content'>
		<aside>
			<albums-component :albums='albums' :album='activeAlbum'></albums-component>
		</aside>
		<article>
			<album-component :album='activeAlbum'></album-component>
		</article>
	</div>
	<footer>
		<player-component :song='playSong' :songs='playSongList'></player-component>
	</footer>

	<loading-component :show='isLoading'></loading-component>
	
</div>