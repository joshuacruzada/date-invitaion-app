import { useState } from 'react'
import { Heart } from 'lucide-react'

export default function Envelope({ onOpen }) {
  const [isOpening, setIsOpening] = useState(false)

  const openEnvelope = () => {
    if (isOpening) return
    setIsOpening(true)
    window.setTimeout(onOpen, 720)
  }

  return (
    <section className="invite-shell invite-shell--landing">
      <div className="float-mark float-mark--one"></div>
      <div className="float-mark float-mark--two">✦</div>
      <div className="eyebrow">A little something for you</div>
      <h1 className="script-title">A special<br />letter for you</h1>
      <div
        className={`envelope-wrap ${isOpening ? 'is-opening' : ''}`}
        onClick={openEnvelope}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => event.key === 'Enter' && openEnvelope()}
      >
        <div className="envelope-stage">
          <img className="envelope-image envelope-image--closed" src="/assets/envelope.png" alt="Closed pink envelope" />
          <img className="envelope-image envelope-image--open" src="/assets/open-envelope.png" alt="Open pink envelope" />
        </div>
      </div>
      <p
        className="text-button text-button--plain"
        onClick={openEnvelope}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => event.key === 'Enter' && openEnvelope()}
        aria-label="Click to open the envelope"
      >
        Click to open <Heart size={16} fill="currentColor" />
      </p>
    </section>
  )
}
