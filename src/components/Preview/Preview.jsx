import { useState } from 'react'
import { ArrowLeft, Heart, Mail } from 'lucide-react'
import { formatDate, formatTime } from '../../utils/dateHelpers'

export default function Preview({ invitation, setInvitation, category, onBack }) {
  const [sent, setSent] = useState(false)
  const body = `Hi Eny,\n\nI'd love to go on a date with you!\n\nDate idea: ${category.name}\nPlan: ${invitation.title}\nDate: ${formatDate(invitation.date)}\nTime: ${formatTime(invitation.time)}\n\nHope you can make it!\n\nLove,`
  const gmailCompose = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(invitation.recipientEmail)}&cc=${encodeURIComponent('sevillajen015@gmail.com')}&su=${encodeURIComponent('A little date invitation for you')}&body=${encodeURIComponent(body)}`

  return (
    <section className="invite-shell invite-shell--preview">
      <button type="button" className="back-button" onClick={onBack}><ArrowLeft size={16} /> Back</button>
      <p className="eyebrow">It is ready</p>
      <h1 className="script-title script-title--small">Your invitation is ready! <Heart size={19} fill="currentColor" /></h1>
      <p className="preview-subtitle">Here is a little preview of your email.</p>
      <div className="email-card">
        <div className="email-meta">
          <span>To:</span>
          <input aria-label="Recipient email" value={invitation.recipientEmail} onChange={(event) => setInvitation((current) => ({ ...current, recipientEmail: event.target.value }))} placeholder="her@email.com" />
        </div>
        <div className="email-meta"><span>Subject:</span><strong>{`${category.name} date?`}</strong></div>
        <div className="email-divider" />
        <p>Hi Eny,</p><p>I'd love to go on a date with you!</p>
        <p className="email-detail"><strong> Date idea:</strong> {category.name}<br /><strong> Plan:</strong> {invitation.title}<br /><strong> Date:</strong> {formatDate(invitation.date)}<br /><strong> Time:</strong> {formatTime(invitation.time)}</p>
        <p>Hope you can make it!</p>
        <p>See you there? </p>
      </div>
      <a className="primary-button mail-button" href={gmailCompose} target="_blank" rel="noreferrer" onClick={() => setSent(true)}>
        <Mail size={18} /> Send with Gmail
      </a>
      {sent && <p className="send-confirmation" role="status"><Heart size={15} fill="currentColor" /> Gmail opened. Your invitation is ready to send.</p>}
    </section>
  )
}
