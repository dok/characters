var App = Backbone.Model.extend({
  initialize: function() {
    this.set('myPlayer', new Player('MARTH'));
  }
});

var Player = Backbone.Model.extend({
  initialize: function(name) {
    this.set('name', name);
    this.set('top', 85);
    this.set('left', 100);
    var that = this;

    $('body').keypress(function(event) {
      if(event.which === 119) { //w
        that.set('top', that.get('top') - 5);
      } else if(event.which === 97) { //a
        that.set('left', that.get('left') - 5);
      } else if(event.which === 115) { //s
        that.set('top', that.get('top') + 5);
      } else if(event.which === 100) { //d
        that.set('left', that.get('left') + 5);
      }
    });
  }
});

var AppView = Backbone.View.extend({
  className: 'gameContainer',

  initialize: function() {
    this.model.on('change', function() {
      this.render();
    }, this);
    
    this.render();

    var myPlayerView = new PlayerView({model: this.model.get('myPlayer')});
    $(this.$el).append(myPlayerView.$el);
  },
  render: function() {
    // this.$el.html('');
  }
});

var PlayerView = Backbone.View.extend({
  template: _.template($('.playerTemplate').html()),

  className: 'player',

  initialize: function() {
    this.model.on('change', function() {
      this.render();
    }, this);
    this.$el.html(this.template(this.model.attributes));
    this.render();
  },

  render: function() {
    this.$el.css({
      top: this.model.get('top'),
      left: this.model.get('left')
    });
  }

});