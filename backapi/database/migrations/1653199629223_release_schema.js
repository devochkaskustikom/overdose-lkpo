'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReleaseSchema extends Schema {
  up () {
    this.create('releases', (table) => {
      table.increments()
      table.integer('user_id').notNullable()
      table.string('cover')
      table.string('title')
      table.string('artists')
      table.string('version')
      table.string('genre')
      table.date('date')
      table.string('type')
      table.string('comment')
      table.string('upc')
      table.string('status').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('releases')
  }
}

module.exports = ReleaseSchema
