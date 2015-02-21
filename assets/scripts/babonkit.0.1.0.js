/*
    jQuery Data selector kits.
    by: Nanang Mahdaen El Agung
        Dinkum Interactive
        PT. Stucel Media Kreatif
    
    Give ease way to select dom containing data attributes with or without values.
    For example:

    $(':hasdata(role));                     // selecting elements that contains attribute 'data-role'.
    $(':hasdata(role, dropdown)');          // Selecting elements that contains attribute 'data-role' with value 'dropdown'.
*/

(function ($) {
    $.extend(jQuery.expr[':'], {
        /*
            Attribute matchers.
            In some cases, jQuery returning undefined or false if attributes that don't have value.
            So this selector can help you selecting elements that contains attribute with or without value.
            
            $(':hasattr(name)');            // selecting elements that contains attribute 'name', although don't have value.
            $(':hasattr(name, john));       // selecting elements that contains attribute 'name' and value 'john'.
        */
        hasattr: function(obj, idx, prop, stack) {
            if (!prop[3]) {
                return false;
            }
            var args = prop[3].replace(/\s?,\s?/, ',').split(',');
            if (args.length === 1) {
                var attrs = obj.attributes;
                if (attrs && attrs.length > 0) {
                    for (var i = 0; i < attrs.length; i++) {
                        var name = attrs[i].name;
                        if (name === args[0]) {
                            return true;
                        }
                    }
                }
                return false;
            } else if (args.length === 2) {
                var name = args[0];
                var vals = args[1];
                var oval = obj.getAttribute(name)
                if (oval) {
                    oval = oval.split(' ');
                }
                if (oval && oval.length > 0) {
                    for (var i = 0; i < oval.length; ++i) {
                        if (oval[i] === vals) {
                            return true;
                        }
                    }
                }
                return false;
            }
        },
        hasdata: function(obj, idx, prop, stack) {
            var attrs = obj.attributes;
            if (!prop[3]) {
                if (attrs && attrs.length > 0) {
                    for (var i = 0; i < attrs.length; ++i) {
                        var name = attrs[i].name;
                        if (name.search('data') > -1) {
                            return true;
                        }
                    }
                }
                return false;
            }
            
            var args = prop[3].replace(/\s?,\s?/, ',').split(',');
            if (args.length === 1) {
                if (attrs && attrs.length > 0) {
                    for (var i = 0; i < attrs.length; ++i) {
                        var name = attrs[i].name;
                        if (name === 'data-' + args[0]) {
                            return true;
                        }
                    }
                }
                return false;
            } else if (args.length === 2) {
                var name = args[0];
                var vals = args[1];
                var oval = obj.getAttribute('data-' + name)
                if (oval) {
                    oval = oval.split(' ');
                }
                if (oval && oval.length > 0) {
                    for (var i = 0; i < oval.length; ++i) {
                        if (oval[i] === vals) {
                            return true;
                        }
                    }
                }
                return false;
            }
        },
        hasname: function(obj, idx, prop, stack) {
            var attrs = obj.attributes;
            if (!prop[3]) {
                if (attrs && attrs.length > 0) {
                    for (var i = 0; i < attrs.length; ++i) {
                        var name = attrs[i].name;
                        if (name === 'name') {
                            return true;
                        }
                    }
                }
                return false;
            } else {
                if (obj.getAttribute('name') === prop[3]) return true;
                return false;
            }
        }
    });
})(jQuery);
(function ($) {
    /* GET CENTER POSITION OF ELEMENT */
    $.fn.offsets = function() {
        var offset = this.offset();
        var width = this.width();
        var height = this.height();

        offset.width = width;
        offset.height = height;
        
        var wdt = offset.width / 2;
        var hgt = offset.height / 2;
        var p_top = offset.top + hgt;
        var p_lft = offset.left + wdt;
        
        offset.center = {
            top: Math.round(p_top),
            left: Math.round(p_lft)
        };

        return offset;
    }
    
    $.fn.center = function() {
        var ofs = this.offsets();
        var wdt = ofs.width / 2;
        var hgt = ofs.height / 2;

        var p_top = ofs.top + hgt;
        var p_lft = ofs.left + wdt;

        return {
            top: Math.round(p_top),
            left: Math.round(p_lft)
        }
    };

    $.fn.boxRatio = function() {
        this.each(function() {
            var ratio = $(this).getData('box-ratio');

            if (!ratio) {
                var width = $(this).width();
                var height = $(this).height();

                ratio = func('box:count-ratio')(width, height).split(',');

                $(this).setData('box-ratio', ratio);
            }
        });

        return this.getData('box-ratio');
    }
})(jQuery);
(function($, window) {
    /* Babon core object */
    var BabonKit = function () {
        return this;
    };
    BabonKit.module = BabonKit.prototype = {
        version: '0.1.0',
        build: '1390',
        modules: [
            'domdata',
            'datakit'
        ],
        kits: [],
    };
    
    var bbkit = new BabonKit();
    
    var Babon = function (type, option, obj) {
        if (Babon.kits[type]) {
            var result = Babon.kits[type](option, obj);
            if (result) {
                return result;
            } else {
                return bbkit;
            }
        } else {
            return bbkit;
        }
    };
    
    /* Babon object collections. */
    Babon.variables = {};
    Babon.constants = {};
    Babon.functions = {};
    Babon.preloader = [];
    Babon.excluders = {};
    
    /* Babon Kits extender */
    Babon.extend = function (name, func) {
        if (typeof name === 'string' && typeof func === 'function') {
            Babon.register(Babon.kits, name, func, 'Object Kits');
            bbkit.kits.push(name);
        }
    };
    bbkit.modules.push('extend');
    
    Babon.preload = function(name) {
        if (name) {
            if (typeof name === 'string') {
                Babon.preloader.push(name);
            } else if (Array.isArray(name)) {
                for (var i = 0; i < name.length; ++i) {
                    Babon.preloader.push(name[i]);
                }
            }
        }
        return Babon.preloader;
    };
    bbkit.modules.push('preload');
    
    /* Babon module setter. */
    Babon.register = function(dest, name, value, ename) {
        if (dest[name]) {
            console.error('You can\'t register "' + name + '" to "' + ename + '" because it\'s already registered. We can\'t overwrite registered module.');
            return;
        }
        if (dest && name && value) {
            dest[name] = value;
        }
    };
    
    /* Babon variable setter/getter. */
    Babon.vars = function(name, value) {
        if (name) {
            if (value) {
                return Babon.variables[name] = value;
            } else {
                if (Babon.variables[name]) {
                    return Babon.variables[name];
                }
            }
        }
    };
    bbkit.modules.push('vars');
    
    /* Babon constant setter/getter. */
    Babon.cons = function(name, value) {
        if (name) {
            if (value) {
                if (typeof value === 'function') return console.warn("You can't register constant as a function. Please use Babon.func() rather than Babon.cons().");
                if (Babon.constants[name]) return console.warn('Constant "' + name + '" alerady registered.');
                return Babon.constants[name] = value;
            } else {
                return Babon.constants[name];
            }
        }
    };
    bbkit.modules.push('cons');
    
    /* Babon protected function setter/getter */
    Babon.func = function (name, func) {
        if (name) {
            if (func && typeof func === 'function') {
                if (Babon.functions[name]) return console.warn('Function "' + name + '" alerady registered.');
                Babon.functions[name] = func;
                
                return Babon.functions[name];
            } else {
                return Babon.functions[name];
            }
        }
    };
    bbkit.modules.push('func');
    
    Babon.proto = function(name, proto_name, func) {
        if (name && Babon.functions[name] && proto_name && typeof proto_name === 'string' && func && typeof func === 'function') {
            Babon.functions[name].prototype[proto_name] = func;
            return Babon.functions[name];
        }
    };
    bbkit.modules.push('proto');
    
    /* Babon object window setter. */
    Babon.export = function (obj) {
        if (typeof obj === 'object' && !Array.isArray(obj)) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    window[key] = obj[key];
                }
            }
        }
    };
    
    /* Registering BabonKit to window */
    Babon.export({
        Babon: Babon,
        babon: Babon,
        cons: Babon.cons,
        vars: Babon.vars,
        func: Babon.func,
        proto: Babon.proto
    });
})(jQuery, window);
(function ($, cons, vars, func, data) {
    var answer = function (message, color) {
        if (message) {
            if (typeof message === 'string') {
                console.log('%c' + message, color);
            } else {
                console.log(message);
            }
        }
    };
    answer.title = function(message) {
        answer(message, 'color: blue; font-weight: bold;');
    };
    answer.hot = function(message) {
        answer(message, 'color: green; font-weight: bold');
    };
    answer.quote = function(message) {
        answer(message, 'color: #555; font-style: italic;');
    };
    answer.separator = function() {
        console.log('%c----------------------------------------------- ', 'color: #999; ');
    };
    answer.how = function(message) {
        answer(message, 'color: orange; font-style: italic;');
    };
    
    Babon.answer = answer;
    
    /* SUPPORT CONSTANTS */
    cons('ask:topics', {});
    var BabonSupports = function(topic, method) {
        this.topic = cons('ask:topics');
        if (topic && this.topic[topic]) {
            this.topic[topic]();
        } else {
            Babon.answer.separator();
            Babon.answer.title('Below is a list of kits in Babon');
            Babon.answer.separator();
            
            var kits = Babon().kits;
            if (kits) {
                for (var i = 0; i < kits.length; ++i) {
                    Babon.answer.hot("Babon('" + kits[i] + "');");
                }
            }
            
            Babon.answer.separator();
            Babon.answer.quote('Feel free to ask us with specific topic. e.g: ' + "Babon.ask('box:maintain-height') and we'll give you the possible answers. :)");
            Babon.answer.quote("Can't find the answers? Please feel free to visit us. http://babonkit.com/docs");
        }
    };
    
    Babon.ask = function (topic, method) {
        return new BabonSupports(topic, method);
    };
    
    Babon.ask.register = function(topic, func) {
        if (typeof topic === 'string' && typeof func === 'function') {
            cons('ask:topics')[topic] = func;
        }
    };
})(jQuery, Babon.cons, Babon.vars, Babon.func, Babon.domdata);
(function($, cons, vars, func, data) {
    /* Exclusion rule registrar */
    func('exclusion:register', function(name, rule) {
        if (typeof name === 'string' && rule) {
            if (Array.isArray(rule)) {
                for (var i = 0; i < rule.length; ++i) {
                    if (!Babon.excluders[rule[i]]) {
                        console.warn('Exclusion rule "' + rule[i] + '" doesn\'t exist. Exclusion aborted.')
                    } else {
                        Babon.excluders[rule[i]].list.push(name);
                    }
                }
            } else {
                if (!Babon.excluders[role]) return console.warn('Exclusion rule "' + role + '" doesn\'t exist. Exclusion aborted.');
                Babon.excluders[role].list.push(name);
            }
        }
        
        return Babon.excluders;
    });
    
    /* Exclusion rule maker */
    func('exclusion:new-rule', function(name, func) {
        if (typeof name === 'string' && typeof func === 'function') {
            Babon.excluders[name] = {
                list: [],
                func: func
            };
            
            return Babon.excluders[name];
        }
        
        return Babon.excluders;
    });
    
    /* Exclusion rule accessor */
    func('exclusion:read', function(name, rule) {
        if (typeof name === 'string' && rule) {
            if (Array.isArray(rule)) {
                for (var x = 0; x < rule.length; ++x) {
                    var ruler = Babon.excluders[rule[x]];
                    if (ruler) {
                        var idx = ruler.list.indexOf(name);
                        if (idx > -1) {
                            if (ruler.func()) {
                                return true;
                            }
                        }
                    }
                }
            } else if (typeof rule === 'string') {
                var ruler = Babon.excluders[rule];
                if (ruler) {
                    var idx = ruler.list.indexOf(name);
                    if (idx > -1) {
                        return ruler.func();
                    }
                }
            }
        }
        return false;
    });
})(jQuery, Babon.cons, Babon.vars, Babon.func, Babon.domdata);
/*
	MAIN CONSTRUCTOR.
    By: Nanang Mahdaen El Agung
        Dinkum Interactive
*/
(function($, window, undefined) {
    'use strict';
    var babonkit = function() {
        return new BabonKit();
    }
    var BabonKit = function() {
        return this;
    }
    BabonKit.module = BabonKit.prototype = {
        extend: function(name, func) {
            if (typeof name === 'string' && typeof func === 'function') {
                if (BabonKit.module[name]) {
                    console.error('Module "' + name + '" already registered. We can\'t overwrite registered module.');
                } else {
                    BabonKit.module[name] = func;
                }
            } else if (typeof name === 'object' && !Array.isArray(name)) {
                for (var key in name) {
                    if (name.hasOwnProperty(key)) {
                        if (BabonKit.module[key]) {
                            console.error('Module "' + key + '" already registered. We can\'t overwrite registered module.');
                        } else {
                            BabonKit.module[key] = name[key];
                        }
                    }
                }
            }

            return this;
        }
    }
    window.BabonKit = new babonkit();
})(jQuery, window, undefined);

(function ($) {
    /* Babon kits generator. */
    Babon.kits = function (type, option, obj) {
        if (Babon.kits[type]) {
            return Babon.kits[type](option, obj);
        } else {
            return this;
        }
    };
    Babon.kits.extend = function (name, func) {
        if (typeof name === 'string' && typeof func === 'function') {
            Babon.resgister(Babon.kits, name, func, 'Object Kits');
        }
    };
    
    /* jQuery plugins. */
    $.fn.kits = function(type, option) {
        return Babon.kits(type, option, this);
    };
})(jQuery);
/*
    DATA ATTRIBUTE MANAGER FOR JQUERY
    This plugin allow you to set/get DOM attributes as data.
    You can use javascript object, array, boolean, number and string.
*/
(function($) {
    /* Babon Data Kits */
    Babon.domdata = function (name, value, from) {
        if (typeof name === 'string') {
            if (value) {
                if (typeof value === 'string' || typeof value === 'number') {
                    if (from) {
                        return $(':hasdata(' + name + ', ' + value + ')', from);
                    } else {
                        return $(':hasdata(' + name + ', ' + value + ')');
                    }
                } else if (Array.isArray(value)) {
                    var query = ':hasdata(' + name + ', ' + value[0] + ')';
                    for (var i = 1; i < value.length; ++i) {
                        query += ':hasdata(' + name + ', ' + value[i] + ')';
                    }
                    if (from) {
                        return $(query, from);
                    } else {
                        return $(query);
                    }
                }
            } else {
                if (from) {
                    return $(':hasdata(' + name + ')', from);
                } else {
                    return $(':hasdata(' + name + ')');
                }
            }
        } else if (typeof name === 'object') {
            if (!Array.isArray(name)) {
                var query = '';
                for (var key in name) {
                    if (name.hasOwnProperty(key)) {
                        var value = name[key];
                        query += ':hasdata(' + key + ', ' + value + ')';
                    }
                }
                if (from) {
                    return $(query, from);
                } else {
                    return $(query);
                }
            } else {
                var query = ':hasdata(' + name[0] + ')';
                for (var i = 1; i < name.length; ++i) {
                    query += ':hasdata(' + name[i] + ')';
                }
                if (from) {
                    return $(query, from);
                } else {
                    return $(query);
                }
            }
        }
    };
    Babon.domdata.extend = function(name, func) {
        if (typeof name === 'string' && typeof func === 'function') {
            Babon.register(Babon.domdata, name, func, 'Data Kit');
        } else if (typeof name === 'object' && !Array.isArray(name)) {
            for (var key in name) {
                if (name.hasOwnProperty(key)) {
                    Babon.register(Babon.domdata, key, name[key], 'Data Kit');
                }
            }
        }
    }
    Babon.domdata.extend({
        role: function(value, from) {
            return Babon.domdata('role', value, from);
        },
        value: function(value, from) {
            return Babon.domdata('value', value, from);
        },
        state: function(value, from) {
            return Babon.domdata('state', value, from);
        },
        slider: {
            id: function(value, from) {
                return Babon.domdata('slider-id', from);
            }
        },
        kit: function(value, from) {
            return Babon.domdata('babon-kit', value, from);
        }
    });
    Babon.datakit = function(value, from) {
        return Babon.domdata('babon-kit', value, from);
    };
        
    /* JQUERY PLUGIN */
    // Data getter and setter.
    // With this plugin, you can pass an object into dom attribute or parse dom attribute to an object.
    $.fn.getData = function(name) {
        if (typeof name === 'string') {
            var data = this.attr('data-' + name);

            if (data) {
                if (data.search(/(\:)/) > -1) {
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        try {
                            eval('data = {' + data + '}');
                        } catch (e) {}
                    }
                } else if (data.search(',') > -1) {
                    data = data.replace(/\s?,\s?/g, ',').split(',');

                    if (data.length) {
                        for (var d = 0; d < data.length; d++) {
                            var now = data[d];
                            if (Number(now)) {
                                data[d] = Number(now);
                            } else if (now === 'true') {
                                data[d] = true;
                            } else if (now === 'false') {
                                data[d] = false;
                            }
                        }
                    }
                } else if (Number(data)) {
                    data = Number(data);
                } else if (data === 'true') {
                    data = true;
                } else if (data === 'false') {
                    data = false;
                }
            }

            return data;
        } else if (Array.isArray(name)) {
            var data = {};

            for (var x = 0; x < name.length; ++x) {
                var vals = this.getData(name[x]);

                if (vals) {
                    data[name[x]] = vals;
                }
            }

            return data;
        } else {
            var data = {};
            var attr = this[0].attributes;

            for (var a = 0; a < attr.length; ++a) {
                var name = attr[a].name;

                if (name.search('data-') > -1) {
                    name = name.replace('data-', '');

                    var vals = this.getData(name);

                    data[name] = vals;
                }
            }

            return data;
        }
    };
    $.fn.setData = function(name, value) {
        if (typeof name === 'string' && value !== 'undefined') {
            if (typeof value === 'object') {
                if (!Array.isArray(value)) {
                    value = JSON.stringify(value);
                } else {
                    value = value.toString();
                }
            }

            this.attr('data-' + name, value);
        } else if (typeof name === 'object' && !Array.isArray(name)) {
            for (var key in name) {
                if (name.hasOwnProperty(key)) {
                    var val = name[key];
                    if (typeof val === 'object') {
                        if (!Array.isArray(val)) {
                            val = JSON.stringify(val);
                        } else {
                            val = val.toString();
                        }
                    }

                    this.attr('data-' + key, val);
                }
            }
        };

        return this;
    };
    $.fn.appendData = function(name, value) {
        if (typeof name === 'string' && value) {
            for (var x = 0; x < this.length; ++x) {
                var obj = $(this[x]);
                var att = obj.getData(name);

                if (att && typeof att !== 'object') {
                    obj.setData(name, att + ' ' + value);
                } else {
                    obj.setData(name, value);
                }
            }
        } else if (typeof name === 'object' && !Array.isArray(name)) {
            for (var key in name) {
                if (name.hasOwnProperty(key)) {
                    this.appendData(key, name[key]);
                }
            }
        }

        return this;
    };
    $.fn.remData = function(name) {
        if (typeof name === 'string') {
            this.removeAttr('data-' + name);
        } else if (Array.isArray(name)) {
            for (var i = 0; i < name.length; ++i) {
                this.removeAttr('data-' + name[i]);
            }
        }

        return this;
    };

    /* Selector generator */
    $.fn.getQueryPattern = function(skip_class, break_at) {
        if (this.length > 1) {
            this.each(function() {
                $(this).getQueryPattern();
            });

            return;
        }
        if (!skip_class) {
            skip_class = 'none';
        }
        // Creating selector holder.
        var unique_selector = '';

        // Getting class name.
        var class_name = this.attr('class');

        // Adding first selector pattern.
        var tn = this.prop('tagName').toLowerCase();
        var id = this.attr('id');

        if (tn === 'li') {
            if (id) {
                unique_selector = '#' + id;
            } else {
                unique_selector = tn;
            }
        }

        if (class_name) {
            class_name = class_name.split(' ')[0];
            unique_selector = unique_selector + '.' + class_name;
        }


        var parent = this.parent();
        var current = this;

        while (parent.prop('tagName').toLowerCase() !== 'body') {
            var new_pattern = '';

            var id = parent.attr('id');
            var tn = parent.prop('tagName').toLowerCase();

            var class_name = parent.attr('class');

            if (tn === 'li') {
                if (id) {
                    new_pattern = '#' + id;
                } else {
                    new_pattern = tn;
                }
            }

            if (break_at) {
                if (parent.hasOwnProperty('length')) {
                    parent = parent[0];
                }
                if (break_at.hasOwnProperty('length')) {
                    break_at = break_at[0]
                }
                if (parent === break_at) {
                    if (class_name) {
                        unique_selector = new_pattern + '.' + class_name.split(' ')[0] + ' '
                        unique_selector;
                    } else {
                        unique_selector = new_pattern + ' ' + unique_selector;
                    }

                    break;
                }
            }
            if (!Array.isArray(skip_class)) {
                if (class_name) {
                    unique_selector = new_pattern + '.' + class_name.split(' ')[0] + ' ' + unique_selector;
                } else {
                    unique_selector = new_pattern + ' ' + unique_selector;
                }
            } else {
                var skipped = false;

                for (var x = 0; x < skip_class.length; ++x) {
                    var cclass = skip_class[x];
                    var pclass = parent.attr('class');

                    if (pclass) {
                        pclass = pclass.split(' ');

                        for (var p = 0; p < pclass.length; ++p) {
                            if (pclass[p] === cclass) {
                                skipped = true;
                            }
                        }
                    }
                }

                if (!skipped) {
                    if (class_name) {
                        unique_selector = new_pattern + '.' + class_name.split(' ')[0] + ' ' + unique_selector;
                    } else {
                        unique_selector = new_pattern + ' ' + unique_selector;
                    }
                }
            }

            parent = parent.parent();
        }

        this.setData('query-pattern', unique_selector);
        return unique_selector;
    };

    BabonKit.extend('patternizeElements', function(opts) {
        $('body *').getQueryPattern(opts);
    });
})(jQuery);

/*jshint undef:false*/
(function($, cons, vars, func) {
    /* Grid type fluid defaults option */
    cons('fluid-grid:default-option', {
        column: 12,
        gutter: 20
    });
    
})(jQuery, Babon.cons, Babon.vars, Babon.func);
(function($, cons, vars, func, data) {
    /* Babon auto height controller. */
    Babon.extend('box:maintain-height', function(object) {
        if (!object) object = data('box-height');
        object.each(function(idx) {
            var parent_height = 0;
            var mode = $(this).getData('box-height');
            
            var box_parent = $(this).getData('box-parent');
            if (!box_parent) box_parent = 'box-' + (idx + 1);
            $(this).setData('box-parent', box_parent);
            
            var child_box = data('box-child', '', this);
            child_box.setData('box-parent', box_parent);
            child_box = $(':hasdata(box-child):hasdata(box-parent, ' + box_parent + ')');
            
            for (var i = 0; i < child_box.length; ++i) {
                if (child_box[i].offsetHeight > parent_height) {
                    parent_height = child_box[i].offsetHeight;
                }
            }
            
            if (mode === 'capture-children') {
                $(this).height(parent_height);
            } else if (mode === 'fill-children') {
                child_box.height(parent_height);
            }
        });
    });
    
    /* Maintain maintain height group controller */
    Babon.extend('box:maintain-height-group', function(object) {
        if (!object) object = data('box-height-group');
        
        /* Generating group lists */
        var groups = [];
        for (var y = 0; y < object.length; ++y) {
            var groupId = $(object[y]).getData('box-height-group');
            if (groupId && groups.indexOf(groupId) < 0) {
                groups.push(groupId);
            }
        }
        
        /* Enumerating groups */
        for (var x = 0; x < groups.length; ++x) {
            var grouped_object = data('box-height-group', groups[x]);
            
            if (grouped_object) {
                var high = 0,
                    height;
                
                for (var i = 0; i < grouped_object.length; ++i) {
                    height = $(grouped_object[i]).height();
                    if (height > high) high = height;
                }
                
                if (high > 0) {
                    grouped_object.height(high);
                }
            }
        }
    });
    
    /* Maintain box ratio controller */
    Babon.extend('box:maintain-ratio', function(object) {
        if (!object) object = data('box-ratio');
        object.each(function() {
            var box_width = $(this).width();
            var box_ratio = $(this).getData('box-ratio');
            var box_height;

            if (box_ratio && box_ratio.length === 2) {
                box_height = Math.round((box_width / box_ratio[0]) * box_ratio[1]);

                $(this).height(box_height);
            }
        });
    });
    
    Babon.extend('box:maintain-ratio-listener', function() {
        Babon('box:maintain-ratio');
        setTimeout(function() {
            Babon('box:maintain-ratio-listener');
        }, 100);
    });
    
    /* Height group generator */
    func('box:generate-height-group', function(object, jump) {
        if (object && jump && typeof jump === 'number') {
            var length = object.length;
            var group = Math.ceil(length / jump);
            var obj_index = 0;
            
            for (var x = 1; x <= group; ++x) {
                for (var i = 0; i < jump; ++i) {
                    var objx = object[obj_index];
                    
                    if (objx) {
                        $(objx).setData('box-height-group', 'bhg-' + x);
                    }
                    
                    obj_index += 1;
                }
            }
        }
    });
    
    /* Box ratio counter */
    func('box:count-ratio', function(width, height) {
        var getDivisor, temp, divisor;

        getDivisor = function(a, b) {
            if (b === 0) return a;
            return getDivisor(b, a % b);
        }

        if (width === height) return '1,1';

        if (+width < +height) {
            temp = width;
            width = height;
            height = temp;
        }

        divisor = getDivisor(+width, +height);

        return 'undefined' === typeof temp ? (width / divisor) + ',' + (height / divisor) : (height / divisor) + ',' + (width / divisor);
    });
    
    Babon.preload(['box:maintain-box-ratio', 'box:maintain-height', 'box:maintain-height-group']);

    
    /* SUPPORTS */
    Babon.ask.register('box', function() {
        Babon.answer.title('Box is a kits group for manipulating box like height, ratio, position, etc.');
        Babon.answer('Below the lists of Box Kits:');
        
        Babon.answer.separator();
        
        Babon.answer.hot("Babon('box:maintain-height')");
        Babon.answer.quote('Maintain box height, equal to highest childs height or maintain childs height to highest height.');
        
        Babon.answer.separator();
        
        Babon.answer.hot("Babon('box:maintain-ratio');");
        Babon.answer.quote('Maintain the box apsect ratio like 4:4, 4:3, 16:9, etc.');
        
        Babon.answer.separator();
        
        Babon.answer.hot("Babon('box:maintain-height-group');");
        Babon.answer.quote('Digunakan untuk merapihkan tinggi box sesuai dengan urutan row.');
        Babon.answer.quote('Misal terdapat 16 objek dengan tinggi berbeda, dan ingin di samakan tingginya setiap baris dengan 4 objek, maka tiap 4 objek pada masing-masing baris akan sama.');
    });
    
    Babon.ask.register('box:maintain-height', function () {
        Babon.answer.title("Babon('box:maintain-height');");
        Babon.answer.separator();
        Babon.answer.quote('Maintain box height, equal to highest childs height or maintain childs height to highest height.');
        Babon.answer.quote('Use attribute "data-box-height" in parent object, and "data-box-child" in childs object.');
        Babon.answer.separator();
        
        Babon.answer.how('Create this html object to maintain the parent height equal to highest childs height, and then call ' + "Babon('box:maintain-height')" + '.');
        obj = $('<div class="box" data-box-height="capture-children"><div data-box-child"></div><div data-box-child></div></div>');
        console.log(obj[0]);
        obx = $('<div class="box" data-box-height="capture-children"><div data-box-child"></div><div data-box-child></div></div>');
        Babon('box:maintain-height', obx);
        console.log(obx[0]);
        
        Babon.answer.how('Create this html object to maintain the childs height equal to highest height, and then call ' + "Babon('box:maintain-height')" + '.');
        obj = $('<div class="box" data-box-height="fill-children"><div data-box-child></div><div data-box-child></div></div>');
        console.log(obj[0]);
        obx = $('<div class="box" data-box-height="fill-children"><div data-box-child></div><div data-box-child></div></div>');
        Babon('box:maintain-height', obx);
        console.log(obx[0]);
        
        Babon.answer.separator();
    });
})(jQuery, Babon.cons, Babon.vars, Babon.func, Babon.domdata);
(function($) {
    /* AUTO HEIGHT */
    $(document).ready(function() {
        // Follow child height.
        BabonKit.extend('ChildHeight', function(watch) {
            Babon.domdata('height', 'follow-child').each(function() {
                var height = 0;
                var childs = Babon.domdata('role', 'fill-height', this);

                for (var x = 0; x < childs.length; ++x) {
                    var ch = $(childs[x]).height();
                    if (ch > height) {
                        height = ch;
                    }
                }

                $(this).height(height);

                if (watch) {
                    setTimeout(function() {
                        BabonKit.ChildHeight(true);
                    }, 1000);
                }
            });
        });
        BabonKit.extend('AutoHeight', function(watch) {
            Babon.domdata('role', 'auto-height').each(function() {
                var height = 0;
                var childs = Babon.domdata('height', 'auto', this);

                // Resetting childs height to auto.
                childs.height('auto');

                for (var x = 0; x < childs.length; ++x) {
                    var ch = $(childs[x]).height();

                    if (ch > height) {
                        height = ch;
                    }
                }

                if (height > 0) {
                    childs.height(height);
                }

                if (watch) {
                    setTimeout(function() {
                        BabonKit.AutoHeight(true);
                    }, 1000);
                }
            });
        });

        BabonKit.ChildHeight();
        BabonKit.AutoHeight();
    });

    /* DYNAMIC BACKGROUND IMAGE */
    $(document).ready(function() {
        BabonKit.extend('dynBackground', function() {
            Babon.domdata('role', 'background').each(function() {
                var src = $('img', this).attr('src');

                if (src) {
                    $(this).css('background-image', 'url(' + src + ')');
                }
            });
        });

        BabonKit.dynBackground();
    });

    /* ASPECT RATIO BOX SIZING */
    $(document).ready(function() {
        BabonKit.extend('ResizeBoxRatio', function(watch) {
            Babon.domdata('box-ratio').each(function() {
                var box_width = $(this).width();
                var box_ratio = $(this).getData('box-ratio');
                var box_height;

                if (box_ratio && box_ratio.length === 2) {
                    box_height = Math.round((box_width / box_ratio[0]) * box_ratio[1]);

                    $(this).height(box_height);
                }
            });
        });

        BabonKit.ResizeBoxRatio(true);

        $.fn.ResizeBoxRatio = function() {
            var box_width = this.width();
            var box_ratio = this.getData('box-ratio');
            var box_height;

            if (box_ratio && box_ratio.length === 2) {
                box_height = Math.round((box_width / box_ratio[0]) * box_ratio[1]);
                this.height(box_height);
            }

            return this;
        };

        $.fn.MaintainBoxRatio = function() {

        }

        BabonKit.extend('GetBoxRatio', function(width, height) {
            var getDivisor, temp, divisor;

            getDivisor = function(a, b) {
                if (b === 0) return a;
                return getDivisor(b, a % b);
            }

            if (width === height) return '1,1';

            if (+width < +height) {
                temp = width;
                width = height;
                height = temp;
            }

            divisor = getDivisor(+width, +height);

            return 'undefined' === typeof temp ? (width / divisor) + ',' + (height / divisor) : (height / divisor) + ',' + (width / divisor);
        });
    });

    /* ACCORDION KITS */
    $(document).ready(function() {
        Babon.domdata('role', 'accordion').each(function(idx) {
            var ac_id = 'accordion-' + (idx + 1);

            $(this).setData('accordion-index', ac_id);

            Babon.domdata('role', 'accordion-content', this).setData('accordion-index', ac_id);
            Babon.domdata('role', 'accordion-button', this).setData('accordion-index', ac_id).click(function() {
                var ac_id = $(this).getData('accordion-index');

                var conte = Babon.domdata({
                    'role': 'accordion-content',
                    'accordion-index': ac_id
                });

                Babon.domdata('role', 'accordion-content').each(function() {
                    if ($(this).getData('accordion-index') !== ac_id) {
                        $(this).slideUp().removeClass('active');
                    }
                });

                Babon.domdata('role', 'accordion-button').each(function() {
                    if ($(this).getData('accordion-index') !== ac_id) {
                        $(this).removeClass('active');
                    }
                });

                if (!conte.hasClass('active')) {
                    conte.slideDown();
                    Babon.domdata('accordion-index', ac_id).addClass('active');
                } else {
                    conte.slideUp();
                    Babon.domdata('accordion-index', ac_id).removeClass('active');
                }


                return false;
            });
        });
    });

})(jQuery);


//
(function($) {
    /* EXTENDED SLIDER */
    $(document).ready(function() {
        window.exRunner = {};
        window.exAnimator = {};

        BabonKit.exSlider = {
            /* SLIDER INITIALIZER */
            init: function() {
                return Babon.domdata('role', 'ex-slider').each(function(idx) {
                    // Generating slider id.
                    var ex_id = 'slider-' + (idx + 1);

                    // Getting slider datas.
                    var auto_slide = $(this).getData('auto-slide'),
                        auto_pause = true,
                        show_progress = true,
                        progress;

                    // Initializing progress bar.
                    Babon.domdata({
                        'role': 'progress',
                        'parent-ids': ex_id
                    }, this).remove();

                    progress = $('<div class="slide-progress"></div>');
                    progress.setData({
                        'role': 'progress',
                        'parent-ids': ex_id,
                    });

                    // Extracting auto slide data.
                    if (Array.isArray(auto_slide)) {
                        var a_length = auto_slide.length;

                        if (a_length === 2) {
                            var a_now = auto_slide[1];

                            if (a_now === 'nopause') {
                                auto_pause = false;
                            } else if (a_now === 'noprogress') {
                                show_progress = false;
                            }

                            auto_slide = auto_slide[0];
                        } else if (a_length === 3) {
                            auto_pause = false;
                            show_progress = false;

                            auto_slide = auto_slide[0];
                        }
                    } else if (!auto_slide) {
                        auto_slide = false;
                        auto_pause = false;
                        show_progress = false;
                    }

                    if (!show_progress) {
                        progress.css({
                            display: 'none'
                        });
                    }

                    // Adding progress and id to current slider.
                    $(this).setData({
                        'parent-ids': ex_id
                    }).css({
                        position: 'relative'
                    }).prepend(progress);

                    // Attaching auto pause event handler.
                    if (auto_pause) {
                        $(this).mouseenter(function() {
                            var ex_id = $(this).getData('parent-ids');

                            if (exRunner[ex_id]) {
                                exRunner[ex_id].pause();
                            }
                        }).mouseleave(function() {
                            var ex_id = $(this).getData('parent-ids');

                            if (exRunner[ex_id]) {
                                exRunner[ex_id].resume();
                            }
                        });
                    }

                    // Enumerating item selectors.
                    Babon.domdata('role', 'slide-select', this).each(function(idx) {
                        var sl_id = (idx + 1);

                        $(this).setData({
                            'item-index': sl_id,
                            'parent-ids': ex_id,
                            'item-state': 'inactive'
                        }).addClass('inactive').click(function() {
                            var ex_id = $(this).getData('parent-ids'),
                                slide = Babon.domdata({
                                    'role': 'ex-slider',
                                    'parent-ids': ex_id
                                })[0],
                                index = $(this).getData('item-index');

                            if ($(this).getData('item-state') && $(this).getData('item-state') === 'inactive') {
                                exRunner[ex_id].kill();
                                exRunner[ex_id] = false;
                                BabonKit.exSlider.navigate(slide, index);
                            }
                        });
                    });

                    // Enumerating items.
                    Babon.domdata('role', 'slide-item', this).each(function(idx) {
                        var sl_id = (idx + 1);

                        $(this).setData({
                            'item-index': sl_id,
                            'parent-ids': ex_id,
                            'item-state': 'inactive'
                        }).addClass('inactive');
                    });

                    // Enumerarting navigator.
                    Babon.domdata('dir', 'next', this).each(function() {
                        $(this).setData('parent-ids', ex_id).click(function() {
                            var ex_id = $(this).getData('parent-ids'),
                                slide = Babon.domdata({
                                    'role': 'ex-slider',
                                    'parent-ids': ex_id
                                })[0];

                            if (exRunner[ex_id]) {
                                exRunner[ex_id].kill();
                                exRunner[ex_id] = false;
                            }
                            BabonKit.exSlider.navigate(slide, 'next');
                        });
                    });
                    Babon.domdata('dir', 'prev', this).each(function() {
                        $(this).setData('parent-ids', ex_id).click(function() {
                            var ex_id = $(this).getData('parent-ids'),
                                slide = Babon.domdata({
                                    'role': 'ex-slider',
                                    'parent-ids': ex_id
                                })[0];

                            if (exRunner[ex_id]) {
                                exRunner[ex_id].kill();
                                exRunner[ex_id] = false;
                            }
                            BabonKit.exSlider.navigate(slide, 'prev');
                        });
                    });

                    BabonKit.exSlider.navigate(this, 1);
                });
            },

            /* AUTO SLIDE RUNNER */
            runner: function(slider) {
                // Getting slider datas.
                var ex_id = $(slider).getData('parent-ids');
                var auto_slide = $(slider).getData('auto-slide');

                var progress = Babon.domdata({
                    'role': 'progress',
                    'parent-ids': ex_id
                }).css({
                    width: 0
                });

                if (!auto_slide) {
                    return false;
                }

                if (Array.isArray(auto_slide) && auto_slide.length > 0) {
                    auto_slide = auto_slide[0];
                }

                exRunner[ex_id] = TweenMax.to(progress, auto_slide, {
                    width: '100%',

                    ease: 'Linear.easeInOut',
                    onCompleteParams: [slider, progress],

                    onComplete: function(slider, prg) {
                        BabonKit.exSlider.navigate(slider);

                        // prg.css({
                        //     width: 0
                        // });

                        TweenMax.to(prg, 0.1, {
                            width: 0,
                            onCompleteParams: [prg],
                            onComplete: function(prg) {
                                var ex_id = $(prg).getData('parent-ids');

                                exRunner[ex_id] = false;
                            }
                        });
                    }
                });
            },

            /* SLIDER NAVIGATOR */
            navigate: function(slider, dir) {
                !dir ? dir = 'next' : dir;

                // Generating base vars.
                var target_s, target_i;

                // Collecting slider data.
                var ex_id = $(slider).getData('parent-ids'),
                    effect = $(slider).getData('effect'),
                    speed = $(slider).getData('easing-speed');

                // Collecting selectors.
                var st_items = Babon.domdata({
                    'role': 'slide-select',
                    'parent-ids': ex_id,
                });
                // Getting the active select.
                var active_s = st_items.matchData('item-state', 'active');

                // Collecting slide items.
                var sl_items = Babon.domdata({
                    'role': 'slide-item',
                    'parent-ids': ex_id
                });

                // Getting the active item.
                var active_i = sl_items.matchData('item-state', 'active');

                var active_idx = active_i.getData('item-index');

                if (dir === 'next') {
                    if (active_idx >= sl_items.length) {
                        target_s = st_items.matchData('item-index', 1);
                        target_i = sl_items.matchData('item-index', 1);
                    } else {
                        target_s = st_items.matchData('item-index', (active_idx + 1));
                        target_i = sl_items.matchData('item-index', (active_idx + 1));
                    }
                } else if (dir === 'prev') {
                    if (active_idx <= 1) {
                        target_s = st_items.matchData('item-index', sl_items.length);
                        target_i = sl_items.matchData('item-index', sl_items.length);
                    } else {
                        target_s = st_items.matchData('item-index', (active_idx - 1));
                        target_i = sl_items.matchData('item-index', (active_idx - 1));
                    }
                } else if (Number(dir)) {
                    target_s = st_items.matchData('item-index', dir);
                    target_i = sl_items.matchData('item-index', dir);
                }

                // Ensuring speed is defined.
                if (!speed) {
                    speed = 0.6
                }

                var exp_option = {
                    active: {
                        item: active_i,
                        select: active_s
                    },
                    target: {
                        item: target_i,
                        select: target_s
                    },
                    speed: speed
                };

                if (exAnimator[effect]) {
                    exAnimator[effect](slider, exp_option);
                } else {
                    target_s.setData('item-state', 'active').removeClass('inactive').addClass('active');
                    target_i.setData('item-state', 'active').removeClass('inactive').addClass('active');

                    active_s.setData('item-state', 'inactive').removeClass('active').addClass('inactive');
                    active_i.setData('item-state', 'inactive').removeClass('active').addClass('inactive');

                    BabonKit.exSlider.runner(slider);
                }
            },

            /* ANIMATION HANDLER MAKER */
            animator: function(name, objFunc) {
                if (typeof name === 'string' && typeof objFunc === 'function') {
                    exAnimator[name] = objFunc;
                }
            },

            completeIn: function(slider, opt) {
                // Activating slides.
                opt.target.item.setData('item-state', 'active').removeClass('inactive').addClass('active').css({
                    'display': '',
                    'opacity': '',
                    'z-index': ''
                });
                opt.target.select.setData('item-state', 'active').removeClass('inactive').addClass('active');

                // Rerun slider runner.
                BabonKit.exSlider.runner(slider);
            },
            completeOut: function(slider, opt) {
                // Deactivating active slides.
                opt.active.item.setData('item-state', 'inactive').removeClass('active').addClass('inactive').css({
                    'display': '',
                    'opacity': '',
                    'z-index': ''
                });;
                opt.active.select.setData('item-state', 'inactive').removeClass('active').addClass('inactive');
            }
        };

        /* Home slider effect */
        BabonKit.exSlider.animator('hsAnimator', function(slider, opt) {
            // Getting images.
            var ac_img = $('.img-wrap .wrapper', opt.active.item).removeClass('trans');
            var tg_img = $('.img-wrap .wrapper', opt.target.item).removeClass('trans');

            var ac_inf = $('.info-wrap', opt.active.item);
            var tg_inf = $('.info-wrap', opt.target.item);

            // Activating target.
            opt.target.item.css({
                display: 'block',
                opacity: 1,
                'z-index': 2,
            });

            TweenMax.to(ac_inf, opt.speed, {
                opacity: 0
            });
            TweenMax.to(tg_inf, opt.speed, {
                opacity: 1
            });


            // Tweening target.
            TweenMax.to(tg_img, opt.speed, {
                top: '0',
                ease: 'Back.easeOut',

                onCompleteParams: [slider, tg_img],
                onComplete: function(slider, tg_img) {
                    tg_img.addClass('trans');

                    opt.target.item.setData('item-state', 'active').removeClass('inactive').addClass('active').css({
                        'z-index': 1
                    });
                    opt.target.select.setData('item-state', 'active').removeClass('inactive').addClass('active');

                    BabonKit.exSlider.runner(slider);
                }
            });
            TweenMax.to(ac_img, opt.speed, {
                top: '100%',
                ease: 'Back.easeIn',

                onCompleteParams: [ac_img, opt],
                onComplete: function(ac_img, opt) {
                    ac_img.addClass('trans');

                    opt.active.item.setData('item-state', 'inactive').removeClass('active').addClass('inactive').css({
                        display: 'none',
                        opacity: 0,
                        'z-index': 0
                    });
                    opt.active.select.setData('item-state', 'inactive').removeClass('active').addClass('inactive');
                }
            });
        });

        /* Fade effect */
        BabonKit.exSlider.animator('fade', function(slider, opt) {
            // Fadding in target slide.
            opt.target.item.css({
                display: 'block'
            });

            TweenMax.to(opt.target.item, opt.speed, {
                opacity: 1,

                onCompleteParams: [slider, opt],
                onComplete: function(slider, opt) {
                    BabonKit.exSlider.completeIn(slider, opt);
                    BabonKit.exSlider.runner(slider);
                }
            });

            // Fadding out active slide.
            TweenMax.to(opt.active.item, opt.speed, {
                opacity: 0,

                onCompleteParams: [slider, opt],
                onComplete: function(slider, opt) {
                    BabonKit.exSlider.completeOut(slider, opt);
                }
            });
        });

        BabonKit.exSlider.animator('slide-left', function(slider, opt) {
            var easing = $(slider).getData('easing');
            if (!easing) {
                easing = "Linear.easeInOut";
            }

            opt.target.item.css({
                'left': '100%',
                'z-index': 2
            });

            TweenMax.to(opt.target.item, opt.speed, {
                left: '0',
                opacity: 1,
                ease: easing,

                onCompleteParams: [slider, opt],
                onComplete: function(slider, opt) {
                    BabonKit.exSlider.completeIn(slider, opt);
                }
            });
            TweenMax.to(opt.active.item, opt.speed, {
                left: '-100%',
                opacity: 0,
                ease: easing,

                onCompleteParams: [slider, opt],
                onComplete: function(slider, opt) {
                    BabonKit.exSlider.completeOut(slider, opt);
                }
            });
        });

        BabonKit.exSlider.init();
    });
})(jQuery);
(function ($, cons, vars, func) {
    /* Google Map Embed */
    Babon.extend('gmap:embed', function(option, object) {
        if (!object) object = Babon.domdata('role', 'gmap-embed');
        object.each(function(idx) {
            var option = {
                size: $(this).getData('gmap-size'),
                apik: $(this).getData('gmap-apikey'),
                strn: $(this).attr('data-gmap-query')
            }
            
            var iframe = $('<iframe></iframe>');
            var src = encodeURI('https://www.google.com/maps/embed/v1/search?key=' + option.apik + '&q=' + option.strn);
            iframe.width(option.size[0]).height(option.size[1]).attr({
                'src': src,
                'frameborder': 0
            });
            $(this).append(iframe);
        });
    });
    
    /* Google Map Static */
    var gmap_static_default_options = {
        size: '320x150',
        center: 'New York',
        zoom: 15,
        type: 'roadmap',
        markers: [
            {
                icon: 'default',
                pos: '40.714728,-73.998672'
            }
        ]
    };
    Babon.extend('gmap:static', function(option, object) {
        if (!object) object = Babon.domdata('role', 'gmap-static');
        object.each(function(idx) {
            var option = {
                center: $(this).data('gmap-query'),
                size: $(this).getData('gmap-size'),
                zoom: $(this).data('gmap-zoom'),
                type: $(this).data('gmap-type'),
                marker: $(this).data('gmap-marker')
            };
            var url = 'https://maps.googleapis.com/maps/api/staticmap?';
            
            console.log(option);
            
            if (option.center) url += '&center=' + option.center;
            if (option.size) url += '&size=' + option.size;
            if (option.zoom) url += '&zoom=' + option.zoom;
            if (option.type) url += '&maptype=' + option.type;
            if (option.marker) url += '&markers=color:red|' + option.marker;
            
            url = encodeURI(url);

            var img = $('<img />');
            img.attr('src', url);
            $(this).append(img);
        });
    });
    
    /* Registering kits into preloader. */
    Babon.preload(['gmap:embed', 'gmap:static']);
})(jQuery, Babon.cons, Babon.vars, Babon.func);
(function ($) {
    Babon.extend('tooltips', function(option, object) {
        Babon.domdata.role('tooltips').each(function(idx) {
            var tid = 'tooltip-' + (idx + 1);
            var toolbutton = Babon.domdata.role('tooltip-button', this).setData({
                'tooltip-parent': tid
            }).each(function(idx) {
                var index = 'tooltip-' + (idx + 1);
                
                $(this).setData({
                    'tooltip-index': index
                });
            });
            var toolcontent = Babon.domdata.role('tooltip-content', this).setData({
                'tooltip-parent': tid
            }).each(function (idx) {
                var index = 'tooltip-' + (idx + 1);
                
                $(this).setData({
                    'tooltip-index': index
                });
            }).addClass('inactive').setData('tooltip-state', 'inactive');
            
            toolbutton.mouseenter(function() {
                var index = $(this).getData('tooltip-index');
                var parent = $(this).getData('tooltip-parent');
                
                var content = Babon.domdata({
                    'role'              : 'tooltip-content',
                    'tooltip-index'     : index,
                    'tooltip-parent'    : parent
                });
                
                var offsets = $(this).offsets();
                var to_left = offsets.left + offsets.width;
                var to_top = (offsets.top);

                content.css({
                    top: to_top - 4,
                    left: to_left,
                    display: 'block'
                });
                
                content.animate({
                    top: '+=4px',
                    opacity: 1
                }, 200, function() {
                    $(this).addClass('active').removeClass('inactive').setData('tooltip-state', 'active');
                });
            }).mouseleave(function() {
                var index = $(this).getData('tooltip-index');
                var parent = $(this).getData('tooltip-parent');
                
                var content = Babon.domdata({
                    'role'              : 'tooltip-content',
                    'tooltip-index'     : index,
                    'tooltip-parent'    : parent
                });
                
                content.animate({
                    top: '-=4px',
                    opacity: 0
                }, 200, function() {
                    $(this).removeClass('active').addClass('inactive').setData('tooltip-state', 'inactive').css({
                        display: 'none'
                    });
                });
            });
        });
    });
    
    /* Registering for preload. */
    Babon.preload('tooltips');
})(jQuery);
(function($, cons, vars, func, data, proto) {
    /* Overlay box controller */
    var overlayer = function(object) {
        return new BabonWindowOverlay(object);
    }
    var BabonWindowOverlay = function(object) {
        if (!object) object = data('role', 'window:overlay-box');
        
        this.node = object.addClass('fixed');
        this.loader = data('role', 'window:overlay-loader', object);
        this.content = data('role', 'window:overlay-content', object);
        this.destroy = data('role', 'window:overlay-destroy', object);
        this.close = data('role', 'window:button:close', object);
        this.onCLose = false;
        
        if (this.destroy) {
            var overlay = this;
            $(this.destroy).click(function () {
                overlay.clearContent().hide();
            });
        }
        
        if (this.close) {
            var overlay = this;
            $(this.close).click(function () {
                overlay.clearContent().hide();
            });
        }
        
        return this;
    };
    overlayer.prototype = BabonWindowOverlay.prototype = {
        show: function() {
            if (this.node) {
                $(this.node).css({
                    opacity: 0,
                    display: 'block'
                });
                TweenMax.to(this.node, 0.3, {
                    opacity: 1
                });
            }
            return this;
        },
        hide: function() {
            if (this.node) {
                TweenMax.to(this.node, 0.3, {
                    opacity: 0,
                    onCompleteParams: [this.node],
                    onComplete: function(node) {
                        $(node).css({
                            display: 'none'
                        });
                    }
                });
                if (this.onClose) {
                    this.onClose(this);
                }
            }
            
            return this;
        },
        showLoader: function() {
            if (this.loader) {
                $(this.loader).css({
                    display: 'block',
                    opacity: 0
                });
                TweenMax.to(this.loader, 0.3, {
                    opacity: 1
                });
            }
            
            return this;
        },
        hideLoader: function () {
            if (this.loader) {
                TweenMax.to(this.loader, 0.3, {
                    opacity: 0,
                    onCompleteParams: [this.loader],
                    onComplete: function(node) {
                        $(node).css({display: 'none'});
                    }
                });
            }
        },
        clearContent: function () {
            if (this.content) {
                TweenMax.to(this.content, 0.3, {
                    opacity: 0,
                    onCompleteParams: [this.content],
                    onComplete: function(node) {
                        $(node).html(' ');
                    }
                });
            }
            return this;
        },
        setContent: function(content) {
            if (this.content) {
                $(this.content).css({opacity: 0}).html(content);
                TweenMax.to(this.content, 0.3, {opacity: 1});
            }
            
            return this;
        },
        loadContent: function(url, callback) {
            if (typeof url === 'string') {
                var overlay = this;
                overlay.show();
                
                $.get(url, function(data) {
                    overlay.setContent(data);
                    if (callback && callback.onLoaded) {
                        callback.onLoaded(overlay);
                    }
                });
            }
            
            if (callback.onClose) {
                this.onClose = callback.onClose;
            }
            
            return this;
        },
        viewMode: function(mode) {
            if (typeof mode === 'string') {
//                if (mode === 'fixed') {
//                    $(this.node).css({position: 'fixed'}).addClass('fixed');
//                } else if (mode === 'absolute') {
//                    $(this.node).css({position: 'absolute'}).addClass('absolute');
//                }
                $(this.node).addClass(mode);
            } else if (typeof mode === 'object' && !Array.isArray(mode)) {
                $(this.node).css(mode).addClass('custom');
            }
            
            return this;
        }
    };
    
    func('window:overlay-box', overlayer);
    func('window overlay box', overlayer);
    Babon('window:overlay-box', overlayer);
})(jQuery, Babon.cons, Babon.vars, Babon.func, Babon.domdata, Babon.proto);
(function($, cons, vars, func, data) {
    var CameraCapture, CameraStream, FileUpload, FileUploader;
    /* Image capture function */
    func('img:camera-streamer:new', function(option) {
        var dopt = { width: 480, ratio: [4,3], format: 'jpeg', quality: 90, flasher: false };
        
        if (typeof option === 'object') {
            for (var key in option) {
                if (option.hasOwnProperty(key)) {
                    dopt[key] = option[key];
                }
            }
        }
        
        return obj = $('<div class="img-camera-streamer"></div>').setData({
            'img-camera-streamer': '', 'camera-stream-options': dopt
        }).width(dopt.width);
    });
    func('img:camera-viewer:new', function() {
        return $('<div class="img-camera-viewer"><img src="" /></div>').setData('img-camera-viewer', '');
    });
    func('img:camera-flash:in', function(callback) {
        $('<div data-camera-flasher style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 999999999999; background-color: #fff;"></div>').prependTo('body');
    });
    func('img:camera-flash:out', function(callback) {
        data('camera-flasher').fadeOut(400, function() {
            data('camera-flasher').remove();
        });
    });
    func('img:camera-stop', function(){
        var holder = data('img-camera-streamer');
        if (holder) {
            Webcam.reset();
        }
    });
    
    CameraCapture = function(object) {
        if (!object) return false;
        
        this.event = {
            before_capture: false,
            capture: false,
            select: false
        };
        
        this.stream_option = {
            ratio: [4,3],
            format: 'jpeg',
            quality: 90,
            flasher: false,
            capture_mode: 'append'
        };
        
        this.stream_button, this.stream_reset, this.stream_holder, this.result_holder = false;
        
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                this[key] = object[key];
            }
        }
        
        if (this.stream_button) {
            var Camera = this;
            this.stream_button.click(function() {
                Camera.catpure();
            });
        }
        
        return this;
    };
    CameraStream = function(object) {
        return new CameraCapture(object);
    }
    CameraStream.prototype = CameraCapture.prototype = {
        stream: function(obj_wrap, option) {
            if (!Webcam || !this.stream_holder) return this;
            
            this.stream_holder.setData('box-ratio', this.stream_option.ratio);
            Babon('box:maintain-ratio', this.stream_holder);
            
            Webcam.set({
                image_format: this.stream_option.format,
                image_quality: this.stream_option.quality
            });
            Webcam.attach(this.stream_holder[0]);
            
            return this;
        },
        catpure: function() {
            if (!this.result_holder) return this;
            
            /* Generating image */
            if (this.stream_option.capture_mode === 'append') {
                var image = $('<img />').setData('img-crop-target', '').appendTo(this.result_holder);
            } else if (this.stream_option.capture_mode === 'replace') {
                this.result_holder.html(' ');
                var image = $('<img />').setData('img-crop-target', '').appendTo(this.result_holder);
            }
            
            image.removeAttr('style');
            
            /* Calling before_capture event if exist */
            if (this.event.before_capture) {
                this.event.before_capture(this);
            }
            
            /* Capturing image */
            if (this.stream_option.flasher) {
                var Camera = this;
                func('img:camera-flash:in')();
                setTimeout(function() {
                    var data = Webcam.snap();
                    
                    /* Removing flasher */
                    func('img:camera-flash:out')();
                    
                    /* Attaching image data */
                    image.attr('src', data);
                    
                    /* Binding on select event if exist */
                    image.click(function() {
                        /* Clean up selected state on all images */
                        $('img', Camera.result_holder).removeAttr('selected');
                        $(this).attr('selected', '');
                        
                        if (Camera.event.select) {
                            Camera.event.select(data, image, Camera);
                        }
                    });
                    
                    /* Binding on capture event if exist */
                    if (Camera.event.capture) {
                        Camera.event.capture(data, image, Camera);
                    }
                }, 300);
            } else {
                /* Getting image data */
                var data = Webcam.snap();
                
                /* Creating Camera object */
                var Camera = this;
                
                /* Attaching image data */
                image.attr('src', data);
                
                /* Binding on select event if exist */
                image.click(function() {
                    /* Clean up selected state on all images */
                    $('img', Camera.result_holder).removeAttr('selected');
                    $(this).attr('selected', '');

                    if (Camera.event.select) {
                        Camera.event.select(data, image, Camera);
                    }
                });

                /* Binding on capture event if exist */
                if (Camera.event.capture) {
                    Camera.event.capture(data, image, Camera);
                }
            }
            
            return this;
        },
        stop: function() {
            if (!Webcam) return this;
            Webcam.reset();
            return this;
        },
        reset: function() {
            
        }
    };
    Babon.extend('img:camera-capture', function(object, callback) {
        !object ? object = data('img-camera-capture') : object;
        
        var streamer = data('img-camera-streamer', '', object);
        var viewer = data('img-camera-viewer', '', object);
        var shutter = data('img-camera-shutter', '', object);
        var reseter = data('img-camera-reset', '', object);
        
        useflash = shutter.getData('img-camera-shutter');

        !useflash ? useflash = false : useflash;
        
        var Camera = new CameraStream({
            stream_holder: streamer,
            stream_button: shutter,
            stream_reset: reseter,
            result_holder: viewer
        });
        
        if (useflash) {
            Camera.stream_option.flasher = true;
        }
        if (callback) {
            if (callback.capture_mode) {
                Camera.stream_option.capture_mode = callback.capture_mode;
            }
            if (callback.before_capture) {
                Camera.event.before_capture = callback.before_capture;
            }
            if (callback.capture) {
                Camera.event.capture = callback.capture;
            }
            if (callback.select) {
                Camera.event.select = callback.select;
            }
        }
        
        Camera.stream();
        return Camera;
    });
    
    /* Image croping function */
    func('img:crop', function(image, option) {
        !image ? image = data('img-crop-target') : image;
        !option ? option = {aspectRatio: 1} : option;
        
        if(option.onChange) {
            var originalChange = option.onChange;
        }
        
        var iw = image.width();
        var ih = image.height();
        var cw = 200;
        
        if (iw > ih) {
            cw = ih;
        } else {
            cw = iw;
        }
        
        var x = ((iw / 2) - (cw / 2));
        var y = ((ih/ 2) - (cw / 2));
        
        option.setSelect = [x, y, cw, cw];
        
        option.onChange = function(crop) {
            if (originalChange) {
                originalChange(crop);
            }
            
            vars('img:crop-coordinates', crop);
        };
        
        image.Jcrop(option);
        
        return image;
    });
    func('img:crop:remove', function(object) {
        !object ? object = $('.jcrop-holder') : object;
        object.remove();
    });
    Babon.extend('img:crop', function(image, option) {
        !image ? image = data('img-crop-target') : image;
        
        func('img:crop')(image, option);
        data('img-crop-button').click(function() {
            data('img-crop-loading').addClass('cropped');
            if (option && option.onCrop) {
                option.onCrop(image, vars('img:crop-coordinates'));
            }
        });
    });
    
    /* File upload */
    FileUpload = function() {
        this.event = {
            added: false
        };
        this.files, this.file_map, this.file_data, this.holder, this.button, this.input, this.viewer, this.multiple = false;
        
        return this;
    }
    FileUploader = function() {
        return new FileUpload();
    }
    FileUploader.prototype = FileUpload.prototype = {
        upload: function(url, success, error) {
            if (!url) return this;
            
            var data = new FormData();
            if (this.files && this.files.length > 0) {
                $.each(this.files, function(key, value) {
                    data.append(key, value);
                });

                var setup = {
                    url: url,
                    type: 'POST',
                    data: data,
                    cache: false,
                    datatype: 'json',
                    processData: false,
                    contentType: false,
                    success: function(data, status, xhr) {
                        if (success) {
                            success(data, status, xhr);
                        }
                    },
                    error: function(xhr, status, thrown) {
                        if (error) {
                            error(xhr, status, thrown);
                        }
                    }
                };
                
                $.ajax(setup);
            } else {
                console.warn("We don't have files to upload. Please select one.");
            }
            
            return this;
        },
        preview: function() {
            if (!FileReader) return this;
            
            if (this.filetype === 'image') {
                var holder = this.viewer;
                
                if (this.files) {
                    holder.addClass('added');
                    for (var i = 0; i < this.files.length; ++i) {
                        vars('imgdata:' + i, new FileReader());
                        vars('imgdata:' + i).onload = function(file) {
                            var image = $('<div class="file-image-preview"><img /><div>').setData('file-image-preview', '').css({
                                opacity: 0
                            });
                            var img = $('img', image).attr('src', file.target.result);
                            image.appendTo(holder);
                            
                            if (img.width() > img.height()) {
                                img.addClass('landscape');
                            } else {
                                img.addClass('portrait');
                            }
                            
                            TweenMax.to(image, 0.3, {
                                opacity: 1
                            });
                        }
                        vars('imgdata:' + i).readAsDataURL(this.files[i]);
                    }
                }
            }
            
            return this;
        },
        browse: function() {
            if (this.input) {
                this.input.trigger('click');
            }
            
            return this;
        },
        process: function(files) {
            if (this.input) {
                !files ? files = this.input[0].files : files;
                
                if (files.length < 1) {
                    this.cleanup();
                    return this;
                }
                
                this.files = files;
                this.file_map = [];
                
                for (var i = 0; i < files.length; ++i) {
                    this.file_map.push(files[i].name);
                }
                
                if (this.event.added) {
                    this.event.added(this.files, this.file_map, this);
                }
                
                if (this.filetype === 'image' && this.viewer) {
                    this.preview();
                }
            }
            
            return this;
        },
        cleanup: function() {
            this.file_map, this.files = [];
            if (this.viewer) {
                this.viewer.html(' ').removeClass('added');
            }
            
            return this;
        },
        init: function(object, callback) {
            if (!object) return this;
            
            var file = this;
            
            if (object) {
                if (object.multiple) this.multiple = object.multiple;
                if (object.button) this.button = object.button;
                if (object.holder) this.holder = object.holder;
                if (object.viewer) this.viewer = object.viewer;
                if (object.input) this.input = object.input;
                if (object.filetype) this.filetype = object.filetype;
            }
            if (callback) {
                if (callback.added) this.event.added = callback.added;
            }
            
            if (this.button) {
                this.button.click(function() {
                    file.browse($(this));
                    return false;
                });
            }
            if (this.input) {
                this.input.change(function(e) {
                    if (file.viewer) {
                        file.viewer.html(' ');
                    }
                    if (e.target.files) {
                        file.process(e.target.files);
                    } else {
                        file.process();
                    }
                });
                if (this.multiple) {
                    this.input.prop('multiple', true);
                } else {
                    this.input.prop('multiple', false);
                }
            }
            
            return this;
        }
    };
    Babon.extend('file:upload', function(object, callback) {
        !object ? object = data('file-upload') : object;
        
        var holder = object;
        var button = data('file-browse', '', object);
        var viewer = data('file-view', '', object);
        var input = data('file-hold', '', object);
        var type = object.getData('file-upload');
        var multiple = object.getData('file-multiple');
        
        var obj = {
            holder: holder,
            viewer: viewer,
            button: button,
            input: input,
            filetype: type,
            multiple: multiple
        };
        
        var fileupload = FileUploader().init(obj, callback);
        return fileupload;
    });
})(jQuery, Babon.cons, Babon.vars, Babon.func, Babon.domdata);
(function($, cons, vars, func, data, proto) {
    Babon.extend('dropdown:menu', function(object) {
        !object ? object = data('dropdown-menu') : object;
        
        object.each(function(idx) {
            var dd_id = 'dropdown-' + idx;
            
            $(this).setData('dropdown-parent', dd_id);
            
            var button = data('dropdown-button', '', object).setData('dropdown-parent', dd_id);
            var list = data('dropdown-list', '', object).setData('dropdown-parent', dd_id);
            var item = data('dropdown-item', '', object).setData('dropdown-parent', dd_id);

            button.click(function() {
                var dd_id = $(this).getData('dropdown-parent');
                var list = $(':hasdata(dropdown-list):hasdata(dropdown-parent, ' + dd_id + ')');
                
                var state = list.getData('dropdown-state');
                if (!state) {
                    list.css({
                        opacity: 0,
                        display: 'block',
                        top: '80%'
                    });
                    TweenMax.to(list, 0.3, {
                        top: '100%',
                        opacity: 1
                    });
                    
                    list.setData('dropdown-state', 'active');
                } else {
                    list.remData('dropdown-state');
                    TweenMax.to(list, 0.3, {
                        opacity: 0,
                        top: '80%',
                        onCompleteParams: [list],
                        onComplete: function(node) {
                            node.css({
                                display: 'none'
                            });
                        }
                    });
                }
                
                return false;
            });
            
            item.click(function() {
                var dd_id = $(this).getData('dropdown-parent');
                $(':hasdata(dropdown-button):hasdata(dropdown-parent, ' + dd_id + ')').trigger('click');
            });
        });
    });

    Babon.preload('dropdown:menu');
})(jQuery, Babon.cons, Babon.vars, Babon.func, Babon.domdata, Babon.proto);
(function($, cons, vars, func, data, proto) {
    /* Basic Rating Box */
    Babon.extend('rating:basic', function(object) {
        !object ? object = data('rating-box') : object;
        object.each(function(idx) {
            var rt_id = 'rating-' + (idx + 1);
            
            $(this).setData('rating-parent', rt_id).mouseleave(function(){
                var value = data('rating-value', '', this).val();
                if (value) {
                    data('rating-btn', '', this).removeClass('full');
                    
                    for (var i = 1; i <= value; ++i) {
                        $(':hasdata(star-index, ' + i + ')', this).addClass('full');
                    }
                }
            });
            
            var stars = data('rating-btn', '', this).setData('rating-parent', rt_id).addClass('listen');
            var value = data('rating-value', '', this).setData('rating-parent', rt_id);
            
            stars.each(function(idx) {
                var st_id = (idx + 1);
                $(this).setData('star-index', st_id);
            }).mouseenter(function() {
                var st_id = $(this).getData('star-index');
                var rt_id = $(this).getData('rating-parent');
                
                if (rt_id) {
                    var parent = $(':hasdata(rating-box):hasdata(rating-parent, ' + rt_id + ')');
                    var value = data('rating-value', '', parent);
                    
                    data('rating-btn', '', parent).removeClass('full');

                    if (st_id) {
                        for (var i = 1; i <= st_id; ++i) {
                            $(':hasdata(star-index, ' + i + ')', parent).addClass('full');
                        }
                    }
                }
            }).click(function() {
                var st_id = $(this).getData('star-index');
                var rt_id = $(this).getData('rating-parent');
                if (rt_id) {
                    var parent = $(':hasdata(rating-box):hasdata(rating-parent, ' + rt_id + ')');
                    var value = data('rating-value', '', parent);
                    
                    if (st_id) {
                        value.attr('value', st_id).val(st_id);
                    }
                }
            });
        });
    });
    
    Babon.preload(['rating:basic']);
})(jQuery, Babon.cons, Babon.vars, Babon.func, Babon.domdata, Babon.proto);
(function ($) {
    $(document).ready(function () {
        for (var i = 0; i < Babon.preloader.length; ++i) {
            Babon(Babon.preloader[i]);
        }
    });
})(jQuery);