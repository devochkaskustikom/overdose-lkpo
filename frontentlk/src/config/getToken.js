import Auth from '../check/Auth'
import Cookies from "js-cookie"

export default function getToken() {
    if(Auth()) {
        return Cookies.get("auth-token")
    } else {
        return false
    }
}