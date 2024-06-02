'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PromoSchema extends Schema {
  up () {
    this.create('promos', (table) => {
      table.increments()
      table.integer('release_id').notNullable()
      table.integer('user_id').notNullable()
      table.integer('qiwi_id')
      table.string('desc')
      table.string('social')
      table.string('promo')
      table.string('photo')
      table.string('focus')
      table.boolean('payed').notNullable()
      table.string('pay_link')
      table.timestamps()
    })
  }

  down () {
    this.drop('promos')
  }
}

module.exports = PromoSchema
