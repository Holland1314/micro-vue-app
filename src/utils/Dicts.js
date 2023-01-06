const dictionary = window.sessionStorage.dictsData?JSON.parse(window.sessionStorage.dictsData):{}

// 字典翻译轮子，输入字典字段名称和code值，返回对应的text
export const ValueToText = function(key,value) {
    let finaltext = ""
    dictionary[key]&&dictionary[key].map((val,key)=>{
        if(val.value == value){
            finaltext = val.text
            return val.text
        }
    })
	return finaltext
}

// 获取字典内容
export const getSysCodedata = dictionary


