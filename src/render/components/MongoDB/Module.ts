import { defineAsyncComponent } from 'vue'
import type { AppModuleItem } from '@/core/type'

const module: AppModuleItem = {
  moduleType: 'dataBaseServer',
  typeFlag: 'mongodb',
  label: 'MongoDB',
  icon: import('@/svg/Mongodb.svg?raw'),
  index: defineAsyncComponent(() => import('./Index.vue')),
  aside: defineAsyncComponent(() => import('./aside.vue')),
  asideIndex: 8,
  isService: true,
  isTray: true
}
export default module
