"use client"
import { useState } from 'react'
import Image from 'next/image'
import ContactForm from '@/components/contact/ContactForm'

const faqItems = [
  {
    question: "How to place an order?",
    content: "To place an order, simply browse our products, add items to your cart, and proceed to checkout. Select your preferred payment method and shipping address. Need more help? Check our detailed ordering guide."
  },
  {
    question: "Shipping & Delivery",
    content: "We offer worldwide shipping with tracking. Standard delivery takes 3-5 business days, while express delivery takes 1-2 business days. International shipping may vary. Track your order using your order number."
  },
  {
    question: "Returns & Refunds",
    content: "Not satisfied? Return items within 30 days of delivery for a full refund. Items must be unused and in original packaging. Contact our support team to initiate a return. Refunds are processed within 5-7 business days."
  },
  {
    question: "Payment Methods",
    content: "We accept all major credit cards (Visa, MasterCard), PayPal, and bank transfers. All transactions are secure and encrypted. Having payment issues? Our support team is here to help."
  }
]

const serviceItems = [
  {
    title: "Contact Support",
    content: "Get in touch with our 24/7 support team via email, phone, or live chat. Average response time: 2 hours."
  },
  {
    title: "Track Your Order",
    content: "Enter your order number to get real-time updates on your shipment status and estimated delivery date."
  },
  {
    title: "Report an Issue",
    content: "Experiencing problems? Submit a detailed report and our team will investigate and resolve it within 24 hours."
  },
  {
    title: "Request Callback",
    content: "Prefer to talk? Schedule a callback at your convenient time, and our support team will reach out to you."
  }
]

const resourceItems = [
  {
    title: "User Guides",
    content: "Step-by-step guides on using our platform, placing orders, and managing your account."
  },
  {
    title: "Video Tutorials",
    content: "Watch our helpful video guides covering common questions and platform features."
  },
  {
    title: "Community Forum",
    content: "Join our community to discuss products, share experiences, and get tips from other users."
  },
  {
    title: "Knowledge Base",
    content: "Browse our extensive collection of articles, tutorials, and FAQs for instant answers."
  }
]

export default function SupportPage() {
  const [activeItems, setActiveItems] = useState<{[key: string]: number}>({
    faq: -1,
    service: -1,
    resource: -1
  })
  const openMegaMenu = useUIStore((state) => state.openMegaMenu)

  const handleClick = (section: string, index: number) => {
    setActiveItems(prev => ({
      ...prev,
      [section]: prev[section] === index ? -1 : index
    }))
  }

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-[160px]">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">How Can We Help You?</h1>
          <div className="text-gray-600 max-w-2xl mx-auto">
            Our support team is here to assist you with any questions or concerns you may have.
          </div>
          <button
            onClick={openMegaMenu}
            className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Browse Products
          </button>
        </div>
      </section>

      {/* Quick Help Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
            <ul className="space-y-4">
              {faqItems.map((item, index) => (
                <li key={index} className="group">
                  <h4 
                    onClick={() => handleClick('faq', index)}
                    className={`font-medium cursor-pointer transition-colors
                      ${activeItems.faq === index ? 'text-red-600' : 'text-blue-600 hover:text-blue-700'}`}
                  >
                    {item.question}
                  </h4>
                  <div className={`text-sm text-gray-600 mt-1 transition-all
                    ${activeItems.faq === index ? 'block' : 'hidden'}`}>
                    {item.content}
                    </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-4">
              {serviceItems.map((item, index) => (
                <li key={index} className="group">
                  <h4 
                    onClick={() => handleClick('service', index)}
                    className={`font-medium cursor-pointer transition-colors
                      ${activeItems.service === index ? 'text-red-600' : 'text-blue-600 hover:text-blue-700'}`}
                  >
                    {item.title}
                  </h4>
                  <div className={`text-sm text-gray-600 mt-1 transition-all
                    ${activeItems.service === index ? 'block' : 'hidden'}`}>
                    {item.content}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-4">Help Resources</h3>
            <ul className="space-y-4">
              {resourceItems.map((item, index) => (
                <li key={index} className="group">
                  <h4 
                    onClick={() => handleClick('resource', index)}
                    className={`font-medium cursor-pointer transition-colors
                      ${activeItems.resource === index ? 'text-red-600' : 'text-blue-600 hover:text-blue-700'}`}
                  >
                    {item.title}
                  </h4>
                  <div className={`text-sm text-gray-600 mt-1 transition-all
                    ${activeItems.resource === index ? 'block' : 'hidden'}`}>
                    {item.content}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              <div className="mb-6">
                Can't find what you're looking for? Send us a message and we'll get back to you as soon as possible.
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <span>support@example.com</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <span>+1 234 567 8900</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 