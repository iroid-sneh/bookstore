// Utility function to get the correct image URL
export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL (starts with http), return as is
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    
    // If it's a relative path (starts with /), add the server URL
    if (imagePath.startsWith('/')) {
        return `http://localhost:3000${imagePath}`;
    }
    
    // If it doesn't start with /, add it
    return `http://localhost:3000/${imagePath}`;
};

// Utility function to check if image exists
export const checkImageExists = (url) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
};
