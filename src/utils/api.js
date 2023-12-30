import { SHA256 } from "crypto-js";

var myCloud = null
export async function api_init() {
    myCloud = new cloud.Cloud({
        resourceAppid: 'wxd3a12c8ad28cdb4f',
        resourceEnv: 'ldstzs-wxcloud-5g2jj4f2a73aa913',
        identityless: true,
    })
    await myCloud.init();
}

export async function fetch(func, data) {
    console.log({
        func,
        data,
        token: window.localStorage.getItem('token')
    });
    const res = (await myCloud.callFunction({
        name: 'adminWeb',
        data: {
            func,
            data,
            token: window.localStorage.getItem('token')
        },
    })).result
    console.log(res);
    if (!res.success && res.msg == '请先登录')
        window.location.href = '/#/login'
    return res
}

export function api_getStudents(name = '', page = 1, limit = 20) {
    return fetch('getStudents', { name, page, limit })
}

export function api_getClubs() {
    return fetch('getClubs')
}

export function api_exportData() {
    return fetch('exportData')
}

export function api_uploadStudent(dataStr) {
    return fetch('uploadStudent', { dataStr })
}

export function api_removeStudent(stu_id) {
    return fetch('removeStudent', { stu_id })
}

export function api_updateClub(club_info) {
    return fetch('updateClub', { club_info })
}

export function api_img2Cloud(imgurl) {
    return fetch('img2Cloud', { imgurl })
}

export function api_removeClub(club_id) {
    return fetch('removeClub', { club_id })
}

export function api_getClubQRcode(club_id) {
    return fetch('getClubQRcode', { club_id })
}

export function api_changeUsernameAndPassword(username, password, club_id) {
    password = SHA256(password).toString()
    return fetch('changeUsernameAndPassword', { username, password, club_id })
}

export async function api_login(username, password) {
    password = SHA256(password).toString()
    return fetch('login', { username, password }).then(res => {
        console.log(res);
        if (res.success) {
            window.localStorage.setItem('token', res.token)
        }
        window.location.href = '/#/'
        return res
    })
}