MIDIPlayer
============

MIDIPlayer is a project based on MIDIFile that allows you to play MIDI files in
 your browser with the help of the WebMIDIAPI.
 
This player is currently used under production for this [MIDI Karaoke Player](http://midiwebkaraoke.com)

Usage
-------------
```js
// AMD Module that require the MIDIPlayer and MIDIFile modules
define(['./libs/midiplayer/src/MIDIPlayer', './libs/midifile/src/MIDIFile'],
	function(MIDIPlayer, MIDIFile) {


	navigator.requestMIDIAccess().then(function(midiAccess) {
		// Creating player
		var midiPlayer=new MIDIPlayer({'output':midiAccess.outputs()[0]});

		// creating the MidiFile instance from a buffer (view MIDIFile README)
		midiFile=new MIDIFile(buffer);
		midiPlayer.load(midiFile);

		// Playing
		midiPlayer.play(function() {
			console.log('Play ended');
		});
		
		// Volume
		midiPlayer.volume=80; // in percent

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

});
```

You can also simply add script tags to your HTML document and use MIDIPlayer
 consstructor from the global scope like [in this sample](http://rest4.org/github/nfroidure/MIDIPlayer/master/tests/index.html).

License
-------
Copyright Nicolas Froidure 2013. MIT licence.
