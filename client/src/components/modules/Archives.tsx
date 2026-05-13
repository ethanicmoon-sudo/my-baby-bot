import { Archive, Plus, Search, Link2, Folder, Edit2, Trash2, Save, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Note {
  id: string;
  title: string;
  category: string;
  content: string;
  lastModified: string;
  linkedNotes: number;
}

export default function Archives() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Etsy ဒီဇိုင်း နည်းလမ်းများ',
      category: 'အဆိုပြုချက်',
      content: 'အများဆုံး ရောင်းအားကောင်းသော ဒီဇိုင်းများ၏ ဘုံ ဝိသေသလက္ခဏာများ...',
      lastModified: '2 နာရီအရင်',
      linkedNotes: 3,
    },
    {
      id: '2',
      title: 'Printify ချိတ်ဆက်မှု လုပ်ဆောင်ချက်',
      category: 'ပြုလုပ်ခြင်း',
      content: 'Printify ၏ အတူ ထပ်တူ ကူးယူခြင်း လုပ်ဆောင်ချက်များ အသုံးပြုမှု...',
      lastModified: '5 နာရီအရင်',
      linkedNotes: 2,
    },
    {
      id: '3',
      title: 'AI DJ Vibes ဂီတ ဖန်တီးမှု',
      category: 'အဆိုပြုချက်',
      content: 'နောက်ခံ ဂီတ ဖန်တီးမှု အတွက် အကောင်းဆုံး ပရမ်ပ်များ...',
      lastModified: '1 နာရီအရင်',
      linkedNotes: 1,
    },
    {
      id: '4',
      title: 'Etsy ဆိုင် ခွဲခြမ်းစိတ်ဖြာမှု အစီအစဉ်',
      category: 'သုတေသန',
      content: 'ပြိုင်ဆိုင်သူ ခွဲခြမ်းစိတ်ဖြာမှု နည်းလမ်းများ နှင့် ရလဒ်များ...',
      lastModified: '1 နေ့အရင်',
      linkedNotes: 5,
    },
    {
      id: '5',
      title: 'ဝင်ငွေ ခြင်းခြင်း ခွဲခြမ်းစိတ်ဖြာမှု',
      category: 'ဝင်ငွေ',
      content: 'Etsy နှင့် Fiverr မှ ဝင်ငွေ ခြင်းခြင်း ခွဲခြမ်းစိတ်ဖြာမှု...',
      lastModified: '3 နေ့အရင်',
      linkedNotes: 2,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<string | null>(notes[0]?.id);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('');

  const categories = ['အားလုံး', 'အဆိုပြုချက်', 'ပြုလုပ်ခြင်း', 'သုတေသန', 'ဝင်ငွေ'];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'အားလုံး' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedNoteData = notes.find(n => n.id === selectedNote);

  const handleStartEdit = () => {
    if (!selectedNoteData) return;
    setEditTitle(selectedNoteData.title);
    setEditContent(selectedNoteData.content);
    setEditCategory(selectedNoteData.category);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!selectedNote || !editTitle.trim() || !editContent.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setNotes(notes.map(n =>
      n.id === selectedNote
        ? {
            ...n,
            title: editTitle,
            content: editContent,
            category: editCategory,
            lastModified: 'အခုလအတွင်း',
          }
        : n
    ));

    setIsEditing(false);
    toast.success('Note updated successfully');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle('');
    setEditContent('');
    setEditCategory('');
  };

  const handleStartCreate = () => {
    setEditTitle('');
    setEditContent('');
    setEditCategory('အဆိုပြုချက်');
    setIsCreating(true);
  };

  const handleSaveCreate = () => {
    if (!editTitle.trim() || !editContent.trim()) {
      toast.error('Title and content are required');
      return;
    }

    const newNote: Note = {
      id: String(Date.now()),
      title: editTitle,
      content: editContent,
      category: editCategory,
      lastModified: 'အခုလအတွင်း',
      linkedNotes: 0,
    };

    setNotes([newNote, ...notes]);
    setSelectedNote(newNote.id);
    setIsCreating(false);
    toast.success('Note created successfully');
  };

  const handleDeleteNote = (id: string) => {
    const noteToDelete = notes.find(n => n.id === id);
    setNotes(notes.filter(n => n.id !== id));
    if (selectedNote === id) {
      setSelectedNote(notes[0]?.id || null);
    }
    toast.success(`"${noteToDelete?.title}" deleted`);
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold neon-glow-green">မှတ်တမ်းခန်း</h1>
        <p className="text-neon-cyan">Obsidian သုံးသပ်ခြင်း အတွင်းပိုင် အသိပညာ အခြေခံ</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Categories and Search */}
        <div className="lg:col-span-1 space-y-6">
          {/* Search */}
          <div className="border border-neon-border rounded-sm p-4 bg-card/50 neon-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neon-cyan" />
              <input
                type="text"
                placeholder="မှတ်တမ်းများ ရှာဖွေပါ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-neon-border/30 rounded-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-neon-pink"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="border border-neon-border rounded-sm p-4 bg-card/50 neon-border">
            <h3 className="text-sm font-bold text-neon-cyan mb-3">အမျိုးအစားများ</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat === 'အားလုံး' ? null : cat)}
                  className={`w-full text-left px-3 py-2 rounded-sm transition-all text-sm ${
                    (selectedCategory === cat || (cat === 'အားလုံး' && !selectedCategory))
                      ? 'bg-neon-pink text-background font-bold'
                      : 'text-foreground hover:bg-background/50 border border-transparent'
                  }`}
                >
                  <Folder className="w-3 h-3 inline mr-2" />
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="border border-neon-border rounded-sm p-4 bg-card/50 neon-border">
            <p className="text-xs text-muted-foreground mb-2">စုစုပေါင်း မှတ်တမ်းများ</p>
            <p className="text-2xl font-bold text-neon-green">{notes.length}</p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Notes List */}
          <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold neon-glow-cyan">မှတ်တမ်းများ</h2>
              <button
                onClick={handleStartCreate}
                className="px-4 py-2 bg-neon-pink text-background font-bold rounded-sm hover:bg-neon-pink/80 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                အသစ်
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => {
                      setSelectedNote(note.id);
                      setIsEditing(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-sm border transition-all ${
                      selectedNote === note.id
                        ? 'border-neon-pink bg-neon-pink/10'
                        : 'border-neon-border/30 hover:bg-background/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-neon-cyan truncate">{note.title}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{note.content}</p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-neon-purple/20 text-neon-purple rounded-sm flex-shrink-0">
                        {note.category}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">မှတ်တမ်း မရှိပါ</p>
                </div>
              )}
            </div>
          </div>

          {/* Note Content - View Mode */}
          {selectedNoteData && !isEditing && !isCreating && (
            <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold neon-glow-cyan mb-2">{selectedNoteData.title}</h2>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="px-2 py-1 bg-neon-purple/20 text-neon-purple rounded-sm">
                        {selectedNoteData.category}
                      </span>
                      <span>နောက်ဆုံး ပြင်ဆင်ခြင်း: {selectedNoteData.lastModified}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleStartEdit}
                      className="px-3 py-2 border border-neon-border rounded-sm hover:bg-background/50 transition-colors flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4 text-neon-cyan" />
                      <span className="text-xs font-bold text-neon-cyan">ပြင်ဆင်ရန်</span>
                    </button>
                    <button
                      onClick={() => handleDeleteNote(selectedNoteData.id)}
                      className="px-3 py-2 border border-neon-border rounded-sm hover:bg-neon-red/10 transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4 text-neon-red" />
                      <span className="text-xs font-bold text-neon-red">ဖျက်ရန်</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Note Content */}
              <div className="prose prose-invert max-w-none">
                <p className="text-foreground leading-relaxed mb-4">{selectedNoteData.content}</p>
              </div>

              {/* Linked Notes */}
              <div className="mt-6 pt-6 border-t border-neon-border/30">
                <h3 className="text-sm font-bold text-neon-cyan mb-3">ချိတ်ဆက်ထားသော မှတ်တမ်းများ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {notes.slice(0, selectedNoteData.linkedNotes).map((linkedNote) => (
                    <button
                      key={linkedNote.id}
                      onClick={() => setSelectedNote(linkedNote.id)}
                      className="text-left px-3 py-2 border border-neon-border/30 rounded-sm hover:bg-background/50 transition-colors"
                    >
                      <p className="text-xs font-bold text-neon-green">{linkedNote.title}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Note Editing Mode */}
          {(isEditing || isCreating) && (
            <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold neon-glow-cyan">
                    {isCreating ? 'အသစ် မှတ်တမ်း ဖန်တီးရန်' : 'မှတ်တမ်း ပြင်ဆင်ရန်'}
                  </h2>
                </div>
              </div>

              <div className="space-y-4">
                {/* Title Input */}
                <div>
                  <label className="text-sm font-bold text-neon-cyan mb-2 block">ခေါင်းစဉ်</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="မှတ်တမ်း ခေါင်းစဉ်"
                    className="w-full px-4 py-2 bg-background border border-neon-border/30 rounded-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-neon-pink"
                  />
                </div>

                {/* Category Select */}
                <div>
                  <label className="text-sm font-bold text-neon-cyan mb-2 block">အမျိုးအစား</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-background border border-neon-border/30 rounded-sm text-foreground focus:outline-none focus:border-neon-pink"
                  >
                    {categories.filter(c => c !== 'အားလုံး').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Content Textarea */}
                <div>
                  <label className="text-sm font-bold text-neon-cyan mb-2 block">အကြောင်းအရာ</label>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="မှတ်တမ်း အကြောင်းအရာ"
                    rows={8}
                    className="w-full px-4 py-2 bg-background border border-neon-border/30 rounded-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-neon-pink resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-neon-border rounded-sm text-foreground hover:bg-background/50 transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    ပယ်ဖျက်ရန်
                  </button>
                  <button
                    onClick={isCreating ? handleSaveCreate : handleSaveEdit}
                    className="px-4 py-2 bg-neon-green text-background font-bold rounded-sm hover:bg-neon-green/80 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    သိမ်းဆည်းရန်
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
