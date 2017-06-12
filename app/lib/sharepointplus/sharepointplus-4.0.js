﻿/*!
 * SharepointPlus v4.0
 * Copyright 2017, Aymeric (@aymkdn)
 * Contact: http://kodono.info
 * Documentation: http://aymkdn.github.com/SharepointPlus/
 * License: LGPL-3 (http://aymkdn.github.com/SharepointPlus/license.md)
 */

/**
 @name SPIsArray
 @function
 @category utils
 @description Return true when the arg is an array
*/
var SPIsArray = function(v) { return (Object.prototype.toString.call(v) === '[object Array]') }

/**
  @name SPArrayIndexOf
  @function
  @category utils
  @description Array.indexOf polyfill for IE8
*/
var SPArrayIndexOf = function(arr, searchElement) {
  "use strict";
  if (!Array.prototype.indexOf) {
    var t = Object(arr);
    var len = t.length >>> 0;
    if (len === 0) {
      return -1;
    }
    var n = 0;
    if (arguments.length > 1) {
      n = Number(arguments[1]);
      if (n != n) { // shortcut for verifying if it's NaN
        n = 0;
      } else if (n != 0 && n != Infinity && n != -Infinity) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }
    if (n >= len) {
      return -1;
    }
    var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
    for (; k < len; k++) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  } else {
    return arr.indexOf(searchElement);
  }
}
/**
 @name SPArrayForEach
 @function
 @category utils
 @description Array.forEach polyfill for IE8 (source : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
*/
var SPArrayForEach = function(arr, callback, thisArg) {
  "use strict";
  if (!Array.prototype.forEach) {
    var T, k;
    if (arr == null) {
      throw new TypeError(' this is null or not defined');
    }
    var O = Object(arr);
    var len = O.length >>> 0;
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }
    if (arguments.length > 1) T = thisArg;
    k = 0;
    while (k < len) {
      var kValue;
      if (k in O) {
        kValue = O[k];
        callback.call(T, kValue, k, O);
      }
      k++;
    }
  } else {
    return arr.forEach(callback, thisArg);
  }
}

if(!String.prototype.trim) {
  /**
    @ignore
    @description The trim() feature for String is not always available for all browsers
  */
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g,'');
  };
}

/**
 * @name SPArrayChunk
 * @category utils
 * @function
 * @description Permits to cut an array into smaller blocks
 * @param {Array} b The array to split
 * @param {Number} e The size of each block
 * @return {Array} An array that contains several arrays with the required size
 */
var SPArrayChunk=function(b,e){var d=[];for(var c=0,a=b.length;c<a;c+=e){d.push(b.slice(c,c+e))}return d}

/**
 * @name SPExtend
 * @category utils
 * @function
 * @description It will clone an object (see )
 * @param {Boolean} [deep=false] If we want a deep clone
 * @param {Object} objectDestination The object that will be extended
 * @param {Object} objectSource The object the copy
 */
var SPExtend=function(){var r,t,o,n,e=arguments[0]||{},f=1,i=arguments.length,u=!1,y=function(r){if(null===r||"object"!=typeof r||r.nodeType||null!==r&&r===r.window)return!1;try{if(r.constructor&&!this.hasOwnProperty.call(r.constructor.prototype,"isPrototypeOf"))return!1}catch(t){return!1}return!0};for("boolean"==typeof e&&(u=e,e=arguments[f]||{},f++),"object"!=typeof e&&"function"!=typeof e&&(e={}),!1;i>f;f+=1)if(null!==(r=arguments[f]))for(t in r)e!==r[t]&&(u&&r[t]&&(y(r[t])||(o=Array.isArray(r[t])))?(o?(o=!1,n=e[t]&&Array.isArray(e[t])?e[t]:[]):n=e[t]&&y(e[t])?e[t]:{},e[t]=SPExtend(u,n,r[t])):void 0!==r[t]&&(e[t]=r[t]));return e}

// Global
var _SP_CACHE_FORMFIELDS=null;
var _SP_CACHE_CONTENTTYPES=[];
var _SP_CACHE_CONTENTTYPE=[];
var _SP_CACHE_SAVEDVIEW=[];
var _SP_CACHE_SAVEDVIEWS=[];
var _SP_CACHE_SAVEDLISTS=void 0;
var _SP_CACHE_USERGROUPS=[]
var _SP_CACHE_GROUPMEMBERS=[];
var _SP_CACHE_DISTRIBUTIONLISTS=[];
var _SP_CACHE_REGIONALSETTINGS=void 0;
var _SP_CACHE_DATEFORMAT=void 0;
var _SP_ADD_PROGRESSVAR={};
var _SP_UPDATE_PROGRESSVAR={};
var _SP_MODERATE_PROGRESSVAR={};
var _SP_REMOVE_PROGRESSVAR={};
var _SP_BASEURL=void 0;
var _SP_NOTIFY_READY=false;
var _SP_NOTIFY_QUEUE=[];
var _SP_NOTIFY=[];
var _SP_PLUGINS={};
var _SP_MODALDIALOG_LOADED=false;
var _SP_MAXWHERE_ONLOOKUP=30;
var _SP_ISBROWSER=(new Function("try {return this===window;}catch(e){ return false;}"))();

// for each select of lookup with more than 20 values, for IE only
// see https://bdequaasteniet.wordpress.com/2013/12/03/getting-rid-of-sharepoint-complex-dropdowns/
// Inspiration for the below code: SPServices
if (typeof jQuery === "function") {
  $('.ms-lookuptypeintextbox').each(function() {
    var $input=$(this);
    // find the default/selected ID
    var selectedID=$("#"+$input.attr("optHid")).val();
    // find the options in the "choices" property from the INPUT
    var choices = $input.attr("choices").split("|");

    // create a simple dropdown
    var htmlSelect = '<select id="' + $input.attr("id") + '_Lookup" name="'+$input.attr("name").replace(/\_/g,"$")+'" data-info="This SELECT has been created by SharepointPlus" title="' + $input.attr("title") + '">';
    for (var i = 0; i < choices.length; i += 2) {
      htmlSelect += '<option value="' + choices[i+1] + '"' + (choices[i+1] == selectedID ? ' selected="selected"' : '') + '>' + choices[i] + '</option>';
    }
    htmlSelect += "</select>";

    // add the new select and hide the other useless elements
    $input.closest("span").hide().before(htmlSelect);

    // when the select changes then we need to put the selected value...
    $("#" + $input.attr("id") + "_Lookup").on('change', function() {
      var $input = $('#'+$(this).attr("id").slice(0,-7));
      var $optHid = $("#"+$input.attr("optHid"));
      var val = $(this).val();
      // set the optHid value with the selected one
      $optHid.val(val);
      // and save the selected text to the original input (only if the value is not equal to "0" (None))
      $input.val($(this).find("option[value='" + (val !== "0" ? val : "") + "']").text());
    }).trigger("change");
  })
}

(function(window, document, undefined) {
  // define a faster way to apply a function to an array
  var fastMap = function(source,fn) {
    var iterations = source.length;
    var dest = new Array(iterations);
    var _n = iterations / 8;
    var _caseTest = iterations % 8;
    for (var i = iterations-1; i > -1; i--) {
      var n = _n;
      var caseTest = _caseTest;
      do {
        switch (caseTest) {
          case 0: dest[i]=fn(source[i]); i--; // eslint-disable-line
          case 7: dest[i]=fn(source[i]); i--; // eslint-disable-line
          case 6: dest[i]=fn(source[i]); i--; // eslint-disable-line
          case 5: dest[i]=fn(source[i]); i--; // eslint-disable-line
          case 4: dest[i]=fn(source[i]); i--; // eslint-disable-line
          case 3: dest[i]=fn(source[i]); i--; // eslint-disable-line
          case 2: dest[i]=fn(source[i]); i--; // eslint-disable-line
          case 1: dest[i]=fn(source[i]); i--; // eslint-disable-line
        }
        caseTest = 0;
      } while (--n > 0);
    }
    return dest;
  };

  /**
    @name $SP()
    @debug
    @class This is the object uses for all SharepointPlus related actions
   */
  function SharepointPlus() {
    if (!(this instanceof arguments.callee)) return new arguments.callee();
  }

  SharepointPlus.prototype = {
    data:[],
    length:0,
    listQueue:[],
    needQueue:false,
    module_sprequest:null,
    credentialOptions:null,
    proxyweb:null,
    hasPromise:(typeof Promise==="function"||typeof jQuery==="function"),
    /**
      @name $SP().getVersion
      @function
      @category core
      @description Returns the SP version

      @return {String} The current SharepointPlus version
    */
    getVersion:function() { return "4.0" },
    /**
      @name $SP().decode_b64
      @function
      @category utils
      @description Permits to decode a Base 64 string

      @param {String} toDecode It's the Base 64 string to decode
      @return {String} The decoded string
    */
   // eslint-disable-next-line
    decode_b64:function(d,b,c,u,r,q,x){b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";for(r=q=x='';c=d.charAt(x++);~c&&(u=q%4?u*64+c:c,q++%4)?r+=String.fromCharCode(255&u>>(-2*q&6)):0)c=b.indexOf(c);return r},
    /**
      @name $SP().encode_b64
      @function
      @category utils
      @description Permits to encode in Base 64

      @param {String} toEncode It's the string to encode into Base 64
      @return {String} The encoded string
    */
    encode_b64:function(a,b,c,d,e,f){b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";c="=";for(d=f='';e&=3,a.charAt(d++)||(b='=',e);f+=b.charAt(63&c>>++e*2))c=c<<8|a.charCodeAt(d-=!e);return f},
    /**
      @ignore
      @description Ajax system based on jQuery parameters
    */
    ajax:function(settings) {
      var _this=this, xhr, headers;
      if (typeof jQuery !== "undefined" && jQuery.ajax) {
        jQuery.ajax(settings);
      } else {
        headers = {'Content-Type': settings.contentType || "text/xml; charset=utf-8"};
        // check if it's NodeJS
        if (_SP_ISBROWSER) {
          if (typeof nanoajax !== "undefined") {
            if (typeof settings.beforeSend === "function") {
              xhr = {setRequestHeader:function(a, b) { headers[a]=b }};
              settings.beforeSend(xhr);
            }
            // eslint-disable-next-line
            nanoajax.ajax({
              url: settings.url,
              method: settings.method || "POST",
              headers: headers,
              body: settings.data
            },
            function (code, responseText, request) {
              if (code === 200 && responseText !== "Error" && responseText !== "Abort" && responseText !== "Timeout") {
                settings.success(request.responseXML || request.responseText);
              } else {
                if (typeof settings.error === "function") {
                  settings.error(request, code, responseText);
                }
              }
            })
          }
          else {
            throw "[SharepointPlus] Fatal Error : No AJAX library has been found... Please use jQuery or nanoajax";
          }
        } else {
          // we use the module 'sp-request'
          if (_this.module_sprequest === null) {
            if (_this.credentialOptions === null) {
              throw "[SharepointPlus] Error 'ajax': please use `$SP().auth()` to provide your credentials first";
            }
            _this.module_sprequest = require('sp-request').create(_this.credentialOptions);
          }
          if (headers['Content-Type'].indexOf('xml') > -1) headers['Accept'] = 'application/xml, text/xml, */*; q=0.01';
          if (!settings.method || settings.method.toLowerCase() === "POST") headers['Content-Length'] = Buffer.byteLength(settings.data);
          if (typeof settings.beforeSend === "function") {
            xhr = {setRequestHeader:function(a, b) { headers[a]=b }};
            settings.beforeSend(xhr);
          }
          // add User Agent
          headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:52.0) Gecko/20100101 Firefox/52.0';
          var opts = {
            json:false,
            method:settings.method || "POST",
            body: settings.data,
            strictSSL: false,
            headers: headers,
            jar:true
          };
          if (_this.proxyweb) opts.proxy=_this.proxyweb;
          _this.module_sprequest(settings.url, opts)
          .then(function(response) {
            if (response.statusCode === 200 && response.statusMessage !== "Error" && response.statusMessage !== "Abort" && response.statusMessage !== "Timeout") {
              // check if it's XML, then parse it
              if (response.headers['content-type'].indexOf('xml') > -1 && response.body.slice(0,5) === '<?xml') {
                var DOMParser = require('xmldom').DOMParser;
                var result = new DOMParser().parseFromString(response.body);
                settings.success(result);
              } else {
                settings.success(response.body);
              }
            } else {
              if (typeof settings.error === "function") {
                settings.error(response, response.statusCode, response.body);
              }
            }
          }, function(err) {
            if (typeof settings.error === "function") {
              settings.error(err, "000", err);
            }
          });
        }
      }
    },
    /**
      @name $SP().auth
      @function
      @category node
      @description Permits to use credentials when doing requests (for Node module only)

      @param {Object} credentialOptions Options from https://github.com/s-KaiNet/node-sp-auth

      @example
      var user1 = {username:'aymeric', password:'sharepointplus', domain:'kodono'};
      $SP().auth(user1)
           .list("My List","http://my.sharpoi.nt/other.directory/")
          .get({...});
      // or :
      var sp = $SP().auth(user1);
      sp.list("My List", "https://web.si.te").get({...});
      sp.list("Other List"; "http://my.sharpoi.nt/other.directory/").update(...);
    */
    auth:function(credentialOptions) {
      this.credentialOptions = credentialOptions;
      return this;
    },
    /**
      @name $SP().proxy
      @function
      @category node
      @description Permits to define a proxy server (for Node module only)

      @param {String} proxyURL Looks like "http://domain%5Cusername:password@proxy.something:80"

      @example
      var user1 = {username:'aymeric', password:'sharepointplus', domain:'kodono'};
      var proxy = "http://" + user1.domain + "%5C" + user1.username + ":" + user1.password + "@proxy:80";
      $SP().proxy(proxy).auth(user1)
           .list("My List","http://my.sharpoi.nt/other.directory/")
          .get({...});
      // or :
      var sp = $SP().proxy(proxy).auth(user1);
      sp.list("My List", "https://web.si.te").get({...});
      sp.list("Other List"; "http://my.sharpoi.nt/other.directory/").update(...);
    */
    proxy:function(proxy) {
      this.proxyweb = proxy;
      return this;
    },
    /**
      @name $SP().list
      @namespace
      @description Permits to define the list ID

      @param {String} listID Ths list ID or the list name
      @param {String} [url] If the list name is provided, then you need to make sure URL is provided too (then no need to define the URL again for the chained functions like 'get' or 'update')
      @example
      $SP().list("My List");
      $SP().list("My List","http://my.sharpoi.nt/other.directory/");
    */
    list:function(list,url) {
      this.reset();
      if (url) {
        // make sure we don't have a '/' at the end
        if (url.substring(url.length-1,url.length)==='/') url=url.substring(0,url.length-1)
        this.url=url;
      }
      else this._getURL();
      this.listID = list.replace(/&/g,"&amp;");
      return this;
    },
    /**
      @ignore
      @name $SP()._getURL
      @function

      @description (internal use only) Store the current URL website into this.url
      @param {Boolean} [async=true] When calling $SP().getURL() will don't want an async request (deprecated on recent browsers)
      @return {Promise}
     */
    _getURL:function(async) {
      var _this=this;
      return _this._promise(function(prom_resolve) {
        async = (async === false ? false : true);
        if (!prom_resolve) prom_resolve=function() { _this.needQueue=false }; // if we don't use Promise
        if (typeof _this.url === "undefined") {
          // search for the local base URL
          if (typeof _SP_BASEURL !== "undefined") _this.url=_SP_BASEURL;
          else {
            // try to build it
            if (typeof L_Menu_BaseUrl!=="undefined") _this.url=_SP_BASEURL=L_Menu_BaseUrl; // eslint-disable-line
            else {
              if (typeof _spPageContextInfo !== "undefined" && typeof _spPageContextInfo.webServerRelativeUrl !== "undefined") _this.url=_SP_BASEURL=_spPageContextInfo.webServerRelativeUrl; // eslint-disable-line
              else {
                // we'll use the Webs.asmx service to find the base URL
                _this.needQueue=true;
                var body=_this._buildBodyForSOAP("WebUrlFromPageUrl", "<pageUrl>"+window.location.href.replace(/&/g,"&amp;")+"</pageUrl>");
                var url = "/_vti_bin/Webs.asmx";
                _this.ajax({
                  type: "POST",
                  cache: false,
                  async: async,
                  url: url,
                  data: body,
                  contentType: "text/xml; charset=utf-8",
                  dataType: "xml",
                  success:function(data) {
                    // we want to use myElem to change the getAttribute function
                    var result=data.getElementsByTagName('WebUrlFromPageUrlResult');
                    if (result.length) {
                      _this.url = _SP_BASEURL = result[0].firstChild.nodeValue.toLowerCase();
                    }
                    //_this.needQueue=false;
                    prom_resolve();
                  }
                });
                return;
              }
            }
          }
        }
        prom_resolve();
      })
    },
    /**
      @name $SP().getURL
      @function
      @category utils
      @description Return the current base URL website

      @return {String} The current base URL website
     */
    getURL:function() {
      if (typeof _SP_BASEURL !== "undefined") return _SP_BASEURL;
      this._getURL(false);
      return this.url;
    },
    /**
      @ignore
      @name $SP()._buildBodyForSOAP
      @function
      @param {String} methodName
      @param {String} bodyContent
      @param {String} [xmlns="http://schemas.microsoft.com/sharepoint/soap/"]
      @description (internal use only) Permits to create the body for a SOAP request
    */
    _buildBodyForSOAP:function(methodName, bodyContent, xmlns) {
      xmlns = xmlns || "http://schemas.microsoft.com/sharepoint/soap/";
      return '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><'+methodName+' xmlns="'+xmlns+'">' + bodyContent + '</'+methodName+'></soap:Body></soap:Envelope>';
    },
    /**
     * @name $SP().webService
     * @function
     * @category core
     * @description Permits to directly deal with a WebService (similar to SPServices http://sympmarc.github.io/SPServices/core/web-services.html)
     * @param  {Object} options
     *   @param {String} operation The method name to use (e.g. UpdateList, GetList, ....)
     *   @param {String} service The name of the service (Lists, Versions, PublishedLinksService, ...) it's the ".asmx" name without the extension
     *   @param {Object} [properties={}] The properties to call
     *   @param {String} [webURL=current website] The URL of the website
     *   @param {Function} [after=function(response){}] A callback function
     * @return {Promise} The 'response' from the server is passed, and only on `resolve`
     *
     * @example
     * $SP().webService({ // http://sympmarc.github.io/SPServices/core/web-services/Lists/UpdateList.html
     *   service:"Lists",
     *   operation:"Updatelist",
     *   webURL:"http://what.ever/"
     *   properties:{
     *     listName:"Test",
     *     listProperties:"...",
     *     newFields:"...",
     *     updateFields:"...",
     *     deleteFields:"...",
     *     listVersion:"..."
     *   }
     * }).then(function(response) {
     *   // do something with the response
     * })
     */
    webService:function(options) {
      var _this=this;
      return _this._promise(function(prom_resolve, prom_reject) {
        var bodyContent="", prop;
        if (!options.service) throw "Error 'webService': you have to provide the 'service'";
        if (!options.operation) throw "Error 'webService': you have to provide the 'operation'";
        options.webURL = options.webURL || _this.url;
        // if we didn't define the url in the parameters, then we need to find it
        if (!options.webURL) {
          if (_this.hasPromise) {
            _this._getURL().then(function() {
              _this.webService(options).then(function(res) {
                prom_resolve(res);
              })
            });
          } else {
            _this._getURL();
            _this._addInQueue(arguments);
          }
          return;
        }
        var useCallback=false;
        if (typeof options.after == "function") useCallback=true;
        else options.after=function(){};
        options.properties = options.properties || {};
        for (prop in options.properties) {
          if (options.properties.hasOwnProperty(prop)) {
            bodyContent += '<'+prop+'>'+options.properties[prop]+'</'+prop+'>'
          }
        }
        bodyContent = _this._buildBodyForSOAP(options.operation, bodyContent);
        _this.ajax({
          type: "POST",
          url: options.webURL+"/_vti_bin/"+options.service+".asmx",
          data: bodyContent,
          beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/'+options.operation); },
          contentType: "text/xml; charset=utf-8",
          dataType: "xml",
          success:function(data) {
            if (useCallback) options.after(data);
            else prom_resolve(data)
          }
        });
      })
    },
    /**
      @ignore
      @name $SP()._addInQueue
      @function
      @description (internal use only) Add a function in the queue
    */
    _addInQueue:function(args) {
      this.listQueue.push(args);
      if (this.listQueue.length===1) this._testQueue();
      return this
    },
    /**
      @ignore
      @name $SP()._testQueue
      @function
      @description (internal use only) Permits to treat the queue
    */
    _testQueue:function() {
      var _this=this;
      if (_this.needQueue) {
        setTimeout(function() { _this._testQueue.call(_this) }, 25);
      } else {
        if (_this.listQueue.length > 0) {
          var todo = _this.listQueue.shift();
          todo.callee.apply(_this, Array.prototype.slice.call(todo));
        }
        _this.needQueue=(_this.listQueue.length>0);
        if (_this.needQueue) {
          setTimeout(function() { _this._testQueue.call(_this) }, 25);
        }
      }
    },
    /**
      @name $SP().parse
      @function
      @category lists
      @description Use a WHERE sentence to transform it into a CAML Syntax sentence

      @param {String} where The WHERE sentence to change
      @param {String} [escapeChar=true] Determines if we want to escape the special chars that will cause an error (for example '&' will be automatically converted to '&amp;')
      @example
      $SP().parse('ContentType = "My Content Type" OR Description &lt;> null AND Fiscal_x0020_Week >= 43 AND Result_x0020_Date < "2012-02-03"');
      // -> return &lt;And>&lt;And>&lt;Or>&lt;Eq>&lt;FieldRef Name="ContentType" />&lt;Value Type="Text">My Content Type&lt;/Value>&lt;/Eq>&lt;IsNotNull>&lt;FieldRef Name="Description" />&lt;/IsNotNull>&lt;/Or>&lt;Geq>&lt;FieldRef Name="Fiscal_x0020_Week" />&lt;Value Type="Number">43&lt;/Value>&lt;/Geq>&lt;/And>&lt;Lt>&lt;FieldRef Name="Result_x0020_Date" />&lt;Value Type="DateTime">2012-02-03&lt;/Value>&lt;/Lt>&lt;/And>

      // available operators :
      // "&lt;" : less than
      // "&lt;=" : less than or equal to
      // ">" : greater than
      // ">=" : greater than or equal to
      // "<>" : different
      // "~=" : this must be only used when comparing to a number that represents the User ID (e.g. 'User ~= 328') - that permits to query a list with too many items but with the User column that is indexed
      // " AND "
      // " OR "
      // " LIKE " : for example 'Title LIKE "foo"' will return "foobar" "foo" "barfoobar" "barfoo" and so on
      // " IN " : for example 'Location IN ["Los Angeles","San Francisco","New York"]', equivalent to 'Location = "Los Angeles" OR Location = "San Francisco" OR Location = "New York"' — SP2013 limits each IN to 60 items. If you want to check Lookup IDs instead of text you can use '~' followed by the ID, for example 'Location IN ["~23", "~26", "~30"]'

      // special words:
      // '[Me]' : for the current user
      // '[Today]' : to use the today date
      // '[Today+X]' : to use today + X days
      // Null : for the Null value
      // TRUE : for the Yes/No columns
      // FALSE : for the Yes/No columns

      // in the below example, on the "&" will be escaped
      var bar="Bob & Marley";
      var foo="O'Conney";
      $SP().parse('Bar = "'+bar+'" AND Foo = "'+foo+'"'); // -> &lt;And>&lt;Eq>&lt;FieldRef Name="Bar" />&lt;Value Type="Text">Bob &amp; Marley&lt;/Value>&lt;/Eq>&lt;Eq>&lt;FieldRef Name="Foo" />&lt;Value Type="Text">O'Conney&lt;/Value>&lt;/Eq>&lt;/And>
      $SP().parse("Bar = '"+bar+"' AND Foo = '"+foo+"'"); // don't put the simple and double quotes this way because it'll cause an issue with O'Conney
    */
    parse:function(q, escapeChar) {
      var queryString = q.replace(/(\s+)?(=|~=|<=|>=|<>|<|>| LIKE | IN )(\s+)?/g,"$2").replace(/""|''/g,"Null").replace(/==/g,"="); // remove unnecessary white space & replace '
      var factory = [];
      escapeChar = (escapeChar===false ? false : true)
      var limitMax = q.length;
      var closeOperator="", closeTag = "", ignoreNextChar=false;
      var lastField = "";
      var parenthesis = {open:0};
      var lookupId = false;
      for (var i=0; i < queryString.length; i++) {
        var letter = queryString.charAt(i);
        switch (letter) {
          case "(": // find the deepest (
            var start = i;
            var openedApos=false;
            while (queryString.charAt(i) == "(" && i < limitMax) { i++; parenthesis.open++; }
            // find the corresponding )
            while (parenthesis.open>0 && i < limitMax) {
              i++;
              // if there is a ' opened then ignore the ) until the next '
              var charAtI = queryString.charAt(i);
              if (charAtI=="\\") ignoreNextChar=true; // when we have a backslash \then ignore the next char
              else if (!ignoreNextChar && (charAtI=="'" || charAtI=='"')) openedApos=!openedApos;
              else if (!ignoreNextChar && charAtI==")" && !openedApos) parenthesis.open--;
              else ignoreNextChar=false;
            }

            var lastIndex = factory.length-1;

            // concat with the first index
            if (lastIndex>=0) {
              if (closeOperator != "") factory[0] = "<"+closeOperator+">"+factory[0];
              factory[0] += this.parse(queryString.substring(start+1, i));
              if (closeOperator != "") factory[0] += "</"+closeOperator+">";
              closeOperator = "";
            } else factory[0] = this.parse(queryString.substring(start+1, i));
            break;
          case "[": // for operator IN
            var start = i; // eslint-disable-line
            var openedApos=false; // eslint-disable-line
            // find the corresponding ]
            while (i < limitMax) {
              i++;
              // if there is a ' opened then ignore the ) until the next '
              var charAtI = queryString.charAt(i); // eslint-disable-line
              if (charAtI=="\\") ignoreNextChar=true; // when we have a backslash \then ignore the next char
              else if (!ignoreNextChar && (charAtI=="'" || charAtI=='"')) openedApos=!openedApos;
              else if (!ignoreNextChar && !openedApos && charAtI=="]") break;
              else ignoreNextChar=false;
            }

            var lastIndex = factory.length-1; // eslint-disable-line
            var arrIn = JSON.parse('[' + queryString.substring(start+1, i) + ']');
            // we want to detect the type for the values
            var typeIn = "Text";
            switch(typeof arrIn[0]) {
              case "number": typeIn = "Number"; break;
              default: {
                // check if it starts with ~ and then it's a number -- lookupid
                if (arrIn[0].charAt(0) === "~" && typeof (arrIn[0].slice(1)*1) === "number") {
                  typeIn = "Integer";
                  // change all array values
                  SPArrayForEach(arrIn, function(e,i) { arrIn[i]=e.slice(1) })
                }
              }
            }
            factory[lastIndex] += '<FieldRef Name="'+lastField+'" '+(typeIn==="Integer"?'LookupId="True"':'')+' /><Values><Value Type="'+typeIn+'">' + arrIn.join('</Value><Value Type="'+typeIn+'">') + '</Value></Values>' + closeTag;
            lastField = "";
            closeTag = "";
            // concat with the first index
            if (lastIndex>0) {
              if (closeOperator != "") factory[0] = "<"+closeOperator+">"+factory[0];
              factory[0] += factory[lastIndex];
              if (closeOperator != "") factory[0] += "</"+closeOperator+">";
              delete(factory[lastIndex]);
              closeOperator = "";
            }
            break;
          case ">":  // look at the operand
          case "<":
            i++;
            if (queryString.charAt(i) == "=") { // >= or <=
              factory.push("<"+(letter==">"?"G":"L")+"eq>");
              closeTag = "</"+(letter==">"?"G":"L")+"eq>";
            } else if (letter == "<" && queryString.charAt(i) == ">") { // <>
              factory.push("<Neq>");
              closeTag = "</Neq>";
            } else {
              i--;
              factory.push("<"+(letter==">"?"G":"L")+"t>");
              closeTag = "</"+(letter==">"?"G":"L")+"t>";
            }
            break;
          case "~": // special operator '~=' for People
            if (queryString.charAt(i+1) == "=") lookupId=true
            break;
          case "=":
            factory.push("<Eq>");
            closeTag = "</Eq>";
            break;
          case " ": // check if it's AND or OR
            if (queryString.substring(i,i+5).toUpperCase() == " AND ") {
              // add the open tag in the array
              closeOperator = "And";
              i+=4;
            }
            else if (queryString.substring(i,i+4).toUpperCase() == " OR ") {
              // add the open tag in the array
              closeOperator = "Or";
              i+=3;
            }
            else if (queryString.slice(i,i+6).toUpperCase() == " LIKE ") {
              i+=5;
              factory.push("<Contains>");
              closeTag = "</Contains>";
            }
            else if (queryString.slice(i,i+4).toUpperCase() == " IN ") {
              i+=3;
              factory.push("<In>");
              closeTag = "</In>";
            }
            else lastField += letter;
            break;
          case '"': // look now for the next "
          case "'":
            var apos = letter;
            var word = "", other="";
            while ((letter = queryString.charAt(++i)) != apos && i < limitMax) {
              if (letter == "\\") letter = queryString.charAt(++i);
              word+=letter;
            }
            lastIndex = factory.length-1;
            factory[lastIndex] += '<FieldRef Name="'+lastField+'" '+(word=="[Me]"?'LookupId="True" ':'')+'/>';
            lastField = "";
            var type = "Text"; //(isNaN(word) ? "Text" : "Number"); // check the type
            // check automatically if it's a DateTime
            if (/\d{4}-\d\d?-\d\d?((T| )\d{2}:\d{2}:\d{2})?/.test(word)) {
              type="DateTime";
              // check if we want to evaluate the TIME also
              if (/\d{4}-\d\d?-\d\d?((T| )\d{2}:\d{2}:\d{2})/.test(word)) other=' IncludeTimeValue="TRUE"';
            }
            if (escapeChar) word = this._cleanString(word);
            // special words ([Today] and [Me])
            if (word === "[Me]") {
              word = '<UserID Type="Integer" />';
              type = "Integer";
            } else if (word.slice(0,6) == "[Today") {
              type="DateTime";
              // find the offset if defined
              word = '<Today OffsetDays="'+(1*word.slice(6,-1))+'" />';
            }

            factory[lastIndex] += '<Value Type="'+type+'"'+other+'>'+word+'</Value>';
            factory[lastIndex] += closeTag;
            closeTag = "";
            // concat with the first index
            if (lastIndex>0) {
              if (closeOperator != "") factory[0] = "<"+closeOperator+">"+factory[0];
              factory[0] += factory[lastIndex];
              if (closeOperator != "") factory[0] += "</"+closeOperator+">";
              delete(factory[lastIndex]);
              closeOperator = "";
            }
            break;
          case "0": case "1": case "2": case "3": case "4": case "5": case "6": case "7": case "8": case "9":
            if (closeTag != "") { // it's the value
              var value = letter;
              while (!isNaN(letter = queryString.charAt(++i)) && i < limitMax) value+=""+letter;
              lastIndex = factory.length-1;
              factory[lastIndex] += '<FieldRef Name="'+lastField+'"'+(lookupId?' LookupId="True"':'')+' />';
              lastField = "";
              factory[lastIndex] += '<Value Type="'+(lookupId?"Integer":"Number")+'">'+value.replace(/ $/,"")+'</Value>';
              factory[lastIndex] += closeTag;
              closeTag = "";
              // concat with the first index
              if (lastIndex>0) {
                if (closeOperator != "") factory[0] = "<"+closeOperator+">"+factory[0];
                factory[0] += factory[lastIndex];
                if (closeOperator != "") factory[0] += "</"+closeOperator+">";
                delete(factory[lastIndex]);
                closeOperator = "";
              }
              i-=2;
              break;
            }
          default: // eslint-disable-line
            if (closeTag == "") lastField += letter;
            else if (letter.toLowerCase() == "n" && queryString.substring(i,i+4).toLowerCase() == "null") { // if we have NULL as the value
              lastIndex = factory.length-1;
              if (closeTag == "</Neq>") { // <>
                factory[lastIndex] = "<IsNotNull>";
                closeTag = "</IsNotNull>";
              } else if (closeTag == "</Eq>") { // =
                factory[lastIndex] = "<IsNull>";
                closeTag = "</IsNull>";
              }
              i+=3;
              factory[lastIndex] += '<FieldRef Name="'+lastField+'" />';
              lastField = "";
              factory[lastIndex] += closeTag;
              closeTag = "";
              // concat with the first index
              if (lastIndex>0) {
                if (closeOperator != "") factory[0] = "<"+closeOperator+">"+factory[0];
                factory[0] += factory[lastIndex];
                if (closeOperator != "") factory[0] += "</"+closeOperator+">";
                delete(factory[lastIndex]);
                closeOperator = "";
              }
            }
            else if ((letter.toLowerCase() === "t" && queryString.substring(i,i+4).toLowerCase() === "true") || (letter.toLowerCase() === "f" && queryString.substring(i,i+5).toLowerCase() === "false")) { // when we have TRUE/FALSE as the value
              lastIndex = factory.length-1;
              i+=3;
              if (letter.toLowerCase() === "f") i++;
              factory[lastIndex] += '<FieldRef Name="'+lastField+'" /><Value Type="Boolean">'+(letter.toLowerCase() === "t"?1:0)+'</Value>';
              lastField = "";
              factory[lastIndex] += closeTag;
              closeTag = "";
              // concat with the first index
              if (lastIndex>0) {
                if (closeOperator != "") factory[0] = "<"+closeOperator+">"+factory[0];
                factory[0] += factory[lastIndex];
                if (closeOperator != "") factory[0] += "</"+closeOperator+">";
                delete(factory[lastIndex]);
                closeOperator = "";
              }
            }
        }
      }
      return factory.join("");
    },
    /**
      @ignore
      @name $SP()._parseOn
      @function
      @description (internal use only) Look at the ON clause to convert it

      @param {String} on The ON clause
      @return {Array}array of clauses
      @example
      $SP()._parseOn("'List1'.field1 = 'List2'.field2 AND 'List1'.Other_x0020_Field = 'List2'.Some_x0020_Field")
    */
    _parseOn:function(q) {
      var factory = [];
      var queryString = q.replace(/(\s+)?(=)(\s+)?/g,"$2").replace(/==/g,"=").split(" AND ");
      for (var i=0; i<queryString.length; i++) {
        var mtch = queryString[i].match(/'([^']+)'\.([a-zA-Z0-9_]+)='([^']+)'\.([a-zA-Z0-9_]+)/);
        if (mtch && mtch.length==5) {
          var tmp={};
          tmp[mtch[1]] = mtch[2];
          tmp[mtch[3]] = mtch[4];
          factory.push(tmp);
        }
      }
      return factory;
    },
    /**
      @ignore
      @name $SP()._cleanString
      @function
      @description clean a string to remove the bad characters when using AJAX over Sharepoint web services (like <, > and &)

      @param {String} string The string to clean
      @note That should be used as an internal function
    */
    _cleanString:function(str) {
      return str.replace(/&(?!amp;|lt;|gt;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    },
    /**
      @name $SP().cleanResult
      @function
      @category lists
      @description clean a string returned by a GET (remove ";#" and "string;#" and null becomes "")

      @param {String} str The string to clean
      @param {String} [separator=";"] When it's a list we may want to have a different output (see examples)
      @return {String} the cleaned string

      @example
      $SP().cleanResult("15;#Paul"); // -> "Paul"
      $SP().cleanResult("string;#Paul"); // -> "Paul"
      $SP().cleanResult("string;#"); // -> ""
      $SP().cleanResult(";#Paul;#Jacques;#Aymeric;#"); // -> "Paul;Jacques;Aymeric"
      $SP().cleanResult(";#Paul;#Jacques;#Aymeric;#", ", "); // -> "Paul, Jacques, Aymeric"
    */
    cleanResult:function(str,separator) {
      if (str===null || typeof str==="undefined") return "";
      separator = separator || ";";
      return (typeof str==="string"?str.replace(/^(string;|float;)#?/,"").replace(/;#[0-9]+;#/g,separator).replace(/^[0-9]+;#/,"").replace(/^;#|;#$/g,"").replace(/;#/g,separator):str);
    },
    /**
     * @ignore
     * @name $SP()._promise
     * @function
     * @description (internal use only) to deal with Promise
     * @param  {Function} fct
     * @return {Promise|Object} If Promise is available, return a Promise, otherwise return the current SharepointPlus object
     */
    _promise:function(fct) {
      if (typeof Promise!=="function") {
        // check if jQuery exists, then use the Deferred system
        if (typeof jQuery === "function") {
          var deferred=jQuery.Deferred();
          fct(function() { deferred.resolve.apply(this, arguments) }, function() { deferred.reject.apply(this, arguments) });
          return deferred;
        }
        fct.call(this);
        return this;
      }
      return new Promise(fct);
    },
    /**
     * @ignore
     * @description Permits to handle the then()
     */
    then:function() {
      throw "[SharepointPlus] You tried to use `then()` however your browser doesn't support Promise, and you don't use jQuery. Please refer to the documentation.";
    },
    /**
      @name $SP().list.get
      @function
      @description Get the content of the list based on different criteria (by default the default view is used)

      @param {Object} [options] Options (see below)
        @param {String}  [options.fields=""] The fields you want to grab (be sure to add "Attachments" as a field if you want to know the direct link to an attachment)
        @param {String}  [options.view=""] If you specify a viewID or a viewName that exists for that list, then the fields/where/order settings for this view will be used in addition to the FIELDS/WHERE/ORDERBY you have defined (the user settings will be used first)
        @param {String|Array}  [options.where=""] The query string (like SQL syntax) (you'll need to use double \\ before the inside ' -- see example below); you can use an array that will make the sequential requests but it will return all the data into one array (useful for the Sharepoint 2010 throttling limit)
        @param {Boolean} [options.whereCAML=false] If you want to pass a WHERE clause that is with CAML Syntax only instead of SQL-like syntax -- see $SP().parse() for more info
        @param {Boolean} [options.whereEscapeChar=true] Determines if we want to escape the special chars that will cause an error (for example '&' will be automatically converted to '&amp;') -- this is applied to the WHERE clause only
        @param {Function} [options.whereFct=function(w){return w}] Permits to apply your own function on the WHERE clause after conversion to CAML (can be useful also when you use the "view" parameter)
        @param {Function} [options.progress] When using an array for the WHERE or the PAGING option then you can call the progress function (see the example)
        @param {String}  [options.orderby=""] The field used to sort the list result (you can also add "ASC" -default- or "DESC")
        @param {String}  [options.groupby=""] The field used to group by the list result
        @param {Integer} [options.rowlimit=0] You can define the number of rows you want to receive back (0 is infinite)
        @param {Boolean} [options.paging=false] If you have defined the 'rowlimit' then you can use 'paging' to cut by packets your full request -- this is useful when there is a list view threshold (attention: we cannot use "WHERE" or "ORDERBY" with this option)
        @param {Integer} [options.page=infinite] When you use the `paging` option, several requests will be done until we get all the data, but using the `page` option you can define the number of requests/pages you want to get
        @param {String}  [options.listItemCollectionPositionNext=""] When doing paging, this is the index used by Sharepoint to get the next page
        @param {Boolean} [options.useIndexForOrderBy=false] Based on https://spservices.codeplex.com/discussions/280642#post1323410 it permits to override the 5,000 items  limit in an unique call -- see the example below to know how to use it
        @param {Boolean} [options.expandUserField=false] When you get a user field, you can have more information (like name,email,sip,...) by switching this to TRUE
        @param {Boolean} [options.dateInUTC=false] TRUE to return dates in Coordinated Universal Time (UTC) format. FALSE to return dates in ISO format.
        @param {Object} [options.folderOptions] Permits to read the content of a Document Library (see below)
          @param {String} [options.folderOptions.path=""] Relative path of the folders we want to explore (by default it's the root of the document library)
          @param {String} [options.folderOptions.show="FilesAndFolders_InFolder"] Four values: "FilesOnly_Recursive" that lists all the files recursively from the provided path (and its children); "FilesAndFolders_Recursive" that lists all the files and folders recursively from the provided path (and its children); "FilesOnly_InFolder" that lists all the files from the provided path; "FilesAndFolders_InFolder" that lists all the files and folders from the provided path
        @param {Boolean} [options.queryOptions=undefined] If you want to provide your own QueryOptions and overwrite the ones built for you -- it should be some XML code (see http://msdn.microsoft.com/en-us/library/lists.lists.getlistitems.aspx)
        @param {Object} [options.join] Permits to create a JOIN closure between the current list and another one: it will be the same syntax than a regular GET (see the example below) (it doesn't use yet the JOIN options provided with Sharepoint 2010)
          @param {String} [options.join.list] Permits to establish the link between two lists (see the example below)
          @param {String} [options.join.url='current website'] The website url (if different than the current website)
          @param {String} [options.join.on] Permits to establish the link between two lists (only between the direct parent list and its child, not with the grand parent) (see the example below)
          @param {String} [options.join.onLookup] Permits to establish the link between two lists based on a lookup field... it's more optimized than the simple `join.on` (see the example below)
          @param {Boolean} [options.join.outer=false] If you want to do an outer join (you can also directly use "outerjoin" instead of "join")
        @param {Boolean} [options.calendar=false] If you want to get the events from a Calendar List
        @param {Object} [options.calendarOptions] Options that will be used when "calendar:true" (see the example to know how to use it)
          @param {Boolean} [options.calendarOptions.splitRecurrence=true] By default we split the events with a recurrence (so 1 item = 1 day of the recurrence)
          @param {String|Date} [options.calendarOptions.referenceDate=today] This is the date used to retrieve the events -- that can be a JS Date object or a SP Date (String)
          @param {String} [options.calendarOptions.range="Month"] By default we have all the events in the reference month (based on the referenceDate), but we can restrict it to a week with "Week" (from Monday to Sunday) (see https://www.nothingbutsharepoint.com/sites/eusp/Pages/Use-SPServices-to-Get-Recurring-Events-as-Distinct-Items.aspx)
      @param {Function} [result=function(data,error)] A function with the data from the request as first argument, and the second argument is the error message in case something went wrong
      @return {Promise|Deferred|Object} If Promise is supported, it will return a Promise object; or if not and we have jQuery it will return a Deferred; otherwise the current SharepointPlus object

      @example
      $SP().list("List Name").get(function(data) {
        for (var i=0; i&lt;data.length; i++) console.log(data[i].getAttribute("Title"));
      });

      // with some fields and an orderby command
      $SP().list("ListName","http://www.mysharepoint.com/mydir/").get({
        fields:"Title,Organization",
        orderby:"Title DESC,Test_x0020_Date ASC"
      }, function getData(data) {
        for (var i=0; i&lt;data.length; i++) console.log(data[i].getAttribute("Title"));
      });

      // handle the errors
      $SP().list("List Name").get(function(data,error) {
        if (error) { alert(error) }
        for (var i=0; i&lt;data.length; i++) console.log(data[i].getAttribute("Title"));
      });

      // the WHERE clause must be SQL-like
      // the field names must be the internal names used by Sharepoint
      // ATTENTION - note that here we open the WHERE string with simple quotes (') and that should be your default behavior each time you use WHERE
      var name = "O'Sullivan, James";
      $SP().list("My List").get({
        fields:"Title",
        where:'Fiscal_x0020_Week > 30 AND Fiscal_x0020_Week &lt; 50 AND Name = "'+name+'"'
      }),function getData(row) {
        for (var i=row.length;i--;) console.log(row[i].getAttribute("Title"));
      });

      // Same example but this time we write the name directly inside the query...
      // So make sure to use a single backslash (\) if you have a simple quote ' inside your WHERE with a double quotes (") to open/close the string
      $SP().list("My List").get({
        fields:"Title",
        where:'Fiscal_x0020_Week > 30 AND Fiscal_x0020_Week &lt; 50 AND Name = "O\'Sullivan, James"'
      }),function getData(row) {
        for (var i=row.length;i--;) console.log(row[i].getAttribute("Title"));
      });
      // Or to use a double backslash (\\) if you have a simple quote ' inside your WHERE with a simple quote (') to open/close the string
      $SP().list("My List").get({
        fields:"Title",
        where:"Fiscal_x0020_Week > 30 AND Fiscal_x0020_Week &lt; 50 AND Name = 'O\\'Sullivan, James'"
      }),function getData(row) {
        for (var i=row.length;i--;) console.log(row[i].getAttribute("Title"));
      });

      // also in the WHERE clause you can use '[Me]' to filter by the current user,
      $SP().list("My List").get({
        fields:"Title",
        where:"Author = '[Me]'"
      },function getData(row) {
        console.log(row[0].getAttribute("Title"));
      });

      // also in the WHERE clause you can use '[Today]' or '[Today-X]' with 'X' a number,
      // Here it will return the records done yesterday
      $SP().list("My List").get({
        fields:"Title",
        where:"Created = '[Today-1]'"
      },function getData(row) {
        console.log(row[0].getAttribute("Title"));
      });

      // Since 3.0.8, if you do a WHERE on a Date with the Time included, then it will compare with the tim
      // see http://blogs.syrinx.com/blogs/sharepoint/archive/2008/08/05/caml-queries-with-dates.aspx
      // here it will only show the items created at 2PM exactly -- if you want to check only the today, then use "Created = '2014-03-12'"
      $SP().list("My List").get({
        fields:"Title",
        where:"Created = '2014-03-12 14:00:00'"
      },function getData(row) {
        console.log(row[0].getAttribute("Title"));
      });

      // We have a list called "My List" with a view already set that is called "Marketing View" with some FIELDS and a WHERE clause
      // so the function will grab the view information and will get the data from the list with "Author = '[Me]'" and adding the view's WHERE clause too
      $SP().list("My List","http://my.sharepoint.com/my/site/").get({
        view:"Marketing View",
        where:"Author = '[Me]'"
      }, function(data) {
        for (var i=data.length; i--;) console.log(data[i].getAttribute("Title") + " by " + data[i].getAttribute("Author"));
      });

      // use the paging option for the large list to avoid the message "the attempted operation is prohibited because it exceeds the list view threshold enforced by the administrator"
      // ATTENTION: if you use the WHERE option then it could return the "view threshold" error message because the packet from the WHERE is too big and SharePoint is too stupid...
      $SP().list("My List").get({
        fields:"ID,Title",
        rowlimit:5000,
        paging:true,
        progress:function progress(nbItemsLoaded) {
          // for each new page this function will be called
          console.log("It's still loading... already "+nbItemsLoaded+" items have been loaded!");
        }
      }, function(data) {
        console.log(data.length); // -> 23587
      })
      // add the `page` option to stop after a number of requests/pages
      // for example you only want the last record from a list that has more than 5,000 items
      $SP().list("My List").get({fields:"ID",orderby:"ID DESC",rowlimit:1,paging:true,page:1}, function(data) {
        console.log("last ID : "+data[0].getAttribute("ID"));
      })
      // use `listItemCollectionPositionNext` to start from this index
      $SP().list("My List").get({fields:"ID",orderby:"ID DESC",rowlimit:10,paging:true,page:1}, function(data) {
        // get the next block
        this.get{fields:"ID",orderby:"ID DESC",rowlimit:10,paging:true,page:1,listItemCollectionPositionNext:data.NextPage}, function(data) {
          // here we have the 2nd block of data into `data`
        })
      })

      // We can also find the files from a Document Shared Library
      $SP().list("Shared Documents","http://my.share.point.com/my_site/").get({
        fields:"FileLeafRef,File_x0020_Size",
      }, function getData(data) {
        for (var i=0; i<&lt;data.length; i++) console.log("FileName:"+data[i].getAttribute("FileLeafRef"),"FileSize:"+data[i].getAttribute("File_x0020_Size"));
      });

      // We can join two or more lists together based on a condition
      // ATTENTION: in that case the DATA passed to the callback will return a value for "LIST NAME.FIELD_x0020_NAME" and not directly "FIELD_x0020_NAME"
      // ATTENTION: you need to make sure to call the 'fields' that will be used in the 'on' clause
      $SP().list("Finance and Expense","http://my.sharepoint.com/my_sub/dir/").get({
        fields:"Expense_x0020_Type",
        where:"Finance_x0020_Category = 'Supplies'",
        join:{
          list:"Purchasing List",
          fields:"Region,Year,Expense_x0020_Type,Finance_x0020_Category,Cost",
          where:"Region = 'EMEA' AND Year = 2012",
          orderby:"Expense_x0020_Type,Finance_x0020_Category",
          on:"'Purchasing List'.Expense_x0020_Type = 'Finance and Expense'.Expense_x0020_Type",
          join:{
            list:"Financial Static Data",
            fields:"Region,Year,Expense_x0020_Type,Finance_x0020_Category,Forecast",
            where:"Region = 'EMEA' AND Year = 2012",
            on:"'Purchasing List'.Region = 'Financial Static Data'.Region AND 'Purchasing List'.Expense_x0020_Type = 'Financial Static Data'.Expense_x0020_Type"
          }
        }
      },function getData(data) {
        for (var i=0; i&lt;data.length; i++)
          console.log(data[i].getAttribute("Purchasing List.Region")+" | "+data[i].getAttribute("Purchasing List.Year")+" | "+data[i].getAttribute("Purchasing List.Expense_x0020_Type")+" | "+data[i].getAttribute("Purchasing List.Cost"));
      });

      // By default "join" is an "inner join", but you can also do an "outerjoin"
      // ATTENTION: in that case the DATA passed to the callback will return a value for "LIST NAME.FIELD_x0020_NAME" and not directly "FIELD_x0020_NAME"
      // ATTENTION: you need to make sure to call the 'fields' that will be used in the 'on' clause
      $SP().list("Finance and Expense","http://my.sharepoint.com/my_sub/dir/").get({
        fields:"Expense_x0020_Type",
        where:"Finance_x0020_Category = 'Supplies'",
        join:{
          list:"Purchasing List",
          fields:"Region,Year,Expense_x0020_Type,Finance_x0020_Category,Cost",
          where:"Region = 'EMEA' AND Year = 2012",
          orderby:"Expense_x0020_Type,Finance_x0020_Category",
          on:"'Purchasing List'.Expense_x0020_Type = 'Finance and Expense'.Expense_x0020_Type",
          outerjoin:{
            list:"Financial Static Data",
            fields:"Region,Year,Expense_x0020_Type,Finance_x0020_Category,Forecast",
            where:"Region = 'EMEA' AND Year = 2012",
            on:"'Purchasing List'.Region = 'Financial Static Data'.Region AND 'Purchasing List'.Expense_x0020_Type = 'Financial Static Data'.Expense_x0020_Type"
          }
        }
      },function getData(data) {
        for (var i=0; i&lt;data.length; i++)
          console.log(data[i].getAttribute("Purchasing List.Region")+" | "+data[i].getAttribute("Purchasing List.Year")+" | "+data[i].getAttribute("Purchasing List.Expense_x0020_Type")+" | "+data[i].getAttribute("Purchasing List.Cost"));
      })

      // Another example of "outerjoin", but this time with fields tied to a Lookup ID
      // Here 1 Project can have several Deliverables based on field "Project ID", and 1 Deliverable can have several team members based on "Deliverable ID"
      $SP().list("Projects").get({
        fields:"ID,Project_x0020_Name",
        where:"Status = 'In Progress'",
        outerjoin:{
          list:"Deliverables",
          fields:"ID,Name",
          onLookup:"Project_x0020_ID",
          outerjoin:{
            list:"Team Members",
            fields:"ID,Deliverable_x0020_ID,Name",
            onLookup:"Deliverable_x0020_ID"
          }
        }
      }, function(data) {
        var html = '&lt;table class="table default">&lt;thead>&lt;tr>&lt;th>Project ID&lt;/th>&lt;th>Project Name&lt;/th>&lt;th>Deliverable ID&lt;/th>&lt;th>Deliverable Name&lt;/th>&lt;th>Team ID&lt;/th>&lt;th>Member Name&lt;/th>&lt;/tr>&lt;/thead>&lt;tbody>'
        for (var i=0;i&lt;data.length; i++) {
          html += '&lt;tr>&lt;td>'+data[i].getAttribute("Projects.ID")+'&lt;/td>&lt;td>'+data[i].getAttribute("Projects.Project_x0020_Name")+'&lt;/td>&lt;td>'+data[i].getAttribute("Deliverables.ID")+'&lt;/td>&lt;td>'+data[i].getAttribute("Deliverables.Name")+'&lt;/td>&lt;td>'+data[i].getAttribute("Team Members.ID")+'&lt;/td>&lt;td>'+data[i].getAttribute("Team Members.Name")+'&lt;/td>&lt;/tr>'
        }
        html += '&lt;/tbody>&lt;/table>';
        $('#part1').html(html);
      })

      // With Sharepoint 2010 we are limited due to the throttling limit (see here for some very interesting information http://www.glynblogs.com/2011/03/sharepoint-2010-list-view-throttling-and-custom-caml-queries.html)
      // So for example if I do WHERE:'Fiscal_x0020_Year = 2012' it will return an error because I have 6,500 items
      // So I'll do several requests for each Fiscal_x0020_Week into this Fiscal Year
      var query=[],q=[];
      for (var i=1; i&lt;54; i++) {
        q.push("Fiscal_x0020_Week = "+i);
        if (i%8==0 || i == 53) {
          query.push("("+q.join(" OR ")+") AND Fiscal_x0020_Year = 2012");
          q=[]
        }
      }
      // it returns :
      // [
      //   "(Fiscal_x0020_Week = 1 OR Fiscal_x0020_Week = 2 OR Fiscal_x0020_Week = 3 OR Fiscal_x0020_Week = 4 OR Fiscal_x0020_Week = 5 OR Fiscal_x0020_Week = 6 OR Fiscal_x0020_Week = 7 OR Fiscal_x0020_Week = 8) AND Fiscal_x0020_Year = 2012",
      //   ...
      //   "(Fiscal_x0020_Week = 49 OR Fiscal_x0020_Week = 50 OR Fiscal_x0020_Week = 51 OR Fiscal_x0020_Week = 52 OR Fiscal_x0020_Week = 53) AND Fiscal_x0020_Year = 2012"
      // ]
      $SP().list("Sessions").get({
        fields:"Title,Score",
        where:query,
        progress:function progress(current,max) {
          // when we use an array for the WHERE clause we are able to provide `current` and `max`
          console.log("Progress: "+current+" / "+max);
        }
      },function getData(data) {
        console.log(data.length); // -> 6,523
      });
      // also regarding the throttling limit, you can query a list on a user column in using the User ID
      // For example if John Doe is recorded as "328;#Doe, John" then you'll have to use the special operator "~="
      $SP().list("Sessions").get({
        fields:"Title",
        where:'User ~= 328"
      },function getData(data) {
        console.log(data.length);
      });

      // if you want to list only the files visible into a folder for a Document Library
      $SP().list("My Shared Documents").get({
        fields:"BaseName,FileRef,FSObjType", // "BaseName" is the name of the file/folder; "FileRef" is the full path of the file/folder; "FSObjType" is 0 for a file and 1 for a folder (you need to apply $SP().cleanResult())
        folderOptions:{
          path:"My Folder/Sub Folder/",
          show:"FilesOnly_InFolder"
        }
      });

      // if you want to list all the files and folders for a Document Library
      $SP().list("My Shared Documents").get({
        fields:"BaseName,FileRef,FSObjType", // "BaseName" is the name of the file/folder; "FileRef" is the full path of the file/folder; "FSObjType" is 0 for a file and 1 for a folder (you need to apply $SP().cleanResult())
        folderOptions:{
          show:"FilesAndFolders_Recursive"
        }
      });

      // How to retrieve the events from a Calendar List
      // NOTE -- when "calendar:true" we automatically get some fields: "Title", "EventDate" -- the Start Date --, "EndDate", "RecurrenceData", Duration", fAllDayEvent", "fRecurrence", "ID"
      $SP().list("My Calendar").get({
        fields:"Description",
        calendar:true,
        calendarOptions:{
          referenceDate:new Date(2012,4,4),
          range: "Week"
        }
        where:"Category = 'Yellow'"
      }, function(data) {
        var events=[];
        for (var i=0; i&lt;data.length; i++) {
          // several information are available -- see below
          events.push({
            Title:         data[i].getAttribute("Title"),
            StartDateTime: data[i].getAttribute("EventDate"), // you can use $SP().toDate() to have a JS Date
            EndDateTime:   data[i].getAttribute("EndDate"), // you can use $SP().toDate() to have a JS Date
            Recurrence:    (data[i].getAttribute("fRecurrence") == 1 ? true : false),
            AllDayEvent:   (data[i].getAttribute("fAllDayEvent") == 1 ? true : false),
            RecurrenceEnd: (data[i].getAttribute("RecurrenceData")||"").replace(/.+<windowEnd>([^<]+)<\/windowEnd>.+/,"$1"), // see the NOTE below
            ID:            data[i].getAttribute("ID"), // the ID for the recurrence events is special but can be also passed to "Display.aspx?ID="
            Duration:      1*data[i].getAttribute("Duration") // Duration is in SECONDS
          })
          // NOTE: with data[i].getAttribute("RecurrenceData") you'll find more info about the recurrence (like the end date for the serie, and much more),
          // but because there are a lot of scenario, I won't handle the different cases.
          // e.g. for a daily recurrence you can find the end date of the serie with: data[i].getAttribute("RecurrenceData").replace(/.+<windowEnd>([^<]+)<\/windowEnd>.+/,"$1")
          // --> it will return a SP Date
        }
      })

      // [It doesn't work with Sharepoint 2013 anymore, only for SP2010]
      // You can use `useIndexForOrderBy:true` to override the list view threshold -- see https://spservices.codeplex.com/discussions/280642
      // To make it to work, you need :
      // 1) to have "ID > 0 AND Another_Index_Column_Filtered" in the WHERE Clause (so at least two filters), and then we can add some other WHERE (even the not indexed columns)
      // 2) To use `orderby`, with an indexed column
      // 3) To use `useIndexForOrderBy:true`
      // see the below example with Trainer an indexed column, and Equipment a column not indexed
      // NOTE: you need to test your WHERE to see if it works or not, because it's vary a lot depending of the kind of WHERE clause you'll use
      $SP().list("Calendar",'http://intranet.dell.com/services/Educate/Toolbox/scheduling_tool/').get({
        fields:"Trainer",
        where:'ID > 0 AND Trainer <> "" AND Equipment LIKE "Box"',
        orderby:'Trainer',
        useIndexForOrderBy:true
      }, function(d) {
        console.log(d.length)
      })

      // Since Sharepoint v4.0 it returns a Promise/Deferred
      $SP().list("MyList").get({
        fields:"Title"
      }).then(function(data) {
        data.forEach(function(d) { console.log(d.getAttribute("Title")) })
      }, function(err) {
        console.log("Error Found => ",err)
      });
    */
    get:function(options, fct) {
      var _this = this;
      return _this._promise(function(prom_resolve, prom_reject) {
        // check if we need to queue it
        if (_this.needQueue) { return _this._addInQueue(arguments) }
        if (_this.listID == undefined) throw "Error 'get': you have to define the list ID/Name";
        if (arguments.length === 1 && typeof options === "function") {
          fct = options;
          options = {};
        }
        var useCallback=false;
        // deal with Promise/callbacks
        if (fct) { // if we ask for a callback
          prom_resolve = fct;
          prom_reject = function(e){ fct([],e) };
          useCallback = true;
        }
        if (!prom_resolve) prom_resolve=prom_reject=function(){}; // no Promise, no callback, no jQuery

        // default values
        var setup={};
        SPExtend(true, setup, options);
        if (_this.url == undefined) throw "Error 'get': not able to find the URL!"; // we cannot determine the url
        setup.fields    = setup.fields || "";
        setup.where     = setup.where || "";
        setup.whereFct  = setup.whereFct || function(w) { return w };
        setup.orderby   = setup.orderby || "";
        setup.useIndexForOrderBy = (setup.useIndexForOrderBy===true ? true : false);
        setup.groupby   = setup.groupby || "";
        setup.rowlimit  = setup.rowlimit || 0;
        setup.whereEscapeChar= (setup.whereEscapeChar===false ? false : true);
        setup.paging    = (setup.paging===true ? true : false);
        setup.page      = (setup.paging===false || isNaN(setup.page) ? 5000 : setup.page);
        if (setup.paging && setup.rowlimit === 0) setup.rowlimit = 5000; // if rowlimit is not defined, we set it to 5000 by default
        setup.expandUserField = (setup.expandUserField===true || setup.expandUserField==="True"?"True":"False");
        setup.dateInUTC = (setup.dateInUTC===true?"True":"False");
        setup.folderOptions = setup.folderOptions || null;
        setup.view      = setup.view || "";
        setup.calendar  = (setup.calendar===true ? true : false);
        if (setup.calendar===true) {
          setup.calendarOptions = setup.calendarOptions || {};
          setup.calendarOptions.referenceDate = setup.calendarOptions.referenceDate || new Date();
          if (typeof setup.calendarOptions.referenceDate !== "string") setup.calendarOptions.referenceDate=_this.toSPDate(setup.calendarOptions.referenceDate)
          setup.calendarOptions.splitRecurrence = (setup.calendarOptions.splitRecurrence===false ? "FALSE" : "TRUE");
          setup.calendarOptions.range = setup.calendarOptions.range || "Month";
        }
        // if (setup.whereCAML!==true) setup.whereCAML = (setup.view!="");
        setup.results = setup.results || []; // internal use when there is a paging
        setup.listItemCollectionPositionNext = setup.listItemCollectionPositionNext || ""; // for paging
        // protect & into ListItemCollectionPositionNext
        if (setup.listItemCollectionPositionNext) setup.listItemCollectionPositionNext = setup.listItemCollectionPositionNext.replace(/&/g,"&amp;").replace(/&amp;amp;/g,"&amp;");

        // if setup.where is an array, then it means we want to do several requests
        // so we keep the first WHERE
        if (typeof setup.where === "object") {
          setup.where = setup.where.slice(0); // clone the original array
          if (setup.originalWhere==undefined) setup.originalWhere = setup.where.slice(0);
          setup.nextWhere = setup.where.slice(1);
          setup.where = setup.where.shift();
        } else {
          setup.originalWhere = setup.where;
          setup.nextWhere = [];
        }
        // we use the progress only when WHERE is an array
        setup.progress = setup.progress || (function() {});

        // if view is defined and is not a GUID, then we need to find the view ID
        if (setup.view !== "") {
          // retrieve the View ID based on its name
          // and find the view details
          _this.view(setup.view,function(data,viewID) {
            setup.view=viewID;
            var where = (setup.whereCAML ? setup.where : _this.parse(setup.where));
            // if we have a 'DateRangesOverlap' then we want to move this part at the end -- since v3.0.9
            var mtchDateRanges = data.whereCAML.match(/^<And>(<DateRangesOverlap>.*<\/DateRangesOverlap>)(.*)<\/And>$/);
            if (mtchDateRanges && mtchDateRanges.length === 3) data.whereCAML = '<And>'+mtchDateRanges[2]+mtchDateRanges[1]+'</And>'
            where += data.whereCAML;
            if (setup.where !== "" && data.whereCAML !== "") where = "<And>" + where + "</And>";
            setup.where=where;
            setup.fields += (setup.fields===""?"":",") + data.fields.join(",");
            setup.orderby += (setup.orderby===""?"":",") + data.orderby;
            setup.whereCAML=true;
            setup.useOWS=true;
            // disable the calendar option
            setup.calendarViaView=setup.calendar;
            setup.calendar=false;
            delete setup.view;
            if (useCallback)
              _this.get(setup,fct);
            else
              _this.get(setup).then(function(d) { prom_resolve(d) }, function(e) { prom_reject(e) });
          });
          return;
        }

        // if we have [Me]/[Today] in the WHERE, or we want to use the GROUPBY,
        // then we want to use the Lists.asmx service
        // also for Sharepoint 2010
        // depreciate since v3.0
        var useOWS = true;//( setup.groupby!="" || /\[Me\]|\[Today\]/.test(setup.where) || setup.forceOWS===true || typeof SP=="object");

        // what about the fields ?
        var fields="";
        if (setup.fields == "" || setup.fields == [])
          fields = "";
        else {
          if (typeof setup.fields == "string") setup.fields = setup.fields.replace(/^\s+/,"").replace(/\s+$/,"").replace(/( )?,( )?/g,",").split(",");
          // depreciate since v3.0 // if (setup.fields.indexOf("Attachments") != -1) useOWS=true;
          for (var i=0; i<setup.fields.length; i++) fields += '<FieldRef Name="'+setup.fields[i]+'" />';
            // depreciate since v3.0 fields += '<Field'+(useOWS?'Ref':'')+' Name="'+setup.fields[i]+'" />';
        }

        // what about sorting ?
        var orderby="";
        if (setup.orderby != "") {
          var fieldsDir = setup.orderby.split(",");
          for (i=0; i<fieldsDir.length; i++) {
            var direction = "ASC";
            var splt      = fieldsDir[i].trim().split(" ");
            if (splt.length > 0) {
              if (splt.length==2) direction = splt[1].toUpperCase();
              orderby += ( useOWS ? '<FieldRef Name="'+splt[0]+'" Ascending="'+(direction=="ASC")+'" />' : '<OrderField Name="'+splt[0]+'" Direction="'+direction+'" />' );
            }
          }
        }
        // if calendar:true and no orderby, then we order by the EventDate
        if ((setup.calendar===true||setup.calendarViaView===true) && orderby==="") orderby = '<FieldRef Name="EventDate" Ascending="ASC" />'

        // what about groupby ?
        var groupby="";
        if (setup.groupby != "") {
          var gFields = setup.groupby.split(",");
          for (i=0; i<gFields.length; i++)
            groupby += '<FieldRef Name="'+gFields[i]+'" />';
        }

        // when it's a calendar we want to retrieve some fields by default
        if (setup.calendar===true || setup.calendarViaView===true) {
          var tmpFields = ["Title", "EventDate", "EndDate", "Duration", "fAllDayEvent", "fRecurrence", "RecurrenceData", "ID"];
          for (i=0; i<tmpFields.length; i++) fields += '<FieldRef Name="'+tmpFields[i]+'" />';
        }

        // forge the parameters
        var body = "";

        // if no queryOptions provided then we set the default ones
        if (setup.queryOptions === undefined) {
          setup._queryOptions = "<DateInUtc>"+setup.dateInUTC+"</DateInUtc>"
                             + "<Paging ListItemCollectionPositionNext=\""+setup.listItemCollectionPositionNext+"\"></Paging>"
                             + "<IncludeAttachmentUrls>True</IncludeAttachmentUrls>"
                             + (fields==="" ? "" : "<IncludeMandatoryColumns>False</IncludeMandatoryColumns>")
                             + "<ExpandUserField>"+setup.expandUserField+"</ExpandUserField>";
          // check if we want something related to the folders
          if (setup.folderOptions) {
            var viewAttr;
            switch (setup.folderOptions.show) {
              case "FilesAndFolders_Recursive": viewAttr="RecursiveAll"; break
              case "FilesOnly_InFolder": viewAttr="FilesOnly"; break
              case "FilesAndFolders_InFolder": viewAttr=""; break
              case "FilesOnly_Recursive":
              default: viewAttr="Recursive"
            }
            setup._queryOptions += "<ViewAttributes Scope=\""+viewAttr+"\"></ViewAttributes>"
            if (setup.folderOptions.path) setup._queryOptions += "<Folder>"+_this.url + '/' + _this.listID + '/' + setup.folderOptions.path+"</Folder>"
          } else
            setup._queryOptions += "<ViewAttributes Scope=\"Recursive\"></ViewAttributes>"
        } else setup._queryOptions = setup.queryOptions
        if (setup.calendarOptions) {
          setup._queryOptions += "<CalendarDate>" + setup.calendarOptions.referenceDate + "</CalendarDate>"
                              +  "<RecurrencePatternXMLVersion>v3</RecurrencePatternXMLVersion>"
                              +  "<ExpandRecurrence>"+setup.calendarOptions.splitRecurrence+"</ExpandRecurrence>";
        }

        // what about the Where ?
        var where="";
        if (setup.where !== "") {
          if (setup.whereCAML) where=setup.where;
          else where=_this.parse(setup.where);
        }
        if (setup.calendar===true) {
          var whereDateRanges = "<DateRangesOverlap>"
                              + "<FieldRef Name='EventDate' />"
                              + "<FieldRef Name='EndDate' />"
                              + "<FieldRef Name='RecurrenceID' />"
                              + "<Value Type='DateTime'><" + setup.calendarOptions.range + " /></Value>" /* there is a property called IncludeTimeValue="TRUE" */
                              + "</DateRangesOverlap>"
          if (where !== "") where = "<And>" + where + whereDateRanges + "</And>";
          else where = whereDateRanges;
        }
        where = setup.whereFct(where);
        if (useOWS) {
          body = "<listName>"+_this.listID+"</listName>"
                + "<viewName>"+setup.view+"</viewName>"
                + "<query>"
                + "<Query>"
                + ( where!="" ? "<Where>"+ where +"</Where>" : "" )
                + ( groupby!="" ? "<GroupBy>"+groupby+"</GroupBy>" : "" )
                + ( orderby!="" ? "<OrderBy"+(setup.useIndexForOrderBy ? " UseIndexForOrderBy='TRUE' Override='TRUE'": "")+">"+orderby+"</OrderBy>" : "" )
                + "</Query>"
                + "</query>"
                + "<viewFields>"
                + "<ViewFields Properties='True'>"
                + fields
                + "</ViewFields>"
                + "</viewFields>"
                + "<rowLimit>"+setup.rowlimit+"</rowLimit>"
                + "<queryOptions>"
                + "<QueryOptions>"
                + setup._queryOptions
                + "</QueryOptions>"
                + "</queryOptions>";
          body = _this._buildBodyForSOAP("GetListItems", body);
          // do the request
          var url = _this.url + "/_vti_bin/Lists.asmx";
          _this.ajax({
            type: "POST",
            cache: false,
            async: true,
            url: url,
            data: body,
            contentType: "text/xml; charset=utf-8",
            dataType: "xml",
            success:function(data) {
              var rows, i, j, stop, collection, on, aResult, prevIndex, index, listIndexFound, nextPage,
                  joinDataLen, tmp, attributes, attributesReturn, attr, attributesJoinData, joinIndexLen, idx, sp,
                  joinData, joinIndex, joinWhereLookup, wh, aReturn;
              // we want to use myElem to change the getAttribute function
              rows=data.getElementsByTagName('z:row');
              if (rows.length==0) rows=data.getElementsByTagName('row'); // for Chrome 'bug'
              aReturn = fastMap(rows, function(row) { return myElem(row); });

              // if setup.results length is bigger than 0 then it means we need to add the current data
              if (setup.results.length>0)
                for (i=0,stop=aReturn.length; i<stop; i++) setup.results.push(aReturn[i])

              // depending of the setup.nextWhere length we update the progress
              if (typeof setup.originalWhere !== "string")
                setup.progress(setup.originalWhere.length-setup.nextWhere.length,setup.originalWhere.length);

              // if paging we want to return ListItemCollectionPositionNext
              if (setup.paging) {
                collection = data.getElementsByTagName("rs:data")[0];
                if (typeof collection === "undefined" || collection.length==0) {
                  collection=data.getElementsByTagName("data")[0]; // for Chrome
                }
                if (collection) nextPage = collection.getAttribute("ListItemCollectionPositionNext");
              }

              // if we have a paging then we need to do the request again
              if (setup.paging && --setup.page > 0) {
                // check if we need to go to another request
                if (setup.results.length===0) setup.results=aReturn;
                // notify that we keep loading
                setup.progress(setup.results.length);
                if (nextPage) {
                  // we need more calls
                  setup.listItemCollectionPositionNext=_this._cleanString(nextPage);
                  if (useCallback)
                    _this.get(setup,fct);
                  else
                    _this.get(setup).then(function(d) { prom_resolve(d) }, function(e) { prom_reject(e) });
                  return;
                } else {
                  aReturn = setup.results
                  // it means we're done, no more call
                }
              } else if (setup.nextWhere.length>0) { // if we need to so some more request
                if (setup.results.length===0) setup.results=aReturn
                setup.where = setup.nextWhere.slice(0);
                if (useCallback)
                  _this.get(setup,fct);
                else
                  _this.get(setup).then(function(d) { prom_resolve(d) }, function(e) { prom_reject(e) });
                return;
              } else {
                // rechange setup.where with the original one just in case it was an array to make sure we didn't override the original array
                setup.where = setup.originalWhere;
                aReturn = (setup.results.length>0?setup.results:aReturn);
              }

              // we have data from a previous list, so let's merge all together the both of them
              if (setup.joinData) {
                on = setup.joinData["noindex"];
                aResult = [];
                prevIndex="";
                listIndexFound={length:0};
                if (!on.length) alert("$SP.get() -- Error 'get': you must define the ON clause when JOIN is used.");
                // we have a linked list so do some stuff here to tie the two lists together
                for (i=0,stop=aReturn.length; i<stop; i++) {
                  index="";
                  for (j=0; j<on.length; j++) index += "_"+_this.getLookup(aReturn[i].getAttribute(on[j][_this.listID])).id;
                  // check if the index exists in the previous set of data
                  if (setup.joinData[index]) {
                    if (prevIndex!==index) {
                      if (!listIndexFound[setup.joinIndex[index]]) listIndexFound.length++;
                      listIndexFound[setup.joinIndex[index]]=true;
                      prevIndex=index;
                    }
                    // we merge the joinData and the aReturn
                    for (j=0,joinDataLen=setup.joinData[index].length; j<joinDataLen; j++) {
                      tmp=[];
                      // find the attributes for the current list
                      attributesReturn=aReturn[i].getAttributes();
                      for (attr=attributesReturn.length; attr--;) {
                        tmp[_this.listID+"."+attributesReturn[attr].nodeName.slice(4)] = attributesReturn[attr].nodeValue;
                      }
                      // now find the attributes for the joinData
                      attributesJoinData=setup.joinData[index][j].getAttributes();
                      for (attr in attributesJoinData) {
                        tmp[attr] = setup.joinData[index][j].getAttribute(attr);
                      }

                      aResult.push(new extendMyObject(tmp));
                    }
                  }
                  // for the default options
                  if (setup.innerjoin) setup.join=setup.innerjoin;
                  if (setup.outerjoin) {
                    setup.join=setup.outerjoin;
                    setup.join.outer=true;
                  }

                }
                aReturn=aResult;

                // if there is a WHERE clause then we want to force to an innerjoin
                // except where setup.where equals to setup.onLookupWhere
                if (setup.where && setup.where!==setup.onLookupWhere && setup.outer) setup.outer=false;

                // if we want to do an outerjoin we link the missing data
                if (setup.outer) {
                  joinIndexLen=setup.joinIndex.length;
                  if (listIndexFound.length < joinIndexLen) {
                    for (i=0; i<joinIndexLen; i++) {
                      if (listIndexFound[i] !== true) {
                        idx = setup.joinIndex[i];
                        if (idx===undefined || setup.joinData[idx]===undefined) continue
                        for (j=0,joinDataLen=setup.joinData[idx].length; j<joinDataLen; j++) {
                          tmp=[];
                          attributesJoinData=setup.joinData[idx][j].getAttributes();
                          for (attr in attributesJoinData) {
                            tmp[attr] = setup.joinData[idx][j].getAttribute(attr);
                          }
                          aResult.push(new extendMyObject(tmp));
                        }
                      }
                    }
                  }
                }
              }

              if (setup.outerjoin) {
                setup.join=setup.outerjoin;
                setup.join.outer=true;
              }
              else if (setup.innerjoin) setup.join=setup.innerjoin;
              // if we join it with another list
              if (setup.join) {
                joinData=[];
                joinIndex=[];
                joinWhereLookup=[];
                // retrieve the ON clauses
                if (setup.join.onLookup) setup.join.on="'"+setup.join.list+"'."+setup.join.onLookup+" = '"+_this.listID+"'.ID";
                on=_this._parseOn(setup.join.on);
                joinData["noindex"]=on; // keep a copy of it for the next treatment in the tied list
                for (i=0,stop=aReturn.length; i<stop; i++) {
                  // create an index that will be used in the next list to filter it
                  index="",tmp=[];
                  for (j=0; j<on.length; j++) index += "_"+_this.getLookup(aReturn[i].getAttribute(on[j][_this.listID]) || aReturn[i].getAttribute(_this.listID+"."+on[j][_this.listID])).id;
                  if (!joinData[index]) {
                    joinIndex[index]=joinIndex.length;
                    joinIndex.push(index);
                    joinData[index] = [];
                    // if onLookup then we will store the current ID with the ~ to use it in a where clause with IN operator
                    if (setup.join.onLookup && index!=="_") joinWhereLookup.push("~"+index.slice(1))
                  }
                  // if we are coming from some other join
                  if (setup.joinData) {
                    joinData[index].push(aReturn[i]);
                  } else {
                    attributes=aReturn[i].getAttributes();
                    for (j=attributes.length; j--;) {
                      tmp[_this.listID+"."+attributes[j].nodeName.slice(4)] = attributes[j].nodeValue;
                    }
                    joinData[index].push(new extendMyObject(tmp));
                  }
                }
                delete setup.joinData;
                // call the joined list to grab data and process them
                // if onLookup then we create a WHERE clause with IN operator
                if (setup.join.onLookup) {
                  if (joinWhereLookup.length>0) {
                    // SP2013 limits to 60 items per IN
                    wh=SPArrayChunk(joinWhereLookup, 60);
                    for (j=0; j<wh.length; j++) {
                      wh[j] = setup.join.onLookup+' IN ["'+wh[j].join('","')+'"]'
                    }
                    // if the WHERE is too big then the server could run out of memory
                    if (wh.length <= _SP_MAXWHERE_ONLOOKUP) {
                      wh = "(" + wh.join(" OR ") + ")";
                      // now we add this WHERE into the existing where
                      if (setup.join.where) {
                        if (SPIsArray(setup.join.where)) {
                          SPArrayForEach(setup.join.where, function(e, i) { setup.join.where[i]=wh + " AND ("+e+")" })
                        } else {
                          setup.join.where=wh + " AND (" + setup.join.where + ")";
                        }
                      } else setup.join.where=wh
                      setup.join.onLookupWhere=wh;
                    } else {
                      // in that case we'll use paging
                      setup.join.paging=true;
                    }
                  }
                  // make sure the lookup fields is in the fields list
                  if (!setup.join.fields) setup.join.fields=[];
                  if (!SPIsArray(setup.join.fields)) {
                    tmp=setup.join.fields.split(",");
                    tmp.push(setup.join.onLookup);
                    setup.join.fields=tmp.join(",");
                  } else setup.join.fields.push(setup.join.onLookup);
                }
                sp=_this.list(setup.join.list,setup.join.url||_this.url);
                setup.join.joinData=joinData;
                setup.join.joinIndex=joinIndex;
                if (useCallback)
                  sp.get(setup.join,fct);
                else
                  sp.get(setup.join).then(function(d) { prom_resolve(d) }, function(e) { prom_reject(e) });
                return;
              }

              aReturn["NextPage"]=nextPage;
              prom_resolve(aReturn,nextPage)
            },
            error:function(jqXHR, textStatus, errorThrown) {
              if (textStatus !== "000") {
                var res = jqXHR.responseXML;
                var err = (res ? res.getElementsByTagName("errorstring") : null);
                if (err && err[0]) prom_reject("Error: "+err[0].firstChild.nodeValue)
                else prom_reject(textStatus+": "+errorThrown);
              } else {
                prom_reject(errorThrown);
              }
            }
          });
        }

      });
    },
    /**
      @name $SP().createFile
      @function
      @category files
      @description Create a file and save it to a Document library

      @param {Object} setup Options (see below)
        @param {String} setup.content The file content
        @param {String} setup.filename The relative path (within the document library) to the file to create
        @param {String} setup.library The name of the document library
        @param {Boolean} [setup.encoded=false] Set to true if the content passed is already base64-encoded
        @param {Object} [setup.fields] If you want to set some other fields for the document
        @param {String} [setup.url='current website'] The website url
        @param {Function} [setup.success=function(fileURL){}] A callback function that will be triggered in case of success; 1 parameter
        @param {Function} [setup.error=function(fileURL,errorMessage){}] A callback function that will be triggered in case of failure; 2 parameters
        @param {Function} [setup.after=function(fileURL,errorMessage){}] A callback function that will be triggered after the task whatever it's successful or not; 2 parameters
      @return {Promise} The 'fileURL' on 'resolve', and 'errorMessage' on 'reject'

      @example
      // create a text document
      $SP().createFile({
        content:"Hello World!",
        filename:"SubFolder/myfile.txt",
        library:"Shared Document",
        fields:{
          "Title":"My Document",
          "File_x0020_Description":"This is my file!"
        },
        after:function(fileURL, error) {
          if (error) alert("Error: "+error)
          else alert("File created at " + fileURL); // fileURL -> http://mysite/Shared Documents/SubFolder/myfile.txt
        }
      });

      // you can remove "library" if you use $SP().list()
      $SP().list("Shared Document").createFile({
        content:"Hello World!",
        filename:"SubFolder/myfile.txt",
        fields:{
          "Title":"My Document",
          "File_x0020_Description":"This is my file!"
        },
        after:function(fileURL, error) {
          if (error) alert("Error: "+error)
          else alert("File created at " + fileURL); // fileURL -> http://mysite/Shared Documents/SubFolder/myfile.txt
        }
      })

      // we can also create an Excel file
      // a good way to export some data to Excel
      $SP().createFile({
        content:"&lt;table>&lt;tr>&lt;th>Column A&lt;/th>&lt;th>Column B&lt;/th>&lt;/tr>&lt;tr>&lt;td>Hello&lt;/td>&lt;td>World!&lt;/td>&lt;/tr>&lt;/table>",
        filename:"myfile.xls",
        library:"Excel Exports",
        after:function(fileURL) {
          window.location.href=fileURL;
        }
      });

      // You can use https://github.com/Aymkdn/FileToDataURI if you want to be able to read a local file
      // and then upload it to a document library, via Javascript/Flash
      // We'll use "encoded:true" to say our content is already a base64 string
      $SP().createFile({
        content:"U2hhcmVwb2ludFBsdXMgUm9ja3Mh",
        encoded:true,
        filename:"Demo/HelloWorld.txt",
        library:"Documents",
        url:"http://my.other.site/website/"
      });

      // with $SP().list() and Promise
      $SP().list("Documents", "http://my.other.site/website/").createFile({
        content:"U2hhcmVwb2ludFBsdXMgUm9ja3Mh",
        encoded:true,
        filename:"Demo/HelloWorld.txt"
      }).then(function(file) {
        console.log(file+" has been created")
      }, function(error) {
        console.log("Error: "+error)
      })

      // NOTE: in some cases the files are automatically checked out, so you have to use $SP().checkin()
    */
    createFile:function(setup) {
      var _this=this;
      return _this._promise(function(prom_resolve, prom_reject) {
        // default values
        setup     = setup || {};
        if (setup.content === undefined) throw "Error 'createFile': not able to find the file content.";
        if (setup.filename === undefined) throw "Error 'createFile': not able to find the filename.";
        if (setup.library === undefined) {
          if (_this.listID === undefined) throw "Error 'createFile': not able to find the library name.";
          setup.library = _this.listID;
        }
        setup.url = setup.url || _this.url;
        // if we didn't define the url in the parameters, then we need to find it
        if (!setup.url) {
          if (_this.hasPromise) {
            _this._getURL().then(function() {
              _this.createFile(setup).then(function(res) {
                prom_resolve(res);
              })
            });
          } else {
            _this._getURL();
            _this._addInQueue(arguments);
          }
          return;
        }

        // deal with Promise/callbacks
        if (setup.useCallback !== false && (typeof setup.after === "function" || !prom_resolve)) { // if we ask for a callback, or if no Promise, no callback, no jQuery
          setup.useCallback = true;
        } else {
          setup.useCallback = false;
        }
        if (!prom_resolve) prom_resolve=prom_reject=function(){};
        setup.after   = setup.after || function(){};
        setup.success = setup.success || function(){};
        setup.error   = setup.error || function(){};
        setup.encoded = (setup.encoded===true?true:false);
        setup.extendedFields = setup.extendedFields || "";
        // if we have setup.fields, then we need to figure out the Type using $SP().list().info()
        if (setup.fields && !setup.extendedFields) {
          if (typeof setup.fields !== "object") throw "Error 'createFile': please refer to the documentation regarding `fields`";
          _this.list(setup.library, setup.url).info(function(fields) {
            // we use extendedFields to define the Type
            for (var i=fields.length; i--;) {
              if (setup.fields[fields[i]["StaticName"]]) {
                setup.extendedFields += '<FieldInformation Type="'+fields[i]["Type"]+'" Value="'+setup.fields[fields[i]["StaticName"]]+'" DisplayName="'+fields[i]["StaticName"]+'" InternalName="'+fields[i]["StaticName"]+'" />'
              }
            }
            if (!setup.extendedFields) delete setup.fields;
            if (setup.useCallback) _this.createFile(setup);
            else _this.createFile(setup).then(function(res) { prom_resolve(res) })
          });
          return;
        }
        var destination = "/" + setup.library + "/" + setup.filename
        destination = (setup.url + destination).replace(/([^:]\/)\//g,"$1");
        if (destination.slice(0,4) !== "http") destination=window.location.protocol + "//" + window.location.host + destination;
        var soapEnv = "<SourceUrl>http://null</SourceUrl>"
                      +"<DestinationUrls><string>"+destination+"</string></DestinationUrls>"
                      +'<Fields><FieldInformation Type="File" />'+setup.extendedFields+'</Fields>'
                      +"<Stream>"+(setup.encoded?setup.content:_this.encode_b64(setup.content))+"</Stream>"
        soapEnv = _this._buildBodyForSOAP("CopyIntoItems", soapEnv);
        _this.ajax({
          url: setup.url + "/_vti_bin/copy.asmx",
          type: "POST",
          dataType: "xml",
          data: soapEnv,
          beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/CopyIntoItems'); },
          contentType: "text/xml; charset=\"utf-8\"",
          success:function(data) {
            var a = data.getElementsByTagName('CopyResult');
            var error;
            if (a && a[0] && a[0].getAttribute("ErrorCode") !== "Success") {
              error="Error 'createFile' ("+destination+"): "+a[0].getAttribute("ErrorCode")+" - "+a[0].getAttribute("ErrorMessage");
              setup.error.call(_this, destination, error);
              prom_reject(error);
            } else {
              setup.success.call(_this, destination);
              prom_resolve(destination);
            }

            if (setup.useCallback) setup.after.call(_this, destination, error);
          },
          error:function(qXHR, textStatus, errorThrown) {
            setup.error.call(_this, destination, errorThrown);
            if (setup.useCallback) setup.after.call(_this, destination, errorThrown);
            else prom_reject(errorThrown);
          }
        });
      })
    },
    /**
      @name $SP().createFolder
      @function
      @category files
      @description Create a folter in a Document library

      @param {Object|String} setup Options (see below), or the folder name when using with $SP().list()
        @param {String} setup.path The relative path to the new folder
        @param {String} setup.library The name of the Document Library
        @param {String} [setup.url='current website'] The website url
        @param {Function} [setup.after=function(passed,failed){}] A callback function that will be triggered after the task
      @return {Promise} A 'results' array with 'passed' ([0]) and 'failed' ([1]), no trigger on 'reject'

      @example
      // create a folder called "first" at the root of the Shared Documents library
      // the result should be "http://mysite/Shared Documents/first/"
      $SP().createFolder({
        path:"first",
        library:"Shared Documents",
        url:"http://mysite/",
        after:function() { alert("Folder created!"); }
      });

      // create a folder called "second" under "first"
      // the result should be "http://mysite/Shared Documents/first/second/"
      // if "first" doesn't exist then it will be created
      $SP().createFolder({
        path:"first/second",
        library:"Shared Documents",
        after:function() { alert("Folder created!"); }
      });

      // you can also use $SP().list()
      $SP().list("Shared Documents", "http://my.web.site").createFolder("first/second").then(function(results) {
        results.forEach(function(folder) {
          if (folder.errorMessage) console.log("The folder << "+folder.BaseName+" >> hasn't been created: "+folder.errorMessage)
          else console.log("The folder << "+folder.BaseName+" >> has been created") })
        })
      })

      // Note: To delete a folder you can use $SP().list().remove() with ID and FileRef parameters
    */
    createFolder:function(setup) {
      // default values
      var _this=this;
      return _this._promise(function(prom_resolve, prom_reject) {
        setup = setup || {};
        if (typeof setup === "string") setup={path:setup};
        if (setup.path == undefined) throw "Error 'createFolder': please provide the 'path'.";
        if (setup.library === undefined) {
          if (_this.listID === undefined) throw "Error 'createFolder': not able to find the library name.";
          setup.library = _this.listID;
        }
        var useCallback=false;
        if (typeof setup.after == "function") useCallback=true;
        else setup.after=function(){};
        setup.url = setup.url || _this.url;
        // if we didn't define the url in the parameters, then we need to find it
        if (!setup.url) {
          if (_this.hasPromise) {
            _this._getURL().then(function() {
              _this.createFolder(setup).then(function(res) {
                prom_resolve(res);
              })
            });
          } else {
            _this._getURL();
            _this._addInQueue(arguments);
          }
          return;
        }
        // split the path based on '/'
        var path = setup.path, toAdd=[], tmpPath="";
        // trim "/" at the beginning and end
        if (path.charAt(0)==="/") path=path.slice(1);
        if (path.slice(-1)==="/") path=path.slice(0,-1);
        path=path.split('/');
        for (var i=0; i<path.length; i++) {
          tmpPath += (i>0?'/':'') + path[i];
          toAdd.push({FSObjType:1, BaseName:tmpPath})
        }

        if (useCallback) {
          _this.list(setup.library, setup.url).add(toAdd, {
            after:function(passed,failed) { setup.after(passed,failed) }
          });
        }
        else _this.list(setup.library, setup.url).add(toAdd).then(function(res) {
          var folders = [];
          SPArrayForEach(res, function(re) {
            SPArrayForEach(re, function(r) {
              if (SPIsArray(r)) folders=folders.concat(r)
              else folders.push(r)
            })
          });
          prom_resolve(folders)
        });
      })
    },
    /**
      @name $SP().checkin
      @function
      @category files
      @description Checkin a file

      @param {Object} [setup] Options (see below)
        @param {String} setup.destination The full path to the file to check in
        @param {String} [setup.comments=""] The comments related to the check in
        @param {String} [setup.url='current website'] The website url
        @param {Function} [setup.success=function(){}] A callback function that will be triggered when there is success
        @param {Function} [setup.error=function(){}] A callback function that will be triggered if there is an error
        @param {Function} [setup.after=function(){}] A callback function that will be triggered after the task
      @return {Promise} when the request is completed it will trigger the on 'resolve', and no trigger for on 'reject'

      @example
      $SP().checkin({
        destination:"http://mysite/Shared Documents/myfile.txt",
        comments:"Automatic check in with SharepointPlus",
        after:function() { alert("Done"); }
      });

      // with Promise
      $SP().checkin({
        destination:"http://mysite/Shared Documents/myfile.txt",
        comments:"Automatic check in with SharepointPlus"
      }).then(function() {
        alert("Done");
      })
    */
    checkin:function(setup) {
      // default values
      var _this=this;
      return _this._promise(function(prom_resolve, prom_reject) {
        setup     = setup || {};
        if (setup.destination == undefined) throw "Error 'checkin': not able to find the file destination path.";
        setup.url = setup.url || _this.url;
        // if we didn't define the url in the parameters, then we need to find it
        if (!setup.url) {
          if (_this.hasPromise) {
            _this._getURL().then(function() {
              _this.checkin(setup).then(function(res) {
                prom_resolve(res);
              })
            });
          } else {
            _this._getURL();
            _this._addInQueue(arguments);
          }
          return;
        }
        if (_this.url == undefined) throw "Error 'checkin': not able to find the URL!"; // we cannot determine the url
        setup.url = _this.url;
        setup.comments = setup.comments || "";
        setup.success = setup.success || (function(){});
        setup.error = setup.error || (function(){});
        setup.after = setup.after || (function(){});

        var soapEnv = _this._buildBodyForSOAP("CheckInFile", '<pageUrl>'+setup.destination+'</pageUrl><comment>'+setup.comments+'</comment><CheckinType>1</CheckinType>');
        _this.ajax({
          url: setup.url + "/_vti_bin/Lists.asmx",
          type: "POST",
          dataType: "xml",
          data: soapEnv,
          beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/CheckInFile'); },
          contentType: "text/xml; charset=utf-8",
          success:function(data) {
            var res = data.getElementsByTagName('CheckInFileResult');
            if (res && res[0] && res[0].firstChild.nodeValue != "true") {
              setup.error.call(_this);
              prom_reject();
            } else {
              setup.success.call(_this);
              prom_resolve();
            }
            setup.after.call(_this);
          }
        });
      })
    },
    /**
      @name $SP().list.addAttachment
      @function
      @description Add an attachment to a Sharepoint List Item

      @param {Object} setup Options (see below)
        @param {Number} setup.ID The item ID to attach the file
        @param {String} setup.filename The name of the file
        @param {String} setup.attachment A byte array that contains the file to attach by using base-64 encoding
        @param {Function} [setup.after] A function that will be executed at the end of the request; with one parameter that is the URL to the attached file

      @example
      $SP().list("My List").addAttachment({
        ID:1,
        filename:"helloworld.txt",
        attachment:"U2hhcmVwb2ludFBsdXMgUm9ja3Mh",
        after:function(fileURL) {
          alert(fileURL)
        }
      });
    */
    addAttachment:function(setup) {
      // check if we need to queue it
      if (this.needQueue) { return this._addInQueue(arguments) }
      if (arguments.length===0) throw "Error 'addAttachment': the arguments are mandatory";
      if (this.listID===undefined) throw "Error 'addAttachment': you need to use list() to define the list name.";

      if (typeof setup.ID === "undefined") throw "Error 'addAttachment': the item ID is mandatory";
      if (typeof setup.filename === "undefined") throw "Error 'addAttachment': the filename is mandatory";
      if (typeof setup.attachment === "undefined") throw "Error 'addAttachment': the base64-encoded attachment is mandatory";
      setup.after = setup.after || function() {};
      var _this=this;
      var soapEnv = _this._buildBodyForSOAP("AddAttachment", "<listName>"+this.listID+"</listName><listItemID>"+setup.ID+"</listItemID><fileName>"+setup.filename+"</fileName><attachment>"+setup.attachment+"</attachment>");
      _this.ajax({
        url: _this.url + "/_vti_bin/Lists.asmx",
        type: "POST",
        dataType: "xml",
        data: soapEnv,
        beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/AddAttachment'); },
        contentType: "text/xml; charset=utf-8",
        success:function(data) {
          var res = data.getElementsByTagName('AddAttachmentResult');
          var fileURL = "";
          if (res && res[0]) fileURL = _this.getURL() + "/" + res[0].firstChild.nodeValue;
          setup.after.call(_this, fileURL);
        }
      });
    },
    /**
      @name $SP().list.getAttachment
      @function
      @description Get the attachment(s) for some items

      @param {String|Array} itemID The item IDs separated by a coma (ATTENTION: one request is done for each ID)
      @param {Function} [result] A function with the data from the request as first argument

      @example
      $SP().list("My List","http://my.site.com/mydir/").getAttachment([1,15,24],function(data) {
        for (var i=0; i&lt;data.length; i++) console.log(data[i]);
      });

      $SP().list("My List").getAttachment("98", function(data) {
        for (var i=0; i&lt;data.length; i++) console.log(data[i]);
      });

      // you can also use $SP().list().get() using the "Attachments" field
    */
    getAttachment:function(itemID, fct, passed) {
      // check if we need to queue it
      if (this.needQueue) { return this._addInQueue(arguments) }
      if (this.listID == undefined) throw "Error 'getAttachment': you have to define the list ID/Name";
      if (arguments.length === 1 && typeof itemID === "function") throw "Error 'getAttachment': you have to define the item ID";
      if (this.url == undefined) throw "Error 'getAttachment': not able to find the URL!"; // we cannot determine the url
      if (typeof itemID !== "object") itemID = itemID.split(",");
      passed = passed || [];

      var _this=this;

      // forge the parameters
      var body = _this._buildBodyForSOAP("GetAttachmentCollection", "<listName>"+this.listID+"</listName><listItemID>"+itemID.shift()+"</listItemID>");
      // do the request
      var url = this.url + "/_vti_bin/lists.asmx";
      var aReturn = [];
      _this.ajax({
        type: "POST",
        cache: false,
        async: true,
        url: url,
        data: body,
        contentType: "text/xml; charset=utf-8",
        beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/GetAttachmentCollection'); },
        dataType: "xml",
        success:function(data) {
          var a = data.getElementsByTagName('Attachment');
          for (var i=0; i < a.length; i++) aReturn.push(a[i].firstChild.nodeValue);
          if (aReturn.length===0) aReturn="";
          else if (aReturn.length===1) aReturn=aReturn[0]
          passed.push(aReturn);
          // if we don't have any more attachment to search for
          if (itemID.length===0) {
            if (typeof fct === "function") fct.call(_this,passed);
          } else {
            // we have more attachments to find
            _this.getAttachment(itemID,fct,passed)
          }
        }
      });
      return this;
    },
    /**
      @name $SP().list.getContentTypes
      @function
      @description Get the Content Types for the list (returns Name, ID and Description)

      @param {Object} [options]
        @param {Boolean} [options.cache=true] Do we want to use the cache on recall for this function?
      @param {Function} [function()] A function with the data from the request as first argument

      @example
      $SP().list("List Name").getContentTypes(function(contentTypes) {
        for (var i=0; i&lt;contentTypes.length; i++) console.log(contentTypes[i].Name, contentTypes[i].ID, contentTypes[i].Description);
      });
    */
    getContentTypes:function(options, fct) {
      // check if we need to queue it
      if (this.needQueue) { return this._addInQueue(arguments) }
      if (this.listID == undefined) throw "Error 'getContentTypes': you have to define the list ID";
      if (arguments.length === 1 && typeof options === "function") return this.getContentTypes(null, options);

      // default values
      if (this.url == undefined) throw "Error 'getContentTypes': not able to find the URL!"; // we cannot determine the url

      // check the Cache
      if (!options) options={cache:true};
      if (options.cache) {
        for (var i=0; i<_SP_CACHE_CONTENTTYPES.length; i++) {
          if (_SP_CACHE_CONTENTTYPES[i].list === this.listID && _SP_CACHE_CONTENTTYPES[i].url === this.url) {
            if (typeof fct === "function") fct.call(this,_SP_CACHE_CONTENTTYPES[i].contentTypes);
            return this;
          }
        }
      }

      var _this=this;
      // forge the parameters
      var body = _this._buildBodyForSOAP("GetListContentTypes", '<listName>'+_this.listID+'</listName>');
      // do the request
      var url = this.url + "/_vti_bin/lists.asmx";
      var aReturn = [];
      _this.ajax({
        type: "POST",
        cache: false,
        async: true,
        url: url,
        data: body,
        contentType: "text/xml; charset=utf-8",
        beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/GetListContentTypes'); },
        dataType: "xml",
        success:function(data) {
          var arr = data.getElementsByTagName('ContentType');
          var ID;
          for (var i=0; i < arr.length; i++) {
            ID = arr[i].getAttribute("ID");
            if (ID) {
              aReturn.push({
                "ID":ID,
                "Name":arr[i].getAttribute("Name"),
                "Description":arr[i].getAttribute("Description")
              });
            }
          }
          // we cache the result
          _SP_CACHE_CONTENTTYPES.push({"list":_this.listID, "url":_this.url, "contentTypes":aReturn});
          if (typeof fct === "function") fct.call(_this,aReturn);
        }
      });
      return this;
    },
    /**
      @name $SP().list.getContentTypeInfo
      @function
      @description Get the Content Type Info for a Content Type into the list

      @param {String} contentType The Name or the ID (from $SP().list.getContentTypes) of the Content Type
      @param {Object} [options]
        @param {Boolean} [options.cache=true] Do we use the cache?
      @param {Function} [function()] A function with the data from the request as first argument

      @example
      $SP().list("List Name").getContentTypeInfo("Item", function(fields) {
        for (var i=0; i&lt;fields.length; i++) console.log(fields[i]["DisplayName"]+ ": "+fields[i]["Description"]);
      });

      $SP().list("List Name").getContentTypeInfo("0x01009C5212B2D8FF564EBE4873A01C57D0F9001", function(fields) {
        for (var i=0; i&lt;fields.length; i++) console.log(fields[i]["DisplayName"]+ ": "+fields[i]["Description"]);
      });
    */
    getContentTypeInfo:function(contentType, options, fct) {
      // check if we need to queue it
      if (this.needQueue) { return this._addInQueue(arguments) }
      if (this.listID == undefined) throw "Error 'getContentTypeInfo': you have to define the list ID";
      if (arguments.length >= 1 && typeof contentType !== "string") throw "Error 'getContentTypeInfo': you have to provide the Content Type Name/ID";
      if (arguments.length === 2 && typeof options === "function") return this.getContentTypeInfo(contentType, null, options);
      // default values
      if (this.url == undefined) throw "Error 'getContentTypeInfo': not able to find the URL!"; // we cannot determine the url

      if (!options) options={cache:true}

      // look at the cache
      if (options.cache) {
        for (var i=0; i<_SP_CACHE_CONTENTTYPE.length; i++) {
          if (_SP_CACHE_CONTENTTYPE[i].list === this.listID && _SP_CACHE_CONTENTTYPE[i].url === this.url && _SP_CACHE_CONTENTTYPE[i].contentType === contentType) {
            if (typeof fct === "function") fct.call(this,_SP_CACHE_CONTENTTYPE[i].info);
            return this;
          }
        }
      }

      // do we have a Content Type Name or ID ?
      if (contentType.slice(0,2) !== "0x") {
        // it's a Name so get the related ID using $SP.list.getContentTypes
        this.getContentTypes(options, function(types) {
          var found=false;
          for (var i=types.length; i--;) {
            if (types[i]["Name"]===contentType) {
              this.getContentTypeInfo(types[i]["ID"], options, fct);
              found=true;
              break;
            }
          }
          if (!found) throw "Error 'getContentTypeInfo': not able to find the Content Type called '"+contentType+"' at "+this.url;
        });
        return this;
      }

      var _this=this;

      // forge the parameters
      var body = _this._buildBodyForSOAP("GetListContentType", '<listName>'+_this.listID+'</listName><contentTypeId>'+contentType+'</contentTypeId>');
      // do the request
      var url = this.url + "/_vti_bin/lists.asmx";
      var aReturn = [];
      _this.ajax({
        type: "POST",
        cache: false,
        async: true,
        url: url,
        data: body,
        contentType: "text/xml; charset=utf-8",
        beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/GetListContentType'); },
        dataType: "xml",
        success:function(data) {
          var arr = data.getElementsByTagName('Field');
          var index = 0, aIndex, attributes, attrName, lenDefault, attrValue, nodeDefault;
          for (var i=0; i < arr.length; i++) {
            if (arr[i].getAttribute("ID")) {
              aReturn[index] = [];
              aIndex=aReturn[index];
              attributes=arr[i].attributes;
              for (var j=attributes.length; j--;) {
                attrName=attributes[j].nodeName;
                attrValue=attributes[j].nodeValue;
                if (attrName==="Type") {
                  switch (attrValue) {
                    case "Choice":
                    case "MultiChoice": {
                      aIndex["FillInChoice"] = arr[i].getAttribute("FillInChoice");
                      var a=arr[i].getElementsByTagName("CHOICE");
                      var r=[];
                      for(var k=0; k<a.length; k++) r.push(a[k].firstChild.nodeValue);
                      aIndex["Choices"]=r;
                      break;
                    }
                    case "Lookup":
                    case "LookupMulti":
                      aIndex["Choices"]={list:arr[i].getAttribute("List"),field:arr[i].getAttribute("ShowField")};
                      break;
                    default:
                      aIndex["Choices"] = [];
                  }
                }
                aIndex[attrName]= attrValue;
              }
              // find the default values
              lenDefault=arr[i].getElementsByTagName("Default").length;
              if (lenDefault>0) {
                nodeDefault=arr[i].getElementsByTagName("Default");
                aReturn[index]["DefaultValue"]=[];
                for (var q=0; q<lenDefault; q++) nodeDefault[q].firstChild && aReturn[index]["DefaultValue"].push(nodeDefault[q].firstChild.nodeValue);
                if (lenDefault===1) aReturn[index]["DefaultValue"]=aReturn[index]["DefaultValue"][0];
              } else aReturn[index]["DefaultValue"]=null;
              index++;
            }
          }
          // we cache the result
          _SP_CACHE_CONTENTTYPE.push({"list":_this.listID, "url":_this.url, "contentType":contentType, "info":aReturn});
          if (typeof fct == "function") fct.call(_this,aReturn);
        }
      })
      return this;
    },
    /**
      @name $SP().list.info
      @function
      @description Get the information (StaticName, DisplayName, Description, Required ("TRUE", "FALSE", null), DefaultValue, Choices, etc...) - metadata - regarding the list for each column

      @param {Function} [function()] A function with the data from the request as first argument

      @example
      $SP().list("List Name").info(function(fields) {
        for (var i=0; i&lt;fields.length; i++) console.log(fields[i]["DisplayName"]+ ": "+fields[i]["Description"]);
      });

      $SP().list("My list","http://intranet.site.com/dept/").info(function(fields) {
        for (var i=0; i&lt;fields.length; i++) console.log(fields[i]["DisplayName"]+ ": "+fields[i]["Description"]);
      });
    */
    info:function(fct) {
      // check if we need to queue it
      if (this.needQueue) { return this._addInQueue(arguments) }
      if (this.listID == undefined) throw "Error 'info': you have to define the list ID";

      // default values
      if (this.url == undefined) throw "Error 'info': not able to find the URL!"; // we cannot determine the url

      var _this=this;

      // forge the parameters
      var body = _this._buildBodyForSOAP("GetList", '<listName>'+_this.listID+'</listName>');
      // do the request
      var url = this.url + "/_vti_bin/lists.asmx";
      var aReturn = [];
      _this.ajax({
        type: "POST",
        cache: false,
        async: true,
        url: url,
        data: body,
        contentType: "text/xml; charset=utf-8",
        beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/GetList'); },
        dataType: "xml",
        success:function(data) {
          var arr = data.getElementsByTagName('Field');
          var index = 0, aIndex, attributes, attrName, attrValue, lenDefault, nodeDefault;
          for (var i=0; i < arr.length; i++) {
            if (arr[i].getAttribute("ID")) {
              aReturn[index] = [];
              aIndex=aReturn[index];
              attributes=arr[i].attributes;
              for (var j=attributes.length; j--;) {
                attrName=attributes[j].nodeName;
                attrValue=attributes[j].nodeValue;
                if (attrName==="Type") {
                  switch (attrValue) {
                    case "Choice":
                    case "MultiChoice": {
                      aIndex["FillInChoice"] = arr[i].getAttribute("FillInChoice");
                      var a=arr[i].getElementsByTagName("CHOICE");
                      var r=[];
                      for(var k=0; k<a.length; k++) r.push(a[k].firstChild.nodeValue);
                      aIndex["Choices"]=r;
                      break;
                    }
                    case "Lookup":
                    case "LookupMulti":
                      aIndex["Choices"]={list:arr[i].getAttribute("List"),field:arr[i].getAttribute("ShowField")};
                      break;
                    default:
                      aIndex["Choices"] = [];
                  }
                }
                aIndex[attrName]= attrValue;
              }

              // find the default values
              lenDefault=arr[i].getElementsByTagName("Default").length;
              if (lenDefault>0) {
                nodeDefault=arr[i].getElementsByTagName("Default");
                aReturn[index]["DefaultValue"]=[];
                for (var q=0; q<lenDefault; q++) nodeDefault[q].firstChild && aReturn[index]["DefaultValue"].push(nodeDefault[q].firstChild.nodeValue);
                if (lenDefault===1) aReturn[index]["DefaultValue"]=aReturn[index]["DefaultValue"][0];
              } else aReturn[index]["DefaultValue"]=null;

              index++;
            }
          }

          if (typeof fct == "function") fct.call(_this,aReturn);
        }
      });
      return this;
    },
    /**
      @name $SP().list.view
      @function
      @description Get the info (fields, orderby, whereCAML) for a View

      @param {String} [viewID="The default view"] The view ID or view Name
      @param {Function} [function()] A function with the data from the request as first argument and the viewID as second parameter

      @example
      $SP().list("List Name").view("All Items",function(data,viewID) {
        for (var i=0; i&lt;data.fields.length; i++) console.log("Column "+i+": "+data.fields[i]);
        console.log("And the GUI for this view is :"+viewID);
      });

      $SP().list("My List","http://my.sharepoint.com/my/site").view("My Beautiful View",function(data,viewID) {
        for (var i=0; i&lt;data.fields.length; i++) console.log("Column "+i+": "+data.fields[i]);
      });
    */
    view:function(viewID, fct) {
      // check if we need to queue it
      if (this.needQueue) { return this._addInQueue(arguments) }
      if (this.listID == undefined) throw "Error 'view': you have to define the list ID/Name";
      if (arguments.length === 1 && typeof viewID === "function") return this.view("", viewID);

      // default values
      var list = this.listID;
      if (this.url == undefined) throw "Error 'view': not able to find the URL!"; // we cannot determine the url
      viewID = viewID || "";
      var viewName = arguments[2] || viewID;

      viewName=viewName.toLowerCase();
      // check if we didn't save this information before
      for (var i=_SP_CACHE_SAVEDVIEW.length; i--;) {
        if (_SP_CACHE_SAVEDVIEW[i].url===this.url && _SP_CACHE_SAVEDVIEW[i].list===list && (_SP_CACHE_SAVEDVIEW[i].viewID===viewID || _SP_CACHE_SAVEDVIEW[i].viewName===viewName)) { fct.call(this,_SP_CACHE_SAVEDVIEW[i].data,viewID); return this }
      }

      // if viewID is not an ID but a name then we need to find the related ID
      if (viewID.charAt(0) !== '{') {
        this.views(function(views) {
          var found=false;
          for (var i=views.length; i--;) {
            if (views[i]["Name"]===viewID) {
              this.view(views[i]["ID"],fct,viewID);
              found=true;
              break;
            }
          }
          if (!found) throw "Error 'view': not able to find the view called '"+viewID+"' at "+this.url;
        });
        return this;
      }

      var _this=this;

      // forge the parameters
      var body = _this._buildBodyForSOAP("GetView", '<listName>'+_this.listID+'</listName><viewName>'+viewID+'</viewName>');
      // do the request
      var url = this.url + "/_vti_bin/Views.asmx";
      var aReturn = ["fields","orderby","whereCAML"];
      _this.ajax({
        type: "POST",
        cache: false,
        async: true,
        url: url,
        data: body,
        contentType: "text/xml; charset=utf-8",
        beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/GetView'); },
        dataType: "xml",
        success:function(data) {
          aReturn.fields=[]
          var arr = data.getElementsByTagName('ViewFields')[0].getElementsByTagName('FieldRef');
          for (var i=0; i < arr.length; i++) aReturn.fields.push(arr[i].getAttribute("Name"));

          aReturn.orderby="";
          arr = data.getElementsByTagName('OrderBy');
          if (arr.length) {
            var orderby=[];
            arr = arr[0].getElementsByTagName('FieldRef');
            for (i=0; i<arr.length; i++) orderby.push(arr[i].getAttribute("Name")+" "+(arr[i].getAttribute("Ascending")==undefined?"ASC":"DESC"));
            aReturn.orderby=orderby.join(",");
          }

          aReturn.whereCAML="";
          var where=data.getElementsByTagName('Where');
          if (where.length) {
            where=where[0].xml || (new XMLSerializer()).serializeToString(where[0]);
            where=where.match(/<Where [^>]+>(.*)<\/Where>/);
            if(where.length==2) aReturn.whereCAML=where[1];
          }

          // cache the data
          _SP_CACHE_SAVEDVIEW.push({url:_this.url,list:list,data:aReturn,viewID:viewID,viewName:viewName});

          if (typeof fct == "function") fct.call(_this,aReturn,viewID);
        }
      });
      return this;
    },
    /**
      @name $SP().list.views
      @function
      @description Get the views info (ID, Name, Url, Node) for a List

      @param {Hash} [options]
        @param {Boolean} [cache=true] By default the result will be cached for a later use in the page
      @param {Function} [function()] A function with the data from the request as first argument

      @example
      $SP().list("My List").views(function(view) {
        for (var i=0; i&lt;view.length; i++) {
          console.log("View #"+i+": "+view[i]['Name']);
          // if you want to access to another property, like "Type"
          console.log("Type: "+view[i]["Node"].getAttribute("Type"));
        }
      });

    */
    views:function(options, fct) {
      if (typeof options === "function") return this.views({}, options);
      options.cache = (options.cache === false ? false : true);
      // check if we need to queue it
      if (this.needQueue) { return this._addInQueue(arguments) }
      if (this.listID == undefined) throw "Error 'views': you have to define the list ID";

      // default values
      if (this.url == undefined) throw "Error 'views': not able to find the URL!"; // we cannot determine the url
      fct = fct || function(){};

      // check if we didn't save this information before
      if (options.cache) {
        for (var i=_SP_CACHE_SAVEDVIEWS.length; i--;) {
          if (_SP_CACHE_SAVEDVIEWS[i].url==this.url && _SP_CACHE_SAVEDVIEWS[i].listID === this.listID) { fct.call(this,_SP_CACHE_SAVEDVIEWS[i].data); return this }
        }
      }

      var _this=this;

      // forge the parameters
      var body = _this._buildBodyForSOAP("GetViewCollection", '<listName>'+_this.listID+'</listName>');
      // do the request
      var url = _this.url + "/_vti_bin/Views.asmx";
      var aReturn = [];
      _this.ajax({
        type: "POST",
        cache: false,
        async: true,
        url: url,
        data: body,
        contentType: "text/xml; charset=utf-8",
        beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/GetViewCollection'); },
        dataType: "xml",
        success:function(data) {
          var arr = data.getElementsByTagName('View');
          for (var i=0; i < arr.length; i++) {
            aReturn[i] = [];
            aReturn[i]["ID"] = arr[i].getAttribute("Name");
            aReturn[i]["Name"] = arr[i].getAttribute("DisplayName");
            aReturn[i]["Url"] = arr[i].getAttribute("Url");
            aReturn[i]["Node"] = arr[i]
          }

          // save the data into the DOM for later usage
          if (options.cache === true) {
            _SP_CACHE_SAVEDVIEWS.push({url:_this.url,listID:_this.listID,data:aReturn});
          }
          fct.call(_this,aReturn);
        }
      });
      return this;
    },
    /**
      @name $SP().lists
      @function
      @description Get the lists from the site (for each list we'll have "ID", "Name", "Description", "Url")

      @param {Object} [setup] Options (see below)
        @param {String} [setup.url='current website'] The website url
      @param {Function} [function()] A function with the data from the request as first argument

      @example
      $SP().lists(function(list) {
        for (var i=0; i&lt;list.length; i++) console.log("List #"+i+": "+list[i]['Name']);
      });
    */
    lists:function(setup, fct) {
      if (arguments.length===1 && typeof setup === "function") return this.lists({}, setup);

      // default values
      setup = setup || {};
      setup.url = setup.url || this.url;
      // if we didn't define the url in the parameters, then we need to find it
      if (!setup.url) {
        this._getURL();
        return this._addInQueue(arguments);
      } else this.url=setup.url
      if (this.url == undefined) throw "Error 'lists': not able to find the URL!"; // we cannot determine the url

      var _this=this;

      // forge the parameters
      var body = _this._buildBodyForSOAP("GetListCollection", "");
      // check if we didn't save this information before
      var savedLists = _SP_CACHE_SAVEDLISTS;
      if (savedLists!=undefined) {
        for (var i=savedLists.length; i--;) {
          if (savedLists[i].url==this.url) {
            if (typeof fct == "function") fct(savedLists[i].data);
            else {
              this.data = savedLists[i].data;
              this.length = this.data.length;
            }
            return this;
          }
        }
      } else savedLists=[];

      // do the request
      var url = _this.url + "/_vti_bin/lists.asmx";
      var aReturn = [];
      _this.ajax({
        type:"POST",
        cache:false,
        async:true,
        url:url,
        data:body,
        contentType:"text/xml; charset=utf-8",
        beforeSend:function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/GetListCollection'); },
        dataType:"xml",
        success:function(data) {
          var arr = data.getElementsByTagName('List');
          for (var i=0; i < arr.length; i++) {
            aReturn[i] = [];
            aReturn[i]["ID"] = arr[i].getAttribute("ID");
            aReturn[i]["Name"] = arr[i].getAttribute("Title");
            aReturn[i]["Url"] = arr[i].getAttribute("DefaultViewUrl");
            aReturn[i]["Description"] = arr[i].getAttribute("Description");
          }

          // save the data into the DOM for later usage
          savedLists.push({url:_this.url,data:aReturn});
          _SP_CACHE_SAVEDLISTS = savedLists;
          if (typeof fct == "function") fct.call(_this,aReturn);
        }
      });
      return this;
    },
    /**
      @name $SP().list.add
      @function
      @description Add items into a Sharepoint List
                   note: A Date must be provided as "YYYY-MM-DD" (only date comparison) or "YYYY-MM-DD hh:mm:ss" (date AND time comparison), or you can use $SP().toSPDate(new Date())
                   note: A person must be provided as "-1;#email" (e.g. "-1;#foo@bar.com") OR NT login with double \ (eg "-1;#europe\\foo_bar") OR the user ID
                   note SP2013: If "-1;#" doesn't work on Sharepoint 2013, then try with "i:0#.w|" (e.g. "i:0#.w|europe\\foo_bar") ("i:0#.w|" may vary based on your authentification system -- see https://social.technet.microsoft.com/wiki/contents/articles/13921.sharepoint-20102013-claims-encoding.aspx)
                   note: A lookup value must be provided as "X;#value", with X the ID of the value from the lookup list.
                         --> it should also be possible to not pass the value but only the ID, e.g.: "X;#"
                   note: A URL field must be provided as "http://www.website.com, Name"
                   note: A multiple selection must be provided as ";#choice 1;#choice 2;#", or just pass an array as the value and it will do the trick
                   note: A multiple selection of Lookup must be provided as ";#X;#Choice 1;#Y;#Choice 2;#" (with X the ID for "Choice 1", and "Y" for "Choice 2")
                         --> it should also be possible to not pass the values but only the ID, e.g.: ";#X;#;#Y;#;#"
                   note: A Yes/No checkbox must be provided as "1" (for TRUE) or "0" (for "False")
                   note: You cannot change the Approval Status when adding, you need to use the $SP().moderate function

      @param {Object|Array} items List of items (e.g. [{Field_x0020_Name: "Value", OtherField: "new value"}, {Field_x0020_Name: "Value2", OtherField: "new value2"}])
      @param {Object} [options] Options (see below)
        @param {Number} [options.packetsize=15] If you have too many items to add, then we use `packetsize` to cut them into several requests (because Sharepoint cannot handle too many items at once)
        @param {Function} [options.progress] (current,max) If you provide more than 15 items then they will be treated by packets and you can use "progress" to know more about the steps
        @param {Function} [options.success] A function with the items added sucessfully
        @param {Function} [options.error] A function with the items not added
        @param {Function} [options.after] A function that will be executed at the end of the request; with two parameters (passedItems, failedItems)
        @param {Boolean} [options.escapeChar=true] Determines if we want to escape the special chars that will cause an error (for example '&' will be automatically converted to '&amp;amp;')
      @return {Promise} Trigger on 'resolve' when it's completed with an array of 'passed' ([0]) and 'failed' ([1]), no trigger on 'reject'

      @example
      $SP().list("My List").add({Title:"Ok"});

      $SP().list("List Name").add([{Title:"Ok"}, {Title:"Good"}], {after:function() { alert("Done!"); });

      $SP().list("My List","http://my.sharepoi.nt/dir/").add({Title:"Ok"}, {error:function(items) {
        for (var i=0; i &lt; items.length; i++) console.log("Error '"+items[i].errorMessage+"' with:"+items[i].Title); // the 'errorMessage' attribute is added to the object
      }, success:function(items) {
        for (var i=0; i &lt; items.length; i++) console.log("Success for:"+items[i].Title+" (ID:"+items[i].ID+")");
      }});

      // different ways to add John and Tom into the table
      $SP().list("List Name").add({Title:"John is the Tom's Manager",Manager:"-1;#john@compagny.com",Report:"-1;#tom@compagny.com"}); // if you don't know the ID
      $SP().list("My List").add({Title:"John is the Tom's Manager",Manager:"157",Report:"874"}); // if you know the Lookup ID

      // with Promise
      $SP().list("My List").add({Title:"Promise Example"}).then(function(res) {
        // passed = res[0]
        // failed = res[1]
      })
    */
    add:function(items, options) {
      var _this=this;
      return _this._promise(function(prom_resolve, prom_reject) {
        // check if we need to queue it
        if (_this.needQueue) { return _this._addInQueue(arguments) }
        if (arguments.length===0 || (arguments.length===1 && typeof items !== "object"))
          throw "Error 'add': you need to define the list of items";
        if (_this.listID===undefined) throw "Error 'add': you need to use list() to define the list name.";

        // default values
        var setup={};
        SPExtend(true, setup, options);
        if (_this.url == undefined) throw "Error 'add': not able to find the URL!"; // we cannot determine the url
        // deal with Promise/callbacks
        if (setup.useCallback !== false && (typeof setup.after === "function" || !prom_resolve)) { // if we ask for a callback, or if no Promise, no callback, no jQuery
          setup.useCallback = true;
        } else {
          setup.useCallback = false;
        }
        setup.success = setup.success || (function() {});
        setup.error   = setup.error || (function() {});
        setup.after   = setup.after || (function() {});
        setup.escapeChar = (setup.escapeChar == undefined) ? true : setup.escapeChar;
        setup.progress= setup.progress || (function() {});
        setup.packetsize=setup.packetsize||15;

        if (typeof items === "object" && items.length==undefined) items = [ items ];
        var itemsLength=items.length;

        // define current and max for the progress
        setup.progressVar = setup.progressVar || {current:0,max:itemsLength,passed:[],failed:[],eventID:"spAdd"+(""+Math.random()).slice(2)};
        // we cannot add more than 15 items in the same time, so split by 15 elements
        // and also to avoid surcharging the server
        if (itemsLength > setup.packetsize) {
          var nextPacket=items.slice(0);
          var cutted=nextPacket.splice(0,setup.packetsize);
          _SP_ADD_PROGRESSVAR[setup.progressVar.eventID] = function(setup) {
            return _this.add(nextPacket,setup);
          };
          items = cutted;
          itemsLength = items.length;
        } else if (itemsLength == 0) {
          setup.progress(1,1);
          setup.error([]);
          setup.success([]);
          if (setup.useCallback) setup.after([], []);
          else prom_resolve([[], []])
          return;
        }

        // increment the progress
        setup.progressVar.current += itemsLength;

        // build a part of the request
        var updates = '<Batch OnError="Continue" ListVersion="1"  ViewName="">';
        var itemKey, itemValue, it;
        for (var i=0; i < items.length; i++) {
          updates += '<Method ID="'+(i+1)+'" Cmd="New">';
          updates += '<Field Name=\'ID\'>New</Field>';
          for (it in items[i]) {
            if (items[i].hasOwnProperty(it)) {
              itemKey = it;
              itemValue = items[i][it];
              if (SPIsArray(itemValue)) itemValue = ";#" + itemValue.join(";#") + ";#"; // an array should be seperate by ";#"
              if (setup.escapeChar && typeof itemValue === "string") itemValue = _this._cleanString(itemValue); // replace & (and not &amp;) by "&amp;" to avoid some issues
              updates += "<Field Name='"+itemKey+"'>"+itemValue+"</Field>";
            }
          }
          updates += '</Method>';
        }
        updates += '</Batch>';

        // build the request
        var body = _this._buildBodyForSOAP("UpdateListItems", "<listName>"+_this.listID+"</listName><updates>" + updates + "</updates>");
        // send the request
        var url = _this.url + "/_vti_bin/lists.asmx";
        _this.ajax({
          type:"POST",
          cache:false,
          async:true,
          url:url,
          data:body,
          beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/UpdateListItems'); },
          contentType:"text/xml; charset=utf-8",
          dataType:"xml",
          success:function(data) {
            var result = data.getElementsByTagName('Result');
            var len=result.length;
            var passed = setup.progressVar.passed, failed = setup.progressVar.failed;
            for (var i=0; i < len; i++) {
              if (result[i].getElementsByTagName('ErrorCode')[0].firstChild.nodeValue == "0x00000000") { // success
                var rows=result[i].getElementsByTagName('z:row');
                if (rows.length==0) rows=result[i].getElementsByTagName('row'); // for Chrome 'bug'
                if (items[i]) {
                  items[i].ID = rows[0].getAttribute("ows_ID");
                  passed.push(items[i]);
                }
              } else if (items[i]) {
                items[i].errorMessage = result[i].getElementsByTagName('ErrorText')[0].firstChild.nodeValue;
                failed.push(items[i]);
              }
            }

            setup.progress(setup.progressVar.current,setup.progressVar.max);
            // check if we have some other packets that are waiting to be treated
            if (setup.progressVar.current < setup.progressVar.max) {
              if (_SP_ADD_PROGRESSVAR[setup.progressVar.eventID]) {
                if (setup.useCallback) _SP_ADD_PROGRESSVAR[setup.progressVar.eventID](setup);
                else _SP_ADD_PROGRESSVAR[setup.progressVar.eventID](setup).then(function(res) { prom_resolve(res) })
              }
            } else {
              if (failed.length>0) setup.error.call(_this,failed);
              if (passed.length>0) setup.success.call(_this,passed);
              if (setup.useCallback) setup.after.call(_this, passed, failed);
              else prom_resolve([passed, failed]);
              if (_SP_ADD_PROGRESSVAR[setup.progressVar.eventID]) delete _SP_ADD_PROGRESSVAR[setup.progressVar.eventID];
            }
          }
        });
      })
    },
    /**
      @name $SP().list.update
      @function
      @description Update items from a Sharepoint List

      @param {Array} items List of items (e.g. [{ID: 1, Field_x0020_Name: "Value", OtherField: "new value"}, {ID:22, Field_x0020_Name: "Value2", OtherField: "new value2"}])
      @param {Object} [options] Options (see below)
        @param {String} [options.where=""] You can define a WHERE clause
        @param {Number} [options.packetsize=15] If you have too many items to update, then we use `packetsize` to cut them into several requests (because Sharepoint cannot handle too many items at once)
        @param {Function} [options.progress] Two parameters: 'current' and 'max' -- if you provide more than 15 ID then they will be treated by packets and you can use "progress" to know more about the steps
        @param {Function} [options.success] One parameter: 'passedItems' -- a function with the items updated sucessfully
        @param {Function} [options.error] One parameter: 'failedItems' -- a function with the items not updated
        @param {Function} [options.after] A function that will be executed at the end of the request; with two parameters (passedItems, failedItems)
        @param {Boolean} [options.escapeChar=true] Determines if we want to escape the special chars that will cause an error (for example '&' will be automatically converted to '&amp;')
      @return {Promise} Trigger on 'resolve' when it's completed with an array of 'passed' ([0]) and 'failed' ([1]), no trigger on 'reject'

      @example
      $SP().list("My List").update({ID:1, Title:"Ok"}); // you must always provide the ID
      $SP().list("List Name").update({Title:"Ok"},{where:"Status = 'Complete'"}); // if you use the WHERE then you must not provide the item ID

      $SP().list("My List","http://sharepoint.org/mydir/").update([{ID:5, Title:"Ok"}, {ID: 15, Title:"Good"}]);

      $SP().list("List Name").update({ID:43, Title:"Ok"}, {error:function(items) {
        for (var i=0; i &lt; items.length; i++) console.log("Error '"+items[i].errorMessage+"' with:"+items[i].Title);
      }});

      // with Promise
      $SP().list("My List").update({ID:42, Title:"Promise Example"}).then(function(res) {
        // passed = res[0]
        // failed = res[1]
      })
    */
    update:function(items, options) {
      var _this=this;
      return _this._promise(function(prom_resolve, prom_reject) {
        // check if we need to queue it
        if (_this.needQueue) { return _this._addInQueue(arguments) }
        if (_this.listID===undefined) throw "Error 'update': you need to use list() to define the list name.";

        // default values
        var setup={};
        SPExtend(true, setup, options);
        if (_this.url == undefined) throw "Error 'update': not able to find the URL!"; // we cannot determine the url
        // deal with Promise/callbacks
        if (setup.useCallback !== false && (typeof setup.after === "function" || !prom_resolve)) { // if we ask for a callback, or if no Promise, no callback, no jQuery
          setup.useCallback = true;
        } else {
          setup.useCallback = false;
        }
        setup.where   = setup.where || "";
        setup.success = setup.success || (function() {});
        setup.error   = setup.error || (function() {});
        setup.after   = setup.after || (function() {});
        setup.escapeChar = (setup.escapeChar == undefined) ? true : setup.escapeChar;
        setup.progress= setup.progress || (function() {});
        setup.packetsize=setup.packetsize||15;

        if (typeof items === "object" && items.length==undefined) items = [ items ];
        var itemsLength=items.length;

        // if there is a WHERE clause
        if (itemsLength == 1 && setup.where) {
          // call GET first
          delete items[0].ID;
          _this.get({fields:"ID",where:setup.where},function(data) {
            // we need a function to clone the items
            var clone = function(obj){
              var newObj = {};
              for (var k in obj) newObj[k]=obj[k];
              return newObj;
            };
            var aItems=[];
            for (var i=data.length;i--;) {
              var it=clone(items[0]);
              it.ID=data[i].getAttribute("ID");
              aItems.push(it);
            }
            delete setup.where;
            // now call again the UPDATE
            if (setup.useCallback) _this.update(aItems,setup)
            else _this.update(aItems,setup).then(function(res) { prom_resolve(res) });
          });
          return
        }

        // define current and max for the progress
        setup.progressVar = setup.progressVar || {current:0,max:itemsLength,passed:[],failed:[],eventID:"spUpdate"+(""+Math.random()).slice(2)};
        // we cannot add more than 15 items in the same time, so split by 15 elements
        // and also to avoid surcharging the server
        if (itemsLength > setup.packetsize) {
          var nextPacket=items.slice(0);
          var cutted=nextPacket.splice(0,setup.packetsize);
          _SP_UPDATE_PROGRESSVAR[setup.progressVar.eventID] = function(setup) {
            return _this.update(nextPacket,setup);
          };
          items = cutted;
          itemsLength = items.length;
        } else if (itemsLength == 0) {
          setup.progress(1,1);
          setup.error([]);
          setup.success([]);
          if (setup.useCallback) setup.after([], []);
          else prom_resolve([[], []]);
          return;
        }

        // increment the progress
        setup.progressVar.current += itemsLength;

        // build a part of the request
        var updates = '<Batch OnError="Continue" ListVersion="1"  ViewName="">';
        var itemKey, itemValue, it;
        for (var i=0; i < itemsLength; i++) {
          updates += '<Method ID="'+(i+1)+'" Cmd="Update">';
          if (items[i].ID == undefined) throw "Error 'update': you have to provide the item ID called 'ID'";
          for (it in items[i]) {
            if (items[i].hasOwnProperty(it)) {
              itemKey = it;
              itemValue = items[i][it];
              if (SPIsArray(itemValue)) itemValue = ";#" + itemValue.join(";#") + ";#"; // an array should be seperate by ";#"
              if (setup.escapeChar && typeof itemValue === "string") itemValue = _this._cleanString(itemValue); // replace & (and not &amp;) by "&amp;" to avoid some issues
              updates += "<Field Name='"+itemKey+"'>"+itemValue+"</Field>";
            }
          }
          updates += '</Method>';
        }
        updates += '</Batch>';

        // build the request
        var body = _this._buildBodyForSOAP("UpdateListItems", "<listName>"+_this.listID+"</listName><updates>" + updates + "</updates>");
        // send the request
        var url = _this.url + "/_vti_bin/lists.asmx";
        _this.ajax({
          type:"POST",
          cache:false,
          async:true,
          url:url,
          data:body,
          beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/UpdateListItems'); },
          contentType: "text/xml; charset=utf-8",
          dataType: "xml",
          success:function(data) {
            var result = data.getElementsByTagName('Result');
            var len=result.length;
            var passed = setup.progressVar.passed, failed = setup.progressVar.failed;
            for (var i=0; i < len; i++) {
              if (result[i].getElementsByTagName('ErrorCode')[0].firstChild.nodeValue == "0x00000000" && items[i]) // success
                passed.push(items[i]);
              else if (items[i]) {
                items[i].errorMessage = result[i].getElementsByTagName('ErrorText')[0].firstChild.nodeValue;
                failed.push(items[i]);
              }
            }

            setup.progress(setup.progressVar.current,setup.progressVar.max);
            // check if we have some other packets that are waiting to be treated
            if (setup.progressVar.current < setup.progressVar.max) {
              if (_SP_UPDATE_PROGRESSVAR[setup.progressVar.eventID]) {
                if (setup.useCallback) _SP_UPDATE_PROGRESSVAR[setup.progressVar.eventID](setup);
                else _SP_UPDATE_PROGRESSVAR[setup.progressVar.eventID](setup).then(function(res) { prom_resolve(res) })
              }
            }
            else {
              if (failed.length>0) setup.error.call(_this,failed);
              if (passed.length>0) setup.success.call(_this,passed);
              if (setup.useCallback) setup.after.call(_this, passed, failed);
              else prom_resolve([passed, failed]);
              if (_SP_UPDATE_PROGRESSVAR[setup.progressVar.eventID]) delete _SP_UPDATE_PROGRESSVAR[setup.progressVar.eventID];
            }
          }
        });
      })
    },
    /**
      @name $SP().list.history
      @function
      @description When versioning is an active option for your list, then you can use this function to find the previous values for a field

      @param {Object} params See below
        @param {String|Number} params.ID The item ID
        @param {String} params.Name The field name
      @param {Function} returnFct This function will have one parameter that is the data returned

      @example
      $SP().list("My List").history({ID:1981, Name:"Critical_x0020_Comments"}, function(data) {
        for (var i=0,len=data.length; i&lt;len; i++) {
          console.log("Date: "+data[i].getAttribute("Modified")); // you can use $SP().toDate() to convert it to a JavaScript Date object
          console.log("Editor: "+data[i].getAttribute("Editor")); // it's the long format type, so the result looks like that "328;#Doe,, John,#DOMAIN\john_doe,#John_Doe@example.com,#,#Doe,, John"
          console.log("Content: "+data[i].getAttribute("Critical_x0020_Comments")); // use the field name here
        }
      });
    */
    history:function(params, returnFct) {
      var _this=this;
      // check if we need to queue it
      if (_this.needQueue) { return _this._addInQueue(arguments) }
      if (_this.listID===undefined) throw "Error 'history': you need to use list() to define the list name.";
      if (arguments.length !== 2) throw "Error 'history': you need to provide two parameters.";
      if (typeof params !== "object") throw "Error 'history': the first parameter must be an object.";
      else {
        if (params.ID === undefined || params.Name === undefined) throw "Error 'history': the first parameter must be an object with ID and Name.";
      }
      if (typeof returnFct !== "function") throw "Error 'history': the second parameter must be a function.";


      // build the request
      var body = _this._buildBodyForSOAP("GetVersionCollection", "<strlistID>"+_this.listID+"</strlistID><strlistItemID>"+params.ID+"</strlistItemID><strFieldName>"+params.Name+"</strFieldName>")
      // send the request
      var url = _this.url + "/_vti_bin/lists.asmx";
      _this.ajax({
        type:"POST",
        cache:false,
        async:true,
        url:url,
        data:body,
        beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/GetVersionCollection'); },
        contentType: "text/xml; charset=utf-8",
        dataType: "xml",
        success:function(data) {
          returnFct.call(_this, data.getElementsByTagName('Version'))
        }
      });
      return _this;
    },
    /**
      @name $SP().list.moderate
      @function
      @description Moderate items from a Sharepoint List

      @param {Array} approval List of items and ApprovalStatus (e.g. [{ID:1, ApprovalStatus:"Approved"}, {ID:22, ApprovalStatus:"Pending"}])
      @param {Object} [setup] Options (see below)
        @param {Function} [setup.success] A function with the items updated sucessfully
        @param {Function} [setup.error] A function with the items not updated
        @param {Function} [setup.after] A function that will be executed at the end of the request; with two parameters (passedItems, failedItems)
        @param {Function} [setup.progress] Two parameters: 'current' and 'max' -- if you provide more than 15 ID then they will be treated by packets and you can use "progress" to know more about the steps

      @example
      $SP().list("My List").moderate({ID:1, ApprovalStatus:"Rejected"}); // you must always provide the ID

      $SP().list("List Name").moderate([{ID:5, ApprovalStatus:"Pending"}, {ID: 15, ApprovalStatus:"Approved"}]);

      $SP().list("Other List").moderate({ID:43, ApprovalStatus:"Approved"}, {
        error:function(items) {
          for (var i=0; i &lt; items.length; i++) console.log("Error with:"+items[i].ID);
        },
        success:function(items) {
          for (var i=0; i &lt; items.length; i++) console.log("Success with:"+items[i].getAttribute("Title"));
        }
      });
    */
    moderate:function(items, setup) {
      // check if we need to queue it
      if (this.needQueue) { return this._addInQueue(arguments) }
      if (arguments.length===0 || (arguments.length===1 && typeof items === "object" && items.length === undefined))
        throw "Error 'moderate': you need to define the list of items";
      if (this.listID===undefined) throw "Error 'moderate': you need to use list() to define the list name.";

      // default values
      setup         = setup || {};
      if (this.url == undefined) throw "Error 'moderate': not able to find the URL!"; // we cannot determine the url
      setup.async   = (setup.async == undefined) ? true : setup.async;
      setup.success = setup.success || (function() {});
      setup.error   = setup.error || (function() {});
      setup.after   = setup.after || (function() {});
      setup.progress= setup.progress || (function() {});

      if (typeof items === "object" && items.length==undefined) items = [ items ];
      var itemsLength=items.length;

      // define current and max for the progress
      setup.progressVar = setup.progressVar || {current:0,max:itemsLength,passed:[],failed:[],eventID:"spModerate"+(""+Math.random()).slice(2)};
      var _this=this;

      // we cannot add more than 15 items in the same time, so split by 15 elements
      // and also to avoid surcharging the server
      if (itemsLength > 15) {
        var nextPacket=items.slice(0);
        var cutted=nextPacket.splice(0,15);
        _SP_MODERATE_PROGRESSVAR[setup.progressVar.eventID] = function(setup) {
          _this.moderate(nextPacket,setup);
        };
        this.moderate(cutted,setup);
        return this;
      } else if (itemsLength == 0) {
        setup.progress(1,1);
        setup.success([]);
        setup.error([]);
        setup.after([], []);
        return this;
      }

      // increment the progress
      setup.progressVar.current += itemsLength;

      // build a part of the request
      var updates = '<Batch OnError="Continue" ListVersion="1"  ViewName="">';
      var itemKey, itemValue, it;
      for (var i=0; i < itemsLength; i++) {
        updates += '<Method ID="'+(i+1)+'" Cmd="Moderate">';
        if (items[i].ID == undefined) throw "Error 'moderate': you have to provide the item ID called 'ID'";
        else if (items[i].ApprovalStatus == undefined) throw "Error 'moderate': you have to provide the approval status 'ApprovalStatus' (Approved, Rejected, Pending, Draft or Scheduled)";
        for (it in items[i]) {
          if (items[i].hasOwnProperty(it)) {
            itemKey = it;
            itemValue = items[i][it];
            if (itemKey == "ApprovalStatus") {
              itemKey = "_ModerationStatus";
              switch (itemValue.toLowerCase()) {
                case "approve":
                case "approved":  itemValue=0; break;
                case "reject":
                case "deny":
                case "denied":
                case "rejected":  itemValue=1; break;
                case "pending":   itemValue=2; break;
                case "draft":     itemValue=3; break;
                case "scheduled": itemValue=4; break;
                default:          itemValue=2; break;
              }
            }
          }
          updates += "<Field Name='"+itemKey+"'>"+itemValue+"</Field>";
        }
        updates += '</Method>';
      }
      updates += '</Batch>';

      // build the request
      var body = _this._buildBodyForSOAP("UpdateListItems", "<listName>"+_this.listID+"</listName><updates>" + updates + "</updates>");
      // send the request
      var url = _this.url + "/_vti_bin/lists.asmx";
      _this.ajax({
        type:"POST",
        cache:false,
        async:true,
        url:url,
        data:body,
        beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/UpdateListItems'); },
        contentType: "text/xml; charset=utf-8",
        dataType: "xml",
        success:function(data) {
          var result = data.getElementsByTagName('Result');
          var len=result.length;
          var passed = setup.progressVar.passed, failed = setup.progressVar.failed;
          var rows;
          for (var i=0; i < len; i++) {
            rows=result[i].getElementsByTagName('z:row');
            if (rows.length==0) rows=data.getElementsByTagName('row'); // for Chrome
            var item = myElem(rows[0]);
            if (result[i].getElementsByTagName('ErrorCode')[0].firstChild.nodeValue == "0x00000000") // success
              passed.push(item);
            else {
              items[i].errorMessage = result[i].getElementsByTagName('ErrorText')[0].firstChild.nodeValue;
              failed.push(items[i]);
            }
          }

          setup.progress(setup.progressVar.current,setup.progressVar.max);
          // check if we have some other packets that are waiting to be treated
          if (setup.progressVar.current < setup.progressVar.max) {
            if (_SP_MODERATE_PROGRESSVAR[setup.progressVar.eventID]) {
              _SP_MODERATE_PROGRESSVAR[setup.progressVar.eventID](setup);
            }
          }
          else {
            if (passed.length>0) setup.success.call(_this,passed);
            if (failed.length>0) setup.error.call(_this,failed);
            setup.after.call(_this, passed, failed);
            if (_SP_MODERATE_PROGRESSVAR[setup.progressVar.eventID]) delete _SP_MODERATE_PROGRESSVAR[setup.progressVar.eventID];
          }
        }
      });
      return this;
    },
    /**
      @name $SP().list.remove
      @function
      @description Delete items from a Sharepoint List
      @note You can also use the key word 'del' instead of 'remove'

      @param {Objet|Array} [itemsID] List of items ID (e.g. [{ID:1}, {ID:22}]) | ATTENTION if you want to delete a file you have to add the "FileRef" e.g. {ID:2,FileRef:"path/to/the/file.ext"}
      @param {Object} [options] Options (see below)
        @param {String} [options.where] If you don't specify the itemsID (first param) then you have to use a `where` clause - it will search for the list of items ID based on the `where` and it will then delete all of them
        @param {Number} [options.packetsize=15] If you have too many items to delete, then we use `packetsize` to cut them into several requests (because Sharepoint cannot handle too many items at once)
        @param {Function} [options.progress] Two parameters: 'current' and 'max' -- If you provide more than 15 ID then they will be treated by packets and you can use "progress" to know more about the steps
        @param {Function} [options.success] One parameter: 'passedItems' -- a function with the items updated sucessfully
        @param {Function} [options.error] (One parameter: 'failedItems' -- a function with the items not updated
        @param {Function} [options.after] A function that will be executed at the end of the request; with two parameters (passedItems, failedItems)
      @return {Promise} Trigger on 'resolve' when it's completed with an array of 'passed' ([0]) and 'failed' ([1]), no trigger on 'reject'

      @example
      $SP().list("My List").remove({ID:1}); // you must always provide the ID

      // we can use the WHERE clause instead providing the ID
      $SP().list("My List").remove({where:"Title = 'OK'",progress:function(current,max) {
        console.log(current+"/"+max);
      }});

      // delete several items
      $SP().list("List Name", "http://my.sharepoint.com/sub/dir/").remove([{ID:5}, {ID:7}]);

      // example about how to use the "error" callback
      $SP().list("List").remove({ID:43, Title:"My title"}, {error:function(items) {
        for (var i=0; i &lt; items.length; i++) console.log("Error with:"+items[i].ID+" ("+items[i].errorMessage+")"); // only .ID and .errorMessage are available
      }});

      // example for deleting a file
      $SP().list("My Shared Documents").remove({ID:4,FileRef:"my/directory/My Shared Documents/something.xls"});

      // with Promise
      $SP().list("My List").remove({ID:42}).then(function(res) {
        // passed = res[0]
        // failed = res[1]
      })
    */
    remove:function(items, options) {
      var _this=this;
      return _this._promise(function(prom_resolve, prom_reject) {
        // check if we need to queue it
        if (_this.needQueue) { return _this._addInQueue(arguments) }
        // default values
        if (!options && items.where) { options=items; items=[]; } // the case when we use the "where"
        var setup={};
        SPExtend(true, setup, options);
        if (_this.url == undefined) throw "Error 'remove': not able to find the URL!"; // we cannot determine the url
        // deal with Promise/callbacks
        if (setup.useCallback !== false && (typeof setup.after === "function" || !prom_resolve)) { // if we ask for a callback, or if no Promise, no callback, no jQuery
          setup.useCallback = true;
        } else {
          setup.useCallback = false;
        }
        setup.error   = setup.error || (function() {});
        setup.success = setup.success || (function() {});
        setup.after   = setup.after || (function() {});
        setup.progress= setup.progress || (function() {});
        setup.packetsize = setup.packetsize || 15;

        if (typeof items === "object" && items.length==undefined) items = [ items ];
        var itemsLength=items.length;

        // if there is a WHERE clause
        if (setup.where) {
          // call GET first
          if (itemsLength==1) delete items[0].ID;
          _this.get({fields:"ID,FileRef",where:setup.where},function(data) {
            // we need a function to clone the items
            var clone = function(obj){
              var newObj = {};
              for (var k in obj) newObj[k]=obj[k];
              return newObj;
            };
            var aItems=[],fileRef;
            for (var i=data.length;i--;) {
              var it=clone(items[0]);
              it.ID=data[i].getAttribute("ID");
              fileRef=data[i].getAttribute("FileRef");
              if (fileRef) it.FileRef=_this.cleanResult(fileRef);
              aItems.push(it);
            }
            // now call again the REMOVE
            delete setup.where;
            // now call again the UPDATE
            if (setup.useCallback) _this.remove(aItems,setup)
            else _this.remove(aItems,setup).then(function(res) { prom_resolve(res) });
          });
          return;
        } else if (itemsLength === 0) {
          // nothing to delete
          setup.progress(1,1);
          setup.error.call(_this,[]);
          setup.success.call(_this,[]);
          if (setup.useCallback) setup.after([], []);
          else prom_resolve([[], []]);
          return;
        }

        // define current and max for the progress
        setup.progressVar = setup.progressVar || {current:0,max:itemsLength,passed:[],failed:[],eventID:"spRemove"+(""+Math.random()).slice(2)};
        // we cannot add more than setup.packetsize items in the same time, so split by setup.packetsize elements
        // and also to avoid surcharging the server
        if (itemsLength > setup.packetsize) {
          var nextPacket=items.slice(0);
          var cutted=nextPacket.splice(0,setup.packetsize);
          _SP_REMOVE_PROGRESSVAR[setup.progressVar.eventID] = function(setup) {
            return _this.remove(nextPacket,setup);
          };
          items = cutted;
          itemsLength = items.length;
        }
        // increment the progress
        setup.progressVar.current += itemsLength;

        // build a part of the request
        var updates = '<Batch OnError="Continue" ListVersion="1"  ViewName="">';
        for (var i=0; i < items.length; i++) {
          updates += '<Method ID="'+(i+1)+'" Cmd="Delete">';
          if (items[i].ID == undefined) throw "Error 'delete': you have to provide the item ID called 'ID'";
          updates += "<Field Name='ID'>"+items[i].ID+"</Field>";
          if (items[i].FileRef != undefined) updates += "<Field Name='FileRef'>"+items[i].FileRef+"</Field>";
          updates += '</Method>';
        }
        updates += '</Batch>';

        // build the request
        var body = _this._buildBodyForSOAP("UpdateListItems", "<listName>"+_this.listID+"</listName><updates>" + updates + "</updates>");
        // send the request
        var url = _this.url + "/_vti_bin/lists.asmx";
        _this.ajax({
          type:"POST",
          cache:false,
          async:true,
          url:url,
          data:body,
          beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/UpdateListItems'); },
          contentType: "text/xml; charset=utf-8",
          dataType: "xml",
          success:function(data) {
            var result = data.getElementsByTagName('Result');
            var len=result.length;
            var passed = setup.progressVar.passed, failed = setup.progressVar.failed;
            for (var i=0; i < len; i++) {
              if (result[i].getElementsByTagName('ErrorCode')[0].firstChild.nodeValue == "0x00000000") // success
                passed.push(items[i]);
              else {
                items[i].errorMessage = result[i].getElementsByTagName('ErrorText')[0].firstChild.nodeValue;
                failed.push(items[i]);
              }
            }

            setup.progress(setup.progressVar.current,setup.progressVar.max);
            // check if we have some other packets that are waiting to be treated
            if (setup.progressVar.current < setup.progressVar.max) {
              if (_SP_REMOVE_PROGRESSVAR[setup.progressVar.eventID]) {
                if (setup.useCallback) _SP_REMOVE_PROGRESSVAR[setup.progressVar.eventID](setup);
                else _SP_REMOVE_PROGRESSVAR[setup.progressVar.eventID](setup).then(function(res) { prom_resolve(res) })
              }
            } else {
              if (failed.length>0) setup.error.call(_this,failed);
              if (passed.length>0) setup.success.call(_this,passed);
              if (setup.useCallback) setup.after.call(_this, passed, failed);
              else prom_resolve([passed, failed]);
              if (_SP_REMOVE_PROGRESSVAR[setup.progressVar.eventID]) delete _SP_REMOVE_PROGRESSVAR[setup.progressVar.eventID];
            }
          }
        });
      })
    },
    del:function(items, setup) { return this.remove(items,setup) },
    /**
      @name $SP().usergroups
      @function
      @category people
      @description Find the Sharepoint groups where the specified user is member of

      @param {String} username The username with the domain ("domain\\login" for Sharepoint 2010, or e.g. "i:0#.w|domain\\login" for Sharepoint 2013)
      @param {Object} [setup] Options (see below)
        @param {String} [setup.url='current website'] The website url
        @param {Boolean} [setup.error=true] The function will stop and throw an error when something went wrong (use FALSE to don't throw an error)
        @param {Boolean} [setup.cache=true] Keep a cache of the result
      @param {Function} [result] A function that will be executed at the end of the request with a param that is an array with the result

      @example
      $SP().usergroups("mydomain\\john_doe",{url:"http://my.si.te/subdir/"}, function(groups) {
        for (var i=0; i &lt; groups.length; i++) console.log(groups[i]); // -> "Roadmap Admin", "Global Viewers", ...
      });
    */
    usergroups:function(username, setup, fct) {
      var _this=this;
      switch (arguments.length) {
        case 1: {
          if (typeof username === "object") return _this.usergroups("",username,function(){});
          else if (typeof username === "function") return _this.usergroups("",{},username);
          break;
        }
        case 2: {
          if (typeof username === "string" && typeof setup === "function") return _this.usergroups(username,{},setup);
          if (typeof username === "object" && typeof setup === "function") return _this.usergroups("",username,setup);
          break;
        }
      }

      // default values
      setup         = setup || {};
      setup.cache = (setup.cache === false ? false : true);
      if (setup.url == undefined) {
        if (!_this.url) { _this._getURL(); return _this._addInQueue(arguments) }
        else setup.url=_this.url;
      } else _this.url=setup.url;
      fct           = fct || (function() {});
      if (!username) throw "Error 'usergroups': you have to set an username.";

      username=username.toLowerCase();
      setup.url=setup.url.toLowerCase();
      // check the cache
      // [ {user:"username", url:"url", data:"the groups"}, ... ]
      var cache=_SP_CACHE_USERGROUPS || [];
      if (setup.cache) {
        for (var i=cache.length; i--;) {
          if (cache[i].user.toLowerCase() == username && cache[i].url.toLowerCase() == setup.url) {
            fct.call(_this,cache[i].data);
            return _this
          }
        }
      }


      // build the request
      var body = _this._buildBodyForSOAP("GetGroupCollectionFromUser", "<userLoginName>"+username+"</userLoginName>", "http://schemas.microsoft.com/sharepoint/soap/directory/")
      // send the request
      var url = setup.url + "/_vti_bin/usergroup.asmx";
      _this.ajax({
        type:"POST",
        cache:false,
        url:url,
        data:body,
        beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/directory/GetGroupCollectionFromUser'); },
        contentType: "text/xml; charset=utf-8",
        dataType: "xml",
        success:function(data) {
          var aResult=[];
          // get the details
          data=data.getElementsByTagName('Group');
          for (var i=0,len=data.length; i<len; i++) aResult.push(data[i].getAttribute("Name"));
          // cache the result
          cache.push({user:username,url:setup.url,data:aResult});
          _SP_CACHE_USERGROUPS = cache;
          fct.call(_this,aResult);
        },
        error:function(req) {
          if (setup.error===false) fct.call(_this,[]);
          else {
            // any error ?
            var error=req.responseXML.getElementsByTagName("errorstring");
            if (typeof console === "object") console.error("Error 'usergroups': "+error[0].firstChild.nodeValue);
          }
        }
      });
      return _this;
    },
    /**
      @name $SP().workflowStatusToText
      @function
      @category utils
      @description Return the text related to a workflow status code

      @param {String|Number} code This is the code returned by a workflow

      @example
      $SP().workflowStatusToText(2); // -> "In Progress"
     */
    workflowStatusToText:function(code) {
      code = code * 1;
      switch(code) {
        case 0: return "Not Started";
        case 1: return "Failed On Start";
        case 2: return "In Progress";
        case 3: return "Error Occurred";
        case 4: return "Stopped By User";
        case 5: return "Completed";
        case 6: return "Failed On Start Retrying";
        case 7: return "Error Occurred Retrying";
        case 8: return "View Query Overflow";
        case 15: return "Canceled";
        case 16: return "Approved";
        case 17: return "Rejected";
        default: return "Unknown";
      }
    },
    /**
      @name $SP().list.getWorkflowID
      @function
      @description Find the WorkflowID for a workflow, and some other data (fileRef, description, instances, ...)

      @param {Object} setup
        @param {Number} setup.ID The item ID that is tied to the workflow
        @param {String} setup.workflowName The name of the workflow
        @param {Function} setup.after The callback function that is called after the request is done (the parameter is {workflowID:"the workflowID", fileRef:"the fileRef"})

      @example
      $SP().list("List Name").getWorkflowID({ID:15, workflowName:"Workflow for List Name (manual)", after:function(params) {
        alert("Workflow ID:"+params.workflowID+" and the FileRef is: "+params.fileRef);
      }});
     */
    getWorkflowID:function(setup) {
      var _this=this;
      // check if we need to queue it
      if (_this.needQueue) { return _this._addInQueue(arguments) }
      if (_this.listID == undefined) throw "Error 'getWorkflowID': you have to define the list ID/Name";
      if (_this.url == undefined) throw "Error 'getWorkflowID': not able to find the URL!"; // we cannot determine the url
      setup = setup || {};
      if (setup.ID==undefined || setup.workflowName==undefined || setup.after==undefined) throw "Error 'getWorkflowID': all parameters are mandatory";

      // find the fileRef
      _this.get({fields:"FieldRef",where:"ID = "+setup.ID}, function(d) {
        if (d.length===0) throw "Error 'getWorkflowID': I'm not able to find the item ID "+setup.ID;

        var fileRef = _this.cleanResult(d[0].getAttribute("FileRef"));
        var c=fileRef.substring(0,fileRef.indexOf("/Lists"))
        d=_this.url.substring(0,_this.url.indexOf(c));
        fileRef = d+fileRef;
        if (fileRef.slice(0,4) !== "http") fileRef = window.location.href.split('/').slice(0,3).join("/") + fileRef;
        var body = _this._buildBodyForSOAP("GetWorkflowDataForItem", '<item>'+fileRef+'</item>', "http://schemas.microsoft.com/sharepoint/soap/workflow/");
        _this.ajax({
          type: "POST",
          cache: false,
          async: true,
          url: _this.url+"/_vti_bin/Workflow.asmx",
          data: body,
          beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/workflow/GetWorkflowDataForItem'); },
          contentType: "text/xml; charset=utf-8",
          dataType: "xml",
          success:function(data) {
            // we want to use myElem to change the getAttribute function
            var res={},i,row;
            var rows=data.getElementsByTagName('WorkflowTemplate');
            if (rows.length===0) {
              // depending of the permissions, we couldn't have the WorkflowTemplate data
              // in that case we have to get the workflow ID with another way
              var context = SP.ClientContext.get_current(); // eslint-disable-line
              var lists = context.get_web().get_lists();
              var list = lists.getByTitle(_this.listID);
              var item = list.getItemById(setup.ID);
              context.load(list);
              context.load(item);
              var workflows = list.get_workflowAssociations();
              context.load(workflows);
              context.executeQueryAsync(function() {
                var enumerator = workflows.getEnumerator();
                while(enumerator.moveNext()) {
                  var workflow = enumerator.get_current();
                  if (workflow.get_name() === setup.workflowName) {
                    res = {
                      "fileRef":fileRef,
                      "description":workflow.get_description(),
                      "workflowID":"{"+workflow.get_id().toString()+"}",
                      "instances":[]
                    }
                    break;
                  }
                }
                setup.after.call(_this, res);
              },
              function() {
                throw "Error 'getWorkflowID': Problem while dealing with SP.ClientContext.get_current()";
              });
            } else {
              for (i=rows.length; i--;) {
                if (rows[i].getAttribute("Name") == setup.workflowName) {
                  res = {
                    "fileRef":fileRef,
                    "description":rows[i].getAttribute("Description"),
                    "workflowID":"{"+rows[i].getElementsByTagName('WorkflowTemplateIdSet')[0].getAttribute("TemplateId")+"}",
                    "instances":[]
                  };
                }
              }
              if (!res.fileRef) {
                throw "Error 'getWorkflowID': it seems the requested workflow ('"+setup.workflowName+"') doesn't exist!";
              }
              rows=data.getElementsByTagName("Workflow");
              for (i=0; i<rows.length; i++) {
                row=rows[i];
                res.instances.push({
                  "StatusPageUrl":row.getAttribute("StatusPageUrl"),
                  "Id":row.getAttribute("Id"),
                  "TemplateId":row.getAttribute("TemplateId"),
                  "ListId":row.getAttribute("ListId"),
                  "SiteId":row.getAttribute("SiteId"),
                  "WebId":row.getAttribute("WebId"),
                  "ItemId":row.getAttribute("ItemId"),
                  "ItemGUID":row.getAttribute("ItemGUID"),
                  "TaskListId":row.getAttribute("TaskListId"),
                  "AdminTaskListId":row.getAttribute("AdminTaskListId"),
                  "Author":row.getAttribute("Author"),
                  "Modified":row.getAttribute("Modified"),
                  "Created":row.getAttribute("Created"),
                  "StatusVersion":row.getAttribute("StatusVersion"),
                  "Status1":{"code":row.getAttribute("Status1"), "text":_this.workflowStatusToText(row.getAttribute("Status1"))},
                  "Status2":{"code":row.getAttribute("Status2"), "text":_this.workflowStatusToText(row.getAttribute("Status2"))},
                  "Status3":{"code":row.getAttribute("Status3"), "text":_this.workflowStatusToText(row.getAttribute("Status3"))},
                  "Status4":{"code":row.getAttribute("Status4"), "text":_this.workflowStatusToText(row.getAttribute("Status4"))},
                  "Status5":{"code":row.getAttribute("Status5"), "text":_this.workflowStatusToText(row.getAttribute("Status5"))},
                  "Status6":{"code":row.getAttribute("Status6"), "text":_this.workflowStatusToText(row.getAttribute("Status6"))},
                  "Status7":{"code":row.getAttribute("Status7"), "text":_this.workflowStatusToText(row.getAttribute("Status7"))},
                  "Status8":{"code":row.getAttribute("Status8"), "text":_this.workflowStatusToText(row.getAttribute("Status8"))},
                  "Status9":{"code":row.getAttribute("Status9"), "text":_this.workflowStatusToText(row.getAttribute("Status9"))},
                  "Status10":{"code":row.getAttribute("Status10"), "text":_this.workflowStatusToText(row.getAttribute("Status10"))},
                  "TextStatus1":row.getAttribute("TextStatus1"),
                  "TextStatus2":row.getAttribute("TextStatus2"),
                  "TextStatus3":row.getAttribute("TextStatus3"),
                  "TextStatus4":row.getAttribute("TextStatus4"),
                  "TextStatus5":row.getAttribute("TextStatus5"),
                  "Modifications":row.getAttribute("Modifications"),
                  "InternalState":row.getAttribute("InternalState"),
                  "ProcessingId":row.getAttribute("ProcessingId")
                });
              }
              setup.after.call(_this, res);
            }
            return _this
          },
          error:function() {
            throw "Error 'getWorkflowID': Something went wrong with the request over the Workflow Web Service..."
          }
        });
      })
      return _this;
    },
    /**
      @name $SP().list.startWorkflow
      @function
      @description Manually start a work (that has been set to be manually started) (for "Sharepoint 2010 workflow" as the platform type)

      @param {Object} setup
        @param {String} setup.workflowName The name of the workflow
        @param {Number} [setup.ID] The item ID that tied to the workflow
        @param {Array|Object} [setup.parameters] An array of object with {name:"Name of the parameter", value:"Value of the parameter"}
        @param {Function} [setup.after] This callback function that is called after the request is done
        @param {String} [setup.fileRef] Optional: you can provide the fileRef to avoid calling the $SP().list().getWorkflowID()
        @param {String} [setup.workflowID] Optional: you can provide the workflowID to avoid calling the $SP().list().getWorkflowID()

      @example
      // if you want to call a Site Workflow, just leave the list name empty and don't provide an item ID, e.g.:
      $SP().list("").startWorkflow({workflowName:"My Site Workflow"});

      // to start a workflow for a list item
      $SP().list("List Name").startWorkflow({ID:15, workflowName:"Workflow for List Name (manual)", parameters:{name:"Message",value:"Welcome here!"}, after:function(error) {
        if (!error)
          alert("Workflow done!");
        else
          alert("Error: "+error);
      }});
    **/
    startWorkflow:function(setup) {
      var _this=this;
      // check if we need to queue it
      if (_this.needQueue) { return _this._addInQueue(arguments) }
      if (_this.url == undefined) throw "Error 'startWorkflow': not able to find the URL!";

      // if no listID then it's a Site Workflow so we use startWorkflow2013
      if (!_this.listID) {
        setup.platformType=2010;
        return _this.startWorkflow2013(setup)
      }
      setup = setup || {};
      setup.after = setup.after || (function() {});
      if (!setup.workflowName && !setup.workflowID) throw "Error 'startWorkflow': Please provide the workflow name!"
      if (!setup.ID) throw "Error 'startWorkflow': Please provide the item ID!"

      // find the FileRef and templateID
      if (!setup.fileRef && !setup.workflowID) {
        _this.getWorkflowID({ID:setup.ID,workflowName:setup.workflowName,
          after:function(params) {
            setup.fileRef=params.fileRef;
            setup.workflowID=params.workflowID;
            _this.startWorkflow(setup)
          }
        })
      } else {
        // define the parameters if any
        var workflowParameters = "<root />";
        if (setup.parameters) {
          var p;
          if (setup.parameters.length == undefined) setup.parameters = [ setup.parameters ];
          p = setup.parameters.slice(0);
          workflowParameters = "<Data>";
          for (var i=0; i<p.length; i++) workflowParameters += "<"+p[i].name+">"+p[i].value+"</"+p[i].name+">";
          workflowParameters += "</Data>";
        }
        var body = _this._buildBodyForSOAP("StartWorkflow", "<item>"+setup.fileRef+"</item><templateId>"+setup.workflowID+"</templateId><workflowParameters>"+workflowParameters+"</workflowParameters>", "http://schemas.microsoft.com/sharepoint/soap/workflow/");
        // do the request
        var url = _this.url + "/_vti_bin/Workflow.asmx";
        _this.ajax({
          type: "POST",
          cache: false,
          async: true,
          url: url,
          data: body,
          beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/workflow/StartWorkflow'); },
          contentType: "text/xml; charset=utf-8",
          dataType: "xml",
          success:function() {
            setup.after.call(_this)
          },
          error:function(jqXHR, textStatus, errorThrown) {
            setup.after.call(_this, errorThrown)
          }
        });
      }
      return _this;
    },
    /**
      @name $SP().list.startWorkflow2013
      @function
      @description Manually start a work (that has been set to be manually started) (for "Sharepoint 2013 workflow" as the platform type)

      @param {Object} setup
        @param {Number} [setup.ID] The item ID that tied to the workflow
        @param {String} setup.workflowName The name of the workflow
        @param {Array|Object} [setup.parameters] An array of object with {name:"Name of the parameter", value:"Value of the parameter"}
        @param {Function} [setup.after] This callback function that is called after the request is done

      @example
      // if you want to call a Site Workflow, just leave the list name empty and don't provide an item ID, e.g.:
      $SP().list("").startWorkflow2013({workflowName:"My Site Workflow"});

      // to start a workflow for a list item
      $SP().list("List Name").startWorkflow2013({ID:15, workflowName:"Workflow for List Name (manual)", parameters:{name:"Message",value:"Welcome here!"}, after:function(error) {
        if (!error)
          alert("Workflow done!");
        else
          alert("Error: "+error);
      }});
    **/
    startWorkflow2013:function(setup) {
      var _this=this;
      // check if we need to queue it
      if (_this.needQueue) { return _this._addInQueue(arguments) }
      if (_this.url == undefined) throw "Error 'startWorkflow2013': not able to find the URL!";

      setup = setup || {};
      setup.after = setup.after || (function() {});
      setup.platformType = setup.platformType || 2013; // internal use when calling Site Workflow from startWorkflow()
      if (!setup.workflowName) throw "Error 'startWorkflow2013': Please provide the workflow name!"
      if (_this.listID && !setup.ID) throw "Error 'startWorkflow2013': Please provide the item ID!"

      // we need "sp.workflowservices.js"
      if (typeof SP === "undefined" || typeof SP.SOD === "undefined") { // eslint-disable-line
        throw "Error 'startWorkflow2013': SP.SOD.executeFunc is required (from the Microsoft file called init.js)";
      }

      SP.SOD.executeFunc("sp.js", "SP.ClientContext" , function(){ // eslint-disable-line
        SP.SOD.registerSod('sp.workflowservices.js', SP.Utilities.Utility.getLayoutsPageUrl('sp.workflowservices.js')); // eslint-disable-line
        SP.SOD.executeFunc('sp.workflowservices.js', "SP.WorkflowServices.WorkflowServicesManager", function() { // eslint-disable-line
          var context = new SP.ClientContext(_this.url); // eslint-disable-line
          var web = context.get_web();

          var servicesManager = SP.WorkflowServices.WorkflowServicesManager.newObject(context, web); // eslint-disable-line
          context.load(servicesManager);
          // list the existing workflows
          var subscriptions = servicesManager.getWorkflowSubscriptionService().enumerateSubscriptions();
          context.load(subscriptions);

          context.executeQueryAsync(function() {
            var subsEnum = subscriptions.getEnumerator(), sub;
            var initiationParams = {}, i, passed=false;
            var workflowName = setup.workflowName.toLowerCase();
            // set the parameters
            if (setup.parameters) {
              if (setup.parameters.length === undefined) setup.parameters = [ setup.parameters ];
              for (i=0; i<setup.parameters.length; i++)
                initiationParams[setup.parameters[i].name] = setup.parameters[i].value;
            }

            if (setup.platformType == 2010) {
              var interopService = servicesManager.getWorkflowInteropService();
              interopService.startWorkflow(workflowName, null, null, null, initiationParams);
              context.executeQueryAsync(function() {
                setup.after.call(_this)
              }, function(sender, args) {
                var errorMessage = args.get_message();
                if (errorMessage === "associationName") errorMessage = "No workflow found with the name '"+setup.workflowName+"'";
                setup.after.call(_this, errorMessage);
              });
            } else {
              // go thru all the workflows to find the one we want to initiate
              while (subsEnum.moveNext()) {
                sub = subsEnum.get_current();
                if (sub.get_name().toLowerCase() === workflowName) {

                  if (setup.ID) servicesManager.getWorkflowInstanceService().startWorkflowOnListItem(sub, setup.ID, initiationParams);
                  else servicesManager.getWorkflowInstanceService().startWorkflow(sub, initiationParams);
                  context.executeQueryAsync(function() {
                    setup.after.call(_this)
                  }, function(sender, args) {
                    setup.after.call(_this, args.get_message())
                  });
                  passed=true;
                  break;
                }
              }
              if (!passed) {
                setup.after.call(_this, "No workflow found with the name '"+setup.workflowName+"'");
              }
            }
          }, function(sender, args) {
            setup.after.call(_this, args.get_message())
          });
        });
      })
      return this;
    },
    /**
      @name $SP().distributionLists
      @function
      @category people
      @description Find the distribution lists where the specified user is member of

      @param {String} username The username with or without the domain ("domain\\login" for Sharepoint 2010, or e.g. "i:0#.w|domain\\login" for Sharepoint 2013)
      @param {Object} [setup] Options (see below)
        @param {String} [setup.url='current website'] The website url
        @param {Boolean} [setup.cache=true] Cache the response from the server
      @param {Function} [result] A function that will be executed at the end of the request with a param that is an array with the result

      @example
      $SP().distributionLists("mydomain\\john_doe",{url:"http://my.si.te/subdir/"}, function(mailing) {
        for (var i=0; i &lt; mailing.length; i++) console.log(mailing[i]); // -> {SourceReference: "cn=listname,ou=distribution lists,ou=rainbow,dc=com", DisplayName:"listname", MailNickname:"List Name", Url:"mailto:listname@rainbow.com"}
      });
    */
    distributionLists:function(username, setup, fct) {
      var _this=this;
      switch (arguments.length) {
        case 1: {
          if (typeof username === "object") return _this.distributionLists("",username,function(){});
          else if (typeof username === "function") return _this.distributionLists("",{},username);
          break;
        }
        case 2: {
          if (typeof username === "string" && typeof setup === "function") return _this.distributionLists(username,{},setup);
          if (typeof username === "object" && typeof setup === "function") return _this.distributionLists("",username,setup);
          break;
        }
      }

      // default values
      setup         = setup || {};
      if (setup.url == undefined) {
        if (!_this.url) { _this._getURL(); return _this._addInQueue(arguments) }
        else setup.url=_this.url;
      } else _this.url=setup.url;
      fct           = fct || (function() {});
      if (!username) throw "Error 'distributionLists': you have to set an username.";

      username = username.toLowerCase();
      setup.url=setup.url.toLowerCase();
      setup.cache = (setup.cache === false ? false : true)
      // check the cache
      // [ {user:"username", url:"url", data:"the distribution lists"}, ... ]
      var cache=_SP_CACHE_DISTRIBUTIONLISTS || [];
      if (setup.cache) {
        for (var i=cache.length; i--;) {
          if (cache[i].user === username && cache[i].url === setup.url) {
            fct.call(_this,cache[i].data);
            return _this
          }
        }
      }


      // build the request
      var body = _this._buildBodyForSOAP("GetCommonMemberships", "<accountName>"+username+"</accountName>", "http://microsoft.com/webservices/SharePointPortalServer/UserProfileService");

      // send the request
      var url = setup.url + "/_vti_bin/UserProfileService.asmx";
      _this.ajax({
        type:"POST",
        cache:false,
        url:url,
        data:body,
        beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://microsoft.com/webservices/SharePointPortalServer/UserProfileService/GetUserMemberships') },
        contentType: "text/xml; charset=utf-8",
        dataType: "xml",
        success:function(data) {
          var aResult=[];
          // get the details
          data=data.getElementsByTagName('MembershipData');
          for (var i=0,len=data.length; i<len; i++) {
            if (data[i].getElementsByTagName("Source")[0].firstChild.nodeValue === "DistributionList") {
              aResult.push({"SourceReference": data[i].getElementsByTagName("SourceReference")[0].firstChild.nodeValue, "DisplayName":data[i].getElementsByTagName("DisplayName")[0].firstChild.nodeValue, "MailNickname":data[i].getElementsByTagName("MailNickname")[0].firstChild.nodeValue, "Url":data[i].getElementsByTagName("Url")[0].firstChild.nodeValue});
            }
          }
          // cache the result
          cache.push({user:username,url:setup.url,data:aResult});
          _SP_CACHE_DISTRIBUTIONLISTS = cache;
          fct.call(_this,aResult);
        },
        error:function(req, textStatus, errorThrown) { // eslint-disable-line
          fct.call(_this,[]);
          // any error ?
          //var error=req.responseXML.getElementsByTagName("errorstring");
          //if (typeof console === "object") console.error("Error 'distributionLists': "+error[0].firstChild.nodeValue);
        }
      });
      return _this;
    },
    /**
      @name $SP().groupMembers
      @function
      @category people
      @description Find the members of a Sharepoint group

      @param {String} groupname Name of the group
      @param {Object} [setup] Options (see below)
        @param {String} [setup.url='current website'] The website url
        @param {Boolean} [setup.error=true] The function will stop and throw an error when something went wrong (use FALSE to don't throw an error)
        @param {Boolean} [setup.cache=true] By default the function will cache the group members (so if you call several times it will use the cache)
      @param {Function} [result] A function that will be executed at the end of the request with a param that is an array with the result

      @example
      $SP().groupMembers("my group", function(members) {
        for (var i=0; i &lt; members.length; i++) console.log(members[i]); // -> {ID:"1234", Name:"Doe, John", LoginName:"mydomain\john_doe", Email:"john_doe@rainbow.com"}
      });
    */
    groupMembers:function(groupname, setup, fct) {
      var _this=this;
      switch (arguments.length) {
        case 1: {
          if (typeof groupname === "object") return _this.groupMembers("",groupname,function(){});
          else if (typeof groupname === "function") return _this.groupMembers("",{},groupname);
          break;
        }
        case 2: {
          if (typeof groupname === "string" && typeof setup === "function") return _this.groupMembers(groupname,{},setup);
          if (typeof groupname === "object" && typeof setup === "function") return _this.groupMembers("",groupname,setup);
        }
      }

      // default values
      setup         = setup || {};
      setup.cache = (setup.cache === undefined ? true : setup.cache);
      if (setup.url == undefined) {
        if (!_this.url) { _this._getURL(); return _this._addInQueue(arguments) }
        else setup.url=_this.url;
      } else _this.url=setup.url;
      fct           = fct || (function() {});
      if (!groupname) throw "Error 'groupMembers': you have to set an groupname.";

      groupname=groupname.toLowerCase();
      setup.url=setup.url.toLowerCase();
      // check the cache
      // [ {user:"username", url:"url", data:"the distribution lists"}, ... ]
      var cache=[];
      if (setup.cache) {
        cache=_SP_CACHE_GROUPMEMBERS || [];
        for (var i=cache.length; i--;) {
          if (cache[i].group === groupname && cache[i].url === setup.url) {
            fct.call(_this,cache[i].data);
            return _this
          }
        }
      }

      // build the request
      var body = _this._buildBodyForSOAP("GetUserCollectionFromGroup", "<groupName>"+_this._cleanString(groupname)+"</groupName>", "http://schemas.microsoft.com/sharepoint/soap/directory/");
      // send the request
      var url = setup.url + "/_vti_bin/usergroup.asmx";
      _this.ajax({
        type:"POST",
        cache:false,
        url:url,
        data:body,
        beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/directory/GetUserCollectionFromGroup') },
        contentType: "text/xml; charset=utf-8",
        dataType: "xml",
        success:function(data) {
          var aResult=[];
          // get the details
          data=data.getElementsByTagName('User');
          for (var i=0,len=data.length; i<len; i++) {
            aResult.push({"ID": data[i].getAttribute("ID"), "Name":data[i].getAttribute("Name"), "LoginName":data[i].getAttribute("LoginName"), "Email":data[i].getAttribute("Email")});
          }
          // cache the result
          cache.push({group:groupname,url:setup.url,data:aResult});
          _SP_CACHE_GROUPMEMBERS = cache;
          fct.call(_this,aResult);
        },
        error:function(req, textStatus, errorThrown) { // eslint-disable-line
          if (setup.error===false) fct.call(_this,[]);
          else {
            // any error ?
            var error=req.responseXML.getElementsByTagName("errorstring");
            if (typeof console === "object") console.error("Error 'groupMembers': "+error[0].firstChild.nodeValue);
          }
        }
      });
      return _this;
    },
    /**
      @name $SP().isMember
      @function
      @category people
      @description Find if the user is member of the Sharepoint group

      @param {Object} [setup] Options (see below)
        @param {String} setup.user Username with domain ("domain\\login" for Sharepoint 2010, or e.g. "i:0#.w|domain\\login" for Sharepoint 2013)
        @param {String} setup.group Name of the group
        @param {String} [setup.url='current website'] The website url
        @param {Boolean} [setup.cache=true] Cache the response from the server
      @param {Function} [result] Return TRUE if the user is a member of the group, FALSE if not.

      @example
      $SP().isMember({user:"mydomain\\john_doe",group:"my group",url:"http://my.site.com/"}, function(isMember) {
        if (isMember) alert("OK !")
      });
    */
    isMember:function(setup, fct) {
      // default values
      setup         = setup || {};
      setup.cache = (setup.cache === false ? false : true)
      if (setup.url == undefined) {
        if (!this.url) { this._getURL(); return this._addInQueue(arguments) }
        else setup.url=this.url;
      } else this.url=setup.url;
      fct           = fct || (function() {});
      if (!setup.user) throw "Error 'isMember': you have to set an user.";
      if (!setup.group) throw "Error 'isMember': you have to set a group.";

      setup.group = setup.group.toLowerCase();
      // first check with usergroups()
      this.usergroups(setup.user,{cache:setup.cache,error:false},function(groups) {
        for (var i=groups.length; i--;) {
          if (groups[i].toLowerCase() === setup.group) { fct.call(this,true); return this }
        }
        // if we're there then it means we need to keep investigating
        // look at the members of the group
        this.groupMembers(setup.group,{cache:setup.cache,error:false},function(m) {
          var members=[];
          for (var i=m.length; i--;) members.push(m[i].Name.toLowerCase())
          // and search if our user is part of the members (like a distribution list)
          this.distributionLists(setup.user, {cache:setup.cache}, function(distrib) {
            for (var i=distrib.length; i--;) {
              if (SPArrayIndexOf(members, distrib[i].DisplayName.toLowerCase()) > -1) { fct.call(this,true); return this }
            }

            // if we are here it means we found nothing
            fct.call(this,false);
            return this
          });
        });
      })

      return this;
    },
    /**
      @name $SP().people
      @function
      @category people
      @description Find the user details like manager, email, ...

      @param {String} [username] With or without the domain, and you can also use an email address, and if you leave it empty it's the current user by default (if you use the domain, don't forget to use a double \ like "mydomain\\john_doe")
      @param {Object} [setup] Options (see below)
        @param {String} [setup.url='current website'] The website url
      @param {Function} [result] A function that will be executed at the end of the request with a param that is an array with the result, or a String with the error message

      @example
      $SP().people("john_doe",{url:"http://my.si.te/subdir/"}, function(people) {
        if (typeof people === "string") {
          alert(people); // there was a problem so we prompt it
        } else
          for (var i=0; i &lt; people.length; i++) console.log(people[i]+" = "+people[people[i]]);
      });
    */
    people:function(username, setup, fct) {
      var _this=this;
      switch (arguments.length) {
        case 1: {
          if (typeof username === "object") return _this.people("",username,function(){});
          else if (typeof username === "function") return _this.people("",{},username);
          username=undefined;
          break;
        }
        case 2: {
          if (typeof username === "string" && typeof setup === "function") return _this.people(username,{},setup);
          if (typeof username === "object" && typeof setup === "function") return _this.people("",username,setup);
        }
      }

      // default values
      setup         = setup || {};
      if (setup.url == undefined) {
        if (!_this.url) { _this._getURL(); return _this._addInQueue(arguments) }
        else setup.url=_this.url;
      } else _this.url=setup.url;
      fct           = fct || (function() {});
      username      = username || "";

      // build the request
      var body = _this._buildBodyForSOAP("GetUserProfileByName", "<AccountName>"+username+"</AccountName>", "http://microsoft.com/webservices/SharePointPortalServer/UserProfileService");
      // send the request
      var url = setup.url + "/_vti_bin/UserProfileService.asmx";
      _this.ajax({
        type:"POST",
        cache:false,
        url:url,
        data:body,
        beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://microsoft.com/webservices/SharePointPortalServer/UserProfileService/GetUserProfileByName'); },
        contentType: "text/xml; charset=utf-8",
        dataType: "xml",
        success:function(data) {
          var aResult=[];
          // get the details
          data=data.getElementsByTagName('PropertyData');
          for (var i=0,len=data.length; i<len; i++) {
            var name=data[i].getElementsByTagName("Name")[0].firstChild.nodeValue;
            var value=data[i].getElementsByTagName("Value");
            if (value&&value.length>=1&&value[0].firstChild) value=value[0].firstChild.nodeValue;
            else value="No Value";
            aResult.push(name);
            aResult[name]=value;
          }
          fct.call(_this,aResult);
        },
        error:function(req, textStatus, errorThrown) { // eslint-disable-line
          // any error ?
          var error=req.responseXML.getElementsByTagName("faultstring");
          fct.call(_this,"Error 'people': "+error[0].firstChild.nodeValue);
        }
      });
      return _this;
    },
    /**
      @name $SP().getUserInfo
      @function
      @category people
      @description Find the User ID, work email, and preferred name for the specified username (this is useful because of the User ID that can then be used for filtering a list)

      @param {String} username That must be "domain\\login" for Sharepoint 2010, or something like "i:0#.w|domain\\login" for Sharepoint 2013
      @param {Object} [setup] Options (see below)
        @param {String} [setup.url='current website'] The website url
      @param {Function} [result] A function that will be executed at the end of the request with a param that is an object with the result ({ID,Sid,Name,LoginName,Email,Notes,IsSiteAdmin,IsDomainGroup,Flags}), or a String with the error message

      @example
      $SP().getUserInfo("domain\\john_doe",{url:"http://my.si.te/subdir/"}, function(info) {
        if (typeof info === "string") {
          alert("Error:"+info); // there was a problem so we show it
        } else
          alert("User ID = "+info.ID)
      });
    */
    getUserInfo:function(username, setup, fct) {
      var _this=this;
      if (typeof username !== "string") throw "Error 'getUserInfo': the first argument must be the username";
      switch (arguments.length) {
        case 2: {
          if (typeof setup === "function") return _this.getUserInfo(username,{},setup);
          if (typeof setup === "object") return _this.getUserInfo(username,setup,function() {});
          break;
        }
        case 3: if (typeof setup !== "object" && typeof fct !== "function") throw "Error 'getUserInfo': incorrect arguments, please review the documentation";
      }

      // default values
      setup = setup || {};
      if (setup.url == undefined) {
        if (!_this.url) { _this._getURL(); return _this._addInQueue(arguments) }
        else setup.url=_this.url;
      } else _this.url=setup.url;
      fct = fct || (function() {});

      // build the request
      var body = _this._buildBodyForSOAP("GetUserInfo", '<userLoginName>'+username+'</userLoginName>', "http://schemas.microsoft.com/sharepoint/soap/directory/");
      // send the request
      var url = setup.url + "/_vti_bin/usergroup.asmx";
      _this.ajax({
        type:"POST",
        cache:false,
        url:url,
        data:body,
        contentType: "text/xml; charset=utf-8",
        dataType: "xml",
        success:function(data) {
          // get the details
          data=data.getElementsByTagName('User');
          if (data.length===0) {
            fct.call(_this,"Error 'getUserInfo': nothing returned?!")
          } else {
            fct.call(_this,{ID:data[0].getAttribute("ID"),Sid:data[0].getAttribute("Sid"),Name:data[0].getAttribute("Name"),LoginName:data[0].getAttribute("LoginName"),Email:data[0].getAttribute("Email"),Notes:data[0].getAttribute("Notes"),IsSiteAdmin:data[0].getAttribute("IsSiteAdmin"),IsDomainGroup:data[0].getAttribute("IsDomainGroup"),Flags:data[0].getAttribute("Flags")})
          }
        },
        error:function(req, textStatus, errorThrown) { // eslint-disable-line
          // any error ?
          var error=req.responseXML.getElementsByTagName("errorstring");
          fct.call(_this,"Error 'getUserInfo': "+error[0].firstChild.nodeValue);
        }
      });
      return this;
    },
    /**
      @name $SP().whoami
      @function
      @category people
      @description Find the current user details like manager, email, colleagues, ...

      @param {Object} [setup] Options (see below)
        @param {String} [setup.url='current website'] The website url
      @param {Function} [result] A function that will be executed at the end of the request with a param that is an array with the result

      @example
      $SP().whoami({url:"http://my.si.te/subdir/"}, function(people) {
        for (var i=0; i &lt; people.length; i++) console.log(people[i]+" = "+people[people[i]]);
      });
    */
    whoami:function(setup, fct) {
      if (typeof setup === "function") { fct=setup; setup = {} }
      return this.people("",setup,fct);
    },
    /**
      @name $SP().regionalSettings
      @function
      @category utils
      @description Find the region settings (of the current user) defined with _layouts/regionalsetng.aspx?Type=User (lcid, cultureInfo, timeZone, calendar, alternateCalendar, workWeek, timeFormat..)

      @param {Function} [callback] A function with one paramater that contains the parameters returned from the server

      @example
      $SP().regionalSettings(function(region) {
        if (typeof region === "string") {
          // something went wrong
          console.log(region); // returns the error
        } else {
          // show the selected timezone, and the working days
          console.log("timeZone: "+region.timeZone);
          console.log("working days: "+region.workWeek.days.join(", "))
        }
      })
    */
    regionalSettings:function(callback) {
      var _this = this;
      // find the base URL
      if (!_this.url) { _this._getURL(); return _this._addInQueue(arguments) }
      if (typeof callback !== "function") callback = function() {};

      // check cache
      if (_SP_CACHE_REGIONALSETTINGS) callback.call(_this, _SP_CACHE_REGIONALSETTINGS);

      _this.ajax({
        method:'GET',
        url:_this.url + "/_layouts/regionalsetng.aspx?Type=User",
        success:function(data) {
          var result = {lcid:"", cultureInfo:"", timeZone:"", calendar:"", alternateCalendar:""};
          var div = document.createElement('div');
          div.innerHTML = data;
          var tmp, i;
          var getValue = function(id) {
            var e = div.querySelector("select[id$='"+id+"']");
            return e.options[e.selectedIndex].innerHTML;
          };

          result.lcid = div.querySelector("select[id$='LCID']").value;
          result.cultureInfo = getValue("LCID");
          result.timeZone = getValue("TimeZone");
          result.calendar = getValue("DdlwebCalType");
          result.alternateCalendar = getValue("DdlwebAltCalType");

          tmp=document.querySelectorAll("input[id*='ChkListWeeklyMultiDays']");
          result.workWeek = {days:[], firstDayOfWeek:"", firstWeekOfYear:"", startTime:"", endTime:""};
          for (i=0; i<tmp.length; i++) {
            if (tmp[i].checked) result.workWeek.days.push(tmp[i].nextSibling.querySelector('abbr').getAttribute("title"))
          }

          result.workWeek.firstDayOfWeek = getValue("DdlFirstDayOfWeek");
          result.workWeek.firstWeekOfYear = getValue("DdlFirstWeekOfYear");
          result.workWeek.startTime=div.querySelector("select[id$='DdlStartTime']").value;
          result.workWeek.endTime=div.querySelector("select[id$='DdlEndTime']").value;
          result.timeFormat = getValue("DdlTimeFormat");

          // cache
          _SP_CACHE_REGIONALSETTINGS = result;

          callback.call(_this, result);
        },
        error:function(jqXHR, textStatus, errorThrown) {
          callback.call(_this, "Error: ["+textStatus+"] "+errorThrown);
        }
      });

      return _this;
    },
    /**
      @name $SP().regionalDateFormat
      @function
      @category utils
      @description Provide the Date Format based on the user regional settings (YYYY for 4-digits Year, YY for 2-digits day, MM for 2-digits Month, M for 1-digit Month, DD for 2-digits day, D for 1-digit day) -- it's using the DatePicker iFrame (so an AJAX request)

      @param {Function} [callback] It will pass the date format

      @example
      // you'll typically need that info when parsing a date from a Date Picker field from a form
      // we suppose here you're using momentjs
      // eg. we want to verify start date is before end date
      var startDate = $SP().formfields("Start Date").val();
      var endDate = $SP().formfields("End Date").val();
      $SP().regionalDateFormat(function(dateFormat) {
        // if the user settings are on French, then dateFormat = "DD/MM/YYYY"
        if (moment(startDate, dateFormat).isAfter(moment(endDate, dateFormat))) {
          alert("StartDate must be before EndDate!")
        }
      })

      // Here is also an example of how you can parse a string date
      // -> https://gist.github.com/Aymkdn/b17903cf7786578300f04f50460ebe96
     */
    regionalDateFormat:function(callback) {
      var _this = this;
      // find the base URL
      if (!_this.url) { _this._getURL(); return _this._addInQueue(arguments) }
      if (typeof callback !== "function") callback = function() {};

      // check cache
      if (_SP_CACHE_DATEFORMAT) callback.call(_this, _SP_CACHE_DATEFORMAT);

      // check if we have LCID
      var lcid = "";
      if (typeof _spRegionalSettings !== "undefined") lcid=_spRegionalSettings.localeId; // eslint-disable-line
      else if (_SP_CACHE_REGIONALSETTINGS) lcid=_SP_CACHE_REGIONALSETTINGS.lcid;
      if (!lcid) {
        return _this.regionalSettings(function() {
          _this.regionalDateFormat(callback);
        })
      }

      _this.ajax({
        method:'GET',
        url:_this.url + "/_layouts/iframe.aspx?cal=1&date=1/1/2000&lcid="+lcid,
        success:function(data) {
          var div = document.createElement('div');
          div.innerHTML = data;

          // div will contain the full datepicker page, for the January 2000
          // search for 3/January/2000
          var x = div.querySelector('a[id="20000103"]').getAttribute("href").replace(/javascript:ClickDay\('(.*)'\)/,"$1");
          // source : http://stackoverflow.com/questions/7885096/how-do-i-decode-a-string-with-escaped-unicode
          var r = /\\u([\d\w]{4})/gi;
          x = x.replace(r, function (match, grp) { return String.fromCharCode(parseInt(grp, 16)); } );
          x = unescape(x); // eg: 3.1.2000
          x = x.replace(/20/, "YY"); // 3.1.YY00
          x = x.replace(/00/, "YY"); // 3.1.YYYY
          x = x.replace(/03/, "DD"); // 3.1.YYYY
          x = x.replace(/3/, "D"); // D.1.YYYY
          x = x.replace(/01/, "MM"); // D.1.YYYY
          x = x.replace(/1/, "M"); // D.M.YYYY
          _SP_CACHE_DATEFORMAT = x;
          callback.call(_this, x)
        },
        error:function(jqXHR, textStatus, errorThrown) {
          callback.call(_this, "Error: ["+textStatus+"] "+errorThrown)
        }
      });

      return _this;
    },
    /**
      @name $SP().addressbook
      @function
      @category people
      @description Find an user based on a part of his name

      @param {String} word A part of the name from the guy you're looking for
      @param {Object} [setup] Options (see below)
        @param {String} [setup.limit=10] Number of results returned
        @param {String} [setup.type='User'] Possible values are: 'All', 'DistributionList', 'SecurityGroup', 'SharePointGroup', 'User', and 'None' (see http://msdn.microsoft.com/en-us/library/people.spprincipaltype.aspx)
        @param {String} [setup.url='current website'] The website url
      @param {Function} [result] A function that will be executed at the end of the request with a param that is an array with the result (typically: AccountName,UserInfoID,DisplayName,Email,Departement,Title,PrincipalType)

      @example
      $SP().addressbook("john", {limit:25}, function(people) {
        for (var i=0; i &lt; people.length; i++) {
          for (var j=0; j &lt; people[i].length; j++) console.log(people[i][j]+" = "+people[i][people[i][j]]);
        }
      });
    */
    addressbook:function(username, setup, fct) {
      var _this=this;
      switch (arguments.length) {
        case 1: {
          if (typeof username === "object") return _this.addressbook("",username,function(){});
          else if (typeof username === "function") return _this.addressbook("",{},username);
          else if (typeof username === "string")  return _this.addressbook(username,{},function(){});
          username=undefined;
          break;
        }
        case 2: {
          if (typeof username === "string" && typeof setup === "function") return _this.addressbook(username,{},setup);
          if (typeof username === "object" && typeof setup === "function") return _this.addressbook("",username,setup);
        }
      }

      // default values
      setup         = setup || {};
      if (setup.url == undefined) {
        if (!_this.url) { _this._getURL(); return _this._addInQueue(arguments) }
        else setup.url=_this.url;
      } else _this.url=setup.url;
      setup.limit   = setup.limit || 10;
      setup.type    = setup.type || "User";
      fct           = fct || (function() {});
      username      = username || "";


      // build the request
      var body = _this._buildBodyForSOAP("SearchPrincipals", "<searchText>"+username+"</searchText><maxResults>"+setup.limit+"</maxResults><principalType>"+setup.type+"</principalType>");
      // send the request
      var url = setup.url + "/_vti_bin/People.asmx";
      _this.ajax({
        type: "POST",
        cache:false,
        url:url,
        data:body,
        beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/SearchPrincipals'); },
        contentType: "text/xml; charset=utf-8",
        dataType: "xml",
        success:function(data) {
          var aResult=[];
          // get the details
          data=data.getElementsByTagName('PrincipalInfo');
          for (var i=0,lenR=data.length; i<lenR; i++) {
            var children=data[i].childNodes;
            aResult[i]=[];
            for (var j=0,lenC=children.length; j<lenC; j++) {
              var name=children[j].nodeName;
              var value=children[j].firstChild;
              if (value) value=value.nodeValue;
              aResult[i].push(name);
              aResult[i][name]=value;
            }
          }
          fct.call(_this,aResult);
        }
      });
      return _this;
    },
    /*
     @ignore
     */
    reset:function() {
      var _this=this;
      _this.data   = [];
      _this.length = 0;
      _this.listID = "";
      _this.needQueue=false;
      _this.listQueue=[];
      delete _this.url;
    },
    /**
      @name $SP().toDate
      @function
      @category utils
      @description Change a Sharepoint date (as a string) to a Date Object
      @param {String} textDate the Sharepoint date string
      @param {Boolean} [forceUTC=false] Permits to force the reading of the date in UTC
      @return {Date} the equivalent Date object for the Sharepoint date string passed
      @example $SP().toDate("2012-10-31T00:00:00").getFullYear(); // 2012
    */
    toDate:function(strDate, forceUTC) {
      if (!strDate) return ""
      // 2008-10-31(T)00:00:00(Z)
      if (strDate instanceof Date) return strDate
      if (strDate.length!=19 && strDate.length!=20) throw "toDate: '"+strDate+"' is invalid."
      var year  = strDate.substring(0,4);
      var month = strDate.substring(5,7);
      var day   = strDate.substring(8,10);
      var hour  = strDate.substring(11,13);
      var min   = strDate.substring(14,16);
      var sec   = strDate.substring(17,19);
      // check if we have "Z" for UTC date
      return (strDate.indexOf("Z") > -1 || forceUTC ? new Date(Date.UTC(year,month-1,day,hour,min,sec)) : new Date(year,month-1,day,hour,min,sec));
    },
    /**
      @name $SP().toSPDate
      @function
      @category utils
      @description Change a Date object into a Sharepoint date string
      @param {Date} dateObject The Date object you want to convert
      @param {Date} [includeTime=false] By default the time is not returned (if the time appears then the WHERE clause will do a time comparison)
      @return {String} the equivalent string for the Date object passed

      @example
      $SP().toSPDate(new Date(2012,9,31), true); // --> "2012-10-31 00:00:00"
      $SP().toSPDate(new Date(2012,9,31)); // --> "2012-10-31"
    */
    toSPDate:function(oDate, includeTime) {
      var pad = function(p_str){
        if(p_str.toString().length==1){p_str = '0' + p_str;}
        return p_str;
      };
      var month   = pad(oDate.getMonth()+1);
      var day     = pad(oDate.getDate());
      var year    = oDate.getFullYear();
      var hours   = pad(oDate.getHours());
      var minutes = pad(oDate.getMinutes());
      var seconds = pad(oDate.getSeconds());
      return year+"-"+month+"-"+day+(includeTime?" "+hours+":"+minutes+":"+seconds : "");
    },
    /**
      @name $SP().toCurrency
      @function
      @category utils
      @description It will return a number with commas, currency sign and a specific number of decimals
      @param {Number|String} number The number to format
      @param {Number} [decimal=-1] The number of decimals (use -1 if you want to have 2 decimals when there are decimals, or no decimals if it's .00)
      @param {String} [sign='$'] The currency sign to add

      @return {String} The converted number
      @example

      $SP().toCurrency(1500000); // --> $1,500,000
      $SP().toCurrency(1500000,2,''); // --> 1,500,000.00
     */
    toCurrency:function(n,dec,sign) {
      n=Number(n);
      if (dec === undefined) dec=-1;
      if (sign === undefined) sign='$';
      var m="";
      if (n<0) { m="-"; n*=-1; }
      var s = n;
      if (dec===-1) s = s.toFixed(2).replace('.00', '');
      else s = s.toFixed(dec);
      var digits = (Math.floor(n) + '').length;
      for (var i=0, j=0, mod=digits%3; i<digits; i++) {
        if (i==0 || i%3!=mod) continue;
        s = s.substr(0, i+j) + ',' + s.substr(i+j);
        j++;
      }
      return (sign!=''?sign:'')+m+s+(sign!=''?'':' '+sign);
    },
    /**
      @name $SP().getLookup
      @function
      @category utils
      @description Split the ID and Value
      @param {String} text The string to retrieve data
      @return {Object} .id returns the ID, and .value returns the value
      @example $SP().getLookup("328;#Foo"); // --> {id:328, value:"Foo"}
    */
    getLookup:function(str) { if (!str) { return {id:"", value:""} } var a=str.split(";#"); return {id:a[0], value:a[1]}; },
    /**
      @name $SP().toXSLString
      @function
      @category utils
      @description Change a string into a XSL format string
      @param {String} text The string to change
      @return {String} the XSL version of the string passed
      @example $SP().toXSLString("Big Title"); // --> "Big_x0020_Title"
    */
    toXSLString:function(str) {
      if (typeof str !== "string") throw "Error 'toXLSString': '"+str+"' is not a string....";
      // if the first car is a number, then FullEscape it
      var FullEscape = function(strg) {
        var hexVals = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F");
        var rstr = "";
        for (var i=0; i < strg.length; i++) {
          var c = strg.charAt(i);
          var num = c.charCodeAt(0);
          var temp = 0;
          var hexString = "";
          while (num >= 16) {
            temp = num % 16;
            num = Math.floor(num / 16);
            hexString += hexVals[temp];
          }
          hexString += hexVals[num];
          var tmpStr = "";
          for (var k=hexString.length-1; k >= 0; k--) tmpStr += hexString.charAt(k);
          rstr += "%" + tmpStr;
        }
        return rstr;
      };
      var aSpaces = str.split(" ");
      var ret = "";
      // check if there is a number and work length is smaller than 5 letters
      if (/^[0-9]/.test(aSpaces[0]) && aSpaces[0].length < 5) {
        // change the first letter
        ret = FullEscape(str.charAt(0));
        str = str.substring(1);
      }
      for (var i=0; i < str.length; i++) {
        var c = str.charAt(i);
        if (/[0-9A-Za-z_]/.test(c) === false) ret += FullEscape(c).toLowerCase();
        else ret += c;
      }
      return ret.replace(/%([a-zA-Z0-9][a-zA-Z0-9])/g,"_x00$1_").substring(0,32);
    },
    /**
      @name $SP().formfields
      @namespace
      @description Retrieve the fields info in the NewForm and in the EditForm
      @return {Array} An array of hash with several keys: name, values, elements, type, and tr

      @param {String|Array} [fields=""] A list of fields to get (e.g. "field1,other field,field2" or ["field1","other field","field2"]) and by default we take all fields ... ATTENTION if you have a field with "," then use only the Array as a parameter
      @param {Object} [setup] Options (see below)
        @param {Boolean} [setup.mandatory=undefined] Set it to 'true' to look for the mandatory fields (the "false" value has no effect)
        @param {Boolean} [setup.cache=true] By default the form is scanned only once, but you can use {cache:false} to force the form to be rescanned

      @example
      $SP().formfields(); // return all the fields

      $SP().formfields({mandatory:true}).each(function() { // return all the mandatory fields
        var field = this;
        if (field.val().length==0) console.log(field.name()+" is empty!");
      });
      $SP().formfields("Title,Contact Name,Email").each(function() { // return these three fields
        var field = this;
        console.log(field.name()+" has these values: "+field.val());
      });
      // if you have a field with a comma use an Array
      $SP().formfields(["Title","Long field, isn't it?","Contact Name","Email"]).each(function() {
        var field = this;
        console.log(field.name()+" has the description: "+field.description());
      });
      // returns the fields "Title" and "New & York", and also the mandatory fields
      $SP().formfields(["Title", "New & York"],{mandatory:true});
    */
    formfields:function(fields, settings) {
      'use strict';
      this.reset();
      if (arguments.length == 1 && typeof fields === "object" && typeof fields.length === "undefined") { settings=fields; fields=undefined; }

      // default values
      settings = settings || {};
      fields   = fields   || [];
      settings.cache = (settings.cache === false ? false : true);

      var aReturn = [], bigLimit=10000;
      if (typeof fields === "string") fields=( fields==="" ? [] : fields.split(",") );
      var limit = (fields.length>0 ? fields.length : bigLimit);
      if (limit === bigLimit && !settings.mandatory) settings.includeAll=true; // if we want all of them

      // find all the fields, then cache them if not done already
      if (settings.cache && _SP_CACHE_FORMFIELDS !== null) {
        var allFields = _SP_CACHE_FORMFIELDS.slice(0);
        if (settings.includeAll) {
          this.length=allFields.length;
          this.data=allFields;
          return this;
        }
        var done=0,i,len=allFields.length,idx;
        // retrieve the field names
        var fieldNames=[];
        for (i=0;i<len;i++) fieldNames.push(allFields[i]._name)
        // search for the fields defined
        for (i=0; i<limit; i++) {
          idx=SPArrayIndexOf(fieldNames, fields[i]);
          if (idx > -1) aReturn.push(allFields[idx])
        }
        for (i=0,len=(settings.mandatory?allFields.length:0); i<len; i++) {
          if (allFields[i]._isMandatory && SPArrayIndexOf(fields, allFields[i]._name) === -1) aReturn.push(allFields[i])
        }
        this.length=aReturn.length;
        this.data=aReturn;
        return this;
      }

      settings.includeAll=true;
      settings.cache=true;

      // we use the HTML Comments to identify the fields
      var getFieldInfoFromComments=function(elem) {
        // code from http://stackoverflow.com/questions/13363946/how-do-i-get-an-html-comment-with-javascript
        var comments = [];
        // for IE < 9
        if (typeof document.createNodeIterator === "undefined") {
          // 8 according to the DOM spec
          var Node = {COMMENT_NODE:8};
          var children = elem.childNodes;

          for (var i=0, len=children.length; i<len; i++) {
            if (children[i].nodeType == Node.COMMENT_NODE) {
              comments.push(children[i].nodeValue);
            }
          }
        } else {
          var filterNone = function() { return NodeFilter.FILTER_ACCEPT };
          // Fourth argument, which is actually obsolete according to the DOM4 standard, is required in IE 11
          var iterator = document.createNodeIterator(elem, NodeFilter.SHOW_COMMENT, filterNone, false);
          var curNode;
          while (curNode = iterator.nextNode()) { // eslint-disable-line
            comments.push(curNode.nodeValue);
          }
        }

        var mtch = comments.join("").replace(/\s\s*/g," ").match(/FieldName="([^"]+)".* FieldInternalName="([^"]+)".* FieldType="([^"]+)"/)
        return (mtch ? {"Name":mtch[1], "InternalName":mtch[2], "SPType":mtch[3]} : {"Name":"", "InternalName":"", "SPType":""});
      };

      // Retrieve the text of an HTML element (from jQuery source)
      var getText = function(elem) {
        var i, node, nodeType = elem.nodeType, ret = "";
        if (nodeType) {
          if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
            // Use textContent || innerText for elements
            if (typeof elem.textContent === 'string') return elem.textContent;
            else if (typeof elem.innerText === 'string') {
              // Replace IE's carriage returns
              return elem.innerText.replace(/\r/g, '');
            } else {
              // Traverse its children
              for (elem = elem.firstChild; elem; elem = elem.nextSibling) ret += getText(elem);
            }
          } else if (nodeType === 3 || nodeType === 4) return elem.nodeValue;
        } else {
          // If no nodeType, this is expected to be an array
          for (i = 0; (node = elem[i]); i++) {
            // Do not traverse comment nodes
            if (node.nodeType !== 8) ret += getText(node);
          }
        }
        return ret;
      };

      // Select an OPTION into a SELECT based on it's text
      // params "text", "value", "all", "none"
      var setSelectedOption = function(select, val, params) {
        params = params || "text";
        var options = select.querySelectorAll('option');
        var v, isArray = SPIsArray(val);
        for (var o=0, len=options.length; o<len; o++) {
          if (params === "all") options[o].selected = true;
          else if (params === "none") options[o].selected = false;
          else {
            v = (params === "text" ? options[o].innerHTML : options[o].value);
            options[o].selected = (isArray ? SPArrayIndexOf(val, v) > -1 : (val == v));
          }
        }
      };
      // params can be "text", "value" or "both"
      var getSelectedOption = function(select, params) {
        params = params || "text";
        var options = select.querySelectorAll('option');
        var val=[], isMultiple = (select.getAttribute("multiple") !== null);
        for (var o=0, len=options.length; o<len; o++) {
          if (options[o].selected) {
            if (params === "text") {
              val.push(getText(options[o]));
              if (isMultiple) continue;
              return val[0]||"";
            }
            if (params === "value") {
              val.push(options[o].value);
              if (isMultiple) continue;
              return val[0]||"";
            }
            if (params === "both") {
              val.push({"text":getText(options[o]), "value":options[o].value});
              if (isMultiple) continue;
              return val[0]||"";
            }
          }
        }

        return (isMultiple ? val : (val.length===0 ? "" : val));
      };

      if (settings.includeAll) limit=bigLimit;

      // we now find the names of all fields
      // eslint-disable-next-line
      for (var a=document.querySelectorAll('td.ms-formbody'), i=-1, len=a.length, done=0; i<len && done<limit; i++) { // we start at -1 because of Content Type
        // eslint-disable-next-line
        var tr, td, isMandatory=false, html /* HTML content of the NOBR tag */, txt /* Text content of the NOBR tag */, infoFromComments, includeThisField=false;
        // eslint-disable-next-line
        var search; // if we have to search for a value
        var fieldName, obj, tmp;

        if (settings.includeAll) includeThisField=true;

        if (i === -1) { // handle the content type
          if (includeThisField || SPArrayIndexOf(fields, 'Content Type') > -1) {
            infoFromComments={"Name":"Content Type", "InternalName":"Content_x0020_Type", "SPType":"SPContentType"};
            includeThisField=true;
          }
        } else {
          tr = a[i].parentNode;
          td = tr.querySelector('td.ms-formbody');

          // get info from the comments
          infoFromComments = getFieldInfoFromComments(a[i]);
          if (!infoFromComments.Name) {
            // check if it's Attachments
            if (tr.getAttribute("id") === "idAttachmentsRow") {
              infoFromComments={"Name":"Attachments", "InternalName":"Attachments", "SPType":"SPAttachments"};
              includeThisField=true;
            }
            else continue;
          }

          // find the <nobr> to check if it's mandatory
          txt = tr.querySelector('td.ms-formlabel nobr');
          if (!txt) continue;
          // the text will finish by " *"
          txt = getText(txt);
          isMandatory = / \*$/.test(txt);

          // do we want the mandatory fields ?
          if (settings.mandatory && isMandatory) includeThisField=true;
          else {
            // check if the field is in the list
            if (limit !== bigLimit && SPArrayIndexOf(fields, infoFromComments.Name) > -1) {
              includeThisField=true;
              done++;
            }
          }
        }

        // the field must be included
        if (includeThisField) {
          fieldName = infoFromComments.Name;
          obj       = {
            _name: fieldName,
            _internalname: infoFromComments.InternalName,
            _isMandatory: isMandatory,
            _description: "", /* the field's description */
            _elements: [], /* the HTML elements related to that field */
            _tr: null, /* the TR parent node */
            _type: null /* the type of this field: checkbox, boolean */
          };

          if (fieldName === "Content Type") { // the Content Type field is different !
            obj._elements = document.querySelector('.ms-formbody select[title="Content Type"]');
            if (!obj._elements) continue;
            obj._type = "content type";
            obj._tr = obj._elements.parentNode.parentNode;
          } else
            obj._tr = tr;

          obj.val    = function() {};
          obj.elem   = function(usejQuery) {
            usejQuery = (usejQuery === false ? false : true);
            var aReturn = this._elements;
            var hasJQuery=(typeof jQuery === "function" && usejQuery === true);
            if (aReturn instanceof NodeList) aReturn = [].slice.call(aReturn)
            if (!SPIsArray(aReturn)) return hasJQuery ? jQuery(aReturn) : aReturn;
            switch(aReturn.length) {
              case 0: return hasJQuery ? jQuery() : null;
              case 1: return hasJQuery ? jQuery(aReturn[0]) : aReturn[0];
              default: return hasJQuery ? jQuery(aReturn) : aReturn;
            }
          };
          obj.description = function() { return this._description }
          obj.type = function() { return this._type }; // this function returns the type of the field
          obj.row  = function() { return (typeof jQuery === "function" ? jQuery(this._tr) : this._tr) }; // this function returns the TR parent node
          obj.name = function() { return this._name };
          obj.internalname = function() { return this._internalname };
          obj.isMandatory = function() { return this._isMandatory };
          obj.options = function() {};

          if (obj._name === "Attachments") {
            obj._type = "attachments";
            obj.elem = function(usejQuery) {
              usejQuery = (usejQuery === false ? false : true);
              var aReturn = document.getElementById('idAttachmentsRow').querySelector('.ms-formbody').querySelectorAll('tr');
              var hasJQuery=(typeof jQuery === "function" && usejQuery === true);

              switch(aReturn.length) {
                case 0: return hasJQuery ? jQuery() : null;
                case 1: return hasJQuery ? jQuery(aReturn[0]) : aReturn[0];
                default: return hasJQuery ? jQuery(aReturn) : aReturn;
              }
            }
            obj.val = function(v) {
              if (typeof v === "undefined") { // get
                v=[];
                var e=this.elem(false);
                if (e) {
                  if (!e.length) e=[e];
                  for (var i=0; i<e.length;i ++) {
                    v.push(getText(e[i].querySelector("span")));
                  }
                }
                return v;
              } else {
                return this;
              }
            }
          } else if (obj._name === "Content Type") {
            obj.val = function(v) {
              var e=this.elem(false);
              if (typeof v === "undefined") { // get
                return getSelectedOption(e, "text");
              } else {
                setSelectedOption(e, v, "text");
                eval("!function() {"+e.getAttribute("onchange").replace(/javascript:/,"")+"}()")
                return this;
              }
            };
          } else {
            // get the field description
            // Description in SP2013 is inside a .ms-metadata
            tmp = td.querySelector('.ms-metadata');
            if (tmp && tmp.parentNode == td) {
              obj._description = getText(tmp).trim();
            } else {
              // otherwise we use the last TextNode
              tmp = td.childNodes;
              tmp = tmp[tmp.length-1];
              if (tmp.nodeType==3) obj._description = getText(tmp).trim();
            }

            // work on fields based on SPType
            switch(infoFromComments.SPType) {
              case "SPFieldText":     // Single Line of Text
              case "SPFieldCurrency": // Currency
              case "SPFieldNumber": { // Number
                switch(infoFromComments.SPType) {
                  case "SPFieldCurrency": obj._type="currency"; break;
                  case "SPFieldNumber": obj._type="number"; break;
                  default: obj._type="text";
                }
                obj._elements.push(td.querySelector('input[type="text"]'));

                // val()
                obj.val = function(v) {
                  var e=this.elem(false);
                  if (typeof v !== "undefined") {
                    e.value = v;
                    return this
                  }
                  else return e.value;
                };

                break;
              }
              case "SPFieldNote": { // Multiple Line of Text
                obj._type = "text multiple";
                tmp = td.querySelector('textarea');
                // if there is no TEXTAREA then it means it's not a plain text
                if (tmp) {
                  obj._elements.push(tmp);

                  // val()
                  obj.val = function(v) {
                    var e=this.elem();
                    var type=this.type();
                    if (e[0].tagName.toLowerCase()==="iframe") { // "text multiple" on IE
                      var ifrm = (e.length===1 ? e[0]: e[1]);
                      var doc=(ifrm.contentDocument ? ifrm.contentDocument : ifrm.contentWindow.document);
                      if (v) doc.getElementsByTagName('div')[0].innerHTML=v;
                      else return doc.getElementsByTagName('div')[0].innerHTML;
                    } else {
                      if (typeof v !== "undefined") {
                        e[0].value=v
                        if (type === "text multiple") e[0].innerHTML=v
                      }
                      else return e[0].value
                    }
                    return this
                  };
                } else {
                  obj._type = "html multiple";
                  obj._elements.push(td.querySelector('div'));
                  // val()
                  obj.val = function(v) {
                    var e=this.elem();
                    e = e[0].querySelector('div[contenteditable]');
                    if (e) {
                      if (v !== undefined) {
                        e.innerHTML=v;
                      }
                      else {
                        return e.innerHTML.replace(/^<div class="?ExternalClass[0-9A-Z]+"?>([\s\S]*)<\/div>$/i,"$1").replace(/<span (rtenodeid="1" )?id="?ms-rterangecursor-start"?><\/span><span (rtenodeid="3" )?id="?ms-rterangecursor-end"?([^>]+)?><\/span>/gi,"").replace(/^<p>​<\/p>$/,""); // eslint-disable-line
                      }
                    }
                    return (v !== undefined ? this : null);
                  };
                }

                break;
              }
              case "SPFieldUser":
              case "SPFieldUserMulti": { // Person or Group
                obj._type = "people" + (infoFromComments.SPType === "SPFieldUserMulti" ? " multiple" : "");
                tmp = td.querySelector('div[contenteditable="true"]');
                if (!tmp) obj._elements.push(td.querySelector('div[id]')); // Sharepoint 2013
                else {
                  // for Sharepoint 2010
                  obj._elements.push(tmp);
                  obj._elements.push(td.querySelector('textarea'));
                  !function() {
                    var a = td.querySelectorAll('a');
                    for (var i=0; i < a.length; i++) obj._elements.push(a[i])
                  }();
                }
                // the description is different for SP2010
                if (typeof GetPickerControlValue === "function") {
                  tmp = td.querySelector('table.ms-usereditor');
                  if (tmp) {
                    tmp = tmp.querySelectorAll('span');
                    if (tmp) obj._description = getText(tmp[tmp.length-1]).trim();
                  }
                }

                // 'v' can be {extend:true} to get all the info from SP2013
                obj.val = function(v) {
                  var tmp, res=[], extend=false, id, elems=this.elem(false);
                  if (typeof v === "object" && !SPIsArray(v) && v.extend === true) {
                    v = void 0;
                    extend=true;
                  }

                  // get people picker ID
                  id=(SPIsArray(elems) ? elems[0] : elems).getAttribute("id").replace(/_upLevelDiv$/,"")
                  // get
                  if (typeof v === "undefined") {
                    // if GetPickerControlValue is defined -- SP2010
                    if (typeof GetPickerControlValue === "function") {
                      if (extend === false) {
                        return GetPickerControlValue(id, false, true).trim(); // eslint-disable-line
                      } else {
                        v = GetPickerControlValue(id, false, false); // eslint-disable-line
                        // we try to extract data from there
                        tmp = document.createElement('div');
                        tmp.innerHTML = v;
                        v = tmp.querySelector('#divEntityData');
                        return (v ? {"Key":v.getAttribute("key"), "DisplayText":v.getAttribute("DisplayText")} : {"Key":"", "DisplayText":GetPickerControlValue(id, false, true).trim()}) // eslint-disable-line
                      }
                    } else { // SP2013
                      if (typeof SPClientPeoplePicker === "function") {
                        tmp = SPClientPeoplePicker.SPClientPeoplePickerDict[id]; // eslint-disable-line
                        // if it exists
                        if (tmp) {
                          tmp = tmp.GetAllUserInfo();
                          if (extend) return (tmp.length === 0 ? {"Key":"", "DisplayText":""} : (tmp.length === 1 ? tmp[0] : tmp)); // if we want "extend"
                          else {
                            // return the DisplayText
                            SPArrayForEach(tmp, function(e) { res.push(e.DisplayText) });
                            return (res.length === 0 ? "" : (res.length === 1 ? res[0] : res))
                          }
                        } else {
                          return "";
                        }
                      } else {
                        // if we don't have SPClientPeoplePicker for some reasons...
                        return JSON.parse(this.elem(false).querySelector('input').value)[0].ResolveText
                      }
                    }
                  } else { // set
                    // if EntityEditorCallback is defined -- SP2010
                    if (typeof EntityEditorCallback === "function") {
                      if (!SPIsArray(v)) v=[v];
                      tmp = '<Entities Append="False" Error="" Separator=";" MaxHeight="3">';
                      SPArrayForEach(v, function(e) {
                        tmp += '<Entity Key="' + e + '" DisplayText="' + e + '" IsResolved="False" Description="' + e + '"><MultipleMatches /></Entity>'
                      });
                      tmp += '</Entities>';
                      EntityEditorCallback(tmp, id, false); // eslint-disable-line
                      v=getUplevel(id); // eslint-disable-line
                      // check the value passed
                      WebForm_DoCallback(id.replace(/(ctl\d+)(\_)/g,"$1\$").replace(/(^ctl\d+\$m)(\_)/,"$1\$").replace(/\_ctl/,"\$ctl"),v,EntityEditorHandleCheckNameResult,id,EntityEditorHandleCheckNameError,true); // eslint-disable-line
                    } else { // SP2013
                      if (typeof SPClientPeoplePicker === "function") {
                        res = SPClientPeoplePicker.SPClientPeoplePickerDict[id]; // eslint-disable-line
                        if (res) {
                          // first we remove the existing values
                          tmp = document.getElementById(res.ResolvedListElementId);
                          if (tmp) {
                            tmp = tmp.querySelectorAll('span');
                            id = tmp.length;
                            while(id--) {
                              res.DeleteProcessedUser();
                            }
                          }

                          if (SPIsArray(v)) v=v.join(";")
                          res.AddUserKeys(v, false)
                        } else {
                          throw new Error("$SP().formfields().val() failed with a People Picker, because SPClientPeoplePicker.SPClientPeoplePickerDict['"+id+"'] returned an unexpected value");
                        }
                      } else {
                        throw new Error("$SP().formfields().val() failed with a People Picker, because EntityEditorCallback and SPClientPeoplePicker are not available!");
                      }
                    }

                    return this;
                  }
                }
                break;
              }
              case "SPFieldChoice":
              case "SPFieldMultiChoice": { // Choices
                obj._type = "choices";
                // if there is a TABLE then there is more (radio, fillin box, ...)
                tmp = td.querySelector('table');
                if (!tmp) obj._elements = td.querySelector('select');
                else {
                  tmp = td.querySelector('select');
                  if (tmp) { // if there is a select then it's a normal dropdown with a fillin box
                    obj._type = "choices plus";
                    obj._elements = td.querySelectorAll('input,select');
                  } else {
                    // checkbox or radio
                    tmp = td.querySelector('input[type="checkbox"]');
                    if (tmp) { // checkbox
                      obj._type = "choices checkbox";
                    } else {
                      obj._type = "choices radio";
                    }
                    tmp = td.querySelector('input[type="text"]');
                    if (tmp) { // checkbox with fillin box
                      obj._type += " plus";
                    }
                    obj._elements = td.querySelectorAll('input')
                  }
                }

                obj.val = function(v) {
                  var elems = this.elem(false), i, hasOption, len;
                  var type=this.type();
                  if (typeof v === "undefined") { // get
                    switch(type) {
                      case "choices": { // dropdown
                        return getSelectedOption(elems, "text");
                      }
                      case "choices plus": { // dropdown with fillin
                        // find if we get data from the dropdown or the fillin
                        return (elems[0].checked ? getSelectedOption(elems[1], "text") : elems[3].value);
                      }
                      case "choices radio": { // radio buttons
                        for (i=0; i < elems.length; i++) {
                          if (elems[i].checked) return getText(elems[i].nextSibling);
                        }
                        return "";
                      }
                      case "choices radio plus": { // radio buttons with fillin
                        for (i=0; i < elems.length-2; i++) {
                          if (elems[i].checked) return getText(elems[i].nextSibling)
                        }
                        if (elems[i].checked) return elems[i+1].value
                        return "";
                      }
                      case "choices checkbox":
                      case "choices checkbox plus": { // checkboxes
                        v=[], hasOption=(type==="choices checkbox plus"), len=elems.length;
                        if (hasOption) len--;
                        for (i=0; i < len; i++) {
                          if (elems[i].checked) {
                            v.push(hasOption && i+1===len ? elems[len].value : getText(elems[i].nextSibling));
                          }
                        }
                        return v;
                      }
                    }
                  } else { // set
                    switch(type) {
                      case "choices": { // dropdown
                        setSelectedOption(elems, v, "text");
                        break;
                      }
                      case "choices plus": {
                        // try to select into the dropdown
                        elems[0].checked=true;
                        setSelectedOption(elems[1], v, "text");
                        if (getSelectedOption(elems[1], "text") !== v) {
                          // if it didn't work, then set the value in the fillin box
                          elems[2].checked=true;
                          elems[3].value=v;
                        } else elems[3].value="";
                        break;
                      }
                      case "choices checkbox":
                      case "choices checkbox plus": {
                        if (!SPIsArray(v)) v=[v];
                        len = elems.length;
                        if (type === "choices checkbox plus") len -= 2;
                        for (i=0; i<len; i++) {
                          idx = SPArrayIndexOf(v, getText(elems[i].nextSibling));
                          if (idx > -1) {
                            elems[i].checked=true;
                            v.splice(idx, 1);
                          } else {
                            elems[i].checked=false
                          }
                        }
                        // find if we need to add a value into the fillin box
                        if (type === "choices checkbox plus") {
                          if (v.length > 0) {
                            elems[elems.length-2].checked=true;
                            elems[elems.length-1].value=v[0];
                          } else {
                            elems[elems.length-2].checked=false;
                            elems[elems.length-1].value="";
                          }
                        }
                        break;
                      }
                      case "choices radio":
                      case "choices radio plus": {
                        hasOption=false;
                        len=elems.length;
                        if (type === "choices radio plus") len -= 2;
                        for (i=0; i<len; i++) {
                          if (getText(elems[i].nextSibling) == v) {
                            elems[i].checked=true;
                            hasOption=true;
                            break;
                          }
                        }
                        if (type === "choices radio plus") {
                          if (!hasOption) {
                            // for fillin box when no option has been selected
                            elems[i].checked=true;
                            elems[i+1].value=v;
                          } else elems[i+1].value="";
                        }
                        break;
                      }
                    }
                  }
                  return this;
                }
                break;
              }
              case "SPFieldDateTime": { // Date
                obj._type = "date";
                tmp = td.querySelectorAll('input,select,a')
                if (tmp.length > 2) obj._type += " time";
                obj._elements = obj._elements.concat(tmp);
                obj.val = function(v) {
                  var e=this.elem();
                  if (typeof v !== "undefined") { // set
                    if (!SPIsArray(v)) v = [ v ];
                    e[0].value = v[0];
                    if (e.length === 4) {
                      if (v.length > 1) setSelectedOption(e[2], v[1]);
                      if (v.length > 2) setSelectedOption(e[3], v[2]);
                    }
                    return this
                  } else { // get
                    return (e.length === 4 ? [ e[0].value, getSelectedOption(e[2], "text"), e[3].value ] : e[0].value);
                  }
                }
                break;
              }
              case "SPFieldLookup":
              case "SPFieldLookupMulti": {
                obj._type = "lookup";
                obj._elements = td.querySelectorAll('select,input[id$="Button"],button');
                if (infoFromComments.SPType==="SPFieldLookupMulti") {
                  obj._type += " multiple";
                } else obj._elements = obj._elements[0];

                // params: {selectReturn} with "text", "value" or "both"
                obj.val = function(v) {
                  var params = "text";
                  if (typeof v === "object" && !SPIsArray(v)) {
                    params = v.selectReturn || "text";
                    v = void 0;
                  }
                  var type=this.type();

                  var e = this.elem(false), o;
                  if (typeof v !== "undefined") {
                    if (type === "lookup multiple") {
                      if (!SPIsArray(v)) v = [ v ];
                      //  we want to use the Add/Remove buttons -- the behavior changes between SP2010 and SP2013
                      var clickAdd = e[1].getAttribute("onclick");
                      var clickRemove = e[2].getAttribute("onclick");
                      var masterGroup = window[e[1].getAttribute("id").replace(/AddButton/,"MultiLookup_m")]; // SP2013

                      // reset all from the last select
                      setSelectedOption(e[3], "", "all");
                      if (clickRemove) eval("!function() {"+clickRemove+"}()");
                      else if (typeof GipRemoveSelectedItems === "function") {
                        GipRemoveSelectedItems(masterGroup) // eslint-disable-line
                      }
                      setSelectedOption(e[0], "", "none");
                      // then we want to select in the same order
                      for (o=0; o<v.length; o++) {
                        // select what we want in the first box
                        setSelectedOption(e[0], v[o], params);
                        // click the button
                        if (clickAdd) eval("!function() {"+clickAdd+"}()");
                        else if (typeof GipAddSelectedItems === "function") {
                          GipAddSelectedItems(masterGroup) // eslint-disable-line
                        }
                      }
                    } else {
                      setSelectedOption(e, v, params);
                    }
                  } else {
                    if (type === "lookup multiple") {
                      e = e[3].querySelectorAll('option');
                      v=[];
                      for (o=0; o<e.length; o++) {
                        v.push(params === "text" ? getText(e[o]) : e[o].value)
                      }
                      return (v.length === 0 ? "" : v);
                    } else return getSelectedOption(e, params)
                  }

                  return this;
                }
                break;
              }
              case "SPFieldBoolean": {
                obj._type = "boolean";
                obj._elements = td.querySelector('input');
                // val()
                obj.val = function(v) {
                  var e=this.elem(false);
                  if (typeof v !== "undefined") {
                    e.checked = (v == true);
                    return this;
                  }
                  return e.checked
                }
                break;
              }
              case "SPFieldURL": {
                obj._type = "url";
                obj._elements = td.querySelectorAll('span.ms-formdescription,input');
                // val()
                obj.val = function(v) {
                  var e = this.elem();
                  if (typeof v !== "undefined") {
                    if (!SPIsArray(v)) v = [ v, v ];
                    if (v.length < 2) v = [ v[0], v[0] ];
                    e[1].value = v[0];
                    e[3].value = v[1];
                  }
                  return [ e[1].value, e[3].value ]
                }
                break;
              }
            }
          }
        }
        aReturn.push(obj);
      }

      // cache the result
      _SP_CACHE_FORMFIELDS = aReturn.slice(0);
      settings.includeAll=false;
      return this.formfields(fields, settings)
    },
    /**
      @name $SP().formfields.each
      @function
      @description Permits to go thru the different fields
      @example
      // To print in the console the names of all the fields
      $SP().formfields().each(function() {
        console.log(this.name()); // -> return the name of the field
        console.log(this.isMandatory()); // -> returns TRUE if it's a mandatory field
      })
    */
    each:function(fct) {
      for (var i=0,len=this.data.length; i<len; i++) fct.call(this.data[i])
      return this;
    },
    /**
      @name $SP().formfields.val
      @function
      @description Set or Get the value(s) for the field(s) selected by "formfields"
      @param {String|Array} [value=empty] If "str" is specified, then it means we want to set a value, if "str" is not specified then it means we want to get the value
      @param {Object} options
        @param {Boolean} [identity=false] If set to TRUE then the return values will be a hashmap with "field name" => "field value"
        @param {Boolean} [extend=false} In the case of a PeoplePicker under SP2013 it will return the People object
      @return {String|Array|Object} Return the value of the field(s)

      @example
      $SP().formfields("Title").val(); // return "My project"
      $SP().formfields("Title").val("My other project");
      $SP().formfields("Title").val(); // return "My other project"

      // it will set "Choice 1" and "Choice 2" for the "Make your choice" field, and "2012/12/31" for the "Booking Date" field
      $SP().formfields("Make your choice,Booking Date").val([ ["Choice 1","Choice 2"], "2012/12/31" ]);

      // it will set "My Value" for all the fields
      $SP().formfields("Make your choice,Title,Other Field").val("My Value");

      // it will return an array; each item represents a field
      $SP().formfields("Make your choice,Title,Other Field").val(); // -> [ ["My Value"], "My Value", "Other Field" ]

      // for a Link field
      $SP().formfields("Link").val(["http://www.dell.com","Dell"]) // -> "Dell" is used as the description of the link, and "http://www.dell.com" as the Web address

      // it will return a hashmap
      $SP().formfields("Make your choice,Title,Other Field").val({identity:true}); // -> {"Make your choice":["My Value"], "Title":"My Value", "Other Field":"My Value"}

      // for SP2013 people picker
      $SP().formfields("Manager Name").val({extend:true}); // -> [ { Key="i:0#.w|domain\john_doe",  Description="domain\john_doe",  DisplayText="Doe, John",  ...} ]
      $SP().formfields("Manager Name").val(); // -> "Doe, John"
    */
    val:function(str) {
      var identity=false, extend=false;
      if (typeof str==="object" && !SPIsArray(str)) {
        identity = (str.identity === true ? true : false);
        extend = (str.extend === true ? true : false);
        str=void 0;
      }

      // it means we want to get the value
      if (typeof str === "undefined") {
        var aReturn = [];
        this.each(function() {
          if (identity===true) aReturn[this.name()] = this.val()
          else {
            // if extend is true, then make sure it's a people picker
            if (extend===true && this.type().slice(0,6) === "people")
              aReturn.push(this.val({extend:extend}))
            else
              aReturn.push(this.val())
          }
        })
        if (aReturn.length === 0) return "";
        return (aReturn.length===1 ? aReturn[0] : aReturn)
      } else {
        if (typeof str !== "object") { // we want to set a simple value
          this.each(function() { this.val(str) });
        } else {
          var i=0;
          if (this.length>1) {
            if (str.length !== this.length) throw new Error("$SP.formfields.val: the array passed for val() must have the same size as the number of fields in formfields()")
            this.each(function() { this.val(str[i++]) })
          } else this.each(function() { this.val(str) })
        }
      }

      return this;
    },
    /**
      @name $SP().formfields.elem
      @function
      @description Get the HTML element(s) tied with the field(s) selected by "formfields"
      @param {Boolean} [usejQuery=true] If jQuery is loaded, then by default the elements will be jQuery object; use FALSE to get the regular DOM elements
      @return {Array|HTMLElement|jQuery} Null is returned if nothing is found, or the found elements... if jQuery is defined then the HTML elements will be jQueryrize

      @example
      $SP().formfields("Title").elem(); // -> returns a HTML INPUT TEXT
      $SP().formfields("List of options").elem(); // -> returns a HTML SELECT
    */
    elem:function(usejQuery) {
      usejQuery = (usejQuery === false ? false : true);
      var aReturn = [];
      var hasJQuery=(typeof jQuery === "function" && usejQuery === true);
      this.each(function() {
        var e = this.elem(false);
        if (e instanceof NodeList) e = [].slice.call(e);
        aReturn=aReturn.concat(e)
      })

      switch(aReturn.length) {
        case 0: return hasJQuery ? jQuery() : null;
        case 1: return hasJQuery ? jQuery(aReturn[0]) : aReturn[0];
        default: return hasJQuery ? jQuery(aReturn) : aReturn;
      }
    },
    /**
      @name $SP().formfields.row
      @function
      @description Get the TR element(s) tied with the field(s) selected by "formfields"
      @return {Array|HTMLElement|jQuery} Null is returned if nothing is found, or the TR HTMLElement... or a jQuery object is returned if jQuery exists

      @example
      $SP().formfields("Title").row(); // return the TR element that is the parent (= the row)
      $SP().formfields("Title").row().hide(); // because we have jQuery we can apply the hide()
    */
    row:function() {
      var aReturn = [];
      var hasJQuery=(typeof jQuery === "function");
      this.each(function() {
        var row=this.row();
        if (row instanceof jQuery === true) row=row[0]
        aReturn.push(row)
      })

      switch(aReturn.length) {
        case 0: return (hasJQuery ? jQuery() : null);
        case 1: return (hasJQuery ? jQuery(aReturn[0]) : aReturn[0]);
        default: return (hasJQuery ? jQuery(aReturn) : aReturn);
      }
    },
    /**
      @name $SP().formfields.type
      @function
      @description Get the type of the field(s) selected by "formfields"
                   Here is the list of different types returned:
                   - "text" for the free text field;
                   - "number" for Number field;
                   - "currency" for Currency field;
                   - "text multiple" for the multiple lines of plain text;
                   - "html multiple" for the multiple lines of text in rich mode;
                   - "attachments" for the attachments field;
                   - "lookup" for a lookup field (dropdown);
                   - "lookup multiple" for a lookup field with multiple selection (two dropdowns with two buttons);
                   - "content type" for the content type field;
                   - "boolean" for the yes/no checkbox;
                   - "date" for a date only field;
                   - "date time" for a date and time field;
                   - "choices" for a dropdown selection;
                   - "choices plus" for a dropdown selection with an input field to enter our own value;
                   - "choices radio" for the radio buttons selection;
                   - "choices radio plus" for the radio buttons selection with an input field to enter our own value;
                   - "choices checkbox" for the checkboxes field for a selection;
                   - "choices checkbox plus" for the checkboxes field for a selection with an input field to enter our own value;
                   - "people" for the people picker field;
                   - "people multiple" for the people picker field with multiple selection;
                   - "url" for the link/url/picture field.

      @return {String|Array} Returns the type of the field(s)

      @example
      $SP().formfields("Title").type(); // return "text"
      $SP().formfields("List of options").type(); // return "choices"
    */
    type:function() {
      var aReturn = [];
      this.each(function() { aReturn.push(this.type()) })

      switch(aReturn.length) {
        case 0: return "";
        case 1: return aReturn[0];
        default: return aReturn;
      }
    },
    /**
      @name $SP().formfields.description
      @function
      @description Get the description of the field(s) selected by "formfields"

      @return {String|Array} Returns the description of the field(s)

      @example
      $SP().formfields("Title").description(); // return "This is the description of this field"
      $SP().formfields("List of options").description(); // return "", it means no description
    */
    description:function() {
      var aReturn = [];
      this.each(function() { aReturn.push(this.description()) })

      switch(aReturn.length) {
        case 0: return "";
        case 1: return aReturn[0];
        default: return aReturn;
      }
    },
    /**
      @name $SP().formfields.isMandatory
      @function
      @description Say if a field is mandatory

      @return {Boolean|Array} Returns the mandatory status of the field(s)

      @example
      $SP().formfields("Title").isMandatory(); // return True or False
      $SP().formfields(["Field1", "Field2"]).isMandatory(); // return [ True/False, True/False ]
    */
    isMandatory:function() {
      var aReturn = [];
      this.each(function() { aReturn.push(this.isMandatory()) })

      switch(aReturn.length) {
        case 0: return false;
        case 1: return aReturn[0];
        default: return aReturn;
      }
    },
    /**
      @name $SP().formfields.name
      @function
      @description Return the field name

      @return {String|Array} Returns the name of the field(s)

      @example
      $SP().formfields("Subject").name(); // return "Subject"
      $SP().formfields(["Field Name", "My Field"]).name(); // return [ "Field Name", "My Field" ]
    */
    name:function() {
      var aReturn = [];
      this.each(function() { aReturn.push(this.name()) })

      switch(aReturn.length) {
        case 0: return "";
        case 1: return aReturn[0];
        default: return aReturn;
      }
    },
    /**
      @name $SP().formfields.internalname
      @function
      @description Return the field internalname

      @return {String|Array} Returns the internalname of the field(s)

      @example
      $SP().formfields("Subject").internalname(); // return "Title"
      $SP().formfields(["Field Name", "My Field"]).internalname(); // return [ "Field_x0020_Name", "My_x0020_Field" ]
    */
    internalname:function() {
      var aReturn = [];
      this.each(function() { aReturn.push(this.internalname()) })

      switch(aReturn.length) {
        case 0: return "";
        case 1: return aReturn[0];
        default: return aReturn;
      }
    },
    /**
      @name $SP().notify
      @function
      @category modals
      @description Permits to notify the user using the SP.UI.Notify.addNotification system

      @param {String} message Message to show
      @param {Object} [options]
        @param {Integer}  [options.timeout=5] The number of seconds that the notification is shown
        @param {Boolean}  [options.override=false] This option to TRUE permits to remove the previous/current notification that is showing (even if the timeout is not over and even if it's a sticky) and replace it with the new one
        @param {Boolean}  [options.overrideAll=false] Same as previously except that it will remove *all* the previous notifications that are currently showing
        @param {Boolean}  [options.overrideSticky=true] When "overrideAll:true" then even the sticky notifications are removed, but you can block this behavior with "overrideSticky:false"
        @param {Boolean}  [options.sticky=false] Keep the notification on the screen until it's manually removed (or automatically removed with "overrideAll:true" and "overrideSticky:true")
        @param {String}   [options.name=random()] You can give a name to the notification (to use it with $SP().removeNotify('name'))
        @param {Function} [options.after=function(name,afterDelay){}] You can call this function when the notification is removed -- the argument "name" is the name of the notification (see previous option), the argument "afterDelay" is TRUE when the notification has been removed by the system after it's normal timeout

      @example
      $SP().notify('Processing the data...', {sticky:true}); // the notification will stay on the screen until we remove it
      $SP().notify('All done!', {overrideAll:true}); // the "Processing the data..." is removed from the screen and a 5 seconds message says "All done!"

      $SP().notify('Please wait 10 seconds...', {
        name:"My 10 seconds notification",
        timeout:10,
        after:function(name,afterDelay) {
          if (afterDelay) alert("OK, you waited during 10 seconds!")
          else alert("Something just removed this notification called '"+name+"'' before the timeout :-(")
        }
      })
    */
    notify:function(message,options) {
      var _this=this;
      if (message === undefined) throw "Error 'notify': you must provide the message to show."
      if (typeof message !== "string") throw "Error 'notify': you must provide a string for the message to show."

      options = options || {};
      options.timeout = (!isNaN(options.timeout) ? options.timeout : 5);
      options.override = (options.override === true ? true : false);
      options.overrideAll = (options.overrideAll === true ? true : false);
      options.overrideSticky = (options.overrideSticky === false ? false : true);
      options.sticky = (options.sticky === true ? true : false);
      options.name = options.name || new Date().getTime();
      options.after = options.after || function(){};

      // [internal use] "fake" is used just to treat the queue due to the notifications ready
      options.fake = (options.fake === true ? true : false);
      // [internal use] "ignoreQueue" is when we want to treat directly the message without flushing the queue
      options.ignoreQueue = (options.ignoreQueue === true ? true : false);

      if (_SP_NOTIFY_READY === false) {
        _SP_NOTIFY_QUEUE.push({message:message, options:options});
        $(document).ready(function() {
          // we need core.js and sp.js
          ExecuteOrDelayUntilScriptLoaded(function() { // eslint-disable-line
            ExecuteOrDelayUntilScriptLoaded(function() { // eslint-disable-line
              _SP_NOTIFY_READY=true;
              _this.notify("fake",{fake:true});
            }, "core.js")
          }, "sp.js")
        })
        return _this
      } else {
        // check if we don't have some notifications in queue first
        if (options.ignoreQueue!==true) {
          while (_SP_NOTIFY_QUEUE.length > 0) {
            var a = _SP_NOTIFY_QUEUE.shift();
            a.options.ignoreQueue=true;
            _this.notify(a.message, a.options);
          }
        }
        if (options.fake===true) return;

        // for the override options
        if (_SP_NOTIFY.length > 0) {
          if (options.overrideAll)
            _this.removeNotify({all:true, includeSticky:options.overrideSticky})
          else if (options.override)
            _this.removeNotify(_SP_NOTIFY[_SP_NOTIFY.length-1].name)
        }

        _SP_NOTIFY.push({name:options.name, id:SP.UI.Notify.addNotification(message, true), options:options}) // eslint-disable-line
      }

      // setup a timeout
      if (!options.sticky) {
        setTimeout(function() {
          _this.removeNotify(options.name, {timeout:true})
        }, options.timeout*1000)
      }

      return _this;
    },
    /**
      @name $SP().removeNotify
      @function
      @category modals
      @description Permits to remove a notification that is shown on the screen

      @param {String} [name] Name of the notification
      @param {Object} [options] If you pass the options, then the 'name' is ignored
        @param {Boolean} [options.all=false] To TRUE to remove ALL notifications
        @param {Boolean} [options.includeSticky=true] To FALSE if you don't want to remove the sticky notifications (only works with the "all:true" option)

      @example
      $SP().notify('Processing the data...', {sticky:true,name:"Processing data"}); // the notification will stay on the screen until we remove it
      $SP().removeNotify("Processing data"); // the notification is removed

      $SP().notify('Doing some stuff...');
      $SP().notify('Doing some other stuff...');
      $SP().removeNotify({all:true}); // all the notifications are removed

      $SP().notify('Doing some stuff...');
      $SP().notify('Doing some other stuff...');
      $SP().notify('This is a sticky message', {sticky:true});
      $SP().removeNotify({all:true, includeSticky:false}); // all the notifications are removed except the sticky one
    */
    removeNotify:function(name,options) {
      var _this=this;
      switch (arguments.length) {
        case 0: throw "Error 'removeNotify': you must provide 'name' or 'options'."
        case 2: {
          if (typeof options !== "object") throw "Error 'removeNotify': you must provide an object for 'options'."
        }
      }

      if (arguments.length === 1 && typeof name === "object") {
        options = name;
        name = undefined;
      }
      options = options || {all:false};
      // [internal use] timeout is a boolean to say if it's a timeout remove or if we forced it
      options.timeout = (options.timeout === true ? true : false);

      // make sure we are ready
      if (_SP_NOTIFY_READY === false && _SP_NOTIFY_QUEUE.length > 0) {
        setTimeout(function() { _this.removeNotify(name, options) }, 150)
        return _this;
      }

      var notif;
      // if we want to delete all the notifications
      if (options.all === true) {
        var a=[]
        while (_SP_NOTIFY.length > 0) {
          notif = _SP_NOTIFY.shift();
          if (options.includeSticky === false && notif.options.sticky === true) a.push(notif)
          else {
            SP.UI.Notify.removeNotification(notif.id); // eslint-disable-line
            setTimeout(function() { notif.options.after.call(_this, notif.name, false) }, 150)
          }
        }
        _SP_NOTIFY = a.slice(0); // if we want to keep the sticky notifs
      } else if (name !== undefined) {
        // search for the notification
        for (var i=0,len=_SP_NOTIFY.length; i<len; i++) {
          if (_SP_NOTIFY[i].name == name) {
            notif = _SP_NOTIFY.splice(i,1)[0];
            SP.UI.Notify.removeNotification(notif.id); // eslint-disable-line
            setTimeout(function() { notif.options.after.call(_this, notif.name, options.timeout) }, 150)
            return _this;
          }
        }
      }
      return _this;
    },
    /**
      @ignore
      @name $SP()._getPageSize()
      @function
      @description Get the doc and viewport size
      @source https://blog.kodono.info/wordpress/2015/03/23/get-window-viewport-document-height-and-width-javascript/
     */
    _getPageSize:function(win) {
      var vw = {width:0, height:0};
      var doc = {width:0, height:0};
      var w=win||window, d=w.document, dde=d.documentElement, db=d.getElementsByTagName('body')[0];

      // viewport size
      vw.width  = w.innerWidth||dde.clientWidth||db.clientWidth;
      vw.height = w.innerHeight||dde.clientHeight||db.clientHeight;

      // document size
      doc.width  = Math.max(db.scrollWidth, dde.scrollWidth, db.offsetWidth, dde.offsetWidth, db.clientWidth, dde.clientWidth);
      doc.height = Math.max(db.scrollHeight, dde.scrollHeight, db.offsetHeight, dde.offsetHeight, db.clientHeight, dde.clientHeight);

      // if IE8 there is a bug with 4px
      if (!!(document.all && document.querySelector && !document.addEventListener) && (vw.width+4 == doc.width) && (vw.height+4 == doc.height)) {
        vw.width=doc.width;
        vw.height=doc.height;
      }

      return {vw:vw, doc:doc};
    },
    /**
      @name $SP().showModalDialog
      @function
      @category modals
      @description Show a modal dialog (based on SP.UI.ModalDialog.showModalDialog) but provides some advanced functions and better management of the modals (for example when you launch several modals)

      @param {Object} [options] Regular options from http://msdn.microsoft.com/en-us/library/office/ff410058%28v=office.14%29.aspx with some additional ones or some changes
        @param {String} [options.html] We can directly provide the HTML code as a string
        @param {String} [options.width] If equals to "calculated", then we use the 2/3 of the viewport width; if equals to "full" then we use the full viewport width; otherwise see the original documentation (https://msdn.microsoft.com/en-us/library/office/ff410058(v=office.14).aspx)
        @param {String} [options.height] If equals to "calculated", then we use 90% of the viewport height; if equals to "full" then we use the full viewport height; otherwise see the original documentation (https://msdn.microsoft.com/en-us/library/office/ff410058(v=office.14).aspx)
        @param {Boolean} [options.closePrevious=false] It permits to close a previous modal dialog before opening this one
        @param {Boolean} [options.wait=false] If we want to show a Wait Screen (alias for $SP().waitModalDialog())
        @param {String} [options.id=random()] An unique ID to identify the modal dialog (don't use space or special characters)
        @param {Function} [options.callback] A shortcut to `dialogReturnValueCallback` with dialogResult and returnValue
        @param {Function} [options.onload] The modal might be delayed as we need to load some Sharepoint JS files; the `onload` function is called once the modal is shown
        @param {Function} [options.onurlload] When we use the "url" parameter, this is triggered when the DOMContent of the iframe is loaded (if it's the same origin)
        @param {String} [options.title] The title to give to the modal (if you use `wait:true` then it will be the main text that will appear on 2013, and the modal title for 2010)
        @param {String} [options.message] This parameter is only use if there is `wait:true` and permits to define the subtitle message for 2013, or the main message for 2010
        @param {String} [options.url] A string that contains the URL of the page that appears in the dialog. If both url and html are specified, url takes precedence. Either url or html must be specified.
        @param {Number} [options.x] An integer value that specifies the x-offset of the dialog. This value works like the CSS left value.
        @param {Number} [options.y] An integer value that specifies the y-offset of the dialog. This value works like the CSS top value.
        @param {Boolean} [options.allowMaximize] A Boolean value that specifies whether the dialog can be maximized. true if the Maximize button is shown; otherwise, false.
        @param {Boolean} [options.showMaximized] A Boolean value that specifies whether the dialog opens in a maximized state. true the dialog opens maximized. Otherwise, the dialog is opened at the requested sized if specified; otherwise, the default size, if specified; otherwise, the autosized size.
        @param {Boolean} [options.showClose=true] A Boolean value that specifies whether the Close button appears on the dialog.
        @param {Boolean} [options.autoSize] A Boolean value that specifies whether the dialog platform handles dialog sizing.

      @example
      $SP().showModalDialog({
        title:"Dialog",
        html:'&lt;h1>Hello World&lt;/h1>&lt;p>&lt;button type="button" onclick="$SP().closeModialDialog(\'here\')">Close&lt;/button>&lt;/p>',
        callback:function(dialogResult, returnValue) {
          alert("Result="+dialogResult); // -> "here"
        }
      })

      // show a waiting message
      $SP().waitModalDialog("Working...");
      // --- do some stuff ---
      // close the waiting message and open a new modal dialog
      $SP().showModalDialog({
        closePrevious:true,
        title:"Success",
        html:'&lt;h1>Done!&lt;/h1>'
      })
      // and use $SP().closeModalDialog() to close it
     */
    showModalDialog:function(options) {
      var _this=this;
      // in some weird cases the script is not loaded correctly, so we need to ensure it
      if (!_SP_MODALDIALOG_LOADED) {
        _SP_MODALDIALOG_LOADED=(typeof SP === "object" && typeof SP.UI === "object" && typeof SP.UI.ModalDialog === "function" && typeof SP.UI.ModalDialog.showModalDialog === "function"); // eslint-disable-line
        if (!_SP_MODALDIALOG_LOADED) {
          LoadSodByKey("sp.ui.dialog.js", function() { // eslint-disable-line
            _SP_MODALDIALOG_LOADED=true;
            _this.showModalDialog(options);
          });
          return _this;
        }
      }
      var size, ohtml;
      // source: http://stackoverflow.com/a/24603642/1134119
      function iFrameReady(a,b){function e(){d||(d=!0,clearTimeout(c),b.call(this))}function f(){"complete"===this.readyState&&e.call(this)}function g(a,b,c){return a.addEventListener?a.addEventListener(b,c):a.attachEvent("on"+b,function(){return c.call(a,window.event)})}function h(){var b=a.contentDocument||a.contentWindow.document;0!==b.URL.indexOf("about:")?"complete"===b.readyState?e.call(b):(g(b,"DOMContentLoaded",e),g(b,"readystatechange",f)):c=setTimeout(h,1)}var c,d=!1;g(a,"load",function(){var b=a.contentDocument;b||(b=a.contentWindow,b&&(b=b.document)),b&&e.call(b)}),h()} // eslint-disable-line

      options.id = (options.id || "").replace(/\W+/g,"");
      options.id = options.id || new Date().getTime();
      var modal_id = "sp_frame_"+options.id;
      if (options.html && typeof options.html === "string") {
        ohtml = document.createElement('div');
        ohtml.style.padding="10px";
        ohtml.style.display="inline-block";
        ohtml.className = "sp-showModalDialog";
        ohtml.id = 'content_'+modal_id;
        ohtml.innerHTML = options.html;
        options.html = ohtml;
      }
      // if width and height are set to "calculated" then we'll use the viewport size to define them
      if (options.width === "calculated" || options.height === "calculated") {
        size = _this._getPageSize();
        if (options.width === "calculated") {
          options.width = size.vw.width;
          if (options.width > 768) {
            // we want to adjust to use 2/3
            options.width = 2*options.width/3
          }
        }
        if (options.height === "calculated") {
          options.height = size.vw.height;
          if (options.height > 576) {
            // we want to adjust to use 90%
            options.height = 90*options.height/100
          }
        }
      }
      if (options.width === "full" || options.height === "full") {
        size = _this._getPageSize();
        if (options.width === "full") options.width = size.vw.width;
        if (options.height === "full") options.height = size.vw.height;
      }
      options.wait = (options.wait === true ? true : false);
      options.closePrevious = (options.closePrevious === true ? true : false);
      if (options.previousClose === true) options.closePrevious=true;
      if (options.closePrevious) _this.closeModalDialog();

      // if showClose=false and callback is used, then showClose=false and hideClose=true
      // the reason is callback won't be triggered if showclose is false
      if (options.showClose === false && (options.dialogReturnValueCallback || options.callback)) {
        options.showClose = true;
        options.hideClose = true;
      }

      // define our own callback function to properly delete the Modal when it's closed
      var callback = options.dialogReturnValueCallback || options.callback || function() {};
      options.dialogReturnValueCallback = function(dialogResult, returnValue) {
        // if we use .close() then we have only one argument
        var id, dialog;
        if (typeof dialogResult === "object" && typeof dialogResult.type !== "undefined" && dialogResult.type === "closeModalDialog") {
          var args = dialogResult;
          dialogResult = args.dialogResult;
          returnValue = args.returnValue;
          id = args.id;
        }

        // make sure we remove the correct modal, so if "id" is provided, we look for it
        if (id) {
          for (var i=0; i<window.top._SP_MODALDIALOG.length; i++) {
            if (window.top._SP_MODALDIALOG[i].id === id) {
              dialog = window.top._SP_MODALDIALOG.splice(i, 1);
              dialog = dialog[0];
              break;
            }
          }
        }
        if (!dialog) dialog = window.top._SP_MODALDIALOG.pop();

        // remove <style> for overlay
        window.top.document.body.removeChild(window.top.document.getElementById("style_"+dialog.id));
        callback.call(this, dialogResult, returnValue);
      };

      var fct = function() {
        var modal = (options.wait ? SP.UI.ModalDialog.showWaitScreenWithNoClose(options.title, options.message, options.height, options.width) : SP.UI.ModalDialog.showModalDialog(options)); // eslint-disable-line

        // search for the lastest iframe + ms-dlgContent in the top frame body
        var wt = window.top;
        var id = modal_id;
        var frames = wt.document.querySelectorAll('body > iframe');
        var frame = frames[frames.length-1];
        var biggestZ = 0;
        // we define an attribute to find them later
        frame.setAttribute("id", id);
        // record it into a special object
        if (typeof wt._SP_MODALDIALOG === "undefined") wt._SP_MODALDIALOG=[];

        wt._SP_MODALDIALOG.push({id:id, modal:modal, zIndex:frame.style.zIndex, options:options, type:"modalDialog"});
        // check the z-index for .ms-dlgOverlay
        SPArrayForEach(wt._SP_MODALDIALOG, function(val) {
          if (val.zIndex > biggestZ) biggestZ = val.zIndex;
        });
        biggestZ--;
        wt.document.body.insertAdjacentHTML('beforeend', '<style id="style_'+id+'">.ms-dlgOverlay { z-index:'+biggestZ+' !important; display:block !important }</style>');
        // if showClose=true and callback is used, then showClose=false and hideClose=true
        // the reason is callback won't be triggered if showclose is false
        if (options.hideClose === true) {
          var cross = frame.nextSibling.querySelector('.ms-dlgCloseBtn');
          cross.parentNode.removeChild(cross);
        }
        if (typeof options.onload==="function") options.onload();
        if (options.url && options.onurlload && typeof options.onurlload === "function") {
          // find the iframe
          var frameURL = wt.document.getElementById(id);
          if (frameURL) frameURL = frameURL.nextSibling;
          if (frameURL) frameURL = frameURL.querySelector('iframe');
          if (frameURL) {
            iFrameReady(frameURL, options.onurlload)
          }
        }
      };
      SP.SOD.executeOrDelayUntilScriptLoaded(fct, 'sp.ui.dialog.js'); // eslint-disable-line
    },
    /**
      @name $SP().closeModalDialog
      @function
      @category modals
      @description Close the last modal dialog

      @param {Object} [dialogResult] One of the enumeration values specifying the result of the modal dialog (SP.UI.DialogResult|), or the modal object returned by $SP().getModalDialog()
      @param {Object} [returnValue] The return value of the modal dialog

      @example
      // if the user use the cross to close the modal, then `dialogResult` equals to 0 in the callback
      // but you can trigger the close of the modal and pass anything you want
      $SP().showModalDialog({
        id:"demo",
        title:"Hello World",
        html:'&lt;p>This is an example. Click one of the buttons.&lt;/p>&lt;p class="ms-alignCenter">&lt;button onclick="$SP().closeModalDialog(\'Continue has been clicked\')">Continue&lt;/button>&lt;/p>',
        callback:function(res) {
          alert(res)
        }
      })

      // or
      var modal = $SP().getModalDialog('demo');
      if (modal) $SP().closeModalDialog(modal);
     */
    closeModalDialog:function(dialogResult, returnValue) {
      var fct = function() {
        var md;
        if (typeof dialogResult === "object" && typeof dialogResult.type !== "undefined" && dialogResult.type === "modalDialog") {
          md = {id:dialogResult.id, dialogResult:returnValue, returnValue:undefined, type:"closeModalDialog"};
          dialogResult.modal.close(md);
          // if it's a wait screen, then we need to remove the <style> using options.dialogReturnValueCallBack
          if (dialogResult.options.wait) dialogResult.options.dialogReturnValueCallback(md, returnValue);
        } else {
          if (typeof window.top._SP_MODALDIALOG !== "undefined") {
            md=window.top._SP_MODALDIALOG;
            if (md.length>0) {
              md = md[md.length-1];

              // close has only one parameter
              md.modal.close({id:md.id, dialogResult:dialogResult, returnValue:returnValue, type:"closeModalDialog"});
              // if it's a wait screen, then we need to remove the <style> using options.dialogReturnValueCallBack
              if (md.options.wait) md.options.dialogReturnValueCallback(dialogResult, returnValue);
              return false;
            }
          }
          SP.UI.ModalDialog.commonModalDialogClose(dialogResult, returnValue); // eslint-disable-line
        }
      };
      SP.SOD.executeOrDelayUntilScriptLoaded(fct, 'sp.ui.dialog.js'); // eslint-disable-line

      return false;
    },
    /**
     * @name $SP().getModalDialog
     * @function
     * @category modals
     * @description Retrieve the modal object for a special modalDialog
     *
     * @param {String} id The ID of the modal
     * @return {Object} The modal object or NULL if the modal doesnt exist
     *
     * @example
     * var modal = $SP().getModalDialog("MyModal");
     * $SP().closeModalDialog(modal);
     */
    getModalDialog:function(id) {
      if (typeof window.top._SP_MODALDIALOG !== "undefined") {
        var md=window.top._SP_MODALDIALOG;
        id = id.replace(/\W+/g,"");
        for (var i=0; i<md.length; i++) {
          if (md[i].id === "sp_frame_"+id) {
            return md[i];
          }
        }
      }
      return null;
    },
    /**
     * @name $SP().waitModalDialog
     * @function
     * @category modals
     * @description Shortcut for SP.UI.ModalDialog.showWaitScreenWithNoClose()
     *
     * @param {String} [title="Working on it..."] The main message with the loading spin for SP2013, or the modal window title for SP2010
     * @param {String} [subtitle=""] The subtitle for SP2013, or the main message with the loading spin for SP2010
     * @param {Number} [height] The modal height
     * @param {Number} [width] The modal width
     */
    waitModalDialog:function(title, subtitle, height, width) {
      return this.showModalDialog({
        wait:true,
        title:title||"Working...",
        message:subtitle,
        width:width,
        height:height
      });
    },
    /**
     * @name $SP().resizeModalDialog
     * @function
     * @category modals
     * @description Resize a ModalDialog and recenter it
     * @param  {Object} options
     *   @param {Number} width
     *   @param {Number} height
     *   @param {String} [id] The id of the modal to resize, or the last opened dialog will be used
     * @return {Boolean} FALSE if something went wrong
     *
     * @example
     * // to have a form opened faster we define a minimal width and height, and then once it's loaded we want to have the correct size
     * $SP().showModalDialog({
     *   id:"inmodal",
     *   url:url,
     *   width:200,
     *   height:100,
     *   allowMaximize:true,
     *   onurlload:function() {
     *     // resize the frame by checking the size of the loaded page
     *     var iframe=window.top.document.getElementById('sp_frame_inmodal').nextSibling.querySelector('iframe');
     *     // define the max size based on the page size
     *     var size = $SP()._getPageSize();
     *     var maxWidth = 2*size.vw.width/3; // 2/3 of the viewport width
     *     var maxHeight = 90*size.vw.height/100 // 90% of the viewport height
     *     // find the size we want based on the modal
     *     var e=$(iframe.contentDocument.getElementById('onetIDListForm')); // this element gives the size of our form from the modal
     *     var width=e.outerWidth(true)+100;
     *     var height=e.outerHeight(true)+iframe.contentDocument.getElementById('ms-designer-ribbon').offsetHeight+100;
     *     if (width>maxWidth) width=maxWidth;
     *     if (height>maxHeight) height=maxHeight;
     *     $SP().resizeModalDialog({id:"inmodal",width:width,height:height});
     *     // bind the iframe resize, to make sure an external event won't resize it to 200x100
     *     $(iframe.contentWindow).on('resize', function() {
     *       var $this=$(this);
     *       if ($this.width() === 200 && $this.height() === 100) { // if it gets the original size, then resize to the new ones
     *         $SP().resizeModalDialog({id:"inmodal",width:width,height:height});
     *       }
     *     })
     *   }
     * });
     */
    resizeModalDialog:function(options) {
      var dlg, dialogElements, deltaWidth, deltaHeight, key;
      var pxToNum=function(px) { return px.replace(/px/,"")*1 };
      var wt=window.top;
      if (!options.id) {
        if (wt._SP_MODALDIALOG.length===0) return false; // no modal
        options.id = wt._SP_MODALDIALOG[wt._SP_MODALDIALOG.length-1].id.replace(/sp_frame_/,"");
      }
      // find dialog element
      dlg = wt.document.getElementById('sp_frame_'+options.id);
      if (!dlg) return false; // cannot find the modal
      dlg = dlg.nextSibling;
      options.width = (options.width === undefined ? pxToNum(dlg.style.width) : options.width);
      options.height = (options.height === undefined ? pxToNum(dlg.style.height) : options.height);
      // inspiration: https://social.msdn.microsoft.com/Forums/office/en-US/d92508be-4b4b-4f78-86d3-5d15a510bb18/how-do-i-resize-a-dialog-box-once-its-open?forum=sharepointdevelopmentprevious
      dialogElements = {
        "Border":dlg.querySelector('.ms-dlgBorder'),
        "TitleText":dlg.querySelector('.ms-dlgTitleText'),
        "Content":dlg,
        "Frame":dlg.querySelector('.ms-dlgFrame')
      };
      // calculate width & height delta
      deltaWidth = options.width - pxToNum(dialogElements.Border.style.width);
      deltaHeight = options.height - pxToNum(dialogElements.Border.style.height);

      for (key in dialogElements) {
        if (dialogElements.hasOwnProperty(key) && dialogElements[key]) {
          dialogElements[key].style.width = (pxToNum(dialogElements[key].style.width) + deltaWidth) + "px";
          // set the height, excluding title elements
          if (key !== "TitleText") dialogElements[key].style.height = (pxToNum(dialogElements[key].style.height) + deltaHeight) + "px";
        }
      }

      // now we recenter
      var pageSize=this._getPageSize(wt);
      dlg.style.top=(pageSize.vw.height / 2 - pxToNum(dlg.style.height) / 2) + "px";
      dlg.style.left=(pageSize.vw.width / 2 - pxToNum(dlg.style.width) / 2 ) + "px";
    },
    /**
      @name $SP().registerPlugin
      @function
      @category core
      @description Permits to register a plugin

      @param {String} pluginName You have to define the plugin name
      @param {Function} pluginFct You have to define the function of the plugin with one parameter that are the options passed

      @example
      $SP().registerPlugin('test', function(options) {
        console.log(options.message);
      })
    */
    registerPlugin:function(name,fct) {
      if (typeof _SP_PLUGINS[name] !== "undefined")
        throw "Error 'registerPlugin': '"+name+"' is already registered.";
      _SP_PLUGINS[name] = fct;
      return true;
    },
    /**
      @name $SP().plugin
      @function
      @category core
      @description Permits to use a plugin

      @param {String} pluginName The plugin name to call
      @param {Object} [options] The options for the plugin

      @example
      $SP().plugin('test',{message:"This is a test !"})
    */
    plugin:function(name,options) {
      options = options || {};
      if (typeof _SP_PLUGINS[name] === "function") _SP_PLUGINS[name].call(this,options);
      else throw "Error $SP().plugin: the plugin '"+name+"' is not registered."
      return this;
    }
  };

  /**
   * @ignore
   * @description we need to extend an element for some cases with $SP().get
   **/
  var myElem = (function(){
    var myElem = function(elem) { return new MyElemConstruct(elem); },
        MyElemConstruct = function(elem) { this.mynode = elem; this.singleList=true; return this; };
    myElem.fn = MyElemConstruct.prototype = {
      getAttribute: function(id) { return this.mynode.getAttribute("ows_"+id.replace(/ /g,"")) }, /*.replace(/ /g,"")*/
      getAttributes:function() { return this.mynode.attributes }
    };
    return myElem;
  })();

  var extendMyObject=function(arr) { this.attributes=arr };
  extendMyObject.prototype.getAttribute=function(attr) { return this.attributes[attr] };
  extendMyObject.prototype.getAttributes=function() { return this.attributes };

  SharepointPlus.prototype.noConflict = function() {
    window._$SP = window._SharepointPlus = window.$SP;
  };

  // make SharepointPlus available from NodeJS
  if (!_SP_ISBROWSER && typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = SharepointPlus;
    }
    exports.SharepointPlus = SharepointPlus;
  }
  else {
    window.$SP = window.SharepointPlus = SharepointPlus;
  }

  return SharepointPlus;
})(this,(typeof document!=="undefined"?document:null));
