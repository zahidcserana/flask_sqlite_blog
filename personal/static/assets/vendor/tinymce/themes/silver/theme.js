/**
 * TinyMCE version 6.2.0 (2022-09-08)
 */

(function () {
    'use strict';

    const getPrototypeOf$1 = Object.getPrototypeOf;
    const hasProto = (v, constructor, predicate) => {
      var _a;
      if (predicate(v, constructor.prototype)) {
        return true;
      } else {
        return ((_a = v.constructor) === null || _a === void 0 ? void 0 : _a.name) === constructor.name;
      }
    };
    const typeOf = x => {
      const t = typeof x;
      if (x === null) {
        return 'null';
      } else if (t === 'object' && Array.isArray(x)) {
        return 'array';
      } else if (t === 'object' && hasProto(x, String, (o, proto) => proto.isPrototypeOf(o))) {
        return 'string';
      } else {
        return t;
      }
    };
    const isType$1 = type => value => typeOf(value) === type;
    const isSimpleType = type => value => typeof value === type;
    const eq$1 = t => a => t === a;
    const is$2 = (value, constructor) => isObject(value) && hasProto(value, constructor, (o, proto) => getPrototypeOf$1(o) === proto);
    const isString = isType$1('string');
    const isObject = isType$1('object');
    const isPlainObject = value => is$2(value, Object);
    const isArray = isType$1('array');
    const isNull = eq$1(null);
    const isBoolean = isSimpleType('boolean');
    const isUndefined = eq$1(undefined);
    const isNullable = a => a === null || a === undefined;
    const isNonNullable = a => !isNullable(a);
    const isFunction = isSimpleType('function');
    const isNumber = isSimpleType('number');
    const isArrayOf = (value, pred) => {
      if (isArray(value)) {
        for (let i = 0, len = value.length; i < len; ++i) {
          if (!pred(value[i])) {
            return false;
          }
        }
        return true;
      }
      return false;
    };

    const noop = () => {
    };
    const noarg = f => () => f();
    const compose = (fa, fb) => {
      return (...args) => {
        return fa(fb.apply(null, args));
      };
    };
    const compose1 = (fbc, fab) => a => fbc(fab(a));
    const constant$1 = value => {
      return () => {
        return value;
      };
    };
    const identity = x => {
      return x;
    };
    const tripleEquals = (a, b) => {
      return a === b;
    };
    function curry(fn, ...initialArgs) {
      return (...restArgs) => {
        const all = initialArgs.concat(restArgs);
        return fn.apply(null, all);
      };
    }
    const not = f => t => !f(t);
    const die = msg => {
      return () => {
        throw new Error(msg);
      };
    };
    const apply = f => {
      return f();
    };
    const never = constant$1(false);
    const always = constant$1(true);

    var global$a = tinymce.util.Tools.resolve('tinymce.ThemeManager');

    class Optional {
      constructor(tag, value) {
        this.tag = tag;
        this.value = value;
      }
      static some(value) {
        return new Optional(true, value);
      }
      static none() {
        return Optional.singletonNone;
      }
      fold(onNone, onSome) {
        if (this.tag) {
          return onSome(this.value);
        } else {
          return onNone();
        }
      }
      isSome() {
        return this.tag;
      }
      isNone() {
        return !this.tag;
      }
      map(mapper) {
        if (this.tag) {
          return Optional.some(mapper(this.value));
        } else {
          return Optional.none();
        }
      }
      bind(binder) {
        if (this.tag) {
          return binder(this.value);
        } else {
          return Optional.none();
        }
      }
      exists(predicate) {
        return this.tag && predicate(this.value);
      }
      forall(predicate) {
        return !this.tag || predicate(this.value);
      }
      filter(predicate) {
        if (!this.tag || predicate(this.value)) {
          return this;
        } else {
          return Optional.none();
        }
      }
      getOr(replacement) {
        return this.tag ? this.value : replacement;
      }
      or(replacement) {
        return this.tag ? this : replacement;
      }
      getOrThunk(thunk) {
        return this.tag ? this.value : thunk();
      }
      orThunk(thunk) {
        return this.tag ? this : thunk();
      }
      getOrDie(message) {
        if (!this.tag) {
          throw new Error(message !== null && message !== void 0 ? message : 'Called getOrDie on None');
        } else {
          return this.value;
        }
      }
      static from(value) {
        return isNonNullable(value) ? Optional.some(value) : Optional.none();
      }
      getOrNull() {
        return this.tag ? this.value : null;
      }
      getOrUndefined() {
        return this.value;
      }
      each(worker) {
        if (this.tag) {
          worker(this.value);
        }
      }
      toArray() {
        return this.tag ? [this.value] : [];
      }
      toString() {
        return this.tag ? `some(${ this.value })` : 'none()';
      }
    }
    Optional.singletonNone = new Optional(false);

    const nativeSlice = Array.prototype.slice;
    const nativeIndexOf = Array.prototype.indexOf;
    const nativePush = Array.prototype.push;
    const rawIndexOf = (ts, t) => nativeIndexOf.call(ts, t);
    const indexOf = (xs, x) => {
      const r = rawIndexOf(xs, x);
      return r === -1 ? Optional.none() : Optional.some(r);
    };
    const contains$2 = (xs, x) => rawIndexOf(xs, x) > -1;
    const exists = (xs, pred) => {
      for (let i = 0, len = xs.length; i < len; i++) {
        const x = xs[i];
        if (pred(x, i)) {
          return true;
        }
      }
      return false;
    };
    const range$2 = (num, f) => {
      const r = [];
      for (let i = 0; i < num; i++) {
        r.push(f(i));
      }
      return r;
    };
    const chunk$1 = (array, size) => {
      const r = [];
      for (let i = 0; i < array.length; i += size) {
        const s = nativeSlice.call(array, i, i + size);
        r.push(s);
      }
      return r;
    };
    const map$2 = (xs, f) => {
      const len = xs.length;
      const r = new Array(len);
      for (let i = 0; i < len; i++) {
        const x = xs[i];
        r[i] = f(x, i);
      }
      return r;
    };
    const each$1 = (xs, f) => {
      for (let i = 0, len = xs.length; i < len; i++) {
        const x = xs[i];
        f(x, i);
      }
    };
    const eachr = (xs, f) => {
      for (let i = xs.length - 1; i >= 0; i--) {
        const x = xs[i];
        f(x, i);
      }
    };
    const partition$3 = (xs, pred) => {
      const pass = [];
      const fail = [];
      for (let i = 0, len = xs.length; i < len; i++) {
        const x = xs[i];
        const arr = pred(x, i) ? pass : fail;
        arr.push(x);
      }
      return {
        pass,
        fail
      };
    };
    const filter$2 = (xs, pred) => {
      const r = [];
      for (let i = 0, len = xs.length; i < len; i++) {
        const x = xs[i];
        if (pred(x, i)) {
          r.push(x);
        }
      }
      return r;
    };
    const foldr = (xs, f, acc) => {
      eachr(xs, (x, i) => {
        acc = f(acc, x, i);
      });
      return acc;
    };
    const foldl = (xs, f, acc) => {
      each$1(xs, (x, i) => {
        acc = f(acc, x, i);
      });
      return acc;
    };
    const findUntil = (xs, pred, until) => {
      for (let i = 0, len = xs.length; i < len; i++) {
        const x = xs[i];
        if (pred(x, i)) {
          return Optional.some(x);
        } else if (until(x, i)) {
          break;
        }
      }
      return Optional.none();
    };
    const find$5 = (xs, pred) => {
      return findUntil(xs, pred, never);
    };
    const findIndex$1 = (xs, pred) => {
      for (let i = 0, len = xs.length; i < len; i++) {
        const x = xs[i];
        if (pred(x, i)) {
          return Optional.some(i);
        }
      }
      return Optional.none();
    };
    const flatten = xs => {
      const r = [];
      for (let i = 0, len = xs.length; i < len; ++i) {
        if (!isArray(xs[i])) {
          throw new Error('Arr.flatten item ' + i + ' was not an array, input: ' + xs);
        }
        nativePush.apply(r, xs[i]);
      }
      return r;
    };
    const bind$3 = (xs, f) => flatten(map$2(xs, f));
    const forall = (xs, pred) => {
      for (let i = 0, len = xs.length; i < len; ++i) {
        const x = xs[i];
        if (pred(x, i) !== true) {
          return false;
        }
      }
      return true;
    };
    const reverse = xs => {
      const r = nativeSlice.call(xs, 0);
      r.reverse();
      return r;
    };
    const difference = (a1, a2) => filter$2(a1, x => !contains$2(a2, x));
    const mapToObject = (xs, f) => {
      const r = {};
      for (let i = 0, len = xs.length; i < len; i++) {
        const x = xs[i];
        r[String(x)] = f(x, i);
      }
      return r;
    };
    const pure$2 = x => [x];
    const sort = (xs, comparator) => {
      const copy = nativeSlice.call(xs, 0);
      copy.sort(comparator);
      return copy;
    };
    const get$h = (xs, i) => i >= 0 && i < xs.length ? Optional.some(xs[i]) : Optional.none();
    const head = xs => get$h(xs, 0);
    const last$1 = xs => get$h(xs, xs.length - 1);
    const from = isFunction(Array.from) ? Array.from : x => nativeSlice.call(x);
    const findMap = (arr, f) => {
      for (let i = 0; i < arr.length; i++) {
        const r = f(arr[i], i);
        if (r.isSome()) {
          return r;
        }
      }
      return Optional.none();
    };

    const keys = Object.keys;
    const hasOwnProperty = Object.hasOwnProperty;
    const each = (obj, f) => {
      const props = keys(obj);
      for (let k = 0, len = props.length; k < len; k++) {
        const i = props[k];
        const x = obj[i];
        f(x, i);
      }
    };
    const map$1 = (obj, f) => {
      return tupleMap(obj, (x, i) => ({
        k: i,
        v: f(x, i)
      }));
    };
    const tupleMap = (obj, f) => {
      const r = {};
      each(obj, (x, i) => {
        const tuple = f(x, i);
        r[tuple.k] = tuple.v;
      });
      return r;
    };
    const objAcc = r => (x, i) => {
      r[i] = x;
    };
    const internalFilter = (obj, pred, onTrue, onFalse) => {
      each(obj, (x, i) => {
        (pred(x, i) ? onTrue : onFalse)(x, i);
      });
    };
    const bifilter = (obj, pred) => {
      const t = {};
      const f = {};
      internalFilter(obj, pred, objAcc(t), objAcc(f));
      return {
        t,
        f
      };
    };
    const filter$1 = (obj, pred) => {
      const t = {};
      internalFilter(obj, pred, objAcc(t), noop);
      return t;
    };
    const mapToArray = (obj, f) => {
      const r = [];
      each(obj, (value, name) => {
        r.push(f(value, name));
      });
      return r;
    };
    const find$4 = (obj, pred) => {
      const props = keys(obj);
      for (let k = 0, len = props.length; k < len; k++) {
        const i = props[k];
        const x = obj[i];
        if (pred(x, i, obj)) {
          return Optional.some(x);
        }
      }
      return Optional.none();
    };
    const values = obj => {
      return mapToArray(obj, identity);
    };
    const get$g = (obj, key) => {
      return has$2(obj, key) ? Optional.from(obj[key]) : Optional.none();
    };
    const has$2 = (obj, key) => hasOwnProperty.call(obj, key);
    const hasNonNullableKey = (obj, key) => has$2(obj, key) && obj[key] !== undefined && obj[key] !== null;

    const is$1 = (lhs, rhs, comparator = tripleEquals) => lhs.exists(left => comparator(left, rhs));
    const equals = (lhs, rhs, comparator = tripleEquals) => lift2(lhs, rhs, comparator).getOr(lhs.isNone() && rhs.isNone());
    const cat = arr => {
      const r = [];
      const push = x => {
        r.push(x);
      };
      for (let i = 0; i < arr.length; i++) {
        arr[i].each(push);
      }
      return r;
    };
    const sequence = arr => {
      const r = [];
      for (let i = 0; i < arr.length; i++) {
        const x = arr[i];
        if (x.isSome()) {
          r.push(x.getOrDie());
        } else {
          return Optional.none();
        }
      }
      return Optional.some(r);
    };
    const lift2 = (oa, ob, f) => oa.isSome() && ob.isSome() ? Optional.some(f(oa.getOrDie(), ob.getOrDie())) : Optional.none();
    const lift3 = (oa, ob, oc, f) => oa.isSome() && ob.isSome() && oc.isSome() ? Optional.some(f(oa.getOrDie(), ob.getOrDie(), oc.getOrDie())) : Optional.none();
    const mapFrom = (a, f) => a !== undefined && a !== null ? Optional.some(f(a)) : Optional.none();
    const someIf = (b, a) => b ? Optional.some(a) : Optional.none();

    const addToEnd = (str, suffix) => {
      return str + suffix;
    };
    const removeFromStart = (str, numChars) => {
      return str.substring(numChars);
    };

    const checkRange = (str, substr, start) => substr === '' || str.length >= substr.length && str.substr(start, start + substr.length) === substr;
    const removeLeading = (str, prefix) => {
      return startsWith(str, prefix) ? removeFromStart(str, prefix.length) : str;
    };
    const ensureTrailing = (str, suffix) => {
      return endsWith(str, suffix) ? str : addToEnd(str, suffix);
    };
    const contains$1 = (str, substr, start = 0, end) => {
      const idx = str.indexOf(substr, start);
      if (idx !== -1) {
        return isUndefined(end) ? true : idx + substr.length <= end;
      } else {
        return false;
      }
    };
    const startsWith = (str, prefix) => {
      return checkRange(str, prefix, 0);
    };
    const endsWith = (str, suffix) => {
      return checkRange(str, suffix, str.length - suffix.length);
    };
    const blank = r => s => s.replace(r, '');
    const trim$1 = blank(/^\s+|\s+$/g);
    const isNotEmpty = s => s.length > 0;
    const isEmpty = s => !isNotEmpty(s);

    const isSupported$1 = dom => dom.style !== undefined && isFunction(dom.style.getPropertyValue);

    const fromHtml$2 = (html, scope) => {
      const doc = scope || document;
      const div = doc.createElement('div');
      div.innerHTML = html;
      if (!div.hasChildNodes() || div.childNodes.length > 1) {
        const message = 'HTML does not have a single root node';
        console.error(message, html);
        throw new Error(message);
      }
      return fromDom(div.childNodes[0]);
    };
    const fromTag = (tag, scope) => {
      const doc = scope || document;
      const node = doc.createElement(tag);
      return fromDom(node);
    };
    const fromText = (text, scope) => {
      const doc = scope || document;
      const node = doc.createTextNode(text);
      return fromDom(node);
    };
    const fromDom = node => {
      if (node === null || node === undefined) {
        throw new Error('Node cannot be null or undefined');
      }
      return { dom: node };
    };
    const fromPoint = (docElm, x, y) => Optional.from(docElm.dom.elementFromPoint(x, y)).map(fromDom);
    const SugarElement = {
      fromHtml: fromHtml$2,
      fromTag,
      fromText,
      fromDom,
      fromPoint
    };

    const Global = typeof window !== 'undefined' ? window : Function('return this;')();

    const path$1 = (parts, scope) => {
      let o = scope !== undefined && scope !== null ? scope : Global;
      for (let i = 0; i < parts.length && o !== undefined && o !== null; ++i) {
        o = o[parts[i]];
      }
      return o;
    };
    const resolve = (p, scope) => {
      const parts = p.split('.');
      return path$1(parts, scope);
    };

    const unsafe = (name, scope) => {
      return resolve(name, scope);
    };
    const getOrDie$1 = (name, scope) => {
      const actual = unsafe(name, scope);
      if (actual === undefined || actual === null) {
        throw new Error(name + ' not available on this browser');
      }
      return actual;
    };

    const getPrototypeOf = Object.getPrototypeOf;
    const sandHTMLElement = scope => {
      return getOrDie$1('HTMLElement', scope);
    };
    const isPrototypeOf = x => {
      const scope = resolve('ownerDocument.defaultView', x);
      return isObject(x) && (sandHTMLElement(scope).prototype.isPrototypeOf(x) || /^HTML\w*Element$/.test(getPrototypeOf(x).constructor.name));
    };

    const DOCUMENT = 9;
    const DOCUMENT_FRAGMENT = 11;
    const ELEMENT = 1;
    const TEXT = 3;

    const name$3 = element => {
      const r = element.dom.nodeName;
      return r.toLowerCase();
    };
    const type$1 = element => element.dom.nodeType;
    const isType = t => element => type$1(element) === t;
    const isHTMLElement = element => isElement$1(element) && isPrototypeOf(element.dom);
    const isElement$1 = isType(ELEMENT);
    const isText = isType(TEXT);
    const isDocument = isType(DOCUMENT);
    const isDocumentFragment = isType(DOCUMENT_FRAGMENT);
    const isTag = tag => e => isElement$1(e) && name$3(e) === tag;

    const is = (element, selector) => {
      const dom = element.dom;
      if (dom.nodeType !== ELEMENT) {
        return false;
      } else {
        const elem = dom;
        if (elem.matches !== undefined) {
          return elem.matches(selector);
        } else if (elem.msMatchesSelector !== undefined) {
          return elem.msMatchesSelector(selector);
        } else if (elem.webkitMatchesSelector !== undefined) {
          return elem.webkitMatchesSelector(selector);
        } else if (elem.mozMatchesSelector !== undefined) {
          return elem.mozMatchesSelector(selector);
        } else {
          throw new Error('Browser lacks native selectors');
        }
      }
    };
    const bypassSelector = dom => dom.nodeType !== ELEMENT && dom.nodeType !== DOCUMENT && dom.nodeType !== DOCUMENT_FRAGMENT || dom.childElementCount === 0;
    const all$3 = (selector, scope) => {
      const base = scope === undefined ? document : scope.dom;
      return bypassSelector(base) ? [] : map$2(base.querySelectorAll(selector), SugarElement.fromDom);
    };
    const one = (selector, scope) => {
      const base = scope === undefined ? document : scope.dom;
      return bypassSelector(base) ? Optional.none() : Optional.from(base.querySelector(selector)).map(SugarElement.fromDom);
    };

    const eq = (e1, e2) => e1.dom === e2.dom;
    const contains = (e1, e2) => {
      const d1 = e1.dom;
      const d2 = e2.dom;
      return d1 === d2 ? false : d1.contains(d2);
    };

    const owner$4 = element => SugarElement.fromDom(element.dom.ownerDocument);
    const documentOrOwner = dos => isDocument(dos) ? dos : owner$4(dos);
    const documentElement = element => SugarElement.fromDom(documentOrOwner(element).dom.documentElement);
    const defaultView = element => SugarElement.fromDom(documentOrOwner(element).dom.defaultView);
    const parent = element => Optional.from(element.dom.parentNode).map(SugarElement.fromDom);
    const parentElement = element => Optional.from(element.dom.parentElement).map(SugarElement.fromDom);
    const offsetParent = element => Optional.from(element.dom.offsetParent).map(SugarElement.fromDom);
    const nextSibling = element => Optional.from(element.dom.nextSibling).map(SugarElement.fromDom);
    const children = element => map$2(element.dom.childNodes, SugarElement.fromDom);
    const child$2 = (element, index) => {
      const cs = element.dom.childNodes;
      return Optional.from(cs[index]).map(SugarElement.fromDom);
    };
    const firstChild = element => child$2(element, 0);
    const spot = (element, offset) => ({
      element,
      offset
    });
    const leaf = (element, offset) => {
      const cs = children(element);
      return cs.length > 0 && offset < cs.length ? spot(cs[offset], 0) : spot(element, offset);
    };

    const isShadowRoot = dos => isDocumentFragment(dos) && isNonNullable(dos.dom.host);
    const supported = isFunction(Element.prototype.attachShadow) && isFunction(Node.prototype.getRootNode);
    const isSupported = constant$1(supported);
    const getRootNode = supported ? e => SugarElement.fromDom(e.dom.getRootNode()) : documentOrOwner;
    const getContentContainer = dos => isShadowRoot(dos) ? dos : SugarElement.fromDom(documentOrOwner(dos).dom.body);
    const isInShadowRoot = e => getShadowRoot(e).isSome();
    const getShadowRoot = e => {
      const r = getRootNode(e);
      return isShadowRoot(r) ? Optional.some(r) : Optional.none();
    };
    const getShadowHost = e => SugarElement.fromDom(e.dom.host);
    const getOriginalEventTarget = event => {
      if (isSupported() && isNonNullable(event.target)) {
        const el = SugarElement.fromDom(event.target);
        if (isElement$1(el) && isOpenShadowHost(el)) {
          if (event.composed && event.composedPath) {
            const composedPath = event.composedPath();
            if (composedPath) {
              return head(composedPath);
            }
          }
        }
      }
      return Optional.from(event.target);
    };
    const isOpenShadowHost = element => isNonNullable(element.dom.shadowRoot);

    const inBody = element => {
      const dom = isText(element) ? element.dom.parentNode : element.dom;
      if (dom === undefined || dom === null || dom.ownerDocument === null) {
        return false;
      }
      const doc = dom.ownerDocument;
      return getShadowRoot(SugarElement.fromDom(dom)).fold(() => doc.body.contains(dom), compose1(inBody, getShadowHost));
    };
    const body = () => getBody(SugarElement.fromDom(document));
    const getBody = doc => {
      const b = doc.dom.body;
      if (b === null || b === undefined) {
        throw new Error('Body is not available yet');
      }
      return SugarElement.fromDom(b);
    };

    const rawSet = (dom, key, value) => {
      if (isString(value) || isBoolean(value) || isNumber(value)) {
        dom.setAttribute(key, value + '');
      } else {
        console.error('Invalid call to Attribute.set. Key ', key, ':: Value ', value, ':: Element ', dom);
        throw new Error('Attribute value was not simple');
      }
    };
    const set$9 = (element, key, value) => {
      rawSet(element.dom, key, value);
    };
    const setAll$1 = (element, attrs) => {
      const dom = element.dom;
      each(attrs, (v, k) => {
        rawSet(dom, k, v);
      });
    };
    const get$f = (element, key) => {
      const v = element.dom.getAttribute(key);
      return v === null ? undefined : v;
    };
    const getOpt = (element, key) => Optional.from(get$f(element, key));
    const has$1 = (element, key) => {
      const dom = element.dom;
      return dom && dom.hasAttribute ? dom.hasAttribute(key) : false;
    };
    const remove$7 = (element, key) => {
      element.dom.removeAttribute(key);
    };
    const clone$1 = element => foldl(element.dom.attributes, (acc, attr) => {
      acc[attr.name] = attr.value;
      return acc;
    }, {});

    const internalSet = (dom, property, value) => {
      if (!isString(value)) {
        console.error('Invalid call to CSS.set. Property ', property, ':: Value ', value, ':: Element ', dom);
        throw new Error('CSS value must be a string: ' + value);
      }
      if (isSupported$1(dom)) {
        dom.style.setProperty(property, value);
      }
    };
    const internalRemove = (dom, property) => {
      if (isSupported$1(dom)) {
        dom.style.removeProperty(property);
      }
    };
    const set$8 = (element, property, value) => {
      const dom = element.dom;
      internalSet(dom, property, value);
    };
    const setAll = (element, css) => {
      const dom = element.dom;
      each(css, (v, k) => {
        internalSet(dom, k, v);
      });
    };
    const setOptions = (element, css) => {
      const dom = element.dom;
      each(css, (v, k) => {
        v.fold(() => {
          internalRemove(dom, k);
        }, value => {
          internalSet(dom, k, value);
        });
      });
    };
    const get$e = (element, property) => {
      const dom = element.dom;
      const styles = window.getComputedStyle(dom);
      const r = styles.getPropertyValue(property);
      return r === '' && !inBody(element) ? getUnsafeProperty(dom, property) : r;
    };
    const getUnsafeProperty = (dom, property) => isSupported$1(dom) ? dom.style.getPropertyValue(property) : '';
    const getRaw = (element, property) => {
      const dom = element.dom;
      const raw = getUnsafeProperty(dom, property);
      return Optional.from(raw).filter(r => r.length > 0);
    };
    const getAllRaw = element => {
      const css = {};
      const dom = element.dom;
      if (isSupported$1(dom)) {
        for (let i = 0; i < dom.style.length; i++) {
          const ruleName = dom.style.item(i);
          css[ruleName] = dom.style[ruleName];
        }
      }
      return css;
    };
    const isValidValue = (tag, property, value) => {
      const element = SugarElement.fromTag(tag);
      set$8(element, property, value);
      const style = getRaw(element, property);
      return style.isSome();
    };
    const remove$6 = (element, property) => {
      const dom = element.dom;
      internalRemove(dom, property);
      if (is$1(getOpt(element, 'style').map(trim$1), '')) {
        remove$7(element, 'style');
      }
    };
    const reflow = e => e.dom.offsetWidth;

    const Dimension = (name, getOffset) => {
      const set = (element, h) => {
        if (!isNumber(h) && !h.match(/^[0-9]+$/)) {
          throw new Error(name + '.set accepts only positive integer values. Value was ' + h);
        }
        const dom = element.dom;
        if (isSupported$1(dom)) {
          dom.style[name] = h + 'px';
        }
      };
      const get = element => {
        const r = getOffset(element);
        if (r <= 0 || r === null) {
          const css = get$e(element, name);
          return parseFloat(css) || 0;
        }
        return r;
      };
      const getOuter = get;
      const aggregate = (element, properties) => foldl(properties, (acc, property) => {
        const val = get$e(element, property);
        const value = val === undefined ? 0 : parseInt(val, 10);
        return isNaN(value) ? acc : acc + value;
      }, 0);
      const max = (element, value, properties) => {
        const cumulativeInclusions = aggregate(element, properties);
        const absoluteMax = value > cumulativeInclusions ? value - cumulativeInclusions : 0;
        return absoluteMax;
      };
      return {
        set,
        get,
        getOuter,
        aggregate,
        max
      };
    };

    const api$2 = Dimension('height', element => {
      const dom = element.dom;
      return inBody(element) ? dom.getBoundingClientRect().height : dom.offsetHeight;
    });
    const get$d = element => api$2.get(element);
    const getOuter$2 = element => api$2.getOuter(element);
    const setMax$1 = (element, value) => {
      const inclusions = [
        'margin-top',
        'border-top-width',
        'padding-top',
        'padding-bottom',
        'border-bottom-width',
        'margin-bottom'
      ];
      const absMax = api$2.max(element, value, inclusions);
      set$8(element, 'max-height', absMax + 'px');
    };

    const r$1 = (left, top) => {
      const translate = (x, y) => r$1(left + x, top + y);
      return {
        left,
        top,
        translate
      };
    };
    const SugarPosition = r$1;

    const boxPosition = dom => {
      const box = dom.getBoundingClientRect();
      return SugarPosition(box.left, box.top);
    };
    const firstDefinedOrZero = (a, b) => {
      if (a !== undefined) {
        return a;
      } else {
        return b !== undefined ? b : 0;
      }
    };
    const absolute$3 = element => {
      const doc = element.dom.ownerDocument;
      const body = doc.body;
      const win = doc.defaultView;
      const html = doc.documentElement;
      if (body === element.dom) {
        return SugarPosition(body.offsetLeft, body.offsetTop);
      }
      const scrollTop = firstDefinedOrZero(win === null || win === void 0 ? void 0 : win.pageYOffset, html.scrollTop);
      const scrollLeft = firstDefinedOrZero(win === null || win === void 0 ? void 0 : win.pageXOffset, html.scrollLeft);
      const clientTop = firstDefinedOrZero(html.clientTop, body.clientTop);
      const clientLeft = firstDefinedOrZero(html.clientLeft, body.clientLeft);
      return viewport$1(element).translate(scrollLeft - clientLeft, scrollTop - clientTop);
    };
    const viewport$1 = element => {
      const dom = element.dom;
      const doc = dom.ownerDocument;
      const body = doc.body;
      if (body === dom) {
        return SugarPosition(body.offsetLeft, body.offsetTop);
      }
      if (!inBody(element)) {
        return SugarPosition(0, 0);
      }
      return boxPosition(dom);
    };

    const api$1 = Dimension('width', element => element.dom.offsetWidth);
    const set$7 = (element, h) => api$1.set(element, h);
    const get$c = element => api$1.get(element);
    const getOuter$1 = element => api$1.getOuter(element);
    const setMax = (element, value) => {
      const inclusions = [
        'margin-left',
        'border-left-width',
        'padding-left',
        'padding-right',
        'border-right-width',
        'margin-right'
      ];
      const absMax = api$1.max(element, value, inclusions);
      set$8(element, 'max-width', absMax + 'px');
    };

    const cached = f => {
      let called = false;
      let r;
      return (...args) => {
        if (!called) {
          called = true;
          r = f.apply(null, args);
        }
        return r;
      };
    };

    const DeviceType = (os, browser, userAgent, mediaMatch) => {
      const isiPad = os.isiOS() && /ipad/i.test(userAgent) === true;
      const isiPhone = os.isiOS() && !isiPad;
      const isMobile = os.isiOS() || os.isAndroid();
      const isTouch = isMobile || mediaMatch('(pointer:coarse)');
      const isTablet = isiPad || !isiPhone && isMobile && mediaMatch('(min-device-width:768px)');
      const isPhone = isiPhone || isMobile && !isTablet;
      const iOSwebview = browser.isSafari() && os.isiOS() && /safari/i.test(userAgent) === false;
      const isDesktop = !isPhone && !isTablet && !iOSwebview;
      return {
        isiPad: constant$1(isiPad),
        isiPhone: constant$1(isiPhone),
        isTablet: constant$1(isTablet),
        isPhone: constant$1(isPhone),
        isTouch: constant$1(isTouch),
        isAndroid: os.isAndroid,
        isiOS: os.isiOS,
        isWebView: constant$1(iOSwebview),
        isDesktop: constant$1(isDesktop)
      };
    };

    const firstMatch = (regexes, s) => {
      for (let i = 0; i < regexes.length; i++) {
        const x = regexes[i];
        if (x.test(s)) {
          return x;
        }
      }
      return undefined;
    };
    const find$3 = (regexes, agent) => {
      const r = firstMatch(regexes, agent);
      if (!r) {
        return {
          major: 0,
          minor: 0
        };
      }
      const group = i => {
        return Number(agent.replace(r, '$' + i));
      };
      return nu$d(group(1), group(2));
    };
    const detect$4 = (versionRegexes, agent) => {
      const cleanedAgent = String(agent).toLowerCase();
      if (versionRegexes.length === 0) {
        return unknown$3();
      }
      return find$3(versionRegexes, cleanedAgent);
    };
    const unknown$3 = () => {
      return nu$d(0, 0);
    };
    const nu$d = (major, minor) => {
      return {
        major,
        minor
      };
    };
    const Version = {
      nu: nu$d,
      detect: detect$4,
      unknown: unknown$3
    };

    const detectBrowser$1 = (browsers, userAgentData) => {
      return findMap(userAgentData.brands, uaBrand => {
        const lcBrand = uaBrand.brand.toLowerCase();
        return find$5(browsers, browser => {
          var _a;
          return lcBrand === ((_a = browser.brand) === null || _a === void 0 ? void 0 : _a.toLowerCase());
        }).map(info => ({
          current: info.name,
          version: Version.nu(parseInt(uaBrand.version, 10), 0)
        }));
      });
    };

    const detect$3 = (candidates, userAgent) => {
      const agent = String(userAgent).toLowerCase();
      return find$5(candidates, candidate => {
        return candidate.search(agent);
      });
    };
    const detectBrowser = (browsers, userAgent) => {
      return detect$3(browsers, userAgent).map(browser => {
        const version = Version.detect(browser.versionRegexes, userAgent);
        return {
          current: browser.name,
          version
        };
      });
    };
    const detectOs = (oses, userAgent) => {
      return detect$3(oses, userAgent).map(os => {
        const version = Version.detect(os.versionRegexes, userAgent);
        return {
          current: os.name,
          version
        };
      });
    };

    const normalVersionRegex = /.*?version\/\ ?([0-9]+)\.([0-9]+).*/;
    const checkContains = target => {
      return uastring => {
        return contains$1(uastring, target);
      };
    };
    const browsers = [
      {
        name: 'Edge',
        versionRegexes: [/.*?edge\/ ?([0-9]+)\.([0-9]+)$/],
        search: uastring => {
          return contains$1(uastring, 'edge/') && contains$1(uastring, 'chrome') && contains$1(uastring, 'safari') && contains$1(uastring, 'applewebkit');
        }
      },
      {
        name: 'Chromium',
        brand: 'Chromium',
        versionRegexes: [
          /.*?chrome\/([0-9]+)\.([0-9]+).*/,
          normalVersionRegex
        ],
        search: uastring => {
          return contains$1(uastring, 'chrome') && !contains$1(uastring, 'chromeframe');
        }
      },
      {
        name: 'IE',
        versionRegexes: [
          /.*?msie\ ?([0-9]+)\.([0-9]+).*/,
          /.*?rv:([0-9]+)\.([0-9]+).*/
        ],
        search: uastring => {
          return contains$1(uastring, 'msie') || contains$1(uastring, 'trident');
        }
      },
      {
        name: 'Opera',
        versionRegexes: [
          normalVersionRegex,
          /.*?opera\/([0-9]+)\.([0-9]+).*/
        ],
        search: checkContains('opera')
      },
      {
        name: 'Firefox',
        versionRegexes: [/.*?firefox\/\ ?([0-9]+)\.([0-9]+).*/],
        search: checkContains('firefox')
      },
      {
        name: 'Safari',
        versionRegexes: [
          normalVersionRegex,
          /.*?cpu os ([0-9]+)_([0-9]+).*/
        ],
        search: uastring => {
          return (contains$1(uastring, 'safari') || contains$1(uastring, 'mobile/')) && contains$1(uastring, 'applewebkit');
        }
      }
    ];
    const oses = [
      {
        name: 'Windows',
        search: checkContains('win'),
        versionRegexes: [/.*?windows\ nt\ ?([0-9]+)\.([0-9]+).*/]
      },
      {
        name: 'iOS',
        search: uastring => {
          return contains$1(uastring, 'iphone') || contains$1(uastring, 'ipad');
        },
        versionRegexes: [
          /.*?version\/\ ?([0-9]+)\.([0-9]+).*/,
          /.*cpu os ([0-9]+)_([0-9]+).*/,
          /.*cpu iphone os ([0-9]+)_([0-9]+).*/
        ]
      },
      {
        name: 'Android',
        search: checkContains('android'),
        versionRegexes: [/.*?android\ ?([0-9]+)\.([0-9]+).*/]
      },
      {
        name: 'macOS',
        search: checkContains('mac os x'),
        versionRegexes: [/.*?mac\ os\ x\ ?([0-9]+)_([0-9]+).*/]
      },
      {
        name: 'Linux',
        search: checkContains('linux'),
        versionRegexes: []
      },
      {
        name: 'Solaris',
        search: checkContains('sunos'),
        versionRegexes: []
      },
      {
        name: 'FreeBSD',
        search: checkContains('freebsd'),
        versionRegexes: []
      },
      {
        name: 'ChromeOS',
        search: checkContains('cros'),
        versionRegexes: [/.*?chrome\/([0-9]+)\.([0-9]+).*/]
      }
    ];
    const PlatformInfo = {
      browsers: constant$1(browsers),
      oses: constant$1(oses)
    };

    const edge = 'Edge';
    const chromium = 'Chromium';
    const ie = 'IE';
    const opera = 'Opera';
    const firefox = 'Firefox';
    const safari = 'Safari';
    const unknown$2 = () => {
      return nu$c({
        current: undefined,
        version: Version.unknown()
      });
    };
    const nu$c = info => {
      const current = info.current;
      const version = info.version;
      const isBrowser = name => () => current === name;
      return {
        current,
        version,
        isEdge: isBrowser(edge),
        isChromium: isBrowser(chromium),
        isIE: isBrowser(ie),
        isOpera: isBrowser(opera),
        isFirefox: isBrowser(firefox),
        isSafari: isBrowser(safari)
      };
    };
    const Browser = {
      unknown: unknown$2,
      nu: nu$c,
      edge: constant$1(edge),
      chromium: constant$1(chromium),
      ie: constant$1(ie),
      opera: constant$1(opera),
      firefox: constant$1(firefox),
      safari: constant$1(safari)
    };

    const windows = 'Windows';
    const ios = 'iOS';
    const android = 'Android';
    const linux = 'Linux';
    const macos = 'macOS';
    const solaris = 'Solaris';
    const freebsd = 'FreeBSD';
    const chromeos = 'ChromeOS';
    const unknown$1 = () => {
      return nu$b({
        current: undefined,
        version: Version.unknown()
      });
    };
    const nu$b = info => {
      const current = info.current;
      const version = info.version;
      const isOS = name => () => current === name;
      return {
        current,
        version,
        isWindows: isOS(windows),
        isiOS: isOS(ios),
        isAndroid: isOS(android),
        isMacOS: isOS(macos),
        isLinux: isOS(linux),
        isSolaris: isOS(solaris),
        isFreeBSD: isOS(freebsd),
        isChromeOS: isOS(chromeos)
      };
    };
    const OperatingSystem = {
      unknown: unknown$1,
      nu: nu$b,
      windows: constant$1(windows),
      ios: constant$1(ios),
      android: constant$1(android),
      linux: constant$1(linux),
      macos: constant$1(macos),
      solaris: constant$1(solaris),
      freebsd: constant$1(freebsd),
      chromeos: constant$1(chromeos)
    };

    const detect$2 = (userAgent, userAgentDataOpt, mediaMatch) => {
      const browsers = PlatformInfo.browsers();
      const oses = PlatformInfo.oses();
      const browser = userAgentDataOpt.bind(userAgentData => detectBrowser$1(browsers, userAgentData)).orThunk(() => detectBrowser(browsers, userAgent)).fold(Browser.unknown, Browser.nu);
      const os = detectOs(oses, userAgent).fold(OperatingSystem.unknown, OperatingSystem.nu);
      const deviceType = DeviceType(os, browser, userAgent, mediaMatch);
      return {
        browser,
        os,
        deviceType
      };
    };
    const PlatformDetection = { detect: detect$2 };

    const mediaMatch = query => window.matchMedia(query).matches;
    let platform = cached(() => PlatformDetection.detect(navigator.userAgent, Optional.from(navigator.userAgentData), mediaMatch));
    const detect$1 = () => platform();

    const mkEvent = (target, x, y, stop, prevent, kill, raw) => ({
      target,
      x,
      y,
      stop,
      prevent,
      kill,
      raw
    });
    const fromRawEvent$1 = rawEvent => {
      const target = SugarElement.fromDom(getOriginalEventTarget(rawEvent).getOr(rawEvent.target));
      const stop = () => rawEvent.stopPropagation();
      const prevent = () => rawEvent.preventDefault();
      const kill = compose(prevent, stop);
      return mkEvent(target, rawEvent.clientX, rawEvent.clientY, stop, prevent, kill, rawEvent);
    };
    const handle = (filter, handler) => rawEvent => {
      if (filter(rawEvent)) {
        handler(fromRawEvent$1(rawEvent));
      }
    };
    const binder = (element, event, filter, handler, useCapture) => {
      const wrapped = handle(filter, handler);
      element.dom.addEventListener(event, wrapped, useCapture);
      return { unbind: curry(unbind, element, event, wrapped, useCapture) };
    };
    const bind$2 = (element, event, filter, handler) => binder(element, event, filter, handler, false);
    const capture$1 = (element, event, filter, handler) => binder(element, event, filter, handler, true);
    const unbind = (element, event, handler, useCapture) => {
      element.dom.removeEventListener(event, handler, useCapture);
    };

    const before$1 = (marker, element) => {
      const parent$1 = parent(marker);
      parent$1.each(v => {
        v.dom.insertBefore(element.dom, marker.dom);
      });
    };
    const after$2 = (marker, element) => {
      const sibling = nextSibling(marker);
      sibling.fold(() => {
        const parent$1 = parent(marker);
        parent$1.each(v => {
          append$2(v, element);
        });
      }, v => {
        before$1(v, element);
      });
    };
    const prepend$1 = (parent, element) => {
      const firstChild$1 = firstChild(parent);
      firstChild$1.fold(() => {
        append$2(parent, element);
      }, v => {
        parent.dom.insertBefore(element.dom, v.dom);
      });
    };
    const append$2 = (parent, element) => {
      parent.dom.appendChild(element.dom);
    };
    const appendAt = (parent, element, index) => {
      child$2(parent, index).fold(() => {
        append$2(parent, element);
      }, v => {
        before$1(v, element);
      });
    };

    const append$1 = (parent, elements) => {
      each$1(elements, x => {
        append$2(parent, x);
      });
    };

    const empty = element => {
      element.dom.textContent = '';
      each$1(children(element), rogue => {
        remove$5(rogue);
      });
    };
    const remove$5 = element => {
      const dom = element.dom;
      if (dom.parentNode !== null) {
        dom.parentNode.removeChild(dom);
      }
    };

    const get$b = _DOC => {
      const doc = _DOC !== undefined ? _DOC.dom : document;
      const x = doc.body.scrollLeft || doc.documentElement.scrollLeft;
      const y = doc.body.scrollTop || doc.documentElement.scrollTop;
      return SugarPosition(x, y);
    };
    const to = (x, y, _DOC) => {
      const doc = _DOC !== undefined ? _DOC.dom : document;
      const win = doc.defaultView;
      if (win) {
        win.scrollTo(x, y);
      }
    };

    const get$a = _win => {
      const win = _win === undefined ? window : _win;
      if (detect$1().browser.isFirefox()) {
        return Optional.none();
      } else {
        return Optional.from(win.visualViewport);
      }
    };
    const bounds$1 = (x, y, width, height) => ({
      x,
      y,
      width,
      height,
      right: x + width,
      bottom: y + height
    });
    const getBounds$3 = _win => {
      const win = _win === undefined ? window : _win;
      const doc = win.document;
      const scroll = get$b(SugarElement.fromDom(doc));
      return get$a(win).fold(() => {
        const html = win.document.documentElement;
        const width = html.clientWidth;
        const height = html.clientHeight;
        return bounds$1(scroll.left, scroll.top, width, height);
      }, visualViewport => bounds$1(Math.max(visualViewport.pageLeft, scroll.left), Math.max(visualViewport.pageTop, scroll.top), visualViewport.width, visualViewport.height));
    };

    const getDocument = () => SugarElement.fromDom(document);

    const walkUp = (navigation, doc) => {
      const frame = navigation.view(doc);
      return frame.fold(constant$1([]), f => {
        const parent = navigation.owner(f);
        const rest = walkUp(navigation, parent);
        return [f].concat(rest);
      });
    };
    const pathTo = (element, navigation) => {
      const d = navigation.owner(element);
      const paths = walkUp(navigation, d);
      return Optional.some(paths);
    };

    const view = doc => {
      var _a;
      const element = doc.dom === document ? Optional.none() : Optional.from((_a = doc.dom.defaultView) === null || _a === void 0 ? void 0 : _a.frameElement);
      return element.map(SugarElement.fromDom);
    };
    const owner$3 = element => owner$4(element);

    var Navigation = /*#__PURE__*/Object.freeze({
        __proto__: null,
        view: view,
        owner: owner$3
    });

    const find$2 = element => {
      const doc = getDocument();
      const scroll = get$b(doc);
      const path = pathTo(element, Navigation);
      return path.fold(curry(absolute$3, element), frames => {
        const offset = viewport$1(element);
        const r = foldr(frames, (b, a) => {
          const loc = viewport$1(a);
          return {
            left: b.left + loc.left,
            top: b.top + loc.top
          };
        }, {
          left: 0,
          top: 0
        });
        return SugarPosition(r.left + offset.left + scroll.left, r.top + offset.top + scroll.top);
      });
    };

    const pointed = (point, width, height) => ({
      point,
      width,
      height
    });
    const rect = (x, y, width, height) => ({
      x,
      y,
      width,
      height
    });
    const bounds = (x, y, width, height) => ({
      x,
      y,
      width,
      height,
      right: x + width,
      bottom: y + height
    });
    const box$1 = element => {
      const xy = absolute$3(element);
      const w = getOuter$1(element);
      const h = getOuter$2(element);
      return bounds(xy.left, xy.top, w, h);
    };
    const absolute$2 = element => {
      const position = find$2(element);
      const width = getOuter$1(element);
      const height = getOuter$2(element);
      return bounds(position.left, position.top, width, height);
    };
    const win = () => getBounds$3(window);

    const value$4 = value => {
      const applyHelper = fn => fn(value);
      const constHelper = constant$1(value);
      const outputHelper = () => output;
      const output = {
        tag: true,
        inner: value,
        fold: (_onError, onValue) => onValue(value),
        isValue: always,
        isError: never,
        map: mapper => Result.value(mapper(value)),
        mapError: outputHelper,
        bind: applyHelper,
        exists: applyHelper,
        forall: applyHelper,
        getOr: constHelper,
        or: outputHelper,
        getOrThunk: constHelper,
        orThunk: outputHelper,
        getOrDie: constHelper,
        each: fn => {
          fn(value);
        },
        toOptional: () => Optional.some(value)
      };
      return output;
    };
    const error$1 = error => {
      const outputHelper = () => output;
      const output = {
        tag: false,
        inner: error,
        fold: (onError, _onValue) => onError(error),
        isValue: never,
        isError: always,
        map: outputHelper,
        mapError: mapper => Result.error(mapper(error)),
        bind: outputHelper,
        exists: never,
        forall: always,
        getOr: identity,
        or: identity,
        getOrThunk: apply,
        orThunk: apply,
        getOrDie: die(String(error)),
        each: noop,
        toOptional: Optional.none
      };
      return output;
    };
    const fromOption = (optional, err) => optional.fold(() => error$1(err), value$4);
    const Result = {
      value: value$4,
      error: error$1,
      fromOption
    };

    var SimpleResultType;
    (function (SimpleResultType) {
      SimpleResultType[SimpleResultType['Error'] = 0] = 'Error';
      SimpleResultType[SimpleResultType['Value'] = 1] = 'Value';
    }(SimpleResultType || (SimpleResultType = {})));
    const fold$1 = (res, onError, onValue) => res.stype === SimpleResultType.Error ? onError(res.serror) : onValue(res.svalue);
    const partition$2 = results => {
      const values = [];
      const errors = [];
      each$1(results, obj => {
        fold$1(obj, err => errors.push(err), val => values.push(val));
      });
      return {
        values,
        errors
      };
    };
    const mapError = (res, f) => {
      if (res.stype === SimpleResultType.Error) {
        return {
          stype: SimpleResultType.Error,
          serror: f(res.serror)
        };
      } else {
        return res;
      }
    };
    const map = (res, f) => {
      if (res.stype === SimpleResultType.Value) {
        return {
          stype: SimpleResultType.Value,
          svalue: f(res.svalue)
        };
      } else {
        return res;
      }
    };
    const bind$1 = (res, f) => {
      if (res.stype === SimpleResultType.Value) {
        return f(res.svalue);
      } else {
        return res;
      }
    };
    const bindError = (res, f) => {
      if (res.stype === SimpleResultType.Error) {
        return f(res.serror);
      } else {
        return res;
      }
    };
    const svalue = v => ({
      stype: SimpleResultType.Value,
      svalue: v
    });
    const serror = e => ({
      stype: SimpleResultType.Error,
      serror: e
    });
    const toResult$1 = res => fold$1(res, Result.error, Result.value);
    const fromResult$1 = res => res.fold(serror, svalue);
    const SimpleResult = {
      fromResult: fromResult$1,
      toResult: toResult$1,
      svalue,
      partition: partition$2,
      serror,
      bind: bind$1,
      bindError,
      map,
      mapError,
      fold: fold$1
    };

    const field$2 = (key, newKey, presence, prop) => ({
      tag: 'field',
      key,
      newKey,
      presence,
      prop
    });
    const customField$1 = (newKey, instantiator) => ({
      tag: 'custom',
      newKey,
      instantiator
    });
    const fold = (value, ifField, ifCustom) => {
      switch (value.tag) {
      case 'field':
        return ifField(value.key, value.newKey, value.presence, value.prop);
      case 'custom':
        return ifCustom(value.newKey, value.instantiator);
      }
    };

    const shallow$1 = (old, nu) => {
      return nu;
    };
    const deep = (old, nu) => {
      const bothObjects = isPlainObject(old) && isPlainObject(nu);
      return bothObjects ? deepMerge(old, nu) : nu;
    };
    const baseMerge = merger => {
      return (...objects) => {
        if (objects.length === 0) {
          throw new Error(`Can't merge zero objects`);
        }
        const ret = {};
        for (let j = 0; j < objects.length; j++) {
          const curObject = objects[j];
          for (const key in curObject) {
            if (has$2(curObject, key)) {
              ret[key] = merger(ret[key], curObject[key]);
            }
          }
        }
        return ret;
      };
    };
    const deepMerge = baseMerge(deep);
    const merge$1 = baseMerge(shallow$1);

    const required$2 = () => ({
      tag: 'required',
      process: {}
    });
    const defaultedThunk = fallbackThunk => ({
      tag: 'defaultedThunk',
      process: fallbackThunk
    });
    const defaulted$1 = fallback => defaultedThunk(constant$1(fallback));
    const asOption = () => ({
      tag: 'option',
      process: {}
    });
    const mergeWithThunk = baseThunk => ({
      tag: 'mergeWithThunk',
      process: baseThunk
    });
    const mergeWith = base => mergeWithThunk(constant$1(base));

    const mergeValues$1 = (values, base) => values.length > 0 ? SimpleResult.svalue(deepMerge(base, merge$1.apply(undefined, values))) : SimpleResult.svalue(base);
    const mergeErrors$1 = errors => compose(SimpleResult.serror, flatten)(errors);
    const consolidateObj = (objects, base) => {
      const partition = SimpleResult.partition(objects);
      return partition.errors.length > 0 ? mergeErrors$1(partition.errors) : mergeValues$1(partition.values, base);
    };
    const consolidateArr = objects => {
      const partitions = SimpleResult.partition(objects);
      return partitions.errors.length > 0 ? mergeErrors$1(partitions.errors) : SimpleResult.svalue(partitions.values);
    };
    const ResultCombine = {
      consolidateObj,
      consolidateArr
    };

    const formatObj = input => {
      return isObject(input) && keys(input).length > 100 ? ' removed due to size' : JSON.stringify(input, null, 2);
    };
    const formatErrors = errors => {
      const es = errors.length > 10 ? errors.slice(0, 10).concat([{
          path: [],
          getErrorInfo: constant$1('... (only showing first ten failures)')
        }]) : errors;
      return map$2(es, e => {
        return 'Failed path: (' + e.path.join(' > ') + ')\n' + e.getErrorInfo();
      });
    };

    const nu$a = (path, getErrorInfo) => {
      return SimpleResult.serror([{
          path,
          getErrorInfo
        }]);
    };
    const missingRequired = (path, key, obj) => nu$a(path, () => 'Could not find valid *required* value for "' + key + '" in ' + formatObj(obj));
    const missingKey = (path, key) => nu$a(path, () => 'Choice schema did not contain choice key: "' + key + '"');
    const missingBranch = (path, branches, branch) => nu$a(path, () => 'The chosen schema: "' + branch + '" did not exist in branches: ' + formatObj(branches));
    const unsupportedFields = (path, unsupported) => nu$a(path, () => 'There are unsupported fields: [' + unsupported.join(', ') + '] specified');
    const custom = (path, err) => nu$a(path, constant$1(err));

    const value$3 = validator => {
      const extract = (path, val) => {
        return SimpleResult.bindError(validator(val), err => custom(path, err));
      };
      const toString = constant$1('val');
      return {
        extract,
        toString
      };
    };
    const anyValue$1 = value$3(SimpleResult.svalue);

    const requiredAccess = (path, obj, key, bundle) => get$g(obj, key).fold(() => missingRequired(path, key, obj), bundle);
    const fallbackAccess = (obj, key, fallback, bundle) => {
      const v = get$g(obj, key).getOrThunk(() => fallback(obj));
      return bundle(v);
    };
    const optionAccess = (obj, key, bundle) => bundle(get$g(obj, key));
    const optionDefaultedAccess = (obj, key, fallback, bundle) => {
      const opt = get$g(obj, key).map(val => val === true ? fallback(obj) : val);
      return bundle(opt);
    };
    const extractField = (field, path, obj, key, prop) => {
      const bundle = av => prop.extract(path.concat([key]), av);
      const bundleAsOption = optValue => optValue.fold(() => SimpleResult.svalue(Optional.none()), ov => {
        const result = prop.extract(path.concat([key]), ov);
        return SimpleResult.map(result, Optional.some);
      });
      switch (field.tag) {
      case 'required':
        return requiredAccess(path, obj, key, bundle);
      case 'defaultedThunk':
        return fallbackAccess(obj, key, field.process, bundle);
      case 'option':
        return optionAccess(obj, key, bundleAsOption);
      case 'defaultedOptionThunk':
        return optionDefaultedAccess(obj, key, field.process, bundleAsOption);
      case 'mergeWithThunk': {
          return fallbackAccess(obj, key, constant$1({}), v => {
            const result = deepMerge(field.process(obj), v);
            return bundle(result);
          });
        }
      }
    };
    const extractFields = (path, obj, fields) => {
      const success = {};
      const errors = [];
      for (const field of fields) {
        fold(field, (key, newKey, presence, prop) => {
          const result = extractField(presence, path, obj, key, prop);
          SimpleResult.fold(result, err => {
            errors.push(...err);
          }, res => {
            success[newKey] = res;
          });
        }, (newKey, instantiator) => {
          success[newKey] = instantiator(obj);
        });
      }
      return errors.length > 0 ? SimpleResult.serror(errors) : SimpleResult.svalue(success);
    };
    const valueThunk = getDelegate => {
      const extract = (path, val) => getDelegate().extract(path, val);
      const toString = () => getDelegate().toString();
      return {
        extract,
        toString
      };
    };
    const getSetKeys = obj => keys(filter$1(obj, isNonNullable));
    const objOfOnly = fields => {
      const delegate = objOf(fields);
      const fieldNames = foldr(fields, (acc, value) => {
        return fold(value, key => deepMerge(acc, { [key]: true }), constant$1(acc));
      }, {});
      const extract = (path, o) => {
        const keys = isBoolean(o) ? [] : getSetKeys(o);
        const extra = filter$2(keys, k => !hasNonNullableKey(fieldNames, k));
        return extra.length === 0 ? delegate.extract(path, o) : unsupportedFields(path, extra);
      };
      return {
        extract,
        toString: delegate.toString
      };
    };
    const objOf = values => {
      const extract = (path, o) => extractFields(path, o, values);
      const toString = () => {
        const fieldStrings = map$2(values, value => fold(value, (key, _okey, _presence, prop) => key + ' -> ' + prop.toString(), (newKey, _instantiator) => 'state(' + newKey + ')'));
        return 'obj{\n' + fieldStrings.join('\n') + '}';
      };
      return {
        extract,
        toString
      };
    };
    const arrOf = prop => {
      const extract = (path, array) => {
        const results = map$2(array, (a, i) => prop.extract(path.concat(['[' + i + ']']), a));
        return ResultCombine.consolidateArr(results);
      };
      const toString = () => 'array(' + prop.toString() + ')';
      return {
        extract,
        toString
      };
    };
    const oneOf = (props, rawF) => {
      const f = rawF !== undefined ? rawF : identity;
      const extract = (path, val) => {
        const errors = [];
        for (const prop of props) {
          const res = prop.extract(path, val);
          if (res.stype === SimpleResultType.Value) {
            return {
              stype: SimpleResultType.Value,
              svalue: f(res.svalue)
            };
          }
          errors.push(res);
        }
        return ResultCombine.consolidateArr(errors);
      };
      const toString = () => 'oneOf(' + map$2(props, prop => prop.toString()).join(', ') + ')';
      return {
        extract,
        toString
      };
    };
    const setOf$1 = (validator, prop) => {
      const validateKeys = (path, keys) => arrOf(value$3(validator)).extract(path, keys);
      const extract = (path, o) => {
        const keys$1 = keys(o);
        const validatedKeys = validateKeys(path, keys$1);
        return SimpleResult.bind(validatedKeys, validKeys => {
          const schema = map$2(validKeys, vk => {
            return field$2(vk, vk, required$2(), prop);
          });
          return objOf(schema).extract(path, o);
        });
      };
      const toString = () => 'setOf(' + prop.toString() + ')';
      return {
        extract,
        toString
      };
    };
    const thunk = (_desc, processor) => {
      const getP = cached(processor);
      const extract = (path, val) => getP().extract(path, val);
      const toString = () => getP().toString();
      return {
        extract,
        toString
      };
    };
    const arrOfObj = compose(arrOf, objOf);

    const anyValue = constant$1(anyValue$1);
    const typedValue = (validator, expectedType) => value$3(a => {
      const actualType = typeof a;
      return validator(a) ? SimpleResult.svalue(a) : SimpleResult.serror(`Expected type: ${ expectedType } but got: ${ actualType }`);
    });
    const number = typedValue(isNumber, 'number');
    const string = typedValue(isString, 'string');
    const boolean = typedValue(isBoolean, 'boolean');
    const functionProcessor = typedValue(isFunction, 'function');
    const isPostMessageable = val => {
      if (Object(val) !== val) {
        return true;
      }
      switch ({}.toString.call(val).slice(8, -1)) {
      case 'Boolean':
      case 'Number':
      case 'String':
      case 'Date':
      case 'RegExp':
      case 'Blob':
      case 'FileList':
      case 'ImageData':
      case 'ImageBitmap':
      case 'ArrayBuffer':
        return true;
      case 'Array':
      case 'Object':
        return Object.keys(val).every(prop => isPostMessageable(val[prop]));
      default:
        return false;
      }
    };
    const postMessageable = value$3(a => {
      if (isPostMessageable(a)) {
        return SimpleResult.svalue(a);
      } else {
        return SimpleResult.serror('Expected value to be acceptable for sending via postMessage');
      }
    });

    const chooseFrom = (path, input, branches, ch) => {
      const fields = get$g(branches, ch);
      return fields.fold(() => missingBranch(path, branches, ch), vp => vp.extract(path.concat(['branch: ' + ch]), input));
    };
    const choose$2 = (key, branches) => {
      const extract = (path, input) => {
        const choice = get$g(input, key);
        return choice.fold(() => missingKey(path, key), chosen => chooseFrom(path, input, branches, chosen));
      };
      const toString = () => 'chooseOn(' + key + '). Possible values: ' + keys(branches);
      return {
        extract,
        toString
      };
    };

    const arrOfVal = () => arrOf(anyValue$1);
    const valueOf = validator => value$3(v => validator(v).fold(SimpleResult.serror, SimpleResult.svalue));
    const setOf = (validator, prop) => setOf$1(v => SimpleResult.fromResult(validator(v)), prop);
    const extractValue = (label, prop, obj) => {
      const res = prop.extract([label], obj);
      return SimpleResult.mapError(res, errs => ({
        input: obj,
        errors: errs
      }));
    };
    const asRaw = (label, prop, obj) => SimpleResult.toResult(extractValue(label, prop, obj));
    const getOrDie = extraction => {
      return extraction.fold(errInfo => {
        throw new Error(formatError(errInfo));
      }, identity);
    };
    const asRawOrDie$1 = (label, prop, obj) => getOrDie(asRaw(label, prop, obj));
    const formatError = errInfo => {
      return 'Errors: \n' + formatErrors(errInfo.errors).join('\n') + '\n\nInput object: ' + formatObj(errInfo.input);
    };
    const choose$1 = (key, branches) => choose$2(key, map$1(branches, objOf));
    const thunkOf = (desc, schema) => thunk(desc, schema);

    const field$1 = field$2;
    const customField = customField$1;
    const validateEnum = values => valueOf(value => contains$2(values, value) ? Result.value(value) : Result.error(`Unsupported value: "${ value }", choose one of "${ values.join(', ') }".`));
    const required$1 = key => field$1(key, key, required$2(), anyValue());
    const requiredOf = (key, schema) => field$1(key, key, required$2(), schema);
    const requiredNumber = key => requiredOf(key, number);
    const requiredString = key => requiredOf(key, string);
    const requiredStringEnum = (key, values) => field$1(key, key, required$2(), validateEnum(values));
    const requiredBoolean = key => requiredOf(key, boolean);
    const requiredFunction = key => requiredOf(key, functionProcessor);
    const forbid = (key, message) => field$1(key, key, asOption(), value$3(_v => SimpleResult.serror('The field: ' + key + ' is forbidden. ' + message)));
    const requiredObjOf = (key, objSchema) => field$1(key, key, required$2(), objOf(objSchema));
    const requiredArrayOfObj = (key, objFields) => field$1(key, key, required$2(), arrOfObj(objFields));
    const requiredArrayOf = (key, schema) => field$1(key, key, required$2(), arrOf(schema));
    const option$3 = key => field$1(key, key, asOption(), anyValue());
    const optionOf = (key, schema) => field$1(key, key, asOption(), schema);
    const optionNumber = key => optionOf(key, number);
    const optionString = key => optionOf(key, string);
    const optionStringEnum = (key, values) => optionOf(key, validateEnum(values));
    const optionFunction = key => optionOf(key, functionProcessor);
    const optionArrayOf = (key, schema) => optionOf(key, arrOf(schema));
    const optionObjOf = (key, objSchema) => optionOf(key, objOf(objSchema));
    const optionObjOfOnly = (key, objSchema) => optionOf(key, objOfOnly(objSchema));
    const defaulted = (key, fallback) => field$1(key, key, defaulted$1(fallback), anyValue());
    const defaultedOf = (key, fallback, schema) => field$1(key, key, defaulted$1(fallback), schema);
    const defaultedNumber = (key, fallback) => defaultedOf(key, fallback, number);
    const defaultedString = (key, fallback) => defaultedOf(key, fallback, string);
    const defaultedStringEnum = (key, fallback, values) => defaultedOf(key, fallback, validateEnum(values));
    const defaultedBoolean = (key, fallback) => defaultedOf(key, fallback, boolean);
    const defaultedFunction = (key, fallback) => defaultedOf(key, fallback, functionProcessor);
    const defaultedPostMsg = (key, fallback) => defaultedOf(key, fallback, postMessageable);
    const defaultedArrayOf = (key, fallback, schema) => defaultedOf(key, fallback, arrOf(schema));
    const defaultedObjOf = (key, fallback, objSchema) => defaultedOf(key, fallback, objOf(objSchema));

    const Cell = initial => {
      let value = initial;
      const get = () => {
        return value;
      };
      const set = v => {
        value = v;
      };
      return {
        get,
        set
      };
    };

    const generate$7 = cases => {
      if (!isArray(cases)) {
        throw new Error('cases must be an array');
      }
      if (cases.length === 0) {
        throw new Error('there must be at least one case');
      }
      const constructors = [];
      const adt = {};
      each$1(cases, (acase, count) => {
        const keys$1 = keys(acase);
        if (keys$1.length !== 1) {
          throw new Error('one and only one name per case');
        }
        const key = keys$1[0];
        const value = acase[key];
        if (adt[key] !== undefined) {
          throw new Error('duplicate key detected:' + key);
        } else if (key === 'cata') {
          throw new Error('cannot have a case named cata (sorry)');
        } else if (!isArray(value)) {
          throw new Error('case arguments must be an array');
        }
        constructors.push(key);
        adt[key] = (...args) => {
          const argLength = args.length;
          if (argLength !== value.length) {
            throw new Error('Wrong number of arguments to case ' + key + '. Expected ' + value.length + ' (' + value + '), got ' + argLength);
          }
          const match = branches => {
            const branchKeys = keys(branches);
            if (constructors.length !== branchKeys.length) {
              throw new Error('Wrong number of arguments to match. Expected: ' + constructors.join(',') + '\nActual: ' + branchKeys.join(','));
            }
            const allReqd = forall(constructors, reqKey => {
              return contains$2(branchKeys, reqKey);
            });
            if (!allReqd) {
              throw new Error('Not all branches were specified when using match. Specified: ' + branchKeys.join(', ') + '\nRequired: ' + constructors.join(', '));
            }
            return branches[key].apply(null, args);
          };
          return {
            fold: (...foldArgs) => {
              if (foldArgs.length !== cases.length) {
                throw new Error('Wrong number of arguments to fold. Expected ' + cases.length + ', got ' + foldArgs.length);
              }
              const target = foldArgs[count];
              return target.apply(null, args);
            },
            match,
            log: label => {
              console.log(label, {
                constructors,
                constructor: key,
                params: args
              });
            }
          };
        };
      });
      return adt;
    };
    const Adt = { generate: generate$7 };

    Adt.generate([
      {
        bothErrors: [
          'error1',
          'error2'
        ]
      },
      {
        firstError: [
          'error1',
          'value2'
        ]
      },
      {
        secondError: [
          'value1',
          'error2'
        ]
      },
      {
        bothValues: [
          'value1',
          'value2'
        ]
      }
    ]);
    const partition$1 = results => {
      const errors = [];
      const values = [];
      each$1(results, result => {
        result.fold(err => {
          errors.push(err);
        }, value => {
          values.push(value);
        });
      });
      return {
        errors,
        values
      };
    };

    const exclude$1 = (obj, fields) => {
      const r = {};
      each(obj, (v, k) => {
        if (!contains$2(fields, k)) {
          r[k] = v;
        }
      });
      return r;
    };

    const wrap$2 = (key, value) => ({ [key]: value });
    const wrapAll$1 = keyvalues => {
      const r = {};
      each$1(keyvalues, kv => {
        r[kv.key] = kv.value;
      });
      return r;
    };

    const exclude = (obj, fields) => exclude$1(obj, fields);
    const wrap$1 = (key, value) => wrap$2(key, value);
    const wrapAll = keyvalues => wrapAll$1(keyvalues);
    const mergeValues = (values, base) => {
      return values.length === 0 ? Result.value(base) : Result.value(deepMerge(base, merge$1.apply(undefined, values)));
    };
    const mergeErrors = errors => Result.error(flatten(errors));
    const consolidate = (objs, base) => {
      const partitions = partition$1(objs);
      return partitions.errors.length > 0 ? mergeErrors(partitions.errors) : mergeValues(partitions.values, base);
    };

    const ensureIsRoot = isRoot => isFunction(isRoot) ? isRoot : never;
    const ancestor$2 = (scope, transform, isRoot) => {
      let element = scope.dom;
      const stop = ensureIsRoot(isRoot);
      while (element.parentNode) {
        element = element.parentNode;
        const el = SugarElement.fromDom(element);
        const transformed = transform(el);
        if (transformed.isSome()) {
          return transformed;
        } else if (stop(el)) {
          break;
        }
      }
      return Optional.none();
    };
    const closest$4 = (scope, transform, isRoot) => {
      const current = transform(scope);
      const stop = ensureIsRoot(isRoot);
      return current.orThunk(() => stop(scope) ? Optional.none() : ancestor$2(scope, transform, stop));
    };

    const isSource = (component, simulatedEvent) => eq(component.element, simulatedEvent.event.target);

    const defaultEventHandler = {
      can: always,
      abort: never,
      run: noop
    };
    const nu$9 = parts => {
      if (!hasNonNullableKey(parts, 'can') && !hasNonNullableKey(parts, 'abort') && !hasNonNullableKey(parts, 'run')) {
        throw new Error('EventHandler defined by: ' + JSON.stringify(parts, null, 2) + ' does not have can, abort, or run!');
      }
      return {
        ...defaultEventHandler,
        ...parts
      };
    };
    const all$2 = (handlers, f) => (...args) => foldl(handlers, (acc, handler) => acc && f(handler).apply(undefined, args), true);
    const any = (handlers, f) => (...args) => foldl(handlers, (acc, handler) => acc || f(handler).apply(undefined, args), false);
    const read$2 = handler => isFunction(handler) ? {
      can: always,
      abort: never,
      run: handler
    } : handler;
    const fuse$1 = handlers => {
      const can = all$2(handlers, handler => handler.can);
      const abort = any(handlers, handler => handler.abort);
      const run = (...args) => {
        each$1(handlers, handler => {
          handler.run.apply(undefined, args);
        });
      };
      return {
        can,
        abort,
        run
      };
    };

    const constant = constant$1;
    const touchstart = constant('touchstart');
    const touchmove = constant('touchmove');
    const touchend = constant('touchend');
    const touchcancel = constant('touchcancel');
    const mousedown = constant('mousedown');
    const mousemove = constant('mousemove');
    const mouseout = constant('mouseout');
    const mouseup = constant('mouseup');
    const mouseover = constant('mouseover');
    const focusin = constant('focusin');
    const focusout = constant('focusout');
    const keydown = constant('keydown');
    const keyup = constant('keyup');
    const input = constant('input');
    const change = constant('change');
    const click = constant('click');
    const transitioncancel = constant('transitioncancel');
    const transitionend = constant('transitionend');
    const transitionstart = constant('transitionstart');
    const selectstart = constant('selectstart');

    const prefixName = name => constant$1('alloy.' + name);
    const alloy = { tap: prefixName('tap') };
    const focus$4 = prefixName('focus');
    const postBlur = prefixName('blur.post');
    const postPaste = prefixName('paste.post');
    const receive = prefixName('receive');
    const execute$5 = prefixName('execute');
    const focusItem = prefixName('focus.item');
    const tap = alloy.tap;
    const longpress = prefixName('longpress');
    const sandboxClose = prefixName('sandbox.close');
    const typeaheadCancel = prefixName('typeahead.cancel');
    const systemInit = prefixName('system.init');
    const documentTouchmove = prefixName('system.touchmove');
    const documentTouchend = prefixName('system.touchend');
    const windowScroll = prefixName('system.scroll');
    const windowResize = prefixName('system.resize');
    const attachedToDom = prefixName('system.attached');
    const detachedFromDom = prefixName('system.detached');
    const dismissRequested = prefixName('system.dismissRequested');
    const repositionRequested = prefixName('system.repositionRequested');
    const focusShifted = prefixName('focusmanager.shifted');
    const slotVisibility = prefixName('slotcontainer.visibility');
    const changeTab = prefixName('change.tab');
    const dismissTab = prefixName('dismiss.tab');
    const highlight$1 = prefixName('highlight');
    const dehighlight$1 = prefixName('dehighlight');

    const emit = (component, event) => {
      dispatchWith(component, component.element, event, {});
    };
    const emitWith = (component, event, properties) => {
      dispatchWith(component, component.element, event, properties);
    };
    const emitExecute = component => {
      emit(component, execute$5());
    };
    const dispatch = (component, target, event) => {
      dispatchWith(component, target, event, {});
    };
    const dispatchWith = (component, target, event, properties) => {
      const data = {
        target,
        ...properties
      };
      component.getSystem().triggerEvent(event, target, data);
    };
    const retargetAndDispatchWith = (component, target, eventName, properties) => {
      const data = {
        ...properties,
        target
      };
      component.getSystem().triggerEvent(eventName, target, data);
    };
    const dispatchEvent = (component, target, event, simulatedEvent) => {
      component.getSystem().triggerEvent(event, target, simulatedEvent.event);
    };

    const derive$2 = configs => wrapAll(configs);
    const abort = (name, predicate) => {
      return {
        key: name,
        value: nu$9({ abort: predicate })
      };
    };
    const can = (name, predicate) => {
      return {
        key: name,
        value: nu$9({ can: predicate })
      };
    };
    const preventDefault = name => {
      return {
        key: name,
        value: nu$9({
          run: (component, simulatedEvent) => {
            simulatedEvent.event.prevent();
          }
        })
      };
    };
    const run$1 = (name, handler) => {
      return {
        key: name,
        value: nu$9({ run: handler })
      };
    };
    const runActionExtra = (name, action, extra) => {
      return {
        key: name,
        value: nu$9({
          run: (component, simulatedEvent) => {
            action.apply(undefined, [
              component,
              simulatedEvent
            ].concat(extra));
          }
        })
      };
    };
    const runOnName = name => {
      return handler => run$1(name, handler);
    };
    const runOnSourceName = name => {
      return handler => ({
        key: name,
        value: nu$9({
          run: (component, simulatedEvent) => {
            if (isSource(component, simulatedEvent)) {
              handler(component, simulatedEvent);
            }
          }
        })
      });
    };
    const redirectToUid = (name, uid) => {
      return run$1(name, (component, simulatedEvent) => {
        component.getSystem().getByUid(uid).each(redirectee => {
          dispatchEvent(redirectee, redirectee.element, name, simulatedEvent);
        });
      });
    };
    const redirectToPart = (name, detail, partName) => {
      const uid = detail.partUids[partName];
      return redirectToUid(name, uid);
    };
    const runWithTarget = (name, f) => {
      return run$1(name, (component, simulatedEvent) => {
        const ev = simulatedEvent.event;
        const target = component.getSystem().getByDom(ev.target).getOrThunk(() => {
          const closest = closest$4(ev.target, el => component.getSystem().getByDom(el).toOptional(), never);
          return closest.getOr(component);
        });
        f(component, target, simulatedEvent);
      });
    };
    const cutter = name => {
      return run$1(name, (component, simulatedEvent) => {
        simulatedEvent.cut();
      });
    };
    const stopper = name => {
      return run$1(name, (component, simulatedEvent) => {
        simulatedEvent.stop();
      });
    };
    const runOnSource = (name, f) => {
      return runOnSourceName(name)(f);
    };
    const runOnAttached = runOnSourceName(attachedToDom());
    const runOnDetached = runOnSourceName(detachedFromDom());
    const runOnInit = runOnSourceName(systemInit());
    const runOnExecute$1 = runOnName(execute$5());

    const fromHtml$1 = (html, scope) => {
      const doc = scope || document;
      const div = doc.createElement('div');
      div.innerHTML = html;
      return children(SugarElement.fromDom(div));
    };

    const get$9 = element => element.dom.innerHTML;
    const set$6 = (element, content) => {
      const owner = owner$4(element);
      const docDom = owner.dom;
      const fragment = SugarElement.fromDom(docDom.createDocumentFragment());
      const contentElements = fromHtml$1(content, docDom);
      append$1(fragment, contentElements);
      empty(element);
      append$2(element, fragment);
    };
    const getOuter = element => {
      const container = SugarElement.fromTag('div');
      const clone = SugarElement.fromDom(element.dom.cloneNode(true));
      append$2(container, clone);
      return get$9(container);
    };

    const clone = (original, isDeep) => SugarElement.fromDom(original.dom.cloneNode(isDeep));
    const shallow = original => clone(original, false);

    const getHtml = element => {
      if (isShadowRoot(element)) {
        return '#shadow-root';
      } else {
        const clone = shallow(element);
        return getOuter(clone);
      }
    };

    const element = elem => getHtml(elem);

    const isRecursive = (component, originator, target) => eq(originator, component.element) && !eq(originator, target);
    const events$i = derive$2([can(focus$4(), (component, simulatedEvent) => {
        const event = simulatedEvent.event;
        const originator = event.originator;
        const target = event.target;
        if (isRecursive(component, originator, target)) {
          console.warn(focus$4() + ' did not get interpreted by the desired target. ' + '\nOriginator: ' + element(originator) + '\nTarget: ' + element(target) + '\nCheck the ' + focus$4() + ' event handlers');
          return false;
        } else {
          return true;
        }
      })]);

    var DefaultEvents = /*#__PURE__*/Object.freeze({
        __proto__: null,
        events: events$i
    });

    let unique = 0;
    const generate$6 = prefix => {
      const date = new Date();
      const time = date.getTime();
      const random = Math.floor(Math.random() * 1000000000);
      unique++;
      return prefix + '_' + random + unique + String(time);
    };

    const prefix$1 = constant$1('alloy-id-');
    const idAttr$1 = constant$1('data-alloy-id');

    const prefix = prefix$1();
    const idAttr = idAttr$1();
    const write = (label, elem) => {
      const id = generate$6(prefix + label);
      writeOnly(elem, id);
      return id;
    };
    const writeOnly = (elem, uid) => {
      Object.defineProperty(elem.dom, idAttr, {
        value: uid,
        writable: true
      });
    };
    const read$1 = elem => {
      const id = isElement$1(elem) ? elem.dom[idAttr] : null;
      return Optional.from(id);
    };
    const generate$5 = prefix => generate$6(prefix);

    const make$8 = identity;

    const NoContextApi = getComp => {
      const getMessage = event => `The component must be in a context to execute: ${ event }` + (getComp ? '\n' + element(getComp().element) + ' is not in context.' : '');
      const fail = event => () => {
        throw new Error(getMessage(event));
      };
      const warn = event => () => {
        console.warn(getMessage(event));
      };
      return {
        debugInfo: constant$1('fake'),
        triggerEvent: warn('triggerEvent'),
        triggerFocus: warn('triggerFocus'),
        triggerEscape: warn('triggerEscape'),
        broadcast: warn('broadcast'),
        broadcastOn: warn('broadcastOn'),
        broadcastEvent: warn('broadcastEvent'),
        build: fail('build'),
        buildOrPatch: fail('buildOrPatch'),
        addToWorld: fail('addToWorld'),
        removeFromWorld: fail('removeFromWorld'),
        addToGui: fail('addToGui'),
        removeFromGui: fail('removeFromGui'),
        getByUid: fail('getByUid'),
        getByDom: fail('getByDom'),
        isConnected: never
      };
    };
    const singleton$1 = NoContextApi();

    const markAsBehaviourApi = (f, apiName, apiFunction) => {
      const delegate = apiFunction.toString();
      const endIndex = delegate.indexOf(')') + 1;
      const openBracketIndex = delegate.indexOf('(');
      const parameters = delegate.substring(openBracketIndex + 1, endIndex - 1).split(/,\s*/);
      f.toFunctionAnnotation = () => ({
        name: apiName,
        parameters: cleanParameters(parameters.slice(0, 1).concat(parameters.slice(3)))
      });
      return f;
    };
    const cleanParameters = parameters => map$2(parameters, p => endsWith(p, '/*') ? p.substring(0, p.length - '/*'.length) : p);
    const markAsExtraApi = (f, extraName) => {
      const delegate = f.toString();
      const endIndex = delegate.indexOf(')') + 1;
      const openBracketIndex = delegate.indexOf('(');
      const parameters = delegate.substring(openBracketIndex + 1, endIndex - 1).split(/,\s*/);
      f.toFunctionAnnotation = () => ({
        name: extraName,
        parameters: cleanParameters(parameters)
      });
      return f;
    };
    const markAsSketchApi = (f, apiFunction) => {
      const delegate = apiFunction.toString();
      const endIndex = delegate.indexOf(')') + 1;
      const openBracketIndex = delegate.indexOf('(');
      const parameters = delegate.substring(openBracketIndex + 1, endIndex - 1).split(/,\s*/);
      f.toFunctionAnnotation = () => ({
        name: 'OVERRIDE',
        parameters: cleanParameters(parameters.slice(1))
      });
      return f;
    };

    const premadeTag = generate$6('alloy-premade');
    const premade$1 = comp => {
      Object.defineProperty(comp.element.dom, premadeTag, {
        value: comp.uid,
        writable: true
      });
      return wrap$1(premadeTag, comp);
    };
    const isPremade = element => has$2(element.dom, premadeTag);
    const getPremade = spec => get$g(spec, premadeTag);
    const makeApi = f => markAsSketchApi((component, ...rest) => f(component.getApis(), component, ...rest), f);

    const NoState = { init: () => nu$8({ readState: constant$1('No State required') }) };
    const nu$8 = spec => spec;

    const generateFrom$1 = (spec, all) => {
      const schema = map$2(all, a => optionObjOf(a.name(), [
        required$1('config'),
        defaulted('state', NoState)
      ]));
      const validated = asRaw('component.behaviours', objOf(schema), spec.behaviours).fold(errInfo => {
        throw new Error(formatError(errInfo) + '\nComplete spec:\n' + JSON.stringify(spec, null, 2));
      }, identity);
      return {
        list: all,
        data: map$1(validated, optBlobThunk => {
          const output = optBlobThunk.map(blob => ({
            config: blob.config,
            state: blob.state.init(blob.config)
          }));
          return constant$1(output);
        })
      };
    };
    const getBehaviours$3 = bData => bData.list;
    const getData$2 = bData => bData.data;

    const byInnerKey = (data, tuple) => {
      const r = {};
      each(data, (detail, key) => {
        each(detail, (value, indexKey) => {
          const chain = get$g(r, indexKey).getOr([]);
          r[indexKey] = chain.concat([tuple(key, value)]);
        });
      });
      return r;
    };

    const nu$7 = s => ({
      classes: isUndefined(s.classes) ? [] : s.classes,
      attributes: isUndefined(s.attributes) ? {} : s.attributes,
      styles: isUndefined(s.styles) ? {} : s.styles
    });
    const merge = (defnA, mod) => ({
      ...defnA,
      attributes: {
        ...defnA.attributes,
        ...mod.attributes
      },
      styles: {
        ...defnA.styles,
        ...mod.styles
      },
      classes: defnA.classes.concat(mod.classes)
    });

    const combine$2 = (info, baseMod, behaviours, base) => {
      const modsByBehaviour = { ...baseMod };
      each$1(behaviours, behaviour => {
        modsByBehaviour[behaviour.name()] = behaviour.exhibit(info, base);
      });
      const byAspect = byInnerKey(modsByBehaviour, (name, modification) => ({
        name,
        modification
      }));
      const combineObjects = objects => foldr(objects, (b, a) => ({
        ...a.modification,
        ...b
      }), {});
      const combinedClasses = foldr(byAspect.classes, (b, a) => a.modification.concat(b), []);
      const combinedAttributes = combineObjects(byAspect.attributes);
      const combinedStyles = combineObjects(byAspect.styles);
      return nu$7({
        classes: combinedClasses,
        attributes: combinedAttributes,
        styles: combinedStyles
      });
    };

    const sortKeys = (label, keyName, array, order) => {
      try {
        const sorted = sort(array, (a, b) => {
          const aKey = a[keyName];
          const bKey = b[keyName];
          const aIndex = order.indexOf(aKey);
          const bIndex = order.indexOf(bKey);
          if (aIndex === -1) {
            throw new Error('The ordering for ' + label + ' does not have an entry for ' + aKey + '.\nOrder specified: ' + JSON.stringify(order, null, 2));
          }
          if (bIndex === -1) {
            throw new Error('The ordering for ' + label + ' does not have an entry for ' + bKey + '.\nOrder specified: ' + JSON.stringify(order, null, 2));
          }
          if (aIndex < bIndex) {
            return -1;
          } else if (bIndex < aIndex) {
            return 1;
          } else {
            return 0;
          }
        });
        return Result.value(sorted);
      } catch (err) {
        return Result.error([err]);
      }
    };

    const uncurried = (handler, purpose) => ({
      handler,
      purpose
    });
    const curried = (handler, purpose) => ({
      cHandler: handler,
      purpose
    });
    const curryArgs = (descHandler, extraArgs) => curried(curry.apply(undefined, [descHandler.handler].concat(extraArgs)), descHandler.purpose);
    const getCurried = descHandler => descHandler.cHandler;

    const behaviourTuple = (name, handler) => ({
      name,
      handler
    });
    const nameToHandlers = (behaviours, info) => {
      const r = {};
      each$1(behaviours, behaviour => {
        r[behaviour.name()] = behaviour.handlers(info);
      });
      return r;
    };
    const groupByEvents = (info, behaviours, base) => {
      const behaviourEvents = {
        ...base,
        ...nameToHandlers(behaviours, info)
      };
      return byInnerKey(behaviourEvents, behaviourTuple);
    };
    const combine$1 = (info, eventOrder, behaviours, base) => {
      const byEventName = groupByEvents(info, behaviours, base);
      return combineGroups(byEventName, eventOrder);
    };
    const assemble = rawHandler => {
      const handler = read$2(rawHandler);
      return (component, simulatedEvent, ...rest) => {
        const args = [
          component,
          simulatedEvent
        ].concat(rest);
        if (handler.abort.apply(undefined, args)) {
          simulatedEvent.stop();
        } else if (handler.can.apply(undefined, args)) {
          handler.run.apply(undefined, args);
        }
      };
    };
    const missingOrderError = (eventName, tuples) => Result.error(['The event (' + eventName + ') has more than one behaviour that listens to it.\nWhen this occurs, you must ' + 'specify an event ordering for the behaviours in your spec (e.g. [ "listing", "toggling" ]).\nThe behaviours that ' + 'can trigger it are: ' + JSON.stringify(map$2(tuples, c => c.name), null, 2)]);
    const fuse = (tuples, eventOrder, eventName) => {
      const order = eventOrder[eventName];
      if (!order) {
        return missingOrderError(eventName, tuples);
      } else {
        return sortKeys('Event: ' + eventName, 'name', tuples, order).map(sortedTuples => {
          const handlers = map$2(sortedTuples, tuple => tuple.handler);
          return fuse$1(handlers);
        });
      }
    };
    const combineGroups = (byEventName, eventOrder) => {
      const r = mapToArray(byEventName, (tuples, eventName) => {
        const combined = tuples.length === 1 ? Result.value(tuples[0].handler) : fuse(tuples, eventOrder, eventName);
        return combined.map(handler => {
          const assembled = assemble(handler);
          const purpose = tuples.length > 1 ? filter$2(eventOrder[eventName], o => exists(tuples, t => t.name === o)).join(' > ') : tuples[0].name;
          return wrap$1(eventName, uncurried(assembled, purpose));
        });
      });
      return consolidate(r, {});
    };

    const baseBehaviour = 'alloy.base.behaviour';
    const schema$z = objOf([
      field$1('dom', 'dom', required$2(), objOf([
        required$1('tag'),
        defaulted('styles', {}),
        defaulted('classes', []),
        defaulted('attributes', {}),
        option$3('value'),
        option$3('innerHtml')
      ])),
      required$1('components'),
      required$1('uid'),
      defaulted('events', {}),
      defaulted('apis', {}),
      field$1('eventOrder', 'eventOrder', mergeWith({
        [execute$5()]: [
          'disabling',
          baseBehaviour,
          'toggling',
          'typeaheadevents'
        ],
        [focus$4()]: [
          baseBehaviour,
          'focusing',
          'keying'
        ],
        [systemInit()]: [
          baseBehaviour,
          'disabling',
          'toggling',
          'representing'
        ],
        [input()]: [
          baseBehaviour,
          'representing',
          'streaming',
          'invalidating'
        ],
        [detachedFromDom()]: [
          baseBehaviour,
          'representing',
          'item-events',
          'tooltipping'
        ],
        [mousedown()]: [
          'focusing',
          baseBehaviour,
          'item-type-events'
        ],
        [touchstart()]: [
          'focusing',
          baseBehaviour,
          'item-type-events'
        ],
        [mouseover()]: [
          'item-type-events',
          'tooltipping'
        ],
        [receive()]: [
          'receiving',
          'reflecting',
          'tooltipping'
        ]
      }), anyValue()),
      option$3('domModification')
    ]);
    const toInfo = spec => asRaw('custom.definition', schema$z, spec);
    const toDefinition = detail => ({
      ...detail.dom,
      uid: detail.uid,
      domChildren: map$2(detail.components, comp => comp.element)
    });
    const toModification = detail => detail.domModification.fold(() => nu$7({}), nu$7);
    const toEvents = info => info.events;

    const read = (element, attr) => {
      const value = get$f(element, attr);
      return value === undefined || value === '' ? [] : value.split(' ');
    };
    const add$4 = (element, attr, id) => {
      const old = read(element, attr);
      const nu = old.concat([id]);
      set$9(element, attr, nu.join(' '));
      return true;
    };
    const remove$4 = (element, attr, id) => {
      const nu = filter$2(read(element, attr), v => v !== id);
      if (nu.length > 0) {
        set$9(element, attr, nu.join(' '));
      } else {
        remove$7(element, attr);
      }
      return false;
    };

    const supports = element => element.dom.classList !== undefined;
    const get$8 = element => read(element, 'class');
    const add$3 = (element, clazz) => add$4(element, 'class', clazz);
    const remove$3 = (element, clazz) => remove$4(element, 'class', clazz);

    const add$2 = (element, clazz) => {
      if (supports(element)) {
        element.dom.classList.add(clazz);
      } else {
        add$3(element, clazz);
      }
    };
    const cleanClass = element => {
      const classList = supports(element) ? element.dom.classList : get$8(element);
      if (classList.length === 0) {
        remove$7(element, 'class');
      }
    };
    const remove$2 = (element, clazz) => {
      if (supports(element)) {
        const classList = element.dom.classList;
        classList.remove(clazz);
      } else {
        remove$3(element, clazz);
      }
      cleanClass(element);
    };
    const has = (element, clazz) => supports(element) && element.dom.classList.contains(clazz);

    const add$1 = (element, classes) => {
      each$1(classes, x => {
        add$2(element, x);
      });
    };
    const remove$1 = (element, classes) => {
      each$1(classes, x => {
        remove$2(element, x);
      });
    };
    const hasAll = (element, classes) => forall(classes, clazz => has(element, clazz));
    const getNative = element => {
      const classList = element.dom.classList;
      const r = new Array(classList.length);
      for (let i = 0; i < classList.length; i++) {
        const item = classList.item(i);
        if (item !== null) {
          r[i] = item;
        }
      }
      return r;
    };
    const get$7 = element => supports(element) ? getNative(element) : get$8(element);

    const get$6 = element => element.dom.value;
    const set$5 = (element, value) => {
      if (value === undefined) {
        throw new Error('Value.set was undefined');
      }
      element.dom.value = value;
    };

    const determineObsoleted = (parent, index, oldObsoleted) => {
      const newObsoleted = child$2(parent, index);
      return newObsoleted.map(newObs => {
        const elemChanged = oldObsoleted.exists(o => !eq(o, newObs));
        if (elemChanged) {
          const oldTag = oldObsoleted.map(name$3).getOr('span');
          const marker = SugarElement.fromTag(oldTag);
          before$1(newObs, marker);
          return marker;
        } else {
          return newObs;
        }
      });
    };
    const ensureInDom = (parent, child, obsoleted) => {
      obsoleted.fold(() => append$2(parent, child), obs => {
        if (!eq(obs, child)) {
          before$1(obs, child);
          remove$5(obs);
        }
      });
    };
    const patchChildrenWith = (parent, nu, f) => {
      const builtChildren = map$2(nu, f);
      const currentChildren = children(parent);
      each$1(currentChildren.slice(builtChildren.length), remove$5);
      return builtChildren;
    };
    const patchSpecChild = (parent, index, spec, build) => {
      const oldObsoleted = child$2(parent, index);
      const childComp = build(spec, oldObsoleted);
      const obsoleted = determineObsoleted(parent, index, oldObsoleted);
      ensureInDom(parent, childComp.element, obsoleted);
      return childComp;
    };
    const patchSpecChildren = (parent, specs, build) => patchChildrenWith(parent, specs, (spec, index) => patchSpecChild(parent, index, spec, build));
    const patchDomChildren = (parent, nodes) => patchChildrenWith(parent, nodes, (node, index) => {
      const optObsoleted = child$2(parent, index);
      ensureInDom(parent, node, optObsoleted);
      return node;
    });

    const diffKeyValueSet = (newObj, oldObj) => {
      const newKeys = keys(newObj);
      const oldKeys = keys(oldObj);
      const toRemove = difference(oldKeys, newKeys);
      const toSet = bifilter(newObj, (v, k) => {
        return !has$2(oldObj, k) || v !== oldObj[k];
      }).t;
      return {
        toRemove,
        toSet
      };
    };
    const reconcileToDom = (definition, obsoleted) => {
      const {
        class: clazz,
        style,
        ...existingAttributes
      } = clone$1(obsoleted);
      const {
        toSet: attrsToSet,
        toRemove: attrsToRemove
      } = diffKeyValueSet(definition.attributes, existingAttributes);
      const updateAttrs = () => {
        each$1(attrsToRemove, a => remove$7(obsoleted, a));
        setAll$1(obsoleted, attrsToSet);
      };
      const existingStyles = getAllRaw(obsoleted);
      const {
        toSet: stylesToSet,
        toRemove: stylesToRemove
      } = diffKeyValueSet(definition.styles, existingStyles);
      const updateStyles = () => {
        each$1(stylesToRemove, s => remove$6(obsoleted, s));
        setAll(obsoleted, stylesToSet);
      };
      const existingClasses = get$7(obsoleted);
      const classesToRemove = difference(existingClasses, definition.classes);
      const classesToAdd = difference(definition.classes, existingClasses);
      const updateClasses = () => {
        add$1(obsoleted, classesToAdd);
        remove$1(obsoleted, classesToRemove);
      };
      const updateHtml = html => {
        set$6(obsoleted, html);
      };
      const updateChildren = () => {
        const children = definition.domChildren;
        patchDomChildren(obsoleted, children);
      };
      const updateValue = () => {
        const valueElement = obsoleted;
        const value = definition.value.getOrUndefined();
        if (value !== get$6(valueElement)) {
          set$5(valueElement, value !== null && value !== void 0 ? value : '');
        }
      };
      updateAttrs();
      updateClasses();
      updateStyles();
      definition.innerHtml.fold(updateChildren, updateHtml);
      updateValue();
      return obsoleted;
    };

    const introduceToDom = definition => {
      const subject = SugarElement.fromTag(definition.tag);
      setAll$1(subject, definition.attributes);
      add$1(subject, definition.classes);
      setAll(subject, definition.styles);
      definition.innerHtml.each(html => set$6(subject, html));
      const children = definition.domChildren;
      append$1(subject, children);
      definition.value.each(value => {
        set$5(subject, value);
      });
      return subject;
    };
    const attemptPatch = (definition, obsoleted) => {
      try {
        const e = reconcileToDom(definition, obsoleted);
        return Optional.some(e);
      } catch (err) {
        return Optional.none();
      }
    };
    const hasMixedChildren = definition => definition.innerHtml.isSome() && definition.domChildren.length > 0;
    const renderToDom = (definition, optObsoleted) => {
      const canBePatched = candidate => name$3(candidate) === definition.tag && !hasMixedChildren(definition) && !isPremade(candidate);
      const elem = optObsoleted.filter(canBePatched).bind(obsoleted => attemptPatch(definition, obsoleted)).getOrThunk(() => introduceToDom(definition));
      writeOnly(elem, definition.uid);
      return elem;
    };

    const getBehaviours$2 = spec => {
      const behaviours = get$g(spec, 'behaviours').getOr({});
      return bind$3(keys(behaviours), name => {
        const behaviour = behaviours[name];
        return isNonNullable(behaviour) ? [behaviour.me] : [];
      });
    };
    const generateFrom = (spec, all) => generateFrom$1(spec, all);
    const generate$4 = spec => {
      const all = getBehaviours$2(spec);
      return generateFrom(spec, all);
    };

    const getDomDefinition = (info, bList, bData) => {
      const definition = toDefinition(info);
      const infoModification = toModification(info);
      const baseModification = { 'alloy.base.modification': infoModification };
      const modification = bList.length > 0 ? combine$2(bData, baseModification, bList, definition) : infoModification;
      return merge(definition, modification);
    };
    const getEvents = (info, bList, bData) => {
      const baseEvents = { 'alloy.base.behaviour': toEvents(info) };
      return combine$1(bData, info.eventOrder, bList, baseEvents).getOrDie();
    };
    const build$2 = (spec, obsoleted) => {
      const getMe = () => me;
      const systemApi = Cell(singleton$1);
      const info = getOrDie(toInfo(spec));
      const bBlob = generate$4(spec);
      const bList = getBehaviours$3(bBlob);
      const bData = getData$2(bBlob);
      const modDefinition = getDomDefinition(info, bList, bData);
      const item = renderToDom(modDefinition, obsoleted);
      const events = getEvents(info, bList, bData);
      const subcomponents = Cell(info.components);
      const connect = newApi => {
        systemApi.set(newApi);
      };
      const disconnect = () => {
        systemApi.set(NoContextApi(getMe));
      };
      const syncComponents = () => {
        const children$1 = children(item);
        const subs = bind$3(children$1, child => systemApi.get().getByDom(child).fold(() => [], pure$2));
        subcomponents.set(subs);
      };
      const config = behaviour => {
        const b = bData;
        const f = isFunction(b[behaviour.name()]) ? b[behaviour.name()] : () => {
          throw new Error('Could not find ' + behaviour.name() + ' in ' + JSON.stringify(spec, null, 2));
        };
        return f();
      };
      const hasConfigured = behaviour => isFunction(bData[behaviour.name()]);
      const getApis = () => info.apis;
      const readState = behaviourName => bData[behaviourName]().map(b => b.state.readState()).getOr('not enabled');
      const me = {
        uid: spec.uid,
        getSystem: systemApi.get,
        config,
        hasConfigured,
        spec,
        readState,
        getApis,
        connect,
        disconnect,
        element: item,
        syncComponents,
        components: subcomponents.get,
        events
      };
      return me;
    };

    const buildSubcomponents = (spec, obsoleted) => {
      const components = get$g(spec, 'components').getOr([]);
      return obsoleted.fold(() => map$2(components, build$1), obs => map$2(components, (c, i) => {
        return buildOrPatch(c, child$2(obs, i));
      }));
    };
    const buildFromSpec = (userSpec, obsoleted) => {
      const {
        events: specEvents,
        ...spec
      } = make$8(userSpec);
      const components = buildSubcomponents(spec, obsoleted);
      const completeSpec = {
        ...spec,
        events: {
          ...DefaultEvents,
          ...specEvents
        },
        components
      };
      return Result.value(build$2(completeSpec, obsoleted));
    };
    const text$1 = textContent => {
      const element = SugarElement.fromText(textContent);
      return external$1({ element });
    };
    const external$1 = spec => {
      const extSpec = asRawOrDie$1('external.component', objOfOnly([
        required$1('element'),
        option$3('uid')
      ]), spec);
      const systemApi = Cell(NoContextApi());
      const connect = newApi => {
        systemApi.set(newApi);
      };
      const disconnect = () => {
        systemApi.set(NoContextApi(() => me));
      };
      const uid = extSpec.uid.getOrThunk(() => generate$5('external'));
      writeOnly(extSpec.element, uid);
      const me = {
        uid,
        getSystem: systemApi.get,
        config: Optional.none,
        hasConfigured: never,
        connect,
        disconnect,
        getApis: () => ({}),
        element: extSpec.element,
        spec,
        readState: constant$1('No state'),
        syncComponents: noop,
        components: constant$1([]),
        events: {}
      };
      return premade$1(me);
    };
    const uids = generate$5;
    const isSketchSpec$1 = spec => has$2(spec, 'uid');
    const buildOrPatch = (spec, obsoleted) => getPremade(spec).getOrThunk(() => {
      const userSpecWithUid = isSketchSpec$1(spec) ? spec : {
        uid: uids(''),
        ...spec
      };
      return buildFromSpec(userSpecWithUid, obsoleted).getOrDie();
    });
    const build$1 = spec => buildOrPatch(spec, Optional.none());
    const premade = premade$1;

    var ClosestOrAncestor = (is, ancestor, scope, a, isRoot) => {
      if (is(scope, a)) {
        return Optional.some(scope);
      } else if (isFunction(isRoot) && isRoot(scope)) {
        return Optional.none();
      } else {
        return ancestor(scope, a, isRoot);
      }
    };

    const ancestor$1 = (scope, predicate, isRoot) => {
      let element = scope.dom;
      const stop = isFunction(isRoot) ? isRoot : never;
      while (element.parentNode) {
        element = element.parentNode;
        const el = SugarElement.fromDom(element);
        if (predicate(el)) {
          return Optional.some(el);
        } else if (stop(el)) {
          break;
        }
      }
      return Optional.none();
    };
    const closest$3 = (scope, predicate, isRoot) => {
      const is = (s, test) => test(s);
      return ClosestOrAncestor(is, ancestor$1, scope, predicate, isRoot);
    };
    const child$1 = (scope, predicate) => {
      const pred = node => predicate(SugarElement.fromDom(node));
      const result = find$5(scope.dom.childNodes, pred);
      return result.map(SugarElement.fromDom);
    };
    const descendant$1 = (scope, predicate) => {
      const descend = node => {
        for (let i = 0; i < node.childNodes.length; i++) {
          const child = SugarElement.fromDom(node.childNodes[i]);
          if (predicate(child)) {
            return Optional.some(child);
          }
          const res = descend(node.childNodes[i]);
          if (res.isSome()) {
            return res;
          }
        }
        return Optional.none();
      };
      return descend(scope.dom);
    };

    const closest$2 = (scope, predicate, isRoot) => closest$3(scope, predicate, isRoot).isSome();

    const ancestor = (scope, selector, isRoot) => ancestor$1(scope, e => is(e, selector), isRoot);
    const child = (scope, selector) => child$1(scope, e => is(e, selector));
    const descendant = (scope, selector) => one(selector, scope);
    const closest$1 = (scope, selector, isRoot) => {
      const is$1 = (element, selector) => is(element, selector);
      return ClosestOrAncestor(is$1, ancestor, scope, selector, isRoot);
    };

    const attribute = 'aria-controls';
    const find$1 = queryElem => {
      const dependent = closest$3(queryElem, elem => {
        if (!isElement$1(elem)) {
          return false;
        }
        const id = get$f(elem, 'id');
        return id !== undefined && id.indexOf(attribute) > -1;
      });
      return dependent.bind(dep => {
        const id = get$f(dep, 'id');
        const dos = getRootNode(dep);
        return descendant(dos, `[${ attribute }="${ id }"]`);
      });
    };
    const manager = () => {
      const ariaId = generate$6(attribute);
      const link = elem => {
        set$9(elem, attribute, ariaId);
      };
      const unlink = elem => {
        remove$7(elem, attribute);
      };
      return {
        id: ariaId,
        link,
        unlink
      };
    };

    const isAriaPartOf = (component, queryElem) => find$1(queryElem).exists(owner => isPartOf$1(component, owner));
    const isPartOf$1 = (component, queryElem) => closest$2(queryElem, el => eq(el, component.element), never) || isAriaPartOf(component, queryElem);

    const unknown = 'unknown';
    var EventConfiguration;
    (function (EventConfiguration) {
      EventConfiguration[EventConfiguration['STOP'] = 0] = 'STOP';
      EventConfiguration[EventConfiguration['NORMAL'] = 1] = 'NORMAL';
      EventConfiguration[EventConfiguration['LOGGING'] = 2] = 'LOGGING';
    }(EventConfiguration || (EventConfiguration = {})));
    const eventConfig = Cell({});
    const makeEventLogger = (eventName, initialTarget) => {
      const sequence = [];
      const startTime = new Date().getTime();
      return {
        logEventCut: (_name, target, purpose) => {
          sequence.push({
            outcome: 'cut',
            target,
            purpose
          });
        },
        logEventStopped: (_name, target, purpose) => {
          sequence.push({
            outcome: 'stopped',
            target,
            purpose
          });
        },
        logNoParent: (_name, target, purpose) => {
          sequence.push({
            outcome: 'no-parent',
            target,
            purpose
          });
        },
        logEventNoHandlers: (_name, target) => {
          sequence.push({
            outcome: 'no-handlers-left',
            target
          });
        },
        logEventResponse: (_name, target, purpose) => {
          sequence.push({
            outcome: 'response',
            purpose,
            target
          });
        },
        write: () => {
          const finishTime = new Date().getTime();
          if (contains$2([
              'mousemove',
              'mouseover',
              'mouseout',
              systemInit()
            ], eventName)) {
            return;
          }
          console.log(eventName, {
            event: eventName,
            time: finishTime - startTime,
            target: initialTarget.dom,
            sequence: map$2(sequence, s => {
              if (!contains$2([
                  'cut',
                  'stopped',
                  'response'
                ], s.outcome)) {
                return s.outcome;
              } else {
                return '{' + s.purpose + '} ' + s.outcome + ' at (' + element(s.target) + ')';
              }
            })
          });
        }
      };
    };
    const processEvent = (eventName, initialTarget, f) => {
      const status = get$g(eventConfig.get(), eventName).orThunk(() => {
        const patterns = keys(eventConfig.get());
        return findMap(patterns, p => eventName.indexOf(p) > -1 ? Optional.some(eventConfig.get()[p]) : Optional.none());
      }).getOr(EventConfiguration.NORMAL);
      switch (status) {
      case EventConfiguration.NORMAL:
        return f(noLogger());
      case EventConfiguration.LOGGING: {
          const logger = makeEventLogger(eventName, initialTarget);
          const output = f(logger);
          logger.write();
          return output;
        }
      case EventConfiguration.STOP:
        return true;
      }
    };
    const path = [
      'alloy/data/Fields',
      'alloy/debugging/Debugging'
    ];
    const getTrace = () => {
      const err = new Error();
      if (err.stack !== undefined) {
        const lines = err.stack.split('\n');
        return find$5(lines, line => line.indexOf('alloy') > 0 && !exists(path, p => line.indexOf(p) > -1)).getOr(unknown);
      } else {
        return unknown;
      }
    };
    const ignoreEvent = {
      logEventCut: noop,
      logEventStopped: noop,
      logNoParent: noop,
      logEventNoHandlers: noop,
      logEventResponse: noop,
      write: noop
    };
    const monitorEvent = (eventName, initialTarget, f) => processEvent(eventName, initialTarget, f);
    const noLogger = constant$1(ignoreEvent);

    const menuFields = constant$1([
      required$1('menu'),
      required$1('selectedMenu')
    ]);
    const itemFields = constant$1([
      required$1('item'),
      required$1('selectedItem')
    ]);
    constant$1(objOf(itemFields().concat(menuFields())));
    const itemSchema$3 = constant$1(objOf(itemFields()));

    const _initSize = requiredObjOf('initSize', [
      required$1('numColumns'),
      required$1('numRows')
    ]);
    const itemMarkers = () => requiredOf('markers', itemSchema$3());
    const tieredMenuMarkers = () => requiredObjOf('markers', [required$1('backgroundMenu')].concat(menuFields()).concat(itemFields()));
    const markers$1 = required => requiredObjOf('markers', map$2(required, required$1));
    const onPresenceHandler = (label, fieldName, presence) => {
      getTrace();
      return field$1(fieldName, fieldName, presence, valueOf(f => Result.value((...args) => {
        return f.apply(undefined, args);
      })));
    };
    const onHandler = fieldName => onPresenceHandler('onHandler', fieldName, defaulted$1(noop));
    const onKeyboardHandler = fieldName => onPresenceHandler('onKeyboardHandler', fieldName, defaulted$1(Optional.none));
    const onStrictHandler = fieldName => onPresenceHandler('onHandler', fieldName, required$2());
    const onStrictKeyboardHandler = fieldName => onPresenceHandler('onKeyboardHandler', fieldName, required$2());
    const output$1 = (name, value) => customField(name, constant$1(value));
    const snapshot = name => customField(name, identity);
    const initSize = constant$1(_initSize);

    const nu$6 = (x, y, bubble, direction, placement, boundsRestriction, labelPrefix, alwaysFit = false) => ({
      x,
      y,
      bubble,
      direction,
      placement,
      restriction: boundsRestriction,
      label: `${ labelPrefix }-${ placement }`,
      alwaysFit
    });

    const adt$a = Adt.generate([
      { southeast: [] },
      { southwest: [] },
      { northeast: [] },
      { northwest: [] },
      { south: [] },
      { north: [] },
      { east: [] },
      { west: [] }
    ]);
    const cata$2 = (subject, southeast, southwest, northeast, northwest, south, north, east, west) => subject.fold(southeast, southwest, northeast, northwest, south, north, east, west);
    const cataVertical = (subject, south, middle, north) => subject.fold(south, south, north, north, south, north, middle, middle);
    const cataHorizontal = (subject, east, middle, west) => subject.fold(east, west, east, west, middle, middle, east, west);
    const southeast$3 = adt$a.southeast;
    const southwest$3 = adt$a.southwest;
    const northeast$3 = adt$a.northeast;
    const northwest$3 = adt$a.northwest;
    const south$3 = adt$a.south;
    const north$3 = adt$a.north;
    const east$3 = adt$a.east;
    const west$3 = adt$a.west;

    const cycleBy = (value, delta, min, max) => {
      const r = value + delta;
      if (r > max) {
        return min;
      } else if (r < min) {
        return max;
      } else {
        return r;
      }
    };
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const getRestriction = (anchor, restriction) => {
      switch (restriction) {
      case 1:
        return anchor.x;
      case 0:
        return anchor.x + anchor.width;
      case 2:
        return anchor.y;
      case 3:
        return anchor.y + anchor.height;
      }
    };
    const boundsRestriction = (anchor, restrictions) => mapToObject([
      'left',
      'right',
      'top',
      'bottom'
    ], dir => get$g(restrictions, dir).map(restriction => getRestriction(anchor, restriction)));
    const adjustBounds = (bounds$1, restriction, bubbleOffset) => {
      const applyRestriction = (dir, current) => restriction[dir].map(pos => {
        const isVerticalAxis = dir === 'top' || dir === 'bottom';
        const offset = isVerticalAxis ? bubbleOffset.top : bubbleOffset.left;
        const comparator = dir === 'left' || dir === 'top' ? Math.max : Math.min;
        const newPos = comparator(pos, current) + offset;
        return isVerticalAxis ? clamp(newPos, bounds$1.y, bounds$1.bottom) : clamp(newPos, bounds$1.x, bounds$1.right);
      }).getOr(current);
      const adjustedLeft = applyRestriction('left', bounds$1.x);
      const adjustedTop = applyRestriction('top', bounds$1.y);
      const adjustedRight = applyRestriction('right', bounds$1.right);
      const adjustedBottom = applyRestriction('bottom', bounds$1.bottom);
      return bounds(adjustedLeft, adjustedTop, adjustedRight - adjustedLeft, adjustedBottom - adjustedTop);
    };

    const labelPrefix$2 = 'layout';
    const eastX$1 = anchor => anchor.x;
    const middleX$1 = (anchor, element) => anchor.x + anchor.width / 2 - element.width / 2;
    const westX$1 = (anchor, element) => anchor.x + anchor.width - element.width;
    const northY$2 = (anchor, element) => anchor.y - element.height;
    const southY$2 = anchor => anchor.y + anchor.height;
    const centreY$1 = (anchor, element) => anchor.y + anchor.height / 2 - element.height / 2;
    const eastEdgeX$1 = anchor => anchor.x + anchor.width;
    const westEdgeX$1 = (anchor, element) => anchor.x - element.width;
    const southeast$2 = (anchor, element, bubbles) => nu$6(eastX$1(anchor), southY$2(anchor), bubbles.southeast(), southeast$3(), 'southeast', boundsRestriction(anchor, {
      left: 1,
      top: 3
    }), labelPrefix$2);
    const southwest$2 = (anchor, element, bubbles) => nu$6(westX$1(anchor, element), southY$2(anchor), bubbles.southwest(), southwest$3(), 'southwest', boundsRestriction(anchor, {
      right: 0,
      top: 3
    }), labelPrefix$2);
    const northeast$2 = (anchor, element, bubbles) => nu$6(eastX$1(anchor), northY$2(anchor, element), bubbles.northeast(), northeast$3(), 'northeast', boundsRestriction(anchor, {
      left: 1,
      bottom: 2
    }), labelPrefix$2);
    const northwest$2 = (anchor, element, bubbles) => nu$6(westX$1(anchor, element), northY$2(anchor, element), bubbles.northwest(), northwest$3(), 'northwest', boundsRestriction(anchor, {
      right: 0,
      bottom: 2
    }), labelPrefix$2);
    const north$2 = (anchor, element, bubbles) => nu$6(middleX$1(anchor, element), northY$2(anchor, element), bubbles.north(), north$3(), 'north', boundsRestriction(anchor, { bottom: 2 }), labelPrefix$2);
    const south$2 = (anchor, element, bubbles) => nu$6(middleX$1(anchor, element), southY$2(anchor), bubbles.south(), south$3(), 'south', boundsRestriction(anchor, { top: 3 }), labelPrefix$2);
    const east$2 = (anchor, element, bubbles) => nu$6(eastEdgeX$1(anchor), centreY$1(anchor, element), bubbles.east(), east$3(), 'east', boundsRestriction(anchor, { left: 0 }), labelPrefix$2);
    const west$2 = (anchor, element, bubbles) => nu$6(westEdgeX$1(anchor, element), centreY$1(anchor, element), bubbles.west(), west$3(), 'west', boundsRestriction(anchor, { right: 1 }), labelPrefix$2);
    const all$1 = () => [
      southeast$2,
      southwest$2,
      northeast$2,
      northwest$2,
      south$2,
      north$2,
      east$2,
      west$2
    ];
    const allRtl$1 = () => [
      southwest$2,
      southeast$2,
      northwest$2,
      northeast$2,
      south$2,
      north$2,
      east$2,
      west$2
    ];
    const aboveOrBelow = () => [
      northeast$2,
      northwest$2,
      southeast$2,
      southwest$2,
      north$2,
      south$2
    ];
    const aboveOrBelowRtl = () => [
      northwest$2,
      northeast$2,
      southwest$2,
      southeast$2,
      north$2,
      south$2
    ];
    const belowOrAbove = () => [
      southeast$2,
      southwest$2,
      northeast$2,
      northwest$2,
      south$2,
      north$2
    ];
    const belowOrAboveRtl = () => [
      southwest$2,
      southeast$2,
      northwest$2,
      northeast$2,
      south$2,
      north$2
    ];

    const chooseChannels = (channels, message) => message.universal ? channels : filter$2(channels, ch => contains$2(message.channels, ch));
    const events$h = receiveConfig => derive$2([run$1(receive(), (component, message) => {
        const channelMap = receiveConfig.channels;
        const channels = keys(channelMap);
        const receivingData = message;
        const targetChannels = chooseChannels(channels, receivingData);
        each$1(targetChannels, ch => {
          const channelInfo = channelMap[ch];
          const channelSchema = channelInfo.schema;
          const data = asRawOrDie$1('channel[' + ch + '] data\nReceiver: ' + element(component.element), channelSchema, receivingData.data);
          channelInfo.onReceive(component, data);
        });
      })]);

    var ActiveReceiving = /*#__PURE__*/Object.freeze({
        __proto__: null,
        events: events$h
    });

    var ReceivingSchema = [requiredOf('channels', setOf(Result.value, objOfOnly([
        onStrictHandler('onReceive'),
        defaulted('schema', anyValue())
      ])))];

    const executeEvent = (bConfig, bState, executor) => runOnExecute$1(component => {
      executor(component, bConfig, bState);
    });
    const loadEvent = (bConfig, bState, f) => runOnInit((component, _simulatedEvent) => {
      f(component, bConfig, bState);
    });
    const create$4 = (schema, name, active, apis, extra, state) => {
      const configSchema = objOfOnly(schema);
      const schemaSchema = optionObjOf(name, [optionObjOfOnly('config', schema)]);
      return doCreate(configSchema, schemaSchema, name, active, apis, extra, state);
    };
    const createModes$1 = (modes, name, active, apis, extra, state) => {
      const configSchema = modes;
      const schemaSchema = optionObjOf(name, [optionOf('config', modes)]);
      return doCreate(configSchema, schemaSchema, name, active, apis, extra, state);
    };
    const wrapApi = (bName, apiFunction, apiName) => {
      const f = (component, ...rest) => {
        const args = [component].concat(rest);
        return component.config({ name: constant$1(bName) }).fold(() => {
          throw new Error('We could not find any behaviour configuration for: ' + bName + '. Using API: ' + apiName);
        }, info => {
          const rest = Array.prototype.slice.call(args, 1);
          return apiFunction.apply(undefined, [
            component,
            info.config,
            info.state
          ].concat(rest));
        });
      };
      return markAsBehaviourApi(f, apiName, apiFunction);
    };
    const revokeBehaviour = name => ({
      key: name,
      value: undefined
    });
    const doCreate = (configSchema, schemaSchema, name, active, apis, extra, state) => {
      const getConfig = info => hasNonNullableKey(info, name) ? info[name]() : Optional.none();
      const wrappedApis = map$1(apis, (apiF, apiName) => wrapApi(name, apiF, apiName));
      const wrappedExtra = map$1(extra, (extraF, extraName) => markAsExtraApi(extraF, extraName));
      const me = {
        ...wrappedExtra,
        ...wrappedApis,
        revoke: curry(revokeBehaviour, name),
        config: spec => {
          const prepared = asRawOrDie$1(name + '-config', configSchema, spec);
          return {
            key: name,
            value: {
              config: prepared,
              me,
              configAsRaw: cached(() => asRawOrDie$1(name + '-config', configSchema, spec)),
              initialConfig: spec,
              state
            }
          };
        },
        schema: constant$1(schemaSchema),
        exhibit: (info, base) => {
          return lift2(getConfig(info), get$g(active, 'exhibit'), (behaviourInfo, exhibitor) => {
            return exhibitor(base, behaviourInfo.config, behaviourInfo.state);
          }).getOrThunk(() => nu$7({}));
        },
        name: constant$1(name),
        handlers: info => {
          return getConfig(info).map(behaviourInfo => {
            const getEvents = get$g(active, 'events').getOr(() => ({}));
            return getEvents(behaviourInfo.config, behaviourInfo.state);
          }).getOr({});
        }
      };
      return me;
    };

    const derive$1 = capabilities => wrapAll(capabilities);
    const simpleSchema = objOfOnly([
      required$1('fields'),
      required$1('name'),
      defaulted('active', {}),
      defaulted('apis', {}),
      defaulted('state', NoState),
      defaulted('extra', {})
    ]);
    const create$3 = data => {
      const value = asRawOrDie$1('Creating behaviour: ' + data.name, simpleSchema, data);
      return create$4(value.fields, value.name, value.active, value.apis, value.extra, value.state);
    };
    const modeSchema = objOfOnly([
      required$1('branchKey'),
      required$1('branches'),
      required$1('name'),
      defaulted('active', {}),
      defaulted('apis', {}),
      defaulted('state', NoState),
      defaulted('extra', {})
    ]);
    const createModes = data => {
      const value = asRawOrDie$1('Creating behaviour: ' + data.name, modeSchema, data);
      return createModes$1(choose$1(value.branchKey, value.branches), value.name, value.active, value.apis, value.extra, value.state);
    };
    const revoke = constant$1(undefined);

    const Receiving = create$3({
      fields: ReceivingSchema,
      name: 'receiving',
      active: ActiveReceiving
    });

    const exhibit$6 = (base, posConfig) => nu$7({
      classes: [],
      styles: posConfig.useFixed() ? {} : { position: 'relative' }
    });

    var ActivePosition = /*#__PURE__*/Object.freeze({
        __proto__: null,
        exhibit: exhibit$6
    });

    const focus$3 = element => element.dom.focus();
    const blur$1 = element => element.dom.blur();
    const hasFocus = element => {
      const root = getRootNode(element).dom;
      return element.dom === root.activeElement;
    };
    const active$1 = (root = getDocument()) => Optional.from(root.dom.activeElement).map(SugarElement.fromDom);
    const search = element => active$1(getRootNode(element)).filter(e => element.dom.contains(e.dom));

    const preserve$1 = (f, container) => {
      const dos = getRootNode(container);
      const refocus = active$1(dos).bind(focused => {
        const hasFocus = elem => eq(focused, elem);
        return hasFocus(container) ? Optional.some(container) : descendant$1(container, hasFocus);
      });
      const result = f(container);
      refocus.each(oldFocus => {
        active$1(dos).filter(newFocus => eq(newFocus, oldFocus)).fold(() => {
          focus$3(oldFocus);
        }, noop);
      });
      return result;
    };

    const NuPositionCss = (position, left, top, right, bottom) => {
      const toPx = num => num + 'px';
      return {
        position,
        left: left.map(toPx),
        top: top.map(toPx),
        right: right.map(toPx),
        bottom: bottom.map(toPx)
      };
    };
    const toOptions = position => ({
      ...position,
      position: Optional.some(position.position)
    });
    const applyPositionCss = (element, position) => {
      setOptions(element, toOptions(position));
    };

    const adt$9 = Adt.generate([
      { none: [] },
      {
        relative: [
          'x',
          'y',
          'width',
          'height'
        ]
      },
      {
        fixed: [
          'x',
          'y',
          'width',
          'height'
        ]
      }
    ]);
    const positionWithDirection = (posName, decision, x, y, width, height) => {
      const decisionRect = decision.rect;
      const decisionX = decisionRect.x - x;
      const decisionY = decisionRect.y - y;
      const decisionWidth = decisionRect.width;
      const decisionHeight = decisionRect.height;
      const decisionRight = width - (decisionX + decisionWidth);
      const decisionBottom = height - (decisionY + decisionHeight);
      const left = Optional.some(decisionX);
      const top = Optional.some(decisionY);
      const right = Optional.some(decisionRight);
      const bottom = Optional.some(decisionBottom);
      const none = Optional.none();
      return cata$2(decision.direction, () => NuPositionCss(posName, left, top, none, none), () => NuPositionCss(posName, none, top, right, none), () => NuPositionCss(posName, left, none, none, bottom), () => NuPositionCss(posName, none, none, right, bottom), () => NuPositionCss(posName, left, top, none, none), () => NuPositionCss(posName, left, none, none, bottom), () => NuPositionCss(posName, left, top, none, none), () => NuPositionCss(posName, none, top, right, none));
    };
    const reposition = (origin, decision) => origin.fold(() => {
      const decisionRect = decision.rect;
      return NuPositionCss('absolute', Optional.some(decisionRect.x), Optional.some(decisionRect.y), Optional.none(), Optional.none());
    }, (x, y, width, height) => {
      return positionWithDirection('absolute', decision, x, y, width, height);
    }, (x, y, width, height) => {
      return positionWithDirection('fixed', decision, x, y, width, height);
    });
    const toBox = (origin, element) => {
      const rel = curry(find$2, element);
      const position = origin.fold(rel, rel, () => {
        const scroll = get$b();
        return find$2(element).translate(-scroll.left, -scroll.top);
      });
      const width = getOuter$1(element);
      const height = getOuter$2(element);
      return bounds(position.left, position.top, width, height);
    };
    const viewport = (origin, getBounds) => getBounds.fold(() => origin.fold(win, win, bounds), b => origin.fold(b, b, () => {
      const bounds$1 = b();
      const pos = translate$2(origin, bounds$1.x, bounds$1.y);
      return bounds(pos.left, pos.top, bounds$1.width, bounds$1.height);
    }));
    const translate$2 = (origin, x, y) => {
      const pos = SugarPosition(x, y);
      const removeScroll = () => {
        const outerScroll = get$b();
        return pos.translate(-outerScroll.left, -outerScroll.top);
      };
      return origin.fold(constant$1(pos), constant$1(pos), removeScroll);
    };
    const cata$1 = (subject, onNone, onRelative, onFixed) => subject.fold(onNone, onRelative, onFixed);
    adt$9.none;
    const relative$1 = adt$9.relative;
    const fixed$1 = adt$9.fixed;

    const anchor = (anchorBox, origin) => ({
      anchorBox,
      origin
    });
    const box = (anchorBox, origin) => anchor(anchorBox, origin);

    const placementAttribute = 'data-alloy-placement';
    const setPlacement$1 = (element, placement) => {
      set$9(element, placementAttribute, placement);
    };
    const getPlacement = element => getOpt(element, placementAttribute);
    const reset$2 = element => remove$7(element, placementAttribute);

    const adt$8 = Adt.generate([
      { fit: ['reposition'] },
      {
        nofit: [
          'reposition',
          'visibleW',
          'visibleH',
          'isVisible'
        ]
      }
    ]);
    const determinePosition = (box, bounds) => {
      const {
        x: boundsX,
        y: boundsY,
        right: boundsRight,
        bottom: boundsBottom
      } = bounds;
      const {x, y, right, bottom, width, height} = box;
      const xInBounds = x >= boundsX && x <= boundsRight;
      const yInBounds = y >= boundsY && y <= boundsBottom;
      const originInBounds = xInBounds && yInBounds;
      const rightInBounds = right <= boundsRight && right >= boundsX;
      const bottomInBounds = bottom <= boundsBottom && bottom >= boundsY;
      const sizeInBounds = rightInBounds && bottomInBounds;
      const visibleW = Math.min(width, x >= boundsX ? boundsRight - x : right - boundsX);
      const visibleH = Math.min(height, y >= boundsY ? boundsBottom - y : bottom - boundsY);
      return {
        originInBounds,
        sizeInBounds,
        visibleW,
        visibleH
      };
    };
    const calcReposition = (box, bounds$1) => {
      const {
        x: boundsX,
        y: boundsY,
        right: boundsRight,
        bottom: boundsBottom
      } = bounds$1;
      const {x, y, width, height} = box;
      const maxX = Math.max(boundsX, boundsRight - width);
      const maxY = Math.max(boundsY, boundsBottom - height);
      const restrictedX = clamp(x, boundsX, maxX);
      const restrictedY = clamp(y, boundsY, maxY);
      const restrictedWidth = Math.min(restrictedX + width, boundsRight) - restrictedX;
      const restrictedHeight = Math.min(restrictedY + height, boundsBottom) - restrictedY;
      return bounds(restrictedX, restrictedY, restrictedWidth, restrictedHeight);
    };
    const calcMaxSizes = (direction, box, bounds) => {
      const upAvailable = constant$1(box.bottom - bounds.y);
      const downAvailable = constant$1(bounds.bottom - box.y);
      const maxHeight = cataVertical(direction, downAvailable, downAvailable, upAvailable);
      const westAvailable = constant$1(box.right - bounds.x);
      const eastAvailable = constant$1(bounds.right - box.x);
      const maxWidth = cataHorizontal(direction, eastAvailable, eastAvailable, westAvailable);
      return {
        maxWidth,
        maxHeight
      };
    };
    const attempt = (candidate, width, height, bounds$1) => {
      const bubble = candidate.bubble;
      const bubbleOffset = bubble.offset;
      const adjustedBounds = adjustBounds(bounds$1, candidate.restriction, bubbleOffset);
      const newX = candidate.x + bubbleOffset.left;
      const newY = candidate.y + bubbleOffset.top;
      const box = bounds(newX, newY, width, height);
      const {originInBounds, sizeInBounds, visibleW, visibleH} = determinePosition(box, adjustedBounds);
      const fits = originInBounds && sizeInBounds;
      const fittedBox = fits ? box : calcReposition(box, adjustedBounds);
      const isPartlyVisible = fittedBox.width > 0 && fittedBox.height > 0;
      const {maxWidth, maxHeight} = calcMaxSizes(candidate.direction, fittedBox, bounds$1);
      const reposition = {
        rect: fittedBox,
        maxHeight,
        maxWidth,
        direction: candidate.direction,
        placement: candidate.placement,
        classes: {
          on: bubble.classesOn,
          off: bubble.classesOff
        },
        layout: candidate.label,
        testY: newY
      };
      return fits || candidate.alwaysFit ? adt$8.fit(reposition) : adt$8.nofit(reposition, visibleW, visibleH, isPartlyVisible);
    };
    const attempts = (element, candidates, anchorBox, elementBox, bubbles, bounds) => {
      const panelWidth = elementBox.width;
      const panelHeight = elementBox.height;
      const attemptBestFit = (layout, reposition, visibleW, visibleH, isVisible) => {
        const next = layout(anchorBox, elementBox, bubbles, element, bounds);
        const attemptLayout = attempt(next, panelWidth, panelHeight, bounds);
        return attemptLayout.fold(constant$1(attemptLayout), (newReposition, newVisibleW, newVisibleH, newIsVisible) => {
          const improved = isVisible === newIsVisible ? newVisibleH > visibleH || newVisibleW > visibleW : !isVisible && newIsVisible;
          return improved ? attemptLayout : adt$8.nofit(reposition, visibleW, visibleH, isVisible);
        });
      };
      const abc = foldl(candidates, (b, a) => {
        const bestNext = curry(attemptBestFit, a);
        return b.fold(constant$1(b), bestNext);
      }, adt$8.nofit({
        rect: anchorBox,
        maxHeight: elementBox.height,
        maxWidth: elementBox.width,
        direction: southeast$3(),
        placement: 'southeast',
        classes: {
          on: [],
          off: []
        },
        layout: 'none',
        testY: anchorBox.y
      }, -1, -1, false));
      return abc.fold(identity, identity);
    };

    const singleton = doRevoke => {
      const subject = Cell(Optional.none());
      const revoke = () => subject.get().each(doRevoke);
      const clear = () => {
        revoke();
        subject.set(Optional.none());
      };
      const isSet = () => subject.get().isSome();
      const get = () => subject.get();
      const set = s => {
        revoke();
        subject.set(Optional.some(s));
      };
      return {
        clear,
        isSet,
        get,
        set
      };
    };
    const destroyable = () => singleton(s => s.destroy());
    const unbindable = () => singleton(s => s.unbind());
    const value$2 = () => {
      const subject = singleton(noop);
      const on = f => subject.get().each(f);
      return {
        ...subject,
        on
      };
    };

    const filter = always;
    const bind = (element, event, handler) => bind$2(element, event, filter, handler);
    const capture = (element, event, handler) => capture$1(element, event, filter, handler);
    const fromRawEvent = fromRawEvent$1;

    const properties = [
      'top',
      'bottom',
      'right',
      'left'
    ];
    const timerAttr = 'data-alloy-transition-timer';
    const isTransitioning$1 = (element, transition) => hasAll(element, transition.classes);
    const shouldApplyTransitionCss = (transition, decision, lastPlacement) => {
      return lastPlacement.exists(placer => {
        const mode = transition.mode;
        return mode === 'all' ? true : placer[mode] !== decision[mode];
      });
    };
    const hasChanges = (position, intermediate) => {
      const round = value => parseFloat(value).toFixed(3);
      return find$4(intermediate, (value, key) => {
        const newValue = position[key].map(round);
        const val = value.map(round);
        return !equals(newValue, val);
      }).isSome();
    };
    const getTransitionDuration = element => {
      const get = name => {
        const style = get$e(element, name);
        const times = style.split(/\s*,\s*/);
        return filter$2(times, isNotEmpty);
      };
      const parse = value => {
        if (isString(value) && /^[\d.]+/.test(value)) {
          const num = parseFloat(value);
          return endsWith(value, 'ms') ? num : num * 1000;
        } else {
          return 0;
        }
      };
      const delay = get('transition-delay');
      const duration = get('transition-duration');
      return foldl(duration, (acc, dur, i) => {
        const time = parse(delay[i]) + parse(dur);
        return Math.max(acc, time);
      }, 0);
    };
    const setupTransitionListeners = (element, transition) => {
      const transitionEnd = unbindable();
      const transitionCancel = unbindable();
      let timer;
      const isSourceTransition = e => {
        var _a;
        const pseudoElement = (_a = e.raw.pseudoElement) !== null && _a !== void 0 ? _a : '';
        return eq(e.target, element) && isEmpty(pseudoElement) && contains$2(properties, e.raw.propertyName);
      };
      const transitionDone = e => {
        if (isNullable(e) || isSourceTransition(e)) {
          transitionEnd.clear();
          transitionCancel.clear();
          const type = e === null || e === void 0 ? void 0 : e.raw.type;
          if (isNullable(type) || type === transitionend()) {
            clearTimeout(timer);
            remove$7(element, timerAttr);
            remove$1(element, transition.classes);
          }
        }
      };
      const transitionStart = bind(element, transitionstart(), e => {
        if (isSourceTransition(e)) {
          transitionStart.unbind();
          transitionEnd.set(bind(element, transitionend(), transitionDone));
          transitionCancel.set(bind(element, transitioncancel(), transitionDone));
        }
      });
      const duration = getTransitionDuration(element);
      requestAnimationFrame(() => {
        timer = setTimeout(transitionDone, duration + 17);
        set$9(element, timerAttr, timer);
      });
    };
    const startTransitioning = (element, transition) => {
      add$1(element, transition.classes);
      getOpt(element, timerAttr).each(timerId => {
        clearTimeout(parseInt(timerId, 10));
        remove$7(element, timerAttr);
      });
      setupTransitionListeners(element, transition);
    };
    const applyTransitionCss = (element, origin, position, transition, decision, lastPlacement) => {
      const shouldTransition = shouldApplyTransitionCss(transition, decision, lastPlacement);
      if (shouldTransition || isTransitioning$1(element, transition)) {
        set$8(element, 'position', position.position);
        const rect = toBox(origin, element);
        const intermediatePosition = reposition(origin, {
          ...decision,
          rect
        });
        const intermediateCssOptions = mapToObject(properties, prop => intermediatePosition[prop]);
        if (hasChanges(position, intermediateCssOptions)) {
          setOptions(element, intermediateCssOptions);
          if (shouldTransition) {
            startTransitioning(element, transition);
          }
          reflow(element);
        }
      } else {
        remove$1(element, transition.classes);
      }
    };

    const elementSize = p => ({
      width: getOuter$1(p),
      height: getOuter$2(p)
    });
    const layout = (anchorBox, element, bubbles, options) => {
      remove$6(element, 'max-height');
      remove$6(element, 'max-width');
      const elementBox = elementSize(element);
      return attempts(element, options.preference, anchorBox, elementBox, bubbles, options.bounds);
    };
    const setClasses = (element, decision) => {
      const classInfo = decision.classes;
      remove$1(element, classInfo.off);
      add$1(element, classInfo.on);
    };
    const setHeight = (element, decision, options) => {
      const maxHeightFunction = options.maxHeightFunction;
      maxHeightFunction(element, decision.maxHeight);
    };
    const setWidth = (element, decision, options) => {
      const maxWidthFunction = options.maxWidthFunction;
      maxWidthFunction(element, decision.maxWidth);
    };
    const position$2 = (element, decision, options) => {
      const positionCss = reposition(options.origin, decision);
      options.transition.each(transition => {
        applyTransitionCss(element, options.origin, positionCss, transition, decision, options.lastPlacement);
      });
      applyPositionCss(element, positionCss);
    };
    const setPlacement = (element, decision) => {
      setPlacement$1(element, decision.placement);
    };

    const setMaxHeight = (element, maxHeight) => {
      setMax$1(element, Math.floor(maxHeight));
    };
    const anchored = constant$1((element, available) => {
      setMaxHeight(element, available);
      setAll(element, {
        'overflow-x': 'hidden',
        'overflow-y': 'auto'
      });
    });
    const expandable$1 = constant$1((element, available) => {
      setMaxHeight(element, available);
    });

    const defaultOr = (options, key, dephault) => options[key] === undefined ? dephault : options[key];
    const simple = (anchor, element, bubble, layouts, lastPlacement, getBounds, overrideOptions, transition) => {
      const maxHeightFunction = defaultOr(overrideOptions, 'maxHeightFunction', anchored());
      const maxWidthFunction = defaultOr(overrideOptions, 'maxWidthFunction', noop);
      const anchorBox = anchor.anchorBox;
      const origin = anchor.origin;
      const options = {
        bounds: viewport(origin, getBounds),
        origin,
        preference: layouts,
        maxHeightFunction,
        maxWidthFunction,
        lastPlacement,
        transition
      };
      return go(anchorBox, element, bubble, options);
    };
    const go = (anchorBox, element, bubble, options) => {
      const decision = layout(anchorBox, element, bubble, options);
      position$2(element, decision, options);
      setPlacement(element, decision);
      setClasses(element, decision);
      setHeight(element, decision, options);
      setWidth(element, decision, options);
      return {
        layout: decision.layout,
        placement: decision.placement
      };
    };

    const allAlignments = [
      'valignCentre',
      'alignLeft',
      'alignRight',
      'alignCentre',
      'top',
      'bottom',
      'left',
      'right',
      'inset'
    ];
    const nu$5 = (xOffset, yOffset, classes, insetModifier = 1) => {
      const insetXOffset = xOffset * insetModifier;
      const insetYOffset = yOffset * insetModifier;
      const getClasses = prop => get$g(classes, prop).getOr([]);
      const make = (xDelta, yDelta, alignmentsOn) => {
        const alignmentsOff = difference(allAlignments, alignmentsOn);
        return {
          offset: SugarPosition(xDelta, yDelta),
          classesOn: bind$3(alignmentsOn, getClasses),
          classesOff: bind$3(alignmentsOff, getClasses)
        };
      };
      return {
        southeast: () => make(-xOffset, yOffset, [
          'top',
          'alignLeft'
        ]),
        southwest: () => make(xOffset, yOffset, [
          'top',
          'alignRight'
        ]),
        south: () => make(-xOffset / 2, yOffset, [
          'top',
          'alignCentre'
        ]),
        northeast: () => make(-xOffset, -yOffset, [
          'bottom',
          'alignLeft'
        ]),
        northwest: () => make(xOffset, -yOffset, [
          'bottom',
          'alignRight'
        ]),
        north: () => make(-xOffset / 2, -yOffset, [
          'bottom',
          'alignCentre'
        ]),
        east: () => make(xOffset, -yOffset / 2, [
          'valignCentre',
          'left'
        ]),
        west: () => make(-xOffset, -yOffset / 2, [
          'valignCentre',
          'right'
        ]),
        insetNortheast: () => make(insetXOffset, insetYOffset, [
          'top',
          'alignLeft',
          'inset'
        ]),
        insetNorthwest: () => make(-insetXOffset, insetYOffset, [
          'top',
          'alignRight',
          'inset'
        ]),
        insetNorth: () => make(-insetXOffset / 2, insetYOffset, [
          'top',
          'alignCentre',
          'inset'
        ]),
        insetSoutheast: () => make(insetXOffset, -insetYOffset, [
          'bottom',
          'alignLeft',
          'inset'
        ]),
        insetSouthwest: () => make(-insetXOffset, -insetYOffset, [
          'bottom',
          'alignRight',
          'inset'
        ]),
        insetSouth: () => make(-insetXOffset / 2, -insetYOffset, [
          'bottom',
          'alignCentre',
          'inset'
        ]),
        insetEast: () => make(-insetXOffset, -insetYOffset / 2, [
          'valignCentre',
          'right',
          'inset'
        ]),
        insetWest: () => make(insetXOffset, -insetYOffset / 2, [
          'valignCentre',
          'left',
          'inset'
        ])
      };
    };
    const fallback = () => nu$5(0, 0, {});

    const nu$4 = identity;

    const onDirection = (isLtr, isRtl) => element => getDirection(element) === 'rtl' ? isRtl : isLtr;
    const getDirection = element => get$e(element, 'direction') === 'rtl' ? 'rtl' : 'ltr';

    var AttributeValue;
    (function (AttributeValue) {
      AttributeValue['TopToBottom'] = 'toptobottom';
      AttributeValue['BottomToTop'] = 'bottomtotop';
    }(AttributeValue || (AttributeValue = {})));
    const Attribute = 'data-alloy-vertical-dir';
    const isBottomToTopDir = el => closest$2(el, current => isElement$1(current) && get$f(current, 'data-alloy-vertical-dir') === AttributeValue.BottomToTop);

    const schema$y = () => optionObjOf('layouts', [
      required$1('onLtr'),
      required$1('onRtl'),
      option$3('onBottomLtr'),
      option$3('onBottomRtl')
    ]);
    const get$5 = (elem, info, defaultLtr, defaultRtl, defaultBottomLtr, defaultBottomRtl, dirElement) => {
      const isBottomToTop = dirElement.map(isBottomToTopDir).getOr(false);
      const customLtr = info.layouts.map(ls => ls.onLtr(elem));
      const customRtl = info.layouts.map(ls => ls.onRtl(elem));
      const ltr = isBottomToTop ? info.layouts.bind(ls => ls.onBottomLtr.map(f => f(elem))).or(customLtr).getOr(defaultBottomLtr) : customLtr.getOr(defaultLtr);
      const rtl = isBottomToTop ? info.layouts.bind(ls => ls.onBottomRtl.map(f => f(elem))).or(customRtl).getOr(defaultBottomRtl) : customRtl.getOr(defaultRtl);
      const f = onDirection(ltr, rtl);
      return f(elem);
    };

    const placement$4 = (component, anchorInfo, origin) => {
      const hotspot = anchorInfo.hotspot;
      const anchorBox = toBox(origin, hotspot.element);
      const layouts = get$5(component.element, anchorInfo, belowOrAbove(), belowOrAboveRtl(), aboveOrBelow(), aboveOrBelowRtl(), Optional.some(anchorInfo.hotspot.element));
      return Optional.some(nu$4({
        anchorBox,
        bubble: anchorInfo.bubble.getOr(fallback()),
        overrides: anchorInfo.overrides,
        layouts,
        placer: Optional.none()
      }));
    };
    var HotspotAnchor = [
      required$1('hotspot'),
      option$3('bubble'),
      defaulted('overrides', {}),
      schema$y(),
      output$1('placement', placement$4)
    ];

    const placement$3 = (component, anchorInfo, origin) => {
      const pos = translate$2(origin, anchorInfo.x, anchorInfo.y);
      const anchorBox = bounds(pos.left, pos.top, anchorInfo.width, anchorInfo.height);
      const layouts = get$5(component.element, anchorInfo, all$1(), allRtl$1(), all$1(), allRtl$1(), Optional.none());
      return Optional.some(nu$4({
        anchorBox,
        bubble: anchorInfo.bubble,
        overrides: anchorInfo.overrides,
        layouts,
        placer: Optional.none()
      }));
    };
    var MakeshiftAnchor = [
      required$1('x'),
      required$1('y'),
      defaulted('height', 0),
      defaulted('width', 0),
      defaulted('bubble', fallback()),
      defaulted('overrides', {}),
      schema$y(),
      output$1('placement', placement$3)
    ];

    const adt$7 = Adt.generate([
      { screen: ['point'] },
      {
        absolute: [
          'point',
          'scrollLeft',
          'scrollTop'
        ]
      }
    ]);
    const toFixed = pos => pos.fold(identity, (point, scrollLeft, scrollTop) => point.translate(-scrollLeft, -scrollTop));
    const toAbsolute = pos => pos.fold(identity, identity);
    const sum = points => foldl(points, (b, a) => b.translate(a.left, a.top), SugarPosition(0, 0));
    const sumAsFixed = positions => {
      const points = map$2(positions, toFixed);
      return sum(points);
    };
    const sumAsAbsolute = positions => {
      const points = map$2(positions, toAbsolute);
      return sum(points);
    };
    const screen = adt$7.screen;
    const absolute$1 = adt$7.absolute;

    const getOffset = (component, origin, anchorInfo) => {
      const win = defaultView(anchorInfo.root).dom;
      const hasSameOwner = frame => {
        const frameOwner = owner$4(frame);
        const compOwner = owner$4(component.element);
        return eq(frameOwner, compOwner);
      };
      return Optional.from(win.frameElement).map(SugarElement.fromDom).filter(hasSameOwner).map(absolute$3);
    };
    const getRootPoint = (component, origin, anchorInfo) => {
      const doc = owner$4(component.element);
      const outerScroll = get$b(doc);
      const offset = getOffset(component, origin, anchorInfo).getOr(outerScroll);
      return absolute$1(offset, outerScroll.left, outerScroll.top);
    };

    const getBox = (left, top, width, height) => {
      const point = screen(SugarPosition(left, top));
      return Optional.some(pointed(point, width, height));
    };
    const calcNewAnchor = (optBox, rootPoint, anchorInfo, origin, elem) => optBox.map(box => {
      const points = [
        rootPoint,
        box.point
      ];
      const topLeft = cata$1(origin, () => sumAsAbsolute(points), () => sumAsAbsolute(points), () => sumAsFixed(points));
      const anchorBox = rect(topLeft.left, topLeft.top, box.width, box.height);
      const layoutsLtr = anchorInfo.showAbove ? aboveOrBelow() : belowOrAbove();
      const layoutsRtl = anchorInfo.showAbove ? aboveOrBelowRtl() : belowOrAboveRtl();
      const layouts = get$5(elem, anchorInfo, layoutsLtr, layoutsRtl, layoutsLtr, layoutsRtl, Optional.none());
      return nu$4({
        anchorBox,
        bubble: anchorInfo.bubble.getOr(fallback()),
        overrides: anchorInfo.overrides,
        layouts,
        placer: Optional.none()
      });
    });

    const placement$2 = (component, anchorInfo, origin) => {
      const rootPoint = getRootPoint(component, origin, anchorInfo);
      return anchorInfo.node.filter(inBody).bind(target => {
        const rect = target.dom.getBoundingClientRect();
        const nodeBox = getBox(rect.left, rect.top, rect.width, rect.height);
        const elem = anchorInfo.node.getOr(component.element);
        return calcNewAnchor(nodeBox, rootPoint, anchorInfo, origin, elem);
      });
    };
    var NodeAnchor = [
      required$1('node'),
      required$1('root'),
      option$3('bubble'),
      schema$y(),
      defaulted('overrides', {}),
      defaulted('showAbove', false),
      output$1('placement', placement$2)
    ];

    const zeroWidth = '\uFEFF';
    const nbsp = '\xA0';

    const create$2 = (start, soffset, finish, foffset) => ({
      start,
      soffset,
      finish,
      foffset
    });
    const SimRange = { create: create$2 };

    const adt$6 = Adt.generate([
      { before: ['element'] },
      {
        on: [
          'element',
          'offset'
        ]
      },
      { after: ['element'] }
    ]);
    const cata = (subject, onBefore, onOn, onAfter) => subject.fold(onBefore, onOn, onAfter);
    const getStart$1 = situ => situ.fold(identity, identity, identity);
    const before = adt$6.before;
    const on$1 = adt$6.on;
    const after$1 = adt$6.after;
    const Situ = {
      before,
      on: on$1,
      after: after$1,
      cata,
      getStart: getStart$1
    };

    const adt$5 = Adt.generate([
      { domRange: ['rng'] },
      {
        relative: [
          'startSitu',
          'finishSitu'
        ]
      },
      {
        exact: [
          'start',
          'soffset',
          'finish',
          'foffset'
        ]
      }
    ]);
    const exactFromRange = simRange => adt$5.exact(simRange.start, simRange.soffset, simRange.finish, simRange.foffset);
    const getStart = selection => selection.match({
      domRange: rng => SugarElement.fromDom(rng.startContainer),
      relative: (startSitu, _finishSitu) => Situ.getStart(startSitu),
      exact: (start, _soffset, _finish, _foffset) => start
    });
    const domRange = adt$5.domRange;
    const relative = adt$5.relative;
    const exact = adt$5.exact;
    const getWin = selection => {
      const start = getStart(selection);
      return defaultView(start);
    };
    const range$1 = SimRange.create;
    const SimSelection = {
      domRange,
      relative,
      exact,
      exactFromRange,
      getWin,
      range: range$1
    };

    const setStart = (rng, situ) => {
      situ.fold(e => {
        rng.setStartBefore(e.dom);
      }, (e, o) => {
        rng.setStart(e.dom, o);
      }, e => {
        rng.setStartAfter(e.dom);
      });
    };
    const setFinish = (rng, situ) => {
      situ.fold(e => {
        rng.setEndBefore(e.dom);
      }, (e, o) => {
        rng.setEnd(e.dom, o);
      }, e => {
        rng.setEndAfter(e.dom);
      });
    };
    const relativeToNative = (win, startSitu, finishSitu) => {
      const range = win.document.createRange();
      setStart(range, startSitu);
      setFinish(range, finishSitu);
      return range;
    };
    const exactToNative = (win, start, soffset, finish, foffset) => {
      const rng = win.document.createRange();
      rng.setStart(start.dom, soffset);
      rng.setEnd(finish.dom, foffset);
      return rng;
    };
    const toRect = rect => ({
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height
    });
    const getFirstRect$1 = rng => {
      const rects = rng.getClientRects();
      const rect = rects.length > 0 ? rects[0] : rng.getBoundingClientRect();
      return rect.width > 0 || rect.height > 0 ? Optional.some(rect).map(toRect) : Optional.none();
    };
    const getBounds$2 = rng => {
      const rect = rng.getBoundingClientRect();
      return rect.width > 0 || rect.height > 0 ? Optional.some(rect).map(toRect) : Optional.none();
    };

    const adt$4 = Adt.generate([
      {
        ltr: [
          'start',
          'soffset',
          'finish',
          'foffset'
        ]
      },
      {
        rtl: [
          'start',
          'soffset',
          'finish',
          'foffset'
        ]
      }
    ]);
    const fromRange = (win, type, range) => type(SugarElement.fromDom(range.startContainer), range.startOffset, SugarElement.fromDom(range.endContainer), range.endOffset);
    const getRanges = (win, selection) => selection.match({
      domRange: rng => {
        return {
          ltr: constant$1(rng),
          rtl: Optional.none
        };
      },
      relative: (startSitu, finishSitu) => {
        return {
          ltr: cached(() => relativeToNative(win, startSitu, finishSitu)),
          rtl: cached(() => Optional.some(relativeToNative(win, finishSitu, startSitu)))
        };
      },
      exact: (start, soffset, finish, foffset) => {
        return {
          ltr: cached(() => exactToNative(win, start, soffset, finish, foffset)),
          rtl: cached(() => Optional.some(exactToNative(win, finish, foffset, start, soffset)))
        };
      }
    });
    const doDiagnose = (win, ranges) => {
      const rng = ranges.ltr();
      if (rng.collapsed) {
        const reversed = ranges.rtl().filter(rev => rev.collapsed === false);
        return reversed.map(rev => adt$4.rtl(SugarElement.fromDom(rev.endContainer), rev.endOffset, SugarElement.fromDom(rev.startContainer), rev.startOffset)).getOrThunk(() => fromRange(win, adt$4.ltr, rng));
      } else {
        return fromRange(win, adt$4.ltr, rng);
      }
    };
    const diagnose = (win, selection) => {
      const ranges = getRanges(win, selection);
      return doDiagnose(win, ranges);
    };
    const asLtrRange = (win, selection) => {
      const diagnosis = diagnose(win, selection);
      return diagnosis.match({
        ltr: (start, soffset, finish, foffset) => {
          const rng = win.document.createRange();
          rng.setStart(start.dom, soffset);
          rng.setEnd(finish.dom, foffset);
          return rng;
        },
        rtl: (start, soffset, finish, foffset) => {
          const rng = win.document.createRange();
          rng.setStart(finish.dom, foffset);
          rng.setEnd(start.dom, soffset);
          return rng;
        }
      });
    };
    adt$4.ltr;
    adt$4.rtl;

    const descendants = (scope, selector) => all$3(selector, scope);

    const makeRange = (start, soffset, finish, foffset) => {
      const doc = owner$4(start);
      const rng = doc.dom.createRange();
      rng.setStart(start.dom, soffset);
      rng.setEnd(finish.dom, foffset);
      return rng;
    };
    const after = (start, soffset, finish, foffset) => {
      const r = makeRange(start, soffset, finish, foffset);
      const same = eq(start, finish) && soffset === foffset;
      return r.collapsed && !same;
    };

    const getNativeSelection = win => Optional.from(win.getSelection());
    const readRange = selection => {
      if (selection.rangeCount > 0) {
        const firstRng = selection.getRangeAt(0);
        const lastRng = selection.getRangeAt(selection.rangeCount - 1);
        return Optional.some(SimRange.create(SugarElement.fromDom(firstRng.startContainer), firstRng.startOffset, SugarElement.fromDom(lastRng.endContainer), lastRng.endOffset));
      } else {
        return Optional.none();
      }
    };
    const doGetExact = selection => {
      if (selection.anchorNode === null || selection.focusNode === null) {
        return readRange(selection);
      } else {
        const anchor = SugarElement.fromDom(selection.anchorNode);
        const focus = SugarElement.fromDom(selection.focusNode);
        return after(anchor, selection.anchorOffset, focus, selection.focusOffset) ? Optional.some(SimRange.create(anchor, selection.anchorOffset, focus, selection.focusOffset)) : readRange(selection);
      }
    };
    const getExact = win => getNativeSelection(win).filter(sel => sel.rangeCount > 0).bind(doGetExact);
    const getFirstRect = (win, selection) => {
      const rng = asLtrRange(win, selection);
      return getFirstRect$1(rng);
    };
    const getBounds$1 = (win, selection) => {
      const rng = asLtrRange(win, selection);
      return getBounds$2(rng);
    };

    const NodeValue = (is, name) => {
      const get = element => {
        if (!is(element)) {
          throw new Error('Can only get ' + name + ' value of a ' + name + ' node');
        }
        return getOption(element).getOr('');
      };
      const getOption = element => is(element) ? Optional.from(element.dom.nodeValue) : Optional.none();
      const set = (element, value) => {
        if (!is(element)) {
          throw new Error('Can only set raw ' + name + ' value of a ' + name + ' node');
        }
        element.dom.nodeValue = value;
      };
      return {
        get,
        getOption,
        set
      };
    };

    const api = NodeValue(isText, 'text');
    const get$4 = element => api.get(element);

    const point = (element, offset) => ({
      element,
      offset
    });
    const descendOnce$1 = (element, offset) => {
      const children$1 = children(element);
      if (children$1.length === 0) {
        return point(element, offset);
      } else if (offset < children$1.length) {
        return point(children$1[offset], 0);
      } else {
        const last = children$1[children$1.length - 1];
        const len = isText(last) ? get$4(last).length : children(last).length;
        return point(last, len);
      }
    };

    const descendOnce = (element, offset) => isText(element) ? point(element, offset) : descendOnce$1(element, offset);
    const getAnchorSelection = (win, anchorInfo) => {
      const getSelection = anchorInfo.getSelection.getOrThunk(() => () => getExact(win));
      return getSelection().map(sel => {
        const modStart = descendOnce(sel.start, sel.soffset);
        const modFinish = descendOnce(sel.finish, sel.foffset);
        return SimSelection.range(modStart.element, modStart.offset, modFinish.element, modFinish.offset);
      });
    };
    const placement$1 = (component, anchorInfo, origin) => {
      const win = defaultView(anchorInfo.root).dom;
      const rootPoint = getRootPoint(component, origin, anchorInfo);
      const selectionBox = getAnchorSelection(win, anchorInfo).bind(sel => {
        const optRect = getBounds$1(win, SimSelection.exactFromRange(sel)).orThunk(() => {
          const x = SugarElement.fromText(zeroWidth);
          before$1(sel.start, x);
          const rect = getFirstRect(win, SimSelection.exact(x, 0, x, 1));
          remove$5(x);
          return rect;
        });
        return optRect.bind(rawRect => getBox(rawRect.left, rawRect.top, rawRect.width, rawRect.height));
      });
      const targetElement = getAnchorSelection(win, anchorInfo).bind(sel => isElement$1(sel.start) ? Optional.some(sel.start) : parentElement(sel.start));
      const elem = targetElement.getOr(component.element);
      return calcNewAnchor(selectionBox, rootPoint, anchorInfo, origin, elem);
    };
    var SelectionAnchor = [
      option$3('getSelection'),
      required$1('root'),
      option$3('bubble'),
      schema$y(),
      defaulted('overrides', {}),
      defaulted('showAbove', false),
      output$1('placement', placement$1)
    ];

    const labelPrefix$1 = 'link-layout';
    const eastX = anchor => anchor.x + anchor.width;
    const westX = (anchor, element) => anchor.x - element.width;
    const northY$1 = (anchor, element) => anchor.y - element.height + anchor.height;
    const southY$1 = anchor => anchor.y;
    const southeast$1 = (anchor, element, bubbles) => nu$6(eastX(anchor), southY$1(anchor), bubbles.southeast(), southeast$3(), 'southeast', boundsRestriction(anchor, {
      left: 0,
      top: 2
    }), labelPrefix$1);
    const southwest$1 = (anchor, element, bubbles) => nu$6(westX(anchor, element), southY$1(anchor), bubbles.southwest(), southwest$3(), 'southwest', boundsRestriction(anchor, {
      right: 1,
      top: 2
    }), labelPrefix$1);
    const northeast$1 = (anchor, element, bubbles) => nu$6(eastX(anchor), northY$1(anchor, element), bubbles.northeast(), northeast$3(), 'northeast', boundsRestriction(anchor, {
      left: 0,
      bottom: 3
    }), labelPrefix$1);
    const northwest$1 = (anchor, element, bubbles) => nu$6(westX(anchor, element), northY$1(anchor, element), bubbles.northwest(), northwest$3(), 'northwest', boundsRestriction(anchor, {
      right: 1,
      bottom: 3
    }), labelPrefix$1);
    const all = () => [
      southeast$1,
      southwest$1,
      northeast$1,
      northwest$1
    ];
    const allRtl = () => [
      southwest$1,
      southeast$1,
      northwest$1,
      northeast$1
    ];

    const placement = (component, submenuInfo, origin) => {
      const anchorBox = toBox(origin, submenuInfo.item.element);
      const layouts = get$5(component.element, submenuInfo, all(), allRtl(), all(), allRtl(), Optional.none());
      return Optional.some(nu$4({
        anchorBox,
        bubble: fallback(),
        overrides: submenuInfo.overrides,
        layouts,
        placer: Optional.none()
      }));
    };
    var SubmenuAnchor = [
      required$1('item'),
      schema$y(),
      defaulted('overrides', {}),
      output$1('placement', placement)
    ];

    var AnchorSchema = choose$1('type', {
      selection: SelectionAnchor,
      node: NodeAnchor,
      hotspot: HotspotAnchor,
      submenu: SubmenuAnchor,
      makeshift: MakeshiftAnchor
    });

    const TransitionSchema = [
      requiredArrayOf('classes', string),
      defaultedStringEnum('mode', 'all', [
        'all',
        'layout',
        'placement'
      ])
    ];
    const PositionSchema = [
      defaulted('useFixed', never),
      option$3('getBounds')
    ];
    const PlacementSchema = [
      requiredOf('anchor', AnchorSchema),
      optionObjOf('transition', TransitionSchema)
    ];

    const getFixedOrigin = () => {
      const html = document.documentElement;
      return fixed$1(0, 0, html.clientWidth, html.clientHeight);
    };
    const getRelativeOrigin = component => {
      const position = absolute$3(component.element);
      const bounds = component.element.dom.getBoundingClientRect();
      return relative$1(position.left, position.top, bounds.width, bounds.height);
    };
    const place = (component, origin, anchoring, getBounds, placee, lastPlace, transition) => {
      const anchor = box(anchoring.anchorBox, origin);
      return simple(anchor, placee.element, anchoring.bubble, anchoring.layouts, lastPlace, getBounds, anchoring.overrides, transition);
    };
    const position$1 = (component, posConfig, posState, placee, placementSpec) => {
      positionWithin(component, posConfig, posState, placee, placementSpec, Optional.none());
    };
    const positionWithin = (component, posConfig, posState, placee, placementSpec, boxElement) => {
      const boundsBox = boxElement.map(box$1);
      return positionWithinBounds(component, posConfig, posState, placee, placementSpec, boundsBox);
    };
    const positionWithinBounds = (component, posConfig, posState, placee, placementSpec, bounds) => {
      const placeeDetail = asRawOrDie$1('placement.info', objOf(PlacementSchema), placementSpec);
      const anchorage = placeeDetail.anchor;
      const element = placee.element;
      const placeeState = posState.get(placee.uid);
      preserve$1(() => {
        set$8(element, 'position', 'fixed');
        const oldVisibility = getRaw(element, 'visibility');
        set$8(element, 'visibility', 'hidden');
        const origin = posConfig.useFixed() ? getFixedOrigin() : getRelativeOrigin(component);
        const placer = anchorage.placement;
        const getBounds = bounds.map(constant$1).or(posConfig.getBounds);
        placer(component, anchorage, origin).each(anchoring => {
          const doPlace = anchoring.placer.getOr(place);
          const newState = doPlace(component, origin, anchoring, getBounds, placee, placeeState, placeeDetail.transition);
          posState.set(placee.uid, newState);
        });
        oldVisibility.fold(() => {
          remove$6(element, 'visibility');
        }, vis => {
          set$8(element, 'visibility', vis);
        });
        if (getRaw(element, 'left').isNone() && getRaw(element, 'top').isNone() && getRaw(element, 'right').isNone() && getRaw(element, 'bottom').isNone() && is$1(getRaw(element, 'position'), 'fixed')) {
          remove$6(element, 'position');
        }
      }, element);
    };
    const getMode = (component, pConfig, _pState) => pConfig.useFixed() ? 'fixed' : 'absolute';
    const reset$1 = (component, pConfig, posState, placee) => {
      const element = placee.element;
      each$1([
        'position',
        'left',
        'right',
        'top',
        'bottom'
      ], prop => remove$6(element, prop));
      reset$2(element);
      posState.clear(placee.uid);
    };

    var PositionApis = /*#__PURE__*/Object.freeze({
        __proto__: null,
        position: position$1,
        positionWithin: positionWithin,
        positionWithinBounds: positionWithinBounds,
        getMode: getMode,
        reset: reset$1
    });

    const init$g = () => {
      let state = {};
      const set = (id, data) => {
        state[id] = data;
      };
      const get = id => get$g(state, id);
      const clear = id => {
        if (isNonNullable(id)) {
          delete state[id];
        } else {
          state = {};
        }
      };
      return nu$8({
        readState: () => state,
        clear,
        set,
        get
      });
    };

    var PositioningState = /*#__PURE__*/Object.freeze({
        __proto__: null,
        init: init$g
    });

    const Positioning = create$3({
      fields: PositionSchema,
      name: 'positioning',
      active: ActivePosition,
      apis: PositionApis,
      state: PositioningState
    });

    const isConnected = comp => comp.getSystem().isConnected();
    const fireDetaching = component => {
      emit(component, detachedFromDom());
      const children = component.components();
      each$1(children, fireDetaching);
    };
    const fireAttaching = component => {
      const children = component.components();
      each$1(children, fireAttaching);
      emit(component, attachedToDom());
    };
    const virtualAttach = (parent, child) => {
      parent.getSystem().addToWorld(child);
      if (inBody(parent.element)) {
        fireAttaching(child);
      }
    };
    const virtualDetach = comp => {
      fireDetaching(comp);
      comp.getSystem().removeFromWorld(comp);
    };
    const attach$1 = (parent, child) => {
      append$2(parent.element, child.element);
    };
    const detachChildren$1 = component => {
      each$1(component.components(), childComp => remove$5(childComp.element));
      empty(component.element);
      component.syncComponents();
    };
    const replaceChildren = (component, newSpecs, buildNewChildren) => {
      const subs = component.components();
      detachChildren$1(component);
      const newChildren = buildNewChildren(newSpecs);
      const deleted = difference(subs, newChildren);
      each$1(deleted, comp => {
        fireDetaching(comp);
        component.getSystem().removeFromWorld(comp);
      });
      each$1(newChildren, childComp => {
        if (!isConnected(childComp)) {
          component.getSystem().addToWorld(childComp);
          attach$1(component, childComp);
          if (inBody(component.element)) {
            fireAttaching(childComp);
          }
        } else {
          attach$1(component, childComp);
        }
      });
      component.syncComponents();
    };
    const virtualReplaceChildren = (component, newSpecs, buildNewChildren) => {
      const subs = component.components();
      const existingComps = bind$3(newSpecs, spec => getPremade(spec).toArray());
      each$1(subs, childComp => {
        if (!contains$2(existingComps, childComp)) {
          virtualDetach(childComp);
        }
      });
      const newChildren = buildNewChildren(newSpecs);
      const deleted = difference(subs, newChildren);
      each$1(deleted, deletedComp => {
        if (isConnected(deletedComp)) {
          virtualDetach(deletedComp);
        }
      });
      each$1(newChildren, childComp => {
        if (!isConnected(childComp)) {
          virtualAttach(component, childComp);
        }
      });
      component.syncComponents();
    };

    const attach = (parent, child) => {
      attachWith(parent, child, append$2);
    };
    const attachWith = (parent, child, insertion) => {
      parent.getSystem().addToWorld(child);
      insertion(parent.element, child.element);
      if (inBody(parent.element)) {
        fireAttaching(child);
      }
      parent.syncComponents();
    };
    const doDetach = component => {
      fireDetaching(component);
      remove$5(component.element);
      component.getSystem().removeFromWorld(component);
    };
    const detach = component => {
      const parent$1 = parent(component.element).bind(p => component.getSystem().getByDom(p).toOptional());
      doDetach(component);
      parent$1.each(p => {
        p.syncComponents();
      });
    };
    const detachChildren = component => {
      const subs = component.components();
      each$1(subs, doDetach);
      empty(component.element);
      component.syncComponents();
    };
    const attachSystem = (element, guiSystem) => {
      attachSystemWith(element, guiSystem, append$2);
    };
    const attachSystemAfter = (element, guiSystem) => {
      attachSystemWith(element, guiSystem, after$2);
    };
    const attachSystemWith = (element, guiSystem, inserter) => {
      inserter(element, guiSystem.element);
      const children$1 = children(guiSystem.element);
      each$1(children$1, child => {
        guiSystem.getByDom(child).each(fireAttaching);
      });
    };
    const detachSystem = guiSystem => {
      const children$1 = children(guiSystem.element);
      each$1(children$1, child => {
        guiSystem.getByDom(child).each(fireDetaching);
      });
      remove$5(guiSystem.element);
    };

    const rebuild = (sandbox, sConfig, sState, data) => {
      sState.get().each(_data => {
        detachChildren(sandbox);
      });
      const point = sConfig.getAttachPoint(sandbox);
      attach(point, sandbox);
      const built = sandbox.getSystem().build(data);
      attach(sandbox, built);
      sState.set(built);
      return built;
    };
    const open$1 = (sandbox, sConfig, sState, data) => {
      const newState = rebuild(sandbox, sConfig, sState, data);
      sConfig.onOpen(sandbox, newState);
      return newState;
    };
    const setContent = (sandbox, sConfig, sState, data) => sState.get().map(() => rebuild(sandbox, sConfig, sState, data));
    const openWhileCloaked = (sandbox, sConfig, sState, data, transaction) => {
      cloak(sandbox, sConfig);
      open$1(sandbox, sConfig, sState, data);
      transaction();
      decloak(sandbox, sConfig);
    };
    const close$1 = (sandbox, sConfig, sState) => {
      sState.get().each(data => {
        detachChildren(sandbox);
        detach(sandbox);
        sConfig.onClose(sandbox, data);
        sState.clear();
      });
    };
    const isOpen$1 = (_sandbox, _sConfig, sState) => sState.isOpen();
    const isPartOf = (sandbox, sConfig, sState, queryElem) => isOpen$1(sandbox, sConfig, sState) && sState.get().exists(data => sConfig.isPartOf(sandbox, data, queryElem));
    const getState$2 = (_sandbox, _sConfig, sState) => sState.get();
    const store = (sandbox, cssKey, attr, newValue) => {
      getRaw(sandbox.element, cssKey).fold(() => {
        remove$7(sandbox.element, attr);
      }, v => {
        set$9(sandbox.element, attr, v);
      });
      set$8(sandbox.element, cssKey, newValue);
    };
    const restore = (sandbox, cssKey, attr) => {
      getOpt(sandbox.element, attr).fold(() => remove$6(sandbox.element, cssKey), oldValue => set$8(sandbox.element, cssKey, oldValue));
    };
    const cloak = (sandbox, sConfig, _sState) => {
      const sink = sConfig.getAttachPoint(sandbox);
      set$8(sandbox.element, 'position', Positioning.getMode(sink));
      store(sandbox, 'visibility', sConfig.cloakVisibilityAttr, 'hidden');
    };
    const hasPosition = element => exists([
      'top',
      'left',
      'right',
      'bottom'
    ], pos => getRaw(element, pos).isSome());
    const decloak = (sandbox, sConfig, _sState) => {
      if (!hasPosition(sandbox.element)) {
        remove$6(sandbox.element, 'position');
      }
      restore(sandbox, 'visibility', sConfig.cloakVisibilityAttr);
    };

    var SandboxApis = /*#__PURE__*/Object.freeze({
        __proto__: null,
        cloak: cloak,
        decloak: decloak,
        open: open$1,
        openWhileCloaked: openWhileCloaked,
        close: close$1,
        isOpen: isOpen$1,
        isPartOf: isPartOf,
        getState: getState$2,
        setContent: setContent
    });

    const events$g = (sandboxConfig, sandboxState) => derive$2([run$1(sandboxClose(), (sandbox, _simulatedEvent) => {
        close$1(sandbox, sandboxConfig, sandboxState);
      })]);

    var ActiveSandbox = /*#__PURE__*/Object.freeze({
        __proto__: null,
        events: events$g
    });

    var SandboxSchema = [
      onHandler('onOpen'),
      onHandler('onClose'),
      required$1('isPartOf'),
      required$1('getAttachPoint'),
      defaulted('cloakVisibilityAttr', 'data-precloak-visibility')
    ];

    const init$f = () => {
      const contents = value$2();
      const readState = constant$1('not-implemented');
      return nu$8({
        readState,
        isOpen: contents.isSet,
        clear: contents.clear,
        set: contents.set,
        get: contents.get
      });
    };

    var SandboxState = /*#__PURE__*/Object.freeze({
        __proto__: null,
        init: init$f
    });

    const Sandboxing = create$3({
      fields: SandboxSchema,
      name: 'sandboxing',
      active: ActiveSandbox,
      apis: SandboxApis,
      state: SandboxState
    });

    const dismissPopups = constant$1('dismiss.popups');
    const repositionPopups = constant$1('reposition.popups');
    const mouseReleased = constant$1('mouse.released');

    const schema$x = objOfOnly([
      defaulted('isExtraPart', never),
      optionObjOf('fireEventInstead', [defaulted('event', dismissRequested())])
    ]);
    const receivingChannel$1 = rawSpec => {
      const detail = asRawOrDie$1('Dismissal', schema$x, rawSpec);
      return {
        [dismissPopups()]: {
          schema: objOfOnly([required$1('target')]),
          onReceive: (sandbox, data) => {
            if (Sandboxing.isOpen(sandbox)) {
              const isPart = Sandboxing.isPartOf(sandbox, data.target) || detail.isExtraPart(sandbox, data.target);
              if (!isPart) {
                detail.fireEventInstead.fold(() => Sandboxing.close(sandbox), fe => emit(sandbox, fe.event));
              }
            }
          }
        }
      };
    };

    const schema$w = objOfOnly([
      optionObjOf('fireEventInstead', [defaulted('event', repositionRequested())]),
      requiredFunction('doReposition')
    ]);
    const receivingChannel = rawSpec => {
      const detail = asRawOrDie$1('Reposition', schema$w, rawSpec);
      return {
        [repositionPopups()]: {
          onReceive: sandbox => {
            if (Sandboxing.isOpen(sandbox)) {
              detail.fireEventInstead.fold(() => detail.doReposition(sandbox), fe => emit(sandbox, fe.event));
            }
          }
        }
      };
    };

    const onLoad$5 = (component, repConfig, repState) => {
      repConfig.store.manager.onLoad(component, repConfig, repState);
    };
    const onUnload$2 = (component, repConfig, repState) => {
      repConfig.store.manager.onUnload(component, repConfig, repState);
    };
    const setValue$3 = (component, repConfig, repState, data) => {
      repConfig.store.manager.setValue(component, repConfig, repState, data);
    };
    const getValue$3 = (component, repConfig, repState) => repConfig.store.manager.getValue(component, repConfig, repState);
    const getState$1 = (component, repConfig, repState) => repState;

    var RepresentApis = /*#__PURE__*/Object.freeze({
        __proto__: null,
        onLoad: onLoad$5,
        onUnload: onUnload$2,
        setValue: setValue$3,
        getValue: getValue$3,
        getState: getState$1
    });

    const events$f = (repConfig, repState) => {
      const es = repConfig.resetOnDom ? [
        runOnAttached((comp, _se) => {
          onLoad$5(comp, repConfig, repState);
        }),
        runOnDetached((comp, _se) => {
          onUnload$2(comp, repConfig, repState);
        })
      ] : [loadEvent(repConfig, repState, onLoad$5)];
      return derive$2(es);
    };

    var ActiveRepresenting = /*#__PURE__*/Object.freeze({
        __proto__: null,
        events: events$f
    });

    const memory$1 = () => {
      const data = Cell(null);
      const readState = () => ({
        mode: 'memory',
        value: data.get()
      });
      const isNotSet = () => data.get() === null;
      const clear = () => {
        data.set(null);
      };
      return nu$8({
        set: data.set,
        get: data.get,
        isNotSet,
        clear,
        readState
      });
    };
    const manual = () => {
      const readState = noop;
      return nu$8({ readState });
    };
    const dataset = () => {
      const dataByValue = Cell({});
      const dataByText = Cell({});
      const readState = () => ({
        mode: 'dataset',
        dataByValue: dataByValue.get(),
        dataByText: dataByText.get()
      });
      const clear = () => {
        dataByValue.set({});
        dataByText.set({});
      };
      const lookup = itemString => get$g(dataByValue.get(), itemString).orThunk(() => get$g(dataByText.get(), itemString));
      const update = items => {
        const currentDataByValue = dataByValue.get();
        const currentDataByText = dataByText.get();
        const newDataByValue = {};
        const newDataByText = {};
        each$1(items, item => {
          newDataByValue[item.value] = item;
          get$g(item, 'meta').each(meta => {
            get$g(meta, 'text').each(text => {
              newDataByText[text] = item;
            });
          });
        });
        dataByValue.set({
          ...currentDataByValue,
          ...newDataByValue
        });
        dataByText.set({
          ...currentDataByText,
          ...newDataByText
        });
      };
      return nu$8({
        readState,
        lookup,
        update,
        clear
      });
    };
    const init$e = spec => spec.store.manager.state(spec);

    var RepresentState = /*#__PURE__*/Object.freeze({
        __proto__: null,
        memory: memory$1,
        dataset: dataset,
        manual: manual,
        init: init$e
    });

    const setValue$2 = (component, repConfig, repState, data) => {
      const store = repConfig.store;
      repState.update([data]);
      store.setValue(component, data);
      repConfig.onSetValue(component, data);
    };
    const getValue$2 = (component, repConfig, repState) => {
      const store = repConfig.store;
      const key = store.getDataKey(component);
      return repState.lookup(key).getOrThunk(() => store.getFallbackEntry(key));
    };
    const onLoad$4 = (component, repConfig, repState) => {
      const store = repConfig.store;
      store.initialValue.each(data => {
        setValue$2(component, repConfig, repState, data);
      });
    };
    const onUnload$1 = (component, repConfig, repState) => {
      repState.clear();
    };
    var DatasetStore = [
      option$3('initialValue'),
      required$1('getFallbackEntry'),
      required$1('getDataKey'),
      required$1('setValue'),
      output$1('manager', {
        setValue: setValue$2,
        getValue: getValue$2,
        onLoad: onLoad$4,
        onUnload: onUnload$1,
        state: dataset
      })
    ];

    const getValue$1 = (component, repConfig, _repState) => repConfig.store.getValue(component);
    const setValue$1 = (component, repConfig, _repState, data) => {
      repConfig.store.setValue(component, data);
      repConfig.onSetValue(component, data);
    };
    const onLoad$3 = (component, repConfig, _repState) => {
      repConfig.store.initialValue.each(data => {
        repConfig.store.setValue(component, data);
      });
    };
    var ManualStore = [
      required$1('getValue'),
      defaulted('setValue', noop),
      option$3('initialValue'),
      output$1('manager', {
        setValue: setValue$1,
        getValue: getValue$1,
        onLoad: onLoad$3,
        onUnload: noop,
        state: NoState.init
      })
    ];

    const setValue = (component, repConfig, repState, data) => {
      repState.set(data);
      repConfig.onSetValue(component, data);
    };
    const getValue = (component, repConfig, repState) => repState.get();
    const onLoad$2 = (component, repConfig, repState) => {
      repConfig.store.initialValue.each(initVal => {
        if (repState.isNotSet()) {
          repState.set(initVal);
        }
      });
    };
    const onUnload = (component, repConfig, repState) => {
      repState.clear();
    };
    var MemoryStore = [
      option$3('initialValue'),
      output$1('manager', {
        setValue,
        getValue,
        onLoad: onLoad$2,
        onUnload,
        state: memory$1
      })
    ];

    var RepresentSchema = [
      defaultedOf('store', { mode: 'memory' }, choose$1('mode', {
        memory: MemoryStore,
        manual: ManualStore,
        dataset: DatasetStore
      })),
      onHandler('onSetValue'),
      defaulted('resetOnDom', false)
    ];

    const Representing = create$3({
      fields: RepresentSchema,
      name: 'representing',
      active: ActiveRepresenting,
      apis: RepresentApis,
      extra: {
        setValueFrom: (component, source) => {
          const value = Representing.getValue(source);
          Representing.setValue(component, value);
        }
      },
      state: RepresentState
    });

    const field = (name, forbidden) => defaultedObjOf(name, {}, map$2(forbidden, f => forbid(f.name(), 'Cannot configure ' + f.name() + ' for ' + name)).concat([customField('dump', identity)]));
    const get$3 = data => data.dump;
    const augment = (data, original) => ({
      ...derive$1(original),
      ...data.dump
    });
    const SketchBehaviours = {
      field,
      augment,
      get: get$3
    };

    const _placeholder = 'placeholder';
    const adt$3 = Adt.generate([
      {
        single: [
          'required',
          'valueThunk'
        ]
      },
      {
        multiple: [
          'required',
          'valueThunks'
        ]
      }
    ]);
    const isSubstituted = spec => has$2(spec, 'uiType');
    const subPlaceholder = (owner, detail, compSpec, placeholders) => {
      if (owner.exists(o => o !== compSpec.owner)) {
        return adt$3.single(true, constant$1(compSpec));
      }
      return get$g(placeholders, compSpec.name).fold(() => {
        throw new Error('Unknown placeholder component: ' + compSpec.name + '\nKnown: [' + keys(placeholders) + ']\nNamespace: ' + owner.getOr('none') + '\nSpec: ' + JSON.stringify(compSpec, null, 2));
      }, newSpec => newSpec.replace());
    };
    const scan = (owner, detail, compSpec, placeholders) => {
      if (isSubstituted(compSpec) && compSpec.uiType === _placeholder) {
        return subPlaceholder(owner, detail, compSpec, placeholders);
      } else {
        return adt$3.single(false, constant$1(compSpec));
      }
    };
    const substitute = (owner, detail, compSpec, placeholders) => {
      const base = scan(owner, detail, compSpec, placeholders);
      return base.fold((req, valueThunk) => {
        const value = isSubstituted(compSpec) ? valueThunk(detail, compSpec.config, compSpec.validated) : valueThunk(detail);
        const childSpecs = get$g(value, 'components').getOr([]);
        const substituted = bind$3(childSpecs, c => substitute(owner, detail, c, placeholders));
        return [{
            ...value,
            components: substituted
          }];
      }, (req, valuesThunk) => {
        if (isSubstituted(compSpec)) {
          const values = valuesThunk(detail, compSpec.config, compSpec.validated);
          const preprocessor = compSpec.validated.preprocess.getOr(identity);
          return preprocessor(values);
        } else {
          return valuesThunk(detail);
        }
      });
    };
    const substituteAll = (owner, detail, components, placeholders) => bind$3(components, c => substitute(owner, detail, c, placeholders));
    const oneReplace = (label, replacements) => {
      let called = false;
      const used = () => called;
      const replace = () => {
        if (called) {
          throw new Error('Trying to use the same placeholder more than once: ' + label);
        }
        called = true;
        return replacements;
      };
      const required = () => replacements.fold((req, _) => req, (req, _) => req);
      return {
        name: constant$1(label),
        required,
        used,
        replace
      };
    };
    const substitutePlaces = (owner, detail, components, placeholders) => {
      const ps = map$1(placeholders, (ph, name) => oneReplace(name, ph));
      const outcome = substituteAll(owner, detail, components, ps);
      each(ps, p => {
        if (p.used() === false && p.required()) {
          throw new Error('Placeholder: ' + p.name() + ' was not found in components list\nNamespace: ' + owner.getOr('none') + '\nComponents: ' + JSON.stringify(detail.components, null, 2));
        }
      });
      return outcome;
    };
    const single$2 = adt$3.single;
    const multiple = adt$3.multiple;
    const placeholder = constant$1(_placeholder);

    const adt$2 = Adt.generate([
      { required: ['data'] },
      { external: ['data'] },
      { optional: ['data'] },
      { group: ['data'] }
    ]);
    const fFactory = defaulted('factory', { sketch: identity });
    const fSchema = defaulted('schema', []);
    const fName = required$1('name');
    const fPname = field$1('pname', 'pname', defaultedThunk(typeSpec => '<alloy.' + generate$6(typeSpec.name) + '>'), anyValue());
    const fGroupSchema = customField('schema', () => [option$3('preprocess')]);
    const fDefaults = defaulted('defaults', constant$1({}));
    const fOverrides = defaulted('overrides', constant$1({}));
    const requiredSpec = objOf([
      fFactory,
      fSchema,
      fName,
      fPname,
      fDefaults,
      fOverrides
    ]);
    const externalSpec = objOf([
      fFactory,
      fSchema,
      fName,
      fDefaults,
      fOverrides
    ]);
    const optionalSpec = objOf([
      fFactory,
      fSchema,
      fName,
      fPname,
      fDefaults,
      fOverrides
    ]);
    const groupSpec = objOf([
      fFactory,
      fGroupSchema,
      fName,
      required$1('unit'),
      fPname,
      fDefaults,
      fOverrides
    ]);
    const asNamedPart = part => {
      return part.fold(Optional.some, Optional.none, Optional.some, Optional.some);
    };
    const name$2 = part => {
      const get = data => data.name;
      return part.fold(get, get, get, get);
    };
    const asCommon = part => {
      return part.fold(identity, identity, identity, identity);
    };
    const convert = (adtConstructor, partSchema) => spec => {
      const data = asRawOrDie$1('Converting part type', partSchema, spec);
      return adtConstructor(data);
    };
    const required = convert(adt$2.required, requiredSpec);
    const external = convert(adt$2.external, externalSpec);
    const optional = convert(adt$2.optional, optionalSpec);
    const group = convert(adt$2.group, groupSpec);
    const original = constant$1('entirety');

    var PartType = /*#__PURE__*/Object.freeze({
        __proto__: null,
        required: required,
        external: external,
        optional: optional,
        group: group,
        asNamedPart: asNamedPart,
        name: name$2,
        asCommon: asCommon,
        original: original
    });

    const combine = (detail, data, partSpec, partValidated) => deepMerge(data.defaults(detail, partSpec, partValidated), partSpec, { uid: detail.partUids[data.name] }, data.overrides(detail, partSpec, partValidated));
    const subs = (owner, detail, parts) => {
      const internals = {};
      const externals = {};
      each$1(parts, part => {
        part.fold(data => {
          internals[data.pname] = single$2(true, (detail, partSpec, partValidated) => data.factory.sketch(combine(detail, data, partSpec, partValidated)));
        }, data => {
          const partSpec = detail.parts[data.name];
          externals[data.name] = constant$1(data.factory.sketch(combine(detail, data, partSpec[original()]), partSpec));
        }, data => {
          internals[data.pname] = single$2(false, (detail, partSpec, partValidated) => data.factory.sketch(combine(detail, data, partSpec, partValidated)));
        }, data => {
          internals[data.pname] = multiple(true, (detail, _partSpec, _partValidated) => {
            const units = detail[data.name];
            return map$2(units, u => data.factory.sketch(deepMerge(data.defaults(detail, u, _partValidated), u, data.overrides(detail, u))));
          });
        });
      });
      return {
        internals: constant$1(internals),
        externals: constant$1(externals)
      };
    };

    const generate$3 = (owner, parts) => {
      const r = {};
      each$1(parts, part => {
        asNamedPart(part).each(np => {
          const g = doGenerateOne(owner, np.pname);
          r[np.name] = config => {
            const validated = asRawOrDie$1('Part: ' + np.name + ' in ' + owner, objOf(np.schema), config);
            return {
              ...g,
              config,
              validated
            };
          };
        });
      });
      return r;
    };
    const doGenerateOne = (owner, pname) => ({
      uiType: placeholder(),
      owner,
      name: pname
    });
    const generateOne$1 = (owner, pname, config) => ({
      uiType: placeholder(),
      owner,
      name: pname,
      config,
      validated: {}
    });
    const schemas = parts => bind$3(parts, part => part.fold(Optional.none, Optional.some, Optional.none, Optional.none).map(data => requiredObjOf(data.name, data.schema.concat([snapshot(original())]))).toArray());
    const names = parts => map$2(parts, name$2);
    const substitutes = (owner, detail, parts) => subs(owner, detail, parts);
    const components$1 = (owner, detail, internals) => substitutePlaces(Optional.some(owner), detail, detail.components, internals);
    const getPart = (component, detail, partKey) => {
      const uid = detail.partUids[partKey];
      return component.getSystem().getByUid(uid).toOptional();
    };
    const getPartOrDie = (component, detail, partKey) => getPart(component, detail, partKey).getOrDie('Could not find part: ' + partKey);
    const getParts = (component, detail, partKeys) => {
      const r = {};
      const uids = detail.partUids;
      const system = component.getSystem();
      each$1(partKeys, pk => {
        r[pk] = constant$1(system.getByUid(uids[pk]));
      });
      return r;
    };
    const getAllParts = (component, detail) => {
      const system = component.getSystem();
      return map$1(detail.partUids, (pUid, _k) => constant$1(system.getByUid(pUid)));
    };
    const getAllPartNames = detail => keys(detail.partUids);
    const getPartsOrDie = (component, detail, partKeys) => {
      const r = {};
      const uids = detail.partUids;
      const system = component.getSystem();
      each$1(partKeys, pk => {
        r[pk] = constant$1(system.getByUid(uids[pk]).getOrDie());
      });
      return r;
    };
    const defaultUids = (baseUid, partTypes) => {
      const partNames = names(partTypes);
      return wrapAll(map$2(partNames, pn => ({
        key: pn,
        value: baseUid + '-' + pn
      })));
    };
    const defaultUidsSchema = partTypes => field$1('partUids', 'partUids', mergeWithThunk(spec => defaultUids(spec.uid, partTypes)), anyValue());

    var AlloyParts = /*#__PURE__*/Object.freeze({
        __proto__: null,
        generate: generate$3,
        generateOne: generateOne$1,
        schemas: schemas,
        names: names,
        substitutes: substitutes,
        components: components$1,
        defaultUids: defaultUids,
        defaultUidsSchema: defaultUidsSchema,
        getAllParts: getAllParts,
        getAllPartNames: getAllPartNames,
        getPart: getPart,
        getPartOrDie: getPartOrDie,
        getParts: getParts,
        getPartsOrDie: getPartsOrDie
    });

    const base = (partSchemas, partUidsSchemas) => {
      const ps = partSchemas.length > 0 ? [requiredObjOf('parts', partSchemas)] : [];
      return ps.concat([
        required$1('uid'),
        defaulted('dom', {}),
        defaulted('components', []),
        snapshot('originalSpec'),
        defaulted('debug.sketcher', {})
      ]).concat(partUidsSchemas);
    };
    const asRawOrDie = (label, schema, spec, partSchemas, partUidsSchemas) => {
      const baseS = base(partSchemas, partUidsSchemas);
      return asRawOrDie$1(label + ' [SpecSchema]', objOfOnly(baseS.concat(schema)), spec);
    };

    const single$1 = (owner, schema, factory, spec) => {
      const specWithUid = supplyUid(spec);
      const detail = asRawOrDie(owner, schema, specWithUid, [], []);
      return factory(detail, specWithUid);
    };
    const composite$1 = (owner, schema, partTypes, factory, spec) => {
      const specWithUid = supplyUid(spec);
      const partSchemas = schemas(partTypes);
      const partUidsSchema = defaultUidsSchema(partTypes);
      const detail = asRawOrDie(owner, schema, specWithUid, partSchemas, [partUidsSchema]);
      const subs = substitutes(owner, detail, partTypes);
      const components = components$1(owner, detail, subs.internals());
      return factory(detail, components, specWithUid, subs.externals());
    };
    const hasUid = spec => has$2(spec, 'uid');
    const supplyUid = spec => {
      return hasUid(spec) ? spec : {
        ...spec,
        uid: generate$5('uid')
      };
    };

    const isSketchSpec = spec => {
      return spec.uid !== undefined;
    };
    const singleSchema = objOfOnly([
      required$1('name'),
      required$1('factory'),
      required$1('configFields'),
      defaulted('apis', {}),
      defaulted('extraApis', {})
    ]);
    const compositeSchema = objOfOnly([
      required$1('name'),
      required$1('factory'),
      required$1('configFields'),
      required$1('partFields'),
      defaulted('apis', {}),
      defaulted('extraApis', {})
    ]);
    const single = rawConfig => {
      const config = asRawOrDie$1('Sketcher for ' + rawConfig.name, singleSchema, rawConfig);
      const sketch = spec => single$1(config.name, config.configFields, config.factory, spec);
      const apis = map$1(config.apis, makeApi);
      const extraApis = map$1(config.extraApis, (f, k) => markAsExtraApi(f, k));
      return {
        name: config.name,
        configFields: config.configFields,
        sketch,
        ...apis,
        ...extraApis
      };
    };
    const composite = rawConfig => {
      const config = asRawOrDie$1('Sketcher for ' + rawConfig.name, compositeSchema, rawConfig);
      const sketch = spec => composite$1(config.name, config.configFields, config.partFields, config.factory, spec);
      const parts = generate$3(config.name, config.partFields);
      const apis = map$1(config.apis, makeApi);
      const extraApis = map$1(config.extraApis, (f, k) => markAsExtraApi(f, k));
      return {
        name: config.name,
        partFields: config.partFields,
        configFields: config.configFields,
        sketch,
        parts,
        ...apis,
        ...extraApis
      };
    };

    const inside = target => isTag('input')(target) && get$f(target, 'type') !== 'radio' || isTag('textarea')(target);

    const getCurrent = (component, composeConfig, _composeState) => composeConfig.find(component);

    var ComposeApis = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getCurrent: getCurrent
    });

    const ComposeSchema = [required$1('find')];

    const Composing = create$3({
      fields: ComposeSchema,
      name: 'composing',
      apis: ComposeApis
    });

    const nativeDisabled = [
      'input',
      'button',
      'textarea',
      'select'
    ];
    const onLoad$1 = (component, disableConfig, disableState) => {
      const f = disableConfig.disabled() ? disable : enable;
      f(component, disableConfig);
    };
    const hasNative = (component, config) => config.useNative === true && contains$2(nativeDisabled, name$3(component.element));
    const nativeIsDisabled = component => has$1(component.element, 'disabled');
    const nativeDisable = component => {
      set$9(component.element, 'disabled', 'disabled');
    };
    const nativeEnable = component => {
      remove$7(component.element, 'disabled');
    };
    const ariaIsDisabled = component => get$f(component.element, 'aria-disabled') === 'true';
    const ariaDisable = component => {
      set$9(component.element, 'aria-disabled', 'true');
    };
    const ariaEnable = component => {
      set$9(component.element, 'aria-disabled', 'false');
    };
    const disable = (component, disableConfig, _disableState) => {
      disableConfig.disableClass.each(disableClass => {
        add$2(component.element, disableClass);
      });
      const f = hasNative(component, disableConfig) ? nativeDisable : ariaDisable;
      f(component);
      disableConfig.onDisabled(component);
    };
    const enable = (component, disableConfig, _disableState) => {
      disableConfig.disableClass.each(disableClass => {
        remove$2(component.element, disableClass);
      });
      const f = hasNative(component, disableConfig) ? nativeEnable : ariaEnable;
      f(component);
      disableConfig.onEnabled(component);
    };
    const isDisabled = (component, disableConfig) => hasNative(component, disableConfig) ? nativeIsDisabled(component) : ariaIsDisabled(component);
    const set$4 = (component, disableConfig, disableState, disabled) => {
      const f = disabled ? disable : enable;
      f(component, disableConfig);
    };

    var DisableApis = /*#__PURE__*/Object.freeze({
        __proto__: null,
        enable: enable,
        disable: disable,
        isDisabled: isDisabled,
        onLoad: onLoad$1,
        set: set$4
    });

    const exhibit$5 = (base, disableConfig) => nu$7({ classes: disableConfig.disabled() ? disableConfig.disableClass.toArray() : [] });
    const events$e = (disableConfig, disableState) => derive$2([
      abort(execute$5(), (component, _simulatedEvent) => isDisabled(component, disableConfig)),
      loadEvent(disableConfig, disableState, onLoad$1)
    ]);

    var ActiveDisable = /*#__PURE__*/Object.freeze({
        __proto__: null,
        exhibit: exhibit$5,
        events: events$e
    });

    var DisableSchema = [
      defaultedFunction('disabled', never),
      defaulted('useNative', true),
      option$3('disableClass'),
      onHandler('onDisabled'),
      onHandler('onEnabled')
    ];

    const Disabling = create$3({
      fields: DisableSchema,
      name: 'disabling',
      active: ActiveDisable,
      apis: DisableApis
    });

    const dehighlightAllExcept = (component, hConfig, hState, skip) => {
      const highlighted = descendants(component.element, '.' + hConfig.highlightClass);
      each$1(highlighted, h => {
        const shouldSkip = exists(skip, skipComp => eq(skipComp.element, h));
        if (!shouldSkip) {
          remove$2(h, hConfig.highlightClass);
          component.getSystem().getByDom(h).each(target => {
            hConfig.onDehighlight(component, target);
            emit(target, dehighlight$1());
          });
        }
      });
    };
    const dehighlightAll = (component, hConfig, hState) => dehighlightAllExcept(component, hConfig, hState, []);
    const dehighlight = (component, hConfig, hState, target) => {
      if (isHighlighted(component, hConfig, hState, target)) {
        remove$2(target.element, hConfig.highlightClass);
        hConfig.onDehighlight(component, target);
        emit(target, dehighlight$1());
      }
    };
    const highlight = (component, hConfig, hState, target) => {
      dehighlightAllExcept(component, hConfig, hState, [target]);
      if (!isHighlighted(component, hConfig, hState, target)) {
        add$2(target.element, hConfig.highlightClass);
        hConfig.onHighlight(component, target);
        emit(target, highlight$1());
      }
    };
    const highlightFirst = (component, hConfig, hState) => {
      getFirst(component, hConfig).each(firstComp => {
        highlight(component, hConfig, hState, firstComp);
      });
    };
    const highlightLast = (component, hConfig, hState) => {
      getLast(component, hConfig).each(lastComp => {
        highlight(component, hConfig, hState, lastComp);
      });
    };
    const highlightAt = (component, hConfig, hState, index) => {
      getByIndex(component, hConfig, hState, index).fold(err => {
        throw err;
      }, firstComp => {
        highlight(component, hConfig, hState, firstComp);
      });
    };
    const highlightBy = (component, hConfig, hState, predicate) => {
      const candidates = getCandidates(component, hConfig);
      const targetComp = find$5(candidates, predicate);
      targetComp.each(c => {
        highlight(component, hConfig, hState, c);
      });
    };
    const isHighlighted = (component, hConfig, hState, queryTarget) => has(queryTarget.element, hConfig.highlightClass);
    const getHighlighted = (component, hConfig, _hState) => descendant(component.element, '.' + hConfig.highlightClass).bind(e => component.getSystem().getByDom(e).toOptional());
    const getByIndex = (component, hConfig, hState, index) => {
      const items = descendants(component.element, '.' + hConfig.itemClass);
      return Optional.from(items[index]).fold(() => Result.error(new Error('No element found with index ' + index)), component.getSystem().getByDom);
    };
    const getFirst = (component, hConfig, _hState) => descendant(component.element, '.' + hConfig.itemClass).bind(e => component.getSystem().getByDom(e).toOptional());
    const getLast = (component, hConfig, _hState) => {
      const items = descendants(component.element, '.' + hConfig.itemClass);
      const last = items.length > 0 ? Optional.some(items[items.length - 1]) : Optional.none();
      return last.bind(c => component.getSystem().getByDom(c).toOptional());
    };
    const getDelta$2 = (component, hConfig, hState, delta) => {
      const items = descendants(component.element, '.' + hConfig.itemClass);
      const current = findIndex$1(items, item => has(item, hConfig.highlightClass));
      return current.bind(selected => {
        const dest = cycleBy(selected, delta, 0, items.length - 1);
        return component.getSystem().getByDom(items[dest]).toOptional();
      });
    };
    const getPrevious = (component, hConfig, hState) => getDelta$2(component, hConfig, hState, -1);
    const getNext = (component, hConfig, hState) => getDelta$2(component, hConfig, hState, +1);
    const getCandidates = (component, hConfig, _hState) => {
      const items = descendants(component.element, '.' + hConfig.itemClass);
      return cat(map$2(items, i => component.getSystem().getByDom(i).toOptional()));
    };

    var HighlightApis = /*#__PURE__*/Object.freeze({
        __proto__: null,
        dehighlightAll: dehighlightAll,
        dehighlight: dehighlight,
        highlight: highlight,
        highlightFirst: highlightFirst,
        highlightLast: highlightLast,
        highlightAt: highlightAt,
        highlightBy: highlightBy,
        isHighlighted: isHighlighted,
        getHighlighted: getHighlighted,
        getFirst: getFirst,
        getLast: getLast,
        getPrevious: getPrevious,
        getNext: getNext,
        getCandidates: getCandidates
    });

    var HighlightSchema = [
      required$1('highlightClass'),
      required$1('itemClass'),
      onHandler('onHighlight'),
      onHandler('onDehighlight')
    ];

    const Highlighting = create$3({
      fields: HighlightSchema,
      name: 'highlighting',
      apis: HighlightApis
    });

    const BACKSPACE = [8];
    const TAB = [9];
    const ENTER = [13];
    const ESCAPE = [27];
    const SPACE = [32];
    const LEFT = [37];
    const UP = [38];
    const RIGHT = [39];
    const DOWN = [40];

    const cyclePrev = (values, index, predicate) => {
      const before = reverse(values.slice(0, index));
      const after = reverse(values.slice(index + 1));
      return find$5(before.concat(after), predicate);
    };
    const tryPrev = (values, index, predicate) => {
      const before = reverse(values.slice(0, index));
      return find$5(before, predicate);
    };
    const cycleNext = (values, index, predicate) => {
      const before = values.slice(0, index);
      const after = values.slice(index + 1);
      return find$5(after.concat(before), predicate);
    };
    const tryNext = (values, index, predicate) => {
      const after = values.slice(index + 1);
      return find$5(after, predicate);
    };

    const inSet = keys => event => {
      const raw = event.raw;
      return contains$2(keys, raw.which);
    };
    const and = preds => event => forall(preds, pred => pred(event));
    const isShift = event => {
      const raw = event.raw;
      return raw.shiftKey === true;
    };
    const isControl = event => {
      const raw = event.raw;
      return raw.ctrlKey === true;
    };
    const isNotShift = not(isShift);

    const rule = (matches, action) => ({
      matches,
      classification: action
    });
    const choose = (transitions, event) => {
      const transition = find$5(transitions, t => t.matches(event));
      return transition.map(t => t.classification);
    };

    const reportFocusShifting = (component, prevFocus, newFocus) => {
      const noChange = prevFocus.exists(p => newFocus.exists(n => eq(n, p)));
      if (!noChange) {
        emitWith(component, focusShifted(), {
          prevFocus,
          newFocus
        });
      }
    };
    const dom$2 = () => {
      const get = component => search(component.element);
      const set = (component, focusee) => {
        const prevFocus = get(component);
        component.getSystem().triggerFocus(focusee, component.element);
        const newFocus = get(component);
        reportFocusShifting(component, prevFocus, newFocus);
      };
      return {
        get,
        set
      };
    };
    const highlights = () => {
      const get = component => Highlighting.getHighlighted(component).map(item => item.element);
      const set = (component, element) => {
        const prevFocus = get(component);
        component.getSystem().getByDom(element).fold(noop, item => {
          Highlighting.highlight(component, item);
        });
        const newFocus = get(component);
        reportFocusShifting(component, prevFocus, newFocus);
      };
      return {
        get,
        set
      };
    };

    var FocusInsideModes;
    (function (FocusInsideModes) {
      FocusInsideModes['OnFocusMode'] = 'onFocus';
      FocusInsideModes['OnEnterOrSpaceMode'] = 'onEnterOrSpace';
      FocusInsideModes['OnApiMode'] = 'onApi';
    }(FocusInsideModes || (FocusInsideModes = {})));

    const typical = (infoSchema, stateInit, getKeydownRules, getKeyupRules, optFocusIn) => {
      const schema = () => infoSchema.concat([
        defaulted('focusManager', dom$2()),
        defaultedOf('focusInside', 'onFocus', valueOf(val => contains$2([
          'onFocus',
          'onEnterOrSpace',
          'onApi'
        ], val) ? Result.value(val) : Result.error('Invalid value for focusInside'))),
        output$1('handler', me),
        output$1('state', stateInit),
        output$1('sendFocusIn', optFocusIn)
      ]);
      const processKey = (component, simulatedEvent, getRules, keyingConfig, keyingState) => {
        const rules = getRules(component, simulatedEvent, keyingConfig, keyingState);
        return choose(rules, simulatedEvent.event).bind(rule => rule(component, simulatedEvent, keyingConfig, keyingState));
      };
      const toEvents = (keyingConfig, keyingState) => {
        const onFocusHandler = keyingConfig.focusInside !== FocusInsideModes.OnFocusMode ? Optional.none() : optFocusIn(keyingConfig).map(focusIn => run$1(focus$4(), (component, simulatedEvent) => {
          focusIn(component, keyingConfig, keyingState);
          simulatedEvent.stop();
        }));
        const tryGoInsideComponent = (component, simulatedEvent) => {
          const isEnterOrSpace = inSet(SPACE.concat(ENTER))(simulatedEvent.event);
          if (keyingConfig.focusInside === FocusInsideModes.OnEnterOrSpaceMode && isEnterOrSpace && isSource(component, simulatedEvent)) {
            optFocusIn(keyingConfig).each(focusIn => {
              focusIn(component, keyingConfig, keyingState);
              simulatedEvent.stop();
            });
          }
        };
        const keyboardEvents = [
          run$1(keydown(), (component, simulatedEvent) => {
            processKey(component, simulatedEvent, getKeydownRules, keyingConfig, keyingState).fold(() => {
              tryGoInsideComponent(component, simulatedEvent);
            }, _ => {
              simulatedEvent.stop();
            });
          }),
          run$1(keyup(), (component, simulatedEvent) => {
            processKey(component, simulatedEvent, getKeyupRules, keyingConfig, keyingState).each(_ => {
              simulatedEvent.stop();
            });
          })
        ];
        return derive$2(onFocusHandler.toArray().concat(keyboardEvents));
      };
      const me = {
        schema,
        processKey,
        toEvents
      };
      return me;
    };

    const create$1 = cyclicField => {
      const schema = [
        option$3('onEscape'),
        option$3('onEnter'),
        defaulted('selector', '[data-alloy-tabstop="true"]:not(:disabled)'),
        defaulted('firstTabstop', 0),
        defaulted('useTabstopAt', always),
        option$3('visibilitySelector')
      ].concat([cyclicField]);
      const isVisible = (tabbingConfig, element) => {
        const target = tabbingConfig.visibilitySelector.bind(sel => closest$1(element, sel)).getOr(element);
        return get$d(target) > 0;
      };
      const findInitial = (component, tabbingConfig) => {
        const tabstops = descendants(component.element, tabbingConfig.selector);
        const visibles = filter$2(tabstops, elem => isVisible(tabbingConfig, elem));
        return Optional.from(visibles[tabbingConfig.firstTabstop]);
      };
      const findCurrent = (component, tabbingConfig) => tabbingConfig.focusManager.get(component).bind(elem => closest$1(elem, tabbingConfig.selector));
      const isTabstop = (tabbingConfig, element) => isVisible(tabbingConfig, element) && tabbingConfig.useTabstopAt(element);
      const focusIn = (component, tabbingConfig, _tabbingState) => {
        findInitial(component, tabbingConfig).each(target => {
          tabbingConfig.focusManager.set(component, target);
        });
      };
      const goFromTabstop = (component, tabstops, stopIndex, tabbingConfig, cycle) => cycle(tabstops, stopIndex, elem => isTabstop(tabbingConfig, elem)).fold(() => tabbingConfig.cyclic ? Optional.some(true) : Optional.none(), target => {
        tabbingConfig.focusManager.set(component, target);
        return Optional.some(true);
      });
      const go = (component, _simulatedEvent, tabbingConfig, cycle) => {
        const tabstops = descendants(component.element, tabbingConfig.selector);
        return findCurrent(component, tabbingConfig).bind(tabstop => {
          const optStopIndex = findIndex$1(tabstops, curry(eq, tabstop));
          return optStopIndex.bind(stopIndex => goFromTabstop(component, tabstops, stopIndex, tabbingConfig, cycle));
        });
      };
      const goBackwards = (component, simulatedEvent, tabbingConfig) => {
        const navigate = tabbingConfig.cyclic ? cyclePrev : tryPrev;
        return go(component, simulatedEvent, tabbingConfig, navigate);
      };
      const goForwards = (component, simulatedEvent, tabbingConfig) => {
        const navigate = tabbingConfig.cyclic ? cycleNext : tryNext;
        return go(component, simulatedEvent, tabbingConfig, navigate);
      };
      const execute = (component, simulatedEvent, tabbingConfig) => tabbingConfig.onEnter.bind(f => f(component, simulatedEvent));
      const exit = (component, simulatedEvent, tabbingConfig) => tabbingConfig.onEscape.bind(f => f(component, simulatedEvent));
      const getKeydownRules = constant$1([
        rule(and([
          isShift,
          inSet(TAB)
        ]), goBackwards),
        rule(inSet(TAB), goForwards),
        rule(and([
          isNotShift,
          inSet(ENTER)
        ]), execute)
      ]);
      const getKeyupRules = constant$1([rule(inSet(ESCAPE), exit)]);
      return typical(schema, NoState.init, getKeydownRules, getKeyupRules, () => Optional.some(focusIn));
    };

    var AcyclicType = create$1(customField('cyclic', never));

    var CyclicType = create$1(customField('cyclic', always));

    const doDefaultExecute = (component, _simulatedEvent, focused) => {
      dispatch(component, focused, execute$5());
      return Optional.some(true);
    };
    const defaultExecute = (component, simulatedEvent, focused) => {
      const isComplex = inside(focused) && inSet(SPACE)(simulatedEvent.event);
      return isComplex ? Optional.none() : doDefaultExecute(component, simulatedEvent, focused);
    };
    const stopEventForFirefox = (_component, _simulatedEvent) => Optional.some(true);

    const schema$v = [
      defaulted('execute', defaultExecute),
      defaulted('useSpace', false),
      defaulted('useEnter', true),
      defaulted('useControlEnter', false),
      defaulted('useDown', false)
    ];
    const execute$4 = (component, simulatedEvent, executeConfig) => executeConfig.execute(component, simulatedEvent, component.element);
    const getKeydownRules$5 = (component, _simulatedEvent, executeConfig, _executeState) => {
      const spaceExec = executeConfig.useSpace && !inside(component.element) ? SPACE : [];
      const enterExec = executeConfig.useEnter ? ENTER : [];
      const downExec = executeConfig.useDown ? DOWN : [];
      const execKeys = spaceExec.concat(enterExec).concat(downExec);
      return [rule(inSet(execKeys), execute$4)].concat(executeConfig.useControlEnter ? [rule(and([
          isControl,
          inSet(ENTER)
        ]), execute$4)] : []);
    };
    const getKeyupRules$5 = (component, _simulatedEvent, executeConfig, _executeState) => executeConfig.useSpace && !inside(component.element) ? [rule(inSet(SPACE), stopEventForFirefox)] : [];
    var ExecutionType = typical(schema$v, NoState.init, getKeydownRules$5, getKeyupRules$5, () => Optional.none());

    const flatgrid$1 = () => {
      const dimensions = value$2();
      const setGridSize = (numRows, numColumns) => {
        dimensions.set({
          numRows,
          numColumns
        });
      };
      const getNumRows = () => dimensions.get().map(d => d.numRows);
      const getNumColumns = () => dimensions.get().map(d => d.numColumns);
      return nu$8({
        readState: () => dimensions.get().map(d => ({
          numRows: String(d.numRows),
          numColumns: String(d.numColumns)
        })).getOr({
          numRows: '?',
          numColumns: '?'
        }),
        setGridSize,
        getNumRows,
        getNumColumns
      });
    };
    const init$d = spec => spec.state(spec);

    var KeyingState = /*#__PURE__*/Object.freeze({
        __proto__: null,
        flatgrid: flatgrid$1,
        init: init$d
    });

    const useH = movement => (component, simulatedEvent, config, state) => {
      const move = movement(component.element);
      return use(move, component, simulatedEvent, config, state);
    };
    const west$1 = (moveLeft, moveRight) => {
      const movement = onDirection(moveLeft, moveRight);
      return useH(movement);
    };
    const east$1 = (moveLeft, moveRight) => {
      const movement = onDirection(moveRight, moveLeft);
      return useH(movement);
    };
    const useV = move => (component, simulatedEvent, config, state) => use(move, component, simulatedEvent, config, state);
    const use = (move, component, simulatedEvent, config, state) => {
      const outcome = config.focusManager.get(component).bind(focused => move(component.element, focused, config, state));
      return outcome.map(newFocus => {
        config.focusManager.set(component, newFocus);
        return true;
      });
    };
    const north$1 = useV;
    const south$1 = useV;
    const move$1 = useV;

    const isHidden$1 = dom => dom.offsetWidth <= 0 && dom.offsetHeight <= 0;
    const isVisible = element => !isHidden$1(element.dom);

    const locate = (candidates, predicate) => findIndex$1(candidates, predicate).map(index => ({
      index,
      candidates
    }));

    const locateVisible = (container, current, selector) => {
      const predicate = x => eq(x, current);
      const candidates = descendants(container, selector);
      const visible = filter$2(candidates, isVisible);
      return locate(visible, predicate);
    };
    const findIndex = (elements, target) => findIndex$1(elements, elem => eq(target, elem));

    const withGrid = (values, index, numCols, f) => {
      const oldRow = Math.floor(index / numCols);
      const oldColumn = index % numCols;
      return f(oldRow, oldColumn).bind(address => {
        const newIndex = address.row * numCols + address.column;
        return newIndex >= 0 && newIndex < values.length ? Optional.some(values[newIndex]) : Optional.none();
      });
    };
    const cycleHorizontal$1 = (values, index, numRows, numCols, delta) => withGrid(values, index, numCols, (oldRow, oldColumn) => {
      const onLastRow = oldRow === numRows - 1;
      const colsInRow = onLastRow ? values.length - oldRow * numCols : numCols;
      const newColumn = cycleBy(oldColumn, delta, 0, colsInRow - 1);
      return Optional.some({
        row: oldRow,
        column: newColumn
      });
    });
    const cycleVertical$1 = (values, index, numRows, numCols, delta) => withGrid(values, index, numCols, (oldRow, oldColumn) => {
      const newRow = cycleBy(oldRow, delta, 0, numRows - 1);
      const onLastRow = newRow === numRows - 1;
      const colsInRow = onLastRow ? values.length - newRow * numCols : numCols;
      const newCol = clamp(oldColumn, 0, colsInRow - 1);
      return Optional.some({
        row: newRow,
        column: newCol
      });
    });
    const cycleRight$1 = (values, index, numRows, numCols) => cycleHorizontal$1(values, index, numRows, numCols, +1);
    const cycleLeft$1 = (values, index, numRows, numCols) => cycleHorizontal$1(values, index, numRows, numCols, -1);
    const cycleUp$1 = (values, index, numRows, numCols) => cycleVertical$1(values, index, numRows, numCols, -1);
    const cycleDown$1 = (values, index, numRows, numCols) => cycleVertical$1(values, index, numRows, numCols, +1);

    const schema$u = [
      required$1('selector'),
      defaulted('execute', defaultExecute),
      onKeyboardHandler('onEscape'),
      defaulted('captureTab', false),
      initSize()
    ];
    const focusIn$3 = (component, gridConfig, _gridState) => {
      descendant(component.element, gridConfig.selector).each(first => {
        gridConfig.focusManager.set(component, first);
      });
    };
    const findCurrent$1 = (component, gridConfig) => gridConfig.focusManager.get(component).bind(elem => closest$1(elem, gridConfig.selector));
    const execute$3 = (component, simulatedEvent, gridConfig, _gridState) => findCurrent$1(component, gridConfig).bind(focused => gridConfig.execute(component, simulatedEvent, focused));
    const doMove$2 = cycle => (element, focused, gridConfig, gridState) => locateVisible(element, focused, gridConfig.selector).bind(identified => cycle(identified.candidates, identified.index, gridState.getNumRows().getOr(gridConfig.initSize.numRows), gridState.getNumColumns().getOr(gridConfig.initSize.numColumns)));
    const handleTab = (_component, _simulatedEvent, gridConfig) => gridConfig.captureTab ? Optional.some(true) : Optional.none();
    const doEscape$1 = (component, simulatedEvent, gridConfig) => gridConfig.onEscape(component, simulatedEvent);
    const moveLeft$3 = doMove$2(cycleLeft$1);
    const moveRight$3 = doMove$2(cycleRight$1);
    const moveNorth$1 = doMove$2(cycleUp$1);
    const moveSouth$1 = doMove$2(cycleDown$1);
    const getKeydownRules$4 = constant$1([
      rule(inSet(LEFT), west$1(moveLeft$3, moveRight$3)),
      rule(inSet(RIGHT), east$1(moveLeft$3, moveRight$3)),
      rule(inSet(UP), north$1(moveNorth$1)),
      rule(inSet(DOWN), south$1(moveSouth$1)),
      rule(and([
        isShift,
        inSet(TAB)
      ]), handleTab),
      rule(and([
        isNotShift,
        inSet(TAB)
      ]), handleTab),
      rule(inSet(SPACE.concat(ENTER)), execute$3)
    ]);
    const getKeyupRules$4 = constant$1([
      rule(inSet(ESCAPE), doEscape$1),
      rule(inSet(SPACE), stopEventForFirefox)
    ]);
    var FlatgridType = typical(schema$u, flatgrid$1, getKeydownRules$4, getKeyupRules$4, () => Optional.some(focusIn$3));

    const horizontal = (container, selector, current, delta) => {
      const isDisabledButton = candidate => name$3(candidate) === 'button' && get$f(candidate, 'disabled') === 'disabled';
      const tryCycle = (initial, index, candidates) => {
        const newIndex = cycleBy(index, delta, 0, candidates.length - 1);
        if (newIndex === initial) {
          return Optional.none();
        } else {
          return isDisabledButton(candidates[newIndex]) ? tryCycle(initial, newIndex, candidates) : Optional.from(candidates[newIndex]);
        }
      };
      return locateVisible(container, current, selector).bind(identified => {
        const index = identified.index;
        const candidates = identified.candidates;
        return tryCycle(index, index, candidates);
      });
    };

    const schema$t = [
      required$1('selector'),
      defaulted('getInitial', Optional.none),
      defaulted('execute', defaultExecute),
      onKeyboardHandler('onEscape'),
      defaulted('executeOnMove', false),
      defaulted('allowVertical', true)
    ];
    const findCurrent = (component, flowConfig) => flowConfig.focusManager.get(component).bind(elem => closest$1(elem, flowConfig.selector));
    const execute$2 = (component, simulatedEvent, flowConfig) => findCurrent(component, flowConfig).bind(focused => flowConfig.execute(component, simulatedEvent, focused));
    const focusIn$2 = (component, flowConfig, _state) => {
      flowConfig.getInitial(component).orThunk(() => descendant(component.element, flowConfig.selector)).each(first => {
        flowConfig.focusManager.set(component, first);
      });
    };
    const moveLeft$2 = (element, focused, info) => horizontal(element, info.selector, focused, -1);
    const moveRight$2 = (element, focused, info) => horizontal(element, info.selector, focused, +1);
    const doMove$1 = movement => (component, simulatedEvent, flowConfig, flowState) => movement(component, simulatedEvent, flowConfig, flowState).bind(() => flowConfig.executeOnMove ? execute$2(component, simulatedEvent, flowConfig) : Optional.some(true));
    const doEscape = (component, simulatedEvent, flowConfig) => flowConfig.onEscape(component, simulatedEvent);
    const getKeydownRules$3 = (_component, _se, flowConfig, _flowState) => {
      const westMovers = LEFT.concat(flowConfig.allowVertical ? UP : []);
      const eastMovers = RIGHT.concat(flowConfig.allowVertical ? DOWN : []);
      return [
        rule(inSet(westMovers), doMove$1(west$1(moveLeft$2, moveRight$2))),
        rule(inSet(eastMovers), doMove$1(east$1(moveLeft$2, moveRight$2))),
        rule(inSet(ENTER), execute$2),
        rule(inSet(SPACE), execute$2)
      ];
    };
    const getKeyupRules$3 = constant$1([
      rule(inSet(SPACE), stopEventForFirefox),
      rule(inSet(ESCAPE), doEscape)
    ]);
    var FlowType = typical(schema$t, NoState.init, getKeydownRules$3, getKeyupRules$3, () => Optional.some(focusIn$2));

    const toCell = (matrix, rowIndex, columnIndex) => Optional.from(matrix[rowIndex]).bind(row => Optional.from(row[columnIndex]).map(cell => ({
      rowIndex,
      columnIndex,
      cell
    })));
    const cycleHorizontal = (matrix, rowIndex, startCol, deltaCol) => {
      const row = matrix[rowIndex];
      const colsInRow = row.length;
      const newColIndex = cycleBy(startCol, deltaCol, 0, colsInRow - 1);
      return toCell(matrix, rowIndex, newColIndex);
    };
    const cycleVertical = (matrix, colIndex, startRow, deltaRow) => {
      const nextRowIndex = cycleBy(startRow, deltaRow, 0, matrix.length - 1);
      const colsInNextRow = matrix[nextRowIndex].length;
      const nextColIndex = clamp(colIndex, 0, colsInNextRow - 1);
      return toCell(matrix, nextRowIndex, nextColIndex);
    };
    const moveHorizontal = (matrix, rowIndex, startCol, deltaCol) => {
      const row = matrix[rowIndex];
      const colsInRow = row.length;
      const newColIndex = clamp(startCol + deltaCol, 0, colsInRow - 1);
      return toCell(matrix, rowIndex, newColIndex);
    };
    const moveVertical = (matrix, colIndex, startRow, deltaRow) => {
      const nextRowIndex = clamp(startRow + deltaRow, 0, matrix.length - 1);
      const colsInNextRow = matrix[nextRowIndex].length;
      const nextColIndex = clamp(colIndex, 0, colsInNextRow - 1);
      return toCell(matrix, nextRowIndex, nextColIndex);
    };
    const cycleRight = (matrix, startRow, startCol) => cycleHorizontal(matrix, startRow, startCol, +1);
    const cycleLeft = (matrix, startRow, startCol) => cycleHorizontal(matrix, startRow, startCol, -1);
    const cycleUp = (matrix, startRow, startCol) => cycleVertical(matrix, startCol, startRow, -1);
    const cycleDown = (matrix, startRow, startCol) => cycleVertical(matrix, startCol, startRow, +1);
    const moveLeft$1 = (matrix, startRow, startCol) => moveHorizontal(matrix, startRow, startCol, -1);
    const moveRight$1 = (matrix, startRow, startCol) => moveHorizontal(matrix, startRow, startCol, +1);
    const moveUp$1 = (matrix, startRow, startCol) => moveVertical(matrix, startCol, startRow, -1);
    const moveDown$1 = (matrix, startRow, startCol) => moveVertical(matrix, startCol, startRow, +1);

    const schema$s = [
      requiredObjOf('selectors', [
        required$1('row'),
        required$1('cell')
      ]),
      defaulted('cycles', true),
      defaulted('previousSelector', Optional.none),
      defaulted('execute', defaultExecute)
    ];
    const focusIn$1 = (component, matrixConfig, _state) => {
      const focused = matrixConfig.previousSelector(component).orThunk(() => {
        const selectors = matrixConfig.selectors;
        return descendant(component.element, selectors.cell);
      });
      focused.each(cell => {
        matrixConfig.focusManager.set(component, cell);
      });
    };
    const execute$1 = (component, simulatedEvent, matrixConfig) => search(component.element).bind(focused => matrixConfig.execute(component, simulatedEvent, focused));
    const toMatrix = (rows, matrixConfig) => map$2(rows, row => descendants(row, matrixConfig.selectors.cell));
    const doMove = (ifCycle, ifMove) => (element, focused, matrixConfig) => {
      const move = matrixConfig.cycles ? ifCycle : ifMove;
      return closest$1(focused, matrixConfig.selectors.row).bind(inRow => {
        const cellsInRow = descendants(inRow, matrixConfig.selectors.cell);
        return findIndex(cellsInRow, focused).bind(colIndex => {
          const allRows = descendants(element, matrixConfig.selectors.row);
          return findIndex(allRows, inRow).bind(rowIndex => {
            const matrix = toMatrix(allRows, matrixConfig);
            return move(matrix, rowIndex, colIndex).map(next => next.cell);
          });
        });
      });
    };
    const moveLeft = doMove(cycleLeft, moveLeft$1);
    const moveRight = doMove(cycleRight, moveRight$1);
    const moveNorth = doMove(cycleUp, moveUp$1);
    const moveSouth = doMove(cycleDown, moveDown$1);
    const getKeydownRules$2 = constant$1([
      rule(inSet(LEFT), west$1(moveLeft, moveRight)),
      rule(inSet(RIGHT), east$1(moveLeft, moveRight)),
      rule(inSet(UP), north$1(moveNorth)),
      rule(inSet(DOWN), south$1(moveSouth)),
      rule(inSet(SPACE.concat(ENTER)), execute$1)
    ]);
    const getKeyupRules$2 = constant$1([rule(inSet(SPACE), stopEventForFirefox)]);
    var MatrixType = typical(schema$s, NoState.init, getKeydownRules$2, getKeyupRules$2, () => Optional.some(focusIn$1));

    const schema$r = [
      required$1('selector'),
      defaulted('execute', defaultExecute),
      defaulted('moveOnTab', false)
    ];
    const execute = (component, simulatedEvent, menuConfig) => menuConfig.focusManager.get(component).bind(focused => menuConfig.execute(component, simulatedEvent, focused));
    const focusIn = (component, menuConfig, _state) => {
      descendant(component.element, menuConfig.selector).each(first => {
        menuConfig.focusManager.set(component, first);
      });
    };
    const moveUp = (element, focused, info) => horizontal(element, info.selector, focused, -1);
    const moveDown = (element, focused, info) => horizontal(element, info.selector, focused, +1);
    const fireShiftTab = (component, simulatedEvent, menuConfig, menuState) => menuConfig.moveOnTab ? move$1(moveUp)(component, simulatedEvent, menuConfig, menuState) : Optional.none();
    const fireTab = (component, simulatedEvent, menuConfig, menuState) => menuConfig.moveOnTab ? move$1(moveDown)(component, simulatedEvent, menuConfig, menuState) : Optional.none();
    const getKeydownRules$1 = constant$1([
      rule(inSet(UP), move$1(moveUp)),
      rule(inSet(DOWN), move$1(moveDown)),
      rule(and([
        isShift,
        inSet(TAB)
      ]), fireShiftTab),
      rule(and([
        isNotShift,
        inSet(TAB)
      ]), fireTab),
      rule(inSet(ENTER), execute),
      rule(inSet(SPACE), execute)
    ]);
    const getKeyupRules$1 = constant$1([rule(inSet(SPACE), stopEventForFirefox)]);
    var MenuType = typical(schema$r, NoState.init, getKeydownRules$1, getKeyupRules$1, () => Optional.some(focusIn));

    const schema$q = [
      onKeyboardHandler('onSpace'),
      onKeyboardHandler('onEnter'),
      onKeyboardHandler('onShiftEnter'),
      onKeyboardHandler('onLeft'),
      onKeyboardHandler('onRight'),
      onKeyboardHandler('onTab'),
      onKeyboardHandler('onShiftTab'),
      onKeyboardHandler('onUp'),
      onKeyboardHandler('onDown'),
      onKeyboardHandler('onEscape'),
      defaulted('stopSpaceKeyup', false),
      option$3('focusIn')
    ];
    const getKeydownRules = (component, simulatedEvent, specialInfo) => [
      rule(inSet(SPACE), specialInfo.onSpace),
      rule(and([
        isNotShift,
        inSet(ENTER)
      ]), specialInfo.onEnter),
      rule(and([
        isShift,
        inSet(ENTER)
      ]), specialInfo.onShiftEnter),
      rule(and([
        isShift,
        inSet(TAB)
      ]), specialInfo.onShiftTab),
      rule(and([
        isNotShift,
        inSet(TAB)
      ]), specialInfo.onTab),
      rule(inSet(UP), specialInfo.onUp),
      rule(inSet(DOWN), specialInfo.onDown),
      rule(inSet(LEFT), specialInfo.onLeft),
      rule(inSet(RIGHT), specialInfo.onRight),
      rule(inSet(SPACE), specialInfo.onSpace)
    ];
    const getKeyupRules = (component, simulatedEvent, specialInfo) => [
      ...specialInfo.stopSpaceKeyup ? [rule(inSet(SPACE), stopEventForFirefox)] : [],
      rule(inSet(ESCAPE), specialInfo.onEscape)
    ];
    var SpecialType = typical(schema$q, NoState.init, getKeydownRules, getKeyupRules, specialInfo => specialInfo.focusIn);

    const acyclic = AcyclicType.schema();
    const cyclic = CyclicType.schema();
    const flow = FlowType.schema();
    const flatgrid = FlatgridType.schema();
    const matrix = MatrixType.schema();
    const execution = ExecutionType.schema();
    const menu = MenuType.schema();
    const special = SpecialType.schema();

    var KeyboardBranches = /*#__PURE__*/Object.freeze({
        __proto__: null,
        acyclic: acyclic,
        cyclic: cyclic,
        flow: flow,
        flatgrid: flatgrid,
        matrix: matrix,
        execution: execution,
        menu: menu,
        special: special
    });

    const isFlatgridState = keyState => hasNonNullableKey(keyState, 'setGridSize');
    const Keying = createModes({
      branchKey: 'mode',
      branches: KeyboardBranches,
      name: 'keying',
      active: {
        events: (keyingConfig, keyingState) => {
          const handler = keyingConfig.handler;
          return handler.toEvents(keyingConfig, keyingState);
        }
      },
      apis: {
        focusIn: (component, keyConfig, keyState) => {
          keyConfig.sendFocusIn(keyConfig).fold(() => {
            component.getSystem().triggerFocus(component.element, component.element);
          }, sendFocusIn => {
            sendFocusIn(component, keyConfig, keyState);
          });
        },
        setGridSize: (component, keyConfig, keyState, numRows, numColumns) => {
          if (!isFlatgridState(keyState)) {
            console.error('Layout does not support setGridSize');
          } else {
            keyState.setGridSize(numRows, numColumns);
          }
        }
      },
      state: KeyingState
    });

    const withoutReuse = (parent, data) => {
      preserve$1(() => {
        replaceChildren(parent, data, () => map$2(data, parent.getSystem().build));
      }, parent.element);
    };
    const withReuse = (parent, data) => {
      preserve$1(() => {
        virtualReplaceChildren(parent, data, () => {
          return patchSpecChildren(parent.element, data, parent.getSystem().buildOrPatch);
        });
      }, parent.element);
    };

    const virtualReplace = (component, replacee, replaceeIndex, childSpec) => {
      virtualDetach(replacee);
      const child = patchSpecChild(component.element, replaceeIndex, childSpec, component.getSystem().buildOrPatch);
      virtualAttach(component, child);
      component.syncComponents();
    };
    const insert = (component, insertion, childSpec) => {
      const child = component.getSystem().build(childSpec);
      attachWith(component, child, insertion);
    };
    const replace = (component, replacee, replaceeIndex, childSpec) => {
      detach(replacee);
      insert(component, (p, c) => appendAt(p, c, replaceeIndex), childSpec);
    };
    const set$3 = (component, replaceConfig, replaceState, data) => {
      const replacer = replaceConfig.reuseDom ? withReuse : withoutReuse;
      return replacer(component, data);
    };
    const append = (component, replaceConfig, replaceState, appendee) => {
      insert(component, append$2, appendee);
    };
    const prepend = (component, replaceConfig, replaceState, prependee) => {
      insert(component, prepend$1, prependee);
    };
    const remove = (component, replaceConfig, replaceState, removee) => {
      const children = contents(component);
      const foundChild = find$5(children, child => eq(removee.element, child.element));
      foundChild.each(detach);
    };
    const contents = (component, _replaceConfig) => component.components();
    const replaceAt = (component, replaceConfig, replaceState, replaceeIndex, replacer) => {
      const children = contents(component);
      return Optional.from(children[replaceeIndex]).map(replacee => {
        replacer.fold(() => detach(replacee), r => {
          const replacer = replaceConfig.reuseDom ? virtualReplace : replace;
          replacer(component, replacee, replaceeIndex, r);
        });
        return replacee;
      });
    };
    const replaceBy = (component, replaceConfig, replaceState, replaceePred, replacer) => {
      const children = contents(component);
      return findIndex$1(children, replaceePred).bind(replaceeIndex => replaceAt(component, replaceConfig, replaceState, replaceeIndex, replacer));
    };

    var ReplaceApis = /*#__PURE__*/Object.freeze({
        __proto__: null,
        append: append,
        prepend: prepend,
        remove: remove,
        replaceAt: replaceAt,
        replaceBy: replaceBy,
        set: set$3,
        contents: contents
    });

    const Replacing = create$3({
      fields: [defaultedBoolean('reuseDom', true)],
      name: 'replacing',
      apis: ReplaceApis
    });

    const events$d = (name, eventHandlers) => {
      const events = derive$2(eventHandlers);
      return create$3({
        fields: [required$1('enabled')],
        name,
        active: { events: constant$1(events) }
      });
    };
    const config = (name, eventHandlers) => {
      const me = events$d(name, eventHandlers);
      return {
        key: name,
        value: {
          config: {},
          me,
          configAsRaw: constant$1({}),
          initialConfig: {},
          state: NoState
        }
      };
    };

    const focus$2 = (component, focusConfig) => {
      if (!focusConfig.ignore) {
        focus$3(component.element);
        focusConfig.onFocus(component);
      }
    };
    const blur = (component, focusConfig) => {
      if (!focusConfig.ignore) {
        blur$1(component.element);
      }
    };
    const isFocused = component => hasFocus(component.element);

    var FocusApis = /*#__PURE__*/Object.freeze({
        __proto__: null,
        focus: focus$2,
        blur: blur,
        isFocused: isFocused
    });

    const exhibit$4 = (base, focusConfig) => {
      const mod = focusConfig.ignore ? {} : { attributes: { tabindex: '-1' } };
      return nu$7(mod);
    };
    const events$c = focusConfig => derive$2([run$1(focus$4(), (component, simulatedEvent) => {
        focus$2(component, focusConfig);
        simulatedEvent.stop();
      })].concat(focusConfig.stopMousedown ? [run$1(mousedown(), (_, simulatedEvent) => {
        simulatedEvent.event.prevent();
      })] : []));

    var ActiveFocus = /*#__PURE__*/Object.freeze({
        __proto__: null,
        exhibit: exhibit$4,
        events: events$c
    });

    var FocusSchema = [
      onHandler('onFocus'),
      defaulted('stopMousedown', false),
      defaulted('ignore', false)
    ];

    const Focusing = create$3({
      fields: FocusSchema,
      name: 'focusing',
      active: ActiveFocus,
      apis: FocusApis
    });

    const SetupBehaviourCellState = initialState => {
      const init = () => {
        const cell = Cell(initialState);
        const get = () => cell.get();
        const set = newState => cell.set(newState);
        const clear = () => cell.set(initialState);
        const readState = () => cell.get();
        return {
          get,
          set,
          clear,
          readState
        };
      };
      return { init };
    };

    const updateAriaState = (component, toggleConfig, toggleState) => {
      const ariaInfo = toggleConfig.aria;
      ariaInfo.update(component, ariaInfo, toggleState.get());
    };
    const updateClass = (component, toggleConfig, toggleState) => {
      toggleConfig.toggleClass.each(toggleClass => {
        if (toggleState.get()) {
          add$2(component.element, toggleClass);
        } else {
          remove$2(component.element, toggleClass);
        }
      });
    };
    const set$2 = (component, toggleConfig, toggleState, state) => {
      const initialState = toggleState.get();
      toggleState.set(state);
      updateClass(component, toggleConfig, toggleState);
      updateAriaState(component, toggleConfig, toggleState);
      if (initialState !== state) {
        toggleConfig.onToggled(component, state);
      }
    };
    const toggle$2 = (component, toggleConfig, toggleState) => {
      set$2(component, toggleConfig, toggleState, !toggleState.get());
    };
    const on = (component, toggleConfig, toggleState) => {
      set$2(component, toggleConfig, toggleState, true);
    };
    const off = (component, toggleConfig, toggleState) => {
      set$2(component, toggleConfig, toggleState, false);
    };
    const isOn = (component, toggleConfig, toggleState) => toggleState.get();
    const onLoad = (component, toggleConfig, toggleState) => {
      set$2(component, toggleConfig, toggleState, toggleConfig.selected);
    };

    var ToggleApis = /*#__PURE__*/Object.freeze({
        __proto__: null,
        onLoad: onLoad,
        toggle: toggle$2,
        isOn: isOn,
        on: on,
        off: off,
        set: set$2
    });

    const exhibit$3 = () => nu$7({});
    const events$b = (toggleConfig, toggleState) => {
      const execute = executeEvent(toggleConfig, toggleState, toggle$2);
      const load = loadEvent(toggleConfig, toggleState, onLoad);
      return derive$2(flatten([
        toggleConfig.toggleOnExecute ? [execute] : [],
        [load]
      ]));
    };

    var ActiveToggle = /*#__PURE__*/Object.freeze({
        __proto__: null,
        exhibit: exhibit$3,
        events: events$b
    });

    const updatePressed = (component, ariaInfo, status) => {
      set$9(component.element, 'aria-pressed', status);
      if (ariaInfo.syncWithExpanded) {
        updateExpanded(component, ariaInfo, status);
      }
    };
    const updateSelected = (component, ariaInfo, status) => {
      set$9(component.element, 'aria-selected', status);
    };
    const updateChecked = (component, ariaInfo, status) => {
      set$9(component.element, 'aria-checked', status);
    };
    const updateExpanded = (component, ariaInfo, status) => {
      set$9(component.element, 'aria-expanded', status);
    };

    var ToggleSchema = [
      defaulted('selected', false),
      option$3('toggleClass'),
      defaulted('toggleOnExecute', true),
      onHandler('onToggled'),
      defaultedOf('aria', { mode: 'none' }, choose$1('mode', {
        pressed: [
          defaulted('syncWithExpanded', false),
          output$1('update', updatePressed)
        ],
        checked: [output$1('update', updateChecked)],
        expanded: [output$1('update', updateExpanded)],
        selected: [output$1('update', updateSelected)],
        none: [output$1('update', noop)]
      }))
    ];

    const Toggling = create$3({
      fields: ToggleSchema,
      name: 'toggling',
      active: ActiveToggle,
      apis: ToggleApis,
      state: SetupBehaviourCellState(false)
    });

    const pointerEvents = () => {
      const onClick = (component, simulatedEvent) => {
        simulatedEvent.stop();
        emitExecute(component);
      };
      return [
        run$1(click(), onClick),
        run$1(tap(), onClick),
        cutter(touchstart()),
        cutter(mousedown())
      ];
    };
    const events$a = optAction => {
      const executeHandler = action => runOnExecute$1((component, simulatedEvent) => {
        action(component);
        simulatedEvent.stop();
      });
      return derive$2(flatten([
        optAction.map(executeHandler).toArray(),
        pointerEvents()
      ]));
    };

    const hoverEvent = 'alloy.item-hover';
    const focusEvent = 'alloy.item-focus';
    const toggledEvent = 'alloy.item-toggled';
    const onHover = item => {
      if (search(item.element).isNone() || Focusing.isFocused(item)) {
        if (!Focusing.isFocused(item)) {
          Focusing.focus(item);
        }
        emitWith(item, hoverEvent, { item });
      }
    };
    const onFocus$1 = item => {
      emitWith(item, focusEvent, { item });
    };
    const onToggled = (item, state) => {
      emitWith(item, toggledEvent, {
        item,
        state
      });
    };
    const hover = constant$1(hoverEvent);
    const focus$1 = constant$1(focusEvent);
    const toggled = constant$1(toggledEvent);

    const getItemRole = detail => detail.toggling.map(toggling => toggling.exclusive ? 'menuitemradio' : 'menuitemcheckbox').getOr('menuitem');
    const getTogglingSpec = tConfig => ({
      aria: { mode: 'checked' },
      ...filter$1(tConfig, (_value, name) => name !== 'exclusive'),
      onToggled: (component, state) => {
        if (isFunction(tConfig.onToggled)) {
          tConfig.onToggled(component, state);
        }
        onToggled(component, state);
      }
    });
    const builder$2 = detail => ({
      dom: detail.dom,
      domModification: {
        ...detail.domModification,
        attributes: {
          'role': getItemRole(detail),
          ...detail.domModification.attributes,
          'aria-haspopup': detail.hasSubmenu,
          ...detail.hasSubmenu ? { 'aria-expanded': false } : {}
        }
      },
      behaviours: SketchBehaviours.augment(detail.itemBehaviours, [
        detail.toggling.fold(Toggling.revoke, tConfig => Toggling.config(getTogglingSpec(tConfig))),
        Focusing.config({
          ignore: detail.ignoreFocus,
          stopMousedown: detail.ignoreFocus,
          onFocus: component => {
            onFocus$1(component);
          }
        }),
        Keying.config({ mode: 'execution' }),
        Representing.config({
          store: {
            mode: 'memory',
            initialValue: detail.data
          }
        }),
        config('item-type-events', [
          ...pointerEvents(),
          run$1(mouseover(), onHover),
          run$1(focusItem(), Focusing.focus)
        ])
      ]),
      components: detail.components,
      eventOrder: detail.eventOrder
    });
    const schema$p = [
      required$1('data'),
      required$1('components'),
      required$1('dom'),
      defaulted('hasSubmenu', false),
      option$3('toggling'),
      SketchBehaviours.field('itemBehaviours', [
        Toggling,
        Focusing,
        Keying,
        Representing
      ]),
      defaulted('ignoreFocus', false),
      defaulted('domModification', {}),
      output$1('builder', builder$2),
      defaulted('eventOrder', {})
    ];

    const builder$1 = detail => ({
      dom: detail.dom,
      components: detail.components,
      events: derive$2([stopper(focusItem())])
    });
    const schema$o = [
      required$1('dom'),
      required$1('components'),
      output$1('builder', builder$1)
    ];

    const owner$2 = constant$1('item-widget');
    const parts$h = constant$1([required({
        name: 'widget',
        overrides: detail => {
          return {
            behaviours: derive$1([Representing.config({
                store: {
                  mode: 'manual',
                  getValue: _component => {
                    return detail.data;
                  },
                  setValue: noop
                }
              })])
          };
        }
      })]);

    const builder = detail => {
      const subs = substitutes(owner$2(), detail, parts$h());
      const components = components$1(owner$2(), detail, subs.internals());
      const focusWidget = component => getPart(component, detail, 'widget').map(widget => {
        Keying.focusIn(widget);
        return widget;
      });
      const onHorizontalArrow = (component, simulatedEvent) => inside(simulatedEvent.event.target) ? Optional.none() : (() => {
        if (detail.autofocus) {
          simulatedEvent.setSource(component.element);
          return Optional.none();
        } else {
          return Optional.none();
        }
      })();
      return {
        dom: detail.dom,
        components,
        domModification: detail.domModification,
        events: derive$2([
          runOnExecute$1((component, simulatedEvent) => {
            focusWidget(component).each(_widget => {
              simulatedEvent.stop();
            });
          }),
          run$1(mouseover(), onHover),
          run$1(focusItem(), (component, _simulatedEvent) => {
            if (detail.autofocus) {
              focusWidget(component);
            } else {
              Focusing.focus(component);
            }
          })
        ]),
        behaviours: SketchBehaviours.augment(detail.widgetBehaviours, [
          Representing.config({
            store: {
              mode: 'memory',
              initialValue: detail.data
            }
          }),
          Focusing.config({
            ignore: detail.ignoreFocus,
            onFocus: component => {
              onFocus$1(component);
            }
          }),
          Keying.config({
            mode: 'special',
            focusIn: detail.autofocus ? component => {
              focusWidget(component);
            } : revoke(),
            onLeft: onHorizontalArrow,
            onRight: onHorizontalArrow,
            onEscape: (component, simulatedEvent) => {
              if (!Focusing.isFocused(component) && !detail.autofocus) {
                Focusing.focus(component);
                return Optional.some(true);
              } else if (detail.autofocus) {
                simulatedEvent.setSource(component.element);
                return Optional.none();
              } else {
                return Optional.none();
              }
            }
          })
        ])
      };
    };
    const schema$n = [
      required$1('uid'),
      required$1('data'),
      required$1('components'),
      required$1('dom'),
      defaulted('autofocus', false),
      defaulted('ignoreFocus', false),
      SketchBehaviours.field('widgetBehaviours', [
        Representing,
        Focusing,
        Keying
      ]),
      defaulted('domModification', {}),
      defaultUidsSchema(parts$h()),
      output$1('builder', builder)
    ];

    const itemSchema$2 = choose$1('type', {
      widget: schema$n,
      item: schema$p,
      separator: schema$o
    });
    const configureGrid = (detail, movementInfo) => ({
      mode: 'flatgrid',
      selector: '.' + detail.markers.item,
      initSize: {
        numColumns: movementInfo.initSize.numColumns,
        numRows: movementInfo.initSize.numRows
      },
      focusManager: detail.focusManager
    });
    const configureMatrix = (detail, movementInfo) => ({
      mode: 'matrix',
      selectors: {
        row: movementInfo.rowSelector,
        cell: '.' + detail.markers.item
      },
      focusManager: detail.focusManager
    });
    const configureMenu = (detail, movementInfo) => ({
      mode: 'menu',
      selector: '.' + detail.markers.item,
      moveOnTab: movementInfo.moveOnTab,
      focusManager: detail.focusManager
    });
    const parts$g = constant$1([group({
        factory: {
          sketch: spec => {
            const itemInfo = asRawOrDie$1('menu.spec item', itemSchema$2, spec);
            return itemInfo.builder(itemInfo);
          }
        },
        name: 'items',
        unit: 'item',
        defaults: (detail, u) => {
          return has$2(u, 'uid') ? u : {
            ...u,
            uid: generate$5('item')
          };
        },
        overrides: (detail, u) => {
          return {
            type: u.type,
            ignoreFocus: detail.fakeFocus,
            domModification: { classes: [detail.markers.item] }
          };
        }
      })]);
    const schema$m = constant$1([
      required$1('value'),
      required$1('items'),
      required$1('dom'),
      required$1('components'),
      defaulted('eventOrder', {}),
      field('menuBehaviours', [
        Highlighting,
        Representing,
        Composing,
        Keying
      ]),
      defaultedOf('movement', {
        mode: 'menu',
        moveOnTab: true
      }, choose$1('mode', {
        grid: [
          initSize(),
          output$1('config', configureGrid)
        ],
        matrix: [
          output$1('config', configureMatrix),
          required$1('rowSelector')
        ],
        menu: [
          defaulted('moveOnTab', true),
          output$1('config', configureMenu)
        ]
      })),
      itemMarkers(),
      defaulted('fakeFocus', false),
      defaulted('focusManager', dom$2()),
      onHandler('onHighlight'),
      onHandler('onDehighlight')
    ]);

    const focus = constant$1('alloy.menu-focus');

    const deselectOtherRadioItems = (menu, item) => {
      const checkedRadioItems = descendants(menu.element, '[role="menuitemradio"][aria-checked="true"]');
      each$1(checkedRadioItems, ele => {
        if (!eq(ele, item.element)) {
          menu.getSystem().getByDom(ele).each(c => {
            Toggling.off(c);
          });
        }
      });
    };
    const make$7 = (detail, components, _spec, _externals) => ({
      uid: detail.uid,
      dom: detail.dom,
      markers: detail.markers,
      behaviours: augment(detail.menuBehaviours, [
        Highlighting.config({
          highlightClass: detail.markers.selectedItem,
          itemClass: detail.markers.item,
          onHighlight: detail.onHighlight,
          onDehighlight: detail.onDehighlight
        }),
        Representing.config({
          store: {
            mode: 'memory',
            initialValue: detail.value
          }
        }),
        Composing.config({ find: Optional.some }),
        Keying.config(detail.movement.config(detail, detail.movement))
      ]),
      events: derive$2([
        run$1(focus$1(), (menu, simulatedEvent) => {
          const event = simulatedEvent.event;
          menu.getSystem().getByDom(event.target).each(item => {
            Highlighting.highlight(menu, item);
            simulatedEvent.stop();
            emitWith(menu, focus(), {
              menu,
              item
            });
          });
        }),
        run$1(hover(), (menu, simulatedEvent) => {
          const item = simulatedEvent.event.item;
          Highlighting.highlight(menu, item);
        }),
        run$1(toggled(), (menu, simulatedEvent) => {
          const {item, state} = simulatedEvent.event;
          if (state && get$f(item.element, 'role') === 'menuitemradio') {
            deselectOtherRadioItems(menu, item);
          }
        })
      ]),
      components,
      eventOrder: detail.eventOrder,
      domModification: { attributes: { role: 'menu' } }
    });

    const Menu = composite({
      name: 'Menu',
      configFields: schema$m(),
      partFields: parts$g(),
      factory: make$7
    });

    const transpose$1 = obj => tupleMap(obj, (v, k) => ({
      k: v,
      v: k
    }));
    const trace = (items, byItem, byMenu, finish) => get$g(byMenu, finish).bind(triggerItem => get$g(items, triggerItem).bind(triggerMenu => {
      const rest = trace(items, byItem, byMenu, triggerMenu);
      return Optional.some([triggerMenu].concat(rest));
    })).getOr([]);
    const generate$2 = (menus, expansions) => {
      const items = {};
      each(menus, (menuItems, menu) => {
        each$1(menuItems, item => {
          items[item] = menu;
        });
      });
      const byItem = expansions;
      const byMenu = transpose$1(expansions);
      const menuPaths = map$1(byMenu, (_triggerItem, submenu) => [submenu].concat(trace(items, byItem, byMenu, submenu)));
      return map$1(items, menu => get$g(menuPaths, menu).getOr([menu]));
    };

    const init$c = () => {
      const expansions = Cell({});
      const menus = Cell({});
      const paths = Cell({});
      const primary = value$2();
      const directory = Cell({});
      const clear = () => {
        expansions.set({});
        menus.set({});
        paths.set({});
        primary.clear();
      };
      const isClear = () => primary.get().isNone();
      const setMenuBuilt = (menuName, built) => {
        menus.set({
          ...menus.get(),
          [menuName]: {
            type: 'prepared',
            menu: built
          }
        });
      };
      const setContents = (sPrimary, sMenus, sExpansions, dir) => {
        primary.set(sPrimary);
        expansions.set(sExpansions);
        menus.set(sMenus);
        directory.set(dir);
        const sPaths = generate$2(dir, sExpansions);
        paths.set(sPaths);
      };
      const getTriggeringItem = menuValue => find$4(expansions.get(), (v, _k) => v === menuValue);
      const getTriggerData = (menuValue, getItemByValue, path) => getPreparedMenu(menuValue).bind(menu => getTriggeringItem(menuValue).bind(triggeringItemValue => getItemByValue(triggeringItemValue).map(triggeredItem => ({
        triggeredMenu: menu,
        triggeringItem: triggeredItem,
        triggeringPath: path
      }))));
      const getTriggeringPath = (itemValue, getItemByValue) => {
        const extraPath = filter$2(lookupItem(itemValue).toArray(), menuValue => getPreparedMenu(menuValue).isSome());
        return get$g(paths.get(), itemValue).bind(path => {
          const revPath = reverse(extraPath.concat(path));
          const triggers = bind$3(revPath, (menuValue, menuIndex) => getTriggerData(menuValue, getItemByValue, revPath.slice(0, menuIndex + 1)).fold(() => is$1(primary.get(), menuValue) ? [] : [Optional.none()], data => [Optional.some(data)]));
          return sequence(triggers);
        });
      };
      const expand = itemValue => get$g(expansions.get(), itemValue).map(menu => {
        const current = get$g(paths.get(), itemValue).getOr([]);
        return [menu].concat(current);
      });
      const collapse = itemValue => get$g(paths.get(), itemValue).bind(path => path.length > 1 ? Optional.some(path.slice(1)) : Optional.none());
      const refresh = itemValue => get$g(paths.get(), itemValue);
      const getPreparedMenu = menuValue => lookupMenu(menuValue).bind(extractPreparedMenu);
      const lookupMenu = menuValue => get$g(menus.get(), menuValue);
      const lookupItem = itemValue => get$g(expansions.get(), itemValue);
      const otherMenus = path => {
        const menuValues = directory.get();
        return difference(keys(menuValues), path);
      };
      const getPrimary = () => primary.get().bind(getPreparedMenu);
      const getMenus = () => menus.get();
      return {
        setMenuBuilt,
        setContents,
        expand,
        refresh,
        collapse,
        lookupMenu,
        lookupItem,
        otherMenus,
        getPrimary,
        getMenus,
        clear,
        isClear,
        getTriggeringPath
      };
    };
    const extractPreparedMenu = prep => prep.type === 'prepared' ? Optional.some(prep.menu) : Optional.none();
    const LayeredState = {
      init: init$c,
      extractPreparedMenu
    };

    const onMenuItemHighlightedEvent = generate$6('tiered-menu-item-highlight');
    const onMenuItemDehighlightedEvent = generate$6('tiered-menu-item-dehighlight');

    var HighlightOnOpen;
    (function (HighlightOnOpen) {
      HighlightOnOpen[HighlightOnOpen['HighlightMenuAndItem'] = 0] = 'HighlightMenuAndItem';
      HighlightOnOpen[HighlightOnOpen['HighlightJustMenu'] = 1] = 'HighlightJustMenu';
      HighlightOnOpen[HighlightOnOpen['HighlightNone'] = 2] = 'HighlightNone';
    }(HighlightOnOpen || (HighlightOnOpen = {})));

    const make$6 = (detail, _rawUiSpec) => {
      const submenuParentItems = value$2();
      const buildMenus = (container, primaryName, menus) => map$1(menus, (spec, name) => {
        const makeSketch = () => Menu.sketch({
          ...spec,
          value: name,
          markers: detail.markers,
          fakeFocus: detail.fakeFocus,
          onHighlight: (menuComp, itemComp) => {
            const highlightData = {
              menuComp,
              itemComp
            };
            emitWith(menuComp, onMenuItemHighlightedEvent, highlightData);
          },
          onDehighlight: (menuComp, itemComp) => {
            const dehighlightData = {
              menuComp,
              itemComp
            };
            emitWith(menuComp, onMenuItemDehighlightedEvent, dehighlightData);
          },
          focusManager: detail.fakeFocus ? highlights() : dom$2()
        });
        return name === primaryName ? {
          type: 'prepared',
          menu: container.getSystem().build(makeSketch())
        } : {
          type: 'notbuilt',
          nbMenu: makeSketch
        };
      });
      const layeredState = LayeredState.init();
      const setup = container => {
        const componentMap = buildMenus(container, detail.data.primary, detail.data.menus);
        const directory = toDirectory();
        layeredState.setContents(detail.data.primary, componentMap, detail.data.expansions, directory);
        return layeredState.getPrimary();
      };
      const getItemValue = item => Representing.getValue(item).value;
      const getItemByValue = (_container, menus, itemValue) => findMap(menus, menu => {
        if (!menu.getSystem().isConnected()) {
          return Optional.none();
        }
        const candidates = Highlighting.getCandidates(menu);
        return find$5(candidates, c => getItemValue(c) === itemValue);
      });
      const toDirectory = _container => map$1(detail.data.menus, (data, _menuName) => bind$3(data.items, item => item.type === 'separator' ? [] : [item.data.value]));
      const setActiveMenu = Highlighting.highlight;
      const setActiveMenuAndItem = (container, menu) => {
        setActiveMenu(container, menu);
        Highlighting.getHighlighted(menu).orThunk(() => Highlighting.getFirst(menu)).each(item => {
          if (detail.fakeFocus) {
            Highlighting.highlight(menu, item);
          } else {
            dispatch(container, item.element, focusItem());
          }
        });
      };
      const getMenus = (state, menuValues) => cat(map$2(menuValues, mv => state.lookupMenu(mv).bind(prep => prep.type === 'prepared' ? Optional.some(prep.menu) : Optional.none())));
      const closeOthers = (container, state, path) => {
        const others = getMenus(state, state.otherMenus(path));
        each$1(others, o => {
          remove$1(o.element, [detail.markers.backgroundMenu]);
          if (!detail.stayInDom) {
            Replacing.remove(container, o);
          }
        });
      };
      const getSubmenuParents = container => submenuParentItems.get().getOrThunk(() => {
        const r = {};
        const items = descendants(container.element, `.${ detail.markers.item }`);
        const parentItems = filter$2(items, i => get$f(i, 'aria-haspopup') === 'true');
        each$1(parentItems, i => {
          container.getSystem().getByDom(i).each(itemComp => {
            const key = getItemValue(itemComp);
            r[key] = itemComp;
          });
        });
        submenuParentItems.set(r);
        return r;
      });
      const updateAriaExpansions = (container, path) => {
        const parentItems = getSubmenuParents(container);
        each(parentItems, (v, k) => {
          const expanded = contains$2(path, k);
          set$9(v.element, 'aria-expanded', expanded);
        });
      };
      const updateMenuPath = (container, state, path) => Optional.from(path[0]).bind(latestMenuName => state.lookupMenu(latestMenuName).bind(menuPrep => {
        if (menuPrep.type === 'notbuilt') {
          return Optional.none();
        } else {
          const activeMenu = menuPrep.menu;
          const rest = getMenus(state, path.slice(1));
          each$1(rest, r => {
            add$2(r.element, detail.markers.backgroundMenu);
          });
          if (!inBody(activeMenu.element)) {
            Replacing.append(container, premade(activeMenu));
          }
          remove$1(activeMenu.element, [detail.markers.backgroundMenu]);
          setActiveMenuAndItem(container, activeMenu);
          closeOthers(container, state, path);
          return Optional.some(activeMenu);
        }
      }));
      let ExpandHighlightDecision;
      (function (ExpandHighlightDecision) {
        ExpandHighlightDecision[ExpandHighlightDecision['HighlightSubmenu'] = 0] = 'HighlightSubmenu';
        ExpandHighlightDecision[ExpandHighlightDecision['HighlightParent'] = 1] = 'HighlightParent';
      }(ExpandHighlightDecision || (ExpandHighlightDecision = {})));
      const buildIfRequired = (container, menuName, menuPrep) => {
        if (menuPrep.type === 'notbuilt') {
          const menu = container.getSystem().build(menuPrep.nbMenu());
          layeredState.setMenuBuilt(menuName, menu);
          return menu;
        } else {
          return menuPrep.menu;
        }
      };
      const expandRight = (container, item, decision = ExpandHighlightDecision.HighlightSubmenu) => {
        if (item.hasConfigured(Disabling) && Disabling.isDisabled(item)) {
          return Optional.some(item);
        } else {
          const value = getItemValue(item);
          return layeredState.expand(value).bind(path => {
            updateAriaExpansions(container, path);
            return Optional.from(path[0]).bind(menuName => layeredState.lookupMenu(menuName).bind(activeMenuPrep => {
              const activeMenu = buildIfRequired(container, menuName, activeMenuPrep);
              if (!inBody(activeMenu.element)) {
                Replacing.append(container, premade(activeMenu));
              }
              detail.onOpenSubmenu(container, item, activeMenu, reverse(path));
              if (decision === ExpandHighlightDecision.HighlightSubmenu) {
                Highlighting.highlightFirst(activeMenu);
                return updateMenuPath(container, layeredState, path);
              } else {
                Highlighting.dehighlightAll(activeMenu);
                return Optional.some(item);
              }
            }));
          });
        }
      };
      const collapseLeft = (container, item) => {
        const value = getItemValue(item);
        return layeredState.collapse(value).bind(path => {
          updateAriaExpansions(container, path);
          return updateMenuPath(container, layeredState, path).map(activeMenu => {
            detail.onCollapseMenu(container, item, activeMenu);
            return activeMenu;
          });
        });
      };
      const updateView = (container, item) => {
        const value = getItemValue(item);
        return layeredState.refresh(value).bind(path => {
          updateAriaExpansions(container, path);
          return updateMenuPath(container, layeredState, path);
        });
      };
      const onRight = (container, item) => inside(item.element) ? Optional.none() : expandRight(container, item, ExpandHighlightDecision.HighlightSubmenu);
      const onLeft = (container, item) => inside(item.element) ? Optional.none() : collapseLeft(container, item);
      const onEscape = (container, item) => collapseLeft(container, item).orThunk(() => detail.onEscape(container, item).map(() => container));
      const keyOnItem = f => (container, simulatedEvent) => {
        return closest$1(simulatedEvent.getSource(), `.${ detail.markers.item }`).bind(target => container.getSystem().getByDom(target).toOptional().bind(item => f(container, item).map(always)));
      };
      const events = derive$2([
        run$1(focus(), (tmenu, simulatedEvent) => {
          const item = simulatedEvent.event.item;
          layeredState.lookupItem(getItemValue(item)).each(() => {
            const menu = simulatedEvent.event.menu;
            Highlighting.highlight(tmenu, menu);
            const value = getItemValue(simulatedEvent.event.item);
            layeredState.refresh(value).each(path => closeOthers(tmenu, layeredState, path));
          });
        }),
        runOnExecute$1((component, simulatedEvent) => {
          const target = simulatedEvent.event.target;
          component.getSystem().getByDom(target).each(item => {
            const itemValue = getItemValue(item);
            if (itemValue.indexOf('collapse-item') === 0) {
              collapseLeft(component, item);
            }
            expandRight(component, item, ExpandHighlightDecision.HighlightSubmenu).fold(() => {
              detail.onExecute(component, item);
            }, noop);
          });
        }),
        runOnAttached((container, _simulatedEvent) => {
          setup(container).each(primary => {
            Replacing.append(container, premade(primary));
            detail.onOpenMenu(container, primary);
            if (detail.highlightOnOpen === HighlightOnOpen.HighlightMenuAndItem) {
              setActiveMenuAndItem(container, primary);
            } else if (detail.highlightOnOpen === HighlightOnOpen.HighlightJustMenu) {
              setActiveMenu(container, primary);
            }
          });
        }),
        run$1(onMenuItemHighlightedEvent, (tmenuComp, se) => {
          detail.onHighlightItem(tmenuComp, se.event.menuComp, se.event.itemComp);
        }),
        run$1(onMenuItemDehighlightedEvent, (tmenuComp, se) => {
          detail.onDehighlightItem(tmenuComp, se.event.menuComp, se.event.itemComp);
        }),
        ...detail.navigateOnHover ? [run$1(hover(), (tmenu, simulatedEvent) => {
            const item = simulatedEvent.event.item;
            updateView(tmenu, item);
            expandRight(tmenu, item, ExpandHighlightDecision.HighlightParent);
            detail.onHover(tmenu, item);
          })] : []
      ]);
      const getActiveItem = container => Highlighting.getHighlighted(container).bind(Highlighting.getHighlighted);
      const collapseMenuApi = container => {
        getActiveItem(container).each(currentItem => {
          collapseLeft(container, currentItem);
        });
      };
      const highlightPrimary = container => {
        layeredState.getPrimary().each(primary => {
          setActiveMenuAndItem(container, primary);
        });
      };
      const extractMenuFromContainer = container => Optional.from(container.components()[0]).filter(comp => get$f(comp.element, 'role') === 'menu');
      const repositionMenus = container => {
        const maybeActivePrimary = layeredState.getPrimary().bind(primary => getActiveItem(container).bind(currentItem => {
          const itemValue = getItemValue(currentItem);
          const allMenus = values(layeredState.getMenus());
          const preparedMenus = cat(map$2(allMenus, LayeredState.extractPreparedMenu));
          return layeredState.getTriggeringPath(itemValue, v => getItemByValue(container, preparedMenus, v));
        }).map(triggeringPath => ({
          primary,
          triggeringPath
        })));
        maybeActivePrimary.fold(() => {
          extractMenuFromContainer(container).each(primaryMenu => {
            detail.onRepositionMenu(container, primaryMenu, []);
          });
        }, ({primary, triggeringPath}) => {
          detail.onRepositionMenu(container, primary, triggeringPath);
        });
      };
      const apis = {
        collapseMenu: collapseMenuApi,
        highlightPrimary,
        repositionMenus
      };
      return {
        uid: detail.uid,
        dom: detail.dom,
        markers: detail.markers,
        behaviours: augment(detail.tmenuBehaviours, [
          Keying.config({
            mode: 'special',
            onRight: keyOnItem(onRight),
            onLeft: keyOnItem(onLeft),
            onEscape: keyOnItem(onEscape),
            focusIn: (container, _keyInfo) => {
              layeredState.getPrimary().each(primary => {
                dispatch(container, primary.element, focusItem());
              });
            }
          }),
          Highlighting.config({
            highlightClass: detail.markers.selectedMenu,
            itemClass: detail.markers.menu
          }),
          Composing.config({
            find: container => {
              return Highlighting.getHighlighted(container);
            }
          }),
          Replacing.config({})
        ]),
        eventOrder: detail.eventOrder,
        apis,
        events
      };
    };
    const collapseItem$1 = constant$1('collapse-item');

    const tieredData = (primary, menus, expansions) => ({
      primary,
      menus,
      expansions
    });
    const singleData = (name, menu) => ({
      primary: name,
      menus: wrap$1(name, menu),
      expansions: {}
    });
    const collapseItem = text => ({
      value: generate$6(collapseItem$1()),
      meta: { text }
    });
    const tieredMenu = single({
      name: 'TieredMenu',
      configFields: [
        onStrictKeyboardHandler('onExecute'),
        onStrictKeyboardHandler('onEscape'),
        onStrictHandler('onOpenMenu'),
        onStrictHandler('onOpenSubmenu'),
        onHandler('onRepositionMenu'),
        onHandler('onCollapseMenu'),
        defaulted('highlightOnOpen', HighlightOnOpen.HighlightMenuAndItem),
        requiredObjOf('data', [
          required$1('primary'),
          required$1('menus'),
          required$1('expansions')
        ]),
        defaulted('fakeFocus', false),
        onHandler('onHighlightItem'),
        onHandler('onDehighlightItem'),
        onHandler('onHover'),
        tieredMenuMarkers(),
        required$1('dom'),
        defaulted('navigateOnHover', true),
        defaulted('stayInDom', false),
        field('tmenuBehaviours', [
          Keying,
          Highlighting,
          Composing,
          Replacing
        ]),
        defaulted('eventOrder', {})
      ],
      apis: {
        collapseMenu: (apis, tmenu) => {
          apis.collapseMenu(tmenu);
        },
        highlightPrimary: (apis, tmenu) => {
          apis.highlightPrimary(tmenu);
        },
        repositionMenus: (apis, tmenu) => {
          apis.repositionMenus(tmenu);
        }
      },
      factory: make$6,
      extraApis: {
        tieredData,
        singleData,
        collapseItem
      }
    });

    const makeMenu = (detail, menuSandbox, placementSpec, menuSpec, getBounds) => {
      const lazySink = () => detail.lazySink(menuSandbox);
      const layouts = menuSpec.type === 'horizontal' ? {
        layouts: {
          onLtr: () => belowOrAbove(),
          onRtl: () => belowOrAboveRtl()
        }
      } : {};
      const isFirstTierSubmenu = triggeringPaths => triggeringPaths.length === 2;
      const getSubmenuLayouts = triggeringPaths => isFirstTierSubmenu(triggeringPaths) ? layouts : {};
      return tieredMenu.sketch({
        dom: { tag: 'div' },
        data: menuSpec.data,
        markers: menuSpec.menu.markers,
        highlightOnOpen: menuSpec.menu.highlightOnOpen,
        fakeFocus: menuSpec.menu.fakeFocus,
        onEscape: () => {
          Sandboxing.close(menuSandbox);
          detail.onEscape.map(handler => handler(menuSandbox));
          return Optional.some(true);
        },
        onExecute: () => {
          return Optional.some(true);
        },
        onOpenMenu: (tmenu, menu) => {
          Positioning.positionWithinBounds(lazySink().getOrDie(), menu, placementSpec, getBounds());
        },
        onOpenSubmenu: (tmenu, item, submenu, triggeringPaths) => {
          const sink = lazySink().getOrDie();
          Positioning.position(sink, submenu, {
            anchor: {
              type: 'submenu',
              item,
              ...getSubmenuLayouts(triggeringPaths)
            }
          });
        },
        onRepositionMenu: (tmenu, primaryMenu, submenuTriggers) => {
          const sink = lazySink().getOrDie();
          Positioning.positionWithinBounds(sink, primaryMenu, placementSpec, getBounds());
          each$1(submenuTriggers, st => {
            const submenuLayouts = getSubmenuLayouts(st.triggeringPath);
            Positioning.position(sink, st.triggeredMenu, {
              anchor: {
                type: 'submenu',
                item: st.triggeringItem,
                ...submenuLayouts
              }
            });
          });
        }
      });
    };
    const factory$m = (detail, spec) => {
      const isPartOfRelated = (sandbox, queryElem) => {
        const related = detail.getRelated(sandbox);
        return related.exists(rel => isPartOf$1(rel, queryElem));
      };
      const setContent = (sandbox, thing) => {
        Sandboxing.setContent(sandbox, thing);
      };
      const showAt = (sandbox, thing, placementSpec) => {
        showWithin(sandbox, thing, placementSpec, Optional.none());
      };
      const showWithin = (sandbox, thing, placementSpec, boxElement) => {
        showWithinBounds(sandbox, thing, placementSpec, () => boxElement.map(elem => box$1(elem)));
      };
      const showWithinBounds = (sandbox, thing, placementSpec, getBounds) => {
        const sink = detail.lazySink(sandbox).getOrDie();
        Sandboxing.openWhileCloaked(sandbox, thing, () => Positioning.positionWithinBounds(sink, sandbox, placementSpec, getBounds()));
        Representing.setValue(sandbox, Optional.some({
          mode: 'position',
          config: placementSpec,
          getBounds
        }));
      };
      const showMenuAt = (sandbox, placementSpec, menuSpec) => {
        showMenuWithinBounds(sandbox, placementSpec, menuSpec, Optional.none);
      };
      const showMenuWithinBounds = (sandbox, placementSpec, menuSpec, getBounds) => {
        const menu = makeMenu(detail, sandbox, placementSpec, menuSpec, getBounds);
        Sandboxing.open(sandbox, menu);
        Representing.setValue(sandbox, Optional.some({
          mode: 'menu',
          menu
        }));
      };
      const hide = sandbox => {
        if (Sandboxing.isOpen(sandbox)) {
          Representing.setValue(sandbox, Optional.none());
          Sandboxing.close(sandbox);
        }
      };
      const getContent = sandbox => Sandboxing.getState(sandbox);
      const reposition = sandbox => {
        if (Sandboxing.isOpen(sandbox)) {
          Representing.getValue(sandbox).each(state => {
            switch (state.mode) {
            case 'menu':
              Sandboxing.getState(sandbox).each(tieredMenu.repositionMenus);
              break;
            case 'position':
              const sink = detail.lazySink(sandbox).getOrDie();
              Positioning.positionWithinBounds(sink, sandbox, state.config, state.getBounds());
              break;
            }
          });
        }
      };
      const apis = {
        setContent,
        showAt,
        showWithin,
        showWithinBounds,
        showMenuAt,
        showMenuWithinBounds,
        hide,
        getContent,
        reposition,
        isOpen: Sandboxing.isOpen
      };
      return {
        uid: detail.uid,
        dom: detail.dom,
        behaviours: augment(detail.inlineBehaviours, [
          Sandboxing.config({
            isPartOf: (sandbox, data, queryElem) => {
              return isPartOf$1(data, queryElem) || isPartOfRelated(sandbox, queryElem);
            },
            getAttachPoint: sandbox => {
              return detail.lazySink(sandbox).getOrDie();
            },
            onOpen: sandbox => {
              detail.onShow(sandbox);
            },
            onClose: sandbox => {
              detail.onHide(sandbox);
            }
          }),
          Representing.config({
            store: {
              mode: 'memory',
              initialValue: Optional.none()
            }
          }),
          Receiving.config({
            channels: {
              ...receivingChannel$1({
                isExtraPart: spec.isExtraPart,
                ...detail.fireDismissalEventInstead.map(fe => ({ fireEventInstead: { event: fe.event } })).getOr({})
              }),
              ...receivingChannel({
                ...detail.fireRepositionEventInstead.map(fe => ({ fireEventInstead: { event: fe.event } })).getOr({}),
                doReposition: reposition
              })
            }
          })
        ]),
        eventOrder: detail.eventOrder,
        apis
      };
    };
    const InlineView = single({
      name: 'InlineView',
      configFields: [
        required$1('lazySink'),
        onHandler('onShow'),
        onHandler('onHide'),
        optionFunction('onEscape'),
        field('inlineBehaviours', [
          Sandboxing,
          Representing,
          Receiving
        ]),
        optionObjOf('fireDismissalEventInstead', [defaulted('event', dismissRequested())]),
        optionObjOf('fireRepositionEventInstead', [defaulted('event', repositionRequested())]),
        defaulted('getRelated', Optional.none),
        defaulted('isExtraPart', never),
        defaulted('eventOrder', Optional.none)
      ],
      factory: factory$m,
      apis: {
        showAt: (apis, component, anchor, thing) => {
          apis.showAt(component, anchor, thing);
        },
        showWithin: (apis, component, anchor, thing, boxElement) => {
          apis.showWithin(component, anchor, thing, boxElement);
        },
        showWithinBounds: (apis, component, anchor, thing, bounds) => {
          apis.showWithinBounds(component, anchor, thing, bounds);
        },
        showMenuAt: (apis, component, anchor, menuSpec) => {
          apis.showMenuAt(component, anchor, menuSpec);
        },
        showMenuWithinBounds: (apis, component, anchor, menuSpec, bounds) => {
          apis.showMenuWithinBounds(component, anchor, menuSpec, bounds);
        },
        hide: (apis, component) => {
          apis.hide(component);
        },
        isOpen: (apis, component) => apis.isOpen(component),
        getContent: (apis, component) => apis.getContent(component),
        setContent: (apis, component, thing) => {
          apis.setContent(component, thing);
        },
        reposition: (apis, component) => {
          apis.reposition(component);
        }
      }
    });

    var global$9 = tinymce.util.Tools.resolve('tinymce.util.Delay');

    const factory$l = detail => {
      const events = events$a(detail.action);
      const tag = detail.dom.tag;
      const lookupAttr = attr => get$g(detail.dom, 'attributes').bind(attrs => get$g(attrs, attr));
      const getModAttributes = () => {
        if (tag === 'button') {
          const type = lookupAttr('type').getOr('button');
          const roleAttrs = lookupAttr('role').map(role => ({ role })).getOr({});
          return {
            type,
            ...roleAttrs
          };
        } else {
          const role = lookupAttr('role').getOr('button');
          return { role };
        }
      };
      return {
        uid: detail.uid,
        dom: detail.dom,
        components: detail.components,
        events,
        behaviours: SketchBehaviours.augment(detail.buttonBehaviours, [
          Focusing.config({}),
          Keying.config({
            mode: 'execution',
            useSpace: true,
            useEnter: true
          })
        ]),
        domModification: { attributes: getModAttributes() },
        eventOrder: detail.eventOrder
      };
    };
    const Button = single({
      name: 'Button',
      factory: factory$l,
      configFields: [
        defaulted('uid', undefined),
        required$1('dom'),
        defaulted('components', []),
        SketchBehaviours.field('buttonBehaviours', [
          Focusing,
          Keying
        ]),
        option$3('action'),
        option$3('role'),
        defaulted('eventOrder', {})
      ]
    });

    const record = spec => {
      const uid = isSketchSpec(spec) && hasNonNullableKey(spec, 'uid') ? spec.uid : generate$5('memento');
      const get = anyInSystem => anyInSystem.getSystem().getByUid(uid).getOrDie();
      const getOpt = anyInSystem => anyInSystem.getSystem().getByUid(uid).toOptional();
      const asSpec = () => ({
        ...spec,
        uid
      });
      return {
        get,
        getOpt,
        asSpec
      };
    };

    var global$8 = tinymce.util.Tools.resolve('tinymce.util.I18n');

    const rtlTransform = {
      'indent': true,
      'outdent': true,
      'table-insert-column-after': true,
      'table-insert-column-before': true,
      'paste-column-after': true,
      'paste-column-before': true,
      'unordered-list': true,
      'list-bull-circle': true,
      'list-bull-default': true,
      'list-bull-square': true
    };
    const defaultIconName = 'temporary-placeholder';
    const defaultIcon = icons => () => get$g(icons, defaultIconName).getOr('!not found!');
    const getIconName = (name, icons) => {
      const lcName = name.toLowerCase();
      if (global$8.isRtl()) {
        const rtlName = ensureTrailing(lcName, '-rtl');
        return has$2(icons, rtlName) ? rtlName : lcName;
      } else {
        return lcName;
      }
    };
    const lookupIcon = (name, icons) => get$g(icons, getIconName(name, icons));
    const get$2 = (name, iconProvider) => {
      const icons = iconProvider();
      return lookupIcon(name, icons).getOrThunk(defaultIcon(icons));
    };
    const getOr = (name, iconProvider, fallbackIcon) => {
      const icons = iconProvider();
      return lookupIcon(name, icons).or(fallbackIcon).getOrThunk(defaultIcon(icons));
    };
    const needsRtlTransform = iconName => global$8.isRtl() ? has$2(rtlTransform, iconName) : false;
    const addFocusableBehaviour = () => config('add-focusable', [runOnAttached(comp => {
        child(comp.element, 'svg').each(svg => set$9(svg, 'focusable', 'false'));
      })]);
    const renderIcon$2 = (spec, iconName, icons, fallbackIcon) => {
      var _a, _b;
      const rtlIconClasses = needsRtlTransform(iconName) ? ['tox-icon--flip'] : [];
      const iconHtml = get$g(icons, getIconName(iconName, icons)).or(fallbackIcon).getOrThunk(defaultIcon(icons));
      return {
        dom: {
          tag: spec.tag,
          attributes: (_a = spec.attributes) !== null && _a !== void 0 ? _a : {},
          classes: spec.classes.concat(rtlIconClasses),
          innerHtml: iconHtml
        },
        behaviours: derive$1([
          ...(_b = spec.behaviours) !== null && _b !== void 0 ? _b : [],
          addFocusableBehaviour()
        ])
      };
    };
    const render$3 = (iconName, spec, iconProvider, fallbackIcon = Optional.none()) => renderIcon$2(spec, iconName, iconProvider(), fallbackIcon);
    const renderFirst = (iconNames, spec, iconProvider) => {
      const icons = iconProvider();
      const iconName = find$5(iconNames, name => has$2(icons, getIconName(name, icons)));
      return renderIcon$2(spec, iconName.getOr(defaultIconName), icons, Optional.none());
    };

    const notificationIconMap = {
      success: 'checkmark',
      error: 'warning',
      err: 'error',
      warning: 'warning',
      warn: 'warning',
      info: 'info'
    };
    const factory$k = detail => {
      const memBannerText = record({
        dom: {
          tag: 'p',
          innerHtml: detail.translationProvider(detail.text)
        },
        behaviours: derive$1([Replacing.config({})])
      });
      const renderPercentBar = percent => ({
        dom: {
          tag: 'div',
          classes: ['tox-bar'],
          styles: { width: `${ percent }%` }
        }
      });
      const renderPercentText = percent => ({
        dom: {
          tag: 'div',
          classes: ['tox-text'],
          innerHtml: `${ percent }%`
        }
      });
      const memBannerProgress = record({
        dom: {
          tag: 'div',
          classes: detail.progress ? [
            'tox-progress-bar',
            'tox-progress-indicator'
          ] : ['tox-progress-bar']
        },
        components: [
          {
            dom: {
              tag: 'div',
              classes: ['tox-bar-container']
            },
            components: [renderPercentBar(0)]
          },
          renderPercentText(0)
        ],
        behaviours: derive$1([Replacing.config({})])
      });
      const updateProgress = (comp, percent) => {
        if (comp.getSystem().isConnected()) {
          memBannerProgress.getOpt(comp).each(progress => {
            Replacing.set(progress, [
              {
                dom: {
                  tag: 'div',
                  classes: ['tox-bar-container']
                },
                components: [renderPercentBar(percent)]
              },
              renderPercentText(percent)
            ]);
          });
        }
      };
      const updateText = (comp, text) => {
        if (comp.getSystem().isConnected()) {
          const banner = memBannerText.get(comp);
          Replacing.set(banner, [text$1(text)]);
        }
      };
      const apis = {
        updateProgress,
        updateText
      };
      const iconChoices = flatten([
        detail.icon.toArray(),
        detail.level.toArray(),
        detail.level.bind(level => Optional.from(notificationIconMap[level])).toArray()
      ]);
      const memButton = record(Button.sketch({
        dom: {
          tag: 'button',
          classes: [
            'tox-notification__dismiss',
            'tox-button',
            'tox-button--naked',
            'tox-button--icon'
          ]
        },
        components: [render$3('close', {
            tag: 'div',
            classes: ['tox-icon'],
            attributes: { 'aria-label': detail.translationProvider('Close') }
          }, detail.iconProvider)],
        action: comp => {
          detail.onAction(comp);
        }
      }));
      const notificationIconSpec = renderFirst(iconChoices, {
        tag: 'div',
        classes: ['tox-notification__icon']
      }, detail.iconProvider);
      const notificationBodySpec = {
        dom: {
          tag: 'div',
          classes: ['tox-notification__body']
        },
        components: [memBannerText.asSpec()],
        behaviours: derive$1([Replacing.config({})])
      };
      const components = [
        notificationIconSpec,
        notificationBodySpec
      ];
      return {
        uid: detail.uid,
        dom: {
          tag: 'div',
          attributes: { role: 'alert' },
          classes: detail.level.map(level => [
            'tox-notification',
            'tox-notification--in',
            `tox-notification--${ level }`
          ]).getOr([
            'tox-notification',
            'tox-notification--in'
          ])
        },
        behaviours: derive$1([
          Focusing.config({}),
          config('notification-events', [run$1(focusin(), comp => {
              memButton.getOpt(comp).each(Focusing.focus);
            })])
        ]),
        components: components.concat(detail.progress ? [memBannerProgress.asSpec()] : []).concat(!detail.closeButton ? [] : [memButton.asSpec()]),
        apis
      };
    };
    const Notification = single({
      name: 'Notification',
      factory: factory$k,
      configFields: [
        option$3('level'),
        required$1('progress'),
        option$3('icon'),
        required$1('onAction'),
        required$1('text'),
        required$1('iconProvider'),
        required$1('translationProvider'),
        defaultedBoolean('closeButton', true)
      ],
      apis: {
        updateProgress: (apis, comp, percent) => {
          apis.updateProgress(comp, percent);
        },
        updateText: (apis, comp, text) => {
          apis.updateText(comp, text);
        }
      }
    });

    var NotificationManagerImpl = (editor, extras, uiMothership) => {
      const sharedBackstage = extras.backstage.shared;
      const getBounds = () => {
        const contentArea = box$1(SugarElement.fromDom(editor.getContentAreaContainer()));
        const win$1 = win();
        const x = clamp(win$1.x, contentArea.x, contentArea.right);
        const y = clamp(win$1.y, contentArea.y, contentArea.bottom);
        const right = Math.max(contentArea.right, win$1.right);
        const bottom = Math.max(contentArea.bottom, win$1.bottom);
        return Optional.some(bounds(x, y, right - x, bottom - y));
      };
      const open = (settings, closeCallback) => {
        const close = () => {
          closeCallback();
          InlineView.hide(notificationWrapper);
        };
        const notification = build$1(Notification.sketch({
          text: settings.text,
          level: contains$2([
            'success',
            'error',
            'warning',
            'warn',
            'info'
          ], settings.type) ? settings.type : undefined,
          progress: settings.progressBar === true,
          icon: settings.icon,
          closeButton: settings.closeButton,
          onAction: close,
          iconProvider: sharedBackstage.providers.icons,
          translationProvider: sharedBackstage.providers.translate
        }));
        const notificationWrapper = build$1(InlineView.sketch({
          dom: {
            tag: 'div',
            classes: ['tox-notifications-container']
          },
          lazySink: sharedBackstage.getSink,
          fireDismissalEventInstead: {},
          ...sharedBackstage.header.isPositionedAtTop() ? {} : { fireRepositionEventInstead: {} }
        }));
        uiMothership.add(notificationWrapper);
        if (isNumber(settings.timeout) && settings.timeout > 0) {
          global$9.setEditorTimeout(editor, () => {
            close();
          }, settings.timeout);
        }
        const reposition = () => {
          const notificationSpec = premade(notification);
          const anchorOverrides = { maxHeightFunction: expandable$1() };
          const allNotifications = editor.notificationManager.getNotifications();
          if (allNotifications[0] === thisNotification) {
            const anchor = {
              ...sharedBackstage.anchors.banner(),
              overrides: anchorOverrides
            };
            InlineView.showWithinBounds(notificationWrapper, notificationSpec, { anchor }, getBounds);
          } else {
            indexOf(allNotifications, thisNotification).each(idx => {
              const previousNotification = allNotifications[idx - 1].getEl();
              const nodeAnchor = {
                type: 'node',
                root: body(),
                node: Optional.some(SugarElement.fromDom(previousNotification)),
                overrides: anchorOverrides,
                layouts: {
                  onRtl: () => [south$2],
                  onLtr: () => [south$2]
                }
              };
              InlineView.showWithinBounds(notificationWrapper, notificationSpec, { anchor: nodeAnchor }, getBounds);
            });
          }
        };
        const thisNotification = {
          close,
          reposition,
          text: nuText => {
            Notification.updateText(notification, nuText);
          },
          settings,
          getEl: () => notification.element.dom,
          progressBar: {
            value: percent => {
              Notification.updateProgress(notification, percent);
            }
          }
        };
        return thisNotification;
      };
      const close = notification => {
        notification.close();
      };
      const getArgs = notification => {
        return notification.settings;
      };
      return {
        open,
        close,
        getArgs
      };
    };

    var global$7 = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils');

    var global$6 = tinymce.util.Tools.resolve('tinymce.EditorManager');

    var global$5 = tinymce.util.Tools.resolve('tinymce.Env');

    var ToolbarMode$1;
    (function (ToolbarMode) {
      ToolbarMode['default'] = 'wrap';
      ToolbarMode['floating'] = 'floating';
      ToolbarMode['sliding'] = 'sliding';
      ToolbarMode['scrolling'] = 'scrolling';
    }(ToolbarMode$1 || (ToolbarMode$1 = {})));
    var ToolbarLocation$1;
    (function (ToolbarLocation) {
      ToolbarLocation['auto'] = 'auto';
      ToolbarLocation['top'] = 'top';
      ToolbarLocation['bottom'] = 'bottom';
    }(ToolbarLocation$1 || (ToolbarLocation$1 = {})));
    const option$2 = name => editor => editor.options.get(name);
    const wrapOptional = fn => editor => Optional.from(fn(editor));
    const register$e = editor => {
      const isPhone = global$5.deviceType.isPhone();
      const isMobile = global$5.deviceType.isTablet() || isPhone;
      const registerOption = editor.options.register;
      const stringOrFalseProcessor = value => isString(value) || value === false;
      const stringOrNumberProcessor = value => isString(value) || isNumber(value);
      registerOption('skin', {
        processor: value => isString(value) || value === false,
        default: 'oxide'
      });
      registerOption('skin_url', { processor: 'string' });
      registerOption('height', {
        processor: stringOrNumberProcessor,
        default: Math.max(editor.getElement().offsetHeight, 400)
      });
      registerOption('width', {
        processor: stringOrNumberProcessor,
        default: global$7.DOM.getStyle(editor.getElement(), 'width')
      });
      registerOption('min_height', {
        processor: 'number',
        default: 100
      });
      registerOption('min_width', { processor: 'number' });
      registerOption('max_height', { processor: 'number' });
      registerOption('max_width', { processor: 'number' });
      registerOption('style_formats', { processor: 'object[]' });
      registerOption('style_formats_merge', {
        processor: 'boolean',
        default: false
      });
      registerOption('style_formats_autohide', {
        processor: 'boolean',
        default: false
      });
      registerOption('line_height_formats', {
        processor: 'string',
        default: '1 1.1 1.2 1.3 1.4 1.5 2'
      });
      registerOption('font_family_formats', {
        processor: 'string',
        default: 'Andale Mono=andale mono,monospace;' + 'Arial=arial,helvetica,sans-serif;' + 'Arial Black=arial black,sans-serif;' + 'Book Antiqua=book antiqua,palatino,serif;' + 'Comic Sans MS=comic sans ms,sans-serif;' + 'Courier New=courier new,courier,monospace;' + 'Georgia=georgia,palatino,serif;' + 'Helvetica=helvetica,arial,sans-serif;' + 'Impact=impact,sans-serif;' + 'Symbol=symbol;' + 'Tahoma=tahoma,arial,helvetica,sans-serif;' + 'Terminal=terminal,monaco,monospace;' + 'Times New Roman=times new roman,times,serif;' + 'Trebuchet MS=trebuchet ms,geneva,sans-serif;' + 'Verdana=verdana,geneva,sans-serif;' + 'Webdings=webdings;' + 'Wingdings=wingdings,zapf dingbats'
      });
      registerOption('font_size_formats', {
        processor: 'string',
        default: '8pt 10pt 12pt 14pt 18pt 24pt 36pt'
      });
      registerOption('block_formats', {
        processor: 'string',
        default: 'Paragraph=p;' + 'Heading 1=h1;' + 'Heading 2=h2;' + 'Heading 3=h3;' + 'Heading 4=h4;' + 'Heading 5=h5;' + 'Heading 6=h6;' + 'Preformatted=pre'
      });
      registerOption('content_langs', { processor: 'object[]' });
      registerOption('removed_menuitems', {
        processor: 'string',
        default: ''
      });
      registerOption('menubar', {
        processor: value => isString(value) || isBoolean(value),
        default: !isPhone
      });
      registerOption('menu', {
        processor: 'object',
        default: {}
      });
      registerOption('toolbar', {
        processor: value => {
          if (isBoolean(value) || isString(value) || isArray(value)) {
            return {
              value,
              valid: true
            };
          } else {
            return {
              valid: false,
              message: 'Must be a boolean, string or array.'
            };
          }
        },
        default: true
      });
      range$2(9, num => {
        registerOption('toolbar' + (num + 1), { processor: 'string' });
      });
      registerOption('toolbar_mode', {
        processor: 'string',
        default: isMobile ? 'scrolling' : 'floating'
      });
      registerOption('toolbar_groups', {
        processor: 'object',
        default: {}
      });
      registerOption('toolbar_location', {
        processor: 'string',
        default: ToolbarLocation$1.auto
      });
      registerOption('toolbar_persist', {
        processor: 'boolean',
        default: false
      });
      registerOption('toolbar_sticky', {
        processor: 'boolean',
        default: editor.inline
      });
      registerOption('toolbar_sticky_offset', {
        processor: 'number',
        default: 0
      });
      registerOption('fixed_toolbar_container', {
        processor: 'string',
        default: ''
      });
      registerOption('fixed_toolbar_container_target', { processor: 'object' });
      registerOption('file_picker_callback', { processor: 'function' });
      registerOption('file_picker_validator_handler', { processor: 'function' });
      registerOption('file_picker_types', { processor: 'string' });
      registerOption('typeahead_urls', {
        processor: 'boolean',
        default: true
      });
      registerOption('anchor_top', {
        processor: stringOrFalseProcessor,
        default: '#top'
      });
      registerOption('anchor_bottom', {
        processor: stringOrFalseProcessor,
        default: '#bottom'
      });
      registerOption('draggable_modal', {
        processor: 'boolean',
        default: false
      });
      registerOption('statusbar', {
        processor: 'boolean',
        default: true
      });
      registerOption('elementpath', {
        processor: 'boolean',
        default: true
      });
      registerOption('branding', {
        processor: 'boolean',
        default: true
      });
      registerOption('promotion', {
        processor: 'boolean',
        default: true
      });
      registerOption('resize', {
        processor: value => value === 'both' || isBoolean(value),
        default: !global$5.deviceType.isTouch()
      });
      registerOption('sidebar_show', { processor: 'string' });
    };
    const isReadOnly = option$2('readonly');
    const getHeightOption = option$2('height');
    const getWidthOption = option$2('width');
    const getMinWidthOption = wrapOptional(option$2('min_width'));
    const getMinHeightOption = wrapOptional(option$2('min_height'));
    const getMaxWidthOption = wrapOptional(option$2('max_width'));
    const getMaxHeightOption = wrapOptional(option$2('max_height'));
    const getUserStyleFormats = wrapOptional(option$2('style_formats'));
    const shouldMergeStyleFormats = option$2('style_formats_merge');
    const shouldAutoHideStyleFormats = option$2('style_formats_autohide');
    const getContentLanguages = option$2('content_langs');
    const getRemovedMenuItems = option$2('removed_menuitems');
    const getToolbarMode = option$2('toolbar_mode');
    const getToolbarGroups = option$2('toolbar_groups');
    const getToolbarLocation = option$2('toolbar_location');
    const fixedContainerSelector = option$2('fixed_toolbar_container');
    const fixedToolbarContainerTarget = option$2('fixed_toolbar_container_target');
    const isToolbarPersist = option$2('toolbar_persist');
    const getStickyToolbarOffset = option$2('toolbar_sticky_offset');
    const getMenubar = option$2('menubar');
    const getToolbar = option$2('toolbar');
    const getFilePickerCallback = option$2('file_picker_callback');
    const getFilePickerValidatorHandler = option$2('file_picker_validator_handler');
    const getFilePickerTypes = option$2('file_picker_types');
    const useTypeaheadUrls = option$2('typeahead_urls');
    const getAnchorTop = option$2('anchor_top');
    const getAnchorBottom = option$2('anchor_bottom');
    const isDraggableModal$1 = option$2('draggable_modal');
    const useStatusBar = option$2('statusbar');
    const useElementPath = option$2('elementpath');
    const useBranding = option$2('branding');
    const getResize = option$2('resize');
    const getPasteAsText = option$2('paste_as_text');
    const getSidebarShow = option$2('sidebar_show');
    const promotionEnabled = option$2('promotion');
    const isSkinDisabled = editor => editor.options.get('skin') === false;
    const isMenubarEnabled = editor => editor.options.get('menubar') !== false;
    const getSkinUrl = editor => {
      const skinUrl = editor.options.get('skin_url');
      if (isSkinDisabled(editor)) {
        return skinUrl;
      } else {
        if (skinUrl) {
          return editor.documentBaseURI.toAbsolute(skinUrl);
        } else {
          const skin = editor.options.get('skin');
          return global$6.baseURL + '/skins/ui/' + skin;
        }
      }
    };
    const getLineHeightFormats = editor => editor.options.get('line_height_formats').split(' ');
    const isToolbarEnabled = editor => {
      const toolbar = getToolbar(editor);
      const isToolbarString = isString(toolbar);
      const isToolbarObjectArray = isArray(toolbar) && toolbar.length > 0;
      return !isMultipleToolbars(editor) && (isToolbarObjectArray || isToolbarString || toolbar === true);
    };
    const getMultipleToolbarsOption = editor => {
      const toolbars = range$2(9, num => editor.options.get('toolbar' + (num + 1)));
      const toolbarArray = filter$2(toolbars, isString);
      return someIf(toolbarArray.length > 0, toolbarArray);
    };
    const isMultipleToolbars = editor => getMultipleToolbarsOption(editor).fold(() => {
      const toolbar = getToolbar(editor);
      return isArrayOf(toolbar, isString) && toolbar.length > 0;
    }, always);
    const isToolbarLocationBottom = editor => getToolbarLocation(editor) === ToolbarLocation$1.bottom;
    const fixedContainerTarget = editor => {
      var _a;
      if (!editor.inline) {
        return Optional.none();
      }
      const selector = (_a = fixedContainerSelector(editor)) !== null && _a !== void 0 ? _a : '';
      if (selector.length > 0) {
        return descendant(body(), selector);
      }
      const element = fixedToolbarContainerTarget(editor);
      if (isNonNullable(element)) {
        return Optional.some(SugarElement.fromDom(element));
      }
      return Optional.none();
    };
    const useFixedContainer = editor => editor.inline && fixedContainerTarget(editor).isSome();
    const getUiContainer = editor => {
      const fixedContainer = fixedContainerTarget(editor);
      return fixedContainer.getOrThunk(() => getContentContainer(getRootNode(SugarElement.fromDom(editor.getElement()))));
    };
    const isDistractionFree = editor => editor.inline && !isMenubarEnabled(editor) && !isToolbarEnabled(editor) && !isMultipleToolbars(editor);
    const isStickyToolbar = editor => {
      const isStickyToolbar = editor.options.get('toolbar_sticky');
      return (isStickyToolbar || editor.inline) && !useFixedContainer(editor) && !isDistractionFree(editor);
    };
    const getMenus = editor => {
      const menu = editor.options.get('menu');
      return map$1(menu, menu => ({
        ...menu,
        items: menu.items
      }));
    };

    var Options = /*#__PURE__*/Object.freeze({
        __proto__: null,
        get ToolbarMode () { return ToolbarMode$1; },
        get ToolbarLocation () { return ToolbarLocation$1; },
        register: register$e,
        getSkinUrl: getSkinUrl,
        isReadOnly: isReadOnly,
        isSkinDisabled: isSkinDisabled,
        getHeightOption: getHeightOption,
        getWidthOption: getWidthOption,
        getMinWidthOption: getMinWidthOption,
        getMinHeightOption: getMinHeightOption,
        getMaxWidthOption: getMaxWidthOption,
        getMaxHeightOption: getMaxHeightOption,
        getUserStyleFormats: getUserStyleFormats,
        shouldMergeStyleFormats: shouldMergeStyleFormats,
        shouldAutoHideStyleFormats: shouldAutoHideStyleFormats,
        getLineHeightFormats: getLineHeightFormats,
        getContentLanguages: getContentLanguages,
        getRemovedMenuItems: getRemovedMenuItems,
        isMenubarEnabled: isMenubarEnabled,
        isMultipleToolbars: isMultipleToolbars,
        isToolbarEnabled: isToolbarEnabled,
        isToolbarPersist: isToolbarPersist,
        getMultipleToolbarsOption: getMultipleToolbarsOption,
        getUiContainer: getUiContainer,
        useFixedContainer: useFixedContainer,
        getToolbarMode: getToolbarMode,
        isDraggableModal: isDraggableModal$1,
        isDistractionFree: isDistractionFree,
        isStickyToolbar: isStickyToolbar,
        getStickyToolbarOffset: getStickyToolbarOffset,
        getToolbarLocation: getToolbarLocation,
        isToolbarLocationBottom: isToolbarLocationBottom,
        getToolbarGroups: getToolbarGroups,
        getMenus: getMenus,
        getMenubar: getMenubar,
        getToolbar: getToolbar,
        getFilePickerCallback: getFilePickerCallback,
        getFilePickerTypes: getFilePickerTypes,
        useTypeaheadUrls: useTypeaheadUrls,
        getAnchorTop: getAnchorTop,
        getAnchorBottom: getAnchorBottom,
        getFilePickerValidatorHandler: getFilePickerValidatorHandler,
        useStatusBar: useStatusBar,
        useElementPath: useElementPath,
        promotionEnabled: promotionEnabled,
        useBranding: useBranding,
        getResize: getResize,
        getPasteAsText: getPasteAsText,
        getSidebarShow: getSidebarShow
    });

    const autocompleteSelector = '[data-mce-autocompleter]';
    const detect = elm => closest$1(elm, autocompleteSelector);
    const findIn = elm => descendant(elm, autocompleteSelector);

    const setup$e = (api, editor) => {
      const redirectKeyToItem = (item, e) => {
        emitWith(item, keydown(), { raw: e });
      };
      const getItem = () => api.getMenu().bind(Highlighting.getHighlighted);
      editor.on('keydown', e => {
        const keyCode = e.which;
        if (!api.isActive()) {
          return;
        }
        if (api.isMenuOpen()) {
          if (keyCode === 13) {
            getItem().each(emitExecute);
            e.preventDefault();
          } else if (keyCode === 40) {
            getItem().fold(() => {
              api.getMenu().each(Highlighting.highlightFirst);
            }, item => {
              redirectKeyToItem(item, e);
            });
            e.preventDefault();
            e.stopImmediatePropagation();
          } else if (keyCode === 37 || keyCode === 38 || keyCode === 39) {
            getItem().each(item => {
              redirectKeyToItem(item, e);
              e.preventDefault();
              e.stopImmediatePropagation();
            });
          }
        } else {
          if (keyCode === 13 || keyCode === 38 || keyCode === 40) {
            api.cancelIfNecessary();
          }
        }
      });
      editor.on('NodeChange', e => {
        if (api.isActive() && !api.isProcessingAction() && detect(SugarElement.fromDom(e.element)).isNone()) {
          api.cancelIfNecessary();
        }
      });
    };
    const AutocompleterEditorEvents = { setup: setup$e };

    var ItemResponse;
    (function (ItemResponse) {
      ItemResponse[ItemResponse['CLOSE_ON_EXECUTE'] = 0] = 'CLOSE_ON_EXECUTE';
      ItemResponse[ItemResponse['BUBBLE_TO_SANDBOX'] = 1] = 'BUBBLE_TO_SANDBOX';
    }(ItemResponse || (ItemResponse = {})));
    var ItemResponse$1 = ItemResponse;

    const navClass = 'tox-menu-nav__js';
    const selectableClass = 'tox-collection__item';
    const colorClass = 'tox-swatch';
    const presetClasses = {
      normal: navClass,
      color: colorClass
    };
    const tickedClass = 'tox-collection__item--enabled';
    const groupHeadingClass = 'tox-collection__group-heading';
    const iconClass = 'tox-collection__item-icon';
    const textClass = 'tox-collection__item-label';
    const accessoryClass = 'tox-collection__item-accessory';
    const caretClass = 'tox-collection__item-caret';
    const checkmarkClass = 'tox-collection__item-checkmark';
    const activeClass = 'tox-collection__item--active';
    const containerClass = 'tox-collection__item-container';
    const containerColumnClass = 'tox-collection__item-container--column';
    const containerRowClass = 'tox-collection__item-container--row';
    const containerAlignRightClass = 'tox-collection__item-container--align-right';
    const containerAlignLeftClass = 'tox-collection__item-container--align-left';
    const containerValignTopClass = 'tox-collection__item-container--valign-top';
    const containerValignMiddleClass = 'tox-collection__item-container--valign-middle';
    const containerValignBottomClass = 'tox-collection__item-container--valign-bottom';
    const classForPreset = presets => get$g(presetClasses, presets).getOr(navClass);

    const forMenu = presets => {
      if (presets === 'color') {
        return 'tox-swatches';
      } else {
        return 'tox-menu';
      }
    };
    const classes = presets => ({
      backgroundMenu: 'tox-background-menu',
      selectedMenu: 'tox-selected-menu',
      selectedItem: 'tox-collection__item--active',
      hasIcons: 'tox-menu--has-icons',
      menu: forMenu(presets),
      tieredMenu: 'tox-tiered-menu'
    });

    const markers = presets => {
      const menuClasses = classes(presets);
      return {
        backgroundMenu: menuClasses.backgroundMenu,
        selectedMenu: menuClasses.selectedMenu,
        menu: menuClasses.menu,
        selectedItem: menuClasses.selectedItem,
        item: classForPreset(presets)
      };
    };
    const dom$1 = (hasIcons, columns, presets) => {
      const menuClasses = classes(presets);
      return {
        tag: 'div',
        classes: flatten([
          [
            menuClasses.menu,
            `tox-menu-${ columns }-column`
          ],
          hasIcons ? [menuClasses.hasIcons] : []
        ])
      };
    };
    const components = [Menu.parts.items({})];
    const part = (hasIcons, columns, presets) => {
      const menuClasses = classes(presets);
      const d = {
        tag: 'div',
        classes: flatten([[menuClasses.tieredMenu]])
      };
      return {
        dom: d,
        markers: markers(presets)
      };
    };

    const schema$l = constant$1([
      option$3('data'),
      defaulted('inputAttributes', {}),
      defaulted('inputStyles', {}),
      defaulted('tag', 'input'),
      defaulted('inputClasses', []),
      onHandler('onSetValue'),
      defaulted('styles', {}),
      defaulted('eventOrder', {}),
      field('inputBehaviours', [
        Representing,
        Focusing
      ]),
      defaulted('selectOnFocus', true)
    ]);
    const focusBehaviours = detail => derive$1([Focusing.config({
        onFocus: !detail.selectOnFocus ? noop : component => {
          const input = component.element;
          const value = get$6(input);
          input.dom.setSelectionRange(0, value.length);
        }
      })]);
    const behaviours = detail => ({
      ...focusBehaviours(detail),
      ...augment(detail.inputBehaviours, [Representing.config({
          store: {
            mode: 'manual',
            ...detail.data.map(data => ({ initialValue: data })).getOr({}),
            getValue: input => {
              return get$6(input.element);
            },
            setValue: (input, data) => {
              const current = get$6(input.element);
              if (current !== data) {
                set$5(input.element, data);
              }
            }
          },
          onSetValue: detail.onSetValue
        })])
    });
    const dom = detail => ({
      tag: detail.tag,
      attributes: {
        type: 'text',
        ...detail.inputAttributes
      },
      styles: detail.inputStyles,
      classes: detail.inputClasses
    });

    const factory$j = (detail, _spec) => ({
      uid: detail.uid,
      dom: dom(detail),
      components: [],
      behaviours: behaviours(detail),
      eventOrder: detail.eventOrder
    });
    const Input = single({
      name: 'Input',
      configFields: schema$l(),
      factory: factory$j
    });

    const refetchTriggerEvent = generate$6('refetch-trigger-event');
    const redirectMenuItemInteractionEvent = generate$6('redirect-menu-item-interaction');

    const menuSearcherClass = 'tox-menu__searcher';
    const findWithinSandbox = sandboxComp => {
      return descendant(sandboxComp.element, `.${ menuSearcherClass }`).bind(inputElem => sandboxComp.getSystem().getByDom(inputElem).toOptional());
    };
    const findWithinMenu = findWithinSandbox;
    const restoreState = (inputComp, searcherState) => {
      Representing.setValue(inputComp, searcherState.fetchPattern);
      inputComp.element.dom.selectionStart = searcherState.selectionStart;
      inputComp.element.dom.selectionEnd = searcherState.selectionEnd;
    };
    const saveState = inputComp => {
      const fetchPattern = Representing.getValue(inputComp);
      const selectionStart = inputComp.element.dom.selectionStart;
      const selectionEnd = inputComp.element.dom.selectionEnd;
      return {
        fetchPattern,
        selectionStart,
        selectionEnd
      };
    };
    const setActiveDescendant = (inputComp, active) => {
      getOpt(active.element, 'id').each(id => set$9(inputComp.element, 'aria-activedescendant', id));
    };
    const renderMenuSearcher = spec => {
      const handleByBrowser = (comp, se) => {
        se.cut();
        return Optional.none();
      };
      const handleByHighlightedItem = (comp, se) => {
        const eventData = {
          interactionEvent: se.event,
          eventType: se.event.raw.type
        };
        emitWith(comp, redirectMenuItemInteractionEvent, eventData);
        return Optional.some(true);
      };
      const customSearcherEventsName = 'searcher-events';
      return {
        dom: {
          tag: 'div',
          classes: [selectableClass]
        },
        components: [Input.sketch({
            inputClasses: [
              menuSearcherClass,
              'tox-textfield'
            ],
            inputAttributes: {
              ...spec.placeholder.map(placeholder => ({ placeholder: spec.i18n(placeholder) })).getOr({}),
              'type': 'search',
              'aria-autocomplete': 'list'
            },
            inputBehaviours: derive$1([
              config(customSearcherEventsName, [
                run$1(input(), inputComp => {
                  emit(inputComp, refetchTriggerEvent);
                }),
                run$1(keydown(), (inputComp, se) => {
                  if (se.event.raw.key === 'Escape') {
                    se.stop();
                  }
                })
              ]),
              Keying.config({
                mode: 'special',
                onLeft: handleByBrowser,
                onRight: handleByBrowser,
                onSpace: handleByBrowser,
                onEnter: handleByHighlightedItem,
                onEscape: handleByHighlightedItem,
                onUp: handleByHighlightedItem,
                onDown: handleByHighlightedItem
              })
            ]),
            eventOrder: {
              keydown: [
                customSearcherEventsName,
                Keying.name()
              ]
            }
          })]
      };
    };

    const searchResultsClass = 'tox-collection--results__js';
    const augmentWithAria = item => {
      var _a;
      if (item.dom) {
        return {
          ...item,
          dom: {
            ...item.dom,
            attributes: {
              ...(_a = item.dom.attributes) !== null && _a !== void 0 ? _a : {},
              'id': generate$6('aria-item-search-result-id'),
              'aria-selected': 'false'
            }
          }
        };
      } else {
        return item;
      }
    };

    const chunk = (rowDom, numColumns) => items => {
      const chunks = chunk$1(items, numColumns);
      return map$2(chunks, c => ({
        dom: rowDom,
        components: c
      }));
    };
    const forSwatch = columns => ({
      dom: {
        tag: 'div',
        classes: [
          'tox-menu',
          'tox-swatches-menu'
        ]
      },
      components: [{
          dom: {
            tag: 'div',
            classes: ['tox-swatches']
          },
          components: [Menu.parts.items({
              preprocess: columns !== 'auto' ? chunk({
                tag: 'div',
                classes: ['tox-swatches__row']
              }, columns) : identity
            })]
        }]
    });
    const forToolbar = columns => ({
      dom: {
        tag: 'div',
        classes: [
          'tox-menu',
          'tox-collection',
          'tox-collection--toolbar',
          'tox-collection--toolbar-lg'
        ]
      },
      components: [Menu.parts.items({
          preprocess: chunk({
            tag: 'div',
            classes: ['tox-collection__group']
          }, columns)
        })]
    });
    const preprocessCollection = (items, isSeparator) => {
      const allSplits = [];
      let currentSplit = [];
      each$1(items, (item, i) => {
        if (isSeparator(item, i)) {
          if (currentSplit.length > 0) {
            allSplits.push(currentSplit);
          }
          currentSplit = [];
          if (has$2(item.dom, 'innerHtml') || item.components && item.components.length > 0) {
            currentSplit.push(item);
          }
        } else {
          currentSplit.push(item);
        }
      });
      if (currentSplit.length > 0) {
        allSplits.push(currentSplit);
      }
      return map$2(allSplits, s => ({
        dom: {
          tag: 'div',
          classes: ['tox-collection__group']
        },
        components: s
      }));
    };
    const insertItemsPlaceholder = (columns, initItems, onItem) => {
      return Menu.parts.items({
        preprocess: rawItems => {
          const enrichedItems = map$2(rawItems, onItem);
          if (columns !== 'auto' && columns > 1) {
            return chunk({
              tag: 'div',
              classes: ['tox-collection__group']
            }, columns)(enrichedItems);
          } else {
            return preprocessCollection(enrichedItems, (_item, i) => initItems[i].type === 'separator');
          }
        }
      });
    };
    const forCollection = (columns, initItems, _hasIcons = true) => ({
      dom: {
        tag: 'div',
        classes: [
          'tox-menu',
          'tox-collection'
        ].concat(columns === 1 ? ['tox-collection--list'] : ['tox-collection--grid'])
      },
      components: [insertItemsPlaceholder(columns, initItems, identity)]
    });
    const forCollectionWithSearchResults = (columns, initItems, _hasIcons = true) => {
      const ariaControlsSearchResults = generate$6('aria-controls-search-results');
      return {
        dom: {
          tag: 'div',
          classes: [
            'tox-menu',
            'tox-collection',
            searchResultsClass
          ].concat(columns === 1 ? ['tox-collection--list'] : ['tox-collection--grid']),
          attributes: { id: ariaControlsSearchResults }
        },
        components: [insertItemsPlaceholder(columns, initItems, augmentWithAria)]
      };
    };
    const forCollectionWithSearchField = (columns, initItems, searchField) => {
      const ariaControlsSearchResults = generate$6('aria-controls-search-results');
      return {
        dom: {
          tag: 'div',
          classes: [
            'tox-menu',
            'tox-collection'
          ].concat(columns === 1 ? ['tox-collection--list'] : ['tox-collection--grid'])
        },
        components: [
          renderMenuSearcher({
            i18n: global$8.translate,
            placeholder: searchField.placeholder
          }),
          {
            dom: {
              tag: 'div',
              classes: [
                ...columns === 1 ? ['tox-collection--list'] : ['tox-collection--grid'],
                searchResultsClass
              ],
              attributes: { id: ariaControlsSearchResults }
            },
            components: [insertItemsPlaceholder(columns, initItems, augmentWithAria)]
          }
        ]
      };
    };
    const forHorizontalCollection = (initItems, _hasIcons = true) => ({
      dom: {
        tag: 'div',
        classes: [
          'tox-collection',
          'tox-collection--horizontal'
        ]
      },
      components: [Menu.parts.items({ preprocess: items => preprocessCollection(items, (_item, i) => initItems[i].type === 'separator') })]
    });

    const menuHasIcons = xs => exists(xs, item => 'icon' in item && item.icon !== undefined);
    const handleError = error => {
      console.error(formatError(error));
      console.log(error);
      return Optional.none();
    };
    const createHorizontalPartialMenuWithAlloyItems = (value, _hasIcons, items, _columns, _menuLayout) => {
      const structure = forHorizontalCollection(items);
      return {
        value,
        dom: structure.dom,
        components: structure.components,
        items
      };
    };
    const createPartialMenuWithAlloyItems = (value, hasIcons, items, columns, menuLayout) => {
      const getNormalStructure = () => {
        if (menuLayout.menuType !== 'searchable') {
          return forCollection(columns, items);
        } else {
          return menuLayout.searchMode.searchMode === 'search-with-field' ? forCollectionWithSearchField(columns, items, menuLayout.searchMode) : forCollectionWithSearchResults(columns, items);
        }
      };
      if (menuLayout.menuType === 'color') {
        const structure = forSwatch(columns);
        return {
          value,
          dom: structure.dom,
          components: structure.components,
          items
        };
      } else if (menuLayout.menuType === 'normal' && columns === 'auto') {
        const structure = forCollection(columns, items);
        return {
          value,
          dom: structure.dom,
          components: structure.components,
          items
        };
      } else if (menuLayout.menuType === 'normal' || menuLayout.menuType === 'searchable') {
        const structure = getNormalStructure();
        return {
          value,
          dom: structure.dom,
          components: structure.components,
          items
        };
      } else if (menuLayout.menuType === 'listpreview' && columns !== 'auto') {
        const structure = forToolbar(columns);
        return {
          value,
          dom: structure.dom,
          components: structure.components,
          items
        };
      } else {
        return {
          value,
          dom: dom$1(hasIcons, columns, menuLayout.menuType),
          components: components,
          items
        };
      }
    };

    const type = requiredString('type');
    const name$1 = requiredString('name');
    const label = requiredString('label');
    const text = requiredString('text');
    const title = requiredString('title');
    const icon = requiredString('icon');
    const value$1 = requiredString('value');
    const fetch$1 = requiredFunction('fetch');
    const getSubmenuItems = requiredFunction('getSubmenuItems');
    const onAction = requiredFunction('onAction');
    const onItemAction = requiredFunction('onItemAction');
    const onSetup = defaultedFunction('onSetup', () => noop);
    const optionalName = optionString('name');
    const optionalText = optionString('text');
    const optionalIcon = optionString('icon');
    const optionalTooltip = optionString('tooltip');
    const optionalLabel = optionString('label');
    const optionalShortcut = optionString('shortcut');
    const optionalSelect = optionFunction('select');
    const active = defaultedBoolean('active', false);
    const borderless = defaultedBoolean('borderless', false);
    const enabled = defaultedBoolean('enabled', true);
    const primary = defaultedBoolean('primary', false);
    const defaultedColumns = num => defaulted('columns', num);
    const defaultedMeta = defaulted('meta', {});
    const defaultedOnAction = defaultedFunction('onAction', noop);
    const defaultedType = type => defaultedString('type', type);
    const generatedName = namePrefix => field$1('name', 'name', defaultedThunk(() => generate$6(`${ namePrefix }-name`)), string);
    const generatedValue = valuePrefix => field$1('value', 'value', defaultedThunk(() => generate$6(`${ valuePrefix }-value`)), anyValue());

    const separatorMenuItemSchema = objOf([
      type,
      optionalText
    ]);
    const createSeparatorMenuItem = spec => asRaw('separatormenuitem', separatorMenuItemSchema, spec);

    const autocompleterItemSchema = objOf([
      defaultedType('autocompleteitem'),
      active,
      enabled,
      defaultedMeta,
      value$1,
      optionalText,
      optionalIcon
    ]);
    const createSeparatorItem = spec => asRaw('Autocompleter.Separator', separatorMenuItemSchema, spec);
    const createAutocompleterItem = spec => asRaw('Autocompleter.Item', autocompleterItemSchema, spec);

    const baseToolbarButtonFields = [
      enabled,
      optionalTooltip,
      optionalIcon,
      optionalText,
      onSetup
    ];
    const toolbarButtonSchema = objOf([
      type,
      onAction
    ].concat(baseToolbarButtonFields));
    const createToolbarButton = spec => asRaw('toolbarbutton', toolbarButtonSchema, spec);

    const baseToolbarToggleButtonFields = [active].concat(baseToolbarButtonFields);
    const toggleButtonSchema = objOf(baseToolbarToggleButtonFields.concat([
      type,
      onAction
    ]));
    const createToggleButton = spec => asRaw('ToggleButton', toggleButtonSchema, spec);

    const contextBarFields = [
      defaultedFunction('predicate', never),
      defaultedStringEnum('scope', 'node', [
        'node',
        'editor'
      ]),
      defaultedStringEnum('position', 'selection', [
        'node',
        'selection',
        'line'
      ])
    ];

    const contextButtonFields = baseToolbarButtonFields.concat([
      defaultedType('contextformbutton'),
      primary,
      onAction,
      customField('original', identity)
    ]);
    const contextToggleButtonFields = baseToolbarToggleButtonFields.concat([
      defaultedType('contextformbutton'),
      primary,
      onAction,
      customField('original', identity)
    ]);
    const launchButtonFields = baseToolbarButtonFields.concat([defaultedType('contextformbutton')]);
    const launchToggleButtonFields = baseToolbarToggleButtonFields.concat([defaultedType('contextformtogglebutton')]);
    const toggleOrNormal = choose$1('type', {
      contextformbutton: contextButtonFields,
      contextformtogglebutton: contextToggleButtonFields
    });
    const contextFormSchema = objOf([
      defaultedType('contextform'),
      defaultedFunction('initValue', constant$1('')),
      optionalLabel,
      requiredArrayOf('commands', toggleOrNormal),
      optionOf('launch', choose$1('type', {
        contextformbutton: launchButtonFields,
        contextformtogglebutton: launchToggleButtonFields
      }))
    ].concat(contextBarFields));
    const createContextForm = spec => asRaw('ContextForm', contextFormSchema, spec);

    const contextToolbarSchema = objOf([
      defaultedType('contexttoolbar'),
      requiredString('items')
    ].concat(contextBarFields));
    const createContextToolbar = spec => asRaw('ContextToolbar', contextToolbarSchema, spec);

    const cardImageFields = [
      type,
      requiredString('src'),
      optionString('alt'),
      defaultedArrayOf('classes', [], string)
    ];
    const cardImageSchema = objOf(cardImageFields);

    const cardTextFields = [
      type,
      text,
      optionalName,
      defaultedArrayOf('classes', ['tox-collection__item-label'], string)
    ];
    const cardTextSchema = objOf(cardTextFields);

    const itemSchema$1 = valueThunk(() => choose$2('type', {
      cardimage: cardImageSchema,
      cardtext: cardTextSchema,
      cardcontainer: cardContainerSchema
    }));
    const cardContainerSchema = objOf([
      type,
      defaultedString('direction', 'horizontal'),
      defaultedString('align', 'left'),
      defaultedString('valign', 'middle'),
      requiredArrayOf('items', itemSchema$1)
    ]);

    const commonMenuItemFields = [
      enabled,
      optionalText,
      optionalShortcut,
      generatedValue('menuitem'),
      defaultedMeta
    ];

    const cardMenuItemSchema = objOf([
      type,
      optionalLabel,
      requiredArrayOf('items', itemSchema$1),
      onSetup,
      defaultedOnAction
    ].concat(commonMenuItemFields));
    const createCardMenuItem = spec => asRaw('cardmenuitem', cardMenuItemSchema, spec);

    const choiceMenuItemSchema = objOf([
      type,
      active,
      optionalIcon
    ].concat(commonMenuItemFields));
    const createChoiceMenuItem = spec => asRaw('choicemenuitem', choiceMenuItemSchema, spec);

    const baseFields = [
      type,
      requiredString('fancytype'),
      defaultedOnAction
    ];
    const insertTableFields = [defaulted('initData', {})].concat(baseFields);
    const colorSwatchFields = [defaultedObjOf('initData', {}, [
        defaultedBoolean('allowCustomColors', true),
        optionArrayOf('colors', anyValue())
      ])].concat(baseFields);
    const fancyMenuItemSchema = choose$1('fancytype', {
      inserttable: insertTableFields,
      colorswatch: colorSwatchFields
    });
    const createFancyMenuItem = spec => asRaw('fancymenuitem', fancyMenuItemSchema, spec);

    const menuItemSchema = objOf([
      type,
      onSetup,
      defaultedOnAction,
      optionalIcon
    ].concat(commonMenuItemFields));
    const createMenuItem = spec => asRaw('menuitem', menuItemSchema, spec);

    const nestedMenuItemSchema = objOf([
      type,
      getSubmenuItems,
      onSetup,
      optionalIcon
    ].concat(commonMenuItemFields));
    const createNestedMenuItem = spec => asRaw('nestedmenuitem', nestedMenuItemSchema, spec);

    const toggleMenuItemSchema = objOf([
      type,
      optionalIcon,
      active,
      onSetup,
      onAction
    ].concat(commonMenuItemFields));
    const createToggleMenuItem = spec => asRaw('togglemenuitem', toggleMenuItemSchema, spec);

    const detectSize = (comp, margin, selectorClass) => {
      const descendants$1 = descendants(comp.element, '.' + selectorClass);
      if (descendants$1.length > 0) {
        const columnLength = findIndex$1(descendants$1, c => {
          const thisTop = c.dom.getBoundingClientRect().top;
          const cTop = descendants$1[0].dom.getBoundingClientRect().top;
          return Math.abs(thisTop - cTop) > margin;
        }).getOr(descendants$1.length);
        return Optional.some({
          numColumns: columnLength,
          numRows: Math.ceil(descendants$1.length / columnLength)
        });
      } else {
        return Optional.none();
      }
    };

    const namedEvents = (name, handlers) => derive$1([config(name, handlers)]);
    const unnamedEvents = handlers => namedEvents(generate$6('unnamed-events'), handlers);
    const SimpleBehaviours = {
      namedEvents,
      unnamedEvents
    };

    const ExclusivityChannel = generate$6('tooltip.exclusive');
    const ShowTooltipEvent = generate$6('tooltip.show');
    const HideTooltipEvent = generate$6('tooltip.hide');

    const hideAllExclusive = (component, _tConfig, _tState) => {
      component.getSystem().broadcastOn([ExclusivityChannel], {});
    };
    const setComponents = (component, tConfig, tState, specs) => {
      tState.getTooltip().each(tooltip => {
        if (tooltip.getSystem().isConnected()) {
          Replacing.set(tooltip, specs);
        }
      });
    };

    var TooltippingApis = /*#__PURE__*/Object.freeze({
        __proto__: null,
        hideAllExclusive: hideAllExclusive,
        setComponents: setComponents
    });

    const events$9 = (tooltipConfig, state) => {
      const hide = comp => {
        state.getTooltip().each(p => {
          detach(p);
          tooltipConfig.onHide(comp, p);
          state.clearTooltip();
        });
        state.clearTimer();
      };
      const show = comp => {
        if (!state.isShowing()) {
          hideAllExclusive(comp);
          const sink = tooltipConfig.lazySink(comp).getOrDie();
          const popup = comp.getSystem().build({
            dom: tooltipConfig.tooltipDom,
            components: tooltipConfig.tooltipComponents,
            events: derive$2(tooltipConfig.mode === 'normal' ? [
              run$1(mouseover(), _ => {
                emit(comp, ShowTooltipEvent);
              }),
              run$1(mouseout(), _ => {
                emit(comp, HideTooltipEvent);
              })
            ] : []),
            behaviours: derive$1([Replacing.config({})])
          });
          state.setTooltip(popup);
          attach(sink, popup);
          tooltipConfig.onShow(comp, popup);
          Positioning.position(sink, popup, { anchor: tooltipConfig.anchor(comp) });
        }
      };
      return derive$2(flatten([
        [
          run$1(ShowTooltipEvent, comp => {
            state.resetTimer(() => {
              show(comp);
            }, tooltipConfig.delay);
          }),
          run$1(HideTooltipEvent, comp => {
            state.resetTimer(() => {
              hide(comp);
            }, tooltipConfig.delay);
          }),
          run$1(receive(), (comp, message) => {
            const receivingData = message;
            if (!receivingData.universal) {
              if (contains$2(receivingData.channels, ExclusivityChannel)) {
                hide(comp);
              }
            }
          }),
          runOnDetached(comp => {
            hide(comp);
          })
        ],
        tooltipConfig.mode === 'normal' ? [
          run$1(focusin(), comp => {
            emit(comp, ShowTooltipEvent);
          }),
          run$1(postBlur(), comp => {
            emit(comp, HideTooltipEvent);
          }),
          run$1(mouseover(), comp => {
            emit(comp, ShowTooltipEvent);
          }),
          run$1(mouseout(), comp => {
            emit(comp, HideTooltipEvent);
          })
        ] : [
          run$1(highlight$1(), (comp, _se) => {
            emit(comp, ShowTooltipEvent);
          }),
          run$1(dehighlight$1(), comp => {
            emit(comp, HideTooltipEvent);
          })
        ]
      ]));
    };

    var ActiveTooltipping = /*#__PURE__*/Object.freeze({
        __proto__: null,
        events: events$9
    });

    var TooltippingSchema = [
      required$1('lazySink'),
      required$1('tooltipDom'),
      defaulted('exclusive', true),
      defaulted('tooltipComponents', []),
      defaulted('delay', 300),
      defaultedStringEnum('mode', 'normal', [
        'normal',
        'follow-highlight'
      ]),
      defaulted('anchor', comp => ({
        type: 'hotspot',
        hotspot: comp,
        layouts: {
          onLtr: constant$1([
            south$2,
            north$2,
            southeast$2,
            northeast$2,
            southwest$2,
            northwest$2
          ]),
          onRtl: constant$1([
            south$2,
            north$2,
            southeast$2,
            northeast$2,
            southwest$2,
            northwest$2
          ])
        }
      })),
      onHandler('onHide'),
      onHandler('onShow')
    ];

    const init$b = () => {
      const timer = value$2();
      const popup = value$2();
      const clearTimer = () => {
        timer.on(clearTimeout);
      };
      const resetTimer = (f, delay) => {
        clearTimer();
        timer.set(setTimeout(f, delay));
      };
      const readState = constant$1('not-implemented');
      return nu$8({
        getTooltip: popup.get,
        isShowing: popup.isSet,
        setTooltip: popup.set,
        clearTooltip: popup.clear,
        clearTimer,
        resetTimer,
        readState
      });
    };

    var TooltippingState = /*#__PURE__*/Object.freeze({
        __proto__: null,
        init: init$b
    });

    const Tooltipping = create$3({
      fields: TooltippingSchema,
      name: 'tooltipping',
      active: ActiveTooltipping,
      state: TooltippingState,
      apis: TooltippingApis
    });

    const escape = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const ReadOnlyChannel = 'silver.readonly';
    const ReadOnlyDataSchema = objOf([requiredBoolean('readonly')]);
    const broadcastReadonly = (uiComponents, readonly) => {
      const outerContainer = uiComponents.outerContainer;
      const target = outerContainer.element;
      if (readonly) {
        uiComponents.mothership.broadcastOn([dismissPopups()], { target });
        uiComponents.uiMothership.broadcastOn([dismissPopups()], { target });
      }
      uiComponents.mothership.broadcastOn([ReadOnlyChannel], { readonly });
      uiComponents.uiMothership.broadcastOn([ReadOnlyChannel], { readonly });
    };
    const setupReadonlyModeSwitch = (editor, uiComponents) => {
      editor.on('init', () => {
        if (editor.mode.isReadOnly()) {
          broadcastReadonly(uiComponents, true);
        }
      });
      editor.on('SwitchMode', () => broadcastReadonly(uiComponents, editor.mode.isReadOnly()));
      if (isReadOnly(editor)) {
        editor.mode.set('readonly');
      }
    };
    const receivingConfig = () => Receiving.config({
      channels: {
        [ReadOnlyChannel]: {
          schema: ReadOnlyDataSchema,
          onReceive: (comp, data) => {
            Disabling.set(comp, data.readonly);
          }
        }
      }
    });

    const item = disabled => Disabling.config({
      disabled,
      disableClass: 'tox-collection__item--state-disabled'
    });
    const button = disabled => Disabling.config({ disabled });
    const splitButton = disabled => Disabling.config({
      disabled,
      disableClass: 'tox-tbtn--disabled'
    });
    const toolbarButton = disabled => Disabling.config({
      disabled,
      disableClass: 'tox-tbtn--disabled',
      useNative: false
    });
    const DisablingConfigs = {
      item,
      button,
      splitButton,
      toolbarButton
    };

    const runWithApi = (info, comp) => {
      const api = info.getApi(comp);
      return f => {
        f(api);
      };
    };
    const onControlAttached = (info, editorOffCell) => runOnAttached(comp => {
      const run = runWithApi(info, comp);
      run(api => {
        const onDestroy = info.onSetup(api);
        if (isFunction(onDestroy)) {
          editorOffCell.set(onDestroy);
        }
      });
    });
    const onControlDetached = (getApi, editorOffCell) => runOnDetached(comp => runWithApi(getApi, comp)(editorOffCell.get()));

    const onMenuItemExecute = (info, itemResponse) => runOnExecute$1((comp, simulatedEvent) => {
      runWithApi(info, comp)(info.onAction);
      if (!info.triggersSubmenu && itemResponse === ItemResponse$1.CLOSE_ON_EXECUTE) {
        if (comp.getSystem().isConnected()) {
          emit(comp, sandboxClose());
        }
        simulatedEvent.stop();
      }
    });
    const menuItemEventOrder = {
      [execute$5()]: [
        'disabling',
        'alloy.base.behaviour',
        'toggling',
        'item-events'
      ]
    };

    const componentRenderPipeline = cat;
    const renderCommonItem = (spec, structure, itemResponse, providersBackstage) => {
      const editorOffCell = Cell(noop);
      return {
        type: 'item',
        dom: structure.dom,
        components: componentRenderPipeline(structure.optComponents),
        data: spec.data,
        eventOrder: menuItemEventOrder,
        hasSubmenu: spec.triggersSubmenu,
        itemBehaviours: derive$1([
          config('item-events', [
            onMenuItemExecute(spec, itemResponse),
            onControlAttached(spec, editorOffCell),
            onControlDetached(spec, editorOffCell)
          ]),
          DisablingConfigs.item(() => !spec.enabled || providersBackstage.isDisabled()),
          receivingConfig(),
          Replacing.config({})
        ].concat(spec.itemBehaviours))
      };
    };
    const buildData = source => ({
      value: source.value,
      meta: {
        text: source.text.getOr(''),
        ...source.meta
      }
    });

    const convertText = source => {
      const isMac = global$5.os.isMacOS() || global$5.os.isiOS();
      const mac = {
        alt: '\u2325',
        ctrl: '\u2303',
        shift: '\u21E7',
        meta: '\u2318',
        access: '\u2303\u2325'
      };
      const other = {
        meta: 'Ctrl',
        access: 'Shift+Alt'
      };
      const replace = isMac ? mac : other;
      const shortcut = source.split('+');
      const updated = map$2(shortcut, segment => {
        const search = segment.toLowerCase().trim();
        return has$2(replace, search) ? replace[search] : segment;
      });
      return isMac ? updated.join('') : updated.join('+');
    };

    const renderIcon$1 = (name, icons, classes = [iconClass]) => render$3(name, {
      tag: 'div',
      classes
    }, icons);
    const renderText = text => ({
      dom: {
        tag: 'div',
        classes: [textClass]
      },
      components: [text$1(global$8.translate(text))]
    });
    const renderHtml = (html, classes) => ({
      dom: {
        tag: 'div',
        classes,
        innerHtml: html
      }
    });
    const renderStyledText = (style, text) => ({
      dom: {
        tag: 'div',
        classes: [textClass]
      },
      components: [{
          dom: {
            tag: style.tag,
            styles: style.styles
          },
          components: [text$1(global$8.translate(text))]
        }]
    });
    const renderShortcut = shortcut => ({
      dom: {
        tag: 'div',
        classes: [accessoryClass]
      },
      components: [text$1(convertText(shortcut))]
    });
    const renderCheckmark = icons => renderIcon$1('checkmark', icons, [checkmarkClass]);
    const renderSubmenuCaret = icons => renderIcon$1('chevron-right', icons, [caretClass]);
    const renderDownwardsCaret = icons => renderIcon$1('chevron-down', icons, [caretClass]);
    const renderContainer = (container, components) => {
      const directionClass = container.direction === 'vertical' ? containerColumnClass : containerRowClass;
      const alignClass = container.align === 'left' ? containerAlignLeftClass : containerAlignRightClass;
      const getValignClass = () => {
        switch (container.valign) {
        case 'top':
          return containerValignTopClass;
        case 'middle':
          return containerValignMiddleClass;
        case 'bottom':
          return containerValignBottomClass;
        }
      };
      return {
        dom: {
          tag: 'div',
          classes: [
            containerClass,
            directionClass,
            alignClass,
            getValignClass()
          ]
        },
        components
      };
    };
    const renderImage = (src, classes, alt) => ({
      dom: {
        tag: 'img',
        classes,
        attributes: {
          src,
          alt: alt.getOr('')
        }
      }
    });

    const renderColorStructure = (item, providerBackstage, fallbackIcon) => {
      const colorPickerCommand = 'custom';
      const removeColorCommand = 'remove';
      const itemText = item.ariaLabel;
      const itemValue = item.value;
      const iconSvg = item.iconContent.map(name => getOr(name, providerBackstage.icons, fallbackIcon));
      const getDom = () => {
        const common = colorClass;
        const icon = iconSvg.getOr('');
        const attributes = itemText.map(text => ({ title: providerBackstage.translate(text) })).getOr({});
        const baseDom = {
          tag: 'div',
          attributes,
          classes: [common]
        };
        if (itemValue === colorPickerCommand) {
          return {
            ...baseDom,
            tag: 'button',
            classes: [
              ...baseDom.classes,
              'tox-swatches__picker-btn'
            ],
            innerHtml: icon
          };
        } else if (itemValue === removeColorCommand) {
          return {
            ...baseDom,
            classes: [
              ...baseDom.classes,
              'tox-swatch--remove'
            ],
            innerHtml: icon
          };
        } else if (isNonNullable(itemValue)) {
          return {
            ...baseDom,
            attributes: {
              ...baseDom.attributes,
              'data-mce-color': itemValue
            },
            styles: { 'background-color': itemValue }
          };
        } else {
          return baseDom;
        }
      };
      return {
        dom: getDom(),
        optComponents: []
      };
    };
    const renderItemDomStructure = ariaLabel => {
      const domTitle = ariaLabel.map(label => ({ attributes: { title: global$8.translate(label) } })).getOr({});
      return {
        tag: 'div',
        classes: [
          navClass,
          selectableClass
        ],
        ...domTitle
      };
    };
    const renderNormalItemStructure = (info, providersBackstage, renderIcons, fallbackIcon) => {
      const iconSpec = {
        tag: 'div',
        classes: [iconClass]
      };
      const renderIcon = iconName => render$3(iconName, iconSpec, providersBackstage.icons, fallbackIcon);
      const renderEmptyIcon = () => Optional.some({ dom: iconSpec });
      const leftIcon = renderIcons ? info.iconContent.map(renderIcon).orThunk(renderEmptyIcon) : Optional.none();
      const checkmark = info.checkMark;
      const textRender = Optional.from(info.meta).fold(() => renderText, meta => has$2(meta, 'style') ? curry(renderStyledText, meta.style) : renderText);
      const content = info.htmlContent.fold(() => info.textContent.map(textRender), html => Optional.some(renderHtml(html, [textClass])));
      const menuItem = {
        dom: renderItemDomStructure(info.ariaLabel),
        optComponents: [
          leftIcon,
          content,
          info.shortcutContent.map(renderShortcut),
          checkmark,
          info.caret
        ]
      };
      return menuItem;
    };
    const renderItemStructure = (info, providersBackstage, renderIcons, fallbackIcon = Optional.none()) => {
      if (info.presets === 'color') {
        return renderColorStructure(info, providersBackstage, fallbackIcon);
      } else {
        return renderNormalItemStructure(info, providersBackstage, renderIcons, fallbackIcon);
      }
    };

    const tooltipBehaviour = (meta, sharedBackstage) => get$g(meta, 'tooltipWorker').map(tooltipWorker => [Tooltipping.config({
        lazySink: sharedBackstage.getSink,
        tooltipDom: {
          tag: 'div',
          classes: ['tox-tooltip-worker-container']
        },
        tooltipComponents: [],
        anchor: comp => ({
          type: 'submenu',
          item: comp,
          overrides: { maxHeightFunction: expandable$1 }
        }),
        mode: 'follow-highlight',
        onShow: (component, _tooltip) => {
          tooltipWorker(elm => {
            Tooltipping.setComponents(component, [external$1({ element: SugarElement.fromDom(elm) })]);
          });
        }
      })]).getOr([]);
    const encodeText = text => global$7.DOM.encode(text);
    const replaceText = (text, matchText) => {
      const translated = global$8.translate(text);
      const encoded = encodeText(translated);
      if (matchText.length > 0) {
        const escapedMatchRegex = new RegExp(escape(matchText), 'gi');
        return encoded.replace(escapedMatchRegex, match => `<span class="tox-autocompleter-highlight">${ match }</span>`);
      } else {
        return encoded;
      }
    };
    const renderAutocompleteItem = (spec, matchText, useText, presets, onItemValueHandler, itemResponse, sharedBackstage, renderIcons = true) => {
      const structure = renderItemStructure({
        presets,
        textContent: Optional.none(),
        htmlContent: useText ? spec.text.map(text => replaceText(text, matchText)) : Optional.none(),
        ariaLabel: spec.text,
        iconContent: spec.icon,
        shortcutContent: Optional.none(),
        checkMark: Optional.none(),
        caret: Optional.none(),
        value: spec.value
      }, sharedBackstage.providers, renderIcons, spec.icon);
      return renderCommonItem({
        data: buildData(spec),
        enabled: spec.enabled,
        getApi: constant$1({}),
        onAction: _api => onItemValueHandler(spec.value, spec.meta),
        onSetup: constant$1(noop),
        triggersSubmenu: false,
        itemBehaviours: tooltipBehaviour(spec.meta, sharedBackstage)
      }, structure, itemResponse, sharedBackstage.providers);
    };

    const render$2 = (items, extras) => map$2(items, item => {
      switch (item.type) {
      case 'cardcontainer':
        return renderContainer(item, render$2(item.items, extras));
      case 'cardimage':
        return renderImage(item.src, item.classes, item.alt);
      case 'cardtext':
        const shouldHighlight = item.name.exists(name => contains$2(extras.cardText.highlightOn, name));
        const matchText = shouldHighlight ? Optional.from(extras.cardText.matchText).getOr('') : '';
        return renderHtml(replaceText(item.text, matchText), item.classes);
      }
    });
    const renderCardMenuItem = (spec, itemResponse, sharedBackstage, extras) => {
      const getApi = component => ({
        isEnabled: () => !Disabling.isDisabled(component),
        setEnabled: state => {
          Disabling.set(component, !state);
          each$1(descendants(component.element, '*'), elm => {
            component.getSystem().getByDom(elm).each(comp => {
              if (comp.hasConfigured(Disabling)) {
                Disabling.set(comp, !state);
              }
            });
          });
        }
      });
      const structure = {
        dom: renderItemDomStructure(spec.label),
        optComponents: [Optional.some({
            dom: {
              tag: 'div',
              classes: [
                containerClass,
                containerRowClass
              ]
            },
            components: render$2(spec.items, extras)
          })]
      };
      return renderCommonItem({
        data: buildData({
          text: Optional.none(),
          ...spec
        }),
        enabled: spec.enabled,
        getApi,
        onAction: spec.onAction,
        onSetup: spec.onSetup,
        triggersSubmenu: false,
        itemBehaviours: Optional.from(extras.itemBehaviours).getOr([])
      }, structure, itemResponse, sharedBackstage.providers);
    };

    const renderChoiceItem = (spec, useText, presets, onItemValueHandler, isSelected, itemResponse, providersBackstage, renderIcons = true) => {
      const getApi = component => ({
        setActive: state => {
          Toggling.set(component, state);
        },
        isActive: () => Toggling.isOn(component),
        isEnabled: () => !Disabling.isDisabled(component),
        setEnabled: state => Disabling.set(component, !state)
      });
      const structure = renderItemStructure({
        presets,
        textContent: useText ? spec.text : Optional.none(),
        htmlContent: Optional.none(),
        ariaLabel: spec.text,
        iconContent: spec.icon,
        shortcutContent: useText ? spec.shortcut : Optional.none(),
        checkMark: useText ? Optional.some(renderCheckmark(providersBackstage.icons)) : Optional.none(),
        caret: Optional.none(),
        value: spec.value
      }, providersBackstage, renderIcons);
      return deepMerge(renderCommonItem({
        data: buildData(spec),
        enabled: spec.enabled,
        getApi,
        onAction: _api => onItemValueHandler(spec.value),
        onSetup: api => {
          api.setActive(isSelected);
          return noop;
        },
        triggersSubmenu: false,
        itemBehaviours: []
      }, structure, itemResponse, providersBackstage), {
        toggling: {
          toggleClass: tickedClass,
          toggleOnExecute: false,
          selected: spec.active,
          exclusive: true
        }
      });
    };

    const parts$f = generate$3(owner$2(), parts$h());

    const hexColour = value => ({ value });
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const longformRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
    const isHexString = hex => shorthandRegex.test(hex) || longformRegex.test(hex);
    const normalizeHex = hex => removeLeading(hex, '#').toUpperCase();
    const fromString$1 = hex => isHexString(hex) ? Optional.some({ value: normalizeHex(hex) }) : Optional.none();
    const getLongForm = hex => {
      const hexString = hex.value.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
      return { value: hexString };
    };
    const extractValues = hex => {
      const longForm = getLongForm(hex);
      const splitForm = longformRegex.exec(longForm.value);
      return splitForm === null ? [
        'FFFFFF',
        'FF',
        'FF',
        'FF'
      ] : splitForm;
    };
    const toHex = component => {
      const hex = component.toString(16);
      return (hex.length === 1 ? '0' + hex : hex).toUpperCase();
    };
    const fromRgba = rgbaColour => {
      const value = toHex(rgbaColour.red) + toHex(rgbaColour.green) + toHex(rgbaColour.blue);
      return hexColour(value);
    };

    const min = Math.min;
    const max = Math.max;
    const round$1 = Math.round;
    const rgbRegex = /^\s*rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)\s*$/i;
    const rgbaRegex = /^\s*rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d?(?:\.\d+)?)\s*\)\s*$/i;
    const rgbaColour = (red, green, blue, alpha) => ({
      red,
      green,
      blue,
      alpha
    });
    const isRgbaComponent = value => {
      const num = parseInt(value, 10);
      return num.toString() === value && num >= 0 && num <= 255;
    };
    const fromHsv = hsv => {
      let r;
      let g;
      let b;
      const hue = (hsv.hue || 0) % 360;
      let saturation = hsv.saturation / 100;
      let brightness = hsv.value / 100;
      saturation = max(0, min(saturation, 1));
      brightness = max(0, min(brightness, 1));
      if (saturation === 0) {
        r = g = b = round$1(255 * brightness);
        return rgbaColour(r, g, b, 1);
      }
      const side = hue / 60;
      const chroma = brightness * saturation;
      const x = chroma * (1 - Math.abs(side % 2 - 1));
      const match = brightness - chroma;
      switch (Math.floor(side)) {
      case 0:
        r = chroma;
        g = x;
        b = 0;
        break;
      case 1:
        r = x;
        g = chroma;
        b = 0;
        break;
      case 2:
        r = 0;
        g = chroma;
        b = x;
        break;
      case 3:
        r = 0;
        g = x;
        b = chroma;
        break;
      case 4:
        r = x;
        g = 0;
        b = chroma;
        break;
      case 5:
        r = chroma;
        g = 0;
        b = x;
        break;
      default:
        r = g = b = 0;
      }
      r = round$1(255 * (r + match));
      g = round$1(255 * (g + match));
      b = round$1(255 * (b + match));
      return rgbaColour(r, g, b, 1);
    };
    const fromHex = hexColour => {
      const result = extractValues(hexColour);
      const red = parseInt(result[1], 16);
      const green = parseInt(result[2], 16);
      const blue = parseInt(result[3], 16);
      return rgbaColour(red, green, blue, 1);
    };
    const fromStringValues = (red, green, blue, alpha) => {
      const r = parseInt(red, 10);
      const g = parseInt(green, 10);
      const b = parseInt(blue, 10);
      const a = parseFloat(alpha);
      return rgbaColour(r, g, b, a);
    };
    const fromString = rgbaString => {
      if (rgbaString === 'transparent') {
        return Optional.some(rgbaColour(0, 0, 0, 0));
      }
      const rgbMatch = rgbRegex.exec(rgbaString);
      if (rgbMatch !== null) {
        return Optional.some(fromStringValues(rgbMatch[1], rgbMatch[2], rgbMatch[3], '1'));
      }
      const rgbaMatch = rgbaRegex.exec(rgbaString);
      if (rgbaMatch !== null) {
        return Optional.some(fromStringValues(rgbaMatch[1], rgbaMatch[2], rgbaMatch[3], rgbaMatch[4]));
      }
      return Optional.none();
    };
    const toString = rgba => `rgba(${ rgba.red },${ rgba.green },${ rgba.blue },${ rgba.alpha })`;
    const red = rgbaColour(255, 0, 0, 1);

    const fireSkinLoaded$1 = editor => {
      editor.dispatch('SkinLoaded');
    };
    const fireSkinLoadError$1 = (editor, error) => {
      editor.dispatch('SkinLoadError', error);
    };
    const fireResizeEditor = editor => {
      editor.dispatch('ResizeEditor');
    };
    const fireResizeContent = (editor, e) => {
      editor.dispatch('ResizeContent', e);
    };
    const fireScrollContent = (editor, e) => {
      editor.dispatch('ScrollContent', e);
    };
    const fireTextColorChange = (editor, data) => {
      editor.dispatch('TextColorChange', data);
    };
    const fireAfterProgressState = (editor, state) => {
      editor.dispatch('AfterProgressState', { state });
    };
    const fireResolveName = (editor, node) => editor.dispatch('ResolveName', {
      name: node.nodeName.toLowerCase(),
      target: node
    });

    const hsvColour = (hue, saturation, value) => ({
      hue,
      saturation,
      value
    });
    const fromRgb = rgbaColour => {
      let h = 0;
      let s = 0;
      let v = 0;
      const r = rgbaColour.red / 255;
      const g = rgbaColour.green / 255;
      const b = rgbaColour.blue / 255;
      const minRGB = Math.min(r, Math.min(g, b));
      const maxRGB = Math.max(r, Math.max(g, b));
      if (minRGB === maxRGB) {
        v = minRGB;
        return hsvColour(0, 0, v * 100);
      }
      const d = r === minRGB ? g - b : b === minRGB ? r - g : b - r;
      h = r === minRGB ? 3 : b === minRGB ? 1 : 5;
      h = 60 * (h - d / (maxRGB - minRGB));
      s = (maxRGB - minRGB) / maxRGB;
      v = maxRGB;
      return hsvColour(Math.round(h), Math.round(s * 100), Math.round(v * 100));
    };

    const hexToHsv = hex => fromRgb(fromHex(hex));
    const hsvToHex = hsv => fromRgba(fromHsv(hsv));
    const anyToHex = color => fromString$1(color).orThunk(() => fromString(color).map(fromRgba)).getOrThunk(() => {
      const canvas = document.createElement('canvas');
      canvas.height = 1;
      canvas.width = 1;
      const canvasContext = canvas.getContext('2d');
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      canvasContext.fillStyle = '#FFFFFF';
      canvasContext.fillStyle = color;
      canvasContext.fillRect(0, 0, 1, 1);
      const rgba = canvasContext.getImageData(0, 0, 1, 1).data;
      const r = rgba[0];
      const g = rgba[1];
      const b = rgba[2];
      const a = rgba[3];
      return fromRgba(rgbaColour(r, g, b, a));
    });

    var global$4 = tinymce.util.Tools.resolve('tinymce.util.LocalStorage');

    const storageName = 'tinymce-custom-colors';
    const ColorCache = (max = 10) => {
      const storageString = global$4.getItem(storageName);
      const localstorage = isString(storageString) ? JSON.parse(storageString) : [];
      const prune = list => {
        const diff = max - list.length;
        return diff < 0 ? list.slice(0, max) : list;
      };
      const cache = prune(localstorage);
      const add = key => {
        indexOf(cache, key).each(remove);
        cache.unshift(key);
        if (cache.length > max) {
          cache.pop();
        }
        global$4.setItem(storageName, JSON.stringify(cache));
      };
      const remove = idx => {
        cache.splice(idx, 1);
      };
      const state = () => cache.slice(0);
      return {
        add,
        state
      };
    };

    const colorCache = ColorCache(10);
    const calcCols = colors => Math.max(5, Math.ceil(Math.sqrt(colors)));
    const mapColors = colorMap => {
      const colors = [];
      for (let i = 0; i < colorMap.length; i += 2) {
        colors.push({
          text: colorMap[i + 1],
          value: '#' + anyToHex(colorMap[i]).value,
          type: 'choiceitem'
        });
      }
      return colors;
    };
    const option$1 = name => editor => editor.options.get(name);
    const register$d = editor => {
      const registerOption = editor.options.register;
      registerOption('color_map', {
        processor: value => {
          if (isArrayOf(value, isString)) {
            return {
              value: mapColors(value),
              valid: true
            };
          } else {
            return {
              valid: false,
              message: 'Must be an array of strings.'
            };
          }
        },
        default: [
          '#BFEDD2',
          'Light Green',
          '#FBEEB8',
          'Light Yellow',
          '#F8CAC6',
          'Light Red',
          '#ECCAFA',
          'Light Purple',
          '#C2E0F4',
          'Light Blue',
          '#2DC26B',
          'Green',
          '#F1C40F',
          'Yellow',
          '#E03E2D',
          'Red',
          '#B96AD9',
          'Purple',
          '#3598DB',
          'Blue',
          '#169179',
          'Dark Turquoise',
          '#E67E23',
          'Orange',
          '#BA372A',
          'Dark Red',
          '#843FA1',
          'Dark Purple',
          '#236FA1',
          'Dark Blue',
          '#ECF0F1',
          'Light Gray',
          '#CED4D9',
          'Medium Gray',
          '#95A5A6',
          'Gray',
          '#7E8C8D',
          'Dark Gray',
          '#34495E',
          'Navy Blue',
          '#000000',
          'Black',
          '#ffffff',
          'White'
        ]
      });
      registerOption('color_cols', {
        processor: 'number',
        default: calcCols(getColors$2(editor).length)
      });
      registerOption('custom_colors', {
        processor: 'boolean',
        default: true
      });
    };
    const getColorCols$1 = option$1('color_cols');
    const hasCustomColors$1 = option$1('custom_colors');
    const getColors$2 = option$1('color_map');
    const getCurrentColors = () => map$2(colorCache.state(), color => ({
      type: 'choiceitem',
      text: color,
      value: color
    }));
    const addColor = color => {
      colorCache.add(color);
    };

    const fallbackColor = '#000000';
    const hasStyleApi = node => isNonNullable(node.style);
    const getCurrentColor = (editor, format) => {
      let color;
      editor.dom.getParents(editor.selection.getStart(), elm => {
        const value = hasStyleApi(elm) ? elm.style[format === 'forecolor' ? 'color' : 'backgroundColor'] : null;
        if (value) {
          color = color ? color : value;
        }
      });
      return Optional.from(color);
    };
    const applyFormat = (editor, format, value) => {
      editor.undoManager.transact(() => {
        editor.focus();
        editor.formatter.apply(format, { value });
        editor.nodeChanged();
      });
    };
    const removeFormat = (editor, format) => {
      editor.undoManager.transact(() => {
        editor.focus();
        editor.formatter.remove(format, { value: null }, undefined, true);
        editor.nodeChanged();
      });
    };
    const registerCommands = editor => {
      editor.addCommand('mceApplyTextcolor', (format, value) => {
        applyFormat(editor, format, value);
      });
      editor.addCommand('mceRemoveTextcolor', format => {
        removeFormat(editor, format);
      });
    };
    const getAdditionalColors = hasCustom => {
      const type = 'choiceitem';
      const remove = {
        type,
        text: 'Remove color',
        icon: 'color-swatch-remove-color',
        value: 'remove'
      };
      const custom = {
        type,
        text: 'Custom color',
        icon: 'color-picker',
        value: 'custom'
      };
      return hasCustom ? [
        remove,
        custom
      ] : [remove];
    };
    const applyColor = (editor, format, value, onChoice) => {
      if (value === 'custom') {
        const dialog = colorPickerDialog(editor);
        dialog(colorOpt => {
          colorOpt.each(color => {
            addColor(color);
            editor.execCommand('mceApplyTextcolor', format, color);
            onChoice(color);
          });
        }, fallbackColor);
      } else if (value === 'remove') {
        onChoice('');
        editor.execCommand('mceRemoveTextcolor', format);
      } else {
        onChoice(value);
        editor.execCommand('mceApplyTextcolor', format, value);
      }
    };
    const getColors$1 = (colors, hasCustom) => colors.concat(getCurrentColors().concat(getAdditionalColors(hasCustom)));
    const getFetch$1 = (colors, hasCustom) => callback => {
      callback(getColors$1(colors, hasCustom));
    };
    const setIconColor = (splitButtonApi, name, newColor) => {
      const id = name === 'forecolor' ? 'tox-icon-text-color__color' : 'tox-icon-highlight-bg-color__color';
      splitButtonApi.setIconFill(id, newColor);
    };
    const registerTextColorButton = (editor, name, format, tooltip, lastColor) => {
      editor.ui.registry.addSplitButton(name, {
        tooltip,
        presets: 'color',
        icon: name === 'forecolor' ? 'text-color' : 'highlight-bg-color',
        select: value => {
          const optCurrentRgb = getCurrentColor(editor, format);
          return optCurrentRgb.bind(currentRgb => fromString(currentRgb).map(rgba => {
            const currentHex = fromRgba(rgba).value;
            return contains$1(value.toLowerCase(), currentHex);
          })).getOr(false);
        },
        columns: getColorCols$1(editor),
        fetch: getFetch$1(getColors$2(editor), hasCustomColors$1(editor)),
        onAction: _splitButtonApi => {
          applyColor(editor, format, lastColor.get(), noop);
        },
        onItemAction: (_splitButtonApi, value) => {
          applyColor(editor, format, value, newColor => {
            lastColor.set(newColor);
            fireTextColorChange(editor, {
              name,
              color: newColor
            });
          });
        },
        onSetup: splitButtonApi => {
          setIconColor(splitButtonApi, name, lastColor.get());
          const handler = e => {
            if (e.name === name) {
              setIconColor(splitButtonApi, e.name, e.color);
            }
          };
          editor.on('TextColorChange', handler);
          return () => {
            editor.off('TextColorChange', handler);
          };
        }
      });
    };
    const registerTextColorMenuItem = (editor, name, format, text) => {
      editor.ui.registry.addNestedMenuItem(name, {
        text,
        icon: name === 'forecolor' ? 'text-color' : 'highlight-bg-color',
        getSubmenuItems: () => [{
            type: 'fancymenuitem',
            fancytype: 'colorswatch',
            onAction: data => {
              applyColor(editor, format, data.value, noop);
            }
          }]
      });
    };
    const colorPickerDialog = editor => (callback, value) => {
      let isValid = false;
      const onSubmit = api => {
        const data = api.getData();
        const hex = data.colorpicker;
        if (isValid) {
          callback(Optional.from(hex));
          api.close();
        } else {
          editor.windowManager.alert(editor.translate([
            'Invalid hex color code: {0}',
            hex
          ]));
        }
      };
      const onAction = (_api, details) => {
        if (details.name === 'hex-valid') {
          isValid = details.value;
        }
      };
      const initialData = { colorpicker: value };
      editor.windowManager.open({
        title: 'Color Picker',
        size: 'normal',
        body: {
          type: 'panel',
          items: [{
              type: 'colorpicker',
              name: 'colorpicker',
              label: 'Color'
            }]
        },
        buttons: [
          {
            type: 'cancel',
            name: 'cancel',
            text: 'Cancel'
          },
          {
            type: 'submit',
            name: 'save',
            text: 'Save',
            primary: true
          }
        ],
        initialData,
        onAction,
        onSubmit,
        onClose: noop,
        onCancel: () => {
          callback(Optional.none());
        }
      });
    };
    const register$c = editor => {
      registerCommands(editor);
      const lastForeColor = Cell(fallbackColor);
      const lastBackColor = Cell(fallbackColor);
      registerTextColorButton(editor, 'forecolor', 'forecolor', 'Text color', lastForeColor);
      registerTextColorButton(editor, 'backcolor', 'hilitecolor', 'Background color', lastBackColor);
      registerTextColorMenuItem(editor, 'forecolor', 'forecolor', 'Text color');
      registerTextColorMenuItem(editor, 'backcolor', 'hilitecolor', 'Background color');
    };

    const createPartialChoiceMenu = (value, items, onItemValueHandler, columns, presets, itemResponse, select, providersBackstage) => {
      const hasIcons = menuHasIcons(items);
      const presetItemTypes = presets !== 'color' ? 'normal' : 'color';
      const alloyItems = createChoiceItems(items, onItemValueHandler, columns, presetItemTypes, itemResponse, select, providersBackstage);
      const menuLayout = { menuType: presets };
      return createPartialMenuWithAlloyItems(value, hasIcons, alloyItems, columns, menuLayout);
    };
    const createChoiceItems = (items, onItemValueHandler, columns, itemPresets, itemResponse, select, providersBackstage) => cat(map$2(items, item => {
      if (item.type === 'choiceitem') {
        return createChoiceMenuItem(item).fold(handleError, d => Optional.some(renderChoiceItem(d, columns === 1, itemPresets, onItemValueHandler, select(d.value), itemResponse, providersBackstage, menuHasIcons(items))));
      } else {
        return Optional.none();
      }
    }));

    const deriveMenuMovement = (columns, presets) => {
      const menuMarkers = markers(presets);
      if (columns === 1) {
        return {
          mode: 'menu',
          moveOnTab: true
        };
      } else if (columns === 'auto') {
        return {
          mode: 'grid',
          selector: '.' + menuMarkers.item,
          initSize: {
            numColumns: 1,
            numRows: 1
          }
        };
      } else {
        const rowClass = presets === 'color' ? 'tox-swatches__row' : 'tox-collection__group';
        return {
          mode: 'matrix',
          rowSelector: '.' + rowClass
        };
      }
    };
    const deriveCollectionMovement = (columns, presets) => {
      if (columns === 1) {
        return {
          mode: 'menu',
          moveOnTab: false,
          selector: '.tox-collection__item'
        };
      } else if (columns === 'auto') {
        return {
          mode: 'flatgrid',
          selector: '.' + 'tox-collection__item',
          initSize: {
            numColumns: 1,
            numRows: 1
          }
        };
      } else {
        return {
          mode: 'matrix',
          selectors: {
            row: presets === 'color' ? '.tox-swatches__row' : '.tox-collection__group',
            cell: presets === 'color' ? `.${ colorClass }` : `.${ selectableClass }`
          }
        };
      }
    };

    const renderColorSwatchItem = (spec, backstage) => {
      const items = getColorItems(spec, backstage);
      const columns = backstage.colorinput.getColorCols();
      const presets = 'color';
      const menuSpec = createPartialChoiceMenu(generate$6('menu-value'), items, value => {
        spec.onAction({ value });
      }, columns, presets, ItemResponse$1.CLOSE_ON_EXECUTE, never, backstage.shared.providers);
      const widgetSpec = {
        ...menuSpec,
        markers: markers(presets),
        movement: deriveMenuMovement(columns, presets)
      };
      return {
        type: 'widget',
        data: { value: generate$6('widget-id') },
        dom: {
          tag: 'div',
          classes: ['tox-fancymenuitem']
        },
        autofocus: true,
        components: [parts$f.widget(Menu.sketch(widgetSpec))]
      };
    };
    const getColorItems = (spec, backstage) => {
      const useCustomColors = spec.initData.allowCustomColors && backstage.colorinput.hasCustomColors();
      return spec.initData.colors.fold(() => getColors$1(backstage.colorinput.getColors(), useCustomColors), colors => colors.concat(getAdditionalColors(useCustomColors)));
    };

    const cellOverEvent = generate$6('cell-over');
    const cellExecuteEvent = generate$6('cell-execute');
    const makeCell = (row, col, labelId) => {
      const emitCellOver = c => emitWith(c, cellOverEvent, {
        row,
        col
      });
      const emitExecute = c => emitWith(c, cellExecuteEvent, {
        row,
        col
      });
      const onClick = (c, se) => {
        se.stop();
        emitExecute(c);
      };
      return build$1({
        dom: {
          tag: 'div',
          attributes: {
            role: 'button',
            ['aria-labelledby']: labelId
          }
        },
        behaviours: derive$1([
          config('insert-table-picker-cell', [
            run$1(mouseover(), Focusing.focus),
            run$1(execute$5(), emitExecute),
            run$1(click(), onClick),
            run$1(tap(), onClick)
          ]),
          Toggling.config({
            toggleClass: 'tox-insert-table-picker__selected',
            toggleOnExecute: false
          }),
          Focusing.config({ onFocus: emitCellOver })
        ])
      });
    };
    const makeCells = (labelId, numRows, numCols) => {
      const cells = [];
      for (let i = 0; i < numRows; i++) {
        const row = [];
        for (let j = 0; j < numCols; j++) {
          row.push(makeCell(i, j, labelId));
        }
        cells.push(row);
      }
      return cells;
    };
    const selectCells = (cells, selectedRow, selectedColumn, numRows, numColumns) => {
      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {
          Toggling.set(cells[i][j], i <= selectedRow && j <= selectedColumn);
        }
      }
    };
    const makeComponents = cells => bind$3(cells, cellRow => map$2(cellRow, premade));
    const makeLabelText = (row, col) => text$1(`${ col }x${ row }`);
    const renderInsertTableMenuItem = spec => {
      const numRows = 10;
      const numColumns = 10;
      const sizeLabelId = generate$6('size-label');
      const cells = makeCells(sizeLabelId, numRows, numColumns);
      const emptyLabelText = makeLabelText(0, 0);
      const memLabel = record({
        dom: {
          tag: 'span',
          classes: ['tox-insert-table-picker__label'],
          attributes: { id: sizeLabelId }
        },
        components: [emptyLabelText],
        behaviours: derive$1([Replacing.config({})])
      });
      return {
        type: 'widget',
        data: { value: generate$6('widget-id') },
        dom: {
          tag: 'div',
          classes: ['tox-fancymenuitem']
        },
        autofocus: true,
        components: [parts$f.widget({
            dom: {
              tag: 'div',
              classes: ['tox-insert-table-picker']
            },
            components: makeComponents(cells).concat(memLabel.asSpec()),
            behaviours: derive$1([
              config('insert-table-picker', [
                runOnAttached(c => {
                  Replacing.set(memLabel.get(c), [emptyLabelText]);
                }),
                runWithTarget(cellOverEvent, (c, t, e) => {
                  const {row, col} = e.event;
                  selectCells(cells, row, col, numRows, numColumns);
                  Replacing.set(memLabel.get(c), [makeLabelText(row + 1, col + 1)]);
                }),
                runWithTarget(cellExecuteEvent, (c, _, e) => {
                  const {row, col} = e.event;
                  spec.onAction({
                    numRows: row + 1,
                    numColumns: col + 1
                  });
                  emit(c, sandboxClose());
                })
              ]),
              Keying.config({
                initSize: {
                  numRows,
                  numColumns
                },
                mode: 'flatgrid',
                selector: '[role="button"]'
              })
            ])
          })]
      };
    };

    const fancyMenuItems = {
      inserttable: renderInsertTableMenuItem,
      colorswatch: renderColorSwatchItem
    };
    const renderFancyMenuItem = (spec, backstage) => get$g(fancyMenuItems, spec.fancytype).map(render => render(spec, backstage));

    const renderNestedItem = (spec, itemResponse, providersBackstage, renderIcons = true, downwardsCaret = false) => {
      const caret = downwardsCaret ? renderDownwardsCaret(providersBackstage.icons) : renderSubmenuCaret(providersBackstage.icons);
      const getApi = component => ({
        isEnabled: () => !Disabling.isDisabled(component),
        setEnabled: state => Disabling.set(component, !state)
      });
      const structure = renderItemStructure({
        presets: 'normal',
        iconContent: spec.icon,
        textContent: spec.text,
        htmlContent: Optional.none(),
        ariaLabel: spec.text,
        caret: Optional.some(caret),
        checkMark: Optional.none(),
        shortcutContent: spec.shortcut
      }, providersBackstage, renderIcons);
      return renderCommonItem({
        data: buildData(spec),
        getApi,
        enabled: spec.enabled,
        onAction: noop,
        onSetup: spec.onSetup,
        triggersSubmenu: true,
        itemBehaviours: []
      }, structure, itemResponse, providersBackstage);
    };

    const renderNormalItem = (spec, itemResponse, providersBackstage, renderIcons = true) => {
      const getApi = component => ({
        isEnabled: () => !Disabling.isDisabled(component),
        setEnabled: state => Disabling.set(component, !state)
      });
      const structure = renderItemStructure({
        presets: 'normal',
        iconContent: spec.icon,
        textContent: spec.text,
        htmlContent: Optional.none(),
        ariaLabel: spec.text,
        caret: Optional.none(),
        checkMark: Optional.none(),
        shortcutContent: spec.shortcut
      }, providersBackstage, renderIcons);
      return renderCommonItem({
        data: buildData(spec),
        getApi,
        enabled: spec.enabled,
        onAction: spec.onAction,
        onSetup: spec.onSetup,
        triggersSubmenu: false,
        itemBehaviours: []
      }, structure, itemResponse, providersBackstage);
    };

    const renderSeparatorItem = spec => ({
      type: 'separator',
      dom: {
        tag: 'div',
        classes: [
          selectableClass,
          groupHeadingClass
        ]
      },
      components: spec.text.map(text$1).toArray()
    });

    const renderToggleMenuItem = (spec, itemResponse, providersBackstage, renderIcons = true) => {
      const getApi = component => ({
        setActive: state => {
          Toggling.set(component, state);
        },
        isActive: () => Toggling.isOn(component),
        isEnabled: () => !Disabling.isDisabled(component),
        setEnabled: state => Disabling.set(component, !state)
      });
      const structure = renderItemStructure({
        iconContent: spec.icon,
        textContent: spec.text,
        htmlContent: Optional.none(),
        ariaLabel: spec.text,
        checkMark: Optional.some(renderCheckmark(providersBackstage.icons)),
        caret: Optional.none(),
        shortcutContent: spec.shortcut,
        presets: 'normal',
        meta: spec.meta
      }, providersBackstage, renderIcons);
      return deepMerge(renderCommonItem({
        data: buildData(spec),
        enabled: spec.enabled,
        getApi,
        onAction: spec.onAction,
        onSetup: spec.onSetup,
        triggersSubmenu: false,
        itemBehaviours: []
      }, structure, itemResponse, providersBackstage), {
        toggling: {
          toggleClass: tickedClass,
          toggleOnExecute: false,
          selected: spec.active
        }
      });
    };

    const autocomplete = renderAutocompleteItem;
    const separator$3 = renderSeparatorItem;
    const normal = renderNormalItem;
    const nested = renderNestedItem;
    const toggle$1 = renderToggleMenuItem;
    const fancy = renderFancyMenuItem;
    const card = renderCardMenuItem;

    const getCoupled = (component, coupleConfig, coupleState, name) => coupleState.getOrCreate(component, coupleConfig, name);
    const getExistingCoupled = (component, coupleConfig, coupleState, name) => coupleState.getExisting(component, coupleConfig, name);

    var CouplingApis = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getCoupled: getCoupled,
        getExistingCoupled: getExistingCoupled
    });

    var CouplingSchema = [requiredOf('others', setOf(Result.value, anyValue()))];

    const init$a = () => {
      const coupled = {};
      const lookupCoupled = (coupleConfig, coupledName) => {
        const available = keys(coupleConfig.others);
        if (available.length === 0) {
          throw new Error('Cannot find any known coupled components');
        } else {
          return get$g(coupled, coupledName);
        }
      };
      const getOrCreate = (component, coupleConfig, name) => {
        return lookupCoupled(coupleConfig, name).getOrThunk(() => {
          const builder = get$g(coupleConfig.others, name).getOrDie('No information found for coupled component: ' + name);
          const spec = builder(component);
          const built = component.getSystem().build(spec);
          coupled[name] = built;
          return built;
        });
      };
      const getExisting = (component, coupleConfig, name) => {
        return lookupCoupled(coupleConfig, name).orThunk(() => {
          get$g(coupleConfig.others, name).getOrDie('No information found for coupled component: ' + name);
          return Optional.none();
        });
      };
      const readState = constant$1({});
      return nu$8({
        readState,
        getExisting,
        getOrCreate
      });
    };

    var CouplingState = /*#__PURE__*/Object.freeze({
        __proto__: null,
        init: init$a
    });

    const Coupling = create$3({
      fields: CouplingSchema,
      name: 'coupling',
      apis: CouplingApis,
      state: CouplingState
    });

    const nu$3 = baseFn => {
      let data = Optional.none();
      let callbacks = [];
      const map = f => nu$3(nCallback => {
        get(data => {
          nCallback(f(data));
        });
      });
      const get = nCallback => {
        if (isReady()) {
          call(nCallback);
        } else {
          callbacks.push(nCallback);
        }
      };
      const set = x => {
        if (!isReady()) {
          data = Optional.some(x);
          run(callbacks);
          callbacks = [];
        }
      };
      const isReady = () => data.isSome();
      const run = cbs => {
        each$1(cbs, call);
      };
      const call = cb => {
        data.each(x => {
          setTimeout(() => {
            cb(x);
          }, 0);
        });
      };
      baseFn(set);
      return {
        get,
        map,
        isReady
      };
    };
    const pure$1 = a => nu$3(callback => {
      callback(a);
    });
    const LazyValue = {
      nu: nu$3,
      pure: pure$1
    };

    const errorReporter = err => {
      setTimeout(() => {
        throw err;
      }, 0);
    };
    const make$5 = run => {
      const get = callback => {
        run().then(callback, errorReporter);
      };
      const map = fab => {
        return make$5(() => run().then(fab));
      };
      const bind = aFutureB => {
        return make$5(() => run().then(v => aFutureB(v).toPromise()));
      };
      const anonBind = futureB => {
        return make$5(() => run().then(() => futureB.toPromise()));
      };
      const toLazy = () => {
        return LazyValue.nu(get);
      };
      const toCached = () => {
        let cache = null;
        return make$5(() => {
          if (cache === null) {
            cache = run();
          }
          return cache;
        });
      };
      const toPromise = run;
      return {
        map,
        bind,
        anonBind,
        toLazy,
        toCached,
        toPromise,
        get
      };
    };
    const nu$2 = baseFn => {
      return make$5(() => new Promise(baseFn));
    };
    const pure = a => {
      return make$5(() => Promise.resolve(a));
    };
    const Future = {
      nu: nu$2,
      pure
    };

    const suffix = constant$1('sink');
    const partType$1 = constant$1(optional({
      name: suffix(),
      overrides: constant$1({
        dom: { tag: 'div' },
        behaviours: derive$1([Positioning.config({ useFixed: always })]),
        events: derive$2([
          cutter(keydown()),
          cutter(mousedown()),
          cutter(click())
        ])
      })
    }));

    const getAnchor = (detail, component) => {
      const hotspot = detail.getHotspot(component).getOr(component);
      const type = 'hotspot';
      const overrides = detail.getAnchorOverrides();
      return detail.layouts.fold(() => ({
        type,
        hotspot,
        overrides
      }), layouts => ({
        type,
        hotspot,
        overrides,
        layouts
      }));
    };
    const fetch = (detail, mapFetch, component) => {
      const fetcher = detail.fetch;
      return fetcher(component).map(mapFetch);
    };
    const openF = (detail, mapFetch, anchor, component, sandbox, externals, highlightOnOpen) => {
      const futureData = fetch(detail, mapFetch, component);
      const getLazySink = getSink(component, detail);
      return futureData.map(tdata => tdata.bind(data => Optional.from(tieredMenu.sketch({
        ...externals.menu(),
        uid: generate$5(''),
        data,
        highlightOnOpen,
        onOpenMenu: (tmenu, menu) => {
          const sink = getLazySink().getOrDie();
          Positioning.position(sink, menu, { anchor });
          Sandboxing.decloak(sandbox);
        },
        onOpenSubmenu: (tmenu, item, submenu) => {
          const sink = getLazySink().getOrDie();
          Positioning.position(sink, submenu, {
            anchor: {
              type: 'submenu',
              item
            }
          });
          Sandboxing.decloak(sandbox);
        },
        onRepositionMenu: (tmenu, primaryMenu, submenuTriggers) => {
          const sink = getLazySink().getOrDie();
          Positioning.position(sink, primaryMenu, { anchor });
          each$1(submenuTriggers, st => {
            Positioning.position(sink, st.triggeredMenu, {
              anchor: {
                type: 'submenu',
                item: st.triggeringItem
              }
            });
          });
        },
        onEscape: () => {
          Focusing.focus(component);
          Sandboxing.close(sandbox);
          return Optional.some(true);
        }
      }))));
    };
    const open = (detail, mapFetch, hotspot, sandbox, externals, onOpenSync, highlightOnOpen) => {
      const anchor = getAnchor(detail, hotspot);
      const processed = openF(detail, mapFetch, anchor, hotspot, sandbox, externals, highlightOnOpen);
      return processed.map(tdata => {
        tdata.fold(() => {
          if (Sandboxing.isOpen(sandbox)) {
            Sandboxing.close(sandbox);
          }
        }, data => {
          Sandboxing.cloak(sandbox);
          Sandboxing.open(sandbox, data);
          onOpenSync(sandbox);
        });
        return sandbox;
      });
    };
    const close = (detail, mapFetch, component, sandbox, _externals, _onOpenSync, _highlightOnOpen) => {
      Sandboxing.close(sandbox);
      return Future.pure(sandbox);
    };
    const togglePopup = (detail, mapFetch, hotspot, externals, onOpenSync, highlightOnOpen) => {
      const sandbox = Coupling.getCoupled(hotspot, 'sandbox');
      const showing = Sandboxing.isOpen(sandbox);
      const action = showing ? close : open;
      return action(detail, mapFetch, hotspot, sandbox, externals, onOpenSync, highlightOnOpen);
    };
    const matchWidth = (hotspot, container, useMinWidth) => {
      const menu = Composing.getCurrent(container).getOr(container);
      const buttonWidth = get$c(hotspot.element);
      if (useMinWidth) {
        set$8(menu.element, 'min-width', buttonWidth + 'px');
      } else {
        set$7(menu.element, buttonWidth);
      }
    };
    const getSink = (anyInSystem, sinkDetail) => anyInSystem.getSystem().getByUid(sinkDetail.uid + '-' + suffix()).map(internalSink => () => Result.value(internalSink)).getOrThunk(() => sinkDetail.lazySink.fold(() => () => Result.error(new Error('No internal sink is specified, nor could an external sink be found')), lazySinkFn => () => lazySinkFn(anyInSystem)));
    const doRepositionMenus = sandbox => {
      Sandboxing.getState(sandbox).each(tmenu => {
        tieredMenu.repositionMenus(tmenu);
      });
    };
    const makeSandbox$1 = (detail, hotspot, extras) => {
      const ariaControls = manager();
      const onOpen = (component, menu) => {
        const anchor = getAnchor(detail, hotspot);
        ariaControls.link(hotspot.element);
        if (detail.matchWidth) {
          matchWidth(anchor.hotspot, menu, detail.useMinWidth);
        }
        detail.onOpen(anchor, component, menu);
        if (extras !== undefined && extras.onOpen !== undefined) {
          extras.onOpen(component, menu);
        }
      };
      const onClose = (component, menu) => {
        ariaControls.unlink(hotspot.element);
        if (extras !== undefined && extras.onClose !== undefined) {
          extras.onClose(component, menu);
        }
      };
      const lazySink = getSink(hotspot, detail);
      return {
        dom: {
          tag: 'div',
          classes: detail.sandboxClasses,
          attributes: {
            id: ariaControls.id,
            role: 'listbox'
          }
        },
        behaviours: SketchBehaviours.augment(detail.sandboxBehaviours, [
          Representing.config({
            store: {
              mode: 'memory',
              initialValue: hotspot
            }
          }),
          Sandboxing.config({
            onOpen,
            onClose,
            isPartOf: (container, data, queryElem) => {
              return isPartOf$1(data, queryElem) || isPartOf$1(hotspot, queryElem);
            },
            getAttachPoint: () => {
              return lazySink().getOrDie();
            }
          }),
          Composing.config({
            find: sandbox => {
              return Sandboxing.getState(sandbox).bind(menu => Composing.getCurrent(menu));
            }
          }),
          Receiving.config({
            channels: {
              ...receivingChannel$1({ isExtraPart: never }),
              ...receivingChannel({ doReposition: doRepositionMenus })
            }
          })
        ])
      };
    };
    const repositionMenus = comp => {
      const sandbox = Coupling.getCoupled(comp, 'sandbox');
      doRepositionMenus(sandbox);
    };

    const sandboxFields = () => [
      defaulted('sandboxClasses', []),
      SketchBehaviours.field('sandboxBehaviours', [
        Composing,
        Receiving,
        Sandboxing,
        Representing
      ])
    ];

    const schema$k = constant$1([
      required$1('dom'),
      required$1('fetch'),
      onHandler('onOpen'),
      onKeyboardHandler('onExecute'),
      defaulted('getHotspot', Optional.some),
      defaulted('getAnchorOverrides', constant$1({})),
      schema$y(),
      field('dropdownBehaviours', [
        Toggling,
        Coupling,
        Keying,
        Focusing
      ]),
      required$1('toggleClass'),
      defaulted('eventOrder', {}),
      option$3('lazySink'),
      defaulted('matchWidth', false),
      defaulted('useMinWidth', false),
      option$3('role')
    ].concat(sandboxFields()));
    const parts$e = constant$1([
      external({
        schema: [
          tieredMenuMarkers(),
          defaulted('fakeFocus', false)
        ],
        name: 'menu',
        defaults: detail => {
          return { onExecute: detail.onExecute };
        }
      }),
      partType$1()
    ]);

    const factory$i = (detail, components, _spec, externals) => {
      const lookupAttr = attr => get$g(detail.dom, 'attributes').bind(attrs => get$g(attrs, attr));
      const switchToMenu = sandbox => {
        Sandboxing.getState(sandbox).each(tmenu => {
          tieredMenu.highlightPrimary(tmenu);
        });
      };
      const togglePopup$1 = (dropdownComp, onOpenSync, highlightOnOpen) => {
        return togglePopup(detail, identity, dropdownComp, externals, onOpenSync, highlightOnOpen);
      };
      const action = component => {
        const onOpenSync = switchToMenu;
        togglePopup$1(component, onOpenSync, HighlightOnOpen.HighlightMenuAndItem).get(noop);
      };
      const apis = {
        expand: comp => {
          if (!Toggling.isOn(comp)) {
            togglePopup$1(comp, noop, HighlightOnOpen.HighlightNone).get(noop);
          }
        },
        open: comp => {
          if (!Toggling.isOn(comp)) {
            togglePopup$1(comp, noop, HighlightOnOpen.HighlightMenuAndItem).get(noop);
          }
        },
        refetch: comp => {
          const optSandbox = Coupling.getExistingCoupled(comp, 'sandbox');
          return optSandbox.fold(() => {
            return togglePopup$1(comp, noop, HighlightOnOpen.HighlightMenuAndItem).map(noop);
          }, sandboxComp => {
            return open(detail, identity, comp, sandboxComp, externals, noop, HighlightOnOpen.HighlightMenuAndItem).map(noop);
          });
        },
        isOpen: Toggling.isOn,
        close: comp => {
          if (Toggling.isOn(comp)) {
            togglePopup$1(comp, noop, HighlightOnOpen.HighlightMenuAndItem).get(noop);
          }
        },
        repositionMenus: comp => {
          if (Toggling.isOn(comp)) {
            repositionMenus(comp);
          }
        }
      };
      const triggerExecute = (comp, _se) => {
        emitExecute(comp);
        return Optional.some(true);
      };
      return {
        uid: detail.uid,
        dom: detail.dom,
        components,
        behaviours: augment(detail.dropdownBehaviours, [
          Toggling.config({
            toggleClass: detail.toggleClass,
            aria: { mode: 'expanded' }
          }),
          Coupling.config({
            others: {
              sandbox: hotspot => {
                return makeSandbox$1(detail, hotspot, {
                  onOpen: () => Toggling.on(hotspot),
                  onClose: () => Toggling.off(hotspot)
                });
              }
            }
          }),
          Keying.config({
            mode: 'special',
            onSpace: triggerExecute,
            onEnter: triggerExecute,
            onDown: (comp, _se) => {
              if (Dropdown.isOpen(comp)) {
                const sandbox = Coupling.getCoupled(comp, 'sandbox');
                switchToMenu(sandbox);
              } else {
                Dropdown.open(comp);
              }
              return Optional.some(true);
            },
            onEscape: (comp, _se) => {
              if (Dropdown.isOpen(comp)) {
                Dropdown.close(comp);
                return Optional.some(true);
              } else {
                return Optional.none();
              }
            }
          }),
          Focusing.config({})
        ]),
        events: events$a(Optional.some(action)),
        eventOrder: {
          ...detail.eventOrder,
          [execute$5()]: [
            'disabling',
            'toggling',
            'alloy.base.behaviour'
          ]
        },
        apis,
        domModification: {
          attributes: {
            'aria-haspopup': 'true',
            ...detail.role.fold(() => ({}), role => ({ role })),
            ...detail.dom.tag === 'button' ? { type: lookupAttr('type').getOr('button') } : {}
          }
        }
      };
    };
    const Dropdown = composite({
      name: 'Dropdown',
      configFields: schema$k(),
      partFields: parts$e(),
      factory: factory$i,
      apis: {
        open: (apis, comp) => apis.open(comp),
        refetch: (apis, comp) => apis.refetch(comp),
        expand: (apis, comp) => apis.expand(comp),
        close: (apis, comp) => apis.close(comp),
        isOpen: (apis, comp) => apis.isOpen(comp),
        repositionMenus: (apis, comp) => apis.repositionMenus(comp)
      }
    });

    const identifyMenuLayout = searchMode => {
      switch (searchMode.searchMode) {
      case 'no-search': {
          return { menuType: 'normal' };
        }
      default: {
          return {
            menuType: 'searchable',
            searchMode
          };
        }
      }
    };
    const handleRefetchTrigger = originalSandboxComp => {
      const dropdown = Representing.getValue(originalSandboxComp);
      const optSearcherState = findWithinSandbox(originalSandboxComp).map(saveState);
      Dropdown.refetch(dropdown).get(() => {
        const newSandboxComp = Coupling.getCoupled(dropdown, 'sandbox');
        optSearcherState.each(searcherState => findWithinSandbox(newSandboxComp).each(inputComp => restoreState(inputComp, searcherState)));
      });
    };
    const handleRedirectToMenuItem = (sandboxComp, se) => {
      getActiveMenuItemFrom(sandboxComp).each(activeItem => {
        retargetAndDispatchWith(sandboxComp, activeItem.element, se.event.eventType, se.event.interactionEvent);
      });
    };
    const getActiveMenuItemFrom = sandboxComp => {
      return Sandboxing.getState(sandboxComp).bind(Highlighting.getHighlighted).bind(Highlighting.getHighlighted);
    };
    const getSearchResults = activeMenuComp => {
      return has(activeMenuComp.element, searchResultsClass) ? Optional.some(activeMenuComp.element) : descendant(activeMenuComp.element, '.' + searchResultsClass);
    };
    const updateAriaOnHighlight = (tmenuComp, menuComp, itemComp) => {
      findWithinMenu(tmenuComp).each(inputComp => {
        setActiveDescendant(inputComp, itemComp);
        const optActiveResults = getSearchResults(menuComp);
        optActiveResults.each(resultsElem => {
          getOpt(resultsElem, 'id').each(controlledId => set$9(inputComp.element, 'aria-controls', controlledId));
        });
      });
      set$9(itemComp.element, 'aria-selected', 'true');
    };
    const updateAriaOnDehighlight = (tmenuComp, menuComp, itemComp) => {
      set$9(itemComp.element, 'aria-selected', 'false');
    };
    const focusSearchField = tmenuComp => {
      findWithinMenu(tmenuComp).each(searcherComp => Focusing.focus(searcherComp));
    };
    const getSearchPattern = dropdownComp => {
      const optSandboxComp = Coupling.getExistingCoupled(dropdownComp, 'sandbox');
      return optSandboxComp.bind(findWithinSandbox).map(saveState).map(state => state.fetchPattern).getOr('');
    };

    var FocusMode;
    (function (FocusMode) {
      FocusMode[FocusMode['ContentFocus'] = 0] = 'ContentFocus';
      FocusMode[FocusMode['UiFocus'] = 1] = 'UiFocus';
    }(FocusMode || (FocusMode = {})));
    const createMenuItemFromBridge = (item, itemResponse, backstage, menuHasIcons, isHorizontalMenu) => {
      const providersBackstage = backstage.shared.providers;
      const parseForHorizontalMenu = menuitem => !isHorizontalMenu ? menuitem : {
        ...menuitem,
        shortcut: Optional.none(),
        icon: menuitem.text.isSome() ? Optional.none() : menuitem.icon
      };
      switch (item.type) {
      case 'menuitem':
        return createMenuItem(item).fold(handleError, d => Optional.some(normal(parseForHorizontalMenu(d), itemResponse, providersBackstage, menuHasIcons)));
      case 'nestedmenuitem':
        return createNestedMenuItem(item).fold(handleError, d => Optional.some(nested(parseForHorizontalMenu(d), itemResponse, providersBackstage, menuHasIcons, isHorizontalMenu)));
      case 'togglemenuitem':
        return createToggleMenuItem(item).fold(handleError, d => Optional.some(toggle$1(parseForHorizontalMenu(d), itemResponse, providersBackstage, menuHasIcons)));
      case 'separator':
        return createSeparatorMenuItem(item).fold(handleError, d => Optional.some(separator$3(d)));
      case 'fancymenuitem':
        return createFancyMenuItem(item).fold(handleError, d => fancy(d, backstage));
      default: {
          console.error('Unknown item in general menu', item);
          return Optional.none();
        }
      }
    };
    const createAutocompleteItems = (items, matchText, onItemValueHandler, columns, itemResponse, sharedBackstage, highlightOn) => {
      const renderText = columns === 1;
      const renderIcons = !renderText || menuHasIcons(items);
      return cat(map$2(items, item => {
        switch (item.type) {
        case 'separator':
          return createSeparatorItem(item).fold(handleError, d => Optional.some(separator$3(d)));
        case 'cardmenuitem':
          return createCardMenuItem(item).fold(handleError, d => Optional.some(card({
            ...d,
            onAction: api => {
              d.onAction(api);
              onItemValueHandler(d.value, d.meta);
            }
          }, itemResponse, sharedBackstage, {
            itemBehaviours: tooltipBehaviour(d.meta, sharedBackstage),
            cardText: {
              matchText,
              highlightOn
            }
          })));
        case 'autocompleteitem':
        default:
          return createAutocompleterItem(item).fold(handleError, d => Optional.some(autocomplete(d, matchText, renderText, 'normal', onItemValueHandler, itemResponse, sharedBackstage, renderIcons)));
        }
      }));
    };
    const createPartialMenu = (value, items, itemResponse, backstage, isHorizontalMenu, searchMode) => {
      const hasIcons = menuHasIcons(items);
      const alloyItems = cat(map$2(items, item => {
        const itemHasIcon = i => isHorizontalMenu ? !has$2(i, 'text') : hasIcons;
        const createItem = i => createMenuItemFromBridge(i, itemResponse, backstage, itemHasIcon(i), isHorizontalMenu);
        if (item.type === 'nestedmenuitem' && item.getSubmenuItems().length <= 0) {
          return createItem({
            ...item,
            enabled: false
          });
        } else {
          return createItem(item);
        }
      }));
      const menuLayout = identifyMenuLayout(searchMode);
      const createPartial = isHorizontalMenu ? createHorizontalPartialMenuWithAlloyItems : createPartialMenuWithAlloyItems;
      return createPartial(value, hasIcons, alloyItems, 1, menuLayout);
    };
    const createTieredDataFrom = partialMenu => tieredMenu.singleData(partialMenu.value, partialMenu);
    const createInlineMenuFrom = (partialMenu, columns, focusMode, presets) => {
      const movement = deriveMenuMovement(columns, presets);
      const menuMarkers = markers(presets);
      return {
        data: createTieredDataFrom({
          ...partialMenu,
          movement,
          menuBehaviours: SimpleBehaviours.unnamedEvents(columns !== 'auto' ? [] : [runOnAttached((comp, _se) => {
              detectSize(comp, 4, menuMarkers.item).each(({numColumns, numRows}) => {
                Keying.setGridSize(comp, numRows, numColumns);
              });
            })])
        }),
        menu: {
          markers: markers(presets),
          fakeFocus: focusMode === FocusMode.ContentFocus
        }
      };
    };

    const getAutocompleterRange = (dom, initRange) => {
      return detect(SugarElement.fromDom(initRange.startContainer)).map(elm => {
        const range = dom.createRng();
        range.selectNode(elm.dom);
        return range;
      });
    };
    const register$b = (editor, sharedBackstage) => {
      const processingAction = Cell(false);
      const activeState = Cell(false);
      const autocompleter = build$1(InlineView.sketch({
        dom: {
          tag: 'div',
          classes: ['tox-autocompleter']
        },
        components: [],
        fireDismissalEventInstead: {},
        inlineBehaviours: derive$1([config('dismissAutocompleter', [run$1(dismissRequested(), () => cancelIfNecessary())])]),
        lazySink: sharedBackstage.getSink
      }));
      const isMenuOpen = () => InlineView.isOpen(autocompleter);
      const isActive = activeState.get;
      const hideIfNecessary = () => {
        if (isMenuOpen()) {
          InlineView.hide(autocompleter);
        }
      };
      const getMenu = () => InlineView.getContent(autocompleter).bind(tmenu => {
        return get$h(tmenu.components(), 0);
      });
      const cancelIfNecessary = () => editor.execCommand('mceAutocompleterClose');
      const getCombinedItems = matches => {
        const columns = findMap(matches, m => Optional.from(m.columns)).getOr(1);
        return bind$3(matches, match => {
          const choices = match.items;
          return createAutocompleteItems(choices, match.matchText, (itemValue, itemMeta) => {
            const nr = editor.selection.getRng();
            getAutocompleterRange(editor.dom, nr).each(range => {
              const autocompleterApi = {
                hide: () => cancelIfNecessary(),
                reload: fetchOptions => {
                  hideIfNecessary();
                  editor.execCommand('mceAutocompleterReload', false, { fetchOptions });
                }
              };
              processingAction.set(true);
              match.onAction(autocompleterApi, range, itemValue, itemMeta);
              processingAction.set(false);
            });
          }, columns, ItemResponse$1.BUBBLE_TO_SANDBOX, sharedBackstage, match.highlightOn);
        });
      };
      const display = (lookupData, items) => {
        findIn(SugarElement.fromDom(editor.getBody())).each(element => {
          const columns = findMap(lookupData, ld => Optional.from(ld.columns)).getOr(1);
          InlineView.showMenuAt(autocompleter, {
            anchor: {
              type: 'node',
              root: SugarElement.fromDom(editor.getBody()),
              node: Optional.from(element)
            }
          }, createInlineMenuFrom(createPartialMenuWithAlloyItems('autocompleter-value', true, items, columns, { menuType: 'normal' }), columns, FocusMode.ContentFocus, 'normal'));
        });
        getMenu().each(Highlighting.highlightFirst);
      };
      const updateDisplay = lookupData => {
        const combinedItems = getCombinedItems(lookupData);
        if (combinedItems.length > 0) {
          display(lookupData, combinedItems);
        } else {
          hideIfNecessary();
        }
      };
      editor.on('AutocompleterStart', ({lookupData}) => {
        activeState.set(true);
        processingAction.set(false);
        updateDisplay(lookupData);
      });
      editor.on('AutocompleterUpdate', ({lookupData}) => updateDisplay(lookupData));
      editor.on('AutocompleterEnd', () => {
        hideIfNecessary();
        activeState.set(false);
        processingAction.set(false);
      });
      const autocompleterUiApi = {
        cancelIfNecessary,
        isMenuOpen,
        isActive,
        isProcessingAction: processingAction.get,
        getMenu
      };
      AutocompleterEditorEvents.setup(autocompleterUiApi, editor);
    };
    const Autocompleter = { register: register$b };

    const closest = (scope, selector, isRoot) => closest$1(scope, selector, isRoot).isSome();

    const DelayedFunction = (fun, delay) => {
      let ref = null;
      const schedule = (...args) => {
        ref = setTimeout(() => {
          fun.apply(null, args);
          ref = null;
        }, delay);
      };
      const cancel = () => {
        if (ref !== null) {
          clearTimeout(ref);
          ref = null;
        }
      };
      return {
        cancel,
        schedule
      };
    };

    const SIGNIFICANT_MOVE = 5;
    const LONGPRESS_DELAY = 400;
    const getTouch = event => {
      const raw = event.raw;
      if (raw.touches === undefined || raw.touches.length !== 1) {
        return Optional.none();
      }
      return Optional.some(raw.touches[0]);
    };
    const isFarEnough = (touch, data) => {
      const distX = Math.abs(touch.clientX - data.x);
      const distY = Math.abs(touch.clientY - data.y);
      return distX > SIGNIFICANT_MOVE || distY > SIGNIFICANT_MOVE;
    };
    const monitor = settings => {
      const startData = value$2();
      const longpressFired = Cell(false);
      const longpress$1 = DelayedFunction(event => {
        settings.triggerEvent(longpress(), event);
        longpressFired.set(true);
      }, LONGPRESS_DELAY);
      const handleTouchstart = event => {
        getTouch(event).each(touch => {
          longpress$1.cancel();
          const data = {
            x: touch.clientX,
            y: touch.clientY,
            target: event.target
          };
          longpress$1.schedule(event);
          longpressFired.set(false);
          startData.set(data);
        });
        return Optional.none();
      };
      const handleTouchmove = event => {
        longpress$1.cancel();
        getTouch(event).each(touch => {
          startData.on(data => {
            if (isFarEnough(touch, data)) {
              startData.clear();
            }
          });
        });
        return Optional.none();
      };
      const handleTouchend = event => {
        longpress$1.cancel();
        const isSame = data => eq(data.target, event.target);
        return startData.get().filter(isSame).map(_data => {
          if (longpressFired.get()) {
            event.prevent();
            return false;
          } else {
            return settings.triggerEvent(tap(), event);
          }
        });
      };
      const handlers = wrapAll([
        {
          key: touchstart(),
          value: handleTouchstart
        },
        {
          key: touchmove(),
          value: handleTouchmove
        },
        {
          key: touchend(),
          value: handleTouchend
        }
      ]);
      const fireIfReady = (event, type) => get$g(handlers, type).bind(handler => handler(event));
      return { fireIfReady };
    };

    const isDangerous = event => {
      const keyEv = event.raw;
      return keyEv.which === BACKSPACE[0] && !contains$2([
        'input',
        'textarea'
      ], name$3(event.target)) && !closest(event.target, '[contenteditable="true"]');
    };
    const setup$d = (container, rawSettings) => {
      const settings = {
        stopBackspace: true,
        ...rawSettings
      };
      const pointerEvents = [
        'touchstart',
        'touchmove',
        'touchend',
        'touchcancel',
        'gesturestart',
        'mousedown',
        'mouseup',
        'mouseover',
        'mousemove',
        'mouseout',
        'click'
      ];
      const tapEvent = monitor(settings);
      const simpleEvents = map$2(pointerEvents.concat([
        'selectstart',
        'input',
        'contextmenu',
        'change',
        'transitionend',
        'transitioncancel',
        'drag',
        'dragstart',
        'dragend',
        'dragenter',
        'dragleave',
        'dragover',
        'drop',
        'keyup'
      ]), type => bind(container, type, event => {
        tapEvent.fireIfReady(event, type).each(tapStopped => {
          if (tapStopped) {
            event.kill();
          }
        });
        const stopped = settings.triggerEvent(type, event);
        if (stopped) {
          event.kill();
        }
      }));
      const pasteTimeout = value$2();
      const onPaste = bind(container, 'paste', event => {
        tapEvent.fireIfReady(event, 'paste').each(tapStopped => {
          if (tapStopped) {
            event.kill();
          }
        });
        const stopped = settings.triggerEvent('paste', event);
        if (stopped) {
          event.kill();
        }
        pasteTimeout.set(setTimeout(() => {
          settings.triggerEvent(postPaste(), event);
        }, 0));
      });
      const onKeydown = bind(container, 'keydown', event => {
        const stopped = settings.triggerEvent('keydown', event);
        if (stopped) {
          event.kill();
        } else if (settings.stopBackspace && isDangerous(event)) {
          event.prevent();
        }
      });
      const onFocusIn = bind(container, 'focusin', event => {
        const stopped = settings.triggerEvent('focusin', event);
        if (stopped) {
          event.kill();
        }
      });
      const focusoutTimeout = value$2();
      const onFocusOut = bind(container, 'focusout', event => {
        const stopped = settings.triggerEvent('focusout', event);
        if (stopped) {
          event.kill();
        }
        focusoutTimeout.set(setTimeout(() => {
          settings.triggerEvent(postBlur(), event);
        }, 0));
      });
      const unbind = () => {
        each$1(simpleEvents, e => {
          e.unbind();
        });
        onKeydown.unbind();
        onFocusIn.unbind();
        onFocusOut.unbind();
        onPaste.unbind();
        pasteTimeout.on(clearTimeout);
        focusoutTimeout.on(clearTimeout);
      };
      return { unbind };
    };

    const derive = (rawEvent, rawTarget) => {
      const source = get$g(rawEvent, 'target').getOr(rawTarget);
      return Cell(source);
    };

    const fromSource = (event, source) => {
      const stopper = Cell(false);
      const cutter = Cell(false);
      const stop = () => {
        stopper.set(true);
      };
      const cut = () => {
        cutter.set(true);
      };
      return {
        stop,
        cut,
        isStopped: stopper.get,
        isCut: cutter.get,
        event,
        setSource: source.set,
        getSource: source.get
      };
    };
    const fromExternal = event => {
      const stopper = Cell(false);
      const stop = () => {
        stopper.set(true);
      };
      return {
        stop,
        cut: noop,
        isStopped: stopper.get,
        isCut: never,
        event,
        setSource: die('Cannot set source of a broadcasted event'),
        getSource: die('Cannot get source of a broadcasted event')
      };
    };

    const adt$1 = Adt.generate([
      { stopped: [] },
      { resume: ['element'] },
      { complete: [] }
    ]);
    const doTriggerHandler = (lookup, eventType, rawEvent, target, source, logger) => {
      const handler = lookup(eventType, target);
      const simulatedEvent = fromSource(rawEvent, source);
      return handler.fold(() => {
        logger.logEventNoHandlers(eventType, target);
        return adt$1.complete();
      }, handlerInfo => {
        const descHandler = handlerInfo.descHandler;
        const eventHandler = getCurried(descHandler);
        eventHandler(simulatedEvent);
        if (simulatedEvent.isStopped()) {
          logger.logEventStopped(eventType, handlerInfo.element, descHandler.purpose);
          return adt$1.stopped();
        } else if (simulatedEvent.isCut()) {
          logger.logEventCut(eventType, handlerInfo.element, descHandler.purpose);
          return adt$1.complete();
        } else {
          return parent(handlerInfo.element).fold(() => {
            logger.logNoParent(eventType, handlerInfo.element, descHandler.purpose);
            return adt$1.complete();
          }, parent => {
            logger.logEventResponse(eventType, handlerInfo.element, descHandler.purpose);
            return adt$1.resume(parent);
          });
        }
      });
    };
    const doTriggerOnUntilStopped = (lookup, eventType, rawEvent, rawTarget, source, logger) => doTriggerHandler(lookup, eventType, rawEvent, rawTarget, source, logger).fold(always, parent => doTriggerOnUntilStopped(lookup, eventType, rawEvent, parent, source, logger), never);
    const triggerHandler = (lookup, eventType, rawEvent, target, logger) => {
      const source = derive(rawEvent, target);
      return doTriggerHandler(lookup, eventType, rawEvent, target, source, logger);
    };
    const broadcast = (listeners, rawEvent, _logger) => {
      const simulatedEvent = fromExternal(rawEvent);
      each$1(listeners, listener => {
        const descHandler = listener.descHandler;
        const handler = getCurried(descHandler);
        handler(simulatedEvent);
      });
      return simulatedEvent.isStopped();
    };
    const triggerUntilStopped = (lookup, eventType, rawEvent, logger) => triggerOnUntilStopped(lookup, eventType, rawEvent, rawEvent.target, logger);
    const triggerOnUntilStopped = (lookup, eventType, rawEvent, rawTarget, logger) => {
      const source = derive(rawEvent, rawTarget);
      return doTriggerOnUntilStopped(lookup, eventType, rawEvent, rawTarget, source, logger);
    };

    const eventHandler = (element, descHandler) => ({
      element,
      descHandler
    });
    const broadcastHandler = (id, handler) => ({
      id,
      descHandler: handler
    });
    const EventRegistry = () => {
      const registry = {};
      const registerId = (extraArgs, id, events) => {
        each(events, (v, k) => {
          const handlers = registry[k] !== undefined ? registry[k] : {};
          handlers[id] = curryArgs(v, extraArgs);
          registry[k] = handlers;
        });
      };
      const findHandler = (handlers, elem) => read$1(elem).bind(id => get$g(handlers, id)).map(descHandler => eventHandler(elem, descHandler));
      const filterByType = type => get$g(registry, type).map(handlers => mapToArray(handlers, (f, id) => broadcastHandler(id, f))).getOr([]);
      const find = (isAboveRoot, type, target) => get$g(registry, type).bind(handlers => closest$4(target, elem => findHandler(handlers, elem), isAboveRoot));
      const unregisterId = id => {
        each(registry, (handlersById, _eventName) => {
          if (has$2(handlersById, id)) {
            delete handlersById[id];
          }
        });
      };
      return {
        registerId,
        unregisterId,
        filterByType,
        find
      };
    };

    const Registry = () => {
      const events = EventRegistry();
      const components = {};
      const readOrTag = component => {
        const elem = component.element;
        return read$1(elem).getOrThunk(() => write('uid-', component.element));
      };
      const failOnDuplicate = (component, tagId) => {
        const conflict = components[tagId];
        if (conflict === component) {
          unregister(component);
        } else {
          throw new Error('The tagId "' + tagId + '" is already used by: ' + element(conflict.element) + '\nCannot use it for: ' + element(component.element) + '\n' + 'The conflicting element is' + (inBody(conflict.element) ? ' ' : ' not ') + 'already in the DOM');
        }
      };
      const register = component => {
        const tagId = readOrTag(component);
        if (hasNonNullableKey(components, tagId)) {
          failOnDuplicate(component, tagId);
        }
        const extraArgs = [component];
        events.registerId(extraArgs, tagId, component.events);
        components[tagId] = component;
      };
      const unregister = component => {
        read$1(component.element).each(tagId => {
          delete components[tagId];
          events.unregisterId(tagId);
        });
      };
      const filter = type => events.filterByType(type);
      const find = (isAboveRoot, type, target) => events.find(isAboveRoot, type, target);
      const getById = id => get$g(components, id);
      return {
        find,
        filter,
        register,
        unregister,
        getById
      };
    };

    const factory$h = detail => {
      const {attributes, ...domWithoutAttributes} = detail.dom;
      return {
        uid: detail.uid,
        dom: {
          tag: 'div',
          attributes: {
            role: 'presentation',
            ...attributes
          },
          ...domWithoutAttributes
        },
        components: detail.components,
        behaviours: get$3(detail.containerBehaviours),
        events: detail.events,
        domModification: detail.domModification,
        eventOrder: detail.eventOrder
      };
    };
    const Container = single({
      name: 'Container',
      factory: factory$h,
      configFields: [
        defaulted('components', []),
        field('containerBehaviours', []),
        defaulted('events', {}),
        defaulted('domModification', {}),
        defaulted('eventOrder', {})
      ]
    });

    const takeover = root => {
      const isAboveRoot = el => parent(root.element).fold(always, parent => eq(el, parent));
      const registry = Registry();
      const lookup = (eventName, target) => registry.find(isAboveRoot, eventName, target);
      const domEvents = setup$d(root.element, {
        triggerEvent: (eventName, event) => {
          return monitorEvent(eventName, event.target, logger => triggerUntilStopped(lookup, eventName, event, logger));
        }
      });
      const systemApi = {
        debugInfo: constant$1('real'),
        triggerEvent: (eventName, target, data) => {
          monitorEvent(eventName, target, logger => triggerOnUntilStopped(lookup, eventName, data, target, logger));
        },
        triggerFocus: (target, originator) => {
          read$1(target).fold(() => {
            focus$3(target);
          }, _alloyId => {
            monitorEvent(focus$4(), target, logger => {
              triggerHandler(lookup, focus$4(), {
                originator,
                kill: noop,
                prevent: noop,
                target
              }, target, logger);
              return false;
            });
          });
        },
        triggerEscape: (comp, simulatedEvent) => {
          systemApi.triggerEvent('keydown', comp.element, simulatedEvent.event);
        },
        getByUid: uid => {
          return getByUid(uid);
        },
        getByDom: elem => {
          return getByDom(elem);
        },
        build: build$1,
        buildOrPatch: buildOrPatch,
        addToGui: c => {
          add(c);
        },
        removeFromGui: c => {
          remove(c);
        },
        addToWorld: c => {
          addToWorld(c);
        },
        removeFromWorld: c => {
          removeFromWorld(c);
        },
        broadcast: message => {
          broadcast$1(message);
        },
        broadcastOn: (channels, message) => {
          broadcastOn(channels, message);
        },
        broadcastEvent: (eventName, event) => {
          broadcastEvent(eventName, event);
        },
        isConnected: always
      };
      const addToWorld = component => {
        component.connect(systemApi);
        if (!isText(component.element)) {
          registry.register(component);
          each$1(component.components(), addToWorld);
          systemApi.triggerEvent(systemInit(), component.element, { target: component.element });
        }
      };
      const removeFromWorld = component => {
        if (!isText(component.element)) {
          each$1(component.components(), removeFromWorld);
          registry.unregister(component);
        }
        component.disconnect();
      };
      const add = component => {
        attach(root, component);
      };
      const remove = component => {
        detach(component);
      };
      const destroy = () => {
        domEvents.unbind();
        remove$5(root.element);
      };
      const broadcastData = data => {
        const receivers = registry.filter(receive());
        each$1(receivers, receiver => {
          const descHandler = receiver.descHandler;
          const handler = getCurried(descHandler);
          handler(data);
        });
      };
      const broadcast$1 = message => {
        broadcastData({
          universal: true,
          data: message
        });
      };
      const broadcastOn = (channels, message) => {
        broadcastData({
          universal: false,
          channels,
          data: message
        });
      };
      const broadcastEvent = (eventName, event) => {
        const listeners = registry.filter(eventName);
        return broadcast(listeners, event);
      };
      const getByUid = uid => registry.getById(uid).fold(() => Result.error(new Error('Could not find component with uid: "' + uid + '" in system.')), Result.value);
      const getByDom = elem => {
        const uid = read$1(elem).getOr('not found');
        return getByUid(uid);
      };
      addToWorld(root);
      return {
        root,
        element: root.element,
        destroy,
        add,
        remove,
        getByUid,
        getByDom,
        addToWorld,
        removeFromWorld,
        broadcast: broadcast$1,
        broadcastOn,
        broadcastEvent
      };
    };

    const renderBar = (spec, backstage) => ({
      dom: {
        tag: 'div',
        classes: [
          'tox-bar',
          'tox-form__controls-h-stack'
        ]
      },
      components: map$2(spec.items, backstage.interpreter)
    });

    const schema$j = constant$1([
      defaulted('prefix', 'form-field'),
      field('fieldBehaviours', [
        Composing,
        Representing
      ])
    ]);
    const parts$d = constant$1([
      optional({
        schema: [required$1('dom')],
        name: 'label'
      }),
      optional({
        factory: {
          sketch: spec => {
            return {
              uid: spec.uid,
              dom: {
                tag: 'span',
                styles: { display: 'none' },
                attributes: { 'aria-hidden': 'true' },
                innerHtml: spec.text
              }
            };
          }
        },
        schema: [required$1('text')],
        name: 'aria-descriptor'
      }),
      required({
        factory: {
          sketch: spec => {
            const excludeFactory = exclude(spec, ['factory']);
            return spec.factory.sketch(excludeFactory);
          }
        },
        schema: [required$1('factory')],
        name: 'field'
      })
    ]);

    const factory$g = (detail, components, _spec, _externals) => {
      const behaviours = augment(detail.fieldBehaviours, [
        Composing.config({
          find: container => {
            return getPart(container, detail, 'field');
          }
        }),
        Representing.config({
          store: {
            mode: 'manual',
            getValue: field => {
              return Composing.getCurrent(field).bind(Representing.getValue);
            },
            setValue: (field, value) => {
              Composing.getCurrent(field).each(current => {
                Representing.setValue(current, value);
              });
            }
          }
        })
      ]);
      const events = derive$2([runOnAttached((component, _simulatedEvent) => {
          const ps = getParts(component, detail, [
            'label',
            'field',
            'aria-descriptor'
          ]);
          ps.field().each(field => {
            const id = generate$6(detail.prefix);
            ps.label().each(label => {
              set$9(label.element, 'for', id);
              set$9(field.element, 'id', id);
            });
            ps['aria-descriptor']().each(descriptor => {
              const descriptorId = generate$6(detail.prefix);
              set$9(descriptor.element, 'id', descriptorId);
              set$9(field.element, 'aria-describedby', descriptorId);
            });
          });
        })]);
      const apis = {
        getField: container => getPart(container, detail, 'field'),
        getLabel: container => getPart(container, detail, 'label')
      };
      return {
        uid: detail.uid,
        dom: detail.dom,
        components,
        behaviours,
        events,
        apis
      };
    };
    const FormField = composite({
      name: 'FormField',
      configFields: schema$j(),
      partFields: parts$d(),
      factory: factory$g,
      apis: {
        getField: (apis, comp) => apis.getField(comp),
        getLabel: (apis, comp) => apis.getLabel(comp)
      }
    });

    const exhibit$2 = (base, tabConfig) => nu$7({
      attributes: wrapAll([{
          key: tabConfig.tabAttr,
          value: 'true'
        }])
    });

    var ActiveTabstopping = /*#__PURE__*/Object.freeze({
        __proto__: null,
        exhibit: exhibit$2
    });

    var TabstopSchema = [defaulted('tabAttr', 'data-alloy-tabstop')];

    const Tabstopping = create$3({
      fields: TabstopSchema,
      name: 'tabstopping',
      active: ActiveTabstopping
    });

    var global$3 = tinymce.util.Tools.resolve('tinymce.html.Entities');

    const renderFormFieldWith = (pLabel, pField, extraClasses, extraBehaviours) => {
      const spec = renderFormFieldSpecWith(pLabel, pField, extraClasses, extraBehaviours);
      return FormField.sketch(spec);
    };
    const renderFormField = (pLabel, pField) => renderFormFieldWith(pLabel, pField, [], []);
    const renderFormFieldSpecWith = (pLabel, pField, extraClasses, extraBehaviours) => ({
      dom: renderFormFieldDomWith(extraClasses),
      components: pLabel.toArray().concat([pField]),
      fieldBehaviours: derive$1(extraBehaviours)
    });
    const renderFormFieldDom = () => renderFormFieldDomWith([]);
    const renderFormFieldDomWith = extraClasses => ({
      tag: 'div',
      classes: ['tox-form__group'].concat(extraClasses)
    });
    const renderLabel$2 = (label, providersBackstage) => FormField.parts.label({
      dom: {
        tag: 'label',
        classes: ['tox-label']
      },
      components: [text$1(providersBackstage.translate(label))]
    });

    const formChangeEvent = generate$6('form-component-change');
    const formCloseEvent = generate$6('form-close');
    const formCancelEvent = generate$6('form-cancel');
    const formActionEvent = generate$6('form-action');
    const formSubmitEvent = generate$6('form-submit');
    const formBlockEvent = generate$6('form-block');
    const formUnblockEvent = generate$6('form-unblock');
    const formTabChangeEvent = generate$6('form-tabchange');
    const formResizeEvent = generate$6('form-resize');

    const renderCollection = (spec, providersBackstage, initialData) => {
      const pLabel = spec.label.map(label => renderLabel$2(label, providersBackstage));
      const runOnItem = f => (comp, se) => {
        closest$1(se.event.target, '[data-collection-item-value]').each(target => {
          f(comp, se, target, get$f(target, 'data-collection-item-value'));
        });
      };
      const setContents = (comp, items) => {
        const htmlLines = map$2(items, item => {
          const itemText = global$8.translate(item.text);
          const textContent = spec.columns === 1 ? `<div class="tox-collection__item-label">${ itemText }</div>` : '';
          const iconContent = `<div class="tox-collection__item-icon">${ item.icon }</div>`;
          const mapItemName = {
            '_': ' ',
            ' - ': ' ',
            '-': ' '
          };
          const ariaLabel = itemText.replace(/\_| \- |\-/g, match => mapItemName[match]);
          const disabledClass = providersBackstage.isDisabled() ? ' tox-collection__item--state-disabled' : '';
          return `<div class="tox-collection__item${ disabledClass }" tabindex="-1" data-collection-item-value="${ global$3.encodeAllRaw(item.value) }" title="${ ariaLabel }" aria-label="${ ariaLabel }">${ iconContent }${ textContent }</div>`;
        });
        const chunks = spec.columns !== 'auto' && spec.columns > 1 ? chunk$1(htmlLines, spec.columns) : [htmlLines];
        const html = map$2(chunks, ch => `<div class="tox-collection__group">${ ch.join('') }</div>`);
        set$6(comp.element, html.join(''));
      };
      const onClick = runOnItem((comp, se, tgt, itemValue) => {
        se.stop();
        if (!providersBackstage.isDisabled()) {
          emitWith(comp, formActionEvent, {
            name: spec.name,
            value: itemValue
          });
        }
      });
      const collectionEvents = [
        run$1(mouseover(), runOnItem((comp, se, tgt) => {
          focus$3(tgt);
        })),
        run$1(click(), onClick),
        run$1(tap(), onClick),
        run$1(focusin(), runOnItem((comp, se, tgt) => {
          descendant(comp.element, '.' + activeClass).each(currentActive => {
            remove$2(currentActive, activeClass);
          });
          add$2(tgt, activeClass);
        })),
        run$1(focusout(), runOnItem(comp => {
          descendant(comp.element, '.' + activeClass).each(currentActive => {
            remove$2(currentActive, activeClass);
          });
        })),
        runOnExecute$1(runOnItem((comp, se, tgt, itemValue) => {
          emitWith(comp, formActionEvent, {
            name: spec.name,
            value: itemValue
          });
        }))
      ];
      const iterCollectionItems = (comp, applyAttributes) => map$2(descendants(comp.element, '.tox-collection__item'), applyAttributes);
      const pField = FormField.parts.field({
        dom: {
          tag: 'div',
          classes: ['tox-collection'].concat(spec.columns !== 1 ? ['tox-collection--grid'] : ['tox-collection--list'])
        },
        components: [],
        factory: { sketch: identity },
        behaviours: derive$1([
          Disabling.config({
            disabled: providersBackstage.isDisabled,
            onDisabled: comp => {
              iterCollectionItems(comp, childElm => {
                add$2(childElm, 'tox-collection__item--state-disabled');
                set$9(childElm, 'aria-disabled', true);
              });
            },
            onEnabled: comp => {
              iterCollectionItems(comp, childElm => {
                remove$2(childElm, 'tox-collection__item--state-disabled');
                remove$7(childElm, 'aria-disabled');
              });
            }
          }),
          receivingConfig(),
          Replacing.config({}),
          Representing.config({
            store: {
              mode: 'memory',
              initialValue: initialData.getOr([])
            },
            onSetValue: (comp, items) => {
              setContents(comp, items);
              if (spec.columns === 'auto') {
                detectSize(comp, 5, 'tox-collection__item').each(({numRows, numColumns}) => {
                  Keying.setGridSize(comp, numRows, numColumns);
                });
              }
              emit(comp, formResizeEvent);
            }
          }),
          Tabstopping.config({}),
          Keying.config(deriveCollectionMovement(spec.columns, 'normal')),
          config('collection-events', collectionEvents)
        ]),
        eventOrder: {
          [execute$5()]: [
            'disabling',
            'alloy.base.behaviour',
            'collection-events'
          ]
        }
      });
      const extraClasses = ['tox-form__group--collection'];
      return renderFormFieldWith(pLabel, pField, extraClasses, []);
    };

    const ariaElements = [
      'input',
      'textarea'
    ];
    const isAriaElement = elem => {
      const name = name$3(elem);
      return contains$2(ariaElements, name);
    };
    const markValid = (component, invalidConfig) => {
      const elem = invalidConfig.getRoot(component).getOr(component.element);
      remove$2(elem, invalidConfig.invalidClass);
      invalidConfig.notify.each(notifyInfo => {
        if (isAriaElement(component.element)) {
          set$9(component.element, 'aria-invalid', false);
        }
        notifyInfo.getContainer(component).each(container => {
          set$6(container, notifyInfo.validHtml);
        });
        notifyInfo.onValid(component);
      });
    };
    const markInvalid = (component, invalidConfig, invalidState, text) => {
      const elem = invalidConfig.getRoot(component).getOr(component.element);
      add$2(elem, invalidConfig.invalidClass);
      invalidConfig.notify.each(notifyInfo => {
        if (isAriaElement(component.element)) {
          set$9(component.element, 'aria-invalid', true);
        }
        notifyInfo.getContainer(component).each(container => {
          set$6(container, text);
        });
        notifyInfo.onInvalid(component, text);
      });
    };
    const query = (component, invalidConfig, _invalidState) => invalidConfig.validator.fold(() => Future.pure(Result.value(true)), validatorInfo => validatorInfo.validate(component));
    const run = (component, invalidConfig, invalidState) => {
      invalidConfig.notify.each(notifyInfo => {
        notifyInfo.onValidate(component);
      });
      return query(component, invalidConfig).map(valid => {
        if (component.getSystem().isConnected()) {
          return valid.fold(err => {
            markInvalid(component, invalidConfig, invalidState, err);
            return Result.error(err);
          }, v => {
            markValid(component, invalidConfig);
            return Result.value(v);
          });
        } else {
          return Result.error('No longer in system');
        }
      });
    };
    const isInvalid = (component, invalidConfig) => {
      const elem = invalidConfig.getRoot(component).getOr(component.element);
      return has(elem, invalidConfig.invalidClass);
    };

    var InvalidateApis = /*#__PURE__*/Object.freeze({
        __proto__: null,
        markValid: markValid,
        markInvalid: markInvalid,
        query: query,
        run: run,
        isInvalid: isInvalid
    });

    const events$8 = (invalidConfig, invalidState) => invalidConfig.validator.map(validatorInfo => derive$2([run$1(validatorInfo.onEvent, component => {
        run(component, invalidConfig, invalidState).get(identity);
      })].concat(validatorInfo.validateOnLoad ? [runOnAttached(component => {
        run(component, invalidConfig, invalidState).get(noop);
      })] : []))).getOr({});

    var ActiveInvalidate = /*#__PURE__*/Object.freeze({
        __proto__: null,
        events: events$8
    });

    var InvalidateSchema = [
      required$1('invalidClass'),
      defaulted('getRoot', Optional.none),
      optionObjOf('notify', [
        defaulted('aria', 'alert'),
        defaulted('getContainer', Optional.none),
        defaulted('validHtml', ''),
        onHandler('onValid'),
        onHandler('onInvalid'),
        onHandler('onValidate')
      ]),
      optionObjOf('validator', [
        required$1('validate'),
        defaulted('onEvent', 'input'),
        defaulted('validateOnLoad', true)
      ])
    ];

    const Invalidating = create$3({
      fields: InvalidateSchema,
      name: 'invalidating',
      active: ActiveInvalidate,
      apis: InvalidateApis,
      extra: {
        validation: validator => {
          return component => {
            const v = Representing.getValue(component);
            return Future.pure(validator(v));
          };
        }
      }
    });

    const exhibit$1 = () => nu$7({
      styles: {
        '-webkit-user-select': 'none',
        'user-select': 'none',
        '-ms-user-select': 'none',
        '-moz-user-select': '-moz-none'
      },
      attributes: { unselectable: 'on' }
    });
    const events$7 = () => derive$2([abort(selectstart(), always)]);

    var ActiveUnselecting = /*#__PURE__*/Object.freeze({
        __proto__: null,
        events: events$7,
        exhibit: exhibit$1
    });

    const Unselecting = create$3({
      fields: [],
      name: 'unselecting',
      active: ActiveUnselecting
    });

    const renderPanelButton = (spec, sharedBackstage) => Dropdown.sketch({
      dom: spec.dom,
      components: spec.components,
      toggleClass: 'mce-active',
      dropdownBehaviours: derive$1([
        DisablingConfigs.button(sharedBackstage.providers.isDisabled),
        receivingConfig(),
        Unselecting.config({}),
        Tabstopping.config({})
      ]),
      layouts: spec.layouts,
      sandboxClasses: ['tox-dialog__popups'],
      lazySink: sharedBackstage.getSink,
      fetch: comp => Future.nu(callback => spec.fetch(callback)).map(items => Optional.from(createTieredDataFrom(deepMerge(createPartialChoiceMenu(generate$6('menu-value'), items, value => {
        spec.onItemAction(comp, value);
      }, spec.columns, spec.presets, ItemResponse$1.CLOSE_ON_EXECUTE, never, sharedBackstage.providers), { movement: deriveMenuMovement(spec.columns, spec.presets) })))),
      parts: { menu: part(false, 1, spec.presets) }
    });

    const colorInputChangeEvent = generate$6('color-input-change');
    const colorSwatchChangeEvent = generate$6('color-swatch-change');
    const colorPickerCancelEvent = generate$6('color-picker-cancel');
    const renderColorInput = (spec, sharedBackstage, colorInputBackstage, initialData) => {
      const pField = FormField.parts.field({
        factory: Input,
        inputClasses: ['tox-textfield'],
        data: initialData,
        onSetValue: c => Invalidating.run(c).get(noop),
        inputBehaviours: derive$1([
          Disabling.config({ disabled: sharedBackstage.providers.isDisabled }),
          receivingConfig(),
          Tabstopping.config({}),
          Invalidating.config({
            invalidClass: 'tox-textbox-field-invalid',
            getRoot: comp => parentElement(comp.element),
            notify: {
              onValid: comp => {
                const val = Representing.getValue(comp);
                emitWith(comp, colorInputChangeEvent, { color: val });
              }
            },
            validator: {
              validateOnLoad: false,
              validate: input => {
                const inputValue = Representing.getValue(input);
                if (inputValue.length === 0) {
                  return Future.pure(Result.value(true));
                } else {
                  const span = SugarElement.fromTag('span');
                  set$8(span, 'background-color', inputValue);
                  const res = getRaw(span, 'background-color').fold(() => Result.error('blah'), _ => Result.value(inputValue));
                  return Future.pure(res);
                }
              }
            }
          })
        ]),
        selectOnFocus: false
      });
      const pLabel = spec.label.map(label => renderLabel$2(label, sharedBackstage.providers));
      const emitSwatchChange = (colorBit, value) => {
        emitWith(colorBit, colorSwatchChangeEvent, { value });
      };
      const onItemAction = (comp, value) => {
        memColorButton.getOpt(comp).each(colorBit => {
          if (value === 'custom') {
            colorInputBackstage.colorPicker(valueOpt => {
              valueOpt.fold(() => emit(colorBit, colorPickerCancelEvent), value => {
                emitSwatchChange(colorBit, value);
                addColor(value);
              });
            }, '#ffffff');
          } else if (value === 'remove') {
            emitSwatchChange(colorBit, '');
          } else {
            emitSwatchChange(colorBit, value);
          }
        });
      };
      const memColorButton = record(renderPanelButton({
        dom: {
          tag: 'span',
          attributes: { 'aria-label': sharedBackstage.providers.translate('Color swatch') }
        },
        layouts: {
          onRtl: () => [
            southwest$2,
            southeast$2,
            south$2
          ],
          onLtr: () => [
            southeast$2,
            southwest$2,
            south$2
          ]
        },
        components: [],
        fetch: getFetch$1(colorInputBackstage.getColors(), colorInputBackstage.hasCustomColors()),
        columns: colorInputBackstage.getColorCols(),
        presets: 'color',
        onItemAction
      }, sharedBackstage));
      return FormField.sketch({
        dom: {
          tag: 'div',
          classes: ['tox-form__group']
        },
        components: pLabel.toArray().concat([{
            dom: {
              tag: 'div',
              classes: ['tox-color-input']
            },
            components: [
              pField,
              memColorButton.asSpec()
            ]
          }]),
        fieldBehaviours: derive$1([config('form-field-events', [
            run$1(colorInputChangeEvent, (comp, se) => {
              memColorButton.getOpt(comp).each(colorButton => {
                set$8(colorButton.element, 'background-color', se.event.color);
              });
              emitWith(comp, formChangeEvent, { name: spec.name });
            }),
            run$1(colorSwatchChangeEvent, (comp, se) => {
              FormField.getField(comp).each(field => {
                Representing.setValue(field, se.event.value);
                Composing.getCurrent(comp).each(Focusing.focus);
              });
            }),
            run$1(colorPickerCancelEvent, (comp, _se) => {
              FormField.getField(comp).each(_field => {
                Composing.getCurrent(comp).each(Focusing.focus);
              });
            })
          ])])
      });
    };

    const labelPart = optional({
      schema: [required$1('dom')],
      name: 'label'
    });
    const edgePart = name => optional({
      name: '' + name + '-edge',
      overrides: detail => {
        const action = detail.model.manager.edgeActions[name];
        return action.fold(() => ({}), a => ({
          events: derive$2([
            runActionExtra(touchstart(), (comp, se, d) => a(comp, d), [detail]),
            runActionExtra(mousedown(), (comp, se, d) => a(comp, d), [detail]),
            runActionExtra(mousemove(), (comp, se, det) => {
              if (det.mouseIsDown.get()) {
                a(comp, det);
              }
            }, [detail])
          ])
        }));
      }
    });
    const tlEdgePart = edgePart('top-left');
    const tedgePart = edgePart('top');
    const trEdgePart = edgePart('top-right');
    const redgePart = edgePart('right');
    const brEdgePart = edgePart('bottom-right');
    const bedgePart = edgePart('bottom');
    const blEdgePart = edgePart('bottom-left');
    const ledgePart = edgePart('left');
    const thumbPart = required({
      name: 'thumb',
      defaults: constant$1({ dom: { styles: { position: 'absolute' } } }),
      overrides: detail => {
        return {
          events: derive$2([
            redirectToPart(touchstart(), detail, 'spectrum'),
            redirectToPart(touchmove(), detail, 'spectrum'),
            redirectToPart(touchend(), detail, 'spectrum'),
            redirectToPart(mousedown(), detail, 'spectrum'),
            redirectToPart(mousemove(), detail, 'spectrum'),
            redirectToPart(mouseup(), detail, 'spectrum')
          ])
        };
      }
    });
    const spectrumPart = required({
      schema: [customField('mouseIsDown', () => Cell(false))],
      name: 'spectrum',
      overrides: detail => {
        const modelDetail = detail.model;
        const model = modelDetail.manager;
        const setValueFrom = (component, simulatedEvent) => model.getValueFromEvent(simulatedEvent).map(value => model.setValueFrom(component, detail, value));
        return {
          behaviours: derive$1([
            Keying.config({
              mode: 'special',
              onLeft: spectrum => model.onLeft(spectrum, detail),
              onRight: spectrum => model.onRight(spectrum, detail),
              onUp: spectrum => model.onUp(spectrum, detail),
              onDown: spectrum => model.onDown(spectrum, detail)
            }),
            Focusing.config({})
          ]),
          events: derive$2([
            run$1(touchstart(), setValueFrom),
            run$1(touchmove(), setValueFrom),
            run$1(mousedown(), setValueFrom),
            run$1(mousemove(), (spectrum, se) => {
              if (detail.mouseIsDown.get()) {
                setValueFrom(spectrum, se);
              }
            })
          ])
        };
      }
    });
    var SliderParts = [
      labelPart,
      ledgePart,
      redgePart,
      tedgePart,
      bedgePart,
      tlEdgePart,
      trEdgePart,
      blEdgePart,
      brEdgePart,
      thumbPart,
      spectrumPart
    ];

    const _sliderChangeEvent = 'slider.change.value';
    const sliderChangeEvent = constant$1(_sliderChangeEvent);
    const isTouchEvent$2 = evt => evt.type.indexOf('touch') !== -1;
    const getEventSource = simulatedEvent => {
      const evt = simulatedEvent.event.raw;
      if (isTouchEvent$2(evt)) {
        const touchEvent = evt;
        return touchEvent.touches !== undefined && touchEvent.touches.length === 1 ? Optional.some(touchEvent.touches[0]).map(t => SugarPosition(t.clientX, t.clientY)) : Optional.none();
      } else {
        const mouseEvent = evt;
        return mouseEvent.clientX !== undefined ? Optional.some(mouseEvent).map(me => SugarPosition(me.clientX, me.clientY)) : Optional.none();
      }
    };

    const t = 'top', r = 'right', b = 'bottom', l = 'left';
    const minX = detail => detail.model.minX;
    const minY = detail => detail.model.minY;
    const min1X = detail => detail.model.minX - 1;
    const min1Y = detail => detail.model.minY - 1;
    const maxX = detail => detail.model.maxX;
    const maxY = detail => detail.model.maxY;
    const max1X = detail => detail.model.maxX + 1;
    const max1Y = detail => detail.model.maxY + 1;
    const range = (detail, max, min) => max(detail) - min(detail);
    const xRange = detail => range(detail, maxX, minX);
    const yRange = detail => range(detail, maxY, minY);
    const halfX = detail => xRange(detail) / 2;
    const halfY = detail => yRange(detail) / 2;
    const step = detail => detail.stepSize;
    const snap = detail => detail.snapToGrid;
    const snapStart = detail => detail.snapStart;
    const rounded = detail => detail.rounded;
    const hasEdge = (detail, edgeName) => detail[edgeName + '-edge'] !== undefined;
    const hasLEdge = detail => hasEdge(detail, l);
    const hasREdge = detail => hasEdge(detail, r);
    const hasTEdge = detail => hasEdge(detail, t);
    const hasBEdge = detail => hasEdge(detail, b);
    const currentValue = detail => detail.model.value.get();

    const xyValue = (x, y) => ({
      x,
      y
    });
    const fireSliderChange$3 = (component, value) => {
      emitWith(component, sliderChangeEvent(), { value });
    };
    const setToTLEdgeXY = (edge, detail) => {
      fireSliderChange$3(edge, xyValue(min1X(detail), min1Y(detail)));
    };
    const setToTEdge = (edge, detail) => {
      fireSliderChange$3(edge, min1Y(detail));
    };
    const setToTEdgeXY = (edge, detail) => {
      fireSliderChange$3(edge, xyValue(halfX(detail), min1Y(detail)));
    };
    const setToTREdgeXY = (edge, detail) => {
      fireSliderChange$3(edge, xyValue(max1X(detail), min1Y(detail)));
    };
    const setToREdge = (edge, detail) => {
      fireSliderChange$3(edge, max1X(detail));
    };
    const setToREdgeXY = (edge, detail) => {
      fireSliderChange$3(edge, xyValue(max1X(detail), halfY(detail)));
    };
    const setToBREdgeXY = (edge, detail) => {
      fireSliderChange$3(edge, xyValue(max1X(detail), max1Y(detail)));
    };
    const setToBEdge = (edge, detail) => {
      fireSliderChange$3(edge, max1Y(detail));
    };
    const setToBEdgeXY = (edge, detail) => {
      fireSliderChange$3(edge, xyValue(halfX(detail), max1Y(detail)));
    };
    const setToBLEdgeXY = (edge, detail) => {
      fireSliderChange$3(edge, xyValue(min1X(detail), max1Y(detail)));
    };
    const setToLEdge = (edge, detail) => {
      fireSliderChange$3(edge, min1X(detail));
    };
    const setToLEdgeXY = (edge, detail) => {
      fireSliderChange$3(edge, xyValue(min1X(detail), halfY(detail)));
    };

    const reduceBy = (value, min, max, step) => {
      if (value < min) {
        return value;
      } else if (value > max) {
        return max;
      } else if (value === min) {
        return min - 1;
      } else {
        return Math.max(min, value - step);
      }
    };
    const increaseBy = (value, min, max, step) => {
      if (value > max) {
        return value;
      } else if (value < min) {
        return min;
      } else if (value === max) {
        return max + 1;
      } else {
        return Math.min(max, value + step);
      }
    };
    const capValue = (value, min, max) => Math.max(min, Math.min(max, value));
    const snapValueOf = (value, min, max, step, snapStart) => snapStart.fold(() => {
      const initValue = value - min;
      const extraValue = Math.round(initValue / step) * step;
      return capValue(min + extraValue, min - 1, max + 1);
    }, start => {
      const remainder = (value - start) % step;
      const adjustment = Math.round(remainder / step);
      const rawSteps = Math.floor((value - start) / step);
      const maxSteps = Math.floor((max - start) / step);
      const numSteps = Math.min(maxSteps, rawSteps + adjustment);
      const r = start + numSteps * step;
      return Math.max(start, r);
    });
    const findOffsetOf = (value, min, max) => Math.min(max, Math.max(value, min)) - min;
    const findValueOf = args => {
      const {min, max, range, value, step, snap, snapStart, rounded, hasMinEdge, hasMaxEdge, minBound, maxBound, screenRange} = args;
      const capMin = hasMinEdge ? min - 1 : min;
      const capMax = hasMaxEdge ? max + 1 : max;
      if (value < minBound) {
        return capMin;
      } else if (value > maxBound) {
        return capMax;
      } else {
        const offset = findOffsetOf(value, minBound, maxBound);
        const newValue = capValue(offset / screenRange * range + min, capMin, capMax);
        if (snap && newValue >= min && newValue <= max) {
          return snapValueOf(newValue, min, max, step, snapStart);
        } else if (rounded) {
          return Math.round(newValue);
        } else {
          return newValue;
        }
      }
    };
    const findOffsetOfValue$2 = args => {
      const {min, max, range, value, hasMinEdge, hasMaxEdge, maxBound, maxOffset, centerMinEdge, centerMaxEdge} = args;
      if (value < min) {
        return hasMinEdge ? 0 : centerMinEdge;
      } else if (value > max) {
        return hasMaxEdge ? maxBound : centerMaxEdge;
      } else {
        return (value - min) / range * maxOffset;
      }
    };

    const top = 'top', right = 'right', bottom = 'bottom', left = 'left', width = 'width', height = 'height';
    const getBounds = component => component.element.dom.getBoundingClientRect();
    const getBoundsProperty = (bounds, property) => bounds[property];
    const getMinXBounds = component => {
      const bounds = getBounds(component);
      return getBoundsProperty(bounds, left);
    };
    const getMaxXBounds = component => {
      const bounds = getBounds(component);
      return getBoundsProperty(bounds, right);
    };
    const getMinYBounds = component => {
      const bounds = getBounds(component);
      return getBoundsProperty(bounds, top);
    };
    const getMaxYBounds = component => {
      const bounds = getBounds(component);
      return getBoundsProperty(bounds, bottom);
    };
    const getXScreenRange = component => {
      const bounds = getBounds(component);
      return getBoundsProperty(bounds, width);
    };
    const getYScreenRange = component => {
      const bounds = getBounds(component);
      return getBoundsProperty(bounds, height);
    };
    const getCenterOffsetOf = (componentMinEdge, componentMaxEdge, spectrumMinEdge) => (componentMinEdge + componentMaxEdge) / 2 - spectrumMinEdge;
    const getXCenterOffSetOf = (component, spectrum) => {
      const componentBounds = getBounds(component);
      const spectrumBounds = getBounds(spectrum);
      const componentMinEdge = getBoundsProperty(componentBounds, left);
      const componentMaxEdge = getBoundsProperty(componentBounds, right);
      const spectrumMinEdge = getBoundsProperty(spectrumBounds, left);
      return getCenterOffsetOf(componentMinEdge, componentMaxEdge, spectrumMinEdge);
    };
    const getYCenterOffSetOf = (component, spectrum) => {
      const componentBounds = getBounds(component);
      const spectrumBounds = getBounds(spectrum);
      const componentMinEdge = getBoundsProperty(componentBounds, top);
      const componentMaxEdge = getBoundsProperty(componentBounds, bottom);
      const spectrumMinEdge = getBoundsProperty(spectrumBounds, top);
      return getCenterOffsetOf(componentMinEdge, componentMaxEdge, spectrumMinEdge);
    };

    const fireSliderChange$2 = (spectrum, value) => {
      emitWith(spectrum, sliderChangeEvent(), { value });
    };
    const findValueOfOffset$1 = (spectrum, detail, left) => {
      const args = {
        min: minX(detail),
        max: maxX(detail),
        range: xRange(detail),
        value: left,
        step: step(detail),
        snap: snap(detail),
        snapStart: snapStart(detail),
        rounded: rounded(detail),
        hasMinEdge: hasLEdge(detail),
        hasMaxEdge: hasREdge(detail),
        minBound: getMinXBounds(spectrum),
        maxBound: getMaxXBounds(spectrum),
        screenRange: getXScreenRange(spectrum)
      };
      return findValueOf(args);
    };
    const setValueFrom$2 = (spectrum, detail, value) => {
      const xValue = findValueOfOffset$1(spectrum, detail, value);
      const sliderVal = xValue;
      fireSliderChange$2(spectrum, sliderVal);
      return xValue;
    };
    const setToMin$2 = (spectrum, detail) => {
      const min = minX(detail);
      fireSliderChange$2(spectrum, min);
    };
    const setToMax$2 = (spectrum, detail) => {
      const max = maxX(detail);
      fireSliderChange$2(spectrum, max);
    };
    const moveBy$2 = (direction, spectrum, detail) => {
      const f = direction > 0 ? increaseBy : reduceBy;
      const xValue = f(currentValue(detail), minX(detail), maxX(detail), step(detail));
      fireSliderChange$2(spectrum, xValue);
      return Optional.some(xValue);
    };
    const handleMovement$2 = direction => (spectrum, detail) => moveBy$2(direction, spectrum, detail).map(always);
    const getValueFromEvent$2 = simulatedEvent => {
      const pos = getEventSource(simulatedEvent);
      return pos.map(p => p.left);
    };
    const findOffsetOfValue$1 = (spectrum, detail, value, minEdge, maxEdge) => {
      const minOffset = 0;
      const maxOffset = getXScreenRange(spectrum);
      const centerMinEdge = minEdge.bind(edge => Optional.some(getXCenterOffSetOf(edge, spectrum))).getOr(minOffset);
      const centerMaxEdge = maxEdge.bind(edge => Optional.some(getXCenterOffSetOf(edge, spectrum))).getOr(maxOffset);
      const args = {
        min: minX(detail),
        max: maxX(detail),
        range: xRange(detail),
        value,
        hasMinEdge: hasLEdge(detail),
        hasMaxEdge: hasREdge(detail),
        minBound: getMinXBounds(spectrum),
        minOffset,
        maxBound: getMaxXBounds(spectrum),
        maxOffset,
        centerMinEdge,
        centerMaxEdge
      };
      return findOffsetOfValue$2(args);
    };
    const findPositionOfValue$1 = (slider, spectrum, value, minEdge, maxEdge, detail) => {
      const offset = findOffsetOfValue$1(spectrum, detail, value, minEdge, maxEdge);
      return getMinXBounds(spectrum) - getMinXBounds(slider) + offset;
    };
    const setPositionFromValue$2 = (slider, thumb, detail, edges) => {
      const value = currentValue(detail);
      const pos = findPositionOfValue$1(slider, edges.getSpectrum(slider), value, edges.getLeftEdge(slider), edges.getRightEdge(slider), detail);
      const thumbRadius = get$c(thumb.element) / 2;
      set$8(thumb.element, 'left', pos - thumbRadius + 'px');
    };
    const onLeft$2 = handleMovement$2(-1);
    const onRight$2 = handleMovement$2(1);
    const onUp$2 = Optional.none;
    const onDown$2 = Optional.none;
    const edgeActions$2 = {
      'top-left': Optional.none(),
      'top': Optional.none(),
      'top-right': Optional.none(),
      'right': Optional.some(setToREdge),
      'bottom-right': Optional.none(),
      'bottom': Optional.none(),
      'bottom-left': Optional.none(),
      'left': Optional.some(setToLEdge)
    };

    var HorizontalModel = /*#__PURE__*/Object.freeze({
        __proto__: null,
        setValueFrom: setValueFrom$2,
        setToMin: setToMin$2,
        setToMax: setToMax$2,
        findValueOfOffset: findValueOfOffset$1,
        getValueFromEvent: getValueFromEvent$2,
        findPositionOfValue: findPositionOfValue$1,
        setPositionFromValue: setPositionFromValue$2,
        onLeft: onLeft$2,
        onRight: onRight$2,
        onUp: onUp$2,
        onDown: onDown$2,
        edgeActions: edgeActions$2
    });

    const fireSliderChange$1 = (spectrum, value) => {
      emitWith(spectrum, sliderChangeEvent(), { value });
    };
    const findValueOfOffset = (spectrum, detail, top) => {
      const args = {
        min: minY(detail),
        max: maxY(detail),
        range: yRange(detail),
        value: top,
        step: step(detail),
        snap: snap(detail),
        snapStart: snapStart(detail),
        rounded: rounded(detail),
        hasMinEdge: hasTEdge(detail),
        hasMaxEdge: hasBEdge(detail),
        minBound: getMinYBounds(spectrum),
        maxBound: getMaxYBounds(spectrum),
        screenRange: getYScreenRange(spectrum)
      };
      return findValueOf(args);
    };
    const setValueFrom$1 = (spectrum, detail, value) => {
      const yValue = findValueOfOffset(spectrum, detail, value);
      const sliderVal = yValue;
      fireSliderChange$1(spectrum, sliderVal);
      return yValue;
    };
    const setToMin$1 = (spectrum, detail) => {
      const min = minY(detail);
      fireSliderChange$1(spectrum, min);
    };
    const setToMax$1 = (spectrum, detail) => {
      const max = maxY(detail);
      fireSliderChange$1(spectrum, max);
    };
    const moveBy$1 = (direction, spectrum, detail) => {
      const f = direction > 0 ? increaseBy : reduceBy;
      const yValue = f(currentValue(detail), minY(detail), maxY(detail), step(detail));
      fireSliderChange$1(spectrum, yValue);
      return Optional.some(yValue);
    };
    const handleMovement$1 = direction => (spectrum, detail) => moveBy$1(direction, spectrum, detail).map(always);
    const getValueFromEvent$1 = simulatedEvent => {
      const pos = getEventSource(simulatedEvent);
      return pos.map(p => {
        return p.top;
      });
    };
    const findOffsetOfValue = (spectrum, detail, value, minEdge, maxEdge) => {
      const minOffset = 0;
      const maxOffset = getYScreenRange(spectrum);
      const centerMinEdge = minEdge.bind(edge => Optional.some(getYCenterOffSetOf(edge, spectrum))).getOr(minOffset);
      const centerMaxEdge = maxEdge.bind(edge => Optional.some(getYCenterOffSetOf(edge, spectrum))).getOr(maxOffset);
      const args = {
        min: minY(detail),
        max: maxY(detail),
        range: yRange(detail),
        value,
        hasMinEdge: hasTEdge(detail),
        hasMaxEdge: hasBEdge(detail),
        minBound: getMinYBounds(spectrum),
        minOffset,
        maxBound: getMaxYBounds(spectrum),
        maxOffset,
        centerMinEdge,
        centerMaxEdge
      };
      return findOffsetOfValue$2(args);
    };
    const findPositionOfValue = (slider, spectrum, value, minEdge, maxEdge, detail) => {
      const offset = findOffsetOfValue(spectrum, detail, value, minEdge, maxEdge);
      return getMinYBounds(spectrum) - getMinYBounds(slider) + offset;
    };
    const setPositionFromValue$1 = (slider, thumb, detail, edges) => {
      const value = currentValue(detail);
      const pos = findPositionOfValue(slider, edges.getSpectrum(slider), value, edges.getTopEdge(slider), edges.getBottomEdge(slider), detail);
      const thumbRadius = get$d(thumb.element) / 2;
      set$8(thumb.element, 'top', pos - thumbRadius + 'px');
    };
    const onLeft$1 = Optional.none;
    const onRight$1 = Optional.none;
    const onUp$1 = handleMovement$1(-1);
    const onDown$1 = handleMovement$1(1);
    const edgeActions$1 = {
      'top-left': Optional.none(),
      'top': Optional.some(setToTEdge),
      'top-right': Optional.none(),
      'right': Optional.none(),
      'bottom-right': Optional.none(),
      'bottom': Optional.some(setToBEdge),
      'bottom-left': Optional.none(),
      'left': Optional.none()
    };

    var VerticalModel = /*#__PURE__*/Object.freeze({
        __proto__: null,
        setValueFrom: setValueFrom$1,
        setToMin: setToMin$1,
        setToMax: setToMax$1,
        findValueOfOffset: findValueOfOffset,
        getValueFromEvent: getValueFromEvent$1,
        findPositionOfValue: findPositionOfValue,
        setPositionFromValue: setPositionFromValue$1,
        onLeft: onLeft$1,
        onRight: onRight$1,
        onUp: onUp$1,
        onDown: onDown$1,
        edgeActions: edgeActions$1
    });

    const fireSliderChange = (spectrum, value) => {
      emitWith(spectrum, sliderChangeEvent(), { value });
    };
    const sliderValue = (x, y) => ({
      x,
      y
    });
    const setValueFrom = (spectrum, detail, value) => {
      const xValue = findValueOfOffset$1(spectrum, detail, value.left);
      const yValue = findValueOfOffset(spectrum, detail, value.top);
      const val = sliderValue(xValue, yValue);
      fireSliderChange(spectrum, val);
      return val;
    };
    const moveBy = (direction, isVerticalMovement, spectrum, detail) => {
      const f = direction > 0 ? increaseBy : reduceBy;
      const xValue = isVerticalMovement ? currentValue(detail).x : f(currentValue(detail).x, minX(detail), maxX(detail), step(detail));
      const yValue = !isVerticalMovement ? currentValue(detail).y : f(currentValue(detail).y, minY(detail), maxY(detail), step(detail));
      fireSliderChange(spectrum, sliderValue(xValue, yValue));
      return Optional.some(xValue);
    };
    const handleMovement = (direction, isVerticalMovement) => (spectrum, detail) => moveBy(direction, isVerticalMovement, spectrum, detail).map(always);
    const setToMin = (spectrum, detail) => {
      const mX = minX(detail);
      const mY = minY(detail);
      fireSliderChange(spectrum, sliderValue(mX, mY));
    };
    const setToMax = (spectrum, detail) => {
      const mX = maxX(detail);
      const mY = maxY(detail);
      fireSliderChange(spectrum, sliderValue(mX, mY));
    };
    const getValueFromEvent = simulatedEvent => getEventSource(simulatedEvent);
    const setPositionFromValue = (slider, thumb, detail, edges) => {
      const value = currentValue(detail);
      const xPos = findPositionOfValue$1(slider, edges.getSpectrum(slider), value.x, edges.getLeftEdge(slider), edges.getRightEdge(slider), detail);
      const yPos = findPositionOfValue(slider, edges.getSpectrum(slider), value.y, edges.getTopEdge(slider), edges.getBottomEdge(slider), detail);
      const thumbXRadius = get$c(thumb.element) / 2;
      const thumbYRadius = get$d(thumb.element) / 2;
      set$8(thumb.element, 'left', xPos - thumbXRadius + 'px');
      set$8(thumb.element, 'top', yPos - thumbYRadius + 'px');
    };
    const onLeft = handleMovement(-1, false);
    const onRight = handleMovement(1, false);
    const onUp = handleMovement(-1, true);
    const onDown = handleMovement(1, true);
    const edgeActions = {
      'top-left': Optional.some(setToTLEdgeXY),
      'top': Optional.some(setToTEdgeXY),
      'top-right': Optional.some(setToTREdgeXY),
      'right': Optional.some(setToREdgeXY),
      'bottom-right': Optional.some(setToBREdgeXY),
      'bottom': Optional.some(setToBEdgeXY),
      'bottom-left': Optional.some(setToBLEdgeXY),
      'left': Optional.some(setToLEdgeXY)
    };

    var TwoDModel = /*#__PURE__*/Object.freeze({
        __proto__: null,
        setValueFrom: setValueFrom,
        setToMin: setToMin,
        setToMax: setToMax,
        getValueFromEvent: getValueFromEvent,
        setPositionFromValue: setPositionFromValue,
        onLeft: onLeft,
        onRight: onRight,
        onUp: onUp,
        onDown: onDown,
        edgeActions: edgeActions
    });

    const SliderSchema = [
      defaulted('stepSize', 1),
      defaulted('onChange', noop),
      defaulted('onChoose', noop),
      defaulted('onInit', noop),
      defaulted('onDragStart', noop),
      defaulted('onDragEnd', noop),
      defaulted('snapToGrid', false),
      defaulted('rounded', true),
      option$3('snapStart'),
      requiredOf('model', choose$1('mode', {
        x: [
          defaulted('minX', 0),
          defaulted('maxX', 100),
          customField('value', spec => Cell(spec.mode.minX)),
          required$1('getInitialValue'),
          output$1('manager', HorizontalModel)
        ],
        y: [
          defaulted('minY', 0),
          defaulted('maxY', 100),
          customField('value', spec => Cell(spec.mode.minY)),
          required$1('getInitialValue'),
          output$1('manager', VerticalModel)
        ],
        xy: [
          defaulted('minX', 0),
          defaulted('maxX', 100),
          defaulted('minY', 0),
          defaulted('maxY', 100),
          customField('value', spec => Cell({
            x: spec.mode.minX,
            y: spec.mode.minY
          })),
          required$1('getInitialValue'),
          output$1('manager', TwoDModel)
        ]
      })),
      field('sliderBehaviours', [
        Keying,
        Representing
      ]),
      customField('mouseIsDown', () => Cell(false))
    ];

    const sketch$2 = (detail, components, _spec, _externals) => {
      const getThumb = component => getPartOrDie(component, detail, 'thumb');
      const getSpectrum = component => getPartOrDie(component, detail, 'spectrum');
      const getLeftEdge = component => getPart(component, detail, 'left-edge');
      const getRightEdge = component => getPart(component, detail, 'right-edge');
      const getTopEdge = component => getPart(component, detail, 'top-edge');
      const getBottomEdge = component => getPart(component, detail, 'bottom-edge');
      const modelDetail = detail.model;
      const model = modelDetail.manager;
      const refresh = (slider, thumb) => {
        model.setPositionFromValue(slider, thumb, detail, {
          getLeftEdge,
          getRightEdge,
          getTopEdge,
          getBottomEdge,
          getSpectrum
        });
      };
      const setValue = (slider, newValue) => {
        modelDetail.value.set(newValue);
        const thumb = getThumb(slider);
        refresh(slider, thumb);
      };
      const changeValue = (slider, newValue) => {
        setValue(slider, newValue);
        const thumb = getThumb(slider);
        detail.onChange(slider, thumb, newValue);
        return Optional.some(true);
      };
      const resetToMin = slider => {
        model.setToMin(slider, detail);
      };
      const resetToMax = slider => {
        model.setToMax(slider, detail);
      };
      const choose = slider => {
        const fireOnChoose = () => {
          getPart(slider, detail, 'thumb').each(thumb => {
            const value = modelDetail.value.get();
            detail.onChoose(slider, thumb, value);
          });
        };
        const wasDown = detail.mouseIsDown.get();
        detail.mouseIsDown.set(false);
        if (wasDown) {
          fireOnChoose();
        }
      };
      const onDragStart = (slider, simulatedEvent) => {
        simulatedEvent.stop();
        detail.mouseIsDown.set(true);
        detail.onDragStart(slider, getThumb(slider));
      };
      const onDragEnd = (slider, simulatedEvent) => {
        simulatedEvent.stop();
        detail.onDragEnd(slider, getThumb(slider));
        choose(slider);
      };
      return {
        uid: detail.uid,
        dom: detail.dom,
        components,
        behaviours: augment(detail.sliderBehaviours, [
          Keying.config({
            mode: 'special',
            focusIn: slider => {
              return getPart(slider, detail, 'spectrum').map(Keying.focusIn).map(always);
            }
          }),
          Representing.config({
            store: {
              mode: 'manual',
              getValue: _ => {
                return modelDetail.value.get();
              },
              setValue
            }
          }),
          Receiving.config({ channels: { [mouseReleased()]: { onReceive: choose } } })
        ]),
        events: derive$2([
          run$1(sliderChangeEvent(), (slider, simulatedEvent) => {
            changeValue(slider, simulatedEvent.event.value);
          }),
          runOnAttached((slider, _simulatedEvent) => {
            const getInitial = modelDetail.getInitialValue();
            modelDetail.value.set(getInitial);
            const thumb = getThumb(slider);
            refresh(slider, thumb);
            const spectrum = getSpectrum(slider);
            detail.onInit(slider, thumb, spectrum, modelDetail.value.get());
          }),
          run$1(touchstart(), onDragStart),
          run$1(touchend(), onDragEnd),
          run$1(mousedown(), onDragStart),
          run$1(mouseup(), onDragEnd)
        ]),
        apis: {
          resetToMin,
          resetToMax,
          setValue,
          refresh
        },
        domModification: { styles: { position: 'relative' } }
      };
    };

    const Slider = composite({
      name: 'Slider',
      configFields: SliderSchema,
      partFields: SliderParts,
      factory: sketch$2,
      apis: {
        setValue: (apis, slider, value) => {
          apis.setValue(slider, value);
        },
        resetToMin: (apis, slider) => {
          apis.resetToMin(slider);
        },
        resetToMax: (apis, slider) => {
          apis.resetToMax(slider);
        },
        refresh: (apis, slider) => {
          apis.refresh(slider);
        }
      }
    });

    const fieldsUpdate = generate$6('rgb-hex-update');
    const sliderUpdate = generate$6('slider-update');
    const paletteUpdate = generate$6('palette-update');

    const sliderFactory = (translate, getClass) => {
      const spectrum = Slider.parts.spectrum({
        dom: {
          tag: 'div',
          classes: [getClass('hue-slider-spectrum')],
          attributes: { role: 'presentation' }
        }
      });
      const thumb = Slider.parts.thumb({
        dom: {
          tag: 'div',
          classes: [getClass('hue-slider-thumb')],
          attributes: { role: 'presentation' }
        }
      });
      return Slider.sketch({
        dom: {
          tag: 'div',
          classes: [getClass('hue-slider')],
          attributes: { role: 'presentation' }
        },
        rounded: false,
        model: {
          mode: 'y',
          getInitialValue: constant$1(0)
        },
        components: [
          spectrum,
          thumb
        ],
        sliderBehaviours: derive$1([Focusing.config({})]),
        onChange: (slider, _thumb, value) => {
          emitWith(slider, sliderUpdate, { value });
        }
      });
    };

    const owner$1 = 'form';
    const schema$i = [field('formBehaviours', [Representing])];
    const getPartName$1 = name => '<alloy.field.' + name + '>';
    const sketch$1 = fSpec => {
      const parts = (() => {
        const record = [];
        const field = (name, config) => {
          record.push(name);
          return generateOne$1(owner$1, getPartName$1(name), config);
        };
        return {
          field,
          record: constant$1(record)
        };
      })();
      const spec = fSpec(parts);
      const partNames = parts.record();
      const fieldParts = map$2(partNames, n => required({
        name: n,
        pname: getPartName$1(n)
      }));
      return composite$1(owner$1, schema$i, fieldParts, make$4, spec);
    };
    const toResult = (o, e) => o.fold(() => Result.error(e), Result.value);
    const make$4 = (detail, components) => ({
      uid: detail.uid,
      dom: detail.dom,
      components,
      behaviours: augment(detail.formBehaviours, [Representing.config({
          store: {
            mode: 'manual',
            getValue: form => {
              const resPs = getAllParts(form, detail);
              return map$1(resPs, (resPThunk, pName) => resPThunk().bind(v => {
                const opt = Composing.getCurrent(v);
                return toResult(opt, new Error(`Cannot find a current component to extract the value from for form part '${ pName }': ` + element(v.element)));
              }).map(Representing.getValue));
            },
            setValue: (form, values) => {
              each(values, (newValue, key) => {
                getPart(form, detail, key).each(wrapper => {
                  Composing.getCurrent(wrapper).each(field => {
                    Representing.setValue(field, newValue);
                  });
                });
              });
            }
          }
        })]),
      apis: {
        getField: (form, key) => {
          return getPart(form, detail, key).bind(Composing.getCurrent);
        }
      }
    });
    const Form = {
      getField: makeApi((apis, component, key) => apis.getField(component, key)),
      sketch: sketch$1
    };

    const validInput = generate$6('valid-input');
    const invalidInput = generate$6('invalid-input');
    const validatingInput = generate$6('validating-input');
    const translatePrefix = 'colorcustom.rgb.';
    const rgbFormFactory = (translate, getClass, onValidHexx, onInvalidHexx) => {
      const invalidation = (label, isValid) => Invalidating.config({
        invalidClass: getClass('invalid'),
        notify: {
          onValidate: comp => {
            emitWith(comp, validatingInput, { type: label });
          },
          onValid: comp => {
            emitWith(comp, validInput, {
              type: label,
              value: Representing.getValue(comp)
            });
          },
          onInvalid: comp => {
            emitWith(comp, invalidInput, {
              type: label,
              value: Representing.getValue(comp)
            });
          }
        },
        validator: {
          validate: comp => {
            const value = Representing.getValue(comp);
            const res = isValid(value) ? Result.value(true) : Result.error(translate('aria.input.invalid'));
            return Future.pure(res);
          },
          validateOnLoad: false
        }
      });
      const renderTextField = (isValid, name, label, description, data) => {
        const helptext = translate(translatePrefix + 'range');
        const pLabel = FormField.parts.label({
          dom: {
            tag: 'label',
            attributes: { 'aria-label': description }
          },
          components: [text$1(label)]
        });
        const pField = FormField.parts.field({
          data,
          factory: Input,
          inputAttributes: {
            type: 'text',
            ...name === 'hex' ? { 'aria-live': 'polite' } : {}
          },
          inputClasses: [getClass('textfield')],
          inputBehaviours: derive$1([
            invalidation(name, isValid),
            Tabstopping.config({})
          ]),
          onSetValue: input => {
            if (Invalidating.isInvalid(input)) {
              const run = Invalidating.run(input);
              run.get(noop);
            }
          }
        });
        const comps = [
          pLabel,
          pField
        ];
        const concats = name !== 'hex' ? [FormField.parts['aria-descriptor']({ text: helptext })] : [];
        const components = comps.concat(concats);
        return {
          dom: {
            tag: 'div',
            attributes: { role: 'presentation' }
          },
          components
        };
      };
      const copyRgbToHex = (form, rgba) => {
        const hex = fromRgba(rgba);
        Form.getField(form, 'hex').each(hexField => {
          if (!Focusing.isFocused(hexField)) {
            Representing.setValue(form, { hex: hex.value });
          }
        });
        return hex;
      };
      const copyRgbToForm = (form, rgb) => {
        const red = rgb.red;
        const green = rgb.green;
        const blue = rgb.blue;
        Representing.setValue(form, {
          red,
          green,
          blue
        });
      };
      const memPreview = record({
        dom: {
          tag: 'div',
          classes: [getClass('rgba-preview')],
          styles: { 'background-color': 'white' },
          attributes: { role: 'presentation' }
        }
      });
      const updatePreview = (anyInSystem, hex) => {
        memPreview.getOpt(anyInSystem).each(preview => {
          set$8(preview.element, 'background-color', '#' + hex.value);
        });
      };
      const factory = () => {
        const state = {
          red: Cell(Optional.some(255)),
          green: Cell(Optional.some(255)),
          blue: Cell(Optional.some(255)),
          hex: Cell(Optional.some('ffffff'))
        };
        const copyHexToRgb = (form, hex) => {
          const rgb = fromHex(hex);
          copyRgbToForm(form, rgb);
          setValueRgb(rgb);
        };
        const get = prop => state[prop].get();
        const set = (prop, value) => {
          state[prop].set(value);
        };
        const getValueRgb = () => get('red').bind(red => get('green').bind(green => get('blue').map(blue => rgbaColour(red, green, blue, 1))));
        const setValueRgb = rgb => {
          const red = rgb.red;
          const green = rgb.green;
          const blue = rgb.blue;
          set('red', Optional.some(red));
          set('green', Optional.some(green));
          set('blue', Optional.some(blue));
        };
        const onInvalidInput = (form, simulatedEvent) => {
          const data = simulatedEvent.event;
          if (data.type !== 'hex') {
            set(data.type, Optional.none());
          } else {
            onInvalidHexx(form);
          }
        };
        const onValidHex = (form, value) => {
          onValidHexx(form);
          const hex = hexColour(value);
          set('hex', Optional.some(value));
          const rgb = fromHex(hex);
          copyRgbToForm(form, rgb);
          setValueRgb(rgb);
          emitWith(form, fieldsUpdate, { hex });
          updatePreview(form, hex);
        };
        const onValidRgb = (form, prop, value) => {
          const val = parseInt(value, 10);
          set(prop, Optional.some(val));
          getValueRgb().each(rgb => {
            const hex = copyRgbToHex(form, rgb);
            emitWith(form, fieldsUpdate, { hex });
            updatePreview(form, hex);
          });
        };
        const isHexInputEvent = data => data.type === 'hex';
        const onValidInput = (form, simulatedEvent) => {
          const data = simulatedEvent.event;
          if (isHexInputEvent(data)) {
            onValidHex(form, data.value);
          } else {
            onValidRgb(form, data.type, data.value);
          }
        };
        const formPartStrings = key => ({
          label: translate(translatePrefix + key + '.label'),
          description: translate(translatePrefix + key + '.description')
        });
        const redStrings = formPartStrings('red');
        const greenStrings = formPartStrings('green');
        const blueStrings = formPartStrings('blue');
        const hexStrings = formPartStrings('hex');
        return deepMerge(Form.sketch(parts => ({
          dom: {
            tag: 'form',
            classes: [getClass('rgb-form')],
            attributes: { 'aria-label': translate('aria.color.picker') }
          },
          components: [
            parts.field('red', FormField.sketch(renderTextField(isRgbaComponent, 'red', redStrings.label, redStrings.description, 255))),
            parts.field('green', FormField.sketch(renderTextField(isRgbaComponent, 'green', greenStrings.label, greenStrings.description, 255))),
            parts.field('blue', FormField.sketch(renderTextField(isRgbaComponent, 'blue', blueStrings.label, blueStrings.description, 255))),
            parts.field('hex', FormField.sketch(renderTextField(isHexString, 'hex', hexStrings.label, hexStrings.description, 'ffffff'))),
            memPreview.asSpec()
          ],
          formBehaviours: derive$1([
            Invalidating.config({ invalidClass: getClass('form-invalid') }),
            config('rgb-form-events', [
              run$1(validInput, onValidInput),
              run$1(invalidInput, onInvalidInput),
              run$1(validatingInput, onInvalidInput)
            ])
          ])
        })), {
          apis: {
            updateHex: (form, hex) => {
              Representing.setValue(form, { hex: hex.value });
              copyHexToRgb(form, hex);
              updatePreview(form, hex);
            }
          }
        });
      };
      const rgbFormSketcher = single({
        factory,
        name: 'RgbForm',
        configFields: [],
        apis: {
          updateHex: (apis, form, hex) => {
            apis.updateHex(form, hex);
          }
        },
        extraApis: {}
      });
      return rgbFormSketcher;
    };

    const paletteFactory = (_translate, getClass) => {
      const spectrumPart = Slider.parts.spectrum({
        dom: {
          tag: 'canvas',
          attributes: { role: 'presentation' },
          classes: [getClass('sv-palette-spectrum')]
        }
      });
      const thumbPart = Slider.parts.thumb({
        dom: {
          tag: 'div',
          attributes: { role: 'presentation' },
          classes: [getClass('sv-palette-thumb')],
          innerHtml: `<div class=${ getClass('sv-palette-inner-thumb') } role="presentation"></div>`
        }
      });
      const setColour = (canvas, rgba) => {
        const {width, height} = canvas;
        const ctx = canvas.getContext('2d');
        if (ctx === null) {
          return;
        }
        ctx.fillStyle = rgba;
        ctx.fillRect(0, 0, width, height);
        const grdWhite = ctx.createLinearGradient(0, 0, width, 0);
        grdWhite.addColorStop(0, 'rgba(255,255,255,1)');
        grdWhite.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grdWhite;
        ctx.fillRect(0, 0, width, height);
        const grdBlack = ctx.createLinearGradient(0, 0, 0, height);
        grdBlack.addColorStop(0, 'rgba(0,0,0,0)');
        grdBlack.addColorStop(1, 'rgba(0,0,0,1)');
        ctx.fillStyle = grdBlack;
        ctx.fillRect(0, 0, width, height);
      };
      const setPaletteHue = (slider, hue) => {
        const canvas = slider.components()[0].element.dom;
        const hsv = hsvColour(hue, 100, 100);
        const rgba = fromHsv(hsv);
        setColour(canvas, toString(rgba));
      };
      const setPaletteThumb = (slider, hex) => {
        const hsv = fromRgb(fromHex(hex));
        Slider.setValue(slider, {
          x: hsv.saturation,
          y: 100 - hsv.value
        });
      };
      const factory = _detail => {
        const getInitialValue = constant$1({
          x: 0,
          y: 0
        });
        const onChange = (slider, _thumb, value) => {
          emitWith(slider, paletteUpdate, { value });
        };
        const onInit = (_slider, _thumb, spectrum, _value) => {
          setColour(spectrum.element.dom, toString(red));
        };
        const sliderBehaviours = derive$1([
          Composing.config({ find: Optional.some }),
          Focusing.config({})
        ]);
        return Slider.sketch({
          dom: {
            tag: 'div',
            attributes: { role: 'presentation' },
            classes: [getClass('sv-palette')]
          },
          model: {
            mode: 'xy',
            getInitialValue
          },
          rounded: false,
          components: [
            spectrumPart,
            thumbPart
          ],
          onChange,
          onInit,
          sliderBehaviours
        });
      };
      const saturationBrightnessPaletteSketcher = single({
        factory,
        name: 'SaturationBrightnessPalette',
        configFields: [],
        apis: {
          setHue: (_apis, slider, hue) => {
            setPaletteHue(slider, hue);
          },
          setThumb: (_apis, slider, hex) => {
            setPaletteThumb(slider, hex);
          }
        },
        extraApis: {}
      });
      return saturationBrightnessPaletteSketcher;
    };

    const makeFactory = (translate, getClass) => {
      const factory = detail => {
        const rgbForm = rgbFormFactory(translate, getClass, detail.onValidHex, detail.onInvalidHex);
        const sbPalette = paletteFactory(translate, getClass);
        const hueSliderToDegrees = hue => (100 - hue) / 100 * 360;
        const hueDegreesToSlider = hue => 100 - hue / 360 * 100;
        const state = {
          paletteRgba: Cell(red),
          paletteHue: Cell(0)
        };
        const memSlider = record(sliderFactory(translate, getClass));
        const memPalette = record(sbPalette.sketch({}));
        const memRgb = record(rgbForm.sketch({}));
        const updatePalette = (anyInSystem, _hex, hue) => {
          memPalette.getOpt(anyInSystem).each(palette => {
            sbPalette.setHue(palette, hue);
          });
        };
        const updateFields = (anyInSystem, hex) => {
          memRgb.getOpt(anyInSystem).each(form => {
            rgbForm.updateHex(form, hex);
          });
        };
        const updateSlider = (anyInSystem, _hex, hue) => {
          memSlider.getOpt(anyInSystem).each(slider => {
            Slider.setValue(slider, hueDegreesToSlider(hue));
          });
        };
        const updatePaletteThumb = (anyInSystem, hex) => {
          memPalette.getOpt(anyInSystem).each(palette => {
            sbPalette.setThumb(palette, hex);
          });
        };
        const updateState = (hex, hue) => {
          const rgba = fromHex(hex);
          state.paletteRgba.set(rgba);
          state.paletteHue.set(hue);
        };
        const runUpdates = (anyInSystem, hex, hue, updates) => {
          updateState(hex, hue);
          each$1(updates, update => {
            update(anyInSystem, hex, hue);
          });
        };
        const onPaletteUpdate = () => {
          const updates = [updateFields];
          return (form, simulatedEvent) => {
            const value = simulatedEvent.event.value;
            const oldHue = state.paletteHue.get();
            const newHsv = hsvColour(oldHue, value.x, 100 - value.y);
            const newHex = hsvToHex(newHsv);
            runUpdates(form, newHex, oldHue, updates);
          };
        };
        const onSliderUpdate = () => {
          const updates = [
            updatePalette,
            updateFields
          ];
          return (form, simulatedEvent) => {
            const hue = hueSliderToDegrees(simulatedEvent.event.value);
            const oldRgb = state.paletteRgba.get();
            const oldHsv = fromRgb(oldRgb);
            const newHsv = hsvColour(hue, oldHsv.saturation, oldHsv.value);
            const newHex = hsvToHex(newHsv);
            runUpdates(form, newHex, hue, updates);
          };
        };
        const onFieldsUpdate = () => {
          const updates = [
            updatePalette,
            updateSlider,
            updatePaletteThumb
          ];
          return (form, simulatedEvent) => {
            const hex = simulatedEvent.event.hex;
            const hsv = hexToHsv(hex);
            runUpdates(form, hex, hsv.hue, updates);
          };
        };
        return {
          uid: detail.uid,
          dom: detail.dom,
          components: [
            memPalette.asSpec(),
            memSlider.asSpec(),
            memRgb.asSpec()
          ],
          behaviours: derive$1([
            config('colour-picker-events', [
              run$1(fieldsUpdate, onFieldsUpdate()),
              run$1(paletteUpdate, onPaletteUpdate()),
              run$1(sliderUpdate, onSliderUpdate())
            ]),
            Composing.config({ find: comp => memRgb.getOpt(comp) }),
            Keying.config({ mode: 'acyclic' })
          ])
        };
      };
      const colourPickerSketcher = single({
        name: 'ColourPicker',
        configFields: [
          required$1('dom'),
          defaulted('onValidHex', noop),
          defaulted('onInvalidHex', noop)
        ],
        factory
      });
      return colourPickerSketcher;
    };

    const self = () => Composing.config({ find: Optional.some });
    const memento$1 = mem => Composing.config({ find: mem.getOpt });
    const childAt = index => Composing.config({ find: comp => child$2(comp.element, index).bind(element => comp.getSystem().getByDom(element).toOptional()) });
    const ComposingConfigs = {
      self,
      memento: memento$1,
      childAt
    };

    const processors = objOf([
      defaulted('preprocess', identity),
      defaulted('postprocess', identity)
    ]);
    const memento = (mem, rawProcessors) => {
      const ps = asRawOrDie$1('RepresentingConfigs.memento processors', processors, rawProcessors);
      return Representing.config({
        store: {
          mode: 'manual',
          getValue: comp => {
            const other = mem.get(comp);
            const rawValue = Representing.getValue(other);
            return ps.postprocess(rawValue);
          },
          setValue: (comp, rawValue) => {
            const newValue = ps.preprocess(rawValue);
            const other = mem.get(comp);
            Representing.setValue(other, newValue);
          }
        }
      });
    };
    const withComp = (optInitialValue, getter, setter) => Representing.config({
      store: {
        mode: 'manual',
        ...optInitialValue.map(initialValue => ({ initialValue })).getOr({}),
        getValue: getter,
        setValue: setter
      }
    });
    const withElement = (initialValue, getter, setter) => withComp(initialValue, c => getter(c.element), (c, v) => setter(c.element, v));
    const domValue = optInitialValue => withElement(optInitialValue, get$6, set$5);
    const domHtml = optInitialValue => withElement(optInitialValue, get$9, set$6);
    const memory = initialValue => Representing.config({
      store: {
        mode: 'memory',
        initialValue
      }
    });
    const RepresentingConfigs = {
      memento,
      withElement,
      withComp,
      domValue,
      domHtml,
      memory
    };

    const english = {
      'colorcustom.rgb.red.label': 'R',
      'colorcustom.rgb.red.description': 'Red component',
      'colorcustom.rgb.green.label': 'G',
      'colorcustom.rgb.green.description': 'Green component',
      'colorcustom.rgb.blue.label': 'B',
      'colorcustom.rgb.blue.description': 'Blue component',
      'colorcustom.rgb.hex.label': '#',
      'colorcustom.rgb.hex.description': 'Hex color code',
      'colorcustom.rgb.range': 'Range 0 to 255',
      'aria.color.picker': 'Color Picker',
      'aria.input.invalid': 'Invalid input'
    };
    const translate$1 = providerBackstage => key => {
      return providerBackstage.translate(english[key]);
    };
    const renderColorPicker = (_spec, providerBackstage, initialData) => {
      const getClass = key => 'tox-' + key;
      const colourPickerFactory = makeFactory(translate$1(providerBackstage), getClass);
      const onValidHex = form => {
        emitWith(form, formActionEvent, {
          name: 'hex-valid',
          value: true
        });
      };
      const onInvalidHex = form => {
        emitWith(form, formActionEvent, {
          name: 'hex-valid',
          value: false
        });
      };
      const memPicker = record(colourPickerFactory.sketch({
        dom: {
          tag: 'div',
          classes: [getClass('color-picker-container')],
          attributes: { role: 'presentation' }
        },
        onValidHex,
        onInvalidHex
      }));
      return {
        dom: { tag: 'div' },
        components: [memPicker.asSpec()],
        behaviours: derive$1([
          RepresentingConfigs.withComp(initialData, comp => {
            const picker = memPicker.get(comp);
            const optRgbForm = Composing.getCurrent(picker);
            const optHex = optRgbForm.bind(rgbForm => {
              const formValues = Representing.getValue(rgbForm);
              return formValues.hex;
            });
            return optHex.map(hex => '#' + hex).getOr('');
          }, (comp, newValue) => {
            const pattern = /^#([a-fA-F0-9]{3}(?:[a-fA-F0-9]{3})?)/;
            const valOpt = Optional.from(pattern.exec(newValue)).bind(matches => get$h(matches, 1));
            const picker = memPicker.get(comp);
            const optRgbForm = Composing.getCurrent(picker);
            optRgbForm.fold(() => {
              console.log('Can not find form');
            }, rgbForm => {
              Representing.setValue(rgbForm, { hex: valOpt.getOr('') });
              Form.getField(rgbForm, 'hex').each(hexField => {
                emit(hexField, input());
              });
            });
          }),
          ComposingConfigs.self()
        ])
      };
    };

    var global$2 = tinymce.util.Tools.resolve('tinymce.Resource');

    const isOldCustomEditor = spec => has$2(spec, 'init');
    const renderCustomEditor = spec => {
      const editorApi = value$2();
      const memReplaced = record({ dom: { tag: spec.tag } });
      const initialValue = value$2();
      return {
        dom: {
          tag: 'div',
          classes: ['tox-custom-editor']
        },
        behaviours: derive$1([
          config('custom-editor-events', [runOnAttached(component => {
              memReplaced.getOpt(component).each(ta => {
                (isOldCustomEditor(spec) ? spec.init(ta.element.dom) : global$2.load(spec.scriptId, spec.scriptUrl).then(init => init(ta.element.dom, spec.settings))).then(ea => {
                  initialValue.on(cvalue => {
                    ea.setValue(cvalue);
                  });
                  initialValue.clear();
                  editorApi.set(ea);
                });
              });
            })]),
          RepresentingConfigs.withComp(Optional.none(), () => editorApi.get().fold(() => initialValue.get().getOr(''), ed => ed.getValue()), (component, value) => {
            editorApi.get().fold(() => initialValue.set(value), ed => ed.setValue(value));
          }),
          ComposingConfigs.self()
        ]),
        components: [memReplaced.asSpec()]
      };
    };

    var global$1 = tinymce.util.Tools.resolve('tinymce.util.Tools');

    const filterByExtension = (files, providersBackstage) => {
      const allowedImageFileTypes = global$1.explode(providersBackstage.getOption('images_file_types'));
      const isFileInAllowedTypes = file => exists(allowedImageFileTypes, type => endsWith(file.name.toLowerCase(), `.${ type.toLowerCase() }`));
      return filter$2(from(files), isFileInAllowedTypes);
    };
    const renderDropZone = (spec, providersBackstage, initialData) => {
      const stopper = (_, se) => {
        se.stop();
      };
      const sequence = actions => (comp, se) => {
        each$1(actions, a => {
          a(comp, se);
        });
      };
      const onDrop = (comp, se) => {
        var _a;
        if (!Disabling.isDisabled(comp)) {
          const transferEvent = se.event.raw;
          handleFiles(comp, (_a = transferEvent.dataTransfer) === null || _a === void 0 ? void 0 : _a.files);
        }
      };
      const onSelect = (component, simulatedEvent) => {
        const input = simulatedEvent.event.raw.target;
        handleFiles(component, input.files);
      };
      const handleFiles = (component, files) => {
        if (files) {
          Representing.setValue(component, filterByExtension(files, providersBackstage));
          emitWith(component, formChangeEvent, { name: spec.name });
        }
      };
      const memInput = record({
        dom: {
          tag: 'input',
          attributes: {
            type: 'file',
            accept: 'image/*'
          },
          styles: { display: 'none' }
        },
        behaviours: derive$1([config('input-file-events', [
            cutter(click()),
            cutter(tap())
          ])])
      });
      const renderField = s => ({
        uid: s.uid,
        dom: {
          tag: 'div',
          classes: ['tox-dropzone-container']
        },
        behaviours: derive$1([
          RepresentingConfigs.memory(initialData.getOr([])),
          ComposingConfigs.self(),
          Disabling.config({}),
          Toggling.config({
            toggleClass: 'dragenter',
            toggleOnExecute: false
          }),
          config('dropzone-events', [
            run$1('dragenter', sequence([
              stopper,
              Toggling.toggle
            ])),
            run$1('dragleave', sequence([
              stopper,
              Toggling.toggle
            ])),
            run$1('dragover', stopper),
            run$1('drop', sequence([
              stopper,
              onDrop
            ])),
            run$1(change(), onSelect)
          ])
        ]),
        components: [{
            dom: {
              tag: 'div',
              classes: ['tox-dropzone'],
              styles: {}
            },
            components: [
              {
                dom: { tag: 'p' },
                components: [text$1(providersBackstage.translate('Drop an image here'))]
              },
              Button.sketch({
                dom: {
                  tag: 'button',
                  styles: { position: 'relative' },
                  classes: [
                    'tox-button',
                    'tox-button--secondary'
                  ]
                },
                components: [
                  text$1(providersBackstage.translate('Browse for an image')),
                  memInput.asSpec()
                ],
                action: comp => {
                  const inputComp = memInput.get(comp);
                  inputComp.element.dom.click();
                },
                buttonBehaviours: derive$1([
                  Tabstopping.config({}),
                  DisablingConfigs.button(providersBackstage.isDisabled),
                  receivingConfig()
                ])
              })
            ]
          }]
      });
      const pLabel = spec.label.map(label => renderLabel$2(label, providersBackstage));
      const pField = FormField.parts.field({ factory: { sketch: renderField } });
      return renderFormFieldWith(pLabel, pField, ['tox-form__group--stretched'], []);
    };

    const renderGrid = (spec, backstage) => ({
      dom: {
        tag: 'div',
        classes: [
          'tox-form__grid',
          `tox-form__grid--${ spec.columns }col`
        ]
      },
      components: map$2(spec.items, backstage.interpreter)
    });

    const beforeObject = generate$6('alloy-fake-before-tabstop');
    const afterObject = generate$6('alloy-fake-after-tabstop');
    const craftWithClasses = classes => {
      return {
        dom: {
          tag: 'div',
          styles: {
            width: '1px',
            height: '1px',
            outline: 'none'
          },
          attributes: { tabindex: '0' },
          classes
        },
        behaviours: derive$1([
          Focusing.config({ ignore: true }),
          Tabstopping.config({})
        ])
      };
    };
    const craft = spec => {
      return {
        dom: {
          tag: 'div',
          classes: ['tox-navobj']
        },
        components: [
          craftWithClasses([beforeObject]),
          spec,
          craftWithClasses([afterObject])
        ],
        behaviours: derive$1([ComposingConfigs.childAt(1)])
      };
    };
    const triggerTab = (placeholder, shiftKey) => {
      emitWith(placeholder, keydown(), {
        raw: {
          which: 9,
          shiftKey
        }
      });
    };
    const onFocus = (container, targetComp) => {
      const target = targetComp.element;
      if (has(target, beforeObject)) {
        triggerTab(container, true);
      } else if (has(target, afterObject)) {
        triggerTab(container, false);
      }
    };
    const isPseudoStop = element => {
      return closest(element, [
        '.' + beforeObject,
        '.' + afterObject
      ].join(','), never);
    };

    const getDynamicSource = initialData => {
      const cachedValue = Cell(initialData.getOr(''));
      return {
        getValue: _frameComponent => cachedValue.get(),
        setValue: (frameComponent, html) => {
          if (cachedValue.get() !== html) {
            set$9(frameComponent.element, 'srcdoc', html);
          }
          cachedValue.set(html);
        }
      };
    };
    const renderIFrame = (spec, providersBackstage, initialData) => {
      const isSandbox = spec.sandboxed;
      const isTransparent = spec.transparent;
      const baseClass = 'tox-dialog__iframe';
      const attributes = {
        ...spec.label.map(title => ({ title })).getOr({}),
        ...initialData.map(html => ({ srcdoc: html })).getOr({}),
        ...isSandbox ? { sandbox: 'allow-scripts allow-same-origin' } : {}
      };
      const sourcing = getDynamicSource(initialData);
      const pLabel = spec.label.map(label => renderLabel$2(label, providersBackstage));
      const factory = newSpec => craft({
        uid: newSpec.uid,
        dom: {
          tag: 'iframe',
          attributes,
          classes: isTransparent ? [baseClass] : [
            baseClass,
            `${ baseClass }--opaque`
          ]
        },
        behaviours: derive$1([
          Tabstopping.config({}),
          Focusing.config({}),
          RepresentingConfigs.withComp(initialData, sourcing.getValue, sourcing.setValue)
        ])
      });
      const pField = FormField.parts.field({ factory: { sketch: factory } });
      return renderFormFieldWith(pLabel, pField, ['tox-form__group--stretched'], []);
    };

    const image = image => new Promise((resolve, reject) => {
      const loaded = () => {
        destroy();
        resolve(image);
      };
      const listeners = [
        bind(image, 'load', loaded),
        bind(image, 'error', () => {
          destroy();
          reject('Unable to load data from image: ' + image.dom.src);
        })
      ];
      const destroy = () => each$1(listeners, l => l.unbind());
      if (image.dom.complete) {
        loaded();
      }
    });

    const calculateImagePosition = (panelWidth, panelHeight, imageWidth, imageHeight, zoom) => {
      const width = imageWidth * zoom;
      const height = imageHeight * zoom;
      const left = Math.max(0, panelWidth / 2 - width / 2);
      const top = Math.max(0, panelHeight / 2 - height / 2);
      return {
        left: left.toString() + 'px',
        top: top.toString() + 'px',
        width: width.toString() + 'px',
        height: height.toString() + 'px'
      };
    };
    const zoomToFit = (panel, width, height) => {
      const panelW = get$c(panel);
      const panelH = get$d(panel);
      return Math.min(panelW / width, panelH / height, 1);
    };
    const renderImagePreview = (spec, initialData) => {
      const cachedData = Cell(initialData.getOr({ url: '' }));
      const memImage = record({
        dom: {
          tag: 'img',
          classes: ['tox-imagepreview__image'],
          attributes: initialData.map(data => ({ src: data.url })).getOr({})
        }
      });
      const memContainer = record({
        dom: {
          tag: 'div',
          classes: ['tox-imagepreview__container'],
          attributes: { role: 'presentation' }
        },
        components: [memImage.asSpec()]
      });
      const setValue = (frameComponent, data) => {
        const translatedData = { url: data.url };
        data.zoom.each(z => translatedData.zoom = z);
        data.cachedWidth.each(z => translatedData.cachedWidth = z);
        data.cachedHeight.each(z => translatedData.cachedHeight = z);
        cachedData.set(translatedData);
        const applyFramePositioning = () => {
          const {cachedWidth, cachedHeight, zoom} = translatedData;
          if (!isUndefined(cachedWidth) && !isUndefined(cachedHeight)) {
            if (isUndefined(zoom)) {
              const z = zoomToFit(frameComponent.element, cachedWidth, cachedHeight);
              translatedData.zoom = z;
            }
            const position = calculateImagePosition(get$c(frameComponent.element), get$d(frameComponent.element), cachedWidth, cachedHeight, translatedData.zoom);
            memContainer.getOpt(frameComponent).each(container => {
              setAll(container.element, position);
            });
          }
        };
        memImage.getOpt(frameComponent).each(imageComponent => {
          const img = imageComponent.element;
          if (data.url !== get$f(img, 'src')) {
            set$9(img, 'src', data.url);
            remove$2(frameComponent.element, 'tox-imagepreview__loaded');
          }
          applyFramePositioning();
          image(img).then(img => {
            if (frameComponent.getSystem().isConnected()) {
              add$2(frameComponent.element, 'tox-imagepreview__loaded');
              translatedData.cachedWidth = img.dom.naturalWidth;
              translatedData.cachedHeight = img.dom.naturalHeight;
              applyFramePositioning();
            }
          });
        });
      };
      const styles = {};
      spec.height.each(h => styles.height = h);
      const fakeValidatedData = initialData.map(d => ({
        url: d.url,
        zoom: Optional.from(d.zoom),
        cachedWidth: Optional.from(d.cachedWidth),
        cachedHeight: Optional.from(d.cachedHeight)
      }));
      return {
        dom: {
          tag: 'div',
          classes: ['tox-imagepreview'],
          styles,
          attributes: { role: 'presentation' }
        },
        components: [memContainer.asSpec()],
        behaviours: derive$1([
          ComposingConfigs.self(),
          RepresentingConfigs.withComp(fakeValidatedData, () => cachedData.get(), setValue)
        ])
      };
    };

    const renderLabel$1 = (spec, backstageShared) => {
      const label = {
        dom: {
          tag: 'label',
          classes: ['tox-label']
        },
        components: [text$1(backstageShared.providers.translate(spec.label))]
      };
      const comps = map$2(spec.items, backstageShared.interpreter);
      return {
        dom: {
          tag: 'div',
          classes: ['tox-form__group']
        },
        components: [
          label,
          ...comps
        ],
        behaviours: derive$1([
          ComposingConfigs.self(),
          Replacing.config({}),
          RepresentingConfigs.domHtml(Optional.none()),
          Keying.config({ mode: 'acyclic' })
        ])
      };
    };

    const internalToolbarButtonExecute = generate$6('toolbar.button.execute');
    const onToolbarButtonExecute = info => runOnExecute$1((comp, _simulatedEvent) => {
      runWithApi(info, comp)(itemApi => {
        emitWith(comp, internalToolbarButtonExecute, { buttonApi: itemApi });
        info.onAction(itemApi);
      });
    });
    const toolbarButtonEventOrder = {
      [execute$5()]: [
        'disabling',
        'alloy.base.behaviour',
        'toggling',
        'toolbar-button-events'
      ]
    };

    const renderIcon = (iconName, iconsProvider, behaviours) => render$3(iconName, {
      tag: 'span',
      classes: [
        'tox-icon',
        'tox-tbtn__icon-wrap'
      ],
      behaviours
    }, iconsProvider);
    const renderIconFromPack = (iconName, iconsProvider) => renderIcon(iconName, iconsProvider, []);
    const renderReplaceableIconFromPack = (iconName, iconsProvider) => renderIcon(iconName, iconsProvider, [Replacing.config({})]);
    const renderLabel = (text, prefix, providersBackstage) => ({
      dom: {
        tag: 'span',
        classes: [`${ prefix }__select-label`]
      },
      components: [text$1(providersBackstage.translate(text))],
      behaviours: derive$1([Replacing.config({})])
    });

    const updateMenuText = generate$6('update-menu-text');
    const updateMenuIcon = generate$6('update-menu-icon');
    const renderCommonDropdown = (spec, prefix, sharedBackstage) => {
      const editorOffCell = Cell(noop);
      const optMemDisplayText = spec.text.map(text => record(renderLabel(text, prefix, sharedBackstage.providers)));
      const optMemDisplayIcon = spec.icon.map(iconName => record(renderReplaceableIconFromPack(iconName, sharedBackstage.providers.icons)));
      const onLeftOrRightInMenu = (comp, se) => {
        const dropdown = Representing.getValue(comp);
        Focusing.focus(dropdown);
        emitWith(dropdown, 'keydown', { raw: se.event.raw });
        Dropdown.close(dropdown);
        return Optional.some(true);
      };
      const role = spec.role.fold(() => ({}), role => ({ role }));
      const tooltipAttributes = spec.tooltip.fold(() => ({}), tooltip => {
        const translatedTooltip = sharedBackstage.providers.translate(tooltip);
        return {
          'title': translatedTooltip,
          'aria-label': translatedTooltip
        };
      });
      const iconSpec = render$3('chevron-down', {
        tag: 'div',
        classes: [`${ prefix }__select-chevron`]
      }, sharedBackstage.providers.icons);
      const memDropdown = record(Dropdown.sketch({
        ...spec.uid ? { uid: spec.uid } : {},
        ...role,
        dom: {
          tag: 'button',
          classes: [
            prefix,
            `${ prefix }--select`
          ].concat(map$2(spec.classes, c => `${ prefix }--${ c }`)),
          attributes: { ...tooltipAttributes }
        },
        components: componentRenderPipeline([
          optMemDisplayIcon.map(mem => mem.asSpec()),
          optMemDisplayText.map(mem => mem.asSpec()),
          Optional.some(iconSpec)
        ]),
        matchWidth: true,
        useMinWidth: true,
        onOpen: (anchor, dropdownComp, tmenuComp) => {
          if (spec.searchable) {
            focusSearchField(tmenuComp);
          }
        },
        dropdownBehaviours: derive$1([
          ...spec.dropdownBehaviours,
          DisablingConfigs.button(() => spec.disabled || sharedBackstage.providers.isDisabled()),
          receivingConfig(),
          Unselecting.config({}),
          Replacing.config({}),
          config('dropdown-events', [
            onControlAttached(spec, editorOffCell),
            onControlDetached(spec, editorOffCell)
          ]),
          config('menubutton-update-display-text', [
            run$1(updateMenuText, (comp, se) => {
              optMemDisplayText.bind(mem => mem.getOpt(comp)).each(displayText => {
                Replacing.set(displayText, [text$1(sharedBackstage.providers.translate(se.event.text))]);
              });
            }),
            run$1(updateMenuIcon, (comp, se) => {
              optMemDisplayIcon.bind(mem => mem.getOpt(comp)).each(displayIcon => {
                Replacing.set(displayIcon, [renderReplaceableIconFromPack(se.event.icon, sharedBackstage.providers.icons)]);
              });
            })
          ])
        ]),
        eventOrder: deepMerge(toolbarButtonEventOrder, {
          mousedown: [
            'focusing',
            'alloy.base.behaviour',
            'item-type-events',
            'normal-dropdown-events'
          ]
        }),
        sandboxBehaviours: derive$1([
          Keying.config({
            mode: 'special',
            onLeft: onLeftOrRightInMenu,
            onRight: onLeftOrRightInMenu
          }),
          config('dropdown-sandbox-events', [
            run$1(refetchTriggerEvent, (originalSandboxComp, se) => {
              handleRefetchTrigger(originalSandboxComp);
              se.stop();
            }),
            run$1(redirectMenuItemInteractionEvent, (sandboxComp, se) => {
              handleRedirectToMenuItem(sandboxComp, se);
              se.stop();
            })
          ])
        ]),
        lazySink: sharedBackstage.getSink,
        toggleClass: `${ prefix }--active`,
        parts: {
          menu: {
            ...part(false, spec.columns, spec.presets),
            fakeFocus: spec.searchable,
            onHighlightItem: updateAriaOnHighlight,
            onCollapseMenu: (tmenuComp, itemCompCausingCollapse, nowActiveMenuComp) => {
              Highlighting.getHighlighted(nowActiveMenuComp).each(itemComp => {
                updateAriaOnHighlight(tmenuComp, nowActiveMenuComp, itemComp);
              });
            },
            onDehighlightItem: updateAriaOnDehighlight
          }
        },
        fetch: comp => Future.nu(curry(spec.fetch, comp))
      }));
      return memDropdown.asSpec();
    };

    const isMenuItemReference = item => isString(item);
    const isSeparator$2 = item => item.type === 'separator';
    const isExpandingMenuItem = item => has$2(item, 'getSubmenuItems');
    const separator$2 = { type: 'separator' };
    const unwrapReferences = (items, menuItems) => {
      const realItems = foldl(items, (acc, item) => {
        if (isMenuItemReference(item)) {
          if (item === '') {
            return acc;
          } else if (item === '|') {
            return acc.length > 0 && !isSeparator$2(acc[acc.length - 1]) ? acc.concat([separator$2]) : acc;
          } else if (has$2(menuItems, item.toLowerCase())) {
            return acc.concat([menuItems[item.toLowerCase()]]);
          } else {
            return acc;
          }
        } else {
          return acc.concat([item]);
        }
      }, []);
      if (realItems.length > 0 && isSeparator$2(realItems[realItems.length - 1])) {
        realItems.pop();
      }
      return realItems;
    };
    const getFromExpandingItem = (item, menuItems) => {
      const submenuItems = item.getSubmenuItems();
      const rest = expand(submenuItems, menuItems);
      const newMenus = deepMerge(rest.menus, { [item.value]: rest.items });
      const newExpansions = deepMerge(rest.expansions, { [item.value]: item.value });
      return {
        item,
        menus: newMenus,
        expansions: newExpansions
      };
    };
    const generateValueIfRequired = item => {
      const itemValue = get$g(item, 'value').getOrThunk(() => generate$6('generated-menu-item'));
      return deepMerge({ value: itemValue }, item);
    };
    const expand = (items, menuItems) => {
      const realItems = unwrapReferences(isString(items) ? items.split(' ') : items, menuItems);
      return foldr(realItems, (acc, item) => {
        if (isExpandingMenuItem(item)) {
          const itemWithValue = generateValueIfRequired(item);
          const newData = getFromExpandingItem(itemWithValue, menuItems);
          return {
            menus: deepMerge(acc.menus, newData.menus),
            items: [
              newData.item,
              ...acc.items
            ],
            expansions: deepMerge(acc.expansions, newData.expansions)
          };
        } else {
          return {
            ...acc,
            items: [
              item,
              ...acc.items
            ]
          };
        }
      }, {
        menus: {},
        expansions: {},
        items: []
      });
    };

    const getSearchModeForField = settings => {
      return settings.search.fold(() => ({ searchMode: 'no-search' }), searchSettings => ({
        searchMode: 'search-with-field',
        placeholder: searchSettings.placeholder
      }));
    };
    const getSearchModeForResults = settings => {
      return settings.search.fold(() => ({ searchMode: 'no-search' }), _ => ({ searchMode: 'search-with-results' }));
    };
    const build = (items, itemResponse, backstage, settings) => {
      const primary = generate$6('primary-menu');
      const data = expand(items, backstage.shared.providers.menuItems());
      if (data.items.length === 0) {
        return Optional.none();
      }
      const mainMenuSearchMode = getSearchModeForField(settings);
      const mainMenu = createPartialMenu(primary, data.items, itemResponse, backstage, settings.isHorizontalMenu, mainMenuSearchMode);
      const submenuSearchMode = getSearchModeForResults(settings);
      const submenus = map$1(data.menus, (menuItems, menuName) => createPartialMenu(menuName, menuItems, itemResponse, backstage, false, submenuSearchMode));
      const menus = deepMerge(submenus, wrap$1(primary, mainMenu));
      return Optional.from(tieredMenu.tieredData(primary, menus, data.expansions));
    };

    const isSingleListItem = item => !has$2(item, 'items');
    const dataAttribute = 'data-value';
    const fetchItems = (dropdownComp, name, items, selectedValue) => map$2(items, item => {
      if (!isSingleListItem(item)) {
        return {
          type: 'nestedmenuitem',
          text: item.text,
          getSubmenuItems: () => fetchItems(dropdownComp, name, item.items, selectedValue)
        };
      } else {
        return {
          type: 'togglemenuitem',
          text: item.text,
          value: item.value,
          active: item.value === selectedValue,
          onAction: () => {
            Representing.setValue(dropdownComp, item.value);
            emitWith(dropdownComp, formChangeEvent, { name });
            Focusing.focus(dropdownComp);
          }
        };
      }
    });
    const findItemByValue = (items, value) => findMap(items, item => {
      if (!isSingleListItem(item)) {
        return findItemByValue(item.items, value);
      } else {
        return someIf(item.value === value, item);
      }
    });
    const renderListBox = (spec, backstage, initialData) => {
      const providersBackstage = backstage.shared.providers;
      const initialItem = initialData.bind(value => findItemByValue(spec.items, value)).orThunk(() => head(spec.items).filter(isSingleListItem));
      const pLabel = spec.label.map(label => renderLabel$2(label, providersBackstage));
      const pField = FormField.parts.field({
        dom: {},
        factory: {
          sketch: sketchSpec => renderCommonDropdown({
            uid: sketchSpec.uid,
            text: initialItem.map(item => item.text),
            icon: Optional.none(),
            tooltip: spec.label,
            role: Optional.none(),
            fetch: (comp, callback) => {
              const items = fetchItems(comp, spec.name, spec.items, Representing.getValue(comp));
              callback(build(items, ItemResponse$1.CLOSE_ON_EXECUTE, backstage, {
                isHorizontalMenu: false,
                search: Optional.none()
              }));
            },
            onSetup: constant$1(noop),
            getApi: constant$1({}),
            columns: 1,
            presets: 'normal',
            classes: [],
            dropdownBehaviours: [
              Tabstopping.config({}),
              RepresentingConfigs.withComp(initialItem.map(item => item.value), comp => get$f(comp.element, dataAttribute), (comp, data) => {
                findItemByValue(spec.items, data).each(item => {
                  set$9(comp.element, dataAttribute, item.value);
                  emitWith(comp, updateMenuText, { text: item.text });
                });
              })
            ]
          }, 'tox-listbox', backstage.shared)
        }
      });
      const listBoxWrap = {
        dom: {
          tag: 'div',
          classes: ['tox-listboxfield']
        },
        components: [pField]
      };
      return FormField.sketch({
        dom: {
          tag: 'div',
          classes: ['tox-form__group']
        },
        components: flatten([
          pLabel.toArray(),
          [listBoxWrap]
        ]),
        fieldBehaviours: derive$1([Disabling.config({
            disabled: constant$1(!spec.enabled),
            onDisabled: comp => {
              FormField.getField(comp).each(Disabling.disable);
            },
            onEnabled: comp => {
              FormField.getField(comp).each(Disabling.enable);
            }
          })])
      });
    };

    const renderPanel = (spec, backstage) => ({
      dom: {
        tag: 'div',
        classes: spec.classes
      },
      components: map$2(spec.items, backstage.shared.interpreter)
    });

    const factory$f = (detail, _spec) => {
      const options = map$2(detail.options, option => ({
        dom: {
          tag: 'option',
          value: option.value,
          innerHtml: option.text
        }
      }));
      const initialValues = detail.data.map(v => wrap$1('initialValue', v)).getOr({});
      return {
        uid: detail.uid,
        dom: {
          tag: 'select',
          classes: detail.selectClasses,
          attributes: detail.selectAttributes
        },
        components: options,
        behaviours: augment(detail.selectBehaviours, [
          Focusing.config({}),
          Representing.config({
            store: {
              mode: 'manual',
              getValue: select => {
                return get$6(select.element);
              },
              setValue: (select, newValue) => {
                const found = find$5(detail.options, opt => opt.value === newValue);
                if (found.isSome()) {
                  set$5(select.element, newValue);
                }
              },
              ...initialValues
            }
          })
        ])
      };
    };
    const HtmlSelect = single({
      name: 'HtmlSelect',
      configFields: [
        required$1('options'),
        field('selectBehaviours', [
          Focusing,
          Representing
        ]),
        defaulted('selectClasses', []),
        defaulted('selectAttributes', {}),
        option$3('data')
      ],
      factory: factory$f
    });

    const renderSelectBox = (spec, providersBackstage, initialData) => {
      const translatedOptions = map$2(spec.items, item => ({
        text: providersBackstage.translate(item.text),
        value: item.value
      }));
      const pLabel = spec.label.map(label => renderLabel$2(label, providersBackstage));
      const pField = FormField.parts.field({
        dom: {},
        ...initialData.map(data => ({ data })).getOr({}),
        selectAttributes: { size: spec.size },
        options: translatedOptions,
        factory: HtmlSelect,
        selectBehaviours: derive$1([
          Disabling.config({ disabled: () => !spec.enabled || providersBackstage.isDisabled() }),
          Tabstopping.config({}),
          config('selectbox-change', [run$1(change(), (component, _) => {
              emitWith(component, formChangeEvent, { name: spec.name });
            })])
        ])
      });
      const chevron = spec.size > 1 ? Optional.none() : Optional.some(render$3('chevron-down', {
        tag: 'div',
        classes: ['tox-selectfield__icon-js']
      }, providersBackstage.icons));
      const selectWrap = {
        dom: {
          tag: 'div',
          classes: ['tox-selectfield']
        },
        components: flatten([
          [pField],
          chevron.toArray()
        ])
      };
      return FormField.sketch({
        dom: {
          tag: 'div',
          classes: ['tox-form__group']
        },
        components: flatten([
          pLabel.toArray(),
          [selectWrap]
        ]),
        fieldBehaviours: derive$1([
          Disabling.config({
            disabled: () => !spec.enabled || providersBackstage.isDisabled(),
            onDisabled: comp => {
              FormField.getField(comp).each(Disabling.disable);
            },
            onEnabled: comp => {
              FormField.getField(comp).each(Disabling.enable);
            }
          }),
          receivingConfig()
        ])
      });
    };

    const schema$h = constant$1([
      defaulted('field1Name', 'field1'),
      defaulted('field2Name', 'field2'),
      onStrictHandler('onLockedChange'),
      markers$1(['lockClass']),
      defaulted('locked', false),
      SketchBehaviours.field('coupledFieldBehaviours', [
        Composing,
        Representing
      ])
    ]);
    const getField = (comp, detail, partName) => getPart(comp, detail, partName).bind(Composing.getCurrent);
    const coupledPart = (selfName, otherName) => required({
      factory: FormField,
      name: selfName,
      overrides: detail => {
        return {
          fieldBehaviours: derive$1([config('coupled-input-behaviour', [run$1(input(), me => {
                getField(me, detail, otherName).each(other => {
                  getPart(me, detail, 'lock').each(lock => {
                    if (Toggling.isOn(lock)) {
                      detail.onLockedChange(me, other, lock);
                    }
                  });
                });
              })])])
        };
      }
    });
    const parts$c = constant$1([
      coupledPart('field1', 'field2'),
      coupledPart('field2', 'field1'),
      required({
        factory: Button,
        schema: [required$1('dom')],
        name: 'lock',
        overrides: detail => {
          return {
            buttonBehaviours: derive$1([Toggling.config({
                selected: detail.locked,
                toggleClass: detail.markers.lockClass,
                aria: { mode: 'pressed' }
              })])
          };
        }
      })
    ]);

    const factory$e = (detail, components, _spec, _externals) => ({
      uid: detail.uid,
      dom: detail.dom,
      components,
      behaviours: SketchBehaviours.augment(detail.coupledFieldBehaviours, [
        Composing.config({ find: Optional.some }),
        Representing.config({
          store: {
            mode: 'manual',
            getValue: comp => {
              const parts = getPartsOrDie(comp, detail, [
                'field1',
                'field2'
              ]);
              return {
                [detail.field1Name]: Representing.getValue(parts.field1()),
                [detail.field2Name]: Representing.getValue(parts.field2())
              };
            },
            setValue: (comp, value) => {
              const parts = getPartsOrDie(comp, detail, [
                'field1',
                'field2'
              ]);
              if (hasNonNullableKey(value, detail.field1Name)) {
                Representing.setValue(parts.field1(), value[detail.field1Name]);
              }
              if (hasNonNullableKey(value, detail.field2Name)) {
                Representing.setValue(parts.field2(), value[detail.field2Name]);
              }
            }
          }
        })
      ]),
      apis: {
        getField1: component => getPart(component, detail, 'field1'),
        getField2: component => getPart(component, detail, 'field2'),
        getLock: component => getPart(component, detail, 'lock')
      }
    });
    const FormCoupledInputs = composite({
      name: 'FormCoupledInputs',
      configFields: schema$h(),
      partFields: parts$c(),
      factory: factory$e,
      apis: {
        getField1: (apis, component) => apis.getField1(component),
        getField2: (apis, component) => apis.getField2(component),
        getLock: (apis, component) => apis.getLock(component)
      }
    });

    const formatSize = size => {
      const unitDec = {
        '': 0,
        'px': 0,
        'pt': 1,
        'mm': 1,
        'pc': 2,
        'ex': 2,
        'em': 2,
        'ch': 2,
        'rem': 2,
        'cm': 3,
        'in': 4,
        '%': 4
      };
      const maxDecimal = unit => unit in unitDec ? unitDec[unit] : 1;
      let numText = size.value.toFixed(maxDecimal(size.unit));
      if (numText.indexOf('.') !== -1) {
        numText = numText.replace(/\.?0*$/, '');
      }
      return numText + size.unit;
    };
    const parseSize = sizeText => {
      const numPattern = /^\s*(\d+(?:\.\d+)?)\s*(|cm|mm|in|px|pt|pc|em|ex|ch|rem|vw|vh|vmin|vmax|%)\s*$/;
      const match = numPattern.exec(sizeText);
      if (match !== null) {
        const value = parseFloat(match[1]);
        const unit = match[2];
        return Result.value({
          value,
          unit
        });
      } else {
        return Result.error(sizeText);
      }
    };
    const convertUnit = (size, unit) => {
      const inInch = {
        '': 96,
        'px': 96,
        'pt': 72,
        'cm': 2.54,
        'pc': 12,
        'mm': 25.4,
        'in': 1
      };
      const supported = u => has$2(inInch, u);
      if (size.unit === unit) {
        return Optional.some(size.value);
      } else if (supported(size.unit) && supported(unit)) {
        if (inInch[size.unit] === inInch[unit]) {
          return Optional.some(size.value);
        } else {
          return Optional.some(size.value / inInch[size.unit] * inInch[unit]);
        }
      } else {
        return Optional.none();
      }
    };
    const noSizeConversion = _input => Optional.none();
    const ratioSizeConversion = (scale, unit) => size => convertUnit(size, unit).map(value => ({
      value: value * scale,
      unit
    }));
    const makeRatioConverter = (currentFieldText, otherFieldText) => {
      const cValue = parseSize(currentFieldText).toOptional();
      const oValue = parseSize(otherFieldText).toOptional();
      return lift2(cValue, oValue, (cSize, oSize) => convertUnit(cSize, oSize.unit).map(val => oSize.value / val).map(r => ratioSizeConversion(r, oSize.unit)).getOr(noSizeConversion)).getOr(noSizeConversion);
    };

    const renderSizeInput = (spec, providersBackstage) => {
      let converter = noSizeConversion;
      const ratioEvent = generate$6('ratio-event');
      const makeIcon = iconName => render$3(iconName, {
        tag: 'span',
        classes: [
          'tox-icon',
          'tox-lock-icon__' + iconName
        ]
      }, providersBackstage.icons);
      const pLock = FormCoupledInputs.parts.lock({
        dom: {
          tag: 'button',
          classes: [
            'tox-lock',
            'tox-button',
            'tox-button--naked',
            'tox-button--icon'
          ],
          attributes: { title: providersBackstage.translate(spec.label.getOr('Constrain proportions')) }
        },
        components: [
          makeIcon('lock'),
          makeIcon('unlock')
        ],
        buttonBehaviours: derive$1([
          Disabling.config({ disabled: () => !spec.enabled || providersBackstage.isDisabled() }),
          receivingConfig(),
          Tabstopping.config({})
        ])
      });
      const formGroup = components => ({
        dom: {
          tag: 'div',
          classes: ['tox-form__group']
        },
        components
      });
      const getFieldPart = isField1 => FormField.parts.field({
        factory: Input,
        inputClasses: ['tox-textfield'],
        inputBehaviours: derive$1([
          Disabling.config({ disabled: () => !spec.enabled || providersBackstage.isDisabled() }),
          receivingConfig(),
          Tabstopping.config({}),
          config('size-input-events', [
            run$1(focusin(), (component, _simulatedEvent) => {
              emitWith(component, ratioEvent, { isField1 });
            }),
            run$1(change(), (component, _simulatedEvent) => {
              emitWith(component, formChangeEvent, { name: spec.name });
            })
          ])
        ]),
        selectOnFocus: false
      });
      const getLabel = label => ({
        dom: {
          tag: 'label',
          classes: ['tox-label']
        },
        components: [text$1(providersBackstage.translate(label))]
      });
      const widthField = FormCoupledInputs.parts.field1(formGroup([
        FormField.parts.label(getLabel('Width')),
        getFieldPart(true)
      ]));
      const heightField = FormCoupledInputs.parts.field2(formGroup([
        FormField.parts.label(getLabel('Height')),
        getFieldPart(false)
      ]));
      return FormCoupledInputs.sketch({
        dom: {
          tag: 'div',
          classes: ['tox-form__group']
        },
        components: [{
            dom: {
              tag: 'div',
              classes: ['tox-form__controls-h-stack']
            },
            components: [
              widthField,
              heightField,
              formGroup([
                getLabel(nbsp),
                pLock
              ])
            ]
          }],
        field1Name: 'width',
        field2Name: 'height',
        locked: true,
        markers: { lockClass: 'tox-locked' },
        onLockedChange: (current, other, _lock) => {
          parseSize(Representing.getValue(current)).each(size => {
            converter(size).each(newSize => {
              Representing.setValue(other, formatSize(newSize));
            });
          });
        },
        coupledFieldBehaviours: derive$1([
          Disabling.config({
            disabled: () => !spec.enabled || providersBackstage.isDisabled(),
            onDisabled: comp => {
              FormCoupledInputs.getField1(comp).bind(FormField.getField).each(Disabling.disable);
              FormCoupledInputs.getField2(comp).bind(FormField.getField).each(Disabling.disable);
              FormCoupledInputs.getLock(comp).each(Disabling.disable);
            },
            onEnabled: comp => {
              FormCoupledInputs.getField1(comp).bind(FormField.getField).each(Disabling.enable);
              FormCoupledInputs.getField2(comp).bind(FormField.getField).each(Disabling.enable);
              FormCoupledInputs.getLock(comp).each(Disabling.enable);
            }
          }),
          receivingConfig(),
          config('size-input-events2', [run$1(ratioEvent, (component, simulatedEvent) => {
              const isField1 = simulatedEvent.event.isField1;
              const optCurrent = isField1 ? FormCoupledInputs.getField1(component) : FormCoupledInputs.getField2(component);
              const optOther = isField1 ? FormCoupledInputs.getField2(component) : FormCoupledInputs.getField1(component);
              const value1 = optCurrent.map(Representing.getValue).getOr('');
              const value2 = optOther.map(Representing.getValue).getOr('');
              converter = makeRatioConverter(value1, value2);
            })])
        ])
      });
    };

    const renderSlider = (spec, providerBackstage, initialData) => {
      const labelPart = Slider.parts.label({
        dom: {
          tag: 'label',
          classes: ['tox-label']
        },
        components: [text$1(providerBackstage.translate(spec.label))]
      });
      const spectrum = Slider.parts.spectrum({
        dom: {
          tag: 'div',
          classes: ['tox-slider__rail'],
          attributes: { role: 'presentation' }
        }
      });
      const thumb = Slider.parts.thumb({
        dom: {
          tag: 'div',
          classes: ['tox-slider__handle'],
          attributes: { role: 'presentation' }
        }
      });
      return Slider.sketch({
        dom: {
          tag: 'div',
          classes: ['tox-slider'],
          attributes: { role: 'presentation' }
        },
        model: {
          mode: 'x',
          minX: spec.min,
          maxX: spec.max,
          getInitialValue: constant$1(initialData.getOrThunk(() => (Math.abs(spec.max) - Math.abs(spec.min)) / 2))
        },
        components: [
          labelPart,
          spectrum,
          thumb
        ],
        sliderBehaviours: derive$1([
          ComposingConfigs.self(),
          Focusing.config({})
        ]),
        onChoose: (component, thumb, value) => {
          emitWith(component, formChangeEvent, {
            name: spec.name,
            value
          });
        }
      });
    };

    const renderTable = (spec, providersBackstage) => {
      const renderTh = text => ({
        dom: {
          tag: 'th',
          innerHtml: providersBackstage.translate(text)
        }
      });
      const renderHeader = header => ({
        dom: { tag: 'thead' },
        components: [{
            dom: { tag: 'tr' },
            components: map$2(header, renderTh)
          }]
      });
      const renderTd = text => ({
        dom: {
          tag: 'td',
          innerHtml: providersBackstage.translate(text)
        }
      });
      const renderTr = row => ({
        dom: { tag: 'tr' },
        components: map$2(row, renderTd)
      });
      const renderRows = rows => ({
        dom: { tag: 'tbody' },
        components: map$2(rows, renderTr)
      });
      return {
        dom: {
          tag: 'table',
          classes: ['tox-dialog__table']
        },
        components: [
          renderHeader(spec.header),
          renderRows(spec.cells)
        ],
        behaviours: derive$1([
          Tabstopping.config({}),
          Focusing.config({})
        ])
      };
    };

    const renderTextField = (spec, providersBackstage) => {
      const pLabel = spec.label.map(label => renderLabel$2(label, providersBackstage));
      const baseInputBehaviours = [
        Disabling.config({ disabled: () => spec.disabled || providersBackstage.isDisabled() }),
        receivingConfig(),
        Keying.config({
          mode: 'execution',
          useEnter: spec.multiline !== true,
          useControlEnter: spec.multiline === true,
          execute: comp => {
            emit(comp, formSubmitEvent);
            return Optional.some(true);
          }
        }),
        config('textfield-change', [
          run$1(input(), (component, _) => {
            emitWith(component, formChangeEvent, { name: spec.name });
          }),
          run$1(postPaste(), (component, _) => {
            emitWith(component, formChangeEvent, { name: spec.name });
          })
        ]),
        Tabstopping.config({})
      ];
      const validatingBehaviours = spec.validation.map(vl => Invalidating.config({
        getRoot: input => {
          return parentElement(input.element);
        },
        invalidClass: 'tox-invalid',
        validator: {
          validate: input => {
            const v = Representing.getValue(input);
            const result = vl.validator(v);
            return Future.pure(result === true ? Result.value(v) : Result.error(result));
          },
          validateOnLoad: vl.validateOnLoad
        }
      })).toArray();
      const placeholder = spec.placeholder.fold(constant$1({}), p => ({ placeholder: providersBackstage.translate(p) }));
      const inputMode = spec.inputMode.fold(constant$1({}), mode => ({ inputmode: mode }));
      const inputAttributes = {
        ...placeholder,
        ...inputMode
      };
      const pField = FormField.parts.field({
        tag: spec.multiline === true ? 'textarea' : 'input',
        ...spec.data.map(data => ({ data })).getOr({}),
        inputAttributes,
        inputClasses: [spec.classname],
        inputBehaviours: derive$1(flatten([
          baseInputBehaviours,
          validatingBehaviours
        ])),
        selectOnFocus: false,
        factory: Input
      });
      const extraClasses = spec.flex ? ['tox-form__group--stretched'] : [];
      const extraClasses2 = extraClasses.concat(spec.maximized ? ['tox-form-group--maximize'] : []);
      const extraBehaviours = [
        Disabling.config({
          disabled: () => spec.disabled || providersBackstage.isDisabled(),
          onDisabled: comp => {
            FormField.getField(comp).each(Disabling.disable);
          },
          onEnabled: comp => {
            FormField.getField(comp).each(Disabling.enable);
          }
        }),
        receivingConfig()
      ];
      return renderFormFieldWith(pLabel, pField, extraClasses2, extraBehaviours);
    };
    const renderInput = (spec, providersBackstage, initialData) => renderTextField({
      name: spec.name,
      multiline: false,
      label: spec.label,
      inputMode: spec.inputMode,
      placeholder: spec.placeholder,
      flex: false,
      disabled: !spec.enabled,
      classname: 'tox-textfield',
      validation: Optional.none(),
      maximized: spec.maximized,
      data: initialData
    }, providersBackstage);
    const renderTextarea = (spec, providersBackstage, initialData) => renderTextField({
      name: spec.name,
      multiline: true,
      label: spec.label,
      inputMode: Optional.none(),
      placeholder: spec.placeholder,
      flex: true,
      disabled: !spec.enabled,
      classname: 'tox-textarea',
      validation: Optional.none(),
      maximized: spec.maximized,
      data: initialData
    }, providersBackstage);

    const events$6 = (streamConfig, streamState) => {
      const streams = streamConfig.stream.streams;
      const processor = streams.setup(streamConfig, streamState);
      return derive$2([
        run$1(streamConfig.event, processor),
        runOnDetached(() => streamState.cancel())
      ].concat(streamConfig.cancelEvent.map(e => [run$1(e, () => streamState.cancel())]).getOr([])));
    };

    var ActiveStreaming = /*#__PURE__*/Object.freeze({
        __proto__: null,
        events: events$6
    });

    const first = (fn, rate) => {
      let timer = null;
      const cancel = () => {
        if (!isNull(timer)) {
          clearTimeout(timer);
          timer = null;
        }
      };
      const throttle = (...args) => {
        if (isNull(timer)) {
          timer = setTimeout(() => {
            timer = null;
            fn.apply(null, args);
          }, rate);
        }
      };
      return {
        cancel,
        throttle
      };
    };
    const last = (fn, rate) => {
      let timer = null;
      const cancel = () => {
        if (!isNull(timer)) {
          clearTimeout(timer);
          timer = null;
        }
      };
      const throttle = (...args) => {
        cancel();
        timer = setTimeout(() => {
          timer = null;
          fn.apply(null, args);
        }, rate);
      };
      return {
        cancel,
        throttle
      };
    };

    const throttle = _config => {
      const state = Cell(null);
      const readState = () => ({ timer: state.get() !== null ? 'set' : 'unset' });
      const setTimer = t => {
        state.set(t);
      };
      const cancel = () => {
        const t = state.get();
        if (t !== null) {
          t.cancel();
        }
      };
      return nu$8({
        readState,
        setTimer,
        cancel
      });
    };
    const init$9 = spec => spec.stream.streams.state(spec);

    var StreamingState = /*#__PURE__*/Object.freeze({
        __proto__: null,
        throttle: throttle,
        init: init$9
    });

    const setup$c = (streamInfo, streamState) => {
      const sInfo = streamInfo.stream;
      const throttler = last(streamInfo.onStream, sInfo.delay);
      streamState.setTimer(throttler);
      return (component, simulatedEvent) => {
        throttler.throttle(component, simulatedEvent);
        if (sInfo.stopEvent) {
          simulatedEvent.stop();
        }
      };
    };
    var StreamingSchema = [
      requiredOf('stream', choose$1('mode', {
        throttle: [
          required$1('delay'),
          defaulted('stopEvent', true),
          output$1('streams', {
            setup: setup$c,
            state: throttle
          })
        ]
      })),
      defaulted('event', 'input'),
      option$3('cancelEvent'),
      onStrictHandler('onStream')
    ];

    const Streaming = create$3({
      fields: StreamingSchema,
      name: 'streaming',
      active: ActiveStreaming,
      state: StreamingState
    });

    const setValueFromItem = (model, input, item) => {
      const itemData = Representing.getValue(item);
      Representing.setValue(input, itemData);
      setCursorAtEnd(input);
    };
    const setSelectionOn = (input, f) => {
      const el = input.element;
      const value = get$6(el);
      const node = el.dom;
      if (get$f(el, 'type') !== 'number') {
        f(node, value);
      }
    };
    const setCursorAtEnd = input => {
      setSelectionOn(input, (node, value) => node.setSelectionRange(value.length, value.length));
    };
    const setSelectionToEnd = (input, startOffset) => {
      setSelectionOn(input, (node, value) => node.setSelectionRange(startOffset, value.length));
    };
    const attemptSelectOver = (model, input, item) => {
      if (!model.selectsOver) {
        return Optional.none();
      } else {
        const currentValue = Representing.getValue(input);
        const inputDisplay = model.getDisplayText(currentValue);
        const itemValue = Representing.getValue(item);
        const itemDisplay = model.getDisplayText(itemValue);
        return itemDisplay.indexOf(inputDisplay) === 0 ? Optional.some(() => {
          setValueFromItem(model, input, item);
          setSelectionToEnd(input, inputDisplay.length);
        }) : Optional.none();
      }
    };

    const itemExecute = constant$1('alloy.typeahead.itemexecute');

    const make$3 = (detail, components, spec, externals) => {
      const navigateList = (comp, simulatedEvent, highlighter) => {
        detail.previewing.set(false);
        const sandbox = Coupling.getCoupled(comp, 'sandbox');
        if (Sandboxing.isOpen(sandbox)) {
          Composing.getCurrent(sandbox).each(menu => {
            Highlighting.getHighlighted(menu).fold(() => {
              highlighter(menu);
            }, () => {
              dispatchEvent(sandbox, menu.element, 'keydown', simulatedEvent);
            });
          });
        } else {
          const onOpenSync = sandbox => {
            Composing.getCurrent(sandbox).each(highlighter);
          };
          open(detail, mapFetch(comp), comp, sandbox, externals, onOpenSync, HighlightOnOpen.HighlightMenuAndItem).get(noop);
        }
      };
      const focusBehaviours$1 = focusBehaviours(detail);
      const mapFetch = comp => tdata => tdata.map(data => {
        const menus = values(data.menus);
        const items = bind$3(menus, menu => filter$2(menu.items, item => item.type === 'item'));
        const repState = Representing.getState(comp);
        repState.update(map$2(items, item => item.data));
        return data;
      });
      const getActiveMenu = sandboxComp => Composing.getCurrent(sandboxComp);
      const typeaheadCustomEvents = 'typeaheadevents';
      const behaviours = [
        Focusing.config({}),
        Representing.config({
          onSetValue: detail.onSetValue,
          store: {
            mode: 'dataset',
            getDataKey: comp => get$6(comp.element),
            getFallbackEntry: itemString => ({
              value: itemString,
              meta: {}
            }),
            setValue: (comp, data) => {
              set$5(comp.element, detail.model.getDisplayText(data));
            },
            ...detail.initialData.map(d => wrap$1('initialValue', d)).getOr({})
          }
        }),
        Streaming.config({
          stream: {
            mode: 'throttle',
            delay: detail.responseTime,
            stopEvent: false
          },
          onStream: (component, _simulatedEvent) => {
            const sandbox = Coupling.getCoupled(component, 'sandbox');
            const focusInInput = Focusing.isFocused(component);
            if (focusInInput) {
              if (get$6(component.element).length >= detail.minChars) {
                const previousValue = getActiveMenu(sandbox).bind(activeMenu => Highlighting.getHighlighted(activeMenu).map(Representing.getValue));
                detail.previewing.set(true);
                const onOpenSync = _sandbox => {
                  getActiveMenu(sandbox).each(activeMenu => {
                    previousValue.fold(() => {
                      if (detail.model.selectsOver) {
                        Highlighting.highlightFirst(activeMenu);
                      }
                    }, pv => {
                      Highlighting.highlightBy(activeMenu, item => {
                        const itemData = Representing.getValue(item);
                        return itemData.value === pv.value;
                      });
                      Highlighting.getHighlighted(activeMenu).orThunk(() => {
                        Highlighting.highlightFirst(activeMenu);
                        return Optional.none();
                      });
                    });
                  });
                };
                open(detail, mapFetch(component), component, sandbox, externals, onOpenSync, HighlightOnOpen.HighlightJustMenu).get(noop);
              }
            }
          },
          cancelEvent: typeaheadCancel()
        }),
        Keying.config({
          mode: 'special',
          onDown: (comp, simulatedEvent) => {
            navigateList(comp, simulatedEvent, Highlighting.highlightFirst);
            return Optional.some(true);
          },
          onEscape: comp => {
            const sandbox = Coupling.getCoupled(comp, 'sandbox');
            if (Sandboxing.isOpen(sandbox)) {
              Sandboxing.close(sandbox);
              return Optional.some(true);
            }
            return Optional.none();
          },
          onUp: (comp, simulatedEvent) => {
            navigateList(comp, simulatedEvent, Highlighting.highlightLast);
            return Optional.some(true);
          },
          onEnter: comp => {
            const sandbox = Coupling.getCoupled(comp, 'sandbox');
            const sandboxIsOpen = Sandboxing.isOpen(sandbox);
            if (sandboxIsOpen && !detail.previewing.get()) {
              return getActiveMenu(sandbox).bind(activeMenu => Highlighting.getHighlighted(activeMenu)).map(item => {
                emitWith(comp, itemExecute(), { item });
                return true;
              });
            } else {
              const currentValue = Representing.getValue(comp);
              emit(comp, typeaheadCancel());
              detail.onExecute(sandbox, comp, currentValue);
              if (sandboxIsOpen) {
                Sandboxing.close(sandbox);
              }
              return Optional.some(true);
            }
          }
        }),
        Toggling.config({
          toggleClass: detail.markers.openClass,
          aria: { mode: 'expanded' }
        }),
        Coupling.config({
          others: {
            sandbox: hotspot => {
              return makeSandbox$1(detail, hotspot, {
                onOpen: () => Toggling.on(hotspot),
                onClose: () => Toggling.off(hotspot)
              });
            }
          }
        }),
        config(typeaheadCustomEvents, [
          runOnAttached(typeaheadComp => {
            detail.lazyTypeaheadComp.set(Optional.some(typeaheadComp));
          }),
          runOnDetached(_typeaheadComp => {
            detail.lazyTypeaheadComp.set(Optional.none());
          }),
          runOnExecute$1(comp => {
            const onOpenSync = noop;
            togglePopup(detail, mapFetch(comp), comp, externals, onOpenSync, HighlightOnOpen.HighlightMenuAndItem).get(noop);
          }),
          run$1(itemExecute(), (comp, se) => {
            const sandbox = Coupling.getCoupled(comp, 'sandbox');
            setValueFromItem(detail.model, comp, se.event.item);
            emit(comp, typeaheadCancel());
            detail.onItemExecute(comp, sandbox, se.event.item, Representing.getValue(comp));
            Sandboxing.close(sandbox);
            setCursorAtEnd(comp);
          })
        ].concat(detail.dismissOnBlur ? [run$1(postBlur(), typeahead => {
            const sandbox = Coupling.getCoupled(typeahead, 'sandbox');
            if (search(sandbox.element).isNone()) {
              Sandboxing.close(sandbox);
            }
          })] : []))
      ];
      const eventOrder = {
        [detachedFromDom()]: [
          Representing.name(),
          Streaming.name(),
          typeaheadCustomEvents
        ],
        ...detail.eventOrder
      };
      return {
        uid: detail.uid,
        dom: dom(deepMerge(detail, {
          inputAttributes: {
            'role': 'combobox',
            'aria-autocomplete': 'list',
            'aria-haspopup': 'true'
          }
        })),
        behaviours: {
          ...focusBehaviours$1,
          ...augment(detail.typeaheadBehaviours, behaviours)
        },
        eventOrder
      };
    };

    const schema$g = constant$1([
      option$3('lazySink'),
      required$1('fetch'),
      defaulted('minChars', 5),
      defaulted('responseTime', 1000),
      onHandler('onOpen'),
      defaulted('getHotspot', Optional.some),
      defaulted('getAnchorOverrides', constant$1({})),
      defaulted('layouts', Optional.none()),
      defaulted('eventOrder', {}),
      defaultedObjOf('model', {}, [
        defaulted('getDisplayText', itemData => itemData.meta !== undefined && itemData.meta.text !== undefined ? itemData.meta.text : itemData.value),
        defaulted('selectsOver', true),
        defaulted('populateFromBrowse', true)
      ]),
      onHandler('onSetValue'),
      onKeyboardHandler('onExecute'),
      onHandler('onItemExecute'),
      defaulted('inputClasses', []),
      defaulted('inputAttributes', {}),
      defaulted('inputStyles', {}),
      defaulted('matchWidth', true),
      defaulted('useMinWidth', false),
      defaulted('dismissOnBlur', true),
      markers$1(['openClass']),
      option$3('initialData'),
      field('typeaheadBehaviours', [
        Focusing,
        Representing,
        Streaming,
        Keying,
        Toggling,
        Coupling
      ]),
      customField('lazyTypeaheadComp', () => Cell(Optional.none)),
      customField('previewing', () => Cell(true))
    ].concat(schema$l()).concat(sandboxFields()));
    const parts$b = constant$1([external({
        schema: [tieredMenuMarkers()],
        name: 'menu',
        overrides: detail => {
          return {
            fakeFocus: true,
            onHighlightItem: (_tmenu, menu, item) => {
              if (!detail.previewing.get()) {
                detail.lazyTypeaheadComp.get().each(input => {
                  if (detail.model.populateFromBrowse) {
                    setValueFromItem(detail.model, input, item);
                  }
                });
              } else {
                detail.lazyTypeaheadComp.get().each(input => {
                  attemptSelectOver(detail.model, input, item).fold(() => {
                    if (detail.model.selectsOver) {
                      Highlighting.dehighlight(menu, item);
                      detail.previewing.set(true);
                    } else {
                      detail.previewing.set(false);
                    }
                  }, selectOverTextInInput => {
                    selectOverTextInInput();
                    detail.previewing.set(false);
                  });
                });
              }
            },
            onExecute: (_menu, item) => {
              return detail.lazyTypeaheadComp.get().map(typeahead => {
                emitWith(typeahead, itemExecute(), { item });
                return true;
              });
            },
            onHover: (menu, item) => {
              detail.previewing.set(false);
              detail.lazyTypeaheadComp.get().each(input => {
                if (detail.model.populateFromBrowse) {
                  setValueFromItem(detail.model, input, item);
                }
              });
            }
          };
        }
      })]);

    const Typeahead = composite({
      name: 'Typeahead',
      configFields: schema$g(),
      partFields: parts$b(),
      factory: make$3
    });

    const wrap = delegate => {
      const toCached = () => {
        return wrap(delegate.toCached());
      };
      const bindFuture = f => {
        return wrap(delegate.bind(resA => resA.fold(err => Future.pure(Result.error(err)), a => f(a))));
      };
      const bindResult = f => {
        return wrap(delegate.map(resA => resA.bind(f)));
      };
      const mapResult = f => {
        return wrap(delegate.map(resA => resA.map(f)));
      };
      const mapError = f => {
        return wrap(delegate.map(resA => resA.mapError(f)));
      };
      const foldResult = (whenError, whenValue) => {
        return delegate.map(res => res.fold(whenError, whenValue));
      };
      const withTimeout = (timeout, errorThunk) => {
        return wrap(Future.nu(callback => {
          let timedOut = false;
          const timer = setTimeout(() => {
            timedOut = true;
            callback(Result.error(errorThunk()));
          }, timeout);
          delegate.get(result => {
            if (!timedOut) {
              clearTimeout(timer);
              callback(result);
            }
          });
        }));
      };
      return {
        ...delegate,
        toCached,
        bindFuture,
        bindResult,
        mapResult,
        mapError,
        foldResult,
        withTimeout
      };
    };
    const nu$1 = worker => {
      return wrap(Future.nu(worker));
    };
    const value = value => {
      return wrap(Future.pure(Result.value(value)));
    };
    const error = error => {
      return wrap(Future.pure(Result.error(error)));
    };
    const fromResult = result => {
      return wrap(Future.pure(result));
    };
    const fromFuture = future => {
      return wrap(future.map(Result.value));
    };
    const fromPromise = promise => {
      return nu$1(completer => {
        promise.then(value => {
          completer(Result.value(value));
        }, error => {
          completer(Result.error(error));
        });
      });
    };
    const FutureResult = {
      nu: nu$1,
      wrap,
      pure: value,
      value,
      error,
      fromResult,
      fromFuture,
      fromPromise
    };

    const getMenuButtonApi = component => ({
      isEnabled: () => !Disabling.isDisabled(component),
      setEnabled: state => Disabling.set(component, !state),
      setActive: state => {
        const elm = component.element;
        if (state) {
          add$2(elm, 'tox-tbtn--enabled');
          set$9(elm, 'aria-pressed', true);
        } else {
          remove$2(elm, 'tox-tbtn--enabled');
          remove$7(elm, 'aria-pressed');
        }
      },
      isActive: () => has(component.element, 'tox-tbtn--enabled')
    });
    const renderMenuButton = (spec, prefix, backstage, role) => {
      return renderCommonDropdown({
        text: spec.text,
        icon: spec.icon,
        tooltip: spec.tooltip,
        searchable: spec.search.isSome(),
        role,
        fetch: (dropdownComp, callback) => {
          const fetchContext = { pattern: spec.search.isSome() ? getSearchPattern(dropdownComp) : '' };
          spec.fetch(items => {
            callback(build(items, ItemResponse$1.CLOSE_ON_EXECUTE, backstage, {
              isHorizontalMenu: false,
              search: spec.search
            }));
          }, fetchContext);
        },
        onSetup: spec.onSetup,
        getApi: getMenuButtonApi,
        columns: 1,
        presets: 'normal',
        classes: [],
        dropdownBehaviours: [Tabstopping.config({})]
      }, prefix, backstage.shared);
    };
    const getFetch = (items, getButton, backstage) => {
      const getMenuItemAction = item => api => {
        const newValue = !api.isActive();
        api.setActive(newValue);
        item.storage.set(newValue);
        backstage.shared.getSink().each(sink => {
          getButton().getOpt(sink).each(orig => {
            focus$3(orig.element);
            emitWith(orig, formActionEvent, {
              name: item.name,
              value: item.storage.get()
            });
          });
        });
      };
      const getMenuItemSetup = item => api => {
        api.setActive(item.storage.get());
      };
      return success => {
        success(map$2(items, item => {
          const text = item.text.fold(() => ({}), text => ({ text }));
          return {
            type: item.type,
            active: false,
            ...text,
            onAction: getMenuItemAction(item),
            onSetup: getMenuItemSetup(item)
          };
        }));
      };
    };

    const renderCommonSpec = (spec, actionOpt, extraBehaviours = [], dom, components, providersBackstage) => {
      const action = actionOpt.fold(() => ({}), action => ({ action }));
      const common = {
        buttonBehaviours: derive$1([
          DisablingConfigs.button(() => !spec.enabled || providersBackstage.isDisabled()),
          receivingConfig(),
          Tabstopping.config({}),
          config('button press', [
            preventDefault('click'),
            preventDefault('mousedown')
          ])
        ].concat(extraBehaviours)),
        eventOrder: {
          click: [
            'button press',
            'alloy.base.behaviour'
          ],
          mousedown: [
            'button press',
            'alloy.base.behaviour'
          ]
        },
        ...action
      };
      const domFinal = deepMerge(common, { dom });
      return deepMerge(domFinal, { components });
    };
    const renderIconButtonSpec = (spec, action, providersBackstage, extraBehaviours = []) => {
      const tooltipAttributes = spec.tooltip.map(tooltip => ({
        'aria-label': providersBackstage.translate(tooltip),
        'title': providersBackstage.translate(tooltip)
      })).getOr({});
      const dom = {
        tag: 'button',
        classes: ['tox-tbtn'],
        attributes: tooltipAttributes
      };
      const icon = spec.icon.map(iconName => renderIconFromPack(iconName, providersBackstage.icons));
      const components = componentRenderPipeline([icon]);
      return renderCommonSpec(spec, action, extraBehaviours, dom, components, providersBackstage);
    };
    const calculateClassesFromButtonType = buttonType => {
      switch (buttonType) {
      case 'primary':
        return ['tox-button'];
      case 'toolbar':
        return ['tox-tbtn'];
      case 'secondary':
      default:
        return [
          'tox-button',
          'tox-button--secondary'
        ];
      }
    };
    const renderButtonSpec = (spec, action, providersBackstage, extraBehaviours = [], extraClasses = []) => {
      const translatedText = providersBackstage.translate(spec.text);
      const icon = spec.icon.map(iconName => renderIconFromPack(iconName, providersBackstage.icons));
      const components = [icon.getOrThunk(() => text$1(translatedText))];
      const buttonType = spec.buttonType.getOr(!spec.primary && !spec.borderless ? 'secondary' : 'primary');
      const baseClasses = calculateClassesFromButtonType(buttonType);
      const classes = [
        ...baseClasses,
        ...icon.isSome() ? ['tox-button--icon'] : [],
        ...spec.borderless ? ['tox-button--naked'] : [],
        ...extraClasses
      ];
      const dom = {
        tag: 'button',
        classes,
        attributes: { title: translatedText }
      };
      return renderCommonSpec(spec, action, extraBehaviours, dom, components, providersBackstage);
    };
    const renderButton = (spec, action, providersBackstage, extraBehaviours = [], extraClasses = []) => {
      const buttonSpec = renderButtonSpec(spec, Optional.some(action), providersBackstage, extraBehaviours, extraClasses);
      return Button.sketch(buttonSpec);
    };
    const getAction = (name, buttonType) => comp => {
      if (buttonType === 'custom') {
        emitWith(comp, formActionEvent, {
          name,
          value: {}
        });
      } else if (buttonType === 'submit') {
        emit(comp, formSubmitEvent);
      } else if (buttonType === 'cancel') {
        emit(comp, formCancelEvent);
      } else {
        console.error('Unknown button type: ', buttonType);
      }
    };
    const isMenuFooterButtonSpec = (spec, buttonType) => buttonType === 'menu';
    const isNormalFooterButtonSpec = (spec, buttonType) => buttonType === 'custom' || buttonType === 'cancel' || buttonType === 'submit';
    const renderFooterButton = (spec, buttonType, backstage) => {
      if (isMenuFooterButtonSpec(spec, buttonType)) {
        const getButton = () => memButton;
        const menuButtonSpec = spec;
        const fixedSpec = {
          ...spec,
          type: 'menubutton',
          search: Optional.none(),
          onSetup: api => {
            api.setEnabled(spec.enabled);
            return noop;
          },
          fetch: getFetch(menuButtonSpec.items, getButton, backstage)
        };
        const memButton = record(renderMenuButton(fixedSpec, 'tox-tbtn', backstage, Optional.none()));
        return memButton.asSpec();
      } else if (isNormalFooterButtonSpec(spec, buttonType)) {
        const action = getAction(spec.name, buttonType);
        const buttonSpec = {
          ...spec,
          borderless: false
        };
        return renderButton(buttonSpec, action, backstage.shared.providers, []);
      } else {
        console.error('Unknown footer button type: ', buttonType);
        throw new Error('Unknown footer button type');
      }
    };
    const renderDialogButton = (spec, providersBackstage) => {
      const action = getAction(spec.name, 'custom');
      return renderFormField(Optional.none(), FormField.parts.field({
        factory: Button,
        ...renderButtonSpec(spec, Optional.some(action), providersBackstage, [
          RepresentingConfigs.memory(''),
          ComposingConfigs.self()
        ])
      }));
    };

    const separator$1 = { type: 'separator' };
    const toMenuItem = target => ({
      type: 'menuitem',
      value: target.url,
      text: target.title,
      meta: { attach: target.attach },
      onAction: noop
    });
    const staticMenuItem = (title, url) => ({
      type: 'menuitem',
      value: url,
      text: title,
      meta: { attach: undefined },
      onAction: noop
    });
    const toMenuItems = targets => map$2(targets, toMenuItem);
    const filterLinkTargets = (type, targets) => filter$2(targets, target => target.type === type);
    const filteredTargets = (type, targets) => toMenuItems(filterLinkTargets(type, targets));
    const headerTargets = linkInfo => filteredTargets('header', linkInfo.targets);
    const anchorTargets = linkInfo => filteredTargets('anchor', linkInfo.targets);
    const anchorTargetTop = linkInfo => Optional.from(linkInfo.anchorTop).map(url => staticMenuItem('<top>', url)).toArray();
    const anchorTargetBottom = linkInfo => Optional.from(linkInfo.anchorBottom).map(url => staticMenuItem('<bottom>', url)).toArray();
    const historyTargets = history => map$2(history, url => staticMenuItem(url, url));
    const joinMenuLists = items => {
      return foldl(items, (a, b) => {
        const bothEmpty = a.length === 0 || b.length === 0;
        return bothEmpty ? a.concat(b) : a.concat(separator$1, b);
      }, []);
    };
    const filterByQuery = (term, menuItems) => {
      const lowerCaseTerm = term.toLowerCase();
      return filter$2(menuItems, item => {
        var _a;
        const text = item.meta !== undefined && item.meta.text !== undefined ? item.meta.text : item.text;
        const value = (_a = item.value) !== null && _a !== void 0 ? _a : '';
        return contains$1(text.toLowerCase(), lowerCaseTerm) || contains$1(value.toLowerCase(), lowerCaseTerm);
      });
    };

    const getItems = (fileType, input, urlBackstage) => {
      const urlInputValue = Representing.getValue(input);
      const term = urlInputValue.meta.text !== undefined ? urlInputValue.meta.text : urlInputValue.value;
      const info = urlBackstage.getLinkInformation();
      return info.fold(() => [], linkInfo => {
        const history = filterByQuery(term, historyTargets(urlBackstage.getHistory(fileType)));
        return fileType === 'file' ? joinMenuLists([
          history,
          filterByQuery(term, headerTargets(linkInfo)),
          filterByQuery(term, flatten([
            anchorTargetTop(linkInfo),
            anchorTargets(linkInfo),
            anchorTargetBottom(linkInfo)
          ]))
        ]) : history;
      });
    };
    const errorId = generate$6('aria-invalid');
    const renderUrlInput = (spec, backstage, urlBackstage, initialData) => {
      const providersBackstage = backstage.shared.providers;
      const updateHistory = component => {
        const urlEntry = Representing.getValue(component);
        urlBackstage.addToHistory(urlEntry.value, spec.filetype);
      };
      const typeaheadSpec = {
        ...initialData.map(initialData => ({ initialData })).getOr({}),
        dismissOnBlur: true,
        inputClasses: ['tox-textfield'],
        sandboxClasses: ['tox-dialog__popups'],
        inputAttributes: {
          'aria-errormessage': errorId,
          'type': 'url'
        },
        minChars: 0,
        responseTime: 0,
        fetch: input => {
          const items = getItems(spec.filetype, input, urlBackstage);
          const tdata = build(items, ItemResponse$1.BUBBLE_TO_SANDBOX, backstage, {
            isHorizontalMenu: false,
            search: Optional.none()
          });
          return Future.pure(tdata);
        },
        getHotspot: comp => memUrlBox.getOpt(comp),
        onSetValue: (comp, _newValue) => {
          if (comp.hasConfigured(Invalidating)) {
            Invalidating.run(comp).get(noop);
          }
        },
        typeaheadBehaviours: derive$1([
          ...urlBackstage.getValidationHandler().map(handler => Invalidating.config({
            getRoot: comp => parentElement(comp.element),
            invalidClass: 'tox-control-wrap--status-invalid',
            notify: {
              onInvalid: (comp, err) => {
                memInvalidIcon.getOpt(comp).each(invalidComp => {
                  set$9(invalidComp.element, 'title', providersBackstage.translate(err));
                });
              }
            },
            validator: {
              validate: input => {
                const urlEntry = Representing.getValue(input);
                return FutureResult.nu(completer => {
                  handler({
                    type: spec.filetype,
                    url: urlEntry.value
                  }, validation => {
                    if (validation.status === 'invalid') {
                      const err = Result.error(validation.message);
                      completer(err);
                    } else {
                      const val = Result.value(validation.message);
                      completer(val);
                    }
                  });
                });
              },
              validateOnLoad: false
            }
          })).toArray(),
          Disabling.config({ disabled: () => !spec.enabled || providersBackstage.isDisabled() }),
          Tabstopping.config({}),
          config('urlinput-events', [
            run$1(input(), comp => {
              const currentValue = get$6(comp.element);
              const trimmedValue = currentValue.trim();
              if (trimmedValue !== currentValue) {
                set$5(comp.element, trimmedValue);
              }
              if (spec.filetype === 'file') {
                emitWith(comp, formChangeEvent, { name: spec.name });
              }
            }),
            run$1(change(), comp => {
              emitWith(comp, formChangeEvent, { name: spec.name });
              updateHistory(comp);
            }),
            run$1(postPaste(), comp => {
              emitWith(comp, formChangeEvent, { name: spec.name });
              updateHistory(comp);
            })
          ])
        ]),
        eventOrder: {
          [input()]: [
            'streaming',
            'urlinput-events',
            'invalidating'
          ]
        },
        model: {
          getDisplayText: itemData => itemData.value,
          selectsOver: false,
          populateFromBrowse: false
        },
        markers: { openClass: 'tox-textfield--popup-open' },
        lazySink: backstage.shared.getSink,
        parts: { menu: part(false, 1, 'normal') },
        onExecute: (_menu, component, _entry) => {
          emitWith(component, formSubmitEvent, {});
        },
        onItemExecute: (typeahead, _sandbox, _item, _value) => {
          updateHistory(typeahead);
          emitWith(typeahead, formChangeEvent, { name: spec.name });
        }
      };
      const pField = FormField.parts.field({
        ...typeaheadSpec,
        factory: Typeahead
      });
      const pLabel = spec.label.map(label => renderLabel$2(label, providersBackstage));
      const makeIcon = (name, errId, icon = name, label = name) => render$3(icon, {
        tag: 'div',
        classes: [
          'tox-icon',
          'tox-control-wrap__status-icon-' + name
        ],
        attributes: {
          'title': providersBackstage.translate(label),
          'aria-live': 'polite',
          ...errId.fold(() => ({}), id => ({ id }))
        }
      }, providersBackstage.icons);
      const memInvalidIcon = record(makeIcon('invalid', Optional.some(errorId), 'warning'));
      const memStatus = record({
        dom: {
          tag: 'div',
          classes: ['tox-control-wrap__status-icon-wrap']
        },
        components: [memInvalidIcon.asSpec()]
      });
      const optUrlPicker = urlBackstage.getUrlPicker(spec.filetype);
      const browseUrlEvent = generate$6('browser.url.event');
      const memUrlBox = record({
        dom: {
          tag: 'div',
          classes: ['tox-control-wrap']
        },
        components: [
          pField,
          memStatus.asSpec()
        ],
        behaviours: derive$1([Disabling.config({ disabled: () => !spec.enabled || providersBackstage.isDisabled() })])
      });
      const memUrlPickerButton = record(renderButton({
        name: spec.name,
        icon: Optional.some('browse'),
        text: spec.label.getOr(''),
        enabled: spec.enabled,
        primary: false,
        buttonType: Optional.none(),
        borderless: true
      }, component => emit(component, browseUrlEvent), providersBackstage, [], ['tox-browse-url']));
      const controlHWrapper = () => ({
        dom: {
          tag: 'div',
          classes: ['tox-form__controls-h-stack']
        },
        components: flatten([
          [memUrlBox.asSpec()],
          optUrlPicker.map(() => memUrlPickerButton.asSpec()).toArray()
        ])
      });
      const openUrlPicker = comp => {
        Composing.getCurrent(comp).each(field => {
          const componentData = Representing.getValue(field);
          const urlData = {
            fieldname: spec.name,
            ...componentData
          };
          optUrlPicker.each(picker => {
            picker(urlData).get(chosenData => {
              Representing.setValue(field, chosenData);
              emitWith(comp, formChangeEvent, { name: spec.name });
            });
          });
        });
      };
      return FormField.sketch({
        dom: renderFormFieldDom(),
        components: pLabel.toArray().concat([controlHWrapper()]),
        fieldBehaviours: derive$1([
          Disabling.config({
            disabled: () => !spec.enabled || providersBackstage.isDisabled(),
            onDisabled: comp => {
              FormField.getField(comp).each(Disabling.disable);
              memUrlPickerButton.getOpt(comp).each(Disabling.disable);
            },
            onEnabled: comp => {
              FormField.getField(comp).each(Disabling.enable);
              memUrlPickerButton.getOpt(comp).each(Disabling.enable);
            }
          }),
          receivingConfig(),
          config('url-input-events', [run$1(browseUrlEvent, openUrlPicker)])
        ])
      });
    };

    const renderAlertBanner = (spec, providersBackstage) => Container.sketch({
      dom: {
        tag: 'div',
        attributes: { role: 'alert' },
        classes: [
          'tox-notification',
          'tox-notification--in',
          `tox-notification--${ spec.level }`
        ]
      },
      components: [
        {
          dom: {
            tag: 'div',
            classes: ['tox-notification__icon']
          },
          components: [Button.sketch({
              dom: {
                tag: 'button',
                classes: [
                  'tox-button',
                  'tox-button--naked',
                  'tox-button--icon'
                ],
                innerHtml: get$2(spec.icon, providersBackstage.icons),
                attributes: { title: providersBackstage.translate(spec.iconTooltip) }
              },
              action: comp => {
                emitWith(comp, formActionEvent, {
                  name: 'alert-banner',
                  value: spec.url
                });
              },
              buttonBehaviours: derive$1([addFocusableBehaviour()])
            })]
        },
        {
          dom: {
            tag: 'div',
            classes: ['tox-notification__body'],
            innerHtml: providersBackstage.translate(spec.text)
          }
        }
      ]
    });

    const set$1 = (element, status) => {
      element.dom.checked = status;
    };
    const get$1 = element => element.dom.checked;

    const renderCheckbox = (spec, providerBackstage, initialData) => {
      const toggleCheckboxHandler = comp => {
        comp.element.dom.click();
        return Optional.some(true);
      };
      const pField = FormField.parts.field({
        factory: { sketch: identity },
        dom: {
          tag: 'input',
          classes: ['tox-checkbox__input'],
          attributes: { type: 'checkbox' }
        },
        behaviours: derive$1([
          ComposingConfigs.self(),
          Disabling.config({ disabled: () => !spec.enabled || providerBackstage.isDisabled() }),
          Tabstopping.config({}),
          Focusing.config({}),
          RepresentingConfigs.withElement(initialData, get$1, set$1),
          Keying.config({
            mode: 'special',
            onEnter: toggleCheckboxHandler,
            onSpace: toggleCheckboxHandler,
            stopSpaceKeyup: true
          }),
          config('checkbox-events', [run$1(change(), (component, _) => {
              emitWith(component, formChangeEvent, { name: spec.name });
            })])
        ])
      });
      const pLabel = FormField.parts.label({
        dom: {
          tag: 'span',
          classes: ['tox-checkbox__label']
        },
        components: [text$1(providerBackstage.translate(spec.label))],
        behaviours: derive$1([Unselecting.config({})])
      });
      const makeIcon = className => {
        const iconName = className === 'checked' ? 'selected' : 'unselected';
        return render$3(iconName, {
          tag: 'span',
          classes: [
            'tox-icon',
            'tox-checkbox-icon__' + className
          ]
        }, providerBackstage.icons);
      };
      const memIcons = record({
        dom: {
          tag: 'div',
          classes: ['tox-checkbox__icons']
        },
        components: [
          makeIcon('checked'),
          makeIcon('unchecked')
        ]
      });
      return FormField.sketch({
        dom: {
          tag: 'label',
          classes: ['tox-checkbox']
        },
        components: [
          pField,
          memIcons.asSpec(),
          pLabel
        ],
        fieldBehaviours: derive$1([
          Disabling.config({
            disabled: () => !spec.enabled || providerBackstage.isDisabled(),
            disableClass: 'tox-checkbox--disabled',
            onDisabled: comp => {
              FormField.getField(comp).each(Disabling.disable);
            },
            onEnabled: comp => {
              FormField.getField(comp).each(Disabling.enable);
            }
          }),
          receivingConfig()
        ])
      });
    };

    const renderHtmlPanel = spec => {
      if (spec.presets === 'presentation') {
        return Container.sketch({
          dom: {
            tag: 'div',
            classes: ['tox-form__group'],
            innerHtml: spec.html
          }
        });
      } else {
        return Container.sketch({
          dom: {
            tag: 'div',
            classes: ['tox-form__group'],
            innerHtml: spec.html,
            attributes: { role: 'document' }
          },
          containerBehaviours: derive$1([
            Tabstopping.config({}),
            Focusing.config({})
          ])
        });
      }
    };

    const make$2 = render => {
      return (parts, spec, dialogData, backstage) => get$g(spec, 'name').fold(() => render(spec, backstage, Optional.none()), fieldName => parts.field(fieldName, render(spec, backstage, get$g(dialogData, fieldName))));
    };
    const makeIframe = render => (parts, spec, dialogData, backstage) => {
      const iframeSpec = deepMerge(spec, { source: 'dynamic' });
      return make$2(render)(parts, iframeSpec, dialogData, backstage);
    };
    const factories = {
      bar: make$2((spec, backstage) => renderBar(spec, backstage.shared)),
      collection: make$2((spec, backstage, data) => renderCollection(spec, backstage.shared.providers, data)),
      alertbanner: make$2((spec, backstage) => renderAlertBanner(spec, backstage.shared.providers)),
      input: make$2((spec, backstage, data) => renderInput(spec, backstage.shared.providers, data)),
      textarea: make$2((spec, backstage, data) => renderTextarea(spec, backstage.shared.providers, data)),
      label: make$2((spec, backstage) => renderLabel$1(spec, backstage.shared)),
      iframe: makeIframe((spec, backstage, data) => renderIFrame(spec, backstage.shared.providers, data)),
      button: make$2((spec, backstage) => renderDialogButton(spec, backstage.shared.providers)),
      checkbox: make$2((spec, backstage, data) => renderCheckbox(spec, backstage.shared.providers, data)),
      colorinput: make$2((spec, backstage, data) => renderColorInput(spec, backstage.shared, backstage.colorinput, data)),
      colorpicker: make$2((spec, backstage, data) => renderColorPicker(spec, backstage.shared.providers, data)),
      dropzone: make$2((spec, backstage, data) => renderDropZone(spec, backstage.shared.providers, data)),
      grid: make$2((spec, backstage) => renderGrid(spec, backstage.shared)),
      listbox: make$2((spec, backstage, data) => renderListBox(spec, backstage, data)),
      selectbox: make$2((spec, backstage, data) => renderSelectBox(spec, backstage.shared.providers, data)),
      sizeinput: make$2((spec, backstage) => renderSizeInput(spec, backstage.shared.providers)),
      slider: make$2((spec, backstage, data) => renderSlider(spec, backstage.shared.providers, data)),
      urlinput: make$2((spec, backstage, data) => renderUrlInput(spec, backstage, backstage.urlinput, data)),
      customeditor: make$2(renderCustomEditor),
      htmlpanel: make$2(renderHtmlPanel),
      imagepreview: make$2((spec, _, data) => renderImagePreview(spec, data)),
      table: make$2((spec, backstage) => renderTable(spec, backstage.shared.providers)),
      panel: make$2((spec, backstage) => renderPanel(spec, backstage))
    };
    const noFormParts = {
      field: (_name, spec) => spec,
      record: constant$1([])
    };
    const interpretInForm = (parts, spec, dialogData, oldBackstage) => {
      const newBackstage = deepMerge(oldBackstage, { shared: { interpreter: childSpec => interpretParts(parts, childSpec, dialogData, newBackstage) } });
      return interpretParts(parts, spec, dialogData, newBackstage);
    };
    const interpretParts = (parts, spec, dialogData, backstage) => get$g(factories, spec.type).fold(() => {
      console.error(`Unknown factory type "${ spec.type }", defaulting to container: `, spec);
      return spec;
    }, factory => factory(parts, spec, dialogData, backstage));
    const interpretWithoutForm = (spec, dialogData, backstage) => interpretParts(noFormParts, spec, dialogData, backstage);

    const labelPrefix = 'layout-inset';
    const westEdgeX = anchor => anchor.x;
    const middleX = (anchor, element) => anchor.x + anchor.width / 2 - element.width / 2;
    const eastEdgeX = (anchor, element) => anchor.x + anchor.width - element.width;
    const northY = anchor => anchor.y;
    const southY = (anchor, element) => anchor.y + anchor.height - element.height;
    const centreY = (anchor, element) => anchor.y + anchor.height / 2 - element.height / 2;
    const southwest = (anchor, element, bubbles) => nu$6(eastEdgeX(anchor, element), southY(anchor, element), bubbles.insetSouthwest(), northwest$3(), 'southwest', boundsRestriction(anchor, {
      right: 0,
      bottom: 3
    }), labelPrefix);
    const southeast = (anchor, element, bubbles) => nu$6(westEdgeX(anchor), southY(anchor, element), bubbles.insetSoutheast(), northeast$3(), 'southeast', boundsRestriction(anchor, {
      left: 1,
      bottom: 3
    }), labelPrefix);
    const northwest = (anchor, element, bubbles) => nu$6(eastEdgeX(anchor, element), northY(anchor), bubbles.insetNorthwest(), southwest$3(), 'northwest', boundsRestriction(anchor, {
      right: 0,
      top: 2
    }), labelPrefix);
    const northeast = (anchor, element, bubbles) => nu$6(westEdgeX(anchor), northY(anchor), bubbles.insetNortheast(), southeast$3(), 'northeast', boundsRestriction(anchor, {
      left: 1,
      top: 2
    }), labelPrefix);
    const north = (anchor, element, bubbles) => nu$6(middleX(anchor, element), northY(anchor), bubbles.insetNorth(), south$3(), 'north', boundsRestriction(anchor, { top: 2 }), labelPrefix);
    const south = (anchor, element, bubbles) => nu$6(middleX(anchor, element), southY(anchor, element), bubbles.insetSouth(), north$3(), 'south', boundsRestriction(anchor, { bottom: 3 }), labelPrefix);
    const east = (anchor, element, bubbles) => nu$6(eastEdgeX(anchor, element), centreY(anchor, element), bubbles.insetEast(), west$3(), 'east', boundsRestriction(anchor, { right: 0 }), labelPrefix);
    const west = (anchor, element, bubbles) => nu$6(westEdgeX(anchor), centreY(anchor, element), bubbles.insetWest(), east$3(), 'west', boundsRestriction(anchor, { left: 1 }), labelPrefix);
    const lookupPreserveLayout = lastPlacement => {
      switch (lastPlacement) {
      case 'north':
        return north;
      case 'northeast':
        return northeast;
      case 'northwest':
        return northwest;
      case 'south':
        return south;
      case 'southeast':
        return southeast;
      case 'southwest':
        return southwest;
      case 'east':
        return east;
      case 'west':
        return west;
      }
    };
    const preserve = (anchor, element, bubbles, placee, bounds) => {
      const layout = getPlacement(placee).map(lookupPreserveLayout).getOr(north);
      return layout(anchor, element, bubbles, placee, bounds);
    };
    const lookupFlippedLayout = lastPlacement => {
      switch (lastPlacement) {
      case 'north':
        return south;
      case 'northeast':
        return southeast;
      case 'northwest':
        return southwest;
      case 'south':
        return north;
      case 'southeast':
        return northeast;
      case 'southwest':
        return northwest;
      case 'east':
        return west;
      case 'west':
        return east;
      }
    };
    const flip = (anchor, element, bubbles, placee, bounds) => {
      const layout = getPlacement(placee).map(lookupFlippedLayout).getOr(north);
      return layout(anchor, element, bubbles, placee, bounds);
    };

    const bubbleAlignments$2 = {
      valignCentre: [],
      alignCentre: [],
      alignLeft: [],
      alignRight: [],
      right: [],
      left: [],
      bottom: [],
      top: []
    };
    const getInlineDialogAnchor = (contentAreaElement, lazyAnchorbar, lazyUseEditableAreaAnchor) => {
      const bubbleSize = 12;
      const overrides = { maxHeightFunction: expandable$1() };
      const editableAreaAnchor = () => ({
        type: 'node',
        root: getContentContainer(getRootNode(contentAreaElement())),
        node: Optional.from(contentAreaElement()),
        bubble: nu$5(bubbleSize, bubbleSize, bubbleAlignments$2),
        layouts: {
          onRtl: () => [northeast],
          onLtr: () => [northwest]
        },
        overrides
      });
      const standardAnchor = () => ({
        type: 'hotspot',
        hotspot: lazyAnchorbar(),
        bubble: nu$5(-bubbleSize, bubbleSize, bubbleAlignments$2),
        layouts: {
          onRtl: () => [southeast$2],
          onLtr: () => [southwest$2]
        },
        overrides
      });
      return () => lazyUseEditableAreaAnchor() ? editableAreaAnchor() : standardAnchor();
    };
    const getBannerAnchor = (contentAreaElement, lazyAnchorbar, lazyUseEditableAreaAnchor) => {
      const editableAreaAnchor = () => ({
        type: 'node',
        root: getContentContainer(getRootNode(contentAreaElement())),
        node: Optional.from(contentAreaElement()),
        layouts: {
          onRtl: () => [north],
          onLtr: () => [north]
        }
      });
      const standardAnchor = () => ({
        type: 'hotspot',
        hotspot: lazyAnchorbar(),
        layouts: {
          onRtl: () => [south$2],
          onLtr: () => [south$2]
        }
      });
      return () => lazyUseEditableAreaAnchor() ? editableAreaAnchor() : standardAnchor();
    };
    const getCursorAnchor = (editor, bodyElement) => () => ({
      type: 'selection',
      root: bodyElement(),
      getSelection: () => {
        const rng = editor.selection.getRng();
        return Optional.some(SimSelection.range(SugarElement.fromDom(rng.startContainer), rng.startOffset, SugarElement.fromDom(rng.endContainer), rng.endOffset));
      }
    });
    const getNodeAnchor$1 = bodyElement => element => ({
      type: 'node',
      root: bodyElement(),
      node: element
    });
    const getAnchors = (editor, lazyAnchorbar, isToolbarTop) => {
      const useFixedToolbarContainer = useFixedContainer(editor);
      const bodyElement = () => SugarElement.fromDom(editor.getBody());
      const contentAreaElement = () => SugarElement.fromDom(editor.getContentAreaContainer());
      const lazyUseEditableAreaAnchor = () => useFixedToolbarContainer || !isToolbarTop();
      return {
        inlineDialog: getInlineDialogAnchor(contentAreaElement, lazyAnchorbar, lazyUseEditableAreaAnchor),
        banner: getBannerAnchor(contentAreaElement, lazyAnchorbar, lazyUseEditableAreaAnchor),
        cursor: getCursorAnchor(editor, bodyElement),
        node: getNodeAnchor$1(bodyElement)
      };
    };

    const colorPicker = editor => (callback, value) => {
      const dialog = colorPickerDialog(editor);
      dialog(callback, value);
    };
    const hasCustomColors = editor => () => hasCustomColors$1(editor);
    const getColors = editor => () => getColors$2(editor);
    const getColorCols = editor => () => getColorCols$1(editor);
    const ColorInputBackstage = editor => ({
      colorPicker: colorPicker(editor),
      hasCustomColors: hasCustomColors(editor),
      getColors: getColors(editor),
      getColorCols: getColorCols(editor)
    });

    const isDraggableModal = editor => () => isDraggableModal$1(editor);
    const DialogBackstage = editor => ({ isDraggableModal: isDraggableModal(editor) });

    const HeaderBackstage = editor => {
      const mode = Cell(isToolbarLocationBottom(editor) ? 'bottom' : 'top');
      return {
        isPositionedAtTop: () => mode.get() === 'top',
        getDockingMode: mode.get,
        setDockingMode: mode.set
      };
    };

    const isNestedFormat = format => hasNonNullableKey(format, 'items');
    const isFormatReference = format => hasNonNullableKey(format, 'format');
    const defaultStyleFormats = [
      {
        title: 'Headings',
        items: [
          {
            title: 'Heading 1',
            format: 'h1'
          },
          {
            title: 'Heading 2',
            format: 'h2'
          },
          {
            title: 'Heading 3',
            format: 'h3'
          },
          {
            title: 'Heading 4',
            format: 'h4'
          },
          {
            title: 'Heading 5',
            format: 'h5'
          },
          {
            title: 'Heading 6',
            format: 'h6'
          }
        ]
      },
      {
        title: 'Inline',
        items: [
          {
            title: 'Bold',
            format: 'bold'
          },
          {
            title: 'Italic',
            format: 'italic'
          },
          {
            title: 'Underline',
            format: 'underline'
          },
          {
            title: 'Strikethrough',
            format: 'strikethrough'
          },
          {
            title: 'Superscript',
            format: 'superscript'
          },
          {
            title: 'Subscript',
            format: 'subscript'
          },
          {
            title: 'Code',
            format: 'code'
          }
        ]
      },
      {
        title: 'Blocks',
        items: [
          {
            title: 'Paragraph',
            format: 'p'
          },
          {
            title: 'Blockquote',
            format: 'blockquote'
          },
          {
            title: 'Div',
            format: 'div'
          },
          {
            title: 'Pre',
            format: 'pre'
          }
        ]
      },
      {
        title: 'Align',
        items: [
          {
            title: 'Left',
            format: 'alignleft'
          },
          {
            title: 'Center',
            format: 'aligncenter'
          },
          {
            title: 'Right',
            format: 'alignright'
          },
          {
            title: 'Justify',
            format: 'alignjustify'
          }
        ]
      }
    ];
    const isNestedFormats = format => has$2(format, 'items');
    const isBlockFormat = format => has$2(format, 'block');
    const isInlineFormat = format => has$2(format, 'inline');
    const isSelectorFormat = format => has$2(format, 'selector');
    const mapFormats = userFormats => foldl(userFormats, (acc, fmt) => {
      if (isNestedFormats(fmt)) {
        const result = mapFormats(fmt.items);
        return {
          customFormats: acc.customFormats.concat(result.customFormats),
          formats: acc.formats.concat([{
              title: fmt.title,
              items: result.formats
            }])
        };
      } else if (isInlineFormat(fmt) || isBlockFormat(fmt) || isSelectorFormat(fmt)) {
        const formatName = isString(fmt.name) ? fmt.name : fmt.title.toLowerCase();
        const formatNameWithPrefix = `custom-${ formatName }`;
        return {
          customFormats: acc.customFormats.concat([{
              name: formatNameWithPrefix,
              format: fmt
            }]),
          formats: acc.formats.concat([{
              title: fmt.title,
              format: formatNameWithPrefix,
              icon: fmt.icon
            }])
        };
      } else {
        return {
          ...acc,
          formats: acc.formats.concat(fmt)
        };
      }
    }, {
      customFormats: [],
      formats: []
    });
    const registerCustomFormats = (editor, userFormats) => {
      const result = mapFormats(userFormats);
      const registerFormats = customFormats => {
        each$1(customFormats, fmt => {
          if (!editor.formatter.has(fmt.name)) {
            editor.formatter.register(fmt.name, fmt.format);
          }
        });
      };
      if (editor.formatter) {
        registerFormats(result.customFormats);
      } else {
        editor.on('init', () => {
          registerFormats(result.customFormats);
        });
      }
      return result.formats;
    };
    const getStyleFormats = editor => getUserStyleFormats(editor).map(userFormats => {
      const registeredUserFormats = registerCustomFormats(editor, userFormats);
      return shouldMergeStyleFormats(editor) ? defaultStyleFormats.concat(registeredUserFormats) : registeredUserFormats;
    }).getOr(defaultStyleFormats);

    const isSeparator$1 = format => {
      const keys$1 = keys(format);
      return keys$1.length === 1 && contains$2(keys$1, 'title');
    };
    const processBasic = (item, isSelectedFor, getPreviewFor) => ({
      ...item,
      type: 'formatter',
      isSelected: isSelectedFor(item.format),
      getStylePreview: getPreviewFor(item.format)
    });
    const register$a = (editor, formats, isSelectedFor, getPreviewFor) => {
      const enrichSupported = item => processBasic(item, isSelectedFor, getPreviewFor);
      const enrichMenu = item => {
        const newItems = doEnrich(item.items);
        return {
          ...item,
          type: 'submenu',
          getStyleItems: constant$1(newItems)
        };
      };
      const enrichCustom = item => {
        const formatName = isString(item.name) ? item.name : generate$6(item.title);
        const formatNameWithPrefix = `custom-${ formatName }`;
        const newItem = {
          ...item,
          type: 'formatter',
          format: formatNameWithPrefix,
          isSelected: isSelectedFor(formatNameWithPrefix),
          getStylePreview: getPreviewFor(formatNameWithPrefix)
        };
        editor.formatter.register(formatName, newItem);
        return newItem;
      };
      const doEnrich = items => map$2(items, item => {
        if (isNestedFormat(item)) {
          return enrichMenu(item);
        } else if (isFormatReference(item)) {
          return enrichSupported(item);
        } else if (isSeparator$1(item)) {
          return {
            ...item,
            type: 'separator'
          };
        } else {
          return enrichCustom(item);
        }
      });
      return doEnrich(formats);
    };

    const init$8 = editor => {
      const isSelectedFor = format => () => editor.formatter.match(format);
      const getPreviewFor = format => () => {
        const fmt = editor.formatter.get(format);
        return fmt !== undefined ? Optional.some({
          tag: fmt.length > 0 ? fmt[0].inline || fmt[0].block || 'div' : 'div',
          styles: editor.dom.parseStyle(editor.formatter.getCssText(format))
        }) : Optional.none();
      };
      const settingsFormats = Cell([]);
      const eventsFormats = Cell([]);
      const replaceSettings = Cell(false);
      editor.on('PreInit', _e => {
        const formats = getStyleFormats(editor);
        const enriched = register$a(editor, formats, isSelectedFor, getPreviewFor);
        settingsFormats.set(enriched);
      });
      editor.on('addStyleModifications', e => {
        const modifications = register$a(editor, e.items, isSelectedFor, getPreviewFor);
        eventsFormats.set(modifications);
        replaceSettings.set(e.replace);
      });
      const getData = () => {
        const fromSettings = replaceSettings.get() ? [] : settingsFormats.get();
        const fromEvents = eventsFormats.get();
        return fromSettings.concat(fromEvents);
      };
      return { getData };
    };

    const isElement = node => isNonNullable(node) && node.nodeType === 1;
    const trim = global$1.trim;
    const hasContentEditableState = value => {
      return node => {
        if (isElement(node)) {
          if (node.contentEditable === value) {
            return true;
          }
          if (node.getAttribute('data-mce-contenteditable') === value) {
            return true;
          }
        }
        return false;
      };
    };
    const isContentEditableTrue = hasContentEditableState('true');
    const isContentEditableFalse = hasContentEditableState('false');
    const create = (type, title, url, level, attach) => ({
      type,
      title,
      url,
      level,
      attach
    });
    const isChildOfContentEditableTrue = node => {
      let tempNode = node;
      while (tempNode = tempNode.parentNode) {
        const value = tempNode.contentEditable;
        if (value && value !== 'inherit') {
          return isContentEditableTrue(tempNode);
        }
      }
      return false;
    };
    const select = (selector, root) => {
      return map$2(descendants(SugarElement.fromDom(root), selector), element => {
        return element.dom;
      });
    };
    const getElementText = elm => {
      return elm.innerText || elm.textContent;
    };
    const getOrGenerateId = elm => {
      return elm.id ? elm.id : generate$6('h');
    };
    const isAnchor = elm => {
      return elm && elm.nodeName === 'A' && (elm.id || elm.name) !== undefined;
    };
    const isValidAnchor = elm => {
      return isAnchor(elm) && isEditable(elm);
    };
    const isHeader = elm => {
      return elm && /^(H[1-6])$/.test(elm.nodeName);
    };
    const isEditable = elm => {
      return isChildOfContentEditableTrue(elm) && !isContentEditableFalse(elm);
    };
    const isValidHeader = elm => {
      return isHeader(elm) && isEditable(elm);
    };
    const getLevel = elm => {
      return isHeader(elm) ? parseInt(elm.nodeName.substr(1), 10) : 0;
    };
    const headerTarget = elm => {
      var _a;
      const headerId = getOrGenerateId(elm);
      const attach = () => {
        elm.id = headerId;
      };
      return create('header', (_a = getElementText(elm)) !== null && _a !== void 0 ? _a : '', '#' + headerId, getLevel(elm), attach);
    };
    const anchorTarget = elm => {
      const anchorId = elm.id || elm.name;
      const anchorText = getElementText(elm);
      return create('anchor', anchorText ? anchorText : '#' + anchorId, '#' + anchorId, 0, noop);
    };
    const getHeaderTargets = elms => {
      return map$2(filter$2(elms, isValidHeader), headerTarget);
    };
    const getAnchorTargets = elms => {
      return map$2(filter$2(elms, isValidAnchor), anchorTarget);
    };
    const getTargetElements = elm => {
      const elms = select('h1,h2,h3,h4,h5,h6,a:not([href])', elm);
      return elms;
    };
    const hasTitle = target => {
      return trim(target.title).length > 0;
    };
    const find = elm => {
      const elms = getTargetElements(elm);
      return filter$2(getHeaderTargets(elms).concat(getAnchorTargets(elms)), hasTitle);
    };
    const LinkTargets = { find };

    const STORAGE_KEY = 'tinymce-url-history';
    const HISTORY_LENGTH = 5;
    const isHttpUrl = url => isString(url) && /^https?/.test(url);
    const isArrayOfUrl = a => isArray(a) && a.length <= HISTORY_LENGTH && forall(a, isHttpUrl);
    const isRecordOfUrlArray = r => isObject(r) && find$4(r, value => !isArrayOfUrl(value)).isNone();
    const getAllHistory = () => {
      const unparsedHistory = global$4.getItem(STORAGE_KEY);
      if (unparsedHistory === null) {
        return {};
      }
      let history;
      try {
        history = JSON.parse(unparsedHistory);
      } catch (e) {
        if (e instanceof SyntaxError) {
          console.log('Local storage ' + STORAGE_KEY + ' was not valid JSON', e);
          return {};
        }
        throw e;
      }
      if (!isRecordOfUrlArray(history)) {
        console.log('Local storage ' + STORAGE_KEY + ' was not valid format', history);
        return {};
      }
      return history;
    };
    const setAllHistory = history => {
      if (!isRecordOfUrlArray(history)) {
        throw new Error('Bad format for history:\n' + JSON.stringify(history));
      }
      global$4.setItem(STORAGE_KEY, JSON.stringify(history));
    };
    const getHistory = fileType => {
      const history = getAllHistory();
      return get$g(history, fileType).getOr([]);
    };
    const addToHistory = (url, fileType) => {
      if (!isHttpUrl(url)) {
        return;
      }
      const history = getAllHistory();
      const items = get$g(history, fileType).getOr([]);
      const itemsWithoutUrl = filter$2(items, item => item !== url);
      history[fileType] = [url].concat(itemsWithoutUrl).slice(0, HISTORY_LENGTH);
      setAllHistory(history);
    };

    const isTruthy = value => !!value;
    const makeMap = value => map$1(global$1.makeMap(value, /[, ]/), isTruthy);
    const getPicker = editor => Optional.from(getFilePickerCallback(editor));
    const getPickerTypes = editor => {
      const optFileTypes = Optional.from(getFilePickerTypes(editor)).filter(isTruthy).map(makeMap);
      return getPicker(editor).fold(never, _picker => optFileTypes.fold(always, types => keys(types).length > 0 ? types : false));
    };
    const getPickerSetting = (editor, filetype) => {
      const pickerTypes = getPickerTypes(editor);
      if (isBoolean(pickerTypes)) {
        return pickerTypes ? getPicker(editor) : Optional.none();
      } else {
        return pickerTypes[filetype] ? getPicker(editor) : Optional.none();
      }
    };
    const getUrlPicker = (editor, filetype) => getPickerSetting(editor, filetype).map(picker => entry => Future.nu(completer => {
      const handler = (value, meta) => {
        if (!isString(value)) {
          throw new Error('Expected value to be string');
        }
        if (meta !== undefined && !isObject(meta)) {
          throw new Error('Expected meta to be a object');
        }
        const r = {
          value,
          meta
        };
        completer(r);
      };
      const meta = {
        filetype,
        fieldname: entry.fieldname,
        ...Optional.from(entry.meta).getOr({})
      };
      picker.call(editor, handler, entry.value, meta);
    }));
    const getTextSetting = value => Optional.from(value).filter(isString).getOrUndefined();
    const getLinkInformation = editor => {
      if (!useTypeaheadUrls(editor)) {
        return Optional.none();
      }
      return Optional.some({
        targets: LinkTargets.find(editor.getBody()),
        anchorTop: getTextSetting(getAnchorTop(editor)),
        anchorBottom: getTextSetting(getAnchorBottom(editor))
      });
    };
    const getValidationHandler = editor => Optional.from(getFilePickerValidatorHandler(editor));
    const UrlInputBackstage = editor => ({
      getHistory,
      addToHistory,
      getLinkInformation: () => getLinkInformation(editor),
      getValidationHandler: () => getValidationHandler(editor),
      getUrlPicker: filetype => getUrlPicker(editor, filetype)
    });

    const init$7 = (lazySink, editor, lazyAnchorbar) => {
      const contextMenuState = Cell(false);
      const toolbar = HeaderBackstage(editor);
      const backstage = {
        shared: {
          providers: {
            icons: () => editor.ui.registry.getAll().icons,
            menuItems: () => editor.ui.registry.getAll().menuItems,
            translate: global$8.translate,
            isDisabled: () => editor.mode.isReadOnly() || !editor.ui.isEnabled(),
            getOption: editor.options.get
          },
          interpreter: s => interpretWithoutForm(s, {}, backstage),
          anchors: getAnchors(editor, lazyAnchorbar, toolbar.isPositionedAtTop),
          header: toolbar,
          getSink: lazySink
        },
        urlinput: UrlInputBackstage(editor),
        styles: init$8(editor),
        colorinput: ColorInputBackstage(editor),
        dialog: DialogBackstage(editor),
        isContextMenuOpen: () => contextMenuState.get(),
        setContextMenuState: state => contextMenuState.set(state)
      };
      return backstage;
    };

    const setup$b = (editor, mothership, uiMothership) => {
      const broadcastEvent = (name, evt) => {
        each$1([
          mothership,
          uiMothership
        ], ship => {
          ship.broadcastEvent(name, evt);
        });
      };
      const broadcastOn = (channel, message) => {
        each$1([
          mothership,
          uiMothership
        ], ship => {
          ship.broadcastOn([channel], message);
        });
      };
      const fireDismissPopups = evt => broadcastOn(dismissPopups(), { target: evt.target });
      const doc = getDocument();
      const onTouchstart = bind(doc, 'touchstart', fireDismissPopups);
      const onTouchmove = bind(doc, 'touchmove', evt => broadcastEvent(documentTouchmove(), evt));
      const onTouchend = bind(doc, 'touchend', evt => broadcastEvent(documentTouchend(), evt));
      const onMousedown = bind(doc, 'mousedown', fireDismissPopups);
      const onMouseup = bind(doc, 'mouseup', evt => {
        if (evt.raw.button === 0) {
          broadcastOn(mouseReleased(), { target: evt.target });
        }
      });
      const onContentClick = raw => broadcastOn(dismissPopups(), { target: SugarElement.fromDom(raw.target) });
      const onContentMouseup = raw => {
        if (raw.button === 0) {
          broadcastOn(mouseReleased(), { target: SugarElement.fromDom(raw.target) });
        }
      };
      const onContentMousedown = () => {
        each$1(editor.editorManager.get(), loopEditor => {
          if (editor !== loopEditor) {
            loopEditor.dispatch('DismissPopups', { relatedTarget: editor });
          }
        });
      };
      const onWindowScroll = evt => broadcastEvent(windowScroll(), fromRawEvent(evt));
      const onWindowResize = evt => {
        broadcastOn(repositionPopups(), {});
        broadcastEvent(windowResize(), fromRawEvent(evt));
      };
      const onEditorResize = () => broadcastOn(repositionPopups(), {});
      const onEditorProgress = evt => {
        if (evt.state) {
          broadcastOn(dismissPopups(), { target: SugarElement.fromDom(editor.getContainer()) });
        }
      };
      const onDismissPopups = event => {
        broadcastOn(dismissPopups(), { target: SugarElement.fromDom(event.relatedTarget.getContainer()) });
      };
      editor.on('PostRender', () => {
        editor.on('click', onContentClick);
        editor.on('tap', onContentClick);
        editor.on('mouseup', onContentMouseup);
        editor.on('mousedown', onContentMousedown);
        editor.on('ScrollWindow', onWindowScroll);
        editor.on('ResizeWindow', onWindowResize);
        editor.on('ResizeEditor', onEditorResize);
        editor.on('AfterProgressState', onEditorProgress);
        editor.on('DismissPopups', onDismissPopups);
      });
      editor.on('remove', () => {
        editor.off('click', onContentClick);
        editor.off('tap', onContentClick);
        editor.off('mouseup', onContentMouseup);
        editor.off('mousedown', onContentMousedown);
        editor.off('ScrollWindow', onWindowScroll);
        editor.off('ResizeWindow', onWindowResize);
        editor.off('ResizeEditor', onEditorResize);
        editor.off('AfterProgressState', onEditorProgress);
        editor.off('DismissPopups', onDismissPopups);
        onMousedown.unbind();
        onTouchstart.unbind();
        onTouchmove.unbind();
        onTouchend.unbind();
        onMouseup.unbind();
      });
      editor.on('detach', () => {
        detachSystem(mothership);
        detachSystem(uiMothership);
        mothership.destroy();
        uiMothership.destroy();
      });
    };

    const parts$a = AlloyParts;
    const partType = PartType;

    const schema$f = constant$1([
      defaulted('shell', false),
      required$1('makeItem'),
      defaulted('setupItem', noop),
      SketchBehaviours.field('listBehaviours', [Replacing])
    ]);
    const customListDetail = () => ({ behaviours: derive$1([Replacing.config({})]) });
    const itemsPart = optional({
      name: 'items',
      overrides: customListDetail
    });
    const parts$9 = constant$1([itemsPart]);
    const name = constant$1('CustomList');

    const factory$d = (detail, components, _spec, _external) => {
      const setItems = (list, items) => {
        getListContainer(list).fold(() => {
          console.error('Custom List was defined to not be a shell, but no item container was specified in components');
          throw new Error('Custom List was defined to not be a shell, but no item container was specified in components');
        }, container => {
          const itemComps = Replacing.contents(container);
          const numListsRequired = items.length;
          const numListsToAdd = numListsRequired - itemComps.length;
          const itemsToAdd = numListsToAdd > 0 ? range$2(numListsToAdd, () => detail.makeItem()) : [];
          const itemsToRemove = itemComps.slice(numListsRequired);
          each$1(itemsToRemove, item => Replacing.remove(container, item));
          each$1(itemsToAdd, item => Replacing.append(container, item));
          const builtLists = Replacing.contents(container);
          each$1(builtLists, (item, i) => {
            detail.setupItem(list, item, items[i], i);
          });
        });
      };
      const extra = detail.shell ? {
        behaviours: [Replacing.config({})],
        components: []
      } : {
        behaviours: [],
        components
      };
      const getListContainer = component => detail.shell ? Optional.some(component) : getPart(component, detail, 'items');
      return {
        uid: detail.uid,
        dom: detail.dom,
        components: extra.components,
        behaviours: augment(detail.listBehaviours, extra.behaviours),
        apis: { setItems }
      };
    };
    const CustomList = composite({
      name: name(),
      configFields: schema$f(),
      partFields: parts$9(),
      factory: factory$d,
      apis: {
        setItems: (apis, list, items) => {
          apis.setItems(list, items);
        }
      }
    });

    const schema$e = constant$1([
      required$1('dom'),
      defaulted('shell', true),
      field('toolbarBehaviours', [Replacing])
    ]);
    const enhanceGroups = () => ({ behaviours: derive$1([Replacing.config({})]) });
    const parts$8 = constant$1([optional({
        name: 'groups',
        overrides: enhanceGroups
      })]);

    const factory$c = (detail, components, _spec, _externals) => {
      const setGroups = (toolbar, groups) => {
        getGroupContainer(toolbar).fold(() => {
          console.error('Toolbar was defined to not be a shell, but no groups container was specified in components');
          throw new Error('Toolbar was defined to not be a shell, but no groups container was specified in components');
        }, container => {
          Replacing.set(container, groups);
        });
      };
      const getGroupContainer = component => detail.shell ? Optional.some(component) : getPart(component, detail, 'groups');
      const extra = detail.shell ? {
        behaviours: [Replacing.config({})],
        components: []
      } : {
        behaviours: [],
        components
      };
      return {
        uid: detail.uid,
        dom: detail.dom,
        components: extra.components,
        behaviours: augment(detail.toolbarBehaviours, extra.behaviours),
        apis: { setGroups },
        domModification: { attributes: { role: 'group' } }
      };
    };
    const Toolbar = composite({
      name: 'Toolbar',
      configFields: schema$e(),
      partFields: parts$8(),
      factory: factory$c,
      apis: {
        setGroups: (apis, toolbar, groups) => {
          apis.setGroups(toolbar, groups);
        }
      }
    });

    const setup$a = noop;
    const isDocked$2 = never;
    const getBehaviours$1 = constant$1([]);

    var StaticHeader = /*#__PURE__*/Object.freeze({
        __proto__: null,
        setup: setup$a,
        isDocked: isDocked$2,
        getBehaviours: getBehaviours$1
    });

    const getOffsetParent = element => {
      const isFixed = is$1(getRaw(element, 'position'), 'fixed');
      const offsetParent$1 = isFixed ? Optional.none() : offsetParent(element);
      return offsetParent$1.orThunk(() => {
        const marker = SugarElement.fromTag('span');
        return parent(element).bind(parent => {
          append$2(parent, marker);
          const offsetParent$1 = offsetParent(marker);
          remove$5(marker);
          return offsetParent$1;
        });
      });
    };
    const getOrigin = element => getOffsetParent(element).map(absolute$3).getOrThunk(() => SugarPosition(0, 0));

    const morphAdt = Adt.generate([
      { static: [] },
      { absolute: ['positionCss'] },
      { fixed: ['positionCss'] }
    ]);
    const appear = (component, contextualInfo) => {
      const elem = component.element;
      add$2(elem, contextualInfo.transitionClass);
      remove$2(elem, contextualInfo.fadeOutClass);
      add$2(elem, contextualInfo.fadeInClass);
      contextualInfo.onShow(component);
    };
    const disappear = (component, contextualInfo) => {
      const elem = component.element;
      add$2(elem, contextualInfo.transitionClass);
      remove$2(elem, contextualInfo.fadeInClass);
      add$2(elem, contextualInfo.fadeOutClass);
      contextualInfo.onHide(component);
    };
    const isPartiallyVisible = (box, viewport) => box.y < viewport.bottom && box.bottom > viewport.y;
    const isTopCompletelyVisible = (box, viewport) => box.y >= viewport.y;
    const isBottomCompletelyVisible = (box, viewport) => box.bottom <= viewport.bottom;
    const isVisibleForModes = (modes, box, viewport) => forall(modes, mode => {
      switch (mode) {
      case 'bottom':
        return isBottomCompletelyVisible(box, viewport);
      case 'top':
        return isTopCompletelyVisible(box, viewport);
      }
    });
    const getPrior = (elem, state) => state.getInitialPos().map(pos => bounds(pos.bounds.x, pos.bounds.y, get$c(elem), get$d(elem)));
    const storePrior = (elem, box, state) => {
      state.setInitialPos({
        style: getAllRaw(elem),
        position: get$e(elem, 'position') || 'static',
        bounds: box
      });
    };
    const revertToOriginal = (elem, box, state) => state.getInitialPos().bind(position => {
      state.clearInitialPos();
      switch (position.position) {
      case 'static':
        return Optional.some(morphAdt.static());
      case 'absolute':
        const offsetBox = getOffsetParent(elem).map(box$1).getOrThunk(() => box$1(body()));
        return Optional.some(morphAdt.absolute(NuPositionCss('absolute', get$g(position.style, 'left').map(_left => box.x - offsetBox.x), get$g(position.style, 'top').map(_top => box.y - offsetBox.y), get$g(position.style, 'right').map(_right => offsetBox.right - box.right), get$g(position.style, 'bottom').map(_bottom => offsetBox.bottom - box.bottom))));
      default:
        return Optional.none();
      }
    });
    const morphToOriginal = (elem, viewport, state) => getPrior(elem, state).filter(box => isVisibleForModes(state.getModes(), box, viewport)).bind(box => revertToOriginal(elem, box, state));
    const morphToFixed = (elem, viewport, state) => {
      const box = box$1(elem);
      if (!isVisibleForModes(state.getModes(), box, viewport)) {
        storePrior(elem, box, state);
        const winBox = win();
        const left = box.x - winBox.x;
        const top = viewport.y - winBox.y;
        const bottom = winBox.bottom - viewport.bottom;
        const isTop = box.y <= viewport.y;
        return Optional.some(morphAdt.fixed(NuPositionCss('fixed', Optional.some(left), isTop ? Optional.some(top) : Optional.none(), Optional.none(), !isTop ? Optional.some(bottom) : Optional.none())));
      } else {
        return Optional.none();
      }
    };
    const getMorph = (component, viewport, state) => {
      const elem = component.element;
      const isDocked = is$1(getRaw(elem, 'position'), 'fixed');
      return isDocked ? morphToOriginal(elem, viewport, state) : morphToFixed(elem, viewport, state);
    };
    const getMorphToOriginal = (component, state) => {
      const elem = component.element;
      return getPrior(elem, state).bind(box => revertToOriginal(elem, box, state));
    };

    const morphToStatic = (component, config, state) => {
      state.setDocked(false);
      each$1([
        'left',
        'right',
        'top',
        'bottom',
        'position'
      ], prop => remove$6(component.element, prop));
      config.onUndocked(component);
    };
    const morphToCoord = (component, config, state, position) => {
      const isDocked = position.position === 'fixed';
      state.setDocked(isDocked);
      applyPositionCss(component.element, position);
      const method = isDocked ? config.onDocked : config.onUndocked;
      method(component);
    };
    const updateVisibility = (component, config, state, viewport, morphToDocked = false) => {
      config.contextual.each(contextInfo => {
        contextInfo.lazyContext(component).each(box => {
          const isVisible = isPartiallyVisible(box, viewport);
          if (isVisible !== state.isVisible()) {
            state.setVisible(isVisible);
            if (morphToDocked && !isVisible) {
              add$1(component.element, [contextInfo.fadeOutClass]);
              contextInfo.onHide(component);
            } else {
              const method = isVisible ? appear : disappear;
              method(component, contextInfo);
            }
          }
        });
      });
    };
    const refreshInternal = (component, config, state) => {
      const viewport = config.lazyViewport(component);
      const isDocked = state.isDocked();
      if (isDocked) {
        updateVisibility(component, config, state, viewport);
      }
      getMorph(component, viewport, state).each(morph => {
        morph.fold(() => morphToStatic(component, config, state), position => morphToCoord(component, config, state, position), position => {
          updateVisibility(component, config, state, viewport, true);
          morphToCoord(component, config, state, position);
        });
      });
    };
    const resetInternal = (component, config, state) => {
      const elem = component.element;
      state.setDocked(false);
      getMorphToOriginal(component, state).each(morph => {
        morph.fold(() => morphToStatic(component, config, state), position => morphToCoord(component, config, state, position), noop);
      });
      state.setVisible(true);
      config.contextual.each(contextInfo => {
        remove$1(elem, [
          contextInfo.fadeInClass,
          contextInfo.fadeOutClass,
          contextInfo.transitionClass
        ]);
        contextInfo.onShow(component);
      });
      refresh$4(component, config, state);
    };
    const refresh$4 = (component, config, state) => {
      if (component.getSystem().isConnected()) {
        refreshInternal(component, config, state);
      }
    };
    const reset = (component, config, state) => {
      if (state.isDocked()) {
        resetInternal(component, config, state);
      }
    };
    const isDocked$1 = (component, config, state) => state.isDocked();
    const setModes = (component, config, state, modes) => state.setModes(modes);
    const getModes = (component, config, state) => state.getModes();

    var DockingApis = /*#__PURE__*/Object.freeze({
        __proto__: null,
        refresh: refresh$4,
        reset: reset,
        isDocked: isDocked$1,
        getModes: getModes,
        setModes: setModes
    });

    const events$5 = (dockInfo, dockState) => derive$2([
      runOnSource(transitionend(), (component, simulatedEvent) => {
        dockInfo.contextual.each(contextInfo => {
          if (has(component.element, contextInfo.transitionClass)) {
            remove$1(component.element, [
              contextInfo.transitionClass,
              contextInfo.fadeInClass
            ]);
            const notify = dockState.isVisible() ? contextInfo.onShown : contextInfo.onHidden;
            notify(component);
          }
          simulatedEvent.stop();
        });
      }),
      run$1(windowScroll(), (component, _) => {
        refresh$4(component, dockInfo, dockState);
      }),
      run$1(windowResize(), (component, _) => {
        reset(component, dockInfo, dockState);
      })
    ]);

    var ActiveDocking = /*#__PURE__*/Object.freeze({
        __proto__: null,
        events: events$5
    });

    var DockingSchema = [
      optionObjOf('contextual', [
        requiredString('fadeInClass'),
        requiredString('fadeOutClass'),
        requiredString('transitionClass'),
        requiredFunction('lazyContext'),
        onHandler('onShow'),
        onHandler('onShown'),
        onHandler('onHide'),
        onHandler('onHidden')
      ]),
      defaultedFunction('lazyViewport', win),
      defaultedArrayOf('modes', [
        'top',
        'bottom'
      ], string),
      onHandler('onDocked'),
      onHandler('onUndocked')
    ];

    const init$6 = spec => {
      const docked = Cell(false);
      const visible = Cell(true);
      const initialBounds = value$2();
      const modes = Cell(spec.modes);
      const readState = () => `docked:  ${ docked.get() }, visible: ${ visible.get() }, modes: ${ modes.get().join(',') }`;
      return nu$8({
        isDocked: docked.get,
        setDocked: docked.set,
        getInitialPos: initialBounds.get,
        setInitialPos: initialBounds.set,
        clearInitialPos: initialBounds.clear,
        isVisible: visible.get,
        setVisible: visible.set,
        getModes: modes.get,
        setModes: modes.set,
        readState
      });
    };

    var DockingState = /*#__PURE__*/Object.freeze({
        __proto__: null,
        init: init$6
    });

    const Docking = create$3({
      fields: DockingSchema,
      name: 'docking',
      active: ActiveDocking,
      apis: DockingApis,
      state: DockingState
    });

    const toolbarHeightChange = constant$1(generate$6('toolbar-height-change'));

    const visibility = {
      fadeInClass: 'tox-editor-dock-fadein',
      fadeOutClass: 'tox-editor-dock-fadeout',
      transitionClass: 'tox-editor-dock-transition'
    };
    const editorStickyOnClass = 'tox-tinymce--toolbar-sticky-on';
    const editorStickyOffClass = 'tox-tinymce--toolbar-sticky-off';
    const scrollFromBehindHeader = (e, containerHeader) => {
      const doc = owner$4(containerHeader);
      const win = defaultView(containerHeader);
      const viewHeight = win.dom.innerHeight;
      const scrollPos = get$b(doc);
      const markerElement = SugarElement.fromDom(e.elm);
      const markerPos = absolute$2(markerElement);
      const markerHeight = get$d(markerElement);
      const markerTop = markerPos.y;
      const markerBottom = markerTop + markerHeight;
      const editorHeaderPos = absolute$3(containerHeader);
      const editorHeaderHeight = get$d(containerHeader);
      const editorHeaderTop = editorHeaderPos.top;
      const editorHeaderBottom = editorHeaderTop + editorHeaderHeight;
      const editorHeaderDockedAtTop = Math.abs(editorHeaderTop - scrollPos.top) < 2;
      const editorHeaderDockedAtBottom = Math.abs(editorHeaderBottom - (scrollPos.top + viewHeight)) < 2;
      if (editorHeaderDockedAtTop && markerTop < editorHeaderBottom) {
        to(scrollPos.left, markerTop - editorHeaderHeight, doc);
      } else if (editorHeaderDockedAtBottom && markerBottom > editorHeaderTop) {
        const y = markerTop - viewHeight + markerHeight + editorHeaderHeight;
        to(scrollPos.left, y, doc);
      }
    };
    const isDockedMode = (header, mode) => contains$2(Docking.getModes(header), mode);
    const updateIframeContentFlow = header => {
      const getOccupiedHeight = elm => getOuter$2(elm) + (parseInt(get$e(elm, 'margin-top'), 10) || 0) + (parseInt(get$e(elm, 'margin-bottom'), 10) || 0);
      const elm = header.element;
      parentElement(elm).each(parentElem => {
        const padding = 'padding-' + Docking.getModes(header)[0];
        if (Docking.isDocked(header)) {
          const parentWidth = get$c(parentElem);
          set$8(elm, 'width', parentWidth + 'px');
          set$8(parentElem, padding, getOccupiedHeight(elm) + 'px');
        } else {
          remove$6(elm, 'width');
          remove$6(parentElem, padding);
        }
      });
    };
    const updateSinkVisibility = (sinkElem, visible) => {
      if (visible) {
        remove$2(sinkElem, visibility.fadeOutClass);
        add$1(sinkElem, [
          visibility.transitionClass,
          visibility.fadeInClass
        ]);
      } else {
        remove$2(sinkElem, visibility.fadeInClass);
        add$1(sinkElem, [
          visibility.fadeOutClass,
          visibility.transitionClass
        ]);
      }
    };
    const updateEditorClasses = (editor, docked) => {
      const editorContainer = SugarElement.fromDom(editor.getContainer());
      if (docked) {
        add$2(editorContainer, editorStickyOnClass);
        remove$2(editorContainer, editorStickyOffClass);
      } else {
        add$2(editorContainer, editorStickyOffClass);
        remove$2(editorContainer, editorStickyOnClass);
      }
    };
    const restoreFocus = (headerElem, focusedElem) => {
      const ownerDoc = owner$4(focusedElem);
      active$1(ownerDoc).filter(activeElm => !eq(focusedElem, activeElm)).filter(activeElm => eq(activeElm, SugarElement.fromDom(ownerDoc.dom.body)) || contains(headerElem, activeElm)).each(() => focus$3(focusedElem));
    };
    const findFocusedElem = (rootElm, lazySink) => search(rootElm).orThunk(() => lazySink().toOptional().bind(sink => search(sink.element)));
    const setup$9 = (editor, sharedBackstage, lazyHeader) => {
      if (!editor.inline) {
        if (!sharedBackstage.header.isPositionedAtTop()) {
          editor.on('ResizeEditor', () => {
            lazyHeader().each(Docking.reset);
          });
        }
        editor.on('ResizeWindow ResizeEditor', () => {
          lazyHeader().each(updateIframeContentFlow);
        });
        editor.on('SkinLoaded', () => {
          lazyHeader().each(comp => {
            Docking.isDocked(comp) ? Docking.reset(comp) : Docking.refresh(comp);
          });
        });
        editor.on('FullscreenStateChanged', () => {
          lazyHeader().each(Docking.reset);
        });
      }
      editor.on('AfterScrollIntoView', e => {
        lazyHeader().each(header => {
          Docking.refresh(header);
          const headerElem = header.element;
          if (isVisible(headerElem)) {
            scrollFromBehindHeader(e, headerElem);
          }
        });
      });
      editor.on('PostRender', () => {
        updateEditorClasses(editor, false);
      });
    };
    const isDocked = lazyHeader => lazyHeader().map(Docking.isDocked).getOr(false);
    const getIframeBehaviours = () => [Receiving.config({ channels: { [toolbarHeightChange()]: { onReceive: updateIframeContentFlow } } })];
    const getBehaviours = (editor, sharedBackstage) => {
      const focusedElm = value$2();
      const lazySink = sharedBackstage.getSink;
      const runOnSinkElement = f => {
        lazySink().each(sink => f(sink.element));
      };
      const onDockingSwitch = comp => {
        if (!editor.inline) {
          updateIframeContentFlow(comp);
        }
        updateEditorClasses(editor, Docking.isDocked(comp));
        comp.getSystem().broadcastOn([repositionPopups()], {});
        lazySink().each(sink => sink.getSystem().broadcastOn([repositionPopups()], {}));
      };
      const additionalBehaviours = editor.inline ? [] : getIframeBehaviours();
      return [
        Focusing.config({}),
        Docking.config({
          contextual: {
            lazyContext: comp => {
              const headerHeight = getOuter$2(comp.element);
              const container = editor.inline ? editor.getContentAreaContainer() : editor.getContainer();
              const box = box$1(SugarElement.fromDom(container));
              const boxHeight = box.height - headerHeight;
              const topBound = box.y + (isDockedMode(comp, 'top') ? 0 : headerHeight);
              return Optional.some(bounds(box.x, topBound, box.width, boxHeight));
            },
            onShow: () => {
              runOnSinkElement(elem => updateSinkVisibility(elem, true));
            },
            onShown: comp => {
              runOnSinkElement(elem => remove$1(elem, [
                visibility.transitionClass,
                visibility.fadeInClass
              ]));
              focusedElm.get().each(elem => {
                restoreFocus(comp.element, elem);
                focusedElm.clear();
              });
            },
            onHide: comp => {
              findFocusedElem(comp.element, lazySink).fold(focusedElm.clear, focusedElm.set);
              runOnSinkElement(elem => updateSinkVisibility(elem, false));
            },
            onHidden: () => {
              runOnSinkElement(elem => remove$1(elem, [visibility.transitionClass]));
            },
            ...visibility
          },
          lazyViewport: comp => {
            const win$1 = win();
            const offset = getStickyToolbarOffset(editor);
            const top = win$1.y + (isDockedMode(comp, 'top') ? offset : 0);
            const height = win$1.height - (isDockedMode(comp, 'bottom') ? offset : 0);
            return bounds(win$1.x, top, win$1.width, height);
          },
          modes: [sharedBackstage.header.getDockingMode()],
          onDocked: onDockingSwitch,
          onUndocked: onDockingSwitch
        }),
        ...additionalBehaviours
      ];
    };

    var StickyHeader = /*#__PURE__*/Object.freeze({
        __proto__: null,
        setup: setup$9,
        isDocked: isDocked,
        getBehaviours: getBehaviours
    });

    const renderHeader = spec => {
      const editor = spec.editor;
      const getBehaviours$2 = spec.sticky ? getBehaviours : getBehaviours$1;
      return {
        uid: spec.uid,
        dom: spec.dom,
        components: spec.components,
        behaviours: derive$1(getBehaviours$2(editor, spec.sharedBackstage))
      };
    };

    const groupToolbarButtonSchema = objOf([
      type,
      requiredOf('items', oneOf([
        arrOfObj([
          name$1,
          requiredArrayOf('items', string)
        ]),
        string
      ]))
    ].concat(baseToolbarButtonFields));
    const createGroupToolbarButton = spec => asRaw('GroupToolbarButton', groupToolbarButtonSchema, spec);

    const baseMenuButtonFields = [
      optionString('text'),
      optionString('tooltip'),
      optionString('icon'),
      defaultedOf('search', false, oneOf([
        boolean,
        objOf([optionString('placeholder')])
      ], x => {
        if (isBoolean(x)) {
          return x ? Optional.some({ placeholder: Optional.none() }) : Optional.none();
        } else {
          return Optional.some(x);
        }
      })),
      requiredFunction('fetch'),
      defaultedFunction('onSetup', () => noop)
    ];

    const MenuButtonSchema = objOf([
      type,
      ...baseMenuButtonFields
    ]);
    const createMenuButton = spec => asRaw('menubutton', MenuButtonSchema, spec);

    const splitButtonSchema = objOf([
      type,
      optionalTooltip,
      optionalIcon,
      optionalText,
      optionalSelect,
      fetch$1,
      onSetup,
      defaultedStringEnum('presets', 'normal', [
        'normal',
        'color',
        'listpreview'
      ]),
      defaultedColumns(1),
      onAction,
      onItemAction
    ]);
    const createSplitButton = spec => asRaw('SplitButton', splitButtonSchema, spec);

    const factory$b = (detail, spec) => {
      const setMenus = (comp, menus) => {
        const newMenus = map$2(menus, m => {
          const buttonSpec = {
            type: 'menubutton',
            text: m.text,
            fetch: callback => {
              callback(m.getItems());
            }
          };
          const internal = createMenuButton(buttonSpec).mapError(errInfo => formatError(errInfo)).getOrDie();
          return renderMenuButton(internal, 'tox-mbtn', spec.backstage, Optional.some('menuitem'));
        });
        Replacing.set(comp, newMenus);
      };
      const apis = {
        focus: Keying.focusIn,
        setMenus
      };
      return {
        uid: detail.uid,
        dom: detail.dom,
        components: [],
        behaviours: derive$1([
          Replacing.config({}),
          config('menubar-events', [
            runOnAttached(component => {
              detail.onSetup(component);
            }),
            run$1(mouseover(), (comp, se) => {
              descendant(comp.element, '.' + 'tox-mbtn--active').each(activeButton => {
                closest$1(se.event.target, '.' + 'tox-mbtn').each(hoveredButton => {
                  if (!eq(activeButton, hoveredButton)) {
                    comp.getSystem().getByDom(activeButton).each(activeComp => {
                      comp.getSystem().getByDom(hoveredButton).each(hoveredComp => {
                        Dropdown.expand(hoveredComp);
                        Dropdown.close(activeComp);
                        Focusing.focus(hoveredComp);
                      });
                    });
                  }
                });
              });
            }),
            run$1(focusShifted(), (comp, se) => {
              se.event.prevFocus.bind(prev => comp.getSystem().getByDom(prev).toOptional()).each(prev => {
                se.event.newFocus.bind(nu => comp.getSystem().getByDom(nu).toOptional()).each(nu => {
                  if (Dropdown.isOpen(prev)) {
                    Dropdown.expand(nu);
                    Dropdown.close(prev);
                  }
                });
              });
            })
          ]),
          Keying.config({
            mode: 'flow',
            selector: '.' + 'tox-mbtn',
            onEscape: comp => {
              detail.onEscape(comp);
              return Optional.some(true);
            }
          }),
          Tabstopping.config({})
        ]),
        apis,
        domModification: { attributes: { role: 'menubar' } }
      };
    };
    var SilverMenubar = single({
      factory: factory$b,
      name: 'silver.Menubar',
      configFields: [
        required$1('dom'),
        required$1('uid'),
        required$1('onEscape'),
        required$1('backstage'),
        defaulted('onSetup', noop)
      ],
      apis: {
        focus: (apis, comp) => {
          apis.focus(comp);
        },
        setMenus: (apis, comp, menus) => {
          apis.setMenus(comp, menus);
        }
      }
    });

    const promotionMessage = '\u26A1\ufe0fAnalyticalJ';
    const promotionLink = 'https://www.analyticalJ.com';
    const renderPromotion = spec => {
      return {
        uid: spec.uid,
        dom: spec.dom,
        components: [{
            dom: {
              tag: 'a',
              attributes: {
                'href': promotionLink,
                'rel': 'noopener',
                'target': '_blank',
                'aria-hidden': 'true'
              },
              classes: ['tox-promotion-link'],
              innerHtml: promotionMessage
            }
          }]
      };
    };

    const getAnimationRoot = (component, slideConfig) => slideConfig.getAnimationRoot.fold(() => component.element, get => get(component));

    const getDimensionProperty = slideConfig => slideConfig.dimension.property;
    const getDimension = (slideConfig, elem) => slideConfig.dimension.getDimension(elem);
    const disableTransitions = (component, slideConfig) => {
      const root = getAnimationRoot(component, slideConfig);
      remove$1(root, [
        slideConfig.shrinkingClass,
        slideConfig.growingClass
      ]);
    };
    const setShrunk = (component, slideConfig) => {
      remove$2(component.element, slideConfig.openClass);
      add$2(component.element, slideConfig.closedClass);
      set$8(component.element, getDimensionProperty(slideConfig), '0px');
      reflow(component.element);
    };
    const setGrown = (component, slideConfig) => {
      remove$2(component.element, slideConfig.closedClass);
      add$2(component.element, slideConfig.openClass);
      remove$6(component.element, getDimensionProperty(slideConfig));
    };
    const doImmediateShrink = (component, slideConfig, slideState, _calculatedSize) => {
      slideState.setCollapsed();
      set$8(component.element, getDimensionProperty(slideConfig), getDimension(slideConfig, component.element));
      disableTransitions(component, slideConfig);
      setShrunk(component, slideConfig);
      slideConfig.onStartShrink(component);
      slideConfig.onShrunk(component);
    };
    const doStartShrink = (component, slideConfig, slideState, calculatedSize) => {
      const size = calculatedSize.getOrThunk(() => getDimension(slideConfig, component.element));
      slideState.setCollapsed();
      set$8(component.element, getDimensionProperty(slideConfig), size);
      reflow(component.element);
      const root = getAnimationRoot(component, slideConfig);
      remove$2(root, slideConfig.growingClass);
      add$2(root, slideConfig.shrinkingClass);
      setShrunk(component, slideConfig);
      slideConfig.onStartShrink(component);
    };
    const doStartSmartShrink = (component, slideConfig, slideState) => {
      const size = getDimension(slideConfig, component.element);
      const shrinker = size === '0px' ? doImmediateShrink : doStartShrink;
      shrinker(component, slideConfig, slideState, Optional.some(size));
    };
    const doStartGrow = (component, slideConfig, slideState) => {
      const root = getAnimationRoot(component, slideConfig);
      const wasShrinking = has(root, slideConfig.shrinkingClass);
      const beforeSize = getDimension(slideConfig, component.element);
      setGrown(component, slideConfig);
      const fullSize = getDimension(slideConfig, component.element);
      const startPartialGrow = () => {
        set$8(component.element, getDimensionProperty(slideConfig), beforeSize);
        reflow(component.element);
      };
      const startCompleteGrow = () => {
        setShrunk(component, slideConfig);
      };
      const setStartSize = wasShrinking ? startPartialGrow : startCompleteGrow;
      setStartSize();
      remove$2(root, slideConfig.shrinkingClass);
      add$2(root, slideConfig.growingClass);
      setGrown(component, slideConfig);
      set$8(component.element, getDimensionProperty(slideConfig), fullSize);
      slideState.setExpanded();
      slideConfig.onStartGrow(component);
    };
    const refresh$3 = (component, slideConfig, slideState) => {
      if (slideState.isExpanded()) {
        remove$6(component.element, getDimensionProperty(slideConfig));
        const fullSize = getDimension(slideConfig, component.element);
        set$8(component.element, getDimensionProperty(slideConfig), fullSize);
      }
    };
    const grow = (component, slideConfig, slideState) => {
      if (!slideState.isExpanded()) {
        doStartGrow(component, slideConfig, slideState);
      }
    };
    const shrink = (component, slideConfig, slideState) => {
      if (slideState.isExpanded()) {
        doStartSmartShrink(component, slideConfig, slideState);
      }
    };
    const immediateShrink = (component, slideConfig, slideState) => {
      if (slideState.isExpanded()) {
        doImmediateShrink(component, slideConfig, slideState);
      }
    };
    const hasGrown = (component, slideConfig, slideState) => slideState.isExpanded();
    const hasShrunk = (component, slideConfig, slideState) => slideState.isCollapsed();
    const isGrowing = (component, slideConfig, _slideState) => {
      const root = getAnimationRoot(component, slideConfig);
      return has(root, slideConfig.growingClass) === true;
    };
    const isShrinking = (component, slideConfig, _slideState) => {
      const root = getAnimationRoot(component, slideConfig);
      return has(root, slideConfig.shrinkingClass) === true;
    };
    const isTransitioning = (component, slideConfig, slideState) => isGrowing(component, slideConfig) || isShrinking(component, slideConfig);
    const toggleGrow = (component, slideConfig, slideState) => {
      const f = slideState.isExpanded() ? doStartSmartShrink : doStartGrow;
      f(component, slideConfig, slideState);
    };
    const immediateGrow = (component, slideConfig, slideState) => {
      if (!slideState.isExpanded()) {
        setGrown(component, slideConfig);
        set$8(component.element, getDimensionProperty(slideConfig), getDimension(slideConfig, component.element));
        disableTransitions(component, slideConfig);
        slideState.setExpanded();
        slideConfig.onStartGrow(component);
        slideConfig.onGrown(component);
      }
    };

    var SlidingApis = /*#__PURE__*/Object.freeze({
        __proto__: null,
        refresh: refresh$3,
        grow: grow,
        shrink: shrink,
        immediateShrink: immediateShrink,
        hasGrown: hasGrown,
        hasShrunk: hasShrunk,
        isGrowing: isGrowing,
        isShrinking: isShrinking,
        isTransitioning: isTransitioning,
        toggleGrow: toggleGrow,
        disableTransitions: disableTransitions,
        immediateGrow: immediateGrow
    });

    const exhibit = (base, slideConfig, _slideState) => {
      const expanded = slideConfig.expanded;
      return expanded ? nu$7({
        classes: [slideConfig.openClass],
        styles: {}
      }) : nu$7({
        classes: [slideConfig.closedClass],
        styles: wrap$1(slideConfig.dimension.property, '0px')
      });
    };
    const events$4 = (slideConfig, slideState) => derive$2([runOnSource(transitionend(), (component, simulatedEvent) => {
        const raw = simulatedEvent.event.raw;
        if (raw.propertyName === slideConfig.dimension.property) {
          disableTransitions(component, slideConfig);
          if (slideState.isExpanded()) {
            remove$6(component.element, slideConfig.dimension.property);
          }
          const notify = slideState.isExpanded() ? slideConfig.onGrown : slideConfig.onShrunk;
          notify(component);
        }
      })]);

    var ActiveSliding = /*#__PURE__*/Object.freeze({
        __proto__: null,
        exhibit: exhibit,
        events: events$4
    });

    var SlidingSchema = [
      required$1('closedClass'),
      required$1('openClass'),
      required$1('shrinkingClass'),
      required$1('growingClass'),
      option$3('getAnimationRoot'),
      onHandler('onShrunk'),
      onHandler('onStartShrink'),
      onHandler('onGrown'),
      onHandler('onStartGrow'),
      defaulted('expanded', false),
      requiredOf('dimension', choose$1('property', {
        width: [
          output$1('property', 'width'),
          output$1('getDimension', elem => get$c(elem) + 'px')
        ],
        height: [
          output$1('property', 'height'),
          output$1('getDimension', elem => get$d(elem) + 'px')
        ]
      }))
    ];

    const init$5 = spec => {
      const state = Cell(spec.expanded);
      const readState = () => 'expanded: ' + state.get();
      return nu$8({
        isExpanded: () => state.get() === true,
        isCollapsed: () => state.get() === false,
        setCollapsed: curry(state.set, false),
        setExpanded: curry(state.set, true),
        readState
      });
    };

    var SlidingState = /*#__PURE__*/Object.freeze({
        __proto__: null,
        init: init$5
    });

    const Sliding = create$3({
      fields: SlidingSchema,
      name: 'sliding',
      active: ActiveSliding,
      apis: SlidingApis,
      state: SlidingState
    });

    const owner = 'container';
    const schema$d = [field('slotBehaviours', [])];
    const getPartName = name => '<alloy.field.' + name + '>';
    const sketch = sSpec => {
      const parts = (() => {
        const record = [];
        const slot = (name, config) => {
          record.push(name);
          return generateOne$1(owner, getPartName(name), config);
        };
        return {
          slot,
          record: constant$1(record)
        };
      })();
      const spec = sSpec(parts);
      const partNames = parts.record();
      const fieldParts = map$2(partNames, n => required({
        name: n,
        pname: getPartName(n)
      }));
      return composite$1(owner, schema$d, fieldParts, make$1, spec);
    };
    const make$1 = (detail, components) => {
      const getSlotNames = _ => getAllPartNames(detail);
      const getSlot = (container, key) => getPart(container, detail, key);
      const onSlot = (f, def) => (container, key) => getPart(container, detail, key).map(slot => f(slot, key)).getOr(def);
      const onSlots = f => (container, keys) => {
        each$1(keys, key => f(container, key));
      };
      const doShowing = (comp, _key) => get$f(comp.element, 'aria-hidden') !== 'true';
      const doShow = (comp, key) => {
        if (!doShowing(comp)) {
          const element = comp.element;
          remove$6(element, 'display');
          remove$7(element, 'aria-hidden');
          emitWith(comp, slotVisibility(), {
            name: key,
            visible: true
          });
        }
      };
      const doHide = (comp, key) => {
        if (doShowing(comp)) {
          const element = comp.element;
          set$8(element, 'display', 'none');
          set$9(element, 'aria-hidden', 'true');
          emitWith(comp, slotVisibility(), {
            name: key,
            visible: false
          });
        }
      };
      const isShowing = onSlot(doShowing, false);
      const hideSlot = onSlot(doHide);
      const hideSlots = onSlots(hideSlot);
      const hideAllSlots = container => hideSlots(container, getSlotNames());
      const showSlot = onSlot(doShow);
      const apis = {
        getSlotNames,
        getSlot,
        isShowing,
        hideSlot,
        hideAllSlots,
        showSlot
      };
      return {
        uid: detail.uid,
        dom: detail.dom,
        components,
        behaviours: get$3(detail.slotBehaviours),
        apis
      };
    };
    const slotApis = map$1({
      getSlotNames: (apis, c) => apis.getSlotNames(c),
      getSlot: (apis, c, key) => apis.getSlot(c, key),
      isShowing: (apis, c, key) => apis.isShowing(c, key),
      hideSlot: (apis, c, key) => apis.hideSlot(c, key),
      hideAllSlots: (apis, c) => apis.hideAllSlots(c),
      showSlot: (apis, c, key) => apis.showSlot(c, key)
    }, value => makeApi(value));
    const SlotContainer = {
      ...slotApis,
      ...{ sketch }
    };

    const sidebarSchema = objOf([
      optionalIcon,
      optionalTooltip,
      defaultedFunction('onShow', noop),
      defaultedFunction('onHide', noop),
      onSetup
    ]);
    const createSidebar = spec => asRaw('sidebar', sidebarSchema, spec);

    const setup$8 = editor => {
      const {sidebars} = editor.ui.registry.getAll();
      each$1(keys(sidebars), name => {
        const spec = sidebars[name];
        const isActive = () => is$1(Optional.from(editor.queryCommandValue('ToggleSidebar')), name);
        editor.ui.registry.addToggleButton(name, {
          icon: spec.icon,
          tooltip: spec.tooltip,
          onAction: buttonApi => {
            editor.execCommand('ToggleSidebar', false, name);
            buttonApi.setActive(isActive());
          },
          onSetup: buttonApi => {
            buttonApi.setActive(isActive());
            const handleToggle = () => buttonApi.setActive(isActive());
            editor.on('ToggleSidebar', handleToggle);
            return () => {
              editor.off('ToggleSidebar', handleToggle);
            };
          }
        });
      });
    };
    const getApi = comp => ({ element: () => comp.element.dom });
    const makePanels = (parts, panelConfigs) => {
      const specs = map$2(keys(panelConfigs), name => {
        const spec = panelConfigs[name];
        const bridged = getOrDie(createSidebar(spec));
        return {
          name,
          getApi,
          onSetup: bridged.onSetup,
          onShow: bridged.onShow,
          onHide: bridged.onHide
        };
      });
      return map$2(specs, spec => {
        const editorOffCell = Cell(noop);
        return parts.slot(spec.name, {
          dom: {
            tag: 'div',
            classes: ['tox-sidebar__pane']
          },
          behaviours: SimpleBehaviours.unnamedEvents([
            onControlAttached(spec, editorOffCell),
            onControlDetached(spec, editorOffCell),
            run$1(slotVisibility(), (sidepanel, se) => {
              const data = se.event;
              const optSidePanelSpec = find$5(specs, config => config.name === data.name);
              optSidePanelSpec.each(sidePanelSpec => {
                const handler = data.visible ? sidePanelSpec.onShow : sidePanelSpec.onHide;
                handler(sidePanelSpec.getApi(sidepanel));
              });
            })
          ])
        });
      });
    };
    const makeSidebar = panelConfigs => SlotContainer.sketch(parts => ({
      dom: {
        tag: 'div',
        classes: ['tox-sidebar__pane-container']
      },
      components: makePanels(parts, panelConfigs),
      slotBehaviours: SimpleBehaviours.unnamedEvents([runOnAttached(slotContainer => SlotContainer.hideAllSlots(slotContainer))])
    }));
    const setSidebar = (sidebar, panelConfigs, showSidebar) => {
      const optSlider = Composing.getCurrent(sidebar);
      optSlider.each(slider => {
        Replacing.set(slider, [makeSidebar(panelConfigs)]);
        const configKey = showSidebar === null || showSidebar === void 0 ? void 0 : showSidebar.toLowerCase();
        if (isString(configKey) && has$2(panelConfigs, configKey)) {
          Composing.getCurrent(slider).each(slotContainer => {
            SlotContainer.showSlot(slotContainer, configKey);
            Sliding.immediateGrow(slider);
            remove$6(slider.element, 'width');
          });
        }
      });
    };
    const toggleSidebar = (sidebar, name) => {
      const optSlider = Composing.getCurrent(sidebar);
      optSlider.each(slider => {
        const optSlotContainer = Composing.getCurrent(slider);
        optSlotContainer.each(slotContainer => {
          if (Sliding.hasGrown(slider)) {
            if (SlotContainer.isShowing(slotContainer, name)) {
              Sliding.shrink(slider);
            } else {
              SlotContainer.hideAllSlots(slotContainer);
              SlotContainer.showSlot(slotContainer, name);
            }
          } else {
            SlotContainer.hideAllSlots(slotContainer);
            SlotContainer.showSlot(slotContainer, name);
            Sliding.grow(slider);
          }
        });
      });
    };
    const whichSidebar = sidebar => {
      const optSlider = Composing.getCurrent(sidebar);
      return optSlider.bind(slider => {
        const sidebarOpen = Sliding.isGrowing(slider) || Sliding.hasGrown(slider);
        if (sidebarOpen) {
          const optSlotContainer = Composing.getCurrent(slider);
          return optSlotContainer.bind(slotContainer => find$5(SlotContainer.getSlotNames(slotContainer), name => SlotContainer.isShowing(slotContainer, name)));
        } else {
          return Optional.none();
        }
      });
    };
    const fixSize = generate$6('FixSizeEvent');
    const autoSize = generate$6('AutoSizeEvent');
    const renderSidebar = spec => ({
      uid: spec.uid,
      dom: {
        tag: 'div',
        classes: ['tox-sidebar'],
        attributes: { role: 'complementary' }
      },
      components: [{
          dom: {
            tag: 'div',
            classes: ['tox-sidebar__slider']
          },
          components: [],
          behaviours: derive$1([
            Tabstopping.config({}),
            Focusing.config({}),
            Sliding.config({
              dimension: { property: 'width' },
              closedClass: 'tox-sidebar--sliding-closed',
              openClass: 'tox-sidebar--sliding-open',
              shrinkingClass: 'tox-sidebar--sliding-shrinking',
              growingClass: 'tox-sidebar--sliding-growing',
              onShrunk: slider => {
                const optSlotContainer = Composing.getCurrent(slider);
                optSlotContainer.each(SlotContainer.hideAllSlots);
                emit(slider, autoSize);
              },
              onGrown: slider => {
                emit(slider, autoSize);
              },
              onStartGrow: slider => {
                emitWith(slider, fixSize, { width: getRaw(slider.element, 'width').getOr('') });
              },
              onStartShrink: slider => {
                emitWith(slider, fixSize, { width: get$c(slider.element) + 'px' });
              }
            }),
            Replacing.config({}),
            Composing.config({
              find: comp => {
                const children = Replacing.contents(comp);
                return head(children);
              }
            })
          ])
        }],
      behaviours: derive$1([
        ComposingConfigs.childAt(0),
        config('sidebar-sliding-events', [
          run$1(fixSize, (comp, se) => {
            set$8(comp.element, 'width', se.event.width);
          }),
          run$1(autoSize, (comp, _se) => {
            remove$6(comp.element, 'width');
          })
        ])
      ])
    });

    const block = (component, config, state, getBusySpec) => {
      set$9(component.element, 'aria-busy', true);
      const root = config.getRoot(component).getOr(component);
      const blockerBehaviours = derive$1([
        Keying.config({
          mode: 'special',
          onTab: () => Optional.some(true),
          onShiftTab: () => Optional.some(true)
        }),
        Focusing.config({})
      ]);
      const blockSpec = getBusySpec(root, blockerBehaviours);
      const blocker = root.getSystem().build(blockSpec);
      Replacing.append(root, premade(blocker));
      if (blocker.hasConfigured(Keying) && config.focus) {
        Keying.focusIn(blocker);
      }
      if (!state.isBlocked()) {
        config.onBlock(component);
      }
      state.blockWith(() => Replacing.remove(root, blocker));
    };
    const unblock = (component, config, state) => {
      remove$7(component.element, 'aria-busy');
      if (state.isBlocked()) {
        config.onUnblock(component);
      }
      state.clear();
    };

    var BlockingApis = /*#__PURE__*/Object.freeze({
        __proto__: null,
        block: block,
        unblock: unblock
    });

    var BlockingSchema = [
      defaultedFunction('getRoot', Optional.none),
      defaultedBoolean('focus', true),
      onHandler('onBlock'),
      onHandler('onUnblock')
    ];

    const init$4 = () => {
      const blocker = destroyable();
      const blockWith = destroy => {
        blocker.set({ destroy });
      };
      return nu$8({
        readState: blocker.isSet,
        blockWith,
        clear: blocker.clear,
        isBlocked: blocker.isSet
      });
    };

    var BlockingState = /*#__PURE__*/Object.freeze({
        __proto__: null,
        init: init$4
    });

    const Blocking = create$3({
      fields: BlockingSchema,
      name: 'blocking',
      apis: BlockingApis,
      state: BlockingState
    });

    const getAttrs = elem => {
      const attributes = elem.dom.attributes !== undefined ? elem.dom.attributes : [];
      return foldl(attributes, (b, attr) => {
        if (attr.name === 'class') {
          return b;
        } else {
          return {
            ...b,
            [attr.name]: attr.value
          };
        }
      }, {});
    };
    const getClasses = elem => Array.prototype.slice.call(elem.dom.classList, 0);
    const fromHtml = html => {
      const elem = SugarElement.fromHtml(html);
      const children$1 = children(elem);
      const attrs = getAttrs(elem);
      const classes = getClasses(elem);
      const contents = children$1.length === 0 ? {} : { innerHtml: get$9(elem) };
      return {
        tag: name$3(elem),
        classes,
        attributes: attrs,
        ...contents
      };
    };

    const getBusySpec$1 = providerBackstage => (_root, _behaviours) => ({
      dom: {
        tag: 'div',
        attributes: {
          'aria-label': providerBackstage.translate('Loading...'),
          'tabindex': '0'
        },
        classes: ['tox-throbber__busy-spinner']
      },
      components: [{ dom: fromHtml('<div class="tox-spinner"><div></div><div></div><div></div></div>') }]
    });
    const focusBusyComponent = throbber => Composing.getCurrent(throbber).each(comp => focus$3(comp.element));
    const toggleEditorTabIndex = (editor, state) => {
      const tabIndexAttr = 'tabindex';
      const dataTabIndexAttr = `data-mce-${ tabIndexAttr }`;
      Optional.from(editor.iframeElement).map(SugarElement.fromDom).each(iframe => {
        if (state) {
          getOpt(iframe, tabIndexAttr).each(tabIndex => set$9(iframe, dataTabIndexAttr, tabIndex));
          set$9(iframe, tabIndexAttr, -1);
        } else {
          remove$7(iframe, tabIndexAttr);
          getOpt(iframe, dataTabIndexAttr).each(tabIndex => {
            set$9(iframe, tabIndexAttr, tabIndex);
            remove$7(iframe, dataTabIndexAttr);
          });
        }
      });
    };
    const toggleThrobber = (editor, comp, state, providerBackstage) => {
      const element = comp.element;
      toggleEditorTabIndex(editor, state);
      if (state) {
        Blocking.block(comp, getBusySpec$1(providerBackstage));
        remove$6(element, 'display');
        remove$7(element, 'aria-hidden');
        if (editor.hasFocus()) {
          focusBusyComponent(comp);
        }
      } else {
        const throbberFocus = Composing.getCurrent(comp).exists(busyComp => hasFocus(busyComp.element));
        Blocking.unblock(comp);
        set$8(element, 'display', 'none');
        set$9(element, 'aria-hidden', 'true');
        if (throbberFocus) {
          editor.focus();
        }
      }
    };
    const renderThrobber = spec => ({
      uid: spec.uid,
      dom: {
        tag: 'div',
        attributes: { 'aria-hidden': 'true' },
        classes: ['tox-throbber'],
        styles: { display: 'none' }
      },
      behaviours: derive$1([
        Replacing.config({}),
        Blocking.config({ focus: false }),
        Composing.config({ find: comp => head(comp.components()) })
      ]),
      components: []
    });
    const isFocusEvent = event => event.type === 'focusin';
    const isPasteBinTarget = event => {
      if (isFocusEvent(event)) {
        const node = event.composed ? head(event.composedPath()) : Optional.from(event.target);
        return node.map(SugarElement.fromDom).filter(isElement$1).exists(targetElm => has(targetElm, 'mce-pastebin'));
      } else {
        return false;
      }
    };
    const setup$7 = (editor, lazyThrobber, sharedBackstage) => {
      const throbberState = Cell(false);
      const timer = value$2();
      const stealFocus = e => {
        if (throbberState.get() && !isPasteBinTarget(e)) {
          e.preventDefault();
          focusBusyComponent(lazyThrobber());
          editor.editorManager.setActive(editor);
        }
      };
      if (!editor.inline) {
        editor.on('PreInit', () => {
          editor.dom.bind(editor.getWin(), 'focusin', stealFocus);
          editor.on('BeforeExecCommand', e => {
            if (e.command.toLowerCase() === 'mcefocus' && e.value !== true) {
              stealFocus(e);
            }
          });
        });
      }
      const toggle = state => {
        if (state !== throbberState.get()) {
          throbberState.set(state);
          toggleThrobber(editor, lazyThrobber(), state, sharedBackstage.providers);
          fireAfterProgressState(editor, state);
        }
      };
      editor.on('ProgressState', e => {
        timer.on(clearTimeout);
        if (isNumber(e.time)) {
          const timerId = global$9.setEditorTimeout(editor, () => toggle(e.state), e.time);
          timer.set(timerId);
        } else {
          toggle(e.state);
          timer.clear();
        }
      });
    };

    const generate$1 = (xs, f) => {
      const init = {
        len: 0,
        list: []
      };
      const r = foldl(xs, (b, a) => {
        const value = f(a, b.len);
        return value.fold(constant$1(b), v => ({
          len: v.finish,
          list: b.list.concat([v])
        }));
      }, init);
      return r.list;
    };

    const output = (within, extra, withinWidth) => ({
      within,
      extra,
      withinWidth
    });
    const apportion = (units, total, len) => {
      const parray = generate$1(units, (unit, current) => {
        const width = len(unit);
        return Optional.some({
          element: unit,
          start: current,
          finish: current + width,
          width
        });
      });
      const within = filter$2(parray, unit => unit.finish <= total);
      const withinWidth = foldr(within, (acc, el) => acc + el.width, 0);
      const extra = parray.slice(within.length);
      return {
        within,
        extra,
        withinWidth
      };
    };
    const toUnit = parray => map$2(parray, unit => unit.element);
    const fitLast = (within, extra, withinWidth) => {
      const fits = toUnit(within.concat(extra));
      return output(fits, [], withinWidth);
    };
    const overflow = (within, extra, overflower, withinWidth) => {
      const fits = toUnit(within).concat([overflower]);
      return output(fits, toUnit(extra), withinWidth);
    };
    const fitAll = (within, extra, withinWidth) => output(toUnit(within), [], withinWidth);
    const tryFit = (total, units, len) => {
      const divide = apportion(units, total, len);
      return divide.extra.length === 0 ? Optional.some(divide) : Optional.none();
    };
    const partition = (total, units, len, overflower) => {
      const divide = tryFit(total, units, len).getOrThunk(() => apportion(units, total - len(overflower), len));
      const within = divide.within;
      const extra = divide.extra;
      const withinWidth = divide.withinWidth;
      if (extra.length === 1 && extra[0].width <= len(overflower)) {
        return fitLast(within, extra, withinWidth);
      } else if (extra.length >= 1) {
        return overflow(within, extra, overflower, withinWidth);
      } else {
        return fitAll(within, extra, withinWidth);
      }
    };

    const setGroups$1 = (toolbar, storedGroups) => {
      const bGroups = map$2(storedGroups, g => premade(g));
      Toolbar.setGroups(toolbar, bGroups);
    };
    const findFocusedComp = comps => findMap(comps, comp => search(comp.element).bind(focusedElm => comp.getSystem().getByDom(focusedElm).toOptional()));
    const refresh$2 = (toolbar, detail, setOverflow) => {
      const builtGroups = detail.builtGroups.get();
      if (builtGroups.length === 0) {
        return;
      }
      const primary = getPartOrDie(toolbar, detail, 'primary');
      const overflowGroup = Coupling.getCoupled(toolbar, 'overflowGroup');
      set$8(primary.element, 'visibility', 'hidden');
      const groups = builtGroups.concat([overflowGroup]);
      const focusedComp = findFocusedComp(groups);
      setOverflow([]);
      setGroups$1(primary, groups);
      const availableWidth = get$c(primary.element);
      const overflows = partition(availableWidth, detail.builtGroups.get(), comp => get$c(comp.element), overflowGroup);
      if (overflows.extra.length === 0) {
        Replacing.remove(primary, overflowGroup);
        setOverflow([]);
      } else {
        setGroups$1(primary, overflows.within);
        setOverflow(overflows.extra);
      }
      remove$6(primary.element, 'visibility');
      reflow(primary.element);
      focusedComp.each(Focusing.focus);
    };

    const schema$c = constant$1([
      field('splitToolbarBehaviours', [Coupling]),
      customField('builtGroups', () => Cell([]))
    ]);

    const schema$b = constant$1([
      markers$1(['overflowToggledClass']),
      optionFunction('getOverflowBounds'),
      required$1('lazySink'),
      customField('overflowGroups', () => Cell([]))
    ].concat(schema$c()));
    const parts$7 = constant$1([
      required({
        factory: Toolbar,
        schema: schema$e(),
        name: 'primary'
      }),
      external({
        schema: schema$e(),
        name: 'overflow'
      }),
      external({ name: 'overflow-button' }),
      external({ name: 'overflow-group' })
    ]);

    const expandable = constant$1((element, available) => {
      setMax(element, Math.floor(available));
    });

    const schema$a = constant$1([
      markers$1(['toggledClass']),
      required$1('lazySink'),
      requiredFunction('fetch'),
      optionFunction('getBounds'),
      optionObjOf('fireDismissalEventInstead', [defaulted('event', dismissRequested())]),
      schema$y()
    ]);
    const parts$6 = constant$1([
      external({
        name: 'button',
        overrides: detail => ({
          dom: { attributes: { 'aria-haspopup': 'true' } },
          buttonBehaviours: derive$1([Toggling.config({
              toggleClass: detail.markers.toggledClass,
              aria: { mode: 'expanded' },
              toggleOnExecute: false
            })])
        })
      }),
      external({
        factory: Toolbar,
        schema: schema$e(),
        name: 'toolbar',
        overrides: detail => {
          return {
            toolbarBehaviours: derive$1([Keying.config({
                mode: 'cyclic',
                onEscape: comp => {
                  getPart(comp, detail, 'button').each(Focusing.focus);
                  return Optional.none();
                }
              })])
          };
        }
      })
    ]);

    const toggle = (button, externals) => {
      const toolbarSandbox = Coupling.getCoupled(button, 'toolbarSandbox');
      if (Sandboxing.isOpen(toolbarSandbox)) {
        Sandboxing.close(toolbarSandbox);
      } else {
        Sandboxing.open(toolbarSandbox, externals.toolbar());
      }
    };
    const position = (button, toolbar, detail, layouts) => {
      const bounds = detail.getBounds.map(bounder => bounder());
      const sink = detail.lazySink(button).getOrDie();
      Positioning.positionWithinBounds(sink, toolbar, {
        anchor: {
          type: 'hotspot',
          hotspot: button,
          layouts,
          overrides: { maxWidthFunction: expandable() }
        }
      }, bounds);
    };
    const setGroups = (button, toolbar, detail, layouts, groups) => {
      Toolbar.setGroups(toolbar, groups);
      position(button, toolbar, detail, layouts);
      Toggling.on(button);
    };
    const makeSandbox = (button, spec, detail) => {
      const ariaControls = manager();
      const onOpen = (sandbox, toolbar) => {
        detail.fetch().get(groups => {
          setGroups(button, toolbar, detail, spec.layouts, groups);
          ariaControls.link(button.element);
          Keying.focusIn(toolbar);
        });
      };
      const onClose = () => {
        Toggling.off(button);
        Focusing.focus(button);
        ariaControls.unlink(button.element);
      };
      return {
        dom: {
          tag: 'div',
          attributes: { id: ariaControls.id }
        },
        behaviours: derive$1([
          Keying.config({
            mode: 'special',
            onEscape: comp => {
              Sandboxing.close(comp);
              return Optional.some(true);
            }
          }),
          Sandboxing.config({
            onOpen,
            onClose,
            isPartOf: (container, data, queryElem) => {
              return isPartOf$1(data, queryElem) || isPartOf$1(button, queryElem);
            },
            getAttachPoint: () => {
              return detail.lazySink(button).getOrDie();
            }
          }),
          Receiving.config({
            channels: {
              ...receivingChannel$1({
                isExtraPart: never,
                ...detail.fireDismissalEventInstead.map(fe => ({ fireEventInstead: { event: fe.event } })).getOr({})
              }),
              ...receivingChannel({
                doReposition: () => {
                  Sandboxing.getState(Coupling.getCoupled(button, 'toolbarSandbox')).each(toolbar => {
                    position(button, toolbar, detail, spec.layouts);
                  });
                }
              })
            }
          })
        ])
      };
    };
    const factory$a = (detail, components, spec, externals) => ({
      ...Button.sketch({
        ...externals.button(),
        action: button => {
          toggle(button, externals);
        },
        buttonBehaviours: SketchBehaviours.augment({ dump: externals.button().buttonBehaviours }, [Coupling.config({
            others: {
              toolbarSandbox: button => {
                return makeSandbox(button, spec, detail);
              }
            }
          })])
      }),
      apis: {
        setGroups: (button, groups) => {
          Sandboxing.getState(Coupling.getCoupled(button, 'toolbarSandbox')).each(toolbar => {
            setGroups(button, toolbar, detail, spec.layouts, groups);
          });
        },
        reposition: button => {
          Sandboxing.getState(Coupling.getCoupled(button, 'toolbarSandbox')).each(toolbar => {
            position(button, toolbar, detail, spec.layouts);
          });
        },
        toggle: button => {
          toggle(button, externals);
        },
        getToolbar: button => {
          return Sandboxing.getState(Coupling.getCoupled(button, 'toolbarSandbox'));
        },
        isOpen: button => {
          return Sandboxing.isOpen(Coupling.getCoupled(button, 'toolbarSandbox'));
        }
      }
    });
    const FloatingToolbarButton = composite({
      name: 'FloatingToolbarButton',
      factory: factory$a,
      configFields: schema$a(),
      partFields: parts$6(),
      apis: {
        setGroups: (apis, button, groups) => {
          apis.setGroups(button, groups);
        },
        reposition: (apis, button) => {
          apis.reposition(button);
        },
        toggle: (apis, button) => {
          apis.toggle(button);
        },
        getToolbar: (apis, button) => apis.getToolbar(button),
        isOpen: (apis, button) => apis.isOpen(button)
      }
    });

    const schema$9 = constant$1([
      required$1('items'),
      markers$1(['itemSelector']),
      field('tgroupBehaviours', [Keying])
    ]);
    const parts$5 = constant$1([group({
        name: 'items',
        unit: 'item'
      })]);

    const factory$9 = (detail, components, _spec, _externals) => ({
      uid: detail.uid,
      dom: detail.dom,
      components,
      behaviours: augment(detail.tgroupBehaviours, [Keying.config({
          mode: 'flow',
          selector: detail.markers.itemSelector
        })]),
      domModification: { attributes: { role: 'toolbar' } }
    });
    const ToolbarGroup = composite({
      name: 'ToolbarGroup',
      configFields: schema$9(),
      partFields: parts$5(),
      factory: factory$9
    });

    const buildGroups = comps => map$2(comps, g => premade(g));
    const refresh$1 = (toolbar, memFloatingToolbarButton, detail) => {
      refresh$2(toolbar, detail, overflowGroups => {
        detail.overflowGroups.set(overflowGroups);
        memFloatingToolbarButton.getOpt(toolbar).each(floatingToolbarButton => {
          FloatingToolbarButton.setGroups(floatingToolbarButton, buildGroups(overflowGroups));
        });
      });
    };
    const factory$8 = (detail, components, spec, externals) => {
      const memFloatingToolbarButton = record(FloatingToolbarButton.sketch({
        fetch: () => Future.nu(resolve => {
          resolve(buildGroups(detail.overflowGroups.get()));
        }),
        layouts: {
          onLtr: () => [
            southwest$2,
            southeast$2
          ],
          onRtl: () => [
            southeast$2,
            southwest$2
          ],
          onBottomLtr: () => [
            northwest$2,
            northeast$2
          ],
          onBottomRtl: () => [
            northeast$2,
            northwest$2
          ]
        },
        getBounds: spec.getOverflowBounds,
        lazySink: detail.lazySink,
        fireDismissalEventInstead: {},
        markers: { toggledClass: detail.markers.overflowToggledClass },
        parts: {
          button: externals['overflow-button'](),
          toolbar: externals.overflow()
        }
      }));
      return {
        uid: detail.uid,
        dom: detail.dom,
        components,
        behaviours: augment(detail.splitToolbarBehaviours, [Coupling.config({
            others: {
              overflowGroup: () => {
                return ToolbarGroup.sketch({
                  ...externals['overflow-group'](),
                  items: [memFloatingToolbarButton.asSpec()]
                });
              }
            }
          })]),
        apis: {
          setGroups: (toolbar, groups) => {
            detail.builtGroups.set(map$2(groups, toolbar.getSystem().build));
            refresh$1(toolbar, memFloatingToolbarButton, detail);
          },
          refresh: toolbar => refresh$1(toolbar, memFloatingToolbarButton, detail),
          toggle: toolbar => {
            memFloatingToolbarButton.getOpt(toolbar).each(floatingToolbarButton => {
              FloatingToolbarButton.toggle(floatingToolbarButton);
            });
          },
          isOpen: toolbar => memFloatingToolbarButton.getOpt(toolbar).map(FloatingToolbarButton.isOpen).getOr(false),
          reposition: toolbar => {
            memFloatingToolbarButton.getOpt(toolbar).each(floatingToolbarButton => {
              FloatingToolbarButton.reposition(floatingToolbarButton);
            });
          },
          getOverflow: toolbar => memFloatingToolbarButton.getOpt(toolbar).bind(FloatingToolbarButton.getToolbar)
        },
        domModification: { attributes: { role: 'group' } }
      };
    };
    const SplitFloatingToolbar = composite({
      name: 'SplitFloatingToolbar',
      configFields: schema$b(),
      partFields: parts$7(),
      factory: factory$8,
      apis: {
        setGroups: (apis, toolbar, groups) => {
          apis.setGroups(toolbar, groups);
        },
        refresh: (apis, toolbar) => {
          apis.refresh(toolbar);
        },
        reposition: (apis, toolbar) => {
          apis.reposition(toolbar);
        },
        toggle: (apis, toolbar) => {
          apis.toggle(toolbar);
        },
        isOpen: (apis, toolbar) => apis.isOpen(toolbar),
        getOverflow: (apis, toolbar) => apis.getOverflow(toolbar)
      }
    });

    const schema$8 = constant$1([
      markers$1([
        'closedClass',
        'openClass',
        'shrinkingClass',
        'growingClass',
        'overflowToggledClass'
      ]),
      onHandler('onOpened'),
      onHandler('onClosed')
    ].concat(schema$c()));
    const parts$4 = constant$1([
      required({
        factory: Toolbar,
        schema: schema$e(),
        name: 'primary'
      }),
      required({
        factory: Toolbar,
        schema: schema$e(),
        name: 'overflow',
        overrides: detail => {
          return {
            toolbarBehaviours: derive$1([
              Sliding.config({
                dimension: { property: 'height' },
                closedClass: detail.markers.closedClass,
                openClass: detail.markers.openClass,
                shrinkingClass: detail.markers.shrinkingClass,
                growingClass: detail.markers.growingClass,
                onShrunk: comp => {
                  getPart(comp, detail, 'overflow-button').each(button => {
                    Toggling.off(button);
                    Focusing.focus(button);
                  });
                  detail.onClosed(comp);
                },
                onGrown: comp => {
                  Keying.focusIn(comp);
                  detail.onOpened(comp);
                },
                onStartGrow: comp => {
                  getPart(comp, detail, 'overflow-button').each(Toggling.on);
                }
              }),
              Keying.config({
                mode: 'acyclic',
                onEscape: comp => {
                  getPart(comp, detail, 'overflow-button').each(Focusing.focus);
                  return Optional.some(true);
                }
              })
            ])
          };
        }
      }),
      external({
        name: 'overflow-button',
        overrides: detail => ({
          buttonBehaviours: derive$1([Toggling.config({
              toggleClass: detail.markers.overflowToggledClass,
              aria: { mode: 'pressed' },
              toggleOnExecute: false
            })])
        })
      }),
      external({ name: 'overflow-group' })
    ]);

    const isOpen = (toolbar, detail) => getPart(toolbar, detail, 'overflow').map(Sliding.hasGrown).getOr(false);
    const toggleToolbar = (toolbar, detail) => {
      getPart(toolbar, detail, 'overflow-button').bind(() => getPart(toolbar, detail, 'overflow')).each(overf => {
        refresh(toolbar, detail);
        Sliding.toggleGrow(overf);
      });
    };
    const refresh = (toolbar, detail) => {
      getPart(toolbar, detail, 'overflow').each(overflow => {
        refresh$2(toolbar, detail, groups => {
          const builtGroups = map$2(groups, g => premade(g));
          Toolbar.setGroups(overflow, builtGroups);
        });
        getPart(toolbar, detail, 'overflow-button').each(button => {
          if (Sliding.hasGrown(overflow)) {
            Toggling.on(button);
          }
        });
        Sliding.refresh(overflow);
      });
    };
    const factory$7 = (detail, components, spec, externals) => {
      const toolbarToggleEvent = 'alloy.toolbar.toggle';
      const doSetGroups = (toolbar, groups) => {
        const built = map$2(groups, toolbar.getSystem().build);
        detail.builtGroups.set(built);
      };
      return {
        uid: detail.uid,
        dom: detail.dom,
        components,
        behaviours: augment(detail.splitToolbarBehaviours, [
          Coupling.config({
            others: {
              overflowGroup: toolbar => {
                return ToolbarGroup.sketch({
                  ...externals['overflow-group'](),
                  items: [Button.sketch({
                      ...externals['overflow-button'](),
                      action: _button => {
                        emit(toolbar, toolbarToggleEvent);
                      }
                    })]
                });
              }
            }
          }),
          config('toolbar-toggle-events', [run$1(toolbarToggleEvent, toolbar => {
              toggleToolbar(toolbar, detail);
            })])
        ]),
        apis: {
          setGroups: (toolbar, groups) => {
            doSetGroups(toolbar, groups);
            refresh(toolbar, detail);
          },
          refresh: toolbar => refresh(toolbar, detail),
          toggle: toolbar => toggleToolbar(toolbar, detail),
          isOpen: toolbar => isOpen(toolbar, detail)
        },
        domModification: { attributes: { role: 'group' } }
      };
    };
    const SplitSlidingToolbar = composite({
      name: 'SplitSlidingToolbar',
      configFields: schema$8(),
      partFields: parts$4(),
      factory: factory$7,
      apis: {
        setGroups: (apis, toolbar, groups) => {
          apis.setGroups(toolbar, groups);
        },
        refresh: (apis, toolbar) => {
          apis.refresh(toolbar);
        },
        toggle: (apis, toolbar) => {
          apis.toggle(toolbar);
        },
        isOpen: (apis, toolbar) => apis.isOpen(toolbar)
      }
    });

    const renderToolbarGroupCommon = toolbarGroup => {
      const attributes = toolbarGroup.title.fold(() => ({}), title => ({ attributes: { title } }));
      return {
        dom: {
          tag: 'div',
          classes: ['tox-toolbar__group'],
          ...attributes
        },
        components: [ToolbarGroup.parts.items({})],
        items: toolbarGroup.items,
        markers: { itemSelector: '*:not(.tox-split-button) > .tox-tbtn:not([disabled]), ' + '.tox-split-button:not([disabled]), ' + '.tox-toolbar-nav-js:not([disabled])' },
        tgroupBehaviours: derive$1([
          Tabstopping.config({}),
          Focusing.config({})
        ])
      };
    };
    const renderToolbarGroup = toolbarGroup => ToolbarGroup.sketch(renderToolbarGroupCommon(toolbarGroup));
    const getToolbarBehaviours = (toolbarSpec, modeName) => {
      const onAttached = runOnAttached(component => {
        const groups = map$2(toolbarSpec.initGroups, renderToolbarGroup);
        Toolbar.setGroups(component, groups);
      });
      return derive$1([
        DisablingConfigs.toolbarButton(toolbarSpec.providers.isDisabled),
        receivingConfig(),
        Keying.config({
          mode: modeName,
          onEscape: toolbarSpec.onEscape,
          selector: '.tox-toolbar__group'
        }),
        config('toolbar-events', [onAttached])
      ]);
    };
    const renderMoreToolbarCommon = toolbarSpec => {
      const modeName = toolbarSpec.cyclicKeying ? 'cyclic' : 'acyclic';
      return {
        uid: toolbarSpec.uid,
        dom: {
          tag: 'div',
          classes: ['tox-toolbar-overlord']
        },
        parts: {
          'overflow-group': renderToolbarGroupCommon({
            title: Optional.none(),
            items: []
          }),
          'overflow-button': renderIconButtonSpec({
            name: 'more',
            icon: Optional.some('more-drawer'),
            enabled: true,
            tooltip: Optional.some('More...'),
            primary: false,
            buttonType: Optional.none(),
            borderless: false
          }, Optional.none(), toolbarSpec.providers)
        },
        splitToolbarBehaviours: getToolbarBehaviours(toolbarSpec, modeName)
      };
    };
    const renderFloatingMoreToolbar = toolbarSpec => {
      const baseSpec = renderMoreToolbarCommon(toolbarSpec);
      const overflowXOffset = 4;
      const primary = SplitFloatingToolbar.parts.primary({
        dom: {
          tag: 'div',
          classes: ['tox-toolbar__primary']
        }
      });
      return SplitFloatingToolbar.sketch({
        ...baseSpec,
        lazySink: toolbarSpec.getSink,
        getOverflowBounds: () => {
          const headerElem = toolbarSpec.moreDrawerData.lazyHeader().element;
          const headerBounds = absolute$2(headerElem);
          const docElem = documentElement(headerElem);
          const docBounds = absolute$2(docElem);
          const height = Math.max(docElem.dom.scrollHeight, docBounds.height);
          return bounds(headerBounds.x + overflowXOffset, docBounds.y, headerBounds.width - overflowXOffset * 2, height);
        },
        parts: {
          ...baseSpec.parts,
          overflow: {
            dom: {
              tag: 'div',
              classes: ['tox-toolbar__overflow'],
              attributes: toolbarSpec.attributes
            }
          }
        },
        components: [primary],
        markers: { overflowToggledClass: 'tox-tbtn--enabled' }
      });
    };
    const renderSlidingMoreToolbar = toolbarSpec => {
      const primary = SplitSlidingToolbar.parts.primary({
        dom: {
          tag: 'div',
          classes: ['tox-toolbar__primary']
        }
      });
      const overflow = SplitSlidingToolbar.parts.overflow({
        dom: {
          tag: 'div',
          classes: ['tox-toolbar__overflow']
        }
      });
      const baseSpec = renderMoreToolbarCommon(toolbarSpec);
      return SplitSlidingToolbar.sketch({
        ...baseSpec,
        components: [
          primary,
          overflow
        ],
        markers: {
          openClass: 'tox-toolbar__overflow--open',
          closedClass: 'tox-toolbar__overflow--closed',
          growingClass: 'tox-toolbar__overflow--growing',
          shrinkingClass: 'tox-toolbar__overflow--shrinking',
          overflowToggledClass: 'tox-tbtn--enabled'
        },
        onOpened: comp => {
          comp.getSystem().broadcastOn([toolbarHeightChange()], { type: 'opened' });
        },
        onClosed: comp => {
          comp.getSystem().broadcastOn([toolbarHeightChange()], { type: 'closed' });
        }
      });
    };
    const renderToolbar = toolbarSpec => {
      const modeName = toolbarSpec.cyclicKeying ? 'cyclic' : 'acyclic';
      return Toolbar.sketch({
        uid: toolbarSpec.uid,
        dom: {
          tag: 'div',
          classes: ['tox-toolbar'].concat(toolbarSpec.type === ToolbarMode$1.scrolling ? ['tox-toolbar--scrolling'] : [])
        },
        components: [Toolbar.parts.groups({})],
        toolbarBehaviours: getToolbarBehaviours(toolbarSpec, modeName)
      });
    };

    const factory$6 = (detail, components, _spec) => {
      const apis = {
        getSocket: comp => {
          return parts$a.getPart(comp, detail, 'socket');
        },
        setSidebar: (comp, panelConfigs, showSidebar) => {
          parts$a.getPart(comp, detail, 'sidebar').each(sidebar => setSidebar(sidebar, panelConfigs, showSidebar));
        },
        toggleSidebar: (comp, name) => {
          parts$a.getPart(comp, detail, 'sidebar').each(sidebar => toggleSidebar(sidebar, name));
        },
        whichSidebar: comp => {
          return parts$a.getPart(comp, detail, 'sidebar').bind(whichSidebar).getOrNull();
        },
        getHeader: comp => {
          return parts$a.getPart(comp, detail, 'header');
        },
        getToolbar: comp => {
          return parts$a.getPart(comp, detail, 'toolbar');
        },
        setToolbar: (comp, groups) => {
          parts$a.getPart(comp, detail, 'toolbar').each(toolbar => {
            const renderedGroups = map$2(groups, renderToolbarGroup);
            toolbar.getApis().setGroups(toolbar, renderedGroups);
          });
        },
        setToolbars: (comp, toolbars) => {
          parts$a.getPart(comp, detail, 'multiple-toolbar').each(mToolbar => {
            const renderedToolbars = map$2(toolbars, g => map$2(g, renderToolbarGroup));
            CustomList.setItems(mToolbar, renderedToolbars);
          });
        },
        refreshToolbar: comp => {
          const toolbar = parts$a.getPart(comp, detail, 'toolbar');
          toolbar.each(toolbar => toolbar.getApis().refresh(toolbar));
        },
        toggleToolbarDrawer: comp => {
          parts$a.getPart(comp, detail, 'toolbar').each(toolbar => {
            mapFrom(toolbar.getApis().toggle, toggle => toggle(toolbar));
          });
        },
        isToolbarDrawerToggled: comp => {
          return parts$a.getPart(comp, detail, 'toolbar').bind(toolbar => Optional.from(toolbar.getApis().isOpen).map(isOpen => isOpen(toolbar))).getOr(false);
        },
        getThrobber: comp => {
          return parts$a.getPart(comp, detail, 'throbber');
        },
        focusToolbar: comp => {
          const optToolbar = parts$a.getPart(comp, detail, 'toolbar').orThunk(() => parts$a.getPart(comp, detail, 'multiple-toolbar'));
          optToolbar.each(toolbar => {
            Keying.focusIn(toolbar);
          });
        },
        setMenubar: (comp, menus) => {
          parts$a.getPart(comp, detail, 'menubar').each(menubar => {
            SilverMenubar.setMenus(menubar, menus);
          });
        },
        focusMenubar: comp => {
          parts$a.getPart(comp, detail, 'menubar').each(menubar => {
            SilverMenubar.focus(menubar);
          });
        }
      };
      return {
        uid: detail.uid,
        dom: detail.dom,
        components,
        apis,
        behaviours: detail.behaviours
      };
    };
    const partMenubar = partType.optional({
      factory: SilverMenubar,
      name: 'menubar',
      schema: [required$1('backstage')]
    });
    const toolbarFactory = spec => {
      if (spec.type === ToolbarMode$1.sliding) {
        return renderSlidingMoreToolbar;
      } else if (spec.type === ToolbarMode$1.floating) {
        return renderFloatingMoreToolbar;
      } else {
        return renderToolbar;
      }
    };
    const partMultipleToolbar = partType.optional({
      factory: {
        sketch: spec => CustomList.sketch({
          uid: spec.uid,
          dom: spec.dom,
          listBehaviours: derive$1([Keying.config({
              mode: 'acyclic',
              selector: '.tox-toolbar'
            })]),
          makeItem: () => renderToolbar({
            type: spec.type,
            uid: generate$6('multiple-toolbar-item'),
            cyclicKeying: false,
            initGroups: [],
            providers: spec.providers,
            onEscape: () => {
              spec.onEscape();
              return Optional.some(true);
            }
          }),
          setupItem: (_mToolbar, tc, data, _index) => {
            Toolbar.setGroups(tc, data);
          },
          shell: true
        })
      },
      name: 'multiple-toolbar',
      schema: [
        required$1('dom'),
        required$1('onEscape')
      ]
    });
    const partToolbar = partType.optional({
      factory: {
        sketch: spec => {
          const renderer = toolbarFactory(spec);
          const toolbarSpec = {
            type: spec.type,
            uid: spec.uid,
            onEscape: () => {
              spec.onEscape();
              return Optional.some(true);
            },
            cyclicKeying: false,
            initGroups: [],
            getSink: spec.getSink,
            providers: spec.providers,
            moreDrawerData: {
              lazyToolbar: spec.lazyToolbar,
              lazyMoreButton: spec.lazyMoreButton,
              lazyHeader: spec.lazyHeader
            },
            attributes: spec.attributes
          };
          return renderer(toolbarSpec);
        }
      },
      name: 'toolbar',
      schema: [
        required$1('dom'),
        required$1('onEscape'),
        required$1('getSink')
      ]
    });
    const partHeader = partType.optional({
      factory: { sketch: renderHeader },
      name: 'header',
      schema: [required$1('dom')]
    });
    const partPromotion = partType.optional({
      factory: { sketch: renderPromotion },
      name: 'promotion',
      schema: [required$1('dom')]
    });
    const partSocket = partType.optional({
      name: 'socket',
      schema: [required$1('dom')]
    });
    const partSidebar = partType.optional({
      factory: { sketch: renderSidebar },
      name: 'sidebar',
      schema: [required$1('dom')]
    });
    const partThrobber = partType.optional({
      factory: { sketch: renderThrobber },
      name: 'throbber',
      schema: [required$1('dom')]
    });
    var OuterContainer = composite({
      name: 'OuterContainer',
      factory: factory$6,
      configFields: [
        required$1('dom'),
        required$1('behaviours')
      ],
      partFields: [
        partHeader,
        partMenubar,
        partToolbar,
        partMultipleToolbar,
        partSocket,
        partSidebar,
        partPromotion,
        partThrobber
      ],
      apis: {
        getSocket: (apis, comp) => {
          return apis.getSocket(comp);
        },
        setSidebar: (apis, comp, panelConfigs, showSidebar) => {
          apis.setSidebar(comp, panelConfigs, showSidebar);
        },
        toggleSidebar: (apis, comp, name) => {
          apis.toggleSidebar(comp, name);
        },
        whichSidebar: (apis, comp) => {
          return apis.whichSidebar(comp);
        },
        getHeader: (apis, comp) => {
          return apis.getHeader(comp);
        },
        getToolbar: (apis, comp) => {
          return apis.getToolbar(comp);
        },
        setToolbar: (apis, comp, groups) => {
          apis.setToolbar(comp, groups);
        },
        setToolbars: (apis, comp, toolbars) => {
          apis.setToolbars(comp, toolbars);
        },
        refreshToolbar: (apis, comp) => {
          return apis.refreshToolbar(comp);
        },
        toggleToolbarDrawer: (apis, comp) => {
          apis.toggleToolbarDrawer(comp);
        },
        isToolbarDrawerToggled: (apis, comp) => {
          return apis.isToolbarDrawerToggled(comp);
        },
        getThrobber: (apis, comp) => {
          return apis.getThrobber(comp);
        },
        setMenubar: (apis, comp, menus) => {
          apis.setMenubar(comp, menus);
        },
        focusMenubar: (apis, comp) => {
          apis.focusMenubar(comp);
        },
        focusToolbar: (apis, comp) => {
          apis.focusToolbar(comp);
        }
      }
    });

    const defaultMenubar = 'file edit view insert format tools table help';
    const defaultMenus = {
      file: {
        title: 'File',
        items: 'newdocument restoredraft | preview | export print | deleteallconversations'
      },
      edit: {
        title: 'Edit',
        items: 'undo redo | cut copy paste pastetext | selectall | searchreplace'
      },
      view: {
        title: 'View',
        items: 'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments'
      },
      insert: {
        title: 'Insert',
        items: 'image link media addcomment pageembed template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents footnotes | mergetags | insertdatetime'
      },
      format: {
        title: 'Format',
        items: 'bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | language | removeformat'
      },
      tools: {
        title: 'Tools',
        items: 'spellchecker spellcheckerlanguage | autocorrect capitalization | a11ycheck code wordcount'
      },
      table: {
        title: 'Table',
        items: 'inserttable | cell row column | advtablesort | tableprops deletetable'
      },
      help: {
        title: 'Help',
        items: 'help'
      }
    };
    const make = (menu, registry, editor) => {
      const removedMenuItems = getRemovedMenuItems(editor).split(/[ ,]/);
      return {
        text: menu.title,
        getItems: () => bind$3(menu.items, i => {
          const itemName = i.toLowerCase();
          if (itemName.trim().length === 0) {
            return [];
          } else if (exists(removedMenuItems, removedMenuItem => removedMenuItem === itemName)) {
            return [];
          } else if (itemName === 'separator' || itemName === '|') {
            return [{ type: 'separator' }];
          } else if (registry.menuItems[itemName]) {
            return [registry.menuItems[itemName]];
          } else {
            return [];
          }
        })
      };
    };
    const parseItemsString = items => {
      return items.split(' ');
    };
    const identifyMenus = (editor, registry) => {
      const rawMenuData = {
        ...defaultMenus,
        ...registry.menus
      };
      const userDefinedMenus = keys(registry.menus).length > 0;
      const menubar = registry.menubar === undefined || registry.menubar === true ? parseItemsString(defaultMenubar) : parseItemsString(registry.menubar === false ? '' : registry.menubar);
      const validMenus = filter$2(menubar, menuName => {
        const isDefaultMenu = has$2(defaultMenus, menuName);
        if (userDefinedMenus) {
          return isDefaultMenu || get$g(registry.menus, menuName).exists(menu => has$2(menu, 'items'));
        } else {
          return isDefaultMenu;
        }
      });
      const menus = map$2(validMenus, menuName => {
        const menuData = rawMenuData[menuName];
        return make({
          title: menuData.title,
          items: parseItemsString(menuData.items)
        }, registry, editor);
      });
      return filter$2(menus, menu => {
        const isNotSeparator = item => isString(item) || item.type !== 'separator';
        return menu.getItems().length > 0 && exists(menu.getItems(), isNotSeparator);
      });
    };

    const fireSkinLoaded = editor => {
      const done = () => {
        editor._skinLoaded = true;
        fireSkinLoaded$1(editor);
      };
      return () => {
        if (editor.initialized) {
          done();
        } else {
          editor.on('init', done);
        }
      };
    };
    const fireSkinLoadError = (editor, err) => () => fireSkinLoadError$1(editor, { message: err });

    const loadStylesheet = (editor, stylesheetUrl, styleSheetLoader) => {
      editor.on('remove', () => styleSheetLoader.unload(stylesheetUrl));
      return styleSheetLoader.load(stylesheetUrl);
    };
    const loadUiSkins = (editor, skinUrl) => {
      const skinUiCss = skinUrl + '/skin.min.css';
      return loadStylesheet(editor, skinUiCss, editor.ui.styleSheetLoader);
    };
    const loadShadowDomUiSkins = (editor, skinUrl) => {
      const isInShadowRoot$1 = isInShadowRoot(SugarElement.fromDom(editor.getElement()));
      if (isInShadowRoot$1) {
        const shadowDomSkinCss = skinUrl + '/skin.shadowdom.min.css';
        return loadStylesheet(editor, shadowDomSkinCss, global$7.DOM.styleSheetLoader);
      } else {
        return Promise.resolve();
      }
    };
    const loadSkin = (isInline, editor) => {
      const skinUrl = getSkinUrl(editor);
      if (skinUrl) {
        editor.contentCSS.push(skinUrl + (isInline ? '/content.inline' : '/content') + '.min.css');
      }
      if (!isSkinDisabled(editor) && isString(skinUrl)) {
        Promise.all([
          loadUiSkins(editor, skinUrl),
          loadShadowDomUiSkins(editor, skinUrl)
        ]).then(fireSkinLoaded(editor), fireSkinLoadError(editor, 'Skin could not be loaded'));
      } else {
        fireSkinLoaded(editor)();
      }
    };
    const iframe = curry(loadSkin, false);
    const inline = curry(loadSkin, true);

    const onSetupFormatToggle = (editor, name) => api => {
      const boundCallback = unbindable();
      const init = () => {
        api.setActive(editor.formatter.match(name));
        const binding = editor.formatter.formatChanged(name, api.setActive);
        boundCallback.set(binding);
      };
      editor.initialized ? init() : editor.once('init', init);
      return () => {
        editor.off('init', init);
        boundCallback.clear();
      };
    };
    const onSetupEvent = (editor, event, f) => api => {
      const handleEvent = () => f(api);
      const init = () => {
        f(api);
        editor.on(event, handleEvent);
      };
      editor.initialized ? init() : editor.once('init', init);
      return () => {
        editor.off('init', init);
        editor.off(event, handleEvent);
      };
    };
    const onActionToggleFormat$1 = editor => rawItem => () => {
      editor.undoManager.transact(() => {
        editor.focus();
        editor.execCommand('mceToggleFormat', false, rawItem.format);
      });
    };
    const onActionExecCommand = (editor, command) => () => editor.execCommand(command);

    const generateSelectItems = (_editor, backstage, spec) => {
      const generateItem = (rawItem, response, invalid, value) => {
        const translatedText = backstage.shared.providers.translate(rawItem.title);
        if (rawItem.type === 'separator') {
          return Optional.some({
            type: 'separator',
            text: translatedText
          });
        } else if (rawItem.type === 'submenu') {
          const items = bind$3(rawItem.getStyleItems(), si => validate(si, response, value));
          if (response === 0 && items.length <= 0) {
            return Optional.none();
          } else {
            return Optional.some({
              type: 'nestedmenuitem',
              text: translatedText,
              enabled: items.length > 0,
              getSubmenuItems: () => bind$3(rawItem.getStyleItems(), si => validate(si, response, value))
            });
          }
        } else {
          return Optional.some({
            type: 'togglemenuitem',
            text: translatedText,
            icon: rawItem.icon,
            active: rawItem.isSelected(value),
            enabled: !invalid,
            onAction: spec.onAction(rawItem),
            ...rawItem.getStylePreview().fold(() => ({}), preview => ({ meta: { style: preview } }))
          });
        }
      };
      const validate = (item, response, value) => {
        const invalid = item.type === 'formatter' && spec.isInvalid(item);
        if (response === 0) {
          return invalid ? [] : generateItem(item, response, false, value).toArray();
        } else {
          return generateItem(item, response, invalid, value).toArray();
        }
      };
      const validateItems = preItems => {
        const value = spec.getCurrentValue();
        const response = spec.shouldHide ? 0 : 1;
        return bind$3(preItems, item => validate(item, response, value));
      };
      const getFetch = (backstage, getStyleItems) => (comp, callback) => {
        const preItems = getStyleItems();
        const items = validateItems(preItems);
        const menu = build(items, ItemResponse$1.CLOSE_ON_EXECUTE, backstage, {
          isHorizontalMenu: false,
          search: Optional.none()
        });
        callback(menu);
      };
      return {
        validateItems,
        getFetch
      };
    };
    const createMenuItems = (editor, backstage, spec) => {
      const dataset = spec.dataset;
      const getStyleItems = dataset.type === 'basic' ? () => map$2(dataset.data, d => processBasic(d, spec.isSelectedFor, spec.getPreviewFor)) : dataset.getData;
      return {
        items: generateSelectItems(editor, backstage, spec),
        getStyleItems
      };
    };
    const createSelectButton = (editor, backstage, spec) => {
      const {items, getStyleItems} = createMenuItems(editor, backstage, spec);
      const getApi = comp => ({ getComponent: constant$1(comp) });
      const onSetup = onSetupEvent(editor, 'NodeChange', api => {
        const comp = api.getComponent();
        spec.updateText(comp);
      });
      return renderCommonDropdown({
        text: spec.icon.isSome() ? Optional.none() : spec.text,
        icon: spec.icon,
        tooltip: Optional.from(spec.tooltip),
        role: Optional.none(),
        fetch: items.getFetch(backstage, getStyleItems),
        onSetup,
        getApi,
        columns: 1,
        presets: 'normal',
        classes: spec.icon.isSome() ? [] : ['bespoke'],
        dropdownBehaviours: []
      }, 'tox-tbtn', backstage.shared);
    };

    const process = rawFormats => map$2(rawFormats, item => {
      let title = item, format = item;
      const values = item.split('=');
      if (values.length > 1) {
        title = values[0];
        format = values[1];
      }
      return {
        title,
        format
      };
    });
    const buildBasicStaticDataset = data => ({
      type: 'basic',
      data
    });
    var Delimiter;
    (function (Delimiter) {
      Delimiter[Delimiter['SemiColon'] = 0] = 'SemiColon';
      Delimiter[Delimiter['Space'] = 1] = 'Space';
    }(Delimiter || (Delimiter = {})));
    const split = (rawFormats, delimiter) => {
      if (delimiter === Delimiter.SemiColon) {
        return rawFormats.replace(/;$/, '').split(';');
      } else {
        return rawFormats.split(' ');
      }
    };
    const buildBasicSettingsDataset = (editor, settingName, delimiter) => {
      const rawFormats = editor.options.get(settingName);
      const data = process(split(rawFormats, delimiter));
      return {
        type: 'basic',
        data
      };
    };

    const alignMenuItems = [
      {
        title: 'Left',
        icon: 'align-left',
        format: 'alignleft',
        command: 'JustifyLeft'
      },
      {
        title: 'Center',
        icon: 'align-center',
        format: 'aligncenter',
        command: 'JustifyCenter'
      },
      {
        title: 'Right',
        icon: 'align-right',
        format: 'alignright',
        command: 'JustifyRight'
      },
      {
        title: 'Justify',
        icon: 'align-justify',
        format: 'alignjustify',
        command: 'JustifyFull'
      }
    ];
    const getSpec$4 = editor => {
      const getMatchingValue = () => find$5(alignMenuItems, item => editor.formatter.match(item.format));
      const isSelectedFor = format => () => editor.formatter.match(format);
      const getPreviewFor = _format => Optional.none;
      const updateSelectMenuIcon = comp => {
        const match = getMatchingValue();
        const alignment = match.fold(constant$1('left'), item => item.title.toLowerCase());
        emitWith(comp, updateMenuIcon, { icon: `align-${ alignment }` });
      };
      const dataset = buildBasicStaticDataset(alignMenuItems);
      const onAction = rawItem => () => find$5(alignMenuItems, item => item.format === rawItem.format).each(item => editor.execCommand(item.command));
      return {
        tooltip: 'Align',
        text: Optional.none(),
        icon: Optional.some('align-left'),
        isSelectedFor,
        getCurrentValue: Optional.none,
        getPreviewFor,
        onAction,
        updateText: updateSelectMenuIcon,
        dataset,
        shouldHide: false,
        isInvalid: item => !editor.formatter.canApply(item.format)
      };
    };
    const createAlignButton = (editor, backstage) => createSelectButton(editor, backstage, getSpec$4(editor));
    const createAlignMenu = (editor, backstage) => {
      const menuItems = createMenuItems(editor, backstage, getSpec$4(editor));
      editor.ui.registry.addNestedMenuItem('align', {
        text: backstage.shared.providers.translate('Align'),
        getSubmenuItems: () => menuItems.items.validateItems(menuItems.getStyleItems())
      });
    };

    const findNearest = (editor, getStyles) => {
      const styles = getStyles();
      const formats = map$2(styles, style => style.format);
      return Optional.from(editor.formatter.closest(formats)).bind(fmt => find$5(styles, data => data.format === fmt)).orThunk(() => someIf(editor.formatter.match('p'), {
        title: 'Paragraph',
        format: 'p'
      }));
    };

    const getSpec$3 = editor => {
      const fallbackFormat = 'Paragraph';
      const isSelectedFor = format => () => editor.formatter.match(format);
      const getPreviewFor = format => () => {
        const fmt = editor.formatter.get(format);
        if (fmt) {
          return Optional.some({
            tag: fmt.length > 0 ? fmt[0].inline || fmt[0].block || 'div' : 'div',
            styles: editor.dom.parseStyle(editor.formatter.getCssText(format))
          });
        } else {
          return Optional.none();
        }
      };
      const updateSelectMenuText = comp => {
        const detectedFormat = findNearest(editor, () => dataset.data);
        const text = detectedFormat.fold(constant$1(fallbackFormat), fmt => fmt.title);
        emitWith(comp, updateMenuText, { text });
      };
      const dataset = buildBasicSettingsDataset(editor, 'block_formats', Delimiter.SemiColon);
      return {
        tooltip: 'Blocks',
        text: Optional.some(fallbackFormat),
        icon: Optional.none(),
        isSelectedFor,
        getCurrentValue: Optional.none,
        getPreviewFor,
        onAction: onActionToggleFormat$1(editor),
        updateText: updateSelectMenuText,
        dataset,
        shouldHide: false,
        isInvalid: item => !editor.formatter.canApply(item.format)
      };
    };
    const createBlocksButton = (editor, backstage) => createSelectButton(editor, backstage, getSpec$3(editor));
    const createBlocksMenu = (editor, backstage) => {
      const menuItems = createMenuItems(editor, backstage, getSpec$3(editor));
      editor.ui.registry.addNestedMenuItem('blocks', {
        text: 'Blocks',
        getSubmenuItems: () => menuItems.items.validateItems(menuItems.getStyleItems())
      });
    };

    const systemStackFonts = [
      '-apple-system',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'sans-serif'
    ];
    const splitFonts = fontFamily => {
      const fonts = fontFamily.split(/\s*,\s*/);
      return map$2(fonts, font => font.replace(/^['"]+|['"]+$/g, ''));
    };
    const isSystemFontStack = fontFamily => {
      const matchesSystemStack = () => {
        const fonts = splitFonts(fontFamily.toLowerCase());
        return forall(systemStackFonts, font => fonts.indexOf(font.toLowerCase()) > -1);
      };
      return fontFamily.indexOf('-apple-system') === 0 && matchesSystemStack();
    };
    const getSpec$2 = editor => {
      const systemFont = 'System Font';
      const getMatchingValue = () => {
        const getFirstFont = fontFamily => fontFamily ? splitFonts(fontFamily)[0] : '';
        const fontFamily = editor.queryCommandValue('FontName');
        const items = dataset.data;
        const font = fontFamily ? fontFamily.toLowerCase() : '';
        const matchOpt = find$5(items, item => {
          const format = item.format;
          return format.toLowerCase() === font || getFirstFont(format).toLowerCase() === getFirstFont(font).toLowerCase();
        }).orThunk(() => {
          return someIf(isSystemFontStack(font), {
            title: systemFont,
            format: font
          });
        });
        return {
          matchOpt,
          font: fontFamily
        };
      };
      const isSelectedFor = item => valueOpt => valueOpt.exists(value => value.format === item);
      const getCurrentValue = () => {
        const {matchOpt} = getMatchingValue();
        return matchOpt;
      };
      const getPreviewFor = item => () => Optional.some({
        tag: 'div',
        styles: item.indexOf('dings') === -1 ? { 'font-family': item } : {}
      });
      const onAction = rawItem => () => {
        editor.undoManager.transact(() => {
          editor.focus();
          editor.execCommand('FontName', false, rawItem.format);
        });
      };
      const updateSelectMenuText = comp => {
        const {matchOpt, font} = getMatchingValue();
        const text = matchOpt.fold(constant$1(font), item => item.title);
        emitWith(comp, updateMenuText, { text });
      };
      const dataset = buildBasicSettingsDataset(editor, 'font_family_formats', Delimiter.SemiColon);
      return {
        tooltip: 'Fonts',
        text: Optional.some(systemFont),
        icon: Optional.none(),
        isSelectedFor,
        getCurrentValue,
        getPreviewFor,
        onAction,
        updateText: updateSelectMenuText,
        dataset,
        shouldHide: false,
        isInvalid: never
      };
    };
    const createFontFamilyButton = (editor, backstage) => createSelectButton(editor, backstage, getSpec$2(editor));
    const createFontFamilyMenu = (editor, backstage) => {
      const menuItems = createMenuItems(editor, backstage, getSpec$2(editor));
      editor.ui.registry.addNestedMenuItem('fontfamily', {
        text: backstage.shared.providers.translate('Fonts'),
        getSubmenuItems: () => menuItems.items.validateItems(menuItems.getStyleItems())
      });
    };

    const legacyFontSizes = {
      '8pt': '1',
      '10pt': '2',
      '12pt': '3',
      '14pt': '4',
      '18pt': '5',
      '24pt': '6',
      '36pt': '7'
    };
    const keywordFontSizes = {
      'xx-small': '7pt',
      'x-small': '8pt',
      'small': '10pt',
      'medium': '12pt',
      'large': '14pt',
      'x-large': '18pt',
      'xx-large': '24pt'
    };
    const round = (number, precision) => {
      const factor = Math.pow(10, precision);
      return Math.round(number * factor) / factor;
    };
    const toPt = (fontSize, precision) => {
      if (/[0-9.]+px$/.test(fontSize)) {
        return round(parseInt(fontSize, 10) * 72 / 96, precision || 0) + 'pt';
      } else {
        return get$g(keywordFontSizes, fontSize).getOr(fontSize);
      }
    };
    const toLegacy = fontSize => get$g(legacyFontSizes, fontSize).getOr('');
    const getSpec$1 = editor => {
      const getMatchingValue = () => {
        let matchOpt = Optional.none();
        const items = dataset.data;
        const fontSize = editor.queryCommandValue('FontSize');
        if (fontSize) {
          for (let precision = 3; matchOpt.isNone() && precision >= 0; precision--) {
            const pt = toPt(fontSize, precision);
            const legacy = toLegacy(pt);
            matchOpt = find$5(items, item => item.format === fontSize || item.format === pt || item.format === legacy);
          }
        }
        return {
          matchOpt,
          size: fontSize
        };
      };
      const isSelectedFor = item => valueOpt => valueOpt.exists(value => value.format === item);
      const getCurrentValue = () => {
        const {matchOpt} = getMatchingValue();
        return matchOpt;
      };
      const getPreviewFor = constant$1(Optional.none);
      const onAction = rawItem => () => {
        editor.undoManager.transact(() => {
          editor.focus();
          editor.execCommand('FontSize', false, rawItem.format);
        });
      };
      const updateSelectMenuText = comp => {
        const {matchOpt, size} = getMatchingValue();
        const text = matchOpt.fold(constant$1(size), match => match.title);
        emitWith(comp, updateMenuText, { text });
      };
      const dataset = buildBasicSettingsDataset(editor, 'font_size_formats', Delimiter.Space);
      return {
        tooltip: 'Font sizes',
        text: Optional.some('12pt'),
        icon: Optional.none(),
        isSelectedFor,
        getPreviewFor,
        getCurrentValue,
        onAction,
        updateText: updateSelectMenuText,
        dataset,
        shouldHide: false,
        isInvalid: never
      };
    };
    const createFontSizeButton = (editor, backstage) => createSelectButton(editor, backstage, getSpec$1(editor));
    const createFontSizeMenu = (editor, backstage) => {
      const menuItems = createMenuItems(editor, backstage, getSpec$1(editor));
      editor.ui.registry.addNestedMenuItem('fontsize', {
        text: 'Font sizes',
        getSubmenuItems: () => menuItems.items.validateItems(menuItems.getStyleItems())
      });
    };

    const getSpec = (editor, dataset) => {
      const fallbackFormat = 'Paragraph';
      const isSelectedFor = format => () => editor.formatter.match(format);
      const getPreviewFor = format => () => {
        const fmt = editor.formatter.get(format);
        return fmt !== undefined ? Optional.some({
          tag: fmt.length > 0 ? fmt[0].inline || fmt[0].block || 'div' : 'div',
          styles: editor.dom.parseStyle(editor.formatter.getCssText(format))
        }) : Optional.none();
      };
      const updateSelectMenuText = comp => {
        const getFormatItems = fmt => {
          if (isNestedFormat(fmt)) {
            return bind$3(fmt.items, getFormatItems);
          } else if (isFormatReference(fmt)) {
            return [{
                title: fmt.title,
                format: fmt.format
              }];
          } else {
            return [];
          }
        };
        const flattenedItems = bind$3(getStyleFormats(editor), getFormatItems);
        const detectedFormat = findNearest(editor, constant$1(flattenedItems));
        const text = detectedFormat.fold(constant$1(fallbackFormat), fmt => fmt.title);
        emitWith(comp, updateMenuText, { text });
      };
      return {
        tooltip: 'Formats',
        text: Optional.some(fallbackFormat),
        icon: Optional.none(),
        isSelectedFor,
        getCurrentValue: Optional.none,
        getPreviewFor,
        onAction: onActionToggleFormat$1(editor),
        updateText: updateSelectMenuText,
        shouldHide: shouldAutoHideStyleFormats(editor),
        isInvalid: item => !editor.formatter.canApply(item.format),
        dataset
      };
    };
    const createStylesButton = (editor, backstage) => {
      const dataset = {
        type: 'advanced',
        ...backstage.styles
      };
      return createSelectButton(editor, backstage, getSpec(editor, dataset));
    };
    const createStylesMenu = (editor, backstage) => {
      const dataset = {
        type: 'advanced',
        ...backstage.styles
      };
      const menuItems = createMenuItems(editor, backstage, getSpec(editor, dataset));
      editor.ui.registry.addNestedMenuItem('styles', {
        text: 'Formats',
        getSubmenuItems: () => menuItems.items.validateItems(menuItems.getStyleItems())
      });
    };

    const events$3 = (reflectingConfig, reflectingState) => {
      const update = (component, data) => {
        reflectingConfig.updateState.each(updateState => {
          const newState = updateState(component, data);
          reflectingState.set(newState);
        });
        reflectingConfig.renderComponents.each(renderComponents => {
          const newComponents = renderComponents(data, reflectingState.get());
          const replacer = reflectingConfig.reuseDom ? withReuse : withoutReuse;
          replacer(component, newComponents);
        });
      };
      return derive$2([
        run$1(receive(), (component, message) => {
          const receivingData = message;
          if (!receivingData.universal) {
            const channel = reflectingConfig.channel;
            if (contains$2(receivingData.channels, channel)) {
              update(component, receivingData.data);
            }
          }
        }),
        runOnAttached((comp, _se) => {
          reflectingConfig.initialData.each(rawData => {
            update(comp, rawData);
          });
        })
      ]);
    };

    var ActiveReflecting = /*#__PURE__*/Object.freeze({
        __proto__: null,
        events: events$3
    });

    const getState = (component, replaceConfig, reflectState) => reflectState;

    var ReflectingApis = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getState: getState
    });

    var ReflectingSchema = [
      required$1('channel'),
      option$3('renderComponents'),
      option$3('updateState'),
      option$3('initialData'),
      defaultedBoolean('reuseDom', true)
    ];

    const init$3 = () => {
      const cell = Cell(Optional.none());
      const clear = () => cell.set(Optional.none());
      const readState = () => cell.get().getOr('none');
      return {
        readState,
        get: cell.get,
        set: cell.set,
        clear
      };
    };

    var ReflectingState = /*#__PURE__*/Object.freeze({
        __proto__: null,
        init: init$3
    });

    const Reflecting = create$3({
      fields: ReflectingSchema,
      name: 'reflecting',
      active: ActiveReflecting,
      apis: ReflectingApis,
      state: ReflectingState
    });

    const schema$7 = constant$1([
      required$1('toggleClass'),
      required$1('fetch'),
      onStrictHandler('onExecute'),
      defaulted('getHotspot', Optional.some),
      defaulted('getAnchorOverrides', constant$1({})),
      schema$y(),
      onStrictHandler('onItemExecute'),
      option$3('lazySink'),
      required$1('dom'),
      onHandler('onOpen'),
      field('splitDropdownBehaviours', [
        Coupling,
        Keying,
        Focusing
      ]),
      defaulted('matchWidth', false),
      defaulted('useMinWidth', false),
      defaulted('eventOrder', {}),
      option$3('role')
    ].concat(sandboxFields()));
    const arrowPart = required({
      factory: Button,
      schema: [required$1('dom')],
      name: 'arrow',
      defaults: () => {
        return { buttonBehaviours: derive$1([Focusing.revoke()]) };
      },
      overrides: detail => {
        return {
          dom: {
            tag: 'span',
            attributes: { role: 'presentation' }
          },
          action: arrow => {
            arrow.getSystem().getByUid(detail.uid).each(emitExecute);
          },
          buttonBehaviours: derive$1([Toggling.config({
              toggleOnExecute: false,
              toggleClass: detail.toggleClass
            })])
        };
      }
    });
    const buttonPart = required({
      factory: Button,
      schema: [required$1('dom')],
      name: 'button',
      defaults: () => {
        return { buttonBehaviours: derive$1([Focusing.revoke()]) };
      },
      overrides: detail => {
        return {
          dom: {
            tag: 'span',
            attributes: { role: 'presentation' }
          },
          action: btn => {
            btn.getSystem().getByUid(detail.uid).each(splitDropdown => {
              detail.onExecute(splitDropdown, btn);
            });
          }
        };
      }
    });
    const parts$3 = constant$1([
      arrowPart,
      buttonPart,
      optional({
        factory: {
          sketch: spec => {
            return {
              uid: spec.uid,
              dom: {
                tag: 'span',
                styles: { display: 'none' },
                attributes: { 'aria-hidden': 'true' },
                innerHtml: spec.text
              }
            };
          }
        },
        schema: [required$1('text')],
        name: 'aria-descriptor'
      }),
      external({
        schema: [tieredMenuMarkers()],
        name: 'menu',
        defaults: detail => {
          return {
            onExecute: (tmenu, item) => {
              tmenu.getSystem().getByUid(detail.uid).each(splitDropdown => {
                detail.onItemExecute(splitDropdown, tmenu, item);
              });
            }
          };
        }
      }),
      partType$1()
    ]);

    const factory$5 = (detail, components, spec, externals) => {
      const switchToMenu = sandbox => {
        Composing.getCurrent(sandbox).each(current => {
          Highlighting.highlightFirst(current);
          Keying.focusIn(current);
        });
      };
      const action = component => {
        const onOpenSync = switchToMenu;
        togglePopup(detail, identity, component, externals, onOpenSync, HighlightOnOpen.HighlightMenuAndItem).get(noop);
      };
      const openMenu = comp => {
        action(comp);
        return Optional.some(true);
      };
      const executeOnButton = comp => {
        const button = getPartOrDie(comp, detail, 'button');
        emitExecute(button);
        return Optional.some(true);
      };
      const buttonEvents = {
        ...derive$2([runOnAttached((component, _simulatedEvent) => {
            const ariaDescriptor = getPart(component, detail, 'aria-descriptor');
            ariaDescriptor.each(descriptor => {
              const descriptorId = generate$6('aria');
              set$9(descriptor.element, 'id', descriptorId);
              set$9(component.element, 'aria-describedby', descriptorId);
            });
          })]),
        ...events$a(Optional.some(action))
      };
      const apis = {
        repositionMenus: comp => {
          if (Toggling.isOn(comp)) {
            repositionMenus(comp);
          }
        }
      };
      return {
        uid: detail.uid,
        dom: detail.dom,
        components,
        apis,
        eventOrder: {
          ...detail.eventOrder,
          [execute$5()]: [
            'disabling',
            'toggling',
            'alloy.base.behaviour'
          ]
        },
        events: buttonEvents,
        behaviours: augment(detail.splitDropdownBehaviours, [
          Coupling.config({
            others: {
              sandbox: hotspot => {
                const arrow = getPartOrDie(hotspot, detail, 'arrow');
                const extras = {
                  onOpen: () => {
                    Toggling.on(arrow);
                    Toggling.on(hotspot);
                  },
                  onClose: () => {
                    Toggling.off(arrow);
                    Toggling.off(hotspot);
                  }
                };
                return makeSandbox$1(detail, hotspot, extras);
              }
            }
          }),
          Keying.config({
            mode: 'special',
            onSpace: executeOnButton,
            onEnter: executeOnButton,
            onDown: openMenu
          }),
          Focusing.config({}),
          Toggling.config({
            toggleOnExecute: false,
            aria: { mode: 'expanded' }
          })
        ]),
        domModification: {
          attributes: {
            'role': detail.role.getOr('button'),
            'aria-haspopup': true
          }
        }
      };
    };
    const SplitDropdown = composite({
      name: 'SplitDropdown',
      configFields: schema$7(),
      partFields: parts$3(),
      factory: factory$5,
      apis: { repositionMenus: (apis, comp) => apis.repositionMenus(comp) }
    });

    const getButtonApi = component => ({
      isEnabled: () => !Disabling.isDisabled(component),
      setEnabled: state => Disabling.set(component, !state)
    });
    const getToggleApi = component => ({
      setActive: state => {
        Toggling.set(component, state);
      },
      isActive: () => Toggling.isOn(component),
      isEnabled: () => !Disabling.isDisabled(component),
      setEnabled: state => Disabling.set(component, !state)
    });
    const getTooltipAttributes = (tooltip, providersBackstage) => tooltip.map(tooltip => ({
      'aria-label': providersBackstage.translate(tooltip),
      'title': providersBackstage.translate(tooltip)
    })).getOr({});
    const focusButtonEvent = generate$6('focus-button');
    const renderCommonStructure = (icon, text, tooltip, receiver, behaviours, providersBackstage) => {
      return {
        dom: {
          tag: 'button',
          classes: ['tox-tbtn'].concat(text.isSome() ? ['tox-tbtn--select'] : []),
          attributes: getTooltipAttributes(tooltip, providersBackstage)
        },
        components: componentRenderPipeline([
          icon.map(iconName => renderIconFromPack(iconName, providersBackstage.icons)),
          text.map(text => renderLabel(text, 'tox-tbtn', providersBackstage))
        ]),
        eventOrder: {
          [mousedown()]: [
            'focusing',
            'alloy.base.behaviour',
            'common-button-display-events'
          ]
        },
        buttonBehaviours: derive$1([
          DisablingConfigs.toolbarButton(providersBackstage.isDisabled),
          receivingConfig(),
          config('common-button-display-events', [run$1(mousedown(), (button, se) => {
              se.event.prevent();
              emit(button, focusButtonEvent);
            })])
        ].concat(receiver.map(r => Reflecting.config({
          channel: r,
          initialData: {
            icon,
            text
          },
          renderComponents: (data, _state) => componentRenderPipeline([
            data.icon.map(iconName => renderIconFromPack(iconName, providersBackstage.icons)),
            data.text.map(text => renderLabel(text, 'tox-tbtn', providersBackstage))
          ])
        })).toArray()).concat(behaviours.getOr([])))
      };
    };
    const renderFloatingToolbarButton = (spec, backstage, identifyButtons, attributes) => {
      const sharedBackstage = backstage.shared;
      return FloatingToolbarButton.sketch({
        lazySink: sharedBackstage.getSink,
        fetch: () => Future.nu(resolve => {
          resolve(map$2(identifyButtons(spec.items), renderToolbarGroup));
        }),
        markers: { toggledClass: 'tox-tbtn--enabled' },
        parts: {
          button: renderCommonStructure(spec.icon, spec.text, spec.tooltip, Optional.none(), Optional.none(), sharedBackstage.providers),
          toolbar: {
            dom: {
              tag: 'div',
              classes: ['tox-toolbar__overflow'],
              attributes
            }
          }
        }
      });
    };
    const renderCommonToolbarButton = (spec, specialisation, providersBackstage) => {
      const editorOffCell = Cell(noop);
      const structure = renderCommonStructure(spec.icon, spec.text, spec.tooltip, Optional.none(), Optional.none(), providersBackstage);
      return Button.sketch({
        dom: structure.dom,
        components: structure.components,
        eventOrder: toolbarButtonEventOrder,
        buttonBehaviours: derive$1([
          config('toolbar-button-events', [
            onToolbarButtonExecute({
              onAction: spec.onAction,
              getApi: specialisation.getApi
            }),
            onControlAttached(specialisation, editorOffCell),
            onControlDetached(specialisation, editorOffCell)
          ]),
          DisablingConfigs.toolbarButton(() => !spec.enabled || providersBackstage.isDisabled()),
          receivingConfig()
        ].concat(specialisation.toolbarButtonBehaviours))
      });
    };
    const renderToolbarButton = (spec, providersBackstage) => renderToolbarButtonWith(spec, providersBackstage, []);
    const renderToolbarButtonWith = (spec, providersBackstage, bonusEvents) => renderCommonToolbarButton(spec, {
      toolbarButtonBehaviours: bonusEvents.length > 0 ? [config('toolbarButtonWith', bonusEvents)] : [],
      getApi: getButtonApi,
      onSetup: spec.onSetup
    }, providersBackstage);
    const renderToolbarToggleButton = (spec, providersBackstage) => renderToolbarToggleButtonWith(spec, providersBackstage, []);
    const renderToolbarToggleButtonWith = (spec, providersBackstage, bonusEvents) => renderCommonToolbarButton(spec, {
      toolbarButtonBehaviours: [
        Replacing.config({}),
        Toggling.config({
          toggleClass: 'tox-tbtn--enabled',
          aria: { mode: 'pressed' },
          toggleOnExecute: false
        })
      ].concat(bonusEvents.length > 0 ? [config('toolbarToggleButtonWith', bonusEvents)] : []),
      getApi: getToggleApi,
      onSetup: spec.onSetup
    }, providersBackstage);
    const fetchChoices = (getApi, spec, providersBackstage) => comp => Future.nu(callback => spec.fetch(callback)).map(items => Optional.from(createTieredDataFrom(deepMerge(createPartialChoiceMenu(generate$6('menu-value'), items, value => {
      spec.onItemAction(getApi(comp), value);
    }, spec.columns, spec.presets, ItemResponse$1.CLOSE_ON_EXECUTE, spec.select.getOr(never), providersBackstage), {
      movement: deriveMenuMovement(spec.columns, spec.presets),
      menuBehaviours: SimpleBehaviours.unnamedEvents(spec.columns !== 'auto' ? [] : [runOnAttached((comp, _se) => {
          detectSize(comp, 4, classForPreset(spec.presets)).each(({numRows, numColumns}) => {
            Keying.setGridSize(comp, numRows, numColumns);
          });
        })])
    }))));
    const renderSplitButton = (spec, sharedBackstage) => {
      const displayChannel = generate$6('channel-update-split-dropdown-display');
      const getApi = comp => ({
        isEnabled: () => !Disabling.isDisabled(comp),
        setEnabled: state => Disabling.set(comp, !state),
        setIconFill: (id, value) => {
          descendant(comp.element, 'svg path[id="' + id + '"], rect[id="' + id + '"]').each(underlinePath => {
            set$9(underlinePath, 'fill', value);
          });
        },
        setActive: state => {
          set$9(comp.element, 'aria-pressed', state);
          descendant(comp.element, 'span').each(button => {
            comp.getSystem().getByDom(button).each(buttonComp => Toggling.set(buttonComp, state));
          });
        },
        isActive: () => descendant(comp.element, 'span').exists(button => comp.getSystem().getByDom(button).exists(Toggling.isOn))
      });
      const editorOffCell = Cell(noop);
      const specialisation = {
        getApi,
        onSetup: spec.onSetup
      };
      return SplitDropdown.sketch({
        dom: {
          tag: 'div',
          classes: ['tox-split-button'],
          attributes: {
            'aria-pressed': false,
            ...getTooltipAttributes(spec.tooltip, sharedBackstage.providers)
          }
        },
        onExecute: button => {
          spec.onAction(getApi(button));
        },
        onItemExecute: (_a, _b, _c) => {
        },
        splitDropdownBehaviours: derive$1([
          DisablingConfigs.splitButton(sharedBackstage.providers.isDisabled),
          receivingConfig(),
          config('split-dropdown-events', [
            run$1(focusButtonEvent, Focusing.focus),
            onControlAttached(specialisation, editorOffCell),
            onControlDetached(specialisation, editorOffCell)
          ]),
          Unselecting.config({})
        ]),
        eventOrder: {
          [attachedToDom()]: [
            'alloy.base.behaviour',
            'split-dropdown-events'
          ]
        },
        toggleClass: 'tox-tbtn--enabled',
        lazySink: sharedBackstage.getSink,
        fetch: fetchChoices(getApi, spec, sharedBackstage.providers),
        parts: { menu: part(false, spec.columns, spec.presets) },
        components: [
          SplitDropdown.parts.button(renderCommonStructure(spec.icon, spec.text, Optional.none(), Optional.some(displayChannel), Optional.some([Toggling.config({
              toggleClass: 'tox-tbtn--enabled',
              toggleOnExecute: false
            })]), sharedBackstage.providers)),
          SplitDropdown.parts.arrow({
            dom: {
              tag: 'button',
              classes: [
                'tox-tbtn',
                'tox-split-button__chevron'
              ],
              innerHtml: get$2('chevron-down', sharedBackstage.providers.icons)
            },
            buttonBehaviours: derive$1([
              DisablingConfigs.splitButton(sharedBackstage.providers.isDisabled),
              receivingConfig(),
              addFocusableBehaviour()
            ])
          }),
          SplitDropdown.parts['aria-descriptor']({ text: sharedBackstage.providers.translate('To open the popup, press Shift+Enter') })
        ]
      });
    };

    const defaultToolbar = [
      {
        name: 'history',
        items: [
          'undo',
          'redo'
        ]
      },
      {
        name: 'styles',
        items: ['styles']
      },
      {
        name: 'formatting',
        items: [
          'bold',
          'italic'
        ]
      },
      {
        name: 'alignment',
        items: [
          'alignleft',
          'aligncenter',
          'alignright',
          'alignjustify'
        ]
      },
      {
        name: 'indentation',
        items: [
          'outdent',
          'indent'
        ]
      },
      {
        name: 'permanent pen',
        items: ['permanentpen']
      },
      {
        name: 'comments',
        items: ['addcomment']
      }
    ];
    const renderFromBridge = (bridgeBuilder, render) => (spec, backstage, editor) => {
      const internal = bridgeBuilder(spec).mapError(errInfo => formatError(errInfo)).getOrDie();
      return render(internal, backstage, editor);
    };
    const types = {
      button: renderFromBridge(createToolbarButton, (s, backstage) => renderToolbarButton(s, backstage.shared.providers)),
      togglebutton: renderFromBridge(createToggleButton, (s, backstage) => renderToolbarToggleButton(s, backstage.shared.providers)),
      menubutton: renderFromBridge(createMenuButton, (s, backstage) => renderMenuButton(s, 'tox-tbtn', backstage, Optional.none())),
      splitbutton: renderFromBridge(createSplitButton, (s, backstage) => renderSplitButton(s, backstage.shared)),
      grouptoolbarbutton: renderFromBridge(createGroupToolbarButton, (s, backstage, editor) => {
        const buttons = editor.ui.registry.getAll().buttons;
        const identify = toolbar => identifyButtons(editor, {
          buttons,
          toolbar,
          allowToolbarGroups: false
        }, backstage, Optional.none());
        const attributes = { [Attribute]: backstage.shared.header.isPositionedAtTop() ? AttributeValue.TopToBottom : AttributeValue.BottomToTop };
        switch (getToolbarMode(editor)) {
        case ToolbarMode$1.floating:
          return renderFloatingToolbarButton(s, backstage, identify, attributes);
        default:
          throw new Error('Toolbar groups are only supported when using floating toolbar mode');
        }
      })
    };
    const extractFrom = (spec, backstage, editor) => get$g(types, spec.type).fold(() => {
      console.error('skipping button defined by', spec);
      return Optional.none();
    }, render => Optional.some(render(spec, backstage, editor)));
    const bespokeButtons = {
      styles: createStylesButton,
      fontsize: createFontSizeButton,
      fontfamily: createFontFamilyButton,
      blocks: createBlocksButton,
      align: createAlignButton
    };
    const removeUnusedDefaults = buttons => {
      const filteredItemGroups = map$2(defaultToolbar, group => {
        const items = filter$2(group.items, subItem => has$2(buttons, subItem) || has$2(bespokeButtons, subItem));
        return {
          name: group.name,
          items
        };
      });
      return filter$2(filteredItemGroups, group => group.items.length > 0);
    };
    const convertStringToolbar = strToolbar => {
      const groupsStrings = strToolbar.split('|');
      return map$2(groupsStrings, g => ({ items: g.trim().split(' ') }));
    };
    const isToolbarGroupSettingArray = toolbar => isArrayOf(toolbar, t => has$2(t, 'name') && has$2(t, 'items'));
    const createToolbar = toolbarConfig => {
      const toolbar = toolbarConfig.toolbar;
      const buttons = toolbarConfig.buttons;
      if (toolbar === false) {
        return [];
      } else if (toolbar === undefined || toolbar === true) {
        return removeUnusedDefaults(buttons);
      } else if (isString(toolbar)) {
        return convertStringToolbar(toolbar);
      } else if (isToolbarGroupSettingArray(toolbar)) {
        return toolbar;
      } else {
        console.error('Toolbar type should be string, string[], boolean or ToolbarGroup[]');
        return [];
      }
    };
    const lookupButton = (editor, buttons, toolbarItem, allowToolbarGroups, backstage, prefixes) => get$g(buttons, toolbarItem.toLowerCase()).orThunk(() => prefixes.bind(ps => findMap(ps, prefix => get$g(buttons, prefix + toolbarItem.toLowerCase())))).fold(() => get$g(bespokeButtons, toolbarItem.toLowerCase()).map(r => r(editor, backstage)), spec => {
      if (spec.type === 'grouptoolbarbutton' && !allowToolbarGroups) {
        console.warn(`Ignoring the '${ toolbarItem }' toolbar button. Group toolbar buttons are only supported when using floating toolbar mode and cannot be nested.`);
        return Optional.none();
      } else {
        return extractFrom(spec, backstage, editor);
      }
    });
    const identifyButtons = (editor, toolbarConfig, backstage, prefixes) => {
      const toolbarGroups = createToolbar(toolbarConfig);
      const groups = map$2(toolbarGroups, group => {
        const items = bind$3(group.items, toolbarItem => {
          return toolbarItem.trim().length === 0 ? [] : lookupButton(editor, toolbarConfig.buttons, toolbarItem, toolbarConfig.allowToolbarGroups, backstage, prefixes).toArray();
        });
        return {
          title: Optional.from(editor.translate(group.name)),
          items
        };
      });
      return filter$2(groups, group => group.items.length > 0);
    };

    const setToolbar = (editor, uiComponents, rawUiConfig, backstage) => {
      const comp = uiComponents.outerContainer;
      const toolbarConfig = rawUiConfig.toolbar;
      const toolbarButtonsConfig = rawUiConfig.buttons;
      if (isArrayOf(toolbarConfig, isString)) {
        const toolbars = toolbarConfig.map(t => {
          const config = {
            toolbar: t,
            buttons: toolbarButtonsConfig,
            allowToolbarGroups: rawUiConfig.allowToolbarGroups
          };
          return identifyButtons(editor, config, backstage, Optional.none());
        });
        OuterContainer.setToolbars(comp, toolbars);
      } else {
        OuterContainer.setToolbar(comp, identifyButtons(editor, rawUiConfig, backstage, Optional.none()));
      }
    };

    const detection = detect$1();
    const isiOS12 = detection.os.isiOS() && detection.os.version.major <= 12;
    const setupEvents$1 = (editor, uiComponents) => {
      const dom = editor.dom;
      let contentWindow = editor.getWin();
      const initialDocEle = editor.getDoc().documentElement;
      const lastWindowDimensions = Cell(SugarPosition(contentWindow.innerWidth, contentWindow.innerHeight));
      const lastDocumentDimensions = Cell(SugarPosition(initialDocEle.offsetWidth, initialDocEle.offsetHeight));
      const resizeWindow = () => {
        const outer = lastWindowDimensions.get();
        if (outer.left !== contentWindow.innerWidth || outer.top !== contentWindow.innerHeight) {
          lastWindowDimensions.set(SugarPosition(contentWindow.innerWidth, contentWindow.innerHeight));
          fireResizeContent(editor);
        }
      };
      const resizeDocument = () => {
        const docEle = editor.getDoc().documentElement;
        const inner = lastDocumentDimensions.get();
        if (inner.left !== docEle.offsetWidth || inner.top !== docEle.offsetHeight) {
          lastDocumentDimensions.set(SugarPosition(docEle.offsetWidth, docEle.offsetHeight));
          fireResizeContent(editor);
        }
      };
      const scroll = e => {
        fireScrollContent(editor, e);
      };
      dom.bind(contentWindow, 'resize', resizeWindow);
      dom.bind(contentWindow, 'scroll', scroll);
      const elementLoad = capture(SugarElement.fromDom(editor.getBody()), 'load', resizeDocument);
      const mothership = uiComponents.uiMothership.element;
      editor.on('hide', () => {
        set$8(mothership, 'display', 'none');
      });
      editor.on('show', () => {
        remove$6(mothership, 'display');
      });
      editor.on('NodeChange', resizeDocument);
      editor.on('remove', () => {
        elementLoad.unbind();
        dom.unbind(contentWindow, 'resize', resizeWindow);
        dom.unbind(contentWindow, 'scroll', scroll);
        contentWindow = null;
      });
    };
    const render$1 = (editor, uiComponents, rawUiConfig, backstage, args) => {
      const lastToolbarWidth = Cell(0);
      const outerContainer = uiComponents.outerContainer;
      iframe(editor);
      const eTargetNode = SugarElement.fromDom(args.targetNode);
      const uiRoot = getContentContainer(getRootNode(eTargetNode));
      attachSystemAfter(eTargetNode, uiComponents.mothership);
      attachSystem(uiRoot, uiComponents.uiMothership);
      editor.on('PostRender', () => {
        OuterContainer.setSidebar(outerContainer, rawUiConfig.sidebar, getSidebarShow(editor));
        setToolbar(editor, uiComponents, rawUiConfig, backstage);
        lastToolbarWidth.set(editor.getWin().innerWidth);
        OuterContainer.setMenubar(outerContainer, identifyMenus(editor, rawUiConfig));
        setupEvents$1(editor, uiComponents);
      });
      const socket = OuterContainer.getSocket(outerContainer).getOrDie('Could not find expected socket element');
      if (isiOS12) {
        setAll(socket.element, {
          'overflow': 'scroll',
          '-webkit-overflow-scrolling': 'touch'
        });
        const limit = first(() => {
          editor.dispatch('ScrollContent');
        }, 20);
        const unbinder = bind(socket.element, 'scroll', limit.throttle);
        editor.on('remove', unbinder.unbind);
      }
      setupReadonlyModeSwitch(editor, uiComponents);
      editor.addCommand('ToggleSidebar', (_ui, value) => {
        OuterContainer.toggleSidebar(outerContainer, value);
        editor.dispatch('ToggleSidebar');
      });
      editor.addQueryValueHandler('ToggleSidebar', () => {
        var _a;
        return (_a = OuterContainer.whichSidebar(outerContainer)) !== null && _a !== void 0 ? _a : '';
      });
      const toolbarMode = getToolbarMode(editor);
      const refreshDrawer = () => {
        OuterContainer.refreshToolbar(uiComponents.outerContainer);
      };
      if (toolbarMode === ToolbarMode$1.sliding || toolbarMode === ToolbarMode$1.floating) {
        editor.on('ResizeWindow ResizeEditor ResizeContent', () => {
          const width = editor.getWin().innerWidth;
          if (width !== lastToolbarWidth.get()) {
            refreshDrawer();
            lastToolbarWidth.set(width);
          }
        });
      }
      const api = {
        setEnabled: state => {
          broadcastReadonly(uiComponents, !state);
        },
        isEnabled: () => !Disabling.isDisabled(outerContainer)
      };
      return {
        iframeContainer: socket.element.dom,
        editorContainer: outerContainer.element.dom,
        api
      };
    };

    var Iframe = /*#__PURE__*/Object.freeze({
        __proto__: null,
        render: render$1
    });

    const parseToInt = val => {
      const re = /^[0-9\.]+(|px)$/i;
      if (re.test('' + val)) {
        return Optional.some(parseInt('' + val, 10));
      }
      return Optional.none();
    };
    const numToPx = val => isNumber(val) ? val + 'px' : val;
    const calcCappedSize = (size, minSize, maxSize) => {
      const minOverride = minSize.filter(min => size < min);
      const maxOverride = maxSize.filter(max => size > max);
      return minOverride.or(maxOverride).getOr(size);
    };

    const getHeight = editor => {
      const baseHeight = getHeightOption(editor);
      const minHeight = getMinHeightOption(editor);
      const maxHeight = getMaxHeightOption(editor);
      return parseToInt(baseHeight).map(height => calcCappedSize(height, minHeight, maxHeight));
    };
    const getHeightWithFallback = editor => {
      const height = getHeight(editor);
      return height.getOr(getHeightOption(editor));
    };
    const getWidth = editor => {
      const baseWidth = getWidthOption(editor);
      const minWidth = getMinWidthOption(editor);
      const maxWidth = getMaxWidthOption(editor);
      return parseToInt(baseWidth).map(width => calcCappedSize(width, minWidth, maxWidth));
    };
    const getWidthWithFallback = editor => {
      const width = getWidth(editor);
      return width.getOr(getWidthOption(editor));
    };

    const {ToolbarLocation, ToolbarMode} = Options;
    const InlineHeader = (editor, targetElm, uiComponents, backstage, floatContainer) => {
      const {uiMothership, outerContainer} = uiComponents;
      const DOM = global$7.DOM;
      const useFixedToolbarContainer = useFixedContainer(editor);
      const isSticky = isStickyToolbar(editor);
      const editorMaxWidthOpt = getMaxWidthOption(editor).or(getWidth(editor));
      const headerBackstage = backstage.shared.header;
      const isPositionedAtTop = headerBackstage.isPositionedAtTop;
      const toolbarMode = getToolbarMode(editor);
      const isSplitToolbar = toolbarMode === ToolbarMode.sliding || toolbarMode === ToolbarMode.floating;
      const visible = Cell(false);
      const isVisible = () => visible.get() && !editor.removed;
      const calcToolbarOffset = toolbar => isSplitToolbar ? toolbar.fold(constant$1(0), tbar => tbar.components().length > 1 ? get$d(tbar.components()[1].element) : 0) : 0;
      const calcMode = container => {
        switch (getToolbarLocation(editor)) {
        case ToolbarLocation.auto:
          const toolbar = OuterContainer.getToolbar(outerContainer);
          const offset = calcToolbarOffset(toolbar);
          const toolbarHeight = get$d(container.element) - offset;
          const targetBounds = box$1(targetElm);
          const roomAtTop = targetBounds.y > toolbarHeight;
          if (roomAtTop) {
            return 'top';
          } else {
            const doc = documentElement(targetElm);
            const docHeight = Math.max(doc.dom.scrollHeight, get$d(doc));
            const roomAtBottom = targetBounds.bottom < docHeight - toolbarHeight;
            if (roomAtBottom) {
              return 'bottom';
            } else {
              const winBounds = win();
              const isRoomAtBottomViewport = winBounds.bottom < targetBounds.bottom - toolbarHeight;
              return isRoomAtBottomViewport ? 'bottom' : 'top';
            }
          }
        case ToolbarLocation.bottom:
          return 'bottom';
        case ToolbarLocation.top:
        default:
          return 'top';
        }
      };
      const setupMode = mode => {
        floatContainer.on(container => {
          Docking.setModes(container, [mode]);
          headerBackstage.setDockingMode(mode);
          const verticalDir = isPositionedAtTop() ? AttributeValue.TopToBottom : AttributeValue.BottomToTop;
          set$9(container.element, Attribute, verticalDir);
        });
      };
      const updateChromeWidth = () => {
        floatContainer.on(container => {
          const maxWidth = editorMaxWidthOpt.getOrThunk(() => {
            const bodyMargin = parseToInt(get$e(body(), 'margin-left')).getOr(0);
            return get$c(body()) - absolute$3(targetElm).left + bodyMargin;
          });
          set$8(container.element, 'max-width', maxWidth + 'px');
        });
      };
      const updateChromePosition = () => {
        floatContainer.on(container => {
          const toolbar = OuterContainer.getToolbar(outerContainer);
          const offset = calcToolbarOffset(toolbar);
          const targetBounds = box$1(targetElm);
          const top = isPositionedAtTop() ? Math.max(targetBounds.y - get$d(container.element) + offset, 0) : targetBounds.bottom;
          setAll(outerContainer.element, {
            position: 'absolute',
            top: Math.round(top) + 'px',
            left: Math.round(targetBounds.x) + 'px'
          });
        });
      };
      const repositionPopups$1 = () => {
        uiMothership.broadcastOn([repositionPopups()], {});
      };
      const updateChromeUi = (resetDocking = false) => {
        if (!isVisible()) {
          return;
        }
        if (!useFixedToolbarContainer) {
          updateChromeWidth();
        }
        if (isSplitToolbar) {
          OuterContainer.refreshToolbar(outerContainer);
        }
        if (!useFixedToolbarContainer) {
          updateChromePosition();
        }
        if (isSticky) {
          const action = resetDocking ? Docking.reset : Docking.refresh;
          floatContainer.on(action);
        }
        repositionPopups$1();
      };
      const updateMode = (updateUi = true) => {
        if (useFixedToolbarContainer || !isSticky || !isVisible()) {
          return;
        }
        floatContainer.on(container => {
          const currentMode = headerBackstage.getDockingMode();
          const newMode = calcMode(container);
          if (newMode !== currentMode) {
            setupMode(newMode);
            if (updateUi) {
              updateChromeUi(true);
            }
          }
        });
      };
      const show = () => {
        visible.set(true);
        set$8(outerContainer.element, 'display', 'flex');
        DOM.addClass(editor.getBody(), 'mce-edit-focus');
        remove$6(uiMothership.element, 'display');
        updateMode(false);
        updateChromeUi();
      };
      const hide = () => {
        visible.set(false);
        if (uiComponents.outerContainer) {
          set$8(outerContainer.element, 'display', 'none');
          DOM.removeClass(editor.getBody(), 'mce-edit-focus');
        }
        set$8(uiMothership.element, 'display', 'none');
      };
      return {
        isVisible,
        isPositionedAtTop,
        show,
        hide,
        update: updateChromeUi,
        updateMode,
        repositionPopups: repositionPopups$1
      };
    };

    const getTargetPosAndBounds = (targetElm, isToolbarTop) => {
      const bounds = box$1(targetElm);
      return {
        pos: isToolbarTop ? bounds.y : bounds.bottom,
        bounds
      };
    };
    const setupEvents = (editor, targetElm, ui, toolbarPersist) => {
      const prevPosAndBounds = Cell(getTargetPosAndBounds(targetElm, ui.isPositionedAtTop()));
      const resizeContent = e => {
        const {pos, bounds} = getTargetPosAndBounds(targetElm, ui.isPositionedAtTop());
        const {
          pos: prevPos,
          bounds: prevBounds
        } = prevPosAndBounds.get();
        const hasResized = bounds.height !== prevBounds.height || bounds.width !== prevBounds.width;
        prevPosAndBounds.set({
          pos,
          bounds
        });
        if (hasResized) {
          fireResizeContent(editor, e);
        }
        if (ui.isVisible()) {
          if (prevPos !== pos) {
            ui.update(true);
          } else if (hasResized) {
            ui.updateMode();
            ui.repositionPopups();
          }
        }
      };
      if (!toolbarPersist) {
        editor.on('activate', ui.show);
        editor.on('deactivate', ui.hide);
      }
      editor.on('SkinLoaded ResizeWindow', () => ui.update(true));
      editor.on('NodeChange keydown', e => {
        requestAnimationFrame(() => resizeContent(e));
      });
      editor.on('ScrollWindow', () => ui.updateMode());
      const elementLoad = unbindable();
      elementLoad.set(capture(SugarElement.fromDom(editor.getBody()), 'load', e => resizeContent(e.raw)));
      editor.on('remove', () => {
        elementLoad.clear();
      });
    };
    const render = (editor, uiComponents, rawUiConfig, backstage, args) => {
      const {mothership, uiMothership, outerContainer} = uiComponents;
      const floatContainer = value$2();
      const targetElm = SugarElement.fromDom(args.targetNode);
      const ui = InlineHeader(editor, targetElm, uiComponents, backstage, floatContainer);
      const toolbarPersist = isToolbarPersist(editor);
      inline(editor);
      const render = () => {
        if (floatContainer.isSet()) {
          ui.show();
          return;
        }
        floatContainer.set(OuterContainer.getHeader(outerContainer).getOrDie());
        const uiContainer = getUiContainer(editor);
        attachSystem(uiContainer, mothership);
        attachSystem(uiContainer, uiMothership);
        setToolbar(editor, uiComponents, rawUiConfig, backstage);
        OuterContainer.setMenubar(outerContainer, identifyMenus(editor, rawUiConfig));
        ui.show();
        setupEvents(editor, targetElm, ui, toolbarPersist);
        editor.nodeChanged();
      };
      editor.on('show', render);
      editor.on('hide', ui.hide);
      if (!toolbarPersist) {
        editor.on('focus', render);
        editor.on('blur', ui.hide);
      }
      editor.on('init', () => {
        if (editor.hasFocus() || toolbarPersist) {
          render();
        }
      });
      setupReadonlyModeSwitch(editor, uiComponents);
      const api = {
        show: render,
        hide: ui.hide,
        setEnabled: state => {
          broadcastReadonly(uiComponents, !state);
        },
        isEnabled: () => !Disabling.isDisabled(outerContainer)
      };
      return {
        editorContainer: outerContainer.element.dom,
        api
      };
    };

    var Inline = /*#__PURE__*/Object.freeze({
        __proto__: null,
        render: render
    });

    const showContextToolbarEvent = 'contexttoolbar-show';
    const hideContextToolbarEvent = 'contexttoolbar-hide';

    const getFormApi = input => ({
      hide: () => emit(input, sandboxClose()),
      getValue: () => Representing.getValue(input)
    });
    const runOnExecute = (memInput, original) => run$1(internalToolbarButtonExecute, (comp, se) => {
      const input = memInput.get(comp);
      const formApi = getFormApi(input);
      original.onAction(formApi, se.event.buttonApi);
    });
    const renderContextButton = (memInput, button, providers) => {
      const {primary, ...rest} = button.original;
      const bridged = getOrDie(createToolbarButton({
        ...rest,
        type: 'button',
        onAction: noop
      }));
      return renderToolbarButtonWith(bridged, providers, [runOnExecute(memInput, button)]);
    };
    const renderContextToggleButton = (memInput, button, providers) => {
      const {primary, ...rest} = button.original;
      const bridged = getOrDie(createToggleButton({
        ...rest,
        type: 'togglebutton',
        onAction: noop
      }));
      return renderToolbarToggleButtonWith(bridged, providers, [runOnExecute(memInput, button)]);
    };
    const isToggleButton = button => button.type === 'contextformtogglebutton';
    const generateOne = (memInput, button, providersBackstage) => {
      if (isToggleButton(button)) {
        return renderContextToggleButton(memInput, button, providersBackstage);
      } else {
        return renderContextButton(memInput, button, providersBackstage);
      }
    };
    const generate = (memInput, buttons, providersBackstage) => {
      const mementos = map$2(buttons, button => record(generateOne(memInput, button, providersBackstage)));
      const asSpecs = () => map$2(mementos, mem => mem.asSpec());
      const findPrimary = compInSystem => findMap(buttons, (button, i) => {
        if (button.primary) {
          return Optional.from(mementos[i]).bind(mem => mem.getOpt(compInSystem)).filter(not(Disabling.isDisabled));
        } else {
          return Optional.none();
        }
      });
      return {
        asSpecs,
        findPrimary
      };
    };

    const buildInitGroups = (ctx, providers) => {
      const inputAttributes = ctx.label.fold(() => ({}), label => ({ 'aria-label': label }));
      const memInput = record(Input.sketch({
        inputClasses: [
          'tox-toolbar-textfield',
          'tox-toolbar-nav-js'
        ],
        data: ctx.initValue(),
        inputAttributes,
        selectOnFocus: true,
        inputBehaviours: derive$1([Keying.config({
            mode: 'special',
            onEnter: input => commands.findPrimary(input).map(primary => {
              emitExecute(primary);
              return true;
            }),
            onLeft: (comp, se) => {
              se.cut();
              return Optional.none();
            },
            onRight: (comp, se) => {
              se.cut();
              return Optional.none();
            }
          })])
      }));
      const commands = generate(memInput, ctx.commands, providers);
      return [
        {
          title: Optional.none(),
          items: [memInput.asSpec()]
        },
        {
          title: Optional.none(),
          items: commands.asSpecs()
        }
      ];
    };
    const renderContextForm = (toolbarType, ctx, providers) => renderToolbar({
      type: toolbarType,
      uid: generate$6('context-toolbar'),
      initGroups: buildInitGroups(ctx, providers),
      onEscape: Optional.none,
      cyclicKeying: true,
      providers
    });
    const ContextForm = {
      renderContextForm,
      buildInitGroups
    };

    const isVerticalOverlap = (a, b, threshold = 0.01) => b.bottom - a.y >= threshold && a.bottom - b.y >= threshold;
    const getRangeRect = rng => {
      const rect = rng.getBoundingClientRect();
      if (rect.height <= 0 && rect.width <= 0) {
        const leaf$1 = leaf(SugarElement.fromDom(rng.startContainer), rng.startOffset).element;
        const elm = isText(leaf$1) ? parent(leaf$1) : Optional.some(leaf$1);
        return elm.filter(isElement$1).map(e => e.dom.getBoundingClientRect()).getOr(rect);
      } else {
        return rect;
      }
    };
    const getSelectionBounds = editor => {
      const rng = editor.selection.getRng();
      const rect = getRangeRect(rng);
      if (editor.inline) {
        const scroll = get$b();
        return bounds(scroll.left + rect.left, scroll.top + rect.top, rect.width, rect.height);
      } else {
        const bodyPos = absolute$2(SugarElement.fromDom(editor.getBody()));
        return bounds(bodyPos.x + rect.left, bodyPos.y + rect.top, rect.width, rect.height);
      }
    };
    const getAnchorElementBounds = (editor, lastElement) => lastElement.filter(elem => inBody(elem) && isHTMLElement(elem)).map(absolute$2).getOrThunk(() => getSelectionBounds(editor));
    const getHorizontalBounds = (contentAreaBox, viewportBounds, margin) => {
      const x = Math.max(contentAreaBox.x + margin, viewportBounds.x);
      const right = Math.min(contentAreaBox.right - margin, viewportBounds.right);
      return {
        x,
        width: right - x
      };
    };
    const getVerticalBounds = (editor, contentAreaBox, viewportBounds, isToolbarLocationTop, toolbarType, margin) => {
      const container = SugarElement.fromDom(editor.getContainer());
      const header = descendant(container, '.tox-editor-header').getOr(container);
      const headerBox = box$1(header);
      const isToolbarBelowContentArea = headerBox.y >= contentAreaBox.bottom;
      const isToolbarAbove = isToolbarLocationTop && !isToolbarBelowContentArea;
      if (editor.inline && isToolbarAbove) {
        return {
          y: Math.max(headerBox.bottom + margin, viewportBounds.y),
          bottom: viewportBounds.bottom
        };
      }
      if (editor.inline && !isToolbarAbove) {
        return {
          y: viewportBounds.y,
          bottom: Math.min(headerBox.y - margin, viewportBounds.bottom)
        };
      }
      const containerBounds = toolbarType === 'line' ? box$1(container) : contentAreaBox;
      if (isToolbarAbove) {
        return {
          y: Math.max(headerBox.bottom + margin, viewportBounds.y),
          bottom: Math.min(containerBounds.bottom - margin, viewportBounds.bottom)
        };
      }
      return {
        y: Math.max(containerBounds.y + margin, viewportBounds.y),
        bottom: Math.min(headerBox.y - margin, viewportBounds.bottom)
      };
    };
    const getContextToolbarBounds = (editor, sharedBackstage, toolbarType, margin = 0) => {
      const viewportBounds = getBounds$3(window);
      const contentAreaBox = box$1(SugarElement.fromDom(editor.getContentAreaContainer()));
      const toolbarOrMenubarEnabled = isMenubarEnabled(editor) || isToolbarEnabled(editor) || isMultipleToolbars(editor);
      const {x, width} = getHorizontalBounds(contentAreaBox, viewportBounds, margin);
      if (editor.inline && !toolbarOrMenubarEnabled) {
        return bounds(x, viewportBounds.y, width, viewportBounds.height);
      } else {
        const isToolbarTop = sharedBackstage.header.isPositionedAtTop();
        const {y, bottom} = getVerticalBounds(editor, contentAreaBox, viewportBounds, isToolbarTop, toolbarType, margin);
        return bounds(x, y, width, bottom - y);
      }
    };

    const bubbleSize$1 = 12;
    const bubbleAlignments$1 = {
      valignCentre: [],
      alignCentre: [],
      alignLeft: ['tox-pop--align-left'],
      alignRight: ['tox-pop--align-right'],
      right: ['tox-pop--right'],
      left: ['tox-pop--left'],
      bottom: ['tox-pop--bottom'],
      top: ['tox-pop--top'],
      inset: ['tox-pop--inset']
    };
    const anchorOverrides = {
      maxHeightFunction: expandable$1(),
      maxWidthFunction: expandable()
    };
    const isEntireElementSelected = (editor, elem) => {
      const rng = editor.selection.getRng();
      const leaf$1 = leaf(SugarElement.fromDom(rng.startContainer), rng.startOffset);
      return rng.startContainer === rng.endContainer && rng.startOffset === rng.endOffset - 1 && eq(leaf$1.element, elem);
    };
    const preservePosition = (elem, position, f) => {
      const currentPosition = getRaw(elem, 'position');
      set$8(elem, 'position', position);
      const result = f(elem);
      currentPosition.each(pos => set$8(elem, 'position', pos));
      return result;
    };
    const shouldUseInsetLayouts = position => position === 'node';
    const determineInsetLayout = (editor, contextbar, elem, data, bounds) => {
      const selectionBounds = getSelectionBounds(editor);
      const isSameAnchorElement = data.lastElement().exists(prev => eq(elem, prev));
      if (isEntireElementSelected(editor, elem)) {
        return isSameAnchorElement ? preserve : north;
      } else if (isSameAnchorElement) {
        return preservePosition(contextbar, data.getMode(), () => {
          const isOverlapping = isVerticalOverlap(selectionBounds, box$1(contextbar));
          return isOverlapping && !data.isReposition() ? flip : preserve;
        });
      } else {
        const yBounds = data.getMode() === 'fixed' ? bounds.y + get$b().top : bounds.y;
        const contextbarHeight = get$d(contextbar) + bubbleSize$1;
        return yBounds + contextbarHeight <= selectionBounds.y ? north : south;
      }
    };
    const getAnchorSpec$2 = (editor, mobile, data, position) => {
      const smartInsetLayout = elem => (anchor, element, bubbles, placee, bounds) => {
        const layout = determineInsetLayout(editor, placee, elem, data, bounds);
        const newAnchor = {
          ...anchor,
          y: bounds.y,
          height: bounds.height
        };
        return {
          ...layout(newAnchor, element, bubbles, placee, bounds),
          alwaysFit: true
        };
      };
      const getInsetLayouts = elem => shouldUseInsetLayouts(position) ? [smartInsetLayout(elem)] : [];
      const desktopAnchorSpecLayouts = {
        onLtr: elem => [
          north$2,
          south$2,
          northeast$2,
          southeast$2,
          northwest$2,
          southwest$2
        ].concat(getInsetLayouts(elem)),
        onRtl: elem => [
          north$2,
          south$2,
          northwest$2,
          southwest$2,
          northeast$2,
          southeast$2
        ].concat(getInsetLayouts(elem))
      };
      const mobileAnchorSpecLayouts = {
        onLtr: elem => [
          south$2,
          southeast$2,
          southwest$2,
          northeast$2,
          northwest$2,
          north$2
        ].concat(getInsetLayouts(elem)),
        onRtl: elem => [
          south$2,
          southwest$2,
          southeast$2,
          northwest$2,
          northeast$2,
          north$2
        ].concat(getInsetLayouts(elem))
      };
      return mobile ? mobileAnchorSpecLayouts : desktopAnchorSpecLayouts;
    };
    const getAnchorLayout = (editor, position, isTouch, data) => {
      if (position === 'line') {
        return {
          bubble: nu$5(bubbleSize$1, 0, bubbleAlignments$1),
          layouts: {
            onLtr: () => [east$2],
            onRtl: () => [west$2]
          },
          overrides: anchorOverrides
        };
      } else {
        return {
          bubble: nu$5(0, bubbleSize$1, bubbleAlignments$1, 1 / bubbleSize$1),
          layouts: getAnchorSpec$2(editor, isTouch, data, position),
          overrides: anchorOverrides
        };
      }
    };

    const matchTargetWith = (elem, candidates) => {
      const ctxs = filter$2(candidates, toolbarApi => toolbarApi.predicate(elem.dom));
      const {pass, fail} = partition$3(ctxs, t => t.type === 'contexttoolbar');
      return {
        contextToolbars: pass,
        contextForms: fail
      };
    };
    const filterByPositionForStartNode = toolbars => {
      if (toolbars.length <= 1) {
        return toolbars;
      } else {
        const doesPositionExist = value => exists(toolbars, t => t.position === value);
        const filterToolbarsByPosition = value => filter$2(toolbars, t => t.position === value);
        const hasSelectionToolbars = doesPositionExist('selection');
        const hasNodeToolbars = doesPositionExist('node');
        if (hasSelectionToolbars || hasNodeToolbars) {
          if (hasNodeToolbars && hasSelectionToolbars) {
            const nodeToolbars = filterToolbarsByPosition('node');
            const selectionToolbars = map$2(filterToolbarsByPosition('selection'), t => ({
              ...t,
              position: 'node'
            }));
            return nodeToolbars.concat(selectionToolbars);
          } else {
            return hasSelectionToolbars ? filterToolbarsByPosition('selection') : filterToolbarsByPosition('node');
          }
        } else {
          return filterToolbarsByPosition('line');
        }
      }
    };
    const filterByPositionForAncestorNode = toolbars => {
      if (toolbars.length <= 1) {
        return toolbars;
      } else {
        const findPosition = value => find$5(toolbars, t => t.position === value);
        const basePosition = findPosition('selection').orThunk(() => findPosition('node')).orThunk(() => findPosition('line')).map(t => t.position);
        return basePosition.fold(() => [], pos => filter$2(toolbars, t => t.position === pos));
      }
    };
    const matchStartNode = (elem, nodeCandidates, editorCandidates) => {
      const nodeMatches = matchTargetWith(elem, nodeCandidates);
      if (nodeMatches.contextForms.length > 0) {
        return Optional.some({
          elem,
          toolbars: [nodeMatches.contextForms[0]]
        });
      } else {
        const editorMatches = matchTargetWith(elem, editorCandidates);
        if (editorMatches.contextForms.length > 0) {
          return Optional.some({
            elem,
            toolbars: [editorMatches.contextForms[0]]
          });
        } else if (nodeMatches.contextToolbars.length > 0 || editorMatches.contextToolbars.length > 0) {
          const toolbars = filterByPositionForStartNode(nodeMatches.contextToolbars.concat(editorMatches.contextToolbars));
          return Optional.some({
            elem,
            toolbars
          });
        } else {
          return Optional.none();
        }
      }
    };
    const matchAncestor = (isRoot, startNode, scopes) => {
      if (isRoot(startNode)) {
        return Optional.none();
      } else {
        return ancestor$2(startNode, ancestorElem => {
          if (isElement$1(ancestorElem)) {
            const {contextToolbars, contextForms} = matchTargetWith(ancestorElem, scopes.inNodeScope);
            const toolbars = contextForms.length > 0 ? contextForms : filterByPositionForAncestorNode(contextToolbars);
            return toolbars.length > 0 ? Optional.some({
              elem: ancestorElem,
              toolbars
            }) : Optional.none();
          } else {
            return Optional.none();
          }
        }, isRoot);
      }
    };
    const lookup$1 = (scopes, editor) => {
      const rootElem = SugarElement.fromDom(editor.getBody());
      const isRoot = elem => eq(elem, rootElem);
      const isOutsideRoot = startNode => !isRoot(startNode) && !contains(rootElem, startNode);
      const startNode = SugarElement.fromDom(editor.selection.getNode());
      if (isOutsideRoot(startNode)) {
        return Optional.none();
      }
      return matchStartNode(startNode, scopes.inNodeScope, scopes.inEditorScope).orThunk(() => matchAncestor(isRoot, startNode, scopes));
    };

    const categorise = (contextToolbars, navigate) => {
      const forms = {};
      const inNodeScope = [];
      const inEditorScope = [];
      const formNavigators = {};
      const lookupTable = {};
      const registerForm = (key, toolbarSpec) => {
        const contextForm = getOrDie(createContextForm(toolbarSpec));
        forms[key] = contextForm;
        contextForm.launch.map(launch => {
          formNavigators['form:' + key + ''] = {
            ...toolbarSpec.launch,
            type: launch.type === 'contextformtogglebutton' ? 'togglebutton' : 'button',
            onAction: () => {
              navigate(contextForm);
            }
          };
        });
        if (contextForm.scope === 'editor') {
          inEditorScope.push(contextForm);
        } else {
          inNodeScope.push(contextForm);
        }
        lookupTable[key] = contextForm;
      };
      const registerToolbar = (key, toolbarSpec) => {
        createContextToolbar(toolbarSpec).each(contextToolbar => {
          if (toolbarSpec.scope === 'editor') {
            inEditorScope.push(contextToolbar);
          } else {
            inNodeScope.push(contextToolbar);
          }
          lookupTable[key] = contextToolbar;
        });
      };
      const keys$1 = keys(contextToolbars);
      each$1(keys$1, key => {
        const toolbarApi = contextToolbars[key];
        if (toolbarApi.type === 'contextform') {
          registerForm(key, toolbarApi);
        } else if (toolbarApi.type === 'contexttoolbar') {
          registerToolbar(key, toolbarApi);
        }
      });
      return {
        forms,
        inNodeScope,
        inEditorScope,
        lookupTable,
        formNavigators
      };
    };

    const forwardSlideEvent = generate$6('forward-slide');
    const backSlideEvent = generate$6('backward-slide');
    const changeSlideEvent = generate$6('change-slide-event');
    const resizingClass = 'tox-pop--resizing';
    const renderContextToolbar = spec => {
      const stack = Cell([]);
      return InlineView.sketch({
        dom: {
          tag: 'div',
          classes: ['tox-pop']
        },
        fireDismissalEventInstead: { event: 'doNotDismissYet' },
        onShow: comp => {
          stack.set([]);
          InlineView.getContent(comp).each(c => {
            remove$6(c.element, 'visibility');
          });
          remove$2(comp.element, resizingClass);
          remove$6(comp.element, 'width');
        },
        inlineBehaviours: derive$1([
          config('context-toolbar-events', [
            runOnSource(transitionend(), (comp, se) => {
              if (se.event.raw.propertyName === 'width') {
                remove$2(comp.element, resizingClass);
                remove$6(comp.element, 'width');
              }
            }),
            run$1(changeSlideEvent, (comp, se) => {
              const elem = comp.element;
              remove$6(elem, 'width');
              const currentWidth = get$c(elem);
              InlineView.setContent(comp, se.event.contents);
              add$2(elem, resizingClass);
              const newWidth = get$c(elem);
              set$8(elem, 'width', currentWidth + 'px');
              InlineView.getContent(comp).each(newContents => {
                se.event.focus.bind(f => {
                  focus$3(f);
                  return search(elem);
                }).orThunk(() => {
                  Keying.focusIn(newContents);
                  return active$1(getRootNode(elem));
                });
              });
              setTimeout(() => {
                set$8(comp.element, 'width', newWidth + 'px');
              }, 0);
            }),
            run$1(forwardSlideEvent, (comp, se) => {
              InlineView.getContent(comp).each(oldContents => {
                stack.set(stack.get().concat([{
                    bar: oldContents,
                    focus: active$1(getRootNode(comp.element))
                  }]));
              });
              emitWith(comp, changeSlideEvent, {
                contents: se.event.forwardContents,
                focus: Optional.none()
              });
            }),
            run$1(backSlideEvent, (comp, _se) => {
              last$1(stack.get()).each(last => {
                stack.set(stack.get().slice(0, stack.get().length - 1));
                emitWith(comp, changeSlideEvent, {
                  contents: premade(last.bar),
                  focus: last.focus
                });
              });
            })
          ]),
          Keying.config({
            mode: 'special',
            onEscape: comp => last$1(stack.get()).fold(() => spec.onEscape(), _ => {
              emit(comp, backSlideEvent);
              return Optional.some(true);
            })
          })
        ]),
        lazySink: () => Result.value(spec.sink)
      });
    };

    const transitionClass = 'tox-pop--transition';
    const register$9 = (editor, registryContextToolbars, sink, extras) => {
      const backstage = extras.backstage;
      const sharedBackstage = backstage.shared;
      const isTouch = detect$1().deviceType.isTouch;
      const lastElement = value$2();
      const lastTrigger = value$2();
      const lastContextPosition = value$2();
      const contextbar = build$1(renderContextToolbar({
        sink,
        onEscape: () => {
          editor.focus();
          return Optional.some(true);
        }
      }));
      const getBounds = () => {
        const position = lastContextPosition.get().getOr('node');
        const margin = shouldUseInsetLayouts(position) ? 1 : 0;
        return getContextToolbarBounds(editor, sharedBackstage, position, margin);
      };
      const canLaunchToolbar = () => {
        return !editor.removed && !(isTouch() && backstage.isContextMenuOpen());
      };
      const isSameLaunchElement = elem => is$1(lift2(elem, lastElement.get(), eq), true);
      const shouldContextToolbarHide = () => {
        if (!canLaunchToolbar()) {
          return true;
        } else {
          const contextToolbarBounds = getBounds();
          const anchorBounds = is$1(lastContextPosition.get(), 'node') ? getAnchorElementBounds(editor, lastElement.get()) : getSelectionBounds(editor);
          return contextToolbarBounds.height <= 0 || !isVerticalOverlap(anchorBounds, contextToolbarBounds);
        }
      };
      const close = () => {
        lastElement.clear();
        lastTrigger.clear();
        lastContextPosition.clear();
        InlineView.hide(contextbar);
      };
      const hideOrRepositionIfNecessary = () => {
        if (InlineView.isOpen(contextbar)) {
          const contextBarEle = contextbar.element;
          remove$6(contextBarEle, 'display');
          if (shouldContextToolbarHide()) {
            set$8(contextBarEle, 'display', 'none');
          } else {
            lastTrigger.set(0);
            InlineView.reposition(contextbar);
          }
        }
      };
      const wrapInPopDialog = toolbarSpec => ({
        dom: {
          tag: 'div',
          classes: ['tox-pop__dialog']
        },
        components: [toolbarSpec],
        behaviours: derive$1([
          Keying.config({ mode: 'acyclic' }),
          config('pop-dialog-wrap-events', [
            runOnAttached(comp => {
              editor.shortcuts.add('ctrl+F9', 'focus statusbar', () => Keying.focusIn(comp));
            }),
            runOnDetached(_comp => {
              editor.shortcuts.remove('ctrl+F9');
            })
          ])
        ])
      });
      const getScopes = cached(() => categorise(registryContextToolbars, toolbarApi => {
        const alloySpec = buildToolbar([toolbarApi]);
        emitWith(contextbar, forwardSlideEvent, { forwardContents: wrapInPopDialog(alloySpec) });
      }));
      const buildContextToolbarGroups = (allButtons, ctx) => identifyButtons(editor, {
        buttons: allButtons,
        toolbar: ctx.items,
        allowToolbarGroups: false
      }, extras.backstage, Optional.some(['form:']));
      const buildContextFormGroups = (ctx, providers) => ContextForm.buildInitGroups(ctx, providers);
      const buildToolbar = toolbars => {
        const {buttons} = editor.ui.registry.getAll();
        const scopes = getScopes();
        const allButtons = {
          ...buttons,
          ...scopes.formNavigators
        };
        const toolbarType = getToolbarMode(editor) === ToolbarMode$1.scrolling ? ToolbarMode$1.scrolling : ToolbarMode$1.default;
        const initGroups = flatten(map$2(toolbars, ctx => ctx.type === 'contexttoolbar' ? buildContextToolbarGroups(allButtons, ctx) : buildContextFormGroups(ctx, sharedBackstage.providers)));
        return renderToolbar({
          type: toolbarType,
          uid: generate$6('context-toolbar'),
          initGroups,
          onEscape: Optional.none,
          cyclicKeying: true,
          providers: sharedBackstage.providers
        });
      };
      const getAnchor = (position, element) => {
        const anchorage = position === 'node' ? sharedBackstage.anchors.node(element) : sharedBackstage.anchors.cursor();
        const anchorLayout = getAnchorLayout(editor, position, isTouch(), {
          lastElement: lastElement.get,
          isReposition: () => is$1(lastTrigger.get(), 0),
          getMode: () => Positioning.getMode(sink)
        });
        return deepMerge(anchorage, anchorLayout);
      };
      const launchContext = (toolbarApi, elem) => {
        launchContextToolbar.cancel();
        if (!canLaunchToolbar()) {
          return;
        }
        const toolbarSpec = buildToolbar(toolbarApi);
        const position = toolbarApi[0].position;
        const anchor = getAnchor(position, elem);
        lastContextPosition.set(position);
        lastTrigger.set(1);
        const contextBarEle = contextbar.element;
        remove$6(contextBarEle, 'display');
        if (!isSameLaunchElement(elem)) {
          remove$2(contextBarEle, transitionClass);
          Positioning.reset(sink, contextbar);
        }
        InlineView.showWithinBounds(contextbar, wrapInPopDialog(toolbarSpec), {
          anchor,
          transition: {
            classes: [transitionClass],
            mode: 'placement'
          }
        }, () => Optional.some(getBounds()));
        elem.fold(lastElement.clear, lastElement.set);
        if (shouldContextToolbarHide()) {
          set$8(contextBarEle, 'display', 'none');
        }
      };
      const launchContextToolbar = last(() => {
        if (!editor.hasFocus() || editor.removed) {
          return;
        }
        if (has(contextbar.element, transitionClass)) {
          launchContextToolbar.throttle();
        } else {
          const scopes = getScopes();
          lookup$1(scopes, editor).fold(close, info => {
            launchContext(info.toolbars, Optional.some(info.elem));
          });
        }
      }, 17);
      editor.on('init', () => {
        editor.on('remove', close);
        editor.on('ScrollContent ScrollWindow ObjectResized ResizeEditor longpress', hideOrRepositionIfNecessary);
        editor.on('click keyup focus SetContent', launchContextToolbar.throttle);
        editor.on(hideContextToolbarEvent, close);
        editor.on(showContextToolbarEvent, e => {
          const scopes = getScopes();
          get$g(scopes.lookupTable, e.toolbarKey).each(ctx => {
            launchContext([ctx], someIf(e.target !== editor, e.target));
            InlineView.getContent(contextbar).each(Keying.focusIn);
          });
        });
        editor.on('focusout', _e => {
          global$9.setEditorTimeout(editor, () => {
            if (search(sink.element).isNone() && search(contextbar.element).isNone()) {
              close();
            }
          }, 0);
        });
        editor.on('SwitchMode', () => {
          if (editor.mode.isReadOnly()) {
            close();
          }
        });
        editor.on('AfterProgressState', event => {
          if (event.state) {
            close();
          } else if (editor.hasFocus()) {
            launchContextToolbar.throttle();
          }
        });
        editor.on('NodeChange', _e => {
          search(contextbar.element).fold(launchContextToolbar.throttle, noop);
        });
      });
    };

    const register$8 = editor => {
      const alignToolbarButtons = [
        {
          name: 'alignleft',
          text: 'Align left',
          cmd: 'JustifyLeft',
          icon: 'align-left'
        },
        {
          name: 'aligncenter',
          text: 'Align center',
          cmd: 'JustifyCenter',
          icon: 'align-center'
        },
        {
          name: 'alignright',
          text: 'Align right',
          cmd: 'JustifyRight',
          icon: 'align-right'
        },
        {
          name: 'alignjustify',
          text: 'Justify',
          cmd: 'JustifyFull',
          icon: 'align-justify'
        }
      ];
      each$1(alignToolbarButtons, item => {
        editor.ui.registry.addToggleButton(item.name, {
          tooltip: item.text,
          icon: item.icon,
          onAction: onActionExecCommand(editor, item.cmd),
          onSetup: onSetupFormatToggle(editor, item.name)
        });
      });
      editor.ui.registry.addButton('alignnone', {
        tooltip: 'No alignment',
        icon: 'align-none',
        onAction: onActionExecCommand(editor, 'JustifyNone')
      });
    };

    const units = {
      unsupportedLength: [
        'em',
        'ex',
        'cap',
        'ch',
        'ic',
        'rem',
        'lh',
        'rlh',
        'vw',
        'vh',
        'vi',
        'vb',
        'vmin',
        'vmax',
        'cm',
        'mm',
        'Q',
        'in',
        'pc',
        'pt',
        'px'
      ],
      fixed: [
        'px',
        'pt'
      ],
      relative: ['%'],
      empty: ['']
    };
    const pattern = (() => {
      const decimalDigits = '[0-9]+';
      const signedInteger = '[+-]?' + decimalDigits;
      const exponentPart = '[eE]' + signedInteger;
      const dot = '\\.';
      const opt = input => `(?:${ input })?`;
      const unsignedDecimalLiteral = [
        'Infinity',
        decimalDigits + dot + opt(decimalDigits) + opt(exponentPart),
        dot + decimalDigits + opt(exponentPart),
        decimalDigits + opt(exponentPart)
      ].join('|');
      const float = `[+-]?(?:${ unsignedDecimalLiteral })`;
      return new RegExp(`^(${ float })(.*)$`);
    })();
    const isUnit = (unit, accepted) => exists(accepted, acc => exists(units[acc], check => unit === check));
    const parse = (input, accepted) => {
      const match = Optional.from(pattern.exec(input));
      return match.bind(array => {
        const value = Number(array[1]);
        const unitRaw = array[2];
        if (isUnit(unitRaw, accepted)) {
          return Optional.some({
            value,
            unit: unitRaw
          });
        } else {
          return Optional.none();
        }
      });
    };
    const normalise = (input, accepted) => parse(input, accepted).map(({value, unit}) => value + unit);

    const registerController = (editor, spec) => {
      const getMenuItems = () => {
        const options = spec.getOptions(editor);
        const initial = spec.getCurrent(editor).map(spec.hash);
        const current = value$2();
        return map$2(options, value => ({
          type: 'togglemenuitem',
          text: spec.display(value),
          onSetup: api => {
            const setActive = active => {
              if (active) {
                current.on(oldApi => oldApi.setActive(false));
                current.set(api);
              }
              api.setActive(active);
            };
            setActive(is$1(initial, spec.hash(value)));
            const unbindWatcher = spec.watcher(editor, value, setActive);
            return () => {
              current.clear();
              unbindWatcher();
            };
          },
          onAction: () => spec.setCurrent(editor, value)
        }));
      };
      editor.ui.registry.addMenuButton(spec.name, {
        tooltip: spec.text,
        icon: spec.icon,
        fetch: callback => callback(getMenuItems()),
        onSetup: spec.onToolbarSetup
      });
      editor.ui.registry.addNestedMenuItem(spec.name, {
        type: 'nestedmenuitem',
        text: spec.text,
        getSubmenuItems: getMenuItems,
        onSetup: spec.onMenuSetup
      });
    };
    const lineHeightSpec = {
      name: 'lineheight',
      text: 'Line height',
      icon: 'line-height',
      getOptions: getLineHeightFormats,
      hash: input => normalise(input, [
        'fixed',
        'relative',
        'empty'
      ]).getOr(input),
      display: identity,
      watcher: (editor, value, callback) => editor.formatter.formatChanged('lineheight', callback, false, { value }).unbind,
      getCurrent: editor => Optional.from(editor.queryCommandValue('LineHeight')),
      setCurrent: (editor, value) => editor.execCommand('LineHeight', false, value)
    };
    const languageSpec = editor => {
      const settingsOpt = Optional.from(getContentLanguages(editor));
      return settingsOpt.map(settings => ({
        name: 'language',
        text: 'Language',
        icon: 'language',
        getOptions: constant$1(settings),
        hash: input => isUndefined(input.customCode) ? input.code : `${ input.code }/${ input.customCode }`,
        display: input => input.title,
        watcher: (editor, value, callback) => {
          var _a;
          return editor.formatter.formatChanged('lang', callback, false, {
            value: value.code,
            customValue: (_a = value.customCode) !== null && _a !== void 0 ? _a : null
          }).unbind;
        },
        getCurrent: editor => {
          const node = SugarElement.fromDom(editor.selection.getNode());
          return closest$4(node, n => Optional.some(n).filter(isElement$1).bind(ele => {
            const codeOpt = getOpt(ele, 'lang');
            return codeOpt.map(code => {
              const customCode = getOpt(ele, 'data-mce-lang').getOrUndefined();
              return {
                code,
                customCode,
                title: ''
              };
            });
          }));
        },
        setCurrent: (editor, lang) => editor.execCommand('Lang', false, lang),
        onToolbarSetup: api => {
          const unbinder = unbindable();
          api.setActive(editor.formatter.match('lang', {}, undefined, true));
          unbinder.set(editor.formatter.formatChanged('lang', api.setActive, true));
          return unbinder.clear;
        }
      }));
    };
    const register$7 = editor => {
      registerController(editor, lineHeightSpec);
      languageSpec(editor).each(spec => registerController(editor, spec));
    };

    const register$6 = (editor, backstage) => {
      createAlignMenu(editor, backstage);
      createFontFamilyMenu(editor, backstage);
      createStylesMenu(editor, backstage);
      createBlocksMenu(editor, backstage);
      createFontSizeMenu(editor, backstage);
    };

    const onSetupOutdentState = editor => onSetupEvent(editor, 'NodeChange', api => {
      api.setEnabled(editor.queryCommandState('outdent'));
    });
    const registerButtons$2 = editor => {
      editor.ui.registry.addButton('outdent', {
        tooltip: 'Decrease indent',
        icon: 'outdent',
        onSetup: onSetupOutdentState(editor),
        onAction: onActionExecCommand(editor, 'outdent')
      });
      editor.ui.registry.addButton('indent', {
        tooltip: 'Increase indent',
        icon: 'indent',
        onAction: onActionExecCommand(editor, 'indent')
      });
    };
    const register$5 = editor => {
      registerButtons$2(editor);
    };

    const makeSetupHandler = (editor, pasteAsText) => api => {
      api.setActive(pasteAsText.get());
      const pastePlainTextToggleHandler = e => {
        pasteAsText.set(e.state);
        api.setActive(e.state);
      };
      editor.on('PastePlainTextToggle', pastePlainTextToggleHandler);
      return () => editor.off('PastePlainTextToggle', pastePlainTextToggleHandler);
    };
    const register$4 = editor => {
      const pasteAsText = Cell(getPasteAsText(editor));
      const onAction = () => editor.execCommand('mceTogglePlainTextPaste');
      editor.ui.registry.addToggleButton('pastetext', {
        active: false,
        icon: 'paste-text',
        tooltip: 'Paste as text',
        onAction,
        onSetup: makeSetupHandler(editor, pasteAsText)
      });
      editor.ui.registry.addToggleMenuItem('pastetext', {
        text: 'Paste as text',
        icon: 'paste-text',
        onAction,
        onSetup: makeSetupHandler(editor, pasteAsText)
      });
    };

    const onActionToggleFormat = (editor, fmt) => () => {
      editor.execCommand('mceToggleFormat', false, fmt);
    };
    const registerFormatButtons = editor => {
      global$1.each([
        {
          name: 'bold',
          text: 'Bold',
          icon: 'bold'
        },
        {
          name: 'italic',
          text: 'Italic',
          icon: 'italic'
        },
        {
          name: 'underline',
          text: 'Underline',
          icon: 'underline'
        },
        {
          name: 'strikethrough',
          text: 'Strikethrough',
          icon: 'strike-through'
        },
        {
          name: 'subscript',
          text: 'Subscript',
          icon: 'subscript'
        },
        {
          name: 'superscript',
          text: 'Superscript',
          icon: 'superscript'
        }
      ], (btn, _idx) => {
        editor.ui.registry.addToggleButton(btn.name, {
          tooltip: btn.text,
          icon: btn.icon,
          onSetup: onSetupFormatToggle(editor, btn.name),
          onAction: onActionToggleFormat(editor, btn.name)
        });
      });
      for (let i = 1; i <= 6; i++) {
        const name = 'h' + i;
        editor.ui.registry.addToggleButton(name, {
          text: name.toUpperCase(),
          tooltip: 'Heading ' + i,
          onSetup: onSetupFormatToggle(editor, name),
          onAction: onActionToggleFormat(editor, name)
        });
      }
    };
    const registerCommandButtons = editor => {
      global$1.each([
        {
          name: 'cut',
          text: 'Cut',
          action: 'Cut',
          icon: 'cut'
        },
        {
          name: 'copy',
          text: 'Copy',
          action: 'Copy',
          icon: 'copy'
        },
        {
          name: 'paste',
          text: 'Paste',
          action: 'Paste',
          icon: 'paste'
        },
        {
          name: 'help',
          text: 'Help',
          action: 'mceHelp',
          icon: 'help'
        },
        {
          name: 'selectall',
          text: 'Select all',
          action: 'SelectAll',
          icon: 'select-all'
        },
        {
          name: 'newdocument',
          text: 'New document',
          action: 'mceNewDocument',
          icon: 'new-document'
        },
        {
          name: 'removeformat',
          text: 'Clear formatting',
          action: 'RemoveFormat',
          icon: 'remove-formatting'
        },
        {
          name: 'remove',
          text: 'Remove',
          action: 'Delete',
          icon: 'remove'
        },
        {
          name: 'print',
          text: 'Print',
          action: 'mcePrint',
          icon: 'print'
        },
        {
          name: 'hr',
          text: 'Horizontal line',
          action: 'InsertHorizontalRule',
          icon: 'horizontal-rule'
        }
      ], btn => {
        editor.ui.registry.addButton(btn.name, {
          tooltip: btn.text,
          icon: btn.icon,
          onAction: onActionExecCommand(editor, btn.action)
        });
      });
    };
    const registerCommandToggleButtons = editor => {
      global$1.each([{
          name: 'blockquote',
          text: 'Blockquote',
          action: 'mceBlockQuote',
          icon: 'quote'
        }], btn => {
        editor.ui.registry.addToggleButton(btn.name, {
          tooltip: btn.text,
          icon: btn.icon,
          onAction: onActionExecCommand(editor, btn.action),
          onSetup: onSetupFormatToggle(editor, btn.name)
        });
      });
    };
    const registerButtons$1 = editor => {
      registerFormatButtons(editor);
      registerCommandButtons(editor);
      registerCommandToggleButtons(editor);
    };
    const registerMenuItems$2 = editor => {
      global$1.each([
        {
          name: 'bold',
          text: 'Bold',
          action: 'Bold',
          icon: 'bold',
          shortcut: 'Meta+B'
        },
        {
          name: 'italic',
          text: 'Italic',
          action: 'Italic',
          icon: 'italic',
          shortcut: 'Meta+I'
        },
        {
          name: 'underline',
          text: 'Underline',
          action: 'Underline',
          icon: 'underline',
          shortcut: 'Meta+U'
        },
        {
          name: 'strikethrough',
          text: 'Strikethrough',
          action: 'Strikethrough',
          icon: 'strike-through'
        },
        {
          name: 'subscript',
          text: 'Subscript',
          action: 'Subscript',
          icon: 'subscript'
        },
        {
          name: 'superscript',
          text: 'Superscript',
          action: 'Superscript',
          icon: 'superscript'
        },
        {
          name: 'removeformat',
          text: 'Clear formatting',
          action: 'RemoveFormat',
          icon: 'remove-formatting'
        },
        {
          name: 'newdocument',
          text: 'New document',
          action: 'mceNewDocument',
          icon: 'new-document'
        },
        {
          name: 'cut',
          text: 'Cut',
          action: 'Cut',
          icon: 'cut',
          shortcut: 'Meta+X'
        },
        {
          name: 'copy',
          text: 'Copy',
          action: 'Copy',
          icon: 'copy',
          shortcut: 'Meta+C'
        },
        {
          name: 'paste',
          text: 'Paste',
          action: 'Paste',
          icon: 'paste',
          shortcut: 'Meta+V'
        },
        {
          name: 'selectall',
          text: 'Select all',
          action: 'SelectAll',
          icon: 'select-all',
          shortcut: 'Meta+A'
        },
        {
          name: 'print',
          text: 'Print...',
          action: 'mcePrint',
          icon: 'print',
          shortcut: 'Meta+P'
        },
        {
          name: 'hr',
          text: 'Horizontal line',
          action: 'InsertHorizontalRule',
          icon: 'horizontal-rule'
        }
      ], menuitem => {
        editor.ui.registry.addMenuItem(menuitem.name, {
          text: menuitem.text,
          icon: menuitem.icon,
          shortcut: menuitem.shortcut,
          onAction: onActionExecCommand(editor, menuitem.action)
        });
      });
      editor.ui.registry.addMenuItem('codeformat', {
        text: 'Code',
        icon: 'sourcecode',
        onAction: onActionToggleFormat(editor, 'code')
      });
    };
    const register$3 = editor => {
      registerButtons$1(editor);
      registerMenuItems$2(editor);
    };

    const onSetupUndoRedoState = (editor, type) => onSetupEvent(editor, 'Undo Redo AddUndo TypingUndo ClearUndos SwitchMode', api => {
      api.setEnabled(!editor.mode.isReadOnly() && editor.undoManager[type]());
    });
    const registerMenuItems$1 = editor => {
      editor.ui.registry.addMenuItem('undo', {
        text: 'Undo',
        icon: 'undo',
        shortcut: 'Meta+Z',
        onSetup: onSetupUndoRedoState(editor, 'hasUndo'),
        onAction: onActionExecCommand(editor, 'undo')
      });
      editor.ui.registry.addMenuItem('redo', {
        text: 'Redo',
        icon: 'redo',
        shortcut: 'Meta+Y',
        onSetup: onSetupUndoRedoState(editor, 'hasRedo'),
        onAction: onActionExecCommand(editor, 'redo')
      });
    };
    const registerButtons = editor => {
      editor.ui.registry.addButton('undo', {
        tooltip: 'Undo',
        icon: 'undo',
        enabled: false,
        onSetup: onSetupUndoRedoState(editor, 'hasUndo'),
        onAction: onActionExecCommand(editor, 'undo')
      });
      editor.ui.registry.addButton('redo', {
        tooltip: 'Redo',
        icon: 'redo',
        enabled: false,
        onSetup: onSetupUndoRedoState(editor, 'hasRedo'),
        onAction: onActionExecCommand(editor, 'redo')
      });
    };
    const register$2 = editor => {
      registerMenuItems$1(editor);
      registerButtons(editor);
    };

    const onSetupVisualAidState = editor => onSetupEvent(editor, 'VisualAid', api => {
      api.setActive(editor.hasVisual);
    });
    const registerMenuItems = editor => {
      editor.ui.registry.addToggleMenuItem('visualaid', {
        text: 'Visual aids',
        onSetup: onSetupVisualAidState(editor),
        onAction: onActionExecCommand(editor, 'mceToggleVisualAid')
      });
    };
    const registerToolbarButton = editor => {
      editor.ui.registry.addButton('visualaid', {
        tooltip: 'Visual aids',
        text: 'Visual aids',
        onAction: onActionExecCommand(editor, 'mceToggleVisualAid')
      });
    };
    const register$1 = editor => {
      registerToolbarButton(editor);
      registerMenuItems(editor);
    };

    const setup$6 = (editor, backstage) => {
      register$8(editor);
      register$3(editor);
      register$6(editor, backstage);
      register$2(editor);
      register$c(editor);
      register$1(editor);
      register$5(editor);
      register$7(editor);
      register$4(editor);
    };

    const patchPipeConfig = config => isString(config) ? config.split(/[ ,]/) : config;
    const option = name => editor => editor.options.get(name);
    const register = editor => {
      const registerOption = editor.options.register;
      registerOption('contextmenu_avoid_overlap', {
        processor: 'string',
        default: ''
      });
      registerOption('contextmenu_never_use_native', {
        processor: 'boolean',
        default: false
      });
      registerOption('contextmenu', {
        processor: value => {
          if (value === false) {
            return {
              value: [],
              valid: true
            };
          } else if (isString(value) || isArrayOf(value, isString)) {
            return {
              value: patchPipeConfig(value),
              valid: true
            };
          } else {
            return {
              valid: false,
              message: 'Must be false or a string.'
            };
          }
        },
        default: 'link linkchecker image editimage table spellchecker configurepermanentpen'
      });
    };
    const shouldNeverUseNative = option('contextmenu_never_use_native');
    const getAvoidOverlapSelector = option('contextmenu_avoid_overlap');
    const isContextMenuDisabled = editor => getContextMenu(editor).length === 0;
    const getContextMenu = editor => {
      const contextMenus = editor.ui.registry.getAll().contextMenus;
      const contextMenu = editor.options.get('contextmenu');
      if (editor.options.isSet('contextmenu')) {
        return contextMenu;
      } else {
        return filter$2(contextMenu, item => has$2(contextMenus, item));
      }
    };

    const nu = (x, y) => ({
      type: 'makeshift',
      x,
      y
    });
    const transpose = (pos, dx, dy) => {
      return nu(pos.x + dx, pos.y + dy);
    };
    const isTouchEvent$1 = e => e.type === 'longpress' || e.type.indexOf('touch') === 0;
    const fromPageXY = e => {
      if (isTouchEvent$1(e)) {
        const touch = e.touches[0];
        return nu(touch.pageX, touch.pageY);
      } else {
        return nu(e.pageX, e.pageY);
      }
    };
    const fromClientXY = e => {
      if (isTouchEvent$1(e)) {
        const touch = e.touches[0];
        return nu(touch.clientX, touch.clientY);
      } else {
        return nu(e.clientX, e.clientY);
      }
    };
    const transposeContentAreaContainer = (element, pos) => {
      const containerPos = global$7.DOM.getPos(element);
      return transpose(pos, containerPos.x, containerPos.y);
    };
    const getPointAnchor = (editor, e) => {
      if (e.type === 'contextmenu' || e.type === 'longpress') {
        if (editor.inline) {
          return fromPageXY(e);
        } else {
          return transposeContentAreaContainer(editor.getContentAreaContainer(), fromClientXY(e));
        }
      } else {
        return getSelectionAnchor(editor);
      }
    };
    const getSelectionAnchor = editor => {
      return {
        type: 'selection',
        root: SugarElement.fromDom(editor.selection.getNode())
      };
    };
    const getNodeAnchor = editor => ({
      type: 'node',
      node: Optional.some(SugarElement.fromDom(editor.selection.getNode())),
      root: SugarElement.fromDom(editor.getBody())
    });
    const getAnchorSpec$1 = (editor, e, anchorType) => {
      switch (anchorType) {
      case 'node':
        return getNodeAnchor(editor);
      case 'point':
        return getPointAnchor(editor, e);
      case 'selection':
        return getSelectionAnchor(editor);
      }
    };

    const initAndShow$1 = (editor, e, buildMenu, backstage, contextmenu, anchorType) => {
      const items = buildMenu();
      const anchorSpec = getAnchorSpec$1(editor, e, anchorType);
      build(items, ItemResponse$1.CLOSE_ON_EXECUTE, backstage, {
        isHorizontalMenu: false,
        search: Optional.none()
      }).map(menuData => {
        e.preventDefault();
        InlineView.showMenuAt(contextmenu, { anchor: anchorSpec }, {
          menu: { markers: markers('normal') },
          data: menuData
        });
      });
    };

    const layouts = {
      onLtr: () => [
        south$2,
        southeast$2,
        southwest$2,
        northeast$2,
        northwest$2,
        north$2,
        north,
        south,
        northeast,
        southeast,
        northwest,
        southwest
      ],
      onRtl: () => [
        south$2,
        southwest$2,
        southeast$2,
        northwest$2,
        northeast$2,
        north$2,
        north,
        south,
        northwest,
        southwest,
        northeast,
        southeast
      ]
    };
    const bubbleSize = 12;
    const bubbleAlignments = {
      valignCentre: [],
      alignCentre: [],
      alignLeft: ['tox-pop--align-left'],
      alignRight: ['tox-pop--align-right'],
      right: ['tox-pop--right'],
      left: ['tox-pop--left'],
      bottom: ['tox-pop--bottom'],
      top: ['tox-pop--top']
    };
    const isTouchWithinSelection = (editor, e) => {
      const selection = editor.selection;
      if (selection.isCollapsed() || e.touches.length < 1) {
        return false;
      } else {
        const touch = e.touches[0];
        const rng = selection.getRng();
        const rngRectOpt = getFirstRect(editor.getWin(), SimSelection.domRange(rng));
        return rngRectOpt.exists(rngRect => rngRect.left <= touch.clientX && rngRect.right >= touch.clientX && rngRect.top <= touch.clientY && rngRect.bottom >= touch.clientY);
      }
    };
    const setupiOSOverrides = editor => {
      const originalSelection = editor.selection.getRng();
      const selectionReset = () => {
        global$9.setEditorTimeout(editor, () => {
          editor.selection.setRng(originalSelection);
        }, 10);
        unbindEventListeners();
      };
      editor.once('touchend', selectionReset);
      const preventMousedown = e => {
        e.preventDefault();
        e.stopImmediatePropagation();
      };
      editor.on('mousedown', preventMousedown, true);
      const clearSelectionReset = () => unbindEventListeners();
      editor.once('longpresscancel', clearSelectionReset);
      const unbindEventListeners = () => {
        editor.off('touchend', selectionReset);
        editor.off('longpresscancel', clearSelectionReset);
        editor.off('mousedown', preventMousedown);
      };
    };
    const getAnchorSpec = (editor, e, anchorType) => {
      const anchorSpec = getAnchorSpec$1(editor, e, anchorType);
      const bubbleYOffset = anchorType === 'point' ? bubbleSize : 0;
      return {
        bubble: nu$5(0, bubbleYOffset, bubbleAlignments),
        layouts,
        overrides: {
          maxWidthFunction: expandable(),
          maxHeightFunction: expandable$1()
        },
        ...anchorSpec
      };
    };
    const show = (editor, e, items, backstage, contextmenu, anchorType, highlightImmediately) => {
      const anchorSpec = getAnchorSpec(editor, e, anchorType);
      build(items, ItemResponse$1.CLOSE_ON_EXECUTE, backstage, {
        isHorizontalMenu: true,
        search: Optional.none()
      }).map(menuData => {
        e.preventDefault();
        const highlightOnOpen = highlightImmediately ? HighlightOnOpen.HighlightMenuAndItem : HighlightOnOpen.HighlightNone;
        InlineView.showMenuWithinBounds(contextmenu, { anchor: anchorSpec }, {
          menu: {
            markers: markers('normal'),
            highlightOnOpen
          },
          data: menuData,
          type: 'horizontal'
        }, () => Optional.some(getContextToolbarBounds(editor, backstage.shared, anchorType === 'node' ? 'node' : 'selection')));
        editor.dispatch(hideContextToolbarEvent);
      });
    };
    const initAndShow = (editor, e, buildMenu, backstage, contextmenu, anchorType) => {
      const detection = detect$1();
      const isiOS = detection.os.isiOS();
      const isMacOS = detection.os.isMacOS();
      const isAndroid = detection.os.isAndroid();
      const isTouch = detection.deviceType.isTouch();
      const shouldHighlightImmediately = () => !(isAndroid || isiOS || isMacOS && isTouch);
      const open = () => {
        const items = buildMenu();
        show(editor, e, items, backstage, contextmenu, anchorType, shouldHighlightImmediately());
      };
      if ((isMacOS || isiOS) && anchorType !== 'node') {
        const openiOS = () => {
          setupiOSOverrides(editor);
          open();
        };
        if (isTouchWithinSelection(editor, e)) {
          openiOS();
        } else {
          editor.once('selectionchange', openiOS);
          editor.once('touchend', () => editor.off('selectionchange', openiOS));
        }
      } else {
        open();
      }
    };

    const isSeparator = item => isString(item) ? item === '|' : item.type === 'separator';
    const separator = { type: 'separator' };
    const makeContextItem = item => {
      const commonMenuItem = item => ({
        text: item.text,
        icon: item.icon,
        enabled: item.enabled,
        shortcut: item.shortcut
      });
      if (isString(item)) {
        return item;
      } else {
        switch (item.type) {
        case 'separator':
          return separator;
        case 'submenu':
          return {
            type: 'nestedmenuitem',
            ...commonMenuItem(item),
            getSubmenuItems: () => {
              const items = item.getSubmenuItems();
              if (isString(items)) {
                return items;
              } else {
                return map$2(items, makeContextItem);
              }
            }
          };
        default:
          const commonItem = item;
          return {
            type: 'menuitem',
            ...commonMenuItem(commonItem),
            onAction: noarg(commonItem.onAction)
          };
        }
      }
    };
    const addContextMenuGroup = (xs, groupItems) => {
      if (groupItems.length === 0) {
        return xs;
      }
      const lastMenuItem = last$1(xs).filter(item => !isSeparator(item));
      const before = lastMenuItem.fold(() => [], _ => [separator]);
      return xs.concat(before).concat(groupItems).concat([separator]);
    };
    const generateContextMenu = (contextMenus, menuConfig, selectedElement) => {
      const sections = foldl(menuConfig, (acc, name) => {
        return get$g(contextMenus, name.toLowerCase()).map(menu => {
          const items = menu.update(selectedElement);
          if (isString(items)) {
            return addContextMenuGroup(acc, items.split(' '));
          } else if (items.length > 0) {
            const allItems = map$2(items, makeContextItem);
            return addContextMenuGroup(acc, allItems);
          } else {
            return acc;
          }
        }).getOrThunk(() => acc.concat([name]));
      }, []);
      if (sections.length > 0 && isSeparator(sections[sections.length - 1])) {
        sections.pop();
      }
      return sections;
    };
    const isNativeOverrideKeyEvent = (editor, e) => e.ctrlKey && !shouldNeverUseNative(editor);
    const isTouchEvent = e => e.type === 'longpress' || has$2(e, 'touches');
    const isTriggeredByKeyboard = (editor, e) => !isTouchEvent(e) && (e.button !== 2 || e.target === editor.getBody() && e.pointerType === '');
    const getSelectedElement = (editor, e) => isTriggeredByKeyboard(editor, e) ? editor.selection.getStart(true) : e.target;
    const getAnchorType = (editor, e) => {
      const selector = getAvoidOverlapSelector(editor);
      const anchorType = isTriggeredByKeyboard(editor, e) ? 'selection' : 'point';
      if (isNotEmpty(selector)) {
        const target = getSelectedElement(editor, e);
        const selectorExists = closest(SugarElement.fromDom(target), selector);
        return selectorExists ? 'node' : anchorType;
      } else {
        return anchorType;
      }
    };
    const setup$5 = (editor, lazySink, backstage) => {
      const detection = detect$1();
      const isTouch = detection.deviceType.isTouch;
      const contextmenu = build$1(InlineView.sketch({
        dom: { tag: 'div' },
        lazySink,
        onEscape: () => editor.focus(),
        onShow: () => backstage.setContextMenuState(true),
        onHide: () => backstage.setContextMenuState(false),
        fireDismissalEventInstead: {},
        inlineBehaviours: derive$1([config('dismissContextMenu', [run$1(dismissRequested(), (comp, _se) => {
              Sandboxing.close(comp);
              editor.focus();
            })])])
      }));
      const hideContextMenu = () => InlineView.hide(contextmenu);
      const showContextMenu = e => {
        if (shouldNeverUseNative(editor)) {
          e.preventDefault();
        }
        if (isNativeOverrideKeyEvent(editor, e) || isContextMenuDisabled(editor)) {
          return;
        }
        const anchorType = getAnchorType(editor, e);
        const buildMenu = () => {
          const selectedElement = getSelectedElement(editor, e);
          const registry = editor.ui.registry.getAll();
          const menuConfig = getContextMenu(editor);
          return generateContextMenu(registry.contextMenus, menuConfig, selectedElement);
        };
        const initAndShow$2 = isTouch() ? initAndShow : initAndShow$1;
        initAndShow$2(editor, e, buildMenu, backstage, contextmenu, anchorType);
      };
      editor.on('init', () => {
        const hideEvents = 'ResizeEditor ScrollContent ScrollWindow longpresscancel' + (isTouch() ? '' : ' ResizeWindow');
        editor.on(hideEvents, hideContextMenu);
        editor.on('longpress contextmenu', showContextMenu);
      });
    };

    const adt = Adt.generate([
      {
        offset: [
          'x',
          'y'
        ]
      },
      {
        absolute: [
          'x',
          'y'
        ]
      },
      {
        fixed: [
          'x',
          'y'
        ]
      }
    ]);
    const subtract = change => point => point.translate(-change.left, -change.top);
    const add = change => point => point.translate(change.left, change.top);
    const transform = changes => (x, y) => foldl(changes, (rest, f) => f(rest), SugarPosition(x, y));
    const asFixed = (coord, scroll, origin) => coord.fold(transform([
      add(origin),
      subtract(scroll)
    ]), transform([subtract(scroll)]), transform([]));
    const asAbsolute = (coord, scroll, origin) => coord.fold(transform([add(origin)]), transform([]), transform([add(scroll)]));
    const asOffset = (coord, scroll, origin) => coord.fold(transform([]), transform([subtract(origin)]), transform([
      add(scroll),
      subtract(origin)
    ]));
    const withinRange = (coord1, coord2, xRange, yRange, scroll, origin) => {
      const a1 = asAbsolute(coord1, scroll, origin);
      const a2 = asAbsolute(coord2, scroll, origin);
      return Math.abs(a1.left - a2.left) <= xRange && Math.abs(a1.top - a2.top) <= yRange;
    };
    const getDeltas = (coord1, coord2, xRange, yRange, scroll, origin) => {
      const a1 = asAbsolute(coord1, scroll, origin);
      const a2 = asAbsolute(coord2, scroll, origin);
      const left = Math.abs(a1.left - a2.left);
      const top = Math.abs(a1.top - a2.top);
      return SugarPosition(left, top);
    };
    const toStyles = (coord, scroll, origin) => {
      const stylesOpt = coord.fold((x, y) => ({
        position: Optional.some('absolute'),
        left: Optional.some(x + 'px'),
        top: Optional.some(y + 'px')
      }), (x, y) => ({
        position: Optional.some('absolute'),
        left: Optional.some(x - origin.left + 'px'),
        top: Optional.some(y - origin.top + 'px')
      }), (x, y) => ({
        position: Optional.some('fixed'),
        left: Optional.some(x + 'px'),
        top: Optional.some(y + 'px')
      }));
      return {
        right: Optional.none(),
        bottom: Optional.none(),
        ...stylesOpt
      };
    };
    const translate = (coord, deltaX, deltaY) => coord.fold((x, y) => offset(x + deltaX, y + deltaY), (x, y) => absolute(x + deltaX, y + deltaY), (x, y) => fixed(x + deltaX, y + deltaY));
    const absorb = (partialCoord, originalCoord, scroll, origin) => {
      const absorbOne = (stencil, nu) => (optX, optY) => {
        const original = stencil(originalCoord, scroll, origin);
        return nu(optX.getOr(original.left), optY.getOr(original.top));
      };
      return partialCoord.fold(absorbOne(asOffset, offset), absorbOne(asAbsolute, absolute), absorbOne(asFixed, fixed));
    };
    const offset = adt.offset;
    const absolute = adt.absolute;
    const fixed = adt.fixed;

    const parseAttrToInt = (element, name) => {
      const value = get$f(element, name);
      return isUndefined(value) ? NaN : parseInt(value, 10);
    };
    const get = (component, snapsInfo) => {
      const element = component.element;
      const x = parseAttrToInt(element, snapsInfo.leftAttr);
      const y = parseAttrToInt(element, snapsInfo.topAttr);
      return isNaN(x) || isNaN(y) ? Optional.none() : Optional.some(SugarPosition(x, y));
    };
    const set = (component, snapsInfo, pt) => {
      const element = component.element;
      set$9(element, snapsInfo.leftAttr, pt.left + 'px');
      set$9(element, snapsInfo.topAttr, pt.top + 'px');
    };
    const clear = (component, snapsInfo) => {
      const element = component.element;
      remove$7(element, snapsInfo.leftAttr);
      remove$7(element, snapsInfo.topAttr);
    };

    const getCoords = (component, snapInfo, coord, delta) => get(component, snapInfo).fold(() => coord, fixed$1 => fixed(fixed$1.left + delta.left, fixed$1.top + delta.top));
    const moveOrSnap = (component, snapInfo, coord, delta, scroll, origin) => {
      const newCoord = getCoords(component, snapInfo, coord, delta);
      const snap = snapInfo.mustSnap ? findClosestSnap(component, snapInfo, newCoord, scroll, origin) : findSnap(component, snapInfo, newCoord, scroll, origin);
      const fixedCoord = asFixed(newCoord, scroll, origin);
      set(component, snapInfo, fixedCoord);
      return snap.fold(() => ({
        coord: fixed(fixedCoord.left, fixedCoord.top),
        extra: Optional.none()
      }), spanned => ({
        coord: spanned.output,
        extra: spanned.extra
      }));
    };
    const stopDrag = (component, snapInfo) => {
      clear(component, snapInfo);
    };
    const findMatchingSnap = (snaps, newCoord, scroll, origin) => findMap(snaps, snap => {
      const sensor = snap.sensor;
      const inRange = withinRange(newCoord, sensor, snap.range.left, snap.range.top, scroll, origin);
      return inRange ? Optional.some({
        output: absorb(snap.output, newCoord, scroll, origin),
        extra: snap.extra
      }) : Optional.none();
    });
    const findClosestSnap = (component, snapInfo, newCoord, scroll, origin) => {
      const snaps = snapInfo.getSnapPoints(component);
      const matchSnap = findMatchingSnap(snaps, newCoord, scroll, origin);
      return matchSnap.orThunk(() => {
        const bestSnap = foldl(snaps, (acc, snap) => {
          const sensor = snap.sensor;
          const deltas = getDeltas(newCoord, sensor, snap.range.left, snap.range.top, scroll, origin);
          return acc.deltas.fold(() => ({
            deltas: Optional.some(deltas),
            snap: Optional.some(snap)
          }), bestDeltas => {
            const currAvg = (deltas.left + deltas.top) / 2;
            const bestAvg = (bestDeltas.left + bestDeltas.top) / 2;
            if (currAvg <= bestAvg) {
              return {
                deltas: Optional.some(deltas),
                snap: Optional.some(snap)
              };
            } else {
              return acc;
            }
          });
        }, {
          deltas: Optional.none(),
          snap: Optional.none()
        });
        return bestSnap.snap.map(snap => ({
          output: absorb(snap.output, newCoord, scroll, origin),
          extra: snap.extra
        }));
      });
    };
    const findSnap = (component, snapInfo, newCoord, scroll, origin) => {
      const snaps = snapInfo.getSnapPoints(component);
      return findMatchingSnap(snaps, newCoord, scroll, origin);
    };
    const snapTo$1 = (snap, scroll, origin) => ({
      coord: absorb(snap.output, snap.output, scroll, origin),
      extra: snap.extra
    });

    const snapTo = (component, dragConfig, _state, snap) => {
      const target = dragConfig.getTarget(component.element);
      if (dragConfig.repositionTarget) {
        const doc = owner$4(component.element);
        const scroll = get$b(doc);
        const origin = getOrigin(target);
        const snapPin = snapTo$1(snap, scroll, origin);
        const styles = toStyles(snapPin.coord, scroll, origin);
        setOptions(target, styles);
      }
    };

    var DraggingApis = /*#__PURE__*/Object.freeze({
        __proto__: null,
        snapTo: snapTo
    });

    const initialAttribute = 'data-initial-z-index';
    const resetZIndex = blocker => {
      parent(blocker.element).filter(isElement$1).each(root => {
        getOpt(root, initialAttribute).fold(() => remove$6(root, 'z-index'), zIndex => set$8(root, 'z-index', zIndex));
        remove$7(root, initialAttribute);
      });
    };
    const changeZIndex = blocker => {
      parent(blocker.element).filter(isElement$1).each(root => {
        getRaw(root, 'z-index').each(zindex => {
          set$9(root, initialAttribute, zindex);
        });
        set$8(root, 'z-index', get$e(blocker.element, 'z-index'));
      });
    };
    const instigate = (anyComponent, blocker) => {
      anyComponent.getSystem().addToGui(blocker);
      changeZIndex(blocker);
    };
    const discard = blocker => {
      resetZIndex(blocker);
      blocker.getSystem().removeFromGui(blocker);
    };
    const createComponent = (component, blockerClass, blockerEvents) => component.getSystem().build(Container.sketch({
      dom: {
        styles: {
          'left': '0px',
          'top': '0px',
          'width': '100%',
          'height': '100%',
          'position': 'fixed',
          'z-index': '1000000000000000'
        },
        classes: [blockerClass]
      },
      events: blockerEvents
    }));

    var SnapSchema = optionObjOf('snaps', [
      required$1('getSnapPoints'),
      onHandler('onSensor'),
      required$1('leftAttr'),
      required$1('topAttr'),
      defaulted('lazyViewport', win),
      defaulted('mustSnap', false)
    ]);

    const schema$6 = [
      defaulted('useFixed', never),
      required$1('blockerClass'),
      defaulted('getTarget', identity),
      defaulted('onDrag', noop),
      defaulted('repositionTarget', true),
      defaulted('onDrop', noop),
      defaultedFunction('getBounds', win),
      SnapSchema
    ];

    const getCurrentCoord = target => lift3(getRaw(target, 'left'), getRaw(target, 'top'), getRaw(target, 'position'), (left, top, position) => {
      const nu = position === 'fixed' ? fixed : offset;
      return nu(parseInt(left, 10), parseInt(top, 10));
    }).getOrThunk(() => {
      const location = absolute$3(target);
      return absolute(location.left, location.top);
    });
    const clampCoords = (component, coords, scroll, origin, startData) => {
      const bounds = startData.bounds;
      const absoluteCoord = asAbsolute(coords, scroll, origin);
      const newX = clamp(absoluteCoord.left, bounds.x, bounds.x + bounds.width - startData.width);
      const newY = clamp(absoluteCoord.top, bounds.y, bounds.y + bounds.height - startData.height);
      const newCoords = absolute(newX, newY);
      return coords.fold(() => {
        const offset$1 = asOffset(newCoords, scroll, origin);
        return offset(offset$1.left, offset$1.top);
      }, constant$1(newCoords), () => {
        const fixed$1 = asFixed(newCoords, scroll, origin);
        return fixed(fixed$1.left, fixed$1.top);
      });
    };
    const calcNewCoord = (component, optSnaps, currentCoord, scroll, origin, delta, startData) => {
      const newCoord = optSnaps.fold(() => {
        const translated = translate(currentCoord, delta.left, delta.top);
        const fixedCoord = asFixed(translated, scroll, origin);
        return fixed(fixedCoord.left, fixedCoord.top);
      }, snapInfo => {
        const snapping = moveOrSnap(component, snapInfo, currentCoord, delta, scroll, origin);
        snapping.extra.each(extra => {
          snapInfo.onSensor(component, extra);
        });
        return snapping.coord;
      });
      return clampCoords(component, newCoord, scroll, origin, startData);
    };
    const dragBy = (component, dragConfig, startData, delta) => {
      const target = dragConfig.getTarget(component.element);
      if (dragConfig.repositionTarget) {
        const doc = owner$4(component.element);
        const scroll = get$b(doc);
        const origin = getOrigin(target);
        const currentCoord = getCurrentCoord(target);
        const newCoord = calcNewCoord(component, dragConfig.snaps, currentCoord, scroll, origin, delta, startData);
        const styles = toStyles(newCoord, scroll, origin);
        setOptions(target, styles);
      }
      dragConfig.onDrag(component, target, delta);
    };

    const calcStartData = (dragConfig, comp) => ({
      bounds: dragConfig.getBounds(),
      height: getOuter$2(comp.element),
      width: getOuter$1(comp.element)
    });
    const move = (component, dragConfig, dragState, dragMode, event) => {
      const delta = dragState.update(dragMode, event);
      const dragStartData = dragState.getStartData().getOrThunk(() => calcStartData(dragConfig, component));
      delta.each(dlt => {
        dragBy(component, dragConfig, dragStartData, dlt);
      });
    };
    const stop = (component, blocker, dragConfig, dragState) => {
      blocker.each(discard);
      dragConfig.snaps.each(snapInfo => {
        stopDrag(component, snapInfo);
      });
      const target = dragConfig.getTarget(component.element);
      dragState.reset();
      dragConfig.onDrop(component, target);
    };
    const handlers = events => (dragConfig, dragState) => {
      const updateStartState = comp => {
        dragState.setStartData(calcStartData(dragConfig, comp));
      };
      return derive$2([
        run$1(windowScroll(), comp => {
          dragState.getStartData().each(() => updateStartState(comp));
        }),
        ...events(dragConfig, dragState, updateStartState)
      ]);
    };

    const init$2 = dragApi => derive$2([
      run$1(mousedown(), dragApi.forceDrop),
      run$1(mouseup(), dragApi.drop),
      run$1(mousemove(), (comp, simulatedEvent) => {
        dragApi.move(simulatedEvent.event);
      }),
      run$1(mouseout(), dragApi.delayDrop)
    ]);

    const getData$1 = event => Optional.from(SugarPosition(event.x, event.y));
    const getDelta$1 = (old, nu) => SugarPosition(nu.left - old.left, nu.top - old.top);

    var MouseData = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getData: getData$1,
        getDelta: getDelta$1
    });

    const events$2 = (dragConfig, dragState, updateStartState) => [run$1(mousedown(), (component, simulatedEvent) => {
        const raw = simulatedEvent.event.raw;
        if (raw.button !== 0) {
          return;
        }
        simulatedEvent.stop();
        const stop$1 = () => stop(component, Optional.some(blocker), dragConfig, dragState);
        const delayDrop = DelayedFunction(stop$1, 200);
        const dragApi = {
          drop: stop$1,
          delayDrop: delayDrop.schedule,
          forceDrop: stop$1,
          move: event => {
            delayDrop.cancel();
            move(component, dragConfig, dragState, MouseData, event);
          }
        };
        const blocker = createComponent(component, dragConfig.blockerClass, init$2(dragApi));
        const start = () => {
          updateStartState(component);
          instigate(component, blocker);
        };
        start();
      })];
    const schema$5 = [
      ...schema$6,
      output$1('dragger', { handlers: handlers(events$2) })
    ];

    const init$1 = dragApi => derive$2([
      run$1(touchstart(), dragApi.forceDrop),
      run$1(touchend(), dragApi.drop),
      run$1(touchcancel(), dragApi.drop),
      run$1(touchmove(), (comp, simulatedEvent) => {
        dragApi.move(simulatedEvent.event);
      })
    ]);

    const getDataFrom = touches => {
      const touch = touches[0];
      return Optional.some(SugarPosition(touch.clientX, touch.clientY));
    };
    const getData = event => {
      const raw = event.raw;
      const touches = raw.touches;
      return touches.length === 1 ? getDataFrom(touches) : Optional.none();
    };
    const getDelta = (old, nu) => SugarPosition(nu.left - old.left, nu.top - old.top);

    var TouchData = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getData: getData,
        getDelta: getDelta
    });

    const events$1 = (dragConfig, dragState, updateStartState) => {
      const blockerSingleton = value$2();
      const stopBlocking = component => {
        stop(component, blockerSingleton.get(), dragConfig, dragState);
        blockerSingleton.clear();
      };
      return [
        run$1(touchstart(), (component, simulatedEvent) => {
          simulatedEvent.stop();
          const stop = () => stopBlocking(component);
          const dragApi = {
            drop: stop,
            delayDrop: noop,
            forceDrop: stop,
            move: event => {
              move(component, dragConfig, dragState, TouchData, event);
            }
          };
          const blocker = createComponent(component, dragConfig.blockerClass, init$1(dragApi));
          blockerSingleton.set(blocker);
          const start = () => {
            updateStartState(component);
            instigate(component, blocker);
          };
          start();
        }),
        run$1(touchmove(), (component, simulatedEvent) => {
          simulatedEvent.stop();
          move(component, dragConfig, dragState, TouchData, simulatedEvent.event);
        }),
        run$1(touchend(), (component, simulatedEvent) => {
          simulatedEvent.stop();
          stopBlocking(component);
        }),
        run$1(touchcancel(), stopBlocking)
      ];
    };
    const schema$4 = [
      ...schema$6,
      output$1('dragger', { handlers: handlers(events$1) })
    ];

    const events = (dragConfig, dragState, updateStartState) => [
      ...events$2(dragConfig, dragState, updateStartState),
      ...events$1(dragConfig, dragState, updateStartState)
    ];
    const schema$3 = [
      ...schema$6,
      output$1('dragger', { handlers: handlers(events) })
    ];

    const mouse = schema$5;
    const touch = schema$4;
    const mouseOrTouch = schema$3;

    var DraggingBranches = /*#__PURE__*/Object.freeze({
        __proto__: null,
        mouse: mouse,
        touch: touch,
        mouseOrTouch: mouseOrTouch
    });

    const init = () => {
      let previous = Optional.none();
      let startData = Optional.none();
      const reset = () => {
        previous = Optional.none();
        startData = Optional.none();
      };
      const calculateDelta = (mode, nu) => {
        const result = previous.map(old => mode.getDelta(old, nu));
        previous = Optional.some(nu);
        return result;
      };
      const update = (mode, dragEvent) => mode.getData(dragEvent).bind(nuData => calculateDelta(mode, nuData));
      const setStartData = data => {
        startData = Optional.some(data);
      };
      const getStartData = () => startData;
      const readState = constant$1({});
      return nu$8({
        readState,
        reset,
        update,
        getStartData,
        setStartData
      });
    };

    var DragState = /*#__PURE__*/Object.freeze({
        __proto__: null,
        init: init
    });

    const Dragging = createModes({
      branchKey: 'mode',
      branches: DraggingBranches,
      name: 'dragging',
      active: {
        events: (dragConfig, dragState) => {
          const dragger = dragConfig.dragger;
          return dragger.handlers(dragConfig, dragState);
        }
      },
      extra: {
        snap: sConfig => ({
          sensor: sConfig.sensor,
          range: sConfig.range,
          output: sConfig.output,
          extra: Optional.from(sConfig.extra)
        })
      },
      state: DragState,
      apis: DraggingApis
    });

    const snapWidth = 40;
    const snapOffset = snapWidth / 2;
    const calcSnap = (selectorOpt, td, x, y, width, height) => selectorOpt.fold(() => Dragging.snap({
      sensor: absolute(x - snapOffset, y - snapOffset),
      range: SugarPosition(width, height),
      output: absolute(Optional.some(x), Optional.some(y)),
      extra: { td }
    }), selectorHandle => {
      const sensorLeft = x - snapOffset;
      const sensorTop = y - snapOffset;
      const sensorWidth = snapWidth;
      const sensorHeight = snapWidth;
      const rect = selectorHandle.element.dom.getBoundingClientRect();
      return Dragging.snap({
        sensor: absolute(sensorLeft, sensorTop),
        range: SugarPosition(sensorWidth, sensorHeight),
        output: absolute(Optional.some(x - rect.width / 2), Optional.some(y - rect.height / 2)),
        extra: { td }
      });
    });
    const getSnapsConfig = (getSnapPoints, cell, onChange) => {
      const isSameCell = (cellOpt, td) => cellOpt.exists(currentTd => eq(currentTd, td));
      return {
        getSnapPoints,
        leftAttr: 'data-drag-left',
        topAttr: 'data-drag-top',
        onSensor: (component, extra) => {
          const td = extra.td;
          if (!isSameCell(cell.get(), td)) {
            cell.set(td);
            onChange(td);
          }
        },
        mustSnap: true
      };
    };
    const createSelector = snaps => record(Button.sketch({
      dom: {
        tag: 'div',
        classes: ['tox-selector']
      },
      buttonBehaviours: derive$1([
        Dragging.config({
          mode: 'mouseOrTouch',
          blockerClass: 'blocker',
          snaps
        }),
        Unselecting.config({})
      ]),
      eventOrder: {
        mousedown: [
          'dragging',
          'alloy.base.behaviour'
        ],
        touchstart: [
          'dragging',
          'alloy.base.behaviour'
        ]
      }
    }));
    const setup$4 = (editor, sink) => {
      const tlTds = Cell([]);
      const brTds = Cell([]);
      const isVisible = Cell(false);
      const startCell = value$2();
      const finishCell = value$2();
      const getTopLeftSnap = td => {
        const box = absolute$2(td);
        return calcSnap(memTopLeft.getOpt(sink), td, box.x, box.y, box.width, box.height);
      };
      const getTopLeftSnaps = () => map$2(tlTds.get(), td => getTopLeftSnap(td));
      const getBottomRightSnap = td => {
        const box = absolute$2(td);
        return calcSnap(memBottomRight.getOpt(sink), td, box.right, box.bottom, box.width, box.height);
      };
      const getBottomRightSnaps = () => map$2(brTds.get(), td => getBottomRightSnap(td));
      const topLeftSnaps = getSnapsConfig(getTopLeftSnaps, startCell, start => {
        finishCell.get().each(finish => {
          editor.dispatch('TableSelectorChange', {
            start,
            finish
          });
        });
      });
      const bottomRightSnaps = getSnapsConfig(getBottomRightSnaps, finishCell, finish => {
        startCell.get().each(start => {
          editor.dispatch('TableSelectorChange', {
            start,
            finish
          });
        });
      });
      const memTopLeft = createSelector(topLeftSnaps);
      const memBottomRight = createSelector(bottomRightSnaps);
      const topLeft = build$1(memTopLeft.asSpec());
      const bottomRight = build$1(memBottomRight.asSpec());
      const showOrHideHandle = (selector, cell, isAbove, isBelow) => {
        const cellRect = cell.dom.getBoundingClientRect();
        remove$6(selector.element, 'display');
        const viewportHeight = defaultView(SugarElement.fromDom(editor.getBody())).dom.innerHeight;
        const aboveViewport = isAbove(cellRect);
        const belowViewport = isBelow(cellRect, viewportHeight);
        if (aboveViewport || belowViewport) {
          set$8(selector.element, 'display', 'none');
        }
      };
      const snapTo = (selector, cell, getSnapConfig, pos) => {
        const snap = getSnapConfig(cell);
        Dragging.snapTo(selector, snap);
        const isAbove = rect => rect[pos] < 0;
        const isBelow = (rect, viewportHeight) => rect[pos] > viewportHeight;
        showOrHideHandle(selector, cell, isAbove, isBelow);
      };
      const snapTopLeft = cell => snapTo(topLeft, cell, getTopLeftSnap, 'top');
      const snapLastTopLeft = () => startCell.get().each(snapTopLeft);
      const snapBottomRight = cell => snapTo(bottomRight, cell, getBottomRightSnap, 'bottom');
      const snapLastBottomRight = () => finishCell.get().each(snapBottomRight);
      if (detect$1().deviceType.isTouch()) {
        editor.on('TableSelectionChange', e => {
          if (!isVisible.get()) {
            attach(sink, topLeft);
            attach(sink, bottomRight);
            isVisible.set(true);
          }
          startCell.set(e.start);
          finishCell.set(e.finish);
          e.otherCells.each(otherCells => {
            tlTds.set(otherCells.upOrLeftCells);
            brTds.set(otherCells.downOrRightCells);
            snapTopLeft(e.start);
            snapBottomRight(e.finish);
          });
        });
        editor.on('ResizeEditor ResizeWindow ScrollContent', () => {
          snapLastTopLeft();
          snapLastBottomRight();
        });
        editor.on('TableSelectionClear', () => {
          if (isVisible.get()) {
            detach(topLeft);
            detach(bottomRight);
            isVisible.set(false);
          }
          startCell.clear();
          finishCell.clear();
        });
      }
    };

    var Logo = "<svg width=\"50px\" height=\"16px\" viewBox=\"0 0 50 16\" xmlns=\"http://www.w3.org/2000/svg\">\n  <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M10.143 0c2.608.015 5.186 2.178 5.186 5.331 0 0 .077 3.812-.084 4.87-.361 2.41-2.164 4.074-4.65 4.496-1.453.284-2.523.49-3.212.623-.373.071-.634.122-.785.152-.184.038-.997.145-1.35.145-2.732 0-5.21-2.04-5.248-5.33 0 0 0-3.514.03-4.442.093-2.4 1.758-4.342 4.926-4.963 0 0 3.875-.752 4.036-.782.368-.07.775-.1 1.15-.1Zm1.826 2.8L5.83 3.989v2.393l-2.455.475v5.968l6.137-1.189V9.243l2.456-.476V2.8ZM5.83 6.382l3.682-.713v3.574l-3.682.713V6.382Zm27.173-1.64-.084-1.066h-2.226v9.132h2.456V7.743c-.008-1.151.998-2.064 2.149-2.072 1.15-.008 1.987.92 1.995 2.072v5.065h2.455V7.359c-.015-2.18-1.657-3.929-3.837-3.913a3.993 3.993 0 0 0-2.908 1.296Zm-6.3-4.266L29.16 0v2.387l-2.456.475V.476Zm0 3.2v9.132h2.456V3.676h-2.456Zm18.179 11.787L49.11 3.676H46.58l-1.612 4.527-.46 1.382-.384-1.382-1.611-4.527H39.98l3.3 9.132L42.15 16l2.732-.537ZM22.867 9.738c0 .752.568 1.075.921 1.075.353 0 .668-.047.998-.154l.537 1.765c-.23.154-.92.537-2.225.537-1.305 0-2.655-.997-2.686-2.686a136.877 136.877 0 0 1 0-4.374H18.8V3.676h1.612v-1.98l2.455-.476v2.456h2.302V5.9h-2.302v3.837Z\"/>\n</svg>\n";

    const isHidden = elm => elm.nodeName === 'BR' || !!elm.getAttribute('data-mce-bogus') || elm.getAttribute('data-mce-type') === 'bookmark';
    const renderElementPath = (editor, settings, providersBackstage) => {
      var _a;
      const delimiter = (_a = settings.delimiter) !== null && _a !== void 0 ? _a : '\u203A';
      const renderElement = (name, element, index) => Button.sketch({
        dom: {
          tag: 'div',
          classes: ['tox-statusbar__path-item'],
          attributes: {
            'data-index': index,
            'aria-level': index + 1
          }
        },
        components: [text$1(name)],
        action: _btn => {
          editor.focus();
          editor.selection.select(element);
          editor.nodeChanged();
        },
        buttonBehaviours: derive$1([
          DisablingConfigs.button(providersBackstage.isDisabled),
          receivingConfig()
        ])
      });
      const renderDivider = () => ({
        dom: {
          tag: 'div',
          classes: ['tox-statusbar__path-divider'],
          attributes: { 'aria-hidden': true }
        },
        components: [text$1(` ${ delimiter } `)]
      });
      const renderPathData = data => foldl(data, (acc, path, index) => {
        const element = renderElement(path.name, path.element, index);
        if (index === 0) {
          return acc.concat([element]);
        } else {
          return acc.concat([
            renderDivider(),
            element
          ]);
        }
      }, []);
      const updatePath = parents => {
        const newPath = [];
        let i = parents.length;
        while (i-- > 0) {
          const parent = parents[i];
          if (parent.nodeType === 1 && !isHidden(parent)) {
            const args = fireResolveName(editor, parent);
            if (!args.isDefaultPrevented()) {
              newPath.push({
                name: args.name,
                element: parent
              });
            }
            if (args.isPropagationStopped()) {
              break;
            }
          }
        }
        return newPath;
      };
      return {
        dom: {
          tag: 'div',
          classes: ['tox-statusbar__path'],
          attributes: { role: 'navigation' }
        },
        behaviours: derive$1([
          Keying.config({
            mode: 'flow',
            selector: 'div[role=button]'
          }),
          Disabling.config({ disabled: providersBackstage.isDisabled }),
          receivingConfig(),
          Tabstopping.config({}),
          Replacing.config({}),
          config('elementPathEvents', [runOnAttached((comp, _e) => {
              editor.shortcuts.add('alt+F11', 'focus statusbar elementpath', () => Keying.focusIn(comp));
              editor.on('NodeChange', e => {
                const newPath = updatePath(e.parents);
                const newChildren = newPath.length > 0 ? renderPathData(newPath) : [];
                Replacing.set(comp, newChildren);
              });
            })])
        ]),
        components: []
      };
    };

    var ResizeTypes;
    (function (ResizeTypes) {
      ResizeTypes[ResizeTypes['None'] = 0] = 'None';
      ResizeTypes[ResizeTypes['Both'] = 1] = 'Both';
      ResizeTypes[ResizeTypes['Vertical'] = 2] = 'Vertical';
    }(ResizeTypes || (ResizeTypes = {})));
    const getDimensions = (editor, deltas, resizeType, originalHeight, originalWidth) => {
      const dimensions = { height: calcCappedSize(originalHeight + deltas.top, getMinHeightOption(editor), getMaxHeightOption(editor)) };
      if (resizeType === ResizeTypes.Both) {
        dimensions.width = calcCappedSize(originalWidth + deltas.left, getMinWidthOption(editor), getMaxWidthOption(editor));
      }
      return dimensions;
    };
    const resize = (editor, deltas, resizeType) => {
      const container = SugarElement.fromDom(editor.getContainer());
      const dimensions = getDimensions(editor, deltas, resizeType, get$d(container), get$c(container));
      each(dimensions, (val, dim) => {
        if (isNumber(val)) {
          set$8(container, dim, numToPx(val));
        }
      });
      fireResizeEditor(editor);
    };

    const getResizeType = editor => {
      const resize = getResize(editor);
      if (resize === false) {
        return ResizeTypes.None;
      } else if (resize === 'both') {
        return ResizeTypes.Both;
      } else {
        return ResizeTypes.Vertical;
      }
    };
    const keyboardHandler = (editor, resizeType, x, y) => {
      const scale = 20;
      const delta = SugarPosition(x * scale, y * scale);
      resize(editor, delta, resizeType);
      return Optional.some(true);
    };
    const renderResizeHandler = (editor, providersBackstage) => {
      const resizeType = getResizeType(editor);
      if (resizeType === ResizeTypes.None) {
        return Optional.none();
      }
      return Optional.some(render$3('resize-handle', {
        tag: 'div',
        classes: ['tox-statusbar__resize-handle'],
        attributes: { title: providersBackstage.translate('Resize') },
        behaviours: [
          Dragging.config({
            mode: 'mouse',
            repositionTarget: false,
            onDrag: (_comp, _target, delta) => resize(editor, delta, resizeType),
            blockerClass: 'tox-blocker'
          }),
          Keying.config({
            mode: 'special',
            onLeft: () => keyboardHandler(editor, resizeType, -1, 0),
            onRight: () => keyboardHandler(editor, resizeType, 1, 0),
            onUp: () => keyboardHandler(editor, resizeType, 0, -1),
            onDown: () => keyboardHandler(editor, resizeType, 0, 1)
          }),
          Tabstopping.config({}),
          Focusing.config({})
        ]
      }, providersBackstage.icons));
    };

    const renderWordCount = (editor, providersBackstage) => {
      const replaceCountText = (comp, count, mode) => Replacing.set(comp, [text$1(providersBackstage.translate([
          '{0} ' + mode,
          count[mode]
        ]))]);
      return Button.sketch({
        dom: {
          tag: 'button',
          classes: ['tox-statusbar__wordcount']
        },
        components: [],
        buttonBehaviours: derive$1([
          DisablingConfigs.button(providersBackstage.isDisabled),
          receivingConfig(),
          Tabstopping.config({}),
          Replacing.config({}),
          Representing.config({
            store: {
              mode: 'memory',
              initialValue: {
                mode: 'words',
                count: {
                  words: 0,
                  characters: 0
                }
              }
            }
          }),
          config('wordcount-events', [
            runOnExecute$1(comp => {
              const currentVal = Representing.getValue(comp);
              const newMode = currentVal.mode === 'words' ? 'characters' : 'words';
              Representing.setValue(comp, {
                mode: newMode,
                count: currentVal.count
              });
              replaceCountText(comp, currentVal.count, newMode);
            }),
            runOnAttached(comp => {
              editor.on('wordCountUpdate', e => {
                const {mode} = Representing.getValue(comp);
                Representing.setValue(comp, {
                  mode,
                  count: e.wordCount
                });
                replaceCountText(comp, e.wordCount, mode);
              });
            })
          ])
        ]),
        eventOrder: {
          [execute$5()]: [
            'disabling',
            'alloy.base.behaviour',
            'wordcount-events'
          ]
        }
      });
    };

    const renderStatusbar = (editor, providersBackstage) => {
      const renderBranding = () => {
        return {
          dom: {
            tag: 'span',
            classes: ['tox-statusbar__branding']
          },
          components: [{
              dom: {
                tag: 'a',
                attributes: {
                  'href': 'https://www.tiny.cloud/powered-by-tiny?utm_campaign=editor_referral&utm_medium=poweredby&utm_source=tinymce&utm_content=v6',
                  'rel': 'noopener',
                  'target': '_blank',
                  'aria-label': global$8.translate([
                    'Powered by {0}',
                    'Tiny'
                  ])
                },
                innerHtml: Logo.trim()
              },
              behaviours: derive$1([Focusing.config({})])
            }]
        };
      };
      const getTextComponents = () => {
        const components = [];
        if (useElementPath(editor)) {
          components.push(renderElementPath(editor, {}, providersBackstage));
        }
        if (editor.hasPlugin('wordcount')) {
          components.push(renderWordCount(editor, providersBackstage));
        }
        if (useBranding(editor)) {
          components.push(renderBranding());
        }
        if (components.length > 0) {
          return [{
              dom: {
                tag: 'div',
                classes: ['tox-statusbar__text-container']
              },
              components
            }];
        }
        return [];
      };
      const getComponents = () => {
        const components = getTextComponents();
        const resizeHandler = renderResizeHandler(editor, providersBackstage);
        return components.concat(resizeHandler.toArray());
      };
      return {
        dom: {
          tag: 'div',
          classes: ['tox-statusbar']
        },
        components: getComponents()
      };
    };

    const getLazyMothership = singleton => singleton.get().getOrDie('UI has not been rendered');
    const setup$3 = editor => {
      const isInline = editor.inline;
      const mode = isInline ? Inline : Iframe;
      const header = isStickyToolbar(editor) ? StickyHeader : StaticHeader;
      const lazySink = value$2();
      const lazyOuterContainer = value$2();
      const lazyMothership = value$2();
      const lazyUiMothership = value$2();
      const platform = detect$1();
      const isTouch = platform.deviceType.isTouch();
      const touchPlatformClass = 'tox-platform-touch';
      const deviceClasses = isTouch ? [touchPlatformClass] : [];
      const isToolbarBottom = isToolbarLocationBottom(editor);
      const toolbarMode = getToolbarMode(editor);
      const memAnchorBar = record({
        dom: {
          tag: 'div',
          classes: ['tox-anchorbar']
        }
      });
      const lazyHeader = () => lazyOuterContainer.get().bind(OuterContainer.getHeader);
      const lazySinkResult = () => Result.fromOption(lazySink.get(), 'UI has not been rendered');
      const lazyAnchorBar = () => lazyOuterContainer.get().bind(container => memAnchorBar.getOpt(container)).getOrDie('Could not find a anchor bar element');
      const lazyToolbar = () => lazyOuterContainer.get().bind(container => OuterContainer.getToolbar(container)).getOrDie('Could not find more toolbar element');
      const lazyThrobber = () => lazyOuterContainer.get().bind(container => OuterContainer.getThrobber(container)).getOrDie('Could not find throbber element');
      const backstage = init$7(lazySinkResult, editor, lazyAnchorBar);
      const makeHeaderPart = () => {
        const verticalDirAttributes = { attributes: { [Attribute]: isToolbarBottom ? AttributeValue.BottomToTop : AttributeValue.TopToBottom } };
        const partMenubar = OuterContainer.parts.menubar({
          dom: {
            tag: 'div',
            classes: ['tox-menubar']
          },
          backstage,
          onEscape: () => {
            editor.focus();
          }
        });
        const partToolbar = OuterContainer.parts.toolbar({
          dom: {
            tag: 'div',
            classes: ['tox-toolbar']
          },
          getSink: lazySinkResult,
          providers: backstage.shared.providers,
          onEscape: () => {
            editor.focus();
          },
          type: toolbarMode,
          lazyToolbar,
          lazyHeader: () => lazyHeader().getOrDie('Could not find header element'),
          ...verticalDirAttributes
        });
        const partMultipleToolbar = OuterContainer.parts['multiple-toolbar']({
          dom: {
            tag: 'div',
            classes: ['tox-toolbar-overlord']
          },
          providers: backstage.shared.providers,
          onEscape: () => {
            editor.focus();
          },
          type: toolbarMode
        });
        const hasMultipleToolbar = isMultipleToolbars(editor);
        const hasToolbar = isToolbarEnabled(editor);
        const hasMenubar = isMenubarEnabled(editor);
        const shouldHavePromotion = promotionEnabled(editor);
        const partPromotion = makePromotion();
        const getPartToolbar = () => {
          if (hasMultipleToolbar) {
            return [partMultipleToolbar];
          } else if (hasToolbar) {
            return [partToolbar];
          } else {
            return [];
          }
        };
        const menubarCollection = shouldHavePromotion ? [
          partPromotion,
          partMenubar
        ] : [partMenubar];
        return OuterContainer.parts.header({
          dom: {
            tag: 'div',
            classes: ['tox-editor-header'],
            ...verticalDirAttributes
          },
          components: flatten([
            hasMenubar ? menubarCollection : [],
            getPartToolbar(),
            useFixedContainer(editor) ? [] : [memAnchorBar.asSpec()]
          ]),
          sticky: isStickyToolbar(editor),
          editor,
          sharedBackstage: backstage.shared
        });
      };
      const makePromotion = () => {
        return OuterContainer.parts.promotion({
          dom: {
            tag: 'div',
            classes: ['tox-promotion']
          }
        });
      };
      const makeSidebarDefinition = () => {
        const partSocket = OuterContainer.parts.socket({
          dom: {
            tag: 'div',
            classes: ['tox-edit-area']
          }
        });
        const partSidebar = OuterContainer.parts.sidebar({
          dom: {
            tag: 'div',
            classes: ['tox-sidebar']
          }
        });
        return {
          dom: {
            tag: 'div',
            classes: ['tox-sidebar-wrap']
          },
          components: [
            partSocket,
            partSidebar
          ]
        };
      };
      const renderSink = () => {
        const uiContainer = getUiContainer(editor);
        const isGridUiContainer = eq(body(), uiContainer) && get$e(uiContainer, 'display') === 'grid';
        const sinkSpec = {
          dom: {
            tag: 'div',
            classes: [
              'tox',
              'tox-silver-sink',
              'tox-tinymce-aux'
            ].concat(deviceClasses),
            attributes: { ...global$8.isRtl() ? { dir: 'rtl' } : {} }
          },
          behaviours: derive$1([Positioning.config({ useFixed: () => header.isDocked(lazyHeader) })])
        };
        const reactiveWidthSpec = {
          dom: { styles: { width: document.body.clientWidth + 'px' } },
          events: derive$2([run$1(windowResize(), comp => {
              set$8(comp.element, 'width', document.body.clientWidth + 'px');
            })])
        };
        const sink = build$1(deepMerge(sinkSpec, isGridUiContainer ? reactiveWidthSpec : {}));
        const uiMothership = takeover(sink);
        lazySink.set(sink);
        lazyUiMothership.set(uiMothership);
        return {
          sink,
          uiMothership
        };
      };
      const renderContainer = () => {
        const partHeader = makeHeaderPart();
        const sidebarContainer = makeSidebarDefinition();
        const partThrobber = OuterContainer.parts.throbber({
          dom: {
            tag: 'div',
            classes: ['tox-throbber']
          },
          backstage
        });
        const statusbar = useStatusBar(editor) && !isInline ? Optional.some(renderStatusbar(editor, backstage.shared.providers)) : Optional.none();
        const editorComponents = flatten([
          isToolbarBottom ? [] : [partHeader],
          isInline ? [] : [sidebarContainer],
          isToolbarBottom ? [partHeader] : []
        ]);
        const editorContainer = {
          dom: {
            tag: 'div',
            classes: ['tox-editor-container']
          },
          components: editorComponents
        };
        const containerComponents = flatten([
          [editorContainer],
          isInline ? [] : statusbar.toArray(),
          [partThrobber]
        ]);
        const isHidden = isDistractionFree(editor);
        const attributes = {
          role: 'application',
          ...global$8.isRtl() ? { dir: 'rtl' } : {},
          ...isHidden ? { 'aria-hidden': 'true' } : {}
        };
        const outerContainer = build$1(OuterContainer.sketch({
          dom: {
            tag: 'div',
            classes: [
              'tox',
              'tox-tinymce'
            ].concat(isInline ? ['tox-tinymce-inline'] : []).concat(isToolbarBottom ? ['tox-tinymce--toolbar-bottom'] : []).concat(deviceClasses),
            styles: {
              visibility: 'hidden',
              ...isHidden ? {
                opacity: '0',
                border: '0'
              } : {}
            },
            attributes
          },
          components: containerComponents,
          behaviours: derive$1([
            receivingConfig(),
            Disabling.config({ disableClass: 'tox-tinymce--disabled' }),
            Keying.config({
              mode: 'cyclic',
              selector: '.tox-menubar, .tox-toolbar, .tox-toolbar__primary, .tox-toolbar__overflow--open, .tox-sidebar__overflow--open, .tox-statusbar__path, .tox-statusbar__wordcount, .tox-statusbar__branding a, .tox-statusbar__resize-handle'
            })
          ])
        }));
        const mothership = takeover(outerContainer);
        lazyOuterContainer.set(outerContainer);
        lazyMothership.set(mothership);
        return {
          mothership,
          outerContainer
        };
      };
      const setEditorSize = outerContainer => {
        const parsedHeight = numToPx(getHeightWithFallback(editor));
        const parsedWidth = numToPx(getWidthWithFallback(editor));
        if (!editor.inline) {
          if (isValidValue('div', 'width', parsedWidth)) {
            set$8(outerContainer.element, 'width', parsedWidth);
          }
          if (isValidValue('div', 'height', parsedHeight)) {
            set$8(outerContainer.element, 'height', parsedHeight);
          } else {
            set$8(outerContainer.element, 'height', '400px');
          }
        }
        return parsedHeight;
      };
      const setupShortcutsAndCommands = outerContainer => {
        editor.addShortcut('alt+F9', 'focus menubar', () => {
          OuterContainer.focusMenubar(outerContainer);
        });
        editor.addShortcut('alt+F10', 'focus toolbar', () => {
          OuterContainer.focusToolbar(outerContainer);
        });
        editor.addCommand('ToggleToolbarDrawer', () => {
          OuterContainer.toggleToolbarDrawer(outerContainer);
        });
        editor.addQueryStateHandler('ToggleToolbarDrawer', () => OuterContainer.isToolbarDrawerToggled(outerContainer));
      };
      const renderUI = () => {
        const {mothership, outerContainer} = renderContainer();
        const {uiMothership, sink} = renderSink();
        map$1(getToolbarGroups(editor), (toolbarGroupButtonConfig, name) => {
          editor.ui.registry.addGroupToolbarButton(name, toolbarGroupButtonConfig);
        });
        const {buttons, menuItems, contextToolbars, sidebars} = editor.ui.registry.getAll();
        const toolbarOpt = getMultipleToolbarsOption(editor);
        const rawUiConfig = {
          menuItems,
          menus: getMenus(editor),
          menubar: getMenubar(editor),
          toolbar: toolbarOpt.getOrThunk(() => getToolbar(editor)),
          allowToolbarGroups: toolbarMode === ToolbarMode$1.floating,
          buttons,
          sidebar: sidebars
        };
        setupShortcutsAndCommands(outerContainer);
        setup$b(editor, mothership, uiMothership);
        header.setup(editor, backstage.shared, lazyHeader);
        setup$6(editor, backstage);
        setup$5(editor, lazySinkResult, backstage);
        setup$8(editor);
        setup$7(editor, lazyThrobber, backstage.shared);
        register$9(editor, contextToolbars, sink, { backstage });
        setup$4(editor, sink);
        const elm = editor.getElement();
        const height = setEditorSize(outerContainer);
        const uiComponents = {
          mothership,
          uiMothership,
          outerContainer,
          sink
        };
        const args = {
          targetNode: elm,
          height
        };
        return mode.render(editor, uiComponents, rawUiConfig, backstage, args);
      };
      const getMothership = () => getLazyMothership(lazyMothership);
      const getUiMothership = () => getLazyMothership(lazyUiMothership);
      return {
        getMothership,
        getUiMothership,
        backstage,
        renderUI
      };
    };

    const describedBy = (describedElement, describeElement) => {
      const describeId = Optional.from(get$f(describedElement, 'id')).fold(() => {
        const id = generate$6('dialog-describe');
        set$9(describeElement, 'id', id);
        return id;
      }, identity);
      set$9(describedElement, 'aria-describedby', describeId);
    };

    const labelledBy = (labelledElement, labelElement) => {
      const labelId = getOpt(labelledElement, 'id').fold(() => {
        const id = generate$6('dialog-label');
        set$9(labelElement, 'id', id);
        return id;
      }, identity);
      set$9(labelledElement, 'aria-labelledby', labelId);
    };

    const schema$2 = constant$1([
      required$1('lazySink'),
      option$3('dragBlockClass'),
      defaultedFunction('getBounds', win),
      defaulted('useTabstopAt', always),
      defaulted('eventOrder', {}),
      field('modalBehaviours', [Keying]),
      onKeyboardHandler('onExecute'),
      onStrictKeyboardHandler('onEscape')
    ]);
    const basic = { sketch: identity };
    const parts$2 = constant$1([
      optional({
        name: 'draghandle',
        overrides: (detail, spec) => {
          return {
            behaviours: derive$1([Dragging.config({
                mode: 'mouse',
                getTarget: handle => {
                  return ancestor(handle, '[role="dialog"]').getOr(handle);
                },
                blockerClass: detail.dragBlockClass.getOrDie(new Error('The drag blocker class was not specified for a dialog with a drag handle: \n' + JSON.stringify(spec, null, 2)).message),
                getBounds: detail.getDragBounds
              })])
          };
        }
      }),
      required({
        schema: [required$1('dom')],
        name: 'title'
      }),
      required({
        factory: basic,
        schema: [required$1('dom')],
        name: 'close'
      }),
      required({
        factory: basic,
        schema: [required$1('dom')],
        name: 'body'
      }),
      optional({
        factory: basic,
        schema: [required$1('dom')],
        name: 'footer'
      }),
      external({
        factory: {
          sketch: (spec, detail) => ({
            ...spec,
            dom: detail.dom,
            components: detail.components
          })
        },
        schema: [
          defaulted('dom', {
            tag: 'div',
            styles: {
              position: 'fixed',
              left: '0px',
              top: '0px',
              right: '0px',
              bottom: '0px'
            }
          }),
          defaulted('components', [])
        ],
        name: 'blocker'
      })
    ]);

    const factory$4 = (detail, components, spec, externals) => {
      const dialogComp = value$2();
      const showDialog = dialog => {
        dialogComp.set(dialog);
        const sink = detail.lazySink(dialog).getOrDie();
        const externalBlocker = externals.blocker();
        const blocker = sink.getSystem().build({
          ...externalBlocker,
          components: externalBlocker.components.concat([premade(dialog)]),
          behaviours: derive$1([
            Focusing.config({}),
            config('dialog-blocker-events', [runOnSource(focusin(), () => {
                Keying.focusIn(dialog);
              })])
          ])
        });
        attach(sink, blocker);
        Keying.focusIn(dialog);
      };
      const hideDialog = dialog => {
        dialogComp.clear();
        parent(dialog.element).each(blockerDom => {
          dialog.getSystem().getByDom(blockerDom).each(blocker => {
            detach(blocker);
          });
        });
      };
      const getDialogBody = dialog => getPartOrDie(dialog, detail, 'body');
      const getDialogFooter = dialog => getPartOrDie(dialog, detail, 'footer');
      const setBusy = (dialog, getBusySpec) => {
        Blocking.block(dialog, getBusySpec);
      };
      const setIdle = dialog => {
        Blocking.unblock(dialog);
      };
      const modalEventsId = generate$6('modal-events');
      const eventOrder = {
        ...detail.eventOrder,
        [attachedToDom()]: [modalEventsId].concat(detail.eventOrder['alloy.system.attached'] || [])
      };
      return {
        uid: detail.uid,
        dom: detail.dom,
        components,
        apis: {
          show: showDialog,
          hide: hideDialog,
          getBody: getDialogBody,
          getFooter: getDialogFooter,
          setIdle,
          setBusy
        },
        eventOrder,
        domModification: {
          attributes: {
            'role': 'dialog',
            'aria-modal': 'true'
          }
        },
        behaviours: augment(detail.modalBehaviours, [
          Replacing.config({}),
          Keying.config({
            mode: 'cyclic',
            onEnter: detail.onExecute,
            onEscape: detail.onEscape,
            useTabstopAt: detail.useTabstopAt
          }),
          Blocking.config({ getRoot: dialogComp.get }),
          config(modalEventsId, [runOnAttached(c => {
              labelledBy(c.element, getPartOrDie(c, detail, 'title').element);
              describedBy(c.element, getPartOrDie(c, detail, 'body').element);
            })])
        ])
      };
    };
    const ModalDialog = composite({
      name: 'ModalDialog',
      configFields: schema$2(),
      partFields: parts$2(),
      factory: factory$4,
      apis: {
        show: (apis, dialog) => {
          apis.show(dialog);
        },
        hide: (apis, dialog) => {
          apis.hide(dialog);
        },
        getBody: (apis, dialog) => apis.getBody(dialog),
        getFooter: (apis, dialog) => apis.getFooter(dialog),
        setBusy: (apis, dialog, getBusySpec) => {
          apis.setBusy(dialog, getBusySpec);
        },
        setIdle: (apis, dialog) => {
          apis.setIdle(dialog);
        }
      }
    });

    const dialogToggleMenuItemSchema = objOf([
      type,
      name$1
    ].concat(commonMenuItemFields));
    const dialogToggleMenuItemDataProcessor = boolean;

    const baseFooterButtonFields = [
      generatedName('button'),
      optionalIcon,
      defaultedStringEnum('align', 'end', [
        'start',
        'end'
      ]),
      primary,
      enabled,
      optionStringEnum('buttonType', [
        'primary',
        'secondary'
      ])
    ];
    const dialogFooterButtonFields = [
      ...baseFooterButtonFields,
      text
    ];
    const normalFooterButtonFields = [
      requiredStringEnum('type', [
        'submit',
        'cancel',
        'custom'
      ]),
      ...dialogFooterButtonFields
    ];
    const menuFooterButtonFields = [
      requiredStringEnum('type', ['menu']),
      optionalText,
      optionalTooltip,
      optionalIcon,
      requiredArrayOf('items', dialogToggleMenuItemSchema),
      ...baseFooterButtonFields
    ];
    const dialogFooterButtonSchema = choose$1('type', {
      submit: normalFooterButtonFields,
      cancel: normalFooterButtonFields,
      custom: normalFooterButtonFields,
      menu: menuFooterButtonFields
    });

    const alertBannerFields = [
      type,
      text,
      requiredStringEnum('level', [
        'info',
        'warn',
        'error',
        'success'
      ]),
      icon,
      defaulted('url', '')
    ];
    const alertBannerSchema = objOf(alertBannerFields);

    const createBarFields = itemsField => [
      type,
      itemsField
    ];

    const buttonFields = [
      type,
      text,
      enabled,
      generatedName('button'),
      optionalIcon,
      borderless,
      optionStringEnum('buttonType', [
        'primary',
        'secondary',
        'toolbar'
      ]),
      primary
    ];
    const buttonSchema = objOf(buttonFields);

    const formComponentFields = [
      type,
      name$1
    ];
    const formComponentWithLabelFields = formComponentFields.concat([optionalLabel]);

    const checkboxFields = formComponentFields.concat([
      label,
      enabled
    ]);
    const checkboxSchema = objOf(checkboxFields);
    const checkboxDataProcessor = boolean;

    const collectionFields = formComponentWithLabelFields.concat([defaultedColumns('auto')]);
    const collectionSchema = objOf(collectionFields);
    const collectionDataProcessor = arrOfObj([
      value$1,
      text,
      icon
    ]);

    const colorInputFields = formComponentWithLabelFields;
    const colorInputSchema = objOf(colorInputFields);
    const colorInputDataProcessor = string;

    const colorPickerFields = formComponentWithLabelFields;
    const colorPickerSchema = objOf(colorPickerFields);
    const colorPickerDataProcessor = string;

    const customEditorFields = formComponentFields.concat([
      defaultedString('tag', 'textarea'),
      requiredString('scriptId'),
      requiredString('scriptUrl'),
      defaultedPostMsg('settings', undefined)
    ]);
    const customEditorFieldsOld = formComponentFields.concat([
      defaultedString('tag', 'textarea'),
      requiredFunction('init')
    ]);
    const customEditorSchema = valueOf(v => asRaw('customeditor.old', objOfOnly(customEditorFieldsOld), v).orThunk(() => asRaw('customeditor.new', objOfOnly(customEditorFields), v)));
    const customEditorDataProcessor = string;

    const dropZoneFields = formComponentWithLabelFields;
    const dropZoneSchema = objOf(dropZoneFields);
    const dropZoneDataProcessor = arrOfVal();

    const createGridFields = itemsField => [
      type,
      requiredNumber('columns'),
      itemsField
    ];

    const htmlPanelFields = [
      type,
      requiredString('html'),
      defaultedStringEnum('presets', 'presentation', [
        'presentation',
        'document'
      ])
    ];
    const htmlPanelSchema = objOf(htmlPanelFields);

    const iframeFields = formComponentWithLabelFields.concat([
      defaultedBoolean('sandboxed', true),
      defaultedBoolean('transparent', true)
    ]);
    const iframeSchema = objOf(iframeFields);
    const iframeDataProcessor = string;

    const imagePreviewSchema = objOf(formComponentFields.concat([optionString('height')]));
    const imagePreviewDataProcessor = objOf([
      requiredString('url'),
      optionNumber('zoom'),
      optionNumber('cachedWidth'),
      optionNumber('cachedHeight')
    ]);

    const inputFields = formComponentWithLabelFields.concat([
      optionString('inputMode'),
      optionString('placeholder'),
      defaultedBoolean('maximized', false),
      enabled
    ]);
    const inputSchema = objOf(inputFields);
    const inputDataProcessor = string;

    const createLabelFields = itemsField => [
      type,
      label,
      itemsField
    ];

    const listBoxSingleItemFields = [
      text,
      value$1
    ];
    const listBoxNestedItemFields = [
      text,
      requiredArrayOf('items', thunkOf('items', () => listBoxItemSchema))
    ];
    const listBoxItemSchema = oneOf([
      objOf(listBoxSingleItemFields),
      objOf(listBoxNestedItemFields)
    ]);
    const listBoxFields = formComponentWithLabelFields.concat([
      requiredArrayOf('items', listBoxItemSchema),
      enabled
    ]);
    const listBoxSchema = objOf(listBoxFields);
    const listBoxDataProcessor = string;

    const selectBoxFields = formComponentWithLabelFields.concat([
      requiredArrayOfObj('items', [
        text,
        value$1
      ]),
      defaultedNumber('size', 1),
      enabled
    ]);
    const selectBoxSchema = objOf(selectBoxFields);
    const selectBoxDataProcessor = string;

    const sizeInputFields = formComponentWithLabelFields.concat([
      defaultedBoolean('constrain', true),
      enabled
    ]);
    const sizeInputSchema = objOf(sizeInputFields);
    const sizeInputDataProcessor = objOf([
      requiredString('width'),
      requiredString('height')
    ]);

    const sliderFields = formComponentFields.concat([
      label,
      defaultedNumber('min', 0),
      defaultedNumber('max', 0)
    ]);
    const sliderSchema = objOf(sliderFields);
    const sliderInputDataProcessor = number;

    const tableFields = [
      type,
      requiredArrayOf('header', string),
      requiredArrayOf('cells', arrOf(string))
    ];
    const tableSchema = objOf(tableFields);

    const textAreaFields = formComponentWithLabelFields.concat([
      optionString('placeholder'),
      defaultedBoolean('maximized', false),
      enabled
    ]);
    const textAreaSchema = objOf(textAreaFields);
    const textAreaDataProcessor = string;

    const urlInputFields = formComponentWithLabelFields.concat([
      defaultedStringEnum('filetype', 'file', [
        'image',
        'media',
        'file'
      ]),
      enabled
    ]);
    const urlInputSchema = objOf(urlInputFields);
    const urlInputDataProcessor = objOf([
      value$1,
      defaultedMeta
    ]);

    const createItemsField = name => field$1('items', 'items', required$2(), arrOf(valueOf(v => asRaw(`Checking item of ${ name }`, itemSchema, v).fold(sErr => Result.error(formatError(sErr)), passValue => Result.value(passValue)))));
    const itemSchema = valueThunk(() => choose$2('type', {
      alertbanner: alertBannerSchema,
      bar: objOf(createBarFields(createItemsField('bar'))),
      button: buttonSchema,
      checkbox: checkboxSchema,
      colorinput: colorInputSchema,
      colorpicker: colorPickerSchema,
      dropzone: dropZoneSchema,
      grid: objOf(createGridFields(createItemsField('grid'))),
      iframe: iframeSchema,
      input: inputSchema,
      listbox: listBoxSchema,
      selectbox: selectBoxSchema,
      sizeinput: sizeInputSchema,
      slider: sliderSchema,
      textarea: textAreaSchema,
      urlinput: urlInputSchema,
      customeditor: customEditorSchema,
      htmlpanel: htmlPanelSchema,
      imagepreview: imagePreviewSchema,
      collection: collectionSchema,
      label: objOf(createLabelFields(createItemsField('label'))),
      table: tableSchema,
      panel: panelSchema
    }));
    const panelFields = [
      type,
      defaulted('classes', []),
      requiredArrayOf('items', itemSchema)
    ];
    const panelSchema = objOf(panelFields);

    const tabFields = [
      generatedName('tab'),
      title,
      requiredArrayOf('items', itemSchema)
    ];
    const tabPanelFields = [
      type,
      requiredArrayOfObj('tabs', tabFields)
    ];
    const tabPanelSchema = objOf(tabPanelFields);

    const dialogButtonFields = dialogFooterButtonFields;
    const dialogButtonSchema = dialogFooterButtonSchema;
    const dialogSchema = objOf([
      requiredString('title'),
      requiredOf('body', choose$2('type', {
        panel: panelSchema,
        tabpanel: tabPanelSchema
      })),
      defaultedString('size', 'normal'),
      requiredArrayOf('buttons', dialogButtonSchema),
      defaulted('initialData', {}),
      defaultedFunction('onAction', noop),
      defaultedFunction('onChange', noop),
      defaultedFunction('onSubmit', noop),
      defaultedFunction('onClose', noop),
      defaultedFunction('onCancel', noop),
      defaultedFunction('onTabChange', noop)
    ]);
    const createDialog = spec => asRaw('dialog', dialogSchema, spec);

    const urlDialogButtonSchema = objOf([
      requiredStringEnum('type', [
        'cancel',
        'custom'
      ]),
      ...dialogButtonFields
    ]);
    const urlDialogSchema = objOf([
      requiredString('title'),
      requiredString('url'),
      optionNumber('height'),
      optionNumber('width'),
      optionArrayOf('buttons', urlDialogButtonSchema),
      defaultedFunction('onAction', noop),
      defaultedFunction('onCancel', noop),
      defaultedFunction('onClose', noop),
      defaultedFunction('onMessage', noop)
    ]);
    const createUrlDialog = spec => asRaw('dialog', urlDialogSchema, spec);

    const getAllObjects = obj => {
      if (isObject(obj)) {
        return [obj].concat(bind$3(values(obj), getAllObjects));
      } else if (isArray(obj)) {
        return bind$3(obj, getAllObjects);
      } else {
        return [];
      }
    };

    const isNamedItem = obj => isString(obj.type) && isString(obj.name);
    const dataProcessors = {
      checkbox: checkboxDataProcessor,
      colorinput: colorInputDataProcessor,
      colorpicker: colorPickerDataProcessor,
      dropzone: dropZoneDataProcessor,
      input: inputDataProcessor,
      iframe: iframeDataProcessor,
      imagepreview: imagePreviewDataProcessor,
      selectbox: selectBoxDataProcessor,
      sizeinput: sizeInputDataProcessor,
      slider: sliderInputDataProcessor,
      listbox: listBoxDataProcessor,
      size: sizeInputDataProcessor,
      textarea: textAreaDataProcessor,
      urlinput: urlInputDataProcessor,
      customeditor: customEditorDataProcessor,
      collection: collectionDataProcessor,
      togglemenuitem: dialogToggleMenuItemDataProcessor
    };
    const getDataProcessor = item => Optional.from(dataProcessors[item.type]);
    const getNamedItems = structure => filter$2(getAllObjects(structure), isNamedItem);

    const createDataValidator = structure => {
      const namedItems = getNamedItems(structure);
      const fields = bind$3(namedItems, item => getDataProcessor(item).fold(() => [], schema => [requiredOf(item.name, schema)]));
      return objOf(fields);
    };

    const extract = structure => {
      var _a;
      const internalDialog = getOrDie(createDialog(structure));
      const dataValidator = createDataValidator(structure);
      const initialData = (_a = structure.initialData) !== null && _a !== void 0 ? _a : {};
      return {
        internalDialog,
        dataValidator,
        initialData
      };
    };
    const DialogManager = {
      open: (factory, structure) => {
        const extraction = extract(structure);
        return factory(extraction.internalDialog, extraction.initialData, extraction.dataValidator);
      },
      openUrl: (factory, structure) => {
        const internalDialog = getOrDie(createUrlDialog(structure));
        return factory(internalDialog);
      },
      redial: structure => extract(structure)
    };

    const toValidValues = values => {
      const errors = [];
      const result = {};
      each(values, (value, name) => {
        value.fold(() => {
          errors.push(name);
        }, v => {
          result[name] = v;
        });
      });
      return errors.length > 0 ? Result.error(errors) : Result.value(result);
    };

    const renderBodyPanel = (spec, dialogData, backstage) => {
      const memForm = record(Form.sketch(parts => ({
        dom: {
          tag: 'div',
          classes: ['tox-form'].concat(spec.classes)
        },
        components: map$2(spec.items, item => interpretInForm(parts, item, dialogData, backstage))
      })));
      return {
        dom: {
          tag: 'div',
          classes: ['tox-dialog__body']
        },
        components: [{
            dom: {
              tag: 'div',
              classes: ['tox-dialog__body-content']
            },
            components: [memForm.asSpec()]
          }],
        behaviours: derive$1([
          Keying.config({
            mode: 'acyclic',
            useTabstopAt: not(isPseudoStop)
          }),
          ComposingConfigs.memento(memForm),
          RepresentingConfigs.memento(memForm, {
            postprocess: formValue => toValidValues(formValue).fold(err => {
              console.error(err);
              return {};
            }, identity)
          })
        ])
      };
    };

    const factory$3 = (detail, _spec) => ({
      uid: detail.uid,
      dom: detail.dom,
      components: detail.components,
      events: events$a(detail.action),
      behaviours: augment(detail.tabButtonBehaviours, [
        Focusing.config({}),
        Keying.config({
          mode: 'execution',
          useSpace: true,
          useEnter: true
        }),
        Representing.config({
          store: {
            mode: 'memory',
            initialValue: detail.value
          }
        })
      ]),
      domModification: detail.domModification
    });
    const TabButton = single({
      name: 'TabButton',
      configFields: [
        defaulted('uid', undefined),
        required$1('value'),
        field$1('dom', 'dom', mergeWithThunk(() => ({
          attributes: {
            'role': 'tab',
            'id': generate$6('aria'),
            'aria-selected': 'false'
          }
        })), anyValue()),
        option$3('action'),
        defaulted('domModification', {}),
        field('tabButtonBehaviours', [
          Focusing,
          Keying,
          Representing
        ]),
        required$1('view')
      ],
      factory: factory$3
    });

    const schema$1 = constant$1([
      required$1('tabs'),
      required$1('dom'),
      defaulted('clickToDismiss', false),
      field('tabbarBehaviours', [
        Highlighting,
        Keying
      ]),
      markers$1([
        'tabClass',
        'selectedClass'
      ])
    ]);
    const tabsPart = group({
      factory: TabButton,
      name: 'tabs',
      unit: 'tab',
      overrides: barDetail => {
        const dismissTab$1 = (tabbar, button) => {
          Highlighting.dehighlight(tabbar, button);
          emitWith(tabbar, dismissTab(), {
            tabbar,
            button
          });
        };
        const changeTab$1 = (tabbar, button) => {
          Highlighting.highlight(tabbar, button);
          emitWith(tabbar, changeTab(), {
            tabbar,
            button
          });
        };
        return {
          action: button => {
            const tabbar = button.getSystem().getByUid(barDetail.uid).getOrDie();
            const activeButton = Highlighting.isHighlighted(tabbar, button);
            const response = (() => {
              if (activeButton && barDetail.clickToDismiss) {
                return dismissTab$1;
              } else if (!activeButton) {
                return changeTab$1;
              } else {
                return noop;
              }
            })();
            response(tabbar, button);
          },
          domModification: { classes: [barDetail.markers.tabClass] }
        };
      }
    });
    const parts$1 = constant$1([tabsPart]);

    const factory$2 = (detail, components, _spec, _externals) => ({
      'uid': detail.uid,
      'dom': detail.dom,
      components,
      'debug.sketcher': 'Tabbar',
      'domModification': { attributes: { role: 'tablist' } },
      'behaviours': augment(detail.tabbarBehaviours, [
        Highlighting.config({
          highlightClass: detail.markers.selectedClass,
          itemClass: detail.markers.tabClass,
          onHighlight: (tabbar, tab) => {
            set$9(tab.element, 'aria-selected', 'true');
          },
          onDehighlight: (tabbar, tab) => {
            set$9(tab.element, 'aria-selected', 'false');
          }
        }),
        Keying.config({
          mode: 'flow',
          getInitial: tabbar => {
            return Highlighting.getHighlighted(tabbar).map(tab => tab.element);
          },
          selector: '.' + detail.markers.tabClass,
          executeOnMove: true
        })
      ])
    });
    const Tabbar = composite({
      name: 'Tabbar',
      configFields: schema$1(),
      partFields: parts$1(),
      factory: factory$2
    });

    const factory$1 = (detail, _spec) => ({
      uid: detail.uid,
      dom: detail.dom,
      behaviours: augment(detail.tabviewBehaviours, [Replacing.config({})]),
      domModification: { attributes: { role: 'tabpanel' } }
    });
    const Tabview = single({
      name: 'Tabview',
      configFields: [field('tabviewBehaviours', [Replacing])],
      factory: factory$1
    });

    const schema = constant$1([
      defaulted('selectFirst', true),
      onHandler('onChangeTab'),
      onHandler('onDismissTab'),
      defaulted('tabs', []),
      field('tabSectionBehaviours', [])
    ]);
    const barPart = required({
      factory: Tabbar,
      schema: [
        required$1('dom'),
        requiredObjOf('markers', [
          required$1('tabClass'),
          required$1('selectedClass')
        ])
      ],
      name: 'tabbar',
      defaults: detail => {
        return { tabs: detail.tabs };
      }
    });
    const viewPart = required({
      factory: Tabview,
      name: 'tabview'
    });
    const parts = constant$1([
      barPart,
      viewPart
    ]);

    const factory = (detail, components, _spec, _externals) => {
      const changeTab$1 = button => {
        const tabValue = Representing.getValue(button);
        getPart(button, detail, 'tabview').each(tabview => {
          const tabWithValue = find$5(detail.tabs, t => t.value === tabValue);
          tabWithValue.each(tabData => {
            const panel = tabData.view();
            getOpt(button.element, 'id').each(id => {
              set$9(tabview.element, 'aria-labelledby', id);
            });
            Replacing.set(tabview, panel);
            detail.onChangeTab(tabview, button, panel);
          });
        });
      };
      const changeTabBy = (section, byPred) => {
        getPart(section, detail, 'tabbar').each(tabbar => {
          byPred(tabbar).each(emitExecute);
        });
      };
      return {
        uid: detail.uid,
        dom: detail.dom,
        components,
        behaviours: get$3(detail.tabSectionBehaviours),
        events: derive$2(flatten([
          detail.selectFirst ? [runOnAttached((section, _simulatedEvent) => {
              changeTabBy(section, Highlighting.getFirst);
            })] : [],
          [
            run$1(changeTab(), (section, simulatedEvent) => {
              const button = simulatedEvent.event.button;
              changeTab$1(button);
            }),
            run$1(dismissTab(), (section, simulatedEvent) => {
              const button = simulatedEvent.event.button;
              detail.onDismissTab(section, button);
            })
          ]
        ])),
        apis: {
          getViewItems: section => {
            return getPart(section, detail, 'tabview').map(tabview => Replacing.contents(tabview)).getOr([]);
          },
          showTab: (section, tabKey) => {
            const getTabIfNotActive = tabbar => {
              const candidates = Highlighting.getCandidates(tabbar);
              const optTab = find$5(candidates, c => Representing.getValue(c) === tabKey);
              return optTab.filter(tab => !Highlighting.isHighlighted(tabbar, tab));
            };
            changeTabBy(section, getTabIfNotActive);
          }
        }
      };
    };
    const TabSection = composite({
      name: 'TabSection',
      configFields: schema(),
      partFields: parts(),
      factory,
      apis: {
        getViewItems: (apis, component) => apis.getViewItems(component),
        showTab: (apis, component, tabKey) => {
          apis.showTab(component, tabKey);
        }
      }
    });

    const measureHeights = (allTabs, tabview, tabviewComp) => map$2(allTabs, (_tab, i) => {
      Replacing.set(tabviewComp, allTabs[i].view());
      const rect = tabview.dom.getBoundingClientRect();
      Replacing.set(tabviewComp, []);
      return rect.height;
    });
    const getMaxHeight = heights => head(sort(heights, (a, b) => {
      if (a > b) {
        return -1;
      } else if (a < b) {
        return +1;
      } else {
        return 0;
      }
    }));
    const getMaxTabviewHeight = (dialog, tabview, tablist) => {
      const documentElement$1 = documentElement(dialog).dom;
      const rootElm = ancestor(dialog, '.tox-dialog-wrap').getOr(dialog);
      const isFixed = get$e(rootElm, 'position') === 'fixed';
      let maxHeight;
      if (isFixed) {
        maxHeight = Math.max(documentElement$1.clientHeight, window.innerHeight);
      } else {
        maxHeight = Math.max(documentElement$1.offsetHeight, documentElement$1.scrollHeight);
      }
      const tabviewHeight = get$d(tabview);
      const isTabListBeside = tabview.dom.offsetLeft >= tablist.dom.offsetLeft + get$c(tablist);
      const currentTabHeight = isTabListBeside ? Math.max(get$d(tablist), tabviewHeight) : tabviewHeight;
      const dialogTopMargin = parseInt(get$e(dialog, 'margin-top'), 10) || 0;
      const dialogBottomMargin = parseInt(get$e(dialog, 'margin-bottom'), 10) || 0;
      const dialogHeight = get$d(dialog) + dialogTopMargin + dialogBottomMargin;
      const chromeHeight = dialogHeight - currentTabHeight;
      return maxHeight - chromeHeight;
    };
    const showTab = (allTabs, comp) => {
      head(allTabs).each(tab => TabSection.showTab(comp, tab.value));
    };
    const setTabviewHeight = (tabview, height) => {
      set$8(tabview, 'height', height + 'px');
      set$8(tabview, 'flex-basis', height + 'px');
    };
    const updateTabviewHeight = (dialogBody, tabview, maxTabHeight) => {
      ancestor(dialogBody, '[role="dialog"]').each(dialog => {
        descendant(dialog, '[role="tablist"]').each(tablist => {
          maxTabHeight.get().map(height => {
            set$8(tabview, 'height', '0');
            set$8(tabview, 'flex-basis', '0');
            return Math.min(height, getMaxTabviewHeight(dialog, tabview, tablist));
          }).each(height => {
            setTabviewHeight(tabview, height);
          });
        });
      });
    };
    const getTabview = dialog => descendant(dialog, '[role="tabpanel"]');
    const smartMode = allTabs => {
      const maxTabHeight = value$2();
      const extraEvents = [
        runOnAttached(comp => {
          const dialog = comp.element;
          getTabview(dialog).each(tabview => {
            set$8(tabview, 'visibility', 'hidden');
            comp.getSystem().getByDom(tabview).toOptional().each(tabviewComp => {
              const heights = measureHeights(allTabs, tabview, tabviewComp);
              const maxTabHeightOpt = getMaxHeight(heights);
              maxTabHeightOpt.fold(maxTabHeight.clear, maxTabHeight.set);
            });
            updateTabviewHeight(dialog, tabview, maxTabHeight);
            remove$6(tabview, 'visibility');
            showTab(allTabs, comp);
            requestAnimationFrame(() => {
              updateTabviewHeight(dialog, tabview, maxTabHeight);
            });
          });
        }),
        run$1(windowResize(), comp => {
          const dialog = comp.element;
          getTabview(dialog).each(tabview => {
            updateTabviewHeight(dialog, tabview, maxTabHeight);
          });
        }),
        run$1(formResizeEvent, (comp, _se) => {
          const dialog = comp.element;
          getTabview(dialog).each(tabview => {
            const oldFocus = active$1(getRootNode(tabview));
            set$8(tabview, 'visibility', 'hidden');
            const oldHeight = getRaw(tabview, 'height').map(h => parseInt(h, 10));
            remove$6(tabview, 'height');
            remove$6(tabview, 'flex-basis');
            const newHeight = tabview.dom.getBoundingClientRect().height;
            const hasGrown = oldHeight.forall(h => newHeight > h);
            if (hasGrown) {
              maxTabHeight.set(newHeight);
              updateTabviewHeight(dialog, tabview, maxTabHeight);
            } else {
              oldHeight.each(h => {
                setTabviewHeight(tabview, h);
              });
            }
            remove$6(tabview, 'visibility');
            oldFocus.each(focus$3);
          });
        })
      ];
      const selectFirst = false;
      return {
        extraEvents,
        selectFirst
      };
    };

    const SendDataToSectionChannel = 'send-data-to-section';
    const SendDataToViewChannel = 'send-data-to-view';
    const renderTabPanel = (spec, dialogData, backstage) => {
      const storedValue = Cell({});
      const updateDataWithForm = form => {
        const formData = Representing.getValue(form);
        const validData = toValidValues(formData).getOr({});
        const currentData = storedValue.get();
        const newData = deepMerge(currentData, validData);
        storedValue.set(newData);
      };
      const setDataOnForm = form => {
        const tabData = storedValue.get();
        Representing.setValue(form, tabData);
      };
      const oldTab = Cell(null);
      const allTabs = map$2(spec.tabs, tab => {
        return {
          value: tab.name,
          dom: {
            tag: 'div',
            classes: ['tox-dialog__body-nav-item']
          },
          components: [text$1(backstage.shared.providers.translate(tab.title))],
          view: () => {
            return [Form.sketch(parts => ({
                dom: {
                  tag: 'div',
                  classes: ['tox-form']
                },
                components: map$2(tab.items, item => interpretInForm(parts, item, dialogData, backstage)),
                formBehaviours: derive$1([
                  Keying.config({
                    mode: 'acyclic',
                    useTabstopAt: not(isPseudoStop)
                  }),
                  config('TabView.form.events', [
                    runOnAttached(setDataOnForm),
                    runOnDetached(updateDataWithForm)
                  ]),
                  Receiving.config({
                    channels: wrapAll([
                      {
                        key: SendDataToSectionChannel,
                        value: { onReceive: updateDataWithForm }
                      },
                      {
                        key: SendDataToViewChannel,
                        value: { onReceive: setDataOnForm }
                      }
                    ])
                  })
                ])
              }))];
          }
        };
      });
      const tabMode = smartMode(allTabs);
      return TabSection.sketch({
        dom: {
          tag: 'div',
          classes: ['tox-dialog__body']
        },
        onChangeTab: (section, button, _viewItems) => {
          const name = Representing.getValue(button);
          emitWith(section, formTabChangeEvent, {
            name,
            oldName: oldTab.get()
          });
          oldTab.set(name);
        },
        tabs: allTabs,
        components: [
          TabSection.parts.tabbar({
            dom: {
              tag: 'div',
              classes: ['tox-dialog__body-nav']
            },
            components: [Tabbar.parts.tabs({})],
            markers: {
              tabClass: 'tox-tab',
              selectedClass: 'tox-dialog__body-nav-item--active'
            },
            tabbarBehaviours: derive$1([Tabstopping.config({})])
          }),
          TabSection.parts.tabview({
            dom: {
              tag: 'div',
              classes: ['tox-dialog__body-content']
            }
          })
        ],
        selectFirst: tabMode.selectFirst,
        tabSectionBehaviours: derive$1([
          config('tabpanel', tabMode.extraEvents),
          Keying.config({ mode: 'acyclic' }),
          Composing.config({ find: comp => head(TabSection.getViewItems(comp)) }),
          RepresentingConfigs.withComp(Optional.none(), tsection => {
            tsection.getSystem().broadcastOn([SendDataToSectionChannel], {});
            return storedValue.get();
          }, (tsection, value) => {
            storedValue.set(value);
            tsection.getSystem().broadcastOn([SendDataToViewChannel], {});
          })
        ])
      });
    };

    const dialogChannel = generate$6('update-dialog');
    const titleChannel = generate$6('update-title');
    const bodyChannel = generate$6('update-body');
    const footerChannel = generate$6('update-footer');
    const bodySendMessageChannel = generate$6('body-send-message');

    const renderBody = (spec, dialogId, contentId, backstage, ariaAttrs) => {
      const renderComponents = incoming => {
        const body = incoming.body;
        switch (body.type) {
        case 'tabpanel': {
            return [renderTabPanel(body, incoming.initialData, backstage)];
          }
        default: {
            return [renderBodyPanel(body, incoming.initialData, backstage)];
          }
        }
      };
      const updateState = (_comp, incoming) => Optional.some({ isTabPanel: () => incoming.body.type === 'tabpanel' });
      const ariaAttributes = { 'aria-live': 'polite' };
      return {
        dom: {
          tag: 'div',
          classes: ['tox-dialog__content-js'],
          attributes: {
            ...contentId.map(x => ({ id: x })).getOr({}),
            ...ariaAttrs ? ariaAttributes : {}
          }
        },
        components: [],
        behaviours: derive$1([
          ComposingConfigs.childAt(0),
          Reflecting.config({
            channel: `${ bodyChannel }-${ dialogId }`,
            updateState,
            renderComponents,
            initialData: spec
          })
        ])
      };
    };
    const renderInlineBody = (spec, dialogId, contentId, backstage, ariaAttrs) => renderBody(spec, dialogId, Optional.some(contentId), backstage, ariaAttrs);
    const renderModalBody = (spec, dialogId, backstage) => {
      const bodySpec = renderBody(spec, dialogId, Optional.none(), backstage, false);
      return ModalDialog.parts.body(bodySpec);
    };
    const renderIframeBody = spec => {
      const bodySpec = {
        dom: {
          tag: 'div',
          classes: ['tox-dialog__content-js']
        },
        components: [{
            dom: {
              tag: 'div',
              classes: ['tox-dialog__body-iframe']
            },
            components: [craft({
                dom: {
                  tag: 'iframe',
                  attributes: { src: spec.url }
                },
                behaviours: derive$1([
                  Tabstopping.config({}),
                  Focusing.config({})
                ])
              })]
          }],
        behaviours: derive$1([Keying.config({
            mode: 'acyclic',
            useTabstopAt: not(isPseudoStop)
          })])
      };
      return ModalDialog.parts.body(bodySpec);
    };

    const isTouch = global$5.deviceType.isTouch();
    const hiddenHeader = (title, close) => ({
      dom: {
        tag: 'div',
        styles: { display: 'none' },
        classes: ['tox-dialog__header']
      },
      components: [
        title,
        close
      ]
    });
    const pClose = (onClose, providersBackstage) => ModalDialog.parts.close(Button.sketch({
      dom: {
        tag: 'button',
        classes: [
          'tox-button',
          'tox-button--icon',
          'tox-button--naked'
        ],
        attributes: {
          'type': 'button',
          'aria-label': providersBackstage.translate('Close')
        }
      },
      action: onClose,
      buttonBehaviours: derive$1([Tabstopping.config({})])
    }));
    const pUntitled = () => ModalDialog.parts.title({
      dom: {
        tag: 'div',
        classes: ['tox-dialog__title'],
        innerHtml: '',
        styles: { display: 'none' }
      }
    });
    const pBodyMessage = (message, providersBackstage) => ModalDialog.parts.body({
      dom: {
        tag: 'div',
        classes: ['tox-dialog__body']
      },
      components: [{
          dom: {
            tag: 'div',
            classes: ['tox-dialog__body-content']
          },
          components: [{ dom: fromHtml(`<p>${ providersBackstage.translate(message) }</p>`) }]
        }]
    });
    const pFooter = buttons => ModalDialog.parts.footer({
      dom: {
        tag: 'div',
        classes: ['tox-dialog__footer']
      },
      components: buttons
    });
    const pFooterGroup = (startButtons, endButtons) => [
      Container.sketch({
        dom: {
          tag: 'div',
          classes: ['tox-dialog__footer-start']
        },
        components: startButtons
      }),
      Container.sketch({
        dom: {
          tag: 'div',
          classes: ['tox-dialog__footer-end']
        },
        components: endButtons
      })
    ];
    const renderDialog$1 = spec => {
      const dialogClass = 'tox-dialog';
      const blockerClass = dialogClass + '-wrap';
      const blockerBackdropClass = blockerClass + '__backdrop';
      const scrollLockClass = dialogClass + '__disable-scroll';
      return ModalDialog.sketch({
        lazySink: spec.lazySink,
        onEscape: comp => {
          spec.onEscape(comp);
          return Optional.some(true);
        },
        useTabstopAt: elem => !isPseudoStop(elem),
        dom: {
          tag: 'div',
          classes: [dialogClass].concat(spec.extraClasses),
          styles: {
            position: 'relative',
            ...spec.extraStyles
          }
        },
        components: [
          spec.header,
          spec.body,
          ...spec.footer.toArray()
        ],
        parts: {
          blocker: {
            dom: fromHtml(`<div class="${ blockerClass }"></div>`),
            components: [{
                dom: {
                  tag: 'div',
                  classes: isTouch ? [
                    blockerBackdropClass,
                    blockerBackdropClass + '--opaque'
                  ] : [blockerBackdropClass]
                }
              }]
          }
        },
        dragBlockClass: blockerClass,
        modalBehaviours: derive$1([
          Focusing.config({}),
          config('dialog-events', spec.dialogEvents.concat([runOnSource(focusin(), (comp, _se) => {
              Keying.focusIn(comp);
            })])),
          config('scroll-lock', [
            runOnAttached(() => {
              add$2(body(), scrollLockClass);
            }),
            runOnDetached(() => {
              remove$2(body(), scrollLockClass);
            })
          ]),
          ...spec.extraBehaviours
        ]),
        eventOrder: {
          [execute$5()]: ['dialog-events'],
          [attachedToDom()]: [
            'scroll-lock',
            'dialog-events',
            'alloy.base.behaviour'
          ],
          [detachedFromDom()]: [
            'alloy.base.behaviour',
            'dialog-events',
            'scroll-lock'
          ],
          ...spec.eventOrder
        }
      });
    };

    const renderClose = providersBackstage => Button.sketch({
      dom: {
        tag: 'button',
        classes: [
          'tox-button',
          'tox-button--icon',
          'tox-button--naked'
        ],
        attributes: {
          'type': 'button',
          'aria-label': providersBackstage.translate('Close'),
          'title': providersBackstage.translate('Close')
        }
      },
      components: [render$3('close', {
          tag: 'div',
          classes: ['tox-icon']
        }, providersBackstage.icons)],
      action: comp => {
        emit(comp, formCancelEvent);
      }
    });
    const renderTitle = (spec, dialogId, titleId, providersBackstage) => {
      const renderComponents = data => [text$1(providersBackstage.translate(data.title))];
      return {
        dom: {
          tag: 'div',
          classes: ['tox-dialog__title'],
          attributes: { ...titleId.map(x => ({ id: x })).getOr({}) }
        },
        components: [],
        behaviours: derive$1([Reflecting.config({
            channel: `${ titleChannel }-${ dialogId }`,
            initialData: spec,
            renderComponents
          })])
      };
    };
    const renderDragHandle = () => ({ dom: fromHtml('<div class="tox-dialog__draghandle"></div>') });
    const renderInlineHeader = (spec, dialogId, titleId, providersBackstage) => Container.sketch({
      dom: fromHtml('<div class="tox-dialog__header"></div>'),
      components: [
        renderTitle(spec, dialogId, Optional.some(titleId), providersBackstage),
        renderDragHandle(),
        renderClose(providersBackstage)
      ],
      containerBehaviours: derive$1([Dragging.config({
          mode: 'mouse',
          blockerClass: 'blocker',
          getTarget: handle => {
            return closest$1(handle, '[role="dialog"]').getOrDie();
          },
          snaps: {
            getSnapPoints: () => [],
            leftAttr: 'data-drag-left',
            topAttr: 'data-drag-top'
          }
        })])
    });
    const renderModalHeader = (spec, dialogId, providersBackstage) => {
      const pTitle = ModalDialog.parts.title(renderTitle(spec, dialogId, Optional.none(), providersBackstage));
      const pHandle = ModalDialog.parts.draghandle(renderDragHandle());
      const pClose = ModalDialog.parts.close(renderClose(providersBackstage));
      const components = [pTitle].concat(spec.draggable ? [pHandle] : []).concat([pClose]);
      return Container.sketch({
        dom: fromHtml('<div class="tox-dialog__header"></div>'),
        components
      });
    };

    const getHeader = (title, dialogId, backstage) => renderModalHeader({
      title: backstage.shared.providers.translate(title),
      draggable: backstage.dialog.isDraggableModal()
    }, dialogId, backstage.shared.providers);
    const getBusySpec = (message, bs, providers) => ({
      dom: {
        tag: 'div',
        classes: ['tox-dialog__busy-spinner'],
        attributes: { 'aria-label': providers.translate(message) },
        styles: {
          left: '0px',
          right: '0px',
          bottom: '0px',
          top: '0px',
          position: 'absolute'
        }
      },
      behaviours: bs,
      components: [{ dom: fromHtml('<div class="tox-spinner"><div></div><div></div><div></div></div>') }]
    });
    const getEventExtras = (lazyDialog, providers, extra) => ({
      onClose: () => extra.closeWindow(),
      onBlock: blockEvent => {
        ModalDialog.setBusy(lazyDialog(), (_comp, bs) => getBusySpec(blockEvent.message, bs, providers));
      },
      onUnblock: () => {
        ModalDialog.setIdle(lazyDialog());
      }
    });
    const renderModalDialog = (spec, initialData, dialogEvents, backstage) => {
      const updateState = (_comp, incoming) => Optional.some(incoming);
      return build$1(renderDialog$1({
        ...spec,
        lazySink: backstage.shared.getSink,
        extraBehaviours: [
          Reflecting.config({
            channel: `${ dialogChannel }-${ spec.id }`,
            updateState,
            initialData
          }),
          RepresentingConfigs.memory({}),
          ...spec.extraBehaviours
        ],
        onEscape: comp => {
          emit(comp, formCancelEvent);
        },
        dialogEvents,
        eventOrder: {
          [receive()]: [
            Reflecting.name(),
            Receiving.name()
          ],
          [attachedToDom()]: [
            'scroll-lock',
            Reflecting.name(),
            'messages',
            'dialog-events',
            'alloy.base.behaviour'
          ],
          [detachedFromDom()]: [
            'alloy.base.behaviour',
            'dialog-events',
            'messages',
            Reflecting.name(),
            'scroll-lock'
          ]
        }
      }));
    };
    const mapMenuButtons = buttons => {
      const mapItems = button => {
        const items = map$2(button.items, item => {
          const cell = Cell(false);
          return {
            ...item,
            storage: cell
          };
        });
        return {
          ...button,
          items
        };
      };
      return map$2(buttons, button => {
        return button.type === 'menu' ? mapItems(button) : button;
      });
    };
    const extractCellsToObject = buttons => foldl(buttons, (acc, button) => {
      if (button.type === 'menu') {
        const menuButton = button;
        return foldl(menuButton.items, (innerAcc, item) => {
          innerAcc[item.name] = item.storage;
          return innerAcc;
        }, acc);
      }
      return acc;
    }, {});

    const initCommonEvents = (fireApiEvent, extras) => [
      runWithTarget(focusin(), onFocus),
      fireApiEvent(formCloseEvent, (_api, spec) => {
        extras.onClose();
        spec.onClose();
      }),
      fireApiEvent(formCancelEvent, (api, spec, _event, self) => {
        spec.onCancel(api);
        emit(self, formCloseEvent);
      }),
      run$1(formUnblockEvent, (_c, _se) => extras.onUnblock()),
      run$1(formBlockEvent, (_c, se) => extras.onBlock(se.event))
    ];
    const initUrlDialog = (getInstanceApi, extras) => {
      const fireApiEvent = (eventName, f) => run$1(eventName, (c, se) => {
        withSpec(c, (spec, _c) => {
          f(getInstanceApi(), spec, se.event, c);
        });
      });
      const withSpec = (c, f) => {
        Reflecting.getState(c).get().each(currentDialog => {
          f(currentDialog, c);
        });
      };
      return [
        ...initCommonEvents(fireApiEvent, extras),
        fireApiEvent(formActionEvent, (api, spec, event) => {
          spec.onAction(api, { name: event.name });
        })
      ];
    };
    const initDialog = (getInstanceApi, extras, getSink) => {
      const fireApiEvent = (eventName, f) => run$1(eventName, (c, se) => {
        withSpec(c, (spec, _c) => {
          f(getInstanceApi(), spec, se.event, c);
        });
      });
      const withSpec = (c, f) => {
        Reflecting.getState(c).get().each(currentDialogInit => {
          f(currentDialogInit.internalDialog, c);
        });
      };
      return [
        ...initCommonEvents(fireApiEvent, extras),
        fireApiEvent(formSubmitEvent, (api, spec) => spec.onSubmit(api)),
        fireApiEvent(formChangeEvent, (api, spec, event) => {
          spec.onChange(api, { name: event.name });
        }),
        fireApiEvent(formActionEvent, (api, spec, event, component) => {
          const focusIn = () => Keying.focusIn(component);
          const isDisabled = focused => has$1(focused, 'disabled') || getOpt(focused, 'aria-disabled').exists(val => val === 'true');
          const rootNode = getRootNode(component.element);
          const current = active$1(rootNode);
          spec.onAction(api, {
            name: event.name,
            value: event.value
          });
          active$1(rootNode).fold(focusIn, focused => {
            if (isDisabled(focused)) {
              focusIn();
            } else if (current.exists(cur => contains(focused, cur) && isDisabled(cur))) {
              focusIn();
            } else {
              getSink().toOptional().filter(sink => !contains(sink.element, focused)).each(focusIn);
            }
          });
        }),
        fireApiEvent(formTabChangeEvent, (api, spec, event) => {
          spec.onTabChange(api, {
            newTabName: event.name,
            oldTabName: event.oldName
          });
        }),
        runOnDetached(component => {
          const api = getInstanceApi();
          Representing.setValue(component, api.getData());
        })
      ];
    };
    const SilverDialogEvents = {
      initUrlDialog,
      initDialog
    };

    const makeButton = (button, backstage) => renderFooterButton(button, button.type, backstage);
    const lookup = (compInSystem, footerButtons, buttonName) => find$5(footerButtons, button => button.name === buttonName).bind(memButton => memButton.memento.getOpt(compInSystem));
    const renderComponents = (_data, state) => {
      const footerButtons = state.map(s => s.footerButtons).getOr([]);
      const buttonGroups = partition$3(footerButtons, button => button.align === 'start');
      const makeGroup = (edge, buttons) => Container.sketch({
        dom: {
          tag: 'div',
          classes: [`tox-dialog__footer-${ edge }`]
        },
        components: map$2(buttons, button => button.memento.asSpec())
      });
      const startButtons = makeGroup('start', buttonGroups.pass);
      const endButtons = makeGroup('end', buttonGroups.fail);
      return [
        startButtons,
        endButtons
      ];
    };
    const renderFooter = (initSpec, dialogId, backstage) => {
      const updateState = (comp, data) => {
        const footerButtons = map$2(data.buttons, button => {
          const memButton = record(makeButton(button, backstage));
          return {
            name: button.name,
            align: button.align,
            memento: memButton
          };
        });
        const lookupByName = buttonName => lookup(comp, footerButtons, buttonName);
        return Optional.some({
          lookupByName,
          footerButtons
        });
      };
      return {
        dom: fromHtml('<div class="tox-dialog__footer"></div>'),
        components: [],
        behaviours: derive$1([Reflecting.config({
            channel: `${ footerChannel }-${ dialogId }`,
            initialData: initSpec,
            updateState,
            renderComponents
          })])
      };
    };
    const renderInlineFooter = (initSpec, dialogId, backstage) => renderFooter(initSpec, dialogId, backstage);
    const renderModalFooter = (initSpec, dialogId, backstage) => ModalDialog.parts.footer(renderFooter(initSpec, dialogId, backstage));

    const getCompByName = (access, name) => {
      const root = access.getRoot();
      if (root.getSystem().isConnected()) {
        const form = Composing.getCurrent(access.getFormWrapper()).getOr(access.getFormWrapper());
        return Form.getField(form, name).orThunk(() => {
          const footer = access.getFooter();
          const footerState = Reflecting.getState(footer).get();
          return footerState.bind(f => f.lookupByName(name));
        });
      } else {
        return Optional.none();
      }
    };
    const validateData$1 = (access, data) => {
      const root = access.getRoot();
      return Reflecting.getState(root).get().map(dialogState => getOrDie(asRaw('data', dialogState.dataValidator, data))).getOr(data);
    };
    const getDialogApi = (access, doRedial, menuItemStates) => {
      const withRoot = f => {
        const root = access.getRoot();
        if (root.getSystem().isConnected()) {
          f(root);
        }
      };
      const getData = () => {
        const root = access.getRoot();
        const valueComp = root.getSystem().isConnected() ? access.getFormWrapper() : root;
        const representedValues = Representing.getValue(valueComp);
        const menuItemCurrentState = map$1(menuItemStates, cell => cell.get());
        return {
          ...representedValues,
          ...menuItemCurrentState
        };
      };
      const setData = newData => {
        withRoot(_ => {
          const prevData = instanceApi.getData();
          const mergedData = deepMerge(prevData, newData);
          const newInternalData = validateData$1(access, mergedData);
          const form = access.getFormWrapper();
          Representing.setValue(form, newInternalData);
          each(menuItemStates, (v, k) => {
            if (has$2(mergedData, k)) {
              v.set(mergedData[k]);
            }
          });
        });
      };
      const setEnabled = (name, state) => {
        getCompByName(access, name).each(state ? Disabling.enable : Disabling.disable);
      };
      const focus = name => {
        getCompByName(access, name).each(Focusing.focus);
      };
      const block = message => {
        if (!isString(message)) {
          throw new Error('The dialogInstanceAPI.block function should be passed a blocking message of type string as an argument');
        }
        withRoot(root => {
          emitWith(root, formBlockEvent, { message });
        });
      };
      const unblock = () => {
        withRoot(root => {
          emit(root, formUnblockEvent);
        });
      };
      const showTab = name => {
        withRoot(_ => {
          const body = access.getBody();
          const bodyState = Reflecting.getState(body);
          if (bodyState.get().exists(b => b.isTabPanel())) {
            Composing.getCurrent(body).each(tabSection => {
              TabSection.showTab(tabSection, name);
            });
          }
        });
      };
      const redial = d => {
        withRoot(root => {
          const id = access.getId();
          const dialogInit = doRedial(d);
          root.getSystem().broadcastOn([`${ dialogChannel }-${ id }`], dialogInit);
          root.getSystem().broadcastOn([`${ titleChannel }-${ id }`], dialogInit.internalDialog);
          root.getSystem().broadcastOn([`${ bodyChannel }-${ id }`], dialogInit.internalDialog);
          root.getSystem().broadcastOn([`${ footerChannel }-${ id }`], dialogInit.internalDialog);
          instanceApi.setData(dialogInit.initialData);
        });
      };
      const close = () => {
        withRoot(root => {
          emit(root, formCloseEvent);
        });
      };
      const instanceApi = {
        getData,
        setData,
        setEnabled,
        focus,
        block,
        unblock,
        showTab,
        redial,
        close
      };
      return instanceApi;
    };

    const getDialogSizeClasses = size => {
      switch (size) {
      case 'large':
        return ['tox-dialog--width-lg'];
      case 'medium':
        return ['tox-dialog--width-md'];
      default:
        return [];
      }
    };
    const renderDialog = (dialogInit, extra, backstage) => {
      const dialogId = generate$6('dialog');
      const internalDialog = dialogInit.internalDialog;
      const header = getHeader(internalDialog.title, dialogId, backstage);
      const body = renderModalBody({
        body: internalDialog.body,
        initialData: internalDialog.initialData
      }, dialogId, backstage);
      const storedMenuButtons = mapMenuButtons(internalDialog.buttons);
      const objOfCells = extractCellsToObject(storedMenuButtons);
      const footer = renderModalFooter({ buttons: storedMenuButtons }, dialogId, backstage);
      const dialogEvents = SilverDialogEvents.initDialog(() => instanceApi, getEventExtras(() => dialog, backstage.shared.providers, extra), backstage.shared.getSink);
      const dialogSize = getDialogSizeClasses(internalDialog.size);
      const spec = {
        id: dialogId,
        header,
        body,
        footer: Optional.some(footer),
        extraClasses: dialogSize,
        extraBehaviours: [],
        extraStyles: {}
      };
      const dialog = renderModalDialog(spec, dialogInit, dialogEvents, backstage);
      const modalAccess = (() => {
        const getForm = () => {
          const outerForm = ModalDialog.getBody(dialog);
          return Composing.getCurrent(outerForm).getOr(outerForm);
        };
        return {
          getId: constant$1(dialogId),
          getRoot: constant$1(dialog),
          getBody: () => ModalDialog.getBody(dialog),
          getFooter: () => ModalDialog.getFooter(dialog),
          getFormWrapper: getForm
        };
      })();
      const instanceApi = getDialogApi(modalAccess, extra.redial, objOfCells);
      return {
        dialog,
        instanceApi
      };
    };

    const renderInlineDialog = (dialogInit, extra, backstage, ariaAttrs) => {
      const dialogId = generate$6('dialog');
      const dialogLabelId = generate$6('dialog-label');
      const dialogContentId = generate$6('dialog-content');
      const internalDialog = dialogInit.internalDialog;
      const updateState = (_comp, incoming) => Optional.some(incoming);
      const memHeader = record(renderInlineHeader({
        title: internalDialog.title,
        draggable: true
      }, dialogId, dialogLabelId, backstage.shared.providers));
      const memBody = record(renderInlineBody({
        body: internalDialog.body,
        initialData: internalDialog.initialData
      }, dialogId, dialogContentId, backstage, ariaAttrs));
      const storagedMenuButtons = mapMenuButtons(internalDialog.buttons);
      const objOfCells = extractCellsToObject(storagedMenuButtons);
      const memFooter = record(renderInlineFooter({ buttons: storagedMenuButtons }, dialogId, backstage));
      const dialogEvents = SilverDialogEvents.initDialog(() => instanceApi, {
        onBlock: event => {
          Blocking.block(dialog, (_comp, bs) => getBusySpec(event.message, bs, backstage.shared.providers));
        },
        onUnblock: () => {
          Blocking.unblock(dialog);
        },
        onClose: () => extra.closeWindow()
      }, backstage.shared.getSink);
      const dialog = build$1({
        dom: {
          tag: 'div',
          classes: [
            'tox-dialog',
            'tox-dialog-inline'
          ],
          attributes: {
            role: 'dialog',
            ['aria-labelledby']: dialogLabelId,
            ['aria-describedby']: dialogContentId
          }
        },
        eventOrder: {
          [receive()]: [
            Reflecting.name(),
            Receiving.name()
          ],
          [execute$5()]: ['execute-on-form'],
          [attachedToDom()]: [
            'reflecting',
            'execute-on-form'
          ]
        },
        behaviours: derive$1([
          Keying.config({
            mode: 'cyclic',
            onEscape: c => {
              emit(c, formCloseEvent);
              return Optional.some(true);
            },
            useTabstopAt: elem => !isPseudoStop(elem) && (name$3(elem) !== 'button' || get$f(elem, 'disabled') !== 'disabled')
          }),
          Reflecting.config({
            channel: `${ dialogChannel }-${ dialogId }`,
            updateState,
            initialData: dialogInit
          }),
          Focusing.config({}),
          config('execute-on-form', dialogEvents.concat([runOnSource(focusin(), (comp, _se) => {
              Keying.focusIn(comp);
            })])),
          Blocking.config({ getRoot: () => Optional.some(dialog) }),
          Replacing.config({}),
          RepresentingConfigs.memory({})
        ]),
        components: [
          memHeader.asSpec(),
          memBody.asSpec(),
          memFooter.asSpec()
        ]
      });
      const instanceApi = getDialogApi({
        getId: constant$1(dialogId),
        getRoot: constant$1(dialog),
        getFooter: () => memFooter.get(dialog),
        getBody: () => memBody.get(dialog),
        getFormWrapper: () => {
          const body = memBody.get(dialog);
          return Composing.getCurrent(body).getOr(body);
        }
      }, extra.redial, objOfCells);
      return {
        dialog,
        instanceApi
      };
    };

    var global = tinymce.util.Tools.resolve('tinymce.util.URI');

    const getUrlDialogApi = root => {
      const withRoot = f => {
        if (root.getSystem().isConnected()) {
          f(root);
        }
      };
      const block = message => {
        if (!isString(message)) {
          throw new Error('The urlDialogInstanceAPI.block function should be passed a blocking message of type string as an argument');
        }
        withRoot(root => {
          emitWith(root, formBlockEvent, { message });
        });
      };
      const unblock = () => {
        withRoot(root => {
          emit(root, formUnblockEvent);
        });
      };
      const close = () => {
        withRoot(root => {
          emit(root, formCloseEvent);
        });
      };
      const sendMessage = data => {
        withRoot(root => {
          root.getSystem().broadcastOn([bodySendMessageChannel], data);
        });
      };
      return {
        block,
        unblock,
        close,
        sendMessage
      };
    };

    const SUPPORTED_MESSAGE_ACTIONS = [
      'insertContent',
      'setContent',
      'execCommand',
      'close',
      'block',
      'unblock'
    ];
    const isSupportedMessage = data => isObject(data) && SUPPORTED_MESSAGE_ACTIONS.indexOf(data.mceAction) !== -1;
    const isCustomMessage = data => !isSupportedMessage(data) && isObject(data) && has$2(data, 'mceAction');
    const handleMessage = (editor, api, data) => {
      switch (data.mceAction) {
      case 'insertContent':
        editor.insertContent(data.content);
        break;
      case 'setContent':
        editor.setContent(data.content);
        break;
      case 'execCommand':
        const ui = isBoolean(data.ui) ? data.ui : false;
        editor.execCommand(data.cmd, ui, data.value);
        break;
      case 'close':
        api.close();
        break;
      case 'block':
        api.block(data.message);
        break;
      case 'unblock':
        api.unblock();
        break;
      }
    };
    const renderUrlDialog = (internalDialog, extra, editor, backstage) => {
      const dialogId = generate$6('dialog');
      const header = getHeader(internalDialog.title, dialogId, backstage);
      const body = renderIframeBody(internalDialog);
      const footer = internalDialog.buttons.bind(buttons => {
        if (buttons.length === 0) {
          return Optional.none();
        } else {
          return Optional.some(renderModalFooter({ buttons }, dialogId, backstage));
        }
      });
      const dialogEvents = SilverDialogEvents.initUrlDialog(() => instanceApi, getEventExtras(() => dialog, backstage.shared.providers, extra));
      const styles = {
        ...internalDialog.height.fold(() => ({}), height => ({
          'height': height + 'px',
          'max-height': height + 'px'
        })),
        ...internalDialog.width.fold(() => ({}), width => ({
          'width': width + 'px',
          'max-width': width + 'px'
        }))
      };
      const classes = internalDialog.width.isNone() && internalDialog.height.isNone() ? ['tox-dialog--width-lg'] : [];
      const iframeUri = new global(internalDialog.url, { base_uri: new global(window.location.href) });
      const iframeDomain = `${ iframeUri.protocol }://${ iframeUri.host }${ iframeUri.port ? ':' + iframeUri.port : '' }`;
      const messageHandlerUnbinder = unbindable();
      const extraBehaviours = [
        config('messages', [
          runOnAttached(() => {
            const unbind = bind(SugarElement.fromDom(window), 'message', e => {
              if (iframeUri.isSameOrigin(new global(e.raw.origin))) {
                const data = e.raw.data;
                if (isSupportedMessage(data)) {
                  handleMessage(editor, instanceApi, data);
                } else if (isCustomMessage(data)) {
                  internalDialog.onMessage(instanceApi, data);
                }
              }
            });
            messageHandlerUnbinder.set(unbind);
          }),
          runOnDetached(messageHandlerUnbinder.clear)
        ]),
        Receiving.config({
          channels: {
            [bodySendMessageChannel]: {
              onReceive: (comp, data) => {
                descendant(comp.element, 'iframe').each(iframeEle => {
                  const iframeWin = iframeEle.dom.contentWindow;
                  if (isNonNullable(iframeWin)) {
                    iframeWin.postMessage(data, iframeDomain);
                  }
                });
              }
            }
          }
        })
      ];
      const spec = {
        id: dialogId,
        header,
        body,
        footer,
        extraClasses: classes,
        extraBehaviours,
        extraStyles: styles
      };
      const dialog = renderModalDialog(spec, internalDialog, dialogEvents, backstage);
      const instanceApi = getUrlDialogApi(dialog);
      return {
        dialog,
        instanceApi
      };
    };

    const setup$2 = backstage => {
      const sharedBackstage = backstage.shared;
      const open = (message, callback) => {
        const closeDialog = () => {
          ModalDialog.hide(alertDialog);
          callback();
        };
        const memFooterClose = record(renderFooterButton({
          name: 'close-alert',
          text: 'OK',
          primary: true,
          buttonType: Optional.some('primary'),
          align: 'end',
          enabled: true,
          icon: Optional.none()
        }, 'cancel', backstage));
        const titleSpec = pUntitled();
        const closeSpec = pClose(closeDialog, sharedBackstage.providers);
        const alertDialog = build$1(renderDialog$1({
          lazySink: () => sharedBackstage.getSink(),
          header: hiddenHeader(titleSpec, closeSpec),
          body: pBodyMessage(message, sharedBackstage.providers),
          footer: Optional.some(pFooter(pFooterGroup([], [memFooterClose.asSpec()]))),
          onEscape: closeDialog,
          extraClasses: ['tox-alert-dialog'],
          extraBehaviours: [],
          extraStyles: {},
          dialogEvents: [run$1(formCancelEvent, closeDialog)],
          eventOrder: {}
        }));
        ModalDialog.show(alertDialog);
        const footerCloseButton = memFooterClose.get(alertDialog);
        Focusing.focus(footerCloseButton);
      };
      return { open };
    };

    const setup$1 = backstage => {
      const sharedBackstage = backstage.shared;
      const open = (message, callback) => {
        const closeDialog = state => {
          ModalDialog.hide(confirmDialog);
          callback(state);
        };
        const memFooterYes = record(renderFooterButton({
          name: 'yes',
          text: 'Yes',
          primary: true,
          buttonType: Optional.some('primary'),
          align: 'end',
          enabled: true,
          icon: Optional.none()
        }, 'submit', backstage));
        const footerNo = renderFooterButton({
          name: 'no',
          text: 'No',
          primary: false,
          buttonType: Optional.some('secondary'),
          align: 'end',
          enabled: true,
          icon: Optional.none()
        }, 'cancel', backstage);
        const titleSpec = pUntitled();
        const closeSpec = pClose(() => closeDialog(false), sharedBackstage.providers);
        const confirmDialog = build$1(renderDialog$1({
          lazySink: () => sharedBackstage.getSink(),
          header: hiddenHeader(titleSpec, closeSpec),
          body: pBodyMessage(message, sharedBackstage.providers),
          footer: Optional.some(pFooter(pFooterGroup([], [
            footerNo,
            memFooterYes.asSpec()
          ]))),
          onEscape: () => closeDialog(false),
          extraClasses: ['tox-confirm-dialog'],
          extraBehaviours: [],
          extraStyles: {},
          dialogEvents: [
            run$1(formCancelEvent, () => closeDialog(false)),
            run$1(formSubmitEvent, () => closeDialog(true))
          ],
          eventOrder: {}
        }));
        ModalDialog.show(confirmDialog);
        const footerYesButton = memFooterYes.get(confirmDialog);
        Focusing.focus(footerYesButton);
      };
      return { open };
    };

    const validateData = (data, validator) => getOrDie(asRaw('data', validator, data));
    const isAlertOrConfirmDialog = target => closest(target, '.tox-alert-dialog') || closest(target, '.tox-confirm-dialog');
    const inlineAdditionalBehaviours = (editor, isStickyToolbar, isToolbarLocationTop) => {
      if (isStickyToolbar && isToolbarLocationTop) {
        return [];
      } else {
        return [Docking.config({
            contextual: {
              lazyContext: () => Optional.some(box$1(SugarElement.fromDom(editor.getContentAreaContainer()))),
              fadeInClass: 'tox-dialog-dock-fadein',
              fadeOutClass: 'tox-dialog-dock-fadeout',
              transitionClass: 'tox-dialog-dock-transition'
            },
            modes: ['top']
          })];
      }
    };
    const setup = extras => {
      const backstage = extras.backstage;
      const editor = extras.editor;
      const isStickyToolbar$1 = isStickyToolbar(editor);
      const alertDialog = setup$2(backstage);
      const confirmDialog = setup$1(backstage);
      const open = (config, params, closeWindow) => {
        if (params !== undefined && params.inline === 'toolbar') {
          return openInlineDialog(config, backstage.shared.anchors.inlineDialog(), closeWindow, params.ariaAttrs);
        } else if (params !== undefined && params.inline === 'cursor') {
          return openInlineDialog(config, backstage.shared.anchors.cursor(), closeWindow, params.ariaAttrs);
        } else {
          return openModalDialog(config, closeWindow);
        }
      };
      const openUrl = (config, closeWindow) => openModalUrlDialog(config, closeWindow);
      const openModalUrlDialog = (config, closeWindow) => {
        const factory = contents => {
          const dialog = renderUrlDialog(contents, {
            closeWindow: () => {
              ModalDialog.hide(dialog.dialog);
              closeWindow(dialog.instanceApi);
            }
          }, editor, backstage);
          ModalDialog.show(dialog.dialog);
          return dialog.instanceApi;
        };
        return DialogManager.openUrl(factory, config);
      };
      const openModalDialog = (config, closeWindow) => {
        const factory = (contents, internalInitialData, dataValidator) => {
          const initialData = internalInitialData;
          const dialogInit = {
            dataValidator,
            initialData,
            internalDialog: contents
          };
          const dialog = renderDialog(dialogInit, {
            redial: DialogManager.redial,
            closeWindow: () => {
              ModalDialog.hide(dialog.dialog);
              closeWindow(dialog.instanceApi);
            }
          }, backstage);
          ModalDialog.show(dialog.dialog);
          dialog.instanceApi.setData(initialData);
          return dialog.instanceApi;
        };
        return DialogManager.open(factory, config);
      };
      const openInlineDialog = (config$1, anchor, closeWindow, ariaAttrs = false) => {
        const factory = (contents, internalInitialData, dataValidator) => {
          const initialData = validateData(internalInitialData, dataValidator);
          const inlineDialog = value$2();
          const isToolbarLocationTop = backstage.shared.header.isPositionedAtTop();
          const dialogInit = {
            dataValidator,
            initialData,
            internalDialog: contents
          };
          const refreshDocking = () => inlineDialog.on(dialog => {
            InlineView.reposition(dialog);
            Docking.refresh(dialog);
          });
          const dialogUi = renderInlineDialog(dialogInit, {
            redial: DialogManager.redial,
            closeWindow: () => {
              inlineDialog.on(InlineView.hide);
              editor.off('ResizeEditor', refreshDocking);
              inlineDialog.clear();
              closeWindow(dialogUi.instanceApi);
            }
          }, backstage, ariaAttrs);
          const inlineDialogComp = build$1(InlineView.sketch({
            lazySink: backstage.shared.getSink,
            dom: {
              tag: 'div',
              classes: []
            },
            fireDismissalEventInstead: {},
            ...isToolbarLocationTop ? {} : { fireRepositionEventInstead: {} },
            inlineBehaviours: derive$1([
              config('window-manager-inline-events', [run$1(dismissRequested(), (_comp, _se) => {
                  emit(dialogUi.dialog, formCancelEvent);
                })]),
              ...inlineAdditionalBehaviours(editor, isStickyToolbar$1, isToolbarLocationTop)
            ]),
            isExtraPart: (_comp, target) => isAlertOrConfirmDialog(target)
          }));
          inlineDialog.set(inlineDialogComp);
          InlineView.showWithin(inlineDialogComp, premade(dialogUi.dialog), { anchor }, Optional.some(body()));
          if (!isStickyToolbar$1 || !isToolbarLocationTop) {
            Docking.refresh(inlineDialogComp);
            editor.on('ResizeEditor', refreshDocking);
          }
          dialogUi.instanceApi.setData(initialData);
          Keying.focusIn(dialogUi.dialog);
          return dialogUi.instanceApi;
        };
        return DialogManager.open(factory, config$1);
      };
      const confirm = (message, callback) => {
        confirmDialog.open(message, callback);
      };
      const alert = (message, callback) => {
        alertDialog.open(message, callback);
      };
      const close = instanceApi => {
        instanceApi.close();
      };
      return {
        open,
        openUrl,
        alert,
        close,
        confirm
      };
    };

    const registerOptions = editor => {
      register$e(editor);
      register$d(editor);
      register(editor);
    };
    var Theme = () => {
      global$a.add('silver', editor => {
        registerOptions(editor);
        const {getUiMothership, backstage, renderUI} = setup$3(editor);
        Autocompleter.register(editor, backstage.shared);
        const windowMgr = setup({
          editor,
          backstage
        });
        return {
          renderUI,
          getWindowManagerImpl: constant$1(windowMgr),
          getNotificationManagerImpl: () => NotificationManagerImpl(editor, { backstage }, getUiMothership())
        };
      });
    };

    Theme();

})();
