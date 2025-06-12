import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "../Types/TypesFormStyle.module.css";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchingUpdateCategory } from "../../Api/fetchingData/FetchUpdateCategory";

const UpdateCategory = ({ onClose, category }) => {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [formData, setFormData] = useState({
    name: "",
    status: "available",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        status: category.status || "available",
        image: category.image || null,
        id: category.id,
      });

      // ✅ استرجاع الصورة الأصلية من السيرفر
      if (category.image) {
        setPreviewImage(`${import.meta.env.VITE_API_IMG_BASE_URL}/${category.image}`);
      }
    }
  }, [category]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const mutation = useMutation({
    mutationFn: async ({ id, ...updatedData }) => {
      const form = new FormData();
      form.append("name", updatedData.name);
      form.append("status", updatedData.status);
      form.append("_method", "PUT"); // ✅ ضروري
      if (updatedData.image instanceof File) {
        form.append("image", updatedData.image);
      }

      return await fetchingUpdateCategory(id, form);
    },

    onMutate: async () => {
      await queryClient.cancelQueries(["categories"]);
      const previousData = queryClient.getQueryData(["categories"]);
      return { previousData };
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      
    },

    onError: (_error, _updatedCategory, context) => {
      queryClient.setQueryData(["categories"], context.previousData);
      setError(t("errors.update_category_failed"));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name) {
      setError(t("errors.fill_all_fields"));
      return;
    }

    mutation.mutate(formData);
    onClose();
  };

  return (
    <div className={styles.addCategoryModal} dir={isRTL ? "rtl" : "ltr"}>
      <form className={styles.addCategoryForm} onSubmit={handleSubmit}>
        <p className={styles.formTitle}>{t("categories.edit_category")}</p>
        {error && <span className={styles.errorMessage}>{error}</span>}

        <div className={styles.formGroup}>
          <input
            type="text"
            placeholder={t("categories.enter_category_name")}
            value={formData.name}
            name="name"
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
        </div>

        <div className={styles.formGroup}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.fileInput}
            id="fileUpload"
            name="image"
          />
          <label htmlFor="fileUpload" className={styles.fileUploadLabel}>
            {previewImage ? (
                
              <img
                src={`${previewImage}`}
                alt="Preview"
                className={styles.imagePreview}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            ) : (
              <span>{t("common.click_to_upload")}</span>
            )}
          </label>
        </div>

        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.submitButton}>
            {t("categories.update_category")}
          </button>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
          >
            {t("common.cancel")}
          </button>
        </div>
      </form>
    </div>
  );
};

UpdateCategory.propTypes = {
  onClose: PropTypes.func.isRequired,
  category: PropTypes.object.isRequired,
};

export default UpdateCategory;
