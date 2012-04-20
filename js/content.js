var options = [];
var optionsGet = 'options';
var showFileSize = '';
var displayBlock = $('<div>').appendTo('body');
	displayBlock.css({
		position: 'fixed',
		padding: '0 1px',
		zIndex: '9999',
		display: 'none',
		fontFamily: 'Lucida Console',
	});

chrome.extension.sendRequest(optionsGet, function(response) {
	displayBlock.css({
		color: response[0],
		fontSize: response[1] + 'px',
		backgroundColor: response[2],
		border: '1px solid ' + response[3],
		borderRadius: response[4] + 'px'
	});
	showFileSize = response[5];
	switch (response[6]) {
		case 'topLeft':
			displayBlock.css({
				top: '1px',
				left: '1px'
			})
			break
		case 'topRight':
			displayBlock.css({
				top: '1px',
				right: '1px'
			})
			break
		case 'bottomLeft':
			displayBlock.css({
				bottom: '1px',
				left: '1px'
			})
			break
		case 'bottomRight':
			displayBlock.css({
				bottom: '1px',
				right: '1px'
			})
	}
});

$('img').on('mouseenter', function() {
	var image = this;
	var imageSource = this.src;

	if (showFileSize == 'on') {
		var requestSize = $.ajax({
			type: 'HEAD',
			url: imageSource,
			success: function() {
				var fileSizeBytes = requestSize.getResponseHeader('Content-length');

				function updateBlock(context) {
					displayBlock.text(image.width + 'x' + image.height + ' | ' + context);
					if (image.width != image.naturalWidth || image.height != image.naturalHeight) {
						displayBlock.text(image.width + 'x' + image.height + ' (' + image.naturalWidth + 'x' + image.naturalHeight + ')' + ' | ' + context);
					}
				}

				if (fileSizeBytes < 1024) {
					updateBlock(fileSizeBytes + ' B');
				} else if (fileSizeBytes / 1024 < 1024) {
					updateBlock((fileSizeBytes / 1024).toFixed(2) + ' Kb');
				} else {
					updateBlock((fileSizeBytes / 1048576).toFixed(2) + ' Mb');
				}
			}

		});	
	}

	displayBlock.text(this.width + 'x' + this.height);
	if (this.width != this.naturalWidth || this.height != this.naturalHeight) {
		displayBlock.text(this.width + 'x' + this.height + ' (' + this.naturalWidth + 'x' + this.naturalHeight + ')');
	}
	$(displayBlock).fadeIn(70);
});

$('img').on('mouseleave', function() {
	$(displayBlock).fadeOut(10);
});