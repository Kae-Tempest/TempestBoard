import { _ as __nuxt_component_0 } from './nuxt-link-CH3S4xEW.mjs';
import { defineComponent, reactive, mergeProps, withCtx, createTextVNode, useSSRContext } from 'file:///home/kae/Desktop/TempestBoard/front/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderComponent } from 'file:///home/kae/Desktop/TempestBoard/front/node_modules/vue/server-renderer/index.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "register",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "Register - Tempest Board" });
    const data = reactive({
      username: "",
      email: "",
      password: "",
      confirm_password: ""
    });
    const errors = reactive({
      username: "",
      email: "",
      password: "",
      confirm_password: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ id: "Auth" }, _attrs))}><div><form id="register"><div class="flex flex-col"><label>Username</label><input id="username" type="text" name="username"${ssrRenderAttr("value", data.username)} class="input"><div class="error">${ssrInterpolate(errors.username)}</div></div><div><label>Email</label><input id="email" type="email" name="email"${ssrRenderAttr("value", data.email)} class="input"><div class="error">${ssrInterpolate(errors.email)}</div></div><div><label>Password</label><input id="password" type="password" name="password"${ssrRenderAttr("value", data.password)} class="input"><div class="error">${ssrInterpolate(errors.password)}</div></div><div><label>Confirm Password</label><input id="password_confirmation" type="password" name="confirm_password"${ssrRenderAttr("value", data.confirm_password)} class="input"><div class="error">${ssrInterpolate(errors.confirm_password)}</div></div><div>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/login" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Already registered ?`);
          } else {
            return [
              createTextVNode("Already registered ?")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button type="submit"> Register </button></div></form></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=register-CvZKKbMe.mjs.map
