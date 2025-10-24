import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Product } from "./src/types/Product";
import { ProductListScreen } from "./src/screens/ProductListScreen";
import { ProductDetailScreen } from "./src/screens/ProductDetailScreen";
import { ProductFormScreen } from "./src/screens/ProductFormScreen";

type ScreenType = "list" | "detail" | "form";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("list");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // const handleNavigate = (
  //   screen: ScreenType,
  //   product: Product | null = null
  // ) => {
  //   setCurrentScreen(screen);
  //   setSelectedProduct(product);
  // };

  // const handleRefresh = () => {
  //   setRefreshKey((prev) => prev + 1);
  // };

  const handleNavigate = (
    screen: ScreenType,
    product: Product | null = null
  ) => {
    setCurrentScreen(screen);
    setSelectedProduct(product);
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <View style={styles.app}>
      {currentScreen === "list" && (
        <ProductListScreen key={refreshKey} onNavigate={handleNavigate} />
      )}
      {currentScreen === "detail" && selectedProduct && (
        <ProductDetailScreen
          product={selectedProduct}
          onNavigate={handleNavigate}
          onRefresh={handleRefresh}
        />
      )}
      {currentScreen === "form" && (
        <ProductFormScreen
          product={selectedProduct}
          onNavigate={handleNavigate}
          onRefresh={handleRefresh}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
});
