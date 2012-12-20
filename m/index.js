// Generated by CoffeeScript 1.4.0
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
    var actions, alt, c, code, hashParams, layouts, name, nameValue, shift, updateLayout, value, _i, _j, _len, _len1, _ref, _ref1, _results;
    setInterval((function() {
      return $('#cursor').toggleVisibility();
    }), 500);
    $('#editor').on('mousedown touchstart mousemove touchmove', function(e) {
      var $bestE, bestDX, bestDY, bestXSide, te, x, y, _ref, _ref1, _ref2;
      e.preventDefault();
      te = (_ref = (_ref1 = e.originalEvent) != null ? (_ref2 = _ref1.touches) != null ? _ref2[0] : void 0 : void 0) != null ? _ref : e;
      x = te.pageX;
      y = te.pageY;
      bestDY = bestDX = 1 / 0;
      bestXSide = 0;
      $bestE = null;
      $('#editor span').each(function() {
        var $e, dx, dy, p, x1, y1;
        $e = $(this);
        p = $e.position();
        x1 = p.left + $e.width() / 2;
        y1 = p.top + $e.height() / 2;
        dx = Math.abs(x1 - x);
        dy = Math.abs(y1 - y);
        if (dy < bestDY || dy === bestDY && dx < bestDX) {
          $bestE = $e;
          bestDX = dx;
          bestDY = dy;
          bestXSide = x > x1;
        }
      });
      if ($bestE) {
        if (bestXSide) {
          $('#cursor').insertAfter($bestE);
        } else {
          $('#cursor').insertBefore($bestE);
        }
      }
      return false;
    });
    $('.key').bind('mousedown touchstart', function(event) {
      var $k;
      event.preventDefault();
      $k = $(this);
      $k.addClass('down');
      if ($k.hasClass('repeatable')) {
        $k.data('timeoutId', setTimeout(function() {
          $k.data('timeoutId', null);
          $k.trigger('aplkeypress');
          $k.data('intervalId', setInterval((function() {
            return $k.trigger('aplkeypress');
          }), 200));
        }, 500));
      }
      return false;
    });
    $('.key').bind('mouseup touchend', function(event) {
      var $k, iid;
      event.preventDefault();
      $k = $(this);
      $k.removeClass('down');
      clearTimeout($k.data('timeoutId'));
      $k.data('timeoutId', null);
      if ((iid = $k.data('intervalId')) != null) {
        clearInterval(iid);
        $k.data('intervalId', null);
      } else {
        $k.trigger('aplkeypress');
      }
      return false;
    });
    layouts = ['1234567890qwertyuiopasdfghjklzxcvbnm', '!@#$%^&*()QWERTYUIOPASDFGHJKLZXCVBNM', '¨¯<≤=≥>≠∨∧←⍵∈⍴∼↑↓⍳○⋆⍺⌈⌊⍪∇∆∘◇⎕⊂⊃∩∪⊥⊤∣', '⍣[]{}«»;⍱⍲,⌽⍷\\⍉\'"⌷⍬⍟⊖+−×⍒⍋/÷⍞⌿⍀⍝.⍎⍕:'];
    alt = shift = 0;
    updateLayout = function() {
      var layout;
      layout = layouts[2 * alt + shift];
      $('.keyboard .key:not(.special)').each(function(i) {
        return $(this).text(layout[i]);
      });
    };
    updateLayout();
    actions = {
      insert: function(c) {
        return $('<span>').text(c.replace(/\ /g, '\xa0')).insertBefore('#cursor');
      },
      enter: function() {
        return $('<br>').insertBefore('#cursor');
      },
      backspace: function() {
        return $('#cursor').prev().remove();
      },
      exec: function() {
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
      }
    };
    $('.key:not(.special)').on('aplkeypress', function() {
      return actions.insert($(this).text());
    });
    $('.enter').on('aplkeypress', actions.enter);
    $('.space').on('aplkeypress', function() {
      return $('<span>&nbsp;</span>').insertBefore('#cursor');
    });
    $('.bksp').on('aplkeypress', actions.backspace);
    $('.shift').on('aplkeypress', function() {
      $(this).toggleClass('isOn', (shift = 1 - shift));
      return updateLayout();
    });
    $('.alt').on('aplkeypress', function() {
      $(this).toggleClass('isOn', (alt = 1 - alt));
      return updateLayout();
    });
    $('.exec').on('aplkeypress', actions.exec);
    $('body').keypress(function(event) {
      if (event.keyCode === 10) {
        actions.exec();
      } else if (event.keyCode === 13) {
        actions.enter();
      } else {
        actions.insert(String.fromCharCode(event.charCode));
      }
      return false;
    });
    $('body').keydown(function(event) {
      if (event.keyCode === 8) {
        actions.backspace();
      }
    });
    $('#closeOutputButton').bind('mouseup touchend', function(event) {
      event.preventDefault();
      $('#pageInput').show();
      $('#pageOutput').hide();
      return false;
    });
    hashParams = {};
    if (location.hash) {
      _ref = location.hash.substring(1).split(',');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        nameValue = _ref[_i];
        _ref1 = nameValue.split('='), name = _ref1[0], value = _ref1[1];
        hashParams[name] = unescape(value);
      }
    }
    code = hashParams.code;
    if (code) {
      _results = [];
      for (_j = 0, _len1 = code.length; _j < _len1; _j++) {
        c = code[_j];
        if (c === '\n') {
          _results.push(actions.enter());
        } else {
          _results.push(actions.insert(c));
        }
      }
      return _results;
    }
  });
});
