import * as migration_20260909_085318_initial from './20260909_085318_initial';
import * as migration_20260911_110810_rfq_items from './20260911_110810_rfq_items';
import * as migration_20260911_122020_trust_content from './20260911_122020_trust_content';
import * as migration_20260911_180331_design_system from './20260911_180331_design_system';

export const migrations = [
  {
    up: migration_20260909_085318_initial.up,
    down: migration_20260909_085318_initial.down,
    name: '20260909_085318_initial',
  },
  {
    up: migration_20260911_110810_rfq_items.up,
    down: migration_20260911_110810_rfq_items.down,
    name: '20260911_110810_rfq_items',
  },
  {
    up: migration_20260911_122020_trust_content.up,
    down: migration_20260911_122020_trust_content.down,
    name: '20260911_122020_trust_content',
  },
  {
    up: migration_20260911_180331_design_system.up,
    down: migration_20260911_180331_design_system.down,
    name: '20260911_180331_design_system'
  },
];
