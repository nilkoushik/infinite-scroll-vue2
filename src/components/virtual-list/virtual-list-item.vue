<script>
import { ItemProps } from './props';

const Wrapper = {
  created () {
    this.shapeKey = this.horizontal ? 'offsetWidth' : 'offsetHeight'
  },

  mounted () {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.dispatchSizeChange()
      })
      this.resizeObserver.observe(this.$el)
    }
  },

  // since componet will be reused, so disptach when updated
  updated () {
    // this.dispatchSizeChange()
    this.resizeObserver.observe(this.$el)
  },

  beforeDestroy () {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }
  },

  methods: {
    getCurrentSize () {
      return this.$el ? this.$el[this.shapeKey] : 0
    },

    // tell parent current size identify by unqiue key
    dispatchSizeChange () {
      this.$parent.$emit(this.event, this.uniqueKey, this.getCurrentSize(), this.hasInitial)
    }
  }
}
export default {
    mixins: [Wrapper],

props: ItemProps,

render (h) {
  const { tag, component, extraProps = {}, index, source, scopedSlots = {}, uniqueKey, slotComponent } = this
  const props = {
    ...extraProps,
    source,
    index
  }

  return h(tag, {
    key: uniqueKey,
    attrs: {
      role: 'listitem'
    }
  }, [slotComponent ? slotComponent({ item: source, index: index, scope: props }) : h(component, {
    props,
    scopedSlots: scopedSlots
  })])
}

}
</script>