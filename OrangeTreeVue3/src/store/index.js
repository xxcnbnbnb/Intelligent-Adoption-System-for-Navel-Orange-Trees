import { createPinia } from 'pinia';
import { useUserStore } from './user';
import { useAdminStore } from './admin';
import { useTreeStore } from './tree';

const pinia = createPinia();

export {
  pinia,
  useUserStore,
  useAdminStore,
  useTreeStore
};