<template>
  <div class="soft-index-panel main-right-panel">
    <el-radio-group v-model="tab" class="mt-3">
      <template v-for="(item, _index) in tabs" :key="_index">
        <el-radio-button :label="item" :value="_index"></el-radio-button>
      </template>
    </el-radio-group>
    <div class="main-block">
      <Service v-if="tab === 0" title="NodeJS" type-flag="node" :fetch-data-when-create="true">
      </Service>
      <Versions v-else-if="tab === 1"></Versions>
      <Config v-else-if="tab === 2" />
      <Create v-else-if="tab === 3" />
      <ProjectIndex v-else-if="tab === 4" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Service from '@/components/ServiceManager/base.vue'
  import Versions from './List.vue'
  import Config from './Config.vue'
  import { AppModuleSetup } from '@/core/Module'
  import { I18nT } from '@lang/index'
  import Create from './CreateProject.vue'
  import ProjectIndex from './projects/index.vue'

  const { tab } = AppModuleSetup('node')
  const tabs = [
    I18nT('base.service'),
    I18nT('base.versionManager'),
    '.npmrc',
    I18nT('host.newProject'),
    I18nT('host.projectNode')
  ]
</script>
