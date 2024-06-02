'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PlusSchema extends Schema {
  up () {
    this.create('pluses', (table) => {
      table.increments()
      table.integer('user_id').notNullable()
      table.string('type').notNullable()
      table.date('expiration')
      table.string('payed').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('pluses')
  }
}

module.exports = PlusSchema
