/**
 * 状态原因合集
 */
const statusCode = {
    NO_DATE_IS_QUERY:'无数据',  //没有查询到数据
    PHONE_IS_EXISTED:'手机号已存在',
    RECEIVE_ADDRESS_EXISTED:'空投地址已存在',
    RANDOM_IS_EXISTED:'邀请码已存在',
    RANDOM_IS_NOT_EXISTED:'邀请码不存在',
    SMS_IS_OFTEN:'请勿频繁操作',
    TELE_IS_EXISTED:'此账号已绑定地址',
    VERIFICATION_IS_ERROR:'验证码错误',
    VERIFICATION_IS_INVALID:'验证码失效',
    RANDOM_IS_NOTEXISTED:'无效邀请码',
    NETWORK_IS_BUSY:'网络正忙,请稍后重试',
    COUNTRY_ISNT_EXISTED:'此国家码不支持',
    ADDRESS_IS_INVALID:'非法地址'
}

export default statusCode;