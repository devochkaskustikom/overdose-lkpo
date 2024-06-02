'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')

class ExceptionHandler extends BaseExceptionHandler {
  async handle (error, { response }) {
    if (error.name == 'InvalidJwtToken') {
      return response.json({ error: 401 })
    }

    return super.handle(...arguments)
  }
}

module.exports = ExceptionHandler
