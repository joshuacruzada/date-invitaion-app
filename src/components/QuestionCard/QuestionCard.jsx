import { useRef, useState } from 'react'
import { Heart, X } from 'lucide-react'

export default function QuestionCard({ onYes }) {
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
            <h1 className="script-title script-title--small">Would you like to go on a date with me?</h1>
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
