## MVU 初始变量 (复制到世界书，设为蓝灯 D0，insertion_order=0，constant=true)

```yaml
facility:
  energy_quota: 200
  energy_collected: 0
  branch_id: 47
  quota_met: false
emergency:
  trumpet_level: 0
  breached_count: 0
  active_breach: false
employees:
  agents_active: 3
  clerks_active: 0
  deaths_today: 0
  casualties: false
agents:
  agent_alpha:
    name: "Agent Alpha"
    weapon: { name: "未装备", grade: "无", damage_type: "无", source_abnormality: "无" }
    suit: { name: "基础制服", grade: "无", resist_red: 1.0, resist_white: 1.0, resist_black: 1.0, resist_pale: 1.0, source_abnormality: "无" }
    virtue_fortitude: 1
    virtue_prudence: 1
    virtue_temperance: 1
    virtue_justice: 1
    status: "idle"
  agent_beta:
    name: "Agent Beta"
    weapon: { name: "未装备", grade: "无", damage_type: "无", source_abnormality: "无" }
    suit: { name: "基础制服", grade: "无", resist_red: 1.0, resist_white: 1.0, resist_black: 1.0, resist_pale: 1.0, source_abnormality: "无" }
    virtue_fortitude: 1
    virtue_prudence: 1
    virtue_temperance: 1
    virtue_justice: 1
    status: "idle"
  agent_gamma:
    name: "Agent Gamma"
    weapon: { name: "未装备", grade: "无", damage_type: "无", source_abnormality: "无" }
    suit: { name: "基础制服", grade: "无", resist_red: 1.0, resist_white: 1.0, resist_black: 1.0, resist_pale: 1.0, source_abnormality: "无" }
    virtue_fortitude: 1
    virtue_prudence: 1
    virtue_temperance: 1
    virtue_justice: 1
    status: "idle"
ego_inventory:
  weapons: []
  suits: []
abnormalities:
  total_count: 3
  by_risk:
    ZAYIN: 1
    TETH: 1
    HE: 1
    WAW: 0
    ALEPH: 0
  observed_count: 0
progress:
  day: 1
  completed_days: 0
  total_deaths: 0
```

## MVU 更新规则 (复制到世界书，蓝灯条目)

当以下情况发生时更新变量：
- 完成一次工作 → energy_collected 增加，该代理对应 virtue 可能升级
- 提取 E.G.O. → ego_inventory.weapons 或 suits 新增条目
- 装备 E.G.O. → 代理的 weapon/suit 字段更新
- 代理死亡 → 装备的 E.G.O. 丢失（需重新提取），agents_active -= 1，deaths_today += 1
- 代理升级 → 对应 virtue 字段 +1（上限 Lv.5）
- 异想体突破收容 → active_breach = true，trumpet_level 相应升级
- 代理恐慌 → status 变为 "panicked"
- 警报解除 → trumpet_level = 0，active_breach = false
- 完成一天 → day += 1，energy_collected 重置，deaths_today 重置
- 解锁异想体信息 → observed_count += 1

## MVU 输出格式 (复制到世界书，蓝灯条目)

AI 在每轮回复末尾以 JSON Patch 格式输出变量更新：

```json
[
  {"op":"replace","path":"/facility/energy_collected","value":60},
  {"op":"replace","path":"/agents/agent_alpha/virtue_fortitude","value":2},
  {"op":"replace","path":"/agents/agent_alpha/weapon","value":{"name":"忏悔","grade":"ZAYIN","damage_type":"WHITE","source_abnormality":"O-03-03"}},
  {"op":"add","path":"/ego_inventory/weapons/-","value":{"name":"忏悔","grade":"ZAYIN","damage_type":"WHITE","source_abnormality":"O-03-03","required_virtue":"Justice","required_level":1}}
]
```
