'use strict'

const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk');
const Env = use('Env')
const Plus = use('App/Models/Plus')
const Database = use('Database')
const axios = require('axios')

const qiwiApi = new QiwiBillPaymentsAPI(Env.get('SECRET_TOKEN'))
const publicKey = Env.get('PUBLIC_TOKEN')


class PlusController {
    async pay({ auth, request }) {
        const {type} = request.all()

        const plus = await Database.table('pluses').where('user_id', '=', auth.user.id).andWhere('payed', '=', true)

        if(plus.length != 0) {
            return {error: 403}
        }

        let amount = null
        if(type == 'forever') amount = 4999
        if(type == 'year') amount = 1699
        if(type == 'month') amount = 249
        if(type == 'test') amount = 1

        if(amount == null) return {error: 403}

        const pay = await Plus.create({
            user_id: auth.user.id,
            type: type,
            expiration: null,
            payed: false
        })

        const params = {
            publicKey,
            amount: amount,
            billId: pay.id,
            successUrl: `https://overdose.media/#/plus/success/${pay.id}`
        }
        const link = qiwiApi.createPaymentForm(params)

        return {error: false, id: pay.id, link: link}
    }
    async check_pay({ request, auth }) {

        const pay = await Plus.find(request.input('id'))

        if(!pay) return {error: 404}
        if(pay.user_id != auth.user.id) return {error: 403}
        if(pay.payed) return {error: 403}

        const {data: data} = await axios.get(`https://api.qiwi.com/partner/bill/v1/bills/${pay.id}`, {
            headers: {
                'Authorization': `Bearer ${Env.get('SECRET_TOKEN')}`
            }
        })

        if(data.status.value == 'WAITING') {
            return {error: false, payed: false}
        } else if(data.status.value == 'PAID') {
            pay.payed = true
            let type = pay.type
            let date = new Date()
            if(type == 'forever') {
                pay.expiration = null
            }
            if(type == 'year') {
                date.setFullYear(date.getFullYear() + 1)
                pay.expiration = date
            }
            if(type == 'month') {
                date.setMonth(date.getMonth() + 1)
                pay.expiration = date
            }
            if(type == 'test') {
                date.setDate(date.getDate() + 1)
                pay.expiration = date
            }

            await pay.save()

            return {error: false, payed: true, pay: pay}
        }

        return data
    }
}

module.exports = PlusController
