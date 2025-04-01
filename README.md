# NeoSudoku

A modern implementation of the classic Sudoku puzzle game, featuring a sleek design, dark mode support, and enhanced gameplay features.

Try it here: https://neo-sudoku.vercel.app/

![image](https://github.com/user-attachments/assets/d5f9efad-bcaa-4bc7-9af9-745642493536)

![image](https://github.com/user-attachments/assets/ef9e72a2-aab7-44af-8c5d-31241594a44e)

## Features

- 🧩 Three difficulty levels: Easy, Medium, and Hard
- 🌓 Dark/Light theme toggle with smooth transitions
- ⏱️ Real-time game timer (starts only when you make your first move)
- 🎮 User-friendly number pad for easy input
- 🔢 Matching number highlighting
- ✅ Built-in solution validation
- 📱 Responsive design for all devices
- 🏠 Elegant home screen with game options
- 📋 Comprehensive menu system
- 💾 Preference saving with localStorage
- 🎨 Modern UI with smooth animations
- ⌨️ Full keyboard support

## How to Play

1. **Left Click**: Select a cell and enter a number
2. **Number Keys (1-9)**: Enter numbers into selected cells
3. **Backspace/Delete**: Clear a cell
4. **Click on Numbers**: Highlights all matching numbers on the grid

## Game Rules

- Fill the 9×9 grid with numbers 1-9
- Each row, column, and 3×3 box must contain each number exactly once
- Use the provided clues to logically determine the correct placements
- Game is complete when the entire grid is filled correctly

## Difficulty Levels

- **Easy**: More starting numbers for a gentler introduction
- **Medium**: Balanced challenge for casual players
- **Hard**: Fewer starting numbers for experienced players

## Game Features

### Home Screen
- Clean, intuitive main menu
- Quick game start option
- Easy theme toggle
- Basic game instructions

### Menu System
- New Game option with current difficulty
- How to Play guide with game rules
- Theme toggle for customized experience
- Hints toggle to enable/disable number highlighting
- About section with game information
- Return to Home option

### Gameplay Enhancements
- Visual number highlighting for better pattern recognition
- Real-time solution validation
- Error indication with subtle animations
- Timer that only starts when you begin playing
- Persistent settings between game sessions

### Visual Feedback
- Smooth theme transitions
- Responsive button hover effects
- Clear visual indicators for selected cells
- Subtle animations for user interactions
- Elegant grid design with modern aesthetics

## Technical Details

The game is built using vanilla JavaScript with no external dependencies. It features:

- Object-oriented design with separate classes for:
  - Game logic (Sudoku class)
  - Menu system (Menu class)
  - Home screen (HomeScreen class)
- Modern CSS techniques:
  - CSS Grid for responsive layouts
  - CSS Variables for theming
  - Flexbox for component alignment
  - Transitions for smooth animations
- Efficient Sudoku generation algorithm
- Browser storage API for saving preferences
- Mobile-first responsive design principles

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/NeoSudoku.git
```

2. Open `index.html` in your browser or serve through a local web server

## Browser Support

The game works on all modern browsers that support:
- CSS Grid and Flexbox
- CSS Custom Properties (Variables)
- ES6+ JavaScript features
- localStorage API

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
