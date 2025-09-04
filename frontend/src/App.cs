@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

/* Global Styles */
* {
  box-sizing: border-box;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-feature-settings: 'cv11', 'ss01';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #334155;
  line-height: 1.6;
  font-weight: 400;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: linear-gradient(to bottom, #f1f5f9, #e2e8f0);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #8b5cf6, #7c3aed);
  border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #7c3aed, #6d28d9);
}

/* Line clamp utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Enhanced backdrop blur support */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.backdrop-blur-md {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.backdrop-blur-xl {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

/* Enhanced focus states */
.focus-ring:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
  border-color: #8b5cf6;
}

/* Premium transitions for interactive elements */
button, input, textarea, select {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

/* Custom gradient text */
.gradient-text {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Enhanced card hover effects */
.card-hover {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-hover:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 10px 20px -5px rgba(139, 92, 246, 0.2);
}

/* Advanced animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}

@keyframes pulse-gentle {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.02);
  }
}

.pulse-gentle {
  animation: pulse-gentle 3s infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.float {
  animation: float 6s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.shimmer {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

/* Glass morphism effect */
.glass {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(139, 92, 246, 0.15);
}

/* Enhanced text selection */
::selection {
  background-color: rgba(139, 92, 246, 0.3);
  color: inherit;
}

::-moz-selection {
  background-color: rgba(139, 92, 246, 0.3);
  color: inherit;
}

/* Premium button styles */
.btn-gradient {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%);
  border: none;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px 0 rgba(139, 92, 246, 0.3);
}

.btn-gradient:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px 0 rgba(139, 92, 246, 0.4);
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%);
}

.btn-gradient:active {
  transform: translateY(0);
  box-shadow: 0 4px 15px 0 rgba(139, 92, 246, 0.3);
}

/* Enhanced loading states */
.loading-skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Responsive design helpers */
@media (max-width: 768px) {
  .mobile-padding {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .mobile-text-sm {
    font-size: 0.875rem;
  }
  
  .card-hover:hover {
    transform: translateY(-4px) scale(1.01);
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .card {
    border: 2px solid #000;
  }
  
  button {
    border: 2px solid currentColor;
  }
  
  .glass {
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid rgba(0, 0, 0, 0.2);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  .card-hover:hover {
    transform: none;
  }
  
  button:hover {
    transform: none;
  }
}

/* Dark mode preparation */
@media (prefers-color-scheme: dark) {
  /* Future dark mode styles will go here */
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  body {
    font-size: 12pt;
    line-height: 1.4;
    color: #000;
  }
  
  .card-hover {
    box-shadow: none;
    transform: none;
  }
  
  .btn-gradient {
    background: #8b5cf6 !important;
    box-shadow: none;
  }
}

/* Custom utility classes */
.gradient-border {
  background: linear-gradient(white, white) padding-box,
              linear-gradient(135deg, #8b5cf6, #7c3aed) border-box;
  border: 2px solid transparent;
}

.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.text-shadow-lg {
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Enhanced interactive states */
.interactive {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.interactive:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
}

.interactive:active {
  transform: translateY(0);
  transition-duration: 0.1s;
}

/* Floating action elements */
.floating {
  animation: float 6s ease-in-out infinite;
}

.floating:nth-child(2) {
  animation-delay: -2s;
}

.floating:nth-child(3) {
  animation-delay: -4s;
}
