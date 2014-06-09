var App = Backbone.Model.extend({
  initialize: function() {
    var that = this;
    this.set('myPlayer', new Player(window.name));
    var socket = io.connect('127.0.0.1:3000');

    myPlayer = this.get('myPlayer');

    socket.emit('newCharacter', {
      name: myPlayer.get('name'),
      top: myPlayer.get('top'),
      left: myPlayer.get('left')
    });

    socket.on('loadAllPlayers', function(allPlayers) {
      _.each(allPlayers, function(player) {
        that.set(player.name, new Player(player.name, player.top, player.left));
        that.trigger('createNewCharacterView', that.get(player.name));
      });
    });

    socket.on('enterCharacter', function(newPlayer) {
      if(newPlayer.name !== that.get('myPlayer').get('name')) {
        that.set(newPlayer.name, new Player(newPlayer.name));
        that.trigger('createNewCharacterView', that.get(newPlayer.name));
      }
    });

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
          name: myPlayer.get('name'),
          top: myPlayer.get('top'),
          left: myPlayer.get('left')
        }
      );
    });

    socket.on('refreshPlayerPosition', function(player) {
      if(that.get(player.name) && that.get(player.name).get('name') !== that.get('myPlayer').get('name')) {
        that.get(player.name).set('top', player.top);
        that.get(player.name).set('left', player.left);
      }
    });

  }
});

var Player = Backbone.Model.extend({
  initialize: function(name, top, left) {
    this.set('name', name);
    if(top) {
      this.set('top', top);
    } else {
      this.set('top', 85);
    }
    if(left) {
      this.set('left', left);
    } else {
      this.set('left', 100);
    }

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

    this.model.on('createNewCharacterView', function(newPlayer) {
      console.log('creating a new character view');
      this.createNewCharacterView(newPlayer);
    }, this);
  },
  render: function() {
    // this.$el.html('');
  },
  createNewCharacterView: function(newPlayer) {
    console.log('newPlayer', newPlayer);
    var newPlayerView = new PlayerView({model: newPlayer});
    $(this.$el).append(newPlayerView.$el);
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