Nova.booting((Vue) => {
    // Re-use old components but we extend the form field
    Vue.component("IndexBelongsToDependency", require("./components/IndexBelongsToField").default);
Vue.component("DetailBelongsToDependency", require("./components/DetailBelongsToField").default);
Vue.component("FormBelongsToDependency", require("./components/FormBelongsToField").default);
})

