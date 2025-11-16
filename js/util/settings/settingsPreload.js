window.addEventListener('message', function (e) {
  if (!e.origin.startsWith('min://')) {
    return
  }

  if (e.data && e.data.message && e.data.message === 'getSettingsData') {
    ipc.send('getSettingsData')
  }

  if (e.data && e.data.message && e.data.message === 'setSetting') {
    ipc.send('setSetting', { key: e.data.key, value: e.data.value })
  }

  // Float settings dialog handlers
  if (e.data && e.data.message && e.data.message === 'openFloatShortcutsDialog') {
    ipc.invoke('openFloatShortcutsDialog')
  }

  if (e.data && e.data.message && e.data.message === 'openFloatProfilesDialog') {
    ipc.invoke('openFloatProfilesDialog')
  }
})

ipc.on('receiveSettingsData', function (e, data) {
  if (window.location.toString().startsWith('min://')) { // probably redundant, but might as well check
    window.postMessage({ message: 'receiveSettingsData', settings: data }, window.location.toString())
  }
})
