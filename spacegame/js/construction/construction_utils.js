function construct_structure(type, pos) {
  if(!type.can_build(pos)) {
    return;
  }
  var raw = type.generate_raw(pos);
  var materials = type.materials;
  var items = [];

  var store = game.ship.item_store;

  for(var i = 0; i < materials.length; i++) {
    var item = store.find_item(materials[i]);
    if(!item) break;
    store.remove_item(item);
    items.push(item);
  }
  if(items.length != materials.length) {
    for(var i = 0; i < items.length; i++) {
      store.add_item(items[i]);
    }
    return;
  }


  var structure = new type();
  structure.init(raw);
  structure.start(raw);
  game.ship.add_structure(structure);
  var job = new Construct(structure, items);

  game.ship.jobs.register_job(job);

  console.log("build " + raw.type + " at " + pos_to_index(pos));
}

function deconstruct_structure(structure) {

  var job = new Deconstruct(structure);
  game.ship.jobs.register_job(job);
  console.log("deconstruct " + structure.label + " at " + pos_to_index(structure.pos));
}
