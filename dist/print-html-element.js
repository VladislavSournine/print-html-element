(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["printHtmlElement"] = factory();
	else
		root["printHtmlElement"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	/*
	* Print HTML Element
	*
	* Copyright (c) 2015 Philip Da Silva
	*
	* Forked from jQuery.printElement (https://github.com/erikzaadi/jQueryPlugins/tree/master/jQuery.printElement)
	*
	* Licensed under the MIT license:
	*   http://www.opensource.org/licenses/mit-license.php
	*/

	function PrintHtmlElement() {
	    function printElement(element, opts) {
	        var elementHtml = element.outerHTML;

	        _print(elementHtml, opts);
	    }

	    function printHtml(html, opts) {
	        _print(html, opts);
	    }

	    function _print(html, opts) {
	        opts = opts || {};
	        opts = {
	            printMode: opts.printMode || '',
	            pageTitle: opts.pageTitle || '',
	            templateString: opts.templateString || '',
	            popupProperties: opts.popupProperties || '',
	            stylesheets: opts.stylesheets || null,
	            styles: opts.styles || null
	        };

	        // Get markup to be printed
	        var markup = _getMarkup(html, opts),
	            printWindow,
	            printIframe,
	            printDocument,
	            printElementID;

	        if (opts.printMode.toLowerCase() === 'popup') {
	            printWindow = window.open('about:blank', 'printElementWindow', opts.popupProperties);
	            printDocument = printWindow.document;
	        } else {
	            //The random ID is to overcome a safari bug
	            // http://www.cjboco.com.sharedcopy.com/post.cfm/442dc92cd1c0ca10a5c35210b8166882.html
	            printElementID = 'printElement_' + Math.round(Math.random() * 99999).toString();

	            printIframe = document.createElement('iframe');
	            printIframe.setAttribute('id', printElementID);
	            printIframe.setAttribute('src', 'about:blank');
	            printIframe.setAttribute('frameBorder', '0');
	            printIframe.setAttribute('scrolling', 'no');
	            printIframe.setAttribute('style', 'position:fixed;bottom:100%;right:100%;');

	            document.body.appendChild(printIframe);

	            printDocument = printIframe.contentWindow || printIframe.contentDocument;
	            if (printDocument.document) {
	                printDocument = printDocument.document;
	            }

	            printIframe = document.frames ? document.frames[printElementID] : document.getElementById(printElementID);
	            printWindow = printIframe.contentWindow || printIframe;
	        }

	        focus();
	        printDocument.open();

	        // SetTimeout fixes Issue #9 (iframe printMode does not work in firefox)
	        setTimeout(function () {
	            printDocument.write(markup);
	            printDocument.close();
	        });

	        _callPrint(printWindow, printIframe);
	    }

	    function _callPrint(printWindow, iframe) {
	        if (printWindow && printWindow.printPage) {
	            printWindow.printPage();

	            if (iframe) {
	                // Remove iframe after printing
	                document.body.removeChild(iframe);
	            }
	        } else {
	            setTimeout(function () {
	                _callPrint(printWindow, iframe);
	            }, 500);
	        }
	    }

	    function _getBaseHref() {
	        var port = window.location.port ? ':' + window.location.port : '';
	        return window.location.protocol + '//' + window.location.hostname + port + window.location.pathname;
	    }

	    function _getMarkup(elementHtml, opts) {
	        var template = opts.templateString,
	            templateRegex = new RegExp(/{{\s*printBody\s*}}/gi),
	            stylesheets,
	            styles,
	            html = [];

	        if (template && templateRegex.test(template)) {
	            elementHtml = template.replace(templateRegex, elementHtml);
	        }

	        html.push('<html><head><title>' + (opts.pageTitle || '') + '</title>');

	        // If stylesheet URL's or list of stylesheet URL's are specified, override page stylesheets
	        if (opts.stylesheets) {
	            stylesheets = Array.isArray(opts.stylesheets) ? opts.stylesheets : [opts.stylesheets];
	        } else {
	            stylesheets = Array.prototype.slice.call(document.getElementsByTagName('link')).map(function (link) {
	                return link.href;
	            });
	        }

	        stylesheets.forEach(function (href) {
	            html.push('<link rel="stylesheet" href="' + href + '">');
	        });

	        // If inline styles or list of inline styles are specified, override inline styles
	        if (opts.styles) {
	            styles = Array.isArray(opts.styles) ? opts.styles : [opts.styles];
	        } else {
	            styles = Array.prototype.slice.call(document.getElementsByTagName('style')).map(function (style) {
	                return style.innerHTML;
	            });
	        }

	        styles.forEach(function (style) {
	            html.push('<style type="text/css">' + style + '</style>');
	        });

	        // Ensure that relative links work
	        html.push('<base href="' + _getBaseHref() + '" />');
	        html.push('</head><body class="pe-body">');
	        html.push(elementHtml);
	        html.push('<script type="text/javascript">function printPage(){focus();print();' + (opts.printMode.toLowerCase() == 'popup' ? 'close();' : '') + '}</script>');
	        html.push('</body></html>');

	        return html.join('');
	    }

	    return {
	        printElement: printElement,
	        printHtml: printHtml
	    };
	};

	module.exports = PrintHtmlElement();

/***/ }
/******/ ])
});
;
