import { ArrowLeft, Heart, Plus } from 'lucide-react'

export default function CategoryScreen({ categories, onSelect, onBack }) {
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
          </button>
        ))}
      </div>
    </section>
  )
}
