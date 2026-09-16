import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Film,
  Gamepad2,
  Heart,
  Mail,
  Paintbrush,
  Plus,
  Utensils,
  X,
} from 'lucide-react'

const categories = [
  { id: 'ramen', name: 'Ramen', description: 'A warm bowl and good conversation.', icon: Utensils, image: '/assets/ramen.png', emoji: 'ðŸœ' },
  { id: 'arcade', name: 'Arcade', description: 'Games, laughs, and friendly competition.', icon: Gamepad2, image: '/assets/arcade.png', emoji: 'ðŸ•¹ï¸' },
  { id: 'cinema', name: 'Cinema', description: 'A movie date with snacks.', icon: Film, image: '/assets/cinema.png', emoji: 'ðŸ¿' },
  { id: 'painting', name: 'Painting', description: "Let's make something together.", icon: Paintbrush, image: '/assets/painting.png', emoji: 'ðŸŽ¨' },
  { id: 'custom', name: 'Something new?', description: 'Add your own date idea.', icon: Plus, image: null, emoji: '+' },
]

const initialInvitation = {
  categoryId: '',
  categoryName: '',
  title: '',
  date: '',
  time: '',
  recipientEmail: '',
}

const formatDate = (date) => date
  ? new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${date}T12:00:00`))
  : 'Your chosen day'

const formatTime = (time) => {
  if (!time) return 'Your chosen time'
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(`2026-01-01T${time}`))
}

function Envelope({ onOpen }) {
  const [isOpening, setIsOpening] = useState(false)

  const openEnvelope = () => {
    if (isOpening) return
    setIsOpening(true)
    window.setTimeout(onOpen, 720)
  }

  return (
    <section className="invite-shell invite-shell--landing">
      <div className="float-mark float-mark--one"></div>
      <div className="float-mark float-mark--two">âœ¦</div>
      <div className="eyebrow">A little something for you</div>
      <h1 className="script-title">A special<br />letter for you</h1>
      <div className={`envelope-wrap ${isOpening ? 'is-opening' : ''}`} onClick={openEnvelope} role="button" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && openEnvelope()}>
        <div className="envelope-stage">
          <img className="envelope-image envelope-image--closed" src="/assets/envelope.png" alt="Closed pink envelope" />
          <img className="envelope-image envelope-image--open" src="/assets/open-envelope.png" alt="Open pink envelope" />
          {/* <div className="envelope-letter" aria-hidden="true">
            <span>template for question</span>
            <Heart size={16} fill="currentColor" />
          </div> */}
        </div>
      </div>
      <p className="text-button text-button--plain" onClick={openEnvelope} role="button" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && openEnvelope()} aria-label="Click to open the envelope">Click to open <Heart size={16} fill="currentColor" /></p>
    </section>
  )
}

function QuestionCard({ onYes }) {
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 })
  const noButtonRef = useRef(null)
  const lastMove = useRef(0)
  const moveNo = (pointerX) => {
    const now = Date.now()
    if (now - lastMove.current < 180) return
    lastMove.current = now

    const button = noButtonRef.current?.getBoundingClientRect()
    const buttonCenter = button ? button.left + button.width / 2 : pointerX
    const awayDirection = pointerX < buttonCenter ? -1 : 1
    const horizontalDistance = 110 + Math.random() * 85
    const verticalDistance = (Math.random() - 0.5) * 130

    setNoPosition((current) => ({
      x: Math.max(-180, Math.min(180, current.x + awayDirection * horizontalDistance)),
      y: Math.max(-82, Math.min(82, current.y + verticalDistance)),
    }))
  }
  const keepAway = (event) => {
    const button = noButtonRef.current?.getBoundingClientRect()
    if (!button) return
    const closestX = Math.max(button.left, Math.min(event.clientX, button.right))
    const closestY = Math.max(button.top, Math.min(event.clientY, button.bottom))
    const distance = Math.hypot(event.clientX - closestX, event.clientY - closestY)
    if (distance < 115) moveNo(event.clientX, event.clientY)
  }

  return (
    <section className="invite-shell invite-shell--question">
      <div className="question-stage">
        <img className="question-envelope-back" src="/assets/open-envelope.png" alt="" />
        <div className="paper-card">
          <div className="question-inner">
            <p className="eyebrow">Just between us</p>
            <h1 className="script-title script-title--small">template for question</h1>
            <div className="heart-rule"><span /> <Heart size={18} fill="currentColor" /> <span /></div>
            <div className="choice-row" onPointerMove={keepAway}>
              <button type="button" onClick={onYes} className="primary-button">Yes <Heart size={18} fill="currentColor" /></button>
              <button
                type="button"
                ref={noButtonRef}
                onPointerEnter={(event) => moveNo(event.clientX)}
                onPointerDown={(event) => { event.preventDefault(); moveNo(event.clientX) }}
                onClick={() => moveNo(noButtonRef.current?.getBoundingClientRect().left ?? 0)}
                style={{ transform: `translate(${noPosition.x}px, ${noPosition.y}px)` }}
                className="secondary-button secondary-button--no"
              >
                <span className="no-button-inner">
                  <X size={14} strokeWidth={2.5} />
                  <span>No</span>
                </span>
              </button>
            </div>
            <p className="hint">There is only one right answer <Heart size={13} fill="currentColor" /></p>
          </div>
        </div>
      </div>
    </section>
  )
}

function CategoryScreen({ onSelect, onBack }) {
  return (
    <section className="invite-shell invite-shell--categories">
      <button type="button" className="back-button" onClick={onBack}><ArrowLeft size={16} /> Back</button>
      <p className="eyebrow">Pick a date idea</p>
      <h1 className="script-title script-title--small">What shall we do?</h1>
      <Heart className="category-heart" size={15} fill="currentColor" />
      <div className="category-grid">
        {categories.map(({ id, name, description, icon: Icon, image }) => (
          <button type="button" key={id} onClick={() => onSelect(id)} className="category-card">
            <span className={`category-art ${id === 'custom' ? 'category-art--custom' : ''}`}>
              {id === 'custom' ? (
                <span className="custom-plus-only">+</span>
              ) : image ? (
                <img src={image} alt="" />
              ) : (
                <Plus size={38} strokeWidth={1.4} />
              )}
              {id !== 'custom' && <Icon size={20} strokeWidth={1.5} />}
            </span>
            <span className="category-name">{name}</span>
            <span className="category-description">{description}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

function ScheduleModal({ category, invitation, setInvitation, onClose, onCreate }) {
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
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="schedule-modal" role="dialog" aria-modal="true" aria-labelledby="schedule-title">
        <button type="button" className="icon-button modal-close" onClick={onClose} aria-label="Close schedule"><X size={19} /></button>
        <p className="eyebrow">Make it official</p>
        <h2 id="schedule-title" className="script-title script-title--modal">Plan the date</h2>
        <div className="selected-category"><span className="selected-category__art">{category.image ? <img src={category.image} alt="" /> : <Plus size={24} strokeWidth={1.5} />}</span><span><strong>{category.name}</strong><small>{category.description}</small></span></div>
        <form onSubmit={submit} className="schedule-form">
          <label>Title<input ref={titleRef} value={invitation.title} onChange={update('title')} placeholder={`e.g. ${category.name} date`} /></label>
          <div className="form-row"><label>Date<div className="input-with-icon"><CalendarDays size={16} /><input type="date" value={invitation.date} onChange={update('date')} /></div></label><label>Time<div className="input-with-icon"><Clock3 size={16} /><input type="time" value={invitation.time} onChange={update('time')} /></div></label></div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="primary-button primary-button--wide">Create invitation <Heart size={17} fill="currentColor" /></button>
        </form>
      </div>
    </div>
  )
}

function Preview({ invitation, setInvitation, category, onBack }) {
  const [sent, setSent] = useState(false)
  const subject = `${category.name} date? `
  const body = `Hi Eny,\n\nI'd love to go on a date with you!\n\nDate idea: ${category.name}\nPlan: ${invitation.title}\nDate: ${formatDate(invitation.date)}\nTime: ${formatTime(invitation.time)}\n\nHope you can make it!\n\nLove,`
  const gmailCompose = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(invitation.recipientEmail)}&cc=${encodeURIComponent('sevillajen015@gmail.com')}&su=${encodeURIComponent('A little date invitation for you')}&body=${encodeURIComponent(body)}`

  return (
    <section className="invite-shell invite-shell--preview">
      <button type="button" className="back-button" onClick={onBack}><ArrowLeft size={16} /> Back</button>
      <p className="eyebrow">It is ready</p>
      <h1 className="script-title script-title--small">Your invitation is ready! <Heart size={19} fill="currentColor" /></h1>
      <p className="preview-subtitle">Here is a little preview of your email.</p>
      <div className="email-card">
        <div className="email-meta"><span>To:</span><input aria-label="Recipient email" value={invitation.recipientEmail} onChange={(event) => setInvitation((current) => ({ ...current, recipientEmail: event.target.value }))} placeholder="her@email.com" /></div>
        <div className="email-meta"><span>Subject:</span><strong>{subject}</strong></div>
        <div className="email-divider" />
        <p>Hi Eny,</p><p>I'd love to go on a date with you!</p>
        <p className="email-detail"><strong> Date idea:</strong> {category.name}<br /><strong> Plan:</strong> {invitation.title}<br /><strong> Date:</strong> {formatDate(invitation.date)}<br /><strong> Time:</strong> {formatTime(invitation.time)}</p>
        <p>Hope you can make it!</p>
        <p>See you there? </p>
      </div>
      <a className="primary-button mail-button" href={gmailCompose} target="_blank" rel="noreferrer" onClick={() => setSent(true)}> <Mail size={18} /> Send with Gmail</a>
      {sent && <p className="send-confirmation" role="status"><Heart size={15} fill="currentColor" /> Gmail opened. Your invitation is ready to send.</p>}
    </section>
  )
}

function App() {
  const [step, setStep] = useState('envelope')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [invitation, setInvitation] = useState(initialInvitation)
  const category = categories.find((item) => item.id === selectedCategory) ?? categories[0]

  const chooseCategory = (id) => {
    setSelectedCategory(id)
    setInvitation((current) => ({ ...current, categoryId: id, categoryName: categories.find((item) => item.id === id).name }))
  }

  return (
    <main className="app-canvas">
      <div className="corner-note corner-note--left">Good food<br />brighter days</div>
      <div className="corner-note corner-note--right">With you </div>
      <div className="progress-dots" aria-label={`Step ${['envelope', 'question', 'categories', 'preview'].indexOf(step) + 1} of 4`}>
        {['envelope', 'question', 'categories', 'preview'].map((item, index) => <span key={item} className={['envelope', 'question', 'categories', 'preview'].indexOf(step) >= index ? 'is-active' : ''} />)}
      </div>
      {step === 'envelope' && <Envelope onOpen={() => setStep('question')} />}
      {step === 'question' && <QuestionCard onYes={() => setStep('categories')} />}
      {step === 'categories' && <CategoryScreen onSelect={chooseCategory} onBack={() => setStep('question')} />}
      {step === 'preview' && <Preview invitation={invitation} setInvitation={setInvitation} category={category} onBack={() => { setSelectedCategory(null); setStep('categories') }} />}
      {step === 'categories' && selectedCategory && <ScheduleModal category={category} invitation={invitation} setInvitation={setInvitation} onClose={() => setSelectedCategory(null)} onCreate={() => { setSelectedCategory(selectedCategory); setStep('preview') }} />}
      <footer className="app-footer"><Heart size={13} fill="currentColor" /> made for a little adventure</footer>
    </main>
  )
}

export default App

