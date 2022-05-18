
Nova.booting((Vue) => {
    // Re-use old components but we extend the form field
    Vue.component('IndexBelongsToDependency', Vue.component('IndexBelongsToField'));
    Vue.component('DetailBelongsToDependency', Vue.component('DetailBelongsToField'));
    Vue.component(
        "FormBelongsToDependency",
        require("./components/FormField.vue").default
    );
});

