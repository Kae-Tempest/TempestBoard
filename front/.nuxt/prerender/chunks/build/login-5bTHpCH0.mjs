import { _ as __nuxt_component_0 } from './nuxt-link-CH3S4xEW.mjs';
import { useSSRContext, defineComponent, reactive, mergeProps, unref, withCtx, createTextVNode, mergeModels, useModel } from 'file:///home/kae/Desktop/TempestBoard/front/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrRenderClass } from 'file:///home/kae/Desktop/TempestBoard/front/node_modules/vue/server-renderer/index.mjs';
import { u as useHead } from './index-BfsD3ZAz.mjs';
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/ufo/dist/index.mjs';
import './server.mjs';
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
import 'file:///home/kae/Desktop/TempestBoard/front/node_modules/ohash/dist/index.mjs';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "LoginCustomCheckbox",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    label: {}
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const isCheck = useModel(__props, "modelValue");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ id: "checkbox" }, _attrs))}><input type="checkbox" name="remember"><svg class="${ssrRenderClass({ "is-active": isCheck.value })}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg><label className="ml-2">${ssrInterpolate(_ctx.label)}</label></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Checkbox/LoginCustomCheckbox.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "Login - Tempest Board" });
    const data = reactive({
      email: "",
      password: "",
      remember: false
    });
    const errors = reactive({
      msg: ""
    });
    const handleCheckboxChange = (newValue) => {
      data.remember = newValue;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ id: "Auth" }, _attrs))}><div><form id="login"><div><label>Email</label><input id="email" type="email" name="email"${ssrRenderAttr("value", unref(data).email)} class="input"></div><div><label>Password</label><input id="password" type="password" name="password"${ssrRenderAttr("value", unref(data).password)} class="input"><div class="error">${ssrInterpolate(unref(errors).msg)}</div></div>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        label: "Remember me",
        "onUpdate:checked": handleCheckboxChange,
        modelValue: unref(data).remember,
        "onUpdate:modelValue": ($event) => unref(data).remember = $event
      }, null, _parent));
      _push(`<div>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/register" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Any account ?`);
          } else {
            return [
              createTextVNode("Any account ?")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, { to: "#" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Forgotten password ?`);
          } else {
            return [
              createTextVNode("Forgotten password ?")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button type="submit"> Login </button></div></form></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-5bTHpCH0.mjs.map
