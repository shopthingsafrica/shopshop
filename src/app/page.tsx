export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[var(--primary)] text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Discover the Spirit of Africa
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Explore a curated selection of authentic crafts, fashion, and art from across the continent.
          </p>
          <button className="btn-secondary text-lg">
            Explore Now
          </button>
        </div>
      </section>

      {/* Featured Categories Preview */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[var(--primary)] mb-8">
            Featured Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["African Fashion", "Art & Sculptures", "Home Decor", "Gourmet Foods"].map((category) => (
              <div
                key={category}
                className="bg-[var(--muted)] rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="w-16 h-16 bg-[var(--secondary)] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl">🛍️</span>
                </div>
                <h3 className="font-semibold text-[var(--primary)]">{category}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[var(--accent)] text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Fresh Finds, Just For You
          </h2>
          <p className="mb-6 opacity-90">
            Be the first to explore our latest additions and trending products.
          </p>
          <button className="btn-primary bg-white text-[var(--accent)] hover:bg-gray-100">
            Shop New Arrivals
          </button>
        </div>
      </section>

      {/* Footer Preview */}
      <footer className="bg-[var(--primary)] text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-xl font-bold mb-2">ShopThings</h3>
          <p className="opacity-75">Connecting African creativity with global markets.</p>
          <p className="mt-4 text-sm opacity-50">© 2025 ShopThings. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
