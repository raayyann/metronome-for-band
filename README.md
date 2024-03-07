# Metronome for Band

> This is an app I made for my band's personal use

An application that allows musicians to use a metronome with their band members at the same time (synced metronome) with the song structure

[Demo](https://metronome.ray.toys)

## Creating the song file

This is the example of the song file

```json
{
  "title": "Anything You Want",
  "artist": "Reality Club",
  "bpm": 176,
  "bpb": 4,
  "bar": 172,
  "structure": {
    "1": "verse",
    "17": "prechorus",
    "37": "chorus",
    "60": "instrumental",
    "73": "verse",
    "89": "prechorus",
    "109": "chorus",
    "157": "outro"
  }
}
```

- **Title:** The title of the song
- **Artist:** The artist of the song
- **BPM:** The tempo of the song (bpm)
- **BPB:** The time signature (Beats per bar) Example: 3/4 should be 3 bpb, 4/4 should be 4 bpb
- **Bar:** Number of bars of the song
- **Sturcture:** The song structure there are intro, verse, prechorus, chorus, instrumental, outro. You can add more by adding the audio file in the `audio/` folder. The number is the bar

Save this file in `songs/` folder
