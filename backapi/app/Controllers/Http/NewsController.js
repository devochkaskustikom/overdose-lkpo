'use strict'

const Database = use('Database')

class NewsController {
    async get_news() {
        const news = await Database.table('news').orderBy('created_at', 'desc')

        return {error: false, news: news}
    }
}

module.exports = NewsController
