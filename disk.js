var disk = {
	// prompt the user to load a file
	load: function() {
		var i = document.createElement("input");
		i.type = "file";
		i.style.display = "none";
		i.onchange = disk._onLoad;
		i.click();
	},
	// load callback
	_onLoad: function(e) {
		var f = e.target.files[0];
		var r = new FileReader();
		r.onerror = function(event) {
			disk.onLoadError(event.error);
		};
		r.onload = function() {
			disk.onLoad(new Uint8Array(r.result));
		};
		r.readAsArrayBuffer(f);
	},
	// prompt the user to save the current file
	save: function(data) {
		var byteArray = new Uint8Array(data),
			a = document.createElement('a');
		a.href = URL.createObjectURL(new Blob([byteArray], { type: 'application/octet-stream' }));
		a.download = "disk";
		a.click();
	},
	
	// callback to run when finished loading (users should redefine it)
	onLoad: function(data) {},
	
	// callback to run if something goes wrong
	onLoadError: function(message) {
		console.log(message);
	},
};
