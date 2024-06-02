'use strict'

const Report = use('App/Models/Report')
const Database = use('Database')
const axios = require('axios')
const Env = use('Env')

let tg_api_url = `https://api.telegram.org/bot${Env.get('BOT_TOKEN')}/sendMessage?chat_id=${Env.get('CHAT_ID')}&text=`

class ReportController {
    async new_report({ auth, request }) {
        if(auth.user.balance < 1000) return {error: 403}

        await Report.create({
            user_id: auth.user.id,
            sum: auth.user.balance,
            card_number: request.input('card_number'),
            status: 'progress',
        })

        let text = `Пользователь ${auth.user.email} создал запрос на выплату:\n\nСумма: ${auth.user.balance} рублей\nНомер карты: ${request.input('card_number')}\n\nhttps://overdose.media/admin/finance`
        await axios.get(encodeURI(`${tg_api_url}${text}`))

        return {error: false}
    }
    async get_reports({ auth }) {
        const reports = await Database.table('reports').where('user_id', '=', auth.user.id).orderBy('created_at', 'desc')

        return {error: false, reports: reports}
    }
}

module.exports = ReportController
