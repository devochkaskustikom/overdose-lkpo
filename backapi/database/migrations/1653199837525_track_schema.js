'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TrackSchema extends Schema {
  up () {
    this.create('tracks', (table) => {
      table.increments()
      table.integer('release_id').notNullable()
      table.string('wav').notNullable()
      table.string('title').notNullable()
      table.string('version')
      table.string('artists').notNullable()
      table.string('author').notNullable()
      table.integer('explicit').notNullable()
      table.string('composer').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('tracks')
  }
}

module.exports = TrackSchema
