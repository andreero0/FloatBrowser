// Load environment variables from .env file
require('dotenv').config()

const builder = require('electron-builder')
const Arch = builder.Arch
const Platform = builder.Platform

const packageFile = require('./../package.json')
const version = packageFile.version
const platform = process.argv.find(arg => arg.match('platform'))?.split('=')[1] || 'x86'

function toArch (platform) {
  switch (platform) {
    case 'x86':
      return Arch.x64
    case 'arm64':
      return Arch.arm64
    case 'universal':
      return Arch.universal
  }
}

async function buildDMG () {
  console.log(`Building DMG for ${platform}...`)

  // Notarization is temporarily disabled due to Apple rejection
  // The app is still code-signed with Developer ID
  // To enable notarization, set ENABLE_NOTARIZATION=true in .env
  const notarizeConfig = process.env.ENABLE_NOTARIZATION === 'true' && process.env.APPLE_ID && process.env.APPLE_APP_SPECIFIC_PASSWORD && process.env.APPLE_TEAM_ID
    ? { teamId: process.env.APPLE_TEAM_ID }
    : false

  if (!notarizeConfig) {
    console.log('Notarization disabled - build will be code-signed but not notarized')
    console.log('To enable notarization, add ENABLE_NOTARIZATION=true to .env file')
  } else {
    console.log('Notarization enabled - this will take 5-15 minutes')
  }

  const options = {
    appId: 'com.floatbrowser.app',
    productName: 'Float Browser',
    files: [
      '**/*',
      '!**/{.DS_Store,.git,.hg,.svn,CVS,RCS,SCCS,.gitignore,.gitattributes}',
      '!**/{appveyor.yml,.travis.yml,circle.yml}',
      '!**/node_modules/*.d.ts',
      '!**/*.map',
      '!**/*.md',
      '!**/._*',
      '!**/icons/source',
      '!dist/app',
      '!**/icons/icon.icns',
      '!localization/',
      '!scripts/',
      '!**/main',
      '!**/node_modules/@types/',
      '!**/node_modules/pdfjs-dist/legacy',
      '!**/node_modules/pdfjs-dist/lib',
      '!**/node_modules/*/{test,__tests__,tests,powered-test,example,examples}'
    ],
    mac: {
      icon: 'icons/icon.icns',
      target: 'dmg',
      darkModeSupport: true,
      hardenedRuntime: true,
      gatekeeperAssess: false,
      entitlements: 'resources/entitlements.mac.plist',
      entitlementsInherit: 'resources/entitlements.mac.plist',
      x64ArchFiles: 'Contents/Resources/app/node_modules/fsevents/fsevents.node',
      notarize: notarizeConfig,
      extendInfo: {
        NSHumanReadableCopyright: 'Copyright © 2024 Float Browser',
        CFBundleDocumentTypes: [
          {
            CFBundleTypeName: 'HTML document',
            CFBundleTypeRole: 'Viewer',
            LSItemContentTypes: ['public.html']
          },
          {
            CFBundleTypeName: 'XHTML document',
            CFBundleTypeRole: 'Viewer',
            LSItemContentTypes: ['public.xhtml']
          }
        ],
        NSUserActivityTypes: ['NSUserActivityTypeBrowsingWeb'],
        LSFileQuarantineEnabled: true
      }
    },
    dmg: {
      contents: [
        {
          x: 130,
          y: 220
        },
        {
          x: 410,
          y: 220,
          type: 'link',
          path: '/Applications'
        }
      ],
      title: 'Float Browser ${version}',
      icon: 'icons/icon.icns',
      background: null,
      window: {
        width: 540,
        height: 380
      }
    },
    directories: {
      output: 'dist/app',
      buildResources: 'resources'
    },
    protocols: [
      {
        name: 'HTTP link',
        schemes: ['http', 'https']
      },
      {
        name: 'File',
        schemes: ['file']
      }
    ],
    asar: false,
    publish: null,
    npmRebuild: false
  }

  const target = Platform.MAC.createTarget(['dmg'], toArch(platform))

  try {
    await builder.build({
      targets: target,
      config: options
    })
    console.log(`Successfully built DMG for ${platform}`)
  } catch (error) {
    console.error('DMG build failed:', error)
    process.exit(1)
  }
}

buildDMG()
