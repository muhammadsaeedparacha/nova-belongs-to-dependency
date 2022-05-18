<script>
import FormBelongsToField from '@/fields/Form/BelongsToField';
export default {
    data: () => ({
        dependsOnValue: null,
        watcherDebounce: null,
        watcherDebounceTimeout: 200,
    }),
    extends: FormBelongsToField,
    created() {
        if (this.field.dependsOn !== undefined) {
            this.registerDependencyWatchers(this.$root);
        }
    },

    beforeUnmount() {
        if (this.watcherDebounce) {
            clearTimeout(this.watcherDebounce);
        }
    },

    

    methods: {
        registerDependencyWatchers(root) {
            this.walk(root.$.vnode, component => {
                if (this.componentIsDependency(component)) {
                    if (component.selectedResourceId !== undefined) {
                        console.log('1');
                        // BelongsTo field
                        component.$watch('selectedResourceId', this.dependencyWatcher, {immediate: true});
                        console.log(component)
                        this.dependencyWatcher(component.selectedResourceId);
                    } else if (component.value !== undefined) {
                        console.log('2');
                        // Text based fields
                        component.$watch('value', this.dependencyWatcher, {immediate: true});
                        this.dependencyWatcher(component.value);
                    }
                }

                // this.registerDependencyWatchers(component);
            })
            //let children = root.$.appContext.components;
            // for (const component in children) {

            //     if (true) {
            //         console.log(children[component]);
            //     }

                


                // if (this.componentIsDependency(children[component])) {
                //     if (component.selectedResourceId !== undefined) {
                //         // BelongsTo field
                //         children[component].$watch('selectedResourceId', this.dependencyWatcher, {immediate: true});
                //         this.dependencyWatcher(children[component].selectedResourceId);
                //     } else if (children[component].value !== undefined) {
                //         // Text based fields
                //         children[component].$watch('value', this.dependencyWatcher, {immediate: true});
                //         this.dependencyWatcher(children[component].value);
                //     }

                //     this.registerDependencyWatchers(children[component]);
                // }

            
            // children.forEach(component => {
            //     if (this.componentIsDependency(component)) {
            //         if (component.selectedResourceId !== undefined) {
            //             // BelongsTo field
            //             component.$watch('selectedResourceId', this.dependencyWatcher, {immediate: true});
            //             this.dependencyWatcher(component.selectedResourceId);
            //         } else if (component.value !== undefined) {
            //             // Text based fields
            //             component.$watch('value', this.dependencyWatcher, {immediate: true});
            //             this.dependencyWatcher(component.value);
            //         }
            //     }

            //     this.registerDependencyWatchers(component);
            // })
        },
        componentIsDependency(component) {
            if (component.field === undefined) {
                return false;
            }

            return component.field.attribute === this.field.dependsOn;
        },
        dependencyWatcher(value) {
            console.log('dependency watcher value');
            console.log(value);
            console.log(this.dependsOnValue);
            clearTimeout(this.watcherDebounce);
            this.watcherDebounce = setTimeout(() => {
                console.log('reached timeout')
                if (value === this.dependsOnValue) {
                    return;
                }
                console.log('has depends on value');
                this.dependsOnValue = value;

                this.clearSelection();
                this.$nextTick(() => {
                    this.initializeComponent();
                });

                this.watcherDebounce = null;
            }, this.watcherDebounceTimeout);
        },

        walk(vnode, cb) {
            if (!vnode) return;

            if (vnode.component) {
                const proxy = vnode.component.proxy;
                if (proxy) cb(vnode.component.proxy);
                this.walk(vnode.component.subTree, cb);
            } else if (vnode.shapeFlag & 16) {
                const vnodes = vnode.children;
                for (let i = 0; i < vnodes.length; i++) {
                    this.walk(vnodes[i], cb);
                }
            }
        },
    },

    computed: {
        queryParams() {
            return {
                params: {
                    current: this.selectedResourceId,
                    first: this.initializingWithExistingResource,
                    search: this.search,
                    withTrashed: this.withTrashed,
                    dependsOnValue: this.dependsOnValue,
                },
            };
        },
    },
}
</script>
