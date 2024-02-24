const metronome = new Metronome();
const socket = io();

const ts = timesync.create({
  server: socket,
  interval: 5000,
});

let room;
while (!room) {
  room = prompt("Enter room name");
}

socket.emit("join", room);

ts.send = function (socket, data, timeout) {
  return new Promise(function (resolve, reject) {
    var timeoutFn = setTimeout(reject, timeout);

    socket.emit("timesync", data, function () {
      clearTimeout(timeoutFn);
      resolve();
    });
  });
};

socket.on("timesync", function (data) {
  ts.receive(null, data);
});

const song = document.getElementById("song");
const playButton = document.getElementById("play-button");
const bpm = document.getElementById("bpm");

fetch("/songs").then((body) => {
  body.json().then((songs) => {
    for (const [name, file] of Object.entries(songs)) {
      const option = document.createElement("option");
      option.value = file;
      option.text = name;
      song.appendChild(option);
    }
  });
});

playButton.addEventListener("click", () => {
  socket.emit("play", song.value);
});

let structure = {};

socket.on("play", (song, time) => {
  console.log(song);
  fetch("/songs/" + song).then((body) => {
    body.json().then((song) => {
      setTimeout(() => {
        metronome.tempo = bpm.value > 0 ? bpm.value : song.bpm;
        metronome.beatsPerBar = song.bpb;
        structure = song.structure;
        metronome.startStop();
      }, time - ts.now());
    });
  });
});

createjs.Sound.alternateExtensions = ["mp3"];

fetch("/audio").then((body) => {
  body.json().then((aud) => {
    aud.forEach((a) => {
      createjs.Sound.registerSound("/audio/" + a, a.replace(".mp3", ""));
    });
  });
});

metronome.onNote((currentBar, beatNumber) => {
  for (const bar in structure) {
    if (currentBar == bar - 2 && beatNumber == 1) {
      createjs.Sound.play(structure[bar]);
    }
    if (currentBar == bar - 1) {
      createjs.Sound.play(beatNumber);
    }
  }

  document.getElementById("bar").textContent = currentBar;
  document.getElementById("beat").textContent = beatNumber;
});
