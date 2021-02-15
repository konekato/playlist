// Musics in playlist
function Music(id, name, artist) {
  this.id = id;
  this.name = name;
  this.artist = artist;
}
const musics = [
  new Music("hKoioiDpwrk", "Higher's High (TAKU INOUE Remix)", "ナナヲアカリ"),
  new Music("x8VYWazR5mE", "夜に駆ける", "YOASOBI"),
  new Music("POCs38Rputs", "その群青が愛しかったようだった", "n-buna feat.ヤギヌマカナ"),
  new Music("nDbNRb9gOr4", "夜明けと蛍", "ナブナ"),
  new Music("DtBoAqkIJzI", "幽霊東京", "Ayase"),
  new Music("E2b_bvTbDz8", "太陽になれるかな", "ツユ"),
];
const musicsCounter = musics.length;
let now_i = 0;
let existShuffleIndexArray = [];

// Draw musics
let playlistNode = document.getElementById("playlist");
for (let i = 0; i < musicsCounter; i++) {
  let music = document.createElement("a");
  music.setAttribute("class", "play");

  let player = document.createElement("li");
  player.setAttribute("id", musics[i].id);
  player.setAttribute("class", "list");

  let title = document.createElement("div");
  title.setAttribute("class", "title");
  title.innerHTML = musics[i].name;

  let artist = document.createElement("div");
  artist.setAttribute("class", "artist");
  artist.innerHTML = musics[i].artist;

  player.append(title);
  player.append(artist);
  music.append(player);
  playlistNode.append(music);
}

// Set Youtube Player API
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "300",
    width: "300",
    events: {
      onStateChange: onPlayerStateChange,
    },
  });
}

function onPlayerStateChange(event) {
  switch (event.data) {
    case YT.PlayerState.ENDED:
      loadMusic(getNextMusicIndex(false));
      break;
    case YT.PlayerState.PLAYING:
      let pauseBtn = document.getElementById("pause");
      pauseBtn.onclick = function () {
        player.pauseVideo();
      };
      changeClassName(pauseBtn.firstChild, "fa-play-circle", "fa-pause-circle");
      break;
    case YT.PlayerState.PAUSED:
      let playBtn = document.getElementById("pause");
      playBtn.onclick = function () {
        player.playVideo();
      };
      changeClassName(playBtn.firstChild, "fa-pause-circle", "fa-play-circle");
      break;
    case YT.PlayerState.BUFFERING:
      break;
  }
}

// Set functions
function changeClassName(node, before, after) {
  if (before != "") {
    node.classList.remove(before);
  }
  if (after != "") {
    node.classList.add(after);
  }
}

function getMusicIndexByRandom() {
  if (existShuffleIndexArray.length >= musicsCounter) {
    existShuffleIndexArray = [];
  }
  let rn = Math.floor(Math.random() * Math.floor(musicsCounter));
  while (existShuffleIndexArray.indexOf(rn) != -1) {
    rn = Math.floor(Math.random() * Math.floor(musicsCounter));
  }
  existShuffleIndexArray.push(rn);
  return rn;
}

function getNextMusicIndex(isPrev) {
  if (isShuffle) {
    return getMusicIndexByRandom();
  } else {
    let n = now_i;
    if (isPrev) {
      return --n < 0 ? musicsCounter - 1 : n;
    } else {
      return ++n > musicsCounter - 1 ? 0 : n;
    }
  }
}

function loadMusic(next_i) {
  changeClassName(
    document.getElementById(musics[now_i].id),
    "is-music-active",
    ""
  );
  changeClassName(
    document.getElementById(musics[now_i].id).firstChild,
    "t-p",
    ""
  );
  changeClassName(
    document.getElementById(musics[next_i].id),
    "",
    "is-music-active"
  );
  changeClassName(
    document.getElementById(musics[next_i].id).firstChild,
    "",
    "t-p"
  );
  player.loadVideoById(musics[next_i].id, 0, "small");
  now_i = next_i;
}

// Set actions
let isShuffle = false;
document.getElementById("shuffle").onclick = function () {
  if (isShuffle) {
    isShuffle = false;
    changeClassName(this.firstChild, "is-shuffle-active", "");
  } else {
    isShuffle = true;
    changeClassName(this.firstChild, "", "is-shuffle-active");
  }
};

document.getElementById("prev").onclick = function () {
  loadMusic(getNextMusicIndex(true));
};

document.getElementById("next").onclick = function () {
  loadMusic(getNextMusicIndex(false));
};

document.getElementById("mute").onclick = function () {
  if (player.isMuted()) {
    player.unMute();
    changeClassName(this.firstChild, "fa-volume-mute", "fa-volume-up");
  } else {
    player.mute();
    changeClassName(this.firstChild, "fa-volume-up", "fa-volume-mute");
  }
};

let playTargets = document.getElementsByClassName("play");
for (let i = 0; i < playTargets.length; i++) {
  playTargets[i].addEventListener("click", function () {
    loadMusic(i);
  });
}

function isNotPC() {
    if (navigator.userAgent.match(/iPhone|Android|Mobile/)) {
      return true;
    } else {
      return false;
    }
}

$(document).ready(function () {
    if (isNotPC()) {
        $('#myModal').modal('show');
    }
});
