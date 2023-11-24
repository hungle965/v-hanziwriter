import { defineComponent as Ct, ref as wt, onMounted as Pt, nextTick as Dt, openBlock as Q, createElementBlock as X, Fragment as Mt, createCommentVNode as Rt, renderSlot as Tt } from "vue";
var E;
const P = typeof window > "u" ? global : window, at = P.performance && (() => P.performance.now()) || (() => Date.now()), F = P.requestAnimationFrame || ((s) => setTimeout(() => s(at()), 1e3 / 60)), Y = P.cancelAnimationFrame || clearTimeout;
function T(s) {
  return s[s.length - 1];
}
const q = (s, t) => s < 0 ? t + s : s, $t = (s, t) => s[q(t, s.length)];
function ht(s, t) {
  const e = {
    ...s
  };
  for (const r in t) {
    const i = s[r], n = t[r];
    i !== n && (i && n && typeof i == "object" && typeof n == "object" && !Array.isArray(n) ? e[r] = ht(i, n) : e[r] = n);
  }
  return e;
}
function At(s, t) {
  const e = s.split("."), r = {};
  let i = r;
  for (let n = 0; n < e.length; n++) {
    const o = n === e.length - 1 ? t : {};
    i[e[n]] = o, i = o;
  }
  return r;
}
let G = 0;
function lt() {
  return G++, G;
}
function M(s) {
  return s.reduce((e, r) => r + e, 0) / s.length;
}
function k(s) {
  const t = s.toUpperCase().trim();
  if (/^#([A-F0-9]{3}){1,2}$/.test(t)) {
    let r = t.substring(1).split("");
    r.length === 3 && (r = [r[0], r[0], r[1], r[1], r[2], r[2]]);
    const i = `${r.join("")}`;
    return {
      r: parseInt(i.slice(0, 2), 16),
      g: parseInt(i.slice(2, 4), 16),
      b: parseInt(i.slice(4, 6), 16),
      a: 1
    };
  }
  const e = t.match(/^RGBA?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d*\.?\d+))?\)$/);
  if (e)
    return {
      r: parseInt(e[1], 10),
      g: parseInt(e[2], 10),
      b: parseInt(e[3], 10),
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 2.
      a: parseFloat(e[4] || 1, 10)
    };
  throw new Error(`Invalid color: ${s}`);
}
const xt = (s) => s.replace(/^\s+/, "").replace(/\s+$/, "");
function b(s, t) {
  const e = {};
  for (let r = 0; r < t; r++)
    e[r] = s;
  return e;
}
function Ot(s, t) {
  const e = {};
  for (let r = 0; r < s; r++)
    e[r] = t(r);
  return e;
}
const z = ((E = P.navigator) === null || E === void 0 ? void 0 : E.userAgent) || "", bt = z.indexOf("MSIE ") > 0 || z.indexOf("Trident/") > 0 || z.indexOf("Edge/") > 0, ct = () => {
};
class Lt {
  constructor(t, e, r = ct) {
    this._mutationChains = [], this._onStateChange = r, this.state = {
      options: {
        drawingFadeDuration: e.drawingFadeDuration,
        drawingWidth: e.drawingWidth,
        drawingColor: k(e.drawingColor),
        strokeColor: k(e.strokeColor),
        outlineColor: k(e.outlineColor),
        radicalColor: k(e.radicalColor || e.strokeColor),
        highlightColor: k(e.highlightColor)
      },
      character: {
        main: {
          opacity: e.showCharacter ? 1 : 0,
          strokes: {}
        },
        outline: {
          opacity: e.showOutline ? 1 : 0,
          strokes: {}
        },
        highlight: {
          opacity: 1,
          strokes: {}
        }
      },
      userStrokes: null
    };
    for (let i = 0; i < t.strokes.length; i++)
      this.state.character.main.strokes[i] = {
        opacity: 1,
        displayPortion: 1
      }, this.state.character.outline.strokes[i] = {
        opacity: 1,
        displayPortion: 1
      }, this.state.character.highlight.strokes[i] = {
        opacity: 0,
        displayPortion: 1
      };
  }
  overwriteOnStateChange(t) {
    this._onStateChange = t;
  }
  updateState(t) {
    const e = ht(this.state, t);
    this._onStateChange(e, this.state), this.state = e;
  }
  run(t, e = {}) {
    const r = t.map((i) => i.scope);
    return this.cancelMutations(r), new Promise((i) => {
      const n = {
        _isActive: !0,
        _index: 0,
        _resolve: i,
        _mutations: t,
        _loop: e.loop,
        _scopes: r
      };
      this._mutationChains.push(n), this._run(n);
    });
  }
  _run(t) {
    if (!t._isActive)
      return;
    const e = t._mutations;
    if (t._index >= e.length)
      if (t._loop)
        t._index = 0;
      else {
        t._isActive = !1, this._mutationChains = this._mutationChains.filter((i) => i !== t), t._resolve({
          canceled: !1
        });
        return;
      }
    t._mutations[t._index].run(this).then(() => {
      t._isActive && (t._index++, this._run(t));
    });
  }
  _getActiveMutations() {
    return this._mutationChains.map((t) => t._mutations[t._index]);
  }
  pauseAll() {
    this._getActiveMutations().forEach((t) => t.pause());
  }
  resumeAll() {
    this._getActiveMutations().forEach((t) => t.resume());
  }
  cancelMutations(t) {
    for (const e of this._mutationChains)
      for (const r of e._scopes)
        for (const i of t)
          (r.startsWith(i) || i.startsWith(r)) && this._cancelMutationChain(e);
  }
  cancelAll() {
    this.cancelMutations([""]);
  }
  _cancelMutationChain(t) {
    var e;
    t._isActive = !1;
    for (let r = t._index; r < t._mutations.length; r++)
      t._mutations[r].cancel(this);
    (e = t._resolve) === null || e === void 0 || e.call(t, {
      canceled: !0
    }), this._mutationChains = this._mutationChains.filter((r) => r !== t);
  }
}
const C = (s, t) => ({
  x: s.x - t.x,
  y: s.y - t.y
}), $ = (s) => Math.sqrt(Math.pow(s.x, 2) + Math.pow(s.y, 2)), g = (s, t) => $(C(s, t)), Et = (s, t) => s.x === t.x && s.y === t.y, W = (s, t = 1) => {
  const e = t * 10;
  return {
    x: Math.round(e * s.x) / e,
    y: Math.round(e * s.y) / e
  };
}, U = (s) => {
  let t = s[0];
  return s.slice(1).reduce((r, i) => {
    const n = g(i, t);
    return t = i, r + n;
  }, 0);
}, Ft = (s, t) => (s.x * t.x + s.y * t.y) / $(s) / $(t), V = (s, t, e) => {
  const r = C(t, s), i = e / $(r);
  return {
    x: t.x + i * r.x,
    y: t.y + i * r.y
  };
}, zt = (s, t) => {
  const e = s.length >= t.length ? s : t, r = s.length >= t.length ? t : s, i = (o, a, h, l) => {
    if (o === 0 && a === 0)
      return g(e[0], r[0]);
    if (o > 0 && a === 0)
      return Math.max(h[0], g(e[o], r[0]));
    const d = l[l.length - 1];
    return o === 0 && a > 0 ? Math.max(d, g(e[0], r[a])) : Math.max(Math.min(h[a], h[a - 1], d), g(e[o], r[a]));
  };
  let n = [];
  for (let o = 0; o < e.length; o++) {
    const a = [];
    for (let h = 0; h < r.length; h++)
      a.push(i(o, h, n, a));
    n = a;
  }
  return n[r.length - 1];
}, Ht = (s, t = 0.05) => {
  const e = s.slice(0, 1);
  for (const r of s.slice(1)) {
    const i = e[e.length - 1], n = g(r, i);
    if (n > t) {
      const o = Math.ceil(n / t), a = n / o;
      for (let h = 0; h < o; h++)
        e.push(V(r, i, -1 * a * (h + 1)));
    } else
      e.push(r);
  }
  return e;
}, It = (s, t = 30) => {
  const r = U(s) / (t - 1), i = [s[0]], n = T(s), o = s.slice(1);
  for (let a = 0; a < t - 2; a++) {
    let h = T(i), l = r, d = !1;
    for (; !d; ) {
      const c = g(h, o[0]);
      if (c < l)
        l -= c, h = o.shift();
      else {
        const p = V(h, o[0], l - c);
        i.push(p), d = !0;
      }
    }
  }
  return i.push(n), i;
}, K = (s) => {
  const t = It(s), e = M(t.map((h) => h.x)), r = M(t.map((h) => h.y)), i = {
    x: e,
    y: r
  }, n = t.map((h) => C(h, i)), o = Math.sqrt(M([Math.pow(n[0].x, 2) + Math.pow(n[0].y, 2), Math.pow(T(n).x, 2) + Math.pow(T(n).y, 2)])), a = n.map((h) => ({
    x: h.x / o,
    y: h.y / o
  }));
  return Ht(a);
}, Wt = (s, t) => s.map((e) => ({
  x: Math.cos(t) * e.x - Math.sin(t) * e.y,
  y: Math.sin(t) * e.x + Math.cos(t) * e.y
})), Bt = (s) => {
  if (s.length < 3)
    return s;
  const t = [s[0], s[1]];
  return s.slice(2).forEach((e) => {
    const r = t.length, i = C(e, t[r - 1]), n = C(t[r - 1], t[r - 2]);
    i.y * n.x - i.x * n.y === 0 && t.pop(), t.push(e);
  }), t;
};
function N(s, t = !1) {
  const e = W(s[0]), r = s.slice(1);
  let i = `M ${e.x} ${e.y}`;
  return r.forEach((n) => {
    const o = W(n);
    i += ` L ${o.x} ${o.y}`;
  }), t && (i += "Z"), i;
}
const dt = (s, t) => {
  const e = Bt(s);
  if (e.length < 2)
    return e;
  const r = e[1], i = e[0], n = V(r, i, t), o = e.slice(1);
  return o.unshift(n), o;
};
class qt {
  constructor(t, e, r, i = !1) {
    this.path = t, this.points = e, this.strokeNum = r, this.isInRadical = i;
  }
  getStartingPoint() {
    return this.points[0];
  }
  getEndingPoint() {
    return this.points[this.points.length - 1];
  }
  getLength() {
    return U(this.points);
  }
  getVectors() {
    let t = this.points[0];
    return this.points.slice(1).map((r) => {
      const i = C(r, t);
      return t = r, i;
    });
  }
  getDistance(t) {
    const e = this.points.map((r) => g(r, t));
    return Math.min(...e);
  }
  getAverageDistance(t) {
    return t.reduce((r, i) => r + this.getDistance(i), 0) / t.length;
  }
}
class Ut {
  constructor(t, e) {
    this.symbol = t, this.strokes = e;
  }
}
function Vt({
  radStrokes: s,
  strokes: t,
  medians: e
}) {
  const r = (i) => {
    var n;
    return ((n = s?.indexOf(i)) !== null && n !== void 0 ? n : -1) >= 0;
  };
  return t.map((i, n) => {
    const o = e[n].map((a) => {
      const [h, l] = a;
      return {
        x: h,
        y: l
      };
    });
    return new qt(i, o, n, r(n));
  });
}
function Nt(s, t) {
  const e = Vt(t);
  return new Ut(s, e);
}
const jt = [{
  x: 0,
  y: -124
}, {
  x: 1024,
  y: 900
}], [A, ut] = jt, J = ut.x - A.x, Z = ut.y - A.y;
class tt {
  constructor(t) {
    const {
      padding: e,
      width: r,
      height: i
    } = t;
    this.padding = e, this.width = r, this.height = i;
    const n = r - 2 * e, o = i - 2 * e, a = n / J, h = o / Z;
    this.scale = Math.min(a, h);
    const l = e + (n - this.scale * J) / 2, d = e + (o - this.scale * Z) / 2;
    this.xOffset = -1 * A.x * this.scale + l, this.yOffset = -1 * A.y * this.scale + d;
  }
  convertExternalPoint(t) {
    const e = (t.x - this.xOffset) / this.scale, r = (this.height - this.yOffset - t.y) / this.scale;
    return {
      x: e,
      y: r
    };
  }
}
const Qt = 0, et = 250, Xt = 0.4, Yt = 0.35;
function Gt(s, t, e, r = {}) {
  const i = t.strokes, n = ee(s.points);
  if (n.length < 2)
    return {
      isMatch: !1,
      meta: {
        isStrokeBackwards: !1
      }
    };
  const {
    isMatch: o,
    meta: a,
    avgDist: h
  } = R(n, i[e], r);
  if (!o)
    return {
      isMatch: o,
      meta: a
    };
  const l = i.slice(e + 1);
  let d = h;
  for (let c = 0; c < l.length; c++) {
    const {
      isMatch: p,
      avgDist: _
    } = R(n, l[c], {
      ...r,
      checkBackwards: !1
    });
    p && _ < d && (d = _);
  }
  if (d < h) {
    const c = 0.6 * (d + h) / (2 * h), {
      isMatch: p,
      meta: _
    } = R(n, i[e], {
      ...r,
      leniency: (r.leniency || 1) * c
    });
    return {
      isMatch: p,
      meta: _
    };
  }
  return {
    isMatch: o,
    meta: a
  };
}
const Kt = (s, t, e) => {
  const r = g(t.getStartingPoint(), s[0]), i = g(t.getEndingPoint(), s[s.length - 1]);
  return r <= et * e && i <= et * e;
}, Jt = (s) => {
  const t = [];
  let e = s[0];
  return s.slice(1).forEach((r) => {
    t.push(C(r, e)), e = r;
  }), t;
}, Zt = (s, t) => {
  const e = Jt(s), r = t.getVectors(), i = e.map((o) => {
    const a = r.map((h) => Ft(h, o));
    return Math.max(...a);
  });
  return M(i) > Qt;
}, te = (s, t, e) => e * (U(s) + 25) / (t.getLength() + 25) >= Yt, ee = (s) => {
  if (s.length < 2)
    return s;
  const [t, ...e] = s, r = [t];
  for (const i of e)
    Et(i, r[r.length - 1]) || r.push(i);
  return r;
}, re = [Math.PI / 16, Math.PI / 32, 0, -1 * Math.PI / 32, -1 * Math.PI / 16], ie = (s, t, e) => {
  const r = K(s), i = K(t);
  let n = 1 / 0;
  return re.forEach((o) => {
    const a = zt(r, Wt(i, o));
    a < n && (n = a);
  }), n <= Xt * e;
}, R = (s, t, e) => {
  const {
    leniency: r = 1,
    isOutlineVisible: i = !1,
    checkBackwards: n = !0,
    averageDistanceThreshold: o = 350
  } = e, a = t.getAverageDistance(s), h = i || t.strokeNum > 0 ? 0.5 : 1, l = a <= o * h * r;
  if (!l)
    return {
      isMatch: !1,
      avgDist: a,
      meta: {
        isStrokeBackwards: !1
      }
    };
  const d = Kt(s, t, r), c = Zt(s, t), p = ie(s, t.points, r), _ = te(s, t, r), f = l && d && c && p && _;
  return n && !f && R([...s].reverse(), t, {
    ...e,
    checkBackwards: !1
  }).isMatch ? {
    isMatch: f,
    avgDist: a,
    meta: {
      isStrokeBackwards: !0
    }
  } : {
    isMatch: f,
    avgDist: a,
    meta: {
      isStrokeBackwards: !1
    }
  };
};
class se {
  constructor(t, e, r) {
    this.id = t, this.points = [e], this.externalPoints = [r];
  }
  appendPoint(t, e) {
    this.points.push(t), this.externalPoints.push(e);
  }
}
class ne {
  constructor(t) {
    this._duration = t, this._startTime = null, this._paused = !1, this.scope = `delay.${t}`;
  }
  run() {
    return this._startTime = at(), this._runningPromise = new Promise((t) => {
      this._resolve = t, this._timeout = setTimeout(() => this.cancel(), this._duration);
    }), this._runningPromise;
  }
  pause() {
    if (this._paused)
      return;
    const t = performance.now() - (this._startTime || 0);
    this._duration = Math.max(0, this._duration - t), clearTimeout(this._timeout), this._paused = !0;
  }
  resume() {
    this._paused && (this._startTime = performance.now(), this._timeout = setTimeout(() => this.cancel(), this._duration), this._paused = !1);
  }
  cancel() {
    clearTimeout(this._timeout), this._resolve && this._resolve(), this._resolve = void 0;
  }
}
class u {
  /**
   *
   * @param scope a string representation of what fields this mutation affects from the state. This is used to cancel conflicting mutations
   * @param valuesOrCallable a thunk containing the value to set, or a callback which will return those values
   */
  constructor(t, e, r = {}) {
    this._tick = (i) => {
      if (this._startPauseTime !== null)
        return;
      const n = Math.min(1, (i - this._startTime - this._pausedDuration) / this._duration);
      if (n === 1)
        this._renderState.updateState(this._values), this._frameHandle = void 0, this.cancel(this._renderState);
      else {
        const o = oe(n), a = _t(this._startState, this._values, o);
        this._renderState.updateState(a), this._frameHandle = F(this._tick);
      }
    }, this.scope = t, this._valuesOrCallable = e, this._duration = r.duration || 0, this._force = r.force, this._pausedDuration = 0, this._startPauseTime = null;
  }
  run(t) {
    return this._values || this._inflateValues(t), this._duration === 0 && t.updateState(this._values), this._duration === 0 || pt(t.state, this._values) ? Promise.resolve() : (this._renderState = t, this._startState = t.state, this._startTime = performance.now(), this._frameHandle = F(this._tick), new Promise((e) => {
      this._resolve = e;
    }));
  }
  _inflateValues(t) {
    let e = this._valuesOrCallable;
    typeof this._valuesOrCallable == "function" && (e = this._valuesOrCallable(t.state)), this._values = At(this.scope, e);
  }
  pause() {
    this._startPauseTime === null && (this._frameHandle && Y(this._frameHandle), this._startPauseTime = performance.now());
  }
  resume() {
    this._startPauseTime !== null && (this._frameHandle = F(this._tick), this._pausedDuration += performance.now() - this._startPauseTime, this._startPauseTime = null);
  }
  cancel(t) {
    var e;
    (e = this._resolve) === null || e === void 0 || e.call(this), this._resolve = void 0, Y(this._frameHandle || -1), this._frameHandle = void 0, this._force && (this._values || this._inflateValues(t), t.updateState(this._values));
  }
}
u.Delay = ne;
function _t(s, t, e) {
  const r = {};
  for (const i in t) {
    const n = t[i], o = s?.[i];
    typeof o == "number" && typeof n == "number" && n >= 0 ? r[i] = e * (n - o) + o : r[i] = _t(o, n, e);
  }
  return r;
}
function pt(s, t) {
  for (const e in t) {
    const r = t[e], i = s?.[e];
    if (r >= 0) {
      if (r !== i)
        return !1;
    } else if (!pt(i, r))
      return !1;
  }
  return !0;
}
const oe = (s) => -Math.cos(s * Math.PI) / 2 + 0.5, gt = (s, t, e) => [new u(`character.${s}.strokes`, b({
  opacity: 1,
  displayPortion: 1
}, t.strokes.length), {
  duration: e,
  force: !0
})], B = (s, t, e) => [new u(`character.${s}`, {
  opacity: 1,
  strokes: b({
    opacity: 1,
    displayPortion: 1
  }, t.strokes.length)
}, {
  duration: e,
  force: !0
})], w = (s, t, e) => [new u(`character.${s}.opacity`, 0, {
  duration: e,
  force: !0
}), ...gt(s, t, 0)], rt = (s, t, e) => [new u(`options.${s}`, t, {
  duration: e
})], ft = (s, t, e) => {
  const r = s.strokeNum, i = (s.getLength() + 600) / (3 * e);
  return [new u("options.highlightColor", t), new u("character.highlight", {
    opacity: 1,
    strokes: {
      [r]: {
        displayPortion: 0,
        opacity: 0
      }
    }
  }), new u(`character.highlight.strokes.${r}`, {
    displayPortion: 1,
    opacity: 1
  }, {
    duration: i
  }), new u(`character.highlight.strokes.${r}.opacity`, 0, {
    duration: i,
    force: !0
  })];
}, kt = (s, t, e) => {
  const r = t.strokeNum, i = (t.getLength() + 600) / (3 * e);
  return [new u(`character.${s}`, {
    opacity: 1,
    strokes: {
      [r]: {
        displayPortion: 0,
        opacity: 1
      }
    }
  }), new u(`character.${s}.strokes.${r}.displayPortion`, 1, {
    duration: i
  })];
}, ae = (s, t, e, r) => {
  const i = (o) => {
    const a = o.character[s], h = {
      opacity: 1,
      strokes: {}
    };
    for (let l = 0; l < t.strokes.length; l++)
      h.strokes[l] = {
        opacity: a.opacity * a.strokes[l].opacity
      };
    return h;
  }, n = t.strokes[e];
  return [new u(`character.${s}`, i), ...kt(s, n, r)];
}, he = (s, t, e) => [new u(`character.${s}.strokes.${t}`, {
  displayPortion: 1,
  opacity: 1
}, {
  duration: e,
  force: !0
})], mt = (s, t, e, r, i) => {
  let n = w(s, t, e);
  return n = n.concat(gt(s, t, 0)), n.push(new u(`character.${s}`, {
    opacity: 1,
    strokes: b({
      opacity: 0
    }, t.strokes.length)
  }, {
    force: !0
  })), t.strokes.forEach((o, a) => {
    a > 0 && n.push(new u.Delay(i)), n = n.concat(kt(s, o, r));
  }), n;
}, le = (s, t, e, r, i, n) => {
  const o = mt(s, t, e, r, i);
  return o.push(new u.Delay(n)), o;
}, ce = (s, t, e) => [...w("main", s, t), new u("character.highlight", {
  opacity: 1,
  strokes: b({
    opacity: 0
  }, s.strokes.length)
}, {
  force: !0
}), new u("character.main", {
  opacity: 1,
  strokes: Ot(s.strokes.length, (r) => ({
    opacity: r < e ? 1 : 0
  }))
}, {
  force: !0
})], de = (s, t) => [new u("quiz.activeUserStrokeId", s, {
  force: !0
}), new u(`userStrokes.${s}`, {
  points: [t],
  opacity: 1
}, {
  force: !0
})], ue = (s, t) => [new u(`userStrokes.${s}.points`, t, {
  force: !0
})], it = (s, t) => [new u(`userStrokes.${s}.opacity`, 0, {
  duration: t
}), new u(`userStrokes.${s}`, null, {
  force: !0
})], _e = (s, t, e) => [new u("options.highlightColor", t), ...w("highlight", s), ...B("highlight", s, e / 2), ...w("highlight", s, e / 2)], pe = (s) => ({
  pathString: N(s.externalPoints),
  points: s.points.map((t) => W(t))
});
class ge {
  constructor(t, e, r) {
    this._currentStrokeIndex = 0, this._mistakesOnStroke = 0, this._totalMistakes = 0, this._character = t, this._renderState = e, this._isActive = !1, this._positioner = r;
  }
  startQuiz(t) {
    this._isActive = !0, this._options = t;
    const e = q(t.quizStartStrokeNum, this._character.strokes.length);
    return this._currentStrokeIndex = Math.min(e, this._character.strokes.length - 1), this._mistakesOnStroke = 0, this._totalMistakes = 0, this._renderState.run(ce(this._character, t.strokeFadeDuration, this._currentStrokeIndex));
  }
  startUserStroke(t) {
    if (!this._isActive)
      return null;
    if (this._userStroke)
      return this.endUserStroke();
    const e = this._positioner.convertExternalPoint(t), r = lt();
    return this._userStroke = new se(r, e, t), this._renderState.run(de(r, e));
  }
  continueUserStroke(t) {
    if (!this._userStroke)
      return Promise.resolve();
    const e = this._positioner.convertExternalPoint(t);
    this._userStroke.appendPoint(e, t);
    const r = this._userStroke.points.slice(0);
    return this._renderState.run(ue(this._userStroke.id, r));
  }
  setPositioner(t) {
    this._positioner = t;
  }
  endUserStroke() {
    var t;
    if (!this._userStroke)
      return;
    if (this._renderState.run(it(this._userStroke.id, (t = this._options.drawingFadeDuration) !== null && t !== void 0 ? t : 300)), this._userStroke.points.length === 1) {
      this._userStroke = void 0;
      return;
    }
    const {
      acceptBackwardsStrokes: e,
      markStrokeCorrectAfterMisses: r
    } = this._options, i = this._getCurrentStroke(), {
      isMatch: n,
      meta: o
    } = Gt(this._userStroke, this._character, this._currentStrokeIndex, {
      isOutlineVisible: this._renderState.state.character.outline.opacity > 0,
      leniency: this._options.leniency,
      averageDistanceThreshold: this._options.averageDistanceThreshold
    }), a = r && this._mistakesOnStroke + 1 >= r;
    if (n || a || o.isStrokeBackwards && e)
      this._handleSuccess(o);
    else {
      this._handleFailure(o);
      const {
        showHintAfterMisses: l,
        highlightColor: d,
        strokeHighlightSpeed: c
      } = this._options;
      l !== !1 && this._mistakesOnStroke >= l && this._renderState.run(ft(i, k(d), c));
    }
    this._userStroke = void 0;
  }
  cancel() {
    this._isActive = !1, this._userStroke && this._renderState.run(it(this._userStroke.id, this._options.drawingFadeDuration));
  }
  _getStrokeData({
    isCorrect: t,
    meta: e
  }) {
    return {
      character: this._character.symbol,
      strokeNum: this._currentStrokeIndex,
      mistakesOnStroke: this._mistakesOnStroke,
      totalMistakes: this._totalMistakes,
      strokesRemaining: this._character.strokes.length - this._currentStrokeIndex - (t ? 1 : 0),
      drawnPath: pe(this._userStroke),
      isBackwards: e.isStrokeBackwards
    };
  }
  _handleSuccess(t) {
    if (!this._options)
      return;
    const {
      strokes: e,
      symbol: r
    } = this._character, {
      onCorrectStroke: i,
      onComplete: n,
      highlightOnComplete: o,
      strokeFadeDuration: a,
      highlightCompleteColor: h,
      highlightColor: l,
      strokeHighlightDuration: d
    } = this._options;
    i?.({
      ...this._getStrokeData({
        isCorrect: !0,
        meta: t
      })
    });
    let c = he("main", this._currentStrokeIndex, a);
    this._mistakesOnStroke = 0, this._currentStrokeIndex += 1, this._currentStrokeIndex === e.length && (this._isActive = !1, n?.({
      character: r,
      totalMistakes: this._totalMistakes
    }), o && (c = c.concat(_e(this._character, k(h || l), (d || 0) * 2)))), this._renderState.run(c);
  }
  _handleFailure(t) {
    var e, r;
    this._mistakesOnStroke += 1, this._totalMistakes += 1, (e = (r = this._options).onMistake) === null || e === void 0 || e.call(r, this._getStrokeData({
      isCorrect: !1,
      meta: t
    }));
  }
  _getCurrentStroke() {
    return this._character.strokes[this._currentStrokeIndex];
  }
}
function S(s) {
  return document.createElementNS("http://www.w3.org/2000/svg", s);
}
function m(s, t, e) {
  s.setAttributeNS(null, t, e);
}
function x(s, t) {
  Object.keys(t).forEach((e) => m(s, e, t[e]));
}
function fe(s) {
  let t = "";
  return window.location && window.location.href && (t = window.location.href.replace(/#[^#]*$/, "").replace(/"/gi, "%22")), `url("${t}#${s}")`;
}
function vt(s) {
  var t;
  s == null || (t = s.parentNode) === null || t === void 0 || t.removeChild(s);
}
class y {
  constructor(t) {
    this.stroke = t, this._pathLength = t.getLength() + y.STROKE_WIDTH / 2;
  }
  _getStrokeDashoffset(t) {
    return this._pathLength * 0.999 * (1 - t);
  }
  _getColor({
    strokeColor: t,
    radicalColor: e
  }) {
    return e && this.stroke.isInRadical ? e : t;
  }
}
y.STROKE_WIDTH = 200;
const st = 200;
class ke extends y {
  constructor(t) {
    super(t), this._oldProps = void 0;
  }
  mount(t) {
    this._animationPath = S("path"), this._clip = S("clipPath"), this._strokePath = S("path");
    const e = `mask-${lt()}`;
    m(this._clip, "id", e), m(this._strokePath, "d", this.stroke.path), this._animationPath.style.opacity = "0", m(this._animationPath, "clip-path", fe(e));
    const r = dt(this.stroke.points, st / 2);
    return m(this._animationPath, "d", N(r)), x(this._animationPath, {
      stroke: "#FFFFFF",
      "stroke-width": st.toString(),
      fill: "none",
      "stroke-linecap": "round",
      "stroke-linejoin": "miter",
      "stroke-dasharray": `${this._pathLength},${this._pathLength}`
    }), this._clip.appendChild(this._strokePath), t.defs.appendChild(this._clip), t.svg.appendChild(this._animationPath), this;
  }
  render(t) {
    var e, r;
    if (t === this._oldProps || !this._animationPath)
      return;
    t.displayPortion !== ((e = this._oldProps) === null || e === void 0 ? void 0 : e.displayPortion) && (this._animationPath.style.strokeDashoffset = this._getStrokeDashoffset(t.displayPortion).toString());
    const i = this._getColor(t);
    if (!this._oldProps || i !== this._getColor(this._oldProps)) {
      const {
        r: n,
        g: o,
        b: a,
        a: h
      } = i;
      x(this._animationPath, {
        stroke: `rgba(${n},${o},${a},${h})`
      });
    }
    t.opacity !== ((r = this._oldProps) === null || r === void 0 ? void 0 : r.opacity) && (this._animationPath.style.opacity = t.opacity.toString()), this._oldProps = t;
  }
}
class H {
  constructor(t) {
    this._oldProps = void 0, this._strokeRenderers = t.strokes.map((e) => new ke(e));
  }
  mount(t) {
    const e = t.createSubRenderTarget();
    this._group = e.svg, this._strokeRenderers.forEach((r) => {
      r.mount(e);
    });
  }
  render(t) {
    var e, r;
    if (t === this._oldProps || !this._group)
      return;
    const {
      opacity: i,
      strokes: n,
      strokeColor: o,
      radicalColor: a = null
    } = t;
    if (i !== ((e = this._oldProps) === null || e === void 0 ? void 0 : e.opacity) && (this._group.style.opacity = i.toString(), !bt)) {
      var h;
      i === 0 ? this._group.style.display = "none" : ((h = this._oldProps) === null || h === void 0 ? void 0 : h.opacity) === 0 && this._group.style.removeProperty("display");
    }
    const l = !this._oldProps || o !== this._oldProps.strokeColor || a !== this._oldProps.radicalColor;
    if (l || n !== ((r = this._oldProps) === null || r === void 0 ? void 0 : r.strokes))
      for (let c = 0; c < this._strokeRenderers.length; c++) {
        var d;
        !l && (d = this._oldProps) !== null && d !== void 0 && d.strokes && n[c] === this._oldProps.strokes[c] || this._strokeRenderers[c].render({
          strokeColor: o,
          radicalColor: a,
          opacity: n[c].opacity,
          displayPortion: n[c].displayPortion
        });
      }
    this._oldProps = t;
  }
}
class me {
  constructor() {
    this._oldProps = void 0;
  }
  mount(t) {
    this._path = S("path"), t.svg.appendChild(this._path);
  }
  render(t) {
    var e, r, i, n;
    if (!(!this._path || t === this._oldProps)) {
      if (t.strokeColor !== ((e = this._oldProps) === null || e === void 0 ? void 0 : e.strokeColor) || t.strokeWidth !== ((r = this._oldProps) === null || r === void 0 ? void 0 : r.strokeWidth)) {
        const {
          r: o,
          g: a,
          b: h,
          a: l
        } = t.strokeColor;
        x(this._path, {
          fill: "none",
          stroke: `rgba(${o},${a},${h},${l})`,
          "stroke-width": t.strokeWidth.toString(),
          "stroke-linecap": "round",
          "stroke-linejoin": "round"
        });
      }
      t.opacity !== ((i = this._oldProps) === null || i === void 0 ? void 0 : i.opacity) && m(this._path, "opacity", t.opacity.toString()), t.points !== ((n = this._oldProps) === null || n === void 0 ? void 0 : n.points) && m(this._path, "d", N(t.points)), this._oldProps = t;
    }
  }
  destroy() {
    vt(this._path);
  }
}
class ve {
  constructor(t, e) {
    this._character = t, this._positioner = e, this._mainCharRenderer = new H(t), this._outlineCharRenderer = new H(t), this._highlightCharRenderer = new H(t), this._userStrokeRenderers = {};
  }
  mount(t) {
    const e = t.createSubRenderTarget(), r = e.svg, {
      xOffset: i,
      yOffset: n,
      height: o,
      scale: a
    } = this._positioner;
    m(r, "transform", `translate(${i}, ${o - n}) scale(${a}, ${-1 * a})`), this._outlineCharRenderer.mount(e), this._mainCharRenderer.mount(e), this._highlightCharRenderer.mount(e), this._positionedTarget = e;
  }
  render(t) {
    const {
      main: e,
      outline: r,
      highlight: i
    } = t.character, {
      outlineColor: n,
      radicalColor: o,
      highlightColor: a,
      strokeColor: h,
      drawingWidth: l,
      drawingColor: d
    } = t.options;
    this._outlineCharRenderer.render({
      opacity: r.opacity,
      strokes: r.strokes,
      strokeColor: n
    }), this._mainCharRenderer.render({
      opacity: e.opacity,
      strokes: e.strokes,
      strokeColor: h,
      radicalColor: o
    }), this._highlightCharRenderer.render({
      opacity: i.opacity,
      strokes: i.strokes,
      strokeColor: a
    });
    const c = t.userStrokes || {};
    for (const _ in this._userStrokeRenderers)
      if (!c[_]) {
        var p;
        (p = this._userStrokeRenderers[_]) === null || p === void 0 || p.destroy(), delete this._userStrokeRenderers[_];
      }
    for (const _ in c) {
      const f = c[_];
      if (!f)
        continue;
      const D = {
        strokeWidth: l,
        strokeColor: d,
        ...f
      };
      (() => {
        if (this._userStrokeRenderers[_])
          return this._userStrokeRenderers[_];
        const L = new me();
        return L.mount(this._positionedTarget), this._userStrokeRenderers[_] = L, L;
      })().render(D);
    }
  }
  destroy() {
    vt(this._positionedTarget.svg), this._positionedTarget.defs.innerHTML = "";
  }
}
class St {
  constructor(t) {
    this.node = t;
  }
  addPointerStartListener(t) {
    this.node.addEventListener("mousedown", (e) => {
      t(this._eventify(e, this._getMousePoint));
    }), this.node.addEventListener("touchstart", (e) => {
      t(this._eventify(e, this._getTouchPoint));
    });
  }
  addPointerMoveListener(t) {
    this.node.addEventListener("mousemove", (e) => {
      t(this._eventify(e, this._getMousePoint));
    }), this.node.addEventListener("touchmove", (e) => {
      t(this._eventify(e, this._getTouchPoint));
    });
  }
  addPointerEndListener(t) {
    document.addEventListener("mouseup", t), document.addEventListener("touchend", t);
  }
  getBoundingClientRect() {
    return this.node.getBoundingClientRect();
  }
  updateDimensions(t, e) {
    this.node.setAttribute("width", `${t}`), this.node.setAttribute("height", `${e}`);
  }
  _eventify(t, e) {
    return {
      getPoint: () => e.call(this, t),
      preventDefault: () => t.preventDefault()
    };
  }
  _getMousePoint(t) {
    const {
      left: e,
      top: r
    } = this.getBoundingClientRect(), i = t.clientX - e, n = t.clientY - r;
    return {
      x: i,
      y: n
    };
  }
  _getTouchPoint(t) {
    const {
      left: e,
      top: r
    } = this.getBoundingClientRect(), i = t.touches[0].clientX - e, n = t.touches[0].clientY - r;
    return {
      x: i,
      y: n
    };
  }
}
class O extends St {
  constructor(t, e) {
    super(t), this.svg = t, this.defs = e, "createSVGPoint" in t && (this._pt = t.createSVGPoint());
  }
  static init(t, e = "100%", r = "100%") {
    const i = (() => typeof t == "string" ? document.getElementById(t) : t)();
    if (!i)
      throw new Error(`HanziWriter target element not found: ${t}`);
    const n = i.nodeName.toUpperCase(), o = (() => {
      if (n === "SVG" || n === "G")
        return i;
      {
        const h = S("svg");
        return i.appendChild(h), h;
      }
    })();
    x(o, {
      width: e,
      height: r
    });
    const a = S("defs");
    return o.appendChild(a), new O(o, a);
  }
  createSubRenderTarget() {
    const t = S("g");
    return this.svg.appendChild(t), new O(t, this.defs);
  }
  _getMousePoint(t) {
    if (this._pt && (this._pt.x = t.clientX, this._pt.y = t.clientY, "getScreenCTM" in this.node)) {
      var e;
      const r = this._pt.matrixTransform((e = this.node.getScreenCTM()) === null || e === void 0 ? void 0 : e.inverse());
      return {
        x: r.x,
        y: r.y
      };
    }
    return super._getMousePoint.call(this, t);
  }
  _getTouchPoint(t) {
    if (this._pt && (this._pt.x = t.touches[0].clientX, this._pt.y = t.touches[0].clientY, "getScreenCTM" in this.node)) {
      var e;
      const r = this._pt.matrixTransform((e = this.node.getScreenCTM()) === null || e === void 0 ? void 0 : e.inverse());
      return {
        x: r.x,
        y: r.y
      };
    }
    return super._getTouchPoint(t);
  }
}
var Se = {
  HanziWriterRenderer: ve,
  createRenderTarget: O.init
};
const yt = (s, t) => {
  s.beginPath();
  const e = t[0], r = t.slice(1);
  s.moveTo(e.x, e.y);
  for (const i of r)
    s.lineTo(i.x, i.y);
  s.stroke();
}, ye = (s) => {
  const t = s.split(/(^|\s+)(?=[A-Z])/).filter((r) => r !== " "), e = [(r) => r.beginPath()];
  for (const r of t) {
    const [i, ...n] = r.split(/\s+/), o = n.map((a) => parseFloat(a));
    i === "M" ? e.push((a) => a.moveTo(...o)) : i === "L" ? e.push((a) => a.lineTo(...o)) : i === "C" ? e.push((a) => a.bezierCurveTo(...o)) : i === "Q" && e.push((a) => a.quadraticCurveTo(...o));
  }
  return (r) => e.forEach((i) => i(r));
};
class Ce extends y {
  constructor(t, e = !0) {
    super(t), e && Path2D ? this._path2D = new Path2D(this.stroke.path) : this._pathCmd = ye(this.stroke.path), this._extendedMaskPoints = dt(this.stroke.points, y.STROKE_WIDTH / 2);
  }
  render(t, e) {
    if (e.opacity < 0.05)
      return;
    if (t.save(), this._path2D)
      t.clip(this._path2D);
    else {
      var r;
      (r = this._pathCmd) === null || r === void 0 || r.call(this, t), t.globalAlpha = 0, t.stroke(), t.clip();
    }
    const {
      r: i,
      g: n,
      b: o,
      a
    } = this._getColor(e), h = a === 1 ? `rgb(${i},${n},${o})` : `rgb(${i},${n},${o},${a})`, l = this._getStrokeDashoffset(e.displayPortion);
    t.globalAlpha = e.opacity, t.strokeStyle = h, t.fillStyle = h, t.lineWidth = y.STROKE_WIDTH, t.lineCap = "round", t.lineJoin = "round", t.setLineDash([this._pathLength, this._pathLength], l), t.lineDashOffset = l, yt(t, this._extendedMaskPoints), t.restore();
  }
}
class I {
  constructor(t) {
    this._strokeRenderers = t.strokes.map((e) => new Ce(e));
  }
  render(t, e) {
    if (e.opacity < 0.05)
      return;
    const {
      opacity: r,
      strokeColor: i,
      radicalColor: n,
      strokes: o
    } = e;
    for (let a = 0; a < this._strokeRenderers.length; a++)
      this._strokeRenderers[a].render(t, {
        strokeColor: i,
        radicalColor: n,
        opacity: o[a].opacity * r,
        displayPortion: o[a].displayPortion || 0
      });
  }
}
function we(s, t) {
  if (t.opacity < 0.05)
    return;
  const {
    opacity: e,
    strokeWidth: r,
    strokeColor: i,
    points: n
  } = t, {
    r: o,
    g: a,
    b: h,
    a: l
  } = i;
  s.save(), s.globalAlpha = e, s.lineWidth = r, s.strokeStyle = `rgba(${o},${a},${h},${l})`, s.lineCap = "round", s.lineJoin = "round", yt(s, n), s.restore();
}
class Pe {
  constructor(t, e) {
    this.destroy = ct, this._character = t, this._positioner = e, this._mainCharRenderer = new I(t), this._outlineCharRenderer = new I(t), this._highlightCharRenderer = new I(t);
  }
  mount(t) {
    this._target = t;
  }
  _animationFrame(t) {
    const {
      width: e,
      height: r,
      scale: i,
      xOffset: n,
      yOffset: o
    } = this._positioner, a = this._target.getContext();
    a.clearRect(0, 0, e, r), a.save(), a.translate(n, r - o), a.transform(1, 0, 0, -1, 0, 0), a.scale(i, i), t(a), a.restore(), a.draw && a.draw();
  }
  render(t) {
    const {
      outline: e,
      main: r,
      highlight: i
    } = t.character, {
      outlineColor: n,
      strokeColor: o,
      radicalColor: a,
      highlightColor: h,
      drawingColor: l,
      drawingWidth: d
    } = t.options;
    this._animationFrame((c) => {
      this._outlineCharRenderer.render(c, {
        opacity: e.opacity,
        strokes: e.strokes,
        strokeColor: n
      }), this._mainCharRenderer.render(c, {
        opacity: r.opacity,
        strokes: r.strokes,
        strokeColor: o,
        radicalColor: a
      }), this._highlightCharRenderer.render(c, {
        opacity: i.opacity,
        strokes: i.strokes,
        strokeColor: h
      });
      const p = t.userStrokes || {};
      for (const _ in p) {
        const f = p[_];
        if (f) {
          const D = {
            strokeWidth: d,
            strokeColor: l,
            ...f
          };
          we(c, D);
        }
      }
    });
  }
}
class j extends St {
  constructor(t) {
    super(t);
  }
  static init(t, e = "100%", r = "100%") {
    const i = (() => typeof t == "string" ? document.getElementById(t) : t)();
    if (!i)
      throw new Error(`HanziWriter target element not found: ${t}`);
    const n = i.nodeName.toUpperCase(), o = (() => {
      if (n === "CANVAS")
        return i;
      const a = document.createElement("canvas");
      return i.appendChild(a), a;
    })();
    return o.setAttribute("width", e), o.setAttribute("height", r), new j(o);
  }
  getContext() {
    return this.node.getContext("2d");
  }
}
var De = {
  HanziWriterRenderer: Pe,
  createRenderTarget: j.init
};
const Me = "2.0", Re = (s) => `https://cdn.jsdelivr.net/npm/hanzi-writer-data@${Me}/${s}.json`, Te = (s, t, e) => {
  const r = new XMLHttpRequest();
  r.overrideMimeType && r.overrideMimeType("application/json"), r.open("GET", Re(s), !0), r.onerror = (i) => {
    e(r, i);
  }, r.onreadystatechange = () => {
    r.readyState === 4 && (r.status === 200 ? t(JSON.parse(r.responseText)) : r.status !== 0 && e && e(r));
  }, r.send(null);
}, nt = {
  charDataLoader: Te,
  onLoadCharDataError: null,
  onLoadCharDataSuccess: null,
  showOutline: !0,
  showCharacter: !0,
  renderer: "svg",
  // positioning options
  width: 0,
  height: 0,
  padding: 20,
  // animation options
  strokeAnimationSpeed: 1,
  strokeFadeDuration: 400,
  strokeHighlightDuration: 200,
  strokeHighlightSpeed: 2,
  delayBetweenStrokes: 1e3,
  delayBetweenLoops: 2e3,
  // colors
  strokeColor: "#555",
  radicalColor: null,
  highlightColor: "#AAF",
  outlineColor: "#DDD",
  drawingColor: "#333",
  // quiz options
  leniency: 1,
  showHintAfterMisses: 3,
  highlightOnComplete: !0,
  highlightCompleteColor: null,
  markStrokeCorrectAfterMisses: !1,
  acceptBackwardsStrokes: !1,
  quizStartStrokeNum: 0,
  averageDistanceThreshold: 350,
  // undocumented obscure options
  drawingFadeDuration: 300,
  drawingWidth: 4,
  strokeWidth: 2,
  outlineWidth: 2,
  rendererOverride: {}
};
class ot {
  constructor(t) {
    this._loadCounter = 0, this._isLoading = !1, this.loadingFailed = !1, this._options = t;
  }
  _debouncedLoad(t, e) {
    const r = (o) => {
      if (e === this._loadCounter) {
        var a;
        (a = this._resolve) === null || a === void 0 || a.call(this, o);
      }
    }, i = (o) => {
      if (e === this._loadCounter) {
        var a;
        (a = this._reject) === null || a === void 0 || a.call(this, o);
      }
    }, n = this._options.charDataLoader(t, r, i);
    n && ("then" in n ? n.then(r).catch(i) : r(n));
  }
  _setupLoadingPromise() {
    return new Promise((t, e) => {
      this._resolve = t, this._reject = e;
    }).then((t) => {
      var e, r;
      return this._isLoading = !1, (e = (r = this._options).onLoadCharDataSuccess) === null || e === void 0 || e.call(r, t), t;
    }).catch((t) => {
      if (this._isLoading = !1, this.loadingFailed = !0, this._options.onLoadCharDataError) {
        this._options.onLoadCharDataError(t);
        return;
      }
      if (t instanceof Error)
        throw t;
      const e = new Error(`Failed to load char data for ${this._loadingChar}`);
      throw e.reason = t, e;
    });
  }
  loadCharData(t) {
    this._loadingChar = t;
    const e = this._setupLoadingPromise();
    return this.loadingFailed = !1, this._isLoading = !0, this._loadCounter++, this._debouncedLoad(t, this._loadCounter), e;
  }
}
class v {
  constructor(t, e = {}) {
    const {
      HanziWriterRenderer: r,
      createRenderTarget: i
    } = e.renderer === "canvas" ? De : Se, n = e.rendererOverride || {};
    this._renderer = {
      HanziWriterRenderer: n.HanziWriterRenderer || r,
      createRenderTarget: n.createRenderTarget || i
    }, this.target = this._renderer.createRenderTarget(t, e.width, e.height), this._options = this._assignOptions(e), this._loadingManager = new ot(this._options), this._setupListeners();
  }
  /** Main entry point */
  static create(t, e, r) {
    const i = new v(t, r);
    return i.setCharacter(e), i;
  }
  static loadCharacterData(t, e = {}) {
    const r = (() => {
      const {
        _loadingManager: i,
        _loadingOptions: n
      } = v;
      return i?._loadingChar === t && n === e ? i : new ot({
        ...nt,
        ...e
      });
    })();
    return v._loadingManager = r, v._loadingOptions = e, r.loadCharData(t);
  }
  static getScalingTransform(t, e, r = 0) {
    const i = new tt({
      width: t,
      height: e,
      padding: r
    });
    return {
      x: i.xOffset,
      y: i.yOffset,
      scale: i.scale,
      transform: xt(`
        translate(${i.xOffset}, ${i.height - i.yOffset})
        scale(${i.scale}, ${-1 * i.scale})
      `).replace(/\s+/g, " ")
    };
  }
  showCharacter(t = {}) {
    return this._options.showCharacter = !0, this._withData(() => {
      var e;
      return (e = this._renderState) === null || e === void 0 ? void 0 : e.run(B("main", this._character, typeof t.duration == "number" ? t.duration : this._options.strokeFadeDuration)).then((r) => {
        var i;
        return (i = t.onComplete) === null || i === void 0 || i.call(t, r), r;
      });
    });
  }
  hideCharacter(t = {}) {
    return this._options.showCharacter = !1, this._withData(() => {
      var e;
      return (e = this._renderState) === null || e === void 0 ? void 0 : e.run(w("main", this._character, typeof t.duration == "number" ? t.duration : this._options.strokeFadeDuration)).then((r) => {
        var i;
        return (i = t.onComplete) === null || i === void 0 || i.call(t, r), r;
      });
    });
  }
  animateCharacter(t = {}) {
    return this.cancelQuiz(), this._withData(() => {
      var e;
      return (e = this._renderState) === null || e === void 0 ? void 0 : e.run(mt("main", this._character, this._options.strokeFadeDuration, this._options.strokeAnimationSpeed, this._options.delayBetweenStrokes)).then((r) => {
        var i;
        return (i = t.onComplete) === null || i === void 0 || i.call(t, r), r;
      });
    });
  }
  animateStroke(t, e = {}) {
    return this.cancelQuiz(), this._withData(() => {
      var r;
      return (r = this._renderState) === null || r === void 0 ? void 0 : r.run(ae("main", this._character, q(t, this._character.strokes.length), this._options.strokeAnimationSpeed)).then((i) => {
        var n;
        return (n = e.onComplete) === null || n === void 0 || n.call(e, i), i;
      });
    });
  }
  highlightStroke(t, e = {}) {
    const r = () => {
      if (!(!this._character || !this._renderState))
        return this._renderState.run(ft($t(this._character.strokes, t), k(this._options.highlightColor), this._options.strokeHighlightSpeed)).then((i) => {
          var n;
          return (n = e.onComplete) === null || n === void 0 || n.call(e, i), i;
        });
    };
    return this._withData(r);
  }
  async loopCharacterAnimation() {
    return this.cancelQuiz(), this._withData(() => this._renderState.run(le("main", this._character, this._options.strokeFadeDuration, this._options.strokeAnimationSpeed, this._options.delayBetweenStrokes, this._options.delayBetweenLoops), {
      loop: !0
    }));
  }
  pauseAnimation() {
    return this._withData(() => {
      var t;
      return (t = this._renderState) === null || t === void 0 ? void 0 : t.pauseAll();
    });
  }
  resumeAnimation() {
    return this._withData(() => {
      var t;
      return (t = this._renderState) === null || t === void 0 ? void 0 : t.resumeAll();
    });
  }
  showOutline(t = {}) {
    return this._options.showOutline = !0, this._withData(() => {
      var e;
      return (e = this._renderState) === null || e === void 0 ? void 0 : e.run(B("outline", this._character, typeof t.duration == "number" ? t.duration : this._options.strokeFadeDuration)).then((r) => {
        var i;
        return (i = t.onComplete) === null || i === void 0 || i.call(t, r), r;
      });
    });
  }
  hideOutline(t = {}) {
    return this._options.showOutline = !1, this._withData(() => {
      var e;
      return (e = this._renderState) === null || e === void 0 ? void 0 : e.run(w("outline", this._character, typeof t.duration == "number" ? t.duration : this._options.strokeFadeDuration)).then((r) => {
        var i;
        return (i = t.onComplete) === null || i === void 0 || i.call(t, r), r;
      });
    });
  }
  /** Updates the size of the writer instance without resetting render state */
  updateDimensions({
    width: t,
    height: e,
    padding: r
  }) {
    if (t !== void 0 && (this._options.width = t), e !== void 0 && (this._options.height = e), r !== void 0 && (this._options.padding = r), this.target.updateDimensions(this._options.width, this._options.height), this._character && this._renderState && this._hanziWriterRenderer && this._positioner) {
      this._hanziWriterRenderer.destroy();
      const i = this._initAndMountHanziWriterRenderer(this._character);
      this._renderState.overwriteOnStateChange((n) => i.render(n)), i.render(this._renderState.state), this._quiz && this._quiz.setPositioner(this._positioner);
    }
  }
  updateColor(t, e, r = {}) {
    var i;
    let n = [];
    const o = (() => t === "radicalColor" && !e ? this._options.strokeColor : e)(), a = k(o);
    this._options[t] = e;
    const h = (i = r.duration) !== null && i !== void 0 ? i : this._options.strokeFadeDuration;
    return n = n.concat(rt(t, a, h)), t === "radicalColor" && !e && (n = n.concat(rt(t, null, 0))), this._withData(() => {
      var l;
      return (l = this._renderState) === null || l === void 0 ? void 0 : l.run(n).then((d) => {
        var c;
        return (c = r.onComplete) === null || c === void 0 || c.call(r, d), d;
      });
    });
  }
  quiz(t = {}) {
    return this._withData(async () => {
      this._character && this._renderState && this._positioner && (this.cancelQuiz(), this._quiz = new ge(this._character, this._renderState, this._positioner), this._options = {
        ...this._options,
        ...t
      }, this._quiz.startQuiz(this._options));
    });
  }
  cancelQuiz() {
    this._quiz && (this._quiz.cancel(), this._quiz = void 0);
  }
  setCharacter(t) {
    return this.cancelQuiz(), this._char = t, this._hanziWriterRenderer && this._hanziWriterRenderer.destroy(), this._renderState && this._renderState.cancelAll(), this._hanziWriterRenderer = null, this._withDataPromise = this._loadingManager.loadCharData(t).then((e) => {
      if (!e || this._loadingManager.loadingFailed)
        return;
      this._character = Nt(t, e), this._renderState = new Lt(this._character, this._options, (i) => r.render(i));
      const r = this._initAndMountHanziWriterRenderer(this._character);
      r.render(this._renderState.state);
    }), this._withDataPromise;
  }
  _initAndMountHanziWriterRenderer(t) {
    const {
      width: e,
      height: r,
      padding: i
    } = this._options;
    this._positioner = new tt({
      width: e,
      height: r,
      padding: i
    });
    const n = new this._renderer.HanziWriterRenderer(t, this._positioner);
    return n.mount(this.target), this._hanziWriterRenderer = n, n;
  }
  async getCharacterData() {
    if (!this._char)
      throw new Error("setCharacter() must be called before calling getCharacterData()");
    return await this._withData(() => this._character);
  }
  _assignOptions(t) {
    const e = {
      ...nt,
      ...t
    };
    return t.strokeAnimationDuration && !t.strokeAnimationSpeed && (e.strokeAnimationSpeed = 500 / t.strokeAnimationDuration), t.strokeHighlightDuration && !t.strokeHighlightSpeed && (e.strokeHighlightSpeed = 500 / e.strokeHighlightDuration), t.highlightCompleteColor || (e.highlightCompleteColor = e.highlightColor), this._fillWidthAndHeight(e);
  }
  /** returns a new options object with width and height filled in if missing */
  _fillWidthAndHeight(t) {
    const e = {
      ...t
    };
    if (e.width && !e.height)
      e.height = e.width;
    else if (e.height && !e.width)
      e.width = e.height;
    else if (!e.width && !e.height) {
      const {
        width: r,
        height: i
      } = this.target.getBoundingClientRect(), n = Math.min(r, i);
      e.width = n, e.height = n;
    }
    return e;
  }
  _withData(t) {
    if (this._loadingManager.loadingFailed)
      throw Error("Failed to load character data. Call setCharacter and try again.");
    return this._withDataPromise ? this._withDataPromise.then(() => {
      if (!this._loadingManager.loadingFailed)
        return t();
    }) : Promise.resolve().then(t);
  }
  _setupListeners() {
    this.target.addPointerStartListener((t) => {
      this._quiz && (t.preventDefault(), this._quiz.startUserStroke(t.getPoint()));
    }), this.target.addPointerMoveListener((t) => {
      this._quiz && (t.preventDefault(), this._quiz.continueUserStroke(t.getPoint()));
    }), this.target.addPointerEndListener(() => {
      var t;
      (t = this._quiz) === null || t === void 0 || t.endUserStroke();
    });
  }
}
v._loadingManager = null;
v._loadingOptions = null;
const xe = /* @__PURE__ */ Ct({
  __name: "Writer",
  props: {
    showOutline: { type: Boolean, default: !0 },
    showCharacter: { type: Boolean, default: !0 },
    width: { default: 100 },
    height: { default: 100 },
    padding: { default: 20 },
    strokeAnimationSpeed: { default: 1 },
    strokeHighlightSpeed: { default: 2 },
    strokeFadeDuration: { default: 400 },
    delayBetweenStrokes: { default: 1e3 },
    delayBetweenLoops: { default: 2e3 },
    strokeColor: { default: "#555" },
    radicalColor: {},
    highlightColor: { default: "#AAF" },
    outlineColor: { default: "#DDD" },
    drawingColor: { default: "#333" },
    drawingWidth: { default: 4 },
    showHintAfterMisses: { type: [Number, Boolean], default: 3 },
    markStrokeCorrectAfterMisses: { type: [Number, Boolean], default: !1 },
    quizStartStrokeNum: { default: 0 },
    acceptBackwardsStrokes: { type: Boolean, default: !1 },
    highlightOnComplete: { type: Boolean, default: !0 },
    highlightCompleteColor: {},
    backgroundRef: {},
    onLoadCharDataSuccess: { type: Function, default: (s) => {
    } },
    onLoadCharDataError: { type: Function, default: (s) => {
    } },
    renderer: { default: "svg" }
  },
  emits: ["initialized"],
  setup(s, { emit: t }) {
    const e = s, r = t;
    let i = null;
    const n = wt();
    return Pt(async () => {
      await Dt();
      const o = e.backgroundRef || n.value;
      o && (i = v.create(o, "英", {
        ...e
      }), r("initialized", i));
    }), (o, a) => (Q(), X(Mt, null, [
      o.$slots.background ? Rt("", !0) : (Q(), X("div", {
        key: 0,
        ref_key: "hanziElm",
        ref: n
      }, null, 512)),
      Tt(o.$slots, "background")
    ], 64));
  }
});
export {
  v as HanziWriter,
  xe as Writer
};
