import { useState, useEffect, useRef } from 'react';
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
import {
  accreditationsAPI,
  aicteAffiliationLettersAPI,
  type AccreditationItem,
  type AicteLetter,
} from '@/lib/api';
import { uploadToSupabase } from '@/lib/storage';
import { toast } from 'sonner';
import { Award, FileText, Upload, Star } from 'lucide-react';

const Accreditations = () => {
  const [accreditations, setAccreditations] = useState<AccreditationItem[]>([]);
  const [letters, setLetters] = useState<AicteLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [accDialogOpen, setAccDialogOpen] = useState(false);
  const [letterDialogOpen, setLetterDialogOpen] = useState(false);
  const [deleteLetterDialogOpen, setDeleteLetterDialogOpen] = useState(false);
  const [selectedAcc, setSelectedAcc] = useState<AccreditationItem | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<AicteLetter | null>(null);
  const [accForm, setAccForm] = useState({ name: '', description: '', pdf_url: null as string | null });
  const [letterForm, setLetterForm] = useState({ year: '', pdf_url: null as string | null });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [letterPdfFile, setLetterPdfFile] = useState<File | null>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const letterPdfInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [accList, letterList] = await Promise.all([
        accreditationsAPI.getAll(),
        aicteAffiliationLettersAPI.getAll(),
      ]);
      setAccreditations(accList);
      setLetters(letterList);
    } catch (e: any) {
      toast.error(e.message || 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const openAccEdit = (item: AccreditationItem) => {
    setSelectedAcc(item);
    setAccForm({
      name: item.name,
      description: item.description || '',
      pdf_url: item.pdf_url ?? null,
    });
    setPdfFile(null);
    setAccDialogOpen(true);
  };

  const handleAccSubmit = async () => {
    if (!selectedAcc) return;
    try {
      let pdfUrl: string | null = accForm.pdf_url;
      if (pdfFile) {
        toast.info('Uploading PDF…');
        pdfUrl = await uploadToSupabase(pdfFile, 'accreditations', 'images');
      }
      await accreditationsAPI.update(selectedAcc.key, {
        name: accForm.name,
        description: accForm.description,
        pdf_url: pdfUrl,
      });
      toast.success('Accreditation updated');
      setAccDialogOpen(false);
      fetchAll();
    } catch (e: any) {
      toast.error(e.message || 'Failed to update');
    }
  };

  const openLetterAdd = () => {
    setSelectedLetter(null);
    setLetterForm({ year: '', pdf_url: null });
    setLetterPdfFile(null);
    setLetterDialogOpen(true);
  };

  const openLetterEdit = (item: AicteLetter) => {
    setSelectedLetter(item);
    setLetterForm({ year: item.year, pdf_url: item.pdf_url ?? null });
    setLetterPdfFile(null);
    setLetterDialogOpen(true);
  };

  const handleLetterSubmit = async () => {
    if (!letterForm.year.trim()) {
      toast.error('Year is required');
      return;
    }
    try {
      let pdfUrl: string | null = letterForm.pdf_url;
      if (letterPdfFile) {
        toast.info('Uploading PDF…');
        pdfUrl = await uploadToSupabase(letterPdfFile, 'aicte-letters', 'images');
      }
      if (selectedLetter) {
        await aicteAffiliationLettersAPI.update(selectedLetter.id, {
          year: letterForm.year.trim(),
          pdf_url: pdfUrl,
        });
        toast.success('Letter updated');
      } else {
        await aicteAffiliationLettersAPI.create({
          year: letterForm.year.trim(),
          pdf_url: pdfUrl,
          is_latest: false,
          sort_order: 0,
        });
        toast.success('Letter added');
      }
      setLetterDialogOpen(false);
      fetchAll();
    } catch (e: any) {
      toast.error(e.message || 'Failed to save');
    }
  };

  const setAsLatest = async (letter: AicteLetter) => {
    try {
      await aicteAffiliationLettersAPI.update(letter.id, { is_latest: true });
      toast.success(`"${letter.year}" set as latest (green on AICTE page)`);
      fetchAll();
    } catch (e: any) {
      toast.error(e.message || 'Failed to set latest');
    }
  };

  const openDeleteLetter = (item: AicteLetter) => {
    setSelectedLetter(item);
    setDeleteLetterDialogOpen(true);
  };

  const handleDeleteLetterConfirm = async () => {
    if (!selectedLetter) return;
    try {
      await aicteAffiliationLettersAPI.delete(selectedLetter.id);
      toast.success('Letter deleted');
      setDeleteLetterDialogOpen(false);
      fetchAll();
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete');
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold">Accreditations</h1>
        <p className="text-muted-foreground mt-2">
          Manage main accreditations PDFs and AICTE year-wise affiliation letters.
        </p>
      </div>

      {/* Main Accreditations (AUTONOMOUS, NAAC, UGC, ISO, AICTE) */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Award className="h-5 w-5" />
          Main Accreditations (PDF per type)
        </h2>
        <p className="text-sm text-muted-foreground">
          Upload a PDF for each. AICTE can be left empty (it links to the AICTE page with year-wise letters).
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accreditations.map((acc) => (
            <div
              key={acc.key}
              className="border rounded-lg p-4 bg-white shadow-sm flex flex-col"
            >
              <div className="flex items-center gap-3 mb-2">
                {acc.logo && (
                  <img
                    src={acc.logo.startsWith('http') ? acc.logo : acc.logo}
                    alt={acc.name}
                    className="w-10 h-10 object-contain"
                  />
                )}
                <h3 className="font-semibold">{acc.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{acc.description}</p>
              <div className="mt-auto flex flex-wrap gap-2">
                {acc.pdf_url ? (
                  <a
                    href={acc.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View PDF
                  </a>
                ) : (
                  <span className="text-xs text-amber-600">No PDF uploaded</span>
                )}
                <Button size="sm" variant="outline" onClick={() => openAccEdit(acc)}>
                  {acc.pdf_url ? 'Change PDF' : 'Upload PDF'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AICTE Year-wise Letters */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Year-wise AICTE Affiliation Letters
        </h2>
        <p className="text-sm text-muted-foreground">
          Add year-wise letters. Mark one as &quot;Latest&quot; to show it in green on the AICTE page; others appear in blue.
        </p>
        <Button onClick={openLetterAdd}>Add Letter</Button>
        <div className="border rounded-lg overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3">Year</th>
                <th className="text-left p-3">PDF</th>
                <th className="text-left p-3">Latest</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {letters.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-muted-foreground">
                    No letters yet. Add one to get started.
                  </td>
                </tr>
              ) : (
                letters.map((letter) => (
                  <tr key={letter.id} className="border-t">
                    <td className="p-3 font-medium">{letter.year}</td>
                    <td className="p-3">
                      {letter.pdf_url ? (
                        <a
                          href={letter.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View PDF
                        </a>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-3">
                      {letter.is_latest ? (
                        <span className="inline-flex items-center gap-1 rounded bg-green-100 text-green-800 px-2 py-0.5 text-xs">
                          <Star className="h-3 w-3" /> Latest
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs"
                          onClick={() => setAsLatest(letter)}
                        >
                          Set as latest
                        </Button>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <Button size="sm" variant="ghost" onClick={() => openLetterEdit(letter)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => openDeleteLetter(letter)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Dialog: Edit main accreditation PDF */}
      <Dialog open={accDialogOpen} onOpenChange={setAccDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload / change PDF</DialogTitle>
            <DialogDescription>
              {selectedAcc?.name}. PDF will open when users click this accreditation on the public page.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={accForm.name}
                onChange={(e) => setAccForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. NAAC A Grade"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={accForm.description}
                onChange={(e) => setAccForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Short description"
              />
            </div>
            <div>
              <Label>PDF file</Label>
              <input
                ref={pdfInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
              />
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => pdfInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  {pdfFile ? pdfFile.name : 'Choose PDF'}
                </Button>
                {selectedAcc?.pdf_url && !pdfFile && (
                  <a
                    href={selectedAcc.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600"
                  >
                    Current PDF
                  </a>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAccDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAccSubmit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Add / Edit AICTE letter */}
      <Dialog open={letterDialogOpen} onOpenChange={setLetterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedLetter ? 'Edit letter' : 'Add letter'}</DialogTitle>
            <DialogDescription>
              Year label (e.g. 2025-26) and PDF for the AICTE affiliation letter.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Year</Label>
              <Input
                value={letterForm.year}
                onChange={(e) => setLetterForm((f) => ({ ...f, year: e.target.value }))}
                placeholder="e.g. 2025-26"
              />
            </div>
            <div>
              <Label>PDF file</Label>
              <input
                ref={letterPdfInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setLetterPdfFile(e.target.files?.[0] ?? null)}
              />
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => letterPdfInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  {letterPdfFile ? letterPdfFile.name : 'Choose PDF'}
                </Button>
                {selectedLetter?.pdf_url && !letterPdfFile && (
                  <a
                    href={selectedLetter.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600"
                  >
                    Current PDF
                  </a>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLetterDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLetterSubmit}>
              {selectedLetter ? 'Save' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteLetterDialogOpen} onOpenChange={setDeleteLetterDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete letter</AlertDialogTitle>
            <AlertDialogDescription>
              Delete AICTE letter &quot;{selectedLetter?.year}&quot;? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLetterConfirm} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Accreditations;
