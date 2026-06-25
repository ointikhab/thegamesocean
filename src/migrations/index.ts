import * as migration_20260622_200221 from './20260622_200221';

export const migrations = [
  {
    up: migration_20260622_200221.up,
    down: migration_20260622_200221.down,
    name: '20260622_200221'
  },
];
