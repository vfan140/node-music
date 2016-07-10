<div class='music-player'>
	<div class='music-player-middle'>
		<audio class='music-player-audio' autoplay = 'false' src=''></audio>
		<div class='music-track-info'>
			<span class='music-track-info-songname'>${song.songname}</span> -
			<span class='music-track-info-singername'>${song.singername}</span>
		</div>
		<div class='music-player-progress'>
			<span class='music-player-position'>${nowText}</span>
			<span class='music-player-bar'>
				<div class='music-player-bar-pass' :style="{width : percent}"></div>
				<div class='music-player-dot' :style="{left : percent}"></div>
			</span>
			<span class='music-player-duration'>${durationText}</span>
		</div>
	</div>
	<div class='music-player-controller'>
		<i class="fa fa-2x fa-backward" aria-hidden="true" @click='playSong(-1)'></i>
		<i class="fa fa-2x fa-pause" aria-hidden="true"></i>
		<i class="fa fa-2x fa-forward" aria-hidden="true" @click='playSong(1)'></i>
	</div>
	<div class='music-player-volume'></div>
</div>