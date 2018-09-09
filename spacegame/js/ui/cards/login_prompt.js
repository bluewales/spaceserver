class LoginPrompt extends InteractionCard {
  constructor() {

    super("");

    this.default_width = 300;

    this.button_width = 200;
    this.center = true;

    this.login_dialogue();

    this.blocking = true;
  }

  login_dialogue(message="") {

    this.label = "Please login";
    

    this.clear_lines();
    if(message.length > 0)
      this.add_text(message);

    this.add_button("Login", function() {
        this.switch_to_login();
      }.bind(this));
      this.add_text("or");
      this.add_button("Create Account", function() {
        this.switch_to_create();
      }.bind(this));
  }

  initial_dialogue() {

    this.label = "Login";

    this.clear_lines();

    this.add_button("Login", function () {
      this.switch_to_login();
    }.bind(this));

    this.add_text("or");
    
    this.add_button("Create Account", function () {
      this.switch_to_create();
    }.bind(this));

    this.add_text("or");

    this.add_button("Continue as Guest", function () {
      this.active = false;
    }.bind(this));
  }

  switch_to_login(message = "") {
    this.label = "Login";

    this.clear_lines();
    if(message.length > 0)
      this.add_text(message);

    this.username_id = this.add_input("Username");
    this.password_id = this.add_password("Password");
    this.add_button("Login", function() {
      var username = this.get_input_value(this.username_id);
      var password = this.get_input_value(this.password_id);

      game.api.submit_login(username, password, function(result) {
        if(result.success === "true") {
          location.reload();
        } else {
          this.switch_to_login(result.message);
        }
      }.bind(this));
      
    }.bind(this));
    this.add_button("Cancel", function() {
      this.active = false;
    }.bind(this));
  }

  switch_to_create(message = "") {
    this.label = "Create Account";

    this.clear_lines();
    if (message.length > 0)
      this.add_text(message);

    this.username_id = this.add_input("Username");
    this.password_id = this.add_password("Password");
    this.add_button("Create Account", function() {
      var username = this.get_input_value(this.username_id);
      var password = this.get_input_value(this.password_id);

      game.api.create_account(username, password, function (result) {
        if (result.success === "true") {
          this.active = false;
        } else {
          this.switch_to_create(result.message);
        }
      }.bind(this));
    }.bind(this));
    this.add_button("Cancel", function() {
      this.active = false;
    }.bind(this));
  }
}
  