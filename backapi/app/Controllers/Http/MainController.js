'use strict'

const Database = use('Database')
const Env = use('Env')

class MainController {
    async releases_count() {
        const count = await Database.table('releases').where('status', '=', 'ok').count('id as total')

        return {error: false, count: parseInt(Env.get('ADD'))+count[0].total}
    }
}

module.exports = MainController
