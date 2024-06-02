'use strict'

const User = use('App/Models/User')
const Env = use('Env')

class AuthController {
    async login({ request, auth }) {
        try {
            if(await auth.attempt(request.input('email'), request.input('password'))) {
                let user = await User.findBy('email', request.input('email'))

                let token = await auth.generate(user)

                return {error: false, token: token.token}
            } else {
                return {error: 'bad login or pass'}
            }
        } catch(e) {
            return {error: 'bad login or pass'}
        }
    }
    async register({ request, auth }) {
        if(Env.get('AUTH') == 'off') return {error: 403}
        try {
            const { username, email, name, password } = request.all()

            let user = await User.create({
                username: username,
                email: email,
                password: password,
                name: name,
                balance: 0,
                status: 'Пользователь'
            })

            let token = await auth.generate(user)

            return {error: false, token: token.token}
        } catch(e) {
            return {error: 'bad login or pass'}
        }
    }
}

module.exports = AuthController
