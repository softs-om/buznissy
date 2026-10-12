import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ImagePlus, Plus, X } from "lucide-react";
import { useBusiness } from "../context/useBusiness";
import {
  getCategories,
  getProducts,
  createProduct,
  updateProduct,
} from "../services/api";

function CreateProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const editCategoryId = searchParams.get("categoryId");
  const editing = Boolean(id);
  const { activeBusiness } = useBusiness();
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [images, setImages] = useState([]);

  const [basePrice, setBasePrice] = useState("");
  const [baseStock, setBaseStock] = useState("");

  const [options, setOptions] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      if (!activeBusiness?.id) return;

      try {
        const response = await getCategories(activeBusiness.id);

        console.log("CATEGORIES RESPONSE:", response.data);

        const list = response.data?.categories || response.data || [];
        setCategories(list);
      } catch (error) {
        console.error("Could not load categories:", error);
        setCategories([]);
      }
    };

    loadCategories();
  }, [activeBusiness?.id]);
  const handleImages = (event) => {
    const files = Array.from(event.target.files || []);

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((current) => [...current, ...newImages]);
  };

  useEffect(() => {
    if (!editing || !editCategoryId) return;

    const loadProduct = async () => {
      try {
        const response = await getProducts(editCategoryId);

        const product = (response.data || []).find((item) => item.id === id);

        if (!product) {
          alert("Product could not be found.");
          return;
        }

        setCategoryId(product.categoryId || editCategoryId);
        setTitle(product.title || "");
        setDescription(product.description || "");

        setBasePrice(product.basePrice ?? "");
        setBaseStock(product.stock ?? "");

        setOptions(
          (product.variants || []).map((variant) => ({
            id: variant.id || crypto.randomUUID(),
            type: variant.name || "color",
            value: variant.value || "",
            imageNumber: variant.image || "",
            price: variant.price ?? "",
            stock: variant.stock ?? "",
          })),
        );

        setImages(
          (product.media || []).map((image) => ({
            id: image.id,
            file: null,
            preview: image.url,
            url: image.url,
            existing: true,
          })),
        );
      } catch (error) {
        console.error("Could not load product:", error);
        alert("Could not load product.");
      }
    };

    loadProduct();
  }, [editing, editCategoryId, id]);

  const removeImage = (index) => {
    setImages((current) => {
      const imageToRemove = current[index];

      if (imageToRemove?.preview) {
        URL.revokeObjectURL(imageToRemove.preview);
      }

      return current.filter((_, imageIndex) => imageIndex !== index);
    });

    // If an option was linked to this image,
    // remove the link because image numbering changes.
    setOptions((current) =>
      current.map((option) => ({
        ...option,
        imageNumber: "",
      })),
    );
  };

  const addOption = () => {
    setOptions((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        type: "color",
        value: "",
        imageNumber: "",
        price: "",
        stock: "",
      },
    ]);
  };

  const updateOption = (id, field, value) => {
    setOptions((current) =>
      current.map((option) =>
        option.id === id ? { ...option, [field]: value } : option,
      ),
    );
  };

  const removeOption = (id) => {
    setOptions((current) => current.filter((option) => option.id !== id));
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const productData = {
        title,
        description,
        categoryId,

        // Used only when the product has no variants
        basePrice: options.length === 0 ? basePrice : null,
        stock: options.length === 0 ? baseStock : null,

        // Convert frontend options -> backend variants
        variants: options.map((option) => ({
          name: option.type,
          value: option.value,
          price: option.price,
          stock: option.stock,
          image: option.imageNumber || null,
        })),

        // We'll connect real uploaded images later
        media: images
          .filter((image) => image.url)
          .map((image) => ({
            url: image.url,
            type: "IMAGE",
          })),

        guides: [],
        customFields: [],
      };

      console.log("Sending product:", productData);

      if (editing) {
        const response = await updateProduct(id, productData);

        console.log("Product updated:", response.data);

        alert("Product updated successfully!");
      } else {
        const response = await createProduct(productData);

        console.log("Product created:", response.data);

        alert("Product created successfully!");
      }

      navigate("/business/items");
    } catch (error) {
      console.error("Create product failed:", error);
      console.error("Backend response:", error.response?.data);

      alert(
        error.response?.data?.message ||
          "Failed to create product. Please try again.",
      );
    }
  };

  return (
    <main className="app-screen">
      <div className="app-page create-listing-page">
        {/* ================= HEADER ================= */}

        <header className="create-listing-header">
          <button
            type="button"
            className="icon-button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeft size={22} />
          </button>

          <div>
            <p className="section-eyebrow">PRODUCT</p>
            <h1>{editing ? "Edit product" : "Create product"}</h1>

            <p>
              {editing
                ? "Update your product information."
                : "Add a product to your store."}
            </p>
          </div>
        </header>

        <form className="create-listing-form" onSubmit={handleSubmit}>
          {/* ================= 1. PRODUCT INFORMATION ================= */}

          <section className="create-form-section">
            <div className="create-form-section-header">
              <div>
                <h2>Product information</h2>
                <p>Add the basic details customers will see.</p>
              </div>
            </div>

            <label className="create-form-field">
              <span>Product title</span>

              <input
                type="text"
                placeholder="e.g. Classic Abaya"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
            </label>

            <label className="create-form-field">
              <span>Description</span>

              <textarea
                placeholder="Describe your product..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
              />
            </label>

            <label className="create-form-field">
              <span>Category</span>

              <div className="product-form-field">
                <label htmlFor="product-category">Category</label>

                <select
                  id="product-category"
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                  required
                >
                  <option value="">Select category</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </label>
          </section>

          {/* ================= 2. PRODUCT IMAGES ================= */}

          <section className="create-form-section">
            <div className="create-form-section-header">
              <div>
                <h2>Product images</h2>
                <p>
                  Add product photos. Each image will be numbered so you can
                  connect it to an option.
                </p>
              </div>
            </div>

            <label className="product-image-upload">
              <ImagePlus size={24} />

              <strong>Add images</strong>

              <small>Upload clear photos of your product.</small>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImages}
                hidden
              />
            </label>

            {images.length > 0 && (
              <div className="product-image-grid">
                {images.map((image, index) => (
                  <div
                    className="product-image-preview"
                    key={image.id || image.file?.name || index}
                  >
                    <img src={image.preview} alt={`Product ${index + 1}`} />

                    <span className="product-image-number">{index + 1}</span>

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      aria-label={`Remove image ${index + 1}`}
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ================= 3. PRICING / OPTIONS / STOCK ================= */}

          <section className="create-form-section">
            <div className="create-form-section-header">
              <div>
                <h2>Pricing & warehouse</h2>
                <p>Set the product price and available warehouse stock.</p>
              </div>
            </div>

            {/* NO OPTIONS */}

            {options.length === 0 && (
              <div className="product-option-row">
                <label className="create-form-field">
                  <span>Price</span>

                  <div className="product-price-input">
                    <input
                      type="number"
                      min="0"
                      step="0.001"
                      placeholder="0.000"
                      value={basePrice}
                      onChange={(event) => setBasePrice(event.target.value)}
                    />

                    <span>OMR</span>
                  </div>
                </label>

                <label className="create-form-field">
                  <span>Warehouse stock</span>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={baseStock}
                    onChange={(event) => setBaseStock(event.target.value)}
                  />
                </label>
              </div>
            )}

            {/* OPTIONS */}

            {options.length > 0 && (
              <div className="product-options-list">
                {options.map((option, index) => (
                  <div className="product-option-card" key={option.id}>
                    <div className="product-option-top">
                      <div>
                        <strong>Option {index + 1}</strong>
                        <small>Set its value, image, price and stock.</small>
                      </div>

                      <button
                        type="button"
                        className="product-option-remove"
                        onClick={() => removeOption(option.id)}
                        aria-label={`Remove option ${index + 1}`}
                      >
                        <X size={17} />
                      </button>
                    </div>

                    <div className="product-option-row">
                      <label className="create-form-field">
                        <span>Option type</span>

                        <select
                          value={option.type}
                          onChange={(event) =>
                            updateOption(option.id, "type", event.target.value)
                          }
                        >
                          <option value="color">Color</option>
                          <option value="text">Text</option>
                        </select>
                      </label>

                      <label className="create-form-field">
                        <span>
                          {option.type === "color" ? "Color" : "Option name"}
                        </span>

                        <input
                          type="text"
                          placeholder={
                            option.type === "color"
                              ? "e.g. Black"
                              : "e.g. Large"
                          }
                          value={option.value}
                          onChange={(event) =>
                            updateOption(option.id, "value", event.target.value)
                          }
                        />
                      </label>
                    </div>

                    <label className="create-form-field">
                      <span>Linked image</span>

                      <select
                        value={option.imageNumber}
                        onChange={(event) =>
                          updateOption(
                            option.id,
                            "imageNumber",
                            event.target.value,
                          )
                        }
                      >
                        <option value="">Select image</option>

                        {images.map((_, imageIndex) => (
                          <option key={imageIndex} value={imageIndex + 1}>
                            Image {imageIndex + 1}
                          </option>
                        ))}
                      </select>

                      {images.length === 0 && (
                        <small>
                          Upload product images first to link an image.
                        </small>
                      )}
                    </label>

                    <div className="product-option-row">
                      <label className="create-form-field">
                        <span>Price</span>

                        <div className="product-price-input">
                          <input
                            type="number"
                            min="0"
                            step="0.001"
                            placeholder="0.000"
                            value={option.price}
                            onChange={(event) =>
                              updateOption(
                                option.id,
                                "price",
                                event.target.value,
                              )
                            }
                          />

                          <span>OMR</span>
                        </div>
                      </label>

                      <label className="create-form-field">
                        <span>Warehouse stock</span>

                        <input
                          type="number"
                          min="0"
                          step="1"
                          placeholder="0"
                          value={option.stock}
                          onChange={(event) =>
                            updateOption(option.id, "stock", event.target.value)
                          }
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              className="product-add-button"
              onClick={addOption}
            >
              <Plus size={18} />
              Add option
            </button>

            <p className="create-form-help">
              Add options when the product has variations such as different
              colors or sizes. Each option can have its own price and warehouse
              quantity.
            </p>
          </section>

          {/* ================= ACTIONS ================= */}

          <div className="create-form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>

            <button type="submit" className="primary-button">
              {editing ? "Save changes" : "Create product"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default CreateProduct;
