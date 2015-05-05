define(function () {
	'use strict';

	/**
	 * GlideHttpLogAdapter logs a message to an external service via ajax http request. The request has JSON format and is ready to handle cross-domain requests.
	 * @constructor
	 */
	function GlideHttpLogAdapter() {
		this.url = '';
		this.method = '';
		this.headers = [];

		this.setRequestMethod('POST');

		this.addRequestHeader('Content-Type', 'application/json');
		this.addRequestHeader('X-Requested-With', 'XMLHttpRequest');
	}

	/**
	 * getCORSRequest Checks if XMLHttpRequest or alternate class that is capable of handling CORS ajax requests is available and returns it.
	 * @private
	 * @returns {Object} Object with XHR interface or null if it is not available.
	 */
	function getCORSRequest() {
		var xhr = new XMLHttpRequest();

		if ("withCredentials" in xhr) {
			return xhr;
		}
		else if (typeof XDomainRequest != "undefined") {
			xhr = new XDomainRequest();
			return xhr;
		}

		return null;
	}

	/**
	 * prepareRequestParameters Gathers additional info and adds it to request data then wraps it into a JSON string
	 * @private
	 * @param _type {string} Log type (possible values are log, info, debug, warn, error)
	 * @param _msg {string} Log message
	 * @returns {string} JSON string with a payload for the http request
	 */
	function prepareRequestParameters(_type, _msg) {
		var userAgent = (typeof navigator === 'object' && navigator.userAgent) ? navigator.userAgent : 'unknown browser';
		var load = (new Date()).valueOf();
		var url = window.location.toString();

		return '{"type":"' + _type + '", "message":"' + _msg.replace('"', '\\"') + '", "useragent": "' + userAgent + '", "load":' + load + ', "url": "' + url + '"}';
	}

	/**
	 * logToHttp Performs AJAX request to HTTP endpoint with the log data
	 * @param _type {string} Log type (possible values are log, info, debug, warn, error)
	 * @param _msg {string} Log message
	 */
	function logToHttp(_type, _msg) {
		var request = getCORSRequest();
		var parameters = prepareRequestParameters(_type, _msg);

		request.open(this.method, this.url);

		for (var i = 0; i < this.headers.length; i++) {
			var header = this.headers[i];
			request.setRequestHeader(header.name, header.value);
		}

		request.send(parameters);
	}

	GlideHttpLogAdapter.prototype = {
		/**
		 * setRequestUrl Sets an url for the http request
		 * @param _url {string} Url of the http request
		 */
		setRequestUrl: function (_url) {
			this.url = _url;
		},

		/**
		 * setRequestMethod Sets a method for the http request
		 * @param _method {string} Method of the http request (usually one of: GET, POST, PUT, UPDATE)
		 */
		setRequestMethod: function (_method) {
			this.method = _method;
		},

		/**
		 * addRequestHeader Adds additional headers to the request
		 * @param _headerName {string} Header's name
		 * @param _headerValue {string} Header's value
		 */
		addRequestHeader: function (_headerName, _headerValue) {
			this.headers.push({
				name: _headerName,
				value: _headerValue
			});
		},

		/**
		 * log Sends log message with type log
		 * @param _msg {string} Log message
		 */
		log: function (_msg) {
			logToHttp.call(this, 'log', _msg);
		},

		/**
		 * debug Sends log message with type debug
		 * @param _msg {string} Log message
		 */
		debug: function (_msg) {
			logToHttp.call(this, 'debug', _msg);
		},

		/**
		 * info Sends log message with type info
		 * @param _msg {string} Log message
		 */
		info: function (_msg) {
			logToHttp.call(this, 'info', _msg);
		},

		/**
		 * warn Sends log message with type warn
		 * @param _msg {string} Log message
		 */
		warn: function (_msg) {
			logToHttp.call(this, 'warn', _msg);
		},

		/**
		 * error Sends log message with type error
		 * @param _msg {string} Log message
		 */
		error: function (_msg) {
			logToHttp.call(this, 'error', _msg);
		}
	};

	return new GlideHttpLogAdapter();
});