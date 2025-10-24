import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Product, ProductFormData } from "../types/Product";
import { api } from "../services/api";
import * as ImagePicker from "expo-image-picker";

interface ProductFormScreenProps {
  product?: Product | null;
  onNavigate: (screen: string, product?: Product | null) => void;
  onRefresh: () => void;
}

export const ProductFormScreen: React.FC<ProductFormScreenProps> = ({
  product,
  onNavigate,
  onRefresh,
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    _id: product?._id || "",
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    category: product?.category || "",
    image: product?.image || "",
    inStock: product?.inStock ?? true,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductFormData, string>>
  >({});
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<any>(null); // store selected image

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (
      !formData.price ||
      isNaN(Number(formData.price)) ||
      parseFloat(formData.price) <= 0
    ) {
      newErrors.price = "Valid price is required";
    }
    if (!formData.category.trim()) newErrors.category = "Category is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const requestPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "We need permission to access your photos to upload images."
        );
        return false;
      }
      return true;
    }
    return true;
  };

  const handleChooseImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      // result.assets[0] contains the selected image
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("price", parseFloat(formData.price));
      form.append("category", formData.category);
      form.append("inStock", formData.inStock.toString());

      if (image) {
        const uriParts = image.uri.split(".");
        const fileType = uriParts[uriParts.length - 1];

        form.append("image", {
          uri: image.uri,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }

      if (product) {
        await api.updateProduct(product._id, form);
        Alert.alert("Success", "Product updated successfully");
      } else {
        await api.createProduct(form);
        Alert.alert("Success", "Product created successfully");
      }

      onRefresh();
      onNavigate("list");
    } catch (err) {
      Alert.alert("Error", (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate("list")}
        >
          <Text style={styles.backButtonText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {product ? "Edit Product" : "Add Product"}
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.formContainer}
      >
        <ScrollView style={styles.formContent}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Name *</Text>
            <TextInput
              style={[styles.formInput, errors.name && styles.formInputError]}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter product name"
              placeholderTextColor="#9ca3af"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Description</Text>
            <TextInput
              style={[styles.formInput, styles.formTextArea]}
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
              placeholder="Enter product description"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Price *</Text>
            <TextInput
              style={[styles.formInput, errors.price && styles.formInputError]}
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
              placeholder="0.00"
              placeholderTextColor="#9ca3af"
              keyboardType="decimal-pad"
            />
            {errors.price && (
              <Text style={styles.errorText}>{errors.price}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Category *</Text>
            <TextInput
              style={[
                styles.formInput,
                errors.category && styles.formInputError,
              ]}
              value={formData.category}
              onChangeText={(text) =>
                setFormData({ ...formData, category: text })
              }
              placeholder="Enter category"
              placeholderTextColor="#9ca3af"
            />
            {errors.category && (
              <Text style={styles.errorText}>{errors.category}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#3b82f6" }]}
              onPress={handleChooseImage}
            >
              <Text style={styles.actionButtonText}>
                {image ? "Change Image" : "Select Image"}
              </Text>
            </TouchableOpacity>

            {image && (
              <Text style={{ marginTop: 8, color: "#374151" }}>
                Selected: {image.uri.split("/").pop()}
              </Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <View style={styles.switchRow}>
              <Text style={styles.formLabel}>In Stock</Text>
              <Switch
                value={formData.inStock}
                onValueChange={(value) =>
                  setFormData({ ...formData, inStock: value })
                }
                trackColor={{ false: "#d1d5db", true: "#93c5fd" }}
                thumbColor={formData.inStock ? "#3b82f6" : "#f3f4f6"}
              />
            </View>
          </View>

          <View style={styles.formActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.submitButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.actionButtonText}>
                  {product ? "Update Product" : "Create Product"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
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
  formContainer: {
    flex: 1,
  },
  formContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
  },
  formInputError: {
    borderColor: "#ef4444",
  },
  formTextArea: {
    height: 100,
    paddingTop: 12,
  },
  errorText: {
    fontSize: 14,
    color: "#ef4444",
    marginTop: 4,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  formActions: {
    marginTop: 20,
    marginBottom: 40,
  },
  actionButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  submitButton: {
    backgroundColor: "#10b981",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
