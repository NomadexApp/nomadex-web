"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn2, res) => function __init() {
  return fn2 && (res = (0, fn2[__getOwnPropNames(fn2)[0]])(fn2 = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../../node_modules/.pnpm/@magic-sdk+types@24.4.0/node_modules/@magic-sdk/types/dist/es/index.mjs
var m, p, _, u, d, f, g, v, E, x, I, N, T, A, R, h, y, O, b, S, k, L, U, w, F, D, V, G, H;
var init_es = __esm({
  "../../node_modules/.pnpm/@magic-sdk+types@24.4.0/node_modules/@magic-sdk/types/dist/es/index.mjs"() {
    "use strict";
    m = ((r) => (r.MissingApiKey = "MISSING_API_KEY", r.ModalNotReady = "MODAL_NOT_READY", r.MalformedResponse = "MALFORMED_RESPONSE", r.InvalidArgument = "INVALID_ARGUMENT", r.ExtensionNotInitialized = "EXTENSION_NOT_INITIALIZED", r.IncompatibleExtensions = "INCOMPATIBLE_EXTENSIONS", r))(m || {});
    p = ((s) => (s.SyncWeb3Method = "SYNC_WEB3_METHOD", s.DuplicateIframe = "DUPLICATE_IFRAME", s.ReactNativeEndpointConfiguration = "REACT_NATIVE_ENDPOINT_CONFIGURATION", s.DeprecationNotice = "DEPRECATION_NOTICE", s.ProductAnnouncement = "ANNOUNCEMENT", s))(p || {});
    _ = ((t) => (t[t.ParseError = -32700] = "ParseError", t[t.InvalidRequest = -32600] = "InvalidRequest", t[t.MethodNotFound = -32601] = "MethodNotFound", t[t.InvalidParams = -32602] = "InvalidParams", t[t.InternalError = -32603] = "InternalError", t[t.MagicLinkFailedVerification = -1e4] = "MagicLinkFailedVerification", t[t.MagicLinkExpired = -10001] = "MagicLinkExpired", t[t.MagicLinkRateLimited = -10002] = "MagicLinkRateLimited", t[t.MagicLinkInvalidRedirectURL = -10006] = "MagicLinkInvalidRedirectURL", t[t.UserAlreadyLoggedIn = -10003] = "UserAlreadyLoggedIn", t[t.UpdateEmailFailed = -10004] = "UpdateEmailFailed", t[t.UserRequestEditEmail = -10005] = "UserRequestEditEmail", t[t.InactiveRecipient = -10010] = "InactiveRecipient", t[t.AccessDeniedToUser = -10011] = "AccessDeniedToUser", t[t.RedirectLoginComplete = -10015] = "RedirectLoginComplete", t))(_ || {});
    u = ((l) => (l.MetaMask = "metamask", l.CoinbaseWallet = "coinbase_wallet", l))(u || {});
    d = ((i) => (i.WalletSelected = "wallet_selected", i.WalletConnected = "wallet_connected", i.WalletRejected = "wallet_rejected", i))(d || {});
    f = ((e) => (e.LoginWithSms = "magic_auth_login_with_sms", e.LoginWithEmailOTP = "magic_auth_login_with_email_otp", e.LoginWithMagicLink = "magic_auth_login_with_magic_link", e.LoginWithCredential = "magic_auth_login_with_credential", e.SetAuthorizationToken = "magic_auth_set_authorization_token", e.GetIdToken = "magic_auth_get_id_token", e.GenerateIdToken = "magic_auth_generate_id_token", e.GetMetadata = "magic_auth_get_metadata", e.IsLoggedIn = "magic_is_logged_in", e.Logout = "magic_auth_logout", e.UpdateEmail = "magic_auth_update_email", e.UserSettings = "magic_auth_settings", e.UserSettingsTestMode = "magic_auth_settings_testing_mode", e.LoginWithSmsTestMode = "magic_auth_login_with_sms_testing_mode", e.LoginWithEmailOTPTestMode = "magic_auth_login_with_email_otp_testing_mode", e.LoginWithMagicLinkTestMode = "magic_login_with_magic_link_testing_mode", e.LoginWithCredentialTestMode = "magic_auth_login_with_credential_testing_mode", e.GetIdTokenTestMode = "magic_auth_get_id_token_testing_mode", e.GenerateIdTokenTestMode = "magic_auth_generate_id_token_testing_mode", e.GetMetadataTestMode = "magic_auth_get_metadata_testing_mode", e.IsLoggedInTestMode = "magic_auth_is_logged_in_testing_mode", e.LogoutTestMode = "magic_auth_logout_testing_mode", e.UpdateEmailTestMode = "magic_auth_update_email_testing_mode", e.IntermediaryEvent = "magic_intermediary_event", e.RequestAccounts = "eth_requestAccounts", e.GetInfo = "magic_get_info", e.ShowUI = "magic_wallet", e.NFTPurchase = "magic_nft_purchase", e.NFTCheckout = "magic_nft_checkout", e.NFTTransfer = "magic_nft_transfer", e.RequestUserInfoWithUI = "mc_request_user_info", e.Disconnect = "mc_disconnect", e.RecoverAccount = "magic_auth_recover_account", e.RecoverAccountTestMode = "magic_auth_recover_account_testing_mode", e.MagicBoxHeartBeat = "magic_box_heart_beat", e.AutoConnect = "mc_auto_connect", e.Login = "mc_login", e.EncryptV1 = "magic_auth_encrypt_v1", e.DecryptV1 = "magic_auth_decrypt_v1", e.ShowNFTs = "magic_show_nfts", e.ShowOnRamp = "magic_show_fiat_onramp", e.ShowSendTokensUI = "magic_show_send_tokens_ui", e.ShowAddress = "magic_show_address", e.ShowBalances = "magic_show_balances", e.SendGaslessTransaction = "eth_sendGaslessTransaction", e.RevealPK = "magic_reveal_key", e.EnableMFA = "magic_auth_enable_mfa_flow", e.DisableMFA = "magic_auth_disable_mfa_flow", e))(f || {});
    g = ((c2) => (c2.MAGIC_HANDLE_RESPONSE = "MAGIC_HANDLE_RESPONSE", c2.MAGIC_OVERLAY_READY = "MAGIC_OVERLAY_READY", c2.MAGIC_SHOW_OVERLAY = "MAGIC_SHOW_OVERLAY", c2.MAGIC_HIDE_OVERLAY = "MAGIC_HIDE_OVERLAY", c2.MAGIC_HANDLE_EVENT = "MAGIC_HANDLE_EVENT", c2.MAGIC_MG_BOX_SEND_RECEIPT = "MAGIC_MG_BOX_SEND_RECEIPT", c2.MAGIC_SEND_PRODUCT_ANNOUNCEMENT = "MAGIC_SEND_PRODUCT_ANNOUNCEMENT", c2))(g || {});
    v = ((n) => (n.MAGIC_HANDLE_REQUEST = "MAGIC_HANDLE_REQUEST", n))(v || {});
    E = ((i) => (i.UpdateEmail = "update-email", i.MFA = "mfa", i.Recovery = "recovery", i))(E || {});
    x = ((n) => (n.Retry = "retry", n))(x || {});
    I = ((l) => (l.EmailSent = "email-sent", l.EmailNotDeliverable = "email-not-deliverable", l))(I || {});
    N = ((i) => (i.VerifyEmailOtp = "verify-email-otp", i.VerifyMFACode = "verify-mfa-code", i.Cancel = "cancel", i))(N || {});
    T = ((i) => (i.VerifySmsOtp = "verify-sms-otp", i.Cancel = "cancel", i.Retry = "retry", i))(T || {});
    A = ((i) => (i.SmsOTPSent = "sms-otp-sent", i.InvalidSmsOtp = "invalid-sms-otp", i.ExpiredSmsOtp = "expired-sms-otp", i))(A || {});
    R = ((s) => (s.EmailOTPSent = "email-otp-sent", s.InvalidEmailOtp = "invalid-email-otp", s.InvalidMfaOtp = "invalid-mfa-otp", s.ExpiredEmailOtp = "expired-email-otp", s.MfaSentHandle = "mfa-sent-handle", s))(R || {});
    h = ((n) => (n.Retry = "device-retry", n))(h || {});
    y = ((a2) => (a2.DeviceApproved = "device-approved", a2.DeviceNeedsApproval = "device-needs-approval", a2.DeviceVerificationLinkExpired = "device-verification-link-expired", a2.DeviceVerificationEmailSent = "device-verification-email-sent", a2))(y || {});
    O = ((a2) => (a2.Retry = "Recency/auth-factor-retry", a2.Cancel = "Recency/auth-factor-verification-cancel", a2.VerifyEmailOtp = "Recency/auth-factor-verify-email-otp", a2.VerifyMFACode = "Recency/verify-mfa-code", a2))(O || {});
    b = ((r) => (r.PrimaryAuthFactorNeedsVerification = "Recency/auth-factor-needs-verification", r.PrimaryAuthFactorVerified = "Recency/auth-factor-verified", r.InvalidEmailOtp = "Recency/auth-factor-invalid-email-otp", r.EmailExpired = "Recency/auth-factor-verification-email-expired", r.EmailSent = "Recency/auth-factor-verification-email-sent", r.EmailNotDeliverable = "Recency/auth-factor-verification-email-not-deliverable", r))(b || {});
    S = ((i) => (i.RetryWithNewEmail = "UpdateEmail/retry-with-new-email", i.Cancel = "UpdateEmail/new-email-verification-cancel", i.VerifyEmailOtp = "UpdateEmail/new-email-verify-otp", i))(S || {});
    k = ((o) => (o.NewAuthFactorNeedsVerification = "UpdateEmail/new-email-needs-verification", o.EmailUpdated = "UpdateEmail/email-updated", o.InvalidEmailOtp = "UpdateEmail/new-email-invalid-email-otp", o.EmailExpired = "UpdateEmail/new-email-verification-email-expired", o.EmailSent = "UpdateEmail/new-email-verification-email-sent", o.EmailNotDeliverable = "UpdateEmail/new-email-verification-email-not-deliverable", o.InvalidEmail = "UpdateEmail/new-email-invalid", o.EmailAlreadyExists = "UpdateEmail/new-email-already-exists", o))(k || {});
    L = ((n) => (n.IDTokenCreated = "Auth/id-token-created", n))(L || {});
    U = ((n) => (n.SuccessSignIn = "Farcaster/success_sign_in", n))(U || {});
    w = ((n) => (n.Harmony = "HARMONY", n))(w || {});
    F = ((n) => (n.ClosedByUser = "closed-by-user", n))(F || {});
    D = ((n) => (n.ClosedByUser = "closed-by-user-on-received", n))(D || {});
    V = ((n) => (n.PhoneNumber = "phone_number", n))(V || {});
    G = ((a2) => (a2.Success = "nft-checkout-success", a2.Failure = "nft-checkout-failure", a2.Initiated = "nft-checkout-initiated", a2.Disconnect = "disconnect", a2))(G || {});
    H = ((n) => (n.WalletInfoFetched = "Wallet/wallet-info-fetched", n))(H || {});
  }
});

// ../../node_modules/.pnpm/@magic-sdk+provider@28.5.0_localforage@1.10.0/node_modules/@magic-sdk/provider/dist/es/index.mjs
function en(n) {
  let t = { exports: {} };
  return n(t, t.exports), t.exports;
}
function qn(n) {
  return String.fromCharCode(parseInt(n.slice(1), 16));
}
function Dn(n) {
  return `%${`00${n.charCodeAt(0).toString(16)}`.slice(-2)}`;
}
function Un(n) {
  return btoa(encodeURIComponent(n).replace(/%[0-9A-F]{2}/g, qn));
}
function Wn(n) {
  return decodeURIComponent(Array.from(atob(n), Dn).join(""));
}
function fe(n) {
  return Un(JSON.stringify(n));
}
function lt(n) {
  return JSON.parse(Wn(n));
}
function O2(n) {
  return typeof n == "undefined";
}
function Gn(n) {
  return n === null;
}
function Ee(n) {
  return Gn(n) || O2(n);
}
function dt(n) {
  return Ee(n) ? false : !O2(n.jsonrpc) && !O2(n.id) && (!O2(n.result) || !O2(n.error));
}
function ut(n) {
  return Ee(n) ? false : typeof n == "number" && Object.values(_).includes(n);
}
function se(n) {
  if (!n) return true;
  for (let t in n) if (Object.hasOwnProperty.call(n, t)) return false;
  return true;
}
function Kn(n, t) {
  return Object.assign(h2, t), n;
}
function ht() {
  return new $(m.MissingApiKey, "Please provide an API key that you acquired from the Magic developer dashboard.");
}
function mt() {
  return new $(m.ModalNotReady, "Modal is not ready.");
}
function ft() {
  return new $(m.MalformedResponse, "Response from the Magic iframe is malformed.");
}
function Et(n) {
  return new $(m.ExtensionNotInitialized, `Extensions must be initialized with a Magic SDK instance before \`Extension.${n}\` can be accessed. Do not invoke \`Extension.${n}\` inside an extension constructor.`);
}
function yt(n) {
  let t = `Some extensions are incompatible with \`${h2.sdkName}@${h2.version}\`:`;
  return n.filter((e) => typeof e.compat != "undefined" && e.compat !== null).forEach((e) => {
    let r = e.compat[h2.sdkName];
    typeof r == "string" ? t += `
  - Extension \`${e.name}\` supports version(s) \`${r}\`` : r || (t += `
  - Extension \`${e.name}\` does not support ${h2.platform} environments.`);
  }), new $(m.IncompatibleExtensions, t);
}
function gt(n) {
  let t = (e) => {
    let r = e + 1, s = r % 10, o = r % 100;
    return s === 1 && o !== 11 ? `${r}st` : s === 2 && o !== 12 ? `${r}nd` : s === 3 && o !== 13 ? `${r}rd` : `${r}th`;
  };
  return new $(m.InvalidArgument, `Invalid ${t(n.argument)} argument given to \`${n.procedure}\`.
  Expected: \`${n.expected}\`
  Received: \`${n.received}\``);
}
function Ur() {
  return new U2(p.DuplicateIframe, "Duplicate iframes found.");
}
function Rt() {
  return new U2(p.SyncWeb3Method, "Non-async web3 methods are deprecated in web3 > 1.0 and are not supported by the Magic web3 provider. Please use an async method instead.");
}
function vt() {
  return new U2(p.ReactNativeEndpointConfiguration, `CUSTOM DOMAINS ARE NOT SUPPORTED WHEN USING MAGIC SDK WITH REACT NATIVE! The \`endpoint\` parameter SHOULD NOT be provided. The Magic \`<iframe>\` is automatically wrapped by a WebView pointed at \`${h2.defaultEndpoint}\`. Changing this default behavior will lead to unexpected results and potentially security-threatening bugs.`);
}
function W(n) {
  let { method: t, removalVersions: e, useInstead: r } = n, s = e[h2.sdkName], o = r ? ` Use \`${r}\` instead.` : "", i = `\`${t}\` will be removed from \`${h2.sdkName}\` in version \`${s}\`.${o}`;
  return new U2(p.DeprecationNotice, i);
}
function* Bn() {
  let n = 0;
  for (; ; ) n < Number.MAX_SAFE_INTEGER ? yield ++n : n = 0;
}
function Se() {
  return Vn.next().value;
}
function It(n) {
  return Object.defineProperty(n, Tt, { value: true, enumerable: false }), n;
}
function Hn(n) {
  return !!n[Tt];
}
function K(n) {
  var t, e, r;
  return Hn(n) || (n.jsonrpc = (t = n.jsonrpc) != null ? t : "2.0", n.id = Se(), n.method = (e = n.method) != null ? e : "noop", n.params = (r = n.params) != null ? r : [], It(n)), n;
}
function u2(n, t = []) {
  return It({ params: t, method: n, jsonrpc: "2.0", id: Se() });
}
function Re() {
  let n = new Oe();
  return { emitter: n, createChainingEmitterMethod: (r, s) => (...o) => (n[r].apply(n, o), s), createBoundEmitterMethod: (r) => (...s) => n[r].apply(n, s) };
}
function xt(n) {
  return !!n[Mt];
}
function k2(n) {
  let t = _e(n), { createBoundEmitterMethod: e, createChainingEmitterMethod: r } = Re(), s = Symbol("Promise.then"), o = Symbol("Promise.catch"), i = Symbol("Promise.finally"), a2 = (d2, p2) => (...x2) => {
    let v2 = p2[d2].apply(p2, x2);
    return c2(v2);
  }, c2 = (d2) => Object.assign(d2, { [Mt]: true, [s]: d2[s] || d2.then, [o]: d2[o] || d2.catch, [i]: d2[i] || d2.finally, then: a2(s, d2), catch: a2(o, d2), finally: a2(i, d2), on: r("on", d2), once: r("once", d2), addListener: r("addListener", d2), off: r("off", d2), removeListener: r("removeListener", d2), removeAllListeners: r("removeAllListeners", d2), emit: e("emit"), eventNames: e("eventNames"), listeners: e("listeners"), listenerCount: e("listenerCount") }), l = c2(t.then((d2) => (l.emit("done", d2), l.emit("settled"), d2), (d2) => {
    throw l.emit("error", d2), l.emit("settled"), d2;
  }));
  return l.on(D.ClosedByUser, () => {
    l.emit(F.ClosedByUser);
  }), l;
}
function _e(n) {
  return new Promise((t, e) => {
    let r = n(t, e);
    Promise.resolve(r).catch(e);
  });
}
function Nt(n, t) {
  let [e] = n.split(".").map(Number);
  return e >= t;
}
function G2(n) {
  return (...t) => m2(this, null, function* () {
    return Te || (Te = yield h2.configureStorage()), yield Te.ready(), Te[n](...t);
  });
}
function At() {
  let n = window.crypto.getRandomValues(new Uint8Array(16));
  n[6] = n[6] & 15 | 64, n[8] = n[8] & 191 | 128;
  let t = "";
  return t += n[0].toString(16), t += n[1].toString(16), t += n[2].toString(16), t += n[3].toString(16), t += "-", t += n[4].toString(16), t += n[5].toString(16), t += "-", t += n[6].toString(16), t += n[7].toString(16), t += "-", t += n[8].toString(16), t += n[9].toString(16), t += "-", t += n[10].toString(16), t += n[11].toString(16), t += n[12].toString(16), t += n[13].toString(16), t += n[14].toString(16), t += n[15].toString(16), t;
}
function ce() {
  let n = typeof window != "undefined" && !!window.crypto, t = n && !!window.crypto.subtle;
  return n && t;
}
function Lt() {
  return m2(this, null, function* () {
    let n = yield cr();
    if (!n) {
      console.info("unable to create public key or webcrypto is unsupported");
      return;
    }
    let { subtle: t } = window.crypto, e = yield y2(qe);
    if (!e || !t) {
      console.info("unable to find private key or webcrypto unsupported");
      return;
    }
    let r = { iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3), jti: At() }, s = { typ: "dpop+jwt", alg: "ES256", jwk: n }, o = { protected: $t(JSON.stringify(s)), claims: $t(JSON.stringify(r)) }, i = dr(`${o.protected}.${o.claims}`), a2 = { name: St, hash: { name: "SHA-256" } }, c2 = pr(new Uint8Array(yield t.sign(a2, e, i)));
    return `${o.protected}.${o.claims}.${c2}`;
  });
}
function cr() {
  return m2(this, null, function* () {
    if (!ce()) {
      console.info("webcrypto is not supported");
      return;
    }
    return (yield y2(Ie)) || (yield lr()), y2(Ie);
  });
}
function lr() {
  return m2(this, null, function* () {
    let { subtle: n } = window.crypto, t = yield n.generateKey(ar, false, ["sign"]), e = yield n.exportKey("jwk", t.publicKey);
    yield M(qe, t.privateKey), yield M(Ie, e);
  });
}
function $t(n) {
  return Ot(ur(n));
}
function dr(n) {
  return new TextEncoder().encode(n);
}
function Ot(n) {
  return btoa(n).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+/g, "");
}
function ur(n) {
  return encodeURIComponent(n).replace(/%([0-9A-F]{2})/g, (e, r) => String.fromCharCode(parseInt(r, 16)));
}
function pr(n) {
  let t = "";
  return n.forEach((e) => {
    t += String.fromCharCode(e);
  }), Ot(t);
}
function Z() {
  return m2(this, null, function* () {
    let n = [];
    yield ke((t, e, r) => {
      e.startsWith(`${De}_`) && n.push(e);
    });
    for (let t of n) yield N2(t);
  });
}
function _t(n) {
  let t = "", e = new Uint8Array(n), r = e.byteLength;
  for (let s = 0; s < r; s++) t += String.fromCharCode(e[s]);
  return window.btoa(t);
}
function kt(n) {
  let t = window.atob(n), e = t.length, r = new Uint8Array(e);
  for (let s = 0; s < e; s++) r[s] = t.charCodeAt(s);
  return r.buffer;
}
function mr() {
  return m2(this, null, function* () {
    if (!ce()) {
      console.info("webcrypto is not supported");
      return;
    }
    let { crypto: n } = window, t = yield y2(We);
    return t || n.getRandomValues(new Uint8Array(12));
  });
}
function fr() {
  return m2(this, null, function* () {
    if (!ce()) {
      console.info("webcrypto is not supported");
      return;
    }
    let { subtle: n } = window.crypto, t = yield y2(Ue);
    return t || (yield n.generateKey({ name: Fe, length: hr }, false, ["encrypt", "decrypt"]));
  });
}
function qt(n, t) {
  return m2(this, null, function* () {
    let e = yield mr(), r = yield fr();
    if (!e || !r || !n) return;
    let s = kt(n), { subtle: o } = window.crypto, i = yield o.encrypt({ name: Fe, iv: e }, r, s), a2 = _t(i);
    yield M(`${De}_${t}`, a2), yield M(Ue, r), yield M(We, e);
  });
}
function Dt(n) {
  return m2(this, null, function* () {
    let t = yield y2(`${De}_${n}`), e = yield y2(We), r = yield y2(Ue);
    if (!e || !t || !r || !ce()) return;
    let { subtle: s } = window.crypto, o = yield s.decrypt({ name: Fe, iv: e }, r, kt(t));
    return _t(o);
  });
}
function Je(n, t) {
  return t ? new URL(n, t) : new URL(n);
}
function yr(n) {
  let t = Object.getPrototypeOf(n), e = [t];
  for (; t !== P.prototype; ) t = Object.getPrototypeOf(t), e.push(t);
  return e;
}
function Ft(n) {
  return n.compat && n.compat[h2.sdkName] != null ? typeof n.compat[h2.sdkName] == "string" ? at(ct(h2.version), n.compat[h2.sdkName]) : !!n.compat[h2.sdkName] : true;
}
function gr(n, t, e) {
  return !t && !e ? `${n}_eth_mainnet` : e ? `${n}_${JSON.stringify(e)}` : t ? typeof t == "string" ? `${n}_eth_${t}` : `${n}_${t.rpcUrl}_${t.chainId}_${t.chainType}` : `${n}_unknown`;
}
function Rr(n) {
  var s;
  let t = (s = n == null ? void 0 : n.extensions) != null ? s : [], e = {}, r = [];
  if (Array.isArray(t) ? t.forEach((o) => {
    Ft(o) ? (o.init(this), (o.name || o.name !== q.Anonymous) && (this[o.name] = o), o instanceof q.Internal && (se(o.config) || (e[o.name] = o.config))) : r.push(o);
  }) : Object.keys(t).forEach((o) => {
    if (Ft(t[o])) {
      t[o].init(this);
      let i = t[o];
      this[o] = i, i instanceof q.Internal && (se(i.config) || (e[t[o].name] = i.config));
    } else r.push(t[o]);
  }), r.length) throw yt(r);
  return e;
}
function Tr(n, t) {
  return t && Array.isArray(n) ? n.find((e) => e.id === t) : n;
}
function Ir(n, t) {
  var s;
  let e = (s = t.data.response) == null ? void 0 : s.id, r = Tr(n, e);
  if (e && r) {
    let o = new F2(r).applyResult(t.data.response.result).applyError(t.data.response.error);
    return { id: e, response: o };
  }
  return {};
}
function br(n, t, e) {
  return m2(this, null, function* () {
    var a2;
    let r = yield y2("rt"), s;
    if (h2.platform === "web") try {
      s = (a2 = yield y2("jwt")) != null ? a2 : yield Lt();
    } catch (c2) {
      console.error("webcrypto error", c2);
    }
    let o = { msgType: n, payload: t };
    s && (o.jwt = s), s && r && (o.rt = r);
    let i = yield Dt(e);
    return i && (o.deviceShare = i), o;
  });
}
function wr(n) {
  return m2(this, null, function* () {
    !n.data.rt || (yield M("rt", n.data.rt));
  });
}
var Gt, ue, Kt, jt, Bt, Vt, He, Ht, ze, Xt, Xe, B, V2, zt, Yt, Qt, Zt, m2, wt, tn, $e, nn, f2, re, Ye, it, rn, sn, Qe, pe, Ze, et, te, E2, on, H2, an, cn, ln, dn, un, pn, hn, mn, fn, En, yn, gn, Rn, Ae, ne, D2, tt, nt, L2, T2, R2, vn, Tn, In, rt, bn, b2, wn, Pn, Mn, xn, Nn, Cn, An, $n, Sn, Ln, at, On, st, ot, _n, kn, he, me, ct, h2, pt, $, _2, U2, X, oe, Vn, Tt, F2, Pt, Oe, Mt, P, j, ve, ae, Te, y2, M, N2, nr, rr, sr, or, ke, qe, Ie, St, ir, ar, De, Ue, We, Fe, hr, be, we, Pe, ee, Me, Wt, xe, Ke, q, Ne, le, Ce, Be;
var init_es2 = __esm({
  "../../node_modules/.pnpm/@magic-sdk+provider@28.5.0_localforage@1.10.0/node_modules/@magic-sdk/provider/dist/es/index.mjs"() {
    "use strict";
    init_es();
    init_es();
    init_es();
    init_es();
    init_es();
    init_es();
    init_es();
    init_es();
    init_es();
    init_es();
    Gt = Object.create;
    ue = Object.defineProperty;
    Kt = Object.defineProperties;
    jt = Object.getOwnPropertyDescriptor;
    Bt = Object.getOwnPropertyDescriptors;
    Vt = Object.getOwnPropertyNames;
    He = Object.getOwnPropertySymbols;
    Ht = Object.getPrototypeOf;
    ze = Object.prototype.hasOwnProperty;
    Xt = Object.prototype.propertyIsEnumerable;
    Xe = (n, t, e) => t in n ? ue(n, t, { enumerable: true, configurable: true, writable: true, value: e }) : n[t] = e;
    B = (n, t) => {
      for (var e in t || (t = {})) ze.call(t, e) && Xe(n, e, t[e]);
      if (He) for (var e of He(t)) Xt.call(t, e) && Xe(n, e, t[e]);
      return n;
    };
    V2 = (n, t) => Kt(n, Bt(t));
    zt = (n, t) => () => (t || n((t = { exports: {} }).exports, t), t.exports);
    Yt = (n, t) => {
      for (var e in t) ue(n, e, { get: t[e], enumerable: true });
    };
    Qt = (n, t, e, r) => {
      if (t && typeof t == "object" || typeof t == "function") for (let s of Vt(t)) !ze.call(n, s) && s !== e && ue(n, s, { get: () => t[s], enumerable: !(r = jt(t, s)) || r.enumerable });
      return n;
    };
    Zt = (n, t, e) => (e = n != null ? Gt(Ht(n)) : {}, Qt(t || !n || !n.__esModule ? ue(e, "default", { value: n, enumerable: true }) : e, n));
    m2 = (n, t, e) => new Promise((r, s) => {
      var o = (c2) => {
        try {
          a2(e.next(c2));
        } catch (l) {
          s(l);
        }
      }, i = (c2) => {
        try {
          a2(e.throw(c2));
        } catch (l) {
          s(l);
        }
      }, a2 = (c2) => c2.done ? r(c2.value) : Promise.resolve(c2.value).then(o, i);
      a2((e = e.apply(n, t)).next());
    });
    wt = zt((jr, Le) => {
      "use strict";
      var Xn = Object.prototype.hasOwnProperty, w2 = "~";
      function ie() {
      }
      Object.create && (ie.prototype = /* @__PURE__ */ Object.create(null), new ie().__proto__ || (w2 = false));
      function zn(n, t, e) {
        this.fn = n, this.context = t, this.once = e || false;
      }
      function bt2(n, t, e, r, s) {
        if (typeof e != "function") throw new TypeError("The listener must be a function");
        var o = new zn(e, r || n, s), i = w2 ? w2 + t : t;
        return n._events[i] ? n._events[i].fn ? n._events[i] = [n._events[i], o] : n._events[i].push(o) : (n._events[i] = o, n._eventsCount++), n;
      }
      function ge2(n, t) {
        --n._eventsCount === 0 ? n._events = new ie() : delete n._events[t];
      }
      function I2() {
        this._events = new ie(), this._eventsCount = 0;
      }
      I2.prototype.eventNames = function() {
        var t = [], e, r;
        if (this._eventsCount === 0) return t;
        for (r in e = this._events) Xn.call(e, r) && t.push(w2 ? r.slice(1) : r);
        return Object.getOwnPropertySymbols ? t.concat(Object.getOwnPropertySymbols(e)) : t;
      };
      I2.prototype.listeners = function(t) {
        var e = w2 ? w2 + t : t, r = this._events[e];
        if (!r) return [];
        if (r.fn) return [r.fn];
        for (var s = 0, o = r.length, i = new Array(o); s < o; s++) i[s] = r[s].fn;
        return i;
      };
      I2.prototype.listenerCount = function(t) {
        var e = w2 ? w2 + t : t, r = this._events[e];
        return r ? r.fn ? 1 : r.length : 0;
      };
      I2.prototype.emit = function(t, e, r, s, o, i) {
        var a2 = w2 ? w2 + t : t;
        if (!this._events[a2]) return false;
        var c2 = this._events[a2], l = arguments.length, d2, p2;
        if (c2.fn) {
          switch (c2.once && this.removeListener(t, c2.fn, void 0, true), l) {
            case 1:
              return c2.fn.call(c2.context), true;
            case 2:
              return c2.fn.call(c2.context, e), true;
            case 3:
              return c2.fn.call(c2.context, e, r), true;
            case 4:
              return c2.fn.call(c2.context, e, r, s), true;
            case 5:
              return c2.fn.call(c2.context, e, r, s, o), true;
            case 6:
              return c2.fn.call(c2.context, e, r, s, o, i), true;
          }
          for (p2 = 1, d2 = new Array(l - 1); p2 < l; p2++) d2[p2 - 1] = arguments[p2];
          c2.fn.apply(c2.context, d2);
        } else {
          var x2 = c2.length, v2;
          for (p2 = 0; p2 < x2; p2++) switch (c2[p2].once && this.removeListener(t, c2[p2].fn, void 0, true), l) {
            case 1:
              c2[p2].fn.call(c2[p2].context);
              break;
            case 2:
              c2[p2].fn.call(c2[p2].context, e);
              break;
            case 3:
              c2[p2].fn.call(c2[p2].context, e, r);
              break;
            case 4:
              c2[p2].fn.call(c2[p2].context, e, r, s);
              break;
            default:
              if (!d2) for (v2 = 1, d2 = new Array(l - 1); v2 < l; v2++) d2[v2 - 1] = arguments[v2];
              c2[p2].fn.apply(c2[p2].context, d2);
          }
        }
        return true;
      };
      I2.prototype.on = function(t, e, r) {
        return bt2(this, t, e, r, false);
      };
      I2.prototype.once = function(t, e, r) {
        return bt2(this, t, e, r, true);
      };
      I2.prototype.removeListener = function(t, e, r, s) {
        var o = w2 ? w2 + t : t;
        if (!this._events[o]) return this;
        if (!e) return ge2(this, o), this;
        var i = this._events[o];
        if (i.fn) i.fn === e && (!s || i.once) && (!r || i.context === r) && ge2(this, o);
        else {
          for (var a2 = 0, c2 = [], l = i.length; a2 < l; a2++) (i[a2].fn !== e || s && !i[a2].once || r && i[a2].context !== r) && c2.push(i[a2]);
          c2.length ? this._events[o] = c2.length === 1 ? c2[0] : c2 : ge2(this, o);
        }
        return this;
      };
      I2.prototype.removeAllListeners = function(t) {
        var e;
        return t ? (e = w2 ? w2 + t : t, this._events[e] && ge2(this, e)) : (this._events = new ie(), this._eventsCount = 0), this;
      };
      I2.prototype.off = I2.prototype.removeListener;
      I2.prototype.addListener = I2.prototype.on;
      I2.prefixed = w2;
      I2.EventEmitter = I2;
      typeof Le < "u" && (Le.exports = I2);
    });
    tn = Number.MAX_SAFE_INTEGER || 9007199254740991;
    $e = { SEMVER_SPEC_VERSION: "2.0.0", MAX_LENGTH: 256, MAX_SAFE_INTEGER: tn, MAX_SAFE_COMPONENT_LENGTH: 16 };
    nn = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...n) => console.error("SEMVER", ...n) : () => {
    };
    f2 = nn;
    re = en(function(n, t) {
      let { MAX_SAFE_COMPONENT_LENGTH: e } = $e, r = (t = n.exports = {}).re = [], s = t.src = [], o = t.t = {}, i = 0, a2 = (c2, l, d2) => {
        let p2 = i++;
        f2(p2, l), o[c2] = p2, s[p2] = l, r[p2] = new RegExp(l, d2 ? "g" : void 0);
      };
      a2("NUMERICIDENTIFIER", "0|[1-9]\\d*"), a2("NUMERICIDENTIFIERLOOSE", "[0-9]+"), a2("NONNUMERICIDENTIFIER", "\\d*[a-zA-Z-][a-zA-Z0-9-]*"), a2("MAINVERSION", `(${s[o.NUMERICIDENTIFIER]})\\.(${s[o.NUMERICIDENTIFIER]})\\.(${s[o.NUMERICIDENTIFIER]})`), a2("MAINVERSIONLOOSE", `(${s[o.NUMERICIDENTIFIERLOOSE]})\\.(${s[o.NUMERICIDENTIFIERLOOSE]})\\.(${s[o.NUMERICIDENTIFIERLOOSE]})`), a2("PRERELEASEIDENTIFIER", `(?:${s[o.NUMERICIDENTIFIER]}|${s[o.NONNUMERICIDENTIFIER]})`), a2("PRERELEASEIDENTIFIERLOOSE", `(?:${s[o.NUMERICIDENTIFIERLOOSE]}|${s[o.NONNUMERICIDENTIFIER]})`), a2("PRERELEASE", `(?:-(${s[o.PRERELEASEIDENTIFIER]}(?:\\.${s[o.PRERELEASEIDENTIFIER]})*))`), a2("PRERELEASELOOSE", `(?:-?(${s[o.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${s[o.PRERELEASEIDENTIFIERLOOSE]})*))`), a2("BUILDIDENTIFIER", "[0-9A-Za-z-]+"), a2("BUILD", `(?:\\+(${s[o.BUILDIDENTIFIER]}(?:\\.${s[o.BUILDIDENTIFIER]})*))`), a2("FULLPLAIN", `v?${s[o.MAINVERSION]}${s[o.PRERELEASE]}?${s[o.BUILD]}?`), a2("FULL", `^${s[o.FULLPLAIN]}$`), a2("LOOSEPLAIN", `[v=\\s]*${s[o.MAINVERSIONLOOSE]}${s[o.PRERELEASELOOSE]}?${s[o.BUILD]}?`), a2("LOOSE", `^${s[o.LOOSEPLAIN]}$`), a2("GTLT", "((?:<|>)?=?)"), a2("XRANGEIDENTIFIERLOOSE", `${s[o.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), a2("XRANGEIDENTIFIER", `${s[o.NUMERICIDENTIFIER]}|x|X|\\*`), a2("XRANGEPLAIN", `[v=\\s]*(${s[o.XRANGEIDENTIFIER]})(?:\\.(${s[o.XRANGEIDENTIFIER]})(?:\\.(${s[o.XRANGEIDENTIFIER]})(?:${s[o.PRERELEASE]})?${s[o.BUILD]}?)?)?`), a2("XRANGEPLAINLOOSE", `[v=\\s]*(${s[o.XRANGEIDENTIFIERLOOSE]})(?:\\.(${s[o.XRANGEIDENTIFIERLOOSE]})(?:\\.(${s[o.XRANGEIDENTIFIERLOOSE]})(?:${s[o.PRERELEASELOOSE]})?${s[o.BUILD]}?)?)?`), a2("XRANGE", `^${s[o.GTLT]}\\s*${s[o.XRANGEPLAIN]}$`), a2("XRANGELOOSE", `^${s[o.GTLT]}\\s*${s[o.XRANGEPLAINLOOSE]}$`), a2("COERCE", `(^|[^\\d])(\\d{1,${e}})(?:\\.(\\d{1,${e}}))?(?:\\.(\\d{1,${e}}))?(?:$|[^\\d])`), a2("COERCERTL", s[o.COERCE], true), a2("LONETILDE", "(?:~>?)"), a2("TILDETRIM", `(\\s*)${s[o.LONETILDE]}\\s+`, true), t.tildeTrimReplace = "$1~", a2("TILDE", `^${s[o.LONETILDE]}${s[o.XRANGEPLAIN]}$`), a2("TILDELOOSE", `^${s[o.LONETILDE]}${s[o.XRANGEPLAINLOOSE]}$`), a2("LONECARET", "(?:\\^)"), a2("CARETTRIM", `(\\s*)${s[o.LONECARET]}\\s+`, true), t.caretTrimReplace = "$1^", a2("CARET", `^${s[o.LONECARET]}${s[o.XRANGEPLAIN]}$`), a2("CARETLOOSE", `^${s[o.LONECARET]}${s[o.XRANGEPLAINLOOSE]}$`), a2("COMPARATORLOOSE", `^${s[o.GTLT]}\\s*(${s[o.LOOSEPLAIN]})$|^$`), a2("COMPARATOR", `^${s[o.GTLT]}\\s*(${s[o.FULLPLAIN]})$|^$`), a2("COMPARATORTRIM", `(\\s*)${s[o.GTLT]}\\s*(${s[o.LOOSEPLAIN]}|${s[o.XRANGEPLAIN]})`, true), t.comparatorTrimReplace = "$1$2$3", a2("HYPHENRANGE", `^\\s*(${s[o.XRANGEPLAIN]})\\s+-\\s+(${s[o.XRANGEPLAIN]})\\s*$`), a2("HYPHENRANGELOOSE", `^\\s*(${s[o.XRANGEPLAINLOOSE]})\\s+-\\s+(${s[o.XRANGEPLAINLOOSE]})\\s*$`), a2("STAR", "(<|>)?=?\\s*\\*"), a2("GTE0", "^\\s*>=\\s*0.0.0\\s*$"), a2("GTE0PRE", "^\\s*>=\\s*0.0.0-0\\s*$");
    });
    Ye = /^[0-9]+$/;
    it = (n, t) => {
      let e = Ye.test(n), r = Ye.test(t);
      return e && r && (n = +n, t = +t), n === t ? 0 : e && !r ? -1 : r && !e ? 1 : n < t ? -1 : 1;
    };
    rn = (n, t) => it(t, n);
    sn = { compareIdentifiers: it, rcompareIdentifiers: rn };
    ({ MAX_LENGTH: Qe, MAX_SAFE_INTEGER: pe } = $e);
    ({ re: Ze, t: et } = re);
    ({ compareIdentifiers: te } = sn);
    E2 = class {
      constructor(t, e) {
        if (e && typeof e == "object" || (e = { loose: !!e, includePrerelease: false }), t instanceof E2) {
          if (t.loose === !!e.loose && t.includePrerelease === !!e.includePrerelease) return t;
          t = t.version;
        } else if (typeof t != "string") throw new TypeError(`Invalid Version: ${t}`);
        if (t.length > Qe) throw new TypeError(`version is longer than ${Qe} characters`);
        f2("SemVer", t, e), this.options = e, this.loose = !!e.loose, this.includePrerelease = !!e.includePrerelease;
        let r = t.trim().match(e.loose ? Ze[et.LOOSE] : Ze[et.FULL]);
        if (!r) throw new TypeError(`Invalid Version: ${t}`);
        if (this.raw = t, this.major = +r[1], this.minor = +r[2], this.patch = +r[3], this.major > pe || this.major < 0) throw new TypeError("Invalid major version");
        if (this.minor > pe || this.minor < 0) throw new TypeError("Invalid minor version");
        if (this.patch > pe || this.patch < 0) throw new TypeError("Invalid patch version");
        r[4] ? this.prerelease = r[4].split(".").map((s) => {
          if (/^[0-9]+$/.test(s)) {
            let o = +s;
            if (o >= 0 && o < pe) return o;
          }
          return s;
        }) : this.prerelease = [], this.build = r[5] ? r[5].split(".") : [], this.format();
      }
      format() {
        return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
      }
      toString() {
        return this.version;
      }
      compare(t) {
        if (f2("SemVer.compare", this.version, this.options, t), !(t instanceof E2)) {
          if (typeof t == "string" && t === this.version) return 0;
          t = new E2(t, this.options);
        }
        return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
      }
      compareMain(t) {
        return t instanceof E2 || (t = new E2(t, this.options)), te(this.major, t.major) || te(this.minor, t.minor) || te(this.patch, t.patch);
      }
      comparePre(t) {
        if (t instanceof E2 || (t = new E2(t, this.options)), this.prerelease.length && !t.prerelease.length) return -1;
        if (!this.prerelease.length && t.prerelease.length) return 1;
        if (!this.prerelease.length && !t.prerelease.length) return 0;
        let e = 0;
        do {
          let r = this.prerelease[e], s = t.prerelease[e];
          if (f2("prerelease compare", e, r, s), r === void 0 && s === void 0) return 0;
          if (s === void 0) return 1;
          if (r === void 0) return -1;
          if (r !== s) return te(r, s);
        } while (++e);
      }
      compareBuild(t) {
        t instanceof E2 || (t = new E2(t, this.options));
        let e = 0;
        do {
          let r = this.build[e], s = t.build[e];
          if (f2("prerelease compare", e, r, s), r === void 0 && s === void 0) return 0;
          if (s === void 0) return 1;
          if (r === void 0) return -1;
          if (r !== s) return te(r, s);
        } while (++e);
      }
      inc(t, e) {
        switch (t) {
          case "premajor":
            this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", e);
            break;
          case "preminor":
            this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", e);
            break;
          case "prepatch":
            this.prerelease.length = 0, this.inc("patch", e), this.inc("pre", e);
            break;
          case "prerelease":
            this.prerelease.length === 0 && this.inc("patch", e), this.inc("pre", e);
            break;
          case "major":
            this.minor === 0 && this.patch === 0 && this.prerelease.length !== 0 || this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
            break;
          case "minor":
            this.patch === 0 && this.prerelease.length !== 0 || this.minor++, this.patch = 0, this.prerelease = [];
            break;
          case "patch":
            this.prerelease.length === 0 && this.patch++, this.prerelease = [];
            break;
          case "pre":
            if (this.prerelease.length === 0) this.prerelease = [0];
            else {
              let r = this.prerelease.length;
              for (; --r >= 0; ) typeof this.prerelease[r] == "number" && (this.prerelease[r]++, r = -2);
              r === -1 && this.prerelease.push(0);
            }
            e && (this.prerelease[0] === e ? isNaN(this.prerelease[1]) && (this.prerelease = [e, 0]) : this.prerelease = [e, 0]);
            break;
          default:
            throw new Error(`invalid increment argument: ${t}`);
        }
        return this.format(), this.raw = this.version, this;
      }
    };
    on = (n, t, e) => new E2(n, e).compare(new E2(t, e));
    H2 = on;
    an = (n, t, e) => H2(n, t, e) === 0;
    cn = an;
    ln = (n, t, e) => H2(n, t, e) !== 0;
    dn = ln;
    un = (n, t, e) => H2(n, t, e) > 0;
    pn = un;
    hn = (n, t, e) => H2(n, t, e) >= 0;
    mn = hn;
    fn = (n, t, e) => H2(n, t, e) < 0;
    En = fn;
    yn = (n, t, e) => H2(n, t, e) <= 0;
    gn = yn;
    Rn = (n, t, e, r) => {
      switch (t) {
        case "===":
          return typeof n == "object" && (n = n.version), typeof e == "object" && (e = e.version), n === e;
        case "!==":
          return typeof n == "object" && (n = n.version), typeof e == "object" && (e = e.version), n !== e;
        case "":
        case "=":
        case "==":
          return cn(n, e, r);
        case "!=":
          return dn(n, e, r);
        case ">":
          return pn(n, e, r);
        case ">=":
          return mn(n, e, r);
        case "<":
          return En(n, e, r);
        case "<=":
          return gn(n, e, r);
        default:
          throw new TypeError(`Invalid operator: ${t}`);
      }
    };
    Ae = Rn;
    ne = Symbol("SemVer ANY");
    D2 = class {
      static get ANY() {
        return ne;
      }
      constructor(t, e) {
        if (e && typeof e == "object" || (e = { loose: !!e, includePrerelease: false }), t instanceof D2) {
          if (t.loose === !!e.loose) return t;
          t = t.value;
        }
        f2("comparator", t, e), this.options = e, this.loose = !!e.loose, this.parse(t), this.semver === ne ? this.value = "" : this.value = this.operator + this.semver.version, f2("comp", this);
      }
      parse(t) {
        let e = this.options.loose ? tt[nt.COMPARATORLOOSE] : tt[nt.COMPARATOR], r = t.match(e);
        if (!r) throw new TypeError(`Invalid comparator: ${t}`);
        this.operator = r[1] !== void 0 ? r[1] : "", this.operator === "=" && (this.operator = ""), r[2] ? this.semver = new E2(r[2], this.options.loose) : this.semver = ne;
      }
      toString() {
        return this.value;
      }
      test(t) {
        if (f2("Comparator.test", t, this.options.loose), this.semver === ne || t === ne) return true;
        if (typeof t == "string") try {
          t = new E2(t, this.options);
        } catch (e) {
          return false;
        }
        return Ae(t, this.operator, this.semver, this.options);
      }
      intersects(t, e) {
        if (!(t instanceof D2)) throw new TypeError("a Comparator is required");
        if (e && typeof e == "object" || (e = { loose: !!e, includePrerelease: false }), this.operator === "") return this.value === "" || new L2(t.value, e).test(this.value);
        if (t.operator === "") return t.value === "" || new L2(this.value, e).test(t.semver);
        let r = !(this.operator !== ">=" && this.operator !== ">" || t.operator !== ">=" && t.operator !== ">"), s = !(this.operator !== "<=" && this.operator !== "<" || t.operator !== "<=" && t.operator !== "<"), o = this.semver.version === t.semver.version, i = !(this.operator !== ">=" && this.operator !== "<=" || t.operator !== ">=" && t.operator !== "<="), a2 = Ae(this.semver, "<", t.semver, e) && (this.operator === ">=" || this.operator === ">") && (t.operator === "<=" || t.operator === "<"), c2 = Ae(this.semver, ">", t.semver, e) && (this.operator === "<=" || this.operator === "<") && (t.operator === ">=" || t.operator === ">");
        return r || s || o && i || a2 || c2;
      }
    };
    ({ re: tt, t: nt } = re);
    L2 = class {
      constructor(t, e) {
        if (e && typeof e == "object" || (e = { loose: !!e, includePrerelease: false }), t instanceof L2) return t.loose === !!e.loose && t.includePrerelease === !!e.includePrerelease ? t : new L2(t.raw, e);
        if (t instanceof D2) return this.raw = t.value, this.set = [[t]], this.format(), this;
        if (this.options = e, this.loose = !!e.loose, this.includePrerelease = !!e.includePrerelease, this.raw = t, this.set = t.split(/\s*\|\|\s*/).map((r) => this.parseRange(r.trim())).filter((r) => r.length), !this.set.length) throw new TypeError(`Invalid SemVer Range: ${t}`);
        this.format();
      }
      format() {
        return this.range = this.set.map((t) => t.join(" ").trim()).join("||").trim(), this.range;
      }
      toString() {
        return this.range;
      }
      parseRange(t) {
        let { loose: e } = this.options;
        t = t.trim();
        let r = e ? T2[R2.HYPHENRANGELOOSE] : T2[R2.HYPHENRANGE];
        t = t.replace(r, Sn(this.options.includePrerelease)), f2("hyphen replace", t), t = t.replace(T2[R2.COMPARATORTRIM], vn), f2("comparator trim", t, T2[R2.COMPARATORTRIM]), t = (t = (t = t.replace(T2[R2.TILDETRIM], Tn)).replace(T2[R2.CARETTRIM], In)).split(/\s+/).join(" ");
        let s = e ? T2[R2.COMPARATORLOOSE] : T2[R2.COMPARATOR];
        return t.split(" ").map((o) => bn(o, this.options)).join(" ").split(/\s+/).map((o) => $n(o, this.options)).filter(this.options.loose ? (o) => !!o.match(s) : () => true).map((o) => new D2(o, this.options));
      }
      intersects(t, e) {
        if (!(t instanceof L2)) throw new TypeError("a Range is required");
        return this.set.some((r) => rt(r, e) && t.set.some((s) => rt(s, e) && r.every((o) => s.every((i) => o.intersects(i, e)))));
      }
      test(t) {
        if (!t) return false;
        if (typeof t == "string") try {
          t = new E2(t, this.options);
        } catch (e) {
          return false;
        }
        for (let e = 0; e < this.set.length; e++) if (Ln(this.set[e], t, this.options)) return true;
        return false;
      }
    };
    ({ re: T2, t: R2, comparatorTrimReplace: vn, tildeTrimReplace: Tn, caretTrimReplace: In } = re);
    rt = (n, t) => {
      let e = true, r = n.slice(), s = r.pop();
      for (; e && r.length; ) e = r.every((o) => s.intersects(o, t)), s = r.pop();
      return e;
    };
    bn = (n, t) => (f2("comp", n, t), n = Mn(n, t), f2("caret", n), n = wn(n, t), f2("tildes", n), n = Nn(n, t), f2("xrange", n), n = An(n, t), f2("stars", n), n);
    b2 = (n) => !n || n.toLowerCase() === "x" || n === "*";
    wn = (n, t) => n.trim().split(/\s+/).map((e) => Pn(e, t)).join(" ");
    Pn = (n, t) => {
      let e = t.loose ? T2[R2.TILDELOOSE] : T2[R2.TILDE];
      return n.replace(e, (r, s, o, i, a2) => {
        let c2;
        return f2("tilde", n, r, s, o, i, a2), b2(s) ? c2 = "" : b2(o) ? c2 = `>=${s}.0.0 <${+s + 1}.0.0-0` : b2(i) ? c2 = `>=${s}.${o}.0 <${s}.${+o + 1}.0-0` : a2 ? (f2("replaceTilde pr", a2), c2 = `>=${s}.${o}.${i}-${a2} <${s}.${+o + 1}.0-0`) : c2 = `>=${s}.${o}.${i} <${s}.${+o + 1}.0-0`, f2("tilde return", c2), c2;
      });
    };
    Mn = (n, t) => n.trim().split(/\s+/).map((e) => xn(e, t)).join(" ");
    xn = (n, t) => {
      f2("caret", n, t);
      let e = t.loose ? T2[R2.CARETLOOSE] : T2[R2.CARET], r = t.includePrerelease ? "-0" : "";
      return n.replace(e, (s, o, i, a2, c2) => {
        let l;
        return f2("caret", n, s, o, i, a2, c2), b2(o) ? l = "" : b2(i) ? l = `>=${o}.0.0${r} <${+o + 1}.0.0-0` : b2(a2) ? l = o === "0" ? `>=${o}.${i}.0${r} <${o}.${+i + 1}.0-0` : `>=${o}.${i}.0${r} <${+o + 1}.0.0-0` : c2 ? (f2("replaceCaret pr", c2), l = o === "0" ? i === "0" ? `>=${o}.${i}.${a2}-${c2} <${o}.${i}.${+a2 + 1}-0` : `>=${o}.${i}.${a2}-${c2} <${o}.${+i + 1}.0-0` : `>=${o}.${i}.${a2}-${c2} <${+o + 1}.0.0-0`) : (f2("no pr"), l = o === "0" ? i === "0" ? `>=${o}.${i}.${a2}${r} <${o}.${i}.${+a2 + 1}-0` : `>=${o}.${i}.${a2}${r} <${o}.${+i + 1}.0-0` : `>=${o}.${i}.${a2} <${+o + 1}.0.0-0`), f2("caret return", l), l;
      });
    };
    Nn = (n, t) => (f2("replaceXRanges", n, t), n.split(/\s+/).map((e) => Cn(e, t)).join(" "));
    Cn = (n, t) => {
      n = n.trim();
      let e = t.loose ? T2[R2.XRANGELOOSE] : T2[R2.XRANGE];
      return n.replace(e, (r, s, o, i, a2, c2) => {
        f2("xRange", n, r, s, o, i, a2, c2);
        let l = b2(o), d2 = l || b2(i), p2 = d2 || b2(a2), x2 = p2;
        return s === "=" && x2 && (s = ""), c2 = t.includePrerelease ? "-0" : "", l ? r = s === ">" || s === "<" ? "<0.0.0-0" : "*" : s && x2 ? (d2 && (i = 0), a2 = 0, s === ">" ? (s = ">=", d2 ? (o = +o + 1, i = 0, a2 = 0) : (i = +i + 1, a2 = 0)) : s === "<=" && (s = "<", d2 ? o = +o + 1 : i = +i + 1), s === "<" && (c2 = "-0"), r = `${s + o}.${i}.${a2}${c2}`) : d2 ? r = `>=${o}.0.0${c2} <${+o + 1}.0.0-0` : p2 && (r = `>=${o}.${i}.0${c2} <${o}.${+i + 1}.0-0`), f2("xRange return", r), r;
      });
    };
    An = (n, t) => (f2("replaceStars", n, t), n.trim().replace(T2[R2.STAR], ""));
    $n = (n, t) => (f2("replaceGTE0", n, t), n.trim().replace(T2[t.includePrerelease ? R2.GTE0PRE : R2.GTE0], ""));
    Sn = (n) => (t, e, r, s, o, i, a2, c2, l, d2, p2, x2, v2) => `${e = b2(r) ? "" : b2(s) ? `>=${r}.0.0${n ? "-0" : ""}` : b2(o) ? `>=${r}.${s}.0${n ? "-0" : ""}` : i ? `>=${e}` : `>=${e}${n ? "-0" : ""}`} ${c2 = b2(l) ? "" : b2(d2) ? `<${+l + 1}.0.0-0` : b2(p2) ? `<${l}.${+d2 + 1}.0-0` : x2 ? `<=${l}.${d2}.${p2}-${x2}` : n ? `<${l}.${d2}.${+p2 + 1}-0` : `<=${c2}`}`.trim();
    Ln = (n, t, e) => {
      for (let r = 0; r < n.length; r++) if (!n[r].test(t)) return false;
      if (t.prerelease.length && !e.includePrerelease) {
        for (let r = 0; r < n.length; r++) if (f2(n[r].semver), n[r].semver !== D2.ANY && n[r].semver.prerelease.length > 0) {
          let s = n[r].semver;
          if (s.major === t.major && s.minor === t.minor && s.patch === t.patch) return true;
        }
        return false;
      }
      return true;
    };
    at = (n, t, e) => {
      try {
        t = new L2(t, e);
      } catch (r) {
        return false;
      }
      return t.test(n);
    };
    ({ MAX_LENGTH: On } = $e);
    ({ re: st, t: ot } = re);
    _n = (n, t) => {
      if (t && typeof t == "object" || (t = { loose: !!t, includePrerelease: false }), n instanceof E2) return n;
      if (typeof n != "string" || n.length > On || !(t.loose ? st[ot.LOOSE] : st[ot.FULL]).test(n)) return null;
      try {
        return new E2(n, t);
      } catch (e) {
        return null;
      }
    };
    kn = _n;
    ({ re: he, t: me } = re);
    ct = (n, t) => {
      if (n instanceof E2) return n;
      if (typeof n == "number" && (n = String(n)), typeof n != "string") return null;
      let e = null;
      if ((t = t || {}).rtl) {
        let r;
        for (; (r = he[me.COERCERTL].exec(n)) && (!e || e.index + e[0].length !== n.length); ) e && r.index + r[0].length === e.index + e[0].length || (e = r), he[me.COERCERTL].lastIndex = r.index + r[1].length + r[2].length;
        he[me.COERCERTL].lastIndex = -1;
      } else e = n.match(he[me.COERCE]);
      return e === null ? null : kn(`${e[2]}.${e[3] || "0"}.${e[4] || "0"}`, t);
    };
    h2 = {};
    pt = { "magic-sdk": "magic-sdk", "@magic-sdk/react-native": "magic-sdk-rn", "@magic-sdk/react-native-bare": "magic-sdk-rn-bare", "@magic-sdk/react-native-expo": "magic-sdk-rn-expo" };
    $ = class extends Error {
      constructor(e, r) {
        super(`Magic SDK Error: [${e}] ${r}`);
        this.code = e;
        this.rawMessage = r;
        this.__proto__ = Error;
        Object.setPrototypeOf(this, $.prototype);
      }
    };
    _2 = class extends Error {
      constructor(e) {
        super();
        this.__proto__ = Error;
        let r = Number(e == null ? void 0 : e.code);
        this.rawMessage = (e == null ? void 0 : e.message) || "Internal error", this.code = ut(r) ? r : _.InternalError, this.message = `Magic RPC Error: [${this.code}] ${this.rawMessage}`, this.data = (e == null ? void 0 : e.data) || void 0, Object.setPrototypeOf(this, _2.prototype);
      }
    };
    U2 = class {
      constructor(t, e) {
        this.code = t;
        this.rawMessage = e;
        this.message = `Magic SDK Warning: [${t}] ${e}`;
      }
      log() {
        console.warn(this.message);
      }
    };
    X = class extends Error {
      constructor(e, r, s, o) {
        super(`Magic Extension Error (${e.name}): [${r}] ${s}`);
        this.code = r;
        this.rawMessage = s;
        this.data = o;
        this.__proto__ = Error;
        Object.setPrototypeOf(this, X.prototype);
      }
    };
    oe = class {
      constructor(t, e, r) {
        this.code = e;
        this.rawMessage = r;
        this.message = `Magic Extension Warning (${t.name}): [${e}] ${r}`;
      }
      log() {
        console.warn(this.message);
      }
    };
    Vn = Bn();
    Tt = Symbol("Payload pre-processed by Magic SDK");
    F2 = class {
      constructor(t) {
        t instanceof F2 ? (this._jsonrpc = t.payload.jsonrpc, this._id = t.payload.id, this._result = t.payload.result, this._error = t.payload.error) : dt(t) ? (this._jsonrpc = t.jsonrpc, this._id = t.id, this._result = t.result, this._error = t.error) : (this._jsonrpc = t.jsonrpc, this._id = t.id, this._result = void 0, this._error = void 0);
      }
      applyError(t) {
        return this._error = t, this;
      }
      applyResult(t) {
        return this._result = t, this;
      }
      get hasError() {
        return typeof this._error != "undefined" && this._error !== null;
      }
      get hasResult() {
        return typeof this._result != "undefined";
      }
      get payload() {
        return { jsonrpc: this._jsonrpc, id: this._id, result: this._result, error: this._error };
      }
    };
    Pt = Zt(wt());
    Oe = class extends Pt.default {
    };
    Mt = Symbol("isPromiEvent");
    P = class {
      constructor(t) {
        this.sdk = t;
      }
      get overlay() {
        return this.sdk.overlay;
      }
      request(t) {
        let e = this.overlay.post(v.MAGIC_HANDLE_REQUEST, K(t)), r = k2((o, i) => {
          e.then((a2) => {
            if (s(), a2.hasError) i(new _2(a2.payload.error));
            else if (a2.hasResult) o(a2.payload.result);
            else throw ft();
          }).catch((a2) => {
            s(), i(a2);
          });
        }), s = this.overlay.on(g.MAGIC_HANDLE_EVENT, (o) => {
          var a2;
          let { response: i } = o.data;
          if (i.id === t.id && ((a2 = i.result) == null ? void 0 : a2.event)) {
            let { event: c2, params: l = [] } = i.result;
            r.emit(c2, ...l);
          }
        });
        return r;
      }
      createIntermediaryEvent(t, e) {
        return (s) => {
          let o = u2(f.IntermediaryEvent, [{ payloadId: e, eventType: t, args: s }]);
          this.request(o);
        };
      }
    };
    j = { "magic-sdk": "v18.0.0", "@magic-sdk/react-native": "v14.0.0", "@magic-sdk/react-native-bare": "v19.0.0", "@magic-sdk/react-native-expo": "v19.0.0" };
    ve = class extends P {
      loginWithMagicLink(t) {
        let e = h2.sdkName === "@magic-sdk/react-native" || h2.sdkName === "@magic-sdk/react-native-bare" || h2.sdkName === "@magic-sdk/react-native-expo";
        if (e && Nt(h2.version, 19)) throw new Error("loginWithMagicLink() is deprecated for this package, please utlize a passcode method like loginWithSMS or loginWithEmailOTP instead.");
        e && W({ method: "auth.loginWithMagicLink()", removalVersions: j, useInstead: "auth.loginWithEmailOTP()" }).log();
        let { email: r, showUI: s = true, redirectURI: o, overrides: i, lifespan: a2 } = t, c2 = u2(this.sdk.testMode ? f.LoginWithMagicLinkTestMode : f.LoginWithMagicLink, [{ email: r, showUI: s, redirectURI: o, overrides: i, lifespan: a2 }]);
        return this.request(c2);
      }
      loginWithSMS(t) {
        let { phoneNumber: e, lifespan: r } = t, s = u2(this.sdk.testMode ? f.LoginWithSmsTestMode : f.LoginWithSms, [{ phoneNumber: e, showUI: true, lifespan: r }]);
        return this.request(s);
      }
      loginWithEmailOTP(t) {
        let { email: e, showUI: r, deviceCheckUI: s, overrides: o, lifespan: i } = t, a2 = u2(this.sdk.testMode ? f.LoginWithEmailOTPTestMode : f.LoginWithEmailOTP, [{ email: e, showUI: r, deviceCheckUI: s, overrides: o, lifespan: i }]), c2 = this.request(a2);
        return !s && c2 && c2.on(h.Retry, () => {
          this.createIntermediaryEvent(h.Retry, a2.id)();
        }), !r && c2 && (c2.on(N.VerifyEmailOtp, (l) => {
          this.createIntermediaryEvent(N.VerifyEmailOtp, a2.id)(l);
        }), c2.on(N.VerifyMFACode, (l) => {
          this.createIntermediaryEvent(N.VerifyMFACode, a2.id)(l);
        }), c2.on(N.Cancel, () => {
          this.createIntermediaryEvent(N.Cancel, a2.id)();
        })), c2;
      }
      loginWithCredential(t) {
        let { credentialOrQueryString: e, lifespan: r } = t || {}, s = e != null ? e : "";
        if (!e && h2.platform === "web") {
          s = window.location.search;
          let i = window.location.origin + window.location.pathname;
          window.history.replaceState(null, "", i);
        }
        let o = u2(this.sdk.testMode ? f.LoginWithCredentialTestMode : f.LoginWithCredential, [s, r]);
        return this.request(o);
      }
      setAuthorizationToken(t) {
        let e = u2(f.SetAuthorizationToken, [{ jwt: t }]);
        return this.request(e);
      }
      updateEmailWithUI(t) {
        let { email: e, showUI: r = true } = t, s = u2(this.sdk.testMode ? f.UpdateEmailTestMode : f.UpdateEmail, [{ email: e, showUI: r }]), o = this.request(s);
        return r || (o.on(O.Retry, () => {
          this.createIntermediaryEvent(O.Retry, s.id)();
        }), o.on(O.Cancel, () => {
          this.createIntermediaryEvent(O.Cancel, s.id)();
        }), o.on(O.VerifyEmailOtp, (i) => {
          this.createIntermediaryEvent(O.VerifyEmailOtp, s.id)(i);
        }), o.on(O.VerifyMFACode, (i) => {
          this.createIntermediaryEvent(O.VerifyMFACode, s.id)(i);
        }), o.on(S.RetryWithNewEmail, (i) => {
          this.createIntermediaryEvent(S.RetryWithNewEmail, s.id)(i);
        }), o.on(S.Cancel, () => {
          this.createIntermediaryEvent(S.Cancel, s.id)();
        }), o.on(S.VerifyEmailOtp, (i) => {
          this.createIntermediaryEvent(S.VerifyEmailOtp, s.id)(i);
        })), o;
      }
    };
    ae = {};
    Yt(ae, { clear: () => nr, getItem: () => y2, iterate: () => ke, key: () => sr, keys: () => or, length: () => rr, removeItem: () => N2, setItem: () => M });
    y2 = G2("getItem");
    M = G2("setItem");
    N2 = G2("removeItem");
    nr = G2("clear");
    rr = G2("length");
    sr = G2("key");
    or = G2("keys");
    ke = G2("iterate");
    qe = "STORE_KEY_PRIVATE_KEY";
    Ie = "STORE_KEY_PUBLIC_JWK";
    St = "ECDSA";
    ir = "P-256";
    ar = { name: St, namedCurve: ir };
    De = "ds";
    Ue = "ek";
    We = "iv";
    Fe = "AES-GCM";
    hr = 256;
    be = class extends P {
      constructor() {
        super(...arguments);
        this.localForageKey = "mc_active_wallet";
        this.localForageIsLoggedInKey = "magic_auth_is_logged_in";
        this.userLoggedOutCallbacks = [];
      }
      getIdToken(e) {
        let r = u2(this.sdk.testMode ? f.GetIdTokenTestMode : f.GetIdToken, [e]);
        return this.request(r);
      }
      generateIdToken(e) {
        let r = u2(this.sdk.testMode ? f.GenerateIdTokenTestMode : f.GenerateIdToken, [e]);
        return this.request(r);
      }
      getInfo() {
        return m2(this, null, function* () {
          let e = yield y2(this.localForageKey), r = u2(f.GetInfo, [{ walletType: e }]);
          return this.request(r);
        });
      }
      isLoggedIn() {
        return k2((e, r) => m2(this, null, function* () {
          try {
            let s = false;
            this.sdk.useStorageCache && (s = (yield y2(this.localForageIsLoggedInKey)) === "true", s && e(true));
            let o = u2(this.sdk.testMode ? f.IsLoggedInTestMode : f.IsLoggedIn), i = yield this.request(o);
            this.sdk.useStorageCache && (i ? M(this.localForageIsLoggedInKey, true) : N2(this.localForageIsLoggedInKey), s && !i && this.emitUserLoggedOut(true)), e(i);
          } catch (s) {
            r(s);
          }
        }));
      }
      logout() {
        return N2(this.localForageKey), N2(this.localForageIsLoggedInKey), Z(), k2((e, r) => m2(this, null, function* () {
          try {
            let s = u2(this.sdk.testMode ? f.LogoutTestMode : f.Logout), o = yield this.request(s);
            this.sdk.useStorageCache && this.emitUserLoggedOut(o), e(o);
          } catch (s) {
            r(s);
          }
        }));
      }
      requestInfoWithUI(e) {
        let r = u2(f.RequestUserInfoWithUI, e ? [e] : []);
        return this.request(r);
      }
      showSettings(e) {
        let r = u2(this.sdk.testMode ? f.UserSettingsTestMode : f.UserSettings, [e]);
        return this.request(r);
      }
      recoverAccount(e) {
        let r = u2(this.sdk.testMode ? f.RecoverAccountTestMode : f.RecoverAccount, [e]);
        return this.request(r);
      }
      revealPrivateKey() {
        let e = u2(f.RevealPK);
        return this.request(e);
      }
      getMetadata() {
        W({ method: "user.getMetadata()", removalVersions: j, useInstead: "user.getInfo()" }).log();
        let e = u2(this.sdk.testMode ? f.GetMetadataTestMode : f.GetMetadata);
        return this.request(e);
      }
      onUserLoggedOut(e) {
        this.userLoggedOutCallbacks.push(e);
      }
      enableMFA() {
        let e = u2(f.EnableMFA);
        return this.request(e);
      }
      disableMFA() {
        let e = u2(f.DisableMFA);
        return this.request(e);
      }
      emitUserLoggedOut(e) {
        this.userLoggedOutCallbacks.forEach((r) => {
          r(e);
        });
      }
    };
    we = class extends P {
      constructor() {
        super(...arguments);
        this.localForageKey = "mc_active_wallet";
      }
      connectWithUI() {
        let e = k2((r, s) => m2(this, null, function* () {
          try {
            if (this.isMetaMaskBrowser() && (yield this.isWalletEnabled(u.MetaMask))) {
              let l = yield this.autoConnectIfWalletBrowser(u.MetaMask);
              r(l);
              return;
            }
            if (this.isCoinbaseWalletBrowser() && (yield this.isWalletEnabled(u.CoinbaseWallet))) {
              let l = yield this.autoConnectIfWalletBrowser(u.CoinbaseWallet);
              r(l);
              return;
            }
            let o = this.getUserEnv(), i = u2(f.Login, [o]), a2 = this.request(i);
            a2.on(d.WalletSelected, (l) => this.handleWalletSelected(V2(B({}, l), { payloadId: i.id }))), a2.on("id-token-created", (l) => {
              e.emit("id-token-created", l);
            });
            let c2 = yield a2;
            c2.error && s(c2), r(c2);
          } catch (o) {
            s(o);
          }
        }));
        return e;
      }
      showUI(e) {
        return this.request(u2(f.ShowUI, [e]));
      }
      showAddress() {
        return this.request(u2(f.ShowAddress));
      }
      showSendTokensUI() {
        return this.request(u2(f.ShowSendTokensUI));
      }
      showOnRamp() {
        return this.request(u2(f.ShowOnRamp));
      }
      showNFTs() {
        return this.request(u2(f.ShowNFTs));
      }
      showBalances() {
        return this.request(u2(f.ShowBalances));
      }
      sendGaslessTransaction(e, r) {
        return this.request(u2(f.SendGaslessTransaction, [e, r]));
      }
      getInfo() {
        return m2(this, null, function* () {
          W({ method: "wallet.getInfo()", removalVersions: j, useInstead: "user.getInfo()" }).log();
          let e = yield y2(this.localForageKey), r = u2(f.GetInfo, [{ walletType: e }]);
          return this.request(r);
        });
      }
      disconnect() {
        W({ method: "wallet.disconnect()", removalVersions: j, useInstead: "user.logout()" }).log(), N2(this.localForageKey), Z();
        let e = u2(f.Disconnect);
        return this.request(e);
      }
      requestUserInfoWithUI(e) {
        W({ method: "wallet.requestUserInfoWithUI()", removalVersions: j, useInstead: "user.requestUserInfoWithUI()" }).log();
        let r = u2(f.RequestUserInfoWithUI, e ? [e] : []);
        return this.request(r);
      }
      getProvider() {
        return m2(this, null, function* () {
          switch (yield y2(this.localForageKey)) {
            case u.MetaMask:
              return this.getMetaMaskProvider();
            case u.CoinbaseWallet:
              return this.getCoinbaseProvider();
            default:
              return this.sdk.rpcProvider;
          }
        });
      }
      isMetaMaskInstalled() {
        var e, r, s;
        return ((e = window.ethereum) == null ? void 0 : e.isMetaMask) || !!((s = (r = window.ethereum) == null ? void 0 : r.providers) != null && s.find((o) => o == null ? void 0 : o.isMetaMask));
      }
      isMetaMaskBrowser() {
        return this.isMobile() && this.isMetaMaskInstalled();
      }
      getMetaMaskProvider() {
        var e, r;
        return ((r = (e = window.ethereum) == null ? void 0 : e.providers) == null ? void 0 : r.find((s) => s == null ? void 0 : s.isMetaMask)) || window.ethereum;
      }
      connectToMetaMask() {
        if (this.isMobile() && !this.isMetaMaskInstalled()) {
          let e = `https://metamask.app.link/dapp/${window.location.href.replace(/(^\w+:|^)\/\//, "")}`;
          window.location.href = e;
        }
        return this.getMetaMaskProvider().request({ method: "eth_requestAccounts" });
      }
      isCoinbaseWalletInstalled() {
        var e, r, s;
        return ((e = window.ethereum) == null ? void 0 : e.isCoinbaseWallet) || !!((s = (r = window.ethereum) == null ? void 0 : r.providers) != null && s.find((o) => o == null ? void 0 : o.isCoinbaseWallet));
      }
      isCoinbaseWalletBrowser() {
        var e;
        return !!((e = window.ethereum) != null && e.isCoinbaseBrowser);
      }
      getCoinbaseProvider() {
        var e, r;
        return ((r = (e = window.ethereum) == null ? void 0 : e.providers) == null ? void 0 : r.find((s) => s == null ? void 0 : s.isCoinbaseWallet)) || window.ethereum;
      }
      connectToCoinbaseWallet() {
        if (this.isMobile() && !this.isCoinbaseWalletBrowser()) {
          let r = `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(window.location.href)}`;
          window.location.href = r;
        }
        return this.getCoinbaseProvider().request({ method: "eth_requestAccounts" });
      }
      isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Silk|Opera Mini/i.test(navigator.userAgent);
      }
      getUserEnv() {
        return { env: { isMetaMaskInstalled: this.isMetaMaskInstalled(), isCoinbaseWalletInstalled: this.isCoinbaseWalletInstalled() } };
      }
      connectToThirdPartyWallet(e) {
        switch (e) {
          case u.MetaMask:
            return this.connectToMetaMask();
          case u.CoinbaseWallet:
            return this.connectToCoinbaseWallet();
          default:
            throw new Error(`Invalid provider: ${e}. Must be one of "metamask" or "coinbase_wallet".`);
        }
      }
      isWalletEnabled(e) {
        let r = u2("mc_is_wallet_enabled", [{ wallet: e }]);
        return this.request(r);
      }
      handleWalletSelected(e) {
        return m2(this, null, function* () {
          try {
            let r = yield this.connectToThirdPartyWallet(e.wallet);
            yield M(this.localForageKey, e.wallet), this.createIntermediaryEvent(d.WalletConnected, e.payloadId)(r);
          } catch (r) {
            console.error(r), this.createIntermediaryEvent(d.WalletRejected, e.payloadId)();
          }
        });
      }
      autoConnectIfWalletBrowser(e) {
        return m2(this, null, function* () {
          let r;
          e === u.MetaMask && (r = yield this.getMetaMaskProvider().request({ method: "eth_requestAccounts" })), e === u.CoinbaseWallet && (r = yield this.getCoinbaseProvider().request({ method: "eth_requestAccounts" })), yield M(this.localForageKey, e);
          let s = u2(f.AutoConnect, [{ wallet: e, address: r }]);
          return this.request(s);
        });
      }
    };
    ({ createBoundEmitterMethod: Pe, createChainingEmitterMethod: ee } = Re());
    Me = class extends P {
      constructor() {
        super(...arguments);
        this.isMagic = true;
        this.on = ee("on", this);
        this.once = ee("once", this);
        this.addListener = ee("addListener", this);
        this.off = ee("off", this);
        this.removeListener = ee("removeListener", this);
        this.removeAllListeners = ee("removeAllListeners", this);
        this.emit = Pe("emit");
        this.eventNames = Pe("eventNames");
        this.listeners = Pe("listeners");
        this.listenerCount = Pe("listenerCount");
      }
      sendAsync(e, r) {
        if (!r) throw gt({ procedure: "Magic.rpcProvider.sendAsync", argument: 1, expected: "function", received: r === null ? "null" : typeof r });
        if (Array.isArray(e)) this.overlay.post(v.MAGIC_HANDLE_REQUEST, e.map((s) => {
          let o = K(s);
          return this.prefixPayloadMethodForTestMode(o), o;
        })).then((s) => {
          r(null, s.map((o) => V2(B({}, o.payload), { error: o.hasError ? new _2(o.payload.error) : null })));
        });
        else {
          let s = K(e);
          this.prefixPayloadMethodForTestMode(s), this.overlay.post(v.MAGIC_HANDLE_REQUEST, s).then((o) => {
            r(o.hasError ? new _2(o.payload.error) : null, o.payload);
          });
        }
      }
      send(e, r) {
        if (typeof e == "string") {
          let o = u2(e, Array.isArray(r) ? r : []);
          return this.request(o);
        }
        if (Array.isArray(e) || !!r) {
          this.sendAsync(e, r);
          return;
        }
        let s = Rt();
        return s.log(), new F2(e).applyError({ code: -32603, message: s.rawMessage }).payload;
      }
      enable() {
        let e = u2(f.Login);
        return this.request(e);
      }
      request(e) {
        return this.prefixPayloadMethodForTestMode(e), super.request(e);
      }
      prefixPayloadMethodForTestMode(e) {
        let r = "testMode/eth/";
        this.sdk.testMode && (e.method = `${r}${e.method}`);
      }
    };
    Wt = ["request", "overlay", "sdk"];
    xe = class extends P {
      constructor() {
        super(void 0);
        this.__sdk_access_field_descriptors__ = /* @__PURE__ */ new Map();
        this.__is_initialized__ = false;
        this.utils = { createPromiEvent: k2, isPromiEvent: xt, encodeJSON: fe, decodeJSON: lt, createJsonRpcRequestPayload: u2, standardizeJsonRpcRequestPayload: K, storage: ae };
        let e = [this, ...yr(this)];
        Wt.forEach((r) => {
          let s = e.map((c2) => Object.getOwnPropertyDescriptor(c2, r)), o = s.findIndex((c2) => !!c2), i = o > 0, a2 = s[o];
          a2 && (this.__sdk_access_field_descriptors__.set(r, { descriptor: a2, isPrototypeField: i }), Object.defineProperty(this, r, { configurable: true, get: () => {
            throw Et(r);
          } }));
        });
      }
      init(e) {
        this.__is_initialized__ || (Wt.forEach((r) => {
          if (this.__sdk_access_field_descriptors__.has(r)) {
            let { descriptor: s, isPrototypeField: o } = this.__sdk_access_field_descriptors__.get(r);
            o ? delete this[r] : Object.defineProperty(this, r, s);
          }
        }), this.sdk = e, this.__is_initialized__ = true);
      }
      createDeprecationWarning(e) {
        let { method: r, removalVersion: s, useInstead: o } = e, i = o ? ` Use \`${o}\` instead.` : "", a2 = `\`${r}\` will be removed from this Extension in version \`${s}\`.${i}`;
        return new oe(this, "DEPRECATION_NOTICE", a2);
      }
      createWarning(e, r) {
        return new oe(this, e, r);
      }
      createError(e, r, s) {
        return new X(this, e, r, s);
      }
    };
    Ke = class extends xe {
    };
    q = class extends xe {
    };
    q.Internal = Ke, q.Anonymous = "anonymous extension";
    Ne = class extends P {
      purchase(t) {
        let e = u2(f.NFTPurchase, [t]);
        return this.request(e);
      }
      checkout(t) {
        let e = u2(f.NFTCheckout, [t]);
        return this.request(e);
      }
      transfer(t) {
        let e = u2(f.NFTTransfer, [t]);
        return this.request(e);
      }
    };
    le = class {
      constructor(t, e) {
        this.apiKey = t;
        var i;
        if (!t) throw ht();
        h2.platform === "react-native" && (e == null ? void 0 : e.endpoint) && vt().log();
        let { defaultEndpoint: r, version: s } = h2;
        this.testMode = !!(e != null && e.testMode), this.useStorageCache = !!(e != null && e.useStorageCache), this.endpoint = Je((i = e == null ? void 0 : e.endpoint) != null ? i : r).origin, this.auth = new ve(this), this.user = new be(this), this.wallet = new we(this), this.nft = new Ne(this), this.rpcProvider = new Me(this);
        let o = Rr.call(this, e);
        this.parameters = fe(V2(B({ API_KEY: this.apiKey, DOMAIN_ORIGIN: window.location ? window.location.origin : "", ETH_NETWORK: e == null ? void 0 : e.network, host: Je(this.endpoint).host, sdk: pt[h2.sdkName], version: s, ext: se(o) ? void 0 : o, locale: (e == null ? void 0 : e.locale) || "en_US" }, h2.bundleId ? { bundleId: h2.bundleId } : {}), { meta: e == null ? void 0 : e.meta })), this.networkHash = gr(this.apiKey, e == null ? void 0 : e.network, se(o) ? void 0 : o), e != null && e.deferPreload || this.preload();
      }
      get overlay() {
        if (!le.__overlays__.has(this.parameters)) {
          let t = new h2.ViewController(this.endpoint, this.parameters, this.networkHash);
          t.init(), le.__overlays__.set(this.parameters, t);
        }
        return le.__overlays__.get(this.parameters);
      }
      preload() {
        return m2(this, null, function* () {
          yield this.overlay.checkIsReadyForRequest;
        });
      }
    };
    Ce = le;
    Ce.__overlays__ = /* @__PURE__ */ new Map();
    Be = class {
      constructor(t, e, r) {
        this.endpoint = t;
        this.parameters = e;
        this.networkHash = r;
        this.messageHandlers = /* @__PURE__ */ new Set();
        this.isConnectedToInternet = true;
        this.checkIsReadyForRequest = this.waitForReady(), this.isReadyForRequest = false, this.listen();
      }
      post(t, e) {
        return m2(this, null, function* () {
          return _e((r, s) => m2(this, null, function* () {
            if (!this.isConnectedToInternet) {
              let d2 = mt();
              s(d2);
            }
            this.isReadyForRequest || (yield this.waitForReady());
            let o = [], i = Array.isArray(e) ? e.map((d2) => d2.id) : [], a2 = yield br(`${t}-${this.parameters}`, e, this.networkHash);
            yield this._post(a2);
            let c2 = (d2) => (p2) => {
              var Ve;
              let { id: x2, response: v2 } = Ir(e, p2);
              if (wr(p2), ((Ve = v2 == null ? void 0 : v2.payload.error) == null ? void 0 : Ve.message) === "User denied account access.") Z();
              else if (p2.data.deviceShare) {
                let { deviceShare: Jt } = p2.data;
                qt(Jt, this.networkHash);
              }
              x2 && v2 && Array.isArray(e) && i.includes(x2) ? (o.push(v2), o.length === e.length && (d2(), r(o))) : x2 && v2 && !Array.isArray(e) && x2 === e.id && (d2(), r(v2));
            }, l = this.on(g.MAGIC_HANDLE_RESPONSE, c2(() => l()));
          }));
        });
      }
      on(t, e) {
        let r = e.bind(window), s = (o) => {
          o.data.msgType === `${t}-${this.parameters}` && r(o);
        };
        return this.messageHandlers.add(s), () => this.messageHandlers.delete(s);
      }
      waitForReady() {
        return new Promise((t) => {
          let e = this.on(g.MAGIC_OVERLAY_READY, () => {
            this.isReadyForRequest = true, t(), e();
          });
          setTimeout(() => {
            this.isReadyForRequest = true, t(), e();
          }, 15e3);
        });
      }
      listen() {
        this.on(g.MAGIC_HIDE_OVERLAY, () => {
          this.hideOverlay();
        }), this.on(g.MAGIC_SHOW_OVERLAY, () => {
          this.showOverlay();
        }), this.on(g.MAGIC_SEND_PRODUCT_ANNOUNCEMENT, (t) => {
          t.data.response.result.product_announcement && new U2(p.ProductAnnouncement, t.data.response.result.product_announcement).log();
        });
      }
    };
  }
});

// ../../node_modules/.pnpm/@magic-sdk+commons@24.6.0_@magic-sdk+provider@28.5.0_localforage@1.10.0__@magic-sdk+types@24.4.0/node_modules/@magic-sdk/commons/dist/es/index.mjs
var init_es3 = __esm({
  "../../node_modules/.pnpm/@magic-sdk+commons@24.6.0_@magic-sdk+provider@28.5.0_localforage@1.10.0__@magic-sdk+types@24.4.0/node_modules/@magic-sdk/commons/dist/es/index.mjs"() {
    "use strict";
    init_es2();
    init_es();
  }
});

// ../../node_modules/.pnpm/magic-sdk@28.5.0/node_modules/magic-sdk/dist/es/index.mjs
var es_exports = {};
__export(es_exports, {
  AuthEventOnReceived: () => L,
  DeepLinkPage: () => E,
  DeviceVerificationEventEmit: () => h,
  DeviceVerificationEventOnReceived: () => y,
  EthChainType: () => w,
  Events: () => d,
  Extension: () => q,
  ExtensionError: () => X,
  ExtensionWarning: () => oe,
  FarcasterLoginEventEmit: () => U,
  LoginWithEmailOTPEventEmit: () => N,
  LoginWithEmailOTPEventOnReceived: () => R,
  LoginWithMagicLinkEventEmit: () => x,
  LoginWithMagicLinkEventOnReceived: () => I,
  LoginWithSmsOTPEventEmit: () => T,
  LoginWithSmsOTPEventOnReceived: () => A,
  Magic: () => bt,
  MagicIncomingWindowMessage: () => g,
  MagicOutgoingWindowMessage: () => v,
  MagicPayloadMethod: () => f,
  NftCheckoutIntermediaryEvents: () => G,
  RPCError: () => _2,
  RPCErrorCode: () => _,
  RecencyCheckEventEmit: () => O,
  RecencyCheckEventOnReceived: () => b,
  RecoveryMethodType: () => V,
  SDKError: () => $,
  SDKErrorCode: () => m,
  SDKWarning: () => U2,
  SDKWarningCode: () => p,
  UpdateEmailEventEmit: () => S,
  UpdateEmailEventOnReceived: () => k,
  UserEventsEmit: () => F,
  UserEventsOnReceived: () => D,
  WalletEventOnReceived: () => H,
  Wallets: () => u,
  isPromiEvent: () => xt
});
function ft2(b3) {
  for (let [A2, R3] of Object.entries(at2)) b3.style[A2] = R3;
}
function ut2(b3) {
  let A2 = [].slice.call(document.querySelectorAll(".magic-iframe"));
  return Boolean(A2.find((R3) => R3.src.includes(b3)));
}
var Zr, Je2, qr, kr, et2, rt2, ve2, $e2, tt2, Ze2, se2, ke2, rr2, ge, Te2, at2, pe2, bt;
var init_es4 = __esm({
  "../../node_modules/.pnpm/magic-sdk@28.5.0/node_modules/magic-sdk/dist/es/index.mjs"() {
    "use strict";
    init_es2();
    init_es2();
    init_es3();
    Zr = Object.create;
    Je2 = Object.defineProperty;
    qr = Object.getOwnPropertyDescriptor;
    kr = Object.getOwnPropertyNames;
    et2 = Object.getPrototypeOf;
    rt2 = Object.prototype.hasOwnProperty;
    ve2 = ((b3) => typeof require != "undefined" ? require : typeof Proxy != "undefined" ? new Proxy(b3, { get: (A2, R3) => (typeof require != "undefined" ? require : A2)[R3] }) : b3)(function(b3) {
      if (typeof require != "undefined") return require.apply(this, arguments);
      throw new Error('Dynamic require of "' + b3 + '" is not supported');
    });
    $e2 = (b3, A2) => () => (A2 || b3((A2 = { exports: {} }).exports, A2), A2.exports);
    tt2 = (b3, A2, R3, L3) => {
      if (A2 && typeof A2 == "object" || typeof A2 == "function") for (let D3 of kr(A2)) !rt2.call(b3, D3) && D3 !== R3 && Je2(b3, D3, { get: () => A2[D3], enumerable: !(L3 = qr(A2, D3)) || L3.enumerable });
      return b3;
    };
    Ze2 = (b3, A2, R3) => (R3 = b3 != null ? Zr(et2(b3)) : {}, tt2(A2 || !b3 || !b3.__esModule ? Je2(R3, "default", { value: b3, enumerable: true }) : R3, b3));
    se2 = (b3, A2, R3) => new Promise((L3, D3) => {
      var X2 = (I2) => {
        try {
          Y(R3.next(I2));
        } catch (M2) {
          D3(M2);
        }
      }, P2 = (I2) => {
        try {
          Y(R3.throw(I2));
        } catch (M2) {
          D3(M2);
        }
      }, Y = (I2) => I2.done ? L3(I2.value) : Promise.resolve(I2.value).then(X2, P2);
      Y((R3 = R3.apply(b3, A2)).next());
    });
    ke2 = $e2((qe2, Ne2) => {
      (function(b3) {
        if (typeof qe2 == "object" && typeof Ne2 < "u") Ne2.exports = b3();
        else if (typeof define == "function" && define.amd) define([], b3);
        else {
          var A2;
          typeof window < "u" ? A2 = window : typeof global < "u" ? A2 = global : typeof self < "u" ? A2 = self : A2 = this, A2.localforage = b3();
        }
      })(function() {
        var b3, A2, R3;
        return function L3(D3, X2, P2) {
          function Y(H3, $2) {
            if (!X2[H3]) {
              if (!D3[H3]) {
                var m3 = typeof ve2 == "function" && ve2;
                if (!$2 && m3) return m3(H3, true);
                if (I2) return I2(H3, true);
                var _3 = new Error("Cannot find module '" + H3 + "'");
                throw _3.code = "MODULE_NOT_FOUND", _3;
              }
              var B2 = X2[H3] = { exports: {} };
              D3[H3][0].call(B2.exports, function(z) {
                var Z2 = D3[H3][1][z];
                return Y(Z2 || z);
              }, B2, B2.exports, L3, D3, X2, P2);
            }
            return X2[H3].exports;
          }
          for (var I2 = typeof ve2 == "function" && ve2, M2 = 0; M2 < P2.length; M2++) Y(P2[M2]);
          return Y;
        }({ 1: [function(L3, D3, X2) {
          (function(P2) {
            "use strict";
            var Y = P2.MutationObserver || P2.WebKitMutationObserver, I2;
            if (Y) {
              var M2 = 0, H3 = new Y(z), $2 = P2.document.createTextNode("");
              H3.observe($2, { characterData: true }), I2 = function() {
                $2.data = M2 = ++M2 % 2;
              };
            } else if (!P2.setImmediate && typeof P2.MessageChannel < "u") {
              var m3 = new P2.MessageChannel();
              m3.port1.onmessage = z, I2 = function() {
                m3.port2.postMessage(0);
              };
            } else "document" in P2 && "onreadystatechange" in P2.document.createElement("script") ? I2 = function() {
              var F3 = P2.document.createElement("script");
              F3.onreadystatechange = function() {
                z(), F3.onreadystatechange = null, F3.parentNode.removeChild(F3), F3 = null;
              }, P2.document.documentElement.appendChild(F3);
            } : I2 = function() {
              setTimeout(z, 0);
            };
            var _3, B2 = [];
            function z() {
              _3 = true;
              for (var F3, k3, U3 = B2.length; U3; ) {
                for (k3 = B2, B2 = [], F3 = -1; ++F3 < U3; ) k3[F3]();
                U3 = B2.length;
              }
              _3 = false;
            }
            D3.exports = Z2;
            function Z2(F3) {
              B2.push(F3) === 1 && !_3 && I2();
            }
          }).call(this, typeof global < "u" ? global : typeof self < "u" ? self : typeof window < "u" ? window : {});
        }, {}], 2: [function(L3, D3, X2) {
          "use strict";
          var P2 = L3(1);
          function Y() {
          }
          var I2 = {}, M2 = ["REJECTED"], H3 = ["FULFILLED"], $2 = ["PENDING"];
          D3.exports = m3;
          function m3(h3) {
            if (typeof h3 != "function") throw new TypeError("resolver must be a function");
            this.state = $2, this.queue = [], this.outcome = void 0, h3 !== Y && Z2(this, h3);
          }
          m3.prototype.catch = function(h3) {
            return this.then(null, h3);
          }, m3.prototype.then = function(h3, N3) {
            if (typeof h3 != "function" && this.state === H3 || typeof N3 != "function" && this.state === M2) return this;
            var E3 = new this.constructor(Y);
            if (this.state !== $2) {
              var O3 = this.state === H3 ? h3 : N3;
              B2(E3, O3, this.outcome);
            } else this.queue.push(new _3(E3, h3, N3));
            return E3;
          };
          function _3(h3, N3, E3) {
            this.promise = h3, typeof N3 == "function" && (this.onFulfilled = N3, this.callFulfilled = this.otherCallFulfilled), typeof E3 == "function" && (this.onRejected = E3, this.callRejected = this.otherCallRejected);
          }
          _3.prototype.callFulfilled = function(h3) {
            I2.resolve(this.promise, h3);
          }, _3.prototype.otherCallFulfilled = function(h3) {
            B2(this.promise, this.onFulfilled, h3);
          }, _3.prototype.callRejected = function(h3) {
            I2.reject(this.promise, h3);
          }, _3.prototype.otherCallRejected = function(h3) {
            B2(this.promise, this.onRejected, h3);
          };
          function B2(h3, N3, E3) {
            P2(function() {
              var O3;
              try {
                O3 = N3(E3);
              } catch (V3) {
                return I2.reject(h3, V3);
              }
              O3 === h3 ? I2.reject(h3, new TypeError("Cannot resolve promise with itself")) : I2.resolve(h3, O3);
            });
          }
          I2.resolve = function(h3, N3) {
            var E3 = F3(z, N3);
            if (E3.status === "error") return I2.reject(h3, E3.value);
            var O3 = E3.value;
            if (O3) Z2(h3, O3);
            else {
              h3.state = H3, h3.outcome = N3;
              for (var V3 = -1, j2 = h3.queue.length; ++V3 < j2; ) h3.queue[V3].callFulfilled(N3);
            }
            return h3;
          }, I2.reject = function(h3, N3) {
            h3.state = M2, h3.outcome = N3;
            for (var E3 = -1, O3 = h3.queue.length; ++E3 < O3; ) h3.queue[E3].callRejected(N3);
            return h3;
          };
          function z(h3) {
            var N3 = h3 && h3.then;
            if (h3 && (typeof h3 == "object" || typeof h3 == "function") && typeof N3 == "function") return function() {
              N3.apply(h3, arguments);
            };
          }
          function Z2(h3, N3) {
            var E3 = false;
            function O3(J) {
              E3 || (E3 = true, I2.reject(h3, J));
            }
            function V3(J) {
              E3 || (E3 = true, I2.resolve(h3, J));
            }
            function j2() {
              N3(V3, O3);
            }
            var Q = F3(j2);
            Q.status === "error" && O3(Q.value);
          }
          function F3(h3, N3) {
            var E3 = {};
            try {
              E3.value = h3(N3), E3.status = "success";
            } catch (O3) {
              E3.status = "error", E3.value = O3;
            }
            return E3;
          }
          m3.resolve = k3;
          function k3(h3) {
            return h3 instanceof this ? h3 : I2.resolve(new this(Y), h3);
          }
          m3.reject = U3;
          function U3(h3) {
            var N3 = new this(Y);
            return I2.reject(N3, h3);
          }
          m3.all = ae2;
          function ae2(h3) {
            var N3 = this;
            if (Object.prototype.toString.call(h3) !== "[object Array]") return this.reject(new TypeError("must be an array"));
            var E3 = h3.length, O3 = false;
            if (!E3) return this.resolve([]);
            for (var V3 = new Array(E3), j2 = 0, Q = -1, J = new this(Y); ++Q < E3; ) ee2(h3[Q], Q);
            return J;
            function ee2(oe2, a2) {
              N3.resolve(oe2).then(s, function(v2) {
                O3 || (O3 = true, I2.reject(J, v2));
              });
              function s(v2) {
                V3[a2] = v2, ++j2 === E3 && !O3 && (O3 = true, I2.resolve(J, V3));
              }
            }
          }
          m3.race = re2;
          function re2(h3) {
            var N3 = this;
            if (Object.prototype.toString.call(h3) !== "[object Array]") return this.reject(new TypeError("must be an array"));
            var E3 = h3.length, O3 = false;
            if (!E3) return this.resolve([]);
            for (var V3 = -1, j2 = new this(Y); ++V3 < E3; ) Q(h3[V3]);
            return j2;
            function Q(J) {
              N3.resolve(J).then(function(ee2) {
                O3 || (O3 = true, I2.resolve(j2, ee2));
              }, function(ee2) {
                O3 || (O3 = true, I2.reject(j2, ee2));
              });
            }
          }
        }, { 1: 1 }], 3: [function(L3, D3, X2) {
          (function(P2) {
            "use strict";
            typeof P2.Promise != "function" && (P2.Promise = L3(2));
          }).call(this, typeof global < "u" ? global : typeof self < "u" ? self : typeof window < "u" ? window : {});
        }, { 2: 2 }], 4: [function(L3, D3, X2) {
          "use strict";
          var P2 = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
            return typeof e;
          } : function(e) {
            return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
          };
          function Y(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
          }
          function I2() {
            try {
              if (typeof indexedDB < "u") return indexedDB;
              if (typeof webkitIndexedDB < "u") return webkitIndexedDB;
              if (typeof mozIndexedDB < "u") return mozIndexedDB;
              if (typeof OIndexedDB < "u") return OIndexedDB;
              if (typeof msIndexedDB < "u") return msIndexedDB;
            } catch {
              return;
            }
          }
          var M2 = I2();
          function H3() {
            try {
              if (!M2 || !M2.open) return false;
              var e = typeof openDatabase < "u" && /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !/BlackBerry/.test(navigator.platform), t = typeof fetch == "function" && fetch.toString().indexOf("[native code") !== -1;
              return (!e || t) && typeof indexedDB < "u" && typeof IDBKeyRange < "u";
            } catch {
              return false;
            }
          }
          function $2(e, t) {
            e = e || [], t = t || {};
            try {
              return new Blob(e, t);
            } catch (n) {
              if (n.name !== "TypeError") throw n;
              for (var r = typeof BlobBuilder < "u" ? BlobBuilder : typeof MSBlobBuilder < "u" ? MSBlobBuilder : typeof MozBlobBuilder < "u" ? MozBlobBuilder : WebKitBlobBuilder, o = new r(), i = 0; i < e.length; i += 1) o.append(e[i]);
              return o.getBlob(t.type);
            }
          }
          typeof Promise > "u" && L3(3);
          var m3 = Promise;
          function _3(e, t) {
            t && e.then(function(r) {
              t(null, r);
            }, function(r) {
              t(r);
            });
          }
          function B2(e, t, r) {
            typeof t == "function" && e.then(t), typeof r == "function" && e.catch(r);
          }
          function z(e) {
            return typeof e != "string" && (console.warn(e + " used as a key, but it is not a string."), e = String(e)), e;
          }
          function Z2() {
            if (arguments.length && typeof arguments[arguments.length - 1] == "function") return arguments[arguments.length - 1];
          }
          var F3 = "local-forage-detect-blob-support", k3 = void 0, U3 = {}, ae2 = Object.prototype.toString, re2 = "readonly", h3 = "readwrite";
          function N3(e) {
            for (var t = e.length, r = new ArrayBuffer(t), o = new Uint8Array(r), i = 0; i < t; i++) o[i] = e.charCodeAt(i);
            return r;
          }
          function E3(e) {
            return new m3(function(t) {
              var r = e.transaction(F3, h3), o = $2([""]);
              r.objectStore(F3).put(o, "key"), r.onabort = function(i) {
                i.preventDefault(), i.stopPropagation(), t(false);
              }, r.oncomplete = function() {
                var i = navigator.userAgent.match(/Chrome\/(\d+)/), n = navigator.userAgent.match(/Edge\//);
                t(n || !i || parseInt(i[1], 10) >= 43);
              };
            }).catch(function() {
              return false;
            });
          }
          function O3(e) {
            return typeof k3 == "boolean" ? m3.resolve(k3) : E3(e).then(function(t) {
              return k3 = t, k3;
            });
          }
          function V3(e) {
            var t = U3[e.name], r = {};
            r.promise = new m3(function(o, i) {
              r.resolve = o, r.reject = i;
            }), t.deferredOperations.push(r), t.dbReady ? t.dbReady = t.dbReady.then(function() {
              return r.promise;
            }) : t.dbReady = r.promise;
          }
          function j2(e) {
            var t = U3[e.name], r = t.deferredOperations.pop();
            if (r) return r.resolve(), r.promise;
          }
          function Q(e, t) {
            var r = U3[e.name], o = r.deferredOperations.pop();
            if (o) return o.reject(t), o.promise;
          }
          function J(e, t) {
            return new m3(function(r, o) {
              if (U3[e.name] = U3[e.name] || G3(), e.db) if (t) V3(e), e.db.close();
              else return r(e.db);
              var i = [e.name];
              t && i.push(e.version);
              var n = M2.open.apply(M2, i);
              t && (n.onupgradeneeded = function(f3) {
                var u3 = n.result;
                try {
                  u3.createObjectStore(e.storeName), f3.oldVersion <= 1 && u3.createObjectStore(F3);
                } catch (c2) {
                  if (c2.name === "ConstraintError") console.warn('The database "' + e.name + '" has been upgraded from version ' + f3.oldVersion + " to version " + f3.newVersion + ', but the storage "' + e.storeName + '" already exists.');
                  else throw c2;
                }
              }), n.onerror = function(f3) {
                f3.preventDefault(), o(n.error);
              }, n.onsuccess = function() {
                var f3 = n.result;
                f3.onversionchange = function(u3) {
                  u3.target.close();
                }, r(f3), j2(e);
              };
            });
          }
          function ee2(e) {
            return J(e, false);
          }
          function oe2(e) {
            return J(e, true);
          }
          function a2(e, t) {
            if (!e.db) return true;
            var r = !e.db.objectStoreNames.contains(e.storeName), o = e.version < e.db.version, i = e.version > e.db.version;
            if (o && (e.version !== t && console.warn('The database "' + e.name + `" can't be downgraded from version ` + e.db.version + " to version " + e.version + "."), e.version = e.db.version), i || r) {
              if (r) {
                var n = e.db.version + 1;
                n > e.version && (e.version = n);
              }
              return true;
            }
            return false;
          }
          function s(e) {
            return new m3(function(t, r) {
              var o = new FileReader();
              o.onerror = r, o.onloadend = function(i) {
                var n = btoa(i.target.result || "");
                t({ __local_forage_encoded_blob: true, data: n, type: e.type });
              }, o.readAsBinaryString(e);
            });
          }
          function v2(e) {
            var t = N3(atob(e.data));
            return $2([t], { type: e.type });
          }
          function p2(e) {
            return e && e.__local_forage_encoded_blob;
          }
          function g2(e) {
            var t = this, r = t._initReady().then(function() {
              var o = U3[t._dbInfo.name];
              if (o && o.dbReady) return o.dbReady;
            });
            return B2(r, e, e), r;
          }
          function w2(e) {
            V3(e);
            for (var t = U3[e.name], r = t.forages, o = 0; o < r.length; o++) {
              var i = r[o];
              i._dbInfo.db && (i._dbInfo.db.close(), i._dbInfo.db = null);
            }
            return e.db = null, ee2(e).then(function(n) {
              return e.db = n, a2(e) ? oe2(e) : n;
            }).then(function(n) {
              e.db = t.db = n;
              for (var f3 = 0; f3 < r.length; f3++) r[f3]._dbInfo.db = n;
            }).catch(function(n) {
              throw Q(e, n), n;
            });
          }
          function T3(e, t, r, o) {
            o === void 0 && (o = 1);
            try {
              var i = e.db.transaction(e.storeName, t);
              r(null, i);
            } catch (n) {
              if (o > 0 && (!e.db || n.name === "InvalidStateError" || n.name === "NotFoundError")) return m3.resolve().then(function() {
                if (!e.db || n.name === "NotFoundError" && !e.db.objectStoreNames.contains(e.storeName) && e.version <= e.db.version) return e.db && (e.version = e.db.version + 1), oe2(e);
              }).then(function() {
                return w2(e).then(function() {
                  T3(e, t, r, o - 1);
                });
              }).catch(r);
              r(n);
            }
          }
          function G3() {
            return { forages: [], db: null, dbReady: null, deferredOperations: [] };
          }
          function fe2(e) {
            var t = this, r = { db: null };
            if (e) for (var o in e) r[o] = e[o];
            var i = U3[r.name];
            i || (i = G3(), U3[r.name] = i), i.forages.push(t), t._initReady || (t._initReady = t.ready, t.ready = g2);
            var n = [];
            function f3() {
              return m3.resolve();
            }
            for (var u3 = 0; u3 < i.forages.length; u3++) {
              var c2 = i.forages[u3];
              c2 !== t && n.push(c2._initReady().catch(f3));
            }
            var l = i.forages.slice(0);
            return m3.all(n).then(function() {
              return r.db = i.db, ee2(r);
            }).then(function(d2) {
              return r.db = d2, a2(r, t._defaultConfig.version) ? oe2(r) : d2;
            }).then(function(d2) {
              r.db = i.db = d2, t._dbInfo = r;
              for (var y3 = 0; y3 < l.length; y3++) {
                var S2 = l[y3];
                S2 !== t && (S2._dbInfo.db = r.db, S2._dbInfo.version = r.version);
              }
            });
          }
          function ie(e, t) {
            var r = this;
            e = z(e);
            var o = new m3(function(i, n) {
              r.ready().then(function() {
                T3(r._dbInfo, re2, function(f3, u3) {
                  if (f3) return n(f3);
                  try {
                    var c2 = u3.objectStore(r._dbInfo.storeName), l = c2.get(e);
                    l.onsuccess = function() {
                      var d2 = l.result;
                      d2 === void 0 && (d2 = null), p2(d2) && (d2 = v2(d2)), i(d2);
                    }, l.onerror = function() {
                      n(l.error);
                    };
                  } catch (d2) {
                    n(d2);
                  }
                });
              }).catch(n);
            });
            return _3(o, t), o;
          }
          function ce2(e, t) {
            var r = this, o = new m3(function(i, n) {
              r.ready().then(function() {
                T3(r._dbInfo, re2, function(f3, u3) {
                  if (f3) return n(f3);
                  try {
                    var c2 = u3.objectStore(r._dbInfo.storeName), l = c2.openCursor(), d2 = 1;
                    l.onsuccess = function() {
                      var y3 = l.result;
                      if (y3) {
                        var S2 = y3.value;
                        p2(S2) && (S2 = v2(S2));
                        var x2 = e(S2, y3.key, d2++);
                        x2 !== void 0 ? i(x2) : y3.continue();
                      } else i();
                    }, l.onerror = function() {
                      n(l.error);
                    };
                  } catch (y3) {
                    n(y3);
                  }
                });
              }).catch(n);
            });
            return _3(o, t), o;
          }
          function nr2(e, t, r) {
            var o = this;
            e = z(e);
            var i = new m3(function(n, f3) {
              var u3;
              o.ready().then(function() {
                return u3 = o._dbInfo, ae2.call(t) === "[object Blob]" ? O3(u3.db).then(function(c2) {
                  return c2 ? t : s(t);
                }) : t;
              }).then(function(c2) {
                T3(o._dbInfo, h3, function(l, d2) {
                  if (l) return f3(l);
                  try {
                    var y3 = d2.objectStore(o._dbInfo.storeName);
                    c2 === null && (c2 = void 0);
                    var S2 = y3.put(c2, e);
                    d2.oncomplete = function() {
                      c2 === void 0 && (c2 = null), n(c2);
                    }, d2.onabort = d2.onerror = function() {
                      var x2 = S2.error ? S2.error : S2.transaction.error;
                      f3(x2);
                    };
                  } catch (x2) {
                    f3(x2);
                  }
                });
              }).catch(f3);
            });
            return _3(i, r), i;
          }
          function or2(e, t) {
            var r = this;
            e = z(e);
            var o = new m3(function(i, n) {
              r.ready().then(function() {
                T3(r._dbInfo, h3, function(f3, u3) {
                  if (f3) return n(f3);
                  try {
                    var c2 = u3.objectStore(r._dbInfo.storeName), l = c2.delete(e);
                    u3.oncomplete = function() {
                      i();
                    }, u3.onerror = function() {
                      n(l.error);
                    }, u3.onabort = function() {
                      var d2 = l.error ? l.error : l.transaction.error;
                      n(d2);
                    };
                  } catch (d2) {
                    n(d2);
                  }
                });
              }).catch(n);
            });
            return _3(o, t), o;
          }
          function ir2(e) {
            var t = this, r = new m3(function(o, i) {
              t.ready().then(function() {
                T3(t._dbInfo, h3, function(n, f3) {
                  if (n) return i(n);
                  try {
                    var u3 = f3.objectStore(t._dbInfo.storeName), c2 = u3.clear();
                    f3.oncomplete = function() {
                      o();
                    }, f3.onabort = f3.onerror = function() {
                      var l = c2.error ? c2.error : c2.transaction.error;
                      i(l);
                    };
                  } catch (l) {
                    i(l);
                  }
                });
              }).catch(i);
            });
            return _3(r, e), r;
          }
          function ar2(e) {
            var t = this, r = new m3(function(o, i) {
              t.ready().then(function() {
                T3(t._dbInfo, re2, function(n, f3) {
                  if (n) return i(n);
                  try {
                    var u3 = f3.objectStore(t._dbInfo.storeName), c2 = u3.count();
                    c2.onsuccess = function() {
                      o(c2.result);
                    }, c2.onerror = function() {
                      i(c2.error);
                    };
                  } catch (l) {
                    i(l);
                  }
                });
              }).catch(i);
            });
            return _3(r, e), r;
          }
          function fr2(e, t) {
            var r = this, o = new m3(function(i, n) {
              if (e < 0) {
                i(null);
                return;
              }
              r.ready().then(function() {
                T3(r._dbInfo, re2, function(f3, u3) {
                  if (f3) return n(f3);
                  try {
                    var c2 = u3.objectStore(r._dbInfo.storeName), l = false, d2 = c2.openKeyCursor();
                    d2.onsuccess = function() {
                      var y3 = d2.result;
                      if (!y3) {
                        i(null);
                        return;
                      }
                      e === 0 || l ? i(y3.key) : (l = true, y3.advance(e));
                    }, d2.onerror = function() {
                      n(d2.error);
                    };
                  } catch (y3) {
                    n(y3);
                  }
                });
              }).catch(n);
            });
            return _3(o, t), o;
          }
          function ur2(e) {
            var t = this, r = new m3(function(o, i) {
              t.ready().then(function() {
                T3(t._dbInfo, re2, function(n, f3) {
                  if (n) return i(n);
                  try {
                    var u3 = f3.objectStore(t._dbInfo.storeName), c2 = u3.openKeyCursor(), l = [];
                    c2.onsuccess = function() {
                      var d2 = c2.result;
                      if (!d2) {
                        o(l);
                        return;
                      }
                      l.push(d2.key), d2.continue();
                    }, c2.onerror = function() {
                      i(c2.error);
                    };
                  } catch (d2) {
                    i(d2);
                  }
                });
              }).catch(i);
            });
            return _3(r, e), r;
          }
          function sr2(e, t) {
            t = Z2.apply(this, arguments);
            var r = this.config();
            e = typeof e != "function" && e || {}, e.name || (e.name = e.name || r.name, e.storeName = e.storeName || r.storeName);
            var o = this, i;
            if (!e.name) i = m3.reject("Invalid arguments");
            else {
              var n = e.name === r.name && o._dbInfo.db, f3 = n ? m3.resolve(o._dbInfo.db) : ee2(e).then(function(u3) {
                var c2 = U3[e.name], l = c2.forages;
                c2.db = u3;
                for (var d2 = 0; d2 < l.length; d2++) l[d2]._dbInfo.db = u3;
                return u3;
              });
              e.storeName ? i = f3.then(function(u3) {
                if (!!u3.objectStoreNames.contains(e.storeName)) {
                  var c2 = u3.version + 1;
                  V3(e);
                  var l = U3[e.name], d2 = l.forages;
                  u3.close();
                  for (var y3 = 0; y3 < d2.length; y3++) {
                    var S2 = d2[y3];
                    S2._dbInfo.db = null, S2._dbInfo.version = c2;
                  }
                  var x2 = new m3(function(C, K2) {
                    var W2 = M2.open(e.name, c2);
                    W2.onerror = function(q2) {
                      var de = W2.result;
                      de.close(), K2(q2);
                    }, W2.onupgradeneeded = function() {
                      var q2 = W2.result;
                      q2.deleteObjectStore(e.storeName);
                    }, W2.onsuccess = function() {
                      var q2 = W2.result;
                      q2.close(), C(q2);
                    };
                  });
                  return x2.then(function(C) {
                    l.db = C;
                    for (var K2 = 0; K2 < d2.length; K2++) {
                      var W2 = d2[K2];
                      W2._dbInfo.db = C, j2(W2._dbInfo);
                    }
                  }).catch(function(C) {
                    throw (Q(e, C) || m3.resolve()).catch(function() {
                    }), C;
                  });
                }
              }) : i = f3.then(function(u3) {
                V3(e);
                var c2 = U3[e.name], l = c2.forages;
                u3.close();
                for (var d2 = 0; d2 < l.length; d2++) {
                  var y3 = l[d2];
                  y3._dbInfo.db = null;
                }
                var S2 = new m3(function(x2, C) {
                  var K2 = M2.deleteDatabase(e.name);
                  K2.onerror = function() {
                    var W2 = K2.result;
                    W2 && W2.close(), C(K2.error);
                  }, K2.onblocked = function() {
                    console.warn('dropInstance blocked for database "' + e.name + '" until all open connections are closed');
                  }, K2.onsuccess = function() {
                    var W2 = K2.result;
                    W2 && W2.close(), x2(W2);
                  };
                });
                return S2.then(function(x2) {
                  c2.db = x2;
                  for (var C = 0; C < l.length; C++) {
                    var K2 = l[C];
                    j2(K2._dbInfo);
                  }
                }).catch(function(x2) {
                  throw (Q(e, x2) || m3.resolve()).catch(function() {
                  }), x2;
                });
              });
            }
            return _3(i, t), i;
          }
          var cr2 = { _driver: "asyncStorage", _initStorage: fe2, _support: H3(), iterate: ce2, getItem: ie, setItem: nr2, removeItem: or2, clear: ir2, length: ar2, key: fr2, keys: ur2, dropInstance: sr2 };
          function lr2() {
            return typeof openDatabase == "function";
          }
          var te2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", dr2 = "~~local_forage_type~", Be2 = /^~~local_forage_type~([^~]+)~/, he2 = "__lfsc__:", be2 = he2.length, _e2 = "arbf", we2 = "blob", xe2 = "si08", Oe2 = "ui08", Ce2 = "uic8", Le = "si16", Pe2 = "si32", Me2 = "ur16", Fe2 = "ui32", Ue2 = "fl32", Ye2 = "fl64", ze2 = be2 + _e2.length, We2 = Object.prototype.toString;
          function Ke2(e) {
            var t = e.length * 0.75, r = e.length, o, i = 0, n, f3, u3, c2;
            e[e.length - 1] === "=" && (t--, e[e.length - 2] === "=" && t--);
            var l = new ArrayBuffer(t), d2 = new Uint8Array(l);
            for (o = 0; o < r; o += 4) n = te2.indexOf(e[o]), f3 = te2.indexOf(e[o + 1]), u3 = te2.indexOf(e[o + 2]), c2 = te2.indexOf(e[o + 3]), d2[i++] = n << 2 | f3 >> 4, d2[i++] = (f3 & 15) << 4 | u3 >> 2, d2[i++] = (u3 & 3) << 6 | c2 & 63;
            return l;
          }
          function Ee2(e) {
            var t = new Uint8Array(e), r = "", o;
            for (o = 0; o < t.length; o += 3) r += te2[t[o] >> 2], r += te2[(t[o] & 3) << 4 | t[o + 1] >> 4], r += te2[(t[o + 1] & 15) << 2 | t[o + 2] >> 6], r += te2[t[o + 2] & 63];
            return t.length % 3 === 2 ? r = r.substring(0, r.length - 1) + "=" : t.length % 3 === 1 && (r = r.substring(0, r.length - 2) + "=="), r;
          }
          function vr(e, t) {
            var r = "";
            if (e && (r = We2.call(e)), e && (r === "[object ArrayBuffer]" || e.buffer && We2.call(e.buffer) === "[object ArrayBuffer]")) {
              var o, i = he2;
              e instanceof ArrayBuffer ? (o = e, i += _e2) : (o = e.buffer, r === "[object Int8Array]" ? i += xe2 : r === "[object Uint8Array]" ? i += Oe2 : r === "[object Uint8ClampedArray]" ? i += Ce2 : r === "[object Int16Array]" ? i += Le : r === "[object Uint16Array]" ? i += Me2 : r === "[object Int32Array]" ? i += Pe2 : r === "[object Uint32Array]" ? i += Fe2 : r === "[object Float32Array]" ? i += Ue2 : r === "[object Float64Array]" ? i += Ye2 : t(new Error("Failed to get type for BinaryArray"))), t(i + Ee2(o));
            } else if (r === "[object Blob]") {
              var n = new FileReader();
              n.onload = function() {
                var f3 = dr2 + e.type + "~" + Ee2(this.result);
                t(he2 + we2 + f3);
              }, n.readAsArrayBuffer(e);
            } else try {
              t(JSON.stringify(e));
            } catch (f3) {
              console.error("Couldn't convert value into a JSON string: ", e), t(null, f3);
            }
          }
          function hr2(e) {
            if (e.substring(0, be2) !== he2) return JSON.parse(e);
            var t = e.substring(ze2), r = e.substring(be2, ze2), o;
            if (r === we2 && Be2.test(t)) {
              var i = t.match(Be2);
              o = i[1], t = t.substring(i[0].length);
            }
            var n = Ke2(t);
            switch (r) {
              case _e2:
                return n;
              case we2:
                return $2([n], { type: o });
              case xe2:
                return new Int8Array(n);
              case Oe2:
                return new Uint8Array(n);
              case Ce2:
                return new Uint8ClampedArray(n);
              case Le:
                return new Int16Array(n);
              case Me2:
                return new Uint16Array(n);
              case Pe2:
                return new Int32Array(n);
              case Fe2:
                return new Uint32Array(n);
              case Ue2:
                return new Float32Array(n);
              case Ye2:
                return new Float64Array(n);
              default:
                throw new Error("Unkown type: " + r);
            }
          }
          var Ie2 = { serialize: vr, deserialize: hr2, stringToBuffer: Ke2, bufferToString: Ee2 };
          function He2(e, t, r, o) {
            e.executeSql("CREATE TABLE IF NOT EXISTS " + t.storeName + " (id INTEGER PRIMARY KEY, key unique, value)", [], r, o);
          }
          function mr2(e) {
            var t = this, r = { db: null };
            if (e) for (var o in e) r[o] = typeof e[o] != "string" ? e[o].toString() : e[o];
            var i = new m3(function(n, f3) {
              try {
                r.db = openDatabase(r.name, String(r.version), r.description, r.size);
              } catch (u3) {
                return f3(u3);
              }
              r.db.transaction(function(u3) {
                He2(u3, r, function() {
                  t._dbInfo = r, n();
                }, function(c2, l) {
                  f3(l);
                });
              }, f3);
            });
            return r.serializer = Ie2, i;
          }
          function ne2(e, t, r, o, i, n) {
            e.executeSql(r, o, i, function(f3, u3) {
              u3.code === u3.SYNTAX_ERR ? f3.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name = ?", [t.storeName], function(c2, l) {
                l.rows.length ? n(c2, u3) : He2(c2, t, function() {
                  c2.executeSql(r, o, i, n);
                }, n);
              }, n) : n(f3, u3);
            }, n);
          }
          function yr2(e, t) {
            var r = this;
            e = z(e);
            var o = new m3(function(i, n) {
              r.ready().then(function() {
                var f3 = r._dbInfo;
                f3.db.transaction(function(u3) {
                  ne2(u3, f3, "SELECT * FROM " + f3.storeName + " WHERE key = ? LIMIT 1", [e], function(c2, l) {
                    var d2 = l.rows.length ? l.rows.item(0).value : null;
                    d2 && (d2 = f3.serializer.deserialize(d2)), i(d2);
                  }, function(c2, l) {
                    n(l);
                  });
                });
              }).catch(n);
            });
            return _3(o, t), o;
          }
          function pr2(e, t) {
            var r = this, o = new m3(function(i, n) {
              r.ready().then(function() {
                var f3 = r._dbInfo;
                f3.db.transaction(function(u3) {
                  ne2(u3, f3, "SELECT * FROM " + f3.storeName, [], function(c2, l) {
                    for (var d2 = l.rows, y3 = d2.length, S2 = 0; S2 < y3; S2++) {
                      var x2 = d2.item(S2), C = x2.value;
                      if (C && (C = f3.serializer.deserialize(C)), C = e(C, x2.key, S2 + 1), C !== void 0) {
                        i(C);
                        return;
                      }
                    }
                    i();
                  }, function(c2, l) {
                    n(l);
                  });
                });
              }).catch(n);
            });
            return _3(o, t), o;
          }
          function Ve(e, t, r, o) {
            var i = this;
            e = z(e);
            var n = new m3(function(f3, u3) {
              i.ready().then(function() {
                t === void 0 && (t = null);
                var c2 = t, l = i._dbInfo;
                l.serializer.serialize(t, function(d2, y3) {
                  y3 ? u3(y3) : l.db.transaction(function(S2) {
                    ne2(S2, l, "INSERT OR REPLACE INTO " + l.storeName + " (key, value) VALUES (?, ?)", [e, d2], function() {
                      f3(c2);
                    }, function(x2, C) {
                      u3(C);
                    });
                  }, function(S2) {
                    if (S2.code === S2.QUOTA_ERR) {
                      if (o > 0) {
                        f3(Ve.apply(i, [e, c2, r, o - 1]));
                        return;
                      }
                      u3(S2);
                    }
                  });
                });
              }).catch(u3);
            });
            return _3(n, r), n;
          }
          function gr2(e, t, r) {
            return Ve.apply(this, [e, t, r, 1]);
          }
          function br2(e, t) {
            var r = this;
            e = z(e);
            var o = new m3(function(i, n) {
              r.ready().then(function() {
                var f3 = r._dbInfo;
                f3.db.transaction(function(u3) {
                  ne2(u3, f3, "DELETE FROM " + f3.storeName + " WHERE key = ?", [e], function() {
                    i();
                  }, function(c2, l) {
                    n(l);
                  });
                });
              }).catch(n);
            });
            return _3(o, t), o;
          }
          function _r(e) {
            var t = this, r = new m3(function(o, i) {
              t.ready().then(function() {
                var n = t._dbInfo;
                n.db.transaction(function(f3) {
                  ne2(f3, n, "DELETE FROM " + n.storeName, [], function() {
                    o();
                  }, function(u3, c2) {
                    i(c2);
                  });
                });
              }).catch(i);
            });
            return _3(r, e), r;
          }
          function wr2(e) {
            var t = this, r = new m3(function(o, i) {
              t.ready().then(function() {
                var n = t._dbInfo;
                n.db.transaction(function(f3) {
                  ne2(f3, n, "SELECT COUNT(key) as c FROM " + n.storeName, [], function(u3, c2) {
                    var l = c2.rows.item(0).c;
                    o(l);
                  }, function(u3, c2) {
                    i(c2);
                  });
                });
              }).catch(i);
            });
            return _3(r, e), r;
          }
          function Er(e, t) {
            var r = this, o = new m3(function(i, n) {
              r.ready().then(function() {
                var f3 = r._dbInfo;
                f3.db.transaction(function(u3) {
                  ne2(u3, f3, "SELECT key FROM " + f3.storeName + " WHERE id = ? LIMIT 1", [e + 1], function(c2, l) {
                    var d2 = l.rows.length ? l.rows.item(0).key : null;
                    i(d2);
                  }, function(c2, l) {
                    n(l);
                  });
                });
              }).catch(n);
            });
            return _3(o, t), o;
          }
          function Ir2(e) {
            var t = this, r = new m3(function(o, i) {
              t.ready().then(function() {
                var n = t._dbInfo;
                n.db.transaction(function(f3) {
                  ne2(f3, n, "SELECT key FROM " + n.storeName, [], function(u3, c2) {
                    for (var l = [], d2 = 0; d2 < c2.rows.length; d2++) l.push(c2.rows.item(d2).key);
                    o(l);
                  }, function(u3, c2) {
                    i(c2);
                  });
                });
              }).catch(i);
            });
            return _3(r, e), r;
          }
          function Sr(e) {
            return new m3(function(t, r) {
              e.transaction(function(o) {
                o.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'", [], function(i, n) {
                  for (var f3 = [], u3 = 0; u3 < n.rows.length; u3++) f3.push(n.rows.item(u3).name);
                  t({ db: e, storeNames: f3 });
                }, function(i, n) {
                  r(n);
                });
              }, function(o) {
                r(o);
              });
            });
          }
          function Ar(e, t) {
            t = Z2.apply(this, arguments);
            var r = this.config();
            e = typeof e != "function" && e || {}, e.name || (e.name = e.name || r.name, e.storeName = e.storeName || r.storeName);
            var o = this, i;
            return e.name ? i = new m3(function(n) {
              var f3;
              e.name === r.name ? f3 = o._dbInfo.db : f3 = openDatabase(e.name, "", "", 0), e.storeName ? n({ db: f3, storeNames: [e.storeName] }) : n(Sr(f3));
            }).then(function(n) {
              return new m3(function(f3, u3) {
                n.db.transaction(function(c2) {
                  function l(x2) {
                    return new m3(function(C, K2) {
                      c2.executeSql("DROP TABLE IF EXISTS " + x2, [], function() {
                        C();
                      }, function(W2, q2) {
                        K2(q2);
                      });
                    });
                  }
                  for (var d2 = [], y3 = 0, S2 = n.storeNames.length; y3 < S2; y3++) d2.push(l(n.storeNames[y3]));
                  m3.all(d2).then(function() {
                    f3();
                  }).catch(function(x2) {
                    u3(x2);
                  });
                }, function(c2) {
                  u3(c2);
                });
              });
            }) : i = m3.reject("Invalid arguments"), _3(i, t), i;
          }
          var Rr2 = { _driver: "webSQLStorage", _initStorage: mr2, _support: lr2(), iterate: pr2, getItem: yr2, setItem: gr2, removeItem: br2, clear: _r, length: wr2, key: Er, keys: Ir2, dropInstance: Ar };
          function Dr() {
            try {
              return typeof localStorage < "u" && "setItem" in localStorage && !!localStorage.setItem;
            } catch {
              return false;
            }
          }
          function Ge(e, t) {
            var r = e.name + "/";
            return e.storeName !== t.storeName && (r += e.storeName + "/"), r;
          }
          function Nr() {
            var e = "_localforage_support_test";
            try {
              return localStorage.setItem(e, true), localStorage.removeItem(e), false;
            } catch {
              return true;
            }
          }
          function Tr2() {
            return !Nr() || localStorage.length > 0;
          }
          function Br(e) {
            var t = this, r = {};
            if (e) for (var o in e) r[o] = e[o];
            return r.keyPrefix = Ge(e, t._defaultConfig), Tr2() ? (t._dbInfo = r, r.serializer = Ie2, m3.resolve()) : m3.reject();
          }
          function xr(e) {
            var t = this, r = t.ready().then(function() {
              for (var o = t._dbInfo.keyPrefix, i = localStorage.length - 1; i >= 0; i--) {
                var n = localStorage.key(i);
                n.indexOf(o) === 0 && localStorage.removeItem(n);
              }
            });
            return _3(r, e), r;
          }
          function Or(e, t) {
            var r = this;
            e = z(e);
            var o = r.ready().then(function() {
              var i = r._dbInfo, n = localStorage.getItem(i.keyPrefix + e);
              return n && (n = i.serializer.deserialize(n)), n;
            });
            return _3(o, t), o;
          }
          function Cr(e, t) {
            var r = this, o = r.ready().then(function() {
              for (var i = r._dbInfo, n = i.keyPrefix, f3 = n.length, u3 = localStorage.length, c2 = 1, l = 0; l < u3; l++) {
                var d2 = localStorage.key(l);
                if (d2.indexOf(n) === 0) {
                  var y3 = localStorage.getItem(d2);
                  if (y3 && (y3 = i.serializer.deserialize(y3)), y3 = e(y3, d2.substring(f3), c2++), y3 !== void 0) return y3;
                }
              }
            });
            return _3(o, t), o;
          }
          function Lr(e, t) {
            var r = this, o = r.ready().then(function() {
              var i = r._dbInfo, n;
              try {
                n = localStorage.key(e);
              } catch {
                n = null;
              }
              return n && (n = n.substring(i.keyPrefix.length)), n;
            });
            return _3(o, t), o;
          }
          function Pr(e) {
            var t = this, r = t.ready().then(function() {
              for (var o = t._dbInfo, i = localStorage.length, n = [], f3 = 0; f3 < i; f3++) {
                var u3 = localStorage.key(f3);
                u3.indexOf(o.keyPrefix) === 0 && n.push(u3.substring(o.keyPrefix.length));
              }
              return n;
            });
            return _3(r, e), r;
          }
          function Mr(e) {
            var t = this, r = t.keys().then(function(o) {
              return o.length;
            });
            return _3(r, e), r;
          }
          function Fr(e, t) {
            var r = this;
            e = z(e);
            var o = r.ready().then(function() {
              var i = r._dbInfo;
              localStorage.removeItem(i.keyPrefix + e);
            });
            return _3(o, t), o;
          }
          function Ur2(e, t, r) {
            var o = this;
            e = z(e);
            var i = o.ready().then(function() {
              t === void 0 && (t = null);
              var n = t;
              return new m3(function(f3, u3) {
                var c2 = o._dbInfo;
                c2.serializer.serialize(t, function(l, d2) {
                  if (d2) u3(d2);
                  else try {
                    localStorage.setItem(c2.keyPrefix + e, l), f3(n);
                  } catch (y3) {
                    (y3.name === "QuotaExceededError" || y3.name === "NS_ERROR_DOM_QUOTA_REACHED") && u3(y3), u3(y3);
                  }
                });
              });
            });
            return _3(i, r), i;
          }
          function Yr(e, t) {
            if (t = Z2.apply(this, arguments), e = typeof e != "function" && e || {}, !e.name) {
              var r = this.config();
              e.name = e.name || r.name, e.storeName = e.storeName || r.storeName;
            }
            var o = this, i;
            return e.name ? i = new m3(function(n) {
              e.storeName ? n(Ge(e, o._defaultConfig)) : n(e.name + "/");
            }).then(function(n) {
              for (var f3 = localStorage.length - 1; f3 >= 0; f3--) {
                var u3 = localStorage.key(f3);
                u3.indexOf(n) === 0 && localStorage.removeItem(u3);
              }
            }) : i = m3.reject("Invalid arguments"), _3(i, t), i;
          }
          var zr = { _driver: "localStorageWrapper", _initStorage: Br, _support: Dr(), iterate: Cr, getItem: Or, setItem: Ur2, removeItem: Fr, clear: xr, length: Mr, key: Lr, keys: Pr, dropInstance: Yr }, Wr = function(t, r) {
            return t === r || typeof t == "number" && typeof r == "number" && isNaN(t) && isNaN(r);
          }, Kr = function(t, r) {
            for (var o = t.length, i = 0; i < o; ) {
              if (Wr(t[i], r)) return true;
              i++;
            }
            return false;
          }, je = Array.isArray || function(e) {
            return Object.prototype.toString.call(e) === "[object Array]";
          }, le2 = {}, Xe2 = {}, ue2 = { INDEXEDDB: cr2, WEBSQL: Rr2, LOCALSTORAGE: zr }, Hr = [ue2.INDEXEDDB._driver, ue2.WEBSQL._driver, ue2.LOCALSTORAGE._driver], me2 = ["dropInstance"], Se2 = ["clear", "getItem", "iterate", "key", "keys", "length", "removeItem", "setItem"].concat(me2), Vr = { description: "", driver: Hr.slice(), name: "localforage", size: 4980736, storeName: "keyvaluepairs", version: 1 };
          function Gr(e, t) {
            e[t] = function() {
              var r = arguments;
              return e.ready().then(function() {
                return e[t].apply(e, r);
              });
            };
          }
          function Ae2() {
            for (var e = 1; e < arguments.length; e++) {
              var t = arguments[e];
              if (t) for (var r in t) t.hasOwnProperty(r) && (je(t[r]) ? arguments[0][r] = t[r].slice() : arguments[0][r] = t[r]);
            }
            return arguments[0];
          }
          var jr = function() {
            function e(t) {
              Y(this, e);
              for (var r in ue2) if (ue2.hasOwnProperty(r)) {
                var o = ue2[r], i = o._driver;
                this[r] = i, le2[i] || this.defineDriver(o);
              }
              this._defaultConfig = Ae2({}, Vr), this._config = Ae2({}, this._defaultConfig, t), this._driverSet = null, this._initDriver = null, this._ready = false, this._dbInfo = null, this._wrapLibraryMethodsWithReady(), this.setDriver(this._config.driver).catch(function() {
              });
            }
            return e.prototype.config = function(r) {
              if ((typeof r > "u" ? "undefined" : P2(r)) === "object") {
                if (this._ready) return new Error("Can't call config() after localforage has been used.");
                for (var o in r) {
                  if (o === "storeName" && (r[o] = r[o].replace(/\W/g, "_")), o === "version" && typeof r[o] != "number") return new Error("Database version must be a number.");
                  this._config[o] = r[o];
                }
                return "driver" in r && r.driver ? this.setDriver(this._config.driver) : true;
              } else return typeof r == "string" ? this._config[r] : this._config;
            }, e.prototype.defineDriver = function(r, o, i) {
              var n = new m3(function(f3, u3) {
                try {
                  var c2 = r._driver, l = new Error("Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver");
                  if (!r._driver) {
                    u3(l);
                    return;
                  }
                  for (var d2 = Se2.concat("_initStorage"), y3 = 0, S2 = d2.length; y3 < S2; y3++) {
                    var x2 = d2[y3], C = !Kr(me2, x2);
                    if ((C || r[x2]) && typeof r[x2] != "function") {
                      u3(l);
                      return;
                    }
                  }
                  var K2 = function() {
                    for (var de = function(Jr) {
                      return function() {
                        var $r = new Error("Method " + Jr + " is not implemented by the current driver"), Qe2 = m3.reject($r);
                        return _3(Qe2, arguments[arguments.length - 1]), Qe2;
                      };
                    }, Re2 = 0, Qr = me2.length; Re2 < Qr; Re2++) {
                      var De2 = me2[Re2];
                      r[De2] || (r[De2] = de(De2));
                    }
                  };
                  K2();
                  var W2 = function(de) {
                    le2[c2] && console.info("Redefining LocalForage driver: " + c2), le2[c2] = r, Xe2[c2] = de, f3();
                  };
                  "_support" in r ? r._support && typeof r._support == "function" ? r._support().then(W2, u3) : W2(!!r._support) : W2(true);
                } catch (q2) {
                  u3(q2);
                }
              });
              return B2(n, o, i), n;
            }, e.prototype.driver = function() {
              return this._driver || null;
            }, e.prototype.getDriver = function(r, o, i) {
              var n = le2[r] ? m3.resolve(le2[r]) : m3.reject(new Error("Driver not found."));
              return B2(n, o, i), n;
            }, e.prototype.getSerializer = function(r) {
              var o = m3.resolve(Ie2);
              return B2(o, r), o;
            }, e.prototype.ready = function(r) {
              var o = this, i = o._driverSet.then(function() {
                return o._ready === null && (o._ready = o._initDriver()), o._ready;
              });
              return B2(i, r, r), i;
            }, e.prototype.setDriver = function(r, o, i) {
              var n = this;
              je(r) || (r = [r]);
              var f3 = this._getSupportedDrivers(r);
              function u3() {
                n._config.driver = n.driver();
              }
              function c2(y3) {
                return n._extend(y3), u3(), n._ready = n._initStorage(n._config), n._ready;
              }
              function l(y3) {
                return function() {
                  var S2 = 0;
                  function x2() {
                    for (; S2 < y3.length; ) {
                      var C = y3[S2];
                      return S2++, n._dbInfo = null, n._ready = null, n.getDriver(C).then(c2).catch(x2);
                    }
                    u3();
                    var K2 = new Error("No available storage method found.");
                    return n._driverSet = m3.reject(K2), n._driverSet;
                  }
                  return x2();
                };
              }
              var d2 = this._driverSet !== null ? this._driverSet.catch(function() {
                return m3.resolve();
              }) : m3.resolve();
              return this._driverSet = d2.then(function() {
                var y3 = f3[0];
                return n._dbInfo = null, n._ready = null, n.getDriver(y3).then(function(S2) {
                  n._driver = S2._driver, u3(), n._wrapLibraryMethodsWithReady(), n._initDriver = l(f3);
                });
              }).catch(function() {
                u3();
                var y3 = new Error("No available storage method found.");
                return n._driverSet = m3.reject(y3), n._driverSet;
              }), B2(this._driverSet, o, i), this._driverSet;
            }, e.prototype.supports = function(r) {
              return !!Xe2[r];
            }, e.prototype._extend = function(r) {
              Ae2(this, r);
            }, e.prototype._getSupportedDrivers = function(r) {
              for (var o = [], i = 0, n = r.length; i < n; i++) {
                var f3 = r[i];
                this.supports(f3) && o.push(f3);
              }
              return o;
            }, e.prototype._wrapLibraryMethodsWithReady = function() {
              for (var r = 0, o = Se2.length; r < o; r++) Gr(this, Se2[r]);
            }, e.prototype.createInstance = function(r) {
              return new e(r);
            }, e;
          }(), Xr = new jr();
          D3.exports = Xr;
        }, { 3: 3 }] }, {}, [4])(4);
      });
    });
    rr2 = $e2((ye, er) => {
      (function(b3, A2) {
        typeof ye == "object" && typeof er < "u" ? A2(ye) : typeof define == "function" && define.amd ? define("localforage-driver-memory", ["exports"], A2) : A2(b3.LocalforageDriverMemory = {});
      })(typeof self < "u" ? self : ye, function(b3) {
        "use strict";
        var A2 = "localforage-driver-memory";
        function R3(a2) {
          var s = typeof Symbol == "function" && a2[Symbol.iterator], v2 = 0;
          return s ? s.call(a2) : { next: function() {
            return a2 && v2 >= a2.length && (a2 = void 0), { value: a2 && a2[v2++], done: !a2 };
          } };
        }
        function L3(a2, s) {
          a2 = a2 || [], s = s || {};
          try {
            return new Blob(a2, s);
          } catch (w2) {
            if (w2.name !== "TypeError") throw w2;
            for (var v2 = typeof BlobBuilder < "u" ? BlobBuilder : typeof MSBlobBuilder < "u" ? MSBlobBuilder : typeof MozBlobBuilder < "u" ? MozBlobBuilder : WebKitBlobBuilder, p2 = new v2(), g2 = 0; g2 < a2.length; g2 += 1) p2.append(a2[g2]);
            return p2.getBlob(s.type);
          }
        }
        var D3 = /^~~local_forage_type~([^~]+)~/, X2 = 9, P2 = X2 + 4, Y = Object.prototype.toString;
        function I2(a2) {
          var s = a2.length * 0.75, v2 = a2.length;
          a2[a2.length - 1] === "=" && (s--, a2[a2.length - 2] === "=" && s--);
          for (var p2 = new ArrayBuffer(s), g2 = new Uint8Array(p2), w2 = 0, T3 = 0; w2 < v2; w2 += 4) {
            var G3 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(a2[w2]), fe2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(a2[w2 + 1]), ie = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(a2[w2 + 2]), ce2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(a2[w2 + 3]);
            g2[T3++] = G3 << 2 | fe2 >> 4, g2[T3++] = (fe2 & 15) << 4 | ie >> 2, g2[T3++] = (ie & 3) << 6 | ce2 & 63;
          }
          return p2;
        }
        function M2(a2) {
          for (var s = new Uint8Array(a2), v2 = "", p2 = 0; p2 < s.length; p2 += 3) v2 += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[s[p2] >> 2], v2 += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[(s[p2] & 3) << 4 | s[p2 + 1] >> 4], v2 += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[(s[p2 + 1] & 15) << 2 | s[p2 + 2] >> 6], v2 += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[s[p2 + 2] & 63];
          return s.length % 3 === 2 ? v2 = v2.substring(0, v2.length - 1) + "=" : s.length % 3 === 1 && (v2 = v2.substring(0, v2.length - 2) + "=="), v2;
        }
        function H3(a2, s) {
          var v2 = "";
          if (a2 && (v2 = Y.call(a2)), a2 && (v2 === "[object ArrayBuffer]" || a2.buffer && Y.call(a2.buffer) === "[object ArrayBuffer]")) {
            var p2 = void 0, g2 = "__lfsc__:";
            a2 instanceof ArrayBuffer ? (p2 = a2, g2 += "arbf") : (p2 = a2.buffer, v2 === "[object Int8Array]" ? g2 += "si08" : v2 === "[object Uint8Array]" ? g2 += "ui08" : v2 === "[object Uint8ClampedArray]" ? g2 += "uic8" : v2 === "[object Int16Array]" ? g2 += "si16" : v2 === "[object Uint16Array]" ? g2 += "ur16" : v2 === "[object Int32Array]" ? g2 += "si32" : v2 === "[object Uint32Array]" ? g2 += "ui32" : v2 === "[object Float32Array]" ? g2 += "fl32" : v2 === "[object Float64Array]" ? g2 += "fl64" : s(new Error("Failed to get type for BinaryArray"))), s(g2 + M2(p2));
          } else if (v2 === "[object Blob]") {
            var w2 = new FileReader();
            w2.onload = function() {
              var T3 = "~~local_forage_type~" + a2.type + "~" + M2(this.result);
              s("__lfsc__:blob" + T3);
            }, w2.readAsArrayBuffer(a2);
          } else try {
            s(JSON.stringify(a2));
          } catch (T3) {
            console.error("Couldn't convert value into a JSON string: ", a2), s(null, T3);
          }
        }
        function $2(a2) {
          if (a2.substring(0, X2) !== "__lfsc__:") return JSON.parse(a2);
          var s = a2.substring(P2), v2 = a2.substring(X2, P2), p2;
          if (v2 === "blob" && D3.test(s)) {
            var g2 = s.match(D3);
            p2 = g2[1], s = s.substring(g2[0].length);
          }
          var w2 = I2(s);
          switch (v2) {
            case "arbf":
              return w2;
            case "blob":
              return L3([w2], { type: p2 });
            case "si08":
              return new Int8Array(w2);
            case "ui08":
              return new Uint8Array(w2);
            case "uic8":
              return new Uint8ClampedArray(w2);
            case "si16":
              return new Int16Array(w2);
            case "ur16":
              return new Uint16Array(w2);
            case "si32":
              return new Int32Array(w2);
            case "ui32":
              return new Uint32Array(w2);
            case "fl32":
              return new Float32Array(w2);
            case "fl64":
              return new Float64Array(w2);
            default:
              throw new Error("Unkown type: " + v2);
          }
        }
        function m3(a2) {
          var s, v2;
          if (a2 === null || typeof a2 != "object" || "isActiveClone" in a2) return a2;
          var p2 = a2 instanceof Date ? new Date(a2) : a2.constructor();
          try {
            for (var g2 = R3(Object.keys(a2)), w2 = g2.next(); !w2.done; w2 = g2.next()) {
              var T3 = w2.value;
              Object.prototype.hasOwnProperty.call(a2, T3) && (a2.isActiveClone = null, p2[T3] = m3(a2[T3]), delete a2.isActiveClone);
            }
          } catch (G3) {
            s = { error: G3 };
          } finally {
            try {
              w2 && !w2.done && (v2 = g2.return) && v2.call(g2);
            } finally {
              if (s) throw s.error;
            }
          }
          return p2;
        }
        function _3(a2, s) {
          return (a2.name || s.name) + "/" + (a2.storeName || s.storeName) + "/";
        }
        function B2(a2, s) {
          s && a2.then(function(v2) {
            s(null, v2);
          }, function(v2) {
            s(v2);
          });
        }
        function z() {
          for (var a2 = [], s = 0; s < arguments.length; s++) a2[s] = arguments[s];
          if (arguments.length && typeof arguments[arguments.length - 1] == "function") return arguments[arguments.length - 1];
        }
        function Z2(a2, s) {
          var v2 = this;
          if (s = z.apply(this, arguments), a2 = typeof a2 != "function" && a2 || {}, !a2.name) {
            var p2 = this.config();
            a2.name = a2.name || p2.name, a2.storeName = a2.storeName || p2.storeName;
          }
          var g2;
          return a2.name ? g2 = new Promise(function(w2) {
            a2.storeName ? w2(_3(a2, v2._defaultConfig)) : w2(a2.name + "/");
          }) : g2 = Promise.reject("Invalid arguments"), { promise: g2, callback: s };
        }
        function F3(a2) {
          return typeof a2 != "string" && (console.warn(a2 + " used as a key, but it is not a string."), a2 = String(a2)), a2;
        }
        var k3 = { bufferToString: M2, deserialize: $2, serialize: H3, stringToBuffer: I2 }, U3 = {}, ae2 = function() {
          function a2(s) {
            this.kp = s, this.data = {};
          }
          return a2.resolve = function(s) {
            return U3[s] || (U3[s] = new a2(s)), U3[s];
          }, a2.prototype.clear = function() {
            this.data = {};
          }, a2.prototype.drop = function() {
            this.clear(), delete U3[this.kp];
          }, a2.prototype.get = function(s) {
            return this.data[s];
          }, a2.prototype.key = function(s) {
            return this.keys()[s];
          }, a2.prototype.keys = function() {
            return Object.keys(this.data);
          }, a2.prototype.rm = function(s) {
            delete this.data[s];
          }, a2.prototype.set = function(s, v2) {
            this.data[s] = v2;
          }, a2;
        }();
        function re2(a2) {
          var s = a2 ? m3(a2) : {}, v2 = _3(s, this._defaultConfig), p2 = ae2.resolve(v2);
          return this._dbInfo = s, this._dbInfo.serializer = k3, this._dbInfo.keyPrefix = v2, this._dbInfo.mStore = p2, Promise.resolve();
        }
        function h3(a2) {
          var s = this, v2 = this.ready().then(function() {
            s._dbInfo.mStore.clear();
          });
          return B2(v2, a2), v2;
        }
        function N3(a2, s) {
          var v2 = Z2.apply(this, arguments), p2 = v2.promise, g2 = v2.callback, w2 = p2.then(function(T3) {
            ae2.resolve(T3).drop();
          });
          return B2(w2, g2), p2;
        }
        function E3(a2, s) {
          var v2 = this;
          a2 = F3(a2);
          var p2 = this.ready().then(function() {
            var g2 = v2._dbInfo.mStore.get(a2);
            return g2 == null ? null : v2._dbInfo.serializer.deserialize(g2);
          });
          return B2(p2, s), p2;
        }
        function O3(a2, s) {
          var v2 = this, p2 = this.ready().then(function() {
            for (var g2 = v2._dbInfo.mStore, w2 = g2.keys(), T3 = 0; T3 < w2.length; T3++) {
              var G3 = g2.get(w2[T3]);
              if (G3 && (G3 = v2._dbInfo.serializer.deserialize(G3)), G3 = a2(G3, w2[T3], T3 + 1), G3 !== void 0) return G3;
            }
          });
          return B2(p2, s), p2;
        }
        function V3(a2, s) {
          var v2 = this, p2 = this.ready().then(function() {
            var g2;
            try {
              g2 = v2._dbInfo.mStore.key(a2), g2 === void 0 && (g2 = null);
            } catch {
              g2 = null;
            }
            return g2;
          });
          return B2(p2, s), p2;
        }
        function j2(a2) {
          var s = this, v2 = this.ready().then(function() {
            return s._dbInfo.mStore.keys();
          });
          return B2(v2, a2), v2;
        }
        function Q(a2) {
          var s = this.keys().then(function(v2) {
            return v2.length;
          });
          return B2(s, a2), s;
        }
        function J(a2, s) {
          var v2 = this;
          a2 = F3(a2);
          var p2 = this.ready().then(function() {
            v2._dbInfo.mStore.rm(a2);
          });
          return B2(p2, s), p2;
        }
        function ee2(a2, s, v2) {
          var p2 = this;
          a2 = F3(a2);
          var g2 = this.ready().then(function() {
            s === void 0 && (s = null);
            var w2 = s;
            return new Promise(function(T3, G3) {
              p2._dbInfo.serializer.serialize(s, function(fe2, ie) {
                if (ie) G3(ie);
                else try {
                  p2._dbInfo.mStore.set(a2, fe2), T3(w2);
                } catch (ce2) {
                  G3(ce2);
                }
              });
            });
          });
          return B2(g2, v2), g2;
        }
        var oe2 = true;
        b3._support = oe2, b3._driver = A2, b3._initStorage = re2, b3.clear = h3, b3.dropInstance = N3, b3.getItem = E3, b3.iterate = O3, b3.key = V3, b3.keys = j2, b3.length = Q, b3.removeItem = J, b3.setItem = ee2, Object.defineProperty(b3, "__esModule", { value: true });
      });
    });
    ge = Ze2(ke2());
    Te2 = Ze2(rr2());
    at2 = { display: "block", visibility: "hidden", position: "fixed", top: "0", right: "0", width: "100%", height: "100%", borderRadius: "0", border: "none", zIndex: "2147483647" };
    pe2 = class extends Be {
      constructor() {
        super(...arguments);
        this.activeElement = null;
      }
      init() {
        this.test = "hello", this.iframe = new Promise((R3) => {
          let L3 = () => {
            if (ut2(encodeURIComponent(this.parameters))) Ur().log();
            else {
              let D3 = document.createElement("iframe");
              D3.classList.add("magic-iframe"), D3.dataset.magicIframeLabel = Je(this.endpoint).host, D3.title = "Secure Modal", D3.src = Je(`/send?params=${encodeURIComponent(this.parameters)}`, this.endpoint).href, D3.allow = "clipboard-read; clipboard-write", ft2(D3), document.body.appendChild(D3), R3(D3);
            }
          };
          ["loaded", "interactive", "complete"].includes(document.readyState) ? L3() : window.addEventListener("load", L3, false);
        }), window.addEventListener("message", (R3) => {
          var L3;
          if (R3.origin === this.endpoint && R3.data && R3.data.msgType && this.messageHandlers.size) {
            R3.data.response = (L3 = R3.data.response) != null ? L3 : {};
            for (let D3 of this.messageHandlers.values()) D3(R3);
          }
        });
      }
      showOverlay() {
        return se2(this, null, function* () {
          let R3 = yield this.iframe;
          R3.style.visibility = "visible", this.activeElement = document.activeElement, R3.focus();
        });
      }
      hideOverlay() {
        return se2(this, null, function* () {
          var L3;
          let R3 = yield this.iframe;
          R3.style.visibility = "hidden", (L3 = this.activeElement) != null && L3.focus && this.activeElement.focus(), this.activeElement = null;
        });
      }
      _post(R3) {
        return se2(this, null, function* () {
          let L3 = yield this.iframe;
          if (L3 && L3.contentWindow) L3.contentWindow.postMessage(R3, this.endpoint);
          else throw mt();
        });
      }
    };
    bt = Kn(Ce, { platform: "web", sdkName: "magic-sdk", version: "28.5.0", defaultEndpoint: "https://auth.magic.link/", ViewController: pe2, configureStorage: () => se2(void 0, null, function* () {
      let b3 = ge.default.createInstance({ name: "MagicAuthLocalStorageDB", storeName: "MagicAuthLocalStorage" });
      return yield b3.defineDriver(Te2), yield b3.setDriver([ge.default.INDEXEDDB, ge.default.LOCALSTORAGE, Te2._driver]), b3;
    }) });
  }
});

// ../../node_modules/.pnpm/@magic-ext+algorand@23.5.0/node_modules/@magic-ext/algorand/dist/es/index.mjs
var es_exports2 = {};
__export(es_exports2, {
  AlgorandExtension: () => c
});
var a, c;
var init_es5 = __esm({
  "../../node_modules/.pnpm/@magic-ext+algorand@23.5.0/node_modules/@magic-ext/algorand/dist/es/index.mjs"() {
    "use strict";
    init_es3();
    a = (s, e, n) => new Promise((g2, o) => {
      var l = (r) => {
        try {
          i(n.next(r));
        } catch (t) {
          o(t);
        }
      }, u3 = (r) => {
        try {
          i(n.throw(r));
        } catch (t) {
          o(t);
        }
      }, i = (r) => r.done ? g2(r.value) : Promise.resolve(r.value).then(l, u3);
      i((n = n.apply(s, e)).next());
    });
    c = class extends q.Internal {
      constructor(n) {
        super();
        this.algorandConfig = n;
        this.name = "algod";
        this.config = {};
        this.config = { rpcUrl: n.rpcUrl, chainType: "ALOGD" };
      }
      signTransaction(n) {
        return a(this, null, function* () {
          return this.request(this.utils.createJsonRpcRequestPayload("algod_signTransaction", n));
        });
      }
      signBid(n) {
        return a(this, null, function* () {
          return this.request(this.utils.createJsonRpcRequestPayload("algod_signBid", n));
        });
      }
      getWallet() {
        return a(this, null, function* () {
          return this.request(this.utils.createJsonRpcRequestPayload("algod_getWallet", []));
        });
      }
      signGroupTransaction(n) {
        return a(this, null, function* () {
          return this.request(this.utils.createJsonRpcRequestPayload("algod_signGroupTransaction", n));
        });
      }
      signGroupTransactionV2(n) {
        return a(this, null, function* () {
          return this.request(this.utils.createJsonRpcRequestPayload("algod_signGroupTransactionV2", n));
        });
      }
    };
  }
});

// src/index.ts
var src_exports = {};
__export(src_exports, {
  BaseWallet: () => BaseWallet,
  CustomWallet: () => CustomWallet,
  DeflyWallet: () => DeflyWallet,
  ExodusWallet: () => ExodusWallet,
  ICON: () => ICON3,
  KIBISIS_AVM_WEB_PROVIDER_ID: () => KIBISIS_AVM_WEB_PROVIDER_ID,
  KibisisWallet: () => KibisisWallet,
  KmdWallet: () => KmdWallet,
  LOCAL_STORAGE_MNEMONIC_KEY: () => LOCAL_STORAGE_MNEMONIC_KEY,
  MagicAuth: () => MagicAuth,
  MnemonicWallet: () => MnemonicWallet,
  NetworkId: () => NetworkId,
  PeraWallet: () => PeraWallet,
  SessionError: () => SessionError,
  SignTxnsError: () => SignTxnsError,
  StorageAdapter: () => StorageAdapter,
  WalletConnect: () => WalletConnect,
  WalletId: () => WalletId,
  WalletManager: () => WalletManager,
  defaultState: () => defaultState,
  isAVMWebProviderSDKError: () => isAVMWebProviderSDKError
});
module.exports = __toCommonJS(src_exports);

// src/manager.ts
var import_store13 = require("@tanstack/store");
var import_algosdk12 = __toESM(require("algosdk"), 1);

// src/network.ts
var NetworkId = /* @__PURE__ */ ((NetworkId2) => {
  NetworkId2["MAINNET"] = "mainnet";
  NetworkId2["TESTNET"] = "testnet";
  NetworkId2["BETANET"] = "betanet";
  NetworkId2["FNET"] = "fnet";
  NetworkId2["LOCALNET"] = "localnet";
  return NetworkId2;
})(NetworkId || {});
function isValidNetworkId(networkId) {
  return Object.values(NetworkId).includes(networkId);
}
function isNetworkConfigMap(config) {
  const networkKeys = Object.values(NetworkId);
  return Object.keys(config).some((key) => networkKeys.includes(key));
}
var nodeServerMap = {
  ["mainnet" /* MAINNET */]: "https://mainnet-api.4160.nodely.dev",
  ["testnet" /* TESTNET */]: "https://testnet-api.4160.nodely.dev",
  ["betanet" /* BETANET */]: "https://betanet-api.4160.nodely.dev",
  ["fnet" /* FNET */]: "https://fnet-api.4160.nodely.dev"
};
function createDefaultNetworkConfig() {
  const localnetConfig = {
    token: "a".repeat(64),
    baseServer: "http://localhost",
    port: 4001,
    headers: {}
  };
  return Object.values(NetworkId).reduce((configMap, value) => {
    const network = value;
    const isLocalnet = network === "localnet" /* LOCALNET */;
    configMap[network] = isLocalnet ? localnetConfig : {
      token: "",
      baseServer: nodeServerMap[network],
      port: "",
      headers: {}
    };
    return configMap;
  }, {});
}
var caipChainId = {
  ["mainnet" /* MAINNET */]: "algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73k",
  ["voimain" /* VOIMAIN */]: "algorand:r20fSQI8gWe_kFZziNonSPCXLwcQmH_n",
};

// src/storage.ts
var StorageAdapter = class {
  static getItem(key) {
    if (typeof window === "undefined") {
      return null;
    }
    return localStorage.getItem(key);
  }
  static setItem(key, value) {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.setItem(key, value);
  }
};

// src/store.ts
var import_algosdk11 = __toESM(require("algosdk"), 1);

// src/wallets/base.ts
var BaseWallet = class {
  id;
  metadata;
  store;
  getAlgodClient;
  subscribe;
  constructor({
    id,
    metadata,
    store,
    subscribe,
    getAlgodClient
  }) {
    this.id = id;
    this.store = store;
    this.subscribe = subscribe;
    this.getAlgodClient = getAlgodClient;
    const ctor = this.constructor;
    this.metadata = { ...ctor.defaultMetadata, ...metadata };
  }
  static defaultMetadata = { name: "Base Wallet", icon: "" };
  setActive = () => {
    console.info(`[Wallet] Set active wallet: ${this.id}`);
    setActiveWallet(this.store, { walletId: this.id });
  };
  setActiveAccount = (account) => {
    console.info(`[Wallet] Set active account: ${account}`);
    setActiveAccount(this.store, {
      walletId: this.id,
      address: account
    });
  };
  transactionSigner = async (txnGroup, indexesToSign) => {
    const signTxnsResult = await this.signTransactions(txnGroup, indexesToSign);
    const signedTxns = signTxnsResult.reduce((acc, value) => {
      if (value !== null) {
        acc.push(value);
      }
      return acc;
    }, []);
    return signedTxns;
  };
  // ---------- Derived Properties ------------------------------------ //
  get name() {
    return this.id.toUpperCase();
  }
  get accounts() {
    const state = this.store.state;
    const walletState = state.wallets[this.id];
    return walletState ? walletState.accounts : [];
  }
  get addresses() {
    return this.accounts.map((account) => account.address);
  }
  get activeAccount() {
    const state = this.store.state;
    const walletState = state.wallets[this.id];
    return walletState ? walletState.activeAccount : null;
  }
  get activeAddress() {
    return this.activeAccount?.address ?? null;
  }
  get activeNetwork() {
    const state = this.store.state;
    return state.activeNetwork;
  }
  get isConnected() {
    const state = this.store.state;
    const walletState = state.wallets[this.id];
    return walletState ? walletState.accounts.length > 0 : false;
  }
  get isActive() {
    const state = this.store.state;
    return state.activeWallet === this.id;
  }
  // ---------- Protected Methods ------------------------------------- //
  onDisconnect() {
    removeWallet(this.store, { walletId: this.id });
  }
};

// src/wallets/types.ts
var WalletId = /* @__PURE__ */ ((WalletId2) => {
  WalletId2["DEFLY"] = "defly";
  WalletId2["CUSTOM"] = "custom";
  WalletId2["EXODUS"] = "exodus";
  WalletId2["KIBISIS"] = "kibisis";
  WalletId2["KMD"] = "kmd";
  WalletId2["LUTE"] = "lute";
  WalletId2["MAGIC"] = "magic";
  WalletId2["MNEMONIC"] = "mnemonic";
  WalletId2["PERA"] = "pera";
  WalletId2["PERA2"] = "pera-beta";
  WalletId2["WALLETCONNECT"] = "walletconnect";
  return WalletId2;
})(WalletId || {});
var SignTxnsError = class extends Error {
  code;
  data;
  constructor(message, code, data) {
    super(message);
    this.name = "SignTxnsError";
    this.code = code;
    this.data = data;
  }
};

// src/wallets/defly.ts
var import_algosdk = __toESM(require("algosdk"), 1);
var ICON = `data:image/svg+xml;base64,${btoa(`
<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" />
  <path fill="#FFFFFF" d="M779.9,684.4L512,230L244.1,684.4L512,529.5L779.9,684.4z" />
  <path fill="#FFFFFF" d="M733.1,730L512,613.5L290.9,730L512,658L733.1,730z" />
</svg>
`)}`;
var DeflyWallet = class extends BaseWallet {
  client = null;
  options;
  store;
  constructor({
    id,
    store,
    subscribe,
    getAlgodClient,
    options = {},
    metadata = {}
  }) {
    super({ id, metadata, getAlgodClient, store, subscribe });
    this.options = options;
    this.store = store;
  }
  static defaultMetadata = {
    name: "Defly",
    icon: ICON
  };
  async initializeClient() {
    console.info(`[${this.metadata.name}] Initializing client...`);
    const module2 = await import("@blockshake/defly-connect");
    const DeflyWalletConnect = module2.default ? module2.default.DeflyWalletConnect : module2.DeflyWalletConnect;
    const client = new DeflyWalletConnect(this.options);
    client.connector?.on("disconnect", this.onDisconnect);
    this.client = client;
    return client;
  }
  connect = async () => {
    console.info(`[${this.metadata.name}] Connecting...`);
    const client = this.client || await this.initializeClient();
    const accounts = await client.connect();
    if (accounts.length === 0) {
      throw new Error("No accounts found!");
    }
    const walletAccounts = accounts.map((address, idx) => ({
      name: `${this.metadata.name} Account ${idx + 1}`,
      address
    }));
    const activeAccount = walletAccounts[0];
    const walletState = {
      accounts: walletAccounts,
      activeAccount
    };
    addWallet(this.store, {
      walletId: this.id,
      wallet: walletState
    });
    console.info(`[${this.metadata.name}] \u2705 Connected.`, walletState);
    return walletAccounts;
  };
  disconnect = async () => {
    console.info(`[${this.metadata.name}] Disconnecting...`);
    this.onDisconnect();
    const client = this.client || await this.initializeClient();
    await client.disconnect();
    console.info(`[${this.metadata.name}] Disconnected.`);
  };
  resumeSession = async () => {
    try {
      const state = this.store.state;
      const walletState = state.wallets[this.id];
      if (!walletState) {
        return;
      }
      console.info(`[${this.metadata.name}] Resuming session...`);
      const client = this.client || await this.initializeClient();
      const accounts = await client.reconnectSession();
      if (accounts.length === 0) {
        throw new Error("No accounts found!");
      }
      const walletAccounts = accounts.map((address, idx) => ({
        name: `${this.metadata.name} Account ${idx + 1}`,
        address
      }));
      const match = compareAccounts(walletAccounts, walletState.accounts);
      if (!match) {
        console.warn(`[${this.metadata.name}] Session accounts mismatch, updating accounts`, {
          prev: walletState.accounts,
          current: walletAccounts
        });
        setAccounts(this.store, {
          walletId: this.id,
          accounts: walletAccounts
        });
      }
    } catch (error) {
      console.error(`[${this.metadata.name}] Error resuming session: ${error.message}`);
      this.onDisconnect();
      throw error;
    }
  };
  processTxns(txnGroup, indexesToSign) {
    const txnsToSign = [];
    txnGroup.forEach((txn, index) => {
      const isIndexMatch = !indexesToSign || indexesToSign.includes(index);
      const signer = import_algosdk.default.encodeAddress(txn.from.publicKey);
      const canSignTxn = this.addresses.includes(signer);
      if (isIndexMatch && canSignTxn) {
        txnsToSign.push({ txn });
      } else {
        txnsToSign.push({ txn, signers: [] });
      }
    });
    return txnsToSign;
  }
  processEncodedTxns(txnGroup, indexesToSign) {
    const txnsToSign = [];
    txnGroup.forEach((txnBuffer, index) => {
      const txnDecodeObj = import_algosdk.default.decodeObj(txnBuffer);
      const isSigned = isSignedTxn(txnDecodeObj);
      const txn = isSigned ? import_algosdk.default.decodeSignedTransaction(txnBuffer).txn : import_algosdk.default.decodeUnsignedTransaction(txnBuffer);
      const isIndexMatch = !indexesToSign || indexesToSign.includes(index);
      const signer = import_algosdk.default.encodeAddress(txn.from.publicKey);
      const canSignTxn = !isSigned && this.addresses.includes(signer);
      if (isIndexMatch && canSignTxn) {
        txnsToSign.push({ txn });
      } else {
        txnsToSign.push({ txn, signers: [] });
      }
    });
    return txnsToSign;
  }
  signTransactions = async (txnGroup, indexesToSign) => {
    let txnsToSign = [];
    if (isTransactionArray(txnGroup)) {
      const flatTxns = flattenTxnGroup(txnGroup);
      txnsToSign = this.processTxns(flatTxns, indexesToSign);
    } else {
      const flatTxns = flattenTxnGroup(txnGroup);
      txnsToSign = this.processEncodedTxns(flatTxns, indexesToSign);
    }
    const client = this.client || await this.initializeClient();
    const signedTxns = await client.signTransaction([txnsToSign]);
    const result = txnsToSign.reduce((acc, txn) => {
      if (txn.signers && txn.signers.length == 0) {
        acc.push(null);
      } else {
        const signedTxn = signedTxns.shift();
        if (signedTxn) {
          acc.push(signedTxn);
        }
      }
      return acc;
    }, []);
    return result;
  };
};

// src/wallets/exodus.ts
var import_algosdk2 = __toESM(require("algosdk"), 1);
var ICON2 = `data:image/svg+xml;base64,${btoa(`
<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <linearGradient id="grad1" gradientUnits="userSpaceOnUse" x1="246.603" y1="9.2212" x2="174.158" y2="308.5426" gradientTransform="matrix(1 0 0 -1 0 302)">
    <stop offset="0" stop-color="#0B46F9" />
    <stop offset="1" stop-color="#BBFBE0" />
  </linearGradient>
  <path fill="url(#grad1)" d="M274.7,93.9L166.6,23v39.6l69.4,45.1l-8.2,25.8h-61.2v32.9h61.2l8.2,25.8l-69.4,45.1V277l108.2-70.7L257,150.1L274.7,93.9z" />
  
  <linearGradient id="grad2" gradientUnits="userSpaceOnUse" x1="129.3516" y1="-19.1573" x2="56.9066" y2="280.1641" gradientTransform="matrix(1 0 0 -1 0 302)">
    <stop offset="0" stop-color="#0B46F9" />
    <stop offset="1" stop-color="#BBFBE0" />
  </linearGradient>
  <path fill="url(#grad2)" d="M72.5,166.4h61v-32.9H72.2l-7.9-25.8l69.2-45.1V23L25.3,93.9L43,150.1l-17.7,56.2L133.7,277v-39.6l-69.4-45.1L72.5,166.4z" />
  
  <mask id="mask1" maskUnits="userSpaceOnUse" x="25.4" y="23" width="247.6" height="254">
    <path fill="url(#grad1)" d="M274.7,93.9L166.6,23v39.6l69.4,45.1l-8.2,25.8h-61.2v32.9h61.2l8.2,25.8l-69.4,45.1V277l108.2-70.7L257,150.1L274.7,93.9z" />
    <path fill="url(#grad2)" d="M72.5,166.4h61v-32.9H72.2l-7.9-25.8l69.2-45.1V23L25.3,93.9L43,150.1l-17.7,56.2L133.7,277v-39.6l-69.4-45.1L72.5,166.4z" />
  </mask>
  
  <linearGradient id="grad3" gradientUnits="userSpaceOnUse" x1="46.4662" y1="228.7554" x2="171.8638" y2="135.1039" gradientTransform="matrix(1 0 0 -1 0 302)">
    <stop offset="0.1198" stop-color="#8952FF" stop-opacity="0.87" />
    <stop offset="1" stop-color="#DABDFF" stop-opacity="0" />
  </linearGradient>
  <rect x="25.4" y="23" width="247.6" height="254" fill="url(#grad3)" mask="url(#mask1)" />
</svg>
`)}`;
var ExodusWallet = class extends BaseWallet {
  client = null;
  options;
  store;
  constructor({
    id,
    store,
    subscribe,
    getAlgodClient,
    options = {},
    metadata = {}
  }) {
    super({ id, metadata, getAlgodClient, store, subscribe });
    this.options = options;
    this.store = store;
  }
  static defaultMetadata = {
    name: "Exodus",
    icon: ICON2
  };
  async initializeClient() {
    console.info(`[${this.metadata.name}] Initializing client...`);
    if (typeof window === "undefined" || window.algorand === void 0) {
      throw new Error("Exodus is not available.");
    }
    const client = window.algorand;
    this.client = client;
    return client;
  }
  connect = async () => {
    console.info(`[${this.metadata.name}] Connecting...`);
    const client = this.client || await this.initializeClient();
    const { accounts } = await client.enable(this.options);
    if (accounts.length === 0) {
      throw new Error("No accounts found!");
    }
    const walletAccounts = accounts.map((address, idx) => ({
      name: `${this.metadata.name} Account ${idx + 1}`,
      address
    }));
    const activeAccount = walletAccounts[0];
    const walletState = {
      accounts: walletAccounts,
      activeAccount
    };
    addWallet(this.store, {
      walletId: this.id,
      wallet: walletState
    });
    console.info(`[${this.metadata.name}] \u2705 Connected.`, walletState);
    return walletAccounts;
  };
  disconnect = async () => {
    this.onDisconnect();
    console.info(`[${this.metadata.name}] Disconnected.`);
  };
  resumeSession = async () => {
    try {
      const state = this.store.state;
      const walletState = state.wallets[this.id];
      if (!walletState) {
        return;
      }
      console.info(`[${this.metadata.name}] Resuming session...`);
      const client = await this.initializeClient();
      if (!client.isConnected) {
        throw new Error("Exodus is not connected.");
      }
    } catch (error) {
      console.error(`[${this.metadata.name}] Error resuming session: ${error.message}`);
      this.onDisconnect();
      throw error;
    }
  };
  processTxns(txnGroup, indexesToSign) {
    const txnsToSign = [];
    txnGroup.forEach((txn, index) => {
      const isIndexMatch = !indexesToSign || indexesToSign.includes(index);
      const signer = import_algosdk2.default.encodeAddress(txn.from.publicKey);
      const canSignTxn = this.addresses.includes(signer);
      const txnString = byteArrayToBase64(txn.toByte());
      if (isIndexMatch && canSignTxn) {
        txnsToSign.push({ txn: txnString });
      } else {
        txnsToSign.push({ txn: txnString, signers: [] });
      }
    });
    return txnsToSign;
  }
  processEncodedTxns(txnGroup, indexesToSign) {
    const txnsToSign = [];
    txnGroup.forEach((txnBuffer, index) => {
      const txnDecodeObj = import_algosdk2.default.decodeObj(txnBuffer);
      const isSigned = isSignedTxn(txnDecodeObj);
      const txn = isSigned ? import_algosdk2.default.decodeSignedTransaction(txnBuffer).txn : import_algosdk2.default.decodeUnsignedTransaction(txnBuffer);
      const isIndexMatch = !indexesToSign || indexesToSign.includes(index);
      const signer = import_algosdk2.default.encodeAddress(txn.from.publicKey);
      const canSignTxn = !isSigned && this.addresses.includes(signer);
      const txnString = byteArrayToBase64(txn.toByte());
      if (isIndexMatch && canSignTxn) {
        txnsToSign.push({ txn: txnString });
      } else {
        txnsToSign.push({ txn: txnString, signers: [] });
      }
    });
    return txnsToSign;
  }
  signTransactions = async (txnGroup, indexesToSign) => {
    let txnsToSign = [];
    if (isTransactionArray(txnGroup)) {
      const flatTxns = flattenTxnGroup(txnGroup);
      txnsToSign = this.processTxns(flatTxns, indexesToSign);
    } else {
      const flatTxns = flattenTxnGroup(txnGroup);
      txnsToSign = this.processEncodedTxns(flatTxns, indexesToSign);
    }
    const client = this.client || await this.initializeClient();
    const signTxnsResult = await client.signTxns(txnsToSign);
    const result = signTxnsResult.map((value) => {
      if (value === null) {
        return null;
      }
      return base64ToByteArray(value);
    });
    return result;
  };
};

// src/wallets/kibisis.ts
var import_algosdk3 = __toESM(require("algosdk"), 1);
function isAVMWebProviderSDKError(error) {
  return typeof error === "object" && "code" in error && "message" in error;
}
var KIBISIS_AVM_WEB_PROVIDER_ID = "f6d1c86b-4493-42fb-b88d-a62407b4cdf6";
var ICON3 = `data:image/svg+xml;base64,${btoa(`
<svg viewBox="0 0 480 480" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#801C96" width="480" height="480" />
  <path fill="#FFFFFF" d="M393.5,223.2c0-7.3-0.6-14.6-1.6-21.6c-0.9-6.5-2.3-12.8-4-18.9c-18-64.9-77.4-112.5-148-112.5c-70.6,0-130,47.6-148,112.5c-1.7,6.2-3,12.5-4,19c-1,7.1-1.6,14.3-1.6,21.6h0v85.5h19.7v-85.5c0-7.2,0.6-14.4,1.8-21.4c14,1.1,27.6,4.3,40.5,9.5c15.9,6.4,30.3,15.6,42.6,27.3c12.3,11.7,22,25.4,28.7,40.6c6.9,15.6,10.5,32.2,10.5,49.2v81.4h0.1h19.6h0.1v-81.5c0.1-17.1,3.6-33.7,10.5-49.2c6.7-15.2,16.4-28.8,28.7-40.6c4.2-4,8.6-7.7,13.2-11.1v132.2h19.7V223.2h0c0-2.5-0.1-5-0.4-7.4c3.3-1.6,6.6-3.1,10-4.5c12.9-5.2,26.4-8.4,40.4-9.5c1.2,7,1.7,14.2,1.8,21.4v85.5h19.7L393.5,223.2L393.5,223.2z M240.1,277.3c-11.6-29.3-32.7-54.1-59.8-71c2.9-10,8.2-19.1,15.8-26.6c11.8-11.8,27.4-18.2,44-18.2s32.3,6.5,44,18.2c4.1,4.1,7.5,8.7,10.3,13.6c5.6-3.4,11.4-6.4,17.4-9.2c-14-25.2-40.9-42.3-71.8-42.3c-35.9,0-66.3,23-77.5,55.1c-15.5-7.1-32.5-11.8-50.4-13.5c1.3-4,2.7-7.9,4.3-11.8c6.7-15.9,16.4-30.3,28.7-42.6s26.6-22,42.6-28.7c16.5-7,34-10.5,52.1-10.5s35.6,3.5,52.1,10.5c15.9,6.7,30.3,16.4,42.6,28.7s22,26.6,28.7,42.6c1.6,3.9,3.1,7.8,4.3,11.8C309,189.2,260.1,226.5,240.1,277.3z" />
  <path fill="#FFFFFF" d="M158.1,359.8h19.7V245.5c-6.1-5.4-12.7-10-19.7-14V359.8z" />
</svg>
`)}`;
var KibisisWallet = class _KibisisWallet extends BaseWallet {
  avmWebClient = null;
  avmWebProviderSDK = null;
  store;
  constructor({
    id,
    store,
    subscribe,
    getAlgodClient,
    metadata = {}
  }) {
    super({ id, metadata, getAlgodClient, store, subscribe });
    this.store = store;
  }
  static defaultMetadata = {
    name: "Kibisis",
    icon: ICON3
  };
  /**
   * private functions
   */
  /**
   * Calls the "disable" method on the provider. This method will timeout after 0.75 seconds.
   * @returns {Promise<AVMWebProviderSDK.IDisableResult>} a promise that resolves to the result.
   * @private
   * @throws {MethodNotSupportedError} if the method is not supported for the configured network.
   * @throws {MethodTimedOutError} if the method timed out by lack of response (>= 3 minutes).
   * @throws {NetworkNotSupportedError} if the network is not supported for the configured network.
   * @throws {UnknownError} if the response result is empty.
   */
  async _disable() {
    const {
      ARC0027MethodEnum,
      ARC0027MethodTimedOutError,
      ARC0027UnknownError,
      LOWER_REQUEST_TIMEOUT
    } = this.avmWebProviderSDK || await this._initializeAVMWebProviderSDK();
    const avmWebClient = this.avmWebClient || await this._initializeAVMWebClient();
    const genesisHash = await this._getGenesisHash();
    return new Promise((resolve, reject) => {
      const timerId = window.setTimeout(() => {
        avmWebClient.removeListener(listenerId);
        reject(
          new ARC0027MethodTimedOutError({
            method: ARC0027MethodEnum.Disable,
            message: `no response from provider "${this.metadata.name}"`,
            providerId: KIBISIS_AVM_WEB_PROVIDER_ID
          })
        );
      }, LOWER_REQUEST_TIMEOUT);
      const listenerId = avmWebClient.onDisable(({ error, method, result }) => {
        avmWebClient.removeListener(listenerId);
        window.clearTimeout(timerId);
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(
            new ARC0027UnknownError({
              message: `received response, but "${method}" request details were empty for provider "${this.metadata.name}"`,
              providerId: KIBISIS_AVM_WEB_PROVIDER_ID
            })
          );
        }
        return resolve(result);
      });
      avmWebClient.disable({
        genesisHash,
        providerId: KIBISIS_AVM_WEB_PROVIDER_ID
      });
    });
  }
  /**
   * Calls the "enable" method on the provider. This method will timeout after 3 minutes.
   * @returns {Promise<AVMWebProviderSDK.IEnableResult>} a promise that resolves to the result.
   * @private
   * @throws {MethodCanceledError} if the method was cancelled by the user.
   * @throws {MethodNotSupportedError} if the method is not supported for the configured network.
   * @throws {MethodTimedOutError} if the method timed out by lack of response (>= 3 minutes).
   * @throws {NetworkNotSupportedError} if the network is not supported for the configured network.
   * @throws {UnknownError} if the response result is empty.
   */
  async _enable() {
    const {
      ARC0027MethodEnum,
      ARC0027MethodTimedOutError,
      ARC0027UnknownError,
      DEFAULT_REQUEST_TIMEOUT
    } = this.avmWebProviderSDK || await this._initializeAVMWebProviderSDK();
    const avmWebClient = this.avmWebClient || await this._initializeAVMWebClient();
    const genesisHash = await this._getGenesisHash();
    return new Promise((resolve, reject) => {
      const timerId = window.setTimeout(() => {
        avmWebClient.removeListener(listenerId);
        reject(
          new ARC0027MethodTimedOutError({
            method: ARC0027MethodEnum.Enable,
            message: `no response from provider "${this.metadata.name}"`,
            providerId: KIBISIS_AVM_WEB_PROVIDER_ID
          })
        );
      }, DEFAULT_REQUEST_TIMEOUT);
      const listenerId = avmWebClient.onEnable(({ error, method, result }) => {
        avmWebClient.removeListener(listenerId);
        window.clearTimeout(timerId);
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(
            new ARC0027UnknownError({
              message: `received response, but "${method}" request details were empty for provider "${this.metadata.name}"`,
              providerId: KIBISIS_AVM_WEB_PROVIDER_ID
            })
          );
        }
        return resolve(result);
      });
      avmWebClient.enable({
        genesisHash,
        providerId: KIBISIS_AVM_WEB_PROVIDER_ID
      });
    });
  }
  async _getGenesisHash() {
    const algodClient = this.getAlgodClient();
    const version = await algodClient.versionsCheck().do();
    return version.genesis_hash_b64;
  }
  async _initializeAVMWebClient() {
    const _functionName = "_initializeAVMWebClient";
    const avmWebProviderSDK = this.avmWebProviderSDK || await this._initializeAVMWebProviderSDK();
    if (!this.avmWebClient) {
      console.info(`[${_KibisisWallet.name}]#${_functionName}: initializing new client...`);
      this.avmWebClient = avmWebProviderSDK.AVMWebClient.init();
    }
    return this.avmWebClient;
  }
  async _initializeAVMWebProviderSDK() {
    const _functionName = "_initializeAVMWebProviderSDK";
    if (!this.avmWebProviderSDK) {
      console.info(
        `[${_KibisisWallet.name}]#${_functionName}: initializing @agoralabs-sh/avm-web-provider...`
      );
      const module2 = await import("@agoralabs-sh/avm-web-provider");
      this.avmWebProviderSDK = module2.default ? module2.default : module2;
      if (!this.avmWebProviderSDK) {
        throw new Error(
          "failed to initialize, the @agoralabs-sh/avm-web-provider sdk was not provided"
        );
      }
      if (!this.avmWebProviderSDK.AVMWebClient) {
        throw new Error(
          "failed to initialize, the @agoralabs-sh/avm-web-provider sdk was not provided. AVMWebClient missing"
        );
      }
    }
    return this.avmWebProviderSDK;
  }
  _mapAVMWebProviderAccountToWalletAccounts(accounts) {
    return accounts.map(({ address, name }, idx) => ({
      name: name || `[${this.metadata.name}] Account ${idx + 1}`,
      address
    }));
  }
  /**
   * Calls the "signTransactions" method to sign the supplied ARC-0001 transactions. This method will timeout after 3
   * minutes.
   * @returns {Promise<AVMWebProviderSDK.ISignTransactionsResult>} a promise that resolves to the result.
   * @private
   * @throws {InvalidInputError} if computed group ID for the txns does not match the assigned group ID.
   * @throws {InvalidGroupIdError} if the unsigned txns is malformed or not conforming to ARC-0001.
   * @throws {MethodCanceledError} if the method was cancelled by the user.
   * @throws {MethodNotSupportedError} if the method is not supported for the configured network.
   * @throws {MethodTimedOutError} if the method timed out by lack of response (>= 3 minutes).
   * @throws {NetworkNotSupportedError} if the network is not supported for the configured network.
   * @throws {UnauthorizedSignerError} if a signer in the request is not authorized by the provider.
   * @throws {UnknownError} if the response result is empty.
   */
  async _signTransactions(txns) {
    const {
      ARC0027MethodEnum,
      ARC0027MethodTimedOutError,
      ARC0027UnknownError,
      DEFAULT_REQUEST_TIMEOUT
    } = this.avmWebProviderSDK || await this._initializeAVMWebProviderSDK();
    const avmWebClient = this.avmWebClient || await this._initializeAVMWebClient();
    return new Promise((resolve, reject) => {
      const timerId = window.setTimeout(() => {
        avmWebClient.removeListener(listenerId);
        reject(
          new ARC0027MethodTimedOutError({
            method: ARC0027MethodEnum.SignTransactions,
            message: `no response from provider "${this.metadata.name}"`,
            providerId: KIBISIS_AVM_WEB_PROVIDER_ID
          })
        );
      }, DEFAULT_REQUEST_TIMEOUT);
      const listenerId = avmWebClient.onSignTransactions(({ error, method, result }) => {
        avmWebClient.removeListener(listenerId);
        window.clearTimeout(timerId);
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(
            new ARC0027UnknownError({
              message: `received response, but "${method}" request details were empty for provider "${this.metadata.name}"`,
              providerId: KIBISIS_AVM_WEB_PROVIDER_ID
            })
          );
        }
        return resolve(result);
      });
      avmWebClient.signTransactions({
        txns,
        providerId: KIBISIS_AVM_WEB_PROVIDER_ID
      });
    });
  }
  /**
   * public functions
   */
  async connect() {
    let result;
    try {
      console.info(`[${this.metadata.name}] Connecting...`);
      result = await this._enable();
      console.info(
        `[${this.metadata.name}] Successfully connected on network "${result.genesisId}"`
      );
    } catch (error) {
      console.error(
        `[${this.metadata.name}] Error connecting: ` + (isAVMWebProviderSDKError(error) ? `${error.message} (code: ${error.code})` : error.message)
      );
      throw error;
    }
    const walletAccounts = this._mapAVMWebProviderAccountToWalletAccounts(result.accounts);
    const walletState = {
      accounts: walletAccounts,
      activeAccount: walletAccounts[0]
    };
    addWallet(this.store, {
      walletId: this.id,
      wallet: walletState
    });
    console.info(`[${this.metadata.name}] \u2705 Connected.`, walletState);
    return walletAccounts;
  }
  async disconnect() {
    try {
      console.info(`[${this.metadata.name}] Disconnecting...`);
      this.onDisconnect();
      const result = await this._disable();
      console.info(
        `[${this.metadata.name}] Successfully disconnected${result.sessionIds && result.sessionIds.length ? ` sessions [${result.sessionIds.join(",")}]` : ""} on network "${result.genesisId}"`
      );
    } catch (error) {
      console.error(
        `[${this.metadata.name}] Error disconnecting: ` + (isAVMWebProviderSDKError(error) ? `${error.message} (code: ${error.code})` : error.message)
      );
      throw error;
    }
  }
  async resumeSession() {
    const state = this.store.state;
    const walletState = state.wallets[this.id];
    let result;
    if (!walletState) {
      return;
    }
    try {
      console.info(`[${this.metadata.name}] Resuming session...`);
      result = await this._enable();
      if (result.accounts.length === 0) {
        throw new Error(`No accounts found!`);
      }
      const walletAccounts = this._mapAVMWebProviderAccountToWalletAccounts(result.accounts);
      const match = compareAccounts(walletAccounts, walletState.accounts);
      if (!match) {
        console.warn(`[${this.metadata.name}] Session accounts mismatch, updating accounts`, {
          prev: walletState.accounts,
          current: walletAccounts
        });
        setAccounts(this.store, {
          walletId: this.id,
          accounts: walletAccounts
        });
      }
    } catch (error) {
      console.error(
        `[${this.metadata.name}] Error resuming session: ` + (isAVMWebProviderSDKError(error) ? `${error.message} (code: ${error.code})` : error.message)
      );
      this.onDisconnect();
      throw error;
    }
  }
  processTxns(txnGroup, indexesToSign) {
    const txnsToSign = [];
    txnGroup.forEach((txn, index) => {
      const isIndexMatch = !indexesToSign || indexesToSign.includes(index);
      const signer = import_algosdk3.default.encodeAddress(txn.from.publicKey);
      const canSignTxn = this.addresses.includes(signer);
      const txnString = byteArrayToBase64(txn.toByte());
      if (isIndexMatch && canSignTxn) {
        txnsToSign.push({ txn: txnString });
      } else {
        txnsToSign.push({ txn: txnString, signers: [] });
      }
    });
    return txnsToSign;
  }
  processEncodedTxns(txnGroup, indexesToSign) {
    const txnsToSign = [];
    txnGroup.forEach((txnBuffer, index) => {
      const txnDecodeObj = import_algosdk3.default.decodeObj(txnBuffer);
      const isSigned = isSignedTxn(txnDecodeObj);
      const txn = isSigned ? import_algosdk3.default.decodeSignedTransaction(txnBuffer).txn : import_algosdk3.default.decodeUnsignedTransaction(txnBuffer);
      const isIndexMatch = !indexesToSign || indexesToSign.includes(index);
      const signer = import_algosdk3.default.encodeAddress(txn.from.publicKey);
      const canSignTxn = !isSigned && this.addresses.includes(signer);
      const txnString = byteArrayToBase64(txn.toByte());
      if (isIndexMatch && canSignTxn) {
        txnsToSign.push({ txn: txnString });
      } else {
        txnsToSign.push({ txn: txnString, signers: [] });
      }
    });
    return txnsToSign;
  }
  signTransactions = async (txnGroup, indexesToSign) => {
    try {
      let txnsToSign = [];
      if (isTransactionArray(txnGroup)) {
        const flatTxns = flattenTxnGroup(txnGroup);
        txnsToSign = this.processTxns(flatTxns, indexesToSign);
      } else {
        const flatTxns = flattenTxnGroup(txnGroup);
        txnsToSign = this.processEncodedTxns(flatTxns, indexesToSign);
      }
      const signTxnsResult = await this._signTransactions(txnsToSign);
      const result = signTxnsResult.stxns.map((value) => {
        if (value === null) {
          return null;
        }
        return base64ToByteArray(value);
      });
      return result;
    } catch (error) {
      console.error(
        `[${this.metadata.name}] error signing transactions: ` + (isAVMWebProviderSDKError(error) ? `${error.message} (code: ${error.code})` : error.message)
      );
      throw error;
    }
  };
};

// src/wallets/kmd.ts
var import_algosdk4 = __toESM(require("algosdk"), 1);
var ICON4 = `data:image/svg+xml;base64,${btoa(`
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <linearGradient id="algokitGradient" gradientUnits="userSpaceOnUse" x1="0" y1="400" x2="400" y2="0">
    <stop offset="0" style="stop-color:#31D8EE"/>
    <stop offset="1" style="stop-color:#01DC94"/>
  </linearGradient>
  <rect fill="url(#algokitGradient)" width="400" height="400" />
  <path fill="#FFFFFF" d="M309.2,309.3H275l-22.2-82.7l-47.9,82.7h-38.3l73.9-128l-11.9-44.5l-99.6,172.6H90.8L217.1,90.6 h33.5l14.7,54.3h34.6l-23.6,41L309.2,309.3z" />
</svg>
`)}`;
var KmdWallet = class extends BaseWallet {
  client = null;
  options;
  walletName;
  walletId = "";
  password = "";
  store;
  constructor({
    id,
    store,
    subscribe,
    getAlgodClient,
    options,
    metadata = {}
  }) {
    super({ id, metadata, getAlgodClient, store, subscribe });
    const {
      token = "a".repeat(64),
      baseServer = "http://127.0.0.1",
      port = 4002,
      wallet = "unencrypted-default-wallet"
    } = options || {};
    this.options = { token, baseServer, port };
    this.walletName = wallet;
    this.store = store;
  }
  static defaultMetadata = {
    name: "KMD",
    icon: ICON4
  };
  async initializeClient() {
    console.info(`[${this.metadata.name}] Initializing client...`);
    const { token, baseServer, port } = this.options;
    const client = new import_algosdk4.default.Kmd(token, baseServer, port);
    this.client = client;
    return client;
  }
  connect = async () => {
    console.info(`[${this.metadata.name}] Connecting...`);
    if (!this.client) {
      await this.initializeClient();
    }
    const token = await this.fetchToken();
    const accounts = await this.fetchAccounts(token);
    if (accounts.length === 0) {
      throw new Error("No accounts found!");
    }
    const walletAccounts = accounts.map((address, idx) => ({
      name: `${this.metadata.name} Account ${idx + 1}`,
      address
    }));
    const activeAccount = walletAccounts[0];
    const walletState = {
      accounts: walletAccounts,
      activeAccount
    };
    addWallet(this.store, {
      walletId: this.id,
      wallet: walletState
    });
    await this.releaseToken(token);
    console.info(`[${this.metadata.name}] \u2705 Connected.`, walletState);
    return walletAccounts;
  };
  disconnect = async () => {
    this.onDisconnect();
    console.info(`[${this.metadata.name}] Disconnected.`);
  };
  resumeSession = async () => {
    try {
      const state = this.store.state;
      const walletState = state.wallets[this.id];
      if (!walletState) {
        return;
      }
      console.info(`[${this.metadata.name}] Resuming session...`);
      await this.initializeClient();
    } catch (error) {
      console.error(`[${this.metadata.name}] Error resuming session: ${error.message}`);
      this.onDisconnect();
      throw error;
    }
  };
  processTxns(txnGroup, indexesToSign) {
    const txnsToSign = [];
    txnGroup.forEach((txn, index) => {
      const isIndexMatch = !indexesToSign || indexesToSign.includes(index);
      const signer = import_algosdk4.default.encodeAddress(txn.from.publicKey);
      const canSignTxn = this.addresses.includes(signer);
      if (isIndexMatch && canSignTxn) {
        txnsToSign.push(txn);
      }
    });
    return txnsToSign;
  }
  processEncodedTxns(txnGroup, indexesToSign) {
    const txnsToSign = [];
    txnGroup.forEach((txnBuffer, index) => {
      const txnDecodeObj = import_algosdk4.default.decodeObj(txnBuffer);
      const isSigned = isSignedTxn(txnDecodeObj);
      const txn = isSigned ? import_algosdk4.default.decodeSignedTransaction(txnBuffer).txn : import_algosdk4.default.decodeUnsignedTransaction(txnBuffer);
      const isIndexMatch = !indexesToSign || indexesToSign.includes(index);
      const signer = import_algosdk4.default.encodeAddress(txn.from.publicKey);
      const canSignTxn = !isSigned && this.addresses.includes(signer);
      if (isIndexMatch && canSignTxn) {
        txnsToSign.push(txn);
      }
    });
    return txnsToSign;
  }
  signTransactions = async (txnGroup, indexesToSign) => {
    let txnsToSign = [];
    if (isTransactionArray(txnGroup)) {
      const flatTxns = flattenTxnGroup(txnGroup);
      txnsToSign = this.processTxns(flatTxns, indexesToSign);
    } else {
      const flatTxns = flattenTxnGroup(txnGroup);
      txnsToSign = this.processEncodedTxns(flatTxns, indexesToSign);
    }
    const token = await this.fetchToken();
    const password = this.getPassword();
    const client = this.client || await this.initializeClient();
    const signedTxns = await Promise.all(
      txnsToSign.map((txn) => client.signTransaction(token, password, txn))
    );
    await this.releaseToken(token);
    return signedTxns;
  };
  async fetchWalletId() {
    console.info(`[${this.metadata.name}] Fetching wallet data...`);
    const client = this.client || await this.initializeClient();
    const { wallets } = await client.listWallets();
    const wallet = wallets.find((wallet2) => wallet2.name === this.walletName);
    if (!wallet) {
      throw new Error(`Wallet "${this.walletName}" not found!`);
    }
    this.walletId = wallet.id;
    return wallet.id;
  }
  async fetchToken() {
    console.info(`[${this.metadata.name}] Fetching token...`);
    const client = this.client || await this.initializeClient();
    const walletId = this.walletId || await this.fetchWalletId();
    const password = this.getPassword();
    const { wallet_handle_token } = await client.initWalletHandle(
      walletId,
      password
    );
    return wallet_handle_token;
  }
  async releaseToken(token) {
    console.info(`[${this.metadata.name}] Releasing token...`);
    const client = this.client || await this.initializeClient();
    await client.releaseWalletHandle(token);
  }
  getPassword() {
    if (this.password) {
      return this.password;
    }
    const password = prompt("KMD password") || "";
    this.password = password;
    return password;
  }
  async fetchAccounts(token) {
    console.info(`[${this.metadata.name}] Fetching accounts...`);
    const client = this.client || await this.initializeClient();
    const { addresses } = await client.listKeys(token);
    return addresses;
  }
};

// src/wallets/lute.ts
var import_algosdk5 = __toESM(require("algosdk"), 1);
function isSignTxnsError(error) {
  return error instanceof Error && "code" in error;
}
var ICON5 = `data:image/svg+xml;base64,${btoa(`
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <path fill="#AB47BC" d="M283.7,263.6c-0.6,0-1.3-0.1-1.8-0.4c-0.6-0.3-1.1-0.8-1.5-1.3c-0.4-0.6-0.7-1.3-0.8-2 c-0.1-0.8-0.1-1.7,0.1-2.5c0.2-0.9,0.6-1.8,1.2-2.6c0.6-0.8,1.4-1.7,2.2-2.3c0.9-0.7,2.1-1.2,3.2-1.6c1.2-0.4,2.7-0.5,4-0.5 c1.4,0,3,0.3,4.4,0.8c1.5,0.5,3.1,1.4,4.3,2.3c1.4,1,2.8,2.4,3.8,3.7c1.1,1.5,2.1,3.3,2.8,5.1c0.7,1.9,1.2,4.1,1.3,6.1 c0.2,2.1,0,4.6-0.4,6.7c-0.5,2.2-1.4,4.7-2.4,6.7c-1.1,2.1-2.8,4.4-4.4,6.2c-1.8,1.9-4.1,3.7-6.3,5c-2.3,1.4-5.2,2.6-7.9,3.3 c-2.8,0.7-6.1,1.1-8.9,1.1c-3,0-6.5-0.6-9.3-1.4c-3-0.9-6.4-2.4-9.1-4c-2.8-1.7-5.8-4.2-8-6.6c-2.3-2.5-4.6-5.8-6.2-8.9 c-1.7-3.2-3.1-7.1-3.8-10.7c-0.8-3.7-1.1-8-0.9-11.8c0.2-3.9,1.1-8.3,2.3-12c1.3-3.8,3.4-8.1,5.7-11.4c2.3-3.5,5.6-7.1,8.8-9.9 c3.3-2.8,7.5-5.6,11.5-7.5c4.1-1.9,9-3.5,13.5-4.3c4.6-0.8,10-1.1,14.6-0.7c4.8,0.4,10.2,1.6,14.7,3.3c4.7,1.7,9.7,4.4,13.8,7.3 c4.2,3,8.5,7,11.7,10.9c3.3,4.1,6.5,9.2,8.7,14c2.2,4.9,4,10.9,4.9,16.3c0.9,5.5,1,11.9,0.4,17.5c-0.6,5.7-2.2,12.1-4.3,17.4 c-2.1,5.5-5.4,11.4-8.9,16.1c-3.6,4.8-8.4,9.8-13.1,13.6c-4.8,3.8-11,7.5-16.6,9.9c-5.8,2.5-12.8,4.5-19.1,5.4 c-6.4,0.9-13.9,1-20.3,0.2c-6.6-0.8-14-2.7-20.1-5.2c-6.3-2.5-13.1-6.4-18.5-10.5c-5.5-4.2-11.2-9.8-15.4-15.3 c-4.3-5.6-8.4-12.7-11.2-19.2c-2.8-6.7-4.9-14.7-5.9-21.9c-0.9-5.9-2.8-12.6-5.2-18.1c-2.3-5.4-5.9-11.2-9.5-15.8 c-3.6-4.5-8.3-9-13-12.4c-4.5-3.3-10.1-6.4-15.3-8.3c-5-1.9-11.1-3.4-16.5-3.9c-5.2-0.5-11.3-0.3-16.5,0.5c-5,0.8-10.7,2.6-15.3,4.7 c-4.5,2.1-9.4,5.1-13.2,8.3c-3.7,3.1-7.5,7.2-10.2,11.1c-2.7,3.8-5.2,8.6-6.7,13c-1.5,4.2-2.6,9.3-3,13.8c-0.3,4.3-0.1,9.4,0.7,13.7 c0.8,4.1,2.3,8.8,4.2,12.5c1.8,3.6,4.4,7.6,7.1,10.6c2.6,2.9,6,5.9,9.3,8.1c3.1,2.1,7.1,4,10.6,5.1c3.4,1.1,7.5,1.9,11.1,2 c3.5,0.2,7.4-0.2,10.8-1c3.2-0.7,6.8-2.1,9.7-3.6c2.8-1.5,5.7-3.6,8-5.8c2.2-2.1,4.3-4.8,5.9-7.4c1.5-2.5,2.8-5.5,3.5-8.3 c0.7-2.6,1.1-5.7,1.1-8.5c0-2.6-0.5-5.5-1.2-8c-0.7-2.3-1.8-4.9-3.1-6.9c-1.2-1.9-2.9-3.9-4.6-5.4c-1.6-1.4-3.6-2.8-5.5-3.7 c-1.8-0.9-4-1.6-5.9-1.9c-1.8-0.3-3.9-0.4-5.8-0.1c-1.7,0.2-3.6,0.7-5.1,1.4c-1.4,0.6-2.9,1.6-4.1,2.6c-1.1,0.9-2.1,2.2-2.9,3.4 c-0.7,1.1-1.2,2.5-1.5,3.7c-0.3,1.1-0.4,2.4-0.3,3.6c0.1,1,0.4,2.2,0.8,3.1c0.4,0.8,1,1.7,1.6,2.3c0.6,0.5,1.3,1,2.1,1.3 c0.6,0.2,1.5,0.4,2.1,0.3c0.6-0.1,1.3-0.3,1.8-0.6c0.5-0.3,1-0.8,1.2-1.4c0.3-0.5,0.7-1,1.2-1.4c0.5-0.3,1.2-0.6,1.8-0.6 c0.7-0.1,1.5,0.1,2.1,0.3c0.7,0.3,1.5,0.8,2.1,1.3c0.6,0.6,1.3,1.5,1.6,2.3c0.4,0.9,0.7,2.1,0.8,3.1c0.1,1.1,0,2.5-0.3,3.6 c-0.3,1.2-0.9,2.6-1.5,3.7c-0.7,1.2-1.8,2.4-2.9,3.4c-1.2,1-2.7,2-4.1,2.6c-1.5,0.7-3.4,1.2-5.1,1.4c-1.8,0.2-4,0.2-5.8-0.1 c-2-0.3-4.1-1-5.9-1.9c-1.9-0.9-4-2.3-5.5-3.7c-1.7-1.5-3.4-3.5-4.6-5.4c-1.3-2-2.4-4.6-3.1-6.9c-0.7-2.5-1.2-5.4-1.2-8 c0-2.7,0.4-5.8,1.1-8.5c0.7-2.8,2-5.8,3.5-8.3c1.5-2.6,3.7-5.3,5.9-7.4c2.3-2.2,5.2-4.3,8-5.8c2.9-1.6,6.5-2.9,9.7-3.6 c3.4-0.8,7.4-1.1,10.8-1c3.6,0.2,7.7,0.9,11.1,2c3.6,1.2,7.5,3.1,10.6,5.1c3.3,2.1,6.7,5.1,9.3,8.1c2.7,3,5.3,7,7.1,10.6 c1.8,3.8,3.4,8.4,4.2,12.5c0.8,4.3,1.1,9.3,0.7,13.7c-0.4,4.5-1.5,9.6-3,13.8c-1.6,4.4-4.1,9.2-6.7,13c-2.8,3.9-6.5,8-10.2,11.1 c-3.8,3.2-8.7,6.2-13.2,8.3c-4.6,2.1-10.3,3.8-15.3,4.7c-5.2,0.9-11.3,1-16.5,0.5c-5.4-0.5-11.5-2-16.5-3.9 c-5.2-2-10.8-5.1-15.3-8.3c-4.6-3.4-9.4-7.9-13-12.4c-3.7-4.6-7.2-10.4-9.5-15.8c-2.4-5.5-4.3-12.2-5.2-18.1 c-0.9-6.1-1-13.2-0.3-19.3c0.7-6.3,2.5-13.4,4.9-19.2c2.4-6,6.1-12.5,10-17.7c4-5.3,9.3-10.7,14.6-14.8c5.3-4.2,12.1-8.1,18.3-10.7 c6.4-2.7,14.1-4.8,21-5.7c7-1,15.2-1,22.2-0.1c7.2,0.9,15.2,3.1,21.9,5.8c5.6,2.2,12.3,3.9,18.3,4.6c5.8,0.7,12.6,0.5,18.4-0.4 c5.6-0.9,12-2.7,17.2-5c5.1-2.3,10.6-5.6,14.9-9.1c4.2-3.4,8.5-8,11.7-12.3c3.1-4.3,6-9.6,7.8-14.5c1.8-4.8,3.1-10.5,3.6-15.6 c0.5-4.9,0.3-10.7-0.6-15.6c-0.8-4.7-2.5-10.1-4.5-14.4c-2-4.2-4.9-8.8-7.9-12.3c-2.9-3.4-6.8-6.9-10.5-9.5 c-3.6-2.5-8.1-4.8-12.2-6.2c-4-1.4-8.7-2.4-12.9-2.7c-4-0.3-8.7,0-12.7,0.8c-3.8,0.8-8.1,2.2-11.6,4c-3.4,1.7-7,4.1-9.7,6.6 c-2.7,2.4-5.4,5.6-7.3,8.6c-1.9,2.9-3.6,6.5-4.6,9.8c-1,3.2-1.6,6.9-1.7,10.2c-0.1,3.2,0.3,6.8,1,9.9c0.7,2.9,2,6.2,3.5,8.8 c1.4,2.5,3.4,5.1,5.4,7.2c1.9,1.9,4.4,3.8,6.8,5.2c2.2,1.3,5,2.4,7.5,3c2.3,0.6,5.1,0.9,7.6,0.8c2.3-0.1,4.9-0.5,7-1.3 c2-0.7,4.2-1.7,6-2.9c1.6-1.1,3.3-2.7,4.6-4.2c1.2-1.4,2.3-3.2,3-4.9c0.7-1.6,1.2-3.5,1.3-5.1c0.2-1.5,0.1-3.3-0.2-4.9 c-0.3-1.4-0.8-2.9-1.5-4.2c-0.6-1.1-1.5-2.3-2.4-3.2c-0.8-0.8-1.9-1.5-3-2c-0.9-0.4-2.1-0.7-3.1-0.8c-0.9-0.1-1.9,0-2.8,0.3 c-0.7,0.2-1.6,0.6-2.2,1.1c-0.5,0.4-1,1.1-1.3,1.7c-0.3,0.6-0.4,1.3-0.4,1.9c0,0.6,0.2,1.2,0.6,1.7c0.3,0.5,0.5,1.2,0.6,1.7 c0,0.6-0.1,1.3-0.4,1.9c-0.3,0.6-0.8,1.3-1.3,1.7c-0.6,0.5-1.4,0.9-2.2,1.1c-0.9,0.3-1.9,0.3-2.8,0.3c-1-0.1-2.2-0.4-3.1-0.8 c-1-0.5-2.1-1.2-3-2c-0.9-0.9-1.8-2.1-2.4-3.2c-0.7-1.2-1.2-2.8-1.5-4.2c-0.3-1.5-0.4-3.3-0.2-4.9c0.2-1.7,0.7-3.6,1.3-5.1 c0.7-1.7,1.8-3.5,3-4.9c1.3-1.5,3-3.1,4.6-4.2c1.8-1.2,4-2.3,6-2.9c2.2-0.7,4.8-1.2,7-1.3c2.4-0.1,5.2,0.2,7.6,0.8 c2.5,0.6,5.3,1.7,7.5,3c2.4,1.3,4.9,3.2,6.8,5.2c2,2,4,4.7,5.4,7.2c1.5,2.6,2.7,5.9,3.5,8.8c0.8,3.1,1.1,6.7,1,9.9 c-0.1,3.3-0.7,7.1-1.7,10.2c-1,3.3-2.7,6.9-4.6,9.8c-1.9,3-4.7,6.2-7.3,8.6c-2.8,2.5-6.4,5-9.7,6.6c-3.5,1.8-7.8,3.2-11.6,4 c-4,0.8-8.7,1.1-12.7,0.8c-4.2-0.3-9-1.3-12.9-2.7c-4.1-1.4-8.6-3.7-12.2-6.2c-3.7-2.6-7.6-6.1-10.5-9.5c-3-3.6-5.9-8.1-7.9-12.3 c-2-4.4-3.7-9.7-4.5-14.4c-0.8-4.9-1.1-10.6-0.6-15.6c0.5-5.1,1.8-10.8,3.6-15.6c1.8-4.9,4.7-10.3,7.8-14.5 c3.2-4.4,7.5-8.9,11.7-12.3c4.3-3.5,9.8-6.9,14.9-9.1c5.2-2.3,11.6-4.2,17.2-5c5.8-0.9,12.6-1,18.4-0.4c6,0.7,12.7,2.4,18.3,4.6 c5.7,2.3,12,5.7,16.9,9.4c5.1,3.8,10.3,8.9,14.2,13.8c4,5.1,7.8,11.5,10.3,17.5c2.6,6.1,4.6,13.5,5.5,20c0.9,6.7,1,14.5,0.1,21.2 c-0.9,6.9-2.9,14.6-5.5,21c-2.7,6.5-6.8,13.6-11,19.3c-4.4,5.7-10.3,11.7-16,16c-4.7,3.7-9.5,8.7-13.1,13.6 c-3.5,4.7-6.8,10.7-8.9,16.1c-2.1,5.3-3.6,11.7-4.3,17.4c-0.6,5.5-0.4,12,0.4,17.5c0.9,5.3,2.6,11.3,4.9,16.3c2.2,4.8,5.4,10,8.7,14 c3.2,3.9,7.6,8,11.7,10.9c4,2.9,9.1,5.6,13.8,7.3c4.5,1.7,9.9,2.9,14.7,3.3c4.6,0.4,10,0.2,14.6-0.7c4.4-0.8,9.4-2.4,13.5-4.3 c3.9-1.9,8.2-4.6,11.5-7.5c3.2-2.7,6.4-6.4,8.8-9.9c2.3-3.4,4.4-7.6,5.7-11.4c1.2-3.7,2.1-8.1,2.3-12c0.2-3.7-0.1-8.1-0.9-11.8 c-0.8-3.5-2.2-7.5-3.8-10.7c-1.6-3.1-3.9-6.3-6.2-8.9c-2.2-2.4-5.2-4.9-8-6.6c-2.7-1.7-6-3.2-9.1-4c-2.9-0.8-6.3-1.4-9.3-1.4 c-2.9,0-6.2,0.4-8.9,1.1c-2.6,0.7-5.5,1.9-7.9,3.3c-2.2,1.3-4.5,3.2-6.3,5c-1.7,1.8-3.3,4-4.4,6.2c-1.1,2-2,4.5-2.4,6.7 c-0.4,2.1-0.6,4.5-0.4,6.7c0.2,2,0.6,4.2,1.3,6.1c0.6,1.7,1.7,3.6,2.8,5.1c1,1.3,2.4,2.7,3.8,3.7c1.3,0.9,2.8,1.8,4.3,2.3 c1.3,0.5,2.9,0.8,4.4,0.8c1.3,0,2.7-0.1,4-0.5c1.1-0.3,2.3-0.9,3.2-1.6c0.8-0.6,1.7-1.4,2.2-2.3c0.5-0.7,0.9-1.7,1.2-2.6 c0.2-0.8,0.2-1.7,0.1-2.5c-0.1-0.7-0.4-1.4-0.8-2c-0.4-0.5-0.9-1-1.5-1.3C285,263.7,284.3,263.6,283.7,263.6L283.7,263.6z" />
</svg>
`)}`;
var LuteWallet = class extends BaseWallet {
  client = null;
  options;
  store;
  constructor({
    id,
    store,
    subscribe,
    getAlgodClient,
    options,
    metadata = {}
  }) {
    super({ id, metadata, getAlgodClient, store, subscribe });
    if (!options?.siteName) {
      throw new Error("[LuteWallet] Missing required option: siteName");
    }
    this.options = options;
    this.store = store;
  }
  static defaultMetadata = {
    name: "Lute",
    icon: ICON5
  };
  async initializeClient() {
    console.info(`[${this.metadata.name}] Initializing client...`);
    const module2 = await import("lute-connect");
    const LuteConnect = module2.default;
    const client = new LuteConnect(this.options.siteName);
    this.client = client;
    return client;
  }
  async getGenesisId() {
    const algodClient = this.getAlgodClient();
    const genesis = await algodClient.genesis().do();
    const genesisId = `${genesis.network}-${genesis.id}`;
    return genesisId;
  }
  connect = async () => {
    console.info(`[${this.metadata.name}] Connecting...`);
    const client = this.client || await this.initializeClient();
    const genesisId = await this.getGenesisId();
    const accounts = await client.connect(genesisId);
    if (accounts.length === 0) {
      throw new Error("No accounts found!");
    }
    const walletAccounts = accounts.map((address, idx) => ({
      name: `${this.metadata.name} Account ${idx + 1}`,
      address
    }));
    const activeAccount = walletAccounts[0];
    const walletState = {
      accounts: walletAccounts,
      activeAccount
    };
    addWallet(this.store, {
      walletId: this.id,
      wallet: walletState
    });
    console.info(`[${this.metadata.name}] \u2705 Connected.`, walletState);
    return walletAccounts;
  };
  disconnect = async () => {
    this.onDisconnect();
    console.info(`[${this.metadata.name}] Disconnected.`);
  };
  resumeSession = async () => {
    try {
      const state = this.store.state;
      const walletState = state.wallets[this.id];
      if (!walletState) {
        return;
      }
      console.info(`[${this.metadata.name}] Resuming session...`);
      await this.initializeClient();
    } catch (error) {
      console.error(`[${this.metadata.name}] Error resuming session: ${error.message}`);
      this.onDisconnect();
      throw error;
    }
  };
  processTxns(txnGroup, indexesToSign) {
    const txnsToSign = [];
    txnGroup.forEach((txn, index) => {
      const isIndexMatch = !indexesToSign || indexesToSign.includes(index);
      const signer = import_algosdk5.default.encodeAddress(txn.from.publicKey);
      const canSignTxn = this.addresses.includes(signer);
      const txnString = byteArrayToBase64(txn.toByte());
      if (isIndexMatch && canSignTxn) {
        txnsToSign.push({ txn: txnString });
      } else {
        txnsToSign.push({ txn: txnString, signers: [] });
      }
    });
    return txnsToSign;
  }
  processEncodedTxns(txnGroup, indexesToSign) {
    const txnsToSign = [];
    txnGroup.forEach((txnBuffer, index) => {
      const txnDecodeObj = import_algosdk5.default.decodeObj(txnBuffer);
      const isSigned = isSignedTxn(txnDecodeObj);
      const txn = isSigned ? import_algosdk5.default.decodeSignedTransaction(txnBuffer).txn : import_algosdk5.default.decodeUnsignedTransaction(txnBuffer);
      const isIndexMatch = !indexesToSign || indexesToSign.includes(index);
      const signer = import_algosdk5.default.encodeAddress(txn.from.publicKey);
      const canSignTxn = !isSigned && this.addresses.includes(signer);
      const txnString = byteArrayToBase64(txn.toByte());
      if (isIndexMatch && canSignTxn) {
        txnsToSign.push({ txn: txnString });
      } else {
        txnsToSign.push({ txn: txnString, signers: [] });
      }
    });
    return txnsToSign;
  }
  signTransactions = async (txnGroup, indexesToSign) => {
    try {
      let txnsToSign = [];
      if (isTransactionArray(txnGroup)) {
        const flatTxns = flattenTxnGroup(txnGroup);
        txnsToSign = this.processTxns(flatTxns, indexesToSign);
      } else {
        const flatTxns = flattenTxnGroup(txnGroup);
        txnsToSign = this.processEncodedTxns(flatTxns, indexesToSign);
      }
      const client = this.client || await this.initializeClient();
      const signTxnsResult = await client.signTxns(txnsToSign);
      return signTxnsResult;
    } catch (error) {
      if (isSignTxnsError(error)) {
        throw new SignTxnsError(error.message, error.code);
      }
      throw error;
    }
  };
};

// src/wallets/magic.ts
var import_algosdk6 = __toESM(require("algosdk"), 1);
var ICON6 = `data:image/svg+xml;base64,${btoa(`
<svg viewBox="0 0 47 47" xmlns="http://www.w3.org/2000/svg">
  <path fill="#6851FF" d="M 23.960861 1.80769 C 25.835077 4.103153 27.902216 6.23489 30.137539 8.178169 C 28.647968 13.009323 27.846092 18.142094 27.846092 23.462154 C 27.846092 28.782307 28.648062 33.915169 30.13763 38.746368 C 27.902216 40.689724 25.835077 42.821476 23.960861 45.116985 C 22.086554 42.821476 20.019415 40.689632 17.783998 38.746368 C 19.273476 33.915169 20.075445 28.7824 20.075445 23.462337 C 20.075445 18.142277 19.273476 13.009506 17.783998 8.178318 C 20.019415 6.235001 22.086554 4.10321 23.960861 1.80769 Z M 13.511427 35.406403 C 11.145139 33.747814 8.633816 32.282063 6.000269 31.031937 C 6.730776 28.637476 7.123754 26.095783 7.123754 23.462429 C 7.123754 20.828892 6.730762 18.287201 6.000235 15.892738 C 8.633816 14.642616 11.145175 13.176861 13.511501 11.518276 C 14.416311 15.352554 14.895074 19.351414 14.895074 23.462154 C 14.895074 27.572985 14.416283 31.571938 13.511427 35.406403 Z M 33.027046 23.462337 C 33.027046 27.572985 33.505753 31.571846 34.410553 35.406124 C 36.776859 33.747631 39.288094 32.281876 41.921539 31.031845 C 41.191017 28.637384 40.798061 26.095692 40.798061 23.462246 C 40.798061 20.8288 41.191017 18.287201 41.921539 15.89283 C 39.288094 14.642708 36.776768 13.177048 34.410553 11.518555 C 33.505753 15.352831 33.027046 19.351692 33.027046 23.462337 Z" />
</svg>
`)}`;
var MagicAuth = class extends BaseWallet {
  client = null;
  options;
  store;
  userInfo = null;
  constructor({
    id,
    store,
    subscribe,
    getAlgodClient,
    options,
    metadata = {}
  }) {
    super({ id, metadata, getAlgodClient, store, subscribe });
    if (!options?.apiKey) {
      throw new Error(`[${this.metadata.name}] Missing required option: apiKey`);
    }
    this.options = options;
    this.store = store;
  }
  static defaultMetadata = {
    name: "Magic",
    icon: ICON6
  };
  async initializeClient() {
    console.info(`[${this.metadata.name}] Initializing client...`);
    const Magic = (await Promise.resolve().then(() => (init_es4(), es_exports))).Magic;
    const AlgorandExtension = (await Promise.resolve().then(() => (init_es5(), es_exports2))).AlgorandExtension;
    const client = new Magic(this.options.apiKey, {
      extensions: {
        algorand: new AlgorandExtension({
          rpcUrl: ""
        })
      }
    });
    this.client = client;
    return client;
  }
  connect = async (args) => {
    console.info(`[${this.metadata.name}] Connecting...`);
    if (!args?.email || typeof args.email !== "string") {
      throw new Error("Magic Link provider requires an email (string) to connect");
    }
    const { email } = args;
    const client = this.client || await this.initializeClient();
    console.info(`[${this.metadata.name}] Logging in ${email}...`);
    await client.auth.loginWithMagicLink({ email });
    const userInfo = await client.user.getInfo();
    if (!userInfo) {
      throw new Error("User info not found!");
    }
    if (!userInfo.publicAddress) {
      throw new Error("No account found!");
    }
    this.userInfo = userInfo;
    console.info(`[${this.metadata.name}] Login successful`, userInfo);
    const walletAccount = {
      name: userInfo.email ?? "Magic Wallet 1",
      address: userInfo.publicAddress
    };
    const walletState = {
      accounts: [walletAccount],
      activeAccount: walletAccount
    };
    addWallet(this.store, {
      walletId: this.id,
      wallet: walletState
    });
    console.info(`[${this.metadata.name}] \u2705 Connected.`, walletState);
    return [walletAccount];
  };
  disconnect = async () => {
    console.info(`[${this.metadata.name}] Disconnecting...`);
    this.onDisconnect();
    const client = this.client || await this.initializeClient();
    console.info(`[${this.metadata.name}] Logging out ${this.userInfo?.email || "user"}...`);
    await client.user.logout();
    console.info(`[${this.metadata.name}] Disconnected.`);
  };
  resumeSession = async () => {
    try {
      const state = this.store.state;
      const walletState = state.wallets[this.id];
      if (!walletState) {
        return;
      }
      console.info(`[${this.metadata.name}] Resuming session...`);
      const client = this.client || await this.initializeClient();
      const isLoggedIn = await client.user.isLoggedIn();
      if (!isLoggedIn) {
        console.warn(`[${this.metadata.name}] Not logged in, please reconnect...`);
        this.onDisconnect();
        return;
      }
      const userInfo = await client.user.getInfo();
      if (!userInfo) {
        await client.user.logout();
        throw new Error("User info not found!");
      }
      if (!userInfo.publicAddress) {
        await client.user.logout();
        throw new Error("No account found!");
      }
      this.userInfo = userInfo;
      const walletAccount = {
        name: userInfo.email ?? `${this.metadata.name} Account 1`,
        address: userInfo.publicAddress
      };
      const storedAccount = walletState.accounts[0];
      const { name, address } = walletAccount;
      const { name: storedName, address: storedAddress } = storedAccount;
      const match = name === storedName && address === storedAddress;
      if (!match) {
        console.warn(`[${this.metadata.name}] Session account mismatch, updating account`, {
          prev: storedAccount,
          current: walletAccount
        });
        setAccounts(this.store, {
          walletId: this.id,
          accounts: [walletAccount]
        });
      }
      console.info(`[${this.metadata.name}] Session resumed.`);
    } catch (error) {
      console.error(`[${this.metadata.name}] Error resuming session: ${error.message}`);
      this.onDisconnect();
      throw error;
    }
  };
  processTxns(txnGroup, indexesToSign) {
    const txnsToSign = [];
    txnGroup.forEach((txn, index) => {
      const isIndexMatch = !indexesToSign || indexesToSign.includes(index);
      const signer = import_algosdk6.default.encodeAddress(txn.from.publicKey);
      const canSignTxn = this.addresses.includes(signer);
      const txnString = byteArrayToBase64(txn.toByte());
      if (isIndexMatch && canSignTxn) {
        txnsToSign.push({ txn: txnString });
      } else {
        txnsToSign.push({ txn: txnString, signers: [] });
      }
    });
    return txnsToSign;
  }
  processEncodedTxns(txnGroup, indexesToSign) {
    const txnsToSign = [];
    txnGroup.forEach((txnBuffer, index) => {
      const txnDecodeObj = import_algosdk6.default.decodeObj(txnBuffer);
      const isSigned = isSignedTxn(txnDecodeObj);
      const txn = isSigned ? import_algosdk6.default.decodeSignedTransaction(txnBuffer).txn : import_algosdk6.default.decodeUnsignedTransaction(txnBuffer);
      const isIndexMatch = !indexesToSign || indexesToSign.includes(index);
      const signer = import_algosdk6.default.encodeAddress(txn.from.publicKey);
      const canSignTxn = !isSigned && this.addresses.includes(signer);
      const txnString = byteArrayToBase64(txn.toByte());
      if (isIndexMatch && canSignTxn) {
        txnsToSign.push({ txn: txnString });
      } else {
        txnsToSign.push({ txn: txnString, signers: [] });
      }
    });
    return txnsToSign;
  }
  signTransactions = async (txnGroup, indexesToSign) => {
    let txnsToSign = [];
    if (isTransactionArray(txnGroup)) {
      const flatTxns = flattenTxnGroup(txnGroup);
      txnsToSign = this.processTxns(flatTxns, indexesToSign);
    } else {
      const flatTxns = flattenTxnGroup(txnGroup);
      txnsToSign = this.processEncodedTxns(flatTxns, indexesToSign);
    }
    const client = this.client || await this.initializeClient();
    const signTxnsResult = await client.algorand.signGroupTransactionV2(
      txnsToSign
    );
    const result = signTxnsResult.map((value) => {
      if (value === void 0) {
        return null;
      }
      return base64ToByteArray(value);
    });
    return result;
  };
};

// src/wallets/mnemonic.ts
var import_algosdk7 = __toESM(require("algosdk"), 1);
var LOCAL_STORAGE_MNEMONIC_KEY = `${LOCAL_STORAGE_KEY}_mnemonic`;
var ICON7 = `data:image/svg+xml;base64,${btoa(`
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#525252" width="400" height="400" />
  <path fill="#FFFFFF" d="M309.2,309.3H275l-22.2-82.7l-47.9,82.7h-38.3l73.9-128l-11.9-44.5l-99.6,172.6H90.8L217.1,90.6 h33.5l14.7,54.3h34.6l-23.6,41L309.2,309.3z" />
</svg>
`)}`;
var MnemonicWallet = class extends BaseWallet {
  account = null;
  options;
  store;
  constructor({
    id,
    store,
    subscribe,
    getAlgodClient,
    options,
    metadata = {}
  }) {
    super({ id, metadata, getAlgodClient, store, subscribe });
    const { persistToStorage = false } = options || {};
    this.options = { persistToStorage };
    this.store = store;
    if (this.options.persistToStorage) {
      console.warn(
        `[${this.metadata.name}] Persisting mnemonics to storage is insecure. Any private key mnemonics used should never hold real Algos (i.e., on MainNet). Use with caution!`
      );
    }
  }
  static defaultMetadata = {
    name: "Mnemonic",
    icon: ICON7
  };
  loadMnemonicFromStorage() {
    return StorageAdapter.getItem(LOCAL_STORAGE_MNEMONIC_KEY);
  }
  saveMnemonicToStorage(mnemonic) {
    StorageAdapter.setItem(LOCAL_STORAGE_MNEMONIC_KEY, mnemonic);
  }
  checkMainnet() {
    try {
      const network = this.activeNetwork;
      if (network === "mainnet" /* MAINNET */) {
        console.warn(
          `[${this.metadata.name}] The Mnemonic wallet provider is insecure and intended for testing only. Any private key mnemonics used should never hold real Algos (i.e., on MainNet).`
        );
        throw new Error("MainNet active network detected. Aborting.");
      }
    } catch (error) {
      this.disconnect();
      throw error;
    }
  }
  initializeAccount() {
    let mnemonic = this.loadMnemonicFromStorage();
    if (!mnemonic) {
      mnemonic = prompt("Enter 25-word mnemonic passphrase:");
      if (!mnemonic) {
        this.account = null;
        throw new Error("No mnemonic provided");
      }
      if (this.options.persistToStorage) {
        console.warn(`[${this.metadata.name}] Mnemonic saved to localStorage.`);
        this.saveMnemonicToStorage(mnemonic);
      }
    }
    const account = import_algosdk7.default.mnemonicToSecretKey(mnemonic);
    this.account = account;
    return account;
  }
  connect = async () => {
    this.checkMainnet();
    console.info(`[${this.metadata.name}] Connecting...`);
    const account = this.initializeAccount();
    const walletAccount = {
      name: `${this.metadata.name} Account`,
      address: account.addr
    };
    const walletState = {
      accounts: [walletAccount],
      activeAccount: walletAccount
    };
    addWallet(this.store, {
      walletId: this.id,
      wallet: walletState
    });
    console.info(`[${this.metadata.name}] \u2705 Connected.`, walletState);
    return [walletAccount];
  };
  disconnect = async () => {
    this.onDisconnect();
    this.account = null;
    console.info(`[${this.metadata.name}] Disconnected.`);
  };
  resumeSession = async () => {
    this.checkMainnet();
    const state = this.store.state;
    const walletState = state.wallets[this.id];
    if (walletState) {
      this.disconnect();
    }
  };
  processTxns(txnGroup, indexesToSign) {
    const txnsToSign = [];
    txnGroup.forEach((txn, index) => {
      const isIndexMatch = !indexesToSign || indexesToSign.includes(index);
      const signer = import_algosdk7.default.encodeAddress(txn.from.publicKey);
      const canSignTxn = signer === this.account.addr;
      if (isIndexMatch && canSignTxn) {
        txnsToSign.push(txn);
      }
    });
    return txnsToSign;
  }
  processEncodedTxns(txnGroup, indexesToSign) {
    const txnsToSign = [];
    txnGroup.forEach((txnBuffer, index) => {
      const txnDecodeObj = import_algosdk7.default.decodeObj(txnBuffer);
      const isSigned = isSignedTxn(txnDecodeObj);
      const txn = isSigned ? import_algosdk7.default.decodeSignedTransaction(txnBuffer).txn : import_algosdk7.default.decodeUnsignedTransaction(txnBuffer);
      const isIndexMatch = !indexesToSign || indexesToSign.includes(index);
      const signer = import_algosdk7.default.encodeAddress(txn.from.publicKey);
      const canSignTxn = !isSigned && signer === this.account.addr;
      if (isIndexMatch && canSignTxn) {
        txnsToSign.push(txn);
      }
    });
    return txnsToSign;
  }
  signTransactions = async (txnGroup, indexesToSign) => {
    this.checkMainnet();
    let txnsToSign = [];
    if (isTransactionArray(txnGroup)) {
      const flatTxns = flattenTxnGroup(txnGroup);
      txnsToSign = this.processTxns(flatTxns, indexesToSign);
    } else {
      const flatTxns = flattenTxnGroup(txnGroup);
      txnsToSign = this.processEncodedTxns(flatTxns, indexesToSign);
    }
    const signedTxns = txnsToSign.map((txn) => txn.signTxn(this.account.sk));
    return signedTxns;
  };
};

// src/wallets/pera.ts
var import_algosdk8 = __toESM(require("algosdk"), 1);
var ICON8 = `data:image/svg+xml;base64,${btoa(`
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#FFEE55" width="200" height="200" />
  <path fill="#1C1C1C" d="M106.1,64.3c2.2,9.1,1.5,17-1.7,17.8c-3.1,0.8-7.4-6-9.6-15c-2.2-9.1-1.5-17,1.7-17.8 C99.6,48.5,103.9,55.2,106.1,64.3z" />
  <path fill="#1C1C1C" d="M142.2,72.1c-4.8-5.1-14.5-3.7-21.6,3.1c-7,6.9-8.8,16.6-4,21.7c4.8,5.1,14.5,3.7,21.6-3.1 C145.3,86.9,147.1,77.2,142.2,72.1z" />
  <path fill="#1C1C1C" d="M103.7,150.8c3.1-0.8,3.7-9.2,1.4-18.8c-2.3-9.6-6.7-16.8-9.8-16c-3.1,0.8-3.7,9.2-1.4,18.8 C96.2,144.3,100.6,151.5,103.7,150.8z" />
  <path fill="#1C1C1C" d="M72.1,76.8c9,2.6,15.5,7.3,14.6,10.3c-0.9,3.1-8.9,3.4-17.8,0.8s-15.5-7.3-14.6-10.3 C55.1,74.5,63.1,74.1,72.1,76.8z" />
  <path fill="#1C1C1C" d="M130.2,111.5c9.5,2.8,16.5,7.6,15.6,10.6c-0.9,3.1-9.3,3.3-18.8,0.5c-9.5-2.8-16.5-7.6-15.6-10.6 C112.2,108.9,120.7,108.7,130.2,111.5z" />
  <path fill="#1C1C1C" d="M82.1,105c-2.2-2.3-9.5,1-16.3,7.5c-6.8,6.4-10.4,13.5-8.2,15.8c2.2,2.3,9.5-1,16.3-7.5 C80.7,114.4,84.3,107.3,82.1,105z" />
</svg>
`)}`;
var PeraWallet = class extends BaseWallet {
  client = null;
  options;
  store;
  constructor({
    id,
    store,
    subscribe,
    getAlgodClient,
    options = {},
    metadata = {}
  }) {
    super({ id, metadata, getAlgodClient, store, subscribe });
    this.options = options;
    this.store = store;
  }
  static defaultMetadata = {
    name: "Pera",
    icon: ICON8
  };
  async initializeClient() {
    console.info(`[${this.metadata.name}] Initializing client...`);
    const module2 = await import("@perawallet/connect");
    const PeraWalletConnect = module2.default ? module2.default.PeraWalletConnect : module2.PeraWalletConnect;
    const client = new PeraWalletConnect(this.options);
    client.connector?.on("disconnect", this.onDisconnect);
    this.client = client;
    return client;
  }
  connect = async () => {
    console.info(`[${this.metadata.name}] Connecting...`);
    const client = this.client || await this.initializeClient();
    const accounts = await client.connect();
    if (accounts.length === 0) {
      throw new Error("No accounts found!");
    }
    const walletAccounts = accounts.map((address, idx) => ({
      name: `${this.metadata.name} Account ${idx + 1}`,
      address
    }));
    const activeAccount = walletAccounts[0];
    const walletState = {
      accounts: walletAccounts,
      activeAccount
    };
    addWallet(this.store, {
      walletId: this.id,
      wallet: walletState
    });
    console.info(`[${this.metadata.name}] \u2705 Connected.`, walletState);
    return walletAccounts;
  };
  disconnect = async () => {
    console.info(`[${this.metadata.name}] Disconnecting...`);
    this.onDisconnect();
    const client = this.client || await this.initializeClient();
    await client.disconnect();
    console.info(`[${this.metadata.name}] Disconnected.`);
  };
  resumeSession = async () => {
    try {
      const state = this.store.state;
      const walletState = state.wallets[this.id];
      if (!walletState) {
        return;
      }
      console.info(`[${this.metadata.name}] Resuming session...`);
      const client = this.client || await this.initializeClient();
      const accounts = await client.reconnectSession();
      if (accounts.length === 0) {
        throw new Error("No accounts found!");
      }
      const walletAccounts = accounts.map((address, idx) => ({
        name: `${this.metadata.name} Account ${idx + 1}`,
        address
      }));
      const match = compareAccounts(walletAccounts, walletState.accounts);
      if (!match) {
        console.warn(`[${this.metadata.name}] Session accounts mismatch, updating accounts`, {
          prev: walletState.accounts,
          current: walletAccounts
        });
        setAccounts(this.store, {
          walletId: this.id,
          accounts: walletAccounts
        });
      }
    } catch (error) {
      console.error(`[${this.metadata.name}] Error resuming session: ${error.message}`);
      this.onDisconnect();
      throw error;
    }
  };
  processTxns(txnGroup, indexesToSign) {
    const txnsToSign = [];
    txnGroup.forEach((txn, index) => {
      const isIndexMatch = !indexesToSign || indexesToSign.includes(index);
      const signer = import_algosdk8.default.encodeAddress(txn.from.publicKey);
      const canSignTxn = this.addresses.includes(signer);
      if (isIndexMatch && canSignTxn) {
        txnsToSign.push({ txn });
      } else {
        txnsToSign.push({ txn, signers: [] });
      }
    });
    return txnsToSign;
  }
  processEncodedTxns(txnGroup, indexesToSign) {
    const txnsToSign = [];
    txnGroup.forEach((txnBuffer, index) => {
      const txnDecodeObj = import_algosdk8.default.decodeObj(txnBuffer);
      const isSigned = isSignedTxn(txnDecodeObj);
      const txn = isSigned ? import_algosdk8.default.decodeSignedTransaction(txnBuffer).txn : import_algosdk8.default.decodeUnsignedTransaction(txnBuffer);
      const isIndexMatch = !indexesToSign || indexesToSign.includes(index);
      const signer = import_algosdk8.default.encodeAddress(txn.from.publicKey);
      const canSignTxn = !isSigned && this.addresses.includes(signer);
      if (isIndexMatch && canSignTxn) {
        txnsToSign.push({ txn });
      } else {
        txnsToSign.push({ txn, signers: [] });
      }
    });
    return txnsToSign;
  }
  signTransactions = async (txnGroup, indexesToSign) => {
    let txnsToSign = [];
    if (isTransactionArray(txnGroup)) {
      const flatTxns = flattenTxnGroup(txnGroup);
      txnsToSign = this.processTxns(flatTxns, indexesToSign);
    } else {
      const flatTxns = flattenTxnGroup(txnGroup);
      txnsToSign = this.processEncodedTxns(flatTxns, indexesToSign);
    }
    const client = this.client || await this.initializeClient();
    const signedTxns = await client.signTransaction([txnsToSign]);
    const result = txnsToSign.reduce((acc, txn) => {
      if (txn.signers && txn.signers.length == 0) {
        acc.push(null);
      } else {
        const signedTxn = signedTxns.shift();
        if (signedTxn) {
          acc.push(signedTxn);
        }
      }
      return acc;
    }, []);
    return result;
  };
};

// src/wallets/pera2.ts
var import_algosdk9 = __toESM(require("algosdk"), 1);
var ICON9 = `data:image/svg+xml;base64,${btoa(`
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#FFEE55" width="200" height="200" />
  <path fill="#1C1C1C" d="M106.1,64.3c2.2,9.1,1.5,17-1.7,17.8c-3.1,0.8-7.4-6-9.6-15c-2.2-9.1-1.5-17,1.7-17.8 C99.6,48.5,103.9,55.2,106.1,64.3z" />
  <path fill="#1C1C1C" d="M142.2,72.1c-4.8-5.1-14.5-3.7-21.6,3.1c-7,6.9-8.8,16.6-4,21.7c4.8,5.1,14.5,3.7,21.6-3.1 C145.3,86.9,147.1,77.2,142.2,72.1z" />
  <path fill="#1C1C1C" d="M103.7,150.8c3.1-0.8,3.7-9.2,1.4-18.8c-2.3-9.6-6.7-16.8-9.8-16c-3.1,0.8-3.7,9.2-1.4,18.8 C96.2,144.3,100.6,151.5,103.7,150.8z" />
  <path fill="#1C1C1C" d="M72.1,76.8c9,2.6,15.5,7.3,14.6,10.3c-0.9,3.1-8.9,3.4-17.8,0.8s-15.5-7.3-14.6-10.3 C55.1,74.5,63.1,74.1,72.1,76.8z" />
  <path fill="#1C1C1C" d="M130.2,111.5c9.5,2.8,16.5,7.6,15.6,10.6c-0.9,3.1-9.3,3.3-18.8,0.5c-9.5-2.8-16.5-7.6-15.6-10.6 C112.2,108.9,120.7,108.7,130.2,111.5z" />
  <path fill="#1C1C1C" d="M82.1,105c-2.2-2.3-9.5,1-16.3,7.5c-6.8,6.4-10.4,13.5-8.2,15.8c2.2,2.3,9.5-1,16.3-7.5 C80.7,114.4,84.3,107.3,82.1,105z" />
</svg>
`)}`;
var PeraWallet2 = class extends BaseWallet {
  client = null;
  options;
  store;
  constructor({
    id,
    store,
    subscribe,
    getAlgodClient,
    options,
    metadata = {}
  }) {
    super({ id, metadata, getAlgodClient, store, subscribe });
    if (!options?.projectId) {
      throw new Error(`[${this.metadata.name}] Missing required option: projectId`);
    }
    this.options = options;
    this.store = store;
  }
  static defaultMetadata = {
    name: "Pera",
    icon: ICON9
  };
  async initializeClient() {
    console.info(`[${this.metadata.name}] Initializing client...`);
    const module2 = await import("@perawallet/connect-beta");
    const PeraWalletConnect = module2.PeraWalletConnect || module2.default.PeraWalletConnect;
    const client = new PeraWalletConnect(this.options);
    client.client?.on("session_delete", this.onDisconnect);
    this.client = client;
    return client;
  }
  connect = async () => {
    console.info(`[${this.metadata.name}] Connecting...`);
    const client = this.client || await this.initializeClient();
    const accounts = await client.connect();
    if (accounts.length === 0) {
      throw new Error("No accounts found!");
    }
    const walletAccounts = accounts.map((address, idx) => ({
      name: `${this.metadata.name} Account ${idx + 1}`,
      address
    }));
    const activeAccount = walletAccounts[0];
    const walletState = {
      accounts: walletAccounts,
      activeAccount
    };
    addWallet(this.store, {
      walletId: this.id,
      wallet: walletState
    });
    console.info(`[${this.metadata.name}] \u2705 Connected.`, walletState);
    return walletAccounts;
  };
  disconnect = async () => {
    console.info(`[${this.metadata.name}] Disconnecting...`);
    this.onDisconnect();
    const client = this.client || await this.initializeClient();
    await client.disconnect();
    console.info(`[${this.metadata.name}] Disconnected.`);
  };
  resumeSession = async () => {
    try {
      const state = this.store.state;
      const walletState = state.wallets[this.id];
      if (!walletState) {
        return;
      }
      console.info(`[${this.metadata.name}] Resuming session...`);
      const client = this.client || await this.initializeClient();
      const accounts = await client.reconnectSession();
      if (accounts.length === 0) {
        throw new Error("No accounts found!");
      }
      const walletAccounts = accounts.map((address, idx) => ({
        name: `${this.metadata.name} Account ${idx + 1}`,
        address
      }));
      const match = compareAccounts(walletAccounts, walletState.accounts);
      if (!match) {
        console.warn(`[${this.metadata.name}] Session accounts mismatch, updating accounts`, {
          prev: walletState.accounts,
          current: walletAccounts
        });
        setAccounts(this.store, {
          walletId: this.id,
          accounts: walletAccounts
        });
      }
    } catch (error) {
      console.error(`[${this.metadata.name}] Error resuming session: ${error.message}`);
      this.onDisconnect();
      throw error;
    }
  };
  processTxns(txnGroup, indexesToSign) {
    const txnsToSign = [];
    txnGroup.forEach((txn, index) => {
      const isIndexMatch = !indexesToSign || indexesToSign.includes(index);
      const signer = import_algosdk9.default.encodeAddress(txn.from.publicKey);
      const canSignTxn = this.addresses.includes(signer);
      if (isIndexMatch && canSignTxn) {
        txnsToSign.push({ txn });
      } else {
        txnsToSign.push({ txn, signers: [] });
      }
    });
    return txnsToSign;
  }
  processEncodedTxns(txnGroup, indexesToSign) {
    const txnsToSign = [];
    txnGroup.forEach((txnBuffer, index) => {
      const txnDecodeObj = import_algosdk9.default.decodeObj(txnBuffer);
      const isSigned = isSignedTxn(txnDecodeObj);
      const txn = isSigned ? import_algosdk9.default.decodeSignedTransaction(txnBuffer).txn : import_algosdk9.default.decodeUnsignedTransaction(txnBuffer);
      const isIndexMatch = !indexesToSign || indexesToSign.includes(index);
      const signer = import_algosdk9.default.encodeAddress(txn.from.publicKey);
      const canSignTxn = !isSigned && this.addresses.includes(signer);
      if (isIndexMatch && canSignTxn) {
        txnsToSign.push({ txn });
      } else {
        txnsToSign.push({ txn, signers: [] });
      }
    });
    return txnsToSign;
  }
  signTransactions = async (txnGroup, indexesToSign) => {
    let txnsToSign = [];
    if (isTransactionArray(txnGroup)) {
      const flatTxns = flattenTxnGroup(txnGroup);
      txnsToSign = this.processTxns(flatTxns, indexesToSign);
    } else {
      const flatTxns = flattenTxnGroup(txnGroup);
      txnsToSign = this.processEncodedTxns(flatTxns, indexesToSign);
    }
    const client = this.client || await this.initializeClient();
    const signedTxns = await client.signTransaction([txnsToSign]);
    const result = txnsToSign.reduce((acc, txn) => {
      if (txn.signers && txn.signers.length == 0) {
        acc.push(null);
      } else {
        const signedTxn = signedTxns.shift();
        if (signedTxn) {
          acc.push(signedTxn);
        }
      }
      return acc;
    }, []);
    return result;
  };
};

// src/wallets/walletconnect.ts
var import_algosdk10 = __toESM(require("algosdk"), 1);
var SessionError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "SessionError";
  }
};
var ICON10 = `data:image/svg+xml;base64,${btoa(`
<svg viewBox="0 0 480 480" xmlns="http://www.w3.org/2000/svg">
  <rect width="480" height="480" fill="#FFFFFF" />
  <path fill="#3396FF" d="M126.6,168c62.6-61.3,164.2-61.3,226.8,0l7.5,7.4c3.1,3.1,3.1,8,0,11.1l-25.8,25.2c-1.6,1.5-4.1,1.5-5.7,0l-10.4-10.2c-43.7-42.8-114.5-42.8-158.2,0l-11.1,10.9c-1.6,1.5-4.1,1.5-5.7,0l-25.8-25.2c-3.1-3.1-3.1-8,0-11.1L126.6,168zM406.7,220.2l22.9,22.5c3.1,3.1,3.1,8,0,11.1L326.2,355.1c-3.1,3.1-8.2,3.1-11.3,0l-73.4-71.9c-0.8-0.8-2.1-0.8-2.8,0l-73.4,71.9c-3.1,3.1-8.2,3.1-11.3,0L50.3,253.8c-3.1-3.1-3.1-8,0-11.1l22.9-22.5c3.1-3.1,8.2-3.1,11.3,0l73.4,71.9c0.8,0.8,2.1,0.8,2.8,0 l73.4-71.9c3.1-3.1,8.2-3.1,11.3,0l73.4,71.9c0.8,0.8,2.1,0.8,2.8,0l73.4-71.9C398.5,217.1,403.6,217.1,406.7,220.2L406.7,220.2z" />
</svg>
`)}`;
var WalletConnect = class extends BaseWallet {
  client = null;
  options;
  modal = null;
  modalOptions;
  session = null;
  chains;
  store;
  constructor({
    id,
    store,
    subscribe,
    getAlgodClient,
    options,
    metadata = {}
  }) {
    super({ id, metadata, getAlgodClient, store, subscribe });
    if (!options?.projectId) {
      throw new Error(`[${this.metadata.name}] Missing required option: projectId`);
    }
    const {
      projectId,
      relayUrl = "wss://relay.walletconnect.com",
      metadata: metadataOptions,
      ...modalOptions
    } = options;
    const clientMetadata = {
      ...this.getWindowMetadata(),
      ...metadataOptions
    };
    this.options = {
      projectId,
      relayUrl,
      metadata: clientMetadata
    };
    this.modalOptions = modalOptions;
    this.chains = Object.values(caipChainId);
    this.store = store;
  }
  static defaultMetadata = {
    name: "WalletConnect",
    icon: ICON10
  };
  /**
   * Get metadata from the current window. This is adapted from the @walletconnect/utils
   * implementation, to avoid requiring the entire package as a dependency.
   * @see https://github.com/WalletConnect/walletconnect-utils/blob/master/browser/window-metadata/src/index.ts
   */
  getWindowMetadata() {
    let doc;
    let loc;
    const defaultMetadata = {
      name: "",
      description: "",
      url: "",
      icons: []
    };
    function getFromWindow(name2) {
      let res;
      if (typeof window !== "undefined" && typeof window[name2] !== "undefined") {
        res = window[name2];
      }
      return res;
    }
    function getFromWindowOrThrow(name2) {
      const res = getFromWindow(name2);
      if (!res) {
        throw new Error(`${name2} is not defined in Window`);
      }
      return res;
    }
    function getDocumentOrThrow() {
      return getFromWindowOrThrow("document");
    }
    function getLocationOrThrow() {
      return getFromWindowOrThrow("location");
    }
    try {
      doc = getDocumentOrThrow();
      loc = getLocationOrThrow();
    } catch (error) {
      console.warn(`[${this.metadata.name}] Error getting window metadata:`, error);
      return defaultMetadata;
    }
    function getIcons() {
      const links = doc.getElementsByTagName("link");
      const icons2 = [];
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const rel = link.getAttribute("rel");
        if (rel) {
          if (rel.toLowerCase().indexOf("icon") > -1) {
            const href = link.getAttribute("href");
            if (href) {
              if (href.toLowerCase().indexOf("https:") === -1 && href.toLowerCase().indexOf("http:") === -1 && href.indexOf("//") !== 0) {
                let absoluteHref = loc.protocol + "//" + loc.host;
                if (href.indexOf("/") === 0) {
                  absoluteHref += href;
                } else {
                  const path = loc.pathname.split("/");
                  path.pop();
                  const finalPath = path.join("/");
                  absoluteHref += finalPath + "/" + href;
                }
                icons2.push(absoluteHref);
              } else if (href.indexOf("//") === 0) {
                const absoluteUrl = loc.protocol + href;
                icons2.push(absoluteUrl);
              } else {
                icons2.push(href);
              }
            }
          }
        }
      }
      return icons2;
    }
    function getWindowMetadataOfAny(...args) {
      const metaTags = doc.getElementsByTagName("meta");
      for (let i = 0; i < metaTags.length; i++) {
        const tag = metaTags[i];
        const attributes = ["itemprop", "property", "name"].map((target) => tag.getAttribute(target)).filter((attr) => {
          if (attr) {
            return args.includes(attr);
          }
          return false;
        });
        if (attributes.length && attributes) {
          const content = tag.getAttribute("content");
          if (content) {
            return content;
          }
        }
      }
      return "";
    }
    function getName() {
      let name2 = getWindowMetadataOfAny("name", "og:site_name", "og:title", "twitter:title");
      if (!name2) {
        name2 = doc.title;
      }
      return name2;
    }
    function getDescription() {
      const description2 = getWindowMetadataOfAny(
        "description",
        "og:description",
        "twitter:description",
        "keywords"
      );
      return description2;
    }
    const name = getName();
    const description = getDescription();
    const url = loc.origin;
    const icons = getIcons();
    const meta = {
      description,
      url,
      icons,
      name
    };
    return meta;
  }
  async initializeClient() {
    console.info(`[${this.metadata.name}] Initializing client...`);
    const SignClient = (await import("@walletconnect/sign-client")).SignClient;
    const client = await SignClient.init(this.options);
    client.on("session_event", (args) => {
      console.log(`[${this.metadata.name}] EVENT`, "session_event", args);
    });
    client.on("session_update", ({ topic, params }) => {
      console.log(`[${this.metadata.name}] EVENT`, "session_update", { topic, params });
      const { namespaces } = params;
      const session = client.session.get(topic);
      const updatedSession = { ...session, namespaces };
      this.onSessionConnected(updatedSession);
    });
    client.on("session_delete", () => {
      console.log(`[${this.metadata.name}] EVENT`, "session_delete");
      this.session = null;
    });
    this.client = client;
    return client;
  }
  async initializeModal() {
    console.info(`[${this.metadata.name}] Initializing modal...`);
    const WalletConnectModal = (await import("@walletconnect/modal")).WalletConnectModal;
    const modal = new WalletConnectModal({
      projectId: this.options.projectId,
      chains: this.chains,
      ...this.modalOptions
    });
    modal.subscribeModal(
      (state) => console.info(`[${this.metadata.name}] Modal ${state.open ? "open" : "closed"}`)
    );
    this.modal = modal;
    return modal;
  }
  onSessionConnected(session) {
    const caipAccounts = session.namespaces.algorand.accounts;
    if (!caipAccounts.length) {
      throw new Error("No accounts found!");
    }
    const accounts = [...new Set(caipAccounts.map((account) => account.split(":").pop()))];
    const walletAccounts = accounts.map((address, idx) => ({
      name: `${this.metadata.name} Account ${idx + 1}`,
      address
    }));
    const state = this.store.state;
    const walletState = state.wallets[this.id];
    if (!walletState) {
      const newWalletState = {
        accounts: walletAccounts,
        activeAccount: walletAccounts[0]
      };
      addWallet(this.store, {
        walletId: this.id,
        wallet: newWalletState
      });
      console.info(`[${this.metadata.name}] \u2705 Connected.`, newWalletState);
    } else {
      const match = compareAccounts(walletAccounts, walletState.accounts);
      if (!match) {
        console.warn(`[${this.metadata.name}] Session accounts mismatch, updating accounts`, {
          prev: walletState.accounts,
          current: walletAccounts
        });
        setAccounts(this.store, {
          walletId: this.id,
          accounts: walletAccounts
        });
      }
    }
    this.session = session;
    return walletAccounts;
  }
  connect = async () => {
    console.info(`[${this.metadata.name}] Connecting...`);
    try {
      const client = this.client || await this.initializeClient();
      const modal = this.modal || await this.initializeModal();
      const requiredNamespaces = {
        algorand: {
          chains: this.chains,
          methods: ["algo_signTxn"],
          events: []
        }
      };
      const { uri, approval } = await client.connect({ requiredNamespaces });
      if (!uri) {
        throw new Error("No URI found");
      }
      await modal.openModal({ uri });
      const session = await approval();
      const walletAccounts = this.onSessionConnected(session);
      return walletAccounts;
    } finally {
      this.modal?.closeModal();
    }
  };
  disconnect = async () => {
    console.info(`[${this.metadata.name}] Disconnecting...`);
    try {
      this.onDisconnect();
      if (this.client && this.session) {
        await this.client.disconnect({
          topic: this.session.topic,
          reason: {
            message: "User disconnected.",
            code: 6e3
          }
        });
      }
      console.info(`[${this.metadata.name}] Disconnected.`);
    } catch (error) {
      console.error(error);
    }
  };
  resumeSession = async () => {
    try {
      const state = this.store.state;
      const walletState = state.wallets[this.id];
      if (!walletState) {
        return;
      }
      console.info(`[${this.metadata.name}] Resuming session...`);
      const client = this.client || await this.initializeClient();
      if (client.session.length) {
        const lastKeyIndex = client.session.keys.length - 1;
        const restoredSession = client.session.get(client.session.keys[lastKeyIndex]);
        this.onSessionConnected(restoredSession);
      }
    } catch (error) {
      console.error(`[${this.metadata.name}] Error resuming session: ${error.message}`);
      this.onDisconnect();
      throw error;
    }
  };
  processTxns(txnGroup, indexesToSign) {
    const txnsToSign = [];
    txnGroup.forEach((txn, index) => {
      const isIndexMatch = !indexesToSign || indexesToSign.includes(index);
      const signer = import_algosdk10.default.encodeAddress(txn.from.publicKey);
      const canSignTxn = this.addresses.includes(signer);
      const txnString = byteArrayToBase64(txn.toByte());
      if (isIndexMatch && canSignTxn) {
        txnsToSign.push({ txn: txnString });
      } else {
        txnsToSign.push({ txn: txnString, signers: [] });
      }
    });
    return txnsToSign;
  }
  processEncodedTxns(txnGroup, indexesToSign) {
    const txnsToSign = [];
    txnGroup.forEach((txnBuffer, index) => {
      const txnDecodeObj = import_algosdk10.default.decodeObj(txnBuffer);
      const isSigned = isSignedTxn(txnDecodeObj);
      const txn = isSigned ? import_algosdk10.default.decodeSignedTransaction(txnBuffer).txn : import_algosdk10.default.decodeUnsignedTransaction(txnBuffer);
      const isIndexMatch = !indexesToSign || indexesToSign.includes(index);
      const signer = import_algosdk10.default.encodeAddress(txn.from.publicKey);
      const canSignTxn = !isSigned && this.addresses.includes(signer);
      const txnString = byteArrayToBase64(txn.toByte());
      if (isIndexMatch && canSignTxn) {
        txnsToSign.push({ txn: txnString });
      } else {
        txnsToSign.push({ txn: txnString, signers: [] });
      }
    });
    return txnsToSign;
  }
  signTransactions = async (txnGroup, indexesToSign) => {
    try {
      if (!this.session) {
        throw new SessionError(`No session found!`);
      }
      let txnsToSign = [];
      if (isTransactionArray(txnGroup)) {
        const flatTxns = flattenTxnGroup(txnGroup);
        txnsToSign = this.processTxns(flatTxns, indexesToSign);
      } else {
        const flatTxns = flattenTxnGroup(txnGroup);
        txnsToSign = this.processEncodedTxns(flatTxns, indexesToSign);
      }
      const client = this.client || await this.initializeClient();
      const request = formatJsonRpcRequest("algo_signTxn", [txnsToSign]);
      const signTxnsResult = await client.request({
        chainId: caipChainId[this.activeNetwork],
        topic: this.session.topic,
        request
      });
      const signedTxns = signTxnsResult.reduce((acc, value) => {
        if (value) {
          let signedTxn;
          if (typeof value === "string") {
            signedTxn = base64ToByteArray(value);
          } else if (value instanceof Uint8Array) {
            signedTxn = value;
          } else if (Array.isArray(value)) {
            signedTxn = new Uint8Array(value);
          } else {
            console.warn(`[${this.metadata.name}] Unexpected type in signTxnsResult`, value);
            signedTxn = new Uint8Array();
          }
          acc.push(signedTxn);
        }
        return acc;
      }, []);
      const result = txnsToSign.reduce((acc, txn) => {
        if (txn.signers && txn.signers.length == 0) {
          acc.push(null);
        } else {
          const signedTxn = signedTxns.shift();
          if (signedTxn) {
            acc.push(signedTxn);
          }
        }
        return acc;
      }, []);
      return result;
    } catch (error) {
      if (error instanceof SessionError) {
        this.onDisconnect();
      }
      console.error(`[${this.metadata.name}] Error signing transactions:`, error);
      throw error;
    }
  };
};

// src/utils.ts
function createWalletMap() {
  return {
    ["custom" /* CUSTOM */]: CustomWallet,
    ["defly" /* DEFLY */]: DeflyWallet,
    ["exodus" /* EXODUS */]: ExodusWallet,
    ["kibisis" /* KIBISIS */]: KibisisWallet,
    ["kmd" /* KMD */]: KmdWallet,
    ["lute" /* LUTE */]: LuteWallet,
    ["magic" /* MAGIC */]: MagicAuth,
    ["mnemonic" /* MNEMONIC */]: MnemonicWallet,
    ["pera" /* PERA */]: PeraWallet,
    ["pera-beta" /* PERA2 */]: PeraWallet2,
    ["walletconnect" /* WALLETCONNECT */]: WalletConnect
  };
}
function compareAccounts(accounts, compareTo) {
  const addresses = new Set(accounts.map((account) => account.address));
  const compareAddresses = new Set(compareTo.map((account) => account.address));
  if (addresses.size !== compareAddresses.size) {
    return false;
  }
  for (const address of addresses) {
    if (!compareAddresses.has(address)) {
      return false;
    }
  }
  return true;
}
function base64ToByteArray(blob) {
  return stringToByteArray(atob(blob));
}
function byteArrayToBase64(array) {
  return btoa(byteArrayToString(array));
}
function stringToByteArray(str) {
  const array = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    array[i] = str.charCodeAt(i);
  }
  return array;
}
function byteArrayToString(array) {
  let result = "";
  for (let i = 0; i < array.length; i++) {
    result += String.fromCharCode(array[i]);
  }
  return result;
}
function isSignedTxn(txnDecodeObj) {
  return txnDecodeObj.txn !== void 0;
}
function isTransaction(item) {
  return item && typeof item === "object" && "genesisID" in item && typeof item.genesisID === "string";
}
function isTransactionArray(txnGroup) {
  if (!Array.isArray(txnGroup) || txnGroup.length === 0) {
    return false;
  }
  if (isTransaction(txnGroup[0])) {
    return true;
  }
  if (Array.isArray(txnGroup[0]) && txnGroup[0].length > 0 && isTransaction(txnGroup[0][0])) {
    return true;
  }
  return false;
}
function flattenTxnGroup(txnGroup) {
  return Array.isArray(txnGroup[0]) ? txnGroup.flat() : txnGroup;
}
function getPayloadId() {
  const date = Date.now() * Math.pow(10, 3);
  const extra = Math.floor(Math.random() * Math.pow(10, 3));
  return date + extra;
}
function formatJsonRpcRequest(method, params) {
  return {
    id: getPayloadId(),
    jsonrpc: "2.0",
    method,
    params
  };
}
function deepMerge(target, source) {
  const isObject = (obj) => obj && typeof obj === "object";
  if (!isObject(target) || !isObject(source)) {
    throw new Error("Target and source must be objects");
  }
  Object.keys(source).forEach((key) => {
    const targetValue = target[key];
    const sourceValue = source[key];
    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      target[key] = targetValue.concat(sourceValue);
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      target[key] = deepMerge(Object.assign({}, targetValue), sourceValue);
    } else {
      target[key] = sourceValue;
    }
  });
  return target;
}

// src/wallets/custom.ts
var ICON11 = `data:image/svg+xml;base64,${btoa(`
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <rect width="24" height="24" fill="#525252" />
</svg>
`)}`;
var CustomWallet = class extends BaseWallet {
  provider;
  store;
  constructor({
    id,
    store,
    subscribe,
    getAlgodClient,
    options,
    metadata = {}
  }) {
    super({ id, metadata, getAlgodClient, store, subscribe });
    if (!options?.provider) {
      throw new Error(`[${this.metadata.name}] Missing required option: provider`);
    }
    this.provider = options.provider;
    this.store = store;
  }
  static defaultMetadata = {
    name: "Custom",
    icon: ICON11
  };
  connect = async (args) => {
    console.info(`[${this.metadata.name}] Connecting...`);
    try {
      if (!this.provider.connect) {
        throw new Error(`[${this.metadata.name}] Method not supported: connect`);
      }
      const walletAccounts = await this.provider.connect(args);
      if (walletAccounts.length === 0) {
        throw new Error("No accounts found!");
      }
      const activeAccount = walletAccounts[0];
      const walletState = {
        accounts: walletAccounts,
        activeAccount
      };
      addWallet(this.store, {
        walletId: this.id,
        wallet: walletState
      });
      console.info(`[${this.metadata.name}] \u2705 Connected.`, walletState);
      return walletAccounts;
    } catch (error) {
      console.error(`[${this.metadata.name}] Error connecting:`, error.message || error);
      throw error;
    }
  };
  disconnect = async () => {
    console.info(`[${this.metadata.name}] Disconnecting...`);
    this.onDisconnect();
    await this.provider.disconnect?.();
  };
  resumeSession = async () => {
    try {
      const state = this.store.state;
      const walletState = state.wallets[this.id];
      if (!walletState) {
        return;
      }
      console.info(`[${this.metadata.name}] Resuming session...`);
      const result = await this.provider.resumeSession?.();
      if (Array.isArray(result)) {
        const walletAccounts = result;
        if (walletAccounts.length === 0) {
          throw new Error(`[${this.metadata.name}] No accounts found!`);
        }
        const match = compareAccounts(walletAccounts, walletState.accounts);
        if (!match) {
          console.warn(`[${this.metadata.name}] Session accounts mismatch, updating accounts`, {
            prev: walletState.accounts,
            current: walletAccounts
          });
          setAccounts(this.store, {
            walletId: this.id,
            accounts: walletAccounts
          });
        }
      }
      console.info(`[${this.metadata.name}] Session resumed.`);
    } catch (error) {
      console.error(`[${this.metadata.name}] Error resuming session:`, error.message);
      throw error;
    }
  };
  signTransactions = async (txnGroup, indexesToSign) => {
    if (!this.provider.signTransactions) {
      throw new Error(`[${this.metadata.name}] Method not supported: signTransactions`);
    }
    return await this.provider.signTransactions(txnGroup, indexesToSign);
  };
  transactionSigner = async (txnGroup, indexesToSign) => {
    if (!this.provider.transactionSigner) {
      throw new Error(`[${this.metadata.name}] Method not supported: transactionSigner`);
    }
    return await this.provider.transactionSigner(txnGroup, indexesToSign);
  };
};

// src/store.ts
var defaultState = {
  wallets: {},
  activeWallet: null,
  activeNetwork: "testnet" /* TESTNET */,
  algodClient: new import_algosdk11.default.Algodv2("", "https://testnet-api.4160.nodely.dev/")
};
var LOCAL_STORAGE_KEY = "@txnlab/use-wallet:v3";
function addWallet(store, { walletId, wallet }) {
  store.setState((state) => {
    const updatedWallets = {
      ...state.wallets,
      [walletId]: {
        accounts: wallet.accounts.map((account) => ({ ...account })),
        activeAccount: wallet.activeAccount ? { ...wallet.activeAccount } : null
      }
    };
    return {
      ...state,
      wallets: updatedWallets,
      activeWallet: walletId
    };
  });
}
function removeWallet(store, { walletId }) {
  store.setState((state) => {
    const updatedWallets = { ...state.wallets };
    delete updatedWallets[walletId];
    return {
      ...state,
      wallets: updatedWallets,
      activeWallet: state.activeWallet === walletId ? null : state.activeWallet
    };
  });
}
function setActiveWallet(store, { walletId }) {
  store.setState((state) => ({
    ...state,
    activeWallet: walletId
  }));
}
function setActiveAccount(store, { walletId, address }) {
  store.setState((state) => {
    const wallet = state.wallets[walletId];
    if (!wallet) {
      console.warn(`Wallet with id "${walletId}" not found`);
      return state;
    }
    const newActiveAccount = wallet.accounts.find((a2) => a2.address === address);
    if (!newActiveAccount) {
      console.warn(`Account with address ${address} not found in wallet "${walletId}"`);
      return state;
    }
    const updatedWallet = {
      ...wallet,
      accounts: wallet.accounts.map((account) => ({ ...account })),
      activeAccount: { ...newActiveAccount }
    };
    const updatedWallets = {
      ...state.wallets,
      [walletId]: updatedWallet
    };
    return {
      ...state,
      wallets: updatedWallets
    };
  });
}
function setAccounts(store, { walletId, accounts }) {
  store.setState((state) => {
    const wallet = state.wallets[walletId];
    if (!wallet) {
      console.warn(`Wallet with id "${walletId}" not found`);
      return state;
    }
    const newAccounts = accounts.map((account) => ({ ...account }));
    const isActiveAccountConnected = newAccounts.some(
      (account) => account.address === wallet.activeAccount?.address
    );
    const newActiveAccount = isActiveAccountConnected ? { ...wallet.activeAccount } : newAccounts[0] || null;
    const updatedWallet = {
      ...wallet,
      accounts: newAccounts,
      activeAccount: newActiveAccount
    };
    const updatedWallets = {
      ...state.wallets,
      [walletId]: updatedWallet
    };
    return {
      ...state,
      wallets: updatedWallets
    };
  });
}
function setActiveNetwork(store, { networkId, algodClient }) {
  store.setState((state) => ({
    ...state,
    activeNetwork: networkId,
    algodClient
  }));
}
function isValidWalletId(walletId) {
  return Object.values(WalletId).includes(walletId);
}
function isValidWalletAccount(account) {
  return typeof account === "object" && account !== null && typeof account.name === "string" && typeof account.address === "string";
}
function isValidWalletState(wallet) {
  return typeof wallet === "object" && wallet !== null && Array.isArray(wallet.accounts) && wallet.accounts.every(isValidWalletAccount) && (wallet.activeAccount === null || isValidWalletAccount(wallet.activeAccount));
}
function isValidState(state) {
  if (!state || typeof state !== "object") return false;
  if (typeof state.wallets !== "object") return false;
  for (const [walletId, wallet] of Object.entries(state.wallets)) {
    if (!isValidWalletId(walletId) || !isValidWalletState(wallet)) return false;
  }
  if (state.activeWallet !== null && !isValidWalletId(state.activeWallet)) return false;
  if (!isValidNetworkId(state.activeNetwork)) return false;
  return true;
}

// src/manager.ts
var WalletManager = class {
  _clients = /* @__PURE__ */ new Map();
  networkConfig;
  store;
  subscribe;
  options;
  constructor({
    wallets = [],
    network = "testnet" /* TESTNET */,
    algod = {},
    options = {}
  } = {}) {
    this.networkConfig = this.initNetworkConfig(network, algod);
    this.options = { resetNetwork: options.resetNetwork || false };
    const persistedState = this.loadPersistedState();
    const activeNetwork = this.options.resetNetwork ? network : persistedState?.activeNetwork || network;
    const algodClient = this.createAlgodClient(this.networkConfig[activeNetwork]);
    const initialState = {
      ...defaultState,
      ...persistedState,
      activeNetwork,
      algodClient
    };
    this.store = new import_store13.Store(initialState, {
      onUpdate: () => this.savePersistedState()
    });
    this.savePersistedState();
    this.subscribe = (callback) => {
      const unsubscribe = this.store.subscribe(() => {
        callback(this.store.state);
      });
      return unsubscribe;
    };
    this.initializeWallets(wallets);
  }
  // ---------- Store ------------------------------------------------- //
  get algodClient() {
    return this.store.state.algodClient;
  }
  set algodClient(algodClient) {
    this.store.setState((state) => ({
      ...state,
      algodClient
    }));
  }
  loadPersistedState() {
    try {
      const serializedState = StorageAdapter.getItem(LOCAL_STORAGE_KEY);
      if (serializedState === null) {
        return null;
      }
      const parsedState = JSON.parse(serializedState);
      if (!isValidState(parsedState)) {
        console.warn("[Store] Parsed state:", parsedState);
        throw new Error("Persisted state is invalid");
      }
      return parsedState;
    } catch (error) {
      console.error(`[Store] Could not load state from local storage: ${error.message}`);
      return null;
    }
  }
  savePersistedState() {
    try {
      const { wallets, activeWallet, activeNetwork } = this.store.state;
      const persistedState = { wallets, activeWallet, activeNetwork };
      const serializedState = JSON.stringify(persistedState);
      StorageAdapter.setItem(LOCAL_STORAGE_KEY, serializedState);
    } catch (error) {
      console.error("[Store] Could not save state to local storage:", error);
    }
  }
  // ---------- Wallets ----------------------------------------------- //
  initializeWallets(walletsConfig) {
    console.info("[Manager] Initializing wallets...");
    for (const walletConfig of walletsConfig) {
      let walletId;
      let walletOptions;
      let walletMetadata;
      if (typeof walletConfig === "string") {
        walletId = walletConfig;
      } else {
        const { id, options, metadata } = walletConfig;
        walletId = id;
        walletOptions = options;
        walletMetadata = metadata;
      }
      const walletMap = createWalletMap();
      const WalletClass = walletMap[walletId];
      if (!WalletClass) {
        console.error(`[Manager] Wallet not found: ${walletId}`);
        continue;
      }
      const walletInstance = new WalletClass({
        id: walletId,
        metadata: walletMetadata,
        options: walletOptions,
        getAlgodClient: this.getAlgodClient,
        store: this.store,
        subscribe: this.subscribe
      });
      this._clients.set(walletId, walletInstance);
      console.info(`[Manager] \u2705 Initialized ${walletId}`);
    }
    const state = this.store.state;
    const connectedWallets = Object.keys(state.wallets);
    for (const walletId of connectedWallets) {
      if (!this._clients.has(walletId)) {
        console.warn(`[Manager] Connected wallet not found: ${walletId}`);
        removeWallet(this.store, { walletId });
      }
    }
    if (state.activeWallet && !this._clients.has(state.activeWallet)) {
      console.warn(`[Manager] Active wallet not found: ${state.activeWallet}`);
      setActiveWallet(this.store, { walletId: null });
    }
  }
  get wallets() {
    return [...this._clients.values()];
  }
  getWallet(walletId) {
    return this._clients.get(walletId);
  }
  async resumeSessions() {
    const promises = this.wallets.map((wallet) => wallet?.resumeSession());
    await Promise.all(promises);
  }
  async disconnect() {
    const promises = this.wallets.filter((wallet) => wallet.isConnected).map((wallet) => wallet?.disconnect());
    await Promise.all(promises);
  }
  // ---------- Network ----------------------------------------------- //
  initNetworkConfig(network, config) {
    console.info("[Manager] Initializing network...");
    let networkConfig = createDefaultNetworkConfig();
    if (isNetworkConfigMap(config)) {
      networkConfig = deepMerge(networkConfig, config);
    } else {
      networkConfig[network] = deepMerge(networkConfig[network], config);
    }
    console.info("[Manager] Algodv2 config:", networkConfig);
    return networkConfig;
  }
  createAlgodClient(config) {
    if (this.store) console.info(`[Manager] Creating Algodv2 client for ${this.activeNetwork}...`);
    const { token = "", baseServer, port = "", headers = {} } = config;
    return new import_algosdk12.default.Algodv2(token, baseServer, port, headers);
  }
  getAlgodClient = () => {
    return this.algodClient;
  };
  setActiveNetwork = async (networkId) => {
    if (this.activeNetwork === networkId) {
      return;
    }
    const algodClient = this.createAlgodClient(this.networkConfig[networkId]);
    setActiveNetwork(this.store, { networkId, algodClient });
    console.info(`[Manager] \u2705 Active network set to ${networkId}.`);
  };
  get activeNetwork() {
    return this.store.state.activeNetwork;
  }
  // ---------- Active Wallet ----------------------------------------- //
  get activeWallet() {
    const state = this.store.state;
    const activeWallet = this.wallets.find((wallet) => wallet.id === state.activeWallet);
    if (!activeWallet) {
      return null;
    }
    return activeWallet;
  }
  get activeWalletAccounts() {
    if (!this.activeWallet) {
      return null;
    }
    return this.activeWallet.accounts;
  }
  get activeWalletAddresses() {
    if (!this.activeWallet) {
      return null;
    }
    return this.activeWallet.accounts.map((account) => account.address);
  }
  get activeAccount() {
    if (!this.activeWallet) {
      return null;
    }
    return this.activeWallet.activeAccount;
  }
  get activeAddress() {
    if (!this.activeAccount) {
      return null;
    }
    return this.activeAccount.address;
  }
  // ---------- Sign Transactions ------------------------------------- //
  get signTransactions() {
    if (!this.activeWallet) {
      throw new Error("[Manager] No active wallet found!");
    }
    return this.activeWallet.signTransactions;
  }
  get transactionSigner() {
    if (!this.activeWallet) {
      throw new Error("[Manager] No active wallet found!");
    }
    return this.activeWallet.transactionSigner;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BaseWallet,
  CustomWallet,
  DeflyWallet,
  ExodusWallet,
  ICON,
  KIBISIS_AVM_WEB_PROVIDER_ID,
  KibisisWallet,
  KmdWallet,
  LOCAL_STORAGE_MNEMONIC_KEY,
  MagicAuth,
  MnemonicWallet,
  NetworkId,
  PeraWallet,
  SessionError,
  SignTxnsError,
  StorageAdapter,
  WalletConnect,
  WalletId,
  WalletManager,
  defaultState,
  isAVMWebProviderSDKError
});
//# sourceMappingURL=index.cjs.map