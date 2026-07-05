import * as migration_20260622_200221 from './20260622_200221';
import * as migration_20260626_200827 from './20260626_200827';
import * as migration_20260705_214912_add_map_link from './20260705_214912_add_map_link';
import * as migration_20260705_224705_add_product_condition from './20260705_224705_add_product_condition';

export const migrations = [
  {
    up: migration_20260622_200221.up,
    down: migration_20260622_200221.down,
    name: '20260622_200221',
  },
  {
    up: migration_20260626_200827.up,
    down: migration_20260626_200827.down,
    name: '20260626_200827',
  },
  {
    up: migration_20260705_214912_add_map_link.up,
    down: migration_20260705_214912_add_map_link.down,
    name: '20260705_214912_add_map_link',
  },
  {
    up: migration_20260705_224705_add_product_condition.up,
    down: migration_20260705_224705_add_product_condition.down,
    name: '20260705_224705_add_product_condition'
  },
];
