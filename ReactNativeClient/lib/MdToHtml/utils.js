const utils = {};

utils.getAttr = function(attrs, name, defaultValue = null) {
	for (let i = 0; i < attrs.length; i++) {
		if (attrs[i][0] === name) return attrs[i].length > 1 ? attrs[i][1] : null;
	}
	return defaultValue;
}

utils.notDownloadedImage = function() {
	// https://github.com/ForkAwesome/Fork-Awesome/tree/master/src/file-image-o.svg
	// Height changed to 1795
	return `
		<svg width="1925" height="1792" xmlns="http://www.w3.org/2000/svg">
		    <path d="M640 576c0 106-86 192-192 192s-192-86-192-192 86-192 192-192 192 86 192 192zm1024 384v448H256v-192l320-320 160 160 512-512zm96-704H160c-17 0-32 15-32 32v1216c0 17 15 32 32 32h1600c17 0 32-15 32-32V288c0-17-15-32-32-32zm160 32v1216c0 88-72 160-160 160H160c-88 0-160-72-160-160V288c0-88 72-160 160-160h1600c88 0 160 72 160 160z"/>
		</svg>
	`;
}

utils.errorImage = function() {
	// https://github.com/ForkAwesome/Fork-Awesome/blob/master/src/icons/svg/times-circle.svg
	return `
		<svg width="1795" height="1795" xmlns="http://www.w3.org/2000/svg">
		    <path d="M1149 1122c0-17-7-33-19-45L949 896l181-181c12-12 19-28 19-45s-7-34-19-46l-90-90c-12-12-29-19-46-19s-33 7-45 19L768 715 587 534c-12-12-28-19-45-19s-34 7-46 19l-90 90c-12 12-19 29-19 46s7 33 19 45l181 181-181 181c-12 12-19 28-19 45s7 34 19 46l90 90c12 12 29 19 46 19s33-7 45-19l181-181 181 181c12 12 28 19 45 19s34-7 46-19l90-90c12-12 19-29 19-46zm387-226c0 424-344 768-768 768S0 1320 0 896s344-768 768-768 768 344 768 768z"/>
		</svg>
	`;
}

utils.loaderImage = function() {
	return '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="16px" height="16px" viewBox="0 0 128 128" xml:space="preserve"><g><circle cx="16" cy="64" r="16" fill="#000000" fill-opacity="1"/><circle cx="16" cy="64" r="16" fill="#555555" fill-opacity="0.67" transform="rotate(45,64,64)"/><circle cx="16" cy="64" r="16" fill="#949494" fill-opacity="0.42" transform="rotate(90,64,64)"/><circle cx="16" cy="64" r="16" fill="#cccccc" fill-opacity="0.2" transform="rotate(135,64,64)"/><circle cx="16" cy="64" r="16" fill="#e1e1e1" fill-opacity="0.12" transform="rotate(180,64,64)"/><circle cx="16" cy="64" r="16" fill="#e1e1e1" fill-opacity="0.12" transform="rotate(225,64,64)"/><circle cx="16" cy="64" r="16" fill="#e1e1e1" fill-opacity="0.12" transform="rotate(270,64,64)"/><circle cx="16" cy="64" r="16" fill="#e1e1e1" fill-opacity="0.12" transform="rotate(315,64,64)"/><animateTransform attributeName="transform" type="rotate" values="0 64 64;315 64 64;270 64 64;225 64 64;180 64 64;135 64 64;90 64 64;45 64 64" calcMode="discrete" dur="720ms" repeatCount="indefinite"></animateTransform></g></svg>';
}

utils.resourceStatusImage = function(state) {
	if (state === 'notDownloaded') return utils.notDownloadedImage();
	if (state === 'downloading') return utils.loaderImage();
	if (state === 'encrypted') return utils.loaderImage();
	if (state === 'error') return utils.errorImage();

	throw new Error('Unknown state: ' + state);
}

utils.resourceStatus = function(resourceInfo, localState) {
	let resourceStatus = 'ready';

	if (resourceInfo) {
		const resource = resourceInfo.item;
		const localState = resourceInfo.localState;

		if (localState.fetch_status === Resource.FETCH_STATUS_IDLE) {
			resourceStatus = 'notDownloaded';
		} else if (localState.fetch_status === Resource.FETCH_STATUS_STARTED) {
			resourceStatus = 'downloading';
		} else if (localState.fetch_status === Resource.FETCH_STATUS_DONE) {
			if (resource.encryption_blob_encrypted || resource.encryption_applied) {
				resourceStatus = 'encrypted';
			}
		}
	} else {
		resourceStatus = 'notDownloaded';
	}

	return resourceStatus;
}

module.exports = utils;