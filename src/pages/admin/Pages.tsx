import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { pagesAPI } from '@/lib/api';
import { toast } from 'sonner';
import { FileText, Edit, Trash2, Plus, Image as ImageIcon, Table, Type, MapPin, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Page {
  id: number;
  slug: string;
  title: string;
  route: string;
  category: string;
  content: any;
  createdAt?: string;
  updatedAt?: string;
}

// Available categories for pages
const PAGE_CATEGORIES_LIST = ['About', 'Examinations', 'Placements', 'Departments', 'Research', 'AQAR', 'IQAC', 'Admissions', 'Facilities'];

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const Pages = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<any>({
    title: '',
    slug: '',
    route: '',
    category: '',
    content: {},
  });
  const [newPageData, setNewPageData] = useState({
    title: '',
    slug: '',
    route: '',
    category: 'About',
  });
  const [contentEditor, setContentEditor] = useState<any>({});
  const [imageFiles, setImageFiles] = useState<{ [key: string]: File }>({});
  const [dynamicImageKeys, setDynamicImageKeys] = useState<string[]>([]);

  useEffect(() => {
    fetchPages();
  }, []);

  // Normalize page from API (handles snake_case from Supabase)
  const normalizePage = (p: any): Page => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    route: p.route,
    category: p.category || 'Other',
    content: p.content,
    createdAt: p.createdAt ?? p.created_at,
    updatedAt: p.updatedAt ?? p.updated_at,
  });

  const fetchPages = async () => {
    try {
      const data = await pagesAPI.getAll();
      // Handle both array and { pages: [...] } response formats
      const rawPages = Array.isArray(data) ? data : (data?.pages ?? data?.data ?? []);
      const list = Array.isArray(rawPages) ? rawPages : [];
      setPages(list.map(normalizePage));
    } catch (error: any) {
      // If pages don't exist yet, initialize with empty array
      console.error('Error fetching pages:', error);
      setPages([]);
      // Don't show error toast if it's just empty data
      if (!error.message?.includes('404') && !error.message?.includes('not found')) {
        toast.error(error.message || 'Failed to fetch pages');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (page: Page) => {
    setSelectedPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      route: page.route,
      category: page.category,
      content: page.content || {},
    });
    // Deep clone content to avoid mutating original
    setContentEditor(JSON.parse(JSON.stringify(page.content || {})));
    setImageFiles({});
    // Extract dynamic image keys (keys that start with 'image_' and are not standard keys)
    const existingImageKeys = Object.keys(page.content || {}).filter(key => 
      key.startsWith('image_') && typeof page.content[key] === 'string'
    );
    setDynamicImageKeys(existingImageKeys);
    setDialogOpen(true);
  };

  const handleCreate = (slug: string, title: string, route: string, category: string) => {
    setSelectedPage(null);
    setFormData({
      title,
      slug,
      route,
      category,
      content: {},
    });
    setContentEditor({});
    setImageFiles({});
    setDynamicImageKeys([]);
    setDialogOpen(true);
  };

  const handleDelete = (page: Page) => {
    setSelectedPage(page);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      // Clean content - remove preview fields and ensure deleted image fields are explicitly null
      const cleanedContent = { ...contentEditor };
      
      // Remove all preview fields
      Object.keys(cleanedContent).forEach(key => {
        if (key.endsWith('_preview')) {
          delete cleanedContent[key];
        }
      });
      
      // Get all image keys from the ORIGINAL page content (before any edits)
      const originalImageKeys = new Set<string>();
      if (selectedPage?.content) {
        Object.keys(selectedPage.content).forEach(key => {
          if ((key.startsWith('image') || key === 'heroImage' || key === 'profileImage') && 
              selectedPage.content[key] && 
              typeof selectedPage.content[key] === 'string' && 
              selectedPage.content[key].trim() !== '') {
            originalImageKeys.add(key);
          }
        });
      }
      
      // For any image key that existed in the original page but is now missing or empty in cleanedContent, set it to null
      originalImageKeys.forEach(key => {
        if (!cleanedContent.hasOwnProperty(key) || 
            !cleanedContent[key] || 
            (typeof cleanedContent[key] === 'string' && cleanedContent[key].trim() === '')) {
          cleanedContent[key] = null;
        }
      });
      
      const submitData = {
        ...formData,
        content: cleanedContent,
      };

      if (selectedPage) {
        await pagesAPI.update(selectedPage.id, submitData, imageFiles);
        toast.success('Page updated successfully');
      } else {
        await pagesAPI.create(submitData);
        toast.success('Page created successfully');
      }
      setDialogOpen(false);
      // Small delay to ensure server has processed the update
      setTimeout(() => {
        fetchPages();
      }, 300);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save page');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPage) return;
    try {
      await pagesAPI.delete(selectedPage.id);
      toast.success('Page deleted successfully');
      setDeleteDialogOpen(false);
      fetchPages();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete page');
    }
  };

  const updateContentField = (path: string, value: any) => {
    const keys = path.split('.');
    const newContent = { ...contentEditor };
    let current: any = newContent;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    setContentEditor(newContent);
  };

  const handleImageUpload = (fieldPath: string, file: File) => {
    setImageFiles({
      ...imageFiles,
      [fieldPath]: file,
    });
    // Preview the image - store as preview only, don't store base64 in content field
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target?.result as string;
      // Store preview separately
      updateContentField(`${fieldPath}_preview`, base64Data);
      // Clear any existing base64 data from the actual content field to prevent it being saved
      if (contentEditor[fieldPath] && typeof contentEditor[fieldPath] === 'string' && contentEditor[fieldPath].startsWith('data:')) {
        updateContentField(fieldPath, '');
      }
    };
    reader.readAsDataURL(file);
  };

  const getPageBySlug = (slug: string) => {
    return pages.find(p => p.slug === slug);
  };

  // Group pages by category
  const pagesByCategory = pages.reduce((acc, page) => {
    const category = page.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(page);
    return acc;
  }, {} as Record<string, Page[]>);

  // Get all unique categories from pages (include "All" first)
  const pageCategories = Array.from(new Set(pages.map(p => p.category).filter(Boolean)));
  const availableCategories = ['All', ...Array.from(new Set([
    ...PAGE_CATEGORIES_LIST,
    ...pageCategories
  ]))];

  const handleCreateNewPage = () => {
    setSelectedPage(null);
    const defaultCategory = selectedCategory === 'All' ? 'About' : selectedCategory;
    setNewPageData({
      title: '',
      slug: '',
      route: '',
      category: defaultCategory,
    });
    setFormData({
      title: '',
      slug: '',
      route: '',
      category: defaultCategory,
      content: {},
    });
    setContentEditor({});
    setImageFiles({});
    setDynamicImageKeys([]);
    setCreateDialogOpen(true);
  };

  const handleCreateSubmit = async () => {
    try {
      if (!newPageData.title || !newPageData.slug || !newPageData.route) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Check if slug already exists
      if (pages.some(p => p.slug === newPageData.slug)) {
        toast.error('A page with this slug already exists');
        return;
      }

      const submitData = {
        ...newPageData,
        content: contentEditor,
      };

      await pagesAPI.create(submitData);
      toast.success('Page created successfully');
      setCreateDialogOpen(false);
      fetchPages();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create page');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pages Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage content for all website pages including text, images, and tables
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Pages by Category</h2>
        <Button onClick={handleCreateNewPage}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Page
        </Button>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="flex flex-wrap gap-2 w-full">
          {availableCategories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {availableCategories.map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {(category === 'All' ? pages : pagesByCategory[category] ?? []).map((page) => (
                <Card key={page.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{page.title}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(page)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(page)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardTitle>
                    <CardDescription>{page.route}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>Content exists</span>
                      </div>
                      {page.updatedAt && (
                        <div className="text-xs text-muted-foreground">
                          Updated: {new Date(page.updatedAt).toLocaleDateString()}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        Slug: {page.slug}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {((category === 'All' ? pages.length === 0 : !pagesByCategory[category] || pagesByCategory[category].length === 0)) && (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    {category === 'All' 
                      ? 'No pages yet. Click "Create New Page" to add one.'
                      : 'No pages in this category yet. Click "Create New Page" to add one.'}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Edit/Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {selectedPage ? 'Edit Page' : 'Create Page'}
            </DialogTitle>
            <DialogDescription>
              Edit the content for {formData.title} • {formData.route}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="hero" className="flex-1 overflow-hidden flex flex-col min-h-0">
            <TabsList className="flex flex-wrap gap-1 shrink-0">
              <TabsTrigger value="hero">1. Hero</TabsTrigger>
              <TabsTrigger value="content">2. Main Content</TabsTrigger>
              <TabsTrigger value="message">3. Message / Profile</TabsTrigger>
              <TabsTrigger value="images">4. Images</TabsTrigger>
              <TabsTrigger value="tables">5. Tables</TabsTrigger>
              <TabsTrigger value="map">6. Map</TabsTrigger>
              <TabsTrigger value="additional">7. Additional</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto py-4 min-h-0">
              <TabsContent value="hero" className="mt-0 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Hero Section</CardTitle>
                    <CardDescription>Title and description for the page header</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Hero Title</Label>
                      <Input
                        placeholder="Hero Title"
                        value={contentEditor.hero?.title || ''}
                        onChange={(e) => updateContentField('hero.title', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Hero Description</Label>
                      <Textarea
                        placeholder="Hero Description"
                        value={contentEditor.hero?.description || ''}
                        onChange={(e) => updateContentField('hero.description', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content" className="mt-0 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Main Content</CardTitle>
                    <CardDescription>Main page content (supports HTML)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Main content text (supports HTML)"
                      value={contentEditor.mainContent || ''}
                      onChange={(e) => updateContentField('mainContent', e.target.value)}
                      rows={12}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      You can use HTML tags for formatting. For images, use &lt;img src="URL" /&gt;
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="message" className="mt-0 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Message / Profile</CardTitle>
                    <CardDescription>Principal's message or profile information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Message Content</Label>
                      <Textarea
                        placeholder="Principal's Message / Message Content"
                        value={contentEditor.message || ''}
                        onChange={(e) => updateContentField('message', e.target.value)}
                        rows={8}
                        className="font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Profile Information (JSON)</Label>
                      <Textarea
                        value={JSON.stringify(contentEditor.profile || {}, null, 2)}
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            updateContentField('profile', parsed);
                          } catch {}
                        }}
                        rows={6}
                        className="font-mono text-sm"
                        placeholder='{"name": "", "designation": "", ...}'
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="images" className="mt-0 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Images</CardTitle>
                    <CardDescription>Hero image, content images, and additional images</CardDescription>
                  </CardHeader>
                  <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Label className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Images
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newKey = `image_${Date.now()}`;
                      setDynamicImageKeys([...dynamicImageKeys, newKey]);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Image
                  </Button>
                </div>
                <div className="space-y-4">
                  {/* Hero Image */}
                  <div className="space-y-2 border-l-2 border-purple-200 pl-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">Hero Image (Main banner image)</Label>
                      {contentEditor.heroImage && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newContent = { ...contentEditor };
                            delete newContent.heroImage;
                            delete newContent['heroImage_preview'];
                            setContentEditor(newContent);
                            const newImageFiles = { ...imageFiles };
                            delete newImageFiles.heroImage;
                            setImageFiles(newImageFiles);
                          }}
                          className="text-destructive hover:text-destructive text-xs"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload('heroImage', file);
                        }
                        // Reset input to allow selecting same file again
                        e.target.value = '';
                      }}
                    />
                    {contentEditor['heroImage_preview'] && (
                      <div className="relative inline-block">
                        <img
                          src={contentEditor['heroImage_preview']}
                          alt="heroImage"
                          className="w-32 h-32 object-cover rounded border"
                          onError={(e) => {
                            // If preview fails, try to load from the actual path
                            const actualPath = contentEditor.heroImage;
                            if (actualPath && typeof actualPath === 'string') {
                              const img = e.target as HTMLImageElement;
                              const baseUrl = API_BASE_URL.replace('/api', '');
                              const cleanPath = actualPath.startsWith('/') ? actualPath : `/${actualPath}`;
                              img.src = `${baseUrl}${cleanPath}`;
                            }
                          }}
                        />
                      </div>
                    )}
                    {contentEditor.heroImage && typeof contentEditor.heroImage === 'string' && !contentEditor['heroImage_preview'] && (
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground mb-2">
                          Current: {contentEditor.heroImage.length > 50 ? contentEditor.heroImage.substring(0, 50) + '...' : contentEditor.heroImage}
                        </div>
                        <div className="relative inline-block">
                          <img
                            src={(() => {
                                const baseUrl = API_BASE_URL.replace('/api', '');
                                const cleanPath = contentEditor.heroImage.startsWith('/') ? contentEditor.heroImage : `/${contentEditor.heroImage}`;
                                return `${baseUrl}${cleanPath}`;
                            })()}
                            alt="heroImage"
                            className="w-32 h-32 object-cover rounded border"
                            onError={(e) => {
                              // Hide broken image
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Standard Images */}
                  {['image1', 'image2', 'image3'].map((imgKey) => (
                    <div key={imgKey} className="space-y-2 border-l-2 border-green-200 pl-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm capitalize">{imgKey.replace(/([A-Z])/g, ' $1').trim()}</Label>
                        {contentEditor[imgKey] && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newContent = { ...contentEditor };
                              delete newContent[imgKey];
                              delete newContent[`${imgKey}_preview`];
                              setContentEditor(newContent);
                              const newImageFiles = { ...imageFiles };
                              delete newImageFiles[imgKey];
                              setImageFiles(newImageFiles);
                            }}
                            className="text-destructive hover:text-destructive text-xs"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Remove
                          </Button>
                        )}
                      </div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(imgKey, file);
                          }
                          // Reset input to allow selecting same file again
                          e.target.value = '';
                        }}
                      />
                      {contentEditor[`${imgKey}_preview`] && (
                        <div className="relative inline-block">
                          <img
                            src={contentEditor[`${imgKey}_preview`]}
                            alt={imgKey}
                            className="w-32 h-32 object-cover rounded border"
                            onError={(e) => {
                              // If preview fails, try to load from the actual path
                              const actualPath = contentEditor[imgKey];
                              if (actualPath && typeof actualPath === 'string') {
                                const img = e.target as HTMLImageElement;
                                const baseUrl = API_BASE_URL.replace('/api', '');
                                const cleanPath = actualPath.startsWith('/') ? actualPath : `/${actualPath}`;
                                img.src = `${baseUrl}${cleanPath}`;
                              }
                            }}
                          />
                        </div>
                      )}
                      {contentEditor[imgKey] && typeof contentEditor[imgKey] === 'string' && !contentEditor[`${imgKey}_preview`] && (
                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground mb-2">
                            Current: {contentEditor[imgKey].length > 50 ? contentEditor[imgKey].substring(0, 50) + '...' : contentEditor[imgKey]}
                          </div>
                          <div className="relative inline-block">
                            <img
                              src={(() => {
                                const baseUrl = API_BASE_URL.replace('/api', '');
                                const cleanPath = contentEditor[imgKey].startsWith('/') ? contentEditor[imgKey] : `/${contentEditor[imgKey]}`;
                                return `${baseUrl}${cleanPath}`;
                              })()}
                              alt={imgKey}
                              className="w-32 h-32 object-cover rounded border"
                              onError={(e) => {
                                // Hide broken image
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Dynamic Images */}
                  {dynamicImageKeys.map((imgKey) => (
                    <div key={imgKey} className="space-y-2 border-l-2 border-blue-200 pl-4 relative">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium">Additional Image</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDynamicImageKeys(dynamicImageKeys.filter(key => key !== imgKey));
                            const newContent = { ...contentEditor };
                            delete newContent[imgKey];
                            delete newContent[`${imgKey}_preview`];
                            setContentEditor(newContent);
                            const newImageFiles = { ...imageFiles };
                            delete newImageFiles[imgKey];
                            setImageFiles(newImageFiles);
                          }}
                          className="text-destructive hover:text-destructive shrink-0"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(imgKey, file);
                          }
                          // Reset input to allow selecting same file again
                          e.target.value = '';
                        }}
                      />
                      {/* Show image preview - prioritize preview, then check for base64 or server path */}
                      {(contentEditor[`${imgKey}_preview`] || 
                        (contentEditor[imgKey] && typeof contentEditor[imgKey] === 'string' && contentEditor[imgKey].startsWith('data:image')) ||
                        (contentEditor[imgKey] && typeof contentEditor[imgKey] === 'string' && !contentEditor[imgKey].startsWith('data:'))) && (
                        <div className="relative inline-block">
                          <img
                            src={(() => {
                              // Priority: preview > base64 > server path
                              if (contentEditor[`${imgKey}_preview`]) {
                                return contentEditor[`${imgKey}_preview`];
                              }
                              if (contentEditor[imgKey] && typeof contentEditor[imgKey] === 'string' && contentEditor[imgKey].startsWith('data:image')) {
                                return contentEditor[imgKey];
                              }
                              if (contentEditor[imgKey] && typeof contentEditor[imgKey] === 'string') {
                                const baseUrl = API_BASE_URL.replace('/api', '');
                                const cleanPath = contentEditor[imgKey].startsWith('/') ? contentEditor[imgKey] : `/${contentEditor[imgKey]}`;
                                return `${baseUrl}${cleanPath}`;
                              }
                              return '';
                            })()}
                            alt={imgKey}
                            className="w-32 h-32 object-cover rounded border"
                            onError={(e) => {
                              // Hide broken image
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          {/* Show path info only for server paths, not base64 */}
                          {contentEditor[imgKey] && typeof contentEditor[imgKey] === 'string' && !contentEditor[imgKey].startsWith('data:') && !contentEditor[`${imgKey}_preview`] && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {contentEditor[imgKey].length > 40 ? contentEditor[imgKey].substring(0, 40) + '...' : contentEditor[imgKey]}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tables" className="mt-0 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Tables Data</CardTitle>
                    <CardDescription>Table data in JSON format</CardDescription>
                  </CardHeader>
                  <CardContent>
                <Textarea
                  placeholder='{"table1": {"headers": ["Col1", "Col2"], "rows": [["Data1", "Data2"]]}}'
                  value={JSON.stringify(contentEditor.tables || {}, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      updateContentField('tables', parsed);
                    } catch {
                      // Invalid JSON, ignore
                    }
                  }}
                  rows={8}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Enter table data in JSON format. Structure: {"{"} "tableName": {"{"} "headers": [], "rows": [] {"}"} {"}"}
                </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="map" className="mt-0 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Google Maps</CardTitle>
                    <CardDescription>Embed map for contact or location</CardDescription>
                  </CardHeader>
                  <CardContent>
                <Input
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  value={contentEditor.mapEmbed || ''}
                  onChange={(e) => {
                    let value = e.target.value;
                    // Extract src URL from iframe tag if user pasted the entire iframe
                    const iframeMatch = value.match(/src=["']([^"']+)["']/);
                    if (iframeMatch) {
                      value = iframeMatch[1];
                    }
                    updateContentField('mapEmbed', value);
                  }}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Paste the Google Maps embed URL here. You can get it from Google Maps by clicking "Share" → "Embed a map". 
                  <strong>Tip:</strong> If you copied the entire iframe tag, just paste it - we'll extract the URL automatically.
                </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="additional" className="mt-0 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Content Fields</CardTitle>
                    <CardDescription>Extra content as JSON key-value pairs</CardDescription>
                  </CardHeader>
                  <CardContent>
                <Textarea
                  placeholder='{"key": "value"}'
                  value={JSON.stringify(contentEditor.additional || {}, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      updateContentField('additional', parsed);
                    } catch {
                      // Invalid JSON, ignore
                    }
                  }}
                  rows={6}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Add any additional content fields as JSON key-value pairs
                </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {selectedPage ? 'Update' : 'Create'} Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create New Page Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Page</DialogTitle>
            <DialogDescription>
              Create a new page that will appear in the navigation dropdown
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Page Title *</Label>
              <Input
                value={newPageData.title}
                onChange={(e) => {
                  setNewPageData({ ...newPageData, title: e.target.value });
                  // Auto-generate slug from title
                  if (!newPageData.slug || newPageData.slug === '') {
                    const slug = e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)/g, '');
                    setNewPageData({ ...newPageData, title: e.target.value, slug });
                  }
                }}
                placeholder="e.g., New Examination Page"
              />
            </div>

            <div className="space-y-2">
              <Label>Slug * (URL-friendly identifier)</Label>
              <Input
                value={newPageData.slug}
                onChange={(e) => setNewPageData({ ...newPageData, slug: e.target.value })}
                placeholder="e.g., new-examination-page"
              />
              <p className="text-xs text-muted-foreground">
                This will be used in the URL. Use lowercase letters, numbers, and hyphens only.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Route * (Page URL path)</Label>
              <Input
                value={newPageData.route}
                onChange={(e) => setNewPageData({ ...newPageData, route: e.target.value })}
                placeholder="e.g., /examinations/new-page"
              />
              <p className="text-xs text-muted-foreground">
                The URL path where this page will be accessible. Must start with /
              </p>
            </div>

            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={newPageData.category}
                onValueChange={(value) => setNewPageData({ ...newPageData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_CATEGORIES_LIST.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                This determines which dropdown menu the page appears in
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSubmit}>
              Create Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the page "{selectedPage?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Pages;

