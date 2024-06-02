'use strict'

const Database = use('Database')
const Link = use('App/Models/Link')
const Helpers = use('Helpers')
const geoip = require('geoip-lite')
const View = use('App/Models/View')

class LinkController {
    async get_links({ auth }) {
        const links = await Database.table('links').where('user_id', '=', auth.user.id).orderBy('created_at', 'desc')

        return {error: false, links: links}
    }
    async new_link({auth}) {
        let token = "";
        let symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 6; i++){
            token += symbols.charAt(Math.floor(Math.random() * symbols.length));		
        }

        const link = await Link.create({
            user_id: auth.user.id,
            token: token
        })

        return {error: false, link: link}
    }
    async edit_link({ request, auth }) {
        const link = await Link.find(request.input('id'))

        if(!link) return {error: 404}
        if(link.user_id != auth.user.id) return {error: 403}

        link.title = request.input('title')
        link.artists = request.input('artist')
        link.token = request.input('token')

        if(request.file('cover')) {
            if(link.cover) {
                const fs = Helpers.promisify(require('fs'))
                await fs.unlink(Helpers.publicPath(link.cover))
            }
            let secret = ''
            let symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            for (let i = 0; i < 30; i++){
                secret += symbols.charAt(Math.floor(Math.random() * symbols.length))		
            }
            const validationOptions = {
                types: ['jpeg', 'png'],
                size: '10mb',
            }
            const imageFile = request.file('cover', validationOptions)
            await imageFile.move(Helpers.publicPath(`/links/${auth.user.id}`), {
                    name: `${secret}.jpg`,
                    overwrite: true,
            })
            if (!imageFile.moved()) {
                    return imageFile.error()
            }
            link.cover = `/links/${auth.user.id}/${secret}.jpg`
        }

        link.apple = request.input('apple')
        link.spotify = request.input('spotify')
        link.vk = request.input('vk')
        link.yandex = request.input('yandex')
        link.yt_music = request.input('yt')
        link.soundcloud = request.input('soundcloud')
        link.deezer = request.input('deezer')
        link.tidal = request.input('tidal')
        link.itunes = request.input('itunes')

        await link.save()

        return {error: false}
    }
    async get_link_by_id({ auth, request }) {
        const link = await Link.find(request.input('id'))
        if(!link) return {error: 404}
        if(link.user_id != auth.user.id) return {error: 403}

        const views = await Database.select('country', 'created_at').from('views').where('link_id', '=', link.id)

        return {error: false, link: link, views: views, all_views: views.length}
    }
    async get_link({ request }) {
        const link = await Link.findBy('token', request.input('id'))
        if(!link) return {error: 404}

        const ip = request.input('ip')
        let country = null
        if(!ip) {
            country = 'unknown'
        } else {
            country = geoip.lookup(ip).country
        }

        await View.create({
            link_id: link.id,
            country: country
        })

        return {error: false, link: link}
    }
    async delete_link({ request, auth }) {
        const link = await Link.find(request.input('id'))
        if(!link) return {error: 404}
        if(link.user_id != auth.user.id) return {error: 403}

        if(link.cover) {
            const fs = Helpers.promisify(require('fs'))
            await fs.unlink(Helpers.publicPath(link.cover))
        }

        await link.delete()

        return {error: false}
    }
}

module.exports = LinkController
