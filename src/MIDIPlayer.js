// MIDIPlayer : Play MIDI files

// AMD + global + NodeJS : You can use this object by inserting a script
// or using an AMD loader (like RequireJS) or using NodeJS
(function(root,define){ define(['./libs/midifile/src/MIDIEvents'], function(MIDIEvents) {
// START: Module logic start

	var PLAY_BUFFER_DELAY=600;

	function MIDIPlayer(options) {
		options=options||{};
		this.output=options.output||null; // midi output
		this.volume=options.volume||100; // volume in percents
		this.startTime=-1; // ms since page load
		this.pauseTime=-1; // ms elapsed before player paused
		this.events=[];
		this.notesOn=new Array(32); // notesOn[channel][note]
		for(var i=31; i>=0; i--) {
			this.notesOn[i]=[];
		}
		this.midiFile=null;
	}

	// Parsing all tracks and add their events in a single event queue
	MIDIPlayer.prototype.load = function(midiFile) {
		this.stop();
		this.position=0
		this.midiFile=midiFile;
		this.events=this.midiFile.getMidiEvents();
	};

	MIDIPlayer.prototype.play = function(endCallback) {
		this.endCallback=endCallback;
		if(0===this.position) {
			this.startTime=performance.now();
			this.timeout=setTimeout(this.processPlay.bind(this),0);
			return 1;
		}
		return 0;
	};

	MIDIPlayer.prototype.processPlay = function() {
		var elapsedTime=performance.now()-this.startTime;
		var event, karaoke, param2;
		event=this.events[this.position];
		while(this.events[this.position]&&event.playTime-elapsedTime<PLAY_BUFFER_DELAY) {
			param2=0;
			if(event.subtype==MIDIEvents.EVENT_MIDI_NOTE_ON) {
				param2=Math.floor(event.param1*((this.volume||1)/100));
				this.notesOn[event.channel].push(event.param1);
			} else if(event.subtype==MIDIEvents.EVENT_MIDI_NOTE_OFF) {
				var index=this.notesOn[event.channel].indexOf(event.param1)
				if(-1!==index) {
					this.notesOn[event.channel].splice(index,1);
				}
			}
			this.output.send([(event.subtype<<4)+event.channel, event.param1,
				(param2||event.param2||0x00)], Math.floor(event.playTime+this.startTime));
			this.lastPlayTime=event.playTime+this.startTime;
			this.position++
			event=this.events[this.position];
		}
		if(this.position<this.events.length-1) {
			this.timeout=setTimeout(this.processPlay.bind(this),PLAY_BUFFER_DELAY-250);
		} else {
			setTimeout(this.endCallback,PLAY_BUFFER_DELAY+100);
			this.position=0;
		}
	};

	MIDIPlayer.prototype.pause = function() {
		if(this.timeout) {
			clearTimeout(this.timeout);
			this.timeout=null;
			this.pauseTime=performance.now();
			for(var i=this.notesOn.length-1; i>=0; i--) {
				for(var j=this.notesOn[i].length-1; j>=0; j--) {
					this.output.send([(MIDIEvents.EVENT_MIDI_NOTE_OFF<<4)+i, this.notesOn[i][j],
						0x00],this.lastPlayTime+100);
				}
			}
			return true;
		}
		return false;
	};

	MIDIPlayer.prototype.resume = function(endCallback) {
		this.endCallback=endCallback;
		if(this.events&&this.events[this.position]&&!this.timeout) {
			this.startTime+=performance.now()-this.pauseTime
			this.timeout=setTimeout(this.processPlay.bind(this),0);
			return this.events[this.position].playTime;
		}
		return 0;
	};

	MIDIPlayer.prototype.stop = function() {
		if(this.pause()) {
			this.position=0;
			for(var i=31; i>=0; i--) {
				this.notesOn[i]=[];
			}
			return true;
		}
		return false;
	};

// END: Module logic end

	return MIDIPlayer;

});})(this,typeof define === 'function' && define.amd ?
	// AMD
	define :
	// NodeJS
	(typeof exports === 'object'?function (name, deps, factory) {
		var root=this;
		if(typeof name === 'object') {
			factory=deps; deps=name;
		}
		module.exports=factory.apply(this, deps.map(function(dep){
			return require(dep);
		}));
	}:
	// Global
	function (name, deps, factory) {
		var root=this;
		if(typeof name === 'object') {
			factory=deps; deps=name;
		}
		this.MIDIPlayer=factory.apply(this, deps.map(function(dep){
			return root[dep.substring(dep.lastIndexOf('/')+1)];
		}));
	}.bind(this)
	)
);
