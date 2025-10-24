import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Product } from "../types/Product";

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

const replaceLocalhostWithIp = (url: any) => {
  return url.replace("127.0.0.1", "172.20.10.2");
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
}) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
    <Image
      source={{
        uri: replaceLocalhostWithIp(`http://127.0.0.1:5000${product.image}`),
      }}
      style={styles.cardImage}
      resizeMode="cover"
    />
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle} numberOfLines={2}>
        {product.name}
      </Text>
      <Text style={styles.cardCategory}>{product.category}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.cardPrice}>${product.price.toFixed(2)}</Text>
        <View
          style={[
            styles.stockBadge,
            { backgroundColor: product.inStock ? "#10b981" : "#ef4444" },
          ]}
        >
          <Text style={styles.stockText}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#e5e7eb",
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  cardCategory: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3b82f6",
  },
  stockBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  stockText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
