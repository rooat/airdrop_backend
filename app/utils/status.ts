
/**
 * 根据传入的状态码返回统一的状态
 * @param status 状态码
 * @param state  默认传出值(可在initState中添加)
 */
export default function Rtstatus(status,state){
    switch(status){
        case 200:
        return onSuccess(status)
        case 404:
        return onFalied(status,state)
        case 201:
        return onSqlSuccess(status,state)
        case 600:
        return onSqlFalied(status,state)
    }
}

/**
 * 成功状态默认返回值
 * @param _status 
 */
const onSuccess = (_status) =>{
    return {
        status:'Success'
    }
}

/**
 * 失败状态默认返回值
 * @param _status 
 * @param state 
 */
const onFalied = (_status,state) =>{
    return {
        status:'Failed',
        failure_reason:state
    }
}

/**
 * sql失败返回状态
 * @param _status 
 * @param state 
 */
const onSqlFalied = (_status,state) =>{
    return {
        sqlstatus:'Failed',
        failure_reason:state
    }
}

/**
 * sql成功返回状态
 * @param _status 
 * @param state 
 */
const onSqlSuccess = (_status,state) =>{
    return {
        sqlstatus:'Success',
        fields:state
    }
}
