'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Archive, Edit3, PackagePlus, Save, Trash2, X } from 'lucide-react';

type Category = { id: string; name: string };
type Product = {
  id: string; name: string; sinhalaName: string | null; botanicalName: string | null;
  slug: string; sku: string; categoryId: string; category: Category;
  shortDescription: string; detailedDescription: string; ingredients: string;
  netWeight: string; priceLkr: number; isSamplePrice: boolean; stockQuantity: number;
  isAvailable: boolean; isFeatured: boolean; preparationUsage: string | null;
  storageInstructions: string | null; batchNumber: string | null;
  manufacturingDate: string | null; expiryDate: string | null; imageUrl: string;
};
type FormState = Omit<Product, 'id' | 'category'>;

const emptyForm = (categoryId = '', imageUrl = ''): FormState => ({
  name: '', sinhalaName: '', botanicalName: '', slug: '', sku: '', categoryId,
  shortDescription: '', detailedDescription: '', ingredients: '', netWeight: '50g',
  priceLkr: 0, isSamplePrice: false, stockQuantity: 0, isAvailable: true,
  isFeatured: false, preparationUsage: '', storageInstructions: '', batchNumber: '',
  manufacturingDate: '', expiryDate: '', imageUrl,
});

export default function ProductManager({ initialProducts, categories, imageOptions }: {
  initialProducts: Product[]; categories: Category[]; imageOptions: string[];
}) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(() => emptyForm(categories[0]?.id, imageOptions[0]));
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function addProduct() {
    setEditingId(null);
    setForm(emptyForm(categories[0]?.id, imageOptions[0]));
    setMessage('');
    setOpen(true);
  }

  function editProduct(product: Product) {
    const { id, category: _category, ...values } = product;
    setEditingId(id);
    setForm(values);
    setMessage('');
    setOpen(true);
  }

  function handleName(value: string) {
    setForm((current) => ({
      ...current, name: value,
      slug: editingId ? current.slug : value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    }));
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    const response = await fetch(editingId ? `/api/admin/products/${editingId}` : '/api/admin/products', {
      method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) return setMessage(result.error || 'Unable to save product.');
    setOpen(false);
    router.refresh();
    window.location.reload();
  }

  async function remove(product: Product) {
    if (!window.confirm(`Delete “${product.name}”? This cannot be undone.`)) return;
    setBusy(true);
    const response = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) return setMessage(result.error || 'Unable to delete product.');
    setProducts((current) => current.filter((item) => item.id !== product.id));
    setMessage('Product deleted.');
  }

  const input = 'w-full rounded-xl border border-sage/30 bg-white px-3 py-2.5 text-sm outline-none focus:border-forest';
  const label = 'space-y-1 text-xs font-semibold text-forest';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="font-serif text-3xl font-semibold text-forest">Product Catalogue</h1><p className="mt-1 text-xs text-botanicalText/70">Manage images, descriptions, prices, stock, and availability.</p></div>
        <button onClick={addProduct} className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-ivory"><PackagePlus className="h-4 w-4" /> Add product</button>
      </div>
      {message && <p className="rounded-xl border border-sage/30 bg-sage-soft/40 px-4 py-3 text-sm text-forest">{message}</p>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <article key={product.id} className="overflow-hidden rounded-2xl border border-sage/20 bg-ivory-light shadow-botanical">
            <div className="relative aspect-[4/3] bg-ivory-dark/30">{product.imageUrl && <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />}<span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold ${product.isAvailable ? 'bg-sage-soft text-forest' : 'bg-terracotta text-white'}`}>{product.isAvailable ? 'Active' : 'Archived'}</span></div>
            <div className="space-y-3 p-5"><div><h2 className="font-serif text-lg font-semibold text-forest">{product.name}</h2><p className="text-xs text-sage">{product.sku} · {product.category.name}</p></div><div className="flex justify-between text-sm"><span>LKR {product.priceLkr.toFixed(2)}</span><span>{product.stockQuantity} in stock</span></div><div className="flex gap-2 border-t border-sage/15 pt-3"><button onClick={() => editProduct(product)} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-forest px-3 py-2 text-xs font-semibold text-white"><Edit3 className="h-3.5 w-3.5" /> Edit</button><button disabled={busy} onClick={() => remove(product)} aria-label={`Delete ${product.name}`} className="rounded-lg border border-terracotta/30 px-3 text-terracotta"><Trash2 className="h-4 w-4" /></button></div></div>
          </article>
        ))}
      </div>

      {open && <div className="fixed inset-0 z-50 overflow-y-auto bg-forest/65 p-4 backdrop-blur-sm">
        <form onSubmit={save} className="mx-auto my-4 max-w-5xl rounded-3xl bg-ivory p-5 shadow-2xl sm:p-8">
          <div className="mb-6 flex items-center justify-between"><h2 className="font-serif text-2xl font-semibold text-forest">{editingId ? 'Edit product' : 'Add product'}</h2><button type="button" onClick={() => setOpen(false)}><X className="h-6 w-6" /></button></div>
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={label}>Product name<input required className={input} value={form.name} onChange={(e) => handleName(e.target.value)} /></label>
                <label className={label}>Sinhala name<input className={input} value={form.sinhalaName || ''} onChange={(e) => update('sinhalaName', e.target.value)} /></label>
                <label className={label}>Botanical name<input className={input} value={form.botanicalName || ''} onChange={(e) => update('botanicalName', e.target.value)} /></label>
                <label className={label}>Category<select required className={input} value={form.categoryId} onChange={(e) => update('categoryId', e.target.value)}>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
                <label className={label}>URL slug<input required className={input} value={form.slug} onChange={(e) => update('slug', e.target.value)} /></label>
                <label className={label}>SKU<input required className={input} value={form.sku} onChange={(e) => update('sku', e.target.value)} /></label>
                <label className={label}>Net weight<input required className={input} value={form.netWeight} onChange={(e) => update('netWeight', e.target.value)} /></label>
                <label className={label}>Price (LKR)<input required min="0.01" step="0.01" type="number" className={input} value={form.priceLkr} onChange={(e) => update('priceLkr', Number(e.target.value))} /></label>
                <label className={label}>Stock quantity<input required min="0" type="number" className={input} value={form.stockQuantity} onChange={(e) => update('stockQuantity', Number(e.target.value))} /></label>
                <label className={label}>Batch number<input className={input} value={form.batchNumber || ''} onChange={(e) => update('batchNumber', e.target.value)} /></label>
                <label className={label}>Manufacturing date<input className={input} value={form.manufacturingDate || ''} onChange={(e) => update('manufacturingDate', e.target.value)} /></label>
                <label className={label}>Expiry date<input className={input} value={form.expiryDate || ''} onChange={(e) => update('expiryDate', e.target.value)} /></label>
              </div>
              <label className={label}>Short description<textarea required rows={2} className={input} value={form.shortDescription} onChange={(e) => update('shortDescription', e.target.value)} /></label>
              <label className={label}>Detailed description<textarea required rows={4} className={input} value={form.detailedDescription} onChange={(e) => update('detailedDescription', e.target.value)} /></label>
              <label className={label}>Ingredients<textarea required rows={2} className={input} value={form.ingredients} onChange={(e) => update('ingredients', e.target.value)} /></label>
              <div className="grid gap-4 sm:grid-cols-2"><label className={label}>Preparation / usage<textarea rows={3} className={input} value={form.preparationUsage || ''} onChange={(e) => update('preparationUsage', e.target.value)} /></label><label className={label}>Storage instructions<textarea rows={3} className={input} value={form.storageInstructions || ''} onChange={(e) => update('storageInstructions', e.target.value)} /></label></div>
            </div>
            <aside className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-sage/25 bg-white">{form.imageUrl && <Image src={form.imageUrl} alt="Selected product" fill className="object-cover" />}</div>
              <label className={label}>Product image<select required className={input} value={form.imageUrl} onChange={(e) => update('imageUrl', e.target.value)}>{imageOptions.map((image) => <option key={image} value={image}>{image.split('/').pop()}</option>)}</select></label>
              <div className="space-y-3 rounded-2xl bg-sage-soft/35 p-4 text-sm">
                <label className="flex items-center gap-3"><input type="checkbox" checked={form.isAvailable} onChange={(e) => update('isAvailable', e.target.checked)} />Available in store</label>
                <label className="flex items-center gap-3"><input type="checkbox" checked={form.isFeatured} onChange={(e) => update('isFeatured', e.target.checked)} />Featured product</label>
                <label className="flex items-center gap-3"><input type="checkbox" checked={form.isSamplePrice} onChange={(e) => update('isSamplePrice', e.target.checked)} />Price is a sample</label>
              </div>
              <p className="flex gap-2 text-xs text-botanicalText/65"><Archive className="h-4 w-4 shrink-0" />Archive ordered products by turning off availability instead of deleting them.</p>
            </aside>
          </div>
          {message && <p className="mt-5 text-sm text-terracotta">{message}</p>}
          <div className="mt-7 flex justify-end gap-3"><button type="button" onClick={() => setOpen(false)} className="rounded-full border border-sage/30 px-5 py-3 text-sm">Cancel</button><button disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"><Save className="h-4 w-4" />{busy ? 'Saving…' : 'Save product'}</button></div>
        </form>
      </div>}
    </div>
  );
}
