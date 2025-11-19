import {defineCliConfig} from 'sanity/cli'
import {projectId, dataset} from './environment'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
    appId: 'x1hg965twp625ejrlxrjh4zh',
  },
})
