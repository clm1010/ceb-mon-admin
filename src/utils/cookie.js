class Cookie {
  constructor (name) {
    this.name = name
  }

  setCookie (value, expiredays) {
    let cookieValue
    if (typeof (value) === 'object') {
      cookieValue = JSON.stringify(value)
    } else {
      cookieValue = value
    }

    const data = new Date()
    data.setTime(data.getTime() + expiredays)

    document.cookie = `${this.name}=${escape(cookieValue)
}${(expiredays == null) ? '' : `;expires=${data.toUTCString()}`};path=/`
  }

  getCookie () {
    if (document.cookie.length > 0) {
    	if (document.cookie.indexOf(`${this.name}=null; `) >= 0) {
    		document.cookie = document.cookie.replace(`${this.name}=null; `, '')
    	}
      let startIndex = document.cookie.indexOf(`${this.name}=`)
      if (startIndex !== -1) {
        startIndex = startIndex + this.name.length + 1
        let endIndex = document.cookie.indexOf(';', startIndex)
        if (endIndex === -1) {
          endIndex = document.cookie.length
        }
        return unescape(document.cookie.substring(startIndex, endIndex))
      }
    }
    return null
  }

  delCookie () {
    const exp = new Date()
    exp.setTime(exp.getTime() - 1)
    document.cookie = `${this.name}=0;expires=${new Date(0).toUTCString()}`
  }
}


export default Cookie
