import * as migration_20260909_085318_initial from './20260909_085318_initial';

export const migrations = [
  {
    up: migration_20260909_085318_initial.up,
    down: migration_20260909_085318_initial.down,
    name: '20260909_085318_initial'
  },
];
