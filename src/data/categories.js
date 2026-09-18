import { Film, Gamepad2, Paintbrush, Plus, Utensils } from 'lucide-react'

export const categories = [
  { id: 'ramen', name: 'Ramen', description: 'A warm bowl and good conversation.', icon: Utensils, image: '/assets/ramen.png', emoji: '🍜' },
  { id: 'arcade', name: 'Arcade', description: 'Games, laughs, and friendly competition.', icon: Gamepad2, image: '/assets/arcade.png', emoji: '🎮' },
  { id: 'cinema', name: 'Cinema', description: 'A movie date with snacks.', icon: Film, image: '/assets/cinema.png', emoji: '🎬' },
  { id: 'painting', name: 'Painting', description: "Let's make something together.", icon: Paintbrush, image: '/assets/painting.png', emoji: '🎨' },
  { id: 'custom', name: 'Something new?', description: 'Add your own date idea.', icon: Plus, image: null, emoji: '+' },
]

export const initialInvitation = {
  categoryId: '',
  categoryName: '',
  title: '',
  date: '',
  time: '',
  recipientEmail: '',
}
