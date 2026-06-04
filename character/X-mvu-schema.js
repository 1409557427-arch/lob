/**
 * Lobotomy Corporation — MVU ZOD Schema
 * 用于追踪脑叶公司设施管理的动态变量
 *
 * 使用方式：复制到酒馆助手脚本 → 角色脚本库
 */

import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';

export const Schema = z.object({
  facility: z.object({
    /** 今日能量配额 */
    energy_quota: z.number().int().min(0).max(9999).default(200),
    /** 当前已收集能量 */
    energy_collected: z.number().int().min(0).default(0),
    /** 支部编号 */
    branch_id: z.number().int().default(47),
    /** 当日是否已完成配额 */
    quota_met: z.boolean().default(false)
  }),

  emergency: z.object({
    /** 当前 Trumpet 警报等级 (0=正常, 1-7) */
    trumpet_level: z.number().int().min(0).max(7).default(0),
    /** 当前突破收容的异想体数量 */
    breached_count: z.number().int().min(0).default(0),
    /** 设施内是否有异想体在逃亡 */
    active_breach: z.boolean().default(false)
  }),

  employees: z.object({
    /** 当前在岗代理(Agents)数量 */
    agents_active: z.number().int().min(0).default(3),
    /** 当前在岗文职(Clerks)数量 */
    clerks_active: z.number().int().min(0).default(0),
    /** 本日员工死亡数 */
    deaths_today: z.number().int().min(0).default(0),
    /** 本日是否已有员工死亡 */
    casualties: z.boolean().default(false)
  }),

  /** 代理 E.G.O. 装备记录 (按代理名称索引) */
  agents: z.object({
    agent_alpha: z.object({
      name: z.string().default("Agent Alpha"),
      weapon: z.object({
        name: z.string().default("未装备"),
        grade: z.enum(["ZAYIN","TETH","HE","WAW","ALEPH","无"]).default("无"),
        damage_type: z.string().default("无"),
        source_abnormality: z.string().default("无")
      }),
      suit: z.object({
        name: z.string().default("基础制服"),
        grade: z.enum(["ZAYIN","TETH","HE","WAW","ALEPH","无"]).default("无"),
        resist_red: z.number().min(0).max(2).default(1.0),
        resist_white: z.number().min(0).max(2).default(1.0),
        resist_black: z.number().min(0).max(2).default(1.0),
        resist_pale: z.number().min(0).max(2).default(1.0),
        source_abnormality: z.string().default("无")
      }),
      virtue_fortitude: z.number().int().min(1).max(5).default(1),
      virtue_prudence: z.number().int().min(1).max(5).default(1),
      virtue_temperance: z.number().int().min(1).max(5).default(1),
      virtue_justice: z.number().int().min(1).max(5).default(1),
      status: z.enum(["idle","working","panicked","dead","absent"]).default("idle")
    }),
    agent_beta: z.object({
      name: z.string().default("Agent Beta"),
      weapon: z.object({
        name: z.string().default("未装备"),
        grade: z.enum(["ZAYIN","TETH","HE","WAW","ALEPH","无"]).default("无"),
        damage_type: z.string().default("无"),
        source_abnormality: z.string().default("无")
      }),
      suit: z.object({
        name: z.string().default("基础制服"),
        grade: z.enum(["ZAYIN","TETH","HE","WAW","ALEPH","无"]).default("无"),
        resist_red: z.number().min(0).max(2).default(1.0),
        resist_white: z.number().min(0).max(2).default(1.0),
        resist_black: z.number().min(0).max(2).default(1.0),
        resist_pale: z.number().min(0).max(2).default(1.0),
        source_abnormality: z.string().default("无")
      }),
      virtue_fortitude: z.number().int().min(1).max(5).default(1),
      virtue_prudence: z.number().int().min(1).max(5).default(1),
      virtue_temperance: z.number().int().min(1).max(5).default(1),
      virtue_justice: z.number().int().min(1).max(5).default(1),
      status: z.enum(["idle","working","panicked","dead","absent"]).default("idle")
    }),
    agent_gamma: z.object({
      name: z.string().default("Agent Gamma"),
      weapon: z.object({
        name: z.string().default("未装备"),
        grade: z.enum(["ZAYIN","TETH","HE","WAW","ALEPH","无"]).default("无"),
        damage_type: z.string().default("无"),
        source_abnormality: z.string().default("无")
      }),
      suit: z.object({
        name: z.string().default("基础制服"),
        grade: z.enum(["ZAYIN","TETH","HE","WAW","ALEPH","无"]).default("无"),
        resist_red: z.number().min(0).max(2).default(1.0),
        resist_white: z.number().min(0).max(2).default(1.0),
        resist_black: z.number().min(0).max(2).default(1.0),
        resist_pale: z.number().min(0).max(2).default(1.0),
        source_abnormality: z.string().default("无")
      }),
      virtue_fortitude: z.number().int().min(1).max(5).default(1),
      virtue_prudence: z.number().int().min(1).max(5).default(1),
      virtue_temperance: z.number().int().min(1).max(5).default(1),
      virtue_justice: z.number().int().min(1).max(5).default(1),
      status: z.enum(["idle","working","panicked","dead","absent"]).default("idle")
    })
  }),

  /** E.G.O. 装备库存 (已提取但未装备的) */
  ego_inventory: z.object({
    weapons: z.array(z.object({
      name: z.string(),
      grade: z.enum(["ZAYIN","TETH","HE","WAW","ALEPH"]),
      damage_type: z.string(),
      source_abnormality: z.string(),
      required_virtue: z.string(),
      required_level: z.number().int().min(1).max(5)
    })).default([]),
    suits: z.array(z.object({
      name: z.string(),
      grade: z.enum(["ZAYIN","TETH","HE","WAW","ALEPH"]),
      resist_red: z.number().min(0).max(2),
      resist_white: z.number().min(0).max(2),
      resist_black: z.number().min(0).max(2),
      resist_pale: z.number().min(0).max(2),
      source_abnormality: z.string(),
      required_virtue: z.string(),
      required_level: z.number().int().min(1).max(5)
    })).default([])
  }),

  abnormalities: z.object({
    /** 设施内异想体总数 */
    total_count: z.number().int().min(0).default(3),
    /** 按风险等级的分布 */
    by_risk: z.object({
      ZAYIN: z.number().int().default(1),
      TETH: z.number().int().default(1),
      HE: z.number().int().default(1),
      WAW: z.number().int().default(0),
      ALEPH: z.number().int().default(0)
    }),
    /** 已解锁信息的异想体数量 */
    observed_count: z.number().int().min(0).default(0)
  }),

  progress: z.object({
    /** 当前工作日数 */
    day: z.number().int().min(1).default(1),
    /** 已完成的配额天数 */
    completed_days: z.number().int().min(0).default(0),
    /** 累计员工总死亡数 */
    total_deaths: z.number().int().min(0).default(0)
  })
});

$(() => {
  registerMvuSchema(Schema);
});
