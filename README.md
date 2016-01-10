# MIDIPlayer
> MIDIPlayer allows you to play MIDI files in your browser with the help of the
 WebMIDIAPI.

[![NPM version](https://badge.fury.io/js/midiplayer.svg)](https://npmjs.org/package/midiplayer)
[![Dependency Status](https://david-dm.org/nfroidure/midiplayer.svg)](https://david-dm.org/nfroidure/midiplayer)
[![devDependency Status](https://david-dm.org/nfroidure/midiplayer/dev-status.svg)](https://david-dm.org/nfroidure/midifile#info=devDependencies)

MIDIPlayer can be used either in modern browsers
 ([pick the last bundle](https://github.com/nfroidure/MIDIPlayer/blob/master/dist/MIDIPlayer.js))
 or with NodeJS by installing the following
 [NPM module](https://npmjs.org/package/midiplayer) :
```bash
npm install midiplayer
```

This player is used for this [MIDI Karaoke Player](http://midiwebkaraoke.com)

## Usage
```js
//Require MIDIPlayer and MIDIFile modules
var MIDIPlayer = require('midiplayer');
var MIDIFile = require('midifile');


navigator.requestMIDIAccess().then(function(midiAccess) {
	// Creating player
	var midiPlayer = new MIDIPlayer({
	  'output': midiAccess.outputs()[0]
	});

	// creating the MidiFile instance from a buffer (view MIDIFile README)
	var midiFile = new MIDIFile(buffer);

	// Loading the midiFile instance in the player
	midiPlayer.load(midiFile);

	// Playing
	midiPlayer.play(function() {
		console.log('Play ended');
	});

	// Volume
	midiPlayer.volume = 80; // in percent

	// Pausing
	midiPlayer.pause();

	// Resuming
	midiPlayer.resume();

	// Stopping
	midiPlayer.stop();

	// Playing again and loop
	midiPlayer.play(function playCallback() {
		midiPlayer.play(playCallback);
	});

}, function() {
	console.log('No midi output');
});
```

## License
Copyright Nicolas Froidure 2013. MIT licence.
