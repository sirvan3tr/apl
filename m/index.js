// Generated by CoffeeScript 1.3.3
var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(['../lib/compiler', '../lib/browser', '../lib/helpers'], function(compiler, browser, helpers) {
  var browserBuiltins, esc, escHard, escT, exec, extractTextFromDOM, formatAsHTML, formatHTMLTable, inherit;
  exec = compiler.exec;
  browserBuiltins = browser.browserBuiltins;
  inherit = helpers.inherit;
  escT = {
    '<': 'lt',
    '>': 'gt',
    '&': 'amp',
    "'": 'apos',
    '"': 'quot'
  };
  esc = function(s) {
    if (s) {
      return s.replace(/[<>&'"]/g, function(x) {
        return "&" + escT[x] + ";";
      });
    } else {
      return '';
    }
  };
  escHard = function(s) {
    return esc(s).replace(/\ /g, '&nbsp;').replace(/\n/g, '<br/>');
  };
  formatAsHTML = function(x) {
    var i, nPlanes, nc, nr, planeSize, planes, rx, sx, y, _ref;
    try {
      if (typeof x === 'string') {
        return "<span class='character'>" + (esc(x).replace(' ', '&nbsp;', 'g')) + "</span>";
      } else if (typeof x === 'number') {
        return "<span class='number'>" + (('' + x).replace(/-|Infinity/g, '¯')) + "</span>";
      } else if (typeof x === 'function') {
        return "<span class='function'>" + (x.isPrefixOperator || x.isInfixOperator || x.isPostfixOperator ? 'operator' : 'function') + (x.aplName ? ' ' + x.aplName : '') + "</span>";
      } else if (!(x.length != null)) {
        return "<span class='unknown'>" + (esc('' + x)) + "</span>";
      } else if (x.shape && x.shape.length > 2) {
        sx = x.shape;
        rx = sx.length;
        planeSize = sx[rx - 2] * sx[rx - 1];
        nPlanes = x.length / planeSize;
        planes = (function() {
          var _i, _results;
          _results = [];
          for (i = _i = 0; 0 <= nPlanes ? _i < nPlanes : _i > nPlanes; i = 0 <= nPlanes ? ++_i : --_i) {
            _results.push(formatHTMLTable(x.slice(i * planeSize, (i + 1) * planeSize), sx[rx - 1], sx[rx - 2], 'subarray'));
          }
          return _results;
        })();
        nc = sx[rx - 3];
        nr = nPlanes / nc;
        return formatHTMLTable(planes, nr, nc, 'array');
      } else {
        if (x.length === 0) {
          return "<table class='array empty'><tr><td>empty</table>";
        }
        _ref = x.shape || [1, x.length], nr = _ref[0], nc = _ref[1];
        x = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = x.length; _i < _len; _i++) {
            y = x[_i];
            _results.push(formatAsHTML(y));
          }
          return _results;
        })();
        return formatHTMLTable(x, nr, nc, 'array');
      }
    } catch (e) {
      if (typeof console !== "undefined" && console !== null) {
        if (typeof console.error === "function") {
          console.error(e);
        }
      }
      return '<span class="error">Presentation error</span>';
    }
  };
  formatHTMLTable = function(a, nr, nc, cssClass) {
    var c, r, s, _i, _j;
    s = "<table class='" + cssClass + "'>";
    for (r = _i = 0; 0 <= nr ? _i < nr : _i > nr; r = 0 <= nr ? ++_i : --_i) {
      s += '<tr>';
      for (c = _j = 0; 0 <= nc ? _j < nc : _j > nc; c = 0 <= nc ? ++_j : --_j) {
        s += "<td>" + a[nc * r + c] + "</td>";
      }
      s += '</tr>';
    }
    return s += '</table>';
  };
  $.fn.toggleVisibility = function() {
    return this.css('visibility', this.css('visibility') === 'hidden' ? '' : 'hidden');
  };
  extractTextFromDOM = function(e) {
    var c, r, _ref;
    if ((_ref = e.nodeType) === 3 || _ref === 4) {
      return e.nodeValue;
    } else if (e.nodeType === 1) {
      if (e.nodeName.toLowerCase() === 'br') {
        return '\n';
      } else {
        c = e.firstChild;
        r = '';
        while (c) {
          r += extractTextFromDOM(c);
          c = c.nextSibling;
        }
        return r;
      }
    }
  };
  return jQuery(function($) {
    var alt, layouts, shift, updateLayout;
    setInterval((function() {
      return $('#cursor').toggleVisibility();
    }), 500);
    $('#editor').on('mousedown touchstart', 'span', function(e) {
      var x, _ref, _ref1, _ref2;
      e.preventDefault();
      x = ((_ref = (_ref1 = e.originalEvent) != null ? (_ref2 = _ref1.touches) != null ? _ref2[0] : void 0 : void 0) != null ? _ref : e).pageX;
      if (x < $(e.target).position().left + $(e.target).width() / 2) {
        $('#cursor').insertBefore(this);
      } else {
        $('#cursor').insertAfter(this);
      }
      return false;
    });
    $('.key').bind('mousedown touchstart', function(event) {
      event.preventDefault();
      $(this).addClass('down').trigger('aplkeypress');
      return false;
    });
    $('.key').bind('mouseup touchend', function(event) {
      event.preventDefault();
      $(this).removeClass('down');
      return false;
    });
    layouts = ['1234567890qwertyuiopasdfghjklzxcvbnm', '!@#$%^&*()QWERTYUIOPASDFGHJKLZXCVBNM', '¨¯<≤=≥>≠∨∧←⍵∈⍴∼↑↓⍳○⋆⍺⌈⌊ ∇∆∘◇⎕⊂⊃∩∪⊥⊤∣', '⍣[]{}«»;⍱⍲ ⌽⍷\\⍉\'"⌷⍬⍟⊖+−×⍒⍋/÷⍞⌿⍀⍝ ⍎⍕:'];
    alt = shift = 0;
    updateLayout = function() {
      var layout;
      layout = layouts[2 * alt + shift];
      $('.keyboard .key:not(.special)').each(function(i) {
        return $(this).text(layout[i]);
      });
    };
    updateLayout();
    $('.key:not(.special)').on('aplkeypress', function() {
      return $('<span>').text($(this).text()).insertBefore('#cursor');
    });
    $('.enter').on('aplkeypress', function() {
      return $('<br>').insertBefore('#cursor');
    });
    $('.space').on('aplkeypress', function() {
      return $('<span>&nbsp;</span>').insertBefore('#cursor');
    });
    $('.bksp').on('aplkeypress', function() {
      return $('#cursor').prev().remove();
    });
    $('.shift').on('aplkeypress', function() {
      $(this).toggleClass('isOn', (shift = 1 - shift));
      return updateLayout();
    });
    $('.alt').on('aplkeypress', function() {
      $(this).toggleClass('isOn', (alt = 1 - alt));
      return updateLayout();
    });
    $('.exec').on('aplkeypress', function() {
      var ctx;
      ctx = inherit(browserBuiltins);
      try {
        $('#result').html(formatAsHTML(exec(extractTextFromDOM(document.getElementById('editor')).replace(/\xa0/g, ' '))));
      } catch (err) {
        if (typeof console !== "undefined" && console !== null) {
          if (typeof console.error === "function") {
            console.error(err);
          }
        }
        $('#result').html("<div class='error'>" + (escHard(err.message)) + "</div>");
      }
      $('#pageInput').hide();
      $('#pageOutput').show();
    });
    return $('#closeOutputButton').bind('mousedown touchstart', function(event) {
      event.preventDefault();
      $('#pageInput').show();
      $('#pageOutput').hide();
      return false;
    });
  });
});
