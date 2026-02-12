/**
 * Utility functions for handling Google Drive public folder links
 */

/**
 * Converts Google Drive sharing link to direct download/view link
 * Supports both file links and folder links
 * 
 * @param driveLink - Google Drive sharing link
 * @returns Direct link for embedding/viewing
 */
export function convertGoogleDriveLink(driveLink: string): string {
  if (!driveLink || !driveLink.includes('drive.google.com')) {
    return driveLink; // Return as-is if not a Google Drive link
  }

  try {
    // Handle file links (view or download)
    // Format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    // or: https://drive.google.com/open?id=FILE_ID
    let fileId = '';
    
    // Extract file ID from different Google Drive URL formats
    const fileMatch = driveLink.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch) {
      fileId = fileMatch[1];
    } else {
      const openMatch = driveLink.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (openMatch) {
        fileId = openMatch[1];
      } else {
        // Try folder format
        const folderMatch = driveLink.match(/\/folders\/([a-zA-Z0-9_-]+)/);
        if (folderMatch) {
          // For folders, return the original link (folders need special handling)
          return driveLink;
        }
      }
    }

    if (fileId) {
      // Convert to direct download link (works for images and videos)
      // For images: use uc?export=view
      // For videos: use uc?export=download (or view for preview)
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }

    return driveLink; // Return original if we can't parse it
  } catch (error) {
    console.error('Error converting Google Drive link:', error);
    return driveLink; // Return original on error
  }
}

/**
 * Converts Google Drive link to direct download link (for videos/files)
 */
export function convertGoogleDriveToDownload(driveLink: string): string {
  if (!driveLink || !driveLink.includes('drive.google.com')) {
    return driveLink;
  }

  try {
    let fileId = '';
    const fileMatch = driveLink.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch) {
      fileId = fileMatch[1];
    } else {
      const openMatch = driveLink.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (openMatch) {
        fileId = openMatch[1];
      }
    }

    if (fileId) {
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }

    return driveLink;
  } catch (error) {
    return driveLink;
  }
}

/**
 * Checks if a URL is a Google Drive link
 */
export function isGoogleDriveLink(url: string): boolean {
  return url?.includes('drive.google.com') || false;
}

/**
 * Gets thumbnail/preview link for Google Drive file
 */
export function getGoogleDriveThumbnail(driveLink: string): string {
  if (!isGoogleDriveLink(driveLink)) {
    return driveLink;
  }

  try {
    const fileId = getGoogleDriveFileId(driveLink);
    if (fileId) {
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    }
    return driveLink;
  } catch (error) {
    return driveLink;
  }
}

/**
 * Extracts the file ID from a Google Drive link (file or open?id=).
 */
export function getGoogleDriveFileId(driveLink: string): string | null {
  if (!driveLink || !driveLink.includes('drive.google.com')) return null;
  const fileMatch = driveLink.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];
  const openMatch = driveLink.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return openMatch ? openMatch[1] : null;
}

/**
 * Returns the Google Drive file preview/embed URL for use in an iframe.
 * Videos play inline without "Download" or "Sign in" when shared as "Anyone with the link can view".
 * autoplay=1 starts playback automatically.
 */
export function getGoogleDrivePreviewEmbedUrl(driveLink: string): string {
  const fileId = getGoogleDriveFileId(driveLink);
  if (!fileId) return driveLink;
  return `https://drive.google.com/file/d/${fileId}/preview?autoplay=1`;
}
