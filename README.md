# 🧪 API Testing App

A powerful and modern API testing tool built with Next.js 16, TypeScript, and shadcn/ui. Test REST APIs with a clean interface, manage request history, and save executions to Supabase.

![API Tester](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

### Core Functionality

- 🚀 **HTTP Methods Support** - GET, POST, PUT, PATCH, DELETE
- 📝 **Request Builder** - URL input, method selector, and send button
- 🎯 **Request Configuration**
  - Query Parameters - Add/remove/toggle parameters
  - Headers - Custom request headers
  - Body - JSON request body editor
- 📊 **Response Viewer**
  - Status code with color coding
  - Response time and size
  - Formatted JSON body with syntax highlighting
  - Response headers
  - Copy to clipboard functionality
- 📜 **Request History** - Automatic saving to localStorage (last 50 requests)
- 💾 **Persistent Storage** - Save executions to Supabase database
- 🌓 **Dark/Light Mode** - Theme switcher with system detection
- ⚡ **Real-time Updates** - Fast refresh and hot module replacement

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) with App Router
- **Language:** [TypeScript 5](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **UI Components:** [Base UI](https://base-ui.com/), [Radix UI](https://www.radix-ui.com/)
- **Icons:** [Hugeicons](https://hugeicons.com/)
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Theme:** [next-themes](https://github.com/pacocoursey/next-themes)
- **Notifications:** [Sonner](https://sonner.emilkowal.ski/)

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm
- A Supabase account (optional, for saving executions)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/RusiruChathushanaka/api_testing_app.git
   cd api_testing_app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables (optional)**

   Copy the example environment file:

   ```bash
   cp .env.local.example .env.local
   ```

   Add your Supabase credentials to `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open the app**

   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 💾 Supabase Setup (Optional)

To enable saving API executions to Supabase:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Follow the detailed setup instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
3. Configure your environment variables as described above

**Without Supabase:** The app works perfectly fine without Supabase configuration. You'll still have local history stored in browser localStorage.

## 📁 Project Structure

```
api_testing_app/
├── app/
│   ├── globals.css          # Global styles and theme variables
│   ├── layout.tsx            # Root layout with theme provider
│   └── page.tsx              # Main page component
├── components/
│   ├── api-tester/           # API testing components
│   │   ├── api-tester.tsx    # Main container
│   │   ├── request-panel.tsx # URL and method input
│   │   ├── request-tabs.tsx  # Params, headers, body tabs
│   │   ├── response-panel.tsx # Response display
│   │   ├── history-panel.tsx # Request history sidebar
│   │   ├── key-value-editor.tsx # Reusable key-value editor
│   │   └── save-execution-dialog.tsx # Save to Supabase dialog
│   ├── ui/                   # shadcn/ui components
│   ├── theme-provider.tsx    # Theme context provider
│   └── theme-switcher.tsx    # Dark/light mode toggle
├── lib/
│   ├── api-utils.ts          # API request utilities
│   ├── supabase.ts           # Supabase client configuration
│   ├── types.ts              # TypeScript type definitions
│   └── utils.ts              # General utilities
└── public/                   # Static assets
```

## 🎨 Features in Detail

### Request Building

- Select HTTP method from dropdown (color-coded badges)
- Enter API endpoint URL
- Add query parameters with enable/disable toggles
- Configure custom headers
- Write request body in JSON format (for POST/PUT/PATCH)

### Response Handling

- Automatic JSON formatting and syntax highlighting
- Response metadata: status code, time, size
- View response headers in separate tab
- Copy response to clipboard
- Error handling with clear messages

### History Management

- Automatic saving of last 50 requests
- Click any history item to restore it
- View method, URL, timestamp, and status
- Delete individual items or clear all history
- Persisted in localStorage

### Saved Executions (with Supabase)

- Save requests with custom names
- Store complete request and response data
- Database includes:
  - Request details (method, URL, headers, params, body)
  - Response details (status, headers, body, time, size)
  - Timestamps (created_at, updated_at)

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🎯 Usage Examples

### Testing a GET Request

1. Select "GET" method
2. Enter URL: `https://jsonplaceholder.typicode.com/posts/1`
3. Click "Send"
4. View formatted JSON response

### Testing a POST Request

1. Select "POST" method
2. Enter URL: `https://jsonplaceholder.typicode.com/posts`
3. Go to "Body" tab
4. Add JSON body:
   ```json
   {
     "title": "Test Post",
     "body": "This is a test",
     "userId": 1
   }
   ```
5. Click "Send"

### Adding Query Parameters

1. Go to "Params" tab
2. Click "Add"
3. Enter key-value pairs
4. Toggle checkboxes to enable/disable parameters

### Saving an Execution

1. Send a request
2. Click "Save" button in header
3. Enter a name for the execution
4. Click "Save"

## 🌟 Key Features

- ✅ Clean and intuitive interface
- ✅ Real-time response with loading states
- ✅ Automatic request history
- ✅ Dark/light theme with system detection
- ✅ Keyboard shortcuts (Enter to send/save)
- ✅ Mobile responsive design
- ✅ No external dependencies for core functionality
- ✅ Optional cloud storage with Supabase

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Hugeicons](https://hugeicons.com/)
- Database by [Supabase](https://supabase.com/)

---

Made with ❤️ by [Rusiru Chathushanaka](https://github.com/RusiruChathushanaka)
