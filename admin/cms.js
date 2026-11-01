/* Admin panel extensions. Register custom previews or widgets here (Decap CMS API:
   https://decapcms.org/docs/customization/ and https://decapcms.org/docs/custom-widgets/). */
(function () {
  if (!window.CMS) return;
  // Article previews use the site's own stylesheet, right-to-left
  CMS.registerPreviewStyle('../assets/css/style.css');
  CMS.registerPreviewStyle('body{direction:rtl;background:#05060b;padding:24px}.prose{max-width:760px;margin:0 auto}', { raw: true });
  var h = window.h, createClass = window.createClass;
  var Article = createClass({
    render: function () {
      var e = this.props.entry;
      return h('div', { className: 'reading', dir: 'rtl' },
        h('h1', { className: 'h-lg' }, e.getIn(['data', 'title']) || ''),
        h('p', { className: 'muted' }, e.getIn(['data', 'description']) || ''),
        h('div', { className: 'prose' }, this.props.widgetFor('body')));
    }
  });
  CMS.registerPreviewTemplate('articles', Article);
  CMS.registerPreviewTemplate('faq', Article);
})();
