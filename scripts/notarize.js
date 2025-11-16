const { notarize } = require('@electron/notarize')

module.exports = async function (context) {
  const { electronPlatformName, appOutDir } = context

  if (electronPlatformName !== 'darwin') {
    return
  }

  // Check if notarization credentials are available
  if (!process.env.APPLE_ID || !process.env.APPLE_APP_SPECIFIC_PASSWORD || !process.env.APPLE_TEAM_ID) {
    console.log('Skipping notarization: APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD, or APPLE_TEAM_ID not set')
    return
  }

  const appName = context.packager.appInfo.productFilename

  console.log(`Notarizing ${appName}...`)

  try {
    await notarize({
      tool: 'notarytool',
      appPath: `${appOutDir}/${appName}.app`,
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID
    })

    console.log(`Successfully notarized ${appName}`)
  } catch (error) {
    console.error('Notarization failed:', error)
    throw error
  }
}
