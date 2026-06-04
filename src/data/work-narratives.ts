/**
 * 工作叙事引擎 — 根据异想体、员工和工作类型生成动态描述
 */

const WORK_NARRATIVES: Record<string, {
  start: string[]
  success: string[]
  fail: string[]
  neBox: string[]
}> = {
  instinct: {
    start: [
      '{agent} 小心翼翼地接近收容单元，准备进行本能工作。',
      '{agent} 戴上防护手套，深吸一口气走进收容区域。',
      '警报解除，{agent} 端着营养补充剂靠近 {abno}。',
    ],
    success: [
      '{abno} 表现出满足的姿态，周围的环境逐渐平静下来。能量产出稳定。',
      '{abno} 接受了 {agent} 的照料，发出了低沉的咕噜声。PE-Box 指数上升。',
      '工作顺利完成。{abno} 的生理指标趋于平稳，能量收集效率良好。',
    ],
    fail: [
      '{abno} 突然变得不安，{agent} 被迫后退。工作未能完成。',
      '{agent} 的操作似乎触怒了 {abno}，收容单元内警报闪烁。工作失败。',
      '{abno} 拒绝配合，{agent} 被一股无形的力量推开。',
    ],
    neBox: [
      '{abno} 剧烈反抗，{agent} 被精神冲击波击中，脑中回荡着不明低语。',
      '负能量爆发！{agent} 感受到 {abno} 的思维入侵，精神受到侵蚀。',
      'NE-Box 生成。{agent} 面色苍白地退出收容单元，显然受到了心理创伤。',
    ],
  },
  insight: {
    start: [
      '{agent} 检查收容单元的各个系统，准备进行洞察工作。',
      '{agent} 携带检测设备进入 {abno} 的收容区域，开始环境分析。',
      '{agent} 调整收容单元的温湿度和音乐播放列表，试图优化环境。',
    ],
    success: [
      '通过对 {abno} 行为的细致观察，{agent} 找到了改善收容条件的关键。能量产出提升。',
      '{abno} 的活跃度在 {agent} 的调整下明显提高。洞察工作取得成效。',
      '{agent} 记录了大量有价值的行为数据。PE-Box 收集量令人满意。',
    ],
    fail: [
      '{abno} 的行为模式完全无法预测，{agent} 的分析全部失效。',
      '环境调整似乎起到了反效果。{abno} 变得更加沉默和抗拒。',
      '{agent} 无法解读 {abno} 的需求信号。工作效果不佳。',
    ],
    neBox: [
      '{abno} 突然在 {agent} 的大脑中投射出恐怖画面！{agent} 的精神受到冲击。',
      '过度深入的分析触发了 {abno} 的保护机制。{agent} 被强制逐出收容单元。',
      '{agent} 读取了不该读取的信息——深埋在集体无意识中的禁忌知识。',
    ],
  },
  attachment: {
    start: [
      '{agent} 在 {abno} 面前坐下，尝试建立交流通道。',
      '{agent} 轻声对 {abno} 说话，像对待一个需要陪伴的孩子。',
      '{agent} 拿出事先准备好的物品，试图引起 {abno} 的互动兴趣。',
    ],
    success: [
      '{abno} 对 {agent} 产生了信任，主动靠近并发出积极的信号。',
      '{agent} 与 {abno} 之间建立了短暂的共鸣连接。能量转化率异常高。',
      '{abno} 似乎把 {agent} 当成了可以交流的对象。PE-Box 大量产出。',
    ],
    fail: [
      '{abno} 无视了 {agent} 的存在，完全拒绝任何形式的交流。',
      '{agent} 的努力没有得到回应。{abno} 沉浸在自我的世界中。',
      '沟通尝试失败。{abno} 的情绪变得更加不稳定。',
    ],
    neBox: [
      '{abno} 突然暴怒，精神污染通过接触点侵入 {agent} 的意识。',
      '{agent} 在交流过程中被 {abno} 的情绪吞噬，陷入短暂的失神状态。',
      '共鸣过度——{agent} 无法区分自己的记忆和 {abno} 投射的幻觉。',
    ],
  },
  repression: {
    start: [
      '{agent} 调整了收容单元的抑制力场，准备执行压迫工作。',
      '{agent} 在心理上做好准备，进入 {abno} 的收容区域执行抑制程序。',
      '抑制协议启动。{agent} 开始对 {abno} 进行强制性调控。',
    ],
    success: [
      '{abno} 的活性被成功抑制。尽管它表现出不满，但能量依然被稳定收集。',
      '{agent} 成功压制了 {abno} 的失控倾向。设施安全等级维持正常。',
      '压迫工作完成。{abno} 的行为阈值被控制在安全范围内。',
    ],
    fail: [
      '{abno} 抵抗了压制，{agent} 被弹开。抑制效果微乎其微。',
      '{agent} 的压制策略完全失效。{abno} 的活跃度不降反升。',
      '{abno} 似乎享受这种对抗，它玩弄了 {agent} 的压制尝试。',
    ],
    neBox: [
      '{abno} 的反抗超出了预期！{agent} 被精神反噬，尖叫着逃出收容单元。',
      '压制行为触发了 {abno} 的深层防御机制。{agent} 的大脑受到重创。',
      '{abno} 将压制力量反转，{agent} 被自己的意志反噬。严重的精神创伤。',
    ],
  },
}

const SUCCESS_DETAILS = [
  '{abno} 的 Qliphoth 计数器略微波动后恢复了稳定。',
  '能量仪表盘上的 PE-Box 计数稳步上升。',
  '收容单元内的监控数据显示 {abno} 的状态趋于积极。',
  '实验室的分析系统确认了脑啡肽的纯度为优质等级。',
  '{agent} 的工作记录被标记为"有效"，数据已录入系统。',
]

const FAIL_DETAILS = [
  '收容单元的能量读数没有明显变化。',
  '{agent} 报告称 {abno} 几乎没有产出任何能量。',
  '监控记录显示工作过程中发生了多次中断。',
  '实验数据表明本次工作的投入产出比极低。',
]

export interface WorkResult {
  agentName: string
  abnoName: string
  workType: string
  workLabel: string
  success: boolean
  narrative: string[]
  energyGain: number
  experienceGain: number
  neBoxDamage: boolean
  damageAmount: number
}

export function generateWorkResult(
  agentName: string,
  abnoName: string,
  workKey: string,
  workLabel: string,
  workPref: number,
  agentVirtue: number,
): WorkResult {
  // Calculate success probability based on work preference (1-5) + agent virtue (1-5)
  const baseChance = workPref * 10 + agentVirtue * 8
  const roll = Math.random() * 100
  const success = roll < baseChance

  // Base energy: 10-40 depending on work pref and success
  const baseEnergy = workPref * 5
  const energyGain = success ? baseEnergy + Math.floor(Math.random() * 15) : Math.floor(Math.random() * 8)

  // Experience
  const experienceGain = success ? 5 + workPref * 2 : 2

  // NE-Box: 15% chance on success, 40% on failure
  const neBoxChance = success ? 0.15 : 0.4
  const neBoxDamage = Math.random() < neBoxChance
  const damageAmount = neBoxDamage ? 10 + Math.floor(Math.random() * 20) : 0

  // Build narrative
  const narratives = WORK_NARRATIVES[workKey]
  const narrative: string[] = []

  const replaceVars = (text: string) => text.replace(/{agent}/g, agentName).replace(/{abno}/g, abnoName)

  // Start
  narrative.push(replaceVars(narratives.start[Math.floor(Math.random() * narratives.start.length)]))

  // Result
  if (success) {
    narrative.push(replaceVars(narratives.success[Math.floor(Math.random() * narratives.success.length)]))
    narrative.push(SUCCESS_DETAILS[Math.floor(Math.random() * SUCCESS_DETAILS.length)])
  } else {
    narrative.push(replaceVars(narratives.fail[Math.floor(Math.random() * narratives.fail.length)]))
    narrative.push(FAIL_DETAILS[Math.floor(Math.random() * FAIL_DETAILS.length)])
  }

  // NE-Box damage
  if (neBoxDamage) {
    narrative.push(replaceVars(narratives.neBox[Math.floor(Math.random() * narratives.neBox.length)]))
  }

  return { agentName, abnoName, workType: workKey, workLabel, success, narrative, energyGain, experienceGain, neBoxDamage, damageAmount }
}
