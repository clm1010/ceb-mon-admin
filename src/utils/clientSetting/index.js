// import  { getCompanyName } from '../FunctionTool';
import axios from 'axios'
import { myCompanyName } from '../config'
import { genDictUrlByName } from '../../utils/FunctionTool'

async function getHelp() {
    let result = await axios.get(`${window.location.origin}/helpdoc/configurationHelp.html`);
    window.helpdoc = result.data
    return result.data
}
getHelp()

let infoData = require('./' + myCompanyName + '/index')
//console.log(infoData.default)
//export const loginStyles = require('./data/'+companyName+'.less')

export const loginStyles = require('./' + myCompanyName + '/index.less')

export function ozr(id) {
    let value = undefined
    if (infoData.default) {
        value = infoData.default[id]
    }
    return value
}

//获取第三方地址
export function getUrl(id) {
    return genDictUrlByName('frontend', id)
}

export function companyImg(id) {
    let value = undefined
    if (infoData.default) {
        try {
            value = infoData.default[id] ? require('./'+myCompanyName+'/'+infoData.default[id]):require('../../../public/logo.png')
        } catch (e) {
            console.log(e)

        }
    }
    return value
}

export const moTree = require('./' + myCompanyName + '/moTree').default


