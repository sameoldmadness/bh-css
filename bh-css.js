(function (match, apply) {
	function setStyles (expr, styles) {
        if (!styles) {
        	return;
        }

		this._css = this._css || {};
		this._css[expr] = this._css[expr] || [];

		Object.keys(styles).forEach(function (property) {
			var value = styles[property];

			this._css[expr].push([property, value]);
		}, this);

    	this._cssIsDirty = true;
	}

	function buildCss (styles) {
		var result = [];

		Object.keys(styles).forEach(function (expr) {
			result.push('.' + expr + ' {');

			styles[expr].forEach(function (style) {
				result.push('  ' + style[0] + ': ' + style[1] + ';');
			});

			result.push('}\n');
		});

		return result.join('\n');
	}

	function injectCssToPage () {
		if (!this._cssIsDirty) {
			return;
		}

		var css = buildCss(this._css);
		var styleElement;
		
		if (this._cssContainerId) {
			styleElement = document.getElementById(this._cssContainerId);
		} else {
			this._cssContainerId = this.utils.generateId();
			styleElement = appendStyleElementToPage(this._cssContainerId);
		}

		updateElementCss(styleElement, css);

		this._cssIsDirty = false;
	}

	function appendStyleElementToPage (id) {
		var container = document.getElementsByTagName('head')[0] || doc.body;
		var element = document.createElement('style');

		element.type = 'text/css';
		element.id = this._cssContainerId;

		container.appendChild(element);

		return element;
	}

	function updateElementCss (element, css) {
		try {
			element.innerHTML = css;
		}
		catch (error) {
			element.styleSheet.cssText = css; // IE fix
		}
	}

	BH.prototype.match = function (expr, matcher, styles) {
		// mimic parent method signature
        if (!expr) return this;

        if (Array.isArray(expr)) {
            expr.forEach(function(match, i) {
                this.match(expr[i], matcher, styles);
            }, this);
            return this;
        }

        if (typeof expr === 'object') {
            for (var i in expr) {
                this.match(i, expr[i]);
            }
            return this;
        }
        // end mimic parent method signature

        match.call(this, expr, matcher);
    	setStyles.call(this, expr, styles);

        return this;
    };

	BH.prototype.apply = function (bemJson) {
		injectCssToPage.call(this);

        return apply.call(this, bemJson);
    };
}(BH.prototype.match, BH.prototype.apply));
