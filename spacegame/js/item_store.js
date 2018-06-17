class ItemStore {
  constructor() {
    this.store = {};
    this.by_uid = {};
  }

  add_item(item) {
    if(this.by_uid[item.uid]) {
      return;
    }

    var type = item.type;
    if(!this.store[type]) this.store[type] = [];
    this.store[type].push(item);
    this.by_uid[item.uid] = item;
  }

  remove_item(item) {
    var type = item.type;

    if(!this.store[type]) {
      return;
    }

    for(var i = 0; i < this.store[type].length; i++) {
      if(this.store[type][i] === item) {
        this.store[type].splice(i,1);
        this.by_uid[item.uid] = undefined;
        break;
      }
    }
  }

  claim_item(type, accessible_from) {
    if(!this.store[type]) {
      return;
    }
    for(var i = 0; i < this.store[type].length; i++) {
      var item = this.store[type][i];
      if(item.claimed === false) {
        return item;
      }
    }
  }
}
