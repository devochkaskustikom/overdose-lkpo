'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Admin {
  async handle ({ auth, response }, next) {
    try {
      if(auth.user.status != 'admin') return response.json({error: 403})

      await next()
    } catch {
      return response.json({error: 401})
    }
    await next()
  }
}

module.exports = Admin
