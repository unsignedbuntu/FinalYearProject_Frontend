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
- **AI Image Generation with Multi-Layer Caching:** The platform integrates a powerful feature for generating images from text prompts using a Stable Diffusion model.
  - **Smart Caching:** To optimize performance and reduce redundant, costly API calls, a multi-layer caching strategy is implemented. When an image is requested, the system first queries a high-speed **Redis cache**. If it's a miss, it checks a persistent **database cache**. The Stable Diffusion model is only invoked if the image is absent from both caches.
  - **Dockerized Redis:** The Redis cache runs within a **Docker container**, ensuring a consistent and isolated environment for development and deployment.
  - **Frontend Integration:** This functionality is exposed to users on pages like `MyFollowedStores/page.tsx`, where they can input prompts to generate visuals. The request is handled by a dedicated `/api/ImageCache` Next.js API route.

- **Gamified Loyalty Program with Python Microservice:** A unique loyalty program enhances user engagement.
  - **Integration:** Users can access the game via the `loyalty-program/page.tsx` page, which triggers a `/api/run-game` endpoint.
  - **Decoupled Architecture:** This Next.js API route communicates with a separate, **Python-based microservice**. This microservice contains the game's logic, and its decoupled nature allows it to be developed, scaled, and maintained independently from the main frontend application.

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

![image](https://github.com/user-attachments/assets/5c33dbfc-fd2a-4efb-96fd-9e42cf49bcd3)
![image](https://github.com/user-attachments/assets/fc960113-a34d-4c0e-a16d-ff841bd983a5)
![image](https://github.com/user-attachments/assets/52a453da-d332-43a2-82da-800b5c11f749)
![image](https://github.com/user-attachments/assets/0508bfda-a2bd-454b-a392-0dba1c75da04)
![image](https://github.com/user-attachments/assets/bc319943-2c67-4365-8aef-20bfc35f810c)
![image](https://github.com/user-attachments/assets/686a47a2-34db-46bb-913d-4a8be4239c5e)
![image](https://github.com/user-attachments/assets/bc33d204-ff34-4e9b-9593-841ce7e3ae09)
![image](https://github.com/user-attachments/assets/ac6737e5-2399-4c46-b0a2-5bea88f8e99e)





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
