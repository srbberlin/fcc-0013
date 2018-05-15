"use strict";

// ====================================================
// Redux section
//

// ====================================================
// Reducer command ids
//

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _verboseCats;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

var CATEGORY_000 = 0; // means all !!
var CATEGORY_001 = 1;
var CATEGORY_002 = 2;
var CATEGORY_003 = 4;
var CATEGORY_004 = 8;
var CATEGORY_005 = 16;
var CATEGORY_ALL = 31;

var allCats = [CATEGORY_001, CATEGORY_002, CATEGORY_003, CATEGORY_004, CATEGORY_005];

var verboseCats = (_verboseCats = {}, _defineProperty(_verboseCats, CATEGORY_001, 'Breakfast'), _defineProperty(_verboseCats, CATEGORY_002, 'Dinner'), _defineProperty(_verboseCats, CATEGORY_003, 'Supper'), _defineProperty(_verboseCats, CATEGORY_004, 'Brunch'), _defineProperty(_verboseCats, CATEGORY_005, 'Vegatarian'), _verboseCats);

// ====================================================
// Helper to generate selections
//

var selectCat = function selectCat(s, o) {
  var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'cats';

  return React.createElement(
    'select',
    { className: c, value: s, onChange: o },
    allCats.reduce(function (c, d, i, a) {
      c.push(React.createElement(
        'option',
        { key: i, value: d },
        verboseCats[d]
      ));
      return c;
    }, [])
  );
};

var filterCats = function filterCats(s, o) {
  var cls = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'sels';

  return allCats.reduce(function (c, d, i, a) {
    if (d >= 0) {
      c.push(React.createElement(
        'div',
        { className: cls, key: i, id: verboseCats[d] },
        React.createElement('input', { type: 'checkbox', value: d, checked: s & d, onChange: o }),
        verboseCats[d]
      ));
    }
    return c;
  }, []);
};

var getVerboseCat = function getVerboseCat(d) {
  return verboseCats[d];
};

// ====================================================
// Redux section
//

// ====================================================
// Reducer implementing the commands
//

var recipes = function recipes(state, action) {
  var res = void 0;
  switch (action.type) {
    case INIT:
      res = {
        value: [] };
      break;
    case RESTART:
      res = {
        value: action.state.value };
      break;
    case ADD_RECIPE:
      res = {
        value: state.value.concat([{
          id: action.id,
          title: action.title,
          ingredients: action.ingredients,
          procedure: action.procedure,
          category: action.category }])
      };
      break;
    case CHANGE_RECIPE:
      res = {
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
        value: state.value.filter(function (act) {
          return act.id !== action.id;
        })
      };
      break;
    default:
      res = state;
  }
  return res;
};

var store = Redux.createStore(recipes);

// ====================================================
// Construct commands
//

// ====================================================
// Replaces the whole state with a new one
//
// Parameters
//   state: { value: <array of recipes> }
//

var restart = function restart(state) {
  return {
    type: RESTART,
    state: state
  };
};

// ====================================================
// Add a new recipe
//
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
// Change all of the recipies fields
//
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
// Delete one recipe
//
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
// Using the browsers local storage
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
// the browsers local storage. Set a default entry
// if there's none
//

var getLocal = function getLocal() {
  if (window.localStorage.recipes) {
    store.dispatch(restart(JSON.parse(window.localStorage.recipes)));
  } else {
    store.dispatch(add('Honey Garlic Chicken with Rosemary', '3 tablespoons butter\n' + '1 1/2 tablespoons garlic powder\n' + '2 tablespoons rosemary\n' + 'salt and ground black pepper\n' + '1/2 cup of honey\n' + '6 skinless chicken thighs', 'Preheat oven to 375 degrees F (190 degrees C).\n\n' + 'Melt butter in a large saucepan over medium heat. Add garlic powder, rosemary, salt, and pepper; simmer until flavors combine, about 1 minute. Stir in honey; bring to a boil. Reduce heat to low. Dip chicken into sauce, 1 piece at a time, until coated. Place chicken on a 9x13-inch baking pan; pour remaining sauce over chicken.\n\n' + 'Bake chicken in the preheated oven until no longer pink at the bone and the juices run clear, about 30 minutes. An instant-read thermometer inserted near the bone should read 165 degrees F (74 degrees C). Remove from oven; immediately turn over chicken with tongs to coat the top with sauce.', CATEGORY_001));
    storeLocal();
  }
  var res = store.getState();
  return res;
};

// ====================================================
// Helper functions to provide the store's data
//

// ====================================================
// Get recipies according the filtersetting. The filter
// defaults to all
//

var filteredRecipies = function filteredRecipies() {
  var c = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : CATEGORY_000;

  var r = store.getState().value.reduce(function (acc, act) {
    if (c === CATEGORY_000 || (c & act.category) !== 0) {
      acc.push(act);
    }
    return acc;
  }, []);
  return r;
};

// ====================================================
// Get one recipe by id
//

var getRecipe = function getRecipe(id) {
  return store.getState().value.filter(function (act) {
    return act.id === id;
  })[0];
};

// ====================================================
// Add one recipe
//

var newRecipe = function newRecipe(t, i, p, c) {
  var r = add(t, i, p, c);
  store.dispatch(r);
  storeLocal();
  return r.id;
};

// ====================================================
// Change one recipe
//

var changeRecipe = function changeRecipe(id, t, i, p, c) {
  var r = change(id, t, i, p, c);
  store.dispatch(r);
  storeLocal();
  return r.id;
};

// ====================================================
// Delete one recipe
//

var deleteRecipe = function deleteRecipe(id) {
  var r = del(id);
  store.dispatch(r);
  storeLocal();
  return null;
};

// ====================================================
// Eventhandling
//
// All functions return objects used by the setState
// function of the toplevel componet by the
// force function implemented there. The force function
// is called by the eventhandlers of the navigation.
//
// Parameters and returned values are self explanatory.
//

var RELOAD = true;

var setCategories = function setCategories(v) {
  return { categories: v };
};

var valFilter = function valFilter() {
  return {
    filter: 'block',
    select: 'none',
    view: 'none',
    new: 'none',
    edit: 'none',
    delete: 'none'
  };
};

var valSelect = function valSelect() {
  return {
    filter: 'none',
    select: 'block',
    view: 'none',
    new: 'none',
    edit: 'none',
    delete: 'none'
  };
};

var valView = function valView() {
  return {
    filter: 'none',
    select: 'none',
    view: 'block',
    new: 'none',
    edit: 'none',
    delete: 'none'
  };
};

var valNew = function valNew() {
  return {
    filter: 'none',
    select: 'none',
    view: 'none',
    new: 'block',
    edit: 'none',
    delete: 'none'
  };
};

var valEdit = function valEdit() {
  return {
    filter: 'none',
    select: 'none',
    view: 'none',
    new: 'none',
    edit: 'block',
    delete: 'none'
  };
};

var valDelete = function valDelete() {
  return {
    filter: 'none',
    select: 'none',
    view: 'none',
    new: 'none',
    edit: 'none',
    delete: 'block'
  };
};

var _navFilter = function _navFilter() {
  return {
    v: valFilter()
  };
};

var _navSelect = function _navSelect() {
  return {
    v: valSelect()
  };
};

var _navView = function _navView() {
  return {
    v: valView()
  };
};

var _navNew = function _navNew() {
  return {
    v: valNew()
  };
};

var _navEdit = function _navEdit() {
  return {
    v: valEdit()
  };
};

var _navDelete = function _navDelete() {
  return {
    v: valDelete()
  };
};

var navItem = function navItem(id) {
  return {
    id: id,
    v: valView()
  };
};

// ====================================================
// React section
//

var Filter = function (_React$Component) {
  _inherits(Filter, _React$Component);

  function Filter(props) {
    _classCallCheck(this, Filter);

    var _this = _possibleConstructorReturn(this, (Filter.__proto__ || Object.getPrototypeOf(Filter)).call(this, props));

    _this.setCats = _this.setCats.bind(_this);
    return _this;
  }

  _createClass(Filter, [{
    key: 'setCats',
    value: function setCats(e) {
      this.props.force(setCategories(this.props.state.categories ^ e.target.value), RELOAD);
    }
  }, {
    key: 'render',
    value: function render() {
      var v = this.props.display;
      return React.createElement(
        'div',
        { className: 'filter', style: { display: v } },
        filterCats(this.props.state.categories, this.setCats)
      );
    }
  }]);

  return Filter;
}(React.Component);

var Select = function (_React$Component2) {
  _inherits(Select, _React$Component2);

  function Select(props) {
    _classCallCheck(this, Select);

    var _this2 = _possibleConstructorReturn(this, (Select.__proto__ || Object.getPrototypeOf(Select)).call(this, props));

    _this2.selectItem = _this2.selectItem.bind(_this2);
    return _this2;
  }

  _createClass(Select, [{
    key: 'selectItem',
    value: function selectItem(e) {
      this.props.force(navItem(e.target.id));
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var s = this.props.state;
      var v = this.props.display;
      var a = s.data;
      return React.createElement(
        'div',
        { className: 'select', style: { display: v } },
        a !== undefined && a.reduce(function (val, act, i) {
          val.push(React.createElement(
            'div',
            {
              className: 'selitem',
              key: i,
              id: act.id,
              onClick: _this3.selectItem },
            act.title
          ));
          return val;
        }, [])
      );
    }
  }]);

  return Select;
}(React.Component);

var Show = function (_React$Component3) {
  _inherits(Show, _React$Component3);

  function Show(props) {
    _classCallCheck(this, Show);

    return _possibleConstructorReturn(this, (Show.__proto__ || Object.getPrototypeOf(Show)).call(this, props));
  }

  _createClass(Show, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'show', style: { display: this.props.v } },
        React.createElement(
          'h3',
          { className: 'subcontainer' },
          this.props.i.title
        ),
        React.createElement(
          'h5',
          { className: 'subcontainer' },
          getVerboseCat(this.props.i.category)
        ),
        React.createElement(
          'div',
          { className: 'subcontainer' },
          React.createElement(
            'h5',
            null,
            'Ingredients'
          ),
          this.props.i.ingredients
        ),
        React.createElement(
          'div',
          { className: 'subcontainer' },
          React.createElement(
            'h5',
            null,
            'Procedure'
          ),
          this.props.i.procedure
        ),
        this.props.b
      );
    }
  }]);

  return Show;
}(React.Component);

var View = function (_React$Component4) {
  _inherits(View, _React$Component4);

  function View(props) {
    _classCallCheck(this, View);

    return _possibleConstructorReturn(this, (View.__proto__ || Object.getPrototypeOf(View)).call(this, props));
  }

  _createClass(View, [{
    key: 'render',
    value: function render() {
      var v = this.props.display;
      var i = this.props.item;
      if (!i) {
        i = {
          id: '',
          title: '',
          ingredients: '',
          procedure: '',
          category: 0
        };
      }
      return React.createElement(Show, { i: i, v: v });
    }
  }]);

  return View;
}(React.Component);

var Edit = function (_React$Component5) {
  _inherits(Edit, _React$Component5);

  function Edit(props) {
    _classCallCheck(this, Edit);

    var _this6 = _possibleConstructorReturn(this, (Edit.__proto__ || Object.getPrototypeOf(Edit)).call(this, props));

    _this6.titleNew = _this6.titleNew.bind(_this6);
    _this6.ingredientsNew = _this6.ingredientsNew.bind(_this6);
    _this6.procedureNew = _this6.procedureNew.bind(_this6);
    _this6.categoryNew = _this6.categoryNew.bind(_this6);
    _this6.save = _this6.save.bind(_this6);
    _this6.cancel = _this6.cancel.bind(_this6);

    var i = _this6.props.item;

    _this6.state = {
      id: i.id,
      title: i.title,
      ingredients: i.ingredients,
      procedure: i.procedure,
      category: i.category,
      reload: true
    };
    return _this6;
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
      this.setState({ reload: true });
      this.props.force(setCategories(this.props.state.categories | e.target.value));
      this.props.force(navItem(changeRecipe(this.state.id, this.state.title, this.state.ingredients, this.state.procedure, this.state.category)));
    }
  }, {
    key: 'cancel',
    value: function cancel(e) {
      this.setState({ reload: true });
      this.props.force(navItem(this.state.id));
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(next) {
      if (this.state.reload) {
        var i = next.item;

        if (!i) {
          i = {
            id: '',
            title: '',
            ingredients: '',
            procedure: '',
            category: CATEGORY_001
          };
        }

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
      var s = this.state;
      var v = this.props.display;
      return React.createElement(
        'div',
        { className: 'change', style: { display: v } },
        React.createElement('textarea', { className: 'subcontainer headl', onChange: this.titleNew, value: s.title }),
        React.createElement('textarea', { className: 'subcontainer ingds', onChange: this.ingredientsNew, value: s.ingredients }),
        React.createElement('textarea', { className: 'subcontainer proc', onChange: this.procedureNew, value: s.procedure }),
        selectCat(this.state.category, this.categoryNew),
        React.createElement('br', null),
        React.createElement(
          'button',
          { onClick: this.save },
          'Save'
        ),
        React.createElement('br', null),
        React.createElement(
          'button',
          { onClick: this.cancel },
          'Cancel'
        ),
        React.createElement('br', null)
      );
    }
  }]);

  return Edit;
}(React.Component);

var New = function (_React$Component6) {
  _inherits(New, _React$Component6);

  function New(props) {
    _classCallCheck(this, New);

    var _this7 = _possibleConstructorReturn(this, (New.__proto__ || Object.getPrototypeOf(New)).call(this, props));

    _this7.state = {
      title: '',
      ingredients: '',
      procedure: '',
      category: CATEGORY_001
    };

    _this7.titleNew = _this7.titleNew.bind(_this7);
    _this7.ingredientsNew = _this7.ingredientsNew.bind(_this7);
    _this7.procedureNew = _this7.procedureNew.bind(_this7);
    _this7.categoryNew = _this7.categoryNew.bind(_this7);
    _this7.save = _this7.save.bind(_this7);
    return _this7;
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
      if (this.props.state.categories) {
        this.props.force(setCategories(this.props.state.categories | this.state.category));
      }
      this.props.force(navItem(newRecipe(this.state.title, this.state.ingredients, this.state.procedure, this.state.category)), RELOAD);
      this.setState({
        title: '',
        ingredients: '',
        procedure: '',
        category: CATEGORY_001
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var s = this.state;
      var v = this.props.display;

      return React.createElement(
        'div',
        { className: 'change', style: { display: v } },
        React.createElement('textarea', { className: 'subcontainer headl', onChange: this.titleNew, value: s.title }),
        React.createElement('textarea', { className: 'subcontainer ingds', onChange: this.ingredientsNew, value: s.ingredients }),
        React.createElement('textarea', { className: 'subcontainer proc', onChange: this.procedureNew, value: s.procedure }),
        selectCat(this.state.category, this.categoryNew),
        React.createElement('br', null),
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

var Delete = function (_React$Component7) {
  _inherits(Delete, _React$Component7);

  function Delete(props) {
    _classCallCheck(this, Delete);

    var _this8 = _possibleConstructorReturn(this, (Delete.__proto__ || Object.getPrototypeOf(Delete)).call(this, props));

    _this8.delete = _this8.delete.bind(_this8);
    return _this8;
  }

  _createClass(Delete, [{
    key: 'delete',
    value: function _delete(e) {
      this.props.force(navItem(deleteRecipe(this.props.item.id)), RELOAD);
    }
  }, {
    key: 'render',
    value: function render() {
      var s = this.props.state;
      var v = this.props.display;
      var i = this.props.item;

      if (!i) {
        i = {
          id: '',
          title: '',
          ingredients: '',
          procedure: '',
          category: 0
        };
      }

      var b = React.createElement(
        'button',
        { onClick: this.delete },
        'Ok'
      );

      return React.createElement(Show, { i: i, v: v, b: b });
    }
  }]);

  return Delete;
}(React.Component);

// ====================================================
// Second child of the top level React component
//
// All navigations.
//

var Nav = function (_React$Component8) {
  _inherits(Nav, _React$Component8);

  function Nav(props) {
    _classCallCheck(this, Nav);

    var _this9 = _possibleConstructorReturn(this, (Nav.__proto__ || Object.getPrototypeOf(Nav)).call(this, props));

    _this9.navFilter = _this9.navFilter.bind(_this9);
    _this9.navSelect = _this9.navSelect.bind(_this9);
    _this9.navView = _this9.navView.bind(_this9);
    _this9.navEdit = _this9.navEdit.bind(_this9);
    _this9.navNew = _this9.navNew.bind(_this9);
    _this9.navDelete = _this9.navDelete.bind(_this9);
    _this9.disable = _this9.disable.bind(_this9);
    return _this9;
  }

  _createClass(Nav, [{
    key: 'navFilter',
    value: function navFilter() {
      this.props.force(_navFilter());
    }
  }, {
    key: 'navSelect',
    value: function navSelect() {
      if (this.props.data) this.props.force(_navSelect());
    }
  }, {
    key: 'navView',
    value: function navView() {
      if (this.props.data) this.props.force(_navView());
    }
  }, {
    key: 'navEdit',
    value: function navEdit() {
      if (this.props.data) this.props.force(_navEdit());
    }
  }, {
    key: 'navNew',
    value: function navNew() {
      this.props.force(_navNew());
    }
  }, {
    key: 'navDelete',
    value: function navDelete() {
      if (this.props.data) this.props.force(_navDelete());
    }
  }, {
    key: 'disable',
    value: function disable(e) {
      e.preventDefault();
    }
  }, {
    key: 'render',
    value: function render() {
      var nFilter = this.props.v.filter === 'block' ? 'navActive' : 'navPassive';
      var nSelect = this.props.v.select === 'block' ? 'navActive' : 'navPassive';
      var nView = this.props.v.view === 'block' ? 'navActive' : 'navPassive';
      var nDelete = this.props.v.delete === 'block' ? 'navActive' : 'navPassive';
      var nNew = this.props.v.new === 'block' ? 'navActive' : 'navPassive';
      var nEdit = this.props.v.edit === 'block' ? 'navActive' : 'navPassive';

      return React.createElement(
        'div',
        { className: 'w3-bar' },
        React.createElement(
          'div',
          { className: 'w3-bar-item w3-button ' + nFilter, onClick: this.navFilter },
          'Filter'
        ),
        React.createElement(
          'div',
          { className: 'w3-bar-item w3-button ' + nSelect, onMouseDown: this.navSelect, onMouseOut: this.disable },
          'Select'
        ),
        React.createElement(
          'div',
          { className: 'w3-bar-item w3-button ' + nView, onClick: this.navView },
          'View'
        ),
        React.createElement(
          'div',
          { className: 'w3-bar-item w3-button ' + nDelete, style: { float: 'right' }, onClick: this.navDelete },
          'Delete'
        ),
        React.createElement(
          'div',
          { className: 'w3-bar-item w3-button ' + nNew, style: { float: 'right' }, onClick: this.navNew },
          'New'
        ),
        React.createElement(
          'div',
          { className: 'w3-bar-item w3-button ' + nEdit, style: { float: 'right' }, onClick: this.navEdit },
          'Edit'
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

var Stage = function (_React$Component9) {
  _inherits(Stage, _React$Component9);

  function Stage() {
    _classCallCheck(this, Stage);

    return _possibleConstructorReturn(this, (Stage.__proto__ || Object.getPrototypeOf(Stage)).apply(this, arguments));
  }

  _createClass(Stage, [{
    key: 'render',
    value: function render() {
      var f = this.props.force;
      var s = this.props.state;
      var v = s.v;
      var i = getRecipe(s.id);
      return React.createElement(
        'div',
        { id: 'Stage' },
        React.createElement(Filter, { state: s, display: v.filter, force: f }),
        React.createElement(Select, { state: s, display: v.select, force: f }),
        React.createElement(View, { state: s, display: v.view, item: i }),
        React.createElement(Edit, { state: s, display: v.edit, item: i, force: f }),
        React.createElement(New, { state: s, display: v.new, item: i, force: f }),
        React.createElement(Delete, { state: s, display: v.delete, item: i, force: f })
      );
    }
  }]);

  return Stage;
}(React.Component);

// ====================================================
// Top level React component
//

var Root = function (_React$Component10) {
  _inherits(Root, _React$Component10);

  function Root(props) {
    _classCallCheck(this, Root);

    var _this11 = _possibleConstructorReturn(this, (Root.__proto__ || Object.getPrototypeOf(Root)).call(this, props));

    var data = getLocal().value;

    _this11.state = {
      data: data,
      categories: CATEGORY_000,
      id: data[0].id,
      v: _navView().v
    };

    _this11.force = function (newState) {
      var reload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (reload) {
        var c = newState.categories;
        if (c === undefined) {
          c = _this11.state.categories;
        }
        newState.data = filteredRecipies(c);
        if (!newState.id && newState.data.length !== 0) {
          newState.id = newState.data[0].id;
        }
      }
      _this11.setState(newState);
    };
    return _this11;
  }

  _createClass(Root, [{
    key: 'render',
    value: function render() {
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
        React.createElement(Nav, { force: this.force, data: this.state.data.length !== 0, v: this.state.v }),
        React.createElement(Stage, { force: this.force, state: this.state })
      );
    }
  }]);

  return Root;
}(React.Component);

ReactDOM.render(React.createElement(Root, null), document.getElementById('root'));