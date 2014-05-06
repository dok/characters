var App = Backbone.Model.extend({
  initialize: function() {
    this.set('myPlayer', new Player('MARTH'));

    myPlayer = this.get('myPlayer');

    var socket = io.connect('http://localhost:3000');
    this.set('socket', socket);

    $('body').keypress(function(event) {
      if(event.which === 119) { //w
        myPlayer.set('top', myPlayer.get('top') - 5);
      } else if(event.which === 97) { //a
        myPlayer.set('left', myPlayer.get('left') - 5);
      } else if(event.which === 115) { //s
        myPlayer.set('top', myPlayer.get('top') + 5);
      } else if(event.which === 100) { //d
        myPlayer.set('left', myPlayer.get('left') + 5);
      }
      socket.emit('changePos',
        {
          top: myPlayer.get('top'),
          left: myPlayer.get('left')
        }
      );
    });


    // socket.on('playerMove', function (data) {
    //   console.log(data);
    //   that.set('top', data.top);
    //   that.set('left', data.left);
    // });
  }
});

var Player = Backbone.Model.extend({
  initialize: function(name) {
    this.set('name', name);
    this.set('top', 85);
    this.set('left', 100);
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
    var that = this;
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