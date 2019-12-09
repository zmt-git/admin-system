import Vue from 'vue'
export default new Vue()
export const emitType = {
  ledMain: 'WS_updataledStatus',
  ledLight: 'WS_updataledStatus',
  lampMain: 'WS_updatalampStatus',
  lampLight: 'WS_updatalampStatus',
  debug: 'WS_debugging',
  voiceMain: 'WS_updatavoiceStatus',
  visibilityLamp: 'WS_visibilityLamp',
  visibilityLampTable: 'WS_visibilityLampTable'
}
