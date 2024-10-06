import { u as useUserStore, a as useCustomFetch, b as useWebSocket, A as ActivityContent, _ as _sfc_main$1$1, c as useCapitalize, d as _imports_0, e as useRefreshData, f as _sfc_main$f } from './Navbar-BYxGt_4k.mjs';
import { useSSRContext, defineComponent, ref, withAsyncContext, watch, mergeProps, unref, mergeModels, useModel, computed, reactive, isRef, resolveComponent, withCtx, createTextVNode, toDisplayString } from 'file:///home/kae/Desktop/TempestBoard/front/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderStyle } from 'file:///home/kae/Desktop/TempestBoard/front/node_modules/vue/server-renderer/index.mjs';
import { F as FontAwesomeIcon } from './server.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-CH3S4xEW.mjs';
import dayjs from 'file:///home/kae/Desktop/TempestBoard/front/node_modules/dayjs/dayjs.min.js';
import { u as useHead } from './index-BfsD3ZAz.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/ohash/dist/index.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/ofetch/dist/node.mjs';
import '../_/renderer.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/h3/dist/index.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/devalue/index.js';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/ufo/dist/index.mjs';
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
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/dayjs/plugin/updateLocale.js';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/dayjs/plugin/relativeTime.js';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/dayjs/plugin/utc.js';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/pinia-plugin-persistedstate/dist/index.js';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/cookie-es/dist/index.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/@fortawesome/fontawesome-svg-core/index.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/@awesome.me/kit-c53b93d6fb/icons/modules/index.mjs';

const _sfc_main$e = /* @__PURE__ */ defineComponent({
  __name: "PriorityIcon",
  __ssrInlineRender: true,
  props: {
    priority: {}
  },
  setup(__props) {
    const props = __props;
    const priorityValue = ref(0);
    const priorityIcon = ["fa-solid fa-chevron-down", "fa-solid fa-minus", "fa-solid fa-pause", "fa-solid fa-angles-up", "fa-solid fa-circle-exclamation"];
    const updateIcon = (priority) => {
      if (priority === "Minor")
        priorityValue.value = 0;
      if (priority === "Low")
        priorityValue.value = 1;
      if (priority === "Neutral")
        priorityValue.value = 2;
      if (priority === "High")
        priorityValue.value = 3;
      if (priority === "Urgent")
        priorityValue.value = 4;
    };
    watch(() => props.priority, (newVal) => {
      if (newVal)
        updateIcon(newVal);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "tooltip" }, _attrs))}>`);
      _push(ssrRenderComponent(unref(FontAwesomeIcon), {
        icon: priorityIcon[priorityValue.value],
        rotation: priorityValue.value == 2 ? 90 : void 0
      }, null, _parent));
      _push(`<span class="tooltip-text">${ssrInterpolate(_ctx.priority.toLowerCase())}</span></div>`);
    };
  }
});
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Icon/PriorityIcon.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const _sfc_main$d = /* @__PURE__ */ defineComponent({
  __name: "IssueDetails",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    issue: {},
    projects: {},
    users: {}
  }, {
    "modelValue": { type: Boolean },
    "modelModifiers": {},
    "dropdownIdOpen": {},
    "dropdownIdOpenModifiers": {}
  }),
  emits: ["update:modelValue", "update:dropdownIdOpen"],
  setup(__props) {
    const props = __props;
    useModel(__props, "modelValue");
    const dropdownIdOpen = useModel(__props, "dropdownIdOpen");
    const issue = computed(() => props.issue);
    const projects = computed(() => props.projects);
    const project = computed(() => projects.value.find((p) => p.id === issue.value.project));
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "issue-list" }, _attrs))}>`);
      if (unref(project)) {
        _push(`<div class="issue-list-item"><div class="issue-info"><div class="issue-content"><div class="priority">`);
        _push(ssrRenderComponent(_sfc_main$e, {
          priority: unref(issue).priority
        }, null, _parent));
        _push(`</div><div class="tag-number">${ssrInterpolate(unref(issue).project_tag)}-${ssrInterpolate(unref(issue).ticket_id)}</div><div class="title-issue">${ssrInterpolate(unref(issue).title)}</div></div><div class="other-info"><div class="user-tag"><div class="${ssrRenderClass([{ "is-active": dropdownIdOpen.value === unref(issue).id }, "dropdown"])}"><div class="dropdown-trigger"><button class="button" aria-haspopup="true" aria-controls="dropdown-menu"><span class="tag">${ssrInterpolate(unref(issue).assigned.username)}</span></button></div><div class="dropdown-menu" id="dropdown-menu" role="menu"><div class="dropdown-content">`);
        if (_ctx.users && ((_a = _ctx.users) == null ? void 0 : _a.length) > 0) {
          _push(`<!--[-->`);
          ssrRenderList(unref(project).users.filter((u) => u != unref(issue).assigned.id), (user) => {
            var _a2, _b;
            _push(`<div class="users-list">`);
            if (unref(project).users.length > 1) {
              _push(`<div class="dropdown-item">${ssrInterpolate((_b = (_a2 = _ctx.users) == null ? void 0 : _a2.find((u) => u.id === user)) == null ? void 0 : _b.username)}</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          });
          _push(`<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        if (unref(project).users.length == 1) {
          _push(`<div class="any-user">Any User..</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div></div><div class="project-content"><div class="tag">${ssrInterpolate(unref(project).name)}</div><div>${ssrInterpolate(new Date(unref(issue).created_at).toLocaleString("en-GB", { day: "numeric", month: "short" }))}</div></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Issue/ListView/IssueDetails.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  __name: "DnDIssue",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    issues: {},
    projects: {},
    state: {},
    users: {}
  }, {
    "modelValue": {},
    "modelModifiers": {},
    "pos": {},
    "posModifiers": {},
    "dropdownIdOpen": {},
    "dropdownIdOpenModifiers": {}
  }),
  emits: ["update:modelValue", "update:pos", "update:dropdownIdOpen"],
  setup(__props) {
    useModel(__props, "modelValue");
    useModel(__props, "pos");
    const IssueAssignedClicked = ref(false);
    const dropdownIdOpen = useModel(__props, "dropdownIdOpen");
    useWebSocket();
    reactive({
      type: "activity",
      content: ActivityContent.EDIT_STATUS,
      issue: 0,
      user: 0
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "dnd-issue-wrapper" }, _attrs))}><!--[-->`);
      ssrRenderList(_ctx.issues.filter((i) => i.status === _ctx.state).sort((a, b) => a.ticket_id - b.ticket_id), (issue) => {
        _push(`<div draggable="true" class="dnd-issue-list">`);
        _push(ssrRenderComponent(_sfc_main$d, {
          projects: _ctx.projects,
          issue,
          users: _ctx.users,
          modelValue: unref(IssueAssignedClicked),
          "onUpdate:modelValue": ($event) => isRef(IssueAssignedClicked) ? IssueAssignedClicked.value = $event : null,
          "dropdown-id-open": dropdownIdOpen.value,
          "onUpdate:dropdownIdOpen": ($event) => dropdownIdOpen.value = $event
        }, null, _parent));
        _push(`</div>`);
      });
      _push(`<!--]-->`);
      if (_ctx.issues.filter((i) => i.status === _ctx.state).length === 0) {
        _push(`<div class="issue-list"><p class="placeholder-issue-list">drop here...</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Issue/ListView/DnDIssue.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "IssueListDetails",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    issueArray: {},
    Projects: {},
    States: {},
    Users: {}
  }, {
    "modelValue": {},
    "modelModifiers": {},
    "pos": {},
    "posModifiers": {}
  }),
  emits: ["update:modelValue", "update:pos"],
  setup(__props) {
    const props = __props;
    const showModal = ref(false);
    const selectedState = ref("");
    const dropdownIdOpen = ref(null);
    const IssueID = useModel(__props, "modelValue");
    const IssuePos = useModel(__props, "pos");
    const filteredState = computed(() => filterUniqueState(props.States));
    const filterUniqueState = (states) => {
      const uniqueStates = /* @__PURE__ */ new Map();
      states.forEach((state) => {
        if (!uniqueStates.has(state.name) || state.updated_at > uniqueStates.get(state.name).updated_at) {
          uniqueStates.set(state.name, state);
        }
      });
      return Array.from(uniqueStates.values());
    };
    watch(() => showModal.value, (newVal) => {
      if (!newVal)
        selectedState.value = "";
    });
    watch(() => dropdownIdOpen.value, (newVal) => {
      if (newVal)
        IssueID.value = null;
    });
    watch(() => IssueID.value, (newVal) => {
      if (newVal)
        dropdownIdOpen.value = null;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_sfc_main$1$1, {
        projects: _ctx.Projects,
        modal: showModal.value,
        "onUpdate:modal": ($event) => showModal.value = $event,
        state: selectedState.value
      }, null, _parent));
      _push(`<!--[-->`);
      ssrRenderList(unref(filteredState), (state) => {
        _push(`<div class="wrapper-issue-list"><div class="issue-header"><div class="issue-state">${ssrInterpolate(("useCapitalize" in _ctx ? _ctx.useCapitalize : unref(useCapitalize))(state.name).toUpperCase())}</div>`);
        _push(ssrRenderComponent(unref(FontAwesomeIcon), {
          icon: "fa-solid fa-plus",
          onClick: ($event) => {
            showModal.value = true;
            selectedState.value = state.name;
          },
          class: "issue-add"
        }, null, _parent));
        _push(`</div>`);
        _push(ssrRenderComponent(_sfc_main$c, {
          projects: _ctx.Projects,
          issues: _ctx.issueArray,
          state: state.name,
          users: _ctx.Users,
          modelValue: IssueID.value,
          "onUpdate:modelValue": ($event) => IssueID.value = $event,
          pos: IssuePos.value,
          "onUpdate:pos": ($event) => IssuePos.value = $event,
          "dropdown-id-open": dropdownIdOpen.value,
          "onUpdate:dropdownIdOpen": ($event) => dropdownIdOpen.value = $event
        }, null, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--><!--]-->`);
    };
  }
});
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Issue/ListView/IssueListDetails.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "DeleteIssueModal",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    issueId: {}
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  async setup(__props) {
    let __temp, __restore;
    const props = __props;
    const showModal = useModel(__props, "modelValue");
    const { data: issue } = ([__temp, __restore] = withAsyncContext(() => useCustomFetch(`/issues/${props.issueId}/`)), __temp = await __temp, __restore(), __temp);
    const { data: project } = ([__temp, __restore] = withAsyncContext(() => {
      var _a;
      return useCustomFetch(`/projects/${(_a = issue.value) == null ? void 0 : _a.project}/`);
    }), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: [{ "is-active": showModal.value }, "modal del-issue"]
      }, _attrs))}><div class="modal-background"></div><div class="modal-content"><div class="box del-box"><h4>Are you sure you want to delete the issue ${ssrInterpolate((_a = unref(project)) == null ? void 0 : _a.name.substring(0, 3).toUpperCase())}-${ssrInterpolate((_b = unref(issue)) == null ? void 0 : _b.ticket_id)}?</h4><button class="button"> Cancel </button><button class="button is-dark"> Delete </button></div></div></div>`);
    };
  }
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Modals/issue/DeleteIssueModal.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "EditIssueModal",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    issueId: {}
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const props = __props;
    const showModal = useModel(__props, "modelValue");
    const SelectedPriority = ref("");
    const SelectedState = ref("");
    const count = ref(500);
    const projectStates = ref([]);
    const issueInfo = ref();
    useWebSocket();
    reactive({
      type: "activity",
      content: "",
      issue: 0,
      user: 0
    });
    watch(showModal, async () => {
      var _a;
      count.value = 500;
      const { data: issue } = await useCustomFetch(`/issues/${props.issueId}/`);
      const { data: projectState } = await useCustomFetch(`/project/${(_a = issue.value) == null ? void 0 : _a.project}/states`);
      if (!issue.value)
        return;
      data.title = issue.value.title;
      data.description = issue.value.description;
      data.priority = issue.value.priority;
      data.status = issue.value.status;
      issueInfo.value = issue.value;
      projectStates.value = projectState.value;
      count.value = count.value - data.description.length;
      SelectedPriority.value = data.priority.toLowerCase();
      SelectedState.value = data.status;
    });
    const data = reactive({
      title: "",
      description: "",
      priority: "",
      status: ""
    });
    watch(() => SelectedPriority.value, (newVal) => {
      if (newVal)
        data.priority = SelectedPriority.value;
    });
    watch(() => SelectedState.value, (newVal) => {
      if (newVal)
        data.status = SelectedState.value;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: [{ "is-active": showModal.value }, "modal edit-issue-modal"]
      }, _attrs))}><div class="modal-background"></div><div class="modal-content"><div class="box"><div class="field"><div class="control"><label for="title">Issue Title</label><input${ssrRenderAttr("value", data.title)} class="input" placeholder="Title..." type="text"><label for="textarea">Issue Content</label><textarea class="textarea has-fixed-size" maxLength="500" minLength="3" placeholder="Issue Description">${ssrInterpolate(data.description)}</textarea><div class="count">${ssrInterpolate(count.value != 0 ? count.value : 0)}/500</div><div class="select-group"><div class="select"><select><option disabled value=""${ssrIncludeBooleanAttr(Array.isArray(SelectedPriority.value) ? ssrLooseContain(SelectedPriority.value, "") : ssrLooseEqual(SelectedPriority.value, "")) ? " selected" : ""}>Priority</option><option value="urgent"${ssrIncludeBooleanAttr(Array.isArray(SelectedPriority.value) ? ssrLooseContain(SelectedPriority.value, "urgent") : ssrLooseEqual(SelectedPriority.value, "urgent")) ? " selected" : ""}>Urgent</option><option value="high"${ssrIncludeBooleanAttr(Array.isArray(SelectedPriority.value) ? ssrLooseContain(SelectedPriority.value, "high") : ssrLooseEqual(SelectedPriority.value, "high")) ? " selected" : ""}>High</option><option value="neutral"${ssrIncludeBooleanAttr(Array.isArray(SelectedPriority.value) ? ssrLooseContain(SelectedPriority.value, "neutral") : ssrLooseEqual(SelectedPriority.value, "neutral")) ? " selected" : ""}>Neutral</option><option value="low"${ssrIncludeBooleanAttr(Array.isArray(SelectedPriority.value) ? ssrLooseContain(SelectedPriority.value, "low") : ssrLooseEqual(SelectedPriority.value, "low")) ? " selected" : ""}>Low</option><option value="minor"${ssrIncludeBooleanAttr(Array.isArray(SelectedPriority.value) ? ssrLooseContain(SelectedPriority.value, "minor") : ssrLooseEqual(SelectedPriority.value, "minor")) ? " selected" : ""}>Minor</option></select></div><div class="select"><select><option disabled value=""${ssrIncludeBooleanAttr(Array.isArray(SelectedState.value) ? ssrLooseContain(SelectedState.value, "") : ssrLooseEqual(SelectedState.value, "")) ? " selected" : ""}>State</option><!--[-->`);
      ssrRenderList(projectStates.value, (state) => {
        _push(`<option${ssrRenderAttr("value", state.name)}>${ssrInterpolate(("useCapitalize" in _ctx ? _ctx.useCapitalize : unref(useCapitalize))(state.name))}</option>`);
      });
      _push(`<!--]--></select></div></div></div></div><button class="button"> Cancel </button><button class="button is-dark"> Submit </button></div></div></div>`);
    };
  }
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Modals/issue/EditIssueModal.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "IssueMenu",
  __ssrInlineRender: true,
  props: {
    id: {},
    pos: {}
  },
  setup(__props) {
    const showModal = ref(false);
    const showEditModal = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_sfc_main$a, {
        issueId: _ctx.id,
        modelValue: unref(showModal),
        "onUpdate:modelValue": ($event) => isRef(showModal) ? showModal.value = $event : null
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$9, {
        issueId: _ctx.id,
        modelValue: unref(showEditModal),
        "onUpdate:modelValue": ($event) => isRef(showEditModal) ? showEditModal.value = $event : null
      }, null, _parent));
      _push(`<div class="menu"><div class="menu-content" style="${ssrRenderStyle({ "left": _ctx.pos.x - 70 + "px", "bottom": `calc(-${_ctx.pos.y}px + 90px)` })}"><div class="menu-item">`);
      _push(ssrRenderComponent(unref(FontAwesomeIcon), { icon: "fa-regular fa-pencil" }, null, _parent));
      _push(`</div><div class="menu-item">`);
      _push(ssrRenderComponent(unref(FontAwesomeIcon), { icon: "fa-regular fa-trash-can" }, null, _parent));
      _push(`</div><div class="menu-item">`);
      _push(ssrRenderComponent(unref(FontAwesomeIcon), { icon: "fa-solid fa-eyes" }, null, _parent));
      _push(`</div></div></div><!--]-->`);
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Menu/IssueMenu.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "IssueList",
  __ssrInlineRender: true,
  props: {
    issueArray: {},
    createdIssue: {},
    assignedIssue: {},
    Projects: {},
    typeView: {},
    users: {}
  },
  async setup(__props) {
    let __temp, __restore;
    const issueId = ref(null);
    const MenuPos = ref({ x: 0, y: 0 });
    const { data: allStates, refresh } = ([__temp, __restore] = withAsyncContext(() => useCustomFetch("/states/")), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      if (unref(issueId)) {
        _push(ssrRenderComponent(_sfc_main$8, {
          id: unref(issueId),
          pos: unref(MenuPos)
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (_ctx.typeView === "all" && unref(allStates)) {
        _push(ssrRenderComponent(_sfc_main$b, {
          issueArray: _ctx.issueArray,
          Projects: _ctx.Projects,
          States: unref(allStates),
          modelValue: unref(issueId),
          "onUpdate:modelValue": ($event) => isRef(issueId) ? issueId.value = $event : null,
          pos: unref(MenuPos),
          "onUpdate:pos": ($event) => isRef(MenuPos) ? MenuPos.value = $event : null,
          Users: _ctx.users
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (_ctx.typeView === "created" && unref(allStates)) {
        _push(ssrRenderComponent(_sfc_main$b, {
          issueArray: _ctx.createdIssue,
          Projects: _ctx.Projects,
          States: unref(allStates),
          modelValue: unref(issueId),
          "onUpdate:modelValue": ($event) => isRef(issueId) ? issueId.value = $event : null,
          pos: unref(MenuPos),
          "onUpdate:pos": ($event) => isRef(MenuPos) ? MenuPos.value = $event : null,
          Users: _ctx.users
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (_ctx.typeView === "assigned" && unref(allStates)) {
        _push(ssrRenderComponent(_sfc_main$b, {
          issueArray: _ctx.assignedIssue,
          Projects: _ctx.Projects,
          States: unref(allStates),
          modelValue: unref(issueId),
          "onUpdate:modelValue": ($event) => isRef(issueId) ? issueId.value = $event : null,
          pos: unref(MenuPos),
          "onUpdate:pos": ($event) => isRef(MenuPos) ? MenuPos.value = $event : null,
          Users: _ctx.users
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Issue/ListView/IssueList.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "issueKanbanDetails",
  __ssrInlineRender: true,
  props: {
    issueArray: {},
    Projects: {},
    States: {}
  },
  setup(__props) {
    const props = __props;
    const draggedItem = ref(0);
    const showModal = ref(false);
    const selectedState = ref("");
    const filteredState = computed(() => filterUniqueState(props.States));
    const filterUniqueState = (states) => {
      const uniqueStates = /* @__PURE__ */ new Map();
      states.forEach((state) => {
        if (!uniqueStates.has(state.name) || state.updated_at > uniqueStates.get(state.name).updated_at) {
          uniqueStates.set(state.name, state);
        }
      });
      return Array.from(uniqueStates.values());
    };
    watch(() => showModal.value, (newVal) => {
      if (!newVal)
        selectedState.value = "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ id: "kanban" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$1$1, {
        projects: _ctx.Projects,
        modal: showModal.value,
        "onUpdate:modal": ($event) => showModal.value = $event,
        state: selectedState.value
      }, null, _parent));
      _push(`<!--[-->`);
      ssrRenderList(unref(filteredState), (state) => {
        _push(`<div class="state-list"><div class="header"><div class="state-name">${ssrInterpolate(("useCapitalize" in _ctx ? _ctx.useCapitalize : unref(useCapitalize))(state.name))}</div><div class="action-icon"><div class="button is-small"><span class="icon">`);
        _push(ssrRenderComponent(unref(FontAwesomeIcon), { icon: "fa-solid fa-ellipsis" }, null, _parent));
        _push(`</span></div><div class="button is-small"><span class="icon">`);
        _push(ssrRenderComponent(unref(FontAwesomeIcon), { icon: "fa-solid fa-plus" }, null, _parent));
        _push(`</span></div></div></div><!--[-->`);
        ssrRenderList(_ctx.Projects, (project) => {
          _push(`<div class="issue-list"><!--[-->`);
          ssrRenderList(_ctx.issueArray.filter((i) => i.project === project.id).filter((i) => i.status === state.name).sort((a, b) => a.ticket_id - b.ticket_id), (issue) => {
            var _a;
            _push(`<div draggable="true" class="${ssrRenderClass([{ "dragging": draggedItem.value === issue.id }, "issue-card"])}"><div class="issue"><div class="issue-title">${ssrInterpolate(issue.title)}</div><div class="issue-desc"><span>${(_a = issue.description) != null ? _a : ""}</span></div><div class="issue-footer"><span>${ssrInterpolate(issue.project_tag)}-${ssrInterpolate(issue.ticket_id)}</span><div class="icon">`);
            _push(ssrRenderComponent(_sfc_main$e, {
              priority: issue.priority
            }, null, _parent));
            _push(`</div></div></div></div>`);
          });
          _push(`<!--]--></div>`);
        });
        _push(`<!--]--></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Issue/KanbanView/issueKanbanDetails.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "IssueKanban",
  __ssrInlineRender: true,
  props: {
    issueArray: {},
    createdIssue: {},
    assignedIssue: {},
    Projects: {},
    typeView: {}
  },
  async setup(__props) {
    let __temp, __restore;
    const { data: allStates, refresh } = ([__temp, __restore] = withAsyncContext(() => useCustomFetch("/states/")), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      if (_ctx.typeView === "all" && unref(allStates)) {
        _push(ssrRenderComponent(_sfc_main$6, {
          issueArray: _ctx.issueArray,
          Projects: _ctx.Projects,
          States: unref(allStates)
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (_ctx.typeView === "created" && unref(allStates)) {
        _push(ssrRenderComponent(_sfc_main$6, {
          issueArray: _ctx.createdIssue,
          Projects: _ctx.Projects,
          States: unref(allStates)
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (_ctx.typeView === "assigned" && unref(allStates)) {
        _push(ssrRenderComponent(_sfc_main$6, {
          issueArray: _ctx.assignedIssue,
          Projects: _ctx.Projects,
          States: unref(allStates)
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Issue/KanbanView/IssueKanban.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "IssueCardList",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    Projects: {},
    issueArray: {}
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const IssueInfo = useModel(__props, "modelValue");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "issue-list" }, _attrs))}><!--[-->`);
      ssrRenderList(_ctx.issueArray.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()), (issue) => {
        var _a2;
        var _a;
        _push(`<div class="issue-card"><div class="${ssrRenderClass([{ "is-active": issue.id === ((_a = IssueInfo.value) == null ? void 0 : _a.issue.id) }, "issue"])}"><div class="issue-title">${ssrInterpolate(issue.title)}</div><div class="issue-desc"><span>${(_a2 = issue.description) != null ? _a2 : ""}</span></div><div class="issue-footer"><span>${ssrInterpolate(issue.project_tag)}-${ssrInterpolate(issue.ticket_id)}</span><div class="icon">`);
        _push(ssrRenderComponent(_sfc_main$e, {
          priority: issue.priority
        }, null, _parent));
        _push(`</div></div></div></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Issue/DetailView/IssueCardList.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
function useDayjs() {
  return dayjs;
}
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "CommentCard",
  __ssrInlineRender: true,
  props: {
    comment: {}
  },
  setup(__props) {
    const dayjs2 = useDayjs();
    const user = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "comment" }, _attrs))}><div class="info">`);
      if (unref(user)) {
        _push(`<div class="user-info">`);
        if (unref(user).thumbnail) {
          _push(`<img${ssrRenderAttr("src", unref(user).thumbnail)} alt="user thumbnail" class="thumbnail">`);
        } else {
          _push(`<img${ssrRenderAttr("src", _imports_0)} alt="user thumbnail" class="thumbnail">`);
        }
        _push(`<span>${ssrInterpolate(unref(user).username)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span>-</span><span>${ssrInterpolate(unref(dayjs2)().to(unref(dayjs2)(_ctx.comment.updated_at)))}</span></div><div class="content">${ssrInterpolate(_ctx.comment.content)}</div></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Issue/Activity/CommentCard.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ActivityItem",
  __ssrInlineRender: true,
  props: {
    activity: {}
  },
  setup(__props) {
    const dayjs2 = useDayjs();
    const user = ref();
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(user)) {
        _push(`<div${ssrRenderAttrs(_attrs)}>${ssrInterpolate(unref(user).username)} - ${ssrInterpolate(("useCapitalize" in _ctx ? _ctx.useCapitalize : unref(useCapitalize))(_ctx.activity.content))} - ${ssrInterpolate(unref(dayjs2)().to(unref(dayjs2)(_ctx.activity.updated_at)))}</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Issue/Activity/ActivityItem.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "IssueDetail",
  __ssrInlineRender: true,
  props: {
    issueArray: {},
    createdIssue: {},
    assignedIssue: {},
    Projects: {},
    typeView: {},
    users: {}
  },
  setup(__props) {
    useWebSocket();
    reactive({
      type: "activity",
      content: ActivityContent.EDIT_STATUS,
      issue: 0,
      user: 0
    });
    const props = __props;
    const selectedProject = ref(0);
    const selectedState = ref("");
    const selectedView = ref("all");
    const projectStates = ref([]);
    const showModal = ref(false);
    const showUpdateModal = ref(false);
    const editedIssueID = ref(0);
    const issueInfo = ref(null);
    const isFiltered = ref(false);
    const filteredIssueArray = ref([]);
    const issueProjectStates = ref([]);
    const searchedTitle = ref("");
    const activitiesList = ref([]);
    useUserStore().getUser();
    const data = reactive({
      status: issueInfo.value !== null ? issueInfo.value.issue.status : ""
    });
    const commentData = reactive({
      content: "",
      is_answer: false,
      is_thread: false,
      is_resolved: false,
      attachment: null
    });
    watch(() => props.issueArray, () => {
      if (!issueInfo.value)
        return;
      if (props.issueArray.length > 0 && props.Projects.length > 0) {
        const project = props.Projects.find((p) => {
          var _a;
          return p.id === ((_a = issueInfo.value) == null ? void 0 : _a.project.id);
        });
        const issue = props.issueArray.find((i) => {
          var _a;
          return i.id === ((_a = issueInfo.value) == null ? void 0 : _a.issue.id);
        });
        if (project && issue) {
          issueInfo.value = { issue, project };
        }
      }
    });
    watch(() => {
      var _a;
      return (_a = issueInfo.value) == null ? void 0 : _a.issue.status;
    }, (newVal) => {
      if (newVal) {
        data.status = newVal;
      }
    });
    watch(() => selectedProject.value, async (newVal) => {
      if (newVal !== 0) {
        let projectID = newVal;
        const { data: projectSate } = await useCustomFetch(`/project/${newVal}/states`);
        projectStates.value = projectSate.value;
        handleFilter(void 0, projectID);
      }
    });
    watch(() => searchedTitle.value, (newVal) => {
      const title = newVal;
      handleFilter(title);
    });
    watch(() => selectedState.value, (newVal) => {
      if (newVal) {
        let state = newVal;
        handleFilter(void 0, void 0, state);
      }
    });
    watch(() => {
      var _a;
      return (_a = issueInfo.value) == null ? void 0 : _a.project.id;
    }, async (newVal) => {
      if (newVal !== 0) {
        const { data: projectSate } = await useCustomFetch(`/project/${newVal}/states`);
        issueProjectStates.value = projectSate.value;
      }
    });
    watch(() => {
      var _a;
      return (_a = issueInfo.value) == null ? void 0 : _a.issue.id;
    }, async (newVal) => {
      if (newVal)
        await updateMergedList();
    });
    watch(() => showUpdateModal.value, async (newVal) => {
      if (!newVal)
        await updateMergedList();
    });
    const handleFilter = (title, project, state) => {
      isFiltered.value = !(!title && !project && !state);
      if (selectedView.value == "all") {
        if (project) {
          if (selectedState.value !== "") {
            filteredIssueArray.value = props.issueArray.filter((i) => i.project === project && i.status === selectedState.value);
          } else {
            filteredIssueArray.value = props.issueArray.filter((i) => i.project === project);
          }
        }
        if (title) {
          if (selectedState.value !== "") {
            filteredIssueArray.value = props.issueArray.filter((i) => i.title.includes(title) && i.status === selectedState.value);
          }
          if (selectedProject.value !== 0) {
            filteredIssueArray.value = props.issueArray.filter((i) => i.title.includes(title) && i.project === selectedProject.value);
          }
          if (selectedState.value !== "" && selectedProject.value !== 0) {
            filteredIssueArray.value = props.issueArray.filter((i) => i.title.includes(title) && i.status === selectedState.value && i.project === selectedProject.value);
          } else {
            filteredIssueArray.value = props.issueArray.filter((i) => i.title.includes(title));
          }
        }
        if (state) {
          if (selectedProject.value !== 0) {
            filteredIssueArray.value = props.issueArray.filter((i) => i.project === selectedProject.value && i.status === state);
          } else {
            filteredIssueArray.value = props.issueArray.filter((i) => i.status === state);
          }
        }
      } else if (selectedView.value === "creator") {
        if (project) {
          filteredIssueArray.value = props.createdIssue.filter((i) => i.project === project);
        }
        if (title) {
          filteredIssueArray.value = props.createdIssue.filter((i) => i.title.includes(title));
        }
        if (state) {
          filteredIssueArray.value = props.createdIssue.filter((i) => i.status === state);
        }
      } else if (selectedView.value === "assigned") {
        if (project) {
          filteredIssueArray.value = props.assignedIssue.filter((i) => i.project === project);
        }
        if (title) {
          filteredIssueArray.value = props.assignedIssue.filter((i) => i.title.includes(title));
        }
        if (state) {
          filteredIssueArray.value = props.assignedIssue.filter((i) => i.status === state);
        }
      }
    };
    const mergeCommentsAndActivities = (comments, activities) => {
      console.log(comments);
      const commentItems = comments.map((comment) => ({
        ...comment,
        itemType: "comment"
      }));
      const activityItems = activities.map((activity) => ({
        ...activity,
        itemType: "activity"
      }));
      const merged = [...commentItems, ...activityItems];
      return merged.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB.getTime() - dateA.getTime();
      });
    };
    const updateMergedList = async () => {
      console.log(issueInfo.value, "issueInfo");
      if (!issueInfo.value)
        return;
      console.log("merged");
      const { data: commentIssue } = await useCustomFetch(`/issues/${issueInfo.value.issue.id}/comments/`);
      const { data: activityIssue } = await useCustomFetch(`/issues/${issueInfo.value.issue.id}/activities`);
      activitiesList.value = mergeCommentsAndActivities(commentIssue.value, activityIssue.value);
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_font_awesome_icon = resolveComponent("font-awesome-icon");
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ id: "details" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$1$1, {
        projects: _ctx.Projects,
        modal: unref(showModal),
        "onUpdate:modal": ($event) => isRef(showModal) ? showModal.value = $event : null
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$9, {
        issueId: unref(editedIssueID),
        modelValue: unref(showUpdateModal),
        "onUpdate:modelValue": ($event) => isRef(showUpdateModal) ? showUpdateModal.value = $event : null
      }, null, _parent));
      _push(`<header><div class="left-side"><div><input class="input"${ssrRenderAttr("value", unref(searchedTitle))} type="text" placeholder="Search tickets"></div><div class="select"><select><option disabled value="0"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedProject)) ? ssrLooseContain(unref(selectedProject), "0") : ssrLooseEqual(unref(selectedProject), "0")) ? " selected" : ""}>Project</option><!--[-->`);
      ssrRenderList(_ctx.Projects, (project) => {
        _push(`<option${ssrRenderAttr("value", project.id)}>${ssrInterpolate(project.name)}</option>`);
      });
      _push(`<!--]--></select></div><div class="select"><select><option disabled value=""${ssrIncludeBooleanAttr(Array.isArray(unref(selectedState)) ? ssrLooseContain(unref(selectedState), "") : ssrLooseEqual(unref(selectedState), "")) ? " selected" : ""}>State</option>`);
      if (unref(selectedProject) === 0) {
        _push(`<option value="backlog">Backlog</option>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(selectedProject) === 0) {
        _push(`<option value="open">Open</option>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(selectedProject) === 0) {
        _push(`<option value="in_progress">In Progress</option>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(selectedProject) === 0) {
        _push(`<option value="completed">Completed</option>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(selectedProject) === 0) {
        _push(`<option value="canceled">Canceled</option>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(selectedProject) !== 0 && unref(projectStates).length > 0) {
        _push(`<!--[-->`);
        ssrRenderList(unref(projectStates), (state) => {
          _push(`<option${ssrRenderAttr("value", state.name)}>${ssrInterpolate(("useCapitalize" in _ctx ? _ctx.useCapitalize : unref(useCapitalize))(state.name))}</option>`);
        });
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</select></div><div class="select"><select><option value="all"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedView)) ? ssrLooseContain(unref(selectedView), "all") : ssrLooseEqual(unref(selectedView), "all")) ? " selected" : ""}>All</option><option value="created"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedView)) ? ssrLooseContain(unref(selectedView), "created") : ssrLooseEqual(unref(selectedView), "created")) ? " selected" : ""}>Created</option><option value="assigned"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedView)) ? ssrLooseContain(unref(selectedView), "assigned") : ssrLooseEqual(unref(selectedView), "assigned")) ? " selected" : ""}>Assigned</option></select></div></div><div class="right-side"><button class="button"><span>Create</span><span class="icon">`);
      _push(ssrRenderComponent(_component_font_awesome_icon, { icon: "fa-solid fa-plus" }, null, _parent));
      _push(`</span></button></div></header><div class="hero-issue">`);
      if (unref(selectedView) === "all" && !unref(isFiltered)) {
        _push(ssrRenderComponent(_sfc_main$4, {
          Projects: _ctx.Projects,
          issueArray: _ctx.issueArray,
          modelValue: unref(issueInfo),
          "onUpdate:modelValue": ($event) => isRef(issueInfo) ? issueInfo.value = $event : null
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(selectedView) === "created" && !unref(isFiltered)) {
        _push(ssrRenderComponent(_sfc_main$4, {
          Projects: _ctx.Projects,
          issueArray: _ctx.createdIssue,
          modelValue: unref(issueInfo),
          "onUpdate:modelValue": ($event) => isRef(issueInfo) ? issueInfo.value = $event : null
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(selectedView) === "assigned" && !unref(isFiltered)) {
        _push(ssrRenderComponent(_sfc_main$4, {
          Projects: _ctx.Projects,
          issueArray: _ctx.assignedIssue,
          modelValue: unref(issueInfo),
          "onUpdate:modelValue": ($event) => isRef(issueInfo) ? issueInfo.value = $event : null
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(isFiltered)) {
        _push(ssrRenderComponent(_sfc_main$4, {
          Projects: _ctx.Projects,
          issueArray: unref(filteredIssueArray),
          modelValue: unref(issueInfo),
          "onUpdate:modelValue": ($event) => isRef(issueInfo) ? issueInfo.value = $event : null
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(issueInfo) !== null) {
        _push(`<div class="issue-info"><div class="issue-details"><div class="breadcrumb is-small"><ul><li>`);
        _push(ssrRenderComponent(_component_NuxtLink, { to: "/project" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(issueInfo).project.name)}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(issueInfo).project.name), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li><li>${ssrInterpolate(unref(issueInfo).project.name.substring(0, 3).toUpperCase())}-${ssrInterpolate(unref(issueInfo).issue.ticket_id)}</li></ul></div><div class="content"><h2>${ssrInterpolate(unref(issueInfo).issue.title)}</h2>`);
        if (unref(issueInfo).issue.description) {
          _push(`<div>${(_a = unref(issueInfo).issue.description) != null ? _a : ""}</div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(issueInfo).issue.description === "<p></p>\n") {
          _push(`<div>Any Description</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<hr><div class="activity"><div class="header"><div>Activity</div></div><!--[-->`);
        ssrRenderList(unref(activitiesList), (item) => {
          _push(`<div class="activity-list">`);
          if (item.itemType === "comment") {
            _push(ssrRenderComponent(_sfc_main$3, { comment: item }, null, _parent));
          } else {
            _push(ssrRenderComponent(_sfc_main$2, { activity: item }, null, _parent));
          }
          _push(`</div>`);
        });
        _push(`<!--]--><div class="comment-input"><input type="text" placeholder="Leave your comment..." class="input"${ssrRenderAttr("value", commentData.content)}></div></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(issueInfo) !== null) {
        _push(`<div class="issue-details-info"><select><option disabled value=""${ssrIncludeBooleanAttr(Array.isArray(data.status) ? ssrLooseContain(data.status, "") : ssrLooseEqual(data.status, "")) ? " selected" : ""}>State</option>`);
        if (unref(issueInfo).project.id === 0) {
          _push(`<option value="backlog">Backlog</option>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(issueInfo).project.id === 0) {
          _push(`<option value="open">Open</option>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(issueInfo).project.id === 0) {
          _push(`<option value="in_progress">In Progress</option>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(issueInfo).project.id === 0) {
          _push(`<option value="completed">Completed</option>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(issueInfo).project.id === 0) {
          _push(`<option value="canceled">Canceled</option>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(issueInfo).project.id !== 0 && unref(issueProjectStates).length > 0) {
          _push(`<!--[-->`);
          ssrRenderList(unref(issueProjectStates), (state) => {
            _push(`<option${ssrRenderAttr("value", state.name)}>${ssrInterpolate(("useCapitalize" in _ctx ? _ctx.useCapitalize : unref(useCapitalize))(state.name))}</option>`);
          });
          _push(`<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</select><button class="button">Edit</button><div class="details-info"><div class="details-title">Details</div><div class="infos"><div class="info"><div class="important-info"><div class="assigned">Assigned: ${ssrInterpolate(unref(issueInfo).issue.assigned.username)}</div><div class="creator">Creator: ${ssrInterpolate(unref(issueInfo).issue.creator.username)}</div><div class="issue-tags">Tags: Any</div><div class="priority">Priority: `);
        _push(ssrRenderComponent(_sfc_main$e, {
          priority: unref(issueInfo).issue.priority
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(issueInfo).issue.priority)}</div></div><div class="date-info"><div>Created : ${ssrInterpolate(new Date(unref(issueInfo).issue.created_at).toLocaleString("en-GB", { day: "numeric", month: "short" }))}</div><div>Updated : ${ssrInterpolate(new Date(unref(issueInfo).issue.updated_at).toLocaleString("en-GB", { day: "numeric", month: "short" }))}</div></div></div><div class="time"></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Issue/DetailView/IssueDetail.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "myIssue",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useHead({ title: "Home - Tempest Board" });
    const viewMode = ref("list");
    const typeView = ref("all");
    const Title = ref("List");
    const issueArray = ref([]);
    const AssignedIssues = ref([]);
    const CreateIssues = ref([]);
    const user = useUserStore().getUser();
    const users = ref([]);
    const projects = ref([]);
    const { isRefresh } = useRefreshData();
    const { data, refresh } = ([__temp, __restore] = withAsyncContext(() => useCustomFetch("/projects/", { immediate: false })), __temp = await __temp, __restore(), __temp);
    const { data: issueData, refresh: issueRefresh } = ([__temp, __restore] = withAsyncContext(() => useCustomFetch(`/my-issues/`, { immediate: false })), __temp = await __temp, __restore(), __temp);
    [__temp, __restore] = withAsyncContext(() => useCustomFetch(`/users/`)), __temp = await __temp, __restore();
    watch(() => isRefresh.value, async (newVal) => {
      if (newVal) {
        await issueRefresh();
        issueArray.value = issueData.value;
        AssignedIssues.value = issueArray.value.filter((issue) => issue.assigned.id === (user == null ? void 0 : user.id));
        CreateIssues.value = issueArray.value.filter((issue) => issue.creator.id === (user == null ? void 0 : user.id));
        await refresh();
        projects.value = data.value;
        isRefresh.value = false;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Navbar = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ id: "my_issue" }, _attrs))}>`);
      if (unref(user)) {
        _push(ssrRenderComponent(_component_Navbar, {
          user: unref(user),
          projects: projects.value
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="content"><div class="header"><nav class="breadcrumb is-medium" aria-label="breadcrumbs"><ul><li><div>My Issue</div></li><li class="is-active"><div aria-current="page">${ssrInterpolate(Title.value)}</div></li></ul></nav><div class="tabs is-small"><ul><li class="${ssrRenderClass({ "is-active": viewMode.value === "list" })}"><a>`);
      _push(ssrRenderComponent(unref(FontAwesomeIcon), { icon: "fa-solid fa-bars" }, null, _parent));
      _push(`</a></li><li class="${ssrRenderClass({ "is-active": viewMode.value === "kanban" })}"><a>`);
      _push(ssrRenderComponent(unref(FontAwesomeIcon), { icon: "fa-solid fa-grip-vertical" }, null, _parent));
      _push(`</a></li><li class="${ssrRenderClass({ "is-active": viewMode.value === "details" })}"><a><svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><circle cx="2.5" cy="4.5" r="1.5"></circle><circle cx="2.5" cy="8.5" r="1.5"></circle><circle cx="2.5" cy="12.5" r="1.5"></circle><rect x="6" y="3" width="11" height="11" rx="1"></rect></svg></a></li></ul></div></div>`);
      if (viewMode.value !== "details") {
        _push(`<div class="typeview-tabs"><div class="tabs"><ul><li class="${ssrRenderClass({ "is-active": typeView.value === "all" })}"><a>All</a></li><li class="${ssrRenderClass({ "is-active": typeView.value === "created" })}"><a>Created</a></li><li class="${ssrRenderClass({ "is-active": typeView.value === "assigned" })}"><a>Assigned</a></li></ul></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="issues"><div>`);
      if (viewMode.value === "list" && users.value) {
        _push(ssrRenderComponent(_sfc_main$7, {
          issueArray: issueArray.value,
          Projects: projects.value,
          assignedIssue: AssignedIssues.value,
          createdIssue: CreateIssues.value,
          typeView: typeView.value,
          users: users.value
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (viewMode.value === "kanban") {
        _push(ssrRenderComponent(_sfc_main$5, {
          issueArray: issueArray.value,
          Projects: projects.value,
          assignedIssue: AssignedIssues.value,
          createdIssue: CreateIssues.value,
          typeView: typeView.value
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (viewMode.value === "details" && users.value) {
        _push(ssrRenderComponent(_sfc_main$1, {
          issueArray: issueArray.value,
          Projects: projects.value,
          assignedIssue: AssignedIssues.value,
          createdIssue: CreateIssues.value,
          typeView: typeView.value,
          users: users.value
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/myIssue.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=myIssue-B5iMwINp.mjs.map
