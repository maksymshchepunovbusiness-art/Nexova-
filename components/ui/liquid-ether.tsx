'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface LiquidEtherProps {
  colors?: string[];
  mouseForce?: number;
  cursorSize?: number;
  isViscous?: boolean;
  viscous?: number;
  iterationsViscous?: number;
  iterationsPoisson?: number;
  resolution?: number;
  isBounce?: boolean;
  dt?: number;
  BFECC?: boolean;
  autoDemo?: boolean;
  autoSpeed?: number;
  autoIntensity?: number;
  takeoverDuration?: number;
  autoResumeDelay?: number;
  autoRampDuration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function LiquidEther({
  colors = ['#5227FF', '#FF9FFC', '#B497CF'],
  mouseForce = 20,
  cursorSize = 100,
  isViscous = false,
  viscous = 30,
  iterationsViscous = 32,
  iterationsPoisson = 32,
  dt = 0.014,
  BFECC = true,
  resolution = 0.5,
  isBounce = false,
  autoDemo = true,
  autoSpeed = 0.5,
  autoIntensity = 2.2,
  takeoverDuration = 0.25,
  autoResumeDelay = 1000,
  autoRampDuration = 0.6,
  className = '',
  style = {},
}: LiquidEtherProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const webglRef = useRef<any>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const rafRef = useRef<number | null>(null);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const isVisibleRef = useRef(true);
  const resizeRafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const $wrapper = mountRef.current;

    // ─── Palette texture ────────────────────────────────────────────────
    function makePaletteTexture(stops: string[]) {
      const arr = stops.length > 1 ? stops : [stops[0], stops[0]];
      const data = new Uint8Array(arr.length * 4);
      arr.forEach((hex, i) => {
        const c = new THREE.Color(hex);
        data[i * 4] = Math.round(c.r * 255);
        data[i * 4 + 1] = Math.round(c.g * 255);
        data[i * 4 + 2] = Math.round(c.b * 255);
        data[i * 4 + 3] = 255;
      });
      const tex = new THREE.DataTexture(data, arr.length, 1, THREE.RGBAFormat);
      tex.magFilter = THREE.LinearFilter;
      tex.minFilter = THREE.LinearFilter;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.generateMipmaps = false;
      tex.needsUpdate = true;
      return tex;
    }

    const paletteTex = makePaletteTexture(colors);
    const bgVec4 = new THREE.Vector4(0, 0, 0, 0);

    // ─── Common ─────────────────────────────────────────────────────────
    class CommonClass {
      width = 0; height = 0; aspect = 1; pixelRatio = 1; time = 0; delta = 0;
      container: HTMLElement | null = null;
      renderer: THREE.WebGLRenderer | null = null;
      clock: THREE.Clock | null = null;
      fboSize: THREE.Vector2 | null = null;
      fboWidth: number | null = null;
      fboHeight: number | null = null;

      init(container: HTMLElement) {
        this.container = container;
        this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        this.resize();
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.autoClear = false;
        this.renderer.setClearColor(new THREE.Color(0x000000), 0);
        this.renderer.setPixelRatio(this.pixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;';
        this.clock = new THREE.Clock();
        this.clock.start();
      }
      resize() {
        if (!this.container) return;
        const rect = this.container.getBoundingClientRect();
        this.width = Math.max(1, Math.floor(rect.width));
        this.height = Math.max(1, Math.floor(rect.height));
        this.aspect = this.width / this.height;
        if (this.renderer) this.renderer.setSize(this.width, this.height, false);
      }
      update() {
        this.delta = this.clock!.getDelta();
        this.time += this.delta;
      }
    }
    const Common = new CommonClass();

    // ─── Mouse ──────────────────────────────────────────────────────────
    class MouseClass {
      mouseMoved = false;
      coords = new THREE.Vector2();
      coords_old = new THREE.Vector2();
      diff = new THREE.Vector2();
      timer: number | null = null;
      container: HTMLElement | null = null;
      docTarget: Document | null = null;
      listenerTarget: Window | null = null;
      isHoverInside = false;
      hasUserControl = false;
      isAutoActive = false;
      autoIntensity = 2.0;
      takeoverActive = false;
      takeoverStartTime = 0;
      takeoverDuration = 0.25;
      takeoverFrom = new THREE.Vector2();
      takeoverTo = new THREE.Vector2();
      onInteract: (() => void) | null = null;
      _onMouseMove: (e: MouseEvent) => void;
      _onTouchStart: (e: TouchEvent) => void;
      _onTouchMove: (e: TouchEvent) => void;
      _onTouchEnd: () => void;
      _onDocumentLeave: () => void;
      _tmpDir = new THREE.Vector2();

      constructor() {
        this._onMouseMove = this.onDocumentMouseMove.bind(this);
        this._onTouchStart = this.onDocumentTouchStart.bind(this);
        this._onTouchMove = this.onDocumentTouchMove.bind(this);
        this._onTouchEnd = this.onTouchEnd.bind(this);
        this._onDocumentLeave = this.onDocumentLeave.bind(this);
      }
      init(container: HTMLElement) {
        this.container = container;
        this.docTarget = container.ownerDocument;
        const win = this.docTarget?.defaultView ?? window;
        this.listenerTarget = win;
        win.addEventListener('mousemove', this._onMouseMove);
        win.addEventListener('touchstart', this._onTouchStart, { passive: true });
        win.addEventListener('touchmove', this._onTouchMove, { passive: true });
        win.addEventListener('touchend', this._onTouchEnd);
        this.docTarget?.addEventListener('mouseleave', this._onDocumentLeave);
      }
      dispose() {
        this.listenerTarget?.removeEventListener('mousemove', this._onMouseMove);
        this.listenerTarget?.removeEventListener('touchstart', this._onTouchStart);
        this.listenerTarget?.removeEventListener('touchmove', this._onTouchMove);
        this.listenerTarget?.removeEventListener('touchend', this._onTouchEnd);
        this.docTarget?.removeEventListener('mouseleave', this._onDocumentLeave);
        this.listenerTarget = null;
        this.docTarget = null;
        this.container = null;
      }
      isPointInside(clientX: number, clientY: number) {
        if (!this.container) return false;
        const rect = this.container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return false;
        return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
      }
      updateHoverState(x: number, y: number) {
        this.isHoverInside = this.isPointInside(x, y);
        return this.isHoverInside;
      }
      setCoords(x: number, y: number) {
        if (!this.container) return;
        if (this.timer) window.clearTimeout(this.timer);
        const rect = this.container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const nx = (x - rect.left) / rect.width;
        const ny = (y - rect.top) / rect.height;
        this.coords.set(nx * 2 - 1, -(ny * 2 - 1));
        this.mouseMoved = true;
        this.timer = window.setTimeout(() => { this.mouseMoved = false; }, 100);
      }
      setNormalized(nx: number, ny: number) {
        this.coords.set(nx, ny);
        this.mouseMoved = true;
      }
      onDocumentMouseMove(e: MouseEvent) {
        if (!this.updateHoverState(e.clientX, e.clientY)) return;
        if (this.onInteract) this.onInteract();
        if (this.isAutoActive && !this.hasUserControl && !this.takeoverActive) {
          if (!this.container) return;
          const rect = this.container.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return;
          const nx = (e.clientX - rect.left) / rect.width;
          const ny = (e.clientY - rect.top) / rect.height;
          this.takeoverFrom.copy(this.coords);
          this.takeoverTo.set(nx * 2 - 1, -(ny * 2 - 1));
          this.takeoverStartTime = performance.now();
          this.takeoverActive = true;
          this.hasUserControl = true;
          this.isAutoActive = false;
          return;
        }
        this.setCoords(e.clientX, e.clientY);
        this.hasUserControl = true;
      }
      onDocumentTouchStart(e: TouchEvent) {
        if (e.touches.length !== 1) return;
        const t = e.touches[0];
        if (!this.updateHoverState(t.clientX, t.clientY)) return;
        if (this.onInteract) this.onInteract();
        this.setCoords(t.clientX, t.clientY);
        this.hasUserControl = true;
      }
      onDocumentTouchMove(e: TouchEvent) {
        if (e.touches.length !== 1) return;
        const t = e.touches[0];
        if (!this.updateHoverState(t.clientX, t.clientY)) return;
        if (this.onInteract) this.onInteract();
        this.setCoords(t.clientX, t.clientY);
      }
      onTouchEnd() { this.isHoverInside = false; }
      onDocumentLeave() { this.isHoverInside = false; }
      update() {
        if (this.takeoverActive) {
          const t = (performance.now() - this.takeoverStartTime) / (this.takeoverDuration * 1000);
          if (t >= 1) {
            this.takeoverActive = false;
            this.coords.copy(this.takeoverTo);
            this.coords_old.copy(this.coords);
            this.diff.set(0, 0);
          } else {
            const k = t * t * (3 - 2 * t);
            this.coords.copy(this.takeoverFrom).lerp(this.takeoverTo, k);
          }
        }
        this.diff.subVectors(this.coords, this.coords_old);
        this.coords_old.copy(this.coords);
        if (this.coords_old.x === 0 && this.coords_old.y === 0) this.diff.set(0, 0);
        if (this.isAutoActive && !this.takeoverActive) this.diff.multiplyScalar(this.autoIntensity);
      }
    }
    const Mouse = new MouseClass();

    // ─── AutoDriver ─────────────────────────────────────────────────────
    class AutoDriver {
      mouse: MouseClass; manager: any; enabled: boolean; speed: number;
      resumeDelay: number; rampDurationMs: number; active = false;
      current = new THREE.Vector2(); target = new THREE.Vector2();
      lastTime = performance.now(); activationTime = 0; margin = 0.2;
      _tmpDir = new THREE.Vector2();

      constructor(mouse: MouseClass, manager: any, opts: any) {
        this.mouse = mouse;
        this.manager = manager;
        this.enabled = opts.enabled;
        this.speed = opts.speed;
        this.resumeDelay = opts.resumeDelay || 3000;
        this.rampDurationMs = (opts.rampDuration || 0) * 1000;
        this.pickNewTarget();
      }
      pickNewTarget() {
        this.target.set(
          (Math.random() * 2 - 1) * (1 - this.margin),
          (Math.random() * 2 - 1) * (1 - this.margin)
        );
      }
      forceStop() {
        this.active = false;
        this.mouse.isAutoActive = false;
      }
      update() {
        if (!this.enabled) return;
        const now = performance.now();
        const idle = now - this.manager.lastUserInteraction;
        if (idle < this.resumeDelay) { if (this.active) this.forceStop(); return; }
        if (this.mouse.isHoverInside) { if (this.active) this.forceStop(); return; }
        if (!this.active) {
          this.active = true;
          this.current.copy(this.mouse.coords);
          this.lastTime = now;
          this.activationTime = now;
        }
        this.mouse.isAutoActive = true;
        let dtSec = (now - this.lastTime) / 1000;
        this.lastTime = now;
        if (dtSec > 0.2) dtSec = 0.016;
        const dir = this._tmpDir.subVectors(this.target, this.current);
        const dist = dir.length();
        if (dist < 0.01) { this.pickNewTarget(); return; }
        dir.normalize();
        let ramp = 1;
        if (this.rampDurationMs > 0) {
          const t = Math.min(1, (now - this.activationTime) / this.rampDurationMs);
          ramp = t * t * (3 - 2 * t);
        }
        const move = Math.min(this.speed * dtSec * ramp, dist);
        this.current.addScaledVector(dir, move);
        this.mouse.setNormalized(this.current.x, this.current.y);
      }
    }

    // ─── GLSL shaders ───────────────────────────────────────────────────
    const face_vert = `
      attribute vec3 position;
      uniform vec2 px;
      uniform vec2 boundarySpace;
      varying vec2 uv;
      precision highp float;
      void main(){
        vec3 pos = position;
        vec2 scale = 1.0 - boundarySpace * 2.0;
        pos.xy = pos.xy * scale;
        uv = vec2(0.5) + (pos.xy) * 0.5;
        gl_Position = vec4(pos, 1.0);
      }
    `;
    const line_vert = `
      attribute vec3 position;
      uniform vec2 px;
      precision highp float;
      varying vec2 uv;
      void main(){
        vec3 pos = position;
        uv = 0.5 + pos.xy * 0.5;
        vec2 n = sign(pos.xy);
        pos.xy = abs(pos.xy) - px * 1.0;
        pos.xy *= n;
        gl_Position = vec4(pos, 1.0);
      }
    `;
    const mouse_vert = `
      precision highp float;
      attribute vec3 position;
      attribute vec2 uv;
      uniform vec2 center;
      uniform vec2 scale;
      uniform vec2 px;
      varying vec2 vUv;
      void main(){
        vec2 pos = position.xy * scale * 2.0 * px + center;
        vUv = uv;
        gl_Position = vec4(pos, 0.0, 1.0);
      }
    `;
    const advection_frag = `
      precision highp float;
      uniform sampler2D velocity;
      uniform float dt;
      uniform bool isBFECC;
      uniform vec2 fboSize;
      uniform vec2 px;
      varying vec2 uv;
      void main(){
        vec2 ratio = max(fboSize.x, fboSize.y) / fboSize;
        if(!isBFECC){
          vec2 vel = texture2D(velocity, uv).xy;
          vec2 uv2 = uv - vel * dt * ratio;
          gl_FragColor = vec4(texture2D(velocity, uv2).xy, 0.0, 0.0);
        } else {
          vec2 vel_old = texture2D(velocity, uv).xy;
          vec2 spot_old = uv - vel_old * dt * ratio;
          vec2 vel_new1 = texture2D(velocity, spot_old).xy;
          vec2 spot_new2 = spot_old + vel_new1 * dt * ratio;
          vec2 error = spot_new2 - uv;
          vec2 spot_new3 = uv - error / 2.0;
          vec2 vel_2 = texture2D(velocity, spot_new3).xy;
          vec2 spot_old2 = spot_new3 - vel_2 * dt * ratio;
          gl_FragColor = vec4(texture2D(velocity, spot_old2).xy, 0.0, 0.0);
        }
      }
    `;
    const color_frag = `
      precision highp float;
      uniform sampler2D velocity;
      uniform sampler2D palette;
      uniform vec4 bgColor;
      varying vec2 uv;
      void main(){
        vec2 vel = texture2D(velocity, uv).xy;
        float lenv = clamp(length(vel), 0.0, 1.0);
        vec3 c = texture2D(palette, vec2(lenv, 0.5)).rgb;
        vec3 outRGB = mix(bgColor.rgb, c, lenv);
        float outA = mix(bgColor.a, 1.0, lenv);
        gl_FragColor = vec4(outRGB, outA);
      }
    `;
    const divergence_frag = `
      precision highp float;
      uniform sampler2D velocity;
      uniform float dt;
      uniform vec2 px;
      varying vec2 uv;
      void main(){
        float x0 = texture2D(velocity, uv - vec2(px.x, 0.0)).x;
        float x1 = texture2D(velocity, uv + vec2(px.x, 0.0)).x;
        float y0 = texture2D(velocity, uv - vec2(0.0, px.y)).y;
        float y1 = texture2D(velocity, uv + vec2(0.0, px.y)).y;
        gl_FragColor = vec4((x1 - x0 + y1 - y0) / 2.0 / dt);
      }
    `;
    const externalForce_frag = `
      precision highp float;
      uniform vec2 force;
      uniform vec2 center;
      uniform vec2 scale;
      uniform vec2 px;
      varying vec2 vUv;
      void main(){
        vec2 circle = (vUv - 0.5) * 2.0;
        float d = 1.0 - min(length(circle), 1.0);
        d *= d;
        gl_FragColor = vec4(force * d, 0.0, 1.0);
      }
    `;
    const poisson_frag = `
      precision highp float;
      uniform sampler2D pressure;
      uniform sampler2D divergence;
      uniform vec2 px;
      varying vec2 uv;
      void main(){
        float p0 = texture2D(pressure, uv + vec2(px.x * 2.0, 0.0)).r;
        float p1 = texture2D(pressure, uv - vec2(px.x * 2.0, 0.0)).r;
        float p2 = texture2D(pressure, uv + vec2(0.0, px.y * 2.0)).r;
        float p3 = texture2D(pressure, uv - vec2(0.0, px.y * 2.0)).r;
        float div = texture2D(divergence, uv).r;
        gl_FragColor = vec4((p0 + p1 + p2 + p3) / 4.0 - div);
      }
    `;
    const pressure_frag = `
      precision highp float;
      uniform sampler2D pressure;
      uniform sampler2D velocity;
      uniform vec2 px;
      uniform float dt;
      varying vec2 uv;
      void main(){
        float p0 = texture2D(pressure, uv + vec2(px.x, 0.0)).r;
        float p1 = texture2D(pressure, uv - vec2(px.x, 0.0)).r;
        float p2 = texture2D(pressure, uv + vec2(0.0, px.y)).r;
        float p3 = texture2D(pressure, uv - vec2(0.0, px.y)).r;
        vec2 v = texture2D(velocity, uv).xy;
        gl_FragColor = vec4(v - vec2(p0 - p1, p2 - p3) * 0.5 * dt, 0.0, 1.0);
      }
    `;
    const viscous_frag = `
      precision highp float;
      uniform sampler2D velocity;
      uniform sampler2D velocity_new;
      uniform float v;
      uniform vec2 px;
      uniform float dt;
      varying vec2 uv;
      void main(){
        vec2 old = texture2D(velocity, uv).xy;
        vec2 n0 = texture2D(velocity_new, uv + vec2(px.x * 2.0, 0.0)).xy;
        vec2 n1 = texture2D(velocity_new, uv - vec2(px.x * 2.0, 0.0)).xy;
        vec2 n2 = texture2D(velocity_new, uv + vec2(0.0, px.y * 2.0)).xy;
        vec2 n3 = texture2D(velocity_new, uv - vec2(0.0, px.y * 2.0)).xy;
        vec2 newv = 4.0 * old + v * dt * (n0 + n1 + n2 + n3);
        newv /= 4.0 * (1.0 + v * dt);
        gl_FragColor = vec4(newv, 0.0, 0.0);
      }
    `;

    // ─── ShaderPass ─────────────────────────────────────────────────────
    class ShaderPass {
      props: any; uniforms: any; scene: THREE.Scene | null = null;
      camera: THREE.OrthographicCamera | null = null; material: THREE.RawShaderMaterial | null = null;
      geometry: THREE.PlaneGeometry | null = null; plane: THREE.Mesh | null = null;

      constructor(props: any) {
        this.props = props || {};
        this.uniforms = this.props.material?.uniforms;
      }
      init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        if (this.uniforms) {
          this.material = new THREE.RawShaderMaterial(this.props.material);
          this.geometry = new THREE.PlaneGeometry(2.0, 2.0);
          this.plane = new THREE.Mesh(this.geometry, this.material);
          this.scene.add(this.plane);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      update(..._args: any[]): any {
        Common.renderer!.setRenderTarget(this.props.output || null);
        Common.renderer!.render(this.scene!, this.camera!);
        Common.renderer!.setRenderTarget(null);
      }
    }

    class Advection extends ShaderPass {
      line: THREE.LineSegments | null = null;
      constructor(simProps: any) {
        super({
          material: {
            vertexShader: face_vert, fragmentShader: advection_frag,
            uniforms: {
              boundarySpace: { value: simProps.cellScale },
              px: { value: simProps.cellScale },
              fboSize: { value: simProps.fboSize },
              velocity: { value: simProps.src.texture },
              dt: { value: simProps.dt },
              isBFECC: { value: true },
            },
          },
          output: simProps.dst,
        });
        this.uniforms = this.props.material.uniforms;
        this.init();
      }
      init() {
        super.init();
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(
          new Float32Array([-1,-1,0, -1,1,0, -1,1,0, 1,1,0, 1,1,0, 1,-1,0, 1,-1,0, -1,-1,0]), 3
        ));
        this.line = new THREE.LineSegments(g, new THREE.RawShaderMaterial({
          vertexShader: line_vert, fragmentShader: advection_frag, uniforms: this.uniforms,
        }));
        this.scene!.add(this.line);
      }
      update({ dt, isBounce, BFECC }: any) {
        this.uniforms.dt.value = dt;
        if (this.line) this.line.visible = isBounce;
        this.uniforms.isBFECC.value = BFECC;
        super.update();
      }
    }

    class ExternalForce extends ShaderPass {
      mouse: THREE.Mesh | null = null;
      constructor(simProps: any) {
        super({ output: simProps.dst });
        this.initForce(simProps);
      }
      initForce(simProps: any) {
        super.init();
        const mouseM = new THREE.RawShaderMaterial({
          vertexShader: mouse_vert, fragmentShader: externalForce_frag,
          blending: THREE.AdditiveBlending, depthWrite: false,
          uniforms: {
            px: { value: simProps.cellScale },
            force: { value: new THREE.Vector2(0, 0) },
            center: { value: new THREE.Vector2(0, 0) },
            scale: { value: new THREE.Vector2(simProps.cursor_size, simProps.cursor_size) },
          },
        });
        this.mouse = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mouseM);
        this.scene!.add(this.mouse);
      }
      update(props: any) {
        const fx = (Mouse.diff.x / 2) * props.mouse_force;
        const fy = (Mouse.diff.y / 2) * props.mouse_force;
        const sx = props.cursor_size * props.cellScale.x;
        const sy = props.cursor_size * props.cellScale.y;
        const cx = Math.min(Math.max(Mouse.coords.x, -1 + sx + props.cellScale.x * 2), 1 - sx - props.cellScale.x * 2);
        const cy = Math.min(Math.max(Mouse.coords.y, -1 + sy + props.cellScale.y * 2), 1 - sy - props.cellScale.y * 2);
        const u = (this.mouse!.material as THREE.RawShaderMaterial).uniforms;
        u.force.value.set(fx, fy);
        u.center.value.set(cx, cy);
        u.scale.value.set(props.cursor_size, props.cursor_size);
        super.update();
      }
    }

    class Viscous extends ShaderPass {
      constructor(simProps: any) {
        super({
          material: {
            vertexShader: face_vert, fragmentShader: viscous_frag,
            uniforms: {
              boundarySpace: { value: simProps.boundarySpace },
              velocity: { value: simProps.src.texture },
              velocity_new: { value: simProps.dst_.texture },
              v: { value: simProps.viscous },
              px: { value: simProps.cellScale },
              dt: { value: simProps.dt },
            },
          },
          output: simProps.dst, output0: simProps.dst_, output1: simProps.dst,
        });
        this.init();
      }
      update({ viscous: v, iterations, dt }: any) {
        this.uniforms.v.value = v;
        let fbo_out = this.props.output0;
        for (let i = 0; i < iterations; i++) {
          const fbo_in = i % 2 === 0 ? this.props.output0 : this.props.output1;
          fbo_out = i % 2 === 0 ? this.props.output1 : this.props.output0;
          this.uniforms.velocity_new.value = fbo_in.texture;
          this.props.output = fbo_out;
          this.uniforms.dt.value = dt;
          super.update();
        }
        return fbo_out;
      }
    }

    class Divergence extends ShaderPass {
      constructor(simProps: any) {
        super({
          material: {
            vertexShader: face_vert, fragmentShader: divergence_frag,
            uniforms: {
              boundarySpace: { value: simProps.boundarySpace },
              velocity: { value: simProps.src.texture },
              px: { value: simProps.cellScale },
              dt: { value: simProps.dt },
            },
          },
          output: simProps.dst,
        });
        this.init();
      }
      update({ vel }: any) {
        this.uniforms.velocity.value = vel.texture;
        super.update();
      }
    }

    class Poisson extends ShaderPass {
      constructor(simProps: any) {
        super({
          material: {
            vertexShader: face_vert, fragmentShader: poisson_frag,
            uniforms: {
              boundarySpace: { value: simProps.boundarySpace },
              pressure: { value: simProps.dst_.texture },
              divergence: { value: simProps.src.texture },
              px: { value: simProps.cellScale },
            },
          },
          output: simProps.dst, output0: simProps.dst_, output1: simProps.dst,
        });
        this.init();
      }
      update({ iterations }: any) {
        let p_out = this.props.output0;
        for (let i = 0; i < iterations; i++) {
          const p_in = i % 2 === 0 ? this.props.output0 : this.props.output1;
          p_out = i % 2 === 0 ? this.props.output1 : this.props.output0;
          this.uniforms.pressure.value = p_in.texture;
          this.props.output = p_out;
          super.update();
        }
        return p_out;
      }
    }

    class Pressure extends ShaderPass {
      constructor(simProps: any) {
        super({
          material: {
            vertexShader: face_vert, fragmentShader: pressure_frag,
            uniforms: {
              boundarySpace: { value: simProps.boundarySpace },
              pressure: { value: simProps.src_p.texture },
              velocity: { value: simProps.src_v.texture },
              px: { value: simProps.cellScale },
              dt: { value: simProps.dt },
            },
          },
          output: simProps.dst,
        });
        this.init();
      }
      update({ vel, pressure }: any) {
        this.uniforms.velocity.value = vel.texture;
        this.uniforms.pressure.value = pressure.texture;
        super.update();
      }
    }

    // ─── Simulation ─────────────────────────────────────────────────────
    class Simulation {
      options: any; fbos: any; fboSize: THREE.Vector2; cellScale: THREE.Vector2;
      boundarySpace: THREE.Vector2;
      advection!: Advection; externalForce!: ExternalForce; viscous!: Viscous;
      divergence!: Divergence; poisson!: Poisson; pressure!: Pressure;

      constructor(opts: any = {}) {
        this.options = {
          iterations_poisson: 32, iterations_viscous: 32, mouse_force: 20,
          resolution: 0.5, cursor_size: 100, viscous: 30, isBounce: false,
          dt: 0.014, isViscous: false, BFECC: true, ...opts,
        };
        this.fbos = { vel_0: null, vel_1: null, vel_viscous0: null, vel_viscous1: null, div: null, pressure_0: null, pressure_1: null };
        this.fboSize = new THREE.Vector2();
        this.cellScale = new THREE.Vector2();
        this.boundarySpace = new THREE.Vector2();
        this.init();
      }
      getFloatType() {
        return /iPad|iPhone|iPod/i.test(navigator.userAgent) ? THREE.HalfFloatType : THREE.FloatType;
      }
      createAllFBO() {
        const opts = {
          type: this.getFloatType(), depthBuffer: false, stencilBuffer: false,
          minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
          wrapS: THREE.ClampToEdgeWrapping, wrapT: THREE.ClampToEdgeWrapping,
        };
        for (const key in this.fbos) {
          this.fbos[key] = new THREE.WebGLRenderTarget(this.fboSize.x, this.fboSize.y, opts as any);
        }
      }
      createShaderPass() {
        this.advection = new Advection({ cellScale: this.cellScale, fboSize: this.fboSize, dt: this.options.dt, src: this.fbos.vel_0, dst: this.fbos.vel_1 });
        this.externalForce = new ExternalForce({ cellScale: this.cellScale, cursor_size: this.options.cursor_size, dst: this.fbos.vel_1 });
        this.viscous = new Viscous({ cellScale: this.cellScale, boundarySpace: this.boundarySpace, viscous: this.options.viscous, src: this.fbos.vel_1, dst: this.fbos.vel_viscous1, dst_: this.fbos.vel_viscous0, dt: this.options.dt });
        this.divergence = new Divergence({ cellScale: this.cellScale, boundarySpace: this.boundarySpace, src: this.fbos.vel_viscous0, dst: this.fbos.div, dt: this.options.dt });
        this.poisson = new Poisson({ cellScale: this.cellScale, boundarySpace: this.boundarySpace, src: this.fbos.div, dst: this.fbos.pressure_1, dst_: this.fbos.pressure_0 });
        this.pressure = new Pressure({ cellScale: this.cellScale, boundarySpace: this.boundarySpace, src_p: this.fbos.pressure_0, src_v: this.fbos.vel_viscous0, dst: this.fbos.vel_0, dt: this.options.dt });
      }
      calcSize() {
        const w = Math.max(1, Math.round(this.options.resolution * Common.width));
        const h = Math.max(1, Math.round(this.options.resolution * Common.height));
        this.cellScale.set(1 / w, 1 / h);
        this.fboSize.set(w, h);
      }
      init() {
        this.calcSize();
        this.createAllFBO();
        this.createShaderPass();
      }
      resize() {
        this.calcSize();
        for (const key in this.fbos) this.fbos[key].setSize(this.fboSize.x, this.fboSize.y);
      }
      update() {
        if (this.options.isBounce) { this.boundarySpace.set(0, 0); } else { this.boundarySpace.copy(this.cellScale); }
        this.advection.update({ dt: this.options.dt, isBounce: this.options.isBounce, BFECC: this.options.BFECC });
        this.externalForce.update({ cursor_size: this.options.cursor_size, mouse_force: this.options.mouse_force, cellScale: this.cellScale });
        let vel = this.fbos.vel_1;
        if (this.options.isViscous) {
          vel = this.viscous.update({ viscous: this.options.viscous, iterations: this.options.iterations_viscous, dt: this.options.dt });
        }
        this.divergence.update({ vel });
        const pressure = this.poisson.update({ iterations: this.options.iterations_poisson });
        this.pressure.update({ vel, pressure });
      }
    }

    // ─── Output ─────────────────────────────────────────────────────────
    class Output {
      simulation: Simulation; scene: THREE.Scene; camera: THREE.Camera; output: THREE.Mesh;

      constructor(simOpts: any) {
        this.simulation = new Simulation(simOpts);
        this.scene = new THREE.Scene();
        this.camera = new THREE.Camera();
        this.output = new THREE.Mesh(
          new THREE.PlaneGeometry(2, 2),
          new THREE.RawShaderMaterial({
            vertexShader: face_vert, fragmentShader: color_frag,
            transparent: true, depthWrite: false,
            uniforms: {
              velocity: { value: this.simulation.fbos.vel_0.texture },
              boundarySpace: { value: new THREE.Vector2() },
              palette: { value: paletteTex },
              bgColor: { value: bgVec4 },
            },
          })
        );
        this.scene.add(this.output);
      }
      resize() { this.simulation.resize(); }
      render() {
        Common.renderer!.setRenderTarget(null);
        Common.renderer!.render(this.scene, this.camera);
      }
      update() {
        this.simulation.update();
        this.render();
      }
    }

    // ─── WebGLManager ───────────────────────────────────────────────────
    class WebGLManager {
      lastUserInteraction = performance.now();
      autoDriver: AutoDriver; output: Output;

      constructor(props: any) {
        Common.init(props.$wrapper);
        Mouse.init(props.$wrapper);
        Mouse.autoIntensity = props.autoIntensity ?? 2.0;
        Mouse.takeoverDuration = props.takeoverDuration ?? 0.25;
        Mouse.onInteract = () => {
          this.lastUserInteraction = performance.now();
          this.autoDriver?.forceStop();
        };
        this.autoDriver = new AutoDriver(Mouse, this, {
          enabled: props.autoDemo ?? true,
          speed: props.autoSpeed ?? 0.5,
          resumeDelay: props.autoResumeDelay ?? 1000,
          rampDuration: props.autoRampDuration ?? 0.6,
        });
        this.output = new Output({
          iterations_poisson: props.iterationsPoisson,
          iterations_viscous: props.iterationsViscous,
          mouse_force: props.mouseForce,
          resolution: props.resolution,
          cursor_size: props.cursorSize,
          viscous: props.viscous,
          isBounce: props.isBounce,
          dt: props.dt,
          isViscous: props.isViscous,
          BFECC: props.BFECC,
        });
        props.$wrapper.appendChild(Common.renderer!.domElement);
      }
      resize() {
        Common.resize();
        this.output.resize();
      }
      update() {
        Common.update();
        Mouse.update();
        this.autoDriver.update();
        this.output.update();
      }
      dispose() {
        Mouse.dispose();
        if (Common.renderer) {
          const el = Common.renderer.domElement;
          try { Common.renderer.dispose(); Common.renderer.forceContextLoss(); } catch {}
          el.parentNode?.removeChild(el);
          Common.renderer = null;
        }
      }
    }

    // ─── Boot ────────────────────────────────────────────────────────────
    const webgl = new WebGLManager({
      $wrapper, autoDemo, autoSpeed, autoIntensity, autoResumeDelay,
      autoRampDuration, takeoverDuration, iterationsPoisson, iterationsViscous,
      mouseForce, resolution, cursorSize, viscous, isBounce, dt, isViscous, BFECC,
    });
    webglRef.current = webgl;

    resizeObserverRef.current = new ResizeObserver(() => {
      if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
      resizeRafRef.current = requestAnimationFrame(() => webglRef.current?.resize());
    });
    resizeObserverRef.current.observe($wrapper);

    intersectionObserverRef.current = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { isVisibleRef.current = e.isIntersecting; }); },
      { threshold: 0 }
    );
    intersectionObserverRef.current.observe($wrapper);

    const animate = () => {
      if (isVisibleRef.current) webglRef.current?.update();
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
      resizeObserverRef.current?.disconnect();
      intersectionObserverRef.current?.disconnect();
      webglRef.current?.dispose();
      webglRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, ...style }}
    />
  );
}
