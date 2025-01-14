import { computed } from 'vue'
import { BrewStore } from '@/store/brew'
import type { AllAppModule } from '@/core/type'
import { BrewSetup } from '@/components/VersionManager/brew/setup'
import { MacPortsSetup } from '@/components/VersionManager/port/setup'
import { StaticSetup } from '@/components/VersionManager/static/setup'
import { AsyncComponentShow } from '@/util/AsyncComponent'
import installedVersions from '@/util/InstalledVersions'
import { LocalSetup } from '@/components/VersionManager/local/setup'

const { shell } = require('@electron/remote')

export const SetupAll = (typeFlag: AllAppModule) => {
  const brewStore = BrewStore()

  const libSrc = computed({
    get(): 'brew' | 'port' | 'static' | 'local' {
      if (brewStore.LibUse[typeFlag]) {
        return brewStore.LibUse[typeFlag]
      }
      return 'local'
    },
    set(v: 'brew' | 'port' | 'static' | 'local') {
      brewStore.LibUse[typeFlag] = v
    }
  })

  const showFooter = computed(() => {
    if (libSrc.value === 'brew') {
      return BrewSetup.installing
    }
    if (libSrc.value === 'port') {
      return MacPortsSetup.installing
    }
    return false
  })

  const taskEnd = computed(() => {
    if (libSrc.value === 'brew') {
      return BrewSetup.installEnd
    }
    if (libSrc.value === 'port') {
      return MacPortsSetup.installEnd
    }
    return false
  })

  const taskConfirm = () => {
    console.log('taskConfirm: ', libSrc.value)
    if (libSrc.value === 'brew') {
      BrewSetup.installing = false
      BrewSetup.installEnd = false
      BrewSetup.xterm?.destory()
      delete BrewSetup.xterm
      BrewSetup.checkBrew()
      return
    }

    if (libSrc.value === 'port') {
      MacPortsSetup.installing = false
      MacPortsSetup.installEnd = false
      MacPortsSetup.xterm?.destory()
      delete MacPortsSetup.xterm
      MacPortsSetup.checkMacPorts()
      return
    }
  }

  const taskCancel = () => {
    console.log('taskCancel: ', libSrc.value)
    if (libSrc.value === 'brew') {
      BrewSetup.installing = false
      BrewSetup.installEnd = false
      BrewSetup.xterm?.stop()?.then(() => {
        BrewSetup.xterm?.destory()
        delete BrewSetup.xterm
      })
      return
    }

    if (libSrc.value === 'port') {
      MacPortsSetup.installing = false
      MacPortsSetup.installEnd = false
      MacPortsSetup.xterm?.stop()?.then(() => {
        MacPortsSetup.xterm?.destory()
        delete MacPortsSetup.xterm
      })
      return
    }
  }

  const loading = computed(() => {
    if (libSrc.value === 'brew') {
      return BrewSetup.fetching[typeFlag] || BrewSetup.installing
    }
    if (libSrc.value === 'port') {
      return MacPortsSetup.fetching[typeFlag] || MacPortsSetup.installing
    }
    if (libSrc.value === 'static') {
      return StaticSetup.fetching[typeFlag]
    }
    if (libSrc.value === 'local') {
      return LocalSetup.fetching[typeFlag]
    }
    return false
  })

  const reFetch = () => {
    if (libSrc.value === 'brew') {
      console.log('reFetch brew !!!')
      BrewSetup.reFetch()
    }
    if (libSrc.value === 'port') {
      console.log('reFetch port !!!')
      MacPortsSetup.reFetch()
    }
    if (libSrc.value === 'static') {
      console.log('reFetch static !!!')
      StaticSetup.reFetch()
    }
    if (libSrc.value === 'local') {
      console.log('reFetch local !!!')
      LocalSetup.reFetch()
    }
  }

  const openURL = (url: string) => {
    shell.openExternal(url)
  }

  let CustomPathVM: any
  import('@/components/ServiceManager/customPath.vue').then((res) => {
    CustomPathVM = res.default
  })
  const showCustomDir = () => {
    AsyncComponentShow(CustomPathVM, {
      flag: typeFlag
    }).then((res) => {
      if (res) {
        console.log('showCustomDir chagned !!!')
        LocalSetup.fetching[typeFlag] = true
        const data = brewStore.module(typeFlag)
        data.installedInited = false
        installedVersions.allInstalledVersions([typeFlag]).finally(() => {
          LocalSetup.fetching[typeFlag] = false
        })
      }
    })
  }

  return {
    libSrc,
    showFooter,
    taskEnd,
    taskConfirm,
    taskCancel,
    loading,
    reFetch,
    openURL,
    showCustomDir
  }
}
