<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import type { Marker } from 'leaflet'
import { useTankstellenStore } from '../../stores/tankstellen/tankstellen.store'
import type { Tankstelle } from '../../api/tankstellen/tankstellen.types'

const COLOGNE_CENTER: [number, number] = [50.9375, 6.9603]
const DEFAULT_ZOOM = 12
const SELECTED_ZOOM = 15
const POPUP_OPEN_DELAY_MS = 300

const store = useTankstellenStore()
const { filteredAndSorted, selectedStation } = storeToRefs(store)

const zoom = ref(DEFAULT_ZOOM)
const center = ref<[number, number]>(COLOGNE_CENTER)

// race condition mit vue-leaflet:
const isMapReady = ref(false)

const markerById = ref<Record<number, Marker>>({})

function registerMarker(objectid: number, marker: Marker) {
  markerById.value[objectid] = marker
}

function handleMarkerClick(station: Tankstelle) {
  store.selectStation(station)
}

onMounted(() => {
  isMapReady.value = true
})

watch(selectedStation, (station) => {
  if (!station) return

  center.value = [station.lat, station.lng]
  zoom.value = SELECTED_ZOOM

  // Warten, bis die Karte sich neu zentriert hat, bevor das Popup auf-poppt.
  window.setTimeout(() => {
    markerById.value[station.objectid]?.openPopup()
  }, POPUP_OPEN_DELAY_MS)
})
</script>

<template>
  <div
    class="h-[400px] w-full overflow-hidden rounded-lg border border-gray-200 shadow-sm md:h-[500px] dark:border-gray-700"
  >
    <LMap
      v-if="isMapReady"
      :zoom="zoom"
      :center="center"
      :use-global-leaflet="false"
      :padding="[40, 40]"
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        layer-type="base"
        name="OpenStreetMap"
      />
      <LMarker
        v-for="station in filteredAndSorted"
        :key="station.objectid"
        :lat-lng="[station.lat, station.lng]"
        :options="{ autoPanOnFocus: true }"
        @ready="(marker: Marker) => registerMarker(station.objectid, marker)"
        @click="handleMarkerClick(station)"
      >
        <LPopup>
          <strong>{{ station.adresse }}</strong>
        </LPopup>
      </LMarker>
    </LMap>
  </div>
</template>
