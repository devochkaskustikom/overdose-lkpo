'use strict'

const User = use('App/Models/User')

class UserController {
    async profile_info({ auth }) {
        return {error: false, user: auth.user}
    }
    async edit_profile({ request, auth }) {
        try {
            const user = await User.find(auth.user.id)
            const {name, password, email, username} = request.all()
            user.name = name
            user.password = password
            user.email = email
            user.username = username

            await user.save()
        } catch(e) {
            return {error: 'Пользователь уже существует'}
        }

        return {error: false}
    }
}

module.exports = UserController
