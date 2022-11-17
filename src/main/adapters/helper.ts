export const trimmer = (body: any): any => {
  const trimmed = {}
  for (const [key, value] of Object.entries(body)) {
    if (key.includes('uthorization')) return
    if (typeof (value) === 'string') { Object.assign(trimmed, { [key]: value.trim() }) }
  }
  return trimmed
}
