import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';
import { galleryAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/api\/?$/, '') || 'http://localhost:3001';

// Adaptive grid layout - groups images into chunks and applies layouts
function getAdaptiveGalleryLayout(count: number): { gridCols: string; items: Array<{ colSpan: string; rowSpan: string }> } {
  const layouts: Record<number, { gridCols: string; items: Array<{ colSpan: string; rowSpan: string }> }> = {
    1: {
      gridCols: 'grid-cols-1 md:grid-cols-2',
      items: [
        { colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1 md:row-span-2' }
      ]
    },
    2: {
      gridCols: 'grid-cols-1 md:grid-cols-2',
      items: [
        { colSpan: 'col-span-1', rowSpan: 'row-span-1 md:row-span-2' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1 md:row-span-2' }
      ]
    },
    3: {
      gridCols: 'grid-cols-2 md:grid-cols-3',
      items: [
        { colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1 md:row-span-2' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' }
      ]
    },
    4: {
      gridCols: 'grid-cols-2 md:grid-cols-4',
      items: [
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' }
      ]
    },
    5: {
      gridCols: 'grid-cols-2 md:grid-cols-4',
      items: [
        { colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1 md:row-span-2' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' }
      ]
    },
    6: {
      gridCols: 'grid-cols-2 md:grid-cols-4',
      items: [
        { colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1 md:row-span-2' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' }
      ]
    },
    7: {
      gridCols: 'grid-cols-2 md:grid-cols-5',
      items: [
        { colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1 md:row-span-2' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' }
      ]
    },
    8: {
      gridCols: 'grid-cols-2 md:grid-cols-5',
      items: [
        { colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1 md:row-span-2' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' }
      ]
    },
    9: {
      gridCols: 'grid-cols-2 md:grid-cols-5',
      items: [
        { colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1 md:row-span-2' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' }
      ]
    },
    10: {
      gridCols: 'grid-cols-2 md:grid-cols-5',
      items: [
        { colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1 md:row-span-2' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' }
      ]
    }
  };
  
  const clampedCount = Math.min(Math.max(count, 1), 10);
  return layouts[clampedCount] || layouts[1];
}

const DepartmentGallery: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [galleryImages, setGalleryImages] = useState<Array<{ src: string; alt: string }>>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departmentName, setDepartmentName] = useState<string>('');

  // Get gallery filter function based on slug (same logic as department pages)
  const getGalleryFilter = (slug: string) => {
    const filters: Record<string, (img: { department?: string }) => boolean> = {
      'cse': (img: { department?: string }) => {
        const d = (img.department || '').toLowerCase();
        return d.includes('computer science') || d.includes('cse') || d.includes('engineering ug - computer');
      },
      'ece': (img: { department?: string }) => {
        const d = (img.department || '').toLowerCase();
        return d.includes('ece') || d.includes('electronics') || d.includes('communication');
      },
      'eee': (img: { department?: string }) => {
        const d = (img.department || '').toLowerCase();
        return d.includes('eee') || d.includes('electrical');
      },
      'mechanical': (img: { department?: string }) => {
        const d = (img.department || '').toLowerCase();
        return d.includes('mechanical');
      },
      'civil': (img: { department?: string }) => {
        const d = (img.department || '').toLowerCase();
        return d.includes('civil');
      },
      'ame': (img: { department?: string }) => {
        const d = (img.department || '').toLowerCase();
        return d.includes('automobile') || d.includes('ame');
      },
      'bsh': (img: { department?: string }) => {
        const d = (img.department || '').toLowerCase();
        return d.includes('bsh') || d.includes('basic science') || d.includes('humanities');
      },
      'cyber-security': (img: { department?: string }) => {
        const d = (img.department || '').toLowerCase();
        return d.includes('cyber') || d.includes('security');
      },
      'data-science': (img: { department?: string }) => {
        const d = (img.department || '').toLowerCase();
        return d.includes('data science');
      },
      'aiml': (img: { department?: string }) => {
        const d = (img.department || '').toLowerCase();
        return d.includes('aiml') || d.includes('artificial intelligence') || d.includes('machine learning');
      },
    };
    return filters[slug || ''] || (() => false);
  };

  // Get department display name
  const getDepartmentName = (slug: string) => {
    const names: Record<string, string> = {
      'cse': 'Computer Science and Engineering',
      'ece': 'Electronics and Communications Engineering',
      'eee': 'Electrical and Electronics Engineering',
      'mechanical': 'Mechanical Engineering',
      'civil': 'Civil Engineering',
      'ame': 'Automobile Engineering',
      'bsh': 'Basic Sciences and Humanities',
      'cyber-security': 'Cyber Security',
      'data-science': 'Data Science',
      'aiml': 'Artificial Intelligence and Machine Learning',
    };
    return names[slug || ''] || 'Gallery';
  };

  useEffect(() => {
    const loadGallery = async () => {
      if (!slug) return;
      
      try {
        const all = await galleryAPI.getAll();
        const filter = getGalleryFilter(slug);
        const filtered = all.filter((img: any) => filter(img));
        
        if (filtered.length) {
          const mappedImages = filtered.map((img: any) => ({
            src: (img.src || '').startsWith('/') ? `${API_BASE}${img.src}` : `${API_BASE}/${img.src}`,
            alt: img.alt || 'Gallery',
          }));
          setGalleryImages(mappedImages);
          setDepartmentName(getDepartmentName(slug));
        } else {
          setDepartmentName(getDepartmentName(slug));
        }
      } catch (error) {
        console.error('Error loading gallery:', error);
        setDepartmentName(getDepartmentName(slug));
      }
    };
    
    loadGallery();
  }, [slug]);

  const openImageModal = (src: string) => {
    const index = galleryImages.findIndex(img => img.src === src);
    setCurrentImageIndex(index >= 0 ? index : 0);
    setSelectedImage(src);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const goPrev = () => {
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : galleryImages.length - 1;
    setCurrentImageIndex(newIndex);
    setSelectedImage(galleryImages[newIndex].src);
  };

  const goNext = () => {
    const newIndex = currentImageIndex < galleryImages.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(newIndex);
    setSelectedImage(galleryImages[newIndex].src);
  };

  // Group images into chunks of 10 for adaptive layout
  const chunkImages = (images: Array<{ src: string; alt: string }>, chunkSize: number = 10) => {
    const chunks = [];
    for (let i = 0; i < images.length; i += chunkSize) {
      chunks.push(images.slice(i, i + chunkSize));
    }
    return chunks;
  };

  return (
    <div className="min-h-screen bg-white">
      <LeaderPageNavbar />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </Button>
            <div>
              <h1 
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0a192f]"
                style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.12em' }}
              >
                {departmentName || 'Gallery'}
              </h1>
              <p className="text-slate-600 mt-2">
                {galleryImages.length} {galleryImages.length === 1 ? 'image' : 'images'}
              </p>
            </div>
          </div>

          {/* Gallery Grid - Adaptive Layout */}
          {galleryImages.length > 0 ? (
            <div className="space-y-8">
              {chunkImages(galleryImages).map((chunk, chunkIndex) => {
                const layout = getAdaptiveGalleryLayout(chunk.length);
                return (
                  <div
                    key={chunkIndex}
                    className={`grid ${layout.gridCols} gap-2 md:gap-3 lg:gap-4`}
                  >
                    {chunk.map((img, i) => {
                      const itemLayout = layout.items[i] || layout.items[0];
                      return (
                        <div
                          key={chunkIndex * 10 + i}
                          className={`vibe-gallery-item relative group cursor-pointer ${itemLayout.colSpan} ${itemLayout.rowSpan} min-h-[150px] md:min-h-[200px]`}
                          onClick={() => openImageModal(img.src)}
                        >
                          <img
                            src={img.src}
                            alt={img.alt}
                            width={400}
                            height={300}
                            className="w-full h-full object-cover"
                            loading={chunkIndex === 0 && i < 4 ? "eager" : "lazy"}
                            decoding="async"
                            fetchPriority={chunkIndex === 0 && i < 4 ? "high" : "auto"}
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">No gallery images found for this department.</p>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeImageModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0 border-0 bg-transparent">
          <DialogTitle className="sr-only">Gallery image</DialogTitle>
          <DialogDescription className="sr-only">
            Image {currentImageIndex + 1} of {galleryImages.length}
          </DialogDescription>
          <div className="relative">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full" onClick={closeImageModal}>
              <X className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full" onClick={goPrev}>
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button variant="ghost" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full" onClick={goNext}>
              <ChevronRight className="w-6 h-6" />
            </Button>
            {selectedImage && (
              <div className="flex justify-center bg-black/80 rounded-lg">
                <img src={selectedImage} alt={galleryImages[currentImageIndex]?.alt || 'Gallery'} className="max-w-full max-h-[80vh] object-contain rounded-lg" />
              </div>
            )}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {galleryImages.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
      <ScrollProgressIndicator />
    </div>
  );
};

export default DepartmentGallery;
