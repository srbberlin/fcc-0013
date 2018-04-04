'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// "use strict";

// ====================================================
// Redux section
//

// ====================================================
// Reducer command ids
//

var INIT = '@@redux/INIT'; // Driven by createStore(...)
var RESTART = 'RESTART'; // Resets the whole storage to a vergin state
var ADD_RECIPE = 'ADD_RECIPE'; // Appends one recipe
var GET_RECIPE = 'GET_RECIPE'; // Retreaves one recipe by it's UUID
var CHANGE_RECIPE = 'CHANGE_RECIPE'; // Saves changes to one recipe by it's UUID
var DELETE_RECIPE = 'DELETE_RECIPE'; // Deletes one recipe by it's UUID

var SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'; // Narrows the choices

// ====================================================
// Filter values, might be or'd together
//

var CATEGORY_NONE = 0; // Nothing
var CATEGORY_001 = 1;
var CATEGORY_002 = 2;
var CATEGORY_003 = 4;
var CATEGORY_004 = 8;
var CATEGORY_ALL = -1; // All

// ====================================================
// Filter values verbose
//

var categories = {
  CATEGORY_001: 'Breakfast',
  CATEGORY_002: 'Dinner',
  CATEGORY_003: 'Supper',
  CATEGORY_004: 'Vegatrian'

  // ====================================================
  // Reducer implementing the commands
  //

};var recipes = function recipes(state, action) {
  var res = void 0;
  switch (action.type) {
    case INIT:
      res = {
        visibility: -1,
        value: [] };
      break;
    case RESTART:
      res = {
        visibility: action.state.visibility,
        value: action.state.value };
      break;
    case ADD_RECIPE:
      res = {
        visibility: state.visibility,
        value: state.value.concat([{
          id: action.id,
          title: action.title,
          ingredients: action.ingredients,
          procedure: action.procedure,
          category: action.category }]) };
      break;
    case CHANGE_RECIPE:
      res = {
        visibility: state.visibility,
        value: state.value.map(function (act) {
          if (act.id === action.id) {
            act.title = action.title;
            act.ingredients = action.ingredients;
            act.procedure = action.procedure;
            act.category = action.category;
          }
          return act;
        })
      };
      break;
    case DELETE_RECIPE:
      res = {
        visibility: state.visibility,
        value: state.value.filter(function (act) {
          return act.id !== action.id;
        })
      };
      break;
    case SET_VISIBILITY_FILTER:
      res = {
        visibility: action.value,
        value: state.value
      };
      break;
    default:
      res = state;
  }
  return res;
};

// ====================================================
// Return command parameters
//

// ====================================================
// Parameters
//   state: { visibility: <number>, value: <array of recipes> }
//

var restart = function restart(state) {
  return {
    type: RESTART,
    state: state
  };
};

// ====================================================
// Parameters
//   t, i, p, c: self explanatory
//

var add = function add(t, i, p, c) {
  return {
    type: ADD_RECIPE,
    id: uuid.v4(),
    title: t,
    ingredients: i,
    procedure: p,
    category: c
  };
};

// ====================================================
// Parameters
//   id: UUID of the recipe
//

var get = function get(id) {
  return {
    type: GET_RECIPE,
    value: id
  };
};

// ====================================================
// Parameters
//   id, t, i, p, c: self explanatory
//

var change = function change(id, t, i, p, c) {
  return {
    type: CHANGE_RECIPE,
    id: id,
    title: t,
    ingredients: i,
    procedure: p,
    category: c
  };
};

// ====================================================
// Parameters
//   id: UUID of the recipe
//

var del = function del(id) {
  return {
    type: DELETE_RECIPE,
    id: id
  };
};

// ====================================================
// Parameters
//   v: ored value of none ore more filter values
//

var vis = function vis(v) {
  return {
    type: SET_VISIBILITY_FILTER,
    value: v
  };
};

// ====================================================
// Using the local storage
//

// ====================================================
// Save the actual state of the store to
// the Browsers local storage
//

var storeLocal = function storeLocal() {
  window.localStorage.setItem('recipes', JSON.stringify(store.getState()));
};

// ====================================================
// Retrieve the state of the store from
// the browsers local storage
//

var getLocal = function getLocal() {
  if (window.localStorage.recipes) {
    store.dispatch(restart(JSON.parse(window.localStorage.recipes)));
  } else {
    store.dispatch(add('der erste Versuch', '1. Mut, \n2. Geld, \n3. Geduld', 'und viel mehr', CATEGORY_001));
    store.dispatch(add('der zweite Versuch', 'Weas man so braucht ...', 'auch nicht viel mehr', CATEGORY_002));
    storeLocal();
  }
  var res = store.getState();
  return res;
};

// ====================================================
// Retrieves one recipe from storage
//

var getRecipe = function getRecipe(id) {
  return store.getState().value.filter(function (act) {
    return act.id === id;
  })[0];
};

var newRecipe = function newRecipe(t, i, p, c) {
  var r = add(t, i, p, c);
  store.dispatch(r);
  return r.id;
};

var changeRecipe = function changeRecipe(id, t, i, p, c) {
  var r = change(id, t, i, p, c);
  store.dispatch(r);
  return r.id;
};

var deleteRecipe = function deleteRecipe(id) {
  var r = del(id);
  store.dispatch(r);
  return null;
};

var store = Redux.createStore(recipes);

// ====================================================
// Eventhandling
//
// All functions return objects used by the setState
// function of the toplevel componet given to the
// force function implemented there. The force function
// is called by the eventhandlers of the navigation.
//
// Parameters and returned values are self explanatory.
//

var navStorageChange = function navStorageChange(id) {
  return {
    store: store.getState(),
    id: id,
    v: {
      select: 'none',
      view: 'block',
      new: 'none',
      edit: 'none',
      delete: 'none'
    }
  };
};

var _navItem = function _navItem(id) {
  return {
    id: id,
    v: {
      select: 'none',
      view: 'block',
      new: 'none',
      edit: 'none',
      delete: 'none'
    }
  };
};

var _navSelect = function _navSelect() {
  return {
    v: {
      select: 'block',
      view: 'none',
      new: 'none',
      edit: 'none',
      delete: 'none'
    }
  };
};

var _navView = function _navView() {
  return {
    v: {
      select: 'none',
      view: 'block',
      new: 'none',
      edit: 'none',
      delete: 'none'
    }
  };
};

var _navNew = function _navNew() {
  return {
    v: {
      select: 'none',
      view: 'none',
      new: 'block',
      edit: 'none',
      delete: 'none'
    }
  };
};

var _navEdit = function _navEdit() {
  return {
    v: {
      select: 'none',
      view: 'none',
      new: 'none',
      edit: 'block',
      delete: 'none'
    }
  };
};

var _navDelete = function _navDelete() {
  return {
    v: {
      select: 'none',
      view: 'none',
      new: 'none',
      edit: 'none',
      delete: 'block'
    }
  };
};

// ====================================================
// React section
//

var Select = function (_React$Component) {
  _inherits(Select, _React$Component);

  function Select(props) {
    _classCallCheck(this, Select);

    var _this = _possibleConstructorReturn(this, (Select.__proto__ || Object.getPrototypeOf(Select)).call(this, props));

    _this.navItem = _this.navItem.bind(_this);
    return _this;
  }

  _createClass(Select, [{
    key: 'navItem',
    value: function navItem(e) {
      this.props.force(_navItem(e.target.id));
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      console.log('render: Select');
      var a = this.props;
      var v = a.v;
      var m = a.m;
      var j = 0;
      var r = [];
      return React.createElement(
        'div',
        { id: 'Select', style: { display: v } },
        m.reduce(function (val, act) {
          // if (true) {
          r = val.concat([React.createElement(
            'div',
            { className: 'selitem', key: ++j, id: act.id, onClick: _this2.navItem },
            act.title
          )]);
          // }
          return r;
        }, r)
      );
    }
  }]);

  return Select;
}(React.Component);

var View = function (_React$Component2) {
  _inherits(View, _React$Component2);

  function View(props) {
    _classCallCheck(this, View);

    var _this3 = _possibleConstructorReturn(this, (View.__proto__ || Object.getPrototypeOf(View)).call(this, props));

    _this3.title = '';
    _this3.ingedients = '';
    _this3.procedure = '';
    _this3.category = '';
    return _this3;
  }

  _createClass(View, [{
    key: 'render',
    value: function render() {
      console.log('render: View:', this.props.item);
      var v = this.props.v;
      var i = this.props.item;

      this.title = i.title;
      this.ingredients = i.ingredients;
      this.procedure = i.procedure;
      this.category = i.category;

      return React.createElement(
        'div',
        { id: 'View', style: { display: v } },
        React.createElement(
          'div',
          { className: 'subcontainer' },
          this.title
        ),
        React.createElement(
          'div',
          { className: 'subcontainer' },
          this.ingredients
        ),
        React.createElement(
          'div',
          { className: 'subcontainer' },
          this.procedure
        ),
        React.createElement(
          'div',
          { className: 'subcontainer' },
          this.category
        )
      );
    }
  }]);

  return View;
}(React.Component);

var Edit = function (_React$Component3) {
  _inherits(Edit, _React$Component3);

  function Edit(props) {
    _classCallCheck(this, Edit);

    var _this4 = _possibleConstructorReturn(this, (Edit.__proto__ || Object.getPrototypeOf(Edit)).call(this, props));

    _this4.titleNew = _this4.titleNew.bind(_this4);
    _this4.ingredientsNew = _this4.ingredientsNew.bind(_this4);
    _this4.procedureNew = _this4.procedureNew.bind(_this4);
    _this4.categoryNew = _this4.categoryNew.bind(_this4);
    _this4.save = _this4.save.bind(_this4);

    var i = _this4.props.item;
    _this4.state = {
      id: i.id,
      title: i.title,
      ingredients: i.ingredients,
      procedure: i.procedure,
      category: i.category,
      reload: true
    };
    return _this4;
  }

  _createClass(Edit, [{
    key: 'titleNew',
    value: function titleNew(e) {
      this.setState({ title: e.target.value, reload: false });
    }
  }, {
    key: 'ingredientsNew',
    value: function ingredientsNew(e) {
      this.setState({ ingredients: e.target.value, reload: false });
    }
  }, {
    key: 'procedureNew',
    value: function procedureNew(e) {
      this.setState({ procedure: e.target.value, reload: false });
    }
  }, {
    key: 'categoryNew',
    value: function categoryNew(e) {
      this.setState({ category: e.target.value, reload: false });
    }
  }, {
    key: 'save',
    value: function save(e) {
      this.setState({ reload: false });
      this.props.force(_navItem(changeRecipe(this.state.id, this.state.title, this.state.ingredients, this.state.procedure, this.state.category)));
      storeLocal();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps() {
      if (this.state.reload) {
        var i = this.props.item;

        this.setState({
          id: i.id,
          title: i.title,
          ingredients: i.ingredients,
          procedure: i.procedure,
          category: i.category
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      console.log('render: Edit:', this.props.item);
      var v = this.props.v;

      return React.createElement(
        'div',
        { id: 'Edit', style: { display: v } },
        React.createElement('textarea', { className: 'subcontainer', onChange: this.titleNew, value: this.state.title }),
        React.createElement('textarea', { className: 'subcontainer', onChange: this.ingredientsNew, value: this.state.ingredients }),
        React.createElement('textarea', { className: 'subcontainer', onChange: this.procedureNew, value: this.state.procedure }),
        React.createElement('textarea', { className: 'subcontainer', onChange: this.categoryNew, value: this.state.category }),
        React.createElement(
          'button',
          { onClick: this.save },
          'Save'
        ),
        React.createElement('br', null)
      );
    }
  }]);

  return Edit;
}(React.Component);

var New = function (_React$Component4) {
  _inherits(New, _React$Component4);

  function New(props) {
    _classCallCheck(this, New);

    var _this5 = _possibleConstructorReturn(this, (New.__proto__ || Object.getPrototypeOf(New)).call(this, props));

    _this5.state = {
      title: '',
      ingredients: '',
      procedure: '',
      category: ''
    };

    _this5.titleNew = _this5.titleNew.bind(_this5);
    _this5.ingredientsNew = _this5.ingredientsNew.bind(_this5);
    _this5.procedureNew = _this5.procedureNew.bind(_this5);
    _this5.categoryNew = _this5.categoryNew.bind(_this5);
    _this5.save = _this5.save.bind(_this5);
    return _this5;
  }

  _createClass(New, [{
    key: 'titleNew',
    value: function titleNew(e) {
      this.setState({ title: e.target.value });
    }
  }, {
    key: 'ingredientsNew',
    value: function ingredientsNew(e) {
      this.setState({ ingredients: e.target.value });
    }
  }, {
    key: 'procedureNew',
    value: function procedureNew(e) {
      this.setState({ procedure: e.target.value });
    }
  }, {
    key: 'categoryNew',
    value: function categoryNew(e) {
      this.setState({ category: e.target.value });
    }
  }, {
    key: 'save',
    value: function save(e) {
      this.props.force(navStorageChange(newRecipe(this.state.title, this.state.ingredients, this.state.procedure, this.state.category)));
      this.setState({
        title: '',
        ingredients: '',
        procedure: '',
        category: ''
      });
      storeLocal();
    }
  }, {
    key: 'render',
    value: function render() {
      console.log('render: New:');
      var v = this.props.v;
      return React.createElement(
        'div',
        { id: 'New', style: { display: v } },
        React.createElement('textarea', { className: 'subcontainer', onChange: this.titleNew, value: this.state.title }),
        React.createElement('textarea', { className: 'subcontainer', onChange: this.ingredientsNew, value: this.state.ingredients }),
        React.createElement('textarea', { className: 'subcontainer', onChange: this.procedureNew, value: this.state.procedure }),
        React.createElement('textarea', { className: 'subcontainer', onChange: this.categoryNew, value: this.state.category }),
        React.createElement(
          'button',
          { onClick: this.save },
          'Save'
        ),
        React.createElement('br', null)
      );
    }
  }]);

  return New;
}(React.Component);

var Delete = function (_React$Component5) {
  _inherits(Delete, _React$Component5);

  function Delete(props) {
    _classCallCheck(this, Delete);

    var _this6 = _possibleConstructorReturn(this, (Delete.__proto__ || Object.getPrototypeOf(Delete)).call(this, props));

    _this6.delete = _this6.delete.bind(_this6);
    return _this6;
  }

  _createClass(Delete, [{
    key: 'delete',
    value: function _delete(e) {
      this.props.force(navStorageChange(deleteRecipe(this.props.item.id)));
    }
  }, {
    key: 'render',
    value: function render() {
      var a = this.props;
      var v = a.v;
      var i = a.item;
      console.log('render: Delete:', this.props.item);
      return React.createElement(
        'div',
        { id: 'Delete', style: { display: v } },
        React.createElement(
          'div',
          { className: 'subcontainer' },
          i.title
        ),
        React.createElement(
          'div',
          { className: 'subcontainer' },
          i.ingredients
        ),
        React.createElement(
          'div',
          { className: 'subcontainer' },
          i.procedure
        ),
        React.createElement(
          'div',
          { className: 'subcontainer' },
          i.category
        ),
        React.createElement(
          'button',
          { onClick: this.delete },
          'Ok'
        ),
        React.createElement('br', null)
      );
    }
  }]);

  return Delete;
}(React.Component);

// ====================================================
// Second child of the top level React component
//
// All navigations.
//

var Nav = function (_React$Component6) {
  _inherits(Nav, _React$Component6);

  function Nav(props) {
    _classCallCheck(this, Nav);

    var _this7 = _possibleConstructorReturn(this, (Nav.__proto__ || Object.getPrototypeOf(Nav)).call(this, props));

    _this7.navSelect = _this7.navSelect.bind(_this7);
    _this7.navView = _this7.navView.bind(_this7);
    _this7.navEdit = _this7.navEdit.bind(_this7);
    _this7.navNew = _this7.navNew.bind(_this7);
    _this7.navDelete = _this7.navDelete.bind(_this7);
    _this7.disable = _this7.disable.bind(_this7);
    return _this7;
  }

  _createClass(Nav, [{
    key: 'navSelect',
    value: function navSelect(e) {
      this.props.force(_navSelect(e));
    }
  }, {
    key: 'navView',
    value: function navView(e) {
      this.props.force(_navView(e));
    }
  }, {
    key: 'navEdit',
    value: function navEdit(e) {
      this.props.force(_navEdit(e));
    }
  }, {
    key: 'navNew',
    value: function navNew(e) {
      this.props.force(_navNew(e));
    }
  }, {
    key: 'navDelete',
    value: function navDelete(e) {
      this.props.force(_navDelete(e));
    }
  }, {
    key: 'disable',
    value: function disable(e) {
      e.preventDefault();
    }
  }, {
    key: 'render',
    value: function render() {
      console.log('render: Nav');
      var bgSelect = this.props.v.select === 'block' ? { backgroundColor: 'gray' } : { backgroundColor: '#CCCCCC' };
      var bgView = this.props.v.view === 'block' ? { backgroundColor: 'gray' } : { backgroundColor: '#CCCCCC' };
      var bgEdit = this.props.v.edit === 'block' ? { backgroundColor: 'gray' } : { backgroundColor: '#CCCCCC' };
      var bgNew = this.props.v.new === 'block' ? { backgroundColor: 'gray' } : { backgroundColor: '#CCCCCC' };
      var bgDelete = this.props.v.delete === 'block' ? { backgroundColor: 'gray', float: 'right' } : { backgroundColor: '#CCCCCC', float: 'right' };

      return React.createElement(
        'div',
        { className: 'w3-bar' },
        React.createElement(
          'div',
          { className: 'w3-bar-item w3-button', style: bgSelect, onMouseDown: this.navSelect, onMouseOut: this.disable },
          'Select'
        ),
        React.createElement(
          'div',
          { className: 'w3-bar-item w3-button', style: bgView, onClick: this.navView },
          'View'
        ),
        React.createElement(
          'div',
          { className: 'w3-bar-item w3-button', style: bgEdit, onClick: this.navEdit },
          'Edit'
        ),
        React.createElement(
          'div',
          { className: 'w3-bar-item w3-button', style: bgNew, onClick: this.navNew },
          'New'
        ),
        React.createElement(
          'div',
          { className: 'w3-bar-item w3-button', style: bgDelete, onClick: this.navDelete },
          'Delete'
        )
      );
    }
  }]);

  return Nav;
}(React.Component);

// ====================================================
// Second child of the top level React component
//
// Includes choices, views and editor fields.
//

var Stage = function (_React$Component7) {
  _inherits(Stage, _React$Component7);

  function Stage() {
    _classCallCheck(this, Stage);

    return _possibleConstructorReturn(this, (Stage.__proto__ || Object.getPrototypeOf(Stage)).apply(this, arguments));
  }

  _createClass(Stage, [{
    key: 'render',
    value: function render() {
      var a = this.props;
      var v = a.v;
      var m = a.store.value;
      var i = getRecipe(a.id);
      console.log('render: Stage:', i);
      return React.createElement(
        'div',
        { id: 'Stage' },
        React.createElement(Select, { v: v.select, m: m, force: a.force }),
        React.createElement(View, { v: v.view, item: i }),
        React.createElement(Edit, { v: v.edit, item: i, force: a.force }),
        React.createElement(New, { v: v.new, item: i, force: a.force }),
        React.createElement(Delete, { v: v.delete, item: i, force: a.force })
      );
    }
  }]);

  return Stage;
}(React.Component);

// ====================================================
// Top level React component
//

var Root = function (_React$Component8) {
  _inherits(Root, _React$Component8);

  function Root(props) {
    _classCallCheck(this, Root);

    var _this9 = _possibleConstructorReturn(this, (Root.__proto__ || Object.getPrototypeOf(Root)).call(this, props));

    _this9.force = function (arg) {
      if (arg.id === null) {
        arg.id = store.value[0].id;
      }
      _this9.setState(arg);
    };
    _this9.force.bind(_this9);

    var store = getLocal();
    var id = store.value[0].id;

    _this9.state = {
      store: store,
      id: id,
      v: {
        select: 'none',
        view: 'block',
        edit: 'none',
        new: 'none',
        delete: 'none'
      }
    };
    return _this9;
  }

  _createClass(Root, [{
    key: 'render',
    value: function render() {
      console.log('\nrender: Root:', this.state.id);
      return React.createElement(
        'div',
        { id: 'All', className: 'w3-container' },
        React.createElement(
          'div',
          { id: 'Head', className: 'w3-container w3-border' },
          React.createElement(
            'h3',
            null,
            'Recipe Box'
          )
        ),
        React.createElement(Nav, { force: this.force, v: this.state.v }),
        React.createElement(Stage, { force: this.force, v: this.state.v, store: this.state.store, id: this.state.id })
      );
    }
  }]);

  return Root;
}(React.Component);

ReactDOM.render(React.createElement(Root, null), document.getElementById('root'));