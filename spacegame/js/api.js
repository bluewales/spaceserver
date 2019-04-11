class API {
  constructor() {
    this.logged_in = false;

  }
  make_call(data, callback, try_login = true) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    var on_complete = (function (text) {
      var response = JSON.parse(text);
      this.logged_in = response.logged_in == "true";
      if (response.success === "false" && response.logged_in === "false" && try_login) {
        game.login(false, "You need to login for that");
      } else {
        if (callback) callback(response);
      }
    }).bind(this);

    xhr.onreadystatechange = (function () {
      if (this.readyState == 4 && this.status == 200) {
        on_complete(xhr.responseText);
      };
    });

    xhr.send(JSON.stringify(data));
  }

  create_account(username, password, callback) {
    this.make_call(
      { "method": "createuser", "username": username, "password1": password, "password2": password },
      callback,
      false
    );
  }

  submit_login(username, password, callback) {
    this.make_call({ "method": "login", "username": username, "password": password }, callback, false);
  }

  upload_save_state(state, try_login = true) {
    this.make_call({ "data": state, "method": "set_save" }, undefined, try_login);
  }

  download_save_state(callback) {
    this.make_call({ "method": "get_save" }, (function (response) { if (callback) callback(response['data']); }).bind(this));
  }

  logout() {
    this.make_call({ "method": "logout" }, undefined, false);
  }

  download_prices(city, goods, callback) {
    this.make_call({
      "method": "get_prices",
      "city": city,
      "goods": goods.join()
    }, (function (response) {
      if (callback) callback(response['prices']);
    }).bind(this));
  }
}
