const fs = require("fs");
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const timesyncServer = require("timesync/server");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

app.use("/timesync", timesyncServer.requestHandler);

const songs = {};

fs.readdirSync("songs")
  .filter((a) => a.endsWith(".json"))
  .forEach((file) => {
    const song = require("./songs/" + file);
    songs[`${song.title} - ${song.artist}`] = file;
  });

app.get("/songs", (req, res) => {
  res.json(songs);
});

app.use("/songs", express.static("songs"));

app.get("/audio", (req, res) => {
  res.json(fs.readdirSync("audio").filter((a) => a.endsWith(".mp3")));
});

app.use("/audio", express.static("audio"));

io.on("connection", (socket) => {
  socket.on("timesync", (data) => {
    socket.emit("timesync", {
      id: data && "id" in data ? data.id : null,
      result: Date.now(),
    });
  });

  socket.on("join", (room) => {
    socket.join(room);
  });

  socket.on("play", (song) => {
    io.emit("play", song, Date.now() + 1000);
  });
});

server.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
