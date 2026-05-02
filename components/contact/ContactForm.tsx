"use client"
<<<<<<< HEAD
import { useSupportStore, SupportFormState } from '@/app/stores/supportStore'

export default function ContactForm() {
  const { fullName, email, subject, message, setFormField, addMessageToHistory, resetForm } = useSupportStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted with:", { fullName, email, subject, message })
    
    if (subject && message) {
      addMessageToHistory({ subject, message })
      resetForm()
    } else {
      console.warn("Subject or message is empty. Not adding to history.")
    }
=======
import { useState } from 'react'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form gönderme işlemi burada yapılacak
    console.log(formData)
>>>>>>> main
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
<<<<<<< HEAD
    setFormField(name as keyof SupportFormState, value)
=======
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
>>>>>>> main
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
<<<<<<< HEAD
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
=======
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
>>>>>>> main
          Full Name
        </label>
        <input
          type="text"
<<<<<<< HEAD
          id="fullName"
          name="fullName"
          value={fullName}
=======
          id="name"
          name="name"
          value={formData.name}
>>>>>>> main
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
<<<<<<< HEAD
          value={email}
=======
          value={formData.email}
>>>>>>> main
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
<<<<<<< HEAD
          value={subject}
=======
          value={formData.subject}
>>>>>>> main
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          id="message"
          name="message"
<<<<<<< HEAD
          value={message}
=======
          value={formData.message}
>>>>>>> main
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Send Message
      </button>
    </form>
  )
} 