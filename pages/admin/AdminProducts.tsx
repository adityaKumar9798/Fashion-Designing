
import React, { useState, useEffect } from 'react';
import { dbService } from '../../firebase';
import { Product } from '../../types';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Gowns',
    imageUrl: '',
    description: '',
    sizes: ['S', 'M', 'L'],
    featured: false
  });

  const categories = ['Gowns', 'Occasion', 'Casual', 'Formal', 'Party', 'Traditional'];
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const loadProducts = async () => {
    try {
      const data = await dbService.getProducts();
      setProducts(data.sort((a, b) => b.createdAt - a.createdAt));
    } catch (err) {
      setError('Failed to load products');
    }
  };

  useEffect(() => { 
    loadProducts();
    
    // Set up real-time listener
    const unsubscribe = dbService.onProductsChange((updatedProducts) => {
      setProducts(updatedProducts.sort((a, b) => b.createdAt - a.createdAt));
    });
    
    return () => unsubscribe();
  }, []);

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Product name is required');
      return false;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError('Valid price is required');
      return false;
    }
    if (!formData.category) {
      setError('Category is required');
      return false;
    }
    if (!formData.imageUrl.trim()) {
      setError('Image URL is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (formData.sizes.length === 0) {
      setError('At least one size must be selected');
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: 'Gowns',
      imageUrl: '',
      description: '',
      sizes: ['S', 'M', 'L'],
      featured: false
    });
    setEditingProduct(null);
    setError('');
    setSuccess('');
    setImagePreview(null);
    setUploading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await dbService.addProduct({
        ...formData,
        price: Number(formData.price),
        featured: formData.featured
      });
      setSuccess('Product added successfully!');
      resetForm();
      setShowAdd(false);
    } catch (err) {
      setError('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!editingProduct || !validateForm()) return;

    setLoading(true);
    try {
      await dbService.updateProduct(editingProduct.id, {
        ...formData,
        price: Number(formData.price),
        featured: formData.featured
      });
      setSuccess('Product updated successfully!');
      resetForm();
      setShowAdd(false);
    } catch (err) {
      setError('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      try {
        await dbService.deleteProduct(id);
        setSuccess('Product deleted successfully!');
      } catch (err) {
        setError('Failed to delete product');
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      imageUrl: product.imageUrl,
      description: product.description,
      sizes: product.sizes,
      featured: product.featured || false
    });
    setShowAdd(true);
    setError('');
    setSuccess('');
  };

  const toggleSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit for base64
      setError('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setImagePreview(base64String);
        setFormData(prev => ({ ...prev, imageUrl: base64String }));
        setSuccess('Image uploaded successfully!');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Failed to upload image');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-serif">Product Management</h1>
            <p className="text-zinc-400 text-xs uppercase tracking-widest mt-2">Manage your dress inventory</p>
          </div>
          <button 
            onClick={() => {
              setShowAdd(!showAdd);
              if (!showAdd) resetForm();
            }}
            className="bg-zinc-900 text-white px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-zinc-800 transition-all"
          >
            {showAdd ? 'Cancel' : 'Add New Product'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 text-[10px] tracking-widest uppercase mb-8 border border-red-100">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 p-4 text-[10px] tracking-widest uppercase mb-8 border border-green-100">
            {success}
          </div>
        )}

        {showAdd && (
          <div className="bg-white p-8 md:p-12 border border-zinc-200 mb-12 shadow-sm">
            <h2 className="text-2xl font-serif mb-8">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={editingProduct ? handleUpdate : handleAdd} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-zinc-400">Product Name</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="w-full border-b border-zinc-200 py-3 outline-none bg-transparent focus:border-zinc-900 transition-all"
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-zinc-400">Price (₹)</label>
                  <input 
                    required 
                    type="number" 
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: e.target.value})} 
                    className="w-full border-b border-zinc-200 py-3 outline-none bg-transparent focus:border-zinc-900 transition-all"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-zinc-400">Category</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full border-b border-zinc-200 py-3 outline-none bg-transparent focus:border-zinc-900 transition-all"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-zinc-400">Product Image</label>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-zinc-300 rounded-lg p-6 text-center hover:border-zinc-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="space-y-2">
                        <svg className="mx-auto h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <div className="text-sm text-zinc-600">
                          <span className="font-medium text-zinc-900">Click to upload</span> or drag and drop
                        </div>
                        <p className="text-xs text-zinc-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </label>
                  </div>
                  
                  {uploading && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        <span className="text-sm text-blue-600">Uploading image...</span>
                      </div>
                    </div>
                  )}
                  
                  {(formData.imageUrl || imagePreview) && (
                    <div className="mt-4">
                      <p className="text-xs font-bold uppercase tracking-widest mb-2 text-zinc-400">Image Preview</p>
                      <div className="relative inline-block">
                        <img 
                          src={imagePreview || formData.imageUrl} 
                          alt="Product preview" 
                          className="h-32 w-32 object-cover rounded border border-zinc-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({...formData, imageUrl: ''});
                            setImagePreview(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs text-zinc-500">
                    <p>Or enter image URL manually:</p>
                    <input 
                      type="url" 
                      value={formData.imageUrl} 
                      onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
                      className="w-full border-b border-zinc-200 py-2 outline-none bg-transparent focus:border-zinc-900 transition-all text-xs"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-zinc-400">Description</label>
                <textarea 
                  required 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  className="w-full border-b border-zinc-200 py-3 outline-none bg-transparent focus:border-zinc-900 transition-all resize-none"
                  rows={4}
                  placeholder="Enter product description"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-4 text-zinc-400">Available Sizes</label>
                <div className="flex flex-wrap gap-4">
                  {availableSizes.map(size => (
                    <label key={size} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.sizes.includes(size)}
                        onChange={() => toggleSize(size)}
                        className="mr-2"
                      />
                      <span className="text-sm">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={e => setFormData({...formData, featured: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Featured Product</span>
                </label>
              </div>

              <div className="flex gap-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-zinc-900 text-white px-12 py-4 text-xs font-bold tracking-widest uppercase hover:bg-zinc-800 transition-all disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Save Product')}
                </button>
                <button 
                  type="button"
                  onClick={resetForm}
                  className="border border-zinc-200 px-12 py-4 text-xs font-bold tracking-widest uppercase hover:border-zinc-900 transition-all"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white border border-zinc-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  <th className="p-6 text-xs font-bold uppercase tracking-widest text-zinc-400">Product</th>
                  <th className="p-6 text-xs font-bold uppercase tracking-widest text-zinc-400">Category</th>
                  <th className="p-6 text-xs font-bold uppercase tracking-widest text-zinc-400">Price</th>
                  <th className="p-6 text-xs font-bold uppercase tracking-widest text-zinc-400">Sizes</th>
                  <th className="p-6 text-xs font-bold uppercase tracking-widest text-zinc-400">Status</th>
                  <th className="p-6 text-xs font-bold uppercase tracking-widest text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b border-zinc-100 last:border-none hover:bg-zinc-50 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="h-16 w-16 object-cover rounded border border-zinc-200"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/64x64?text=No+Image';
                          }}
                        />
                        <div>
                          <div className="font-medium text-sm">{product.name}</div>
                          {product.featured && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Featured</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-sm">{product.category}</td>
                    <td className="p-6 text-sm font-medium">₹{product.price.toLocaleString('en-IN')}</td>
                    <td className="p-6">
                      <div className="flex flex-wrap gap-1">
                        {product.sizes.map(size => (
                          <span key={size} className="text-xs bg-zinc-100 px-2 py-1 rounded">{size}</span>
                        ))}
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        product.featured 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-zinc-100 text-zinc-600'
                      }`}>
                        {product.featured ? 'Active' : 'Standard'}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEdit(product)} 
                          className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)} 
                          className="text-xs font-bold text-red-500 uppercase tracking-widest hover:text-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {products.length === 0 && (
            <div className="p-12 text-center text-zinc-400 text-xs uppercase tracking-widest">
              No products found. Add your first product to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
