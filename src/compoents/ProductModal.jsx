import React, { useState, useEffect } from "react";
import "../styles/Modal.css";

const ProductModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [form, setForm] = useState({
    title: "",
    price: "",
    quantity: "",
    category: "",
    ratingsAverage: "",
    description: ""
  });

  const [colors, setColors] = useState([]);
  const [colorInput, setColorInput] = useState("");

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (initialData) {
      const { title, price, quantity, category, ratingsAverage, description, images, colors } = initialData;
      setForm({ title, price, quantity, category, ratingsAverage, description });
      setColors(colors || []);
      setImagePreviews(images || []);
    } else {
      setForm({
        title: "",
        price: "",
        quantity: "",
        category: "",
        rating: "",
        description: ""
      });
      setColors([]);
      setImagePreviews([]);
    }
    setImageFiles([]);
    setColorInput("");
  }, [initialData]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleAddColor = () => {
    if (colorInput && !colors.includes(colorInput.trim())) {
      setColors([...colors, colorInput.trim()]);
      setColorInput("");
    }
  };

  const handleRemoveColor = (colorToRemove) => {
    setColors(colors.filter((color) => color !== colorToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    colors.forEach((color) => {
      formData.append("colors", color);
    });

    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    await onSave(formData, !!initialData, initialData?._id);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{initialData ? "Edit Product" : "Add Product"}</h2>
        <form onSubmit={handleSubmit}>
          {["title", "price", "quantity", "category", "ratingsAverage", "description"].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field}
              value={form[field]}
              onChange={handleChange}
              required
            />
          ))}

          
          <div style={{ marginTop: "10px" }}>
            <input
              type="text"
              placeholder="Add color"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
            />
            <button type="button" onClick={handleAddColor} style={{ marginLeft: "5px" }}>
              Add Color
            </button>
          </div>

          
          <div>
              {colors.map((color, index) => (
                <div key={index} className="color-entry">
                  <span style={{ color }}>{color}</span>
                  <button type="button" onClick={() => handleRemoveColor(color)}>
                    &times;
                  </button>
                </div>
              ))}
            </div>


          {/* Image Upload */}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            required={!initialData}
            style={{ marginTop: "10px" }}
          />

          {/* Image Preview */}
          {imagePreviews.length > 0 && (
            <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "4px" }}
                />
              ))}
            </div>
          )}

          <div className="modal-actions">
            <button type="submit" className="save">Save</button>
            <button className="cancel" type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
