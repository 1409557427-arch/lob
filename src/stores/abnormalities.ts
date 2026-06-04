import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Abnormality {
  id: string; name: string; subjectId: string; riskLevel: 'ZAYIN' | 'TETH' | 'HE' | 'WAW' | 'ALEPH'
  qliphothCounter: number; maxQliphoth: number; observationLevel: number; maxObservation: number
  workPreferences: Record<string, number>
  attackType: string; weaknesses: string[]; resistances: string[]
  description: string; story: string; currentWork: string | null; assignedAgent: string | null
}

export const useAbnormalitiesStore = defineStore('abnormalities', () => {
  const abnormalities = ref<Abnormality[]>([
    { id: 'ab1', name: '忏悔', subjectId: 'O-03-03', riskLevel: 'ZAYIN', qliphothCounter: 3, maxQliphoth: 3, observationLevel: 2, maxObservation: 4, workPreferences: { Instinct: 1, Insight: 3, Attachment: 4, Repression: 0 }, attackType: 'WHITE', weaknesses: [], resistances: ['RED'], description: '附着于十字架上的巨大骷髅，头戴荆棘冠冕。以人们对话中流露的恶意为食。浮在地面上方约 2 米处。偶尔能听到颌骨开合的声音。', story: '员工被指派向异想体忏悔其罪过。我们将罪恶分为三个等级。等级 1 或 2 的忏悔导致能量小幅度增长。在一次等级 3 的忏悔实验中，一道强光闪过，整个设施停电，员工失去了约 6 年的记忆。进一步实验被取消。', currentWork: null, assignedAgent: null },
    { id: 'ab2', name: '快乐罐头', subjectId: 'F-05-52', riskLevel: 'TETH', qliphothCounter: 2, maxQliphoth: 2, observationLevel: 1, maxObservation: 3, workPreferences: { Instinct: 4, Insight: 2, Attachment: 5, Repression: 1 }, attackType: 'BLACK', weaknesses: ['WHITE'], resistances: ['RED'], description: '一罐已经打开的 WellCheers 汽水。喝下后会在远方听到海鸥的叫声。当员工在车上睡着后醒来时，会发现自己躺在一艘渔船的甲板上。', story: '被绑架者被迫在渔船上学习捕鱼技能一个月。学会捕鱼、做饭和修补渔网后，部分被绑架者选择留在渔船上——这是他们第一次收到赞美的地方。', currentWork: null, assignedAgent: null },
    { id: 'ab3', name: '焦化少女', subjectId: 'T-09-80', riskLevel: 'HE', qliphothCounter: 2, maxQliphoth: 2, observationLevel: 0, maxObservation: 3, workPreferences: { Instinct: 2, Insight: 4, Attachment: 3, Repression: 3 }, attackType: 'RED', weaknesses: ['BLACK'], resistances: ['WHITE'], description: '一具被烧焦的人类女性形态遗骸。身体表面持续有灰烬飘落。靠近时感受到辐射热。体温恒定维持在 300°C。', story: '死亡方式始终无法确定。尸检显示所有内脏完好但完全碳化。直接接触会造成三级烧伤。偶尔从焦化的声带中传出声音——像是在复述某些被遗忘的话语。', currentWork: null, assignedAgent: null },
    { id: 'ab4', name: '数据过滤器', subjectId: 'O-05-30', riskLevel: 'WAW', qliphothCounter: 1, maxQliphoth: 1, observationLevel: 0, maxObservation: 4, workPreferences: { Instinct: 0, Insight: 5, Attachment: 2, Repression: 4 }, attackType: 'BLACK', weaknesses: ['PALE'], resistances: ['RED', 'WHITE'], description: '一台老式计算机终端。屏幕上的字符以无法追踪的速度流动。任何人长时间注视屏幕后，开始失去区分记忆与幻觉的能力。', story: '实验中，一名员工在屏幕前坐了 4 小时。随后她准确描述了从未发生过的设施紧急事件——包括不存在的员工的死亡细节。三周后，她描述的紧急事件完全按照她叙述的顺序发生了。', currentWork: null, assignedAgent: null },
  ])

  const selectedId = ref<string | null>(null)
  const selected = computed(() => abnormalities.value.find(a => a.id === selectedId.value) ?? null)

  return { abnormalities, selectedId, selected }
})
