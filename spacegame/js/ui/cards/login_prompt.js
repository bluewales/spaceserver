class LoginPrompt extends InteractionCard {
  constructor() {

    super("");

    this.button_width = 200;
    this.center = true;

    this.login_dialogue();

    this.blocking = true;
  }

  login_dialogue() {

    this.label = "Please login";

    this.clear_lines();
    this.add_text("You need an account to save.");

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
    this.add_text("Login to load your saved ship.");

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

  switch_to_login() {
    this.label = "Login";

    this.clear_lines();
    this.add_text("This doesn't work yet.");

    this.add_input("Username");
    this.add_input("Password");
    this.add_button("Login", function() {});
    this.add_button("Cancel", function() {
      this.active = false;
    }.bind(this));

  }

  switch_to_create() {
    this.label = "Create Account";

    this.clear_lines();
    this.add_text("This doesn't work yet.");

    this.add_input("Username");
    this.add_input("Password");
    this.add_button("Create Account", function() {});
    this.add_button("Cancel", function() {
      this.active = false;
    }.bind(this));
  }
}
  