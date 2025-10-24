import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Product } from "../types/Product";
import { api } from "../services/api";

interface ProductDetailScreenProps {
  product: Product;
  onNavigate: (screen: string, product?: Product | null) => void;
  onRefresh: () => void;
}

const replaceLocalhostWithIp = (url: any) => {
  return url.replace("127.0.0.1", "172.20.10.2");
};

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,
  onNavigate,
  onRefresh,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await api.deleteProduct(product._id);
              Alert.alert("Success", "Product deleted successfully");
              onRefresh();
              onNavigate("list");
            } catch (err) {
              Alert.alert("Error", (err as Error).message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate("list")}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        <Image
          source={{
            uri: replaceLocalhostWithIp(
              `http://127.0.0.1:5000${product.image}`
            ),
          }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.info}>
          <View style={styles.row}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{product.name}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>
              {product.description || "No description available"}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Price</Text>
            <Text style={styles.value}>${product.price.toFixed(2)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Category</Text>
            <Text style={styles.value}>{product.category}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Stock Status</Text>
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

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => onNavigate("form", product)}
            disabled={loading}
          >
            <Text style={styles.actionButtonText}>Edit Product</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.actionButtonText}>Delete Product</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
  {
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: "#3b82f6",
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  content: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 300,
    backgroundColor: "#e5e7eb",
  },
  info: {
    padding: 20,
    backgroundColor: "#fff",
  },
  row: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
    fontWeight: "500",
  },
  value: {
    fontSize: 16,
    color: "#111827",
  },
  stockBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  stockText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  actionButtons: {
    padding: 20,
  },
  actionButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    marginBottom: 12,
  },
  editButton: {
    backgroundColor: "#3b82f6",
  },
  deleteButton: {
    backgroundColor: "#ef4444",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
