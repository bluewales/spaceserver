class TopBar extends Bar {
  constructor() {
    var button_data = [
      {
        "text": "Controls",
        "card": new ControlsCard()
      }, {
        "text": "Pause",
        "on_click": function (event) {
          game.pause(this.active);
        }
      }, {
        "text": "Save",
        "on_click": function (event) {
          game.save();
        },
        "mode": "reset"
      }, {
        "text": "Logout",
        "on_click": function (event) {
          game.logout();
        },
        "mode": "reset",
        "on_tick": function() {
          if (this.logged_in == game.api.logged_in) return;
          if(game.api.logged_in) {
            this.text.text = "Logout";
            this.on_click = function() {game.logout();};
          } else {
            this.text.text = "Login";
            this.on_click = function() {game.login();};
          }
          this.logged_in = game.api.logged_in;
        }
      }
    ];

    super(true, button_data);
  }
}
