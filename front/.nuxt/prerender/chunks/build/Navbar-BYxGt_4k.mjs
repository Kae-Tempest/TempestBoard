import { _ as __nuxt_component_0 } from './nuxt-link-CH3S4xEW.mjs';
import { ref, useSSRContext, computed, toValue, reactive, defineComponent, mergeProps, unref, withCtx, createTextVNode, mergeModels, useModel, watch, createVNode, shallowRef, toRef, getCurrentInstance, onServerPrefetch } from 'file:///home/kae/Desktop/TempestBoard/front/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList } from 'file:///home/kae/Desktop/TempestBoard/front/node_modules/vue/server-renderer/index.mjs';
import { d as defineStore, u as useNuxtApp, f as fetchDefaults, F as FontAwesomeIcon, a as asyncDataDefaults, b as useRequestFetch, c as createError } from './server.mjs';
import { hash } from 'file:///home/kae/Desktop/TempestBoard/front/node_modules/ohash/dist/index.mjs';

const isDefer = (dedupe) => dedupe === "defer" || dedupe === false;
function useAsyncData(...args) {
  var _a2, _b2, _c, _d, _e, _f, _g, _h;
  var _a, _b;
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  let [key, _handler, options = {}] = args;
  if (typeof key !== "string") {
    throw new TypeError("[nuxt] [asyncData] key must be a string.");
  }
  if (typeof _handler !== "function") {
    throw new TypeError("[nuxt] [asyncData] handler must be a function.");
  }
  const nuxtApp = useNuxtApp();
  const handler = !((_a = nuxtApp.ssrContext) == null ? void 0 : _a._sharedPrerenderCache) ? _handler : () => {
    const value = nuxtApp.ssrContext._sharedPrerenderCache.get(key);
    if (value) {
      return value;
    }
    const promise = Promise.resolve().then(() => nuxtApp.runWithContext(_handler));
    nuxtApp.ssrContext._sharedPrerenderCache.set(key, promise);
    return promise;
  };
  const getDefault = () => asyncDataDefaults.value;
  const getDefaultCachedData = () => nuxtApp.isHydrating ? nuxtApp.payload.data[key] : nuxtApp.static.data[key];
  options.server = (_a2 = options.server) != null ? _a2 : true;
  options.default = (_b2 = options.default) != null ? _b2 : getDefault;
  options.getCachedData = (_c = options.getCachedData) != null ? _c : getDefaultCachedData;
  options.lazy = (_d = options.lazy) != null ? _d : false;
  options.immediate = (_e = options.immediate) != null ? _e : true;
  options.deep = (_f = options.deep) != null ? _f : asyncDataDefaults.deep;
  options.dedupe = (_g = options.dedupe) != null ? _g : "cancel";
  const initialCachedData = options.getCachedData(key, nuxtApp);
  const hasCachedData = initialCachedData != null;
  if (!nuxtApp._asyncData[key] || !options.immediate) {
    (_h = (_b = nuxtApp.payload._errors)[key]) != null ? _h : _b[key] = asyncDataDefaults.errorValue;
    const _ref = options.deep ? ref : shallowRef;
    nuxtApp._asyncData[key] = {
      data: _ref(hasCachedData ? initialCachedData : options.default()),
      pending: ref(!hasCachedData),
      error: toRef(nuxtApp.payload._errors, key),
      status: ref("idle"),
      _default: options.default
    };
  }
  const asyncData = { ...nuxtApp._asyncData[key] };
  delete asyncData._default;
  asyncData.refresh = asyncData.execute = (opts = {}) => {
    var _a3;
    if (nuxtApp._asyncDataPromises[key]) {
      if (isDefer((_a3 = opts.dedupe) != null ? _a3 : options.dedupe)) {
        return nuxtApp._asyncDataPromises[key];
      }
      nuxtApp._asyncDataPromises[key].cancelled = true;
    }
    if (opts._initial || nuxtApp.isHydrating && opts._initial !== false) {
      const cachedData = opts._initial ? initialCachedData : options.getCachedData(key, nuxtApp);
      if (cachedData != null) {
        return Promise.resolve(cachedData);
      }
    }
    asyncData.pending.value = true;
    asyncData.status.value = "pending";
    const promise = new Promise(
      (resolve, reject) => {
        try {
          resolve(handler(nuxtApp));
        } catch (err) {
          reject(err);
        }
      }
    ).then(async (_result) => {
      if (promise.cancelled) {
        return nuxtApp._asyncDataPromises[key];
      }
      let result = _result;
      if (options.transform) {
        result = await options.transform(_result);
      }
      if (options.pick) {
        result = pick(result, options.pick);
      }
      nuxtApp.payload.data[key] = result;
      asyncData.data.value = result;
      asyncData.error.value = asyncDataDefaults.errorValue;
      asyncData.status.value = "success";
    }).catch((error) => {
      if (promise.cancelled) {
        return nuxtApp._asyncDataPromises[key];
      }
      asyncData.error.value = createError(error);
      asyncData.data.value = unref(options.default());
      asyncData.status.value = "error";
    }).finally(() => {
      if (promise.cancelled) {
        return;
      }
      asyncData.pending.value = false;
      delete nuxtApp._asyncDataPromises[key];
    });
    nuxtApp._asyncDataPromises[key] = promise;
    return nuxtApp._asyncDataPromises[key];
  };
  asyncData.clear = () => clearNuxtDataByKey(nuxtApp, key);
  const initialFetch = () => asyncData.refresh({ _initial: true });
  const fetchOnServer = options.server !== false && nuxtApp.payload.serverRendered;
  if (fetchOnServer && options.immediate) {
    const promise = initialFetch();
    if (getCurrentInstance()) {
      onServerPrefetch(() => promise);
    } else {
      nuxtApp.hook("app:created", async () => {
        await promise;
      });
    }
  }
  const asyncDataPromise = Promise.resolve(nuxtApp._asyncDataPromises[key]).then(() => asyncData);
  Object.assign(asyncDataPromise, asyncData);
  return asyncDataPromise;
}
function clearNuxtDataByKey(nuxtApp, key) {
  if (key in nuxtApp.payload.data) {
    nuxtApp.payload.data[key] = void 0;
  }
  if (key in nuxtApp.payload._errors) {
    nuxtApp.payload._errors[key] = asyncDataDefaults.errorValue;
  }
  if (nuxtApp._asyncData[key]) {
    nuxtApp._asyncData[key].data.value = void 0;
    nuxtApp._asyncData[key].error.value = asyncDataDefaults.errorValue;
    nuxtApp._asyncData[key].pending.value = false;
    nuxtApp._asyncData[key].status.value = "idle";
  }
  if (key in nuxtApp._asyncDataPromises) {
    if (nuxtApp._asyncDataPromises[key]) {
      nuxtApp._asyncDataPromises[key].cancelled = true;
    }
    nuxtApp._asyncDataPromises[key] = void 0;
  }
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
function useFetch(request, arg1, arg2) {
  const [opts = {}, autoKey] = typeof arg1 === "string" ? [{}, arg1] : [arg1, arg2];
  const _request = computed(() => toValue(request));
  const _key = opts.key || hash([autoKey, typeof _request.value === "string" ? _request.value : "", ...generateOptionSegments(opts)]);
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useFetch] key must be a string: " + _key);
  }
  if (!request) {
    throw new Error("[nuxt] [useFetch] request is missing.");
  }
  const key = _key === autoKey ? "$f" + _key : _key;
  if (!opts.baseURL && typeof _request.value === "string" && (_request.value[0] === "/" && _request.value[1] === "/")) {
    throw new Error('[nuxt] [useFetch] the request URL must not start with "//".');
  }
  const {
    server,
    lazy,
    default: defaultFn,
    transform,
    pick: pick2,
    watch: watch2,
    immediate,
    getCachedData,
    deep,
    dedupe,
    ...fetchOptions
  } = opts;
  const _fetchOptions = reactive({
    ...fetchDefaults,
    ...fetchOptions,
    cache: typeof opts.cache === "boolean" ? void 0 : opts.cache
  });
  const _asyncDataOptions = {
    server,
    lazy,
    default: defaultFn,
    transform,
    pick: pick2,
    immediate,
    getCachedData,
    deep,
    dedupe,
    watch: watch2 === false ? [] : [_fetchOptions, _request, ...watch2 || []]
  };
  let controller;
  const asyncData = useAsyncData(key, () => {
    var _a;
    (_a = controller == null ? void 0 : controller.abort) == null ? void 0 : _a.call(controller, "Request aborted as another request to the same endpoint was initiated.");
    controller = typeof AbortController !== "undefined" ? new AbortController() : {};
    const timeoutLength = toValue(opts.timeout);
    let timeoutId;
    if (timeoutLength) {
      timeoutId = setTimeout(() => controller.abort("Request aborted due to timeout."), timeoutLength);
      controller.signal.onabort = () => clearTimeout(timeoutId);
    }
    let _$fetch = opts.$fetch || globalThis.$fetch;
    if (!opts.$fetch) {
      const isLocalFetch = typeof _request.value === "string" && _request.value[0] === "/" && (!toValue(opts.baseURL) || toValue(opts.baseURL)[0] === "/");
      if (isLocalFetch) {
        _$fetch = useRequestFetch();
      }
    }
    return _$fetch(_request.value, { signal: controller.signal, ..._fetchOptions }).finally(() => {
      clearTimeout(timeoutId);
    });
  }, _asyncDataOptions);
  return asyncData;
}
function generateOptionSegments(opts) {
  var _a;
  const segments = [
    ((_a = toValue(opts.method)) == null ? void 0 : _a.toUpperCase()) || "GET",
    toValue(opts.baseURL)
  ];
  for (const _obj of [opts.params || opts.query]) {
    const obj = toValue(_obj);
    if (!obj) {
      continue;
    }
    const unwrapped = {};
    for (const [key, value] of Object.entries(obj)) {
      unwrapped[toValue(key)] = toValue(value);
    }
    segments.push(unwrapped);
  }
  return segments;
}
const useUserStore = defineStore("user", () => {
  const user = ref(null);
  const setUser = (newUser) => {
    user.value = newUser;
  };
  const getUser = () => {
    return user.value;
  };
  return {
    user,
    setUser,
    getUser
  };
}, { persist: true });
function useCustomFetch(url, options = {}) {
  return useFetch(url, {
    ...options,
    $fetch: useNuxtApp().$customFetch
  }, "$sC22i8rhLA");
}
const _imports_0 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAC2AAAAtgByfICtgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAATESURBVHic7dtbqFVVFAbgbx6vYTcjEI+mdoq0ksosiMLuoHSxDEIiKqQgih6L6DGCwnrJisA0IqJAKCiJKCgNoqKXKEICU6goTQMrL2WmzR7WMre7vbf7Mtbeh3TAeDlnzn+M/59zzTnWmnOnnLOj2YYGncCg7ZgAg05g0HbUCzC2X4FSShMx3MBhS73nnPf2Ja+qdoGS8DW4Gdc5RLZd24J38CY+qEqQUAFSSpNxA27CIkwKgt6Dd/EW3s45/xKES865Z8cJeBS7kSv23WWsE0Jy75H4ODyAbX0gXu/bytjjBiIAlmLTAIjX+yYs7ZsAmICXRwHxen8ZEyoVAFPwySgg28w/wZRKBMA8fD8KSB7Jv8e8UAGwRLEVDZpcu74HS0IEwALsGwWkOvV9WNCTAJiJ7aOATLe+HTNbcWxaCaaUJuFjnN+wQfe2QVHRbcS35d9m4SxFBXlucLwvcVnOeU/D/zYZ+YQ3xI7G65jbxiM3t2wbGfsNZdnf1iOARwKDb8Gijvfn4l1iS2Aej7QlgOKtLWrF34yRTsnX5DJSYkTksgfD7QiwKijgz40CdiHCcIkVkdOqlgLgHOwPCnZPr+Rr8ro7KKf9OKeVAGuDAn2myaLTpQCpxIzIbW1DAXB5UIADuCiKfE1+F5XYETle3kiANUHgK6PJ1+S4MijHNYcJgPHYGQQ+v0IB5gfluBPjawVYGAS8XeCz32QtiCrNF+ac/z0XWCzG1ucy0yqsxF4fBLcY4QJ8F4TTjxiFACml+ZgeBLo9CKcfMaanlOYP4cIgQNgViNWPGBcO6fzEppVFzaRWdlog1vAQpgUCzgrEamYjgVjTomfArECsZnZ6INZwtABzUkqVnTiX2LMDIcMFOBU3BuLV22JMDsQbHgoGhPuC8Wrt3mC8ybBVTGl50P/GmRWUwSMldmSuPw4pTlkjLeG5lFIKAyywni6xI+2nKgSgeLl6KBDvYdWsLVvhFbHT6qD/hUsCpv5V4j7T1fvqqmYAxQWs91JKS7oFSCndqjhEGROW1eH2EyxTjbq1vhxjOhj18XimD3kto6jfqw6UFUdi92txtwcnKrbRDX3KaXrKOUspfY05erdNeLEksBJTG7TZpThz3OzQoccIzsAVGt8s24ancAsuDcgTvso5n3dQ+RW6V3EvXlUsVqlmNKdgXQ+4B/1DTK3BvQCr8XuPuMtrvwne0AXA34q9+ZQjfMNbim+6wN+IOzDUBHsyHsSvXQpwZa0Ak/BbB50344oOFrVxuE3x6b1VnB14Dbdqc9FUvB1+2iH5ncrrdbVAT7Y56s9jUg/7+jjFHYBrcHvpV+NsjO0Scywe1/7ByYp/+9aATMWfR+h4V2R9H+2lqDuOwGEvpv1HgBJgdYuOjw2aYJsiXK/1S9Pzh7Wv6zy7yTRao8IDjwpEWN6E/D7MaCpA2fmluk6fY+KgSXUowFh81ECAF/7TtkHnkxx+IfLOQRPqUoQZdY/CVg1ukTbrfHXZ+Q9B19IHJMIXJfkDuLZRm4YfMHPO61JKzyoqsH4cdlRl6xXX/J7IOb/fsEUL9Y7DxYMexR5nwE2KtaBpUVXZb4ZGg6WUTsbxOecfmrb5PwvQjh31vxs8JsCgExi0HfUC/ANmQZ3mnwMF8wAAAABJRU5ErkJggg==";
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "MenuProject",
  __ssrInlineRender: true,
  props: {
    project: {}
  },
  setup(__props) {
    const isMenuOpen = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "menu is-menu" }, _attrs))}><div class="menu-list"><div class="menu-button"><span class="">${ssrInterpolate(_ctx.project.name)}</span>`);
      _push(ssrRenderComponent(unref(FontAwesomeIcon), {
        icon: "fa-solid fa-chevron-right",
        class: { "is-menu-open": unref(isMenuOpen) }
      }, null, _parent));
      _push(`</div><div class="${ssrRenderClass([{ "is-menu-close": !unref(isMenuOpen) }, "is-menu-list"])}"><ul class="menu-list"><li><span>Issues</span><ul><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "#" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Active`);
          } else {
            return [
              createTextVNode("Active")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "#" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Backlog`);
          } else {
            return [
              createTextVNode("Backlog")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "#" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Releases`);
          } else {
            return [
              createTextVNode("Releases")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li><span>Repos</span><ul><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "#" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Pull Requests`);
          } else {
            return [
              createTextVNode("Pull Requests")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "#" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Issues`);
          } else {
            return [
              createTextVNode("Issues")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></li></ul></div></div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Menu/MenuProject.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
function useCapitalize(s) {
  if (s.includes("_")) {
    let w = s.split("_");
    let cp = [];
    w.forEach((word) => {
      cp.push(word.charAt(0).toUpperCase() + word.slice(1));
    });
    return cp[0] + " " + cp[1];
  } else
    return s.charAt(0).toUpperCase() + s.slice(1);
}
var ActivityContent = /* @__PURE__ */ ((ActivityContent2) => {
  ActivityContent2["CREATE_ISSUE"] = "create_issue";
  ActivityContent2["EDIT_TITLE"] = "edit_title";
  ActivityContent2["EDIT_DESCRIPTION"] = "edit_description";
  ActivityContent2["EDIT_STATUS"] = "edit_status";
  ActivityContent2["EDIT_PRIORITY"] = "edit_priority";
  ActivityContent2["EDIT_TAG"] = "edit_tag";
  ActivityContent2["EDIT_MILESTONE"] = "edit_milestone";
  ActivityContent2["EDIT_LABEL"] = "edit_label";
  ActivityContent2["ASSIGNED_TO"] = "assigned_to";
  return ActivityContent2;
})(ActivityContent || {});
function useWebSocket(url, callback) {
  const socket = ref(null);
  const isConnected = ref(false);
  const receivedMessage = ref(null);
  const sendMessage = (message) => {
    console.log(socket.value);
    if (socket.value && isConnected.value) {
      socket.value.send(message);
    }
  };
  return {
    sendMessage,
    receivedMessage,
    isConnected
  };
}
const isRefresh = ref(false);
function useRefreshData() {
  return {
    isRefresh
  };
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "CreateIssueModal",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    projects: {},
    state: {}
  }, {
    "modal": { type: Boolean, required: true },
    "modalModifiers": {}
  }),
  emits: ["update:modal"],
  setup(__props) {
    const props = __props;
    useWebSocket();
    reactive({
      type: "activity",
      content: ActivityContent.CREATE_ISSUE,
      issue: 0,
      user: 0
    });
    const showModal = useModel(__props, "modal");
    const count = ref(500);
    const user = useUserStore().getUser();
    const projectStates = ref([]);
    const data = reactive({
      creator: user == null ? void 0 : user.id,
      assigned: user == null ? void 0 : user.id,
      title: "",
      description: "",
      priority: "",
      project: 0,
      status: props.state ? props.state : "",
      tags: null
    });
    const errors = reactive({
      title: "",
      description: ""
    });
    watch(() => props.state, (newVal) => {
      if (newVal)
        data.status = newVal;
    });
    watch(() => data.project, async (newVal) => {
      if (newVal != 0) {
        const { data: projectState } = await useCustomFetch(`/project/${newVal}/states`);
        projectStates.value = projectState.value;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: [{ "is-active": showModal.value }, "modal"]
      }, _attrs))}><div class="modal-background"></div><div class="modal-content"><div class="box"><div class="field"><div class="control"><label for="title">Issue Title</label><input class="input" maxLength="100" minLength="3" placeholder="Issue Title" type="text"${ssrRenderAttr("value", data.title)}>`);
      if (errors.title) {
        _push(`<p class="help is-danger">${ssrInterpolate(errors.title)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<label for="textarea">Issue Content</label><textarea class="textarea has-fixed-size" maxLength="500" minLength="3" placeholder="Issue Description">${ssrInterpolate(data.description)}</textarea>`);
      if (errors.description) {
        _push(`<p class="help is-danger">${ssrInterpolate(errors.description)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="count">${ssrInterpolate(count.value != 0 ? count.value : 0)}/500</div><div class="select-group"><div class="select"><select><option disabled value=""${ssrIncludeBooleanAttr(Array.isArray(data.priority) ? ssrLooseContain(data.priority, "") : ssrLooseEqual(data.priority, "")) ? " selected" : ""}>Priority</option><option value="urgent"${ssrIncludeBooleanAttr(Array.isArray(data.priority) ? ssrLooseContain(data.priority, "urgent") : ssrLooseEqual(data.priority, "urgent")) ? " selected" : ""}>Urgent</option><option value="high"${ssrIncludeBooleanAttr(Array.isArray(data.priority) ? ssrLooseContain(data.priority, "high") : ssrLooseEqual(data.priority, "high")) ? " selected" : ""}>High</option><option value="neutral"${ssrIncludeBooleanAttr(Array.isArray(data.priority) ? ssrLooseContain(data.priority, "neutral") : ssrLooseEqual(data.priority, "neutral")) ? " selected" : ""}>Neutral</option><option value="low"${ssrIncludeBooleanAttr(Array.isArray(data.priority) ? ssrLooseContain(data.priority, "low") : ssrLooseEqual(data.priority, "low")) ? " selected" : ""}>Low</option><option value="minor"${ssrIncludeBooleanAttr(Array.isArray(data.priority) ? ssrLooseContain(data.priority, "minor") : ssrLooseEqual(data.priority, "minor")) ? " selected" : ""}>Minor</option></select></div><div class="select"><select><option disabled value="0"${ssrIncludeBooleanAttr(Array.isArray(data.project) ? ssrLooseContain(data.project, "0") : ssrLooseEqual(data.project, "0")) ? " selected" : ""}>Project</option><!--[-->`);
      ssrRenderList(_ctx.projects, (project) => {
        _push(`<option${ssrRenderAttr("value", project.id)}>${ssrInterpolate(project.name)}</option>`);
      });
      _push(`<!--]--></select></div><div class="select"><select><option disabled value=""${ssrIncludeBooleanAttr(Array.isArray(data.status) ? ssrLooseContain(data.status, "") : ssrLooseEqual(data.status, "")) ? " selected" : ""}>State</option>`);
      if (data.project == 0) {
        _push(`<option value="backlog">Backlog</option>`);
      } else {
        _push(`<!---->`);
      }
      if (data.project == 0) {
        _push(`<option value="open">Open</option>`);
      } else {
        _push(`<!---->`);
      }
      if (data.project == 0) {
        _push(`<option value="in_progress">In Progress</option>`);
      } else {
        _push(`<!---->`);
      }
      if (data.project == 0) {
        _push(`<option value="completed">Completed</option>`);
      } else {
        _push(`<!---->`);
      }
      if (data.project == 0) {
        _push(`<option value="canceled">Canceled</option>`);
      } else {
        _push(`<!---->`);
      }
      if (data.project != 0 && projectStates.value.length > 0) {
        _push(`<!--[-->`);
        ssrRenderList(projectStates.value, (state) => {
          _push(`<option${ssrRenderAttr("value", state.name)}>${ssrInterpolate(("useCapitalize" in _ctx ? _ctx.useCapitalize : unref(useCapitalize))(state.name))}</option>`);
        });
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</select></div></div></div></div><button class="button"> Cancel </button><button class="button is-dark"> Create </button></div></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Modals/issue/CreateIssueModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Navbar",
  __ssrInlineRender: true,
  props: {
    user: {},
    projects: {}
  },
  setup(__props) {
    const isDropDownOpen = ref(false);
    const isShowModal = ref(false);
    const thumbnail = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_sfc_main$1, {
        projects: _ctx.projects,
        modal: isShowModal.value,
        "onUpdate:modal": ($event) => isShowModal.value = $event
      }, null, _parent));
      _push(`<div id="navbar"><div><div><img src="https://placehold.co/30" alt=""><h1>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Tempest Board`);
          } else {
            return [
              createTextVNode("Tempest Board")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</h1><div class="${ssrRenderClass([{ "is-active": isDropDownOpen.value }, "dropdown is-right"])}"><div class="dropdown-trigger" aria-controls="user-menu" aria-haspopup="true">`);
      if (thumbnail.value) {
        _push(`<img${ssrRenderAttr("src", thumbnail.value)} alt="user thumbnail" class="dropdown-thumbnail">`);
      } else {
        _push(`<img${ssrRenderAttr("src", _imports_0)} alt="user thumbnail" class="dropdown-thumbnail">`);
      }
      _push(`</div><div class="dropdown-menu" id="user-menu"><div class="dropdown-content"><ul><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "#" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Profile`);
          } else {
            return [
              createTextVNode("Profile")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "#" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Settings`);
          } else {
            return [
              createTextVNode("Settings")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/project" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<li${_scopeId}> Project </li>`);
          } else {
            return [
              createVNode("li", null, " Project ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<li><button> Logout </button></li></ul></div></div></div></div></div><div class="button-container"><button>`);
      _push(ssrRenderComponent(unref(FontAwesomeIcon), { icon: "fa-solid fa-pen-to-square" }, null, _parent));
      _push(` New Issue </button><button>`);
      _push(ssrRenderComponent(unref(FontAwesomeIcon), { icon: "fa-solid fa-magnifying-glass" }, null, _parent));
      _push(`</button></div><nav><ul><li class="is-active">`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`My Issues`);
          } else {
            return [
              createTextVNode("My Issues")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><!--[-->`);
      ssrRenderList(_ctx.projects, (project) => {
        _push(`<li>`);
        _push(ssrRenderComponent(_sfc_main$2, { project }, null, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "#" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Roadmap`);
          } else {
            return [
              createTextVNode("Roadmap")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "#" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Dashboard`);
          } else {
            return [
              createTextVNode("Dashboard")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></nav></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Navbar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { ActivityContent as A, _sfc_main$1 as _, useCustomFetch as a, useWebSocket as b, useCapitalize as c, _imports_0 as d, useRefreshData as e, _sfc_main as f, useUserStore as u };
//# sourceMappingURL=Navbar-BYxGt_4k.mjs.map
