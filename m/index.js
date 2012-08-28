// Generated by CoffeeScript 1.3.3
(function() {

  $.fn.toggleVisibility = function() {
    return this.css('visibility', this.css('visibility') === 'hidden' ? '' : 'hidden');
  };

  $(function() {
    var layoutIndex, layouts, setLayout;
    setInterval((function() {
      return $('#cursor').toggleVisibility();
    }), 500);
    $('#editor span').live('mousedown', function(e) {
      if (e.pageX < $(e.target).position().left + $(e.target).width() / 2) {
        $('#cursor').insertBefore(this);
      } else {
        $('#cursor').insertAfter(this);
      }
      return false;
    });
    $('.key').live('mousedown', function() {
      var _this = this;
      $(this).addClass('down').trigger('aplkeypress');
      return setTimeout((function() {
        return $(_this).removeClass('down');
      }), 500);
    });
    layouts = ['qwertyuiopasdfghjklzxcvbnm', 'QWERTYUIOPASDFGHJKLZXCVBNM', ' ⍵∈⍴∼↑↓⍳○⋆⍺⌈⌊ ∇∆∘◇⎕⊂⊃∩∪⊥⊤∣', ' ⌽⍷ ⍉  ⌷⍬⍟⊖   ⍒⍋ ÷⍞  ⍝ ⍎⍕ '];
    layoutIndex = 0;
    setLayout = function(layout) {
      $('.keyboard .key:not(.layoutSwitch, .backspace, .enter)').each(function(i, e) {
        return $(e).text(layout[i]);
      });
    };
    setLayout(layouts[0]);
    return $('.key').live('aplkeypress', function() {
      if ($(this).hasClass('enter')) {
        $('<br>').insertBefore('#cursor');
      } else if ($(this).hasClass('backspace')) {
        $('#cursor').prev().remove();
      } else if ($(this).hasClass('layoutSwitch')) {
        layoutIndex++;
        layoutIndex %= layouts.length;
        setLayout(layouts[layoutIndex]);
      } else {
        $('<span>').text($(this).text().replace(/[\ \t\r\n]+/g, '')).insertBefore('#cursor');
      }
      return false;
    });
  });

}).call(this);
