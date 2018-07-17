class LoginPrompt extends InteractionCard {
  constructor() {


    super("");

    this.button_width = 150;
    this.center = true;

    this.initial_choice();
  }

  initial_choice() {

    this.name = "Please login";

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

  switch_to_login() {
    this.name = "Login";

    this.clear_lines();
    this.add_text("This doesn't work yet.");

    this.add_input("Username");
    this.add_input("Password");
    this.add_button("Login", function() {});
    this.add_button("Cancel", function() {
      this.initial_choice();
    }.bind(this));

  }

  switch_to_create() {
    this.name = "Create Account";

    this.clear_lines();
    this.add_text("This doesn't work yet.");

    this.add_input("Username");
    this.add_input("Password");
    this.add_button("Create Account", function() {});
    this.add_button("Cancel", function() {
        this.initial_choice();
      }.bind(this));
  }
}
  