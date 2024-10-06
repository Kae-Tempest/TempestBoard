import { u as useUserStore, a as useCustomFetch, c as useCapitalize, e as useRefreshData, f as _sfc_main$7 } from './Navbar-BYxGt_4k.mjs';
import { useSSRContext, defineComponent, ref, withAsyncContext, watch, mergeProps, unref, mergeModels, useModel, reactive, computed, resolveComponent, isRef } from 'file:///home/kae/Desktop/TempestBoard/front/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderClass } from 'file:///home/kae/Desktop/TempestBoard/front/node_modules/vue/server-renderer/index.mjs';
import { F as FontAwesomeIcon } from './server.mjs';
import { u as useHead } from './index-BfsD3ZAz.mjs';
import './nuxt-link-CH3S4xEW.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/ufo/dist/index.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/ohash/dist/index.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/ofetch/dist/node.mjs';
import '../_/renderer.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/h3/dist/index.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/devalue/index.js';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/@unhead/ssr/dist/index.mjs';
import '../runtime.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/destr/dist/index.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/unenv/runtime/fetch/index.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/hookable/dist/index.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/klona/dist/index.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/scule/dist/index.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/defu/dist/defu.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/unstorage/dist/index.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/unstorage/drivers/fs.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/unstorage/drivers/fs-lite.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/unstorage/drivers/lru-cache.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/radix3/dist/index.mjs';
import 'node:fs';
import 'node:url';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/pathe/dist/index.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/unhead/dist/index.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/@unhead/shared/dist/index.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/unctx/dist/index.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/vue-router/dist/vue-router.node.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/vue-devtools-stub/dist/index.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/dayjs/dayjs.min.js';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/dayjs/plugin/updateLocale.js';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/dayjs/plugin/relativeTime.js';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/dayjs/plugin/utc.js';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/pinia-plugin-persistedstate/dist/index.js';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/cookie-es/dist/index.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/@fortawesome/fontawesome-svg-core/index.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/@awesome.me/kit-c53b93d6fb/icons/modules/index.mjs';

const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "ProjectCard",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    project: {},
    user: {}
  }, {
    "edit": {},
    "editModifiers": {},
    "delete": {},
    "deleteModifiers": {},
    "settings": {},
    "settingsModifiers": {},
    "selectedProject": {},
    "selectedProjectModifiers": {}
  }),
  emits: ["update:edit", "update:delete", "update:settings", "update:selectedProject"],
  setup(__props) {
    useModel(__props, "edit");
    useModel(__props, "delete");
    useModel(__props, "settings");
    useModel(__props, "selectedProject");
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "card" }, _attrs))}><div class="card-content"><div class="media">`);
      if ((_a = _ctx.project) == null ? void 0 : _a.thumbnail) {
        _push(`<img${ssrRenderAttr("src", _ctx.project.thumbnail)} alt="Placeholder image">`);
      } else {
        _push(`<div></div>`);
      }
      _push(`</div><div class="content"><h2>${ssrInterpolate(_ctx.project.name)}</h2><p>${ssrInterpolate(_ctx.project.description)}</p><div class="content-footer">`);
      if (((_b = _ctx.user) == null ? void 0 : _b.id) == _ctx.project.creator) {
        _push(`<div class="btn-action"><button class="button"><span class="icon is-small">`);
        _push(ssrRenderComponent(unref(FontAwesomeIcon), { icon: "fa-solid fa-trash-can" }, null, _parent));
        _push(`</span></button><button class="button"><span class="icon is-small">`);
        _push(ssrRenderComponent(unref(FontAwesomeIcon), { icon: "fa-solid fa-pen" }, null, _parent));
        _push(`</span></button><button class="button"><span class="icon is-small">`);
        _push(ssrRenderComponent(unref(FontAwesomeIcon), { icon: "fa-solid fa-gear" }, null, _parent));
        _push(`</span></button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="date"><time dateTime="2016-1-1">Created: ${ssrInterpolate(new Date(_ctx.project.created_at).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric" }))}</time><time dateTime="2016-1-1">Updated: ${ssrInterpolate(new Date(_ctx.project.updated_at).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric" }))}</time></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Card/ProjectCard.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "CreateProjectModal",
  __ssrInlineRender: true,
  props: {
    "modelValue": {},
    "modelModifiers": {}
  },
  emits: ["update:modelValue"],
  setup(__props) {
    const showModal = useModel(__props, "modelValue");
    const user = useUserStore().getUser();
    const data = reactive({
      creator: user == null ? void 0 : user.id,
      name: "",
      description: "",
      thumbnail: null,
      status: "in_progress"
    });
    const error = reactive({
      name: "",
      description: "",
      thumbnail: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: [{ "is-active": showModal.value }, "modal"]
      }, _attrs))}><div class="modal-background"></div><div class="modal-content"><div class="box create-box"><h3>Create Project</h3><div class="field"><label class="label">Name</label><div class="control"><input class="input" type="text" name="name"${ssrRenderAttr("value", data.name)}><span class="error">${ssrInterpolate(error.name)}</span></div></div><div class="field"><label class="label">Description</label><div class="control"><textarea class="textarea" name="description">${ssrInterpolate(data.description)}</textarea><span class="error">${ssrInterpolate(error.description)}</span></div></div><div class="field"><div class="file is-small"><label class="file-label"><input class="file-input" type="file" name="resume"><span class="file-cta"><span class="file-icon">`);
      _push(ssrRenderComponent(unref(FontAwesomeIcon), { icon: "fa-solid fa-upload" }, null, _parent));
      _push(`</span>`);
      if (data.thumbnail) {
        _push(`<span class="file-label">${ssrInterpolate((_a = data.thumbnail) == null ? void 0 : _a.name)}</span>`);
      } else {
        _push(`<span class="file-label">Thumbnail..</span>`);
      }
      _push(`</span><span class="error">${ssrInterpolate(error.thumbnail)}</span></label></div></div><div class="field"><div class="control"><button class="button" type="button">Cancel</button><button class="button is-dark" type="submit">Create</button></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Modals/Project/CreateProjectModal.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "EditProjectModal",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    project: {}
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const showModal = useModel(__props, "modelValue");
    const props = __props;
    const data = reactive({
      name: "",
      description: "",
      thumbnail: null,
      status: ""
    });
    const error = reactive({
      name: "",
      description: "",
      thumbnail: ""
    });
    watch(() => showModal.value, (newVal) => {
      if (newVal) {
        data.name = props.project.name;
        data.description = props.project.description;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: [{ "is-active": showModal.value }, "modal"]
      }, _attrs))}><div class="modal-background"></div><div class="modal-content"><div class="box edit-box"><h3>Update Project</h3><div class="field"><label class="label">Name</label><div class="control"><input class="input" type="text" name="name"${ssrRenderAttr("value", data.name)}><span class="error">${ssrInterpolate(error.name)}</span></div></div><div class="field"><label class="label">Description</label><div class="control"><textarea class="textarea" name="description">${ssrInterpolate(data.description)}</textarea><span class="error">${ssrInterpolate(error.description)}</span></div></div><div class="field"><div class="file is-small"><label class="file-label"><input class="file-input" type="file" name="resume"><span class="file-cta"><span class="file-icon">`);
      _push(ssrRenderComponent(unref(FontAwesomeIcon), { icon: "fa-solid fa-upload" }, null, _parent));
      _push(`</span>`);
      if (data.thumbnail) {
        _push(`<span class="file-label">${ssrInterpolate((_a = data.thumbnail) == null ? void 0 : _a.name)}</span>`);
      } else {
        _push(`<span class="file-label">Thumbnail..</span>`);
      }
      _push(`</span><span class="error">${ssrInterpolate(error.thumbnail)}</span></label></div></div><div class="field"><div class="control"><button class="button"> Cancel </button><button class="button is-dark"> Edit </button></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Modals/Project/EditProjectModal.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "DeleteProjectModal",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    project: {}
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const showModal = useModel(__props, "modelValue");
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: [{ "is-active": showModal.value }, "modal"]
      }, _attrs))}><div class="modal-background"></div><div class="modal-content"><div class="box del-box"><h4>Are you sure you want to delete ${ssrInterpolate((_a = _ctx.project) == null ? void 0 : _a.name)}?</h4><div class="btn-action"><button class="button">Cancel</button><button class="button is-dark">Delete</button></div></div></div></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Modals/Project/DeleteProjectModal.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "WorkflowSettingsModule",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    projectStates: {},
    project: {}
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const props = __props;
    const CreateStateRef = useModel(__props, "modelValue");
    const editedState = ref("");
    const isCreating = ref(false);
    const data = reactive({
      name: ""
    });
    reactive({
      name: ""
    });
    const projectStatesRef = computed(() => props.projectStates);
    watch(() => CreateStateRef.value, () => {
      if (CreateStateRef.value && props.project.id) {
        isCreating.value = true;
        let newState = {
          id: -1,
          name: "",
          project: props.project.id,
          is_default: false,
          created_at: /* @__PURE__ */ new Date(),
          updated_at: /* @__PURE__ */ new Date()
        };
        projectStatesRef.value.push(newState);
        editedState.value = newState.name;
      }
    });
    watch(() => editedState.value, (newVal) => {
      if (isCreating.value && newVal !== "") {
        projectStatesRef.value.pop();
        isCreating.value = false;
        CreateStateRef.value = false;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_font_awesome_icon = resolveComponent("font-awesome-icon");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "state-wrapper" }, _attrs))}><!--[-->`);
      ssrRenderList(unref(projectStatesRef), (state) => {
        _push(`<div class="state-infos">`);
        if (unref(editedState) !== state.name) {
          _push(`<div class="state-name">${ssrInterpolate(("useCapitalize" in _ctx ? _ctx.useCapitalize : unref(useCapitalize))(state.name))}</div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(editedState) === state.name) {
          _push(`<div class="state-name"><input type="text" class="input"${ssrRenderAttr("placeholder", state.name)}${ssrRenderAttr("value", unref(data).name)}></div>`);
        } else {
          _push(`<!---->`);
        }
        if (!state.is_default && unref(editedState) !== state.name) {
          _push(`<div class="state-options"><div class="edit-icon"><button class="button"><span class="icon">`);
          _push(ssrRenderComponent(_component_font_awesome_icon, { icon: "fa-regular fa-pen" }, null, _parent));
          _push(`</span></button></div><div class="trash-icon"><button class="button is-dark"><span class="icon">`);
          _push(ssrRenderComponent(_component_font_awesome_icon, { icon: "fa-solid fa-trash" }, null, _parent));
          _push(`</span></button></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (!state.is_default && unref(editedState) === state.name) {
          _push(`<div class="state-options"><div class="check-icon"><button class="button"><span class="icon">`);
          _push(ssrRenderComponent(_component_font_awesome_icon, { icon: "fa-solid fa-check" }, null, _parent));
          _push(`</span></button></div><div class="xmark-icon"><button class="button is-dark"><span class="icon">`);
          _push(ssrRenderComponent(_component_font_awesome_icon, { icon: "fa-solid fa-xmark" }, null, _parent));
          _push(`</span></button></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Project/Workflow/WorkflowSettingsModule.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ProjectSettingsModal",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    project: {}
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const props = __props;
    const showModal = useModel(__props, "modelValue");
    const tabs = ref("users");
    const users = ref([]);
    const projectUsers = ref([]);
    const projectState = ref([]);
    const openCreateStateModal = ref(false);
    reactive({
      users: []
    });
    const handleFetch = async () => {
      const { data: pUsers } = await useCustomFetch(`/projects/${props.project.id}/users/`);
      const { data: usersData } = await useCustomFetch("/users/");
      const { data: projectStateData } = await useCustomFetch(`/project/${props.project.id}/states/`);
      users.value = usersData.value;
      projectUsers.value = pUsers.value;
      projectState.value = projectStateData.value;
    };
    watch(() => showModal.value, async (newVal) => {
      if (newVal)
        await handleFetch();
    });
    watch(() => openCreateStateModal.value, async (newVal) => {
      if (newVal) {
        const { data: projectStateData } = await useCustomFetch(`/project/${props.project.id}/states/`);
        projectState.value = projectStateData.value;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_font_awesome_icon = resolveComponent("font-awesome-icon");
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: [{ "is-active": showModal.value }, "modal settings"]
      }, _attrs))}><div class="modal-background"></div><div class="modal-content"><div class="box user-box"><h3>Project Settings</h3><div class="content"><div class="tabs-left"><div class="tabs-titles"><div class="${ssrRenderClass([{ "is-active": unref(tabs) === "users" }, "tabs-title"])}">Users</div><div class="${ssrRenderClass([{ "is-active": unref(tabs) === "workflow" }, "tabs-title"])}">Workflow</div></div></div>`);
      if (unref(tabs) === "users") {
        _push(`<div class="tabs-right user"><div class="field"><div class="select is-multiple">`);
        if (unref(users).length > 0) {
          _push(`<select multiple size="4"><!--[-->`);
          ssrRenderList(unref(users).filter((u) => u.id !== _ctx.project.creator), (user) => {
            _push(`<option${ssrRenderAttr("value", user.id)}>${ssrInterpolate(user.username)}</option>`);
          });
          _push(`<!--]--></select>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="field"><div class="control"><button class="button" type="button">Cancel</button><button class="button is-dark" type="submit">Add</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(tabs) === "workflow") {
        _push(`<div class="tabs-right workflow">`);
        _push(ssrRenderComponent(_sfc_main$2, {
          projectStates: unref(projectState),
          project: _ctx.project,
          modelValue: unref(openCreateStateModal),
          "onUpdate:modelValue": ($event) => isRef(openCreateStateModal) ? openCreateStateModal.value = $event : null
        }, null, _parent));
        _push(`<div class="button is-small"><span class="icon is-small">`);
        _push(ssrRenderComponent(_component_font_awesome_icon, { icon: "fa-solid fa-plus" }, null, _parent));
        _push(`</span></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button class="button">Cancel</button></div></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Modals/Project/ProjectSettingsModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "project",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useHead({ title: "Project - Tempest Board" });
    const user = useUserStore().getUser();
    const projects = ref([]);
    const { data, refresh } = ([__temp, __restore] = withAsyncContext(() => useCustomFetch("/projects/", { immediate: false })), __temp = await __temp, __restore(), __temp);
    const showCreateModal = ref(false);
    const showEditModal = ref(false);
    const showDeleteModal = ref(false);
    const showSettingsModal = ref(false);
    const selectedProject = ref(null);
    const { isRefresh } = useRefreshData();
    watch(() => isRefresh.value, async (newVal) => {
      if (newVal) {
        await refresh();
        projects.value = data.value;
        isRefresh.value = false;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Navbar = _sfc_main$7;
      const _component_CardProjectCard = _sfc_main$6;
      _push(`<div${ssrRenderAttrs(mergeProps({ id: "project" }, _attrs))}>`);
      if (unref(user)) {
        _push(ssrRenderComponent(_component_Navbar, {
          user: unref(user),
          projects: projects.value
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<header><nav class="breadcrumb is-medium" aria-label="breadcrumbs"><ul><li>Projects</li></ul></nav><button class="add-project">New Project</button></header><div class="content"><div>`);
      _push(ssrRenderComponent(_sfc_main$5, {
        modelValue: showCreateModal.value,
        "onUpdate:modelValue": ($event) => showCreateModal.value = $event
      }, null, _parent));
      if (selectedProject.value) {
        _push(ssrRenderComponent(_sfc_main$3, {
          project: selectedProject.value,
          modelValue: showDeleteModal.value,
          "onUpdate:modelValue": ($event) => showDeleteModal.value = $event
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (selectedProject.value) {
        _push(ssrRenderComponent(_sfc_main$4, {
          project: selectedProject.value,
          modelValue: showEditModal.value,
          "onUpdate:modelValue": ($event) => showEditModal.value = $event
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (selectedProject.value) {
        _push(ssrRenderComponent(_sfc_main$1, {
          project: selectedProject.value,
          modelValue: showSettingsModal.value,
          "onUpdate:modelValue": ($event) => showSettingsModal.value = $event
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(projects.value.sort((p, p2) => p.id - p2.id), (project) => {
        _push(`<div>`);
        if (unref(user)) {
          _push(ssrRenderComponent(_component_CardProjectCard, {
            project,
            user: unref(user),
            edit: showEditModal.value,
            "onUpdate:edit": ($event) => showEditModal.value = $event,
            delete: showDeleteModal.value,
            "onUpdate:delete": ($event) => showDeleteModal.value = $event,
            settings: showSettingsModal.value,
            "onUpdate:settings": ($event) => showSettingsModal.value = $event,
            selectedProject: selectedProject.value,
            "onUpdate:selectedProject": ($event) => selectedProject.value = $event
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/project.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=project-Au4NDh2E.mjs.map
