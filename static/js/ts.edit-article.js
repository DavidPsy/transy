// Generated by CoffeeScript 1.6.1
/*
Save article, triggle when click the save btn, or press Ctrl-S
*/

var adjustHeight, saveArticle;

saveArticle = function() {
  var article, articleId, completeNum, p, _i, _len, _ref;
  article = {
    enTitle: $('.en-title').text(),
    cnTitle: $('.cn-title').text(),
    url: $('.url').text(),
    abstract: $('.abstract').text(),
    paraList: []
  };
  $('.para').each(function() {
    return article.paraList.push({
      en: $(this).find('.en').text().trim(),
      cn: $(this).find('.cn').text().trim(),
      type: $(this).data('type'),
      state: $(this).find('.ec-divider').attr('data-state') === 'true' ? true : false
    });
  });
  completeNum = 0;
  _ref = article.paraList;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    p = _ref[_i];
    if (p.state === true) {
      completeNum++;
    }
  }
  article.completion = (completeNum / article.paraList.length).toFixed(2);
  articleId = $('.title').data('article-id');
  return $.ajax({
    url: "/article/" + articleId + "/edit",
    method: 'POST',
    data: {
      article: article
    },
    success: function(data) {
      if (data.result === 1) {
        return alert('saved');
      }
    }
  });
};

/*
Dynamic change the height of the divider bar
*/


adjustHeight = function(para) {
  var cnHeight, dvHeight, enHeight;
  enHeight = para.find('.en').innerHeight();
  cnHeight = para.find('.cn').innerHeight();
  dvHeight = enHeight > cnHeight ? enHeight : cnHeight;
  return para.find('.ec-divider').css('height', dvHeight + 15 + 'px');
};

$(function() {
  var clickItem;
  $('.para').each(function() {
    return adjustHeight($(this));
  });
  $('.en, .cn').keyup(function() {
    return adjustHeight($(this).parent());
  });
  $('.en, .cn').blur(function() {
    return adjustHeight($(this).parent());
  });
  $('.para').mouseover(function() {
    $('.focus-flag').css('visibility', 'hidden');
    return $(this).find('.focus-flag').css('visibility', 'visible');
  });
  $('.ec-divider').click(function() {
    if ($(this).attr('data-state') === 'false') {
      return $(this).attr('data-state', 'true');
    } else {
      return $(this).attr('data-state', 'false');
    }
  });
  $('.btn-save').click(saveArticle);
  clickItem = null;
  $(document).on('contextmenu', '.para', function(e) {
    if ($(e.target).hasClass('para')) {
      clickItem = e.target;
    } else {
      clickItem = $(e.target).parents('.para').first()[0];
    }
    e.preventDefault();
    return $('.context-menu').css({
      top: e.clientY + 2 + 'px',
      left: e.clientX + 2 + 'px',
      display: 'block'
    });
  });
  $(document).click(function() {
    return $('.context-menu').hide();
  });
  return $('.context-menu').click(function(e) {
    var c;
    c = $(e.target).attr('class');
    switch (c) {
      case 'mheader':
      case 'sheader':
      case 'text':
      case 'quote':
      case 'code':
        $(clickItem).attr('data-type', c);
        return adjustHeight($(clickItem));
      case 'add-para':
        $(clickItem).after("<textarea class='add-content-wap' rows=4></textarea>");
        return $('.add-content-wap').focus().blur(function() {
          var addContent;
          addContent = $(this).val();
          if (addContent !== "") {
            $(clickItem).after("<div data-type='text' class='para clearfix type-text'>\n  <div class='en' contenteditable='true'>" + addContent + "</div\n  ><div class='ec-divider'></div\n  ><div class='cn' contenteditable='true'></div>\n</div>");
            adjustHeight($(clickItem).next());
          }
          $(this).detach();
          return adjustHeight($(clickItem).next());
        });
      case 'remove-para':
        return $(clickItem).detach();
    }
  });
});
