# eXobe Admin Dashboard

A comprehensive, professional admin dashboard for managing the eXobe platform, including vendors, users, products, orders, and analytics.

## Features

### 🎯 Core Functionality
- **Dashboard Overview** - Real-time statistics, charts, and recent activity
- **User Management** - Manage customers and vendors with full CRUD operations
- **Vendor Management** - Approve/reject vendor applications, monitor performance
- **Product Management** - Track inventory, pricing, and product status
- **Order Management** - Process orders, update statuses, track deliveries
- **Analytics & Insights** - Revenue trends, user growth, and performance metrics
- **Reports** - Generate and download various business reports
- **Messages** - Communicate with users and vendors
- **Notifications** - Stay updated with platform activities
- **Settings** - Configure platform settings, security, and preferences

### 🎨 Design Features
- Beautiful, modern UI with consistent eXobe branding
- Responsive design for all screen sizes
- Professional color scheme (Black, Crimson Red, Steel Grey)
- Smooth animations and transitions
- Collapsible sidebar navigation
- Dark mode support
- Custom scrollbars

### 🛠️ Technical Features
- Built with **Next.js 15** and **React 19**
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **Apollo Client** for GraphQL integration
- **Zustand** for state management
- **RxJS** for reactive programming
- Modular component architecture
- Context-based state management
- Reusable common components

## Project Structure

```
exobe-admin/
├── src/
│   ├── app/                      # Next.js app directory
│   │   ├── page.tsx             # Dashboard home
│   │   ├── users/               # User management
│   │   ├── vendors/             # Vendor management
│   │   ├── products/            # Product management
│   │   ├── orders/              # Order management
│   │   ├── analytics/           # Analytics & insights
│   │   ├── reports/             # Reports generation
│   │   ├── messages/            # Messaging system
│   │   ├── notifications/       # Notifications center
│   │   └── settings/            # Platform settings
│   ├── components/
│   │   ├── common/              # Reusable components
│   │   │   ├── Toast.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── DataTable.tsx
│   │   │   └── StatCard.tsx
│   │   ├── layout/              # Layout components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── DashboardLayout.tsx
│   │   └── providers/           # Provider components
│   │       └── ApolloProviderWrapper.tsx
│   ├── context/                 # React contexts
│   │   ├── AdminContext.tsx
│   │   ├── ToastContext.tsx
│   │   └── UIContext.tsx
│   └── lib/
│       └── apollo/              # Apollo Client setup
│           └── client.ts
├── public/                      # Static assets
├── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Yarn or npm

### Installation

1. Install dependencies:
```bash
yarn install
# or
npm install
```

2. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
```

3. Run the development server:
```bash
yarn dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
yarn build
yarn start
```

## Component Library

### Common Components

- **Button** - Customizable button with variants (primary, secondary, danger, ghost)
- **Input** - Text input with icon support and validation
- **Select** - Dropdown select component
- **Badge** - Status badges with color variants
- **Modal** - Reusable modal dialog
- **Toast** - Notification toast system
- **DataTable** - Advanced table with sorting and pagination
- **StatCard** - Dashboard statistic cards

### Layout Components

- **DashboardLayout** - Main layout wrapper with sidebar and header
- **Sidebar** - Navigation sidebar with collapsible feature
- **Header** - Top header with search and user profile

## Styling

The dashboard uses Tailwind CSS v4 with a custom theme matching eXobe brand colors:

- **Jet Black**: `#000000`
- **Crimson Red**: `#C8102E`
- **Steel Grey**: `#4A4A4A`
- **White**: `#FFFFFF`
- **Copper Sand**: `#F6E2E0`

## State Management

- **AdminContext** - Admin user authentication and profile
- **ToastContext** - Toast notification system
- **UIContext** - UI state (sidebar, modals, etc.)

## API Integration

The dashboard is ready to integrate with your GraphQL API. Update the `NEXT_PUBLIC_API_URL` environment variable to point to your backend.

## Best Practices

- All components are TypeScript-typed for type safety
- Responsive design for mobile, tablet, and desktop
- Accessibility features included
- SEO-friendly with proper metadata
- Performance optimized with Next.js features
- Clean, maintainable code structure

## Future Enhancements

- Real-time updates with WebSocket/GraphQL subscriptions
- Advanced charting with Chart.js or Recharts
- Export data to CSV/Excel
- Advanced filtering and search
- Bulk actions for data management
- Role-based access control (RBAC)
- Audit logs and activity tracking
- Multi-language support

## License

Private - eXobe Platform

## Author

Alex Sexwale

---

Built with ❤️ for eXobe Platform
