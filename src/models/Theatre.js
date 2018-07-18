const db = require('../db')
class Theatre {
  constructor({ id, name, address } = { id: null, name: null, address: null }) {
    this._id = id
    this._name = name
    this._address = address
    this._removed = false
  }

  get id() {
    return this._id
  }
  set id(id) {
    throw new Error('CANNOT SET ID')
    // return this.id
  }

  get name() {
    return this._name
  }
  set name(name) {
    this._name = name
  }

  get address() {
    return this._address
  }
  set address(address) {
    this._address = address
  }
  
  get removed() {
    return this._removed
  }
  set removed(nothing) {
    throw new Error('this method makes no sense')
  }

  static all() {
    return db('theatres')
      .select()
      .then(records => records.map(record => new Theatre(record)))
  }

  static find(id) {
    return db('theatres')
      .select()
      .returning('*')
      .where({ id })
      .then(([record]) => new Theatre(record))
  }

  save() {
    const theatreObj = { name: this.name, address: this.address }
    if (this.id) {
      return db('theatres')
        .where({ id: this.id })
        .update(theatreObj)
        .then(() => this)
    } else {
      if (!this.address || !this.name) return Promise.reject('missing props')
      return db('theatres')
        .insert(theatreObj)
        .then(res => {
          this._id = res.id
          return this
        })
    }

  }

  destroy() {
    if (!this.removed) {
      return db('theatres')
        .where({ id: this.id })
        .del()
        .then(() => {
          this._removed = true
          return this
        })
    } else {
      return Promise.reject(new Error('this theatre has already been destroyed'))
    }
  } 
}

module.exports = Theatre
