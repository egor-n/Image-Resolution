var options = [];
var optionsGet = 'options';
var showFileSize = '';
var displayBlockMarkup =
	'<div id="ir-ext-ui" dir="ltr">' +
	'  <div class="ir-ext-dimensions">' +
	'    <span class="ir-ext-rendered" title="Rendered image dimensions (after any scaling/resizing has been applied).">' +
	'      <span data-ir-ext-width></span>x<span data-ir-ext-height></span>' +
	'    </span>' +
	'    <span class="ir-ext-natural" title="Natural image dimensions (without applying any scaling/resizing).">' +
	'      (<span data-ir-ext-width></span>x<span data-ir-ext-height></span>)' +
	'    </span>' +
	'  </div>' +
	'  <div class="ir-ext-filesize">' +
	'    <span data-ir-ext-value></span>' +
	'    <span data-ir-ext-unit></span>' +
	'  </div>' +
	'  <style>' +
	'    #ir-ext-ui {' +
	'      position: fixed;' +
	'      padding: 1px;' +
	'      z-index: 9999;' +
	'      display: none;' +
	'      font-family: Consolas, "Lucida Console", "Courier New", Courier, monospace;' +
	'      text-align: right;' +
	'    }' +
	'  </style>' +
	'</div>';
var displayBlock = $(displayBlockMarkup).appendTo(document.body);

chrome.extension.sendRequest(optionsGet, function(response) {
	displayBlock.css({
		color: response[0],
		fontSize: response[1] + 'px',
		lineHeight: response[1] + 'px',
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
			});
			break;
		case 'topRight':
			displayBlock.css({
				top: '1px',
				right: '1px'
			});
			break;
		case 'bottomLeft':
			displayBlock.css({
				bottom: '1px',
				left: '1px'
			});
			break;
		case 'bottomRight':
			displayBlock.css({
				bottom: '1px',
				right: '1px'
			});
			break;
	}
});

function getByteCount(imageSource, jqXHR) {
	var byteCount = jqXHR.getResponseHeader('Content-length');
	var dataUriMatch = /^data:image\/[\w.+-]+(;base64)?,/.exec(imageSource);
	if (dataUriMatch) {
		var dataUriContent = imageSource.substr(dataUriMatch[0].length);
		byteCount = dataUriContent.length;
	}
	return byteCount;
}

function getFileSize(byteCount) {
	var value;
	var unit;

	if (byteCount < 1024) {
		value = byteCount;
		unit = 'B';
	} else if (byteCount / 1024 < 1024) {
		value = (byteCount / 1024).toFixed(2);
		unit = 'KiB';
	} else {
		value = (byteCount / (1024 * 1024)).toFixed(2);
		unit = 'MiB';
	}

	return {
		value: value,
		unit: unit
	};
}

function updateDimensions(container, width, height) {
	container.find('[data-ir-ext-width]').text(width);
	container.find('[data-ir-ext-height]').text(height);
}

function updateFileSize(container, byteCount) {
	var fileSize = getFileSize(byteCount);
	container.find('[data-ir-ext-value]').text(fileSize.value);
	container.find('[data-ir-ext-unit]').text(fileSize.unit);
}

function updateBlock(image, byteCount) {
	var isScaled = image.width != image.naturalWidth || image.height != image.naturalHeight;
	var hasFileSize = byteCount != null;

	var rendered = displayBlock.find('.ir-ext-rendered');
	var natural = displayBlock.find('.ir-ext-natural');
	var fileSize = displayBlock.find('.ir-ext-filesize');

	updateDimensions(rendered, image.width, image.height);

	if (isScaled) {
		updateDimensions(natural, image.naturalWidth, image.naturalHeight);
		natural.show();
	} else {
		natural.hide();
		updateDimensions(natural, 0, 0);
	}

	if (hasFileSize) {
		updateFileSize(fileSize, byteCount);
		fileSize.show();
	} else {
		fileSize.hide();
		updateFileSize(fileSize, 0);
	}
}

$(document).on('mouseover', 'img', function() {
	var image = this;
	var imageSource = this.src;

	if (showFileSize == 'on') {
		$.ajax({
			type: 'HEAD',
			url: imageSource,
			success: function(data, textStatus, jqXHR) {
				updateBlock(image, getByteCount(imageSource, jqXHR));
			}
		});
	}

	updateBlock(image, null);

	$(displayBlock).fadeIn(70);
});

$(document).on('mouseout', 'img', function(e) {
	var isMetaKey = e.altKey || e.ctrlKey || e.metaKey || e.shiftKey;
	if (isMetaKey) {
		return;
	}
	$(displayBlock).fadeOut(10);
});
