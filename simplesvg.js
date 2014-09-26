(function(window, namespace, undefined) {
    'use strict';

    if (!namespace) {
        namespace = window;
    }

    var S = function() {};
    S.prototype = {
        'append': append,
        'attr': attributes,
        'css': style,
        'each': each,
        'empty': empty,
        'filter': filter,
        'html': html,
        'prepend': prepend,
        'remove': remove,
        'select': select,
        'text': text
    };
    namespace['SimpleSvg'] = new S();

    var doc = window.document,
        docElement = doc.documentElement,
        _selectMatcher = docElement.matchesSelector || docElement.webkitMatchesSelector || docElement.mozMatchesSelector || docElement.msMatchesSelector || docElement.oMatchesSelector,
        _parseSelector = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/;
    
    var nsSvg = 'http://www.w3.org/2000/svg';

    /**
     * Create element by name and insert to the end of element
     * @param {String} el
     */
    function append(el) {
        var node = null;
        for (var i = 0, l = this.length; i < l; i++) {
            node = doc.createElementNS(nsSvg, el);
            this[i].appendChild(node);
        }
        if (l === 1) {
            return select(node);
        } else {
            return this;
        }
    }

    /**
     * Get attribute by name or
     * Set one or more attributes
     * @param {String|Object} attribute
     * @param [value]
     */
    function attributes(attribute, value) {
        if (attribute) {
            if ((typeof attribute === 'string') && !value) {
                return this[0].getAttribute(attribute);
            }
            if ((typeof attribute === 'string') && value) {
                this.each(function() {
                    this.setAttribute(attribute, value);
                });
            }
            if (typeof attribute === 'object') {
                for (var val in attribute) {
                    this.each(function() {
                        this.setAttribute(val, attribute[val]);
                    });
                }
            }
        }
        return this;
    }

    /**
     * Execute a callback for every element in the matched set.
     * @param callback
     */
    function each(callback) {
        var obj = this;
        var length = obj.length;

        for (var i = 0; i < length; i++) {
            if (callback.call(obj[i]) === false) {
                break;
            }
        }

        return this;
    }

    /**
     * Remove all child nodes of the set of matched elements from the DOM.
     */
    function empty() {
        while (this[0].firstChild) {
            this[0].removeChild(this[0].firstChild);
        }
    }

    /**
     * Filter a selection using css selectors.
     * @param selector
     */
    function filter(selector) { // todo: need test this function
        var subgroup = [], node;
        if (typeof selector !== "function") selector = _selectionFilter(selector);
        var l = this.length;
        if (l > 0) {
            for (var i = 0; i < l; i++) {
                if ((node = this[i]) && selector.call(node, i)) {
                    subgroup.push(node);
                }
            }
        }
        this[0] = subgroup.length ? subgroup : null;
        return this;
    }

    function _selectionFilter(selector) {
        return function() {
            return _selectMatches(this, selector);
        };
    }

    function _selectMatches(n, s) {
        return _selectMatcher.call(n, s);
    }

    /**
     * Get the HTML contents of the first element in the set of matched elements or
     * Set the HTML contents of each element in the set of matched elements
     * @param value
     */
    function html(value) {
        return arguments.length ?
            this.each(typeof value === "function" ?
                function() {
                    var v = value.apply(this, arguments);
                    this.innerHTML = v == null ? "" : v;
                } :
                value == null ?
                    function() {
                        this.innerHTML = "";
                    } :
                    function() {
                        this.innerHTML = value;
                    }
            ):
            this[0].innerHTML;
    }

    /**
     * Create element by name and insert to the beginning
     * @param {String} el
     */
    function prepend(el) {
        var node = null;
        for (var i = 0, l = this.length; i < l; i++) {
            node = doc.createElementNS(nsSvg, el);
            this[i].insertBefore(node, this[i].firstChild);
        }
        if (l === 1) {
            return select(node);
        } else {
            return this;
        }
    }

    /**
     * Remove the set of matched elements from the DOM.
     */
    function remove() {
        for (var l = this.length; l--;) {
            if (this[l].parentNode) {
                this[l].parentNode.removeChild(this[l]);
            }
        }
    }

    /**
     * Select elements from the DOM
     * @param selector
     */
    function select(selector) {
        if (!selector) {
            return this;
        }

        var elements = new S();
        elements.context = (this && this.context) ? this.context : doc;
        elements.selector = selector;
        elements.length = 0;

        if (selector.nodeType) {
            elements.context = elements[0] = selector;
            elements.length = 1;
            return elements;
        }

        var match = _parseSelector.exec(selector),
            i = 0, l = 0, items = null;
        if (match) {
            if (this.length === 1) {
                elements.context = this[0];
            }
            if (match[1]) {
                elements[0] = doc.getElementById(match[1]);
                elements.length = elements[0] ? 1 : 0;
            } else if (match[2])  {
                if (elements.context === doc) {
                    items = doc.getElementsByTagName(match[2]);
                } else {
                    items = elements.context.querySelectorAll(match[0]);
                }
                for (i = 0, l = items.length; i < l; i++) {
                    elements[i] = items.item(i);
                }
                elements.length = l;
            } else {
                if (elements.context === doc) {
                    items = doc.getElementsByClassName(match[3]);
                } else {
                    items = elements.context.querySelectorAll(match[0]);
                }
                for (i = 0, l = items.length; i < l; i++) {
                    elements[i] = items.item(i);
                }
                elements.length = l;
            }
        }
        return elements;
    }

    /**
     * Get style by name or
     * Set one or more style properties
     * @param {String|Object} name
     * @param [value]
     */
    function style(name, value) {
        if (typeof name === 'string') {
            if (value !== undefined) {
                return this.each(function() {
                    _setStyle(this, name, value);
                });
            } else {
                this.each(function() {
                    _setStyle(this, st, name[st]);
                });
            }
        } else if (typeof name === 'object') {
            for (var st in name) {
                this.each(function() {
                    _setStyle(this, st, name[st]);
                });
            }
            return this;
        }
    }

    /**
     * Get the combined text contents of each element in the set of matched elements or
     * Set the content of each element in the set of matched elements to the specified text
     * @param value
     */
    function text(value) {
        if (arguments.length) {
            return this.each(typeof value === "function" ?
                function() {
                    var v = value.apply(this, arguments);
                    this.textContent = v == null ? "" : v;
                } :
                value == null ?
                    function() {
                        this.textContent = "";
                    } :
                    function() {
                        this.textContent = value;
                    }
            )
        } else {
            var text = "";
            this.each(function() {
                text += this.textContent;
            });
            return text;
        }
    }

    function _setStyle(elem, name, value) {
        if (value == null || typeof value === "number" && isNaN(value)) {
            return;
        }
        try {
            elem.style[name] = value;
        } catch(e) {}
    }

}(window));