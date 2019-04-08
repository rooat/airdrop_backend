import { Subscription } from 'egg';
import { Moment } from '../utils'

export default class CreateReward extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            interval: '1m', // 1 分钟间隔
            type: 'all', // 指定所有的 worker 都需要执行
            disable:true  //true时关闭定时任务
        };
    }

    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe() {
        console.log('现在时间是',Moment().format('YYYY-MM-DD HH:mm:ss'));
    }
}