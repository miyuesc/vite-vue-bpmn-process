import { defineComponent, ref } from 'vue'
import { NButton, NButtonGroup, NIcon } from 'naive-ui'
import ZoomOutRound from '@vicons/material/ZoomOutRound'
import ZoomInRound from '@vicons/material/ZoomInRound'
import EventEmitter from '@/utils/EventEmitter'
import type Modeler from 'bpmn-js/lib/Modeler'
import type Canvas from 'diagram-js/lib/core/Canvas'
import { CanvasEvent } from 'diagram-js/lib/core/EventBus'

const Scales = defineComponent({
  setup() {
    const currentScale = ref(1)

    EventEmitter.instance.on('modeler-init', (modeler: Modeler) => {
      currentScale.value = modeler.get<Canvas>('canvas').zoom()
      modeler.on('canvas.viewbox.changed', ({ viewbox }: CanvasEvent<any>) => {
        currentScale.value = viewbox.scale
      })
    })

    const zoomOut = (newScale?: number) => {
      currentScale.value = newScale || Math.floor(currentScale.value * 100 - 0.1 * 100) / 100
      zoomReset(currentScale.value)
    }

    const zoomIn = (newScale?: number) => {
      currentScale.value = newScale || Math.floor(currentScale.value * 100 + 0.1 * 100) / 100
      zoomReset(currentScale.value)
    }

    const zoomReset = (newScale: number | string, center?: string) => {
      if (!window.bpmnInstances?.modeler) {
        return false
      }
      const canvas: Canvas = window.bpmnInstances.modeler.get('canvas')
      canvas.zoom(newScale, center || { x: 0, y: 0 })
    }

    return () => (
      <NButtonGroup>
        <NButton onClick={() => zoomOut()}>
          <NIcon component={ZoomOutRound}></NIcon>
        </NButton>
        <NButton onClick={() => zoomReset('fit-viewport', 'auto')}>
          <span style="text-align: center; display: inline-block; width: 40px">{currentScale.value}</span>
        </NButton>
        <NButton onClick={() => zoomIn()}>
          <NIcon component={ZoomInRound}></NIcon>
        </NButton>
      </NButtonGroup>
    )
  }
})

export default Scales
