import { useEffect, useRef, useState } from 'react'
import { CalendarDays, Clock3, Heart, Plus, X } from 'lucide-react'

export default function ScheduleModal({ category, invitation, setInvitation, onClose, onCreate }) {
  const titleRef = useRef(null)
  const [error, setError] = useState('')

  useEffect(() => {
    titleRef.current?.focus()
    const closeOnEscape = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', closeOnEscape)
    document.body.classList.add('modal-open')

    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.body.classList.remove('modal-open')
    }
  }, [onClose])

  const update = (field) => (event) => setInvitation((current) => ({ ...current, [field]: event.target.value }))

  const submit = (event) => {
    event.preventDefault()
    if (!invitation.title || !invitation.date || !invitation.time) {
      setError('Add a title, date, and time to continue.')
      return
    }
    onCreate()
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="schedule-modal" role="dialog" aria-modal="true" aria-labelledby="schedule-title">
        <button type="button" className="icon-button modal-close" onClick={onClose} aria-label="Close schedule"><X size={19} /></button>
        <p className="eyebrow">Make it official</p>
        <h2 id="schedule-title" className="script-title script-title--modal">Plan the date</h2>
        <div className="selected-category">
          <span className="selected-category__art">
            {category.image ? <img src={category.image} alt="" /> : <Plus size={24} strokeWidth={1.5} />}
          </span>
          <span>
            <strong>{category.name}</strong>
            <small>{category.description}</small>
          </span>
        </div>
        <form onSubmit={submit} className="schedule-form">
          <label>
            Title
            <input ref={titleRef} value={invitation.title} onChange={update('title')} placeholder={`e.g. ${category.name} date`} />
          </label>
          <div className="form-row">
            <label>
              Date
              <div className="input-with-icon">
                <CalendarDays size={16} />
                <input type="date" value={invitation.date} onChange={update('date')} />
              </div>
            </label>
            <label>
              Time
              <div className="input-with-icon">
                <Clock3 size={16} />
                <input type="time" value={invitation.time} onChange={update('time')} />
              </div>
            </label>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="primary-button primary-button--wide">Create invitation <Heart size={17} fill="currentColor" /></button>
        </form>
      </div>
    </div>
  )
}
