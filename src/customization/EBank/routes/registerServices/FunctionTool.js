export default function genDictArrToCascader(name) {
    let dictArr = JSON.parse(localStorage.getItem('dict'))[name]
    let depentTree = []
    let options = []
    if (dictArr) {
        dictArr.forEach((opt) => {
            let arr = opt.key.split('-')
            let i = 0
            const fun = (options, arr) => {
                let object = {}
                if (options.length == 0 || options.find(o => o.key == arr[i]) == null) {
                    object.label = arr[i]
                    object.value = arr[i]
                    object.key = arr[i]
                    options.push(object)
                } else if (i < arr.length) {
                    options.map(item => {
                        if (item.key == arr[i]) {
                            i++
                            fun(item.children, arr)
                        }
                    })
                }
                i++
                if (i < arr.length) {
                    object.children = []
                    fun(object.children, arr)
                }
                return options
            }
            depentTree = fun(options, arr)
        })
    }
    return depentTree
}