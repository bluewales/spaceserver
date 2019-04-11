class ItemStore {
  constructor() {
    this.store = {};
    this.by_uid = {};

    this.handlers = [];
  }

  add_item(item) {
    if (this.by_uid[item.uid]) {
      return;
    }

    var type = item.type;
    if (!this.store[type]) this.store[type] = [];
    this.store[type].push(item);
    this.by_uid[item.uid] = item;

    this.signal_changed();
  }

  remove_item(item) {
    var type = item.type;

    if (!this.store[type]) {
      return;
    }

    for (var i = 0; i < this.store[type].length; i++) {
      if (this.store[type][i] === item) {
        this.store[type].splice(i, 1);
        this.by_uid[item.uid] = undefined;
        delete this.by_uid[item.uid]; 
        this.signal_changed();
        break;
      }
    }
  }

  find_item(type, accessible_from) {
    if (!this.store[type]) {
      return;
    }
    for (var i = 0; i < this.store[type].length; i++) {
      var item = this.store[type][i];
      if (item.claimed === false) {
        return item;
      }
    }
  }

  get_available_item_counts() {
    var item_counts = {};
    var sprite_keys = {};
    var name_keys = {};

    for (var uid in this.by_uid) {
      let item = this.by_uid[uid];
      let item_label = item.label;

      if (item_label in item_counts) {
        item_counts[item_label] += 1;
      } else {
        item_counts[item_label] = 1;
      }

      sprite_keys[item_label] = item.sprite_key;
      name_keys[item_label] = item.name_key;
    }

    

    var items = [];
    for (var label in item_counts) {
      let count = item_counts[label];
      items.push({
        "label": label,
        "count": count,
        "sprite_key":sprite_keys[label],
        "name_key": name_keys[label]
      });
    }
    items.sort(function (a, b) { return a.label.localeCompare(b.label); });

    return items;
  }

  register_change_handler(handler) {

    this.handlers.push(handler);
  }

  signal_changed() {

    for (let ix in this.handlers) {
      let handler = this.handlers[ix];
      handler(this);
    }
  }
}
