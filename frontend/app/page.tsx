"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Menu, X, Star, Package, User } from "lucide-react";
import { motion } from "framer-motion";
import SearchBar from "@/components/SearchBar";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { useCartStore } from "@/lib/store";
import toast from "react-hot-toast";
import { CategoryStorySection } from "@/components/marketing/CategoryStorySection";
import { PerformanceSection } from "@/components/marketing/PerformanceSection";
import { FeatureHighlightsSection } from "@/components/marketing/FeatureHighlightsSection";
import { TestimonialsSection } from "@/components/marketing/TestimonialsSection";
import { CTASection } from "@/components/marketing/CTASection";
import { FooterSection } from "@/components/marketing/FooterSection";

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  description?: string;
  category_slug?: string;
  category_name?: string;
  stock_quantity: number;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: "easeOut" } },
};

export default function HomePage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const { addItem, getItemCount } = useCartStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [highlightedProductId, setHighlightedProductId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, productsRes] = await Promise.all([api.get("/categories"), api.get("/products?limit=200")]);
      setCategories(categoriesRes.data || []);
      setProducts(productsRes.data?.products || []);
    } catch (error: any) {
      if (error.code === "ECONNREFUSED" || error.message?.includes("Network Error") || !error.response) {
        toast.error("Cannot reach server. Start the backend: npm run dev");
      } else {
        toast.error(error.response?.data?.error || "Failed to load products.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    if (!token) {
      toast.error("Please login to add items to cart");
      router.push("/login?redirect=/");
      return;
    }
    if (product.stock_quantity <= 0) {
      toast.error("Product out of stock");
      return;
    }
    addItem({
      product_id: product.id.toString(),
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });
    toast.success("Added to cart!");
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category_slug === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const productsByCategory = categories.reduce<Record<string, Product[]>>((acc, cat) => {
    acc[cat.slug] = products.filter((p) => p.category_slug === cat.slug);
    return acc;
  }, {});

  const showCategoryRows = selectedCategory === "all" && searchQuery.trim() === "";

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0f1115]/95 backdrop-blur-xl">
        <div className="max-w-content mx-auto px-4 pt-2 pb-2 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-end gap-3">
            <div className="w-auto flex items-end">
              <img
                src="/logo.png"
                alt="Express Distributors"
                className="h-[50px] md:h-[70px] w-auto drop-shadow-[0_0_24px_rgba(124,92,255,0.7)]"
              />
            </div>
          </Link>

          <div className="hidden md:flex flex-1 max-w-xl mx-6">
            <SearchBar
              onProductSelect={(product) => {
                setHighlightedProductId(product.id.toString());
                setTimeout(() => {
                  const element = document.getElementById(`product-${product.id}`);
                  element?.scrollIntoView({ behavior: "smooth", block: "center" });
                  setTimeout(() => setHighlightedProductId(null), 2000);
                }, 100);
              }}
            />
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button
              type="button"
              onClick={() => {
                if (!token) {
                  toast.error("Please login to view your cart");
                  router.push("/login?redirect=/store/cart");
                  return;
                }
                router.push("/store/cart");
              }}
              className="relative p-2 rounded-full hover:bg-white/5 transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5 text-slate-100" />
              {mounted && getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#7c5cff] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {getItemCount()}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                if (!token) {
                  toast.error("Please login to access your dashboard");
                  router.push("/login?redirect=/dashboard");
                  return;
                }
                router.push("/dashboard");
              }}
              className="p-2 rounded-full hover:bg-white/5 transition-colors"
              aria-label="Dashboard"
            >
              <User className="w-5 h-5 text-slate-100" />
            </button>

            {!token && (
              <Link
                href="/login"
                className="hidden md:inline text-xs md:text-sm text-slate-200 hover:text-white transition-colors font-semibold tracking-[0.16em] uppercase"
              >
                Login
              </Link>
            )}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
              {mobileMenuOpen ? <X className="w-6 h-6 text-slate-100" /> : <Menu className="w-6 h-6 text-slate-100" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#0f1115]/95 px-4 py-3">
            <SearchBar
              onProductSelect={(product) => {
                setHighlightedProductId(product.id.toString());
                setMobileMenuOpen(false);
                setTimeout(() => {
                  const element = document.getElementById(`product-${product.id}`);
                  element?.scrollIntoView({ behavior: "smooth", block: "center" });
                  setTimeout(() => setHighlightedProductId(null), 2000);
                }, 100);
              }}
            />
          </div>
        )}
      </header>

      {/* Image banner just below header */}
      <section className="px-4 md:px-6 pt-8 md:pt-10 mb-12">
        <div className="max-w-content mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-[0_26px_80px_rgba(0,0,0,0.85)]">
          <div className="relative h-[260px] sm:h-[320px] md:h-[380px] lg:h-[430px]">
            <img
              src="/warehouse-banner.jpg"
              alt="Express distribution warehouse"
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b0d10]/90 via-[#0b0d10]/70 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="px-6 md:px-10 space-y-3 md:space-y-4 max-w-xl">
                <p className="text-[0.7rem] md:text-xs tracking-[0.22em] text-slate-300/85 uppercase">
                  Modern wholesale distribution
                </p>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-50">
                  Your trusted distribution partner across categories.
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category scrollytelling (like /experience) */}
      <CategoryStorySection />

      {/* Products Grid / rails */}
      <section id="products" className="max-w-content mx-auto px-4 pt-16 pb-12 md:pt-20 md:pb-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : showCategoryRows ? (
          <div className="space-y-12">
            {categories.map((category) => {
              const list = productsByCategory[category.slug] || [];
              if (list.length === 0) return null;
              return (
                <div key={category.slug}>
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <h2 className="text-xl md:text-2xl font-semibold tracking-[0.16em] text-slate-50/95">
                        {category.name}
                      </h2>
                      {category.description && (
                        <p className="text-xs md:text-sm text-slate-400 mt-1 line-clamp-1">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/store/category/${category.slug}`}
                      className="text-[0.72rem] md:text-xs font-semibold text-slate-300 hover:text-white tracking-[0.22em] uppercase"
                    >
                      View all →
                    </Link>
                  </div>

                  <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
                    {list.slice(0, 16).map((product) => (
                      <div
                        id={`product-${product.id}`}
                        key={product.id}
                        className={`snap-start min-w-[190px] w-[190px] sm:min-w-[230px] sm:w-[230px] glass-panel border border-white/8 transition-all duration-300 overflow-hidden ${
                          highlightedProductId === product.id.toString() ? "ring-2 ring-[#7c5cff] scale-[1.02]" : ""
                        }`}
                      >
                        <div className="relative h-36 bg-gradient-to-br from-[#161925] to-[#0f1115] overflow-hidden">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-4xl text-slate-500 font-extrabold">
                                {product.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="font-semibold text-xs md:text-sm text-slate-50/95 line-clamp-2 min-h-[40px]">
                            {product.name}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-[#c7d2ff] font-semibold text-sm">
                              ${product.price.toFixed(2)}
                            </p>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="p-1.5 bg-[#7c5cff] text-white rounded-full hover:bg-[#6a4bff] transition-colors"
                              aria-label="Add to cart"
                            >
                              <ShoppingCart className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-[0.18em] text-slate-50/95">
                {selectedCategory === "all"
                  ? "All Products"
                  : categories.find((c) => c.slug === selectedCategory)?.name}
              </h2>
              <span className="text-slate-400 text-xs md:text-sm">
                {filteredProducts.length} products
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <div
                  id={`product-${product.id}`}
                  key={product.id}
                  className={`group glass-panel border border-white/10 hover:border-[#7c5cff88] transition-all duration-300 overflow-hidden ${
                    highlightedProductId === product.id.toString() ? "ring-2 ring-[#7c5cff] scale-[1.02] z-10" : ""
                  }`}
                >
                  <div className="relative h-64 bg-gradient-to-br from-[#181c27] to-[#0f1115] overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl text-slate-500 font-extrabold">
                          {product.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    {product.stock_quantity > 0 && product.stock_quantity <= 10 && (
                      <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Low Stock
                      </div>
                    )}
                    {product.stock_quantity === 0 && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Out of Stock
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock_quantity === 0}
                        className="glass-button glass-button-gradient text-xs md:text-sm text-white px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-[1.03] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </button>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-base md:text-lg text-slate-50/95 line-clamp-2 flex-1">
                        {product.name}
                      </h3>
                    </div>
                    {product.description && (
                      <p className="text-xs md:text-sm text-slate-400 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xl md:text-2xl font-semibold text-[#c7d2ff]">
                          ${product.price.toFixed(2)}
                        </p>
                        {product.stock_quantity > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                            <span className="text-xs text-slate-400">4.5</span>
                          </div>
                        )}
                      </div>
                      {product.stock_quantity > 0 && (
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="md:hidden p-3 bg-[#7c5cff] text-white rounded-full hover:bg-[#6a4bff] transition-colors shadow-lg"
                        >
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-200 text-lg mb-2">No products found</p>
            <p className="text-slate-400">Try a different category or search term</p>
          </div>
        )}
      </section>

      {/* Marketing / storytelling sections from experience page */}
      <PerformanceSection />
      <FeatureHighlightsSection />
      <TestimonialsSection />
      <CTASection />
      <FooterSection />
    </div>
  );
}
