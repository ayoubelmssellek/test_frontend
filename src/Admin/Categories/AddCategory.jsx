import { useState } from "react";
import PropTypes from "prop-types";
import styles from "../Types/TypesFormStyle.module.css";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchingAddCategory } from "../../Api/fetchingData/FetchAddCategory";

const AddCategory = ({ onClose }) => {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [formData, setFormData] = useState({
    name: "",
    image: null,
  });

  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const mutation = useMutation({
    mutationFn: fetchingAddCategory,

    onMutate: async (newCategory) => {
      await queryClient.cancelQueries(["categories"]);
      const previousCategories = queryClient.getQueryData(["categories"]);

      const tempCategory = {
        ...newCategory,
        tempId: Date.now(),
      };

      queryClient.setQueryData(["categories"], (old = []) => [...old, tempCategory]);
      return { previousCategories, tempId: tempCategory.tempId };
    },

    onSuccess: () => {
        queryClient.invalidateQueries(["categories"]);
    },

    onError: (_error, _newCategory, context) => {
      queryClient.setQueryData(["categories"], context.previousCategories);
      setError(t("errors.add_category_failed"));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.image) {
      setError(t("errors.fill_all_fields"));
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name.trim());
    formDataToSend.append("image", formData.image);

    mutation.mutate(formDataToSend);
    onClose();
  };

  return (
    <div className={styles.addCategoryModal} dir={isRTL ? "rtl" : "ltr"}>
      <form className={styles.addCategoryForm} onSubmit={handleSubmit}>
        <p className={styles.formTitle}>{t("categories.add_category")}</p>
        {error && <span className={styles.errorMessage}>{error}</span>}

        <div className={styles.formGroup}>
          <input
            type="text"
            placeholder={t("categories.enter_category_name")}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            {formData.image ? (
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Preview"
                className={styles.imagePreview}
                style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: '8px' }}
              />
            ) : (
              <span>{t("common.click_to_upload")}</span>
            )}
          </label>
        </div>

        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.submitButton}>
            {t("categories.add_category")}
          </button>
          <button type="button" className={styles.cancelButton} onClick={onClose}>
            {t("common.cancel")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;

AddCategory.propTypes = {
  onClose: PropTypes.func.isRequired,
};
