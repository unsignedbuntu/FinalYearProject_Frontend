interface ProductDescriptionProps {
    product: Product;
    supplier: ProductSupplier;  // supplier bilgisi ekledik
  }
  
  export default function ProductDescription({ product, supplier }: ProductDescriptionProps) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
              {supplier?.supplierName?.[0] || 'S'}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">{supplier?.supplierName || 'Store Name'}</h3>
              <div className="flex items-center">
                {/* ... yıldız rating sistemi ... */}
              </div>
            </div>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Follow Store
          </button>
        </div>
        {/* ... diğer description içeriği ... */}
      </div>
    );
  }