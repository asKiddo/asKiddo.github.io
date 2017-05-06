var items = []

var notifyComponents = function() {
  $(ListStore).trigger('storeHasChanged')
}

var findItemById = function(id) {
  return items.filter(function(item) {
    return item.id === id
  })[0]
},

ListStore = {

  getItems: function() {
    return items
  },

  loadItems: function() {
    var loadRequest = $.ajax({
      type:'GET',
      url: "https://listalous.herokuapp.com/lists/ALICIA-STILLWELL-LIST/"
    })

    loadRequest.done(function(dataFromServer) {
      items = dataFromServer.items
      notifyComponents()
    })
  },
  addItem: function(itemDescription) {
    var creationRequest = $.ajax({
      type: 'POST',
      url: "https://listalous.herokuapp.com/lists/ALICIA-STILLWELL-LIST/items",
      data: {description: itemDescription, completed: false}
    })

    creationRequest.done(function(itemDataFromServer) {
      items.push(itemDataFromServer)
      notifyComponents()
    })
  },
  toggleCompleteness: function(itemId) {
    var item = findItemById(itemId)
    var currentCompletnessState = item.completed

    var updateRequest = $.ajax({
      type: 'PUT',
      url: "https://listalous.herokuapp.com/lists/ALICIA-STILLWELL-LIST/items/" + itemId,
      data: { completed: !currentCompletnessState}
    })

    updateRequest.done(function(itemData) {
      item.completed = itemData.completed
      notifyComponents()
    })
  },
  deleteItem: function(itemId) {
    var item = findItemById(itemId)

    var deleteRequest = $.ajax({
      type: 'DELETE',
      url: "https://listalous.herokuapp.com/lists/ALICIA-STILLWELL-LIST/items/" + itemId
    })

    deleteRequest.done(function(itemData) {
      items.splice(items.indexOf(itemData), 1)
      notifyComponents()
    })
  },
  editDescription: function(itemId, newDescription) {
    var item = findItemById(itemId)

    var updateRequest = $.ajax({
      type: 'PUT',
      url: "https://listalous.herokuapp.com/lists/ALICIA-STILLWELL-LIST/items/" + itemId,
      data: { description: newDescription}
    })

    updateRequest.done(function(itemData) {
      item.description = newDescription
      notifyComponents()
    })
  }
}
