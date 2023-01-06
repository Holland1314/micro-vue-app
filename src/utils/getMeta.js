// 元数据校验规则轮子，一个入参：
// name ：'age'   //元数据表里的name
// 
// 
// 元数据表字段，1是 0否
// CREATE TABLE `sys_metadata` (
//   `name` varchar(20) NOT NULL COMMENT '数据元编码',
//   `caption` varchar(100) NOT NULL COMMENT '数据元名称',
//   `data_type` varchar(30) NOT NULL COMMENT '数据类型',    
// //上面三个和校验规则本身没什么关系

//   `nullable` tinyint(1) DEFAULT '0' COMMENT '可空标志',
//   `min_length` int DEFAULT NULL COMMENT '最小长度',
//   `max_length` int DEFAULT NULL COMMENT '最大长度',
//   `precision` int DEFAULT NULL COMMENT '小数精度',
//   `min_value` varchar(30) DEFAULT NULL COMMENT '最小值',
//   `max_value` varchar(30) DEFAULT NULL COMMENT '最大值',
//   `dict_type` varchar(20) DEFAULT NULL COMMENT '码表类型编码',
//   `expression` varchar(100) DEFAULT NULL COMMENT '正则表达式',
//   `validate_message` varchar(200) DEFAULT NULL COMMENT '正则校验提示信息',
//   `editor_type` varchar(30) DEFAULT NULL COMMENT '输入控件类型',

//  //下面的和校验规则本身没什么关系
//   `valid_flag` tinyint(1) NOT NULL DEFAULT '0' COMMENT '有效标志',
//   `creator_id` varchar(32) DEFAULT NULL COMMENT '创建人',
//   `create_time` datetime DEFAULT NULL COMMENT '创建时间',
//   `editor_id` varchar(32) DEFAULT NULL COMMENT '修改人',
//   `edit_time` datetime DEFAULT NULL COMMENT '修改时间',
//   `remark` varchar(4000) DEFAULT NULL COMMENT '备注',
//   PRIMARY KEY (`name`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='元数据表';


// Type,数据类型的可选项如下
// Indicates the type of validator to use. Recognised type values are:
// string: Must be of type string. This is the default type.
// number: Must be of type number.
// boolean: Must be of type boolean.
// method: Must be of type function.
// regexp: Must be an instance of RegExp or a string that does not generate an exception when creating a new RegExp.
// integer: Must be of type number and an integer.
// float: Must be of type number and a floating point number.
// array: Must be an array as determined by Array.isArray.
// object: Must be of type object and not Array.isArray.
// enum: Value must exist in the enum.
// date: Value must be valid as determined by Date
// url: Must be of type url.
// hex: Must be of type hex.
// email: Must be of type email.
// any: Can be any type.

const meta = window.sessionStorage.metasData && JSON.parse(window.sessionStorage.metasData)

// 字段数据类型字典
const typeDict = {NumberEditor:"number",DateTimeEditor:"date"}

export const getMeta = function (name) {
    let rules = []
    // console.log(meta,99999)
    let val = meta[name]||{}
    if(val.validFlag == 1){
    // if(val.validFlag == "1关了先"){
        // console.log(val,55555,typeDict[val.editorType]||"string")
        // // 先确定数据类型
        // rules.push({type:typeDict[val.editorType]||"string"}) 
        // 是否可为空
        if(val.nullable == "0"){
            let aRule = {}
            aRule.required = true
            rules.push(aRule)
        }
        //最小值或最小长度（根据数据类型不同，含义不同，string时是最小长度，number时是最小值）
        if(val.minLength || val.minValue){
            let aRule = {}
            aRule.min = parseInt(val.minLength) || parseInt(val.minValue) 
            aRule.type = typeDict[val.editorType]||"string"
            rules.push(aRule)
        }

        //最大值或最大长度（根据数据类型不同，含义不同，string时是最大长度，number时是最大值）
        if(val.maxLength || val.maxValue){
            let aRule = {}
            aRule.max = parseInt(val.maxLength) || parseInt(val.maxValue)
            aRule.type = typeDict[val.editorType]||"string"
            rules.push(aRule)
        }

        //正则
        if(val.expression){
            let aRule = {}
            aRule.pattern = val.expression
            if(val.validateMessage!=""&&val.validateMessage){ aRule.message = val.validateMessage}

            rules.push(aRule)
        }

    }
 



    // console.log(rules,99999)


    return rules
}






