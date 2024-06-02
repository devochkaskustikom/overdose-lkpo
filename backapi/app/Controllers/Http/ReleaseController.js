'use strict'

const Release = use('App/Models/Release')
const Track = use('App/Models/Track')
const Database = use('Database')
const Helpers = use('Helpers')
const axios = require('axios')
const Env = use('Env')

let tg_api_url = `https://api.telegram.org/bot${Env.get('BOT_TOKEN')}/sendMessage?chat_id=${Env.get('CHAT_ID')}&text=`

class ReleaseController {
    async get_releases({ auth }) {
        const releases = await Database.table('releases').where('user_id', '=', auth.user.id).orderBy('created_at', 'desc')

        return {error: false, releases: releases}
    }
    async get_release_info({ request, auth }) {
        const release = await Release.find(request.input('id'))

        if(!release) return {error: 404}
        if(release.user_id != auth.user.id) return {error: 403}
        
        const tracks = await Database.table('tracks').where('release_id', '=', release.id)

        return {error: false, release: release, tracks: tracks}
    }
    async new_release({ auth }) {
        const release = await Release.create({
            user_id: auth.user.id,
            status: 'draft'
        })

        return {error: false, release: release}
    }
    async edit_release({ auth, request }) {
        const release = await Release.find(request.input('id'))
        if(!release) return {error: 404}
        if(release.user_id != auth.user.id) return {error: 403}
        if(release.status != 'draft') return {error: 403}

        const validationOptions = {
            types: ['image'],
            size: '10mb',
        }

        const coverFile = request.file('cover', validationOptions)
        if(coverFile) {
            if(release.cover) {
                const fs = Helpers.promisify(require('fs'))
                await fs.unlink(Helpers.publicPath(release.cover))
            }
            let secret = ''
            let symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            for (let i = 0; i < 30; i++){
                secret += symbols.charAt(Math.floor(Math.random() * symbols.length))		
            }
            await coverFile.move(Helpers.publicPath(`/covers/${auth.user.id}`), {
                name: `${secret}.jpg`,
                overwrite: false,
            })

            if (!coverFile.moved()) {
                return {error: coverFile.error()}
            }

            release.cover = `/covers/${auth.user.id}/${secret}.jpg`
        }

        const {title, artists, version, genre, date, type, comment} = request.all()

        release.title = title
        release.artists = artists
        release.version = version
        release.genre = genre
        release.date = date
        release.type = type
        release.comment = comment

        await release.save()

        return {error: false, release: release}

    }
    async send_release({ request, auth }) {
        const release = await Release.find(request.input('id'))
        if(!release) return {error: 404}
        if(release.user_id != auth.user.id) return {error: 403}
        if(release.status != 'draft') return {error: 403}
        
        const tracks = await Database.table('tracks').where('release_id', '=', release.id).orderBy('created_at', 'desc')
        if(tracks.length == 0) return {error: 'Нужно добавить хотя бы один трек!'}

        if(!release.title) return {error: 'Заполните все обязательные поля'}
        if(!release.artists) return {error: 'Заполните все обязательные поля'}
        if(!release.cover) return {error: 'Заполните все обязательные поля'}
        if(!release.genre) return {error: 'Заполните все обязательные поля'}
        if(!release.date) return {error: 'Заполните все обязательные поля'}
        if(!release.type) return {error: 'Заполните все обязательные поля'}

        release.status = 'moderation'

        await release.save()
        let text = `Пользователь ${auth.user.email} отправил релиз на модерацию:\n\n${release.artists} - ${release.title}\n\nhttps://overdose.media/admin/view/${release.id}`
        await axios.get(encodeURI(`${tg_api_url}${text}`))

        return {error: false}
    }
    async new_track({ request, auth }) {
        const release = await Release.find(request.input('id'))
        if(!release) return {error: 404}
        if(release.user_id != auth.user.id) return {error: 403}
        if(release.status != 'draft') return {error: 403}

        const validationOptions = {
            types: ['wav', 'x-wav', 'wave'],
            size: '200mb'
        }

        const wavFile = request.file('wav', validationOptions)
        let wav = ''
        if(wavFile) {
            let secret = ''
            let symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            for (let i = 0; i < 30; i++){
                secret += symbols.charAt(Math.floor(Math.random() * symbols.length))		
            }
            await wavFile.move(Helpers.publicPath(`/tracks/${auth.user.id}`), {
                name: `${secret}.wav`,
                overwrite: false,
            })

            if (!wavFile.moved()) {
                return {error: wavFile.error()}
            }

            wav = `/tracks/${auth.user.id}/${secret}.wav`
        } else {
            return {error: 'Загрузите wav файл'}
        }
        const { id, title, version, artists, author, explicit, composer } = request.all()
        const track = await Track.create({
            release_id: id,
            wav: wav,
            title: title,
            version: version,
            artists: artists,
            author: author,
            explicit: explicit,
            composer: composer,
        })

        return {error: false, track: track}
    }
    async get_tracks({ request, auth }) {
        const release = await Release.find(request.input('id'))
        if(!release) return {error: 404}
        if(release.user_id != auth.user.id) return {error: 403}

        const tracks = await Database.table('tracks').where('release_id', '=', release.id)

        return {error: false, tracks: tracks}
    }
    async delete_draft({ request, auth }) {
        const release = await Release.find(request.input('id'))
        if(!release) return {error: 404}
        if(release.user_id != auth.user.id) return {error: 403}
        if(release.status != 'draft') return {error: 403}

        const fs = Helpers.promisify(require('fs'))
        if(release.cover) {
            await fs.unlink(Helpers.publicPath(release.cover))
        }

        const tracks = await Database.table('tracks').where('release_id', '=', release.id)

        if(tracks.length != 0) {
            for(const track of tracks) {
                let trackJs = await Track.find(track.id)

                await fs.unlink(Helpers.publicPath(track.wav))

                await trackJs.delete()
            }
        }

        await release.delete()

        return {error: false}
    }
    async delete_track({ request, auth }) {
        const track = await Track.find(request.input('id'))
        if(!track) return {error: 404}
        const release = await Release.find(track.release_id)
        if(!release) return {error: 404}
        if(release.user_id != auth.user.id) return {error: 403}
        if(release.status != 'draft') return {error: 403}

        await track.delete()

        return {error: false}
    }
    async search({ request, auth }) {
        const {q} = request.all()
        const releases = await Database.raw(`SELECT * FROM releases WHERE title LIKE '%${q}%' OR artists LIKE '%${q}%' OR upc LIKE '%${q}%' AND user_id='${auth.user.id}'`)

        return {releases}
    }
}

module.exports = ReleaseController
