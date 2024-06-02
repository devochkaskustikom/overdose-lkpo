'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LinkSchema extends Schema {
  up () {
    this.create('links', (table) => {
      table.increments()
      table.string('token').notNullable().unique()
      table.integer('user_id').notNullable()
      table.string('cover')
      table.string('title')
      table.string('artists')
      table.string('apple')
      table.string('vk')
      table.string('yandex')
      table.string('soundcloud')
      table.string('yt_music')
      table.string('itunes')
      table.string('spotify')
      table.string('tidal')
      table.string('deezer')
      table.timestamps()
    })
  }

  down () {
    this.drop('links')
  }
}

module.exports = LinkSchema
