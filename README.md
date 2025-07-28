# Personal Notes Website

A clean, minimalist personal notes website inspired by Notion's interface. Perfect for creating your own personal knowledge base or blog.

## Features

- **Clean Notion-like Interface**: Minimalist design with a sidebar and main content area
- **Rich Text Editor**: Basic formatting with bold, italic, underline, and headings
- **Auto-save**: Notes are automatically saved as you type
- **Local Storage**: All notes are saved locally in your browser
- **Keyboard Shortcuts**: 
  - `Cmd/Ctrl + S`: Save note
  - `Cmd/Ctrl + N`: Create new note
  - `Escape`: Return to welcome screen
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Getting Started

1. **Local Development**: Simply open `index.html` in your web browser
2. **No setup required**: Everything runs in the browser with no server needed

## Publishing Your Website

### Option 1: GitHub Pages (Recommended)

1. Create a new GitHub repository
2. Upload all files (`index.html`, `styles.css`, `script.js`, `README.md`)
3. Go to repository Settings → Pages
4. Select "Deploy from a branch" and choose `main` branch
5. Your site will be available at `https://yourusername.github.io/repository-name`

### Option 2: Netlify

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your project folder to deploy
3. Get a custom URL instantly
4. Optionally connect your GitHub repository for automatic deployments

### Option 3: Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Deploy with one click
4. Get automatic deployments on every push

### Option 4: Any Web Host

Upload the files to any web hosting service:
- `index.html` (main file)
- `styles.css` (styling)
- `script.js` (functionality)

## Customization

### Changing the Title
Edit the `<title>` tag in `index.html`:
```html
<title>Your Name - Personal Notes</title>
```

### Changing the Logo
Edit the logo text in `index.html`:
```html
<h1 class="logo">Your Name</h1>
```

### Custom Colors
Modify the CSS variables in `styles.css` to match your brand colors.

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers

## Data Storage

All notes are stored locally in your browser's localStorage. This means:
- Notes are private and only accessible on your device
- No server or database required
- Notes persist between browser sessions
- Clear browser data will delete all notes

## Future Enhancements

Potential features you could add:
- Export notes to Markdown/PDF
- Cloud sync with services like Dropbox
- Tags and categories
- Search functionality
- Dark mode
- Image uploads
- Collaborative editing

## License

This project is open source and available under the MIT License. 