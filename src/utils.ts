export function setupCanvasSize(ctx: CanvasRenderingContext2D) {
  const dpr = window.devicePixelRatio || 1
  const fitSize = Math.min(window.screen.width, window.screen.height)
  ctx.canvas.width = fitSize * dpr
  ctx.canvas.height = fitSize * dpr

  addEventListener('resize', () => {
    const scaleX = window.innerWidth / ctx.canvas.width
    const scaleY = window.innerHeight / ctx.canvas.height
    ctx.canvas.style.transform = `scale(${Math.min(scaleX, scaleY)}) translate(-50%,-50%)`
  })

  dispatchEvent(new Event('resize'))
}
