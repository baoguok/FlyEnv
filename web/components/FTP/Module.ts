import { defineAsyncComponent } from 'vue'
import type { AppModuleItem } from '@web/core/type'

const module: AppModuleItem = {
  moduleType: 'ftpServer',
  typeFlag: 'pure-ftpd',
  label: 'FTP',
  icon: import('@/svg/ftp.svg?raw'),
  index: defineAsyncComponent(() => import('./Index.vue')),
  aside: defineAsyncComponent(() => import('./aside.vue')),
  asideIndex: 14,
  isService: true,
  isTray: true
}
export default module
