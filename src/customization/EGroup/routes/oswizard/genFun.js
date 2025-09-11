function genObj(data) {
    let result = []
    if (data.length > 0) {
        data.forEach((item) => {
            result.push({ "name": item.name, "typ": item.typ })
        })
    }
    return result
}
function genObj2(data) {
    let result = []
    if (data.length > 0) {
        data.forEach((item) => {
            result.push({ "name": item.name, "typ": item.typ, isMonitored: item.isMonitored })
        })
    }
    return result
}
function genObj3(data) {
    let newData = JSON.stringify(data)
    newData = JSON.parse(newData)
    Object.values(newData).forEach((item) => {
        let sub = item.infos
        for (let index = 0; index < sub.length; index++) {
            if (sub[index].isMonitored) {
                item.selectedRowKeys.push(index)
                item.selectedRows.push(sub[index])
            }
            delete sub[index].isMonitored
        }
        item.columns = item.columns.splice(0, 2)
    })
    return newData
}
function genObj4(data) {
    let result = []
    if (data.length > 0) {
        data.forEach((item) => {
            result.push({ "name": item.name, "thirdClass": item.thirdClass, "isMonitored": item.isMonitored })
        })
    }
    return result
}
// 操作系统
function genOriginObj1(data, originData) {
    let data2 = JSON.stringify(data)
    let data3 = JSON.parse(data2)
    originData.forEach(origin => {
        origin.isMonitored = false
    })
    for (const key in data3) {
        if (Object.hasOwnProperty.call(data3, key)) {
            if (data3[key].selectedRows && data3[key].selectedRows.length > 0) {
                data3[key].selectedRows.forEach((row) => {
                    originData.forEach((origin, index) => {
                        if (origin.name === row.name && origin.thirdClass === row.thirdClass) {
                            originData[index].isMonitored = true
                        }
                    })
                })
            }
        }
    }
    return originData
}
// 数据库
function genOriginObj(data, originData) {
    let data2 = JSON.stringify(data)
    let data3 = JSON.parse(data2)
    originData.forEach(origin => {
        origin.isMonitored = false
    })
    for (const key in data3) {
        if (Object.hasOwnProperty.call(data3, key)) {
            if (data3[key].selectedRows && data3[key].selectedRows.length > 0) {
                data3[key].selectedRows.forEach((row) => {
                    originData.forEach((origin, index) => {
                        if (origin.name === row.name && origin.alias === row.alias) {
                            originData[index].isMonitored = true
                        }
                    })
                })
            }
        }
    }
    return originData
}
export { genObj, genOriginObj, genOriginObj1, genObj2, genObj3, genObj4 }