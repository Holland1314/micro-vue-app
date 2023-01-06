import {getSysCodedata} from './Dicts';

export const getDicts = function(key) {
    let oldData = getSysCodedata[key];
    let newData = {};
        oldData.map(item=>{
            newData[item.itemCode]={
                itemName: item.itemName,
                itemCode: item.itemCode,
            }
        })
    return newData
}

export const setDicTab = function(key) {
    let oldData = getSysCodedata[key];
    let newData = [];
        oldData.map(item=>{
            newData.push(
                {
                    text: item.itemName,
                    value: item.itemCode,
                }
            )
        })
    return newData
}