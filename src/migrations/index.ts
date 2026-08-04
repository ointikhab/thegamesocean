import * as migration_20260622_200221 from './20260622_200221';
import * as migration_20260626_200827 from './20260626_200827';
import * as migration_20260705_214912_add_map_link from './20260705_214912_add_map_link';
import * as migration_20260705_224705_add_product_condition from './20260705_224705_add_product_condition';
import * as migration_20260706_170427_add_platforms_collection from './20260706_170427_add_platforms_collection';
import * as migration_20260706_174624_add_used_condition_pricing from './20260706_174624_add_used_condition_pricing';
import * as migration_20260706_175639_relax_platform_card_required from './20260706_175639_relax_platform_card_required';
import * as migration_20260709_184719_add_media_hero_size from './20260709_184719_add_media_hero_size';
import * as migration_20260719_201951_add_payment_methods from './20260719_201951_add_payment_methods';
import * as migration_20260804_081054_add_custom_scripts from './20260804_081054_add_custom_scripts';

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
    name: '20260705_224705_add_product_condition',
  },
  {
    up: migration_20260706_170427_add_platforms_collection.up,
    down: migration_20260706_170427_add_platforms_collection.down,
    name: '20260706_170427_add_platforms_collection',
  },
  {
    up: migration_20260706_174624_add_used_condition_pricing.up,
    down: migration_20260706_174624_add_used_condition_pricing.down,
    name: '20260706_174624_add_used_condition_pricing',
  },
  {
    up: migration_20260706_175639_relax_platform_card_required.up,
    down: migration_20260706_175639_relax_platform_card_required.down,
    name: '20260706_175639_relax_platform_card_required',
  },
  {
    up: migration_20260709_184719_add_media_hero_size.up,
    down: migration_20260709_184719_add_media_hero_size.down,
    name: '20260709_184719_add_media_hero_size',
  },
  {
    up: migration_20260719_201951_add_payment_methods.up,
    down: migration_20260719_201951_add_payment_methods.down,
    name: '20260719_201951_add_payment_methods',
  },
  {
    up: migration_20260804_081054_add_custom_scripts.up,
    down: migration_20260804_081054_add_custom_scripts.down,
    name: '20260804_081054_add_custom_scripts'
  },
];
