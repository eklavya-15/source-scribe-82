# NotebookLM Client

A modern, responsive React application for building and interacting with personal knowledge bases. Features a beautiful notebook-inspired design with AI-powered chat capabilities.

## ✨ Features

- **📚 Source Management**: Add PDFs, text, and web links to your knowledge base
- **🤖 AI Chat**: Intelligent conversations based on your uploaded content
- **🎨 Beautiful UI**: Modern, notebook-inspired design with Tailwind CSS
- **📱 Responsive**: Works seamlessly on desktop and mobile devices
- **⚡ Fast Performance**: Optimized React components with efficient state management
- **🔍 Smart Search**: Vector-based similarity search for relevant content

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Build Tool**: Vite
- **State Management**: React hooks
- **Icons**: Lucide React
- **HTTP Client**: Fetch API

## 📦 Installation

1. **Navigate to the client directory**
   ```bash
   cd client/source-scribe-82
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

The application will open at `http://localhost:8080`

## 🚀 Usage

### Adding Sources

#### **Text Content**
1. Click the "Text" button in the sidebar
2. Paste your text content in the textarea
3. Click "Add Source" to save

#### **PDF Documents**
1. Click the "PDF" button in the sidebar
2. Select a PDF file from your device
3. The file will be automatically processed and added

#### **Web Links**
1. Click the "Link" button in the sidebar
2. Enter the URL you want to scrape
3. Click "Add Link" to process the web content

### Chatting with AI

1. Add some sources to your knowledge base
2. Type your question in the chat input at the bottom
3. The AI will respond based on the content in your sources
4. View the conversation history above the input

### Managing Sources

- **View**: All sources are displayed in the left sidebar
- **Remove**: Click the trash icon to delete individual sources
- **Clear All**: Use the clear button to remove all sources

## 🎨 Design System

### Color Palette
- **Primary**: Vibrant purple gradients
- **Background**: Warm, cream-colored notebook paper
- **Text**: Rich, readable dark colors
- **Accents**: Coral, emerald, amber, and rose highlights

### Components
- **Cards**: Paper-like surfaces with subtle shadows
- **Buttons**: Gradient-filled interactive elements
- **Inputs**: Clean, minimal form controls
- **Badges**: Color-coded source type indicators

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ChatInput.tsx    # Chat interface
│   ├── ChatWindow.tsx   # Message display
│   ├── SourceManager.tsx # Source management
│   └── ui/              # shadcn/ui components
├── pages/               # Page components
│   ├── Index.tsx        # Main application page
│   └── NotFound.tsx     # 404 page
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── index.css            # Global styles and Tailwind
└── main.tsx            # Application entry point
```

## ⚙️ Configuration

### Environment Variables
The client automatically connects to the backend at `http://localhost:3001` (configured in `vite.config.ts`).

### Build Configuration
- **Development**: `npm run dev`
- **Production Build**: `npm run build`
- **Preview Build**: `npm run preview`

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build for development
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Component-based architecture

## 🎯 Key Components

### SourceManager
- Handles all source operations (add, remove, display)
- Manages file uploads and API calls
- Provides source context to the application

### ChatInput
- Text input for user messages
- Handles chat submission and API calls
- Displays chat history with user/AI messages

### ChatWindow
- Renders conversation history
- Shows source references and context
- Handles message formatting and display

## 🚀 Performance Features

- **Lazy Loading**: Components load only when needed
- **Optimized Renders**: Efficient React state updates
- **Minimal Re-renders**: Smart component optimization
- **Fast API Calls**: Streamlined backend communication

## 🔒 Security

- **Input Validation**: Client-side validation for all inputs
- **File Type Checking**: PDF upload validation
- **URL Sanitization**: Safe web content processing
- **Error Handling**: Graceful error display

## 🐛 Troubleshooting

### Common Issues

1. **Backend Connection Failed**
   - Ensure the server is running on port 3001
   - Check if the backend URL is correct
   - Verify CORS settings

2. **File Upload Issues**
   - Check file size limits
   - Ensure PDF format is correct
   - Verify network connectivity

3. **Chat Not Working**
   - Add some sources first
   - Check browser console for errors
   - Verify OpenAI API key is configured

### Debug Mode
Open browser developer tools to see detailed error messages and API calls.

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on multiple browsers
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/) components
- Icons from [Lucide](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
