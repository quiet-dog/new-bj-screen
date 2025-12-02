<template>
	<div class="p-4" :style="{ top: props.svgViewTop }">
		<div ref="svgWrap" class="svg-wrap"></div>
		<div ref="labelWrap" class="label-wrap"></div>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted, onBeforeUnmount, nextTick, computed, watch } from 'vue'
	import { useScadaSvgViewStore } from "../store/scada_data";
	const scadaSvgViewStore = useScadaSvgViewStore();
	// 接收外部传入的 svg 文件名（不带后缀），或完整路径；支持 string | number
	// 例如传 1 => 加载 src/assets/svg/1.svg
	const props = defineProps<{ name?: string | number; initialScale?: number; svgViewTop?: string }>()
	const emit = defineEmits<{
		(e: 'element-click', payload: { code: string; name: string; el: SVGGraphicsElement; event: MouseEvent }): void
	}>()

	const svgWrap = ref<HTMLElement | null>(null)
	const labelWrap = ref<HTMLElement | null>(null)

	// 根据 props.name 计算要加载的 svg 地址
	const svgUrl = computed(() => {
		const name = String(props.name ?? '1')
		// 允许三种形式：
		// 1) 直接传完整 url 或以 / 开头的 public 路径
		// 2) 直接传入 xxx.svg（带扩展名）
		// 3) 仅传文件名（不含后缀），默认从 src/assets/svg 下解析
		if (name.startsWith('http://') || name.startsWith('https://') || name.startsWith('/')) {
			return name
		}
		if (name.endsWith('.svg')) {
			return new URL(`../assets/svg/${name}`, import.meta.url).href
		}
		return new URL(`../assets/svg/${name}.svg`, import.meta.url).href
	})

	function addLabels(svgEl: SVGSVGElement) {
		if (!labelWrap.value) return
		const wrap = labelWrap.value
		wrap.innerHTML = ''
		const targets = svgEl.querySelectorAll('[data-code], [data-name]')
		const rect = wrap.getBoundingClientRect()
		targets.forEach((node) => {
			const el = node as SVGGraphicsElement
			const code = el.getAttribute('data-code') || ''
			const name = el.getAttribute('data-name') || ''
			if (!code && !name) return
			let bbox
			try { bbox = el.getBBox() } catch { return }
			if (!bbox) return
			const cx = bbox.x + bbox.width / 2
			const cy = bbox.y + bbox.height / 2
			const pt = (svgEl as any).createSVGPoint()
			pt.x = cx; pt.y = cy
			const ctm = (el as any).getScreenCTM?.()
			if (!ctm) return
			const sp = pt.matrixTransform(ctm)
			const left = sp.x - rect.left
			const top = sp.y - rect.top
			const div = document.createElement('div')
			div.className = 'html-label'
			div.style.position = 'absolute'
			div.style.left = `${left}px`
			div.style.top = `${top}px`
			div.style.transform = 'translate(-50%, -50%)'
			div.style.pointerEvents = 'none'
			div.style.whiteSpace = 'nowrap'
			div.style.font = '600 14px system-ui, -apple-system, Segoe UI, Roboto, Arial'
			div.style.color = '#111'
			div.style.textShadow = '0 0 3px #fff, 0 0 3px #fff'
			div.style.textAlign = 'center'
			if (code && name) {
				const codeEl = document.createElement('div')
				codeEl.textContent = code
				codeEl.style.fontWeight = '700'
				const nameEl = document.createElement('div')
				nameEl.textContent = name
				nameEl.style.fontWeight = '500'
				div.appendChild(codeEl)
				div.appendChild(nameEl)
			} else {
				div.textContent = code || name
			}

			wrap.appendChild(div)
		})
	}

	// 为具有 data-code 和 data-name 的元素添加点击事件，并暴露为自定义事件给父组件使用
	function wireElementClicks(svgEl: SVGSVGElement) {
		const clickable = svgEl.querySelectorAll('[data-code][data-name]')
		clickable.forEach((node) => {
			const el = node as SVGGraphicsElement
			el.style.cursor = 'pointer'
			el.addEventListener('click', (event: MouseEvent) => {
				const code = el.getAttribute('data-code') || ''
				const name = el.getAttribute('data-name') || ''
				emit('element-click', { code, name, el, event })
			})
		})
	}

	// 基于 viewBox 的缩放和平移
	type PanZoomCtrl = {
		destroy: () => void
		setViewBox: (x: number, y: number, w: number, h: number) => void
		getViewBox: () => [number, number, number, number]
		resetToDefault: () => void
	}

	function setupPanZoom(svgEl: SVGSVGElement, opts?: { initialScale?: number }): PanZoomCtrl {
		const ensureViewBox = () => {
			const vbAttr = svgEl.getAttribute('viewBox')
			if (vbAttr) {
				const parts = vbAttr.split(/\s+/).map(Number)
				return [parts[0] || 0, parts[1] || 0, parts[2] || 100, parts[3] || 100] as [number, number, number, number]
			}
			let x = 0, y = 0, w = 0, h = 0
			try {
				const bb = svgEl.getBBox()
				x = bb.x; y = bb.y; w = bb.width; h = bb.height
			} catch {
				w = Number(svgEl.getAttribute('width')) || svgEl.clientWidth || 100
				h = Number(svgEl.getAttribute('height')) || svgEl.clientHeight || 100
			}
			if (w <= 0 || h <= 0) { w = 100; h = 100 }
			svgEl.setAttribute('viewBox', `${x} ${y} ${w} ${h}`)
			return [x, y, w, h] as [number, number, number, number]
		}

		let [vx, vy, vw, vh] = ensureViewBox()
		const init = { x: vx, y: vy, w: vw, h: vh }
		const state = {
			isPanning: false,
			startX: 0,
			startY: 0,
			startVx: vx,
			startVy: vy,
			minScale: 0.2,
			maxScale: 8,
		}

		const updateVb = () => {
			svgEl.setAttribute('viewBox', `${vx} ${vy} ${vw} ${vh}`)
			// 视窗变化后，重新计算 HTML 覆盖层标签位置
			addLabels(svgEl)
		}

		const setViewBox = (x: number, y: number, w: number, h: number) => {
			vx = x; vy = y; vw = w; vh = h
			updateVb()
		}

		// 应用初始缩放（1=默认，>1 放大，<1 缩小）
		const s = Number(opts?.initialScale ?? 1)
		if (isFinite(s) && s > 0 && Math.abs(s - 1) > 1e-6) {
			const cx = vx + vw / 2
			const cy = vy + vh / 2
			const newW = init.w / s
			const newH = init.h / s
			vx = cx - newW / 2
			vy = cy - newH / 2
			vw = newW
			vh = newH
			updateVb()
		}
		// 记录“默认视角”（应用完初始缩放后的视角），用于后续重置
		const defaultVb: [number, number, number, number] = [vx, vy, vw, vh]

		const wheelHandler = (e: WheelEvent) => {
			e.preventDefault()
			const pt = svgEl.createSVGPoint()
			pt.x = e.clientX; pt.y = e.clientY
			const inv = svgEl.getScreenCTM()?.inverse()
			if (!inv) return
			const p = pt.matrixTransform(inv)
			const factor = e.deltaY > 0 ? 1.1 : 0.9
			const currentScale = init.w / vw
			let targetScale = currentScale / factor
			targetScale = Math.min(state.maxScale, Math.max(state.minScale, targetScale))
			const newW = init.w / targetScale
			const newH = init.h / targetScale
			vx = p.x - (p.x - vx) * (newW / vw)
			vy = p.y - (p.y - vy) * (newH / vh)
			vw = newW; vh = newH
			updateVb()
		}

		const downHandler = (e: MouseEvent) => {
			if (e.button !== 0) return
			// 如果点击在可点击的业务元素上，则不进入拖拽模式，避免影响点击
			const tgt = e.target as Element | null
			if (tgt && (tgt as Element).closest && (tgt as Element).closest('[data-code][data-name]')) {
				return
			}
			state.isPanning = true
			svgEl.style.cursor = 'grabbing'
			state.startX = e.clientX
			state.startY = e.clientY
			state.startVx = vx
			state.startVy = vy
		}

		const moveHandler = (e: MouseEvent) => {
			if (!state.isPanning) return
			const dxClient = e.clientX - state.startX
			const dyClient = e.clientY - state.startY
			const cw = svgEl.clientWidth || 1
			const ch = svgEl.clientHeight || 1
			const dx = dxClient * (vw / cw)
			const dy = dyClient * (vh / ch)
			vx = state.startVx - dx
			vy = state.startVy - dy
			updateVb()
		}

		const upHandler = () => {
			state.isPanning = false
			svgEl.style.cursor = 'grab'
		}

		svgEl.style.cursor = 'grab'
		svgEl.style.touchAction = 'none'
		svgEl.addEventListener('wheel', wheelHandler, { passive: false })
		svgEl.addEventListener('mousedown', downHandler)
		window.addEventListener('mousemove', moveHandler)
		window.addEventListener('mouseup', upHandler)

		return {
			destroy: () => {
				svgEl.removeEventListener('wheel', wheelHandler as any)
				svgEl.removeEventListener('mousedown', downHandler as any)
				window.removeEventListener('mousemove', moveHandler as any)
				window.removeEventListener('mouseup', upHandler as any)
			},
			setViewBox,
			getViewBox: () => [vx, vy, vw, vh],
			resetToDefault: () => {
				setViewBox(defaultVb[0], defaultVb[1], defaultVb[2], defaultVb[3])
			}
		}
	}

	let panZoomCtrl: PanZoomCtrl | null = null

	async function loadSvg() {
		try {
			const url = svgUrl.value
			const res = await fetch(url)
			if (!res.ok) {
				console.error(`[svg_view] 请求失败`, res.status, url)
				if (svgWrap.value) svgWrap.value.innerHTML = ''
				return
			}
			const contentType = res.headers.get('content-type') || ''
			const svgText = await res.text()
			// 防止把 HTML（如 index.html）误注入
			if (!contentType.includes('image/svg+xml') && /<html\b|<!doctype/i.test(svgText)) {
				console.error('[svg_view] 返回的并非 SVG，可能路径不正确:', url)
				if (svgWrap.value) svgWrap.value.innerHTML = ''
				return
			}
			if (!svgWrap.value) return
			svgWrap.value.innerHTML = svgText
			const svgEl = svgWrap.value.querySelector('svg') as SVGSVGElement | null
			if (svgEl) {
				// 让 SVG 自适应容器宽度
				svgEl.style.width = '100%'
				svgEl.style.height = '100%'
				svgEl.style.display = 'block'
				await nextTick()
				wireElementClicks(svgEl)
				if (panZoomCtrl) panZoomCtrl.destroy()
				const highlightCode = String(scadaSvgViewStore.svgHighlight || '')
				const initScale = highlightCode ? undefined : props.initialScale
				panZoomCtrl = setupPanZoom(svgEl, { initialScale: initScale })
				// 加载完成后再应用高亮与居中
				applyHighlight(svgEl, highlightCode, { focus: true })
				// 如果既没有高亮也没有初始缩放（或初始缩放为1），主动计算一次标签
				if (!highlightCode && !(Number(props.initialScale ?? 1) > 0 && Math.abs(Number(props.initialScale ?? 1) - 1) > 1e-6)) {
					addLabels(svgEl)
				}
			}
		} catch (e) {
			console.error('[svg_view] 加载 SVG 出错:', e)
			if (svgWrap.value) svgWrap.value.innerHTML = ''
		}
	}

	function onResize() {
		const svgEl = svgWrap.value?.querySelector('svg')
		if (svgEl) addLabels(svgEl)
	}

	// 高亮逻辑：根据 data-code 匹配元素并应用样式

	function ensureHighlightFilter(svgEl: SVGSVGElement) {
		let defs = svgEl.querySelector('#__hl-defs') as SVGDefsElement | null
		if (!defs) {
			defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs') as SVGDefsElement
			defs.setAttribute('id', '__hl-defs')
			// 发光+膨胀，贴合轮廓的高亮描边
			defs.innerHTML = `
				<filter id="__hl-glow" x="-50%" y="-50%" width="200%" height="200%">
					<feMorphology in="SourceAlpha" operator="dilate" radius="3" result="DILATE" />
					<feGaussianBlur in="DILATE" stdDeviation="3" result="BLUR" />
					<feColorMatrix in="BLUR" type="matrix"
						values="0 0 0 0 1  0 0 0 0 0.83  0 0 0 0 0.2  0 0 0 1 0" result="COLOR" />
					<feMerge>
						<feMergeNode in="COLOR" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>`
			svgEl.prepend(defs)
		}
	}

	function clearHighlight(svgEl: SVGSVGElement) {
		// 移除旧的高亮 class
		svgEl.querySelectorAll('.__hl').forEach(n => n.classList.remove('__hl'))
	}

	// 计算元素在根 SVG 坐标系下的包围盒
	function getBBoxInRoot(svgEl: SVGSVGElement, el: SVGGraphicsElement): { x: number, y: number, width: number, height: number } | null {
		let bbox: DOMRect
		try { bbox = (el as any).getBBox() } catch { return null }
		if (!bbox) return null
		const elCtm = (el as any).getScreenCTM?.()
		const rootInv = (svgEl as any).getScreenCTM?.().inverse?.()
		if (!elCtm || !rootInv) return null
		const mkPt = (x: number, y: number) => {
			const p = (svgEl as any).createSVGPoint(); p.x = x; p.y = y; return p
		}
		const p1 = mkPt(bbox.x, bbox.y).matrixTransform(elCtm).matrixTransform(rootInv)
		const p2 = mkPt(bbox.x + bbox.width, bbox.y + bbox.height).matrixTransform(elCtm).matrixTransform(rootInv)
		const x = Math.min(p1.x, p2.x)
		const y = Math.min(p1.y, p2.y)
		const width = Math.abs(p2.x - p1.x)
		const height = Math.abs(p2.y - p1.y)
		return { x, y, width, height }
	}

	function unionRects(rects: Array<{ x: number, y: number, width: number, height: number }>) {
		if (rects.length === 0) return null
		let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
		rects.forEach(r => {
			minX = Math.min(minX, r.x)
			minY = Math.min(minY, r.y)
			maxX = Math.max(maxX, r.x + r.width)
			maxY = Math.max(maxY, r.y + r.height)
		})
		return { x: minX, y: minY, width: maxX - minX, height: maxY - minY }
	}

	function focusOnRect(svgEl: SVGSVGElement, rect: { x: number, y: number, width: number, height: number }, paddingRatio = 0.2) {
		const padX = rect.width * paddingRatio
		const padY = rect.height * paddingRatio
		const x = rect.x - padX
		const y = rect.y - padY
		const w = rect.width + padX * 2
		const h = rect.height + padY * 2
		// 通过 panZoom 控制器更新内部状态，避免后续拖拽出错
		if (panZoomCtrl) {
			panZoomCtrl.setViewBox(x, y, w, h)
		} else {
			// 兜底：直接设置属性
			svgEl.setAttribute('viewBox', `${x} ${y} ${w} ${h}`)
			addLabels(svgEl)
		}
	}

	function applyHighlight(svgEl: SVGSVGElement, code: string, opts?: { focus?: boolean }) {
		clearHighlight(svgEl)
		if (!code) return
		ensureHighlightFilter(svgEl)
		const matched: SVGGraphicsElement[] = []
		const all = svgEl.querySelectorAll('[data-code]')
		all.forEach((node) => {
			const el = node as SVGGraphicsElement
			if ((el.getAttribute('data-code') || '') === code) {
				el.classList.add('__hl')
				matched.push(el)
			}
		})
		if (matched.length && opts?.focus !== false) {
			const rects = matched
				.map(el => getBBoxInRoot(svgEl, el))
				.filter(Boolean) as Array<{ x: number, y: number, width: number, height: number }>
			const uni = unionRects(rects)
			if (uni) focusOnRect(svgEl, uni, 0.25)
		}
	}

	onMounted(() => {
		loadSvg()
		window.addEventListener('resize', onResize)
	})

	onBeforeUnmount(() => {
		window.removeEventListener('resize', onResize)
		if (panZoomCtrl) panZoomCtrl.destroy()
	})

	// 当外部 name 变化时，重新加载 SVG
	watch(() => props.name, () => {
		loadSvg()
	})

	// 监听全局 store 的高亮值变化，应用到当前 SVG
	watch(() => scadaSvgViewStore.svgHighlight, (val) => {
		const svgEl = svgWrap.value?.querySelector('svg') as SVGSVGElement | null
		const code = String(val || '')
		if (svgEl) {
			applyHighlight(svgEl, code, { focus: true })
			// 若高亮被清空，则重置视角和缩放到默认
			if (!code && panZoomCtrl) {
				// panZoomCtrl.resetToDefault()
			}
		}
	})
</script>

<style lang="scss" scoped>
	.p-4 {
		height: 60vh;
		width: 100vw;
		position: fixed;
		left: 0;
		top: 20%;
		z-index: 1;
			//  pointer-events: none;


		.svg-wrap {
			width: 100%;
			height: 100%;
			/* 可按需设定最大宽高，确保页面布局稳定 */
			// 事件穿透
			// pointer-events: all;
		}

		.label-wrap {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			pointer-events: none;
			overflow: hidden;
		}
	}

	/* 使用深选择器影响内联注入的 SVG 元素的 class */
	:deep(svg .__hl),
	:deep(svg .__hl *) {
		stroke: #ffff00 !important;
		stroke-width: 6px !important;
		vector-effect: non-scaling-stroke;
	}

	/* 贴合轮廓的发光边框效果（依赖于 defs 中的 __hl-glow） */
	:deep(svg .__hl) {
		filter: url(#__hl-glow);
	}

</style>
