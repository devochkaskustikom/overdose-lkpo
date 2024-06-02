import Cookies from "js-cookie"
import apiUrl from '../config/apiUrl'
import axios from 'axios'

function Auth() {
    const api_url = apiUrl()
    const checkProfile = async () => {
        const { data: userData } = await axios.get(`${api_url}/user/profile_info`, {
            headers: {
                'authorization': `Bearer ${Cookies.get("auth-token")}`
            }
        });
        if(userData.error) {
            Cookies.set('auth-token', '')
            return false
        }
        return true
    }
    if(Cookies.get("auth-token")) {
        const check = checkProfile;
        if(!check) {
        return false
        }
        return true;
    } else {
        return false;
    }
}

export default Auth;