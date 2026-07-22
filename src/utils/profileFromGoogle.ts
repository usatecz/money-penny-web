import type { GoogleUser } from '../types/GoogleUser'
import type { Profile } from '../types/Profile'

export function profileFromGoogle(user: GoogleUser): Profile {
  const trimmed = user.name.trim()
  const spaceIndex = trimmed.indexOf(' ')

  if (spaceIndex === -1) {
    return {
      name: trimmed,
      surname: '',
      address: '',
      email: user.email,
      phone: '',
    }
  }

  return {
    name: trimmed.slice(0, spaceIndex),
    surname: trimmed.slice(spaceIndex + 1).trim(),
    address: '',
    email: user.email,
    phone: '',
  }
}
