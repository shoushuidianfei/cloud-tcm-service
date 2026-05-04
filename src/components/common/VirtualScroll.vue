<template>
  <div
    ref="containerRef"
    class="virtual-scroll"
    :style="{ height: containerHeight + 'px' }"
    @scroll="handleScroll"
  >
    <div class="virtual-scroll-phantom" :style="{ height: totalHeight + 'px' }"></div>
    <div class="virtual-scroll-content" :style="{ transform: `translateY(${offset}px)` }">
      <div
        v-for="item in visibleData"
        :key="item[idKey]"
        class="virtual-scroll-item"
        :style="{ height: itemHeight + 'px' }"
      >
        <slot :item="item" :index="item._index" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  itemHeight: {
    type: Number,
    default: 120
  },
  containerHeight: {
    type: Number,
    default: 600
  },
  idKey: {
    type: String,
    default: 'id'
  },
  buffer: {
    type: Number,
    default: 5
  }
})

const containerRef = ref(null)
const scrollTop = ref(0)

const totalHeight = computed(() => props.data.length * props.itemHeight)

const visibleCount = computed(() =>
  Math.ceil(props.containerHeight / props.itemHeight) + props.buffer * 2
)

const startIndex = computed(() =>
  Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.buffer)
)

const endIndex = computed(() =>
  Math.min(props.data.length, startIndex.value + visibleCount.value)
)

const visibleData = computed(() =>
  props.data.slice(startIndex.value, endIndex.value).map((item, index) => ({
    ...item,
    _index: startIndex.value + index
  }))
)

const offset = computed(() => startIndex.value * props.itemHeight)

function handleScroll(e) {
  scrollTop.value = e.target.scrollTop
}

watch(() => props.data, () => {
  if (containerRef.value) {
    containerRef.value.scrollTop = 0
    scrollTop.value = 0
  }
})
</script>

<style scoped>
.virtual-scroll {
  position: relative;
  overflow-y: auto;
  width: 100%;
}

.virtual-scroll-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.virtual-scroll-content {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
}

.virtual-scroll-item {
  box-sizing: border-box;
  padding: 10px;
}
</style>
