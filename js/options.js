$(document).ready(function() {
	var submitOptions = $('#submitOptions');
	var submitOptionsEnable = function() { //var for enabling 'Save' button
		submitOptions.removeAttr('disabled');
	}

	function restoreOptions() { //restore options from localStorage
		if (localStorage['firstStart'] == 'false') {
			$('#colorInput').val(localStorage['colorInput']);
			$('#fontSizeInput').val(localStorage['fontSizeInput']);
			$('#backgroundColorInput').val(localStorage['backgroundColorInput']);
			$('#borderColorInput').val(localStorage['borderColorInput']);
			$('#borderRadiusInput').val(localStorage['borderRadiusInput']);
			if (localStorage['showFileSize'] == 'on') {
				$('#showFileSize').attr('checked', true);
			}
			$('#' + localStorage['blockPosition']).attr('checked', true);
		} else {
			restoreDefault();
			saveOptions();
		}
	}

	function saveOptions() { //saving options to localStorage
		localStorage['colorInput'] = $('#colorInput').val();
		localStorage['fontSizeInput'] = $('#fontSizeInput').val();
		localStorage['backgroundColorInput'] = $('#backgroundColorInput').val();
		localStorage['borderColorInput'] = $('#borderColorInput').val();
		localStorage['borderRadiusInput'] = $('#borderRadiusInput').val();
		localStorage['showFileSize'] = $('#showFileSize:checked').val();
		localStorage['blockPosition'] = $('input[type="radio"]').filter(':checked').attr('id');

		submitOptions.attr('disabled', true);
	}

	function restoreDefault() {
		$('#colorInput').val('#000');
		$('#fontSizeInput').val('11');
		$('#backgroundColorInput').val('#f7f7f7');
		$('#borderColorInput').val('#999');
		$('#borderRadiusInput').val('2');
		$('#showFileSize').attr('checked', true);
		$('#topRight').attr('checked', true);
		submitOptionsEnable();
	}

	submitOptions.on('click', saveOptions);
	submitOptions.attr('disabled', true);

	$('#colorInput').on('keyup', submitOptionsEnable);
	$('#fontSizeInput').on('keyup', submitOptionsEnable);
	$('#backgroundColorInput').on('keyup', submitOptionsEnable);
	$('#borderColorInput').on('keyup', submitOptionsEnable);
	$('#borderRadiusInput').on('keyup', submitOptionsEnable);
	$('#showFileSize').on('click', submitOptionsEnable);
	$('#showFileSizeLabel').on('click', submitOptionsEnable);
	$('input[type="radio"]').on('click', submitOptionsEnable);

	$('#defaultOptions').on('click', restoreDefault);

	restoreOptions();
	localStorage['firstStart'] = 'false';
});