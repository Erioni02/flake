import { useCallback, useState } from "react";
import { AnimatePresence } from "motion/react";
import type { Color, Product } from "./data/products";
import { LoadingScreen } from "./components/LoadingScreen";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Collection } from "./components/Collection";
import { Campaign } from "./components/Campaign";
import { About } from "./components/About";
import { OrderInfo } from "./components/OrderInfo";
import { Footer } from "./components/Footer";
import { ProductViewer } from "./components/ProductViewer";

interface ViewerState {
  product: Product;
  color: Color;
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [viewer, setViewer] = useState<ViewerState | null>(null);

  const finishLoading = useCallback(() => setLoading(false), []);
  const openProduct = useCallback((product: Product, color: Color) => setViewer({ product, color }), []);
  const closeProduct = useCallback(() => setViewer(null), []);

  return (
    <>
      <AnimatePresence>{loading && <LoadingScreen key="loader" onDone={finishLoading} />}</AnimatePresence>

      <div className="grain" aria-hidden="true" />
      <Navbar />

      <main inert={loading || undefined}>
        <Hero ready={!loading} />
        <Collection onOpen={openProduct} />
        <Campaign />
        <About />
        <OrderInfo />
      </main>
      <Footer />

      <AnimatePresence>
        {viewer && (
          <ProductViewer
            key={viewer.product.id}
            product={viewer.product}
            initialColor={viewer.color}
            onClose={closeProduct}
          />
        )}
      </AnimatePresence>
    </>
  );
}
