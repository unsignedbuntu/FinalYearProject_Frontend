"use client"
import Image from 'next/image'
import ContactForm from '@/components/contact/ContactForm'
import { useSupportStore } from '@/app/stores/supportStore'

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

// Define the type for accordion sections explicitly
type AccordionSection = 'activeFAQ' | 'activeService' | 'activeResource';

export default function SupportPage() {
  // Get state and actions from the store
  const {
    activeFAQ,
    activeService,
    activeResource,
    setActiveAccordion,
    messageHistory
  } = useSupportStore();

  // Update handleClick with the correct type for section
  const handleClick = (section: AccordionSection, index: number) => {
    setActiveAccordion(section, index);
  }

  return (
    <main className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 pt-[160px]">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">How Can We Help You?</h1>
          <div className="text-gray-600 max-w-2xl mx-auto">
            Our support team is here to assist you with any questions or concerns you may have.
          </div>
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
                    onClick={() => handleClick('activeFAQ', index)}
                    className={`font-medium cursor-pointer transition-colors
                      ${activeFAQ === index ? 'text-red-600' : 'text-blue-600 hover:text-blue-700'}`}
                  >
                    {item.question}
                  </h4>
                  <div className={`text-sm text-gray-600 mt-1 transition-all
                    ${activeFAQ === index ? 'block' : 'hidden'}`}>
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
                    onClick={() => handleClick('activeService', index)}
                    className={`font-medium cursor-pointer transition-colors
                      ${activeService === index ? 'text-red-600' : 'text-blue-600 hover:text-blue-700'}`}
                  >
                    {item.title}
                  </h4>
                  <div className={`text-sm text-gray-600 mt-1 transition-all
                    ${activeService === index ? 'block' : 'hidden'}`}>
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
                    onClick={() => handleClick('activeResource', index)}
                    className={`font-medium cursor-pointer transition-colors
                      ${activeResource === index ? 'text-red-600' : 'text-blue-600 hover:text-blue-700'}`}
                  >
                    {item.title}
                  </h4>
                  <div className={`text-sm text-gray-600 mt-1 transition-all
                    ${activeResource === index ? 'block' : 'hidden'}`}>
                    {item.content}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Contact Form and History Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Column 1: Get in Touch & History */}
          <div className="space-y-8">
            {/* Get in Touch Card */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg shadow-lg p-8">
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

            {/* Message History Card */}
            {messageHistory.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Message History (This Session)</h3>
                <ul className="space-y-4 max-h-60 overflow-y-auto">
                  {[...messageHistory].reverse().map((msg, index) => (
                    <li key={msg.timestamp} className="border-b pb-2 last:border-b-0">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Subject: {msg.subject}</span>
                        <span>{new Date(msg.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-700">{msg.message}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Column 2: Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  )
} 