import * as migration_20260622_200221 from './20260622_200221';
import * as migration_20260626_200827 from './20260626_200827';

export const migrations = [
  {
    up: migration_20260622_200221.up,
    down: migration_20260622_200221.down,
    name: '20260622_200221',
  },
  {
    up: migration_20260626_200827.up,
    down: migration_20260626_200827.down,
    name: '20260626_200827'
  },
];
