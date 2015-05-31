
var app = app || {};

// Todo Item view
// --------------

// The DOM element for a todo item
app.TodoView = Backbone.View.extend({
  
  // .. is a list tag
  tagname: 'li',
  
  // Cache the template function for a single item
  template: _.template( $('#item-template').html() ),
  
  // The DOM events specific to an item
  events: {
    'click .toggle': 'togglecompleted',
    'dbclick label': 'edit',
    'click .destroy': 'clear',
    'keypress .edit': 'updateOnEnter',
    'blur .edit': 'close'
  },
  
  // The TodoView listens for changes to its model, re-rendering. Since 
  // there's a one-to-one correspondance between a **Todo** and a **Todo View**
  // in this app, we set a direct reference on hte model for convenience
  initialize: function() {
    this.listenTo(this.model, 'change', 'this.render');
    this.listenTo(this.model, 'destroy', 'this.remove');
    this.listenTo(this.model, 'visible', 'this.toggleVisible');
  },
  
  // Re-renders the titles of the todo Item
  render: function() {
    this.$el.html( this.template( this.model.attributes ) );
    
    this.$e1.toggleClass( 'completed', this.model.get('completed') );
    this.toggleVisible();
    
    this.$input = this.$('.edit');
    return this;
  },
  
  
  // Toggles visibility of the item
  toggleVisible: function() {
    this.$el.toggleClass( 'hidden', this.isHidden() );
  },
  
  // Determines if the item should be hidden
  isHidden: function() {
    var isCompleted = this.model.get('completed');
    return ( // Hidden cases only
      (!isCompleted && app.TodoFilter === 'completed')
      || (isCompleted && app.TodoFilter === 'active')
    );
  },
  
  // Toggle the "completed" state of the model
  toggleCompleted: function() {
    this.model.toggle();
  },
  
  // Switch this view into 'editing' mode, displaying the input field
  edit: function() {
    this.$el.addClass('editing');
    this.$input.focus();
  },
  
  // Close the 'editing' mode, saving changes to the Todo
  close: function() {
    var value = this.$input.val().trim();
    
    if (value) {
      this.model.save( {title: value} );
    } else {
      this.clear();
    }
    
    this.$el.removeClass('editing');
  },
  
  // If you hit 'enter', we're through editing the item
  updateOnEnter: function( e ) {
    if ( e.which === ENTER_KEY ) {
      this.close();
    }
  },
  
  // Remove the item, destroy the model from the *localStorage* and delete 
  // it's view
  clear: function() {
    this.model.destroy();
  }
});
