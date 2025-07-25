<template>
  <li
    v-if="showItem"
    :class="'non-draggable' + (currentPage === '/php' ? ' active' : '')"
    @click="nav"
  >
    <div class="left">
      <div class="icon-block" :class="{ run: serviceRunning }">
        <yb-icon :svg="import('@/svg/php.svg?raw')" style="padding: 4px" width="30" height="30" />
      </div>
      <span class="title">PHP</span>
    </div>

    <el-switch v-model="serviceRunning" :disabled="serviceDisabled" @click.stop="stopNav">
    </el-switch>
  </li>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { AppStore } from '@/store/app'
  import { BrewStore } from '@/store/brew'
  import { I18nT } from '@lang/index'
  import { MessageError, MessageSuccess } from '@/util/Element'
  import { AppServiceModule, AsideSetup } from '@/core/ASide'

  const { showItem, currentPage, nav, stopNav } = AsideSetup('php')

  const appStore = AppStore()
  const brewStore = BrewStore()

  const phpVersions = computed(() => {
    return brewStore.module('php').installed
  })

  const serviceRunning = computed({
    get(): boolean {
      return phpVersions?.value?.length > 0 && phpVersions?.value?.some((v) => v.run)
    },
    set(v: boolean) {
      const all: Array<Promise<any>> = []
      if (v) {
        const runNum: Set<number> = new Set<number>()
        phpVersions?.value?.forEach((v) => {
          if (v?.version && appStore.phpGroupStart?.[v.bin] !== false && !v?.run) {
            if (!runNum.has(v.num!)) {
              runNum.add(v.num!)
              all.push(v.start())
            }
          }
        })
      } else {
        phpVersions?.value?.forEach((v) => {
          if (v?.version && v?.run) {
            all.push(v.stop())
          }
        })
      }
      Promise.all(all).then((res) => {
        const find = res.find((s) => typeof s === 'string')
        if (find) {
          MessageError(find)
        } else {
          MessageSuccess(I18nT('base.success'))
        }
      })
    }
  })

  const serviceDisabled = computed(() => {
    return (
      phpVersions?.value?.length === 0 ||
      phpVersions?.value?.some((v) => v.running) ||
      !appStore.versionInitiated
    )
  })

  const serviceFetching = computed(() => {
    return phpVersions?.value?.some((v) => v.running)
  })

  const groupDo = (isRunning: boolean): Array<Promise<string | boolean>> => {
    const all: Array<Promise<string | boolean>> = []
    if (isRunning) {
      if (showItem?.value) {
        phpVersions?.value?.forEach((v) => {
          if (v?.version && v?.run) {
            const module = brewStore.module('php')
            all.push(module.stop())
          }
        })
      }
    } else {
      if (showItem?.value) {
        const runNum: Set<number> = new Set<number>()
        phpVersions?.value?.forEach((v) => {
          if (v?.version && appStore.phpGroupStart?.[v.bin] !== false && !v?.run) {
            if (!runNum.has(v.num!)) {
              runNum.add(v.num!)
              all.push(v.start())
            }
          }
        })
      }
    }
    return all
  }

  const switchChange = () => {
    serviceRunning.value = !serviceRunning.value
  }

  AppServiceModule.php = {
    groupDo,
    switchChange,
    serviceRunning,
    serviceFetching,
    serviceDisabled,
    showItem
  } as any
</script>
