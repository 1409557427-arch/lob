import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface LogEntry { id: string; day: number; type: 'info' | 'success' | 'warning' | 'error'; message: string; timestamp: number }

export const useLogsStore = defineStore('logs', () => {
  const entries = ref<LogEntry[]>([
    { id: 'l1', day: 1, type: 'info', message: '主管就任。设施初始化完成。3 个异想体已分配至收容单元。', timestamp: Date.now() - 86400000 * 14 },
    { id: 'l2', day: 1, type: 'success', message: '配额 Lv.1 完成。能量收集 120 单位。无异常事件。', timestamp: Date.now() - 86400000 * 13 },
    { id: 'l3', day: 3, type: 'warning', message: 'O-02-11 突破收容。Trumpet 1 级。Agent Beta 完成镇压。1 名文职死亡。', timestamp: Date.now() - 86400000 * 11 },
    { id: 'l4', day: 7, type: 'success', message: '配额 Lv.2 完成。观察等级提升：O-03-03 达到 Lv.2。', timestamp: Date.now() - 86400000 * 7 },
    { id: 'l5', day: 12, type: 'error', message: 'T-09-80 突破收容。Trumpet 2 级。损失 2 名代理，4 名文职。镇压耗时 4 分钟。', timestamp: Date.now() - 86400000 * 2 },
    { id: 'l6', day: 13, type: 'info', message: '新异想体 O-05-30 (WAW) 已分配至安保部。Angela 建议优先提升观察等级。', timestamp: Date.now() - 86400000 },
  ])
  return { entries }
})
