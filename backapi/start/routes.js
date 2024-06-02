'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

const Env = use('Env')

Route.get('/', async ({ response }) => {
    return response.route('/status')
})
Route.get('/status', async () => {
    return {error: false, version: Env.get('VERSION')}
})

Route.get('/releases_count', 'MainController.releases_count')
Route.get('/get_link', 'LinkController.get_link')

// auth

Route.group(() => {
    Route.post('/register', 'AuthController.register')
    Route.post('/login', 'AuthController.login')
}).prefix('/auth')

// need auth

Route.group(() => {
    Route.get('/profile_info', 'UserController.profile_info')
    Route.post('/edit_profile', 'UserController.edit_profile')

    Route.get('/get_news', 'NewsController.get_news')

    Route.get('/get_release_info', 'ReleaseController.get_release_info')
    Route.get('/get_releases', 'ReleaseController.get_releases')
    Route.post('/new_release', 'ReleaseController.new_release')
    Route.post('/edit_release', 'ReleaseController.edit_release')
    Route.post('/send_release', 'ReleaseController.send_release')
    Route.post('/delete_draft', 'ReleaseController.delete_draft')
    Route.get('/search', 'ReleaseController.search')

    Route.post('/new_track', 'ReleaseController.new_track')
    Route.get('/get_tracks', 'ReleaseController.get_tracks')
    Route.post('/delete_track', 'ReleaseController.delete_track')

    Route.post('/new_report', 'ReportController.new_report')
    Route.get('/get_reports', 'ReportController.get_reports')

    Route.post('/promo_create', 'PromoController.create')
    Route.post('/promo_edit', 'PromoController.edit')
    Route.post('/promo_send', 'PromoController.send')
    Route.get('/promo_success', 'PromoController.success')
    Route.get('/get_promos', 'PromoController.get_promos')
    Route.get('/promo_price', 'PromoController.price')
    Route.get('/get_promo', 'PromoController.get')

    Route.get('/get_links', 'LinkController.get_links')
    Route.post('/new_link', 'LinkController.new_link')
    Route.post('/edit_link', 'LinkController.edit_link')
    Route.get('/get_link_by_id', 'LinkController.get_link_by_id')
    Route.post('/delete_link', 'LinkController.delete_link')
}).middleware(['auth']).prefix('/user')

// admin
Route.post('/admin/register', 'AdminController.register')

Route.group(() => {
    Route.post('/new_news', 'AdminController.new_news')

    Route.get('/get_releases', 'AdminController.get_releases')
    Route.get('/get_moderation', 'AdminController.get_moderation')
    Route.get('/get_release_info', 'AdminController.get_release_info')
    Route.post('/accept_release', 'AdminController.accept_release')
    Route.post('/reject_release', 'AdminController.reject_release')
    Route.post('/delete_release', 'AdminController.delete_release')

    Route.get('/get_users', 'AdminController.get_users')
    Route.post('/edit_user', 'AdminController.edit_user')

    Route.get('/get_reports', 'AdminController.get_reports')
    Route.post('/accept_report', 'AdminController.accept_report')
    Route.post('/reject_report', 'AdminController.reject_report')

    Route.get('/get_promos', 'AdminController.get_promos')
    Route.get('/get_promo', 'AdminController.get_promo')
}).middleware(['admin']).prefix('/admin')

// 404

Route.get('*', async () => {
    return {error: 404}
})
Route.post('*', async () => {
    return {error: 404}
})
