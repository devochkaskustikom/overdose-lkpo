'use strict'

const User = use('App/Models/User')
const News = use('App/Models/News')
const Env = use('Env')
const Release = use('App/Models/Release')
const Report = use('App/Models/Report')
const Database = use('Database')
const nodemailer = require("nodemailer")
const axios = require('axios')
const Promo = use('App/Models/Promo')

let tg_api_url = `https://api.telegram.org/bot${Env.get('BOT_TOKEN')}/sendMessage?chat_id=${Env.get('CHAT_ID')}&text=`

let transporter = nodemailer.createTransport({
    host: Env.get('EMAIL_HOST'),
    port: 465,
    secure: true,
    auth: {
      user: Env.get('EMAIL_USER'),
      pass: Env.get('EMAIL_PASSWORD'),
    },
});

class AdminController {
    async register({ request, auth }) {
        if(request.input('token') != Env.get('SECRET_TOKEN')) return {error: 403}
        try {
            const { username, email, name, password } = request.all()

            let user = await User.create({
                username: username,
                email: email,
                password: password,
                name: name,
                status: 'admin',
                balance: 0
            })

            let token = await auth.generate(user)

            return {error: false, token: token.token}
        } catch(e) {
            console.log(e)
            return {error: 'bad login or pass'}
        }
    }

    // news

    async new_news({ request }) {
        await News.create({
            title: request.input('title'),
            body: request.input('body')
        })

        return {error: false}
    }

    // releases

    async get_releases() {
        const releases = await Database.table('releases').where('status', '=', 'ok').orWhere('status', '=', 'moderation').orderBy('created_at', 'desc')

        return {error: false, releases: releases}
    }
    async get_moderation() {
        const releases = await Database.table('releases').where('status', '=', 'moderation').orderBy('created_at', 'desc')

        return {error: false, releases: releases}
    }
    async get_release_info({ request }) {
        const release = await Release.find(request.input('id'))

        if(!release) return {error: 404}
        
        const tracks = await Database.table('tracks').where('release_id', '=', release.id)

        return {error: false, release: release, tracks: tracks}
    }
    async accept_release({ request, auth }) {
        const release = await Release.find(request.input('id'))

        if(!release) return {error: 404}

        release.status = 'ok'
        release.upc = request.input('upc')

        await release.save()

        let text = `Администратор ${auth.user.email} принял релиз:\n\n${release.artists} - ${release.title}\nUPC: ${request.input('upc')}`
        await axios.get(encodeURI(`${tg_api_url}${text}`))

        return {error: false}
    }
    async reject_release({ request, auth }) {
        const release = await Release.find(request.input('id'))

        if(!release) return {error: 404}

        release.status = 'draft'

        await release.save()

        let text = `Администратор ${auth.user.email} отклонил релиз:\n\n${release.artists} - ${release.title}\nПричина: ${request.input('reason')}`
        await axios.get(encodeURI(`${tg_api_url}${text}`))

        try {
            const user = await User.find(release.user_id)

            await transporter.sendMail({
                from: `"Робот ${Env.get('APP_NAME')}" <${Env.get('EMAIL_USER')}>`,
                to: `${user.email}`,
                subject: `Релиз ${release.artists} - ${release.title} не прошел модерацию.`,
                html:
                `Здравствуйте, ${user.name}!<br><br>Ваш релиз <b>${release.artists} - ${release.title}</b>, не прошел модерацию.<br><br> Причина: ${request.input('reason')}<br><br>С уважением, команда ${Env.get('APP_NAME')}.`
            })

            return {error: false}
        } catch(e) {
            return {error: e}
        }
    }
    async delete_release({ request }) {
        const release = await Release.find(request.input('id'))

        if(!release) return {error: 404}

        await release.delete()

        return {error: false}
    }

    // users
    async get_users() {
        const users = await Database.table('users').orderBy('created_at', 'desc')

        return {error: false, users: users}
    }
    async edit_user({ request }) {
        try {
            const user = await User.find(request.input('id'))
            const {name, password, email, username, status, balance} = request.all()
            user.name = name
            user.password = password
            user.email = email
            user.username = username
            user.status = status
            user.balance = balance

            await user.save()
        } catch(e) {
            return {error: 'Пользователь уже существует'}
        }

        return {error: false}
    }

    // reports
    async get_reports() {
        const reports = await Database.table('reports').orderBy('created_at', 'desc')

        return {error: false, reports: reports}
    }
    async reject_report({ request, auth }) {
        const report = await Report.find(request.input('id'))
        if(!report) return {error: 404}

        report.status = 'error'

        await report.save()

        let text = `Администратор ${auth.user.email} отклонил запрос на выплату:\n\nСумма: ${report.sum} рублей\nНомер карты: ${report.card_number}\n\nhttps://overdose.media/#/admin/finance`
        await axios.get(encodeURI(`${tg_api_url}${text}`))

        try {
            const user = await User.find(report.user_id)

            await transporter.sendMail({
                from: `"Робот ${Env.get('APP_NAME')}" <${Env.get('EMAIL_USER')}>`,
                to: `${user.email}`,
                subject: `Ваш запрос на вывод ${report.sum} рублей был отклонен.`,
                html:
                `Здравствуйте, ${user.name}!<br><br>Ваш запрос на вывод ${report.sum} рублей был отклонен.<br><br> Причина: ${request.input('reason')}<br><br>С уважением, команда ${Env.get('APP_NAME')}.`
            })

            return {error: false}
        } catch(e) {
            return {error: e}
        }
    }
    async accept_report({ request, auth }) {
        const report = await Report.find(request.input('id'))
        if(!report) return {error: 404}

        report.status = 'ok'

        await report.save()

        let text = `Администратор ${auth.user.email} принял запрос на выплату:\n\nСумма: ${report.sum} рублей\nНомер карты: ${report.card_number}\n\nhttps://overdose.media/#/admin/finance`
        await axios.get(encodeURI(`${tg_api_url}${text}`))

        try {
            const user = await User.find(report.user_id)

            user.balance = user.balance - report.sum

            await user.save()

            await transporter.sendMail({
                from: `"Робот ${Env.get('APP_NAME')}" <${Env.get('EMAIL_USER')}>`,
                to: `${user.email}`,
                subject: `Ваш запрос на вывод ${report.sum} рублей был принят.`,
                html:
                `Здравствуйте, ${user.name}!<br><br>Ваш запрос на вывод ${report.sum} рублей был принят. Средства поступят Вам на карту в течение 24 часов.<br>Если этого не случилось, свяжитесь с поддержкой<br><br>С уважением, команда ${Env.get('APP_NAME')}.`
            })

            return {error: false}
        } catch(e) {
            return {error: e}
        }
    }
    async get_promos() {
        const promos = await Database.table('promos').where('payed', '=', true).orderBy('created_at', 'desc')

        let promoReleases = []
        for(const promo of promos) {
            const release = await Release.find(promo.release_id)
            if(!release) {
                const promoD = await Promo.find(promo.id)
                await promoD.delete()
            } else {
                promoReleases.push({id: promo.id, payed: promo.payed, release: release})
            }
        }

        return {error: false, promos: promoReleases}
    }
    async get_promo({ request }) {
        const promo = await Promo.find(request.input('id'))
        if(!promo) return {error: 404}

        const release = await Release.find(promo.release_id)
        if(!release) {
            await promo.delete()

            return {error: 'Релиз не найден.'}
        }

        return {error: false, promo: promo, release: release}
    }
}

module.exports = AdminController
