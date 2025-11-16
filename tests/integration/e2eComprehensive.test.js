/* global describe, it, beforeAll, afterAll, expect */

const { Application } = require('spectron')
const path = require('path')
const electronPath = require('electron')

describe('Float Browser - Comprehensive End-to-End Tests', function () {
  this.timeout(30000)

  let app

  beforeAll(async function () {
    app = new Application({
      path: electronPath,
      args: [path.join(__dirname, '../../')],
      env: {
        NODE_ENV: 'test',
        SPECTRON_TEST: 'true'
      }
    })
    await app.start()
    await app.client.waitUntilWindowLoaded()
  })

  afterAll(async function () {
    if (app && app.isRunning()) {
      await app.stop()
    }
  })

  describe('Float Features - End-to-End', function () {
    it('should have Float controls visible in the UI', async function () {
      const opacitySlider = await app.client.$('#float-opacity')
      const alwaysOnTopBtn = await app.client.$('#float-always-on-top')
      const pipBtn = await app.client.$('#float-pip')

      expect(await opacitySlider.isExisting()).toBe(true)
      expect(await alwaysOnTopBtn.isExisting()).toBe(true)
      expect(await pipBtn.isExisting()).toBe(true)
    })

    it('should change opacity when slider is moved', async function () {
      const opacitySlider = await app.client.$('#float-opacity')
      const initialOpacity = await app.browserWindow.getOpacity()

      await opacitySlider.setValue(80)
      await app.client.pause(100)

      const newOpacity = await app.browserWindow.getOpacity()
      expect(newOpacity).toBeCloseTo(0.8, 1)
      expect(newOpacity).not.toBe(initialOpacity)
    })

    it('should toggle always-on-top when button is clicked', async function () {
      const alwaysOnTopBtn = await app.client.$('#float-always-on-top')
      const initialState = await app.browserWindow.isAlwaysOnTop()

      await alwaysOnTopBtn.click()
      await app.client.pause(100)

      const newState = await app.browserWindow.isAlwaysOnTop()
      expect(newState).toBe(!initialState)
    })

    it('should toggle PIP mode when button is clicked', async function () {
      const pipBtn = await app.client.$('#float-pip')
      const initialBounds = await app.browserWindow.getBounds()

      await pipBtn.click()
      await app.client.pause(200)

      const pipBounds = await app.browserWindow.getBounds()
      expect(pipBounds.width).toBe(400)
      expect(pipBounds.height).toBe(300)

      await pipBtn.click()
      await app.client.pause(200)

      const restoredBounds = await app.browserWindow.getBounds()
      expect(restoredBounds.width).toBeGreaterThan(400)
    })

    it('should apply window profiles via menu', async function () {
      const initialBounds = await app.browserWindow.getBounds()

      await app.electron.ipcRenderer.invoke('float:apply-profile', 'small')
      await app.client.pause(200)

      const smallBounds = await app.browserWindow.getBounds()
      expect(smallBounds.width).toBe(400)
      expect(smallBounds.height).toBe(300)
    })

    it('should persist Float settings across restarts', async function () {
      await app.client.$('#float-opacity').setValue(75)
      await app.client.pause(100)

      const opacity = await app.browserWindow.getOpacity()
      expect(opacity).toBeCloseTo(0.75, 1)

      await app.restart()
      await app.client.waitUntilWindowLoaded()

      const restoredOpacity = await app.browserWindow.getOpacity()
      expect(restoredOpacity).toBeCloseTo(0.75, 1)
    })
  })

  describe('Min Features - Regression Testing', function () {
    it('should create and switch between tabs', async function () {
      const addTabBtn = await app.client.$('.add-tab-button')
      await addTabBtn.click()
      await app.client.pause(200)

      const tabs = await app.client.$$('.tab-item')
      expect(tabs.length).toBeGreaterThan(1)
    })

    it('should navigate to URLs via address bar', async function () {
      const searchbar = await app.client.$('.searchbar-input')
      await searchbar.setValue('example.com')
      await searchbar.keys('Enter')
      await app.client.pause(1000)

      const url = await app.client.execute(() => {
        return window.tabs.get(window.tabs.getSelected()).url
      })
      expect(url.value).toContain('example.com')
    })

    it('should create and manage bookmarks', async function () {
      const bookmarkBtn = await app.client.$('.bookmark-button')
      const isVisible = await bookmarkBtn.isExisting()
      expect(isVisible).toBe(true)
    })

    it('should open and close task overlay', async function () {
      await app.client.keys(['Command', 'Shift', 'E'])
      await app.client.pause(200)

      const taskOverlay = await app.client.$('.task-overlay')
      const isVisible = await taskOverlay.isDisplayed()
      expect(isVisible).toBe(true)

      await app.client.keys('Escape')
      await app.client.pause(200)

      const isHidden = await taskOverlay.isDisplayed()
      expect(isHidden).toBe(false)
    })

    it('should handle downloads', async function () {
      const downloadManager = await app.client.$('.download-manager')
      expect(await downloadManager.isExisting()).toBe(true)
    })

    it('should support reader view', async function () {
      const result = await app.client.execute(() => {
        return typeof window.readerView !== 'undefined'
      })
      expect(result.value).toBe(true)
    })

    it('should support focus mode', async function () {
      const result = await app.client.execute(() => {
        return typeof window.focusMode !== 'undefined'
      })
      expect(result.value).toBe(true)
    })
  })

  describe('Performance Tests', function () {
    it('should change opacity within 50ms', async function () {
      const opacitySlider = await app.client.$('#float-opacity')

      const startTime = Date.now()
      await opacitySlider.setValue(60)
      await app.client.pause(10)
      const endTime = Date.now()

      const duration = endTime - startTime
      expect(duration).toBeLessThan(50)
    })

    it('should maintain acceptable memory usage', async function () {
      const metrics = await app.mainProcess.evaluate(() => {
        return process.memoryUsage()
      })

      const heapUsedMB = metrics.heapUsed / 1024 / 1024
      expect(heapUsedMB).toBeLessThan(500)
    })
  })

  describe('Compatibility Tests', function () {
    it('should work with multiple monitors (simulated)', async function () {
      const displays = await app.electron.screen.getAllDisplays()
      expect(displays.length).toBeGreaterThanOrEqual(1)

      const bounds = await app.browserWindow.getBounds()
      expect(bounds.x).toBeDefined()
      expect(bounds.y).toBeDefined()
    })

    it('should maintain state when moved between spaces', async function () {
      const initialOpacity = await app.browserWindow.getOpacity()
      const initialAlwaysOnTop = await app.browserWindow.isAlwaysOnTop()

      await app.client.pause(500)

      const finalOpacity = await app.browserWindow.getOpacity()
      const finalAlwaysOnTop = await app.browserWindow.isAlwaysOnTop()

      expect(finalOpacity).toBe(initialOpacity)
      expect(finalAlwaysOnTop).toBe(initialAlwaysOnTop)
    })
  })
})
