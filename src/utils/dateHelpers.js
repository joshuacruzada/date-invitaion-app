export const formatDate = (date) => date
  ? new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${date}T12:00:00`))
  : 'Your chosen day'

export const formatTime = (time) => {
  if (!time) return 'Your chosen time'
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(`2026-01-01T${time}`))
}
