"use strict";

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

const CATEGORY_000 = 0 // means all !!
const CATEGORY_001 = 1
const CATEGORY_002 = 2
const CATEGORY_003 = 4
const CATEGORY_004 = 8
const CATEGORY_005 = 16
const CATEGORY_ALL = 31

const allCats = [
  CATEGORY_001,
  CATEGORY_002,
  CATEGORY_003,
  CATEGORY_004,
  CATEGORY_005
]

const verboseCats = {
  [CATEGORY_001]: 'Breakfast',
  [CATEGORY_002]: 'Dinner',
  [CATEGORY_003]: 'Supper',
  [CATEGORY_004]: 'Brunch',
  [CATEGORY_005]: 'Vegatarian'
}

// ====================================================
// Helper to generate selections
//

const selectCat = (s, o, c = 'cats') => {
  return (
    <select className={c} value={s} onChange={o}>{
      allCats.reduce((c, d, i, a) => {
        c.push(<option key={i} value={d}>{verboseCats[d]}</option>)
        return c
      },[])}
    </select>
  )
}

const filterCats = (s, o, cls = 'sels') => {
  return (
    allCats.reduce((c, d, i, a) => {
      if (d >= 0) {
        c.push(
          <div className={cls} key={i} id={verboseCats[d]}>
            <input type='checkbox' value={d} checked={s & d} onChange={o}/>
            {verboseCats[d]}
          </div>
        )
      }
      return c
    },[])
  )
}

const getVerboseCat = (d) => {
  return verboseCats[d]
}

// ====================================================
// Redux section
//

// ====================================================
// Reducer implementing the commands
//

const recipes = (state, action) => {
  let res
  switch (action.type) {
    case INIT:
      res = {
        value: []}
      break
    case RESTART:
      res = {
        value: action.state.value }
      break
    case ADD_RECIPE:
      res = {
        value: state.value.concat([{
          id: action.id,
          title: action.title,
          ingredients: action.ingredients,
          procedure: action.procedure,
          category: action.category }])
      }
      break;
    case CHANGE_RECIPE:
      res = {
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
        value: state.value.filter((act) => {
          return act.id !== action.id
        })
      }
      break;
    default:
      res = state
  }
  return res
}

const store = Redux.createStore(recipes)

// ====================================================
// Construct commands
//

// ====================================================
// Replaces the whole state with a new one
//
// Parameters
//   state: { value: <array of recipes> }
//

const restart = (state) => {
  return {
    type: RESTART,
    state: state
  }
}

// ====================================================
// Add a new recipe
//
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
// Change all of the recipies fields
//
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
// Delete one recipe
//
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
// Using the browsers local storage
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
// the browsers local storage. Set a default entry
// if there's none
//

const getLocal = () => {
  if (window.localStorage.recipes) {
    store.dispatch(restart(JSON.parse(window.localStorage.recipes)))
  } else {
    store.dispatch(add(
      'Honey Garlic Chicken with Rosemary', 
      '3 tablespoons butter\n' +
      '1 1/2 tablespoons garlic powder\n' +
      '2 tablespoons rosemary\n' +
      'salt and ground black pepper\n' +
      '1/2 cup of honey\n' +
      '6 skinless chicken thighs',
      'Preheat oven to 375 degrees F (190 degrees C).\n\n' +
      'Melt butter in a large saucepan over medium heat. Add garlic powder, rosemary, salt, and pepper; simmer until flavors combine, about 1 minute. Stir in honey; bring to a boil. Reduce heat to low. Dip chicken into sauce, 1 piece at a time, until coated. Place chicken on a 9x13-inch baking pan; pour remaining sauce over chicken.\n\n' +
      'Bake chicken in the preheated oven until no longer pink at the bone and the juices run clear, about 30 minutes. An instant-read thermometer inserted near the bone should read 165 degrees F (74 degrees C). Remove from oven; immediately turn over chicken with tongs to coat the top with sauce.', 
      CATEGORY_001))
    storeLocal()
  }
  let res = store.getState()
  return res
}

// ====================================================
// Helper functions to provide the store's data
//

// ====================================================
// Get recipies according the filtersetting. The filter
// defaults to all
//

const filteredRecipies = (c = CATEGORY_000) => {
  let r = store.getState().value.reduce((acc, act) => {
    if (c === CATEGORY_000 || (c & act.category) !== 0) {
      acc.push(act)
    }
    return acc
  }, [])
  return r
}

// ====================================================
// Get one recipe by id
//

const getRecipe = (id) => {
  return store.getState().value.filter((act) => {
    return act.id === id
  })[0]
}

// ====================================================
// Add one recipe
//

const newRecipe = (t, i, p, c) => {
  let r = add(t, i, p, c)
  store.dispatch(r)
  storeLocal()
  return r.id
}

// ====================================================
// Change one recipe
//

const changeRecipe = (id, t, i, p, c) => {
  let r = change(id, t, i, p, c)
  store.dispatch(r)
  storeLocal()
  return r.id
}

// ====================================================
// Delete one recipe
//

const deleteRecipe = (id) => {
  let r = del(id)
  store.dispatch(r)
  storeLocal()
  return null
}

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

const RELOAD = true

const setCategories = (v) => {
  return { categories: v }
}

const valFilter = () => {
  return {
    filter: 'block',
    select: 'none',
    view: 'none',
    new: 'none',
    edit: 'none',
    delete: 'none'
  }
}

const valSelect = () => {
  return {
    filter: 'none',
    select: 'block',
    view: 'none',
    new: 'none',
    edit: 'none',
    delete: 'none'
  }
}

const valView = () => {
  return {
    filter: 'none',
    select: 'none',
    view: 'block',
    new: 'none',
    edit: 'none',
    delete: 'none'
  }
}

const valNew = () => {
  return {
    filter: 'none',
    select: 'none',
    view: 'none',
    new: 'block',
    edit: 'none',
    delete: 'none'
  }
}

const valEdit = () => {
  return {
    filter: 'none',
    select: 'none',
    view: 'none',
    new: 'none',
    edit: 'block',
    delete: 'none'
  }
}

const valDelete = () => {
  return {
    filter: 'none',
    select: 'none',
    view: 'none',
    new: 'none',
    edit: 'none',
    delete: 'block'
  }
}

const navFilter = () => {
  return {
    v: valFilter()
  }
}

const navSelect = () => {
  return {
    v: valSelect()
  }
}

const navView = () => {
  return {
    v: valView()
  }
}

const navNew = () => {
  return {
    v: valNew()
  }
}

const navEdit = () => {
  return {
    v: valEdit()
  }
}

const navDelete = () => {
  return {
    v: valDelete()
  }
}

const navItem = (id) => {
  return {
    id: id,
    v: valView()
  }
}

// ====================================================
// React section
//

class Filter extends React.Component {
  constructor (props) {
    super(props)

    this.setCats = this.setCats.bind(this)
  }

  setCats (e) {
    this.props.force(setCategories(this.props.state.categories ^ e.target.value), RELOAD)
  }

  render () {
    let v = this.props.display
    return (
      <div className='filter' style={{display: v}}>
        {filterCats(this.props.state.categories, this.setCats)}
      </div>
    )
  }
}

class Select extends React.Component {
  constructor (props) {
    super(props)
    this.selectItem = this.selectItem.bind(this)
  }

  selectItem (e) { 
    this.props.force(navItem(e.target.id)) 
  }

  render () {
    let s = this.props.state
    let v = this.props.display
    let a = s.data
    return (
      <div className='select' style={{display: v}} >
        {
          (a !== undefined) &&
          a.reduce((val, act, i) => {
            val.push(
              <div
                className='selitem' 
                key={i} 
                id={act.id} 
                onClick={this.selectItem}>
                {act.title}
              </div>
            )
            return val
          },
          [])
        }
      </div>
    )
  }
}

class Show extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div className='show' style={{display: this.props.v}}>
        <h3 className='subcontainer'>{this.props.i.title}</h3>
        <h5 className='subcontainer'>{getVerboseCat(this.props.i.category)}</h5>
        <div className='subcontainer'><h5>Ingredients</h5>{this.props.i.ingredients}</div>
        <div className='subcontainer'><h5>Procedure</h5>{this.props.i.procedure}</div>
        {this.props.b}
      </div>
    )
  }
}

class View extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    let v = this.props.display
    let i = this.props.item
    if (! i) {
      i = {
        id: '',
        title: '',
        ingredients: '',
        procedure: '',
        category: 0,
      }
    }
    return (
      <Show i={i} v={v} />
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
    this.cancel = this.cancel.bind(this)

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
    this.setState({reload: true})
    this.props.force(setCategories(this.props.state.categories | e.target.value))
    this.props.force(navItem(changeRecipe(this.state.id, this.state.title, this.state.ingredients, this.state.procedure, this.state.category)))
  }

  cancel (e) {
    this.setState({reload: true})
    this.props.force(navItem(this.state.id))
  }

  componentWillReceiveProps (next) {
    if (this.state.reload) {
      let i = next.item

      if (! i) {
        i = {
          id: '',
          title: '',
          ingredients: '',
          procedure: '',
          category: CATEGORY_001,
        }
      }
  
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
    let s = this.state
    let v = this.props.display
    return (
      <div className='change' style={{display: v}}>
        <textarea className='subcontainer headl' onChange={this.titleNew} value={s.title} />
        <textarea className='subcontainer ingds' onChange={this.ingredientsNew} value={s.ingredients} />
        <textarea className='subcontainer proc' onChange={this.procedureNew} value={s.procedure} />
        {selectCat(this.state.category, this.categoryNew)}
        <br />
        <button onClick={this.save}>Save</button><br />
        <button onClick={this.cancel}>Cancel</button><br />
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
      category: CATEGORY_001
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
    if (this.props.state.categories) {
      this.props.force(setCategories(this.props.state.categories | this.state.category))
    }
    this.props.force(navItem(newRecipe(this.state.title, this.state.ingredients, this.state.procedure, this.state.category)), RELOAD)
    this.setState({
      title: '',
      ingredients: '',
      procedure: '',
      category: CATEGORY_001
    })
  }

  render () {
    let s = this.state
    let v = this.props.display

    return (
      <div className='change' style={{display: v}}>
        <textarea className='subcontainer headl' onChange={this.titleNew} value={s.title} />
        <textarea className='subcontainer ingds' onChange={this.ingredientsNew} value={s.ingredients} />
        <textarea className='subcontainer proc' onChange={this.procedureNew} value={s.procedure} />
        {selectCat(this.state.category, this.categoryNew)}
        <br />
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
    this.props.force(navItem(deleteRecipe(this.props.item.id)), RELOAD)
  }

  render () {
    let s = this.props.state
    let v = this.props.display
    let i = this.props.item

    if (! i) {
      i = {
        id: '',
        title: '',
        ingredients: '',
        procedure: '',
        category: 0,
      }
    }

    let b = <button onClick={this.delete}>Ok</button>

    return (
      <Show i={i} v={v} b={b}/>
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

    this.navFilter = this.navFilter.bind(this)
    this.navSelect = this.navSelect.bind(this)
    this.navView = this.navView.bind(this)
    this.navEdit = this.navEdit.bind(this)
    this.navNew = this.navNew.bind(this)
    this.navDelete = this.navDelete.bind(this)
    this.disable = this.disable.bind(this)
  }

  navFilter () { this.props.force(navFilter()) }
  navSelect () { if ( this.props.data) this.props.force(navSelect()) }
  navView () { if ( this.props.data) this.props.force(navView()) }
  navEdit () { if ( this.props.data) this.props.force(navEdit()) }
  navNew () { this.props.force(navNew()) }
  navDelete () { if ( this.props.data) this.props.force(navDelete()) }
  disable (e) { e.preventDefault() }

  render () {
    let nFilter = this.props.v.filter === 'block' ? 'navActive' : 'navPassive'
    let nSelect = this.props.v.select === 'block' ? 'navActive' : 'navPassive'
    let nView = this.props.v.view === 'block' ? 'navActive' : 'navPassive'
    let nDelete = this.props.v.delete === 'block' ? 'navActive' : 'navPassive'
    let nNew = this.props.v.new === 'block' ? 'navActive' : 'navPassive'
    let nEdit = this.props.v.edit === 'block' ? 'navActive' : 'navPassive'

    return (
      <div className='w3-bar'>
        <div className={'w3-bar-item w3-button ' + nFilter} onClick={this.navFilter}>Filter</div>
        <div className={'w3-bar-item w3-button ' + nSelect} onMouseDown={this.navSelect} onMouseOut={this.disable}>Select</div>
        <div className={'w3-bar-item w3-button ' + nView} onClick={this.navView}>View</div>
        <div className={'w3-bar-item w3-button ' + nDelete} style={{float: 'right'}} onClick={this.navDelete}>Delete</div>
        <div className={'w3-bar-item w3-button ' + nNew} style={{float: 'right'}} onClick={this.navNew}>New</div>
        <div className={'w3-bar-item w3-button ' + nEdit} style={{float: 'right'}} onClick={this.navEdit}>Edit</div>
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
    let f = this.props.force
    let s = this.props.state
    let v = s.v
    let i = getRecipe(s.id)
    return (
      <div id='Stage'>
        <Filter state={s} display={v.filter} force={f} />
        <Select state={s} display={v.select} force={f} />
        <View state={s} display={v.view} item={i} />
        <Edit state={s} display={v.edit} item={i} force={f} />
        <New state={s} display={v.new} item={i} force={f} />
        <Delete state={s} display={v.delete} item={i} force={f} />
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

    let data = getLocal().value

    this.state = {
      data: data,
      categories: CATEGORY_000,
      id: data[0].id,
      v: navView().v
    }

    this.force = (newState, reload = false) => {
      if (reload) {
        let c = newState.categories
        if (c === undefined) {
          c = this.state.categories
        }
        newState.data = filteredRecipies(c)
        if (! newState.id && newState.data.length !== 0) {
          newState.id = newState.data[0].id
        }
      }
      this.setState(newState)
    }
  }

  render () {
    return (
      <div id='All' className='w3-container'>
        <div id='Head' className='w3-container w3-border'><h3>Recipe Box</h3></div>
        <Nav force={this.force} data={this.state.data.length !== 0} v={this.state.v} />
        <Stage force={this.force} state={this.state} />
      </div>
    )
  }
}

ReactDOM.render(
  <Root />,
  document.getElementById('root')
)
