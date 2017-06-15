import createBodyClickListener from './body-click-listener'

// const EVENT_LIST = ['click', 'contextmenu', 'keydown']

export default {
    name: 'context-menu',
    props: {
        id: {
            type: String,
            default: 'default-ctx'
        }
    },
    data() {
        return {
            locals: {},
            align: 'left',
            ctxTop: 0,
            ctxLeft: 0,
            ctxVisible: false,
            eventEl: undefined,
            bodyClickListener: createBodyClickListener(
                (e) => {
                    let isOpen = !!this.ctxVisible
                    let outsideClick = isOpen && !this.$el.contains(e.target)

                    if (outsideClick) {
                        if (e.which !== 1) {
                            e.preventDefault()
                            e.stopPropagation()
                            return false;
                        } else {

                            this.ctxVisible = false
                            this.$emit('ctx-cancel', this.locals)
                            e.stopPropagation()
                        }
                    } else {
                        this.ctxVisible = false
                        this.$emit('ctx-close', this.locals)
                    }
                }
            )
        }
    },
    methods: {

        setPositionFromEvent(e) {
            const { pageX, pageY } = e
            // const elHeight = document.getElementById('context-menu').children[0].children[0].offsetHeight
            this.ctxTop = pageY - (document.body.scrollTop)
            this.ctxLeft = pageX
        },

        open(e, data) {
            this.eventEl = e;
            if (this.ctxVisible) this.ctxVisible = false
            this.ctxVisible = true
            document.getElementById('context-menu').setAttribute('visibility', 'hidden')
            this.$emit('ctx-open', this.locals = data || {})
            this.setPositionFromEvent(e)
            this.$el.setAttribute('tab-index', -1)
            this.bodyClickListener.start()
            this.$nextTick(() => {
                const elHeight = document.getElementById('context-menu').children[0].children[0].offsetHeight
                // console.log(elHeight);
                if (elHeight && this.eventEl) {
                    if (window.document.body.clientHeight - this.eventEl.y < elHeight + 50) {
                        this.ctxTop = this.ctxTop - elHeight
                    }
                }
            })
            return this
        }
    },
    watch: {
        ctxVisible(newVal, oldVal) {
            if (oldVal === true && newVal === false) {
                this.bodyClickListener.stop((e) => {
                    // console.log('context menu sequence finished', e)
                    // this.locals = {}
                })
            }
        }
    },
    updated() {
        // const elHeight = document.getElementById('context-menu').children[0].children[0].offsetHeight;
        // if (elHeight && this.eventEl) {
        //     if (window.document.body.clientHeight - this.eventEl.y < elHeight + 50) {
        //         this.ctxTop = this.ctxTop - elHeight
        //     }
        // }
    },
    computed: {
        ctxStyle() {
            return {
                'display': this.ctxVisible ? 'block' : 'none',
                'top': (this.ctxTop || 0) + 'px',
                'left': (this.ctxLeft || 0) + 'px'
            }
        }
    }
}
