<div class="jumbotron music-jumbotron">
	<div class='music-album-info'>
		<h2>${info.name}</h2>
		<p>
			<span>歌曲数:${info.count}首</span>
			<span>创建时间:${new Date(info.createTime)}</span>
		</p>
	</div>
</div>
<table class='table table-hover table-responsive music-songs-table'>
	<thead>
		<tr>
			<th></th>
			<th>歌曲</th>
			<th>演唱者</th>
			<th>专辑</th>
			<th>来源</th>
		</tr>
	</thead>
	<tbody>
		<tr v-for='song in songs' @click='selectSong(song,songs)' :title='song.songname'>
			<td class='music-song-seria'>${ $index+1 }</td>
			<td class='music-song-name'>${song.songname}</td>
			<td>${song.singername}</td>
			<td>${song.diskname}</td>
			<td>${song.appname}</td>
		</tr>	
	</tbody>
</table>