import { useState } from 'react'
import { Heart } from 'lucide-react'
import Envelope from './components/Envelope/Envelope'
import QuestionCard from './components/QuestionCard/QuestionCard'
import CategoryScreen from './components/CategoryScreen/CategoryScreen'
import ScheduleModal from './components/ScheduleModal/ScheduleModal'
import Preview from './components/Preview/Preview'
import { categories, initialInvitation } from './data/categories'

function App() {
  const [step, setStep] = useState('envelope')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [invitation, setInvitation] = useState(initialInvitation)
  const category = categories.find((item) => item.id === selectedCategory) ?? categories[0]
  const steps = ['envelope', 'question', 'categories', 'preview']

  const chooseCategory = (id) => {
    const matchedCategory = categories.find((item) => item.id === id)
    setSelectedCategory(id)
    setInvitation((current) => ({
      ...current,
      categoryId: id,
      categoryName: matchedCategory?.name ?? '',
    }))
  }

  return (
    <main className="app-canvas">
      <div className="corner-note corner-note--left">Good food<br />brighter days</div>
      <div className="corner-note corner-note--right">With you </div>
      <div className="progress-dots" aria-label={`Step ${steps.indexOf(step) + 1} of 4`}>
        {steps.map((item, index) => <span key={item} className={steps.indexOf(step) >= index ? 'is-active' : ''} />)}
      </div>

      {step === 'envelope' && <Envelope onOpen={() => setStep('question')} />}
      {step === 'question' && <QuestionCard onYes={() => setStep('categories')} />}
      {step === 'categories' && (
        <CategoryScreen
          categories={categories}
          onSelect={chooseCategory}
          onBack={() => setStep('question')}
        />
      )}
      {step === 'preview' && (
        <Preview
          invitation={invitation}
          setInvitation={setInvitation}
          category={category}
          onBack={() => {
            setSelectedCategory(null)
            setStep('categories')
          }}
        />
      )}
      {step === 'categories' && selectedCategory && (
        <ScheduleModal
          category={category}
          invitation={invitation}
          setInvitation={setInvitation}
          onClose={() => setSelectedCategory(null)}
          onCreate={() => {
            setSelectedCategory(selectedCategory)
            setStep('preview')
          }}
        />
      )}

      <footer className="app-footer"><Heart size={13} fill="currentColor" /> made for a little adventure</footer>
    </main>
  )
}

export default App

