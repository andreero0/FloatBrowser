const path = require('path')
const fs = require('fs')

const outFile = path.resolve(__dirname, '../main.build.js')

const modules = [
  'dist/localization.build.js',
  'main/windowManagement.js',
  'js/util/keyMap.js',
  'js/float/floatMenu.js',
  'main/menu.js',
  'main/touchbar.js',
  'main/registryConfig.js',
  'js/util/settings/settingsMain.js',
  'js/float/floatSettings.js',
  'js/float/floatWindowManager.js',
  'js/float/floatShortcuts.js',
  'js/float/floatProfiles.js',
  'js/float/floatWelcome.js',
  'main/main.js',
  'main/minInternalProtocol.js',
  'main/filtering.js',
  'main/viewManager.js',
  'main/download.js',
  'main/UASwitcher.js',
  'main/permissionManager.js',
  'main/prompt.js',
  'main/remoteMenu.js',
  'main/remoteActions.js',
  'main/keychainService.js',
  'js/util/proxy.js',
  'main/themeMain.js'
]

function buildMain () {
  // build localization support first, since it is included in the bundle
  require('./buildLocalization.js')()

  /* Add common dependencies header to avoid duplicate declarations */
  let output = '/* Common dependencies - declared once for all concatenated modules */\n'
  output += 'const path = require(\'path\')\n'
  output += 'const fs = require(\'fs\')\n\n'

  /* concatenate modules */
  modules.forEach(function (script) {
    let moduleCode = fs.readFileSync(path.resolve(__dirname, '../', script), 'utf-8')
    
    // Remove duplicate const declarations for path and fs from individual modules
    moduleCode = moduleCode.replace(/^const path = require\('path'\)\n?/gm, '// path already declared\n')
    moduleCode = moduleCode.replace(/^const fs = require\('fs'\)\n?/gm, '// fs already declared\n')
    
    output += moduleCode + ';\n'
  })

  fs.writeFileSync(outFile, output, 'utf-8')
}

if (module.parent) {
  module.exports = buildMain
} else {
  buildMain()
}
