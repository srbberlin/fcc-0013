// "use strict";

// ====================================================
// Redux section
//

// ====================================================
// Reducer command ids
//

const INIT = '@@redux/INIT'              // Driven by createStore(...)
const RESTART = 'RESTART'                // Resets the whole storage to a vergin state
const ADD_RECIPE = 'ADD_RECIPE'          // Appends one recipe
const GET_RECIPE = 'GET_RECIPE'          // Retreaves one recipe by it's UUID
const CHANGE_RECIPE = 'CHANGE_RECIPE'    // Saves changes to one recipe by it's UUID
const DELETE_RECIPE = 'DELETE_RECIPE'    // Deletes one recipe by it's UUID

const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'   // Narrows the choices

// ====================================================
// Filter values, might be or'd together
//

const CATEGORY_NONE = 0   // Nothing
const CATEGORY_001 = 1
const CATEGORY_002 = 2
const CATEGORY_003 = 4
const CATEGORY_004 = 8
const CATEGORY_ALL = -1  // All

// ====================================================
// Filter values verbose
//

const categories = {
  CATEGORY_001: 'Breakfast',
  CATEGORY_002: 'Dinner',
  CATEGORY_003: 'Supper',
  CATEGORY_004: 'Vegatrian'
}

// ====================================================
// Reducer implementing the commands
//

const recipes = (state, action) => {
  let res
  switch (action.type) {
    case INIT:
      res = {
        visibility: -1,
        value: []}
      break
    case RESTART:
      res = {
        visibility: action.state.visibility,
        value: action.state.value }
      break
    case ADD_RECIPE:
      res = {
        visibility: state.visibility,
        value: state.value.concat([{
          id: action.id,
          title: action.title,
          ingredients: action.ingredients,
          procedure: action.procedure,
          category: action.category }])}
      break;
    case CHANGE_RECIPE:
      res = {
        visibility: state.visibility,
        value: state.value.map((act) => {
          if (act.id === action.id) {
            act.title = action.title
            act.ingredients = action.ingredients
            act.procedure = action.procedure
            act.category = action.category
          }
          return act
        })
      }
      break;
    case DELETE_RECIPE:
      res = {
        visibility: state.visibility,
        value: state.value.filter((act) => { return act.id !== action.id })
      }
      break;
    case SET_VISIBILITY_FILTER:
      res = {
        visibility: action.value,
        value: state.value
      }
      break;
    default:
      res = state
  }
  return res
}

// ====================================================
// Return command parameters
//

// ====================================================
// Parameters
//   state: { visibility: <number>, value: <array of recipes> }
//

const restart = (state) => {
  return {
    type: RESTART,
    state: state
  }
}

// ====================================================
// Parameters
//   t, i, p, c: self explanatory
//

const add = (t, i, p, c) => {
  return {
    type: ADD_RECIPE,
    id: uuid.v4(),
    title: t,
    ingredients: i,
    procedure: p,
    category: c
  }
}

// ====================================================
// Parameters
//   id: UUID of the recipe
//

const get = (id) => {
  return {
    type: GET_RECIPE,
    value: id
  }
}

// ====================================================
// Parameters
//   id, t, i, p, c: self explanatory
//

const change = (id, t, i, p, c) => {
  return {
    type: CHANGE_RECIPE,
    id: id,
    title: t,
    ingredients: i,
    procedure: p,
    category: c
  }
}

// ====================================================
// Parameters
//   id: UUID of the recipe
//

const del = (id) => {
  return {
    type: DELETE_RECIPE,
    id: id
  }
}

// ====================================================
// Parameters
//   v: ored value of none ore more filter values
//

const vis = (v) => {
  return {
    type: SET_VISIBILITY_FILTER,
    value: v
  }
}

// ====================================================
// Using the local storage
//

// ====================================================
// Save the actual state of the store to
// the Browsers local storage
//

const storeLocal = () => {
  window.localStorage.setItem('recipes', JSON.stringify(store.getState()))
}

// ====================================================
// Retrieve the state of the store from
// the browsers local storage
//

const getLocal = () => {
  if (window.localStorage.recipes) {
    store.dispatch(restart(JSON.parse(window.localStorage.recipes)))
  } else {
    store.dispatch(add('der erste Versuch', '1. Mut, \n2. Geld, \n3. Geduld', 'und viel mehr', CATEGORY_001))
    store.dispatch(add('der zweite Versuch', 'Weas man so braucht ...', 'auch nicht viel mehr', CATEGORY_002))
    storeLocal()
  }
  let res = store.getState()
  return res
}

// ====================================================
// Retrieves one recipe from storage
//

const getRecipe = (id) => {
  return store.getState().value.filter((act) => {
    return act.id === id
  })[0]
}

const newRecipe = (t, i, p, c) => {
  let r = add(t, i, p, c)
  store.dispatch(r)
  return r.id
}

const changeRecipe = (id, t, i, p, c) => {
  let r = change(id, t, i, p, c)
  store.dispatch(r)
  return r.id
}

const deleteRecipe = (id) => {
  let r = del(id)
  store.dispatch(r)
  return null
}

const store = Redux.createStore(recipes)

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

const navStorageChange = (id) => {
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
  }
}

const navItem = (id) => {
  return {
    id: id,
    v: {
      select: 'none',
      view: 'block',
      new: 'none',
      edit: 'none',
      delete: 'none'
    }
  }
}

const navSelect = () => {
  return {
    v: {
      select: 'block',
      view: 'none',
      new: 'none',
      edit: 'none',
      delete: 'none'
    }
  }
}

const navView = () => {
  return {
    v: {
      select: 'none',
      view: 'block',
      new: 'none',
      edit: 'none',
      delete: 'none'
    }
  }
}

const navNew = () => {
  return {
    v: {
      select: 'none',
      view: 'none',
      new: 'block',
      edit: 'none',
      delete: 'none'
    }
  }
}

const navEdit = () => {
  return {
    v: {
      select: 'none',
      view: 'none',
      new: 'none',
      edit: 'block',
      delete: 'none'
    }
  }
}

const navDelete = () => {
  return {
    v: {
      select: 'none',
      view: 'none',
      new: 'none',
      edit: 'none',
      delete: 'block'
    }
  }
}

// ====================================================
// React section
//

class Select extends React.Component {
  constructor (props) {
    super(props)
    this.navItem = this.navItem.bind(this)
  }

  navItem (e) { this.props.force(navItem(e.target.id)) }

  render () {
    console.log('render: Select')
    let a = this.props
    let v = a.v
    let m = a.m
    let j = 0
    let r = []
    return (
      <div id='Select' style={{display: v}} >
        {
          m.reduce((val, act) => {
            // if (true) {
            r = val.concat([
              <div className='selitem' key={++j} id={act.id} onClick={this.navItem}>{act.title}</div>
            ])
            // }
            return r
          },
          r)
        }
      </div>
    )
  }
}

class View extends React.Component {
  constructor (props) {
    super(props)

    this.title = ''
    this.ingedients = ''
    this.procedure = ''
    this.category = ''
  }

  render () {
    console.log('render: View:', this.props.item)
    let v = this.props.v
    let i = this.props.item

    this.title = i.title
    this.ingredients = i.ingredients
    this.procedure = i.procedure
    this.category = i.category

    return (
      <div id='View' style={{display: v}}>
        <div className='subcontainer'>{this.title}</div>
        <div className='subcontainer'>{this.ingredients}</div>
        <div className='subcontainer'>{this.procedure}</div>
        <div className='subcontainer'>{this.category}</div>
      </div>
    )
  }
}

class Edit extends React.Component {
  constructor (props) {
    super(props)

    this.titleNew = this.titleNew.bind(this)
    this.ingredientsNew = this.ingredientsNew.bind(this)
    this.procedureNew = this.procedureNew.bind(this)
    this.categoryNew = this.categoryNew.bind(this)
    this.save = this.save.bind(this)

    let i = this.props.item
    this.state = {
      id: i.id,
      title: i.title,
      ingredients: i.ingredients,
      procedure: i.procedure,
      category: i.category,
      reload: true
    }
  }

  titleNew (e) { this.setState({title: e.target.value, reload: false}) };
  ingredientsNew (e) { this.setState({ingredients: e.target.value, reload: false}) };
  procedureNew (e) { this.setState({procedure: e.target.value, reload: false}) };
  categoryNew (e) { this.setState({category: e.target.value, reload: false}) };

  save (e) {
    this.setState({reload: false})
    this.props.force(navItem(changeRecipe(this.state.id, this.state.title, this.state.ingredients, this.state.procedure, this.state.category)))
    storeLocal()
  }

  componentWillReceiveProps () {
    if (this.state.reload) {
      let i = this.props.item

      this.setState({
        id: i.id,
        title: i.title,
        ingredients: i.ingredients,
        procedure: i.procedure,
        category: i.category
      })
    }
  }

  render () {
    console.log('render: Edit:', this.props.item)
    let v = this.props.v

    return (
      <div id='Edit' style={{display: v}}>
        <textarea className='subcontainer' onChange={this.titleNew} value={this.state.title} />
        <textarea className='subcontainer' onChange={this.ingredientsNew} value={this.state.ingredients} />
        <textarea className='subcontainer' onChange={this.procedureNew} value={this.state.procedure} />
        <textarea className='subcontainer' onChange={this.categoryNew} value={this.state.category} />
        <button onClick={this.save}>Save</button><br />
      </div>
    )
  }
}

class New extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      title: '',
      ingredients: '',
      procedure: '',
      category: ''
    }

    this.titleNew = this.titleNew.bind(this)
    this.ingredientsNew = this.ingredientsNew.bind(this)
    this.procedureNew = this.procedureNew.bind(this)
    this.categoryNew = this.categoryNew.bind(this)
    this.save = this.save.bind(this)
  }

  titleNew (e) { this.setState({title: e.target.value}) }
  ingredientsNew (e) { this.setState({ingredients: e.target.value}) }
  procedureNew (e) { this.setState({procedure: e.target.value}) }
  categoryNew (e) { this.setState({category: e.target.value}) }

  save (e) {
    this.props.force(navStorageChange(newRecipe(this.state.title, this.state.ingredients, this.state.procedure, this.state.category)))
    this.setState({
      title: '',
      ingredients: '',
      procedure: '',
      category: ''
    })
    storeLocal()
  }

  render () {
    console.log('render: New:')
    let v = this.props.v
    return (
      <div id='New' style={{display: v}}>
        <textarea className='subcontainer' onChange={this.titleNew} value={this.state.title} />
        <textarea className='subcontainer' onChange={this.ingredientsNew} value={this.state.ingredients} />
        <textarea className='subcontainer' onChange={this.procedureNew} value={this.state.procedure} />
        <textarea className='subcontainer' onChange={this.categoryNew} value={this.state.category} />
        <button onClick={this.save}>Save</button><br />
      </div>
    )
  }
}

class Delete extends React.Component {
  constructor (props) {
    super(props)

    this.delete = this.delete.bind(this)
  }

  delete (e) {
    this.props.force(navStorageChange(deleteRecipe(this.props.item.id)))
  }

  render () {
    let a = this.props
    let v = a.v
    let i = a.item
    console.log('render: Delete:', this.props.item)
    return (
      <div id='Delete' style={{display: v}}>
        <div className='subcontainer'>{i.title}</div>
        <div className='subcontainer'>{i.ingredients}</div>
        <div className='subcontainer'>{i.procedure}</div>
        <div className='subcontainer'>{i.category}</div>
        <button onClick={this.delete}>Ok</button><br />
      </div>
    )
  }
}

// ====================================================
// Second child of the top level React component
//
// All navigations.
//

class Nav extends React.Component {
  constructor (props) {
    super(props)

    this.navSelect = this.navSelect.bind(this)
    this.navView = this.navView.bind(this)
    this.navEdit = this.navEdit.bind(this)
    this.navNew = this.navNew.bind(this)
    this.navDelete = this.navDelete.bind(this)
    this.disable = this.disable.bind(this)
  }

  navSelect (e) { this.props.force(navSelect(e)) }
  navView (e) { this.props.force(navView(e)) }
  navEdit (e) { this.props.force(navEdit(e)) }
  navNew (e) { this.props.force(navNew(e)) }
  navDelete (e) { this.props.force(navDelete(e)) }
  disable (e) { e.preventDefault() }

  render () {
    console.log('render: Nav')
    let bgSelect = this.props.v.select === 'block' ? {backgroundColor: 'gray'} : {backgroundColor: '#CCCCCC'}
    let bgView = this.props.v.view === 'block' ? {backgroundColor: 'gray'} : {backgroundColor: '#CCCCCC'}
    let bgEdit = this.props.v.edit === 'block' ? {backgroundColor: 'gray'} : {backgroundColor: '#CCCCCC'}
    let bgNew = this.props.v.new === 'block' ? {backgroundColor: 'gray'} : {backgroundColor: '#CCCCCC'}
    let bgDelete = this.props.v.delete === 'block' ? {backgroundColor: 'gray', float: 'right'} : {backgroundColor: '#CCCCCC', float: 'right'}

    return (
      <div className='w3-bar'>
        <div className='w3-bar-item w3-button' style={bgSelect} onMouseDown={this.navSelect} onMouseOut={this.disable}>Select</div>
        <div className='w3-bar-item w3-button' style={bgView} onClick={this.navView}>View</div>
        <div className='w3-bar-item w3-button' style={bgEdit} onClick={this.navEdit}>Edit</div>
        <div className='w3-bar-item w3-button' style={bgNew} onClick={this.navNew}>New</div>
        <div className='w3-bar-item w3-button' style={bgDelete} onClick={this.navDelete}>Delete</div>
      </div>
    )
  };
}

// ====================================================
// Second child of the top level React component
//
// Includes choices, views and editor fields.
//

class Stage extends React.Component {
  render () {
    let a = this.props
    let v = a.v
    let m = a.store.value
    let i = getRecipe(a.id)
    console.log('render: Stage:', i)
    return (
      <div id='Stage'>
        <Select v={v.select} m={m} force={a.force} />
        <View v={v.view} item={i} />
        <Edit v={v.edit} item={i} force={a.force} />
        <New v={v.new} item={i} force={a.force} />
        <Delete v={v.delete} item={i} force={a.force} />
      </div>
    )
  };
}

// ====================================================
// Top level React component
//

class Root extends React.Component {
  constructor (props) {
    super(props)

    this.force = (arg) => {
      if (arg.id === null) {
        arg.id = store.value[0].id
      }
      this.setState(arg)
    }
    this.force.bind(this)

    let store = getLocal()
    let id = store.value[0].id

    this.state = {
      store: store,
      id: id,
      v: {
        select: 'none',
        view: 'block',
        edit: 'none',
        new: 'none',
        delete: 'none'
      }
    }
  };

  render () {
    console.log('\nrender: Root:', this.state.id)
    return (
      <div id='All' className='w3-container'>
        <div id='Head' className='w3-container w3-border'><h3>Recipe Box</h3></div>
        <Nav force={this.force} v={this.state.v} />
        <Stage force={this.force} v={this.state.v} store={this.state.store} id={this.state.id} />
      </div>
    )
  }
}

ReactDOM.render(
  <Root />,
  document.getElementById('root')
)
