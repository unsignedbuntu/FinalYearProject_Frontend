# Final Year Project - Modern E-commerce Frontend

This repository contains the source code for the frontend of a feature-rich, modern e-commerce platform. It is built using the latest web technologies, focusing on performance, scalability, and a great user experience. This project was developed as a final year university project.

The frontend is designed to work with a corresponding [.NET Core Web API backend](https://github.com/unsignedbuntu/FinalYearProject_Backend).

## 🚀 Key Features

This platform provides a complete e-commerce experience with a wide range of features for both customers and administrators.

### Core E-commerce Functionality
- **Product Catalog:** Browse products by category, with support for dynamic filtering and sorting.
- **Product Details:** View detailed product information, including descriptions, technical specifications, and customer reviews.
- **Shopping Cart:** A fully persistent shopping cart with functionality to add, update, and remove items, managed globally with Zustand.
- **Favorites/Wishlist:** Users can save products to multiple named wishlists for future reference.
- **Order Management:** Users can view their complete order history, check the status of each order (Pending, Shipped, Delivered), and see detailed item breakdowns.
- **Product Review System:** Authenticated users can submit ratings and written reviews for products they have purchased.

### User Account & Authentication
- **Secure Authentication:** JWT-based authentication with `HttpOnly` cookies for secure session management.
- **User Dashboard:** A central sidebar provides easy access to orders, favorites, profile settings, and more.
- **Account Management:** Users can sign up, log in, and log out securely.

### Advanced & AI-Powered Features
- **AI Image Generation:** An integrated service that uses a Stable Diffusion model to generate product images from text prompts, with a caching layer for performance.
- **Gamified Loyalty Program:** A unique loyalty program integrated via a Python microservice, allowing users to earn points through a simple game.

### User Interface & Experience
- **Responsive Design:** Fully responsive layout built with Tailwind CSS, ensuring a seamless experience on all devices.
- **Interactive UI:** Modern UI elements like a mega menu for navigation, overlays, and modals for non-disruptive user interactions (e.g., sorting, signing in).
- **Global State Management:** Centralized state management using Zustand for cart, user session, and favorites, ensuring a consistent state across the application.
- **Notifications:** User feedback through success and error messages for actions like adding items to the cart.

## 🛠️ Tech Stack

| Category              | Technology / Library                                       |
| --------------------- | ---------------------------------------------------------- |
| **Framework**         | [Next.js](https://nextjs.org/) 13+ (App Router)            |
| **Language**          | [TypeScript](https://www.typescriptlang.org/)              |
| **UI Library**        | [React](https://reactjs.org/) 18                           |
| **Styling**           | [Tailwind CSS](https://tailwindcss.com/)                   |
| **State Management**  | [Zustand](https://github.com/pmndrs/zustand)               |
| **Data Fetching**     | [Axios](https://axios-http.com/)                           |
| **UI Components**     | Custom Components, Radix UI Primitives                     |
| **Authentication**    | Custom JWT-based context (`AuthContext.tsx`)               |
| **Linting/Formatting**| ESLint, Prettier                                           |


## 📂 Project Structure

The project follows a feature-oriented directory structure, organized for scalability and maintainability.

```
/
├── app/                  # Next.js App Router: Pages, API Routes, and Layouts
│   ├── (auth)/           # Route group for authentication pages
│   ├── api/              # BFF API Routes (e.g., for AI/game integration)
│   ├── my-orders/        # Example of a user-specific page
│   └── layout.tsx        # Root layout
│   └── page.tsx          # Main entry page
├── components/           # Reusable UI components (e.g., Sidebar, ProductGrid)
│   ├── icons/            # SVG icons
│   ├── navigation/       # Navigation components like NavigationBar
│   ├── overlay/          # Modal/Overlay components
│   └── sidebar/          # Main sidebar
├── contexts/             # React contexts (e.g., AuthContext)
├── services/             # Centralized API service for backend communication
├── stores/               # Zustand store definitions (cartStore, userStore, etc.)
├── public/               # Static assets (images, fonts)
└── ...                   # Configuration files (next.config.js, tailwind.config.ts)
```

## 🖼️ Project Gallery

*(This is a placeholder section. You can add screenshots of your application here.)*

<!-- 
Example:
![Home Page](path/to/your/screenshot.png)
_The home page of the application._ 
-->


## ⚙️ Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or newer)
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/FinalYearProject_Frontend.git
    cd FinalYearProject_Frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add the necessary environment variables. Start by copying the example file:
    ```bash
    cp .env.example .env.local
    ```
    Then, fill in the values in `.env.local`. A typical variable would be:
    ```
    NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

The application should now be running on [http://localhost:3000](http://localhost:3000).

---

This README provides a comprehensive overview of the project. For more specific details, please refer to the source code and inline comments.
