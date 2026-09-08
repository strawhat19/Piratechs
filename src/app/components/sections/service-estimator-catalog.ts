// Existing service pricing, shared by the estimator and its cart.
export type ServiceId = 'ai' | 'video' | 'art' | 'writing' | 'mentoring' | 'build' | 'marketing' | 'business';
export type CreativeServiceId = 'ai' | 'video' | 'art' | 'writing';
export type ServiceOption = { id: string; label: string; price?: number; icon?: string; description?: string };

export const serviceCards = [
  { id: 'build', label: 'Website // Mobile App', tab: 'Website // App', icon: 'fa-laptop-code', description: 'Create a digital home for your business and tools your customers can use anywhere.', price: 100 },
  { id: 'art', label: 'Art // Graphics', tab: 'Art // Graphics', icon: 'fa-palette', description: 'Give your brand a recognizable identity with original art and purposeful design.', price: 25 },
  { id: 'mentoring', label: 'Tutoring // Mentoring', tab: 'Tutoring', icon: 'fa-graduation-cap', description: 'Build practical skills and confidence with guidance for you or your team.', price: 35 },
  { id: 'video', label: 'Video // Game', tab: 'Video // Game', icon: 'fa-gamepad', description: 'Capture attention with video and interactive experiences people want to explore.', price: 100 },
  { id: 'writing', label: 'Writing // Articles', tab: 'Writing', icon: 'fa-pen-nib', description: 'Explain your offer clearly with website copy, useful articles, and brand stories.', price: 15 },
  { id: 'ai', label: 'AI // Drones', tab: 'AI // Drones', icon: 'fa-robot', description: 'Automate customer support, connect workflows, and turn aerial data into insight.', price: 100 },
  { id: 'marketing', label: 'Marketing // Analytics', tab: 'Marketing', icon: 'fa-chart-line', description: 'Reach the right audience, understand what works, and turn visitors into customers.', price: 50 },
  { id: 'business', label: 'Strategy // Call', tab: 'Strategy', icon: 'fa-briefcase', description: 'Strategy and consultation for your business needs.', price: 0 },
] as const;

export const creativeOptions: Record<CreativeServiceId, readonly ServiceOption[]> = {
  ai: [
    { id: 'ai-chatbot', label: 'AI Chatbot', price: 50 },
    { id: 'automations', label: 'Automations', price: 150 },
    { id: 'ai-drone-analysis', label: 'AI // Drone Analysis', price: 300 },
  ],
  video: [
    { id: 'short-form-video', label: 'Tik Toks // YouTube Shorts // Instagram Reels', price: 100 },
    { id: 'photography-videography', label: 'Photography // Videography', price: 150 },
    { id: 'game', label: 'Game Development', price: 300, icon: 'fa-gamepad', description: 'Create a focused interactive game that brings your idea or brand to life.' },
  ],
  art: [
    { id: 'logo', label: 'Logo Design', price: 25 },
    { id: 'graphic-design-custom-art', label: 'Graphic Design // Custom Art', price: 300 },
  ],
  writing: [
    { id: 'content', label: 'Content Writing', price: 50 },
    { id: 'news', label: 'News Articles', price: 50 },
    { id: 'writing-copy-articles-blogs', label: 'Copy // Articles // Blogs', price: 100 },
  ],
};
export const mentoringTopics = [
  { id: 'ai', label: 'AI', price: 50 },
  { id: 'design', label: 'Design', price: 75 },
  { id: 'business', label: 'Business', price: 100 },
  { id: 'development', label: 'Development', price: 150 },
  { id: 'resume-review', label: 'Resume Review', price: 50 },
  { id: 'career-advice', label: 'Career Advice', price: 50 },
  { id: 'gamify-learning', label: 'Gamify Learning', price: 75 },
  { id: 'project-management', label: 'Project Management', price: 100 },
  { id: 'computers-technology', label: 'Computers + Technology', price: 100 },
  { id: 'technical-writing-reading', label: 'Technical Writing + Reading', price: 50 },
] as const;

export const marketingOptions = [
  { id: 'seo', label: 'SEO', price: 100 },
  { id: 'cms', label: 'CMS', price: 150 },
  { id: 'automations', label: 'Automations', price: 150 },
  { id: 'advertising', label: 'Advertising', price: 300 },
  { id: 'social-media', label: 'Social Media', price: 100 },
  { id: 'ai-drone-analysis', label: 'AI // Drone Analysis', price: 300 },
  { id: 'customer-feedback', label: 'Capture Customer Feedback', price: 100 },
  { id: 'photography-videography', label: 'Photography // Videography', price: 150 },
  { id: 'graphic-design-custom-art', label: 'Graphic Design // Custom Art', price: 300 },
  { id: 'writing-copy-articles-blogs', label: 'Writing Copy, Articles, Blogs', price: 100 },
  { id: 'short-form-video', label: 'Tik Toks // Youtube Shorts // Instagram Reels', price: 100 },
] as const;

export const buildTypes = [
  { id: 'game-only', label: 'Game Only', platforms: ['game'] },
  { id: 'website-only', label: 'Website Only', platforms: ['website'] },
  { id: 'website-game', label: 'Website + Game', platforms: ['website', 'game'] },
  { id: 'mobile-only', label: 'Mobile Application Only', platforms: ['mobile'] },
  { id: 'mobile-game', label: 'Mobile Application + Game', platforms: ['mobile', 'game'] },
  { id: 'website-mobile', label: 'Website + Mobile Application', platforms: ['website', 'mobile'] },
  { id: 'website-mobile-game', label: 'Website + Mobile Application + Game', platforms: ['website', 'mobile', 'game'] },
] as const;

export const buildPageCounts = [
  { id: `one`, label: `1 Page // Screen // View`, shortLabel: `1 page // screen // view` },
  { id: `three`, label: `3 Pages // Screens // Views`, shortLabel: `3 pages // screens // views` },
  { id: `five-plus`, label: `5+ Pages // Screens // Views`, shortLabel: `5+ pages // screens // views` },
  { id: `ten-plus`, label: `10+ Pages // Screens // Views`, shortLabel: `10+ pages // screens // views` },
] as const;

export const buildEffortLevels = [
  {
    id: `simple`,
    label: `Simple, Clean, Professional`,
    description: `A polished focused experience with essential interactions.`,
  },
  {
    id: `business`,
    label: `Business Feature Rich`,
    description: `More workflows, integrations, content, and business logic.`,
  },
  {
    id: `enterprise`,
    label: `Enterprise Flagship`,
    description: `A flagship experience with advanced polish, systems, and scale.`,
  },
] as const;

export const buildFeatures = [
  { id: 'blog', label: 'Blog', price: 50 },
  { id: 'qr', label: 'QR Code', price: 25 },
  { id: 'to-do', label: 'To Do', price: 50 },
  { id: 'grids', label: 'Grids', price: 50 },
  { id: 'charts', label: 'Charts', price: 50 },
  { id: 'stocks', label: 'Stocks', price: 75 },
  { id: 'search', label: 'Search', price: 25 },
  { id: 'testing', label: 'Testing', price: 50 },
  { id: 'reviews', label: 'Reviews', price: 50 },
  { id: 'sliders', label: 'Sliders', price: 75 },
  { id: 'logo', label: 'Logo Design', price: 25 },
  { id: 'security', label: 'Security', price: 50 },
  { id: 'news', label: 'News Articles', price: 50 },
  { id: 'media', label: 'Media Player', price: 50 },
  { id: 'clock', label: 'Dynamic Clock', price: 25 },
  { id: 'loader', label: 'Loader Design', price: 50 },
  { id: 'design', label: 'Example Design', price: 50 },
  { id: 'ai-chatbot', label: 'AI Chatbot', price: 50 },
  { id: 'maps', label: 'Maps Integration', price: 50 },
  { id: 'drag-drop', label: 'Drag & Drop', price: 50 },
  { id: 'weather', label: 'Weather Widget', price: 50 },
  { id: 'maintenance', label: 'Maintenance', price: 25 },
  { id: 'content', label: 'Content Writing', price: 50 },
  { id: 'music', label: 'Music Integration', price: 50 },
  { id: 'haptics', label: 'Haptic Feedback', price: 75 },
  { id: 'automations', label: 'Automations', price: 50 },
  { id: 'api-server', label: 'API // Server', price: 50 },
  { id: 'functions', label: 'Cloud Functions', price: 75 },
  { id: 'location', label: 'Location Services', price: 75 },
  { id: 'analytics', label: 'Simple Analytics', price: 50 },
  { id: 'audio', label: 'Audio Visualizations', price: 50 },
  { id: 'dashboard', label: 'Custom Dashboard', price: 50 },
  { id: 'announcements', label: 'Announcements', price: 25 },
  { id: 'international', label: 'International', price: 75 },
  { id: 'accessibility', label: 'Accessibility', price: 50 },
  { id: 'pwa', label: 'PWA - Progressive Web App', price: 50 },
  { id: 'fonts', label: 'Custom Fonts // Typeface', price: 50 },
  { id: 'themes', label: 'Dark Mode // Light Mode', price: 25 },
  { id: 'contact-form', label: 'Simple Contact Form', price: 50 },
  { id: 'adv-analytics', label: 'Advanced Analytics', price: 75 },
  { id: 'capture', label: 'Capture Customer Feedback', price: 50 },
  { id: 'storage', label: 'File Storage // User Uploads', price: 50 },
  { id: 'missed', label: 'Missed Call Call // Text Back', price: 50 },
  { id: 'images', label: 'Image // GIF // Video Examples', price: 50 },
  { id: 'email', label: 'Custom Email: Email@Website.com', price: 75 },
  { id: 'social-media', label: 'Social Media Integration', price: 50 },
  { id: 'animations', label: 'Simple Animations + Effects', price: 50 },
  { id: 'cms-database', label: 'CMS // Database Management', price: 50 },
  { id: 'advanced-contact-form', label: 'Advanced Contact Form', price: 75 },
  { id: 'adv-animations', label: 'Advanced Animations + Effects', price: 75 },
  { id: 'booking-calendar', label: 'Booking Calendar or Schedule', price: 75 },
  { id: 'customer-order-tracking', label: 'Customer // Order Tracking', price: 75 },
  { id: 'news-letter', label: 'News Letter // Mailing List // RSS Feed', price: 50 },
  { id: 'multiplayer', label: 'Multiplayer // Shared Sessions for Users', price: 75 },
  { id: 'notifications', label: 'Push Notifications or Message Notifications', price: 75 },
  { id: 'auth', label: 'Sign In + Sign Up w/ Google + User Profiles + Roles // Permissions', price: 75 },
  { id: 'ecommerce', label: 'E-Commerce + Products + Cart + Subscriptions + Payments', price: 100, multiplier: 1, multiplier_label: `Product // Service Variant`, },
] as const;
